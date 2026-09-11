# Watermark removal logic adapted from:
# https://github.com/guillaumemeyer/watermarks-remover
# Original © 2026 Guillaume Meyer and contributors — used under the MIT License.
# See ATTRIBUTION.md for full upstream license text.
#
# Thin FastAPI wrapper that exposes POST /remove (multipart) → cleaned file.
# Under the hood it shells out to the upstream `clean_file.py` script that
# runs in /app/scripts/ (copied into the image at build time).
#
# Visual watermark removal (added by Toolify):
#   For raster images we run an OpenCV-based inpainting pass that detects
#   visible text/logo overlays and fills them in with surrounding texture.
#   The original metadata stripper is preserved and runs first, so both layers
#   (provenance metadata + visual overlay) get cleaned in one shot.

from __future__ import annotations

import asyncio
import io
import logging
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Optional

import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import Response
from PIL import Image

# Lazy import cv2 — only loaded when image inpainting is actually used.
cv2 = None  # type: ignore


def _ensure_cv2():
    global cv2
    if cv2 is None:
        import cv2 as _cv2  # type: ignore
        cv2 = _cv2
    return cv2


# -----------------------------------------------------------------------------
# Config
# -----------------------------------------------------------------------------

VERSION = os.environ.get("WATERMARKS_VERSION", "1.0.0-toolify")
MAX_BYTES = int(os.environ.get("WATERMARKS_MAX_BYTES", str(50 * 1024 * 1024)))
SCRIPTS_DIR = Path(os.environ.get("WATERMARKS_SCRIPTS_DIR", "/app/scripts"))
CLEAN_SCRIPT = SCRIPTS_DIR / "clean_file.py"
SCRIPT_TIMEOUT = int(os.environ.get("WATERMARKS_TIMEOUT", "120"))
VISUAL_MODE = os.environ.get("WATERMARKS_VISUAL_MODE", "auto").lower()
INPAINT_RADIUS = max(1, int(os.environ.get("WATERMARKS_INPAINT_RADIUS", "3")))
MASK_MIN_AREA = max(10, int(os.environ.get("WATERMARKS_MASK_MIN_AREA", "20")))
MASK_MAX_AREA_RATIO = max(0.01, min(0.5, float(os.environ.get("WATERMARKS_MASK_MAX_AREA_RATIO", "0.2"))))

logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "info").upper(),
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger("watermark-remover")

# -----------------------------------------------------------------------------
# App
# -----------------------------------------------------------------------------

app = FastAPI(
    title="Toolify Watermark Remover",
    version=VERSION,
    description=(
        "Strip AI-provenance metadata (C2PA / SynthID / EXIF / XMP / doc props) "
        "and remove VISIBLE watermarks / logo overlays from images. "
        "Logic adapted from guillaumemeyer/watermarks-remover + OpenCV inpainting."
    ),
)


def which_or_none(name: str) -> Optional[str]:
    return shutil.which(name)


@app.get("/health")
async def health():
    cv_ready = False
    try:
        _ensure_cv2()
        cv_ready = True
    except Exception:
        cv_ready = False
    return {
        "ok": True,
        "version": VERSION,
        "scripts_dir": str(SCRIPTS_DIR),
        "clean_script_present": CLEAN_SCRIPT.exists(),
        "visual_mode": VISUAL_MODE,
        "opencv_ready": cv_ready,
        "deps": {
            "exiftool": bool(which_or_none("exiftool")),
            "qpdf": bool(which_or_none("qpdf")),
            "ghostscript": bool(which_or_none("ghostscript")),
        },
    }


@app.get("/capabilities")
async def capabilities():
    return {
        "image": ["png", "jpg", "jpeg", "webp", "avif", "heic", "heif", "bmp", "gif", "tiff", "tif"],
        "container": ["pdf", "svg", "docx", "xlsx", "pptx", "odt", "epub", "html", "md"],
        "max_bytes": MAX_BYTES,
        "visual_watermark_removal": {
            "supported": True,
            "mode": VISUAL_MODE,
            "method": (
                "Edge density (Canny + connected components + heavy "
                "morphological closing to capture full text body) + "
                "OpenCV NS inpainting"
            ),
            "inpaint_radius": INPAINT_RADIUS,
        },
    }


# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------

_ALLOWED_EXTS = {
    ".png", ".jpg", ".jpeg", ".webp", ".avif", ".heic", ".heif",
    ".bmp", ".gif", ".tiff", ".tif",
    ".pdf", ".svg", ".docx", ".xlsx", ".pptx", ".odt", ".epub",
    ".html", ".md",
}
_IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff", ".tif"}


def _run_clean(input_path: Path, output_path: Path) -> tuple[int, str]:
    """Run upstream clean_file.py for metadata removal."""
    if not CLEAN_SCRIPT.exists():
        return 127, f"clean_file.py not found at {CLEAN_SCRIPT}"
    cmd = [sys.executable, str(CLEAN_SCRIPT), str(input_path), "-o", str(output_path)]
    try:
        proc = subprocess.run(
            cmd, capture_output=True, text=True, timeout=SCRIPT_TIMEOUT,
            cwd=str(SCRIPTS_DIR),
        )
    except subprocess.TimeoutExpired:
        return 124, f"clean_file.py timed out after {SCRIPT_TIMEOUT}s"
    except Exception as e:
        return 1, f"failed to spawn clean_file.py: {e}"
    combined = (proc.stdout or "") + (proc.stderr or "")
    if proc.returncode != 0:
        log.warning("clean_file.py exit=%s %s", proc.returncode, combined[:300])
    return proc.returncode, combined


def _to_cv(img: Image.Image):
    """PIL RGB/RGBA → cv2 BGR/BGRA."""
    cv = _ensure_cv2()
    arr = np.array(img)
    if img.mode == "RGB":
        return cv.cvtColor(arr, cv.COLOR_RGB2BGR)
    if img.mode == "RGBA":
        return cv.cvtColor(arr, cv.COLOR_RGBA2BGRA)
    if img.mode == "L":
        return arr
    return cv.cvtColor(np.array(img.convert("RGB")), cv.COLOR_RGB2BGR)


def _to_pil(arr) -> Image.Image:
    """cv2 BGR/RGBA → PIL RGB/RGBA."""
    cv = _ensure_cv2()
    if arr.ndim == 2:
        return Image.fromarray(arr, mode="L")
    if arr.shape[2] == 3:
        return Image.fromarray(cv.cvtColor(arr, cv.COLOR_BGR2RGB))
    if arr.shape[2] == 4:
        return Image.fromarray(cv.cvtColor(arr, cv.COLOR_BGRA2RGBA))
    raise ValueError(f"unexpected channel count: {arr.shape}")


# -----------------------------------------------------------------------------
# Visual watermark detector
# -----------------------------------------------------------------------------

def _build_watermark_mask(bgr) -> tuple[np.ndarray, dict]:
    """
    Detect visible watermark regions using a hybrid approach:

    Strategy A (rectangular overlays):
      - Find rectangles in the Canny edge map using approxPolyDP
      - For each candidate rect, check if the interior is smooth (low Laplacian var)
      - Add the full rectangle interior to the mask

    Strategy B (text overlays):
      - Canny edges → connected components
      - Filter by aspect ratio + area
      - Heavy morphological CLOSE to fill letter bodies
      - Mild dilation for safety margin

    The union of A + B is returned.
    """
    cv = _ensure_cv2()
    h, w = bgr.shape[:2]
    total = h * w

    gray = cv.cvtColor(bgr, cv.COLOR_BGR2GRAY) if bgr.ndim == 3 else bgr.copy()
    blurred = cv.GaussianBlur(gray, (3, 3), 0)
    edges = cv.Canny(blurred, 60, 180)  # lowered thresholds for subtle edges

    # --- Strategy A: rectangular overlay detection -----------------------
    rect_mask = np.zeros((h, w), dtype=np.uint8)
    try:
        contours, _ = cv.findContours(edges, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
        for cnt in contours:
            if len(cnt) < 4:
                continue
            peri = cv.arcLength(cnt, True)
            approx = cv.approxPolyDP(cnt, 0.03 * peri, True)
            if len(approx) != 4:
                continue
            x, y, rw, rh = cv.boundingRect(approx)
            area_rect = rw * rh
            if area_rect < 1000 or area_rect > int(total * MASK_MAX_AREA_RATIO):
                continue
            aspect = rw / max(rh, 1)
            if aspect < 0.3 or aspect > 10:
                continue
            # Interior Laplacian: smooth interior = overlay bar (watermark bg)
            interior = gray[y + 3 : y + rh - 3, x + 3 : x + rw - 3]
            if interior.size == 0:
                continue
            lap_var = float(cv.Laplacian(interior, cv.CV_64F).var())
            if lap_var < 300:  # smooth interior → likely overlay
                cv.rectangle(rect_mask, (x, y), (x + rw, y + rh), 255, thickness=-1)
    except Exception as e:
        log.debug("rectangle overlay detection failed: %s", e)

    # --- Strategy B: text overlay via edge components -------------------
    edge_mask = np.zeros((h, w), dtype=np.uint8)
    n_labels, labels, stats, _ = cv.connectedComponentsWithStats(edges, connectivity=8)
    kept_edge = 0
    for i in range(1, n_labels):
        area = int(stats[i, cv.CC_STAT_AREA])
        if area < MASK_MIN_AREA or area > int(total * MASK_MAX_AREA_RATIO):
            continue
        x, y = int(stats[i, cv.CC_STAT_LEFT]), int(stats[i, cv.CC_STAT_TOP])
        ww, hh = int(stats[i, cv.CC_STAT_WIDTH]), int(stats[i, cv.CC_STAT_HEIGHT])
        aspect = ww / max(hh, 1)
        if aspect < 0.2:
            continue
        border_touch = sum([y == 0, x == 0, y + hh >= h, x + ww >= w])
        if border_touch >= 3:
            continue
        edge_mask[labels == i] = 255
        kept_edge += area

    # --- Merge + morphological closing ---------------------------------
    union = cv.bitwise_or(rect_mask, edge_mask)

    # Close with large kernel to fill text bodies + connect nearby regions.
    close_size = max(9, int(round(min(h, w) * 0.03)))  # ~24 for 800x600
    if close_size % 2 == 0:
        close_size += 1
    close_kernel = cv.getStructuringElement(cv.MORPH_RECT, (close_size, close_size))
    closed = cv.morphologyEx(union, cv.MORPH_CLOSE, close_kernel)

    # Re-filter connected components after closing.
    final_mask = np.zeros_like(closed)
    n_labels2, labels2, stats2, _ = cv.connectedComponentsWithStats(closed, connectivity=8)
    kept_after_close = 0
    for i in range(1, n_labels2):
        area = int(stats2[i, cv.CC_STAT_AREA])
        if area < MASK_MIN_AREA * 2 or area > int(total * MASK_MAX_AREA_RATIO):
            continue
        x, y = int(stats2[i, cv.CC_STAT_LEFT]), int(stats2[i, cv.CC_STAT_TOP])
        ww, hh = int(stats2[i, cv.CC_STAT_WIDTH]), int(stats2[i, cv.CC_STAT_HEIGHT])
        aspect = ww / max(hh, 1)
        if aspect < 0.2:
            continue
        border_touch = sum([y == 0, x == 0, y + hh >= h, x + ww >= w])
        if border_touch >= 3:
            continue
        final_mask[labels2 == i] = 255
        kept_after_close += area

    # Dilate slightly for safety margin around detected text.
    dilate_kernel = cv.getStructuringElement(cv.MORPH_RECT, (3, 3))
    final_mask = cv.dilate(final_mask, dilate_kernel, iterations=2)

    rect_pixels = int(np.count_nonzero(rect_mask))
    stats_dict = {
        "kept_edge": kept_edge,
        "rect_pixels": rect_pixels,
        "kept_after_close": kept_after_close,
        "mask_pixels": int(np.count_nonzero(final_mask)),
        "total_pixels": total,
    }
    log.debug(
        "mask: edge=%d rect=%d closed=%d final=%d/%d",
        kept_edge, rect_pixels, kept_after_close, stats_dict["mask_pixels"], total,
    )
    return final_mask, stats_dict


def _remove_visual_watermark(image_bytes: bytes, ext: str) -> tuple[bytes, dict]:
    """Detect + inpaint visible watermarks from an image."""
    stats: dict = {"error": None, "mask_pixels": 0}

    try:
        pil = Image.open(io.BytesIO(image_bytes))
        pil.load()
    except Exception as e:
        stats["error"] = f"open-failed: {e}"
        return image_bytes, stats

    had_alpha = pil.mode in ("RGBA", "LA")
    if had_alpha:
        rgba = pil.convert("RGBA")
        alpha = rgba.split()[-1]
        rgb = rgba.convert("RGB")
    else:
        rgb = pil.convert("RGB") if pil.mode != "RGB" else pil
        alpha = None

    bgr = _to_cv(rgb)
    mask, mstats = _build_watermark_mask(bgr)
    stats.update(mstats)

    if np.count_nonzero(mask) < MASK_MIN_AREA:
        stats["error"] = "no-watermark-detected"
        return image_bytes, stats

    try:
        cv = _ensure_cv2()
        inpainted = cv.inpaint(bgr, mask, INPAINT_RADIUS, cv.INPAINT_NS)
    except Exception as e:
        stats["error"] = f"inpaint-failed: {e}"
        return image_bytes, stats

    out_pil = _to_pil(inpainted)
    if had_alpha and alpha is not None:
        out_pil = out_pil.convert("RGBA")
        out_pil.putalpha(alpha)

    save_format = {
        ".jpg": "JPEG", ".jpeg": "JPEG",
        ".png": "PNG",
        ".webp": "WEBP",
        ".bmp": "BMP",
        ".tif": "TIFF", ".tiff": "TIFF",
    }.get(ext.lower(), "PNG")

    buf = io.BytesIO()
    try:
        if save_format == "JPEG" and out_pil.mode == "RGBA":
            out_pil = out_pil.convert("RGB")
        out_pil.save(buf, format=save_format, quality=92)
    except Exception as e:
        stats["error"] = f"re-encode-failed: {e}"
        return image_bytes, stats

    return buf.getvalue(), stats


# -----------------------------------------------------------------------------
# Routes
# -----------------------------------------------------------------------------

@app.post("/remove")
async def remove(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename.")

    ext = Path(file.filename).suffix.lower()
    if ext not in _ALLOWED_EXTS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file extension '{ext}'. Allowed: {sorted(_ALLOWED_EXTS)}",
        )

    content = await file.read()
    size = len(content)
    if size == 0:
        raise HTTPException(status_code=400, detail="Empty file.")
    if size > MAX_BYTES:
        mb = size / 1024 / 1024
        raise HTTPException(
            status_code=413,
            detail=f"File too large: {mb:.1f} MB (limit {MAX_BYTES // (1024*1024)} MB).",
        )

    log.info("remove: filename=%s ext=%s size=%d bytes mode=%s",
             file.filename, ext, size, VISUAL_MODE)

    safe_name = Path(file.filename).name
    cleaned_bytes = content
    ran_metadata = False
    ran_visual = False
    visual_stats: dict = {}

    # Step 1 — metadata strip (PIL re-save strips EXIF/XMP/IPTC).
    if ext in _IMAGE_EXTS:
        try:
            pil_img = Image.open(io.BytesIO(content))
            pil_img.load()
            buf = io.BytesIO()
            save_format = {
                ".jpg": "JPEG", ".jpeg": "JPEG",
                ".png": "PNG",
                ".webp": "WEBP",
                ".bmp": "BMP",
                ".tif": "TIFF", ".tiff": "TIFF",
            }.get(ext.lower(), "PNG")
            if save_format == "JPEG" and pil_img.mode == "RGBA":
                pil_img = pil_img.convert("RGB")
            pil_img.save(buf, format=save_format, quality=92)
            cleaned_bytes = buf.getvalue()
            ran_metadata = True
        except Exception as e:
            log.warning("PIL metadata strip failed: %s", e)
    else:
        with tempfile.TemporaryDirectory(prefix="wm-") as tmpdir:
            tmpdir_p = Path(tmpdir)
            input_path = tmpdir_p / f"input{ext}"
            output_path = tmpdir_p / f"output{ext}"
            input_path.write_bytes(content)
            rc, out = await asyncio.to_thread(_run_clean, input_path, output_path)
            if output_path.exists():
                cleaned_bytes = output_path.read_bytes()
                ran_metadata = True
            elif input_path.exists():
                cleaned_bytes = input_path.read_bytes()

    # Step 2 — visual watermark removal.
    if VISUAL_MODE in ("auto", "visual") and ext in _IMAGE_EXTS:
        try:
            cleaned_bytes, visual_stats = await asyncio.to_thread(
                _remove_visual_watermark, cleaned_bytes, ext,
            )
            ran_visual = True
        except Exception as e:
            log.warning("visual inpainting failed: %s", e)
            visual_stats = {"error": str(e)}

    if not cleaned_bytes:
        raise HTTPException(status_code=500, detail="Output file is empty after cleaning.")

    cleaned_filename = f"{Path(safe_name).stem}-cleaned{ext}"
    log.info(
        "remove: cleaned %d → %d bytes (metadata=%s visual=%s filename=%s)",
        size, len(cleaned_bytes), ran_metadata, ran_visual, cleaned_filename,
    )

    mime = _guess_mime(ext)
    headers = {
        "Content-Disposition": f'attachment; filename="{cleaned_filename}"',
        "X-Cleaned-Size": str(len(cleaned_bytes)),
        "X-Original-Size": str(size),
        "X-Metadata-Stripped": "true" if ran_metadata else "false",
        "X-Visual-Removed": "true" if ran_visual else "false",
    }
    if visual_stats.get("mask_pixels"):
        headers["X-Watermark-Mask-Pixels"] = str(visual_stats["mask_pixels"])
    if visual_stats.get("rect_pixels"):
        headers["X-Watermark-Rect-Area"] = str(visual_stats["rect_pixels"])
    if visual_stats.get("error"):
        headers["X-Watermark-Skip-Reason"] = str(visual_stats["error"])

    return Response(content=cleaned_bytes, media_type=mime, headers=headers)


def _guess_mime(ext: str) -> str:
    table = {
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".avif": "image/avif",
        ".heic": "image/heic",
        ".heif": "image/heif",
        ".bmp": "image/bmp",
        ".gif": "image/gif",
        ".tiff": "image/tiff",
        ".tif": "image/tiff",
        ".svg": "image/svg+xml",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ".odt": "application/vnd.oasis.opendocument.text",
        ".epub": "application/epub+zip",
        ".html": "text/html; charset=utf-8",
        ".md": "text/markdown; charset=utf-8",
    }
    return table.get(ext, "application/octet-stream")


# -----------------------------------------------------------------------------
# Entrypoint
# -----------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "8766"))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        log_level=os.environ.get("LOG_LEVEL", "info").lower(),
    )

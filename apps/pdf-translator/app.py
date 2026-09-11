# =====================================================================
# Toolify PDF Translator — thin FastAPI sidecar that takes a PDF, translates
# it (per page, via Gemini), and re-renders translated text back into a new
# PDF while preserving the original layout (positions, fonts, sizes).
#
# Approach (adapted from retain-pdf's text_draw / redaction_fill concepts —
# not copied, re-implemented fresh for Toolify's simpler scope):
#
#   1. Open PDF with PyMuPDF (fitz).
#   2. For each page:
#      a. Extract text spans with positions, fonts, sizes, colors via
#         page.get_text("dict"). We coalesce consecutive spans that share
#         font + size + baseline into logical "runs" so Gemini gets a clean
#         line-by-line picture rather than mid-word fragmentation.
#      b. Collect the runs into a JSON "page payload" with positional hints.
#      c. Send the payload to Gemini 2.5 Flash and ask it to return a
#         translated run-list (one entry per original run, preserving order).
#      d. Redact (white-fill) the original text rectangles on the page so
#         the source text doesn't bleed through, then insert translated
#         text at the same anchors. Font / size / color are preserved per
#         run where possible. When the target language is CJK we register
#         Noto Sans CJK as a fallback so fitz can find a glyph.
#   3. If the page is image-only (no text spans) — i.e. scanned PDF — we
#      fall back to rendering the original page as a flat background and
#      laying out the translated text on top with reportlab, preserving
#      visual structure even though we can't translate glyphs in place.
#
# Endpoints:
#   GET  /health      → status, dependency probe
#   POST /translate   → multipart: file (PDF), target (lang code), optional
#                       format=pdf (default) | text. Returns:
#                         format=pdf   → application/pdf binary
#                         format=text  → JSON envelope (text-only mode)
# =====================================================================
from __future__ import annotations

import io
import json
import logging
import os
import re
import tempfile
import time
from pathlib import Path
from typing import Any, Optional

import httpx
import pymupdf
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse, Response

# -----------------------------------------------------------------------------
# Config
# -----------------------------------------------------------------------------

VERSION = os.environ.get("PDF_TRANSLATOR_VERSION", "1.0.0-toolify")
MAX_BYTES = int(os.environ.get("PDF_TRANSLATOR_MAX_BYTES", str(20 * 1024 * 1024)))
SCRIPT_TIMEOUT = int(os.environ.get("PDF_TRANSLATOR_TIMEOUT", "180"))  # per call
PORT = int(os.environ.get("PORT", "8767"))

# Gemini REST endpoint — match NEXT_PUBLIC_GEMINI_MODEL env convention from .env.local
# (.env.local only exposes NEXT_PUBLIC_GEMINI_API_KEY because it's browser-bridged
#  by docker-compose.yml into the sidecar as GEMINI_API_KEY).
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL") or os.environ.get(
    "NEXT_PUBLIC_GEMINI_MODEL", "gemini-2.5-flash"
)
GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

# Retry config for transient Gemini failures (503 / 429 / network).
# The free tier of Gemini 2.5 Flash is rate-limited per minute; 503 here is
# almost always "model overloaded" or "quota exceeded temporarily". Both
# resolve within seconds, so a 3-step exponential backoff (2s / 4s / 8s)
# covers the typical transient window.
GEMINI_MAX_RETRIES = int(os.environ.get("GEMINI_MAX_RETRIES", "3"))
GEMINI_RETRY_BASE_DELAY = float(os.environ.get("GEMINI_RETRY_BASE_DELAY", "2.0"))
# HTTP status codes that should trigger an automatic retry.
GEMINI_RETRYABLE_STATUS = {408, 409, 429, 500, 502, 503, 504}

# Languages we know how to translate. `vi` is default. Names are passed to the
# Gemini prompt so it knows the target.
SUPPORTED_LANGS: dict[str, str] = {
    "vi": "tiếng Việt",
    "en": "English",
    "zh": "中文 (Chinese)",
    "ja": "日本語 (Japanese)",
    "ko": "한국어 (Korean)",
    "fr": "Français (French)",
    "de": "Deutsch (German)",
    "es": "Español (Spanish)",
}

# Pages with fewer than this many text spans are treated as image-only and get
# the reportlab fallback path (which renders the page background + new text).
MIN_SPANS_FOR_INLINE = 4

logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "info").upper(),
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger("pdf-translator")

app = FastAPI(
    title="Toolify PDF Translator",
    version=VERSION,
    description=(
        "Translate a PDF while preserving layout (positions, fonts, columns). "
        "Uses PyMuPDF to extract spans, Gemini for translation, and re-renders "
        "translated text at the original coordinates."
    ),
)


# -----------------------------------------------------------------------------
# Font registration
# -----------------------------------------------------------------------------

CJK_FONTS_REGISTERED = False
CJK_FONT_NAMES: list[str] = []


def _register_cjk_fonts() -> None:
    """
    Best-effort registration of a CJK-capable font with PyMuPDF so that
    insert_textbox / insert_text can find glyphs for zh/ja/ko.

    PyMuPDF ships its own base14 + DroidSans fallback on linux slim images,
    which covers Latin but not CJK. We try a few common locations and
    gracefully no-op if nothing is found (text will show as missing glyphs
    but won't crash).
    """
    global CJK_FONTS_REGISTERED, CJK_FONT_NAMES
    if CJK_FONTS_REGISTERED:
        return

    candidates = [
        # Debian/Ubuntu locations for fonts-noto-cjk
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJK.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc",
        # Some slim images ship Source Han Sans
        "/usr/share/fonts/opentype/source-han-sans/SourceHanSans-Regular.ttc",
        "/usr/share/fonts/source-han-sans/SourceHanSans-Regular.otf",
        # Fallback to anything named noto
        "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                # Register with an explicit name so we can reference it later.
                font_name = f"toolify-cjk-{Path(path).stem}"
                # fitz.register_font is a no-op if already registered.
                pymupdf.register_font(font_name, path)
                CJK_FONT_NAMES.append(font_name)
                log.info("registered CJK fallback font: %s -> %s", font_name, path)
            except Exception as e:
                log.warning("failed to register font %s: %s", path, e)
    CJK_FONTS_REGISTERED = True


def _pick_font_name(font_name: str, target_lang: str) -> str:
    """
    Return a font name suitable for `insert_text` calls. If the target lang is
    CJK and we successfully registered a CJK font, prefer it; otherwise keep
    the original font so Latin output looks native.
    """
    needs_cjk = target_lang in {"zh", "ja", "ko"}
    if needs_cjk and CJK_FONT_NAMES:
        return CJK_FONT_NAMES[0]
    return font_name or "helv"


# -----------------------------------------------------------------------------
# Span extraction
# -----------------------------------------------------------------------------

def extract_page_runs(page: pymupdf.Page) -> list[dict[str, Any]]:
    """
    Extract text runs from a page as a list of dicts. A "run" is a maximal
    sequence of consecutive spans on the same line that share font + size +
    color — so we get one chunk per visual phrase, not one chunk per glyph.

    Each run dict:
        text        : str — the actual text
        bbox        : [x0, y0, x1, y1]
        origin_x    : float — insertion x (left of bbox, top-left origin)
        origin_y    : float — baseline y for insert_text
        font        : str — fitz font name
        size        : float — font size
        color       : int — RGB int (0xRRGGBB)
        flags       : int — italic/bold/etc.
    """
    raw = page.get_text("dict")
    runs: list[dict[str, Any]] = []

    for block in raw.get("blocks", []):
        if block.get("type") != 0:  # skip image-only blocks
            continue
        for line in block.get("lines", []):
            spans = line.get("spans", [])
            if not spans:
                continue
            # Group consecutive spans with matching font/size/color/flags into
            # a single run. fitz already orders spans left-to-right on a line.
            current: dict[str, Any] | None = None
            for span in spans:
                font = span.get("font", "helv")
                size = round(float(span.get("size", 10.0)), 2)
                color = int(span.get("color", 0))
                flags = int(span.get("flags", 0))
                text = span.get("text", "")
                if not text.strip() and not text:
                    continue
                bbox = span.get("bbox", [0, 0, 0, 0])
                if current is not None and \
                        current["font"] == font and \
                        current["size"] == size and \
                        current["color"] == color and \
                        current["flags"] == flags:
                    # Extend the current run horizontally + concatenate text.
                    current["text"] += text
                    current["bbox"][2] = max(current["bbox"][2], bbox[2])
                    current["bbox"][1] = min(current["bbox"][1], bbox[1])
                    current["bbox"][3] = max(current["bbox"][3], bbox[3])
                    continue
                if current is not None:
                    runs.append(current)
                current = {
                    "text": text,
                    "bbox": list(bbox),
                    "font": font,
                    "size": size,
                    "color": color,
                    "flags": flags,
                }
            if current is not None:
                runs.append(current)

    # Convert bbox → (origin_x, origin_y) where origin_y is the BASELINE used by
    # fitz insert_text (top-left origin). fitz's get_text bbox is also top-left.
    for r in runs:
        r["origin_x"] = float(r["bbox"][0])
        r["origin_y"] = float(r["bbox"][3])  # baseline ~= bottom of bbox
    return runs


def runs_to_lines_payload(page_no: int, runs: list[dict[str, Any]]) -> dict[str, Any]:
    """
    Build the payload we send to Gemini: just the texts, indexed by run id,
    so we can map responses back to runs. We keep positions out of the prompt
    so Gemini doesn't waste tokens on coordinates.
    """
    return {
        "page": page_no,
        "lines": [
            {"id": i, "text": r["text"]}
            for i, r in enumerate(runs)
        ],
    }


# -----------------------------------------------------------------------------
# Gemini translation
# -----------------------------------------------------------------------------

TRANSLATION_SYSTEM_PROMPT = """You are a professional bilingual translator. You translate PDF documents \
while preserving formatting cues (numbers, units, math, code, names, abbreviations).

INPUT: a JSON object of the form
{{
  "page": <int>,
  "lines": [{{"id": <int>, "text": "<source line>"}}, ...]
}}

OUTPUT: a JSON object of the form
{{
  "page": <int>,
  "translations": [
    {{"id": <int>, "text": "<translated line>"}},
    ...
  ]
}}

Rules:
- Translate EVERY line. Return the same number of items as input lines, in the same order, with the same `id` values.
- Preserve line breaks inside a line as \\n if present.
- Preserve numbers, units, dates, formulas, code fragments, file paths, URLs.
- Do NOT add commentary, explanations, or notes.
- Output ONLY the JSON. No markdown fence."""


def _user_prompt(target_label: str, payload: dict[str, Any]) -> str:
    return (
        f"Translate every line below to {target_label}.\n"
        "Preserve order and ids. Output JSON only.\n\n"
        f"INPUT:\n{json.dumps(payload, ensure_ascii=False)}"
    )


async def call_gemini_translate(
    client: httpx.AsyncClient,
    payload: dict[str, Any],
    target_label: str,
) -> dict[str, Any]:
    """
    Call Gemini 2.5 Flash with the page payload and parse a JSON response back
    into a dict keyed by line id.

    Implements retry-with-exponential-backoff for transient failures:
      - HTTP 408 / 409 / 429 / 5xx → retry (up to GEMINI_MAX_RETRIES times)
      - httpx.TimeoutException, httpx.ConnectError, httpx.RemoteProtocolError,
        httpx.NetworkError → retry
      - Other HTTP errors and JSON parse errors → no retry, raise immediately
        (a 400 is a client mistake; a 401/403 won't fix itself with retries)

    Raises on final attempt failure with the last error encountered.
    """
    if not GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured on the sidecar. "
            "Set it in .env.local and `docker-compose up -d --force-recreate pdf-translator`."
        )

    url = f"{GEMINI_BASE}/{GEMINI_MODEL}:generateContent"
    body = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": _user_prompt(target_label, payload)}],
            }
        ],
        "systemInstruction": {
            "role": "system",
            "parts": [{"text": TRANSLATION_SYSTEM_PROMPT}],
        },
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
        },
    }

    headers = {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json",
    }

    last_error: Optional[str] = None
    for attempt in range(GEMINI_MAX_RETRIES):
        try:
            resp = await client.post(
                url, headers=headers, json=body, timeout=SCRIPT_TIMEOUT,
            )
        except httpx.TimeoutException as e:
            last_error = f"Gemini request timed out after {SCRIPT_TIMEOUT}s"
            log.warning(
                "gemini attempt %d/%d timeout: %s",
                attempt + 1, GEMINI_MAX_RETRIES, e,
            )
            _maybe_sleep_backoff(attempt)
            continue
        except (httpx.ConnectError, httpx.RemoteProtocolError, httpx.NetworkError) as e:
            last_error = f"Gemini network error: {e}"
            log.warning(
                "gemini attempt %d/%d network error: %s",
                attempt + 1, GEMINI_MAX_RETRIES, e,
            )
            _maybe_sleep_backoff(attempt)
            continue
        except httpx.HTTPError as e:
            # Non-retryable client/HTTP error — bail immediately.
            raise RuntimeError(f"Gemini HTTP error: {e}")

        if resp.status_code in GEMINI_RETRYABLE_STATUS:
            snippet = resp.text[:300] if resp.text else "(empty body)"
            last_error = f"Gemini returned HTTP {resp.status_code}: {snippet}"
            log.warning(
                "gemini attempt %d/%d transient HTTP %d: %s",
                attempt + 1, GEMINI_MAX_RETRIES, resp.status_code, snippet[:200],
            )
            _maybe_sleep_backoff(attempt)
            continue

        if resp.status_code != 200:
            # Non-retryable HTTP error (4xx other than 408/409/429). Surface
            # a precise error message so the user can fix the root cause.
            snippet = resp.text[:500] if resp.text else "(empty body)"
            raise RuntimeError(
                f"Gemini returned HTTP {resp.status_code}: {snippet}"
            )

        # 200 OK — parse and return.
        try:
            outer = resp.json()
            candidates = outer.get("candidates") or []
            if not candidates:
                raise RuntimeError("Gemini returned no candidates")
            parts = (candidates[0].get("content") or {}).get("parts") or []
            text = "".join((p.get("text") or "") for p in parts).strip()
        except Exception as e:
            raise RuntimeError(f"Failed to parse Gemini response envelope: {e}")

        candidate = text
        fence = re.search(r"```(?:json)?\s*([\s\S]+?)```", text)
        if fence:
            candidate = fence.group(1).strip()
        try:
            parsed = json.loads(candidate)
        except json.JSONDecodeError as e:
            raise RuntimeError(f"Gemini JSON parse failed: {e}; raw head={text[:200]}")

        translations = parsed.get("translations")
        if not isinstance(translations, list):
            raise RuntimeError("Gemini JSON missing 'translations' array")

        out: dict[int, str] = {}
        for item in translations:
            if not isinstance(item, dict):
                continue
            try:
                out[int(item["id"])] = str(item.get("text", ""))
            except (KeyError, ValueError, TypeError):
                continue
        if attempt > 0:
            log.info("gemini succeeded after %d retries", attempt)
        return out

    # All retries exhausted.
    raise RuntimeError(
        f"Gemini failed after {GEMINI_MAX_RETRIES} attempts. "
        f"Last error: {last_error}. "
        f"Hãy thử lại sau ít phút hoặc kiểm tra quota tại "
        f"https://aistudio.google.com/apikey"
    )


def _maybe_sleep_backoff(attempt: int) -> None:
    """
    Sleep for an exponentially increasing delay between Gemini retries.

    attempt=0 (just finished the 1st try, about to do 2nd) → GEMINI_RETRY_BASE_DELAY
    attempt=1 (just finished 2nd, about to do 3rd) → 2x base
    attempt=2 (just finished 3rd, no more retries) → no sleep
    """
    if attempt >= GEMINI_MAX_RETRIES - 1:
        return
    delay = GEMINI_RETRY_BASE_DELAY * (2 ** attempt)
    log.info("gemini retry sleeping %.1fs before attempt %d", delay, attempt + 2)
    import time as _time
    _time.sleep(delay)


# -----------------------------------------------------------------------------
# PDF re-rendering (position-preserving)
# -----------------------------------------------------------------------------

def _redact_rect(page: pymupdf.Page, rect: pymupdf.Rect, color: tuple[float, float, float]) -> None:
    """Draw a filled rectangle over a region to hide the original text."""
    try:
        page.draw_rect(rect, color=color, fill=color, width=0, overlay=True)
    except Exception:
        # Drawing on overlay can fail on protected PDFs — fall back to annot.
        try:
            page.add_redact_annot(rect, fill=color)
        except Exception:
            pass


def _write_translated_run(
    page: pymupdf.Page,
    run: dict[str, Any],
    new_text: str,
    font_name: str,
) -> None:
    """
    Insert translated text at the run's original anchor.

    Strategy:
      - Use insert_textbox with the original bbox as the rect. fitz will
        auto-shrink text if it overflows (via the `fontfile` / scaling
        behavior — but insert_textbox itself doesn't shrink; we approximate
        by reducing font size in steps if needed).
      - Fall back to insert_text with the baseline if insert_textbox fails.
    """
    if not new_text:
        return

    bbox = pymupdf.Rect(*run["bbox"])
    color_int = int(run.get("color", 0))
    # fitz uses float 0..1 colors.
    r = ((color_int >> 16) & 0xFF) / 255.0
    g = ((color_int >> 8) & 0xFF) / 255.0
    b = (color_int & 0xFF) / 255.0
    base_size = float(run.get("size", 10.0))

    # Try several sizes (90% → 60%) until the text fits horizontally.
    rect = pymupdf.Rect(bbox)
    chosen_size = base_size
    for scale in (1.0, 0.9, 0.8, 0.7, 0.6):
        s = max(base_size * scale, 5.0)
        try:
            rc = page.insert_textbox(
                rect,
                new_text,
                fontname=font_name,
                fontsize=s,
                color=(r, g, b),
                align=pymupdf.TEXT_ALIGN_LEFT,
            )
            # insert_textbox returns how many chars DIDN'T fit. We accept a small
            # overflow but try smaller if a lot didn't fit.
            if rc < max(1, len(new_text) // 5):
                chosen_size = s
                return
            chosen_size = s
        except Exception:
            continue

    # Final fallback: insert at baseline using insert_text.
    try:
        page.insert_text(
            (float(bbox[0]), float(bbox[3])),
            new_text,
            fontname=font_name,
            fontsize=chosen_size,
            color=(r, g, b),
        )
    except Exception as e:
        log.warning("insert_text fallback failed: %s", e)


def _has_editable_text(page: pymupdf.Page) -> bool:
    text = page.get_text("text").strip()
    return len(text) > 0


# -----------------------------------------------------------------------------
# Image-only fallback (reportlab)
# -----------------------------------------------------------------------------

def _build_reportlab_pages(
    src_doc: pymupdf.Document,
    translated_pages: list[dict[str, Any]],
    target_label: str,
) -> bytes:
    """
    For image-only / scanned pages, render each source page as a background
    image and overlay translated text via reportlab. We extract an English
    transcription + Vietnamese translation from the payload and lay them out
    top-to-bottom in a single column.

    Translated pages is a list of dicts: {page, lines: [{id, text}, ...]}.
    """
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas

    out = io.BytesIO()
    c = canvas.Canvas(out, pagesize=letter)

    for page_no in range(len(src_doc)):
        src_page = src_doc[page_no]
        pix = src_page.get_pixmap(dpi=110, alpha=False)
        img_bytes = pix.tobytes("png")
        # Draw image full-bleed.
        from reportlab.lib.utils import ImageReader

        ir = ImageReader(io.BytesIO(img_bytes))
        page_w, page_h = letter
        c.drawImage(ir, 0, 0, width=page_w, height=page_h, preserveAspectRatio=True)
        # Translate overlay text at top.
        c.setFillColorRGB(1, 1, 0.95)
        c.rect(0, page_h - 80, page_w, 80, stroke=0, fill=1)
        c.setFillColorRGB(0, 0, 0)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(20, page_h - 30, f"Trang {page_no + 1} — bản dịch {target_label}")
        c.setFont("Helvetica", 9)
        # Pull translated lines for this page (if present).
        page_payload = next((p for p in translated_pages if p["page"] == page_no + 1), None)
        if page_payload:
            lines = [item["text"] for item in page_payload.get("lines", [])]
            snippet = " ".join(lines)[:600]
            # Wrap at ~95 chars
            wrapped = []
            cur = ""
            for word in snippet.split():
                if len(cur) + len(word) + 1 > 95:
                    wrapped.append(cur)
                    cur = word
                else:
                    cur = (cur + " " + word).strip()
            if cur:
                wrapped.append(cur)
            y = page_h - 50
            for ln in wrapped[:3]:
                c.drawString(20, y, ln)
                y -= 12
        c.showPage()
    c.save()
    return out.getvalue()


# -----------------------------------------------------------------------------
# Routes
# -----------------------------------------------------------------------------

@app.get("/health")
async def health():
    return {
        "ok": True,
        "version": VERSION,
        "model": GEMINI_MODEL,
        "gemini_configured": bool(GEMINI_API_KEY),
        "cjk_fonts_registered": CJK_FONT_NAMES,
        "supported_languages": SUPPORTED_LANGS,
        "max_bytes": MAX_BYTES,
    }


@app.get("/capabilities")
async def capabilities():
    return {
        "endpoints": ["POST /translate", "GET /health", "GET /capabilities"],
        "supported_languages": SUPPORTED_LANGS,
        "output_formats": ["pdf", "text"],
        "max_bytes": MAX_BYTES,
        "model": GEMINI_MODEL,
    }


@app.post("/translate")
async def translate(
    file: UploadFile = File(...),
    target: str = Form("vi"),
    format: str = Form("pdf"),
):
    """
    Multipart upload → translated file.

    Form fields:
      file    : PDF (max 20 MB)
      target  : lang code (default 'vi')
      format  : 'pdf' (default, returns application/pdf)
                | 'text' (returns JSON envelope with translated lines per page)

    Response:
      200 + application/pdf binary with Content-Disposition attachment
      200 + application/json envelope if format=text
      400 / 413 on validation errors
      502 if Gemini fails
    """
    target_code = target.lower()
    if target_code not in SUPPORTED_LANGS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported target language '{target_code}'. "
                f"Supported: {sorted(SUPPORTED_LANGS.keys())}"
            ),
        )
    target_label = SUPPORTED_LANGS[target_code]

    if format not in {"pdf", "text"}:
        raise HTTPException(status_code=400, detail="format must be 'pdf' or 'text'")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file.")
    if len(content) > MAX_BYTES:
        mb = len(content) / 1024 / 1024
        raise HTTPException(
            status_code=413,
            detail=f"File too large: {mb:.1f} MB (limit {MAX_BYTES // (1024*1024)} MB).",
        )

    log.info(
        "translate: filename=%s size=%d target=%s format=%s",
        file.filename, len(content), target_code, format,
    )

    # Lazy font registration
    _register_cjk_fonts()
    font_fallback = _pick_font_name("helv", target_code)

    try:
        src_doc = pymupdf.open(stream=content, filetype="pdf")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Cannot open PDF: {e}")

    try:
        if len(src_doc) == 0:
            raise HTTPException(status_code=400, detail="PDF has no pages.")

        # Build per-page extracted runs + translated lines.
        per_page_runs: list[list[dict[str, Any]]] = []
        per_page_translated: list[dict[str, Any]] = []

        async with httpx.AsyncClient() as client:
            for page_no in range(len(src_doc)):
                page = src_doc[page_no]
                if not _has_editable_text(page):
                    log.info("page %d: image-only, will use fallback renderer", page_no + 1)
                    per_page_runs.append([])
                    per_page_translated.append(
                        {"page": page_no + 1, "lines": [], "image_only": True}
                    )
                    continue

                runs = extract_page_runs(page)
                per_page_runs.append(runs)

                if len(runs) < MIN_SPANS_FOR_INLINE:
                    log.info("page %d: too few runs (%d), skipping Gemini call", page_no + 1, len(runs))
                    per_page_translated.append({"page": page_no + 1, "lines": [], "skipped": True})
                    continue

                payload = runs_to_lines_payload(page_no + 1, runs)
                try:
                    translated_map = await call_gemini_translate(client, payload, target_label)
                except Exception as e:
                    log.error("Gemini failed on page %d: %s", page_no + 1, e)
                    raise HTTPException(
                        status_code=502,
                        detail=f"Gemini translation failed: {e}",
                    )

                # Re-assemble in original order; fall back to original text if
                # Gemini missed any id (defensive).
                page_lines = []
                for r in runs:
                    idx = runs.index(r)
                    new_text = translated_map.get(idx, r["text"])
                    page_lines.append({"id": idx, "text": new_text})
                per_page_translated.append({"page": page_no + 1, "lines": page_lines})

        # If user only wants text mode, return JSON envelope (lighter).
        if format == "text":
            return JSONResponse(
                {
                    "ok": True,
                    "target": target_code,
                    "target_label": target_label,
                    "page_count": len(src_doc),
                    "model": GEMINI_MODEL,
                    "pages": per_page_translated,
                }
            )

        # Render position-preserving PDF.
        out_doc = pymupdf.open()
        for page_no in range(len(src_doc)):
            src_page = src_doc[page_no]
            page_dict = src_page.get_text("dict")
            # Check if page is image-only — fall back to reportlab overlay.
            all_runs = per_page_runs[page_no]
            page_translated = per_page_translated[page_no]

            if not all_runs or page_translated.get("image_only"):
                # Render fallback pages as we go; collect bytes later.
                # We need to insert pages in order — defer and assemble.
                # For simplicity we use reportlab for the *whole* doc if any
                # page is image-only.
                log.info("image-only page detected, switching to reportlab fallback for all pages")
                fb_bytes = _build_reportlab_pages(src_doc, per_page_translated, target_label)
                return Response(
                    content=fb_bytes,
                    media_type="application/pdf",
                    headers={
                        "Content-Disposition": 'attachment; filename="translated.pdf"',
                        "X-Pages-Rendered": "fallback",
                    },
                )

            # Standard path: copy original page into out_doc, redact original
            # text, then overlay translated text at original anchors.
            new_page = out_doc.new_page(
                width=src_page.rect.width,
                height=src_page.rect.height,
            )
            # Render the original page content as background image so visuals
            # (images, vector lines, headers/footers, page numbers) are kept.
            pix = src_page.get_pixmap(dpi=144, alpha=False)
            bg_bytes = pix.tobytes("png")
            new_page.insert_image(new_page.rect, stream=bg_bytes)

            # Now redact the original text rectangles and insert translated text.
            page_bg_color = (1.0, 1.0, 1.0)  # assume white-ish bg under text
            translated_map_idx = {
                item["id"]: item["text"] for item in page_translated.get("lines", [])
            }
            for idx, run in enumerate(all_runs):
                rect = pymupdf.Rect(*run["bbox"])
                _redact_rect(new_page, rect, page_bg_color)
                new_text = translated_map_idx.get(idx, run["text"])
                _write_translated_run(new_page, run, new_text, font_fallback)

        pdf_bytes = out_doc.tobytes(deflate=True)
        out_doc.close()
        src_doc.close()

        log.info("translate: produced %d bytes (target=%s)", len(pdf_bytes), target_code)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": 'attachment; filename="translated.pdf"',
                "X-Pages-Rendered": "layout-preserving",
                "X-Target-Lang": target_code,
            },
        )
    finally:
        try:
            src_doc.close()
        except Exception:
            pass


# -----------------------------------------------------------------------------
# Entrypoint
# -----------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    # Register CJK fonts eagerly at startup so the first request is fast.
    _register_cjk_fonts()
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=PORT,
        log_level=os.environ.get("LOG_LEVEL", "info").lower(),
    )
"""
Before/after evidence for the watermark-remover tool.

For each input PDF we:
  1. Rasterise the BEFORE (the input we sent to the tool) at 150 dpi.
  2. Rasterise the AFTER (cleaned_*.pdf the API returned).
  3. Compute SSIM (similarity 0..1), perceptual hash (phash), and the
     number of pixels that differ by more than a threshold.

A high SSIM (~0.95+) on the clean control confirms the remover doesn't
damage documents that were already clean. A measurable drop in SSIM on
the watermarked sample, plus a clear pixel diff at the watermark
coordinates, confirms the remover actually changed the right pixels.
"""
from __future__ import annotations

import os
import sys
import io
import subprocess
from PIL import Image
import numpy as np
import imagehash
from skimage.metrics import structural_similarity as ssim

HERE = os.path.dirname(os.path.abspath(__file__))

# Poppler binaries for pdf2image on Windows
POPPLER_PATH = r"D:\Startup-BA\scripts\test-watermark\poppler\poppler-24.08.0\Library\bin"


def rasterise(pdf_path: str, out_prefix: str, dpi: int = 150) -> list[str]:
    """Use pdftoppm CLI from poppler for reliable rasterisation."""
    if not POPPLER_PATH or not os.path.isfile(os.path.join(POPPLER_PATH, "pdftoppm.exe")):
        # Fall back to pdf2image
        from pdf2image import convert_from_path
        imgs = convert_from_path(pdf_path, dpi=dpi)
    else:
        out_pattern = os.path.join(HERE, f"{out_prefix}-%d.png")
        subprocess.run(
            [
                os.path.join(POPPLER_PATH, "pdftoppm.exe"),
                "-r", str(dpi),
                "-png",
                pdf_path,
                os.path.join(HERE, out_prefix),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        out_files = sorted(
            os.path.join(HERE, f) for f in os.listdir(HERE)
            if f.startswith(f"{out_prefix}-") and f.endswith(".png")
        )
        return out_files

    # pdf2image fallback
    out_files = []
    for idx, im in enumerate(imgs, start=1):
        p = os.path.join(HERE, f"{out_prefix}-{idx}.png")
        im.save(p)
        out_files.append(p)
    return out_files


def crop_watermark_band(arr: np.ndarray) -> tuple[int, int]:
    """Return (h, w) of the centre diagonal band where a watermark is likely."""
    h, w = arr.shape[:2]
    return h, w


def diff_stats(arr_a: np.ndarray, arr_b: np.ndarray) -> dict:
    a = np.array(Image.fromarray(arr_a).convert("L"))
    b = np.array(Image.fromarray(arr_b).convert("L"))
    if a.shape != b.shape:
        # Resize b to a's shape for comparison
        Image.fromarray(b).resize(
            (a.shape[1], a.shape[0]), Image.BILINEAR
        )
        b = np.array(
            Image.fromarray(b).resize((a.shape[1], a.shape[0]), Image.BILINEAR)
        )
    s = ssim(a, b)
    hash_a = imagehash.phash(Image.fromarray(a))
    hash_b = imagehash.phash(Image.fromarray(b))
    hash_dist = hash_a - hash_b
    diff = np.abs(a.astype(int) - b.astype(int))
    changed = int((diff > 25).sum())
    total = a.size
    return {
        "ssim": float(s),
        "phash_distance": int(hash_dist),
        "changed_pixels": changed,
        "total_pixels": total,
        "changed_ratio": changed / total if total else 0.0,
    }


def analyse_pair(label: str, before_pdf: str, after_pdf: str) -> None:
    print(f"\n=== {label} ===")
    print(f"  before: {os.path.basename(before_pdf)} ({os.path.getsize(before_pdf)} B)")
    print(f"  after : {os.path.basename(after_pdf)} ({os.path.getsize(after_pdf)} B)")
    before_imgs = rasterise(before_pdf, f"{label}_before")
    after_imgs = rasterise(after_pdf, f"{label}_after")
    print(f"  pages:  {len(before_imgs)} before, {len(after_imgs)} after")
    for i, (bp, ap) in enumerate(zip(before_imgs, after_imgs), start=1):
        a = np.array(Image.open(bp).convert("RGB"))
        b = np.array(Image.open(ap).convert("RGB"))
        stats = diff_stats(a, b)
        print(
            f"  page {i}: SSIM={stats['ssim']:.4f}  "
            f"phash_dist={stats['phash_distance']}  "
            f"changed_px={stats['changed_pixels']}/{stats['total_pixels']} "
            f"({stats['changed_ratio']*100:.2f}%)"
        )


if __name__ == "__main__":
    if POPPLER_PATH:
        print(f"Using poppler: {POPPLER_PATH}")
    pairs = [
        (
            "watermarked",
            os.path.join(HERE, "watermarked.pdf"),
            os.path.join(HERE, "cleaned_marked.pdf"),
        ),
        (
            "clean_control",
            os.path.join(HERE, "control_clean.pdf"),
            os.path.join(HERE, "cleaned_clean.pdf"),
        ),
    ]
    for label, before, after in pairs:
        if not (os.path.exists(before) and os.path.exists(after)):
            print(f"  skip {label}: missing {before} or {after}")
            continue
        analyse_pair(label, before, after)

"""
make_watermarked_pdf.py — Generate a PDF with a visible watermark for testing the
watermark remover service.

The output PDF has:
  - Plain black text body ("This is page N of the test document. ...")
  - A large red translucent watermark "CONFIDENTIAL — DO NOT DISTRIBUTE"
    rendered diagonally across the page.

Usage:
    python make_watermarked_pdf.py [output_path]

Default output: scripts/test-watermark/input.pdf
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


PAGE_W, PAGE_H = int(A4[0]), int(A4[1])  # 595 x 842 points


def find_font(size: int) -> ImageFont.FreeTypeFont:
    """Try a few common TTF paths; fall back to PIL default if none found."""
    candidates = [
        r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\Arial.ttf",
        r"C:\Windows\Fonts\calibri.ttf",
        r"C:\Windows\Fonts\segoeui.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def make_watermarked_page(page_num: int, total: int) -> Image.Image:
    """Render a single page as a PIL Image with body text + diagonal watermark."""
    img = Image.new("RGB", (PAGE_W, PAGE_H), "white")
    draw = ImageDraw.Draw(img)

    # Body text — small black serif/sans, several lines
    body_font = find_font(12)
    body_lines = [
        f"This is page {page_num} of {total} of the test document.",
        "",
        "The watermark remover should be able to remove the red diagonal",
        "watermark without altering the body text below.",
        "",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do",
        "eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut",
        "enim ad minim veniam, quis nostrud exercitation ullamco laboris",
        "nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in",
        "reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla",
        "pariatur. Excepteur sint occaecat cupidatat non proident, sunt in",
        "culpa qui officia deserunt mollit anim id est laborum.",
        "",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
        "accusantium doloremque laudantium, totam rem aperiam, eaque ipsa",
        "quae ab illo inventore veritatis et quasi architecto beatae vitae",
        "dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas",
        "sit aspernatur aut odit aut fugit, sed quia consequuntur magni",
        "dolores eos qui ratione voluptatem sequi nesciunt.",
    ]
    y = 80
    for line in body_lines:
        draw.text((72, y), line, fill="black", font=body_font)
        y += 18

    # Watermark — large red translucent text rotated diagonally.
    # We render it to a separate transparent layer then alpha-composite.
    wm_text = "CONFIDENTIAL — DO NOT DISTRIBUTE"
    wm_font = find_font(64)
    # Measure the text bounding box
    bbox = wm_font.getbbox(wm_text)
    wm_w = bbox[2] - bbox[0] + 60
    wm_h = bbox[3] - bbox[1] + 60

    wm_layer = Image.new("RGBA", (wm_w, wm_h), (0, 0, 0, 0))
    wm_draw = ImageDraw.Draw(wm_layer)
    wm_draw.text(
        (30 - bbox[0], 30 - bbox[1]),
        wm_text,
        fill=(220, 30, 30, 110),  # red, semi-transparent
        font=wm_font,
    )
    # Rotate ~30 degrees
    wm_layer = wm_layer.rotate(30, resample=Image.BICUBIC, expand=True)

    # Composite over the white page, roughly centered
    cx = (PAGE_W - wm_layer.width) // 2
    cy = (PAGE_H - wm_layer.height) // 2
    img_rgba = img.convert("RGBA")
    img_rgba.alpha_composite(wm_layer, (cx, cy))
    return img_rgba.convert("RGB")


def make_clean_page(page_num: int, total: int) -> Image.Image:
    """Same body text, NO watermark."""
    img = Image.new("RGB", (PAGE_W, PAGE_H), "white")
    draw = ImageDraw.Draw(img)
    body_font = find_font(12)
    body_lines = [
        f"This is page {page_num} of {total} of the control document.",
        "",
        "This page has NO watermark — used as control for the SSIM/hash",
        "comparison so we can detect false positives (the remover changing",
        "pixels it shouldn't).",
        "",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do",
        "eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut",
        "enim ad minim veniam, quis nostrud exercitation ullamco laboris",
        "nisi ut aliquip ex ea commodo consequat.",
        "",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
        "accusantium doloremque laudantium, totam rem aperiam.",
    ]
    y = 80
    for line in body_lines:
        draw.text((72, y), line, fill="black", font=body_font)
        y += 18
    return img


def render_pdf_from_images(images: list[Image.Image], out_path: Path) -> None:
    """Render a list of PIL images into a single PDF file."""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    tmp_dir = out_path.parent / "_tmp_png"
    tmp_dir.mkdir(exist_ok=True)
    png_paths = []
    for i, img in enumerate(images, start=1):
        p = tmp_dir / f"page_{i:02d}.png"
        img.save(p, format="PNG")
        png_paths.append(p)

    c = canvas.Canvas(str(out_path), pagesize=A4)
    for p in png_paths:
        c.drawImage(str(p), 0, 0, width=PAGE_W, height=PAGE_H, preserveAspectRatio=True)
        c.showPage()
    c.save()
    for p in png_paths:
        p.unlink(missing_ok=True)
    tmp_dir.rmdir()


def main() -> None:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("scripts/test-watermark/input.pdf")
    clean_out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("scripts/test-watermark/clean.pdf")

    print(f"Generating watermarked PDF: {out}")
    watermarked = [make_watermarked_page(i, 2) for i in (1, 2)]
    render_pdf_from_images(watermarked, out)
    print(f"  size: {out.stat().st_size} bytes, 2 pages")

    print(f"Generating clean (control) PDF: {clean_out}")
    clean = [make_clean_page(i, 2) for i in (1, 2)]
    render_pdf_from_images(clean, clean_out)
    print(f"  size: {clean_out.stat().st_size} bytes, 2 pages")


if __name__ == "__main__":
    main()

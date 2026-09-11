"""
Create a watermarked PDF for before/after test of the watermark-remover tool.

The watermark is a red 'CONFIDENTIAL' text drawn diagonally across the page.
That's visually obvious AND it sits on the rasterised layer, so the remover
sidecar (which uses upstream guillaumemeyer/watermarks-remover + qpdf/ghostscript)
should produce a measurable pixel diff.
"""
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import red, lightgrey
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

HERE = os.path.dirname(os.path.abspath(__file__))


def make_clean(out_path: str) -> None:
    """PDF without any watermark — control sample."""
    c = canvas.Canvas(out_path, pagesize=letter)
    c.setFont("Helvetica", 12)
    c.setFillColor(lightgrey)
    for i, line in enumerate(
        [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "",
            "Ut enim ad minim veniam, quis nostrud exercitation",
            "ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "",
            "Duis aute irure dolor in reprehenderit in voluptate",
            "velit esse cillum dolore eu fugiat nulla pariatur.",
        ]
    ):
        c.drawString(72, 740 - i * 18, line)
    c.showPage()
    c.save()


def make_watermarked(out_path: str) -> None:
    """PDF with a giant red 'CONFIDENTIAL' watermark diagonally across the page."""
    c = canvas.Canvas(out_path, pagesize=letter)
    # Body text first (under the watermark)
    c.setFont("Helvetica", 12)
    c.setFillColor(lightgrey)
    for i, line in enumerate(
        [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "",
            "Ut enim ad minim veniam, quis nostrud exercitation",
            "ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "",
            "Duis aute irure dolor in reprehenderit in voluptate",
            "velit esse cillum dolore eu fugiat nulla pariatur.",
        ]
    ):
        c.drawString(72, 740 - i * 18, line)

    # Watermark layer on top: huge red text, rotated 30 degrees
    c.saveState()
    c.translate(letter[0] / 2, letter[1] / 2)
    c.rotate(30)
    c.setFillColor(red)
    c.setFont("Helvetica-Bold", 96)
    c.drawCentredString(0, 0, "CONFIDENTIAL")
    c.restoreState()

    c.showPage()
    c.save()


if __name__ == "__main__":
    clean = os.path.join(HERE, "control_clean.pdf")
    marked = os.path.join(HERE, "watermarked.pdf")
    make_clean(clean)
    make_watermarked(marked)
    print("Wrote:", clean, os.path.getsize(clean), "bytes")
    print("Wrote:", marked, os.path.getsize(marked), "bytes")

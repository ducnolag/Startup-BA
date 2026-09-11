"""
make_test_pdfs.py — Generate test PDFs with AI-metadata watermarks for the
watermark remover verification.

The upstream clean_file.py removes:
  • XMP packets with digitalSourceType / trainedAlgorithmicMedia / SoftwareAgent
  • C2PA manifests
  • EXIF / XMP metadata in embedded images
  • PDF Info dict (Title, Author, Producer, etc.)
  • Text steganography (KGW / SynthID schemes — invisible)

This script creates:
  1. input.pdf  — PDF with AI provenance XMP + PDF Info metadata watermark
  2. clean.pdf  — Same PDF but without any watermark metadata (control)

Usage:
    python make_test_pdfs.py
"""

from __future__ import annotations

import io
import struct
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

PAGE_W, PAGE_H = int(A4[0]), int(A4[1])  # 595 x 842 points


# ---------------------------------------------------------------------------
# XMP packet that triggers AI provenance detection
# ---------------------------------------------------------------------------
AI_XMP_PACKET = (
    '<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>\n'
    '<x:xmpmeta xmlns:x="adobe:ns:meta/">\n'
    '  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n'
    '    <rdf:Description\n'
    '      xmlns:dc="http://purl.org/dc/elements/1.1/"\n'
    '      xmlns:xmp="http://ns.adobe.com/xap/1.0/"\n'
    '      xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"\n'
    '      dc:format="application/pdf">\n'
    '      <dc:title><rdf:Alt><rdf:li xml:lang="x-default">'
    '        AI-Generated Research Report'
    '      </rdf:li></rdf:Alt></dc:title>\n'
    '      <dc:creator><rdf:Seq><rdf:li>Adobe Firefly 3.0</rdf:li></rdf:Seq></dc:creator>\n'
    '      <xmp:CreatorTool>Adobe Firefly</xmp:CreatorTool>\n'
    '      <xmp:CreateDate>2026-09-11T10:00:00+07:00</xmp:CreateDate>\n'
    '      <xmp:MetadataDate>2026-09-11T12:00:00+07:00</xmp:MetadataDate>\n'
    '      <xmp:Thumbnails><rdf:Alt><rdf:li rdf:parseType="Resource">\n'
    '        <xmpGImg:width>256</xmpGImg:width>\n'
    '        <xmpGImg:height>256</xmpGImg:height>\n'
    '        <xmpGImg:format>JPEG</xmpGImg:format>\n'
    '        <xmpGImg:image>/9j/4AAQSkZJRgABAQAAAQ...</xmpGImg:image>\n'
    '      </rdf:li></rdf:Alt></xmp:Thumbnails>\n'
    '      <photoshop:DateCreated>2026-09-11T10:00:00</photoshop:DateCreated>\n'
    '      <!-- AI provenance markers that clean_file.py detects -->\n'
    '      <dc:description><rdf:Alt><rdf:li xml:lang="x-default">'
    '        digitalSourceType=http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia'
    '      </rdf:li></rdf:Alt></dc:description>\n'
    '      <xmp:Note>trainedAlgorithmicMedia=Yes SoftwareAgent=Adobe Firefly 3</xmp:Note>\n'
    '    </rdf:Description>\n'
    '  </rdf:RDF>\n'
    '</x:xmpmeta>\n'
    '<?xpacket end="w"?>'
)


def find_font(size: int):
    candidates = [
        r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\Arial.ttf",
        r"C:\Windows\Fonts\calibri.ttf",
        r"C:\Windows\Fonts\segoeui.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for p in candidates:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def render_page_image(page_num: int, wm_marker: str = "") -> Image.Image:
    """Render one page as RGB PIL Image. wm_marker adds a visible tag."""
    img = Image.new("RGB", (PAGE_W, PAGE_H), "white")
    draw = ImageDraw.Draw(img)
    font = find_font(12)
    body = [
        f"Page {page_num} — AI Provenance Metadata Test",
        "",
        "This PDF contains AI-generated metadata markers that the watermark",
        "remover should strip (XMP digitalSourceType, SoftwareAgent, etc.).",
        "",
        "After cleaning, the XMP packet should be gone and the Info dict",
        "should no longer contain Adobe Firefly or AI provenance fields.",
        "",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do",
        "eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
        "accusantium doloremque laudantium, totam rem aperiam.",
    ]
    y = 80
    for line in body:
        draw.text((72, y), line, fill="black", font=font)
        y += 18

    # Visible watermark tag (subtle, bottom-right) so user can confirm content preserved
    if wm_marker:
        small = find_font(9)
        draw.text(
            (PAGE_W - 300, PAGE_H - 30),
            wm_marker,
            fill=(180, 180, 180),
            font=small,
        )
    return img


def make_pdf_bytes(images: list[Image.Image], metadata: dict) -> bytes:
    """Render images to a PDF with PDF Info dict and optional XMP packet."""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)

    for key, val in metadata.items():
        c.setAuthor(val) if key == "author" else None
        c.setTitle(val) if key == "title" else None
        c.setCreator(val) if key == "creator" else None
        c.setProducer(val) if key == "producer" else None
        c.setSubject(val) if key == "subject" else None

    tmp_dir = Path("scripts/test-watermark")
    tmp_dir.mkdir(parents=True, exist_ok=True)
    for img in images:
        tmp_path = tmp_dir / "_tmp_page.png"
        img.save(str(tmp_path), format="PNG", dpi=(72, 72))
        c.drawImage(str(tmp_path), 0, 0, width=PAGE_W, height=PAGE_H)
        tmp_path.unlink(missing_ok=True)
        c.showPage()
    c.save()

    raw = buf.getvalue()
    return raw


def inject_xmp(data: bytes, xmp_packet: str) -> bytes:
    """
    Inject an XMP packet into a PDF byte stream.
    Appends the XMP packet right before %%EOF.
    """
    xmp_bytes = xmp_packet.encode("utf-8")
    eof = b"%%EOF"
    if eof in data:
        parts = data.rsplit(eof, 1)
        return parts[0] + xmp_bytes + eof
    else:
        return data + xmp_bytes


def extract_xmp(data: bytes) -> str | None:
    """Extract XMP packet from PDF bytes."""
    import re
    m = re.search(rb'<\?xpacket.*?\?>', data, re.DOTALL)
    if m:
        return m.group(0).decode("utf-8", errors="replace")
    return None


def extract_info(data: bytes) -> dict:
    """Extract PDF Info dict fields by scanning the PDF string."""
    import re
    info: dict = {}
    for field in ("Title", "Author", "Creator", "Producer", "Subject"):
        # Look for /field (value) patterns in PDF
        pattern = rb"/" + field.encode() + rb"\s*\((.*?)\)"
        m = re.search(pattern, data)
        if m:
            try:
                info[field.lower()] = m.group(1).decode("utf-8", errors="replace")
            except Exception:
                pass
    return info


def main() -> None:
    out_dir = Path("scripts/test-watermark")
    out_dir.mkdir(parents=True, exist_ok=True)

    pages = [render_page_image(1, "ORIGINAL — AI-WATERMARKED"), render_page_image(2)]

    # ---- input.pdf: has AI metadata watermark ----
    wm_metadata = {
        "title": "AI-Generated Research Report",
        "author": "Adobe Firefly 3.0",
        "creator": "Adobe Firefly",
        "producer": "Adobe Firefly PDF Generator",
        "subject": "Generated by AI trainedAlgorithmicMedia",
    }
    wm_pdf = make_pdf_bytes(pages, wm_metadata)
    wm_pdf = inject_xmp(wm_pdf, AI_XMP_PACKET)

    input_path = out_dir / "input.pdf"
    input_path.write_bytes(wm_pdf)
    print(f"Generated {input_path} ({len(wm_pdf):,} bytes)")
    xmp_in = extract_xmp(wm_pdf)
    info_in = extract_info(wm_pdf)
    print(f"  XMP present: {bool(xmp_in)}")
    print(f"  PDF Info: {info_in}")

    # ---- clean.pdf: same body, NO AI metadata (control) ----
    clean_metadata = {
        "title": "Human-Written Research Report",
        "author": "John Doe",
        "creator": "Human Writer",
        "producer": "ReportLab",
        "subject": "Normal document",
    }
    clean_pages = [
        render_page_image(1, "CONTROL — NO AI WATERMARK"),
        render_page_image(2),
    ]
    clean_pdf = make_pdf_bytes(clean_pages, clean_metadata)

    clean_path = out_dir / "clean.pdf"
    clean_path.write_bytes(clean_pdf)
    print(f"Generated {clean_path} ({len(clean_pdf):,} bytes)")
    xmp_clean = extract_xmp(clean_pdf)
    info_clean = extract_info(clean_pdf)
    print(f"  XMP present: {bool(xmp_clean)}")
    print(f"  PDF Info: {info_clean}")


if __name__ == "__main__":
    main()

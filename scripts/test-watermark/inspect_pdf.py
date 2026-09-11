"""
inspect_pdf.py — Detailed inspection of PDF metadata before and after cleaning.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path


def extract_all_xmp(data: bytes) -> list[str]:
    """Extract all XMP packets."""
    return [m.group(0).decode("utf-8", errors="replace")
            for m in re.finditer(rb"<\?xpacket.*?\?>", data, re.DOTALL)]


def extract_info(data: bytes) -> dict:
    info = {}
    for field in ("Title", "Author", "Creator", "Producer", "Subject"):
        pattern = rb"/" + field.encode() + rb"\s*\((.*?)\)"
        m = re.search(pattern, data)
        if m:
            try:
                info[field.lower()] = m.group(1).decode("utf-8", errors="replace")
            except Exception:
                pass
    return info


def has_ai_markers(data: bytes) -> bool:
    """Check if data contains AI provenance markers."""
    lower = data.lower()
    if b"digitalsourcetype" in lower or b"trainedalgorithmicmedia" in lower:
        return True
    if b"softwareagent" in lower or b"adobe firefly" in lower:
        return True
    return False


def main() -> None:
    base = Path("scripts/test-watermark")

    for label, fname in [
        ("BEFORE (input.pdf — AI-watermarked)", "input.pdf"),
        ("AFTER  (cleaned_input.pdf)", "cleaned_input.pdf"),
        ("CONTROL BEFORE (clean.pdf)", "clean.pdf"),
        ("CONTROL AFTER (cleaned_clean.pdf)", "cleaned_clean.pdf"),
    ]:
        p = base / fname
        if not p.exists():
            print(f"{label}: FILE NOT FOUND")
            continue

        data = p.read_bytes()
        xmp_packets = extract_all_xmp(data)
        info = extract_info(data)
        has_ai = has_ai_markers(data)

        print(f"\n{'='*60}")
        print(f"  {label}")
        print(f"  Size: {len(data):,} bytes")
        print(f"  XMP packets found: {len(xmp_packets)}")
        for i, xmp in enumerate(xmp_packets):
            print(f"  XMP[{i}] ({len(xmp)} chars):")
            print(f"    {xmp[:200]}...")
        print(f"  PDF Info: {info}")
        print(f"  Contains AI markers: {has_ai}")


if __name__ == "__main__":
    main()

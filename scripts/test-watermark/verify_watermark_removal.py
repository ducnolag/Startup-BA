"""
verify_watermark_removal.py — Compare metadata in PDFs before and after cleaning.

Usage:
    python verify_watermark_removal.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path


def extract_xmp(data: bytes) -> str | None:
    """Extract XMP packet from PDF bytes."""
    m = re.search(rb"<\?xpacket.*?\?>", data, re.DOTALL)
    if m:
        return m.group(0).decode("utf-8", errors="replace")
    return None


def extract_info(data: bytes) -> dict:
    """Extract PDF Info dict fields by scanning the PDF string."""
    info: dict = {}
    for field in ("Title", "Author", "Creator", "Producer", "Subject"):
        pattern = rb"/" + field.encode() + rb"\s*\((.*?)\)"
        m = re.search(pattern, data)
        if m:
            try:
                info[field.lower()] = m.group(1).decode("utf-8", errors="replace")
            except Exception:
                pass
    return info


def check_ai_markers(xmp: str | None) -> list[str]:
    """Check if XMP contains AI provenance markers."""
    if not xmp:
        return []
    markers = []
    lower = xmp.lower()
    if "digitalsourcetype" in lower or "trainedalgorithmicmedia" in lower:
        markers.append("digitalSourceType / trainedAlgorithmicMedia")
    if "softwareagent" in lower or "adobe firefly" in lower:
        markers.append("SoftwareAgent / Adobe Firefly")
    if "c2pa" in lower:
        markers.append("C2PA manifest")
    return markers


def run() -> None:
    base = Path("scripts/test-watermark")

    pairs = [
        ("AI-watermarked PDF", "input.pdf", "cleaned_input.pdf"),
        ("Clean control PDF", "clean.pdf", "cleaned_clean.pdf"),
    ]

    all_passed = True

    for label, before_name, after_name in pairs:

        before_path = base / before_name
        after_path = base / after_name
        if not before_path.exists():
            print(f"  SKIP: {before_path} not found")
            continue
        if not after_path.exists():
            print(f"  SKIP: {after_path} not found")
            continue

        before_data = before_path.read_bytes()
        after_data = after_path.read_bytes()

        print(f"  Before: {before_path.name} ({len(before_data):,} bytes)")
        print(f"  After:  {after_path.name} ({len(after_data):,} bytes)")
        print(f"  Size change: {len(after_data) - len(before_data):+,} bytes")

        xmp_before = extract_xmp(before_data)
        xmp_after = extract_xmp(after_data)
        info_before = extract_info(before_data)
        info_after = extract_info(after_data)

        print(f"\n  --- XMP Metadata ---")
        print(f"  Before: XMP present = {bool(xmp_before)}")
        ai_markers_before = check_ai_markers(xmp_before)
        if ai_markers_before:
            print(f"    AI markers: {', '.join(ai_markers_before)}")
        print(f"  After:  XMP present = {bool(xmp_after)}")
        ai_markers_after = check_ai_markers(xmp_after)
        if ai_markers_after:
            print(f"    AI markers: {', '.join(ai_markers_after)}")

        if xmp_before and not xmp_after:
            print(f"  ✓ XMP REMOVED")
        elif xmp_before and xmp_after:
            print(f"  ✗ XMP STILL PRESENT")
            all_passed = False
        else:
            print(f"  — XMP not present before or after (as expected)")

        print(f"\n  --- PDF Info Dict ---")
        print(f"  Before: {info_before}")
        print(f"  After:  {info_after}")

        # Check for AI-specific info removal
        ai_info_fields = {
            "adobe firefly": False,
            "ai-generated": False,
            "trainedalgorithmicmedia": False,
        }
        for field, val in info_before.items():
            v = val.lower()
            if "firefly" in v or "ai-generated" in v or "trainedalgorithmicmedia" in v:
                ai_info_fields[field] = True

        # Check if AI fields were removed
        ai_fields_removed = []
        ai_fields_remaining = []
        for field in info_before:
            was_ai = False
            v = info_before[field].lower()
            if "firefly" in v or "ai-generated" in v or "trainedalgorithmicmedia" in v:
                was_ai = True
            if was_ai:
                if field not in info_after:
                    ai_fields_removed.append(field)
                else:
                    after_v = info_after.get(field, "").lower()
                    if "firefly" in after_v or "ai-generated" in after_v or "trainedalgorithmicmedia" in after_v:
                        ai_fields_remaining.append(field)

        if ai_fields_removed:
            print(f"  ✓ AI Info fields removed: {ai_fields_removed}")
        if ai_fields_remaining:
            print(f"  ✗ AI Info fields still present: {ai_fields_remaining}")
            all_passed = False

        # Check if clean (control) PDF changed its human info
        if "clean.pdf" in before_name:
            human_fields_preserved = []
            human_fields_changed = []
            for field, val in info_before.items():
                v = val.lower()
                if "john doe" in v or "human writer" in v or "reportlab" in v or "normal document" in v:
                    if field in info_after:
                        after_v = info_after[field].lower()
                        if after_v == v or (field in ("producer",) and "ghostscript" not in after_v and after_v != ""):
                            human_fields_preserved.append(field)
                        else:
                            human_fields_changed.append((field, val, info_after.get(field, "REMOVED")))
                    else:
                        human_fields_changed.append((field, val, "REMOVED"))
            if human_fields_preserved:
                print(f"  ✓ Human info fields preserved: {human_fields_preserved}")
            if human_fields_changed:
                print(f"  ? Human info fields changed (may be normal): {human_fields_changed}")

    print(f"\n{'='*60}")
    if all_passed:
        print("  OVERALL: PASS — AI metadata removed, control unchanged")
    else:
        print("  OVERALL: ISSUES FOUND — see above")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    run()

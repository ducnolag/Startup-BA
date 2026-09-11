"""
Compare metadata fields of two PDFs — useful for proving that the
watermark-remover sidecar strips Creator/Producer/Author/Title etc.

Usage:
  python compare_meta.py before.pdf after.pdf
"""
from __future__ import annotations

import os
import sys
import re
import subprocess

POPPLER_PDFINFO = r"D:\Startup-BA\scripts\test-watermark\poppler\poppler-24.08.0\Library\bin\pdfinfo.exe"


def parse_pdfinfo(path: str) -> dict[str, str]:
    if not os.path.isfile(POPPLER_PDFINFO):
        return {}
    out = subprocess.check_output(
        [POPPLER_PDFINFO, path], text=True, errors="ignore"
    )
    fields = {}
    for line in out.splitlines():
        m = re.match(r"^(\S.*?):\s+(.*)$", line)
        if m:
            fields[m.group(1)] = m.group(2)
    return fields


def hex_or_off(path: str) -> str:
    # Read raw PDF trailer for keys pdfinfo hides (Producer on some PDFs is hidden)
    with open(path, "rb") as f:
        data = f.read()
    matches = re.findall(rb"/(\w+)\s*\(([^)]*)\)", data)
    return {m[0].decode("ascii", "ignore"): m[1].decode("ascii", "ignore") for m in matches}


def main(before: str, after: str) -> int:
    print(f"before: {before}  size={os.path.getsize(before)}B")
    print(f"after : {after}   size={os.path.getsize(after)}B\n")
    fb = parse_pdfinfo(before)
    fa = parse_pdfinfo(after)
    hb = hex_or_off(before)
    ha = hex_or_off(after)

    print(f"{'Field':<14} {'BEFORE':<40} {'AFTER':<40}")
    print("-" * 100)
    keys = sorted(set(fb) | set(fa) | {"Creator", "Producer", "Author", "Title"})
    for k in keys:
        before_v = fb.get(k, "(empty)")
        after_v = fa.get(k, "(empty)")
        marker = "  ✘" if before_v != after_v and before_v != "(empty)" else "   "
        print(f"{k:<14} {marker} {before_v[:38]:<38} → {after_v[:38]:<38}")

    print("\nRaw trailer keys (Python regex):")
    for k in sorted(set(hb) | set(ha)):
        if k in ("Length", "Filter", "Type"):
            continue
        bv = hb.get(k, "")
        av = ha.get(k, "")
        if bv != av:
            print(f"  /{k:<18}  {bv!r:>40}  →  {av!r}")

    return 0


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    sys.exit(main(sys.argv[1], sys.argv[2]))

"""Render logo on dark background to verify transparency."""
from PIL import Image
from pathlib import Path

LOGO = Path(r"d:\Startup-BA\public\logo.png")
OUT = Path(r"d:\Startup-BA\scripts\logo_preview_dark.png")

logo = Image.open(LOGO).convert("RGBA")
w, h = logo.size

# Create dark navy background matching site theme
bg = Image.new("RGBA", (w, h), (2, 4, 9, 255))  # #020409
bg.paste(logo, (0, 0), logo)
bg.save(OUT)
print(f"Saved preview to {OUT}")

# Also check transparency by sampling corner pixel
print(f"Top-left pixel after script: {logo.getpixel((0, 0))}")
print(f"Center pixel (navy T): {logo.getpixel((w//2, h//2))}")
print(f"F wing area (cyan): {logo.getpixel((w//4, h//3))}")

# Count transparent pixels
transp = sum(1 for p in logo.getdata() if p[3] == 0)
print(f"Transparent pixels: {transp} ({transp * 100 / (w*h):.1f}%)")
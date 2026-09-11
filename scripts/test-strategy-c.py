"""Local unit test for Strategy C — verifies low-contrast logo overlay detection."""
import os
import sys
import numpy as np
import cv2

# Import the app module
sys.path.insert(0, r'D:\Startup-BA\apps\watermark-remover')
from app import _build_watermark_mask

# Create test image: white background with subtle Gemini-style logo overlay
def make_test_with_logo(size=(800, 600), logo_pos='bottom-right', logo_alpha=0.4):
    img = np.full((size[1], size[0], 3), 240, dtype=np.uint8)
    # Add some background texture so it's not uniform
    np.random.seed(42)
    noise = np.random.randint(-20, 20, img.shape, dtype=np.int16)
    img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)

    # Draw a "logo" — white-ish circle with text-like shape (low contrast on white)
    if logo_pos == 'bottom-right':
        cx, cy = int(size[0] * 0.85), int(size[1] * 0.85)
    elif logo_pos == 'top-left':
        cx, cy = int(size[0] * 0.15), int(size[1] * 0.15)
    else:
        cx, cy = size[0] // 2, size[1] // 2

    radius = 30
    # Subtle gray logo (close to background color)
    cv2.circle(img, (cx, cy), radius, (200, 200, 200), -1)
    # "G" letter
    cv2.circle(img, (cx, cy), radius - 8, (240, 240, 240), 3)
    cv2.line(img, (cx, cy), (cx + radius - 8, cy), (240, 240, 240), 3)
    return img, (cx, cy, radius)


# Test 1: logo in bottom-right corner
img, (cx, cy, r) = make_test_with_logo(logo_pos='bottom-right')
mask, stats = _build_watermark_mask(img)
print("Test 1 (bottom-right corner):")
print(f"  strategies: {stats.get('strategies_used')}")
print(f"  adapt pixels: {stats.get('adapt_pixels', 0)}")
print(f"  rect pixels: {stats.get('rect_pixels', 0)}")
print(f"  edge pixels: {stats.get('kept_edge', 0)}")
print(f"  total mask pixels: {stats.get('mask_pixels', 0)}")

# Check if the mask covers the logo area
ys, xs = np.where(mask > 0)
if len(xs) > 0:
    mx_min, mx_max = xs.min(), xs.max()
    my_min, my_max = ys.min(), ys.max()
    expected_x_min = cx - r - 10
    expected_x_max = cx + r + 10
    expected_y_min = cy - r - 10
    expected_y_max = cy + r + 10
    overlap_x = min(mx_max, expected_x_max) - max(mx_min, expected_x_min)
    overlap_y = min(my_max, expected_y_max) - max(my_min, expected_y_min)
    print(f"  mask bounds: x=[{mx_min},{mx_max}] y=[{my_min},{my_max}]")
    print(f"  logo expected: x=[{expected_x_min},{expected_x_max}] y=[{expected_y_min},{expected_y_max}]")
    print(f"  overlap: {overlap_x * overlap_y} sq px (positive = mask covers logo)")

# Test 2: clean image (no watermark) — should produce small/none mask
img_clean = np.full((600, 800, 3), 240, dtype=np.uint8)
np.random.seed(42)
noise = np.random.randint(-20, 20, img_clean.shape, dtype=np.int16)
img_clean = np.clip(img_clean.astype(np.int16) + noise, 0, 255).astype(np.uint8)
mask2, stats2 = _build_watermark_mask(img_clean)
print("\nTest 2 (clean image):")
print(f"  total mask pixels: {stats2.get('mask_pixels', 0)}")
print(f"  adapt pixels: {stats2.get('adapt_pixels', 0)}")

# Test 3: top-left corner logo
img3, (cx3, cy3, r3) = make_test_with_logo(logo_pos='top-left', size=(800, 600))
mask3, stats3 = _build_watermark_mask(img3)
print("\nTest 3 (top-left corner):")
print(f"  adapt pixels: {stats3.get('adapt_pixels', 0)}")
print(f"  total mask pixels: {stats3.get('mask_pixels', 0)}")

# Test 4: rectangle watermark like test_watermark.png
img4 = np.full((600, 800, 3), 0, dtype=np.uint8)
img4[:, :, 0] = 135  # skyblue-ish BGR
img4[:, :, 1] = 206
img4[:, :, 2] = 235
# Add rectangle watermark
cv2.rectangle(img4, (50, 450), (750, 550), (200, 200, 200), -1)
cv2.putText(img4, 'WATERMARK', (250, 480), cv2.FONT_HERSHEY_SIMPLEX, 1, (128, 128, 128), 2)
mask4, stats4 = _build_watermark_mask(img4)
print("\nTest 4 (test_watermark.png style):")
print(f"  rect pixels: {stats4.get('rect_pixels', 0)}")
print(f"  adapt pixels: {stats4.get('adapt_pixels', 0)}")
print(f"  total mask pixels: {stats4.get('mask_pixels', 0)}")

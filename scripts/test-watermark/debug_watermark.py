"""
Local debug script: load an image, run the visual watermark detector, save
the mask and intermediate steps to /work for inspection.
"""
import os
import sys
import numpy as np
from PIL import Image
import cv2

WORK = '/work'
src = os.path.join(WORK, 'test_watermark.png')
img = Image.open(src).convert('RGB')
bgr = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
h, w = bgr.shape[:2]
total = h * w
print('Image:', img.size, 'total:', total)

gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

# 1. MSER
union = np.zeros((h, w), dtype=np.uint8)
mser_mask = np.zeros_like(union)
mser = cv2.MSER_create(delta=5, min_area=60, max_area=int(total * 0.25))
regions, _ = mser.detectRegions(gray)
for r in regions:
    x, y, ww, hh = cv2.boundingRect(r)
    if ww * hh < 30:
        continue
    if ww * hh > total * 0.4:
        continue
    cv2.rectangle(mser_mask, (x, y), (x + ww, y + hh), 255, thickness=-1)
print('MSER mask pixels:', int(np.count_nonzero(mser_mask)))
cv2.imwrite(os.path.join(WORK, 'dbg_mser.png'), mser_mask)

# 2. Canny edges
blurred = cv2.GaussianBlur(gray, (3, 3), 0)
edges = cv2.Canny(blurred, 80, 200)
kernel = cv2.getStructuringElement(cv.MORPH_RECT, (3, 3))
edges_d = cv2.dilate(edges, kernel, iterations=1)
edge_mask = np.zeros_like(edges_d)
n_labels, labels, stats, _ = cv2.connectedComponentsWithStats(edges_d, connectivity=8)
for i in range(1, n_labels):
    area = int(stats[i, cv2.CC_STAT_AREA])
    if 30 <= area <= int(total * 0.4):
        edge_mask[labels == i] = 255
print('Edge mask pixels:', int(np.count_nonzero(edge_mask)))
cv2.imwrite(os.path.join(WORK, 'dbg_edge.png'), edge_mask)

# 3. Adaptive threshold
adapt = cv2.adaptiveThreshold(
    gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 25, 8,
)
adapt = cv2.morphologyEx(adapt, cv2.MORPH_OPEN, kernel, iterations=1)
n_labels, labels, stats, _ = cv2.connectedComponentsWithStats(adapt, connectivity=8)
adapt_clean = np.zeros_like(adapt)
for i in range(1, n_labels):
    area = int(stats[i, cv2.CC_STAT_AREA])
    if 30 <= area <= int(total * 0.4):
        adapt_clean[labels == i] = 255
print('Adaptive mask pixels:', int(np.count_nonzero(adapt_clean)))
cv2.imwrite(os.path.join(WORK, 'dbg_adapt.png'), adapt_clean)

# Union + dilate
union = cv2.bitwise_or(union, mser_mask)
union = cv2.bitwise_or(union, edge_mask)
union = cv2.bitwise_or(union, adapt_clean)
union = cv2.dilate(union, kernel, iterations=1)
print('Union mask pixels:', int(np.count_nonzero(union)))
cv2.imwrite(os.path.join(WORK, 'dbg_union.png'), union)

# Try inpaint
inpainted = cv2.inpaint(bgr, union, 3, cv2.INPAINT_NS)
cv2.imwrite(os.path.join(WORK, 'dbg_inpainted.png'), inpainted)

# Try inpaint with smaller mask (only the watermark region)
# Just the bottom band where WATERMARK sits
small_mask = np.zeros_like(union)
small_mask[450:550, 50:750] = 255  # only the gray rectangle
inpainted2 = cv2.inpaint(bgr, small_mask, 3, cv2.INPAINT_NS)
cv2.imwrite(os.path.join(WORK, 'dbg_inpainted_manual.png'), inpainted2)
print('Manual mask pixels:', int(np.count_nonzero(small_mask)))
print('Saved debug images')

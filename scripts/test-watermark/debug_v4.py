"""
Local debug: trace what the new color uniformity detector sees.
"""
import os
import numpy as np
from PIL import Image
import cv2

WORK = '/work'
src = os.path.join(WORK, 'test_watermark.png')
img = Image.open(src).convert('RGB')
bgr = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
h, w = bgr.shape[:2]
print('Image:', img.size, 'total pixels:', h * w)

gray = cv.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
scale = max(4, min(8, w // 80))
print('Cell scale:', scale)
cells_h = h // scale
cells_w = w // scale
print('Cells:', cells_h, 'x', cells_w)
trimmed = gray[: cells_h * scale, : cells_w * scale]
cell_data = trimmed.reshape(cells_h, scale, cells_w, scale)
cell_mean = cell_data.mean(axis=(1, 3)).astype(np.float32)
cell_std = cell_data.std(axis=(1, 3))

UNIFORM_THRESH = 8.0
uniform_cells = cell_std < UNIFORM_THRESH
print('Total uniform cells:', int(np.count_nonzero(uniform_cells)))

# Save the uniformity map as image for visualization
vis = (uniform_cells * 255).astype(np.uint8)
vis_up = cv2.resize(vis, (w, h), interpolation=cv.INTER_NEAREST)
cv2.imwrite(os.path.join(WORK, 'dbg_uniform_v4.png'), vis_up)

# Compute the rectangle position vs the detected uniform cells
# Original rectangle was at (50,450)-(750,550)
# Each cell is 8x8. Cells at rows 450//8=56 to 550//8=68, cols 50//8=6 to 750//8=93
rect_cells = uniform_cells[56:69, 6:94]
print('Rect region uniform cells:', int(np.count_nonzero(rect_cells)), '/', rect_cells.size)

# Look at stddev values within the rect region
rect_std = cell_std[56:69, 6:94]
print('Rect std range:', rect_std.min(), 'to', rect_std.max())
print('Mean std in rect:', float(rect_std.mean()))

# Save mask after connected components
mask2 = (uniform_cells * 255).astype(np.uint8)
mask2_full = cv2.resize(mask2, (w, h), interpolation=cv.INTER_NEAREST)
n_labels, labels, stats, _ = cv.connectedComponentsWithStats(mask2_full, connectivity=8)
print('Connected components in mask2:', n_labels - 1)
for i in range(1, min(6, n_labels)):
    area = int(stats[i, cv.CC_STAT_AREA])
    print(f'  CC {i}: area={area}, x={int(stats[i, cv.CC_STAT_LEFT])}, y={int(stats[i, cv.CC_STAT_TOP])}, w={int(stats[i, cv.CC_STAT_WIDTH])}, h={int(stats[i, cv.CC_STAT_HEIGHT])}')

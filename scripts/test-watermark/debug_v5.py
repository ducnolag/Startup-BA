from PIL import Image
import numpy as np
import cv2

img = Image.open('test_watermark.png').convert('RGB')
bgr = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
h, w = bgr.shape[:2]
gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

print('Image:', img.size)

scale = 8
cells_h, cells_w = h // scale, w // scale
trimmed = gray[:cells_h * scale, :cells_w * scale]
cell_data = trimmed.reshape(cells_h, scale, cells_w, scale)
cell_std = cell_data.std(axis=(1, 3))

print('Cell std range:', cell_std.min(), cell_std.max())
print('Cell std mean:', float(cell_std.mean()))
print('Cells with std<5:', int(np.count_nonzero(cell_std < 5)))
print('Cells with std<8:', int(np.count_nonzero(cell_std < 8)))
print('Cells with std<15:', int(np.count_nonzero(cell_std < 15)))
rect_std = cell_std[56:69, 6:94]
print('Rect std range:', rect_std.min(), 'to', rect_std.max())
print('Rect cells std<5:', int(np.count_nonzero(rect_std < 5)))
print('Rect cells std<15:', int(np.count_nonzero(rect_std < 15)))

# Build the uniform mask and check its connected components
uniform_cells = (cell_std < 8).astype(np.uint8)
mask2 = np.repeat(np.repeat(uniform_cells, scale, axis=0), scale, axis=1)
print('mask2 shape:', mask2.shape)
cv2.imwrite('dbg_uniform.png', mask2 * 255)
n_labels, labels, stats, _ = cv2.connectedComponentsWithStats(mask2 * 255, connectivity=8)
print('Connected components:', n_labels - 1)
for i in range(1, min(10, n_labels)):
    area = int(stats[i, cv.CC_STAT_AREA])
    x = int(stats[i, cv.CC_STAT_LEFT])
    y = int(stats[i, cv.CC_STAT_TOP])
    ww = int(stats[i, cv.CC_STAT_WIDTH])
    hh = int(stats[i, cv.CC_STAT_HEIGHT])
    print(f'  CC {i}: area={area}, x={x}, y={y}, w={ww}, h={hh}, aspect={ww/max(hh,1):.2f}')

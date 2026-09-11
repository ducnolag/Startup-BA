from PIL import Image
import os

WORK_DIR = '/work'

before_path = os.path.join(WORK_DIR, 'test_watermark.png')
after_path = os.path.join(WORK_DIR, 'cleaned_v2.png')

if os.path.exists(before_path) and os.path.exists(after_path):
    before = Image.open(before_path)
    after = Image.open(after_path)
    print('Before:', before.size, before.mode)
    print('After :', after.size, after.mode)

    with open(before_path, 'rb') as f:
        b1 = f.read()
    with open(after_path, 'rb') as f:
        b2 = f.read()
    print('Bytes identical:', b1 == b2)
    print('Size before:', len(b1))
    print('Size after :', len(b2))

    # Compute per-pixel diff in the watermark region (bottom band 450-550).
    ba = np.array(before) if False else None
    import numpy as np
    arr_b = np.array(before.convert('RGB'))
    arr_a = np.array(after.convert('RGB'))
    h, w, _ = arr_b.shape
    # Bottom band where the watermark rectangle was placed
    band_b = arr_b[450:550, 50:750].astype(np.int16)
    band_a = arr_a[450:550, 50:750].astype(np.int16)
    diff = np.abs(band_b - band_a).sum()
    print('Pixel diff (bottom band 450-550):', diff, 'mean per channel:', diff / band_b.size)
else:
    print('Files missing')

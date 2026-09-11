from PIL import Image
import os

WORK_DIR = '/work'

before_path = os.path.join(WORK_DIR, 'test_watermark.png')
after_path = os.path.join(WORK_DIR, 'cleaned_test.png')

if os.path.exists(before_path) and os.path.exists(after_path):
    before = Image.open(before_path)
    after = Image.open(after_path)
    print('Before:', before.size, before.mode)
    print('After:', after.size, after.mode)

    # Check if files are byte-identical
    with open(before_path, 'rb') as f:
        b1 = f.read()
    with open(after_path, 'rb') as f:
        b2 = f.read()
    print('Bytes identical:', b1 == b2)
    print('Size before:', len(b1))
    print('Size after:', len(b2))
    print('Diff:', len(b1) - len(b2), 'bytes')
else:
    print('Files missing')
    print('before exists:', os.path.exists(before_path))
    print('after exists:', os.path.exists(after_path))

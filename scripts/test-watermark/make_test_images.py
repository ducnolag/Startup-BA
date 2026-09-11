from PIL import Image, ImageDraw
import os

OUT_DIR = '/work'

# Image with visible watermark
img = Image.new('RGB', (800, 600), 'skyblue')
d = ImageDraw.Draw(img)
d.text((100, 50), 'Sample Article', fill='darkblue')
d.text((100, 100), 'This is a sample document with text content.', fill='black')
d.rectangle([50, 450, 750, 550], fill='lightgray')
d.text((250, 480), 'WATERMARK', fill='gray')
img.save(os.path.join(OUT_DIR, 'test_watermark.png'))
print('test_watermark.png saved')

# Clean test image
img2 = Image.new('RGB', (800, 600), 'white')
d2 = ImageDraw.Draw(img2)
d2.text((100, 50), 'This is a sample document with English text.', fill='black')
d2.text((100, 100), 'It contains multiple lines of content.', fill='black')
d2.text((100, 150), 'Translation test.', fill='black')
img2.save(os.path.join(OUT_DIR, 'control_clean.png'))
print('control_clean.png saved')

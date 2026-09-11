$py = 'D:\Startup-BA\scripts\test-watermark\pdf-test-env\Scripts\python.exe'
& $py -m pip install --quiet opencv-python-headless numpy Pillow
& $py -c "import cv2; import numpy; import PIL; print('cv2:', cv2.__version__); print('numpy:', numpy.__version__); print('PIL:', PIL.__version__)"

"""Remove white background from logo.png — flood-fill from corners.

Smarter approach: only remove pixels that are CONNECTED to the corners.
This preserves intentional white highlights inside the logo design.
"""
from PIL import Image
from collections import deque
from pathlib import Path

SRC = Path(r"d:\Startup-BA\public\logo.png")

img = Image.open(SRC).convert("RGBA")
pixels = img.load()
w, h = img.size

# Tolerance: how close to white before we treat as BG
TOLERANCE = 12  # pixels with R,G,B all within 12 of 255 are "white"

def is_white(r, g, b):
    return r >= 255 - TOLERANCE and g >= 255 - TOLERANCE and b >= 255 - TOLERANCE

# BFS flood fill from all 4 corners, plus the entire border edge
visited = [[False] * h for _ in range(w)]
queue = deque()

# Seed: top row, bottom row, left col, right col (border)
for x in range(w):
    for y in (0, h - 1):
        r, g, b, a = pixels[x, y]
        if is_white(r, g, b) and not visited[x][y]:
            visited[x][y] = True
            queue.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        r, g, b, a = pixels[x, y]
        if is_white(r, g, b) and not visited[x][y]:
            visited[x][y] = True
            queue.append((x, y))

# BFS
while queue:
    x, y = queue.popleft()
    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
            r, g, b, a = pixels[nx, ny]
            if is_white(r, g, b):
                visited[nx][ny] = True
                queue.append((nx, ny))

# Now set alpha = 0 for all visited (BG) pixels
changed = 0
for x in range(w):
    for y in range(h):
        if visited[x][y]:
            r, g, b, _ = pixels[x, y]
            pixels[x, y] = (r, g, b, 0)
            changed += 1

# Edge smoothing: for non-visited pixels right next to visited ones,
# reduce alpha proportionally to closeness to white (anti-aliasing fix)
edge_changed = 0
for x in range(w):
    for y in range(h):
        if visited[x][y]:
            continue
        r, g, b, a = pixels[x, y]
        if a == 0:
            continue
        whiteness = min(r, g, b) / 255.0
        if whiteness > 0.92:
            # Has a white neighbour → it's an edge pixel of the logo
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and visited[nx][ny]:
                    # Blend with BG by reducing alpha based on whiteness
                    new_alpha = int(a * (1.0 - (whiteness - 0.92) / 0.08))
                    pixels[x, y] = (r, g, b, max(0, min(a, new_alpha)))
                    edge_changed += 1
                    break

print(f"Image size: {w}x{h}")
print(f"Flood-fill BG pixels removed: {changed} ({changed * 100 / (w * h):.1f}%)")
print(f"Edge pixels softened: {edge_changed}")

img.save(SRC, "PNG", optimize=True)
print(f"\n✓ Saved transparent-bg logo to {SRC}")
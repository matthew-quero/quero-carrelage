"""Reproduce delivery assets from the original images and fonts (Pillow + fontTools[woff])."""
from pathlib import Path
from PIL import Image
from fontTools.ttLib import TTFont
from io import BytesIO
root = Path(__file__).resolve().parents[1]
photos = root / 'assets/photos'
def save_webp(image, filename, quality):
    buffer = BytesIO()
    image.save(buffer, 'WEBP', quality=quality, method=6)
    data = buffer.getvalue()
    Image.open(BytesIO(data)).verify()
    (photos / filename).write_bytes(data)
for n in range(4):
    font = TTFont(root / f'assets/fonts/font-{n}.ttf')
    font.flavor = 'woff2'
    font.save(root / f'assets/fonts/font-{n}.woff2')
for name in ['service-interieur', 'service-faience', 'service-terrasse', 'reference-01', 'reference-02', 'reference-03']:
    image = Image.open(photos / (name + '.jpg')).convert('RGB')
    if name.startswith('service-'):
        save_webp(image, name + '.webp', 84)
        image.thumbnail((800, 800), Image.Resampling.LANCZOS)
        save_webp(image, name + '-800.webp', 84)
    else:
        save_webp(image, name + '.webp', 84)
image = Image.open(photos / 'carreau-anthracite-hd.webp').convert('RGB')
save_webp(image, 'tile-surface.webp', 90)
image.thumbnail((768, 768), Image.Resampling.LANCZOS)
save_webp(image, 'tile-surface-mobile.webp', 88)
for path in sorted(photos.glob('*.webp')):
    if path.name != 'carreau-anthracite-hd.webp':
        print(path.name, path.stat().st_size)

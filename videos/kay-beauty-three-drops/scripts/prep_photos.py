"""Crop the brand's own product-page photos (assets/photo/*.jpg, fetched by scripts/fetch_sources.sh) for 9:16.
Baked-in infographic text that falls inside a crop sits on plain studio background; it is filled by interpolating
vertically between the clean rows just above and below it, so only our own type ever appears on screen."""
from PIL import Image, ImageFilter
import numpy as np, os

SRC = os.path.join(os.path.dirname(__file__), '..', 'assets', 'photo')
OUT = os.path.join(SRC, 'cut')
os.makedirs(OUT, exist_ok=True)

def clean(im, box):
    a = np.asarray(im).astype(np.float32).copy()
    x0, y0, x1, y1 = box
    top, bot = a[y0 - 1, x0:x1], a[y1 + 1, x0:x1]
    for y in range(y0, y1 + 1):
        k = (y - y0 + 1) / (y1 - y0 + 2)
        a[y, x0:x1] = top * (1 - k) + bot * k
    rng = np.random.default_rng(7)
    a[y0:y1 + 1, x0:x1] += rng.normal(0, 1.2, a[y0:y1 + 1, x0:x1].shape)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

def save(im, name, size=None, q=93):
    if size: im = im.resize(size, Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=40, threshold=2))
    im.save(os.path.join(OUT, name), quality=q)
    print(name, im.size)

# Katrina holding the Water Crème jar: crop the left of the infographic, clear the headline's first letters
im = Image.open(os.path.join(SRC, 'creme_katrina_jar.jpg')).convert('RGB')
im = clean(im, (538, 284, 607, 514))
save(im.crop((36, 0, 606, 1013)), 'katrina_jar.jpg', (1080, 1920))

# Katrina portrait (Water Crème claims card): clear the edge of the two-line headline
im = Image.open(os.path.join(SRC, 'creme_katrina_face.jpg')).convert('RGB')
im = clean(im, (444, 104, 561, 210))
save(im.crop((0, 0, 560, 996)), 'katrina_face.jpg', (1080, 1920))

# Rudrapriya, Katrina Kaif (wearing Honey) and Janhavi: drop the name captions, our type replaces them
im = Image.open(os.path.join(SRC, 'lip_trio_katrina.jpg')).convert('RGB')
save(im.crop((0, 0, 1000, 820)), 'trio.jpg')

# Gloss Stain before/after macro: the lips only, between the two baked-in captions
im = Image.open(os.path.join(SRC, 'lip_glossy_finish.jpg')).convert('RGB')
save(im.crop((0, 430, 1750, 1250)), 'lips_split.jpg')

# Arm swatches: the middle arm, the brand's own shade labels stay (they are the shade names)
im = Image.open(os.path.join(SRC, 'lip_swatches.jpg')).convert('RGB')
save(im.crop((735, 0, 1200, 1750)), 'swatch_arm.jpg')

# shade bottles: square product shots on white, kept as-is
for i in range(8):
    Image.open(os.path.join(SRC, f'lip_s{i}.jpg')).convert('RGB').save(os.path.join(OUT, f'shade{i}.jpg'), quality=92)
Image.open(os.path.join(SRC, 'cushion_packshot.jpg')).convert('RGB').save(os.path.join(OUT, 'cushion_pack.jpg'), quality=92)

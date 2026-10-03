"""Rebuild the official Kay Beauty mark at 8x from the 141 px PNG the website serves (no larger original exists online).
The alpha is upsampled bicubically, softened, and pushed through a smoothstep around 50 %, which restores clean brush edges
without redrawing anything. Writes assets/brand/kay-logo-mask.png (alpha) and kay-logo-ink.png (ink #2E1E1B). Run from the project root."""
from PIL import Image, ImageFilter
import numpy as np, os

K = 8
im = Image.open('research/logo/kay-logo_2.png').convert('RGBA')
a = Image.fromarray(np.asarray(im)[:, :, 3])
u = np.asarray(a.resize((im.width * K, im.height * K), Image.BICUBIC).filter(ImageFilter.GaussianBlur(K * 0.55))).astype(np.float32) / 255
m = np.clip((u - 0.40) / 0.20, 0, 1); m = m * m * (3 - 2 * m)
out = np.zeros((*u.shape, 4), np.uint8); out[..., 3] = (m * 255).astype(np.uint8)
o = Image.fromarray(out); bb = o.getbbox(); o = o.crop((bb[0] - 8, bb[1] - 8, bb[2] + 8, bb[3] + 8))
os.makedirs('assets/brand', exist_ok=True)
o.save('assets/brand/kay-logo-mask.png')
ink = Image.new('RGBA', o.size, (0x2E, 0x1E, 0x1B, 0)); ink.putalpha(o.split()[3]); ink.save('assets/brand/kay-logo-ink.png')
print('logo', o.size)

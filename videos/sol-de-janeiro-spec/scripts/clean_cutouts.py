"""Trim the packshot shadow off the bottle cut-outs (assets/cut/<NN>.png, in place). The light comes from the right, so
each bottle's shadow falls to its lower left and the segmenter keeps part of it. The bottles are symmetric and their
right edges are clean: the axis comes from the cap rows, and each row's left edge is the mirror of its right edge
(2 px soft ramp). Rows with no right edge (the shadow under the base) are cleared. Run after prep_cutouts.py."""
import glob, numpy as np
from PIL import Image
for f in sorted(glob.glob('assets/cut/*.png')):
    im = Image.open(f).convert('RGBA'); a = np.asarray(im).copy(); al = a[..., 3].astype(float) / 255
    h, w = al.shape; on = al > 0.5
    cap = [(np.argmax(on[y]), w - 1 - np.argmax(on[y][::-1])) for y in range(int(h * 0.04), int(h * 0.28)) if on[y].any()]
    axis = float(np.median([(l + r) / 2 for l, r in cap]))
    xs = np.arange(w)[None, :]
    for y in range(h):
        right = on[y, int(axis):]
        if not right.any(): al[y] = 0; continue
        xr = int(axis) + len(right) - 1 - np.argmax(right[::-1])
        xl = 2 * axis - xr
        al[y] *= np.clip((xs[0] - (xl - 1)) / 2, 0, 1)
    a[..., 3] = (al * 255).astype(np.uint8)
    out = Image.fromarray(a); bb = out.split()[-1].point(lambda v: 255 if v > 10 else 0).getbbox(); out = out.crop(bb)
    k = 1100 / out.height; out = out.resize((round(out.width * k), 1100), Image.LANCZOS); out.save(f, optimize=True)
    print(f, 'axis', round(axis, 1), out.size)

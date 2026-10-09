"""Vectorise the Underneat logo from the brand's own film end card (white mark + "underneat.in" on coral #EB6242):
key white against the coral at 4x Lanczos, trace with potracer (pure-Python Potrace, GPL-2), write a white SVG.
  <venv>/bin/python scripts/trace_logo.py <endcard.png> assets/brand/underneat-logo-white.svg"""
import sys, numpy as np, potrace
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
x0, y0, x1, y1 = 180, 437, 426, 634                     # the mark + wordmark on the 606x1080 end card
im = im.crop((x0, y0, x1, y1)); K = 4
im = im.resize((im.width * K, im.height * K), Image.LANCZOS)
a = np.asarray(im).astype(float); bg = np.array([235, 98, 66], float)
white = np.clip((a - bg) / (255 - bg + 1e-6), 0, 1).min(2) > 0.5
bm = potrace.Bitmap(~white)               # potracer traces the False pixels: invert so the letters are the shapes
plist = bm.trace(turdsize=8, alphamax=1.0, opticurve=True, opttolerance=0.2)
parts = []
for curve in plist:
    s = curve.start_point; d = [f'M{s.x:.1f},{s.y:.1f}']
    for seg in curve.segments:
        if seg.is_corner: d.append(f'L{seg.c.x:.1f},{seg.c.y:.1f}L{seg.end_point.x:.1f},{seg.end_point.y:.1f}')
        else: d.append(f'C{seg.c1.x:.1f},{seg.c1.y:.1f} {seg.c2.x:.1f},{seg.c2.y:.1f} {seg.end_point.x:.1f},{seg.end_point.y:.1f}')
    parts.append(''.join(d) + 'Z')
W, H = white.shape[1], white.shape[0]
open(out, 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
                     f'<path fill="#FFFFFF" fill-rule="evenodd" d="{" ".join(parts)}"/></svg>')
print(out, W, H, len(parts), 'paths')

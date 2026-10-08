"""Cut the Ultralip tube out of Glossier's packshot (a grey-white #F7F7F7 studio ground with a soft shadow to the right):
foreground = pixels more than 9 levels from the ground, limited to the tube's body columns (which drops the shadow),
largest component, holes filled, a 0.8 px feathered edge.  python3 scripts/cut_tube.py <packshot.png> <out.png>"""
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
src, out = sys.argv[1], sys.argv[2]
a = np.array(Image.open(src).convert('RGB')).astype(int)
fg = np.abs(a - np.array([247, 247, 247])).max(2) > 9
cols = np.where(fg[1200:1450].mean(0) > 0.9)[0]; L, R = cols.min(), cols.max()   # the body: solid in the mid rows
fg[:, :L - 2] = False; fg[:, R + 3:] = False
lab, n = ndimage.label(fg); keep = lab == (np.argmax(ndimage.sum(fg, lab, range(1, n + 1))) + 1)
keep = ndimage.binary_fill_holes(keep)
ys, xs = np.where(keep)
im = Image.open(src).convert('RGB'); im.putalpha(Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)))
im.crop((xs.min() - 4, ys.min() - 4, xs.max() + 5, ys.max() + 5)).save(out)
print(out, im.crop((xs.min() - 4, ys.min() - 4, xs.max() + 5, ys.max() + 5)).size)

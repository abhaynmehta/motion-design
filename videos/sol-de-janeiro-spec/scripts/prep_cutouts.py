"""Cut the Cheirosa perfume mist bottles out of the site's packshots (assets/products/<NN>_00.jpg) with MediaPipe's
point-prompt segmenter (magic_touch, Apache-2.0): one tap on the centre of each bottle.
Run from the project root:  <venv with mediapipe>/bin/python scripts/prep_cutouts.py <magic_touch.tflite>
Writes assets/cut/<NN>.png (RGBA, tight, 1100 px tall)."""
import os, sys, glob, numpy as np
from PIL import Image, ImageFilter
import mediapipe as mp
from mediapipe.tasks import python as mpt
from mediapipe.tasks.python import vision
from mediapipe.tasks.python.components import containers
seg = vision.InteractiveSegmenterLegacy.create_from_options(vision.InteractiveSegmenterLegacyOptions(base_options=mpt.BaseOptions(model_asset_path=sys.argv[1])))
ROI = vision.InteractiveSegmenterLegacyRegionOfInterest
os.makedirs('assets/cut', exist_ok=True)
def cut(src, out, size, tall):
    im = Image.open(src).convert('RGB'); a = np.asarray(im)
    r = seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB, data=a), ROI(format=ROI.Format.KEYPOINT, keypoint=containers.keypoint.NormalizedKeypoint(0.5, 0.5)))
    m = r.confidence_masks[0].numpy_view(); m = m[..., 0] if m.ndim == 3 else m
    alpha = Image.fromarray((np.clip((m - 0.3) / 0.4, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1))
    rgba = im.copy(); rgba.putalpha(alpha); bb = alpha.point(lambda v: 255 if v > 10 else 0).getbbox(); rgba = rgba.crop(bb)
    k = size / (rgba.height if tall else max(rgba.size)); rgba = rgba.resize((round(rgba.width * k), round(rgba.height * k)), Image.LANCZOS)
    rgba.save(out, optimize=True); return rgba.size
for f in sorted(glob.glob('assets/products/*_00.jpg')):
    n = os.path.basename(f)[:-7]
    print(n, cut(f, f'assets/cut/{n}.png', 1100, True))
os._exit(0)

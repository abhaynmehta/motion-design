"""Cut the SPF 50 tube out of Minimalist's packshot (white tube on a light grey studio ground) with MediaPipe's
interactive segmenter (magic_touch, Apache-2.0), prompted with points on the tube; the result is cleaned to the largest
component, holes filled, edge feathered 1 px, cropped.
  <venv>/bin/python scripts/cut_tube.py <magic_touch.tflite> <packshot.jpg> <out.png>"""
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
import mediapipe as mp
from mediapipe.tasks import python as mpt
from mediapipe.tasks.python import vision
from mediapipe.tasks.python.components import containers
model, src, out = sys.argv[1:4]
img = Image.open(src).convert('RGB'); W, H = img.size
# mediapipe >= 1.x keeps the keypoint-prompt API as *Legacy; older versions use the plain names
Seg = getattr(vision, 'InteractiveSegmenterLegacy', vision.InteractiveSegmenter)
Opt = getattr(vision, 'InteractiveSegmenterLegacyOptions', vision.InteractiveSegmenterOptions)
ROI = getattr(vision, 'InteractiveSegmenterLegacyRegionOfInterest', getattr(vision, 'InteractiveSegmenterRegionOfInterest', None))
seg = Seg.create_from_options(Opt(base_options=mpt.BaseOptions(model_asset_path=model), output_confidence_masks=True, output_category_mask=False))
acc = np.zeros((H, W), np.float32)
for x, y in [(0.5, 0.35), (0.5, 0.55), (0.5, 0.8)]:          # the tube body, its label, the cap
    roi = ROI(format=ROI.Format.KEYPOINT,
                                                      keypoint=containers.keypoint.NormalizedKeypoint(x, y))
    r = seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.array(img)), roi)
    acc = np.maximum(acc, np.squeeze(r.confidence_masks[0].numpy_view()).astype(np.float32))
m = acc > 0.5
lab, n = ndimage.label(m); m = lab == (np.argmax(ndimage.sum(m, lab, range(1, n + 1))) + 1); m = ndimage.binary_fill_holes(m)
ys, xs = np.where(m)
a = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
img.putalpha(a); c = img.crop((xs.min() - 6, ys.min() - 6, xs.max() + 7, ys.max() + 7)); c.save(out); print(out, c.size)

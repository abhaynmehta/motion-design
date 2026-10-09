"""Person mattes for the shots in shots.json marked "matte": true (MediaPipe selfie_multiclass, Apache-2.0).
Run from the project root with the venv that has mediapipe:  <venv>/bin/python scripts/prep_mattes.py <model.tflite>
Reads assets/frames/<shot>/NNNN.jpg, writes assets/mattes/<shot>/NNNN.png: white RGBA whose alpha is the person matte, at
FULL frame size, refined with an edge-aware guided filter against the frame itself (crisp hair and shoulder edges). Temporal smoothing (forward + backward EMA) keeps hair edges from flickering;
a smoothstep tightens the edge. "sticker": [frame indices] also writes NNNN_outline.png, the matte dilated by ~1.5 % of the
frame (a white sticker border)."""
import json, os, sys, numpy as np
from PIL import Image, ImageFilter
import mediapipe as mp
from mediapipe.tasks import python as mpt
from mediapipe.tasks.python import vision
model = sys.argv[1]
S = json.load(open('shots.json'))['shots']
seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
    base_options=mpt.BaseOptions(model_asset_path=model), output_confidence_masks=True, output_category_mask=False))
def box(x, r):                                        # mean over a (2r+1)^2 window, edge-clamped (integral image)
    p = np.pad(x, ((r + 1, r), (r + 1, r)), mode='edge'); c = p.cumsum(0).cumsum(1); k = 2 * r + 1
    return (c[k:, k:] - c[:-k, k:] - c[k:, :-k] + c[:-k, :-k]) / (k * k)
def guided(I, p, r, eps):
    mI, mp_ = box(I, r), box(p, r); cov = box(I * p, r) - mI * mp_; var = box(I * I, r) - mI * mI
    A_ = cov / (var + eps); B_ = mp_ - A_ * mI
    return box(A_, r) * I + box(B_, r)
def smoothstep(x, a, b): t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
for name, sh in S.items():
    if not sh.get('matte') and not sh.get('sticker'): continue
    if len(sys.argv) > 2 and name not in sys.argv[2:]: continue
    src = f'assets/frames/{name}'; out = f'assets/mattes/{name}'; os.makedirs(out, exist_ok=True)
    files = sorted(f for f in os.listdir(src) if f.endswith('.jpg'))
    raw = []
    for f in files:
        im0 = Image.open(os.path.join(src, f)).convert('RGB'); im = np.asarray(im0.resize((im0.width // 2, im0.height // 2), Image.LANCZOS))
        r = seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB, data=im))
        raw.append(1.0 - np.squeeze(r.confidence_masks[0].numpy_view()[..., 0] if np.ndim(r.confidence_masks[0].numpy_view()) == 3 else r.confidence_masks[0].numpy_view()))   # 1 - P(background)
    A = np.stack(raw).astype(np.float32)
    k = 0.55; fw = A.copy(); bw = A.copy()
    for i in range(1, len(A)): fw[i] = k * A[i] + (1 - k) * fw[i - 1]
    for i in range(len(A) - 2, -1, -1): bw[i] = k * A[i] + (1 - k) * bw[i + 1]
    A = 0.5 * (fw + bw)
    H, W = A.shape[1:]
    for i, f in enumerate(files):
        a = smoothstep(A[i], 0.3, 0.7)
        # full size + guided filter (He et al.): the frame's own edges sharpen the model's soft, low-res mask
        full = Image.open(os.path.join(src, f)).convert('L'); I = np.asarray(full, np.float32) / 255
        p = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).resize(full.size, Image.BILINEAR), np.float32) / 255
        a = np.clip(guided(I, p, 6, 2e-3), 0, 1)
        a = smoothstep(a, 0.15, 0.85)
        m = Image.fromarray((a * 255).astype(np.uint8))
        white = Image.new('L', m.size, 255)
        Image.merge('RGBA', (white, white, white, m)).save(os.path.join(out, f.replace('.jpg', '.png')), optimize=True)
        if i in (sh.get('sticker') or []):
            # a sticker wants one clean shape: confident pixels only, the largest blob, small holes closed
            import cv2
            hard = (np.asarray(m) > 170).astype(np.uint8)
            n, lab, st, _ = cv2.connectedComponentsWithStats(hard)
            if n > 1: hard = (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
            hard = cv2.morphologyEx(hard, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
            cut = Image.fromarray(hard * 255).filter(ImageFilter.GaussianBlur(1.2))
            Image.merge('RGBA', (white, white, white, cut)).save(os.path.join(out, f.replace('.jpg', '_sticker.png')))
            r = max(3, int(W * 0.012)) | 1
            o = Image.fromarray(hard * 255).filter(ImageFilter.MaxFilter(r)).filter(ImageFilter.MaxFilter(r)).filter(ImageFilter.GaussianBlur(1.2))
            Image.merge('RGBA', (white, white, white, o)).save(os.path.join(out, f.replace('.jpg', '_outline.png')))
    print(name, len(files), 'mattes')
os._exit(0)   # mediapipe's segmenter raises in __del__ at interpreter shutdown

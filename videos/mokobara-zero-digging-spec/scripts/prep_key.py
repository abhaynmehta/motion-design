"""Key the white studio sweep out of Mokobara's films and put the bag on the reel's ground. Run from the project root
after prep_frames.py, with a Python that has numpy, scipy and pillow (+ mediapipe for 'protect'):
  <venv>/bin/python scripts/prep_key.py [magic_touch.tflite] [shot ...]
For every shot in shots.json with a "key" block, each frame in assets/frames/<shot>/:
  1. background = near-white, unsaturated pixels connected to the frame border, grown a little into the soft grey of the
     sweep; alpha refined edge-aware with a guided filter against the frame itself (He et al.), then lightly smoothed
     over time (forward + backward EMA) so edges don't shimmer;
  2. 'protect': [{pt: [x, y], pt2: [x, y], frames: [a, b], box: [x0, y0, x1, y1]}, ...] → MediaPipe magic-touch masks
     (Apache-2.0) forced opaque: white things the key would eat (the phone). pt moves linearly to pt2 over frames a..b;
     the mask is kept only inside box (normalised); a plain [x, y] protects every frame. 'grow': how far (px) the key may
     eat into the grey of the sweep (default 18; more where contact shadows pool and the subject is protected);
     'holes': [x0, y0, x1, y1]: white pockets of the sweep enclosed by arms and straps (not touching the border) whose
     centre lies in this box are background too;
  3. edge colours decontaminated (the white the edge pixels carry is solved out), the sweep's contact shadows kept as a
     shade of the ground;
  4. 'feather': {top: px} fades a cut edge into the ground;
  5. written over the JPEG on the ground colour, or as NNNN.png with alpha ("out": "rgba"; shadows as soft black).
film/shots.js gets "ext": "png" for rgba shots."""
import json, os, sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi

def box(x, r):
    p = np.pad(x, ((r + 1, r), (r + 1, r)), mode='edge'); c = p.cumsum(0).cumsum(1); k = 2 * r + 1
    return (c[k:, k:] - c[:-k, k:] - c[k:, :-k] + c[:-k, :-k]) / (k * k)
def guided(I, p, r, eps):
    mI, mp_ = box(I, r), box(p, r); cov = box(I * p, r) - mI * mp_; var = box(I * I, r) - mI * mI
    A_ = cov / (var + eps); B_ = mp_ - A_ * mI
    return box(A_, r) * I + box(B_, r)
def ss(x, a, b): t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def hexrgb(h): h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255

def key(f, grow=18, holes=None):
    """f: HxWx3 float 0-1 → (alpha before refinement, sweep level map, shade)"""
    mn, mx = f.min(2), f.max(2); sat = (mx - mn) / (mx + 1e-4); L = f.mean(2)
    core = (mn > 0.80) & (sat < 0.09)
    lab, _ = ndi.label(core)
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])); edge = edge[edge > 0]
    bg = np.isin(lab, edge)
    if holes:
        H, W = core.shape; x0, y0, x1, y1 = holes
        for j, c in enumerate(ndi.center_of_mass(core, lab, range(1, lab.max() + 1)), 1):
            if x0 * W <= c[1] <= x1 * W and y0 * H <= c[0] <= y1 * H: bg |= lab == j
    # the sweep's own level (it darkens into contact shadows): a wide normalised blur of the clean background
    w = ndi.gaussian_filter(bg.astype(np.float32), 30); lvl = ndi.gaussian_filter(np.where(bg, L, 0), 30)
    lvl = np.where(w > 1e-3, lvl / np.maximum(w, 1e-3), 0.95); lvl = np.clip(lvl, 0.5, 1)
    # grow into the soft grey of the sweep (shadows), but only near the clean background, never deep into the bag
    soft = (sat < 0.10) & (L > 0.55 * lvl)
    near = ndi.distance_transform_edt(~bg) < grow
    lab2, _ = ndi.label(soft & (near | bg))
    e2 = np.unique(lab2[bg]); e2 = e2[e2 > 0]
    bg2 = np.isin(lab2, e2) | bg
    shade = np.clip(L / lvl, 0, 1)
    return (~bg2).astype(np.float32), lvl, shade

def main():
    args = sys.argv[1:]
    model = args.pop(0) if args and args[0].endswith('.tflite') else None
    only = set(args)
    S = json.load(open('shots.json'))['shots']
    seg = None
    shots_js = 'film/shots.js'; meta = json.loads(open(shots_js).read().split('=', 1)[1].rstrip().rstrip(';'))
    for name, sh in S.items():
        K = sh.get('key')
        if not K or (only and name not in only): continue
        d = f'assets/frames/{name}'
        files = sorted(x for x in os.listdir(d) if x.endswith('.jpg'))
        F = [np.asarray(Image.open(os.path.join(d, x)).convert('RGB'), np.float32) / 255 for x in files]
        H, W = F[0].shape[:2]
        raw, lv, sd = [], [], []
        for i, f in enumerate(F):
            a, lvl, shade = key(f, K.get('grow', 18), K.get('holes'))
            if K.get('protect'):
                if seg is None:
                    import mediapipe as mp
                    from mediapipe.tasks import python as mpt
                    from mediapipe.tasks.python import vision
                    from mediapipe.tasks.python.components import containers
                    Seg = getattr(vision, 'InteractiveSegmenterLegacy', vision.InteractiveSegmenter)
                    Opt = getattr(vision, 'InteractiveSegmenterLegacyOptions', vision.InteractiveSegmenterOptions)
                    ROI = getattr(vision, 'InteractiveSegmenterLegacyRegionOfInterest', None)
                    seg = Seg.create_from_options(Opt(base_options=mpt.BaseOptions(model_asset_path=model), output_confidence_masks=True, output_category_mask=False))
                img = mp.Image(image_format=mp.ImageFormat.SRGB, data=(f * 255).astype(np.uint8))
                acc = np.zeros((H, W), np.float32)
                for P in K['protect']:
                    P = P if isinstance(P, dict) else {'pt': P}
                    a0, a1 = P.get('frames', [0, len(F) - 1])
                    if not a0 <= i <= a1: continue
                    u = (i - a0) / max(1, a1 - a0); q = P.get('pt2', P['pt'])
                    x, y = P['pt'][0] + (q[0] - P['pt'][0]) * u, P['pt'][1] + (q[1] - P['pt'][1]) * u
                    r = seg.segment(img, ROI(format=ROI.Format.KEYPOINT, keypoint=containers.keypoint.NormalizedKeypoint(x, y)))
                    m = np.squeeze(r.confidence_masks[0].numpy_view()).astype(np.float32)
                    if P.get('box'):
                        bx = P['box']; lim = np.zeros_like(m); lim[int(bx[1] * H):int(bx[3] * H), int(bx[0] * W):int(bx[2] * W)] = 1; m *= lim
                    acc = np.maximum(acc, m)
                a = np.maximum(a, ndi.binary_erosion(acc > 0.5, iterations=3).astype(np.float32))
            raw.append(a); lv.append(lvl); sd.append(shade)
        A = np.stack(raw); k = 0.6; fw = A.copy(); bw = A.copy()
        for i in range(1, len(A)): fw[i] = k * A[i] + (1 - k) * fw[i - 1]
        for i in range(len(A) - 2, -1, -1): bw[i] = k * A[i] + (1 - k) * bw[i + 1]
        A = 0.5 * (fw + bw)
        g = hexrgb(K['ground']); rgba = K.get('out') == 'rgba'
        fe = (K.get('feather') or {}).get('top', 0)
        for i, x in enumerate(files):
            f = F[i]; L = f.mean(2)
            a = np.clip(guided(L, A[i], 5, 1e-3), 0, 1); a = ss(a, 0.12, 0.88)
            B = lv[i][..., None] * np.ones(3, np.float32)                       # the sweep's colour behind each pixel
            fg = np.clip((f - (1 - a[..., None]) * B) / np.maximum(a[..., None], 0.2), 0, 1)
            fg = np.where(a[..., None] > 0.97, f, fg)
            shadow = np.clip(1 - sd[i], 0, 1) * 0.75 * (1 - a)                  # contact shadow, only where the sweep was
            if fe:
                ramp = ss(np.arange(H, dtype=np.float32), 0, fe)[:, None]
                a = a * ramp; shadow = shadow * ramp
            base = os.path.join(d, x[:-4])
            if rgba:
                A_ = a + shadow * (1 - a)
                C_ = (fg * a[..., None]) / np.maximum(A_[..., None], 1e-4)
                out = np.dstack([np.clip(C_, 0, 1), A_])
                Image.fromarray((out * 255 + 0.5).astype(np.uint8), 'RGBA').save(base + '.png', optimize=False, compress_level=3)
                os.remove(base + '.jpg')
            else:
                bgc = g[None, None, :] * (1 - shadow[..., None])
                out = fg * a[..., None] + bgc * (1 - a[..., None])
                Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)).save(base + '.jpg', quality=94, subsampling=0)
        if rgba: meta[name]['ext'] = 'png'
        meta[name]['ground'] = K['ground']
        print(name, len(files), 'frames keyed', 'rgba' if rgba else K['ground'])
    open(shots_js, 'w').write('// generated by scripts/prep_frames.py from shots.json (+ ext/ground from scripts/prep_key.py)\nwindow.SHOTS = ' + json.dumps(meta) + ';\n')
    os._exit(0)   # mediapipe's segmenter raises in __del__ at interpreter shutdown

main()

"""Objective look-audit of a rendered reel: how much of it is pale, empty or dark, how often the picture changes.
  python3 playbook/tools/audit_render.py videos/<project>/renders/9x16.mp4 [--until <cta start s>] [--sheet out.jpg]
Per frame (sampled at 4 fps, 270x480):
  pale      share of pixels that are light (luma > 200) and low-saturation (< 0.18): white / cream / blush paper
  empty     share of pixels in flat regions (3x3 neighbourhood range < 6) — nothing happening there
  canvas    share of pixels that are pale AND perfectly flat (range < 3): designed white/cream background, not footage
Reel-level numbers: mean pale, share of frames that are mostly pale (pale > 0.5), mean empty, share of frames mostly
empty (empty > 0.6), longest run of mostly-pale frames, picture changes per second (mean abs frame diff > 12) and the
longest hold (consecutive 0.25 s steps with mean diff < 2), both measured before --until (the CTA is exempt, L13)."""
import subprocess, sys, json, numpy as np
from PIL import Image, ImageDraw
src = sys.argv[1]; sheet = sys.argv[sys.argv.index('--sheet') + 1] if '--sheet' in sys.argv else None
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vf', 'fps=4,scale=270:480', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, 480, 270, 3).astype(np.float32)
lum = fr @ np.array([0.299, 0.587, 0.114], np.float32)
mx, mn = fr.max(-1), fr.min(-1); sat = (mx - mn) / (mx + 1e-3)
pale = ((lum > 200) & (sat < 0.18)).mean((1, 2))
pad = np.pad(lum, ((0, 0), (1, 1), (1, 1)), mode='edge')
win = np.stack([pad[:, 1 + dy:481 + dy, 1 + dx:271 + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1)])
rng = win.max(0) - win.min(0); empty = (rng < 6).mean((1, 2))
canvas = ((lum > 200) & (sat < 0.18) & (rng < 3)).mean((1, 2))
dark = (lum < 50).mean((1, 2))
diff = np.abs(np.diff(lum, axis=0)).mean((1, 2)); changes_all = (diff > 12).sum() / (len(fr) / 4)
# L13 exempts the CTA: --until <s> (the CTA beat's start) limits changes/s and the longest hold to the story before it
until = float(sys.argv[sys.argv.index('--until') + 1]) if '--until' in sys.argv else len(fr) / 4
dd = diff[:max(1, int(until * 4))]; changes = (dd > 12).sum() / (len(dd) / 4)
holds, cur = [0], 0
for x in dd: cur = cur + 1 if x < 2 else 0; holds.append(cur)
runs, cur = [], 0
for p in pale > 0.5: cur = cur + 1 if p else 0; runs.append(cur)
out = {'seconds': round(len(fr) / 4, 2), 'pale_mean': round(float(pale.mean()), 3), 'pale_frames': round(float((pale > 0.5).mean()), 3),
       'empty_mean': round(float(empty.mean()), 3), 'empty_frames': round(float((empty > 0.6).mean()), 3),
       'canvas_mean': round(float(canvas.mean()), 3), 'canvas_frames': round(float((canvas > 0.4).mean()), 3),
       'dark_mean': round(float(dark.mean()), 3), 'longest_pale_run_s': round(max(runs) / 4, 2), 'changes_per_s': round(float(changes), 2),
       'changes_per_s_all': round(float(changes_all), 2), 'until_s': round(until, 2), 'longest_hold_s': round(max(holds) / 4, 2)}
print(json.dumps(out))
if sheet:
    step = 2; idx = list(range(0, len(fr), step)); cols = 10; rows = (len(idx) + cols - 1) // cols
    s = Image.new('RGB', (cols * 140, rows * 262), (17, 17, 17)); d = ImageDraw.Draw(s)
    for k, i in enumerate(idx):
        im = Image.fromarray(fr[i].astype(np.uint8)).resize((135, 240)); x, y = (k % cols) * 140, (k // cols) * 262
        s.paste(im, (x, y + 20)); d.text((x + 2, y + 2), f'{i / 4:.1f}s p{pale[i]:.2f} e{empty[i]:.2f}', fill=(255, 210, 0) if pale[i] > 0.5 or empty[i] > 0.6 else (200, 200, 200))
    s.save(sheet, quality=85)

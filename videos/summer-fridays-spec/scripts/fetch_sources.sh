#!/usr/bin/env bash
# Rebuild everything this project does not commit: the brand's public product films (Shopify CDN, listed in
# source/manifest.json), the Lip Butter Balm product photos (the store's public products.json), the Mixkit guide track,
# then the extracted frames, product cut-outs, person mattes and audio/music.wav.
# Fonts (Jost, Pinyon Script: OFL, from Google Fonts) and the logo (extracted from the site's header SVG) are committed.
# The cut-outs and mattes need MediaPipe (Apache-2.0) and two of its public models:
#   python3 -m venv .mp && .mp/bin/pip install mediapipe opencv-python-headless pillow
#   (Debian/Ubuntu: apt-get install libegl1 libgles2 libgl1)
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p source audio/track assets/products models
python3 - <<'PY'
import json, os, subprocess
for m in json.load(open('source/manifest.json')):
    f = f"source/{m['file']}"
    if not os.path.exists(f): subprocess.run(['curl', '-sL', '--fail', '-o', f, m['url']], check=True)
PY
# product photos: image 0 is the tube, image 1 the swatch dollop
curl -sL --fail -A "Mozilla/5.0" "https://summerfridays.com/products.json?limit=250" | python3 -c "
import json, sys, subprocess
for p in json.load(sys.stdin)['products']:
    t = p['title']
    if t.startswith('Lip Butter Balm ') and p['images']:
        fl = t.replace('Lip Butter Balm ', '').lower().replace(' ', '-')
        for i, im in enumerate(p['images'][:3]):
            subprocess.run(['curl', '-sL', '--fail', '-o', f'assets/products/{fl}_{i}.jpg', im['src'].split('?')[0] + '?width=2400'], check=True)
"
[ -s audio/track/mixkit-cherry-on-top-983.mp3 ] || curl -sL --fail -o audio/track/mixkit-cherry-on-top-983.mp3 https://assets.mixkit.co/music/983/983.mp3
MP=https://storage.googleapis.com/mediapipe-models
[ -s models/magic_touch.tflite ] || curl -sL --fail -o models/magic_touch.tflite $MP/interactive_segmenter/magic_touch/float32/1/magic_touch.tflite
[ -s models/selfie_multiclass_256x256.tflite ] || curl -sL --fail -o models/selfie_multiclass_256x256.tflite $MP/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite
python3 scripts/prep_frames.py
PY_MP=${PY_MP:-.mp/bin/python}
"$PY_MP" scripts/prep_cutouts.py models/magic_touch.tflite
"$PY_MP" scripts/prep_mattes.py models/selfie_multiclass_256x256.tflite
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py && node scripts/render.mjs --fps 30"

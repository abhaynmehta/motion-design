#!/usr/bin/env bash
# Rebuild everything this project does not commit: the brand's public films (Shopify CDN, listed in source/manifest.json),
# the ten Cheirosa perfume mist packshots (image 0 of each product in the store's public products.json, listed in
# assets/products/manifest.json), the Mixkit guide track, then the window frames, bottle cut-outs and audio/music.wav.
# Fonts (Oswald, Noto Sans: OFL) and the logo (the site's logo.svg) are committed.
# The cut-outs need MediaPipe (Apache-2.0) and its public magic_touch model:
#   python3 -m venv .mp && .mp/bin/pip install mediapipe pillow      (Debian/Ubuntu: apt-get install libegl1 libgles2 libgl1)
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p source audio/track assets/products assets/cut models
python3 - <<'PY'
import json, os, subprocess
for m in json.load(open('source/manifest.json')):
    f = f"source/{m['file']}"
    if not os.path.exists(f): subprocess.run(['curl', '-sL', '--fail', '-o', f, m['url']], check=True)
for m in json.load(open('assets/products/manifest.json')):
    f = f"assets/products/{m['n']}_00.jpg"
    if not os.path.exists(f): subprocess.run(['curl', '-sL', '--fail', '-o', f, m['url'] + '?width=2400'], check=True)
PY
[ -s audio/track/mixkit-latin-lovers-39.mp3 ] || curl -sL --fail -o audio/track/mixkit-latin-lovers-39.mp3 https://assets.mixkit.co/music/39/39.mp3
[ -s models/magic_touch.tflite ] || curl -sL --fail -o models/magic_touch.tflite https://storage.googleapis.com/mediapipe-models/interactive_segmenter/magic_touch/float32/1/magic_touch.tflite
python3 scripts/prep_frames.py
"${PY_MP:-.mp/bin/python}" scripts/prep_cutouts.py models/magic_touch.tflite
python3 scripts/clean_cutouts.py
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py && node scripts/render.mjs --fps 30"

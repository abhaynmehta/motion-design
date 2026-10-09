#!/bin/sh
# Rebuild everything this project does not commit: Minimalist's SPF 50 application film (Shopify CDN, source/manifest.json),
# the SPF 50 packshot and its cut-out, the temp song, the frames, the person mattes and audio/music.wav.
# Fonts (Montserrat, IBM Plex Mono: OFL) and the Minimalist wordmark (the site's logo PNG) are committed.
# The cut-out and the mattes need MediaPipe (Apache-2.0) and two public models:
#   python3 -m venv .mp && .mp/bin/pip install mediapipe pillow scipy
# The song is Karan Aujla's "Tauba Tauba" — the 30 s iTunes preview, a TEMP track for the pitch: copyrighted, never
# committed, never in the shared render (docs/music_cue.md).
set -eu
cd "$(dirname "$0")/.."
mkdir -p source audio/track assets/products assets/cut models
python3 - <<'PY'
import json, os, subprocess
for m in json.load(open('source/manifest.json')):
    f = f"source/{m['file']}"
    if not os.path.exists(f): subprocess.run(['curl', '-sL', '--fail', '-o', f, m['url']], check=True)
PY
[ -s assets/products/spf50-pack.jpg ] || curl -sL --fail -o assets/products/spf50-pack.jpg "https://cdn.shopify.com/s/files/1/0410/9608/5665/files/SPF50New.jpg?v=1756795782"
MP=https://storage.googleapis.com/mediapipe-models
[ -s models/magic_touch.tflite ] || curl -sL --fail -o models/magic_touch.tflite $MP/interactive_segmenter/magic_touch/float32/1/magic_touch.tflite
[ -s models/selfie_multiclass_256x256.tflite ] || curl -sL --fail -o models/selfie_multiclass_256x256.tflite $MP/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite
"${PY_MP:-.mp/bin/python}" scripts/cut_tube.py models/magic_touch.tflite assets/products/spf50-pack.jpg assets/cut/spf50.png
[ -s audio/track/tauba-tauba-preview.m4a ] || curl -sL --fail -o audio/track/tauba-tauba-preview.m4a \
  "$(curl -sL 'https://itunes.apple.com/search?term=tauba+tauba+karan+aujla&media=music&entity=song&limit=5&country=in' | python3 -c "import json,sys; print(next(r['previewUrl'] for r in json.load(sys.stdin)['results'] if r['trackName'].startswith('Tauba Tauba')))")"
python3 scripts/prep_frames.py
"${PY_MP:-.mp/bin/python}" scripts/prep_mattes.py models/selfie_multiclass_256x256.tflite
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py && node scripts/render.mjs --fps 30"

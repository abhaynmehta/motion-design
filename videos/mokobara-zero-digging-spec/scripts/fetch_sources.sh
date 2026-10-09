#!/bin/sh
# Rebuild everything this project does not commit: Mokobara's two Transit Z films (Shopify CDN, source/manifest.json),
# the temp song, the frames (cropped, then keyed onto the yellow) and audio/music.wav. Fonts (Space Grotesk, Space Mono:
# OFL) and the Mokobara logo (the site's own SVG) are committed.
# The key needs numpy, scipy, pillow and MediaPipe (Apache-2.0) with its public magic-touch model:
#   python3 -m venv .mp && .mp/bin/pip install mediapipe pillow scipy
# The song is "Big Dawgs" (Hanumankind & Kalmi) — the 30 s iTunes preview, a TEMP track for the pitch: copyrighted,
# never committed, never in the shared render (docs/music_cue.md).
set -eu
cd "$(dirname "$0")/.."
mkdir -p source audio/track models
python3 - <<'PY'
import json, os, subprocess
for m in json.load(open('source/manifest.json')):
    f = f"source/{m['file']}"
    if not os.path.exists(f): subprocess.run(['curl', '-sL', '--fail', '-o', f, m['url']], check=True)
PY
[ -s models/magic_touch.tflite ] || curl -sL --fail -o models/magic_touch.tflite \
  https://storage.googleapis.com/mediapipe-models/interactive_segmenter/magic_touch/float32/1/magic_touch.tflite
[ -s audio/track/big-dawgs-preview.m4a ] || curl -sL --fail -o audio/track/big-dawgs-preview.m4a \
  "$(curl -sL 'https://itunes.apple.com/search?term=big+dawgs+hanumankind&media=music&entity=song&limit=5&country=in' | python3 -c "import json,sys; print(next(r['previewUrl'] for r in json.load(sys.stdin)['results'] if r['trackName'].startswith('Big Dawgs')))")"
python3 scripts/prep_frames.py
"${PY_MP:-.mp/bin/python}" scripts/prep_key.py models/magic_touch.tflite
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py && node scripts/render.mjs"

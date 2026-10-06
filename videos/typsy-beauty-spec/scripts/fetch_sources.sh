#!/usr/bin/env bash
# Rebuild everything this project does not commit: the brand's public product films (Shopify CDN, listed in
# source/manifest.json), the Mixkit guide track, then the extracted frames and audio/music.wav.
# Fonts (Poppins, Assistant: OFL, from Google Fonts) and the logo are committed.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p source audio/track
python3 - <<'PY'
import json, os, subprocess
for m in json.load(open('source/manifest.json')):
    f = f"source/{m['file']}"
    if not os.path.exists(f): subprocess.run(['curl', '-sL', '--fail', '-o', f, m['url']], check=True)
PY
[ -s audio/track/mixkit-pop-05-695.mp3 ] || curl -sL --fail -o audio/track/mixkit-pop-05-695.mp3 https://assets.mixkit.co/music/695/695.mp3
python3 scripts/prep_frames.py
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py && node scripts/render.mjs --fps 30"

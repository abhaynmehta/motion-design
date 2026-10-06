#!/usr/bin/env bash
# Rebuild everything this project does not commit: the brand's public product films (Shopify CDN, listed in
# source/manifest.json), the site's webfonts, the Mixkit guide track, then the extracted frames and audio/music.wav.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p source audio/track assets/fonts
python3 - <<'PY'
import json, os, subprocess
for m in json.load(open('source/manifest.json')):
    f = f"source/{m['file']}"
    if not os.path.exists(f): subprocess.run(['curl', '-sL', '--fail', '-o', f, m['url']], check=True)
PY
B=https://www.rarebeauty.com/cdn/shop/t/127/assets
for p in "neue-hass-unica-regular.woff2:neue-hass-unica-regular-400.woff2" "neue-hass-unica-medium.woff2:neue-hass-unica-medium-500.woff2" \
         "ogg-regular.woff2:ogg-regular-400.woff2" "rarescript-regular.woff2:rare-script-400.woff2"; do
  [ -s "assets/fonts/${p#*:}" ] || curl -sL --fail -o "assets/fonts/${p#*:}" "$B/${p%%:*}"
done
[ -s audio/track/mixkit-thinking-about-you-234.mp3 ] || curl -sL --fail -o audio/track/mixkit-thinking-about-you-234.mp3 https://assets.mixkit.co/music/234/234.mp3
python3 scripts/prep_frames.py
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py && node scripts/render.mjs --fps 30"

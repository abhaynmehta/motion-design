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
B=https://kyliecosmetics.com/cdn/shop/t/2529/assets
for p in "tt_chocolates_regular-webfont.woff2:tt-chocolate-400.woff2" "tt_chocolates_demibold-webfont.woff2:tt-chocolate-600.woff2" \
         "tt_chocolates_italic-webfont.woff2:tt-chocolate-400-italic.woff2" "universltstd-boldcn-webfont.woff2:universltstd-bold-700.woff2"; do
  [ -s "assets/fonts/${p#*:}" ] || curl -sL --fail -o "assets/fonts/${p#*:}" "$B/${p%%:*}"
done
[ -s audio/track/mixkit-smooth-jazz-640.mp3 ] || curl -sL --fail -o audio/track/mixkit-smooth-jazz-640.mp3 https://assets.mixkit.co/music/640/640.mp3
python3 scripts/prep_frames.py
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py && node scripts/render.mjs --fps 30"

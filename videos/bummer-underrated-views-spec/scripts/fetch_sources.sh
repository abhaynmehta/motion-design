#!/bin/sh
# Rebuild everything this project does not commit: Bummer's four scenic-waistband Modal Stretch Trunk packshots
# (Shopify CDN, assets/products/manifest.json) and the temp song. Fonts (Archivo, DM Mono: OFL) are committed. There is
# no video footage and no frame/key step — the reel is built from the still packshots, drawn at <=0.7x (crisp, L16).
# The song is "Aap Jaisa Koi" (Nazia Hassan, 1980 — Qurbani) — the 30 s iTunes preview, a TEMP track for the pitch:
# copyrighted, never committed, never in the shared render (docs/music_cue.md).
set -eu
cd "$(dirname "$0")/.."
mkdir -p assets/products audio/track
python3 - <<'PY'
import json, os, subprocess
for m in json.load(open('assets/products/manifest.json')):
    f = f"assets/products/{m['file']}"
    if not os.path.exists(f): subprocess.run(['curl', '-sL', '--fail', '-o', f, m['url']], check=True)
PY
[ -s audio/track/aap-jaisa-koi-preview.m4a ] || curl -sL --fail -o audio/track/aap-jaisa-koi-preview.m4a \
  "$(curl -sL 'https://itunes.apple.com/search?term=aap+jaisa+koi+nazia+hassan&media=music&entity=song&limit=10&country=in' | python3 -c "import json,sys; print(next(r['previewUrl'] for r in json.load(sys.stdin)['results'] if r['artistName'].startswith('Nazia Hassan')))")"
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py && node scripts/render.mjs"

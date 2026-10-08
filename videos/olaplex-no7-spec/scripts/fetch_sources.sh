#!/usr/bin/env bash
# Rebuild everything this project does not commit: the brand's public films (Shopify CDN, listed in source/manifest.json:
# the three Nº.7 before/after films from the product page and two creator clips from the home page), the Nº.7 30 ml
# transparent packshot (store products.json) and its trimmed cut-out, the temp song, then the frames and audio/music.wav.
# Fonts (Geist, Geist Mono: OFL) and the OLAPLEX wordmark (the site's logo SVG) are committed.
# The song is Lady Gaga's "Abracadabra" — the 30 s iTunes preview, a TEMP track for the pitch: copyrighted, never
# committed, never in the shared render (docs/music_cue.md).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p source audio/track assets/products assets/cut
python3 - <<'PY'
import json, os, subprocess
for m in json.load(open('source/manifest.json')):
    f = f"source/{m['file']}"
    if not os.path.exists(f): subprocess.run(['curl', '-sL', '--fail', '-o', f, m['url']], check=True)
PY
[ -s assets/products/no7-bottle.png ] || curl -sL --fail -o assets/products/no7-bottle.png \
  "https://cdn.shopify.com/s/files/1/0434/1661/files/ClosetoFinal_Transparent_No7-Bottle_30ml_Product-Packshot_WS_FRONT_FPO_0040_MAIN.png?v=1762285968"
python3 - <<'PY'
from PIL import Image
im = Image.open('assets/products/no7-bottle.png').convert('RGBA')
c = im.crop(im.split()[-1].point(lambda v: 255 if v > 8 else 0).getbbox()); k = 1100 / c.height
c.resize((round(c.width * k), 1100), Image.LANCZOS).save('assets/cut/no7.png')
PY
[ -s audio/track/abracadabra-preview.m4a ] || curl -sL --fail -o audio/track/abracadabra-preview.m4a \
  "$(curl -sL 'https://itunes.apple.com/search?term=lady+gaga+abracadabra&media=music&entity=song&limit=5' | python3 -c "import json,sys; print(next(r['previewUrl'] for r in json.load(sys.stdin)['results'] if r['trackName']=='Abracadabra'))")"
python3 scripts/prep_frames.py
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py && node scripts/render.mjs --fps 30"

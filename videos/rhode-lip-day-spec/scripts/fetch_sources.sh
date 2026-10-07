#!/usr/bin/env bash
# Rebuild everything this project does not commit: the brand's public shade films (Shopify CDN, listed in
# source/manifest.json), the Peptide Lip Shape product photos (the store's public products.json: image 0 is the pencil
# PNG, image 4 the campaign portrait), the Mixkit guide track, then the extracted frames, pencil crops and audio/music.wav.
# Fonts (Russo One, Inter: OFL, from Google Fonts) and the logo (the site's header SVG) are committed.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p source audio/track assets/products assets/cut
python3 - <<'PY'
import json, os, subprocess
for m in json.load(open('source/manifest.json')):
    f = f"source/{m['file']}"
    if not os.path.exists(f): subprocess.run(['curl', '-sL', '--fail', '-o', f, m['url']], check=True)
PY
curl -sL --fail -A "Mozilla/5.0" "https://www.rhodeskin.com/products.json?limit=250" | python3 -c "
import json, sys, subprocess
for p in json.load(sys.stdin)['products']:
    h = p['handle']
    if h.startswith('peptide-lip-shape-'):
        s = h[len('peptide-lip-shape-'):]
        for i, im in enumerate(p['images'][:1] + p['images'][4:5]):
            u = im['src'].split('?')[0]
            subprocess.run(['curl', '-sL', '--fail', '-o', f'assets/products/{s}_{i}.' + u.rsplit('.', 1)[1], u + '?width=2000'], check=True)
"
python3 - <<'PY'
from PIL import Image; import glob, os
for f in sorted(glob.glob('assets/products/*_0.png')):
    s = os.path.basename(f)[:-6]; im = Image.open(f).convert('RGBA'); im = im.crop(im.split()[-1].getbbox())
    k = 1100 / im.height; im.resize((round(im.width * k), 1100), Image.LANCZOS).save(f'assets/cut/{s}_pencil.png', optimize=True)
PY
[ -s audio/track/mixkit-swish-swed-201.mp3 ] || curl -sL --fail -o audio/track/mixkit-swish-swed-201.mp3 https://assets.mixkit.co/music/201/201.mp3
python3 scripts/prep_frames.py
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py && node scripts/render.mjs --fps 30"

#!/usr/bin/env bash
# Rebuild everything this project does not commit: Glossier's two public Ultralip application films (Shopify CDN, listed
# in source/manifest.json), the Ember packshot (→ the tube cut-out) and the shades photo (Cachet carousel 06), the temp
# song, then the frames and audio/music.wav. Fonts (Figtree, DM Mono: OFL) and the Glossier. wordmark (the site's icon
# sprite, #logo / #logo-white) are committed.
# The song is SZA's "Snooze" — the 30 s iTunes preview, a TEMP track for the pitch: copyrighted, never committed, never in
# the shared render (docs/music_cue.md).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p source audio/track assets/products assets/cut
python3 - <<'PY'
import json, os, subprocess
for m in json.load(open('source/manifest.json')):
    f = f"source/{m['file']}"
    if not os.path.exists(f): subprocess.run(['curl', '-sL', '--fail', '-o', f, m['url']], check=True)
PY
CDN=https://cdn.shopify.com/s/files/1/0627/9164/7477/files
[ -s assets/products/ultralip-ember.png ] || curl -sL --fail -o assets/products/ultralip-ember.png "$CDN/glossier-makeup-ultralip-ember-carousel-01.png"
[ -s assets/products/ultralip-shades.jpg ] || { curl -sL --fail -o assets/products/_shades.png "$CDN/glossier-ultralip-cachet-carousel-06.png" \
  && python3 -c "from PIL import Image; Image.open('assets/products/_shades.png').convert('RGB').save('assets/products/ultralip-shades.jpg', quality=92)" && rm assets/products/_shades.png; }
python3 scripts/cut_tube.py assets/products/ultralip-ember.png assets/cut/ultralip-ember.png
[ -s audio/track/snooze-preview.m4a ] || curl -sL --fail -o audio/track/snooze-preview.m4a \
  "$(curl -sL 'https://itunes.apple.com/search?term=sza+snooze&media=music&entity=song&limit=5' | python3 -c "import json,sys; print(next(r['previewUrl'] for r in json.load(sys.stdin)['results'] if r['trackName']=='Snooze' and r['collectionName']=='SOS'))")"
python3 scripts/prep_frames.py
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py && node scripts/render.mjs --fps 30"

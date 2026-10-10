#!/bin/sh
# Rebuild everything this project does not commit: Youthiapa's two Raised Right homepage films (Shopify CDN,
# source/manifest.json), the temp song and the extracted frames. Fonts (Kalam, Bodoni Moda: OFL) are committed; there is
# no keying/matte step (the footage is shown as 'evidence photos', not cut out).
# The song is "In The Night No Control" (Khiladiyon Ka Khiladi, 1996) — the 30 s iTunes preview, a TEMP track for the
# pitch: copyrighted, never committed, never in the shared render (docs/music_cue.md).
set -eu
cd "$(dirname "$0")/.."
mkdir -p source audio/track
python3 - <<'PY'
import json, os, subprocess
for m in json.load(open('source/manifest.json')):
    f = f"source/{m['file']}"
    if not os.path.exists(f): subprocess.run(['curl', '-sL', '--fail', '-o', f, m['url']], check=True)
PY
[ -s audio/track/in-the-night-preview.m4a ] || curl -sL --fail -o audio/track/in-the-night-preview.m4a \
  "$(curl -sL 'https://itunes.apple.com/search?term=in+the+night+no+control&media=music&entity=song&limit=10&country=in' | python3 -c "import json,sys; print([r['previewUrl'] for r in json.load(sys.stdin)['results'] if r['trackName']=='In The Night No Control' and r.get('collectionName')=='Khiladiyon Ka Khiladi'][0])")"
python3 scripts/prep_frames.py
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py && node scripts/render.mjs"

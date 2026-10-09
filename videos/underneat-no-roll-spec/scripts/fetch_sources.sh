#!/bin/sh
# Rebuild everything this project does not commit: Underneat's how-to film for the High-Waisted Tummy Tucker Shorts
# (Shopify CDN, source/manifest.json), the temp song, the frames and audio/music.wav. Fonts (Bricolage Grotesque, Inter
# Tight: OFL) and the Underneat logo (traced to SVG from the film's own end card: scripts/trace_logo.py) are committed.
# The song is "Shararat" (Dhurandhar) — the 30 s iTunes preview, a TEMP track for the pitch: copyrighted, never
# committed, never in the shared render (docs/music_cue.md).
set -eu
cd "$(dirname "$0")/.."
mkdir -p source audio/track
python3 - <<'PY'
import json, os, subprocess
for m in json.load(open('source/manifest.json')):
    f = f"source/{m['file']}"
    if not os.path.exists(f): subprocess.run(['curl', '-sL', '--fail', '-o', f, m['url']], check=True)
PY
[ -s audio/track/shararat-preview.m4a ] || curl -sL --fail -o audio/track/shararat-preview.m4a \
  "$(curl -sL 'https://itunes.apple.com/search?term=shararat+dhurandhar&media=music&entity=song&limit=5&country=in' | python3 -c "import json,sys; print(next(r['previewUrl'] for r in json.load(sys.stdin)['results'] if r['trackName'].startswith('Shararat')))")"
python3 scripts/prep_frames.py
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py && node scripts/render.mjs --fps 30"

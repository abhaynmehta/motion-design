#!/usr/bin/env bash
# Fetch the guide track (Mixkit licence: use in a video, no redistribution of the file) and build audio/music.wav with the
# record stop (scripts/prep_music.py writes beats.json too).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p audio/track
[ -s audio/track/mixkit-hip-hop-two-666.mp3 ] || curl -sL --fail -o audio/track/mixkit-hip-hop-two-666.mp3 https://assets.mixkit.co/music/666/666.mp3
python3 scripts/prep_music.py
echo "next: node scripts/sync.mjs && node scripts/sfx.mjs && python3 scripts/mix.py"

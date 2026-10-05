#!/usr/bin/env bash
# Fetch the guide track (not committed: Mixkit's licence allows use in a video, not redistribution of the file) and cut
# audio/music.wav: 34.74 s starting on the first full-groove kick (12.633 s into the file), 0.8 s fade at the end.
# The 76.000 bpm grid in beats.json was fitted to this exact cut.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p audio/track
[ -s audio/track/mixkit-sweet-september-282.mp3 ] || curl -sL --fail -o audio/track/mixkit-sweet-september-282.mp3 https://assets.mixkit.co/music/282/282.mp3
ffmpeg -v error -y -ss 12.6334 -t 35.2 -i audio/track/mixkit-sweet-september-282.mp3 -af "afade=t=out:st=34.4:d=0.8" -ar 48000 audio/music.wav
echo "audio/music.wav ready → node scripts/sfx.mjs && python3 scripts/mix.py"

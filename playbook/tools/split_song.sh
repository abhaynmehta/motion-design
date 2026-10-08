#!/bin/sh
# Copyrighted temp songs never go into git (playbook/MUSIC.md). After a final render with a song in audio/music.wav:
#   sh playbook/tools/split_song.sh videos/<slug> [fmt]
# renders/<fmt>.mp4       → renders/<fmt>_song.mp4   (the pitch cut; gitignored, send it directly)
# audio/sfx.wav           → renders/<fmt>.mp4        (same picture, SFX only at -14 LUFS / -1 dBTP; committed, shareable)
set -eu
P="$1"; F="${2:-9x16}"
cd "$P"
[ -s "renders/$F.mp4" ] || [ -s "renders/${F}_song.mp4" ] || { echo "no renders/$F.mp4"; exit 1; }
[ -s audio/sfx.wav ] || { echo "no audio/sfx.wav (node scripts/sfx.mjs)"; exit 1; }
# renders/.<fmt>.split is touched after each split: if <fmt>.mp4 is not newer, it is already the SFX-only file (re-run)
if [ -e "renders/.$F.split" ] && [ ! "renders/$F.mp4" -nt "renders/.$F.split" ]; then echo "re-run: keeping renders/${F}_song.mp4"; \
else mv "renders/$F.mp4" "renders/${F}_song.mp4"; fi
# two-pass loudnorm (linear gain): one pass overshoots on sparse SFX
M=$(ffmpeg -hide_banner -i audio/sfx.wav -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | python3 -c "
import sys, json; t = sys.stdin.read(); j = json.loads(t[t.rindex('{'):])
print(f\"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}\")")
ffmpeg -v error -y -i "renders/${F}_song.mp4" -i audio/sfx.wav -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1:LRA=11:$M:linear=true,aresample=48000" -c:a aac -b:a 192k -shortest -movflags +faststart "renders/$F.mp4"
touch "renders/.$F.split"
echo "renders/${F}_song.mp4 (song, gitignored) · renders/$F.mp4 (SFX only)"
ffmpeg -v info -i "renders/$F.mp4" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1

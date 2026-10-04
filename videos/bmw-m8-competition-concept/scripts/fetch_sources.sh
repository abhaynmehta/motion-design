#!/bin/sh
# Fetch everything this film is cut from (none of it is committed): the BMW PressClub films, BMW Group's typeface, the track.
# Run from the project root:  sh scripts/fetch_sources.sh && python3 scripts/prep_frames.py
set -e
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"
mkdir -p source assets/fonts audio/track
# 1. BMW Group PressClub HD footage (press.bmwgroup.com, free media downloads)
#    PF0006852 The all-new BMW M8 Competition Coupé · PF0007121 M8 Competition Coupé + Convertible, Algarve/Portimão
#    PF0006628 The new BMW M8 Coupé and the new BMW M8 GTE (11/2018)
for id in PF0006852 PF0007121 PF0006628; do
  curl -sS -A "$UA" -o "source/$id.mov" "https://mediapool.bmwgroup.com/download/edown/tvFootageDownload.mov?dokNo=$id&actEvent=tvFootageMovHd&attachment=1"
done
# 2. BMW Group TN Pro (BMW Type Next), as served by the PressClub site
for f in BMWGroupTNPro-Regular BMWGroupTNPro-Bold BMWGroupTNPro-Light BMWGroupTNPro-Thin BMWGroupTNCondensedPro-Regular BMWGroupTNCondensedPro-Bold BMWGroupTNCondensedPro-Light; do
  curl -sS -A "$UA" -o "assets/fonts/$f.woff2" "https://www.press.bmwgroup.com/press-frontend/resources/fonts/BMWGroupTN/$f.woff2"
done
# 3. Music: "Greed" from Mixkit (Mixkit Stock Music Free License), trimmed to the film window (6.4 s → 40.8 s)
curl -sS -A "$UA" -o audio/track/mixkit-greed-404.mp3 "https://assets.mixkit.co/music/404/404.mp3"
ffmpeg -v error -y -ss 6.4 -t 34.4 -i audio/track/mixkit-greed-404.mp3 -af "afade=t=out:st=34.0:d=0.4" -ar 48000 -ac 2 -c:a pcm_f32le audio/music.wav
echo "sources fetched"

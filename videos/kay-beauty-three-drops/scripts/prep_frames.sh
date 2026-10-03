#!/bin/sh
# The supplied reels are 540x960 (A) and 720x1280 (B, C) at 25/25/30 fps, heavily compressed. Every frame is extracted once,
# denoised (nlmeans removes the blocking before the upscale), Lanczos-scaled to 1080x1920 and lightly sharpened.
# film/footage.js paints these JPEGs on canvases inside seek(t). Run from the project root.
set -e
mkdir -p assets/frames/A assets/frames/B assets/frames/C
ffmpeg -v error -y -i source/A.mp4 -vf "nlmeans=s=2.0:p=5:r=9,scale=1080:1920:flags=lanczos,unsharp=5:5:0.7:3:3:0" -q:v 2 -start_number 0 assets/frames/A/%04d.jpg &
ffmpeg -v error -y -i source/B.mp4 -vf "nlmeans=s=1.5:p=5:r=9,scale=1080:1920:flags=lanczos,unsharp=5:5:0.6:3:3:0" -q:v 2 -start_number 0 assets/frames/B/%04d.jpg &
ffmpeg -v error -y -i source/C.mp4 -vf "nlmeans=s=1.5:p=5:r=9,scale=1080:1920:flags=lanczos,unsharp=5:5:0.6:3:3:0" -q:v 2 -start_number 0 assets/frames/C/%04d.jpg &
wait
for c in A B C; do echo "$c $(ls assets/frames/$c | wc -l) frames"; done

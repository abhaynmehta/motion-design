# Guide music → audio/music.wav: "Shararat" (Dhurandhar; Shashwat Sachdev, Madhubanti Bagchi & Jasmine Sandlas) — the
# 30 s iTunes preview (audio/track/, gitignored, never committed; playbook/MUSIC.md). find_drop.py: 131 bpm, beat
# 0.458 s, first beat 0.384 s; no kick until the drop on song beat 27 (12.75 s). The reel enters on the bar line at song
# beat 11 (5.42 s): the drop lands on reel beat 16 (7.33 s) as the loop clips on. 20 ms fade-in, 0.6 s fade-out.
import subprocess, numpy as np, json
SR = 48000
SRC = 'audio/track/shararat-preview.m4a'
BEAT = 60 / 131.0; PRE = 0.0; START = 0.384 + 11 * BEAT; NB = 48
TL = json.load(open('timeline.json')); DUR = float(TL['duration'])
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2)
out = x[int(START * SR): int((START + DUR) * SR)].copy()
fi = int(0.02 * SR); out[:fi] *= np.linspace(0, 1, fi)[:, None]
fo = int(0.6 * SR); out[-fo:] *= (np.cos(np.linspace(0, np.pi / 2, fo)) ** 1.5)[:, None]
pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', 'audio/music.wav'], input=pcm.tobytes(), check=True)
beats = [round(PRE + i * BEAT, 5) for i in range(NB + 1)]
json.dump({'source': SRC, 'start_in_song': round(START, 4), 'duration': round(len(out) / SR, 4), 'bpm': round(60 / BEAT, 3), 'beat': BEAT,
           'offset': PRE, 'beats': beats, 'downbeats': beats[::4], 'downbeat_phase': 0, 'hits': [],
           'note': 'find_drop.py grid on the iTunes preview, entered on the bar line at song beat 11; the drop = reel beat 16 (7.33 s).'},
          open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's; beats.json', len(beats), 'beats')

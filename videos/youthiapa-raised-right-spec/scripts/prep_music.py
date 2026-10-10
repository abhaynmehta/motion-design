# Guide music → audio/music.wav: "In The Night No Control" (Khiladiyon Ka Khiladi, 1996; Sumitra Iyer, Anu Malik & Dev
# Kohli), revived on Reels in 2026 — the 30 s iTunes preview (audio/track/, gitignored, never committed; playbook/MUSIC.md).
# find_drop.py: 137.3 bpm, beat 0.437 s, first beat 0.388 s. Per-beat energy: a dead stop on song beats 36.5-39
# (16.3-17.4 s, -45 dB), a vocal pickup on 39, and the beat slams back on 41 (18.305 s). The reel enters on song beat 14
# (6.51 s), so the stop is the parent's glare (reel beats 22.5-25) and the slam lands on reel beat 27 (11.80 s).
import subprocess, numpy as np, json
SR = 48000
SRC = 'audio/track/in-the-night-preview.m4a'
BEAT = 60 / 137.3; PRE = 0.0; START = 0.388 + 14 * BEAT; NB = 52
TL = json.load(open('timeline.json')); DUR = float(TL['duration'])
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2)
out = x[int(START * SR): int((START + DUR) * SR)].copy()
fi = int(0.02 * SR); out[:fi] *= np.linspace(0, 1, fi)[:, None]
fo = int(0.6 * SR); out[-fo:] *= (np.cos(np.linspace(0, np.pi / 2, fo)) ** 1.5)[:, None]
pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', 'audio/music.wav'], input=pcm.tobytes(), check=True)
beats = [round(PRE + i * BEAT, 5) for i in range(NB + 1)]
json.dump({'source': SRC, 'start_in_song': round(START, 4), 'duration': round(len(out) / SR, 4), 'bpm': 137.3, 'beat': BEAT,
           'offset': PRE, 'beats': beats, 'downbeats': beats[::4], 'downbeat_phase': 0, 'hits': [round(27 * BEAT, 4)],
           'note': 'find_drop.py grid on the iTunes preview, entered on song beat 14; the stop = reel beats 22.5-25, the slam = reel beat 27 (11.80 s).'},
          open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's; beats.json', len(beats), 'beats')

# Guide music → audio/music.wav: Karan Aujla "Tauba Tauba" (Bad Newz) — the 30 s iTunes preview (audio/track/,
# gitignored, never committed; playbook/MUSIC.md). find_drop.py: 95.0 bpm, beat 0.6315 s, kick phase 0.435 s. The groove
# stops dead on song beat 15 (9.87 s) and slams back on beat 16 (10.50 s). The reel enters on the kick at song beat 4
# (2.96 s): the stop falls on reel beat 11 ("par hai kya?" held) and the slam on reel beat 12 (7.58 s) = SPF 56.6.
# 20 ms fade-in (no click), 0.6 s fade at the end.
import subprocess, numpy as np, json
SR = 48000
SRC = 'audio/track/tauba-tauba-preview.m4a'
BEAT = 0.6315; PRE = 0.0; START = 0.435 + 4 * BEAT; NB = 40
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
           'note': 'find_drop.py grid on the iTunes preview, entered on the kick at song beat 4; the stop is reel beat 11, the slam reel beat 12 (7.58 s).'},
          open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's; beats.json', len(beats), 'beats')

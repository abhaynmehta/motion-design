# Guide music → audio/music.wav: Lady Gaga "Abracadabra" — the 30 s iTunes preview (audio/track/, gitignored, never
# committed; see playbook/MUSIC.md). The reel starts on the preview's first frame; its first beat is at 0.316 s and its
# biggest lift at 16.51 s (playbook/tools/find_drop.py: 126.0 bpm, beat 0.4762 s). 0.6 s fade at the end.
import subprocess, numpy as np, json
SR = 48000
SRC = 'audio/track/abracadabra-preview.m4a'
BEAT = 0.4762; PRE = 0.316; START = 0.0; NB = 56
TL = json.load(open('timeline.json')); DUR = float(TL['duration'])
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2)
out = x[int(START * SR): int((START + DUR) * SR)].copy()
fo = int(0.6 * SR); out[-fo:] *= (np.cos(np.linspace(0, np.pi / 2, fo)) ** 1.5)[:, None]
pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', 'audio/music.wav'], input=pcm.tobytes(), check=True)
beats = [round(PRE + i * BEAT, 5) for i in range(NB + 1)]
json.dump({'source': SRC, 'duration': round(len(out) / SR, 4), 'bpm': round(60 / BEAT, 3), 'beat': BEAT, 'offset': PRE,
           'beats': beats, 'downbeats': beats[::4], 'downbeat_phase': 0, 'hits': [],
           'note': 'find_drop.py grid on the iTunes preview; the lift at 16.51 s = beat 34.'}, open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's; beats.json', len(beats), 'beats')

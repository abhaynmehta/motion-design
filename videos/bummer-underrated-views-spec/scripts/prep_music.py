# Guide music → audio/music.wav: "Aap Jaisa Koi" (Nazia Hassan, 1980 — Qurbani; Indo-disco) — the 30 s iTunes preview
# (audio/track/, gitignored, never committed; playbook/MUSIC.md). find_drop.py: 108.4 bpm, beat 0.5535 s, phase 0.392;
# a 4-on-the-floor kick every 4 beats, the strongest at 13.12 s. The reel enters on a bar line at song beat 3 (2.05 s),
# so reel beat b = 0.5535 b; the postcards land on the kicks and the payoff on the big kick (reel beat 20 = song 13.12 s).
import subprocess, numpy as np, json
SR = 48000
SRC = 'audio/track/aap-jaisa-koi-preview.m4a'
BEAT = 0.5535; PRE = 0.0; START = 0.392 + 3 * BEAT; NB = 40
TL = json.load(open('timeline.json')); DUR = float(TL['duration'])
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2)
out = x[int(START * SR): int((START + DUR) * SR)].copy()
fi = int(0.02 * SR); out[:fi] *= np.linspace(0, 1, fi)[:, None]
fo = int(0.6 * SR); out[-fo:] *= (np.cos(np.linspace(0, np.pi / 2, fo)) ** 1.5)[:, None]
pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', 'audio/music.wav'], input=pcm.tobytes(), check=True)
beats = [round(PRE + i * BEAT, 5) for i in range(NB + 1)]
json.dump({'source': SRC, 'start_in_song': round(START, 4), 'duration': round(len(out) / SR, 4), 'bpm': 108.4, 'beat': BEAT,
           'offset': PRE, 'beats': beats, 'downbeats': beats[::4], 'downbeat_phase': 0, 'hits': [round(20 * BEAT, 4)],
           'note': 'find_drop.py grid on the iTunes preview, entered on the bar line at song beat 3; kicks every 4 beats, the big one = reel beat 20 (song 13.12 s).'},
          open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's; beats.json', len(beats), 'beats')

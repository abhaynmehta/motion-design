# Guide music → audio/music.wav: Mixkit "Swish Swed" (#201, Mixkit Stock Music Free License) from 36.01 s, so film beats
# 0–8 sit in the track's bass-less break (the hook and the 3-2-1) and the drop's first kick lands on film beat 8. 1.2 s fade.
# Grid: the kick (low band < 120 Hz) enters at 40.03 s and repeats every 0.4999 s (120.0 bpm); the onset-envelope fit over
# 40–72 s agrees on the period (its phase lands on the off-beat hats, +0.25 s).
import subprocess, numpy as np, json
SR = 48000
SRC = 'audio/track/mixkit-swish-swed-201.mp3'
BEAT = 0.4999; PRE = 0.02; DROP = 40.03; START = DROP - 8 * BEAT - PRE; NB = 64
TL = json.load(open('timeline.json')); DUR = float(TL['duration'])
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2)
out = x[int(START * SR): int((START + DUR) * SR)].copy()
fi = int(0.01 * SR); out[:fi] *= np.linspace(0, 1, fi)[:, None]
fo = int(1.2 * SR); out[-fo:] *= (np.cos(np.linspace(0, np.pi / 2, fo)) ** 1.5)[:, None]
pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', 'audio/music.wav'], input=pcm.tobytes(), check=True)
beats = [round(PRE + i * BEAT, 5) for i in range(NB + 1)]
json.dump({'source': SRC, 'duration': round(len(out) / SR, 4), 'bpm': round(60 / BEAT, 3), 'beat': BEAT, 'offset': PRE,
           'beats': beats, 'downbeats': beats[::4], 'downbeat_phase': 0, 'hits': [],
           'note': f'Kick grid: drop at {DROP} s in the Mixkit file = film beat 8. Beat 0 = {START + PRE:.3f} s.'},
          open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's from', round(START, 3), '; beats.json', len(beats), 'beats')

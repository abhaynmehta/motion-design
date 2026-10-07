# Guide music → audio/music.wav: Mixkit "Cherry on Top" (#983, Mixkit Stock Music Free License) from 46.62 s (a bar line where the arrangement fills out), so film beat 0
# is a downbeat; the arrangement breaks down around film beat 56 and comes back on 64 (the logo). 1.2 s fade at the end.
# Grid: the percussive onset envelope over 2–100 s fits 0.46155 s per beat (130.0 bpm; mean residual 1.5 ms, sd 8 ms).
# The autocorrelation peaks at 0.464 / 0.923 / 1.846 s agree.
import subprocess, numpy as np, json
SR = 48000
SRC = 'audio/track/mixkit-cherry-on-top-983.mp3'
BEAT = 0.46155; START = 46.619; PRE = 0.02; NB = 72
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
           'note': 'Grid from the percussive onset fit (0.8889 s, phase 2.33 s in the Mixkit file). Beat 0 = 46.639 s.'},
          open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's; beats.json', len(beats), 'beats')

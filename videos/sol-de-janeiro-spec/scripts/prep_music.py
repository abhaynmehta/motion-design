# Guide music → audio/music.wav: Mixkit "Latin Lovers" (#39, Mixkit Stock Music Free License; a bossa nova groove, the
# genre Cheirosa 59 is about) from the top of the track, whose first beat lands at 0.007 s. 1.2 s fade at the end.
# Grid: the onset-envelope fit over 5–90 s gives 0.4444 s per beat (135.0 bpm), phase 5.340 s = beat 12 from 0.007 s.
import subprocess, numpy as np, json
SR = 48000
SRC = 'audio/track/mixkit-latin-lovers-39.mp3'
BEAT = 0.4444; PRE = 0.007; START = 0.0; NB = 72
TL = json.load(open('timeline.json')); DUR = float(TL['duration'])
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2)
out = x[int(START * SR): int((START + DUR) * SR)].copy()
fo = int(1.2 * SR); out[-fo:] *= (np.cos(np.linspace(0, np.pi / 2, fo)) ** 1.5)[:, None]
pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', 'audio/music.wav'], input=pcm.tobytes(), check=True)
beats = [round(PRE + i * BEAT, 5) for i in range(NB + 1)]
json.dump({'source': SRC, 'duration': round(len(out) / SR, 4), 'bpm': round(60 / BEAT, 3), 'beat': BEAT, 'offset': PRE,
           'beats': beats, 'downbeats': beats[::4], 'downbeat_phase': 0, 'hits': [],
           'note': 'Onset-envelope grid from the top of the Mixkit file (beat 0 = 0.007 s).'},
          open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's; beats.json', len(beats), 'beats')

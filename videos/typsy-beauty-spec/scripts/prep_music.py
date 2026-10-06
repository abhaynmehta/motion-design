# Guide music → audio/music.wav: Mixkit "Pop 05" (#695, Mixkit Stock Music Free License) from 22.75 s, four beats before the full arrangement lifts, so the lift lands on film beat 4 ("…but you can wear it."); film beat 0
# is a beat. 1.2 s fade at the end.
# Grid: the percussive onset envelope over 5–149 s fits 0.6316 s per beat (95.0 bpm; mean residual 0.5 ms, sd 8 ms).
# The autocorrelation peaks at 0.633 / 1.265 / 2.525 s agree.
import subprocess, numpy as np, json
SR = 48000
SRC = 'audio/track/mixkit-pop-05-695.mp3'
BEAT = 0.6316; START = 22.734; PRE = 0.02; NB = 52
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
           'note': 'Grid from the percussive onset fit (0.8889 s, phase 5.068 s in the Mixkit file). Beat 0 = 22.754 s; the full arrangement lifts on film beat 4.'},
          open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's; beats.json', len(beats), 'beats')

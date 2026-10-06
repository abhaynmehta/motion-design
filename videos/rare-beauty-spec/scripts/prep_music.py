# Guide music → audio/music.wav: Mixkit "Thinking About You" (#234, Mixkit Stock Music Free License) from 24.86 s (a bar line where the groove lifts), so film beat 0
# is a downbeat; the arrangement thins out at film beat 28 (the end card). 1.2 s fade at the end.
# Grid: the percussive onset envelope fits 0.8572 s per beat (70.0 bpm; mean residual 4.7 ms, sd 9 ms) over 14.6–108 s.
# librosa's tracker reads 92 bpm; the autocorrelation peaks at 0.43 / 0.853 / 1.712 s give 70.
import subprocess, numpy as np, json
SR = 48000
SRC = 'audio/track/mixkit-thinking-about-you-234.mp3'
BEAT = 0.8572; START = 24.844; PRE = 0.03; NB = 36
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
           'note': 'Grid from the percussive onset fit (0.8889 s, phase 14.588 s in the Mixkit file). Beat 0 = 24.874 s (a bar line).'},
          open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's; beats.json', len(beats), 'beats')

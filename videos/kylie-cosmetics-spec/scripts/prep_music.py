# Guide music → audio/music.wav: Mixkit "Smooth Jazz" (#640, Mixkit Stock Music Free License) from 6.25 s, so film beat 0
# is the first note of the intro and the full band lands on film beat 2 (the blink line). 1.2 s fade at the end.
# Grid: the percussive onset envelope over 6–130 s fits 0.8889 s per beat (67.5 bpm; mean residual 1.4 ms, sd 8 ms).
# librosa's tracker reads the swung 8ths as 89 bpm; the autocorrelation peaks at 0.889 / 1.778 / 2.67 s say otherwise.
import subprocess, numpy as np, json
SR = 48000
SRC = 'audio/track/mixkit-smooth-jazz-640.mp3'
BEAT = 0.8889; START = 6.25; PRE = 0.02; NB = 36
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
           'note': 'Grid from the percussive onset fit (0.8889 s, phase 6.27 s in the Mixkit file). Beat 0 = 6.27 s; the band enters on beat 2.'},
          open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's; beats.json', len(beats), 'beats')

# Guide music → audio/music.wav: Mixkit "Hip Hop Two" (98.0 bpm) from 18.3642 s (a beat on the snare grid), with a meme
# "record stop" on film beat 6.5 (Bhai: "Ruk!"): the tape slows to a halt over 0.45 s, silence through the gag, then the
# groove drops back in on beat 15 ("Chal, cricket se…") exactly where it would have been (grid continuous). 0.8 s fade.
# Grid: 76 snares fit 1.22452 s (two beats) with ≤ 9 ms residual → beat 0.61226 s.
import subprocess, numpy as np, json, sys
SR = 48000
SRC = 'audio/track/mixkit-hip-hop-two-666.mp3'
BEAT = 0.61226; START = 18.3642; NB = 78; DUR = NB * BEAT + 0.05
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2)
seg = x[int(START * SR): int((START + DUR) * SR)].copy()
ts, te, D = 6.0 * BEAT, 15 * BEAT, 0.45                  # stop on b6 (the scratch, just before "Ruk!"), back on b15
i0, i1 = int(ts * SR), int(te * SR)
# tape stop: playback rate falls 1 → 0 as (1 - τ/D)^1.6; read the source with linear interpolation
n = int(D * SR); tau = np.arange(n) / SR
rate = np.clip(1 - tau / D, 0, 1) ** 1.6
pos = i0 + np.cumsum(rate)                                # source position in samples
k = np.floor(pos).astype(int); f = (pos - k)[:, None]
stop = seg[k] * (1 - f) + seg[np.minimum(k + 1, len(seg) - 1)] * f
stop *= np.linspace(1, 0.0, n)[:, None] ** 0.5
out = seg.copy()
out[i0:i0 + n] = stop
out[i0 + n:i1] = 0
fi = int(0.012 * SR); out[i1:i1 + fi] *= np.linspace(0, 1, fi)[:, None]
fo = int(0.8 * SR); out[-fo:] *= np.linspace(1, 0, fo)[:, None]
pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '2', '-ar', str(SR), '-i', '-', 'audio/music.wav'], input=pcm.tobytes(), check=True)
# beats.json: the score grid (the tracker is not used; the snare fit is exact)
beats = [round(i * BEAT, 5) for i in range(NB + 1)]
json.dump({'source': SRC, 'duration': round(len(out) / SR, 4), 'bpm': round(60 / BEAT, 3), 'beat': BEAT, 'offset': 0.0,
           'beats': beats, 'downbeats': beats[::4], 'downbeat_phase': 0, 'hits': [],
           'note': 'Grid from the score: 76 snares fit 1.22452 s per two beats (97.997 bpm, max residual 9 ms). Beat 0 = 18.3642 s into the Mixkit file. Record stop on b6, groove back on b15 (the bass re-enters on a phrase start). The breakdown of the track falls on b70, after Done.'},
          open('beats.json', 'w'), indent=1)
print('audio/music.wav', round(len(out) / SR, 2), 's; beats.json', len(beats), 'beats')

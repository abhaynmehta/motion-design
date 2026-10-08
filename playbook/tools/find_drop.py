"""Find a song's grid and its drops, so the reel can be cut to it (playbook/MUSIC.md).
  python3 playbook/tools/find_drop.py audio/track/song.m4a [--from 0 --to 30]
Prints: bpm and beat period (onset-envelope fit), the beat phase, the kick phase (low band), and the top energy jumps
(low band < 150 Hz, 0.5 s windows) as candidate drops with their nearest beat. Use the strongest jump for the reveal."""
import sys, json, numpy as np, librosa, warnings
warnings.filterwarnings('ignore')
src = sys.argv[1]
a = lambda k, d: float(sys.argv[sys.argv.index(f'--{k}') + 1]) if f'--{k}' in sys.argv else d
y, sr = librosa.load(src, sr=44100, mono=True)
t0, t1 = a('from', 0.0), a('to', len(y) / sr)
hop = 441; fr = sr / hop
oenv = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
tempo = float(np.atleast_1d(librosa.beat.beat_track(onset_envelope=oenv, sr=sr, hop_length=hop)[0])[0])
best = None
for P in np.arange(60 / tempo * 0.97, 60 / tempo * 1.03, 0.0002):
    for ph in np.arange(0, P, 0.004):
        ts = np.arange(t0 + ph, t1 - 0.05, P); idx = (ts * fr).astype(int); idx = idx[idx < len(oenv)]
        sc = oenv[idx].mean()
        if best is None or sc > best[0]: best = (sc, P, t0 + ph)
_, P, phase = best
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=hop)); f = librosa.fft_frequencies(sr=sr, n_fft=2048)
low = S[f < 150].sum(0); low = low / (low.max() + 1e-9)
# kick phase: the beat offset (within one period) where the low band peaks
kick = max(np.arange(0, P, 0.005), key=lambda ph: low[(np.arange(t0 + ph, t1 - 0.05, P) * fr).astype(int).clip(0, len(low) - 1)].mean())
win = int(0.5 * fr); jumps = []
for i in range(int(t0 * fr) + win, min(len(low), int(t1 * fr)) - win, int(fr * 0.1)):
    before, after = low[i - win:i].mean(), low[i:i + win].mean()
    jumps.append((after - before, i / fr))
jumps.sort(reverse=True); picked = []
for d, t in jumps:
    if d <= 0.05 or any(abs(t - p[1]) < 2 for p in picked): continue
    picked.append((float(d), float(t)))
    if len(picked) == 5: break
near = lambda t: round(float(phase + round((t - phase) / P) * P), 3)
print(json.dumps({'bpm': round(float(60 / P), 2), 'beat': round(float(P), 4), 'beat_phase': round(float(phase), 3), 'kick_phase': round(float(t0 + kick), 3),
                  'drops': [{'t': round(t, 2), 'on_beat': near(t), 'jump': round(d, 3)} for d, t in picked]}, indent=1))

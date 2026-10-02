# Original luxury score, synthesized in code → audio/music.wav (+ audio/drums.wav, the percussive stem for beats.py).
# Project-local replacement for the kit's groove engine: the brief is "super luxury, super classy", so this is
# felt piano, a warm string ensemble, harp, a soft clock pulse and a felt kick — no claps, no 808 hats. Seeded.
# Run from the project root:  python3 scripts/music.py
#
# Reads timeline.json: bpm, duration, marks (curtain, hero*, grid, gap, drop, iris, word...). Harmony is written
# below in beats (D major, one chord per bar): Gurugram lands on IV (Gmaj9), the logo resolves on I.
# SFX are NOT here: they are declared in timeline.json sfx and synthesized by scripts/sfx.mjs.
import json
import numpy as np
import soundfile as sf
from scipy import signal as sg

TL = json.load(open('timeline.json'))
SR, DUR, BPM = 48000, float(TL['duration']), float(TL['bpm'])
BEAT = 60 / BPM
N = int(round(SR * DUR))
M = TL['marks']
mk = lambda m: M[m] if isinstance(m, str) else float(m)
T = lambda b: b * BEAT
rng = np.random.default_rng(int((TL.get('music') or {}).get('seed', 2005)))


def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp(fc, o=2): return sg.butter(o, fc, 'low', fs=SR, output='sos')
def hp(fc, o=2): return sg.butter(o, fc, 'high', fs=SR, output='sos')
def tt(d): return np.arange(int(d * SR)) / SR


class Bus:
    def __init__(self): self.x = np.zeros((2, N + SR * 8))
    def add(self, s, at, gain=1.0, pan=0.0):
        i = int(round(at * SR))
        if s.ndim == 1:
            a = (pan + 1) * np.pi / 4
            s = np.vstack([np.cos(a) * s, np.sin(a) * s])
        if i < 0: s, i = s[:, -i:], 0
        n = min(s.shape[1], self.x.shape[1] - i)
        if n > 0: self.x[:, i:i + n] += gain * s[:, :n]


music, verb, perc = Bus(), Bus(), Bus()
def send(s, at, gain=1.0, pan=0.0, wet=0.3, drum=False):
    music.add(s, at, gain, pan); verb.add(s, at, gain * wet, pan)
    if drum: perc.add(s, at, gain, pan)


# ---------------- instruments ----------------
def felt_piano(m, v=0.5):
    """Additive piano: inharmonic partials, two-stage decay, detuned unison, felt-damped tone."""
    f = mtof(m); Tn = float(np.clip(2.2 + 6.0 * (1 - (m - 36) / 60), 2.0, 8.0)); t = tt(Tn); out = np.zeros(len(t))
    for k in range(1, 18):
        fk = f * k * np.sqrt(1 + 0.00032 * k * k)
        if fk > 14000: break
        amp = (1.0 / k ** 1.35) * np.exp(-(k - 1) * (0.28 - 0.16 * v))
        env = 0.62 * np.exp(-t / (0.35 / (1 + 0.25 * (k - 1)))) + 0.38 * np.exp(-t / ((Tn * 0.42) / (1 + 0.45 * (k - 1))))
        for det in (-0.6, 0.6):
            out += 0.5 * amp * env * np.sin(2 * np.pi * fk * 2 ** (det / 1200) * t + rng.uniform(0, 6.28))
    out *= np.minimum(1, t / 0.003)
    out += sg.sosfilt(lp(1800), rng.standard_normal(len(t))) * np.exp(-t / 0.010) * 0.06
    out = sg.sosfilt(lp(1600 + 3800 * v), out) * np.minimum(1, (Tn - t) / 0.05)
    return out / (np.abs(out).max() + 1e-9) * v


def ensemble_pad(notes, dur, att=0.8, rel=1.4, cutoff=1900, gain=1.0):
    """Warm string ensemble: detuned band-limited saws with slow ensemble shimmer, low-passed."""
    t = tt(dur + rel); n = len(t); out = np.zeros((2, n))
    for i, m in enumerate(notes):
        f = mtof(m)
        for j, det in enumerate((-8, -2.5, 3, 8.5)):
            fd = f * 2 ** (det / 1200)
            vib = 1 + 0.0018 * np.sin(2 * np.pi * (4.6 + 0.37 * j + 0.11 * i) * t + rng.uniform(0, 6.28))
            ph = 2 * np.pi * np.cumsum(fd * vib) / SR
            voice = sum(np.sin(k * ph + rng.uniform(0, 6.28)) / k ** 1.15 for k in range(1, int(min(28, 9000 / fd)) + 1))
            voice = voice * (1 + 0.10 * np.sin(2 * np.pi * (0.23 + 0.05 * j) * t + rng.uniform(0, 6.28)))
            a = ((-0.65, -0.2, 0.2, 0.65)[j] + 1) * np.pi / 4
            out[0] += np.cos(a) * voice; out[1] += np.sin(a) * voice
    env = np.clip(t / att, 0, 1) ** 1.6 * np.clip((dur + rel - t) / rel, 0, 1) ** 1.4
    out = sg.sosfilt(lp(cutoff), out, axis=1) * env
    return out / (np.abs(out).max() + 1e-9) * gain


def bass(m, dur, v=0.5, att=0.12, rel=0.9):
    f = mtof(m); t = tt(dur + rel)
    x = np.sin(2 * np.pi * f * t) + 0.22 * np.sin(4 * np.pi * f * t) + 0.06 * np.sin(6 * np.pi * f * t)
    x = np.tanh(1.3 * x) * np.clip(t / att, 0, 1) * np.clip((dur + rel - t) / rel, 0, 1)
    return sg.sosfilt(lp(420), x) * v


def harp(m, v=0.5, Tn=3.0):
    """Karplus-Strong pluck with a sine body."""
    f = mtof(m); n = int(SR * Tn); Di = int(SR / f)
    exc = np.zeros(n); burst = sg.sosfilt(lp(min(9000, f * 9)), rng.standard_normal(Di + 2)); exc[:Di + 2] = burst * np.hanning(Di + 2)
    a = np.zeros(Di + 2); a[0] = 1; a[Di] -= 0.9985 * 0.5; a[Di + 1] -= 0.9985 * 0.5
    y = sg.lfilter([1.0], a, exc); t = np.arange(n) / SR
    y = y / (np.abs(y).max() + 1e-9) + np.sin(2 * np.pi * f * t) * np.exp(-t / 0.9) * 0.5
    y *= np.minimum(1, (Tn - t) / 0.1)
    return y / (np.abs(y).max() + 1e-9) * v


def felt_kick(v=0.5):
    t = tt(0.7); f = 46 + 64 * np.exp(-t / 0.032)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.24)
    x += sg.sosfilt(lp(2500), rng.standard_normal(len(t))) * np.exp(-t / 0.004) * 0.12
    return np.tanh(1.4 * x) * v


def clock(v=0.1, accent=False):
    """A soft wooden clock tick: a short resonant knock (time / 'since 2005' motif) — also the grid's clean pulse."""
    t = tt(0.12); f = 1900 if accent else 2350
    x = (np.sin(2 * np.pi * f * t) * 0.6 + np.sin(2 * np.pi * f * 1.51 * t) * 0.3) * np.exp(-t / 0.012)
    x += sg.sosfilt(hp(1500), rng.standard_normal(len(t))) * np.exp(-t / 0.0025) * 0.5
    return x / (np.abs(x).max() + 1e-9) * v


def air_hat(v=0.05):
    t = tt(0.18); x = sg.sosfilt(hp(7500, 4), rng.standard_normal(len(t))) * np.exp(-t / 0.028)
    return x / (np.abs(x).max() + 1e-9) * v


# ---------------- harmony: (start_beat, end_beat, bass, pad voicing) ----------------
gap, drop, iris = mk('gap'), mk('drop'), mk('iris')
CHORDS = [
    (0, 4, 38, [50, 57, 61, 64, 66]),          # Dmaj9
    (4, 8, 35, [47, 54, 57, 61, 62]),          # Bm9
    (8, 12, 31, [50, 54, 55, 59, 61]),         # Gmaj7#11
    (12, 14, 40, [55, 59, 62, 66]),            # Em9
    (14, 16, 33, [55, 59, 62, 64, 66]),        # A13sus4
    (16, gap, 42, [57, 61, 62, 64, 69]),       # Dmaj9/F# — stops dead at the gap (the dive)
    (drop, 24, 31, [55, 59, 62, 66, 69, 74]),  # Gmaj9 — the drop: Gurugram
    (24, iris, 33, [52, 57, 59, 62, 66]),      # A6sus4
    (iris, 32, 38, [50, 57, 61, 64, 66, 69]),  # Dmaj9 — resolution on the end card
]
for i, (b0, b1, bm, notes) in enumerate(CHORDS):
    cut, last = b1 == gap, b1 == 32
    dur = T(b1 - b0) - (0.9 if last else 0)
    att = 2.4 if i == 0 else (0.25 if b0 == drop else 0.7)
    rel = 0.22 if cut else (1.6 if last else 1.2)
    send(ensemble_pad(notes, dur, att, rel, 2400 if b0 == drop else 1900, 0.30 if b0 >= drop else 0.24), T(b0), wet=0.45)
    send(bass(bm + 12 if bm < 36 else bm, dur, 0.12 if b0 < 8 else 0.155, 1.5 if i == 0 else 0.15, 0.2 if cut else 1.0), T(b0), wet=0.05)
    if b0 >= drop and bm < 36: send(bass(bm, dur, 0.085, rel=1.2), T(b0), wet=0.0)

# ---------------- felt piano melody (beat, midi, velocity) — lands with the type and the cuts ----------------
h = [mk(f'hero{i}') for i in range(6)]
MELODY = [
    (mk('h_w5') + 0.25, 78, 0.40), (mk('h_w5') + 0.25, 69, 0.24),
    (h[0], 78, 0.46), (h[0], 62, 0.26), (h[0], 54, 0.22),
    (h[1], 76, 0.42), (h[1] + 1, 73, 0.22),
    (h[2], 74, 0.46), (h[2], 55, 0.24),
    (h[3], 73, 0.40), (h[3] + 1, 71, 0.20),
    (h[4], 71, 0.44), (h[4] + 1, 74, 0.26),
    (h[5], 76, 0.46), (h[5], 69, 0.26), (h[5] + 1, 73, 0.28),
    (mk('grid_title'), 50, 0.30), (mk('grid_title'), 57, 0.24),
    (drop, 83, 0.55), (drop, 66, 0.34), (drop, 59, 0.30), (drop, 43, 0.38),
    (mk('life'), 81, 0.36), (mk('life_sub'), 78, 0.42), (mk('life_sub') + 1, 76, 0.32),
    (24, 74, 0.38), (24, 71, 0.24), (25, 76, 0.30),
    (iris, 78, 0.50), (iris, 86, 0.30), (iris, 61, 0.30), (iris, 54, 0.30), (iris, 38, 0.40),
    (mk('url'), 81, 0.24), (mk('sweep'), 78, 0.18),
]
for b, m, v in MELODY:
    send(felt_piano(m, v), T(b), gain=0.62, pan=float(np.clip((m - 66) / 40, -0.4, 0.4)), wet=0.38, drum=True)

# ---------------- harp arpeggio: one pluck per grid tile as it lands (Dmaj9/F# rising), tile 12 last ----------------
for o, m in enumerate([66, 69, 73, 74, 76, 78, 81, 85, 86, 88, 90]):   # 11th note = tile 12 (Gurugram)
    send(harp(m, 0.30 - 0.008 * o), T(mk('grid') + (o + 1) * 0.25), gain=0.55, pan=-0.45 + 0.1 * o, wet=0.42, drum=True)

# ---------------- pulse: clock on every beat (silent in the gap), felt kick on 1 & 3, whisper hats ----------------
for b in range(0, 32):
    if gap <= b < drop or b >= 31: continue
    send(clock(0.10 if b % 4 else 0.13, accent=b % 4 == 0), T(b), pan=0.12, wet=0.12, drum=True)
for b in list(range(8, int(gap), 2)) + [drop, drop + 2, 24]:
    send(felt_kick(0.26 if b < drop else 0.32), T(b), wet=0.06, drum=True)
for b in np.arange(12.5, gap, 1.0).tolist() + np.arange(drop + 0.5, iris, 1.0).tolist():
    send(air_hat(0.05), T(b), pan=0.25, wet=0.2)

# ---------------- reverb (synthetic hall), export ----------------
def make_ir(sec=3.4):
    t = tt(sec); ir = rng.standard_normal((2, len(t))) * np.exp(-t * 6.9 / sec)
    mix = np.exp(-t / 0.45); ir = ir * mix + sg.sosfilt(lp(2600), ir, axis=1) * (1 - mix)
    ir = np.concatenate([np.zeros((2, int(0.022 * SR))), ir], axis=1)
    return ir / np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
ir = make_ir()
wet = np.vstack([sg.fftconvolve(verb.x[c], ir[c])[: verb.x.shape[1]] for c in range(2)])
mix = sg.sosfilt(hp(28), music.x + wet * 0.55, axis=1)[:, :N]
t = np.arange(N) / SR
mix *= np.clip((DUR - t) / 1.4, 0, 1) ** 1.5           # rings out to silence at the loop point
peak = np.abs(mix).max(); mix /= peak / 10 ** (-1 / 20)
stem = perc.x[:, :N] / (np.abs(perc.x).max() + 1e-9) * 10 ** (-1 / 20)
sf.write('audio/music.wav', mix.T.astype(np.float32), SR, subtype='FLOAT')
sf.write('audio/drums.wav', stem.T.astype(np.float32), SR, subtype='FLOAT')
print(f'audio/music.wav + audio/drums.wav  {DUR}s  {BPM:g} bpm  {int(DUR / BEAT)} beats  gap b{gap:g} → drop b{drop:g}, resolve b{iris:g}')

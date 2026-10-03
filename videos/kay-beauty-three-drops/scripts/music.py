# Original score for the Kay Beauty reel, synthesized in code → audio/music.wav (+ audio/drums.wav for beat measurement).
# Luxe, sensual house at 120 bpm in D minor: warm FM Rhodes on Dm9 · G13 · Cmaj9 · Am9, round sub, soft four-on-the-floor,
# finger snaps, shakers, a glassy bell motif. Sections follow timeline.json music.sections (intro / full / build / gap /
# drop / outro). Seeded, no samples. Run from the project root:  python3 scripts/music.py
import json, os
import numpy as np, soundfile as sf
from scipy import signal

TL = json.load(open('timeline.json'))
MU = TL['music']
SR, DUR, BPM = 48000, float(TL['duration']), float(TL['bpm'])
BEAT = 60 / BPM; N = int(SR * DUR); NB = int(round(DUR / BEAT))
beat_of = lambda m: TL['marks'][m] if isinstance(m, str) else float(m)
T = lambda b: b * BEAT
rng = np.random.default_rng(4242)

def tt(d): return np.arange(int(d * SR)) / SR
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def filt(x, kind, f, order=2): return signal.sosfilt(signal.butter(order, f, kind, fs=SR, output='sos'), x, axis=0)
def buf(): return np.zeros((N, 2))
def add(dst, x, t0, g=1.0, pan=0.0):
    i = int(round(t0 * SR))
    if i >= N: return
    if x.ndim == 1: x = np.stack([x * np.sqrt(0.5 * (1 - pan)), x * np.sqrt(0.5 * (1 + pan))], 1)
    j = max(0, -i); n = min(len(x) - j, N - max(i, 0))
    if n > 0: dst[max(i, 0):max(i, 0) + n] += x[j:j + n] * g

# ---------------- voices
def kick(g=1.0, big=False):
    t = tt(0.6 if big else 0.42); f = 44 + 110 * np.exp(-t / 0.045)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t / (0.32 if big else 0.2)) + 0.25 * np.sin(2 * ph) * np.exp(-t / 0.03)
    click = filt(rng.standard_normal(len(t)), 'highpass', 3000) * np.exp(-t / 0.002) * 0.15
    return np.tanh((x + click) * 1.4) * g

def clap(g=1.0):
    t = tt(0.35); n = rng.standard_normal(len(t))
    env = sum(np.exp(-np.clip(t - d, 0, None) / 0.006) * (t >= d) for d in (0, 0.011, 0.022)) * 0.6 + np.exp(-t / 0.09) * (t >= 0.022)
    return filt(filt(n, 'bandpass', [900, 4200]), 'highpass', 600) * env * g * 0.7

def snap(g=1.0):
    t = tt(0.12); n = filt(rng.standard_normal(len(t)), 'bandpass', [1800, 6000])
    return (n * np.exp(-t / 0.012) + 0.4 * np.sin(2 * np.pi * 2100 * t) * np.exp(-t / 0.01)) * g

def hat(g=1.0, open_=False):
    t = tt(0.32 if open_ else 0.06); n = filt(rng.standard_normal(len(t)), 'highpass', 7500)
    return n * np.exp(-t / (0.11 if open_ else 0.014)) * g

def shaker(g=1.0):
    t = tt(0.09); n = filt(rng.standard_normal(len(t)), 'bandpass', [4500, 11000])
    return n * (1 - np.exp(-t / 0.006)) * np.exp(-t / 0.03) * g

def sub(m, d, g=1.0):
    t = tt(d + 0.05); f = hz(m)
    env = np.minimum(1, t / 0.006) * np.exp(-t / (d * 1.4)) * (t < d) + (t >= d) * np.exp(-(t - d) / 0.02) * np.exp(-d / (d * 1.4))
    # sine sub + 2nd/3rd harmonics so the line still reads on phone speakers (which roll off below ~200 Hz)
    return np.tanh(1.3 * (np.sin(2 * np.pi * f * t) + 0.32 * np.sin(4 * np.pi * f * t) + 0.14 * np.sin(6 * np.pi * f * t))) * env * g

def rhodes(m, d=1.6, g=1.0, bright=1.0):
    # 2-op FM tine: ratio 1 carrier/modulator with a fast-decaying index, plus a quieter ratio-14 bark on the attack
    t = tt(d + 0.6); f = hz(m)
    idx = (1.6 * bright) * np.exp(-t / 0.35) + 0.25
    x = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t))
    x += 0.12 * bright * np.sin(2 * np.pi * 14 * f * t) * np.exp(-t / 0.02)
    env = np.minimum(1, t / 0.004) * np.exp(-t / 1.4) * np.where(t < d, 1, np.exp(-(t - d) / 0.18))
    return x * env * g

def pad(ms, d, g=1.0, bright=1800):
    t = tt(d + 0.8); x = np.zeros(len(t))
    for m in ms:
        for det in (-0.08, 0.0, 0.07):
            f = hz(m + det)
            for k in range(1, 7): x += np.sin(2 * np.pi * f * k * t + rng.uniform(0, 6.28)) / k ** 1.3
    env = np.minimum(1, t / 0.6) * np.where(t < d, 1, np.exp(-(t - d) / 0.4))
    return filt(x, 'lowpass', bright) * env * g / (len(ms) * 3)

def bell(m, g=1.0):
    t = tt(1.6); f = hz(m)
    x = np.sin(2 * np.pi * f * t + 2.2 * np.exp(-t / 0.25) * np.sin(2 * np.pi * 3.5 * f * t))
    return x * np.minimum(1, t / 0.002) * np.exp(-t / 0.55) * g

def riser(d, g=1.0):
    t = tt(d); u = t / d
    n = rng.standard_normal(len(t)); y = np.zeros(len(t)); lo = 0.0; band = 0.0
    for i in range(len(t)):   # state-variable band-pass sweeping 300 Hz → 8 kHz
        fc = 300 + 7700 * u[i] ** 2.2; f = 2 * np.sin(np.pi * min(fc, SR / 6) / SR)
        lo += f * band; hi = n[i] - lo - 0.7 * band; band += f * hi; y[i] = band
    return y * u ** 2.4 * g

def crash(g=1.0):
    t = tt(2.2); n = filt(rng.standard_normal(len(t)), 'highpass', 5000)
    return n * np.exp(-t / 0.7) * np.minimum(1, t / 0.003) * g

def room(x, secs=1.6, mix=0.25, seed=7):
    r = np.random.default_rng(seed); t = tt(secs); out = []
    for ch in range(2):
        ir = filt(r.standard_normal(len(t)) * np.exp(-t * 5 / secs), 'lowpass', 7000); ir /= np.sqrt((ir ** 2).sum())
        out.append(signal.fftconvolve(x[:, ch], ir)[:N])
    return np.stack(out, 1) * mix

# ---------------- harmony
CH = {  # bass root, Rhodes voicing (smooth leading around E5)
    'Dm9':   (38, [62, 65, 69, 72, 76]),
    'G13':   (43, [65, 69, 71, 76]),
    'Cmaj9': (36, [64, 67, 71, 74]),
    'Am9':   (45, [67, 71, 72, 76]),
}
PROG = [CH[c] for c in MU['chords']]
SECS = sorted((beat_of(s['at']), s['kind']) for s in MU['sections'])
def section(b):
    cur = SECS[0]
    for s in SECS:
        if s[0] <= b + 1e-9: cur = s
    nxt = next((s[0] for s in SECS if s[0] > cur[0]), NB)
    return cur[1], cur[0], nxt
ACC = [beat_of(a) for a in MU.get('accents', [])]
GAP = [(s0, next((s for s, _ in SECS if s > s0), NB)) for s0, k in SECS if k == 'gap']
in_gap = lambda b: any(g0 <= b < g1 for g0, g1 in GAP)

kb, dr, bs, keys, pads, fx = buf(), buf(), buf(), buf(), buf(), buf()
BASS = [(0, 0, 0.42), (0.75, 0, 0.2), (1.5, 12, 0.2), (2, 0, 0.42), (2.75, 7, 0.2), (3.5, 12, 0.2)]   # (beat, +semis, dur) per bar
BELL = [(0, 81), (0.75, 79), (1.5, 76), (2.5, 74), (3.0, 76), (4.5, 69), (5.5, 72), (6.0, 74)]       # 2-bar motif
for bar in range(NB // 4):
    b0 = bar * 4; root, voic = PROG[bar % len(PROG)]
    for pos in range(4):
        b = b0 + pos; kind, s0, s1 = section(b)
        if kind == 'gap': continue
        first = abs(b - np.ceil(s0)) < 1e-9
        g = 'full' if kind == 'drop' else kind
        # kick
        if g in ('full', 'build') or (g in ('intro', 'outro') and pos in (0, 2) and not (g == 'intro' and pos == 2)):
            big = (first and kind in ('drop',)) or b in ACC or b == 0
            add(kb, kick(1.15 if big else (0.75 if g in ('intro', 'outro') else 1.0), big), T(b))
        # backbeat: snaps in intro/outro, clap in full
        if pos in (1, 3):
            if g in ('intro', 'outro'): add(dr, snap(0.5), T(b), pan=0.15)
            else: add(dr, clap(0.55), T(b), pan=0.05); add(dr, snap(0.25), T(b + 0.02), pan=-0.2)
        # hats / shaker
        if g in ('full', 'build'):
            add(dr, hat(0.35, True), T(b + 0.5), pan=0.25)
            for k, a in zip((0, 0.25, 0.5, 0.75), (0.32, 0.18, 0.26, 0.2)): add(dr, shaker(a), T(b + k), pan=-0.3)
        elif g == 'intro':
            for k in (0.5,): add(dr, shaker(0.22), T(b + k), pan=-0.3)
    kind, s0, s1 = section(b0)
    if kind == 'gap': continue
    g = 'full' if kind == 'drop' else kind
    # bass
    if g in ('full', 'build'):
        for bb, st, d in BASS:
            if not in_gap(b0 + bb): add(bs, sub(root + st, d * BEAT * 2, 0.8), T(b0 + bb))
    else:
        add(bs, sub(root, BEAT * 3.6, 0.75), T(b0))
    # keys: intro/outro = sustained Rhodes chord with soft tremolo; full = bar chord + off-beat stabs
    if g in ('intro', 'outro'):
        for k, m in enumerate(voic): add(keys, rhodes(m, BEAT * 3.8, 0.22, 0.8), T(b0) + k * 0.012, pan=(k - 2) * 0.22)
    else:
        for k, m in enumerate(voic): add(keys, rhodes(m, BEAT * 1.4, 0.2, 1.0), T(b0) + k * 0.008, pan=(k - 2) * 0.22)
        for st in (1.5, 3.5):
            if in_gap(b0 + st): continue
            for k, m in enumerate(voic[1:]): add(keys, rhodes(m, BEAT * 0.35, 0.16, 1.2), T(b0 + st) + k * 0.006, pan=(k - 1.5) * 0.3)
    # pad bed under everything but the gap
    add(pads, pad([voic[0] - 12, voic[2] - 12, voic[-1]], BEAT * 4, 0.55, 1400 if g in ('intro', 'outro') else 2200), T(b0))
    # bell motif every other bar in full / drop sections
    if g in ('full',) and bar % 2 == 0:
        for bb, m in BELL:
            if b0 + bb < s1 and not in_gap(b0 + bb): add(keys, bell(m, 0.14), T(b0 + bb), pan=0.35 if bb % 1 else -0.35)

# section accents
for s0, kind in SECS:
    if kind == 'build':
        s1 = next((s for s, _ in SECS if s > s0), NB)
        add(fx, riser(T(s1 - s0) - 0.06, 0.32), T(s0))
        for i in range(8): add(dr, snap(0.15 + 0.04 * i), T(s1 - 1 + i * 0.125), pan=0.1)
    if kind == 'drop' or s0 in ACC:
        root, voic = PROG[int(s0 // 4) % 4]
        add(fx, crash(0.22), T(s0)); add(bs, sub(root - 12 if root > 40 else root, 1.4, 0.9), T(s0))
        for k, m in enumerate(voic + [voic[0] + 12]): add(keys, rhodes(m, BEAT * 3, 0.2, 1.1), T(s0) + k * 0.01, pan=(k - 2) * 0.2)
for g0, _ in GAP: add(kb, kick(0.9), T(g0)); add(dr, clap(0.6), T(g0))           # stop-time hit, then silence
add(fx, crash(0.16), 0)                                                           # frame 0 lands with the hook
for a in ACC: add(fx, crash(0.18), T(a))

# ---------------- mix
keys = keys + room(keys, 1.8, 0.3)
pads = pads + room(pads, 2.2, 0.35, 9)
duck = np.ones(N); env = np.abs(kb[:, 0]); L = int(BEAT * SR)
for b in range(NB):
    i = int(T(b) * SR)
    if i < N and env[i:i + int(0.02 * SR)].max() > 0.05:
        e = 1 - 0.55 * np.exp(-np.arange(L) / (0.09 * SR)); seg = duck[i:i + L]; seg[:] = np.minimum(seg, e[:len(seg)])
bs *= duck[:, None]; pads *= (0.4 + 0.6 * duck)[:, None]
for g0, g1 in GAP:   # hard silence through the gap (after the stop-time hit's first 120 ms)
    a, z = int((T(g0) + 0.12) * SR), int(T(g1) * SR)
    for x in (bs, keys, pads):
        x[a:z] *= np.linspace(1, 0, z - a)[:, None] ** 6
mix = kb * 0.72 + dr * 0.95 + bs * 0.62 + keys * 1.25 + pads * 0.5 + fx * 0.6 + room(dr * 0.4, 1.0, 0.15, 3)
mix = filt(mix, 'highpass', 30)
mix = mix + 0.45 * filt(mix, 'highpass', 2500)          # presence / air shelf (~+3 dB above 2.5 kHz)
peak = np.abs(mix).max(); mix /= peak / 10 ** (-1 / 20)
stem = (kb * 0.72 + dr * 0.95) / (peak / 10 ** (-1 / 20))
os.makedirs('audio', exist_ok=True)
sf.write('audio/music.wav', mix.astype(np.float32), SR, subtype='FLOAT')
sf.write('audio/drums.wav', stem.astype(np.float32), SR, subtype='FLOAT')
print(f'audio/music.wav  {DUR}s  {BPM:g} bpm  {NB} beats  sections: ' + ', '.join(f'b{s:g} {k}' for s, k in SECS))

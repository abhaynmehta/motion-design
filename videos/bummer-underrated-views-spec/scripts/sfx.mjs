// Synthesize UI sounds from cues.json → audio/sfx.wav (48 kHz stereo, 32-bit float). No samples, no deps.
// Run from the project root after scripts/sync.mjs.
//   click    cursor press / button: 1 ms HP noise tick + 2.3 kHz blip + 520 Hz body
//   tick     typing key: quieter, shorter click
//   pop      something appears: sine glide 820 → 1720 Hz + soft tick
//   thump    logo / impact: 95 → 42 Hz sine drop + felt transient, ~0.5 s
//   whoosh   morph / whip / push-through: band-passed noise sweeping up, PEAKING at the cue time, panned L → R
//   riser    build into a drop: 2 s filtered noise + rising tone, PEAKING at the cue time (set the cue on the drop)
//   shutter  hard cut / wipe: two band-passed noise clacks
//   silk     soft air whoosh (match cuts) · chime  small bell · boom  deep soft impact · shimmer  high glints · drop  water-drop plip
//   beep / longbeep  interval-timer beeps · whistle  a coach's pea whistle · pa  airport ding-dong chime
//   zip      a zipper pulled open: a train of tooth clicks speeding up over fabric hiss, 0.32 s, centred on the cue
//   rip      a big zip ripped open: longer, louder, with a low tearing body, 0.5 s, centred on the cue
// Cue fields: t (s), type, gain (0.8), pitch (1 = nominal; sync.mjs jitters ±6 %), pan (-1..1)
import fs from 'node:fs';

const { sr: SR, duration, cues } = JSON.parse(fs.readFileSync('cues.json', 'utf8'));
const N = Math.round(SR * duration);
const L = new Float32Array(N), R = new Float32Array(N);
const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const TAU = Math.PI * 2;

// one-pole high-pass / low-pass on a Float32Array, in place
const hp = (x, fc) => { const a = Math.exp(-TAU * fc / SR); let yp = 0, xp = 0; for (let i = 0; i < x.length; i++) { const y = a * (yp + x[i] - xp); xp = x[i]; yp = y; x[i] = y; } return x; };
const lp = (x, fc) => { const a = 1 - Math.exp(-TAU * fc / SR); let z = 0; for (let i = 0; i < x.length; i++) { z += a * (x[i] - z); x[i] = z; } return x; };
const noise = (n, seed) => { const r = mulberry32(seed); const x = new Float32Array(n); for (let i = 0; i < n; i++) x[i] = r() * 2 - 1; return x; };
// Chamberlin state-variable band-pass with a per-sample centre frequency
function sweepBP(nz, fcOf, q = 0.55) {
  const x = new Float32Array(nz.length); let lo = 0, band = 0;
  for (let i = 0; i < nz.length; i++) {
    const f = 2 * Math.sin(Math.PI * Math.min(fcOf(i / SR), SR / 6) / SR);
    lo += f * band; const hi = nz[i] - lo - q * band; band += f * hi; x[i] = band;
  }
  return x;
}

function click(p, seed, g = 1, len = 0.06) {
  const n = Math.round(len * SR), x = new Float32Array(n), nz = hp(hp(noise(n, seed), 3500), 3500);
  for (let i = 0; i < n; i++) { const t = i / SR; x[i] = (nz[i] * Math.exp(-t * 2600) * 0.9 + Math.sin(TAU * 2300 * p * t) * Math.exp(-t * 190) * 0.45 + Math.sin(TAU * 520 * p * t) * Math.exp(-t * 110) * 0.55) * g; }
  return { x, lead: 0 };
}
const tick = (p, seed) => click(p * 1.25, seed, 0.55, 0.035);
function pop(p, seed) {
  const n = Math.round(0.1 * SR), x = new Float32Array(n), nz = hp(noise(n, seed), 5000); let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR, f = (820 + 900 * (1 - Math.exp(-t * 60))) * p; ph += TAU * f / SR; x[i] = Math.sin(ph) * Math.exp(-t * 42) * Math.min(1, t / 0.002) * 0.8 + nz[i] * Math.exp(-t * 3000) * 0.35; }
  return { x, lead: 0 };
}
function thump(p, seed) {
  const n = Math.round(0.6 * SR), x = new Float32Array(n), nz = lp(noise(n, seed), 900); let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR, f = (42 + 53 * Math.exp(-t * 22)) * p; ph += TAU * f / SR; x[i] = Math.tanh((Math.sin(ph) * Math.exp(-t * 7) + nz[i] * Math.exp(-t * 60) * 0.6) * 1.6); }
  return { x, lead: 0 };
}
function whoosh(p, seed) {   // 0.30 s build, 0.14 s release; peaks exactly on the cue
  const pre = 0.30, post = 0.14, n = Math.round((pre + post) * SR);
  const bp = sweepBP(noise(n, seed), (t) => (350 + 6500 * Math.min(1, t / pre) ** 2) * p);
  for (let i = 0; i < n; i++) { const t = i / SR, u = Math.min(1, t / pre); bp[i] *= (t < pre ? Math.pow(u, 2.2) : Math.exp(-(t - pre) * 24)) * 0.62; }
  return { x: bp, lead: pre, stereo: true };
}
function riser(p, seed) {   // 2.0 s build; peaks on the cue, then cuts with a 30 ms tail
  const pre = 2.0, post = 0.03, n = Math.round((pre + post) * SR);
  const bp = sweepBP(noise(n, seed), (t) => (300 + 7000 * Math.min(1, t / pre) ** 2.4) * p, 0.8);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR, u = Math.min(1, t / pre); ph += TAU * 220 * p * Math.pow(2, 2 * u) / SR;
    const env = t < pre ? Math.pow(u, 2.6) : Math.exp(-(t - pre) * 120);
    bp[i] = (bp[i] * 0.8 + Math.sin(ph) * 0.18) * env;
  }
  return { x: bp, lead: pre };
}
function shutter(p, seed) {
  const n = Math.round(0.09 * SR), nz = hp(lp(noise(n, seed), 9000 * p), 2000 * p), x = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; x[i] = nz[i] * (Math.exp(-t * 90) + 0.8 * (t > 0.035 ? Math.exp(-(t - 0.035) * 110) : 0)) * 1.3; }
  return { x, lead: 0 };
}
function silk(p, seed) {     // soft air whoosh: 0.45 s build, 0.35 s release, peaks on the cue, travels L → R
  const pre = 0.45, post = 0.35, n = Math.round((pre + post) * SR);
  const bp = sweepBP(noise(n, seed), (t) => (240 + 2400 * Math.sin(Math.PI * 0.5 * Math.min(1, t / pre)) ** 2) * p, 0.9);
  const lo = lp(noise(n, seed + 1), 500);
  for (let i = 0; i < n; i++) {
    const t = i / SR, u = Math.min(1, t / pre);
    const env = t < pre ? Math.pow(Math.sin(Math.PI * 0.5 * u), 3) : Math.exp(-(t - pre) * 9);
    bp[i] = (bp[i] * 0.55 + lo[i] * 0.5) * env;
  }
  return { x: bp, lead: pre, stereo: true };
}
function chime(p, seed) {    // small bell on A5: inharmonic partials, long decay
  const n = Math.round(2.6 * SR), x = new Float32Array(n), f = 880 * p, r = mulberry32(seed);
  const parts = [[1, 1, 1.0], [2.0, 0.42, 0.62], [2.76, 0.30, 0.45], [5.4, 0.14, 0.25], [8.93, 0.06, 0.14]];
  const ph = parts.map(() => r() * TAU);
  for (let i = 0; i < n; i++) {
    const t = i / SR; let v = 0;
    parts.forEach(([k, a, d], j) => { v += a * Math.sin(TAU * f * k * t + ph[j]) * Math.exp(-t / (0.9 * d)); });
    x[i] = v * Math.min(1, t / 0.002) * 0.55;
  }
  return { x, lead: 0 };
}
function boom(p, seed) {     // deep, soft impact: falling sub, warm body, felt thump
  const n = Math.round(3.0 * SR), x = new Float32Array(n), nz = lp(lp(noise(n, seed), 180), 180); let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR, f = (34 + 26 * Math.exp(-t / 0.18)) * p; ph += TAU * f / SR;
    x[i] = Math.tanh(1.5 * (Math.sin(ph) * Math.exp(-t / 1.1) + Math.sin(TAU * 98 * t) * Math.exp(-t / 0.12) * 0.35 + nz[i] * Math.exp(-t / 0.06) * 6));
  }
  return { x, lead: 0 };
}
function shimmer(p, seed) {  // high glints (D6 F#6 A6 D7) swelling into the cue, then a long airy decay
  const pre = 0.35, n = Math.round((pre + 1.8) * SR), x = new Float32Array(n), r = mulberry32(seed);
  const notes = [1174.66, 1479.98, 1760.0, 2349.32].map((f) => [f * p, r() * TAU, 1.5 + 2 * r()]);
  for (let i = 0; i < n; i++) {
    const t = i / SR, env = t < pre ? Math.pow(t / pre, 2) : Math.exp(-(t - pre) / 0.6);
    let v = 0; for (const [f, ph, am] of notes) v += Math.sin(TAU * f * t + ph) * (0.55 + 0.45 * Math.sin(TAU * am * t));
    x[i] = v * env * 0.22;
  }
  return { x, lead: pre };
}
function drop(p, seed) {     // water-drop plip: a sine that leaps up an octave and a half in 25 ms, tiny tail, soft splash
  const n = Math.round(0.28 * SR), x = new Float32Array(n), nz = hp(lp(noise(n, seed), 7000), 1800); let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR, f = (520 + 1250 * (1 - Math.exp(-t / 0.012))) * p; ph += TAU * f / SR;
    x[i] = Math.sin(ph) * Math.exp(-t / 0.045) * Math.min(1, t / 0.0015) * 0.85 + nz[i] * Math.exp(-Math.abs(t - 0.03) / 0.012) * 0.12;
  }
  return { x, lead: 0 };
}
function beep(p, seed) {     // interval-timer beep: 880 Hz with a little third harmonic, 130 ms, soft edges
  const n = Math.round(0.13 * SR), x = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR, env = Math.min(1, t / 0.004) * Math.min(1, (0.13 - t) / 0.02); x[i] = (Math.sin(TAU * 880 * p * t) + 0.18 * Math.sin(TAU * 2640 * p * t)) * env * 0.5; }
  return { x, lead: 0 };
}
const longbeep = (p, seed) => { const n = Math.round(0.42 * SR), x = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR, env = Math.min(1, t / 0.004) * Math.min(1, (0.42 - t) / 0.06); x[i] = (Math.sin(TAU * 1320 * p * t) + 0.18 * Math.sin(TAU * 3960 * p * t)) * env * 0.5; }
  return { x, lead: 0 }; };
function whistle(p, seed) {  // coach's pea whistle: ~2.9 kHz tone trilled at 28 Hz by the pea, breathy band of noise, 0.5 s
  const len = 0.5 * Math.min(1.6, Math.max(0.6, 1 / p)), n = Math.round(len * SR), x = new Float32Array(n);
  const air = sweepBP(noise(n, seed), () => 3000 * p, 0.25); let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR, trill = Math.sin(TAU * 28 * t), f = 2900 * p * (1 + 0.035 * trill); ph += TAU * f / SR;
    const env = Math.min(1, t / 0.012) * Math.min(1, (len - t) / 0.05);
    x[i] = (Math.sin(ph) * (0.72 + 0.28 * trill) * 0.42 + air[i] * 0.35) * env;
  }
  return { x, lead: 0 };
}
function pa(p, seed) {       // airport PA chime: ding (E5) then dong (C5), soft bells with a long tail
  const n = Math.round(1.9 * SR), x = new Float32Array(n);
  const note = (f, t0, t) => { const u = t - t0; if (u < 0) return 0; const env = Math.min(1, u / 0.008) * Math.exp(-u / 0.55);
    return (Math.sin(TAU * f * u) + 0.25 * Math.sin(TAU * 2 * f * u) * Math.exp(-u / 0.2) + 0.08 * Math.sin(TAU * 3.01 * f * u) * Math.exp(-u / 0.12)) * env; };
  for (let i = 0; i < n; i++) { const t = i / SR; x[i] = (note(659.25 * p, 0, t) + note(523.25 * p, 0.42, t)) * 0.42; }
  return { x, lead: 0 };
}
function zipper(p, seed, len, body) {   // tooth clicks at a rate that climbs, over fabric hiss; centred on the cue
  const n = Math.round(len * SR), x = new Float32Array(n), r = mulberry32(seed), hiss = hp(hp(noise(n, seed + 7), 1800), 1800);
  const tooth = Math.round(0.0016 * SR), tn = hp(hp(noise(tooth, seed + 3), 2600), 2600);
  for (let tk = 0.004; tk < len - 0.004;) {
    const u = tk / len, rate = (150 + 230 * Math.sqrt(u)) * p * (0.85 + 0.3 * r());
    const i0 = Math.round(tk * SR), g = (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, u * 1.15))) * (0.7 + 0.3 * r());
    for (let j = 0; j < tooth && i0 + j < n; j++) x[i0 + j] += tn[j] * Math.exp(-j / (0.00035 * SR)) * g;
    tk += 1 / rate;
  }
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR, u = t / len, env = Math.sin(Math.PI * u) ** 0.7;
    x[i] = x[i] * 1.1 + hiss[i] * env * 0.16;
    if (body) { ph += TAU * (70 + 50 * u) * p / SR; x[i] += Math.sin(ph) * env * body; }
  }
  return { x, lead: len / 2, stereo: true };
}
const zip = (p, seed) => zipper(p, seed, 0.32, 0);
const rip = (p, seed) => zipper(p * 0.8, seed, 0.5, 0.35);
const SYN = { click, tick, pop, thump, whoosh, riser, shutter, silk, chime, boom, shimmer, drop, beep, longbeep, whistle, pa, zip, rip };

cues.forEach((c, k) => {
  if (!SYN[c.type]) throw new Error(`unknown sfx type "${c.type}" (have: ${Object.keys(SYN).join(', ')})`);
  const { x, lead, stereo } = SYN[c.type](c.pitch ?? 1, 9001 + k * 131);
  const start = Math.round((c.t - lead) * SR), g = c.gain ?? 0.8;
  for (let i = 0; i < x.length; i++) {
    const j = start + i; if (j < 0 || j >= N) continue;
    const pan = stereo ? -0.7 + 1.4 * (i / x.length) : (c.pan ?? 0);   // whoosh travels across the field
    L[j] += x[i] * g * Math.sqrt(0.5 * (1 - pan)) * 1.2;
    R[j] += x[i] * g * Math.sqrt(0.5 * (1 + pan)) * 1.2;
  }
});

function wav(path, chans) {   // 32-bit float WAV
  const n = chans[0].length, nc = chans.length, data = Buffer.alloc(n * nc * 4), h = Buffer.alloc(44);
  for (let i = 0; i < n; i++) for (let c = 0; c < nc; c++) data.writeFloatLE(chans[c][i], (i * nc + c) * 4);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16);
  h.writeUInt16LE(3, 20); h.writeUInt16LE(nc, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * nc * 4, 28); h.writeUInt16LE(nc * 4, 32); h.writeUInt16LE(32, 34);
  h.write('data', 36); h.writeUInt32LE(data.length, 40); fs.writeFileSync(path, Buffer.concat([h, data]));
}
fs.mkdirSync('audio', { recursive: true });
wav('audio/sfx.wav', [L, R]);
let pk = 0; for (let i = 0; i < N; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
console.log(`audio/sfx.wav  ${cues.length} cues  ${duration}s  peak ${(20 * Math.log10(pk + 1e-12)).toFixed(1)} dBFS`);

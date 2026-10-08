#!/usr/bin/env node
// The gate: checks a reel project against playbook/LESSONS.md before a final render, and its pixels after.
//   node playbook/tools/preflight.mjs <project-dir>                     script, footage, type, music, repetition
//   node playbook/tools/preflight.mjs <project-dir> --render <mp4>      + look checks on the rendered file
//   node playbook/tools/preflight.mjs <project-dir> --register          append the reel to playbook/registry.json (only if clean)
// Exit 1 on any FAIL. A FAIL can be waived only in script.json → waivers: { "L04": "reason" } (printed on every run).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)), PLAY = path.resolve(HERE, '..');
const argv = process.argv.slice(2), PROJ = path.resolve(argv.find((a) => !a.startsWith('--')) || '.');
const opt = (k) => { const i = argv.indexOf(`--${k}`); return i < 0 ? null : argv[i + 1]; };
const has = (k) => argv.includes(`--${k}`);
const read = (f) => (fs.existsSync(path.join(PROJ, f)) ? fs.readFileSync(path.join(PROJ, f), 'utf8') : null);
const json = (f) => { const s = read(f); return s ? JSON.parse(s) : null; };

const R = [];
const add = (id, level, msg) => R.push({ id, level, msg });
const pass = (id, msg) => add(id, 'PASS', msg), warn = (id, msg) => add(id, 'WARN', msg), fail = (id, msg) => add(id, 'FAIL', msg);
const words = (s) => (s || '').replace(/[“”"'’.,!?…:;()*\-–—·]/g, ' ').split(/\s+/).filter(Boolean);
const STOP = new Set('a an the and or but of to in on for with your you it is are be at by from this that its as all into'.split(' '));
const key = (s) => words(s).map((w) => w.toLowerCase()).filter((w) => !STOP.has(w) && w.length > 2);

const S = json('script.json');
if (!S) { fail('L00', 'script.json missing: write it first (playbook/templates/script.json, SCRIPT_METHOD.md)'); finish(); }

// ------------------------------------------------------------------ L01 one message
{
  const smp = (S.smp || '').trim(), n = words(smp).length, sentences = smp.split(/[.!?](?!\.)/).filter((x) => x.trim()).length;
  if (!smp) fail('L01', 'no SMP');
  else if (n > 14 || sentences > 1) fail('L01', `SMP must be one sentence ≤ 14 words (has ${n} words, ${sentences} sentences): "${smp}"`);
  else pass('L01', `SMP: "${smp}" (${n} words)`);
  if (!S.product || !S.product.name) fail('L01', 'no product.name');
  if ((S.range || []).length > 1 && !(S.range_reason || '').trim()) fail('L01', `a range of ${S.range.length} needs range_reason: the one idea that sells them together`);
  for (const k of ['audience', 'insight']) if (!(S[k] || '').trim()) fail('L01', `${k} is empty`);
}

// ------------------------------------------------------------------ beats (L03, L08, L09, L10)
const beats = S.beats || [];
const dur = beats.length ? Math.max(...beats.map((b) => b.to)) : 0;
{
  const core = beats.filter((b) => b.role !== 'montage');
  if (!beats.length) fail('L03', 'no beats');
  if (core.length > 6) fail('L03', `${core.length} beats — more than 6 sections fragments the story`);
  for (const b of beats) {
    if (!b.says || !b.shows || !b.serves) fail('L02', `beat "${b.id}" needs says / shows / serves`);
    const d = b.to - b.from;
    if (!['montage', 'cta', 'hook'].includes(b.role) && d < 2.5) fail('L03', `beat "${b.id}" lasts ${d.toFixed(1)} s (< 2.5 s): merge it`);
    if (b.says && words(b.says).length > 7 && b.role !== 'montage') warn('L05', `beat "${b.id}" says ${words(b.says).length} words (> 7): "${b.says}"`);
  }
  if (!(S.device || '').trim() || words(S.device_why).length < 6) fail('L03', 'device and device_why (≥ 6 words: why the device IS the message) required');
  else pass('L03', `device: ${S.device}`);
  const h = beats[0];
  if (!h || h.role !== 'hook' || h.from !== 0) fail('L08', 'beat 0 must be the hook at 0 s');
  else {
    const tags = h.tags || [];
    if (h.to > 3.5) fail('L08', `hook runs to ${h.to} s (> 3.5 s)`);
    if (words(h.says).length > 8) fail('L08', `hook line is ${words(h.says).length} words (> 8)`);
    if (!tags.some((t) => ['product', 'person', 'tension'].includes(t))) fail('L08', 'hook must show the product, a person or the tension (tags)');
  }
  const early = beats.some((b) => b.from < 3 && (b.tags || []).includes('product'));
  if (!early) fail('L08', 'the product is not on screen in the first 3 s (tag a beat starting < 3 s with "product")');
  if (h && !R.some((r) => r.id === 'L08' && r.level === 'FAIL')) pass('L08', `hook: "${h.says}" — ${h.shows}`);
  const proof = beats.find((b) => b.role === 'proof' && (b.tags || []).some((t) => ['demo', 'texture', 'result', 'in-use'].includes(t)));
  if (!proof) fail('L09', 'no proof beat (role "proof" tagged demo / texture / result / in-use)');
  else pass('L09', `proof: ${proof.shows}`);
  const cta = beats[beats.length - 1];
  const short = (S.product && (S.product.short || S.product.name) || '').toLowerCase();
  if (!cta || cta.role !== 'cta') fail('L10', 'last beat must be the cta');
  else {
    const says = (cta.says || '').toLowerCase();
    if (!says.includes(short)) fail('L10', `cta must name the product ("${short}")`);
    if (!(S.product.price && says.includes(String(S.product.price).toLowerCase())) && !(S.product.where && says.includes(String(S.product.where).toLowerCase())))
      fail('L10', 'cta must carry the price or where to buy');
    if (cta.to - cta.from > 3.5) warn('L10', `cta holds ${(cta.to - cta.from).toFixed(1)} s (> 3.5 s)`);
    if (!R.some((r) => r.id === 'L10' && r.level === 'FAIL')) pass('L10', `cta: "${cta.says}"`);
  }
}

// ------------------------------------------------------------------ L02 footage matches words
{
  const SH = json('shots.json');
  if (!SH) warn('L02', 'no shots.json (no footage?) — if the reel uses footage, tag every shot');
  else {
    const used = new Set(beats.flatMap((b) => b.shots || []));
    const cat = S.product && S.product.category;
    let bad = 0;
    for (const [k, s] of Object.entries(SH.shots || {})) {
      if (!s.shows || !s.category) { fail('L02', `shot "${k}" needs shows + category`); bad++; continue; }
      if (s.category !== cat && s.category !== 'neutral') { fail('L02', `shot "${k}" is category "${s.category}" in a "${cat}" reel: ${s.shows}`); bad++; }
      if (!used.has(k)) { fail('L02', `shot "${k}" isn't used by any beat (every shot must serve a line)`); bad++; }
    }
    for (const b of beats) for (const k of b.shots || []) if (!(SH.shots || {})[k]) { fail('L02', `beat "${b.id}" uses unknown shot "${k}"`); bad++; }
    if (!bad) pass('L02', `${Object.keys(SH.shots || {}).length} shots, all ${cat}/neutral and all serving a beat`);
  }
}

// ------------------------------------------------------------------ L05 type (parsed from film.js) and L07 recall
const film = read('film/film.js') || '', html = read('film/index.html') || '';
const supers = [];
{
  // text helpers: line(root, 'text', x, y, SIZE, …) and any helper(root, 'text', …, { size: N }); canvas fonts 'NNpx'
  const lit = "(?:(['\"`])((?:\\\\.|(?!\\1).)*)\\1|([\\w.[\\]]+))";
  const res = [new RegExp(`\\bline\\(\\s*[^,()]+,\\s*${lit}\\s*,\\s*[^,()]+,\\s*[^,()]+,\\s*(\\d+)`, 'g'),
    new RegExp(`\\b\\w+\\(\\s*[^,()]+,\\s*${lit}\\s*,[^;\\n]*?\\bsize:\\s*(\\d+)`, 'g')];
  const small = [], seen = new Set();
  for (const re of res) { let m; while ((m = re.exec(film))) {
    const text = m[2] != null ? m[2].replace(/\\'/g, "'") : null, size = +m[4], k = `${m.index}`;
    if (seen.has(k)) continue; seen.add(k);
    const ok = (S.small_ok || []).some((s) => text && (text.includes(s) || s.includes(text)));
    if (text && size >= 44) supers.push(text);   // only readable text counts as 'on screen' for recall (L07)
    if (size < 44 && !ok) small.push(`${size}px "${text ?? m[3]}"`);
  } }
  for (const m of film.matchAll(/font\s*=\s*[`'"][^`'"]*?(\d+)px/g)) if (+m[1] < 44) small.push(`canvas ${m[1]}px`);
  if (small.length) fail('L05', `${small.length} text line(s) below 44 px (add to small_ok only if legal/source): ${small.slice(0, 6).join(' · ')}`);
  else pass('L05', 'every readable line ≥ 44 px');
  const fams = new Set([...html.matchAll(/font-family:\s*'([^']+)'\s*;\s*src/g)].map((x) => x[1]));
  if (fams.size > 2) warn('L05', `${fams.size} font families (${[...fams].join(', ')}): two is the rule`);
  for (const t of supers) if (words(t).length > 10) warn('L05', `super of ${words(t).length} words: "${t}"`);
}
{
  const all = [...supers, ...beats.map((b) => b.says || '')].join(' ').toLowerCase();
  const rc = S.recall || {};
  if (!rc.what || !rc.does || !rc.why) fail('L07', 'recall needs what / does / why');
  else {
    const what = (S.product.short || S.product.name).toLowerCase();
    const k = key(rc.does), hit = k.filter((w) => all.includes(w));
    if (!all.includes(what)) fail('L07', `the product ("${what}") is never on screen`);
    if (k.length && hit.length / k.length < 0.5) fail('L07', `what it does ("${rc.does}") isn't said on screen (found ${hit.length}/${k.length} key words)`);
    if (!R.some((r) => r.id === 'L07' && r.level === 'FAIL')) pass('L07', `recall: ${rc.what} · ${rc.does} · ${rc.why}`);
  }
}

// ------------------------------------------------------------------ L04 ground colour
{
  const bg = (html.match(/--bg:\s*([^;]+);/) || [])[1];
  const resolve = (v) => { const m = v && v.match(/var\((--[\w-]+)\)/); return m ? (html.match(new RegExp(`${m[1]}:\\s*([^;]+);`)) || [])[1] : v; };
  const hex = (resolve(bg) || '').trim();
  const lum = (h) => { const c = h.replace('#', ''); if (c.length < 6) return null; const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const L = /^#[0-9a-f]{6}$/i.test(hex) ? lum(hex) : null;
  if (L == null) warn('L04', `couldn't read --bg (${bg})`);
  else if (L > 0.6 && (S.look || {}).ground !== 'pale') fail('L04', `--bg ${hex} is pale (luminance ${L.toFixed(2)}): use footage, dark or a colour field, or declare look.ground "pale" with a reason`);
  else if (L > 0.6 && !((S.look || {}).why || '').trim()) fail('L04', 'a pale ground needs look.why');
  else pass('L04', `ground ${hex} (luminance ${L.toFixed(2)}, ${S.look ? S.look.ground : '?'})`);
}

// ------------------------------------------------------------------ L06 music, L11 repetition, L12 claims
const REG = JSON.parse(fs.readFileSync(path.join(PLAY, 'registry.json'), 'utf8'));
const prior = REG.reels.filter((r) => r.slug !== path.basename(PROJ));
{
  const M = S.music || {};
  if (!['song', 'supplied'].includes(M.source)) fail('L06', `music.source "${M.source}": pitches use a real song (song | supplied), not stock or synth`);
  if (!M.title || !M.artist) fail('L06', 'music.title and music.artist required');
  if (prior.some((r) => (r.music || '').toLowerCase() === `${M.artist} — ${M.title}`.toLowerCase())) fail('L06', `"${M.title}" was already used`);
  const last = prior[prior.length - 1];
  if (last && M.genre && last.genre && last.genre.toLowerCase() === M.genre.toLowerCase()) warn('L06', `same genre as the last reel (${M.genre})`);
  if (!(M.drop_at_s > 0)) fail('L06', 'music.drop_at_s missing: find the drop and put the turn/reveal on it');
  else {
    const on = beats.find((b) => ['turn', 'reveal', 'payoff', 'proof'].includes(b.role) && Math.abs(b.from - M.drop_at_s) <= 0.3);
    if (!on) fail('L06', `nothing turns on the drop (${M.drop_at_s} s): start the turn/reveal there`);
  }
  if (!R.some((r) => r.id === 'L06' && r.level === 'FAIL')) pass('L06', `${M.artist} — ${M.title} (${M.genre}, drop at ${M.drop_at_s} s → ${beats.find((b) => Math.abs(b.from - M.drop_at_s) <= 0.3)?.id})`);

  const recent = prior.slice(-5);
  const dev = (S.device || '').toLowerCase(), devKey = key(dev);
  const clash = recent.find((r) => { const k = key(r.device); return k.filter((w) => devKey.includes(w)).length >= Math.min(2, devKey.length); });
  if (clash) fail('L11', `device too close to ${clash.slug} ("${clash.device}")`);
  const l2 = prior.slice(-2);
  if (l2.length === 2 && l2.every((r) => r.hook_type === S.hook_type)) warn('L11', `hook type "${S.hook_type}" used by the last two reels`);
  if (last && last.ground === (S.look || {}).ground && S.look.ground === 'pale') warn('L11', 'pale ground two reels in a row');
  if (!R.some((r) => r.id === 'L11' && r.level !== 'PASS')) pass('L11', `device, hook and ground differ from the last reels (${recent.map((r) => r.slug).join(', ')})`);

  const noSrc = (S.claims || []).filter((c) => !(c.source || '').trim());
  if (noSrc.length) fail('L12', `${noSrc.length} claim(s) without a source: ${noSrc.map((c) => c.text).join(' · ')}`);
  else pass('L12', `${(S.claims || []).length} claims, all sourced`);
}

// ------------------------------------------------------------------ L04 / L13 on the pixels
const MP4 = opt('render');
if (MP4) {
  const mp4 = fs.existsSync(path.resolve(MP4)) ? path.resolve(MP4) : path.resolve(PROJ, MP4);
  const p = spawnSync('python3', [path.join(HERE, 'audit_render.py'), mp4], { encoding: 'utf8' });
  if (p.status) fail('L04', `audit_render failed: ${p.stderr}`);
  else {
    const m = JSON.parse(p.stdout.trim().split('\n').pop());
    const lvl = (v, ok, bad) => (v <= ok ? 'PASS' : v <= bad ? 'WARN' : 'FAIL');
    add('L04', lvl(m.canvas_frames, 0.2, 0.3), `${(m.canvas_frames * 100).toFixed(0)} % of frames are mostly flat pale canvas (≤ 20 %)`);
    add('L04', lvl(m.longest_pale_run_s, 2, 3), `longest pale stretch ${m.longest_pale_run_s} s (≤ 2 s)`);
    add('L13', m.changes_per_s >= 1.5 ? 'PASS' : m.changes_per_s >= 1.2 ? 'WARN' : 'FAIL', `${m.changes_per_s} picture changes per second (≥ 1.5)`);
  }
}

finish();

function finish() {
  const W = (S && S.waivers) || {};
  for (const r of R) if (r.level === 'FAIL' && W[r.id]) { r.level = 'WARN'; r.msg += `  (waived: ${W[r.id]})`; }
  const order = { FAIL: 0, WARN: 1, PASS: 2 };
  R.sort((a, b) => order[a.level] - order[b.level] || a.id.localeCompare(b.id));
  const col = { FAIL: '\x1b[31mFAIL\x1b[0m', WARN: '\x1b[33mWARN\x1b[0m', PASS: '\x1b[32mPASS\x1b[0m' };
  if (has('json')) console.log(JSON.stringify(R, null, 1));
  else for (const r of R) console.log(`${col[r.level]} ${r.id}  ${r.msg}`);
  const fails = R.filter((r) => r.level === 'FAIL').length;
  console.log(fails ? `\npreflight: ${fails} FAIL — fix before the final render (playbook/LESSONS.md)` : `\npreflight: clean (${R.filter((r) => r.level === 'WARN').length} warnings)`);
  if (!fails && has('register') && S) {
    const entry = { slug: path.basename(PROJ), brand: S.brand, device: S.device, hook_type: S.hook_type, genre: (S.music || {}).genre,
      music: `${(S.music || {}).artist} — ${(S.music || {}).title}`, ground: (S.look || {}).ground, smp: S.smp };
    REG.reels = REG.reels.filter((r) => r.slug !== entry.slug).concat([entry]);
    fs.writeFileSync(path.join(PLAY, 'registry.json'), JSON.stringify(REG, null, 2) + '\n');
    console.log(`registered ${entry.slug} in playbook/registry.json`);
  }
  process.exit(fails ? 1 : 0);
}

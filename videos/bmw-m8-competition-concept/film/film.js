// BMW M8 Competition — "3.2". A concept film cut from BMW Group PressClub footage to Mixkit's "Greed" (100 bpm).
// The first 3.2 seconds ARE the 0–100 km/h run: a live counter rides the build and hits 100 km/h · 3.2 s on the drop.
// Then the numbers (625 hp, 750 Nm, 305 km/h, M xDrive, the M8 GTE), a breakdown ("A grand tourer. For the long way
// home."), the pickup ("Until you press M.") and the BMW M lockup on the second drop. Formats: 16:9 and 9:16.
(() => {
  const { W, H, bt, sp, spHit, seg, clamp, lerp, put, el, scene } = C;
  C.fonts = ['700 100px Display', '300 100px Display', '400 40px UI', '700 40px UI', '300 40px UI'];
  const TALL = C.FMT === '9x16';
  const P = (wide, tall) => (TALL ? tall : wide);
  const X = P(120, 90);
  const WHITE = '#F4F5F7', GREY = '#9AA0A8', RED = '#E02010', M = ['#0060B0', '#003070', '#E02010'];
  const T0 = C.beatAt(0);                                // the beat that sits at t = 0 (the grid's beat 0 is at 0.194 s)
  const line = (parent, text, x, y, size, o = {}) => TYPE.line(parent, text, { x, y, size, cls: o.cls || 'display', color: o.color || WHITE });
  const label = (parent, text, x, y, o = {}) => TYPE.line(parent, text, { x, y, size: o.size || P(28, 30), cls: 'ui caps', color: o.color || WHITE });

  // ------------------------------------------------------------------ the cut list (beats on the measured grid)
  const cut = (from, to, s, o = {}) => ({ from, to, s, t0: from, ...o });
  const REEL = [
    cut(T0, 1, 'grille', { t0: T0, push: 0.05 }),
    cut(1, 2, 'wheel', { punch: 0.06 }), cut(2, 3, 'gear', { punch: 0.06 }), cut(3, 3.5, 'gauge', { punch: 0.06 }),
    cut(3.5, 4, 'light', { punch: 0.06 }),
    cut(4, 4.25, 'fwheel'), cut(4.25, 4.5, 'frear'), cut(4.5, 4.75, 'fbadge'), cut(4.75, 5, 'ffront'),
    // drop: 100 km/h at 3.2 s
    cut(5, 7, 'corner', { punch: 0.1, shake: 1 }), cut(7, 9, 'frontpass', { punch: 0.06 }),
    cut(9, 11.5, 'aerial1', { push: 0.06 }), cut(11.5, 13, 'aerial2', { f0: 10, punch: 0.05 }),
    cut(13, 15, 'gravelin', { f0: 7, punch: 0.06 }), cut(15, 17, 'gravelout', { punch: 0.06 }),
    cut(17, 19, 'rearchase', { punch: 0.06 }), cut(19, 21, 'exhaust', { push: 0.06 }),
    cut(21, 23, 'trackin', { punch: 0.06 }), cut(23, 24, 'kerbs', { f0: 3, punch: 0.06 }), cut(24, 25, 'aerialcurve', { f0: 4, rate: 1.3 }),
    cut(25, 26, 'helmet', { punch: 0.06 }), cut(26, 27.5, 'gte1', { punch: 0.05 }), cut(27.5, 29, 'gte2', { punch: 0.05 }),
    cut(29, 31, 'overpass', { f0: 8, punch: 0.05 }), cut(31, 33, 'camo', { f0: 8, punch: 0.05 }),
    // climax: eight half-beat flashes into the breakdown
    ...[['kerbs', 0], ['fwheel', 0], ['gravelout', 6], ['gte1', 8], ['fbadge', 0], ['ffront', 0], ['trackin', 15], ['corner', 20]]
      .map(([s, f0], i) => cut(33 + i * 0.5, 33.5 + i * 0.5, s, { f0, punch: 0.08 })),
    // breakdown: the grand tourer
    cut(37, 40, 'sunrise', { push: 0.04 }), cut(40, 42, 'stitch', { push: 0.04 }), cut(42, 43.5, 'headrest', { f0: 2, push: 0.04 }),
    cut(43.5, 46, 'houseside', { push: 0.04 }), cut(46, 49, 'clouds', { push: 0.03 }),
    // pickup
    cut(49, 51, 'wheel2', { push: 0.06 }), cut(51, 53, 'gear', { punch: 0.08, shake: 0.5 }),   // runs under the stripe wipe: no black frame
    // end: the lockup over the coast road from above
    cut(53, 57, 'aerialend', { push: 0.05, dim: 0.62, shake: 0.8 }),
  ];
  const shakeX = C.noise1(11), shakeY = C.noise1(23);
  function look(e, t) {
    let s = 1 + (e.push || 0) * seg(t, e.from, e.to);
    if (e.punch) s *= 1 + e.punch * (1 - sp(t, e.from, 'snappy'));
    let ox = 0, oy = 0;
    if (e.shake) { const k = e.shake * Math.max(0, 1 - (t - bt(e.from)) / 0.45); ox = shakeX(t * 40) * 14 * k; oy = shakeY(t * 40) * 10 * k; }
    return { s, ox, oy };
  }

  scene({
    name: 'reel', from: T0, to: 'done',
    build(root, S) { S.ctx = C.canvas(root); S.c = root.lastChild; S.c.style.filter = 'contrast(1.06) saturate(1.06)';
      S.dim = C.reg(el('div', { class: 'fill', style: 'background:#000' }, root), { o: 0 }); },
    run(t, b, S) {
      const ctx = S.ctx; ctx.fillStyle = '#07080A'; ctx.fillRect(0, 0, W, H);
      // cuts snap to the nearest frame AT or before their beat (half a frame early), so a hit never lands a frame late
      const bb = C.beatAt(t + 0.5 / C.FPS);
      const e = REEL.find((r) => bb >= C.beatOf(r.from) && bb < C.beatOf(r.to));
      if (e) { const L = look(e, t); FOOT.draw(ctx, e, t, { s: L.s }); put(S.c, { x: L.ox, y: L.oy, s: L.ox || L.oy ? 1.02 : 1 }); }
      put(S.dim, { o: e && e.dim ? e.dim * sp(t, e.from, 'heavy') : 0 });
    },
  });

  // ------------------------------------------------------------------ hook: the live 0–100 km/h counter
  function numLine(parent, x, y, size, suffix, cls = 'display') {
    const e = el('div', { class: `line ${cls}`, style: `left:${x}px;top:${y}px;font-size:${size}px;color:${WHITE};font-variant-numeric:tabular-nums` }, parent);
    const n = C.reg(el('span', { class: 'word' }, e, '0'), { y: 0 });
    const words = [n];
    if (suffix) words.push(C.reg(el('span', { class: 'word ui', style: `font-size:${Math.round(size * 0.16)}px;letter-spacing:0.2em;margin-left:0.6em;font-weight:700` }, e, suffix), { y: 0 }));
    C.reg(e); return { el: e, words, size, n };
  }
  scene({
    name: 'counter', from: T0, to: 9,
    build(root, S) {
      S.scrim = C.reg(el('div', { class: 'fill', style: 'background:radial-gradient(ellipse 75% 60% at 0% 100%, rgba(0,0,0,0.66), rgba(0,0,0,0) 72%)' }, root));
      S.lab = label(root, '0–100 km/h', X + 6, P(560, 1062));
      S.spd = numLine(root, X, P(600, 1100), P(300, 320), 'KM/H');
      S.tim = numLine(root, X, P(912, 1424), P(96, 100), '', 'display thin');
      S.bar = C.reg(el('div', { style: `position:absolute;left:${X + 6}px;top:${P(604, 1104)}px;height:6px;width:${P(470, 500)}px;background:${RED};transform-origin:0 50%` }, root), { sx: 0 });
    },
    run(t, b, S) {
      // 0 → 1 across the launch, exactly 1 on the drop frame; floor so '100 km/h · 3.2 s' first reads ON the drop
      const tt = Math.round(t * C.FPS) / C.FPS, run = clamp(tt / (bt(5) - 0.5 / C.FPS));
      const v = Math.floor(100 * (1 - Math.pow(1 - run, 1.35)) + 1e-9);
      put(S.spd.n, { text: String(v).padStart(3, '0') });
      put(S.tim.n, { text: `${(Math.floor(run * 32 + 1e-9) / 10).toFixed(1)} s` });
      TYPE.rise(t, S.lab, T0 - 0.6, 8.7, { preset: 'snappy' });
      TYPE.rise(t, S.spd, T0 - 0.6, 8.7, { preset: 'snappy', stagger: 0.1 });
      TYPE.rise(t, S.tim, T0 - 0.4, 8.7, { preset: 'snappy' });
      // the drop: a red line slams under the label and the block punches
      put(S.bar, { sx: spHit(t, 5, 'snappy') - sp(t, 8.6, 'snappy') });
      const k = 1 + 0.08 * (t >= bt(5) - 0.5 / C.FPS ? 1 - sp(t, C.beatAt(bt(5) - 0.5 / C.FPS), 'snappy') : 0);
      put(S.spd.el, { s: k }); put(S.tim.el, { s: k });
    },
  });

  // ------------------------------------------------------------------ the numbers
  const STAT = [
    { at: 9, big: 625, unit: 'HP', sub: '4.4-litre V8 · M TwinPower Turbo' },
    { at: 13, big: 750, unit: 'NM', sub: 'Peak torque' },
    { at: 17, big: 305, unit: 'KM/H*', sub: '*With M Driver’s Package' },
    { at: 21, word: 'M xDrive', sub: '4WD · 4WD Sport · 2WD' },
    { at: 26, word: 'M8 GTE', sub: 'Born alongside its race twin' },   // after the white helmet
  ];
  scene({
    name: 'stats', from: 9, to: 29,
    build(root, S) {
      el('div', { class: 'fill', style: 'background:radial-gradient(ellipse 75% 60% at 0% 100%, rgba(0,0,0,0.66), rgba(0,0,0,0) 72%)' }, root);
      S.items = STAT.map((s) => {
        const big = s.word ? line(root, s.word, X, P(600, 1090), P(250, 230)) : numLine(root, X, P(600, 1090), P(300, 320), s.unit);
        const sub = label(root, s.sub, X + 6, P(918, 1426));
        const mark = C.reg(el('div', { style: `position:absolute;left:${X + 6}px;top:${P(892, 1398)}px;width:66px;height:14px` }, root), { sx: 0 });
        M.forEach((c, i) => el('div', { style: `position:absolute;left:${i * 22}px;top:0;width:24px;height:14px;background:${c};transform:skewX(-30deg)` }, mark));
        return { s, big, sub, mark };
      });
    },
    run(t, b, S) {
      S.items.forEach(({ s, big, sub, mark }) => {
        const out = s.at === 26 ? 28.7 : s.at + 3.7;
        TYPE.rise(t, big, s.at - 0.05, out, { preset: 'snappy', stagger: 0.12 });
        TYPE.rise(t, sub, s.at + 0.35, out, { preset: 'snappy' });
        put(mark, { sx: sp(t, s.at + 0.2, 'snappy') - sp(t, out, 'snappy') });
        if (!s.word) put(big.n, { text: String(Math.round(s.big * Math.min(1, sp(t, s.at, 'heavy') / 0.995))) });
      });
    },
  });

  // ------------------------------------------------------------------ breakdown + pickup lines
  scene({
    name: 'prose', from: 37, to: 53,
    build(root, S) {
      const sz = P(120, 112);
      S.p1 = line(root, 'A grand tourer.', X, P(760, 1240), sz, { cls: 'prose' });
      S.p2 = TALL ? [line(root, 'For the long', X, 1180, sz, { cls: 'prose' }), line(root, 'way home.', X, 1310, sz, { cls: 'prose' })]
                  : [line(root, 'For the long way home.', X, 760, sz, { cls: 'prose' })];
      S.p3 = line(root, 'Until you press', X, P(420, 960), sz, { cls: 'prose' });
      S.m = line(root, 'M.', X - 8, P(540, 1080), P(380, 400), { color: RED });
    },
    run(t, b, S) {
      TYPE.rise(t, S.p1, 37.5, 42.7, { stagger: 0.12 });
      S.p2.forEach((L, i) => TYPE.rise(t, L, 46.15 + i * 0.25, 48.7, { stagger: 0.1 }));   // on the clouds: the house shot breathes
      TYPE.rise(t, S.p3, 49.3, 52.35, { stagger: 0.14 });
      TYPE.rise(t, S.m, 51, 52.35, { preset: 'snappy' });
    },
  });

  // ------------------------------------------------------------------ end: the BMW M lockup
  scene({
    name: 'end', from: 53, to: 'done',
    build(root, S) {
      const y = P(470, 1000), r = P(150, 130);
      S.round = C.reg(el('img', { src: '../assets/brand/bmw-roundel-flat.svg', style: `position:absolute;left:${X}px;top:${y}px;width:${r}px;height:${r}px` }, root), { o: 0 });
      S.stripes = C.reg(el('img', { src: '../assets/brand/m-stripes.svg', style: `position:absolute;left:${X + r + 30}px;top:${y + 8}px;width:${Math.round((r - 16) * 470 / 260)}px;height:${r - 16}px` }, root), { o: 0 });
      S.name = label(root, 'The M8 Competition', X + 4, y + r + P(48, 48), { size: P(84, 58) });
      S.name.el.style.fontWeight = 700;
      S.tag = TALL ? [line(root, 'M. The most powerful', X, y + r + 140, 52, { cls: 'prose' }), line(root, 'letter in the world.', X, y + r + 204, 52, { cls: 'prose' })]
                   : [line(root, 'M. The most powerful letter in the world.', X, y + r + 162, 60, { cls: 'prose' })];
      S.cred = label(root, 'A concept film · Footage: BMW Group PressClub', X + 4, P(1000, 1500), { size: P(18, 20), color: GREY });
    },
    run(t, b, S) {
      const k = spHit(t, 53, 'snappy');
      put(S.round, { o: k > 0.01 ? 1 : 0, s: 0.6 + 0.4 * k, css: { transformOrigin: '50% 50%' } });
      const k2 = spHit(t, 53.25, 'snappy');
      put(S.stripes, { o: k2 > 0.01 ? 1 : 0, x: -60 * (1 - k2) });
      TYPE.rise(t, S.name, 53.6, null, { preset: 'default' });
      S.tag.forEach((L, i) => TYPE.rise(t, L, 54.2 + i * 0.2, null, { stagger: 0.06 }));
      TYPE.rise(t, S.cred, 55, null, { preset: 'default' });
    },
  });

  // ------------------------------------------------------------------ M stripes: the signature wipe on the three big cuts
  const WIPES = [5, 37, 53];
  scene({
    name: 'wipes', from: T0, to: 'done',
    build(root, S) {
      const bw = P(380, 300);
      S.bars = M.map((c) => C.reg(el('div', { class: 'stripe', style: `left:0;width:${bw}px;background:${c};transform-origin:50% 50%` }, root), { hide: true }));
      S.bw = bw;
    },
    run(t, b, S) {
      const at = WIPES.find((w) => b >= w - 1.2 && b < w + 1);
      S.bars.forEach((bar, i) => {
        if (at == null) return put(bar, { hide: true });
        const p = sp(t, at - 0.42 + i * 0.07, 'snappy');                  // crosses the centre on the cut
        const x = lerp(-S.bw * 2.2, W + S.bw * 1.4, p) + i * S.bw * 0.82;
        put(bar, { hide: p <= 0.001 || p >= 0.999, x, css: { transform: `translate(${x.toFixed(1)}px,0) skewX(-30deg)` } });
      });
    },
  });

  // ------------------------------------------------------------------ grain + vignette
  scene({
    name: 'fx', from: T0, to: 'done',
    build(root, S) {
      el('div', { class: 'fill', style: 'background:radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)' }, root);
      const rnd = C.mulberry32(80808);
      S.tiles = [0, 1, 2, 3, 4, 5].map(() => {
        const c = el('canvas', { width: Math.round(W / 2), height: Math.round(H / 2), style: `position:absolute;left:0;top:0;width:${W}px;height:${H}px;mix-blend-mode:overlay;opacity:0.09` }, root);
        const g = c.getContext('2d'), d = g.createImageData(c.width, c.height);
        for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (rnd() + rnd() + rnd() - 1.5) * 120; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
        g.putImageData(d, 0, 0);
        return C.reg(c, { hide: true });
      });
    },
    run(t, b, S) { const k = Math.floor(t * 12.5 + 1e-6) % 6; S.tiles.forEach((c, i) => put(c, { hide: i !== k })); },
  });

  C.start();
  const cuts = REEL.map((e) => C.beatOf(e.from)).filter((x) => x > T0 + 1e-6).map((x) => bt(x) - 0.5 / C.FPS);
  window.CUTS = [...new Set([...(window.CUTS || []), ...cuts].map((x) => +x.toFixed(6)))].sort((a, b) => a - b);
  const ready0 = window.READY;
  window.READY = Promise.all([ready0, FOOT.ready]).then(() => { window.seek(0); return true; });
})();

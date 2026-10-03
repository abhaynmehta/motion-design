// Kay Beauty by Katrina Kaif — "3 new drops". 9:16 Instagram reel, 32 s, 120 bpm, 64 beats.
// Cut from the brand's three launch reels (Hydra Base Water Crème · Hydra Cloud Cushion Foundation · Hydra Luscious Gloss
// Stain) and its own campaign photos. Type: Miegha (display) + Nesans (UI), the brand's two faces. One accent: Kay rose.
// Structure: hook (3 new drops) → menu (pick yours) → 01 / 02 / 03 → Katrina → ask (which one first?) → end → loop.
(() => {
  const { W, H, bt, sp, spHit, seg, clamp, lerp, put, el, scene, beatAt } = C;
  C.fonts = ['400 100px Display', 'italic 400 100px Display', '700 40px UI', '600 40px UI'];
  const X = 90;                                       // the one left type edge
  const INK = '#2E1E1B', CREAM = '#FFF8F3', ROSE = '#B36C5F';
  const SOFT = '0 2px 24px rgba(46,30,27,0.28)';      // legibility shadow on busy footage only (not a glow: dark, tight)
  const S = (k, f0, t0, rate = 1, x = {}) => ({ k, f0, t0, rate, ...x });
  const photo = (parent, src, cls = 'abs') => el('img', { src: `../assets/photo/cut/${src}`, class: cls }, parent);
  const line = (parent, text, x, y, size, o = {}) => TYPE.line(parent, text, { x, y, size, cls: o.cls || 'display', color: o.color });
  const label = (parent, text, x, y, o = {}) => TYPE.line(parent, text, { x, y, size: o.size || 30, cls: 'ui caps', color: o.color || ROSE });
  // a masked box whose child rises through it (logos, chips, numbers)
  function maskBox(parent, x, y, w, h, child) {
    const box = el('div', { style: `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:hidden` }, parent);
    box.appendChild(child); C.reg(child, { y: 0 });
    return { box, child, h };
  }
  // the official Kay Beauty mark (rebuilt at 8x from the site's PNG by scripts/prep_logo.py), as an <img> so READY awaits it
  const logoEl = (w) => el('img', { src: '../assets/brand/kay-logo-ink.png', style: `position:absolute;left:0;top:0;width:${w}px;height:${Math.round(w * 843 / 1132)}px;transform-origin:0 100%` });
  const rise1 = (t, m, inAt, outAt = null, preset = 'heavy') => {
    let y = m.h * 1.1 * (1 - spHit(t, inAt, preset));
    if (outAt != null) y -= m.h * 1.1 * sp(t, outAt, 'snappy');
    put(m.child, { y, hide: Math.abs(y) >= m.h * 1.099 });
  };
  const rect = (x, y, w, h, round = 0) => ({ x, y, w, h, round });
  const lerpRect = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k), round: lerp(a.round || 0, b.round || 0, k) });
  const FULL = rect(0, 0, W, H);
  const SPLIT = 760;                                  // split-layout curtain edge (ch3 sentence)

  // ------------------------------------------------------------------ footage shots on the main canvas
  // zoomOut: push into (ax, ay) before the next cut · zoomIn: open pulled-in on (ax, ay) — a zoom-through match cut
  const REEL = [
    { from: 'hook', to: 'h_doe', sh: S('B', 96, 'hook', 1, { f1: 122 }), s0: 1.06, s1: 1.0 },
    { from: 'h_doe', to: 'h_lift', sh: S('C', 112, 'h_doe', 1, { f1: 143 }), win: 650, s0: 1.04, s1: 1.0, ay: 800 },   // porcelain slides in under the hook type
    { from: 'h_lift', to: 'kat', sh: S('A', 76, 'h_lift', 1, { f1: 97 }), punch: 0.14 },
    { from: 'c1_lift', to: 'c1_mac', sh: S('A', 71, 'c1_lift', 1, { f1: 97 }), punch: 0.08 },
    { from: 'c1_mac', to: 'c1_jar', sh: S('A', 116, 'c1_mac', 1, { f1: 160 }), punch: 0.12 },
    { from: 'c1_jar', to: 'c1_hero', sh: S('A', 48, 'c1_jar', 0.72, { f1: 66 }), punch: 0.06 },
    { from: 'c1_hero', to: 'c1_swirl', sh: S('A', 212, 'c1_hero', 1, { f1: 262 }), s0: 1.0, s1: 1.07 },
    { from: 'c1_swirl', to: 'c2', sh: S('A', 12, 'c1_swirl', 0.53, { f1: 32 }), zoomOut: { at: 19.4, s: 2.3, ax: 540, ay: 900 } },
    { from: 'c2', to: 'c2_roll', sh: S('B', 30, 'c2', 0.88, { f1: 52 }), zoomIn: { s: 2.3, ax: 518, ay: 1243 } },
    { from: 'c2_roll', to: 'c2_pour', sh: S('B', 0, 'c2_roll', 1.16, { f1: 29 }), punch: 0.06 },
    { from: 'c2_pour', to: 'c2_drip', sh: S('B', 66, 'c2_pour', 1, { f1: 85 }), punch: 0.12 },
    { from: 'c2_drip', to: 27.8, sh: S('B', 86, 'c2_drip', 1, { f1: 122 }), punch: 0.06 },
    { from: 'c2_ring', to: 'c3', sh: S('B', 123, 'c2_ring', 0.96, { f1: 160 }), zoomOut: { at: 31.0, s: 2.4, ax: 560, ay: 1580 } },
    { from: 'c3', to: 'c3_doe', sh: S('C', 91, 'c3', 0.67, { f1: 111 }), zoomIn: { s: 2.4, ax: 450, ay: 1000 } },
    // split: porcelain curtain drops to y 760 over the doe-foot and holds; the sentence sets on it, footage cuts below
    { from: 'c3_doe', to: 'c3_wand', sh: S('C', 112, 'c3_doe', 1, { f1: 143 }), split: true, s0: 1.04, s1: 1.0, ay: 640 },
    { from: 'c3_wand', to: 'c3_pat', sh: S('C', 68, 'c3_wand', 1, { f1: 90 }), split: true, punch: 0.1, ay: 820 },
    { from: 'c3_pat', to: 'c3_shade', sh: S('C', 40, 'c3_pat', 1, { f1: 67 }), split: true, punch: 0.1, ay: 960 },
    { from: 'c3_hero', to: 'fin', sh: S('C', 144, 'c3_hero', 0.9, { f1: 197, hold: 'gap' }), s0: 1.08, s1: 1.0 },
  ];
  const look = (e, t) => {
    const k = seg(t, e.from, e.to);
    let s = lerp(e.s0 ?? 1.03, e.s1 ?? 1.0, k), ax = e.ax ?? 540, ay = e.ay ?? 960, px = e.px ?? ax, py = e.py ?? ay;
    if (e.punch) s *= 1 + e.punch * (1 - sp(t, e.from, 'snappy'));
    if (e.zoomOut) { const z = e.zoomOut, p = sp(t, z.at, 'default'); s *= 1 + (z.s - 1) * p; ax = z.ax; ay = z.ay; px = lerp(z.ax, 540, p); py = lerp(z.ay, 960, p); }
    if (e.zoomIn) { const z = e.zoomIn, p = sp(t, e.from, 'default'); s *= z.s + (1 - z.s) * p; ax = z.ax; ay = z.ay; px = lerp(540, z.ax, p); py = lerp(960, z.ay, p); }
    if (e.win) { const r = rect(e.win * spHit(t, e.from, 'snappy'), 0, 0, H); r.w = W - r.x; return { s, ax, ay, px: r.x + r.w / 2, py: ay, r }; }
    if (e.split) { const r = rect(0, SPLIT * spHit(t, 'c3_doe', 'default'), W, 0); r.h = H - r.y; return { s, ax, ay, px: 540, py: r.y + r.h / 2, r }; }
    return { s, ax, ay, px, py };
  };

  scene({
    name: 'reel', from: 'hook', to: 'fin',
    build(root, S_) { S_.ctx = C.canvas(root); S_.c = root.lastChild; },
    run(t, b, S_) {
      const ctx = S_.ctx; ctx.clearRect(0, 0, W, H);
      const e = REEL.find((r) => b >= C.beatOf(r.from) && b < C.beatOf(r.to));
      put(S_.c, { hide: !e });
      if (e && (e.split || e.win)) { ctx.fillStyle = '#FAF5F2'; ctx.fillRect(0, 0, W, H); }
      if (e) FOOT.draw(ctx, e.sh, t, look(e, t));
    },
  });

  // ------------------------------------------------------------------ b4–b6  Katrina with the Water Crème jar
  scene({
    name: 'kat', from: 'kat', to: 'pick',
    build(root, S_) {
      S_.img = C.reg(photo(root, 'katrina_jar.jpg', 'abs'), {});
      S_.img.style.cssText = 'position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:540px 700px';
      S_.logo = maskBox(root, X, 1170, 250, 190, logoEl(250));
      S_.by = line(root, 'by Katrina Kaif', X, 1372, 86, { cls: 'display it', color: INK });
    },
    run(t, b, S_) {
      put(S_.img, { s: 1.0 + 0.12 * (1 - sp(t, 'kat', 'heavy')) + 0.02 * seg(t, 'kat', 'pick') });
      rise1(t, S_.logo, 4.2, 5.72);
      TYPE.rise(t, S_.by, 'kat_name', 5.72, { stagger: 0.1 });
    },
  });

  // ------------------------------------------------------------------ b6–b10  menu: three strips, 01 opens to full frame
  const STRIP = (i, y = 560, h = 860) => rect(90 + i * 308, y, 284, h, 22);
  const MENU = [
    { sh: S('A', 172, 'pick', 0.6, { f1: 202 }), ax: 560, ay: 900 },
    { sh: S('B', 30, 'pick', 0.8, { f1: 52 }), ax: 520, ay: 1150 },
    { sh: S('C', 0, 'pick', 0.8, { f1: 28 }), ax: 430, ay: 880 },
  ];
  scene({
    name: 'menu', from: 'pick', to: 'c1_lift',
    build(root, S_) {
      el('div', { class: 'fill', style: 'background:var(--porcelain)' }, root);
      S_.ctx = C.canvas(root);
      S_.head = line(root, 'Pick yours.', X, 300, 150, { color: INK });
      S_.nums = [0, 1, 2].map((i) => label(root, `0${i + 1}`, 90 + i * 308, 1450, { color: INK, size: 34 }));
    },
    run(t, b, S_) {
      const ctx = S_.ctx; ctx.clearRect(0, 0, W, H);
      const open = spHit(t, 'c1', 'default');
      for (const i of [1, 2, 0]) {
        const m = MENU[i];
        const up = 1400 * (1 - spHit(t, 6 + i * 0.25, 'default'));
        const away = i ? 1500 * sp(t, 7.85 + i * 0.08, 'snappy') : 0;
        let r = STRIP(i); r = { ...r, y: r.y + up + away };
        let o = { s: 0.62, ax: m.ax, ay: m.ay, px: r.x + r.w / 2, py: r.y + r.h / 2 };
        if (i === 0 && open > 0) {
          r = lerpRect(r, FULL, open);
          o = { s: lerp(0.62, 1.0, open), ax: m.ax, ay: m.ay, px: lerp(r.x + r.w / 2, 540, open), py: lerp(r.y + r.h / 2, 960, open) };
        }
        o.r = r;
        if (r.y < H) FOOT.draw(ctx, m.sh, t, o);
      }
      TYPE.rise(t, S_.head, 'pick_txt', 7.72);
      S_.nums.forEach((n, i) => TYPE.rise(t, n, 7 + i * 0.12, 7.72));
    },
  });

  // ------------------------------------------------------------------ type over footage (b0–b50)
  // Claims sit straight on calm footage (cream on the dark drips, ink on the light crème); product names always sit on a
  // porcelain label card (the brand's own packaging language), so they read on any shot.
  function tag(root, lab, l1, l2, o = {}) {
    const card = C.reg(el('div', { class: 'card', style: `left:60px;top:${o.y || 1140}px;width:${o.w || 900}px;height:${o.h || 372}px;background:var(--porcelain);border-radius:26px` }, root), { hide: true });
    const y = o.y || 1140;
    return {
      card,
      a: label(root, lab, 104, y + 36, { size: 32 }),
      b: line(root, l1, 100, y + 84, o.s1 || 124, { color: INK }),
      c: line(root, l2, 100, y + 84 + (o.s1 || 124) * 1.04, o.s2 || 124, { cls: 'display it', color: INK }),
    };
  }
  function tagRun(t, g, inAt, outAt) {
    const k = spHit(t, inAt, 'default'), x = outAt != null ? sp(t, outAt, 'snappy') : 0;
    const top = clamp(100 * (1 - k) + 100 * x, 0, 100);
    put(g.card, { hide: top >= 99.9, clip: `inset(${top.toFixed(2)}% 0 0 0 round 26px)` });
    const inB = C.beatOf(inAt), outB = outAt != null ? C.beatOf(outAt) - 0.3 : null, o = { preset: 'default' };
    TYPE.rise(t, g.a, inB + 0.1, outB, o); TYPE.rise(t, g.b, inB + 0.2, outB, o); TYPE.rise(t, g.c, inB + 0.32, outB, o);
  }
  scene({
    name: 'words', from: 'hook', to: 'fin',
    build(root, S_) {
      const T = (k, v) => (S_[k] = v);
      // hook
      T('h1', line(root, '3 new', X, 286, 250, { color: CREAM }));
      T('h2', line(root, 'drops.', X, 540, 250, { cls: 'display it', color: CREAM }));
      // 01
      T('t1', tag(root, '01 · Prep', 'Hydra Base', 'Water Crème', { w: 700 }));
      const num = (x, y, size, suffix, color) => {
        const e = el('div', { class: 'line display', style: `left:${x}px;top:${y}px;font-size:${size}px;color:${color}` }, root);
        const n = C.reg(el('span', { class: 'word' }, e, '0'), { y: 0 });
        const s = C.reg(el('span', { class: 'word it', style: 'font-size:0.36em;margin-left:0.08em' }, e, suffix), { y: 0 });
        C.reg(e); return { el: e, words: suffix ? [n, s] : [n], size, n };
      };
      T('n100', num(X, 280, 340, '-hr', INK));
      T('n100l', label(root, 'Hydration*', X + 8, 692, { size: 42, color: INK }));
      T('cer0', label(root, 'Powered by', X + 4, 296, { size: 38, color: INK }));
      T('cer1', line(root, 'Ceramides', X, 352, 150, { color: INK }));
      T('cer2', line(root, '+ Cica', X, 512, 150, { cls: 'display it', color: INK }));
      T('n138', num(X, 280, 310, '', INK));
      T('n138l', label(root, 'Skin hydration*', X + 8, 666, { size: 42, color: INK }));
      T('disc', line(root, '*Based on an external clinical study, May 2026.', X + 8, 764, 24, { cls: 'ui', color: INK }));
      // 02
      T('t2', tag(root, '02 · Base', 'Hydra Cloud', 'Cushion Foundation', { s2: 96, w: 860 }));
      T('six1', line(root, '6 new', X, 286, 250, { color: INK }));
      T('six2', line(root, 'shades.', X, 540, 250, { cls: 'display it', color: INK }));
      T('cov1', line(root, 'Full coverage.', X, 320, 128, { color: CREAM }));
      T('cov2', line(root, 'One dab.', X, 466, 128, { cls: 'display it', color: CREAM }));
      T('m1', line(root, '18 ways', 250, 740, 116, { color: INK }));
      T('m2', line(root, 'to find', 250, 866, 116, { color: INK }));
      T('m3', line(root, 'your match.', 250, 992, 116, { cls: 'display it', color: INK }));
      // 03
      T('t3', tag(root, '03 · Colour — new', 'Hydra Luscious', 'Gloss Stain', { w: 880 }));
      T('g1', line(root, 'Glossy lips,', X, 300, 120, { color: INK }));
      T('g2', line(root, 'lasting colour,', X, 430, 120, { color: INK }));
      T('g3', line(root, 'all in one.', X, 560, 120, { cls: 'display it', color: INK }));
      T('t4', tag(root, '8 shades', 'Hydra Luscious', 'Gloss Stain', { w: 880 }));
    },
    run(t, b, S_) {
      const R = TYPE.rise;
      const tint = (L, c, shadow = false) => put(L.el, { css: { color: c, textShadow: shadow ? SOFT : 'none' } });
      // hook: '3 new' is already in on frame 0, 'drops.' lands on beat 1; both re-tint at the flash cuts
      R(t, S_.h1, -0.55, 3.72, { stagger: 0.12 });
      R(t, S_.h2, 'h_drops', 3.72);
      const hc = b < 2 ? CREAM : INK;
      tint(S_.h1, hc); tint(S_.h2, hc);
      // 01 label card rides the strip opening
      tagRun(t, S_.t1, 8.1, 11.75);          // holds across two shots like a lower-third
      // 100-hr hydration (count) · disclaimer
      R(t, S_.n100, 'c1_lift', 11.72, { stagger: 0.12 });
      put(S_.n100.n, { text: String(Math.round(100 * Math.min(1, sp(t, 'c1_lift', 'heavy') / 0.995))) });
      R(t, S_.n100l, 10.5, 11.72);
      R(t, S_.disc, 10.25, 11.72);
      // Ceramides + CICA
      R(t, S_.cer0, 13.1, 14.72); R(t, S_.cer1, 13.2, 14.72); R(t, S_.cer2, 13.5, 14.72);
      // +138% (count) — leaves before the push-in
      R(t, S_.n138, 'c1_swirl', 19.05);
      put(S_.n138.n, { text: `+${Math.round(138 * Math.min(1, sp(t, 'c1_swirl', 'heavy') / 0.995))}%` });
      R(t, S_.n138l, 17.35, 19.05);
      if (b >= 16.9) R(t, S_.disc, 17.25, 19.05);
      // 02
      tagRun(t, S_.t2, 20.15, 23.75);
      R(t, S_.six1, 'c2_roll', 23.72, { stagger: 0.12 }); R(t, S_.six2, 22.5, 23.72);
      R(t, S_.cov1, 'c2_drip', 26.75); R(t, S_.cov2, 25.6, 26.75);
      R(t, S_.m1, 29.1, 30.8); R(t, S_.m2, 29.25, 30.8); R(t, S_.m3, 29.4, 30.8);
      // 03
      tagRun(t, S_.t3, 32.15, 35.75);
      R(t, S_.g1, 34.3, 37.72); R(t, S_.g2, 'c3_wand', 37.72); R(t, S_.g3, 'c3_pat', 37.72);
      tagRun(t, S_.t4, 48.05, 49.8);
    },
  });

  // ------------------------------------------------------------------ b27–b29  the cushion packshot + Kare ingredients
  scene({
    name: 'pack', from: 'c2_pack', to: 'c2_ring', cut: false,
    build(root, S_) {
      S_.panel = C.reg(el('div', { class: 'fill', style: 'background:var(--porcelain)' }, root));
      S_.head = line(root, 'Hydra Cloud', X, 286, 120, { color: INK });
      S_.card = C.reg(el('div', { class: 'card', style: 'left:90px;top:470px;width:900px;height:900px;background:#fff' }, root));
      el('img', { src: '../assets/photo/cut/cushion_pack.jpg', class: 'cover' }, S_.card);
      const row = el('div', { style: 'position:absolute;left:90px;top:1404px;width:900px;display:flex;flex-wrap:wrap;gap:14px' }, root);
      S_.chips = [['SPF 40 PA++', true], ['Hyaluronic acid', false], ['Squalane', false]].map(([txt, fill]) => {
        const c = el('div', { class: 'chip', style: `position:relative;height:78px;font-size:32px;${fill ? `background:${ROSE};color:${CREAM}` : `border:2px solid ${INK};color:${INK}`}` }, row, txt);
        return C.reg(c, { o: 0 });
      });
    },
    run(t, b, S_) {
      const up = spHit(t, 'c2_pack', 'default');
      put(S_.panel, { clip: `inset(${(100 * (1 - up)).toFixed(2)}% 0 0 0)` });
      put(S_.card, { y: 1100 * (1 - spHit(t, 27.15, 'default')), s: 1 + 0.02 * seg(t, 27.15, 'c2_ring') });
      TYPE.rise(t, S_.head, 27.25, null);
      S_.chips.forEach((c, i) => {
        const k = spHit(t, 27.5 + i * 0.5, 'snappy');
        put(c, { o: k > 0.01 ? 1 : 0, s: 0.7 + 0.3 * k, y: 18 * (1 - k) });
      });
    },
  });

  // ------------------------------------------------------------------ b38–b42  8 shades, one per half-beat
  scene({
    name: 'shade', from: 'c3_shade', to: 'c3_arm',
    build(root, S_) {
      el('div', { class: 'fill', style: 'background:var(--porcelain)' }, root);
      S_.head = line(root, '8 shades.', X, 290, 170, { color: INK });
      S_.card = C.reg(el('div', { class: 'card', style: 'left:90px;top:540px;width:900px;height:900px;background:#fff' }, root));
      S_.ims = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => C.reg(el('img', { src: `../assets/photo/cut/shade${i}.jpg`, class: 'cover' }, S_.card), { hide: true }));
      S_.count = el('div', { class: 'ui caps', style: `position:absolute;left:${X}px;top:1466px;font-size:34px;color:${ROSE}` }, root, '01 / 08');
      C.reg(S_.count);
    },
    run(t, b, S_) {
      const i = clamp(Math.floor((b - 38) * 2 + 1e-6), 0, 7);
      S_.ims.forEach((im, k) => put(im, { hide: k !== i }));
      const enter = spHit(t, 'c3_shade', 'default');
      put(S_.card, { y: 900 * (1 - enter), s: 1 + (i ? 0.035 * (1 - sp(t, 38 + i * 0.5, 'snappy')) : 0) });
      put(S_.count, { text: `0${i + 1} / 08`, y: 60 * (1 - enter) });
      TYPE.rise(t, S_.head, 38.15, null);
    },
  });

  // ------------------------------------------------------------------ b42–b44  every shade, swatched (the brand's own swatch labels)
  scene({
    name: 'arm', from: 'c3_arm', to: 'c3_lips',
    build(root, S_) {
      el('div', { class: 'fill', style: 'background:var(--porcelain)' }, root);
      S_.card = C.reg(el('div', { class: 'card', style: 'left:540px;top:0;width:450px;height:1694px' }, root));
      el('img', { src: '../assets/photo/cut/swatch_arm.jpg', class: 'cover' }, S_.card);
      S_.l1 = line(root, 'Every', X, 640, 112, { color: INK });
      S_.l2 = line(root, 'shade,', X, 760, 112, { color: INK });
      S_.l3 = line(root, 'swatched.', X, 880, 112, { cls: 'display it', color: INK });
    },
    run(t, b, S_) {
      const k = spHit(t, 'c3_arm', 'default');
      put(S_.card, { x: 600 * (1 - k), y: lerp(250, -40, seg(t, 'c3_arm', 'c3_lips')) });
      TYPE.rise(t, S_.l1, 42.25, null); TYPE.rise(t, S_.l2, 42.45, null); TYPE.rise(t, S_.l3, 42.7, null);
    },
  });

  // ------------------------------------------------------------------ b44–b46  gloss now, stain later (the brand's before/after macro)
  scene({
    name: 'lips', from: 'c3_lips', to: 'c3_kat',
    build(root, S_) {
      el('div', { class: 'fill', style: 'background:var(--porcelain)' }, root);
      S_.band = C.reg(el('div', { style: 'position:absolute;left:0;top:640px;width:1080px;height:640px;overflow:hidden' }, root));
      S_.im = C.reg(el('img', { src: '../assets/photo/cut/lips_split.jpg', style: 'position:absolute;left:-143px;top:0;width:1366px;height:640px;transform-origin:683px 320px' }, S_.band));
      S_.l1 = line(root, 'Gloss now.', X, 400, 136, { color: INK });
      S_.l2 = line(root, 'Stain later.', X, 1318, 136, { cls: 'display it', color: INK });
    },
    run(t, b, S_) {
      const k = spHit(t, 'c3_lips', 'default');
      put(S_.band, { clip: `inset(0 ${(50 * (1 - k)).toFixed(2)}% 0 ${(50 * (1 - k)).toFixed(2)}%)` });
      put(S_.im, { s: 1.06 - 0.06 * seg(t, 'c3_lips', 'c3_kat') });
      TYPE.rise(t, S_.l1, 44.3, null); TYPE.rise(t, S_.l2, 45, null);
    },
  });

  // ------------------------------------------------------------------ b46–b48  Katrina wears Honey (Rudrapriya, Katrina Kaif, Janhavi)
  scene({
    name: 'trio', from: 'c3_kat', to: 'c3_hero',
    build(root, S_) {
      el('div', { class: 'fill', style: 'background:var(--blush)' }, root);
      S_.card = C.reg(el('div', { class: 'card', style: 'left:90px;top:400px;width:900px;height:738px' }, root));
      S_.im = C.reg(el('img', { src: '../assets/photo/cut/trio.jpg', class: 'cover', style: 'transform-origin:50% 35%' }, S_.card));
      S_.l0 = label(root, 'Katrina Kaif wears', X + 4, 1186, { size: 36 });
      S_.l1 = line(root, 'Honey.', X, 1236, 200, { cls: 'display it', color: INK });
    },
    run(t, b, S_) {
      put(S_.card, { y: 1200 * (1 - spHit(t, 'c3_kat', 'default')) });
      put(S_.im, { s: 1.0 + 0.05 * seg(t, 'c3_kat', 'c3_hero') });
      TYPE.rise(t, S_.l0, 46.4, 47.72); TYPE.rise(t, S_.l1, 46.6, 47.72);
    },
  });

  // ------------------------------------------------------------------ b50–b54  Katrina, then the Kay Beauty lockup rises under her
  scene({
    name: 'fin', from: 'fin', to: 'ask',
    build(root, S_) {
      S_.img = C.reg(photo(root, 'katrina_face.jpg'), {});
      S_.img.style.cssText = 'position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:540px 850px';
      S_.panel = C.reg(el('div', { style: 'position:absolute;left:0;top:1190px;width:1080px;height:730px;background:var(--porcelain)' }, root));
      S_.logo = maskBox(root, X, 1240, 330, 250, logoEl(330));
      S_.by = label(root, 'by Katrina Kaif', 470, 1394, { color: ROSE, size: 40 });
    },
    run(t, b, S_) {
      const hit = sp(t, 'fin', 'heavy'), lift = spHit(t, 'fin_name', 'default');
      put(S_.img, { s: 1.0 + 0.1 * (1 - hit) + 0.03 * seg(t, 'fin', 'ask'), y: -330 * lift });
      put(S_.panel, { y: 760 * (1 - lift) });
      rise1(t, S_.logo, 51.6, null);
      TYPE.rise(t, S_.by, 52, null);
    },
  });

  // ------------------------------------------------------------------ b54–b58  ask: which one first? (comments drive reach)
  const ASK = [
    { sh: S('A', 212, 'ask', 1, { f1: 262 }), ax: 540, ay: 880 },
    { sh: S('B', 123, 'ask', 0.74, { f1: 160 }), ax: 540, ay: 1000 },
    { sh: S('C', 144, 'ask', 0.88, { f1: 197 }), ax: 520, ay: 900 },
  ];
  scene({
    name: 'ask', from: 'ask', to: 'end',
    build(root, S_) {
      el('div', { class: 'fill', style: 'background:var(--porcelain)' }, root);
      S_.ctx = C.canvas(root);
      S_.h1 = line(root, 'Which one', X, 286, 150, { color: INK });
      S_.h2 = line(root, 'first?', X, 436, 150, { cls: 'display it', color: INK });
      S_.nums = [0, 1, 2].map((i) => label(root, `0${i + 1}`, 90 + i * 308, 1362, { color: INK, size: 34 }));
      const chip = el('div', { class: 'chip', style: `left:0;top:0;height:78px;font-size:32px;background:${ROSE};color:${CREAM}` }, null, 'Comment 1, 2 or 3');
      S_.chip = maskBox(root, X, 1424, 700, 80, chip);
    },
    run(t, b, S_) {
      const ctx = S_.ctx; ctx.clearRect(0, 0, W, H);
      ASK.forEach((m, i) => {
        const up = 1400 * (1 - spHit(t, 54 + i * 0.25, 'default'));
        const r = STRIP(i, 640, 700); r.y += up;
        if (r.y < H) FOOT.draw(ctx, m.sh, t, { r, s: 0.62, ax: m.ax, ay: m.ay, px: r.x + r.w / 2, py: r.y + r.h / 2 });
      });
      TYPE.rise(t, S_.h1, 'ask_txt', null); TYPE.rise(t, S_.h2, 54.8, null);
      S_.nums.forEach((n, i) => TYPE.rise(t, n, 55.1 + i * 0.12, null));
      rise1(t, S_.chip, 'ask_sub', null, 'snappy');
    },
  });

  // ------------------------------------------------------------------ b58–b64  end card, then the drip opens and loops to frame 0
  scene({
    name: 'end', from: 'end', to: 'done',
    build(root, S_) {
      el('div', { class: 'fill', style: 'background:var(--porcelain)' }, root);
      S_.logo = maskBox(root, X, 520, 600, 460, logoEl(600));
      S_.tag = line(root, 'Three new drops.', X, 1046, 96, { cls: 'display it', color: INK });
      S_.rule = C.reg(el('div', { class: 'rule', style: `left:${X}px;top:1196px;width:860px;color:${ROSE}` }, root), { sx: 0 });
      S_.url = C.reg(el('div', { class: 'ui caps', style: `position:absolute;left:${X}px;top:1222px;font-size:36px;color:${INK}` }, root, ''));
    },
    run(t, b, S_) {
      rise1(t, S_.logo, 58.1, null);
      put(S_.logo.child, { s: 1 + 0.025 * seg(t, 'end', 'loop') });
      TYPE.rise(t, S_.tag, 58.6, null);
      put(S_.rule, { sx: sp(t, 58.9, 'default') });
      TYPE.type(t, S_.url, 'Shop on kaybeauty.com & Nykaa', 'end_url', 60.4);   // types through the hold: the card never sits still
    },
  });

  // the loop: a drip strip rises and opens to full frame, landing exactly on frame 0 ('3 new' mid-rise, drip at f96, 1.06x)
  const LOOP = S('B', 96, 'done', 1, { fmin: 86, f1: 96 });   // holds f86 while it rises, then plays at 1x into frame 0's f96
  scene({
    name: 'loop', from: 'loop', to: 'done', cut: false,
    build(root, S_) {
      S_.ctx = C.canvas(root);
      S_.h1 = line(root, '3 new', X, 300, 210, { color: CREAM });
    },
    run(t, b, S_) {
      const ctx = S_.ctx; ctx.clearRect(0, 0, W, H);
      const up = spHit(t, 'loop', 'default'), open = spHit(t, 63.1, 'default');
      let r = STRIP(1); r = { ...r, y: r.y + 1400 * (1 - up) };
      r = lerpRect(r, FULL, open);
      const s = lerp(0.62, 1.06, open);
      FOOT.draw(ctx, LOOP, t, { r, s, ax: 540, ay: 960, px: lerp(r.x + r.w / 2, 540, open), py: lerp(r.y + r.h / 2, 960, open) });
      TYPE.rise(t, S_.h1, 64 - 0.55, null, { stagger: 0.12 });
    },
  });

  // ------------------------------------------------------------------ film grain: six seeded tiles, stepped every 2 frames
  scene({
    name: 'fx', from: 'hook', to: 'done',
    build(root, S_) {
      const rnd = C.mulberry32(20261003);
      S_.tiles = [0, 1, 2, 3, 4, 5].map(() => {
        const c = el('canvas', { width: 540, height: 960, style: 'position:absolute;left:0;top:0;width:1080px;height:1920px;mix-blend-mode:overlay;opacity:0.10' }, root);
        const g = c.getContext('2d'), d = g.createImageData(540, 960);
        for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (rnd() + rnd() + rnd() - 1.5) * 120; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
        g.putImageData(d, 0, 0);
        return C.reg(c, { hide: true });
      });
    },
    run(t, b, S_) {
      const k = Math.floor(t * 15 + 1e-6) % 6;
      S_.tiles.forEach((c, i) => put(c, { hide: i !== k }));
    },
  });

  C.start();
  // footage hard cuts are inside the reel scene: register them so motion-blur samples never straddle one
  const cuts = REEL.filter((e) => C.beatOf(e.from) > 0 && !e.zoomIn).map((e) => bt(e.from)).concat(REEL.filter((e) => e.zoomIn).map((e) => bt(e.from)));
  window.CUTS = [...new Set([...(window.CUTS || []), ...cuts].map((x) => +x.toFixed(6)))].sort((a, b) => a - b);
  const ready0 = window.READY;
  window.READY = Promise.all([ready0, FOOT.ready]).then(() => { window.seek(0); return true; });
})();

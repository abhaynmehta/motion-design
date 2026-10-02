// County Group — "The art of the address". 24 s · 80 BPM · 32 beats · 16x9 (office screen) + 9x16.
// Shotlist: docs/shotlist.md (APPROVED). Every value is a pure function of t: springs released on measured beats,
// linear seg() only for slow pushes, drifts and the push-through. No timers, no Math.random, nothing mutated in run()
// except per-frame writes that are recomputed from t on every frame.
(() => {
  const { W, H, FPS, pick, put, reg, el, scene, sp, spHit, seg, clamp, lerp, ease, beatOf, mulberry32 } = C;
  const { line, rise } = TYPE;
  const TL = C.TL, CP = TL.copy;
  C.fonts = ['400 100px Display', 'italic 400 100px Display', '500 30px UI', '400 30px UI'];
  const V = C.FMT === '9x16';
  const PAD = pick(140, 90, 90);
  const P = Object.fromEntries(TL.projects.map((p, i) => [p.id, { ...p, index: i }]));
  const HB = TL.heroes.map((_, i) => beatOf('hero' + i));
  const CURTAIN = { response: 0.75, damping: 0.92 };   // a slow close that still finishes (no crawling tail): a curtain, not a wipe
  // renders are graded into the brown/gold world so daylight skies don't fight the palette
  const GRADE = 'saturate(.74) sepia(.22) hue-rotate(-4deg) contrast(1.07) brightness(.96)';
  const AR = 1.92;                                   // aspect of the supplied renders
  const px = (v) => v + 'px';
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const tracked = (L, em) => { L.el.style.letterSpacing = em + 'em'; return L; };

  // ---------------------------------------------------------------- geometry
  const F = V ? { x: 90, y: 300, w: 860 } : { x: 140, y: 0, w: 1060 };          // gallery frame
  F.h = V ? 680 : Math.round(F.w / AR); if (!V) F.y = Math.round((H - F.h) / 2);   // 9:16 crops the renders taller to fill the frame
  const G = V ? { cols: 3, tw: 280, gap: 20, x0: 100, y0: 700, titleY: 556, titleSize: 76 }
              : { cols: 4, tw: 340, gap: 26, x0: 241, y0: 330, titleY: 168, titleSize: 88 };
  G.th = Math.round(G.tw / AR);
  const TILES = [...Array(12)].map((_, k) => ({ x: G.x0 + (k % G.cols) * (G.tw + G.gap), y: G.y0 + Math.floor(k / G.cols) * (G.th + G.gap), w: G.tw, h: G.th }));
  const T12 = TILES[11];
  const DIVE = Math.max(W / T12.w, H / T12.h) * 1.02;                           // tile 12 covers the frame at the drop
  const ICON_H = T12.h * 0.62;                                                   // arch drawn inside tile 12
  const AF = V ? { cx: 540, cy: 720, h: 820 } : { cx: 1390, cy: 548, h: 720 };  // the Gurugram arch window
  AF.w = AF.h * 0.74;

  // Round-top arch centred at (cx, cy). archHalves draws from the crown down both sides to the base centre.
  function archD(cx, cy, w, h) {
    const x0 = cx - w / 2, x1 = cx + w / 2, yb = cy + h / 2, r = w / 2, ys = cy - h / 2 + r;
    return `M${x0.toFixed(2)},${yb.toFixed(2)} L${x0.toFixed(2)},${ys.toFixed(2)} A${r.toFixed(2)},${r.toFixed(2)} 0 0 1 ${x1.toFixed(2)},${ys.toFixed(2)} L${x1.toFixed(2)},${yb.toFixed(2)} Z`;
  }
  function archHalves(cx, cy, w, h) {
    const x0 = cx - w / 2, x1 = cx + w / 2, yb = cy + h / 2, r = w / 2, ys = cy - h / 2 + r, yt = cy - h / 2;
    return [`M${cx},${yt} A${r},${r} 0 0 0 ${x0},${ys} L${x0},${yb} L${cx},${yb}`, `M${cx},${yt} A${r},${r} 0 0 1 ${x1},${ys} L${x1},${yb} L${cx},${yb}`];
  }
  function drawable(parent, d, stroke, width, extra = {}) {
    const p = sv('path', { d, fill: 'none', stroke, 'stroke-width': width, pathLength: 1, 'stroke-dasharray': '1 1', 'vector-effect': 'non-scaling-stroke', ...extra }, parent);
    return reg(p, { css: { strokeDashoffset: '1' } });
  }
  const drawTo = (p, k, css = {}) => put(p, { css: { strokeDashoffset: (1 - clamp(k)).toFixed(4), ...css } });

  // ---------------------------------------------------------------- 0 · background (the gallery's brown world)
  scene({ name: 'bg', from: 0, to: 'done', build(root) { root.classList.add('bgDark'); } });

  // ---------------------------------------------------------------- 1 · hook on cream  (b0 → b4)
  scene({
    name: 'open', from: 'open', to: 'hero0', post: 0.7,
    build(root, S) {
      root.classList.add('bgCream');
      S.push = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;transform-origin:${PAD}px ${H / 2}px` }, root); reg(S.push);
      const y0 = pick(300, 300, 760), hs = pick(176, 176, 150);
      S.eyebrow = tracked(line(S.push, CP.eyebrow, { x: PAD, y: y0, size: pick(28, 28, 30), cls: 'caps', color: 'var(--accent-ink)' }), 0.42);
      S.hair = el('div', { class: 'abs', style: `left:${PAD}px;top:${y0 + 62}px;height:1px;width:${pick(600, 600, 640)}px;background:var(--accent);transform-origin:0 50%` }, S.push);
      reg(S.hair, { sx: 0 });
      S.l1 = line(S.push, CP.headline[0], { x: PAD - 8, y: y0 + 112, size: hs, cls: 'display it', color: 'var(--ink)' });
      S.l2 = line(S.push, CP.headline[1], { x: PAD - 8, y: y0 + 112 + hs * 1.04, size: hs, cls: 'display it', color: 'var(--ink)' });
      S.l2.words[1].style.color = 'var(--accent-ink)';                            // the key word, in the one accent
    },
    run(t, b, S) {
      put(S.push, { s: 1 + 0.035 * seg(t, 'open', 'hero0') });
      rise(t, S.eyebrow, [-1.2, -1.12, -1.04, -0.96, -0.88], null, { preset: 'heavy' });   // reads on frame 0; exits by being covered
      put(S.hair, { sx: spHit(t, 'open', 'default') });
      rise(t, S.l1, ['h_w1', 'h_w2', 'h_w3'], null, { preset: 'heavy' });
      rise(t, S.l2, ['h_w4', 'h_w5'], null, { preset: 'heavy' });
    },
  });

  // ---------------------------------------------------------------- 2–3 · curtain + gallery  (b3.5 → b17)
  function heroText(root, p) {
    const X = V ? PAD : F.x + F.w + 80;
    const big = Math.round(pick(150, 150, 172) * Math.min(1, 6.2 / p.big.length));
    const places = p.place.split(', ');
    const PS = pick(34, 34, 36);
    const hgt = 24 + 40 + (p.smallFirst ? 48 : 0) + big * 0.95 + 18 + (p.smallFirst ? 0 : 32) + 36 + 30 + places.length * (PS + 12);
    let y = V ? F.y + F.h + 72 : Math.round(F.y + F.h / 2 - hgt / 2);
    const T = { lines: [] };
    const add = (L, d) => { T.lines.push([L, d]); return L; };
    add(tracked(line(root, 'Nº ' + String(p.index + 1).padStart(2, '0'), { x: X, y, size: 24, cls: 'caps', color: 'var(--accent)' }), 0.4), 0);
    y += 62;
    if (p.smallFirst) { add(tracked(line(root, p.small, { x: X, y, size: 30, cls: 'caps', color: 'var(--accent)' }), 0.5), 0.12); y += 48; }
    add(line(root, p.big, { x: X - 6, y, size: big, cls: 'display it', color: 'var(--on-dark)' }), 0.06);
    y += big * 0.95 + 18;
    if (!p.smallFirst) { add(tracked(line(root, p.small, { x: X, y, size: 30, cls: 'caps', color: 'var(--accent)' }), 0.5), 0.3); y += 32; }
    y += 36;
    T.rule = el('div', { class: 'abs', style: `left:${X}px;top:${y}px;width:96px;height:1px;background:var(--accent);transform-origin:0 50%` }, root);
    reg(T.rule, { sx: 0 });
    y += 30;
    places.forEach((s, i) => { add(tracked(line(root, s, { x: X, y, size: PS, cls: 'caps', color: 'rgba(241,236,225,.9)' }), 0.18), 0.5 + 0.12 * i); y += PS + 12; });
    return T;
  }

  scene({
    name: 'gallery', from: 'hero0', to: beatOf('grid') + 1, pre: 1.0,
    build(root, S) {
      S.panel = el('div', { class: 'abs bgDark', style: `width:${W}px;height:${H}px` }, root);
      S.cedge = el('div', { class: 'abs', style: `width:${W}px;height:1px;background:var(--accent)` }, root); reg(S.cedge, { o: 0 });
      S.frame = el('div', { class: 'frame', style: `left:0;top:0;width:${F.w}px;height:${F.h}px` }, root); reg(S.frame);
      S.shots = TL.heroes.map((id) => {
        const s = el('div', { class: 'shot' }, S.frame), img = el('img', { src: `../assets/site/renders/${id}.jpg` }, s);
        return { s: reg(s, { hide: true }), img: reg(img, { filter: GRADE }) };
      });
      S.edge = el('div', { class: 'abs', style: `width:2px;height:${F.h + 40}px;background:linear-gradient(180deg, transparent, var(--accent) 18%, #EBD7AC 50%, var(--accent) 82%, transparent)` }, root);
      reg(S.edge, { o: 0 });
      S.txt = TL.heroes.map((id) => heroText(root, P[id]));
    },
    run(t, b, S) {
      // curtain: the brown panel closes down over the cream hook, a gold rule on its leading edge
      const c = sp(t, 'curtain', CURTAIN);
      put(S.root, { clip: c >= 0.9995 ? 'none' : `inset(0 0 ${((1 - c) * 100).toFixed(3)}% 0)` });
      put(S.cedge, { o: c > 0.002 && c < 0.995 ? 1 : 0, y: c * H - 1 });
      // the frame collapses into its grid tile (Clove = tile 11) on the grid downbeat
      const k = spHit(t, 'grid', 'default', 0.04), dst = TILES[10];
      const fr = { x: lerp(F.x, dst.x, k), y: lerp(F.y, dst.y, k), w: lerp(F.w, dst.w, k), h: lerp(F.h, dst.h, k) };
      const e0 = spHit(t, HB[0], 'heavy', 0.28);              // rises under the curtain's last sliver: no empty frame
      put(S.frame, { x: fr.x, y: fr.y, css: { width: px(fr.w), height: px(fr.h) }, hide: e0 <= 0.0005,
        clip: e0 >= 0.9995 ? 'none' : `inset(${((1 - e0) * 100).toFixed(3)}% -140px -140px -140px)` });
      let edge = null;
      S.shots.forEach((sh, i) => {
        const n = S.shots.length;
        const e = i === 0 ? e0 : spHit(t, HB[i], 'default', 0.04);
        const clip = i === 0 ? `inset(${((1 - e) * 100).toFixed(3)}% 0 0 0)` : `inset(0 ${((1 - e) * 100).toFixed(3)}% 0 0)`;
        const covered = i < n - 1 ? spHit(t, HB[i + 1], 'default', 0.04) : 0;
        put(sh.s, { clip, hide: e <= 0.0005 || covered >= 0.9995 });
        if (i > 0 && e > 0.003 && e < 0.995) edge = fr.x + e * fr.w;
        // every held image keeps drifting; the last one settles to rest as it lands in the grid
        const d = seg(t, HB[i] - 0.5, i < n - 1 ? HB[i + 1] + 0.6 : beatOf('grid'));
        let sc = lerp(1.075, 1.015, d), dx = (i % 2 ? -1 : 1) * lerp(-1.2, 1.2, d);
        if (i === n - 1) { sc = lerp(sc, 1, k); dx = lerp(dx, 0, k); }
        put(sh.img, { x: dx * F.w / 100, s: sc, filter: `${GRADE} brightness(${(1 - 0.38 * covered).toFixed(3)})` });
      });
      put(S.edge, { o: edge == null ? 0 : 1, x: (edge || 0) - 1, y: F.y - 20 });
      // type: one block per render; the outgoing block is gone before the next one lands
      S.txt.forEach((T, i) => {
        const n = S.txt.length;
        const inB = HB[i] + (i === 0 ? 0.35 : 0.14);
        const outB = i < n - 1 ? HB[i + 1] - 0.2 : beatOf('grid') - 0.3;
        for (const [L, d] of T.lines) rise(t, L, inB + d, outB, { preset: 'heavy', exit: 0.3, stagger: 0.06 });
        put(T.rule, { sx: sp(t, inB + 0.4, 'default') * (1 - sp(t, outB, 'snappy')) });
      });
    },
  });

  // ---------------------------------------------------------------- 4–5 · grid, then the dive into tile 12  (b16 → b20)
  scene({
    name: 'grid', from: 'grid', to: 'drop',
    build(root, S) {
      root.style.transformOrigin = '0 0';
      S.title = line(root, CP.gridTitle, { x: G.x0 - 6, y: G.titleY, size: G.titleSize, cls: 'display it', color: 'var(--on-dark)' });
      S.title.words[3].style.color = 'var(--accent)';
      S.tiles = TL.projects.map((p, k) => {
        const r = TILES[k];
        const d = el('div', { class: 'tile', style: `left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;transform-origin:50% 60%` }, root);
        const img = el('img', { src: `../assets/site/renders/${p.id}.jpg` }, d);
        return { d: reg(d, { o: 0 }), img: reg(img, { filter: GRADE }) };
      });
      // tile 12 — Gurugram: the same warm ground as the next scene, and a gold arch that draws as it lands
      S.t12 = el('div', { class: 'tile', style: `left:${T12.x}px;top:${T12.y}px;width:${T12.w}px;height:${T12.h}px;transform-origin:50% 60%;background:${WARM}` }, root);
      reg(S.t12, { o: 0 });
      const s = sv('svg', { width: T12.w, height: T12.h, viewBox: `0 0 ${T12.w} ${T12.h}`, style: 'position:absolute;left:0;top:0;overflow:visible' }, S.t12);
      S.icon = archHalves(T12.w / 2, T12.h / 2, ICON_H * 0.74, ICON_H).map((d) => {
        const p = sv('path', { d, fill: 'none', stroke: '#C29E63', pathLength: 1, 'stroke-dasharray': '1 1' }, s);
        return reg(p, { css: { strokeDashoffset: '1' } });
      });
    },
    run(t, b, S) {
      // push-through: from the gap the camera accelerates into tile 12, which fills the frame exactly on the drop
      const e = Math.pow(seg(t, 'gap', 'drop'), 2.4);
      const sc = Math.pow(DIVE, e), tcx = T12.x + T12.w / 2, tcy = T12.y + T12.h / 2;
      put(S.root, { x: lerp(tcx, W / 2, e) - tcx * sc, y: lerp(tcy, H / 2, e) - tcy * sc, s: sc });
      rise(t, S.title, 'grid_title', null, { preset: 'heavy', stagger: 0.1 });
      S.tiles.forEach((T, k) => {
        if (k === 10) put(T.d, { o: b >= beatOf('grid') + 1 ? 1 : 0 });           // Clove arrives as the collapsing hero frame
        else {
          const p = spHit(t, beatOf('grid') + (k + 1) * 0.25, 'snappy');          // one tile per sixteenth: a harp note each
          put(T.d, { o: clamp(p / 0.35), s: lerp(0.86, 1, p), y: 30 * (1 - p) });
        }
        put(T.img, { s: lerp(1.06, 1, seg(t, 'grid', 'drop')) });
      });
      const p12 = spHit(t, 'tile12', 'snappy', 0.03);
      put(S.t12, { o: clamp(p12 / 0.35), s: lerp(0.86, 1, p12), y: 30 * (1 - p12) });
      const dr = spHit(t, beatOf('tile12') + 0.1, 'default');
      S.icon.forEach((p) => drawTo(p, dr, { strokeWidth: (1.6 / sc).toFixed(4) + 'px' }));   // a hairline at every zoom
    },
  });

  // ---------------------------------------------------------------- 6 · Gurugram: the arched jaali window  (b20 → b26)
  const WARM = 'radial-gradient(80% 85% at 50% 50%, #4a3322 0%, #2b1d13 55%, #140d08 100%)';
  const LIFE = V ? { y1: 1236, y2: 1408, s1: 132 } : { y1: 392, y2: 596, s1: 160 };
  scene({
    name: 'guru', from: 'drop', to: 'iris', post: 0.9,
    build(root, S) {
      root.style.background = WARM;
      S.svg = sv('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: 'position:absolute;left:0;top:0;overflow:visible' }, root);
      const defs = sv('defs', {}, S.svg);
      sv('path', { d: archD(AF.cx, AF.cy, AF.w - 26, AF.h - 26) }, sv('clipPath', { id: 'archClip' }, defs));
      const lg = sv('linearGradient', { id: 'dawn', x1: 0, y1: 1, x2: 0, y2: 0 }, defs);
      [[0, 0.55], [0.45, 0.2], [1, 0]].forEach(([o, a]) => sv('stop', { offset: o, 'stop-color': '#E2C892', 'stop-opacity': a }, lg));
      S.g = sv('g', {}, S.svg);
      const win = sv('g', { 'clip-path': 'url(#archClip)' }, S.g);
      S.dawn = sv('rect', { x: AF.cx - AF.w / 2, y: AF.cy - AF.h / 2, width: AF.w, height: AF.h, fill: 'url(#dawn)' }, win);
      reg(S.dawn, { y: AF.h });
      // lattice: interlocking circles (a jaali), drawn outward from the window's centre
      S.lat = sv('g', { fill: 'none', stroke: '#C29E63', 'stroke-width': 1 }, win); reg(S.lat);
      const d = V ? 68 : 60, r = d / Math.SQRT2, maxD = Math.hypot(AF.w, AF.h) / 2;
      S.circles = [];
      for (let y = AF.cy - Math.ceil(AF.h / 2 / d) * d; y <= AF.cy + AF.h / 2 + d; y += d)
        for (let x = AF.cx - Math.ceil(AF.w / 2 / d) * d; x <= AF.cx + AF.w / 2 + d; x += d) {
          const c = sv('circle', { cx: x, cy: y, r, pathLength: 1, 'stroke-dasharray': '1 1', 'vector-effect': 'non-scaling-stroke' }, S.lat);
          S.circles.push({ c: reg(c, { css: { strokeDashoffset: '1' } }), delay: Math.hypot(x - AF.cx, y - AF.cy) / maxD });
        }
      S.outer = archHalves(AF.cx, AF.cy, AF.w, AF.h).map((dd) => sv('path', { d: dd, fill: 'none', stroke: '#C29E63', 'stroke-width': 1.6, 'vector-effect': 'non-scaling-stroke' }, S.g));
      S.inner = archHalves(AF.cx, AF.cy, AF.w - 26, AF.h - 26).map((dd) => drawable(S.g, dd, '#C29E63', 0.9));
      S.l1 = line(root, CP.lifeLine, { x: PAD - 8, y: LIFE.y1, size: LIFE.s1, cls: 'display it', color: 'var(--on-dark)' });
      S.l2 = tracked(line(root, CP.lifeSub, { x: PAD, y: LIFE.y2, size: 40, cls: 'caps', color: 'var(--on-dark)', accent: [2] }), 0.36);
      S.rule = el('div', { class: 'abs', style: `left:${PAD}px;top:${LIFE.y2 + 80}px;width:220px;height:1px;background:var(--accent);transform-origin:0 50%` }, root);
      reg(S.rule, { sx: 0 });
      if (CP.rera) S.rera = line(root, CP.rera, { x: PAD, y: H - pick(90, 90, 420), size: 18, cls: 'caps', color: 'rgba(241,236,225,.62)' });
    },
    run(t, b, S) {
      put(S.root, { s: 1 + 0.045 * seg(t, 'drop', 'iris') });                   // slow push: never static
      // match cut: the arch arrives exactly as tile 12's arch filled the frame, then settles to the right (heavy)
      const s0 = (ICON_H * DIVE) / AF.h, m = sp(t, beatOf('drop') + 0.25, 'heavy');
      const s = lerp(s0, 1, m), cx = lerp(W / 2, AF.cx, m), cy = lerp(H / 2, AF.cy, m);
      S.g.setAttribute('transform', `translate(${(cx - AF.cx * s).toFixed(2)} ${(cy - AF.cy * s).toFixed(2)}) scale(${s.toFixed(5)})`);
      for (const c of S.circles) drawTo(c.c, sp(t, beatOf('drop') + 0.15 + c.delay * 1.6, 'default'));
      S.inner.forEach((p) => drawTo(p, sp(t, beatOf('drop') + 0.3, 'default')));
      const g = spHit(t, 'glow', 'default');                                     // new on b24: dawn light rises in the window
      put(S.dawn, { y: AF.h * (1 - g) });
      put(S.lat, { o: 0.5 + 0.35 * g });
      const out = beatOf('iris') - 0.35;
      rise(t, S.l1, 'life', out, { preset: 'heavy', stagger: 0.12, exit: 0.3 });
      rise(t, S.l2, 'life_sub', out, { preset: 'heavy', stagger: 0.1, exit: 0.3 });
      put(S.rule, { sx: sp(t, beatOf('life_sub') + 0.6, 'default') * (1 - sp(t, out, 'snappy')) });
      if (S.rera) rise(t, S.rera, beatOf('life_sub') + 0.5, out, { preset: 'heavy', stagger: 0.02 });
    },
  });

  // ---------------------------------------------------------------- 7 · end card on cream: the window opens  (b26 → b32)
  const EC = V ? { mark: 680, word: 780, wsize: 168, group: 990, gsize: 40, url: 1110, usize: 44, wa: { cx: 940, cy: 1520, h: 1060 } }
               : { mark: 250, word: 348, wsize: 190, group: 580, gsize: 46, url: 722, usize: 46, wa: { cx: 1530, cy: 610, h: 1040 } };
  scene({
    name: 'end', from: 'iris', to: 'done', cut: false,
    build(root, S) {
      root.classList.add('bgCream');
      S.push = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;transform-origin:${PAD}px ${H / 2}px` }, root); reg(S.push);
      const s = sv('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: 'position:absolute;left:0;top:0;overflow:visible' }, S.push);
      const wa = EC.wa;
      S.water = archHalves(wa.cx, wa.cy, wa.h * 0.74, wa.h).map((d) => drawable(s, d, 'rgba(194,158,99,.45)', 1.2));
      S.water2 = archHalves(wa.cx, wa.cy, wa.h * 0.74 - 34, wa.h - 34).map((d) => drawable(s, d, 'rgba(194,158,99,.28)', 0.9));
      S.mark = archHalves(PAD + 23, EC.mark + 31, 46, 62).map((d) => drawable(s, d, '#A6834A', 1.6));
      const logo = TL.brand && TL.brand.logo;
      if (logo) {   // a real logo file (timeline.json brand.logo) replaces the typographic lockup
        S.logo = el('img', { src: `../${logo}`, class: 'abs', style: `left:${PAD}px;top:${EC.word}px;height:${pick(300, 300, 280)}px` }, S.push);
        reg(S.logo, { o: 0 });
      } else {
        S.word = tracked(line(S.push, CP.wordTop.toUpperCase(), { x: PAD - 6, y: EC.word, size: EC.wsize, cls: 'display', color: 'var(--ink)' }), 0.12);
        S.group = tracked(line(S.push, CP.wordBottom.toUpperCase(), { x: PAD, y: EC.group, size: EC.gsize, cls: 'caps', color: 'var(--accent-ink)' }), 0.8);
      }
      S.url = tracked(line(S.push, CP.url, { x: PAD, y: EC.url, size: EC.usize, cls: 'caps', color: 'var(--ink)' }), 0.16);
      S.url.el.style.textTransform = 'none';
      if (S.word) {   // gilded sheen: the wordmark's fill is a brown→gold→brown band that passes once on b29.5
        Object.assign(S.word.words[0].style, { backgroundImage: 'linear-gradient(100deg, #3A291C 0%, #3A291C 42%, #C9A86A 50%, #3A291C 58%, #3A291C 100%)',
          backgroundSize: '320% 100%', backgroundPosition: '100% 0', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' });
      }
      // a slow procession of every address along the base of the card (real renders, graded)
      const RB = V ? { y: 1296, h: 120, gap: 16 } : { y: 872, h: 112, gap: 18 };
      RB.w = Math.round(RB.h * AR);
      S.rb = RB;
      S.ribbon = el('div', { class: 'abs', style: `left:0;top:${RB.y}px;width:${W}px;height:${RB.h}px` }, S.push); reg(S.ribbon);
      S.thumbs = [...TL.projects, ...TL.projects].map((p, i) => {
        const d = el('div', { class: 'tile', style: `left:${PAD + i * (RB.w + RB.gap)}px;top:0;width:${RB.w}px;height:${RB.h}px;transform-origin:50% 70%;box-shadow:0 18px 30px -18px rgba(58,41,28,.5)` }, S.ribbon);
        reg(el('img', { src: `../assets/site/renders/${p.id}.jpg` }, d), { filter: GRADE });
        return reg(d, { o: 0 });
      });
      S.sweep = el('div', { class: 'abs', style: `top:${EC.url + EC.usize + 26}px;height:2px;background:var(--accent-ink)` }, S.push); reg(S.sweep, { o: 0 });
      if (CP.rera) S.rera = line(S.push, CP.rera, { x: PAD, y: H - pick(80, 80, 420), size: 18, cls: 'caps', color: 'rgba(58,41,28,.6)' });
    },
    run(t, b, S) {
      // iris: cream fills the Gurugram window, then the window opens past the frame edges
      const k = spHit(t, 'iris', 'heavy');
      const gp = 1 + 0.045 * seg(t, 'drop', 'iris');                            // where the window is under the last push
      const cx = W / 2 + (AF.cx - W / 2) * gp, cy = H / 2 + (AF.cy - H / 2) * gp, sc = lerp(1, 7.5, k) * gp;
      put(S.root, { clip: k >= 0.999 ? 'none' : `path('${archD(cx, cy, (AF.w - 26) * sc, (AF.h - 26) * sc)}')` });
      put(S.push, { s: 1 + 0.06 * ease.inOut(seg(t, 'iris', 'done')) });
      S.water.forEach((p) => drawTo(p, ease.inOut(seg(t, 'lockup', 31))));                 // draws through the whole hold
      S.water2.forEach((p) => drawTo(p, ease.inOut(seg(t, beatOf('lockup') + 1, 31.5))));
      S.mark.forEach((p) => drawTo(p, sp(t, 'lockup', 'default')));
      if (S.logo) {
        const l = spHit(t, 'word', 'heavy');
        put(S.logo, { o: clamp(l / 0.3), y: 40 * (1 - l) });
      } else {
        rise(t, S.word, 'word', null, { preset: 'heavy' });
        rise(t, S.group, 'group', null, { preset: 'heavy' });
      }
      rise(t, S.url, 'url', null, { preset: 'heavy' });
      if (S.word) put(S.word.words[0], { css: { backgroundPosition: `${(100 - 100 * ease.inOut(seg(t, 'sweep', beatOf('sweep') + 1.5))).toFixed(2)}% 0` } });
      // ribbon: thumbnails rise one per tenth of a beat, then the whole procession scrolls left, steadily
      put(S.ribbon, { x: -pick(78, 78, 60) * Math.max(0, t - C.bt('ribbon')) });
      S.thumbs.forEach((d, i) => {
        const p = sp(t, beatOf('ribbon') + Math.min(i, 9) * 0.1, 'snappy');
        put(d, { o: clamp(p / 0.35), y: 34 * (1 - p), s: lerp(0.9, 1, p) });
      });
      if (S.rera) rise(t, S.rera, beatOf('url') + 0.5, null, { preset: 'heavy', stagger: 0.02 });
      // the hold is re-lit on b30: a gold rule sweeps under the URL (enter left, exit right)
      const uw = pick(560, 560, 540), x0 = PAD;
      const sw = Motion.indicator(t, [[0, x0, x0], [C.bt('sweep'), x0, x0 + uw], [C.bt(beatOf('sweep') + 1), x0 + uw, x0 + uw]]);
      put(S.sweep, { o: sw.size > 0.5 ? 1 : 0, x: sw.start, css: { width: px(sw.size) } });
    },
  });

  // ---------------------------------------------------------------- finish: vignette + seeded film grain (top layer)
  scene({
    name: 'fx', from: 0, to: 'done',
    build(root, S) {
      root.style.pointerEvents = 'none';
      S.vd = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;background:radial-gradient(115% 95% at 50% 46%, transparent 55%, rgba(8,5,3,.6) 100%)` }, root); reg(S.vd, { o: 0 });
      S.vc = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;background:radial-gradient(130% 105% at 35% 45%, transparent 58%, rgba(110,80,45,.17) 100%)` }, root); reg(S.vc);
      S.ctx = C.canvas(root); S.ctx.canvas.style.mixBlendMode = 'overlay'; reg(S.ctx.canvas);
      const r = mulberry32(2005);
      S.tiles = [...Array(8)].map(() => {
        const c = document.createElement('canvas'); c.width = c.height = 256;
        const x = c.getContext('2d'), id = x.createImageData(256, 256);
        for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (r() + r() + r() - 1.5) * 110; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
        x.putImageData(id, 0, 0);
        return S.ctx.createPattern(c, 'repeat');
      });
    },
    run(t, b, S) {
      const dark = sp(t, 'curtain', CURTAIN) * (1 - spHit(t, 'iris', 'heavy'));
      put(S.vd, { o: dark }); put(S.vc, { o: 1 - dark });
      const f = Math.floor(t * FPS + 1e-6), r = mulberry32(f * 7919 + 13), g = S.ctx;
      g.clearRect(0, 0, W, H);
      g.save(); g.translate(Math.floor(r() * 256), Math.floor(r() * 256));
      g.fillStyle = S.tiles[f % S.tiles.length]; g.fillRect(-256, -256, W + 512, H + 512);
      g.restore();
      put(S.ctx.canvas, { o: lerp(0.10, 0.15, dark) });
    },
  });

  C.start();
})();

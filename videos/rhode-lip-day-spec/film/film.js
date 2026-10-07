// rhode · Peptide Lip Shape — "never skip lip day." A spec reel cut from the brand's own shade films and campaign stills
// (rhodeskin.com) to Mixkit's "Swish Swed" (120 bpm). 9:16, 27 s, 54 beats.
// The joke is already in the product: every shade is named after a workout move (lunge, stretch, squeeze, flex …).
// So the reel is a workout class: never skip leg day → lip day → 3-2-1 → six moves, each word ACTING OUT its name
// (kinetic letters), a speed round of the other eight → the whole class (14 shades on 14 faces) → peptide lip shape,
// $24 → same time tomorrow?
(() => {
  const { W, H, bt, sp, spHit, seg, clamp, lerp, put, el, scene, trk } = C;
  C.fonts = ['400 100px Display', '600 100px UI', '700 100px UI', 'italic 600 100px UI'];
  const X = 70;
  const PANEL = '#F1F0ED', INK = '#67645E', GREY = '#84827E', ACCENT = '#BB7055', WHITE = '#FFFFFF';
  const SOFT = '0 2px 18px rgba(0,0,0,0.35)';
  const POP = (k) => 0.3 + 0.7 * k;
  const R = (x, y, w, h) => ({ x, y, w, h });
  const line = (parent, text, x, y, size, o = {}) => TYPE.line(parent, text, { x, y, size, cls: o.cls || 'display', color: o.color });
  const shadow = (L) => put(L.el, { css: { textShadow: SOFT } });

  // ------------------------------------------------------------------ the shades (rhodeskin.com product pages)
  const SHADE = {
    lunge: ['#ab7265', 'rosy beige'], stretch: ['#81594a', 'neutral mocha brown'], squeeze: ['#bb7055', 'cool taupe'],
    flex: ['#5c4237', 'rich neutral brown'], twist: ['#a57462', 'warm taupe'], lift: ['#c18d93', 'soft neutral pink'],
    balance: ['#906650', 'caramel brown'], bend: ['#b6806a', 'soft peachy beige'], jump: ['#874936', 'chocolate brown'],
    lean: ['#96665d', 'warm medium brown'], move: ['#463832', 'deep cool brown'], press: ['#be7984', 'warm pinky mauve'],
    push: ['#b68574', 'soft neutral beige'], spin: ['#4c3941', 'rich plum brown'],
  };
  const MOVES = [
    { s: 'lunge', A: 8, cue: 'and lunge. hold it.' },
    { s: 'stretch', A: 12, cue: 'stretch it out.' },
    { s: 'squeeze', A: 16, cue: 'squeeze… and release.' },
    { s: 'flex', A: 20, cue: 'now flex.' },
    { s: 'twist', A: 24, cue: "twist. don't stop." },
    { s: 'lift', A: 28, cue: 'lift. feel the burn.' },
  ];
  const SPEED = ['balance', 'bend', 'jump', 'lean', 'move', 'press', 'push', 'spin'].map((s, j) => ({ s, B: 32 + j }));
  const ALL = [...MOVES.map((m) => m.s), ...SPEED.map((m) => m.s)];
  const PORT = {}, loads = [];
  const img = (src) => { const im = new Image(); loads.push(new Promise((ok) => { im.onload = im.onerror = () => ok(); })); im.src = src; return im; };
  for (const s of ALL) PORT[s] = img(`../assets/products/${s}_1.jpg`);
  const PENCIL = img('../assets/cut/lunge_pencil.png');

  // ------------------------------------------------------------------ layout
  const WIN = R(70, 610, 940, 1060), RAD = 28;
  const CW = (WIN.w - 3 * 10) / 4, CH = (WIN.h - 3 * 10) / 4, G = 10;   // the class grid sits where the window was

  // ------------------------------------------------------------------ background
  scene({
    name: 'bg', from: 'hook', to: 'done',
    build(root, S) { S.base = C.reg(el('div', { class: 'fill' }, root)); },
    // a new style on every seek: the whole frame re-rasterises (determinism)
    run(t, b, S) { put(S.base, { css: { backgroundImage: `linear-gradient(${PANEL}, ${PANEL})`, backgroundPosition: `${Math.round(t * 1e4)}px 0px` } }); },
  });

  // ------------------------------------------------------------------ the window: hook stare, six moves, speed round
  // shot k fills beats [b0, b1); before b0 it holds frame 0, after b1 its last frame
  function drawShot(ctx, k, b0, b1, t, dy) {
    const m = FOOT.SH[k], tt = Math.round(t * C.FPS) / C.FPS;
    const f = clamp((tt - bt(b0)) / (bt(b1) - bt(b0))) * (m.n - 1);
    ctx.save(); ctx.translate(0, dy); FOOT.paint(ctx, k, f, { r: WIN, blend: true }); ctx.restore();
  }
  scene({
    name: 'win', from: 'hook', to: 'class',
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      ctx.save(); ctx.beginPath(); ctx.roundRect(WIN.x, WIN.y, WIN.w, WIN.h, RAD); ctx.clip();
      if (b < 8) drawShot(ctx, 'hook', 0, 8, t, 0);
      else if (b < 32) {
        // next exercise: the new film pushes up from the bottom of the window, the last one drifts up behind it
        const i = Math.floor((b - 8) / 4), M = MOVES[i], k = sp(t, M.A, 'default');
        const prev = i ? MOVES[i - 1] : { s: 'hook', A: 0 }, prevEnd = i ? M.A : 8;
        if (k < 0.999) drawShot(ctx, prev.s, prev.A, prevEnd, t, -WIN.h * 0.3 * k);
        drawShot(ctx, M.s, M.A, M.A + 4, t, k < 0.999 ? WIN.h * (1 - k) : 0);
      } else { const j = Math.floor(b - 32); drawShot(ctx, SPEED[j].s, SPEED[j].B, SPEED[j].B + 1, t, 0); }
      ctx.restore();
    },
  });

  // ------------------------------------------------------------------ the hook: never skip leg day → lip day, 3-2-1
  scene({
    name: 'hook', from: 'hook', to: 8.6,
    build(root, S) {
      S.never = line(root, 'never skip', X, 200, 140, { color: INK });
      S.mask = el('div', { style: `position:absolute;left:0;top:${350 - 22}px;width:${W}px;height:${Math.round(180 * 1.32)}px;overflow:hidden` }, root);
      const word = (text, color) => C.reg(el('div', { class: 'display', style: `position:absolute;left:${X}px;top:22px;font-size:180px;color:${color}` }, S.mask, text));
      S.leg = word('leg', INK); S.lip = word('lip', ACCENT); S.day = word('\u00a0day.', INK);
      S.digBox = el('div', { style: `position:absolute;left:${WIN.x}px;top:${WIN.y}px;width:${WIN.w}px;height:${WIN.h}px;overflow:hidden;border-radius:${RAD}px` }, root);
      S.dig = ['3', '2', '1'].map((d) => C.reg(el('div', { class: 'display', style: `position:absolute;left:0;top:${(WIN.h - 700) / 2 - 40}px;width:${WIN.w}px;text-align:center;font-size:700px;color:${WHITE};text-shadow:${SOFT}` }, S.digBox, d)));
    },
    run(t, b, S) {
      TYPE.rise(t, S.never, -1, 7.7, { stagger: 0.1 });
      if (!S.w) S.w = { leg: S.leg.offsetWidth, lip: S.lip.offsetWidth };
      const k = spHit(t, 'swap', 'snappy'), out = 260 * sp(t, 7.75, 'snappy'), E = 180 * 1.32;
      put(S.leg, { y: -E * k - out, hide: k > 0.999 || out > 259 });
      put(S.lip, { y: E * (1 - k) - out, hide: k < 0.001 || out > 259 });
      put(S.day, { x: Math.round(lerp(S.w.leg, S.w.lip, k) * 100) / 100, y: -out, hide: out > 259 });
      // the countdown drops in like plates on a bar, each falls through as the next lands
      S.dig.forEach((d, i) => {
        const B = 5 + i, y = -WIN.h * (1 - spHit(t, B, 'heavy')) + WIN.h * sp(t, B + 0.9, 'snappy');
        put(d, { y, hide: t < bt(B) - 0.6 || y > WIN.h * 0.99 });
      });
    },
  });

  // ------------------------------------------------------------------ the kinetic words: every move acts out its name
  // v-curves are track()s: one spring per change, each released on its own beat (never restarted)
  const V = (t, keys, p = 'default') => trk(t, keys, p);
  const KIN = {
    lunge: (t, A, i) => { const v = V(t, [[A, 0], [A + 1 + i * 0.03, 1], [A + 2.5 + i * 0.03, 0]]); return { x: 70 * v, kx: -16 * v, sy: 1 - 0.05 * v }; },
    stretch: (t, A, i, m) => { const v = V(t, [[A, 0], [A + 1, 1], [A + 2.5, 0]]); return { x: (m.cx[i] - m.W / 2) * 0.07 * v, sx: 1 + 0.1 * v }; },
    squeeze: (t, A, i, m) => { const v = V(t, [[A, 0], [A + 1, 1, 'snappy'], [A + 2.5, 0, 'default']]); return { x: -(m.cx[i] - m.W / 2) * 0.38 * v, sx: 1 - 0.38 * v, sy: 1 + 0.1 * v }; },
    flex: (t, A, i, m) => {
      const v = V(t, [[A, 0], [A + 1, 1], [A + 1.75, 0.35], [A + 2.25, 1.25], [A + 3, 0]]);
      return i === 2 ? { sx: 1 + 0.32 * v, sy: 1 + 0.5 * v } : { x: (i < 2 ? -0.6 : 1) * m.size * 0.11 * v };
    },
    twist: (t, A, i) => { const v = V(t, [[A, 0], [A + 1, 1], [A + 2, -1], [A + 3, 0]]); const s = i % 2 ? 1 : -1; return { ky: 14 * v * s, r: 5 * v * s }; },
    lift: (t, A, i, m) => { const v = V(t, [[A, 0], [A + 1 + i * 0.1, 1], [A + 2.6 + i * 0.05, 0]]); return { y: -0.42 * m.size * v, sy: 1 + 0.06 * v }; },
    balance: (t, B, i, m) => { const r = V(t, [[B, 0], [B + 0.3, 7], [B + 0.6, -5]]); const d = m.cx[i] - m.W / 2; return { r, y: d * Math.sin(r * Math.PI / 180) }; },
    bend: (t, B, i, m) => { const v = V(t, [[B, 0], [B + 0.3, 1]]); const d = i - (m.n - 1) / 2; return { r: d * 7 * v, y: d * d * 6 * v }; },
    jump: (t, B, i, m) => { const v = V(t, [[B, 0], [B + 0.2 + i * 0.05, 1, 'snappy'], [B + 0.5 + i * 0.05, 0, 'snappy']]); return { y: -0.35 * m.size * v }; },
    lean: (t, B) => { const v = V(t, [[B, 0], [B + 0.3, 1]]); return { kx: -20 * v }; },
    move: (t, B) => ({ x: V(t, [[B, 0], [B + 0.3, 90]]) }),
    press: (t, B) => { const v = V(t, [[B, 0], [B + 0.3, 1, 'snappy']]); return { sy: 1 - 0.4 * v, sx: 1 + 0.1 * v }; },
    push: (t, B, i) => { const v = V(t, [[B, 0], [B + 0.25 + i * 0.06, 1, 'snappy']]); return { x: 50 * v * (1 + i * 0.15) }; },
    spin: (t, B, i) => ({ sx: V(t, [[B, 1], [B + 0.3 + i * 0.04, -1, 'snappy'], [B + 0.6 + i * 0.04, 1, 'snappy']]) }),
  };
  const KSIZE = 200, KTOP = 220 + 70, MASK = R(0, 220, W, 330);
  // drawn on a canvas, letter by letter: DOM text under changing skew/scale can rasterise differently depending on the
  // frame painted before it (render --verify caught it), a canvas draw cannot
  const DEG = Math.PI / 180;
  function metrics(ctx, text) {
    ctx.font = `400 ${KSIZE}px Display`;
    let x = 0; const w = [], cx = [];
    for (const ch of text) { const m = ctx.measureText(ch).width; w.push(m); cx.push(x + m / 2); x += m; }
    const fm = ctx.measureText('Hg'), base = (KSIZE + fm.fontBoundingBoxAscent - fm.fontBoundingBoxDescent) / 2;
    return { W: x, n: w.length, size: KSIZE, w, cx, base };
  }
  scene({
    name: 'kin', from: 'drop', to: 'class',
    build(root, S) {
      S.ctx = C.canvas(root);
      S.words = [...MOVES.map((M) => ({ ...M, len: 4 })), ...SPEED.map((M) => ({ s: M.s, A: M.B, len: 1 }))];
    },
    run(t, b, S) {
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      ctx.save(); ctx.beginPath(); ctx.rect(MASK.x, MASK.y, MASK.w, MASK.h); ctx.clip();
      ctx.fillStyle = INK; ctx.font = `400 ${KSIZE}px Display`; ctx.textBaseline = 'alphabetic';
      for (const w of S.words) {
        if (!(b >= w.A - 0.6 && b < w.A + w.len + 0.2)) continue;
        const m = w.m || (w.m = metrics(ctx, w.s));
        const fast = w.len === 1, inB = fast ? w.A - 0.05 : w.A, outB = fast ? w.A + 0.82 : w.A + 3.7;
        [...w.s].forEach((ch, i) => {
          const rise = KSIZE * 1.5 * (1 - spHit(t, inB + i * (fast ? 0.02 : 0.04), fast ? 'snappy' : 'heavy'));
          const lift = -KSIZE * 1.5 * sp(t, outB + i * 0.02, 'snappy');
          if (rise > KSIZE * 1.49 || lift < -KSIZE * 1.49) return;
          const o = KIN[w.s](t, w.A, i, m);
          // CSS-style transform about the letter's (50 %, 85 %) point: translate · rotate · skew · scale
          ctx.save();
          ctx.translate(X + m.cx[i] + (o.x || 0), KTOP + 0.85 * KSIZE + (o.y || 0) + rise + lift);
          if (o.r) ctx.rotate(o.r * DEG);
          if (o.kx || o.ky) ctx.transform(1, Math.tan((o.ky || 0) * DEG), Math.tan((o.kx || 0) * DEG), 1, 0, 0);
          ctx.scale(o.sx ?? 1, o.sy ?? 1);
          ctx.fillText(ch, -m.w[i] / 2, m.base - 0.85 * KSIZE);
          ctx.restore();
        });
      }
      ctx.restore();
    },
  });

  // ------------------------------------------------------------------ the HUD: 14 sets, the move counter, the clock
  scene({
    name: 'hud', from: 'drop', to: 46.6,
    build(root, S) {
      const n = 14, gap = 8, sw = (WIN.w - gap * (n - 1)) / n;
      S.segs = Array.from({ length: n }, (_, i) => {
        const tr = C.reg(el('div', { style: `position:absolute;left:${X + i * (sw + gap)}px;top:150px;width:${sw}px;height:10px;border-radius:5px;background:rgba(103,100,94,0.16);transform-origin:0 50%;overflow:hidden` }, root));
        const fill = C.reg(el('div', { style: `position:absolute;left:0;top:0;width:100%;height:100%;background:${ACCENT};transform-origin:0 50%` }, tr));
        return { tr, fill };
      });
      S.labMask = el('div', { style: `position:absolute;left:${X - 4}px;top:176px;width:700px;height:44px;overflow:hidden` }, root);
      S.lab = C.reg(el('div', { class: 'ui caps', style: 'position:absolute;left:4px;top:4px;font-size:30px;color:' + INK }, S.labMask));
      S.lab.innerHTML = `move <span style="display:inline-block;height:1.15em;overflow:hidden;vertical-align:top" class="tab"><span class="odo" style="display:block"></span></span> / 14`;
      S.odo = C.reg(S.lab.querySelector('.odo'));
      S.odo.innerHTML = Array.from({ length: n }, (_, i) => `<span style="display:block;height:1.15em">${String(i + 1).padStart(2, '0')}</span>`).join('');
      S.done = C.reg(el('div', { class: 'ui caps', style: `position:absolute;left:4px;top:4px;font-size:30px;color:${ACCENT}` }, S.labMask, 'workout complete ✓'));
      S.clockMask = el('div', { style: `position:absolute;left:${X + WIN.w - 300}px;top:176px;width:304px;height:44px;overflow:hidden` }, root);
      S.clock = C.reg(el('div', { class: 'ui caps tab', style: `position:absolute;right:4px;top:4px;font-size:30px;color:${INK}` }, S.clockMask));
    },
    run(t, b, S) {
      // which set is live: six moves of 4 beats, then eight of 1
      const starts = [...MOVES.map((M) => M.A), ...SPEED.map((M) => M.B)];
      S.segs.forEach((g, i) => {
        const inn = spHit(t, 8 + i * 0.03, 'snappy'), out = sp(t, 45.75 + (13 - i) * 0.02, 'snappy');
        const sx = inn * (1 - out);
        put(g.tr, { css: { transform: `scale(${sx.toFixed(4)}, 1)` }, hide: sx < 0.005 });
        const f = spHit(t, starts[i], 'snappy');
        put(g.fill, { css: { transform: `scale(${f.toFixed(4)}, 1)` }, hide: f < 0.005 });
      });
      // the counter rolls one spring per set
      const idx = trk(t, starts.map((s, i) => [i ? s - 0.12 : 0, i]), 'snappy');
      put(S.odo, { y: -idx * 30 * 1.15 });
      const inY = 44 * (1 - spHit(t, 8, 'snappy')), sw = sp(t, 'class', 'snappy'), outY = -44 * sp(t, 45.75, 'snappy');
      put(S.lab, { y: inY - 44 * sw, hide: sw > 0.999 });
      put(S.done, { y: 44 * (1 - spHit(t, 40.15, 'snappy')) + outY, hide: b < 39.5 || outY < -43.9 });
      // workout clock: whole seconds since the drop, frozen when the class is done
      const secs = Math.max(0, Math.floor(Math.min(t, bt('class')) - bt('drop') + 1e-6));
      put(S.clock, { text: `0:${String(secs).padStart(2, '0')}`, y: inY + outY, hide: outY < -43.9 });
    },
  });

  // ------------------------------------------------------------------ the whole class: 14 shades on 14 faces
  const CLASS = ALL;
  scene({
    name: 'class', from: 'class', to: 47,
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      CLASS.forEach((s, i) => {
        const col = i % 4, row = Math.floor(i / 4), x = WIN.x + col * (CW + G), y = WIN.y + row * (CH + G);
        const p = spHit(t, 40 + i * 0.2, 'default'); if (p < 0.02) return;
        const out = sp(t, 45.75 + i * 0.03, 'snappy'); if (out > 0.999) return;
        const settled = p > 0.999 && out < 0.001, k = settled ? 1 : POP(p), dy = 1400 * out;
        const im = PORT[s]; if (!im.naturalWidth) return;
        ctx.save(); ctx.translate(x + CW / 2, y + CH / 2 + dy); ctx.scale(k, k);
        ctx.beginPath(); ctx.roundRect(-CW / 2, -CH / 2, CW, CH, 18); ctx.clip();
        const z = Math.max(CW / im.naturalWidth, CH / im.naturalHeight);
        ctx.drawImage(im, -im.naturalWidth * z / 2, -im.naturalHeight * z / 2, im.naturalWidth * z, im.naturalHeight * z);
        ctx.restore();
      });
    },
  });

  // ------------------------------------------------------------------ the end: the product
  scene({
    name: 'pencil', from: 'end', to: 'done',
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      if (!PENCIL.naturalWidth) return;
      const k = spHit(t, 46.6, 'heavy'), rot = trk(t, [[46, -70], [46.6, -24, 'heavy']]);
      const s = 0.82, w = PENCIL.naturalWidth * s, h = PENCIL.naturalHeight * s;
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.save(); ctx.translate(720, 1090 + 1300 * (1 - k)); ctx.rotate(rot * Math.PI / 180); ctx.drawImage(PENCIL, -w / 2, -h / 2, w, h); ctx.restore();
    },
  });

  // ------------------------------------------------------------------ words
  scene({
    name: 'words', from: 'hook', to: 'done',
    build(root, S) {
      S.desc = [...MOVES.map((M) => ({ s: M.s, A: M.A, len: 4 })), ...SPEED.map((M) => ({ s: M.s, A: M.B, len: 1 }))].map((d) => ({
        ...d,
        dot: C.reg(el('div', { style: `position:absolute;left:${X + 2}px;top:558px;width:34px;height:34px;border-radius:17px;background:${SHADE[d.s][0]}` }, root)),
        L: line(root, SHADE[d.s][1], X + 48, 553, 34, { cls: 'ui caps', color: GREY }),
      }));
      S.cue = MOVES.map((M) => line(root, M.cue, X + 40, 1550, 54, { cls: 'ui bold', color: WHITE }));
      S.speed = line(root, 'speed round. go go go.', X + 40, 1550, 54, { cls: 'ui bold', color: WHITE });
      S.whole = line(root, 'the whole', X, 236, 140, { color: INK });
      S.cls = line(root, 'class.', X, 386, 140, { color: INK });
      const cx = WIN.x + 2 * (CW + G) + 14, cy = WIN.y + 3 * (CH + G);
      S.n14 = line(root, '14 shades.', cx, cy + 60, 68, { color: INK });
      S.all = line(root, '(everyone showed up.)', cx + 2, cy + 150, 30, { cls: 'ui it', color: GREY });
      S.pep = line(root, 'peptide', X, 236, 150, { color: INK });
      S.shape = line(root, 'lip shape', X, 396, 150, { color: INK });
      S.sub = line(root, 'the contouring lip shaper', X + 4, 590, 34, { cls: 'ui caps', color: GREY });
      S.price = line(root, '$24', X, 1180, 120, { color: ACCENT });
      const LW = 380, LH = Math.round(LW * 26 / 100);
      const box = el('div', { style: `position:absolute;left:${(W - LW) / 2}px;top:1470px;width:${LW}px;height:${LH + 8}px;overflow:hidden` }, root);
      S.logo = C.reg(el('img', { src: '../assets/brand/rhode-logo.svg', style: `position:absolute;left:0;top:0;width:${LW}px;height:${LH}px` }, box), { y: 0 });
      S.logoH = LH + 8;
      S.tom = line(root, 'same time tomorrow?', 0, 1600, 50, { cls: 'ui it', color: INK });
      put(S.tom.el, { css: { left: '50%' } });
    },
    run(t, b, S) {
      const R_ = TYPE.rise;
      S.desc.forEach((d) => {
        const fast = d.len === 1, inB = fast ? d.A + 0.1 : d.A + 0.5, outB = fast ? d.A + 0.85 : d.A + 3.7;
        const k = spHit(t, inB, 'snappy') * (1 - sp(t, outB, 'snappy'));
        put(d.dot, { s: k, hide: k < 0.01 });
        R_(t, d.L, inB, outB, { stagger: 0.03, preset: 'snappy' });
      });
      S.cue.forEach((L, i) => { shadow(L); R_(t, L, MOVES[i].A + 1.25, MOVES[i].A + 3.6, { stagger: 0.07 }); });
      shadow(S.speed); R_(t, S.speed, 'speed', 39.6, { stagger: 0.12 });
      R_(t, S.whole, 40.25, 45.6, { stagger: 0.1 });
      R_(t, S.cls, 40.5, 45.6);
      R_(t, S.n14, 42.9, 45.6, { stagger: 0.1 });
      R_(t, S.all, 43.4, 45.6, { stagger: 0.05, preset: 'default' });
      R_(t, S.pep, 'h1', null);
      R_(t, S.shape, 46.5, null, { stagger: 0.12 });
      R_(t, S.sub, 47, null, { stagger: 0.05, preset: 'default' });
      R_(t, S.price, 'price', null);
      const y = S.logoH * 1.15 * (1 - spHit(t, 'logo', 'heavy'));
      put(S.logo, { y, hide: y >= S.logoH * 1.149 });
      put(S.tom.el, { css: { left: '50%', transform: 'translateX(-50%)' } });
      R_(t, S.tom, 'tomorrow', null, { stagger: 0.08 });
    },
  });

  C.start();
  window.CUTS = [...new Set([...(window.CUTS || []), ...SPEED.map((M) => bt(M.B)), bt(40), bt(46)])].sort((a, b) => a - b);
  const ready0 = window.READY;
  window.READY = Promise.all([ready0, FOOT.ready, ...loads]).then(() => { window.seek(0); return true; });
})();

// Rare Beauty · "just a little." A spec reel cut from the brand's own product films (Soft Pinch Liquid Blush with Selena
// and the shade cast, the liquid blush how-to, the Find Comfort self-care ritual) to Mixkit's "Thinking About You" (70 bpm).
// 9:16, 26.2 s, 30.5 beats.
// Story: a gentle reminder: you don't have to do it all today → just a little → one dot (…okay, two) → a little goes a long
// way → made to feel good in (six faces) → and on the heavy days, find comfort → breathe in, and out → be gentle with
// yourself → the wordmark, and "one dot at a time."
// Device: the dot. Every picture lives in a circle; the full stop of "just a little." opens into the frame, six faces dab
// in like swatches, a circle breathes with you, and the last frame closes back into a full stop.
(() => {
  const { W, H, bt, sp, spHit, seg, clamp, lerp, put, el, scene, trk, beatOf } = C;
  C.fonts = ['400 100px Display', '400 40px UI', '500 40px UI', '400 100px Script'];
  const X = 90;
  const CREAM = '#FDF6F0', INK = '#000914', BERRY = '#7A0036', MAUVE = '#A57B80', MILK = '#FFF7E7';
  const SOFT = '0 2px 22px rgba(40,10,20,0.40)';
  const POP = (k) => 0.3 + 0.7 * k;                                // pops start at 30 % (tiny scales rasterise inexactly)
  const SLOW = { response: 1.15, damping: 1 };                       // a breath
  const line = (parent, text, x, y, size, o = {}) => TYPE.line(parent, text, { x, y, size, cls: o.cls || 'display', color: o.color });
  const label = (parent, text, x, y, o = {}) => TYPE.line(parent, text, { x, y, size: o.size || 30, cls: 'ui caps', color: o.color || BERRY });
  const tint = (L, color, shadow = false) => put(L.el, { css: { color, textShadow: shadow ? SOFT : 'none' } });
  const FULLR = 2300;                                                // a circle this big covers the frame from anywhere on it

  // ------------------------------------------------------------------ the cut list (what the main circle shows)
  const cut = (from, to, s, o = {}) => ({ from, to, s, t0: from, ...o });
  const REEL = [
    cut(-1, 3.5, 'sel_hold', { t0: 0, rate: 0.43, fit: 'circle' }), // Selena, smiling, Soft Pinch in hand (never opens: fills its circle)
    cut(3.5, 5, 'sel_dot', { rate: 0.48 }),                        // one dab on the cheek
    cut(5, 7.5, 'ct_dot', { rate: 0.72 }),                         // one dot (lands b5.1)… and a second (b6.42)
    cut(7.5, 9.6, 'ct_blend'),                                     // 7.52–9.35 s: ends before the source's soft angle change at 9.6 s
    cut(9.6, 15.3, 'ct_glow', { rate: 0.5 }),                       // the finished cheek; becomes the first swatch
    cut(15.3, 19.5, 'fc_spray', { rate: 0.8 }),                    // Find Comfort, spritzed
    cut(19.5, 23.5, 'fc_breathe'),                                 // eyes closed, breathing
    cut(23.5, 'done', 'sel_smile', { rate: 0.4 }),                  // Selena again
  ];
  const SLOT = [[230, 900], [540, 900], [850, 900], [230, 1210], [540, 1210], [850, 1210]];
  const SWATCH = ['', 'm1', 'm2', 'm3', 'm4', 'm7'];                // slot 0 is the glow shot the frame closed into
  const SR = 140;
  const MID = [540, 1010];                                           // the Find Comfort circle
  const pingpong = (k, t, t0, rate = 0.35) => {                     // portraits loop gently instead of freezing
    const n = FOOT.SH[k].n - 1, u = Math.max(0, Math.round(t * C.FPS) / C.FPS - bt(t0)) * FOOT.SH[k].fps * rate, m = u % (2 * n);
    return m <= n ? m : 2 * n - m;
  };

  // full stops whose position is measured once, in run(), from the laid-out text (fonts are loaded by then)
  const stops = {};
  const stopAt = (key, L) => {
    if (!stops[key]) {
      const k = C.stage.getBoundingClientRect().width / W, s = C.stage.getBoundingClientRect();
      const w = L.words[L.words.length - 1].getBoundingClientRect(), e = L.el.getBoundingClientRect();
      stops[key] = { x: (w.right - s.left) / k + L.size * 0.1, y: (e.top - s.top) / k + L.size * (0.12 + 0.74), r: L.size * 0.085 };
    }
    return stops[key];
  };

  // ------------------------------------------------------------------ background: cream, then the Find Comfort mauve
  scene({
    name: 'bg', from: 'hook', to: 'done',
    build(root, S) {
      S.base = C.reg(el('div', { class: 'fill' }, root));
      S.wash = C.reg(el('div', { class: 'fill', style: `background:${MAUVE}` }, root), { hide: true });
    },
    // the base is a new style on every seek, so the whole frame re-rasterises (determinism, as in the earlier films)
    run(t, b, S) {
      put(S.base, { css: { backgroundImage: `linear-gradient(${CREAM}, ${CREAM})`, backgroundPosition: `${Math.round(t * 1e4)}px 0px` } });
      if (b >= 15 && b < 23.9) {                                     // the colour spreads from the circle like blended blush
        const k = sp(t, 15.1, 'heavy'), r = FULLR * k;
        put(S.wash, { hide: k < 0.002, css: { clipPath: `circle(${r.toFixed(1)}px at ${MID[0]}px ${MID[1]}px)` } });
      }
    },
  });

  // ------------------------------------------------------------------ every circle (and the full frame they open to)
  scene({
    name: 'frame', from: 'hook', to: 'done',
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      const disc = (cx, cy, r, paint) => {
        if (r < 0.5) return;
        ctx.save();
        const covers = r >= Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));
        if (!covers) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip(); }
        paint(covers ? { x: 0, y: 0, w: W, h: H } : { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r }, covers);
        ctx.restore();
      };
      const FULL = { x: 0, y: 0, w: W, h: H };
      const lerpR = (a, c, k) => ({ x: lerp(a.x, c.x, k), y: lerp(a.y, c.y, k), w: lerp(a.w, c.w, k), h: lerp(a.h, c.h, k) });
      // 9:16 shots keep their full-frame scale inside a circle (the circle only clips), so an opening circle never jumps in
      // scale when it covers the frame; square shots fill the circle. closing (0..1) eases a 9:16 shot into its circle.
      const shot = (e, rr, closing = 0) => {
        const s = 1.05 - 0.05 * seg(t, e.from, e.to);
        const full = FOOT.SH[e.s].mode === 'full' && e.fit !== 'circle';
        FOOT.draw(ctx, e, t, { r: full ? lerpR(FULL, rr, closing) : rr, s });
      };
      const e = REEL.find((r) => b >= beatOf(r.from) && b < beatOf(r.to));

      // 3.5–6: the small Selena circle stays until the opening dot has grown over it
      const SMALL = [540, 600, 220];
      if (b >= 5 && b < 6.2) disc(SMALL[0], SMALL[1], SMALL[2], (rr) => FOOT.draw(ctx, REEL[1], t, { r: rr }));

      // swatches 1–5 dab in (10.75–12), then everything gathers into the middle (15)
      const g = b >= 15 ? sp(t, 'gather', 'default') : 0;
      for (let i = 1; i < 6; i++) {
        const k = spHit(t, 10.75 + i * 0.25, 'default');
        if (k < 0.02 || g > 0.97) continue;
        const cx = lerp(SLOT[i][0], MID[0], g), cy = lerp(SLOT[i][1], MID[1], g), r = SR * POP(k) * (1 - 0.7 * g);
        disc(cx, cy, r, (rr) => FOOT.paint(ctx, SWATCH[i], pingpong(SWATCH[i], t, 10.75 + i * 0.25), { r: rr }));
      }

      // the main circle
      let cx = 540, cy = 700, r = 430;
      if (b < 3.5) { r = 430 * (0.88 + 0.12 * sp(t, -0.3, 'heavy')); }
      else if (b < 5) { const k = sp(t, 'little', 'default'); cx = 540; cy = lerp(700, SMALL[1], k); r = lerp(430, SMALL[2], k); }
      else if (b < 10.75) {
        const P = stopAt('little', S.little), k = sp(t, 'dot', 'heavy');   // no lead: the stop must not blink out before it grows
        cx = P.x; cy = P.y; r = lerp(P.r, FULLR, k * k);            // the full stop opens into the frame
      } else if (b < 15) { const k = sp(t, 'grid', 'default'); cx = SLOT[0][0]; cy = SLOT[0][1]; r = lerp(FULLR, SR, k); }
      else {
        // swatch 0 gathers with the others; the Find Comfort circle grows from the middle
        if (g < 0.97) disc(lerp(SLOT[0][0], MID[0], g), lerp(SLOT[0][1], MID[1], g), SR * (1 - 0.7 * g), (rr) => shot(REEL[4], rr, 1));
        const k = spHit(t, 15.3, 'default');
        const breath = 50 * (sp(t, 'breathe', SLOW) - sp(t, 'out', SLOW));
        cx = MID[0]; cy = MID[1]; r = (380 + breath) * POP(k);
        if (k < 0.02) r = 0;
        if (b >= 23.5) { const o = sp(t, 'selena', 'default'); r = lerp((380 + breath) * POP(k), FULLR, o * o); }
        if (b >= 27) {
          const Q = stopAt('end', S.endLine), c = sp(t, 'end', 'default');
          cx = lerp(MID[0], Q.x, c); cy = lerp(MID[1], Q.y, c); r = lerp(FULLR, Q.r, Math.sqrt(c));
        }
      }
      if (e && !(b >= 15 && b < 15.3)) {
        // a full stop and the frame are the same circle: below ~60 px it is berry, above it is picture
        const fin = b >= 27 || (b >= 4.9 && b < 6) ? clamp((60 - r) / 44) : 0;
        const closing = b >= 10.75 && b < 15 ? sp(t, 'grid', 'default') : 0;
        disc(cx, cy, r, (rr) => {
          if (fin < 1) shot(e, rr, closing);
          if (fin > 0) { ctx.fillStyle = BERRY; ctx.globalAlpha = fin; ctx.fillRect(rr.x, rr.y, rr.w, rr.h); ctx.globalAlpha = 1; }
        });
      }
      // the opening full stop, before it opens
      if (b >= 4.4 && b < 5.2) {
        const P = stopAt('little', S.little), k = spHit(t, 4.45, 'snappy');
        if (k > 0.02 && b < 5) { ctx.fillStyle = BERRY; ctx.beginPath(); ctx.arc(P.x, P.y, P.r * POP(k), 0, Math.PI * 2); ctx.fill(); }
      }
    },
  });

  // ------------------------------------------------------------------ words
  scene({
    name: 'words', from: 'hook', to: 'done',
    build(root, S) {
      S.h1 = line(root, 'a gentle reminder:', X + 4, 1150, 84, { cls: 'script', color: BERRY });
      S.h2 = line(root, "you don't have to", X, 1256, 112, { color: INK });
      S.h3 = line(root, 'do it all today.', X, 1384, 112, { color: INK });
      S.little = line(root, 'just a little', X, 906, 150, { color: INK });
      F.little = S.little;
      S.one = line(root, 'one dot.', X, 1230, 128, { color: MILK });
      S.two = line(root, '…okay, two.', X + 6, 1376, 112, { cls: 'script', color: MILK });
      S.lg1 = line(root, 'a little goes', X, 1230, 128, { color: MILK });
      S.lg2 = line(root, 'a long way.', X, 1366, 128, { color: MILK });
      S.g1 = line(root, 'made to feel', X, 300, 128, { color: INK });
      S.g2 = line(root, 'good in.', X, 436, 128, { color: INK });
      S.gl = label(root, 'soft pinch liquid blush', X + 4, 1400, { size: 32 });
      S.hv1 = line(root, 'and on', X, 270, 124, { color: MILK });
      S.hv2 = line(root, 'the heavy days,', X, 402, 124, { color: MILK });
      S.fc = line(root, 'find comfort.', X, 330, 148, { color: MILK });
      S.fcl = label(root, 'find comfort body & hair mist', X + 4, 1452, { size: 30, color: MILK });
      S.bi = line(root, 'breathe in…', X + 4, 300, 132, { cls: 'script', color: MILK });
      S.bo = line(root, '…and out.', X + 4, 300, 132, { cls: 'script', color: MILK });
      S.bg1 = line(root, 'be gentle', X, 1236, 136, { color: MILK });
      S.bg2 = line(root, 'with yourself.', X, 1378, 136, { color: MILK });
      const LW = 760, LH = Math.round(LW * 37 / 200);
      S.box = el('div', { style: `position:absolute;left:${X - 6}px;top:800px;width:${LW}px;height:${LH}px;overflow:hidden` }, root);
      S.logo = C.reg(el('img', { src: '../assets/brand/rb-logo.svg', style: `position:absolute;left:0;top:0;width:${LW}px;height:${LH}px` }, S.box), { y: 0 });
      S.logoH = LH;
      S.by = label(root, 'by selena gomez', X + 4, 800 + LH + 22, { size: 32 });
      S.endLine = line(root, 'one dot at a time', X, 1076, 92, { color: INK });
      F.endLine = S.endLine;
    },
    run(t, b, S) {
      const R_ = TYPE.rise;
      R_(t, S.h1, -0.45, 3.3, { stagger: 0.08 });
      R_(t, S.h2, 'h_2', 3.3, { stagger: 0.1 });
      R_(t, S.h3, 'h_3', 3.3, { stagger: 0.1 });
      R_(t, S.little, 3.6, 5.12, { stagger: 0.12 });            // holds until the opening full stop has grown over it
      for (const L of [S.one, S.two, S.lg1, S.lg2, S.bg1, S.bg2]) tint(L, MILK, true);
      R_(t, S.one, 'one', 7.35, { stagger: 0.12 });
      R_(t, S.two, 'two', 7.35, { stagger: 0.12 });
      R_(t, S.lg1, 7.75, 9.55, { stagger: 0.1 });
      R_(t, S.lg2, 8.25, 9.55, { stagger: 0.12 });
      R_(t, S.g1, 'grid_txt', 14.7, { stagger: 0.1 });
      R_(t, S.g2, 12.0, 14.7, { stagger: 0.1 });
      R_(t, S.gl, 'name', 14.7, { stagger: 0.06, preset: 'default' });
      R_(t, S.hv1, 15.6, 17.2, { stagger: 0.1 });
      R_(t, S.hv2, 16.0, 17.2, { stagger: 0.1 });
      R_(t, S.fc, 'comfort', 19.2, { stagger: 0.12 });
      R_(t, S.fcl, 18.0, 23.3, { stagger: 0.05, preset: 'default' });
      R_(t, S.bi, 'breathe', 21.25, { stagger: 0.14 });
      R_(t, S.bo, 'out', 23.25, { stagger: 0.14 });
      R_(t, S.bg1, 'gentle', 26.7, { stagger: 0.12 });
      R_(t, S.bg2, 24.55, 26.7, { stagger: 0.12 });
      R_(t, S.endLine, 27.2, null, { stagger: 0.1 });
      const y = S.logoH * 1.15 * (1 - spHit(t, 28.25, 'heavy'));
      put(S.logo, { y, hide: y >= S.logoH * 1.149 });
      R_(t, S.by, 28.55, null, { stagger: 0.06, preset: 'default' });
    },
  });
  // the frame scene measures the full stops from these lines
  var F = {};

  C.start();
  const fr = C.SCENES.find((s) => s.name === 'frame');
  fr.little = F.little; fr.endLine = F.endLine;
  const shotCuts = REEL.slice(1).map((r) => bt(r.from)).concat([bt(5)]);
  window.CUTS = [...new Set([...(window.CUTS || []), ...shotCuts])].sort((a, b) => a - b);
  const ready0 = window.READY;
  window.READY = Promise.all([ready0, FOOT.ready]).then(() => { window.seek(0); return true; });
})();

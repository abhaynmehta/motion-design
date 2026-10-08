// Kylie Cosmetics · Mood Stones — "one of each, obviously." A spec reel cut from the brand's own Mood Stones films and
// Kylie's get-ready clips (kyliecosmetics.com) to Mixkit's "Smooth Jazz" (67.5 bpm). 9:16, 30.6 s, 34 beats.
// Story: you're not the same girl at 8 am as you are at 11 pm → so why wear the same scent? → 8:00 am Cashmere Muse →
// 3:00 pm Blush Wood → 11:00 pm Velvet Brew → three moods, one of each, obviously → the wordmark.
// Device: every shot lives in a stone-shaped window (the bottles are pebbles) that opens to full frame and folds back,
// and the clock above it rolls forward through the hours between acts. Day colours from the site: pink → mauve → night,
// then paper again (the next morning), so the end loops into the start.
(() => {
  const { W, H, bt, sp, spHit, seg, clamp, lerp, put, el, scene, trk, beatAt, beatOf } = C;
  C.fonts = ['400 100px Display', 'italic 400 100px Display', '600 100px Display', '700 40px UI'];
  const X = 90;                                                   // the one left type edge
  const PAPER = '#F8F1F4', PINK = '#EFD7E5', MAUVE = '#B3848F', DEEP = '#A06674', INK = '#393939', NIGHT = '#0E0B0C', CREAM = '#FFF8F4';
  const SOFT = '0 2px 22px rgba(24,12,16,0.38)';                 // legibility on footage only (dark and tight: not a glow)
  const line = (parent, text, x, y, size, o = {}) => TYPE.line(parent, text, { x, y, size, cls: o.cls || 'display', color: o.color, accent: o.accent });
  const label = (parent, text, x, y, o = {}) => TYPE.line(parent, text, { x, y, size: o.size || 26, cls: 'ui caps', color: o.color || DEEP });
  const tint = (L, color, shadow = false) => put(L.el, { css: { color, textShadow: shadow ? SOFT : 'none' } });

  // ------------------------------------------------------------------ geometry
  const R = (x, y, w, h) => ({ x, y, w, h });
  const lerpR = (a, b, k) => R(lerp(a.x, b.x, k), lerp(a.y, b.y, k), lerp(a.w, b.w, k), lerp(a.h, b.h, k));
  const grow = (r, k) => R(r.x - r.w * (k - 1) / 2, r.y - r.h * (k - 1) / 2, r.w * k, r.h * k);
  const WIN = R(110, 690, 860, 860);                             // the stone window
  const FULL = R(0, 0, W, H);
  const OVER = R(-W * 0.16, -H * 0.09, W * 1.32, H * 1.18);      // a superellipse this big (n 10) covers the frame
  const SLOT = [R(90, 800, 290, 290), R(395, 800, 290, 290), R(700, 800, 290, 290)];   // end: three stones
  // stone outlines: a superellipse with two low harmonics on the radius. One per act; the window reshapes on each act.
  const STONE = [
    { n: 3.2, a2: 0.030, p2: 0.3, a3: 0.016, p3: 1.0 },          // hook
    { n: 2.7, a2: 0.040, p2: 1.2, a3: 0.020, p3: 2.4 },          // Cashmere Muse: round, soft
    { n: 4.2, a2: 0.022, p2: 2.0, a3: 0.012, p3: 0.4 },          // Blush Wood: squarer, like the bottle
    { n: 3.4, a2: 0.046, p2: 2.8, a3: 0.026, p3: 4.0 },          // Velvet Brew: chunky
    { n: 4.2, a2: 0.022, p2: 2.0, a3: 0.012, p3: 0.4 },          // end: the middle stone is Blush Wood again
  ];
  const ACTS = [0, 6, 14, 22, 30];
  const stoneAt = (t) => {
    const o = {};
    for (const k of ['n', 'a2', 'p2', 'a3', 'p3']) o[k] = trk(t, ACTS.map((b, i) => [b, STONE[i][k]]), 'default');
    return o;
  };
  /** Trace a stone in rect r. open 0 = the pebble; 1 = an overscanned superellipse that covers the whole frame. */
  function stonePath(ctx, r, P, open = 0) {
    const o = clamp(open), B = lerpR(r, OVER, o), n = lerp(P.n, 10, o), wob = 1 - o;
    const cx = B.x + B.w / 2, cy = B.y + B.h / 2, a = B.w / 2, b = B.h / 2, N = 240;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const th = (i / N) * Math.PI * 2, c = Math.cos(th), s = Math.sin(th);
      const m = 1 + wob * (P.a2 * Math.sin(2 * th + P.p2) + P.a3 * Math.sin(3 * th + P.p3));
      const px = a * Math.sign(c) * Math.abs(c) ** (2 / n) * m, py = b * Math.sign(s) * Math.abs(s) ** (2 / n) * m;
      if (i) ctx.lineTo(cx + px, cy + py); else ctx.moveTo(cx + px, cy + py);
    }
    ctx.closePath();
  }
  // the footage rect for a stone: its bounds (+7 % for the bulges), clipped to the frame
  function drawRect(r, open) {
    const B = grow(lerpR(r, OVER, clamp(open)), 1.07);
    const x0 = Math.max(0, B.x), y0 = Math.max(0, B.y), x1 = Math.min(W, B.x + B.w), y1 = Math.min(H, B.y + B.h);
    return R(x0, y0, x1 - x0, y1 - y0);
  }

  // ------------------------------------------------------------------ the cut list (beats on the measured grid)
  // fx: where the subject sits across the square (0..1), used once the window is open to the 9:16 frame
  const cut = (from, to, s, o = {}) => ({ from, to, s, t0: from, ...o });
  const REEL = [
    cut(-1, 3.75, 'eyes', { t0: 0, rate: 0.53 }),                // from before frame 0 (beat 0 sits at 0.02 s)                         // slow blink; eyes close on "11 pm", open on the band
    cut(3.75, 6, 'stack', { rate: 0.8, punch: 0.05 }),           // three stones stacked: "so why wear the same scent?"
    cut(6, 9, 'csea', { rate: 0.92, fx: 0.56, punch: 0.06 }),     // 8 am · Cashmere Muse held up to the sea
    cut(9, 10.5, 'clime', { rate: 0.81, punch: 0.05 }),
    cut(10.5, 12, 'crocks', { rate: 0.94, fx: 0.45, punch: 0.05 }),
    cut(12, 12.75, 'cpalms', { f0: 6, punch: 0.05 }),
    cut(12.75, 14, 'ctrio', { f0: 24 }),
    cut(14, 15.5, 'bhands', { rate: 0.9, punch: 0.06 }),          // 3 pm · Blush Wood
    cut(15.5, 17, 'bclose', { rate: 0.66, punch: 0.05 }),
    cut(17, 18.5, 'kblush', { f0: 2, fx: 0.45, punch: 0.05 }),     // Kylie, blush brush, a glance at camera
    cut(18.5, 19.5, 'brose', { rate: 0.89, punch: 0.05 }),
    cut(19.5, 20.75, 'brocks', { fx: 0.42, punch: 0.05 }),
    cut(20.75, 22, 'bbottle', { rate: 0.67, fx: 0.4 }),
    cut(22, 23.5, 'vhand', { rate: 0.94, punch: 0.06 }),          // 11 pm · Velvet Brew
    cut(23.5, 25, 'vrocks', { fx: 0.36, punch: 0.05 }),
    cut(25, 25.75, 'coffee', { rate: 0.81, punch: 0.05 }),
    cut(25.75, 26.8, 'plum', { f0: 4, punch: 0.05 }),
    cut(26.8, 28.5, 'khair', { punch: 0.04 }),                    // Kylie's hair toss, red dress: the night out
    cut(28.5, 30, 'tea', { punch: 0.05 }),
    cut(30, 'done', 'bclose', { f0: 4, rate: 0.4 }),             // end: the middle stone (3 pm)
  ];
  const SIDE = [cut(30, 'done', 'ctrio', { f0: 44, rate: 0.45 }), null, cut(30, 'done', 'vrocks', { f0: 16, rate: 0.45 })];
  // open (1) / fold back (0): one spring per change
  const OPEN = [[0, 0], [8.5, 1], [13.5, 0], [16.5, 1], [21.5, 0], [24.5, 1], [26.5, 0]];

  scene({
    name: 'bg', from: 'hook', to: 'done',
    build(root, S) {
      S.base = C.reg(el('div', { class: 'fill' }, root));
      S.sun = C.reg(el('div', { class: 'fill' }, root), { hide: true });
    },
    // the base also invalidates the whole frame on every seek (a new style per t), so everything re-rasterises from
    // scratch: partial re-raster next to moving things left 1-px AA differences in earlier films (render --verify)
    run(t, b, S) {
      const base = b < 6 ? PAPER : b < 13.4 ? PINK : b < 21.4 ? MAUVE : NIGHT;
      const prev = b < 6 ? PAPER : b < 13.4 ? PAPER : b < 21.4 ? MAUVE : NIGHT;
      const sunAt = b >= 30 ? 30 : b >= 6 && b < 13.4 ? 6 : null;
      const top = b >= 30 ? PAPER : PINK;
      put(S.base, { css: { backgroundImage: `linear-gradient(${sunAt != null ? prev : base}, ${sunAt != null ? prev : base})`, backgroundPosition: `${Math.round(t * 1e4)}px 0px` } });
      if (sunAt != null) {
        // a sunrise: the new day colour rises as a disc from below the frame and fills it
        const k = sp(t, sunAt, 'default'), r = 2300 * k;
        put(S.sun, { hide: k < 0.002, css: { background: top, clipPath: `circle(${r.toFixed(1)}px at 50% ${H + 140}px)` } });
      }
    },
  });

  // ------------------------------------------------------------------ the clock + name + notes on each act's card (under the window: the fold reveals them)
  // The clock is one odometer: the hour column holds every hour from 8 am to 11 pm, so the roll between acts passes
  // through the hours in between (am flips to pm at 12). ':00 am' slides with the hour's width.
  const HOURS = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const CLK = { y: 214, size: 210 };
  const ACT = [
    { at: 6, out: 8.2, back: null, name: 'cashmere muse', notes: 'bergamot · mandarin blossom', ink: INK, note: DEEP },
    { at: 14, out: 16.2, back: 13.5, name: 'blush wood', notes: 'apple · rose · vanilla', ink: '#FFFFFF', note: '#FFFFFF' },
    { at: 22, out: 24.2, back: 21.5, name: 'velvet brew', notes: 'hazelnut · plum · coffee', ink: CREAM, note: MAUVE },
  ];
  scene({
    name: 'clock', from: 5.5, to: 26,
    build(root, S) {
      const size = CLK.size, lh = Math.round(size * 1.24);   // room for the descender of 'pm'
      S.lh = lh;
      S.mask = C.reg(el('div', { class: 'line display', style: `left:${X}px;top:${CLK.y}px;font-size:${size}px;height:${lh}px;padding-bottom:0.12em;width:900px` }, root));
      S.inner = C.reg(el('div', { style: 'position:absolute;left:0.04em;top:0.1em;white-space:nowrap' }, S.mask), { y: 0 });
      const col = (vals) => {
        const box = el('div', { style: `position:absolute;left:0;top:0;height:${lh}px;overflow:hidden` }, S.inner);
        const c = C.reg(el('div', { style: 'position:absolute;left:0;top:0' }, box), { y: 0 });
        const spans = vals.map((v) => el('div', { style: `height:${lh}px;line-height:${lh}px;white-space:nowrap` }, c, String(v)));
        return { box, c, spans };
      };
      S.hour = col(HOURS);
      S.rest = C.reg(el('div', { style: `position:absolute;left:0;top:0;height:${lh}px;line-height:${lh}px;white-space:nowrap` }, S.inner, ':00'), { x: 0 });
      S.ap = col(HOURS.map((h, i) => (i < 4 ? 'am' : 'pm')));
      S.ap.box.style.width = '2em';
      S.names = ACT.map((A) => line(root, A.name, X, 492, 100, { cls: 'display demi' }));
      S.notes = ACT.map((A) => label(root, A.notes, X + 4, 616, { size: 34 }));
    },
    run(t, b, S) {
      if (!S.w) {                                                 // hour widths, measured once (fonts are loaded by now)
        S.w = S.hour.spans.map((d) => { d.style.display = 'inline-block'; const w = d.getBoundingClientRect().width / (C.stage.getBoundingClientRect().width / W); d.style.display = 'block'; return w; });
        S.wRest = S.rest.getBoundingClientRect().width / (C.stage.getBoundingClientRect().width / W);
      }
      const idx = clamp(trk(t, [[0, 0], [14, 7], [22, 15]], 'default'), 0, 15);
      const i0 = Math.floor(idx), i1 = Math.min(15, i0 + 1), f = idx - i0;
      const hw = lerp(S.w[i0], S.w[i1], f);
      put(S.hour.c, { y: -idx * S.lh });
      put(S.ap.c, { y: -idx * S.lh });
      put(S.hour.box, { css: { width: `${Math.ceil(Math.max(S.w[i0], S.w[i1]))}px` } });
      put(S.rest, { x: hw });
      put(S.ap.box, { css: { left: `${(hw + S.wRest + 0.22 * CLK.size).toFixed(2)}px` } });
      // rise in with each act's card, lift out before the window opens
      const A = b < 13.4 ? 0 : b < 21.4 ? 1 : 2, act = ACT[A];
      const inAt = act.back ?? act.at, below = CLK.size * 1.45;
      let y = below * (1 - spHit(t, inAt, 'heavy')) - below * sp(t, act.out, 'snappy');
      put(S.inner, { y, hide: Math.abs(y) >= below * 0.999 });
      put(S.mask, { css: { color: act.ink } });
      ACT.forEach((Ai, i) => {
        TYPE.rise(t, S.names[i], i === A ? Ai.at + 0.5 : -99, i === A ? Ai.out - 0.05 : null, { stagger: 0.1 });
        TYPE.rise(t, S.notes[i], i === A ? Ai.at + 1 : -99, i === A ? Ai.out - 0.1 : null, { stagger: 0.06, preset: 'default' });
        tint(S.names[i], Ai.ink); tint(S.notes[i], Ai.note);
        if (i !== A) { S.names[i].words.forEach((w) => put(w, { hide: true })); S.notes[i].words.forEach((w) => put(w, { hide: true })); }
      });
    },
  });

  // ------------------------------------------------------------------ the stone window (and the full frame it opens to)
  scene({
    name: 'window', from: 'hook', to: 'done',
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      const e = REEL.find((r) => b >= beatOf(r.from) && b < beatOf(r.to));
      const open = clamp(trk(t, OPEN, 'default'), 0, 1);
      const P = stoneAt(t);
      let r = grow(WIN, 0.86 + 0.14 * sp(t, -0.3, 'heavy'));      // frame 0: the stone is still growing into place
      if (b >= 29.9) {
        // one stone becomes three: the window shrinks into the middle slot, the outer two slide out from behind it
        const k = sp(t, 'end', 'default');
        r = lerpR(WIN, SLOT[1], k);
        const side = spHit(t, 30.2, 'default');
        for (const i of [0, 2]) {
          if (side < 0.01) continue;
          const sr = grow(lerpR(SLOT[1], SLOT[i], side), 0.6 + 0.4 * side);
          ctx.save(); stonePath(ctx, sr, STONE[i + 1]); ctx.clip();
          FOOT.draw(ctx, SIDE[i], t, { r: drawRect(sr, 0) });
          ctx.restore();
        }
      }
      if (!e) return;
      let s = 1.04 - 0.04 * seg(t, e.from, e.to);                 // a slow push inside every shot
      if (e.punch) s *= 1 + e.punch * (1 - sp(t, e.from, 'snappy'));
      const dr = drawRect(r, open);
      const dx = open * (0.5 - (e.fx ?? 0.5)) * 1920;
      ctx.save();
      if (open < 0.999) { stonePath(ctx, r, P, open); ctx.clip(); }
      FOOT.draw(ctx, e, t, { r: dr, s, dx });
      ctx.restore();
    },
  });

  // ------------------------------------------------------------------ hook (b0–b6) on paper
  scene({
    name: 'hook', from: 'hook', to: 'a1',
    build(root, S) {
      S.l = [
        line(root, "you're not", X, 250, 128, { color: INK }),
        line(root, 'the same girl', X, 384, 128, { color: INK }),
        line(root, 'at 8 am', X, 518, 128, { color: INK, accent: [1, 2] }),
        line(root, 'as you are', X, 320, 128, { color: INK }),
        line(root, 'at 11 pm.', X, 454, 128, { color: INK, accent: [1, 2] }),
        line(root, 'so why wear', X, 320, 128, { color: INK }),
        line(root, 'the same scent?', X, 454, 128, { color: INK }),
      ];
    },
    run(t, b, S) {
      const [a, b2, c, d, e, f, g] = S.l, R_ = TYPE.rise;
      R_(t, a, -0.42, 1.97, { stagger: 0.1 });                     // already rising on frame 0
      R_(t, b2, 0.2, 1.97, { stagger: 0.1 });
      R_(t, c, 'h_8am', 1.97, { stagger: 0.12 });
      R_(t, d, 'h_11pm', 3.55, { stagger: 0.1 });
      R_(t, e, 2.55, 3.55, { stagger: 0.14 });
      R_(t, f, 'h_why', 5.62, { stagger: 0.1 });
      R_(t, g, 4.15, 5.62, { stagger: 0.12 });
    },
  });

  // ------------------------------------------------------------------ the mood, word by word, over the open window
  scene({
    name: 'mood', from: 8.5, to: 30,
    build(root, S) {
      const big = (text, y, it = false) => line(root, text, X, y, 132, { cls: it ? 'display it' : 'display', color: CREAM });
      S.a1 = [big('soft, clean,', 1170), big('a quiet escape.', 1316, true)];
      S.a2 = [big('warm skin,', 1170), big('a little flirty.', 1316, true)];
      // act 3 sets on the night card above the folded window
      S.a3 = [line(root, 'bold, smooth,', X, 290, 132, { color: CREAM }), line(root, 'a little mysterious.', X, 450, 112, { cls: 'display it', color: MAUVE })];
    },
    run(t, b, S) {
      const R_ = TYPE.rise;
      for (const L of [...S.a1, ...S.a2]) tint(L, CREAM, true);
      R_(t, S.a1[0], [9, 9.75], 11.9);
      R_(t, S.a1[1], 10.5, 11.9, { stagger: 0.12 });
      R_(t, S.a2[0], 17.15, 19.3, { stagger: 0.14 });
      R_(t, S.a2[1], 17.75, 19.3, { stagger: 0.12 });
      R_(t, S.a3[0], [26.95, 27.3], 29.6);
      R_(t, S.a3[1], 27.75, 29.6, { stagger: 0.1 });
    },
  });

  // ------------------------------------------------------------------ end (b30–b34.4): three moods, the wordmark
  scene({
    name: 'end', from: 'end', to: 'done',
    build(root, S) {
      S.l1 = line(root, 'three moods.', X, 280, 128, { color: INK });
      S.l2 = line(root, 'one of each,', X, 414, 128, { color: INK });
      S.l3 = line(root, 'obviously.', X, 548, 128, { cls: 'display it', color: DEEP });
      S.tags = ['8 am', '3 pm', '11 pm'].map((s, i) => label(root, s, SLOT[i].x + 8, 1118, { size: 38, color: DEEP }));
      const LW = 660, LH = Math.round(LW * 51 / 194);
      const box = el('div', { style: `position:absolute;left:${X - 6}px;top:1230px;width:${LW}px;height:${LH}px;overflow:hidden` }, root);
      S.logo = C.reg(el('img', { src: '../assets/brand/logo_0.svg', style: `position:absolute;left:0;top:0;width:${LW}px;height:${LH}px` }, box), { y: 0 });
      S.logoH = LH;
      S.cap = label(root, 'mood stones  ·  eau de parfum', X + 4, 1440, { size: 36, color: INK });
    },
    run(t, b, S) {
      const R_ = TYPE.rise;
      R_(t, S.l1, 'end_l1', null, { stagger: 0.12 });
      R_(t, S.l2, 'end_l2', null, { stagger: 0.12 });
      R_(t, S.l3, 31.65, null);
      S.tags.forEach((g, i) => R_(t, g, 30.55 + i * 0.12, null, { preset: 'default' }));
      const y = S.logoH * 1.15 * (1 - spHit(t, 'logo', 'heavy'));
      put(S.logo, { y, hide: y >= S.logoH * 1.149 });
      R_(t, S.cap, 32.75, null, { preset: 'default', stagger: 0.05 });
    },
  });

  C.start();
  // footage cuts inside the window scene are hard cuts too: motion-blur sub-frames must not straddle them
  const shotCuts = [...REEL.slice(1).map((r) => bt(r.from))];
  window.CUTS = [...new Set([...(window.CUTS || []), ...shotCuts])].sort((a, b) => a - b);
  const ready0 = window.READY;
  window.READY = Promise.all([ready0, FOOT.ready]).then(() => { window.seek(0); return true; });
})();

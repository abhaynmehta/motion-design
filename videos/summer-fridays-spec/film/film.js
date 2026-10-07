// Summer Fridays · Lip Butter Balm — "nobody owns just one." A spec reel cut from the brand's own product films and
// product photos (summerfridays.com) to Mixkit's "Cherry on Top" (130 bpm). 9:16, 31.6 s, 68 beats.
// Story (the meme): me: "I only need one lip balm." → also me: fifteen tubes pop onto a shelf → 15 flavours, 0
// self-control → four gateway flavours (each tube squeezes its flavour into the frame) → the #1 lip brand* →
// a certified collector → pick your first → start with one (you won't stop at one) → Summer Fridays.
// New here: person mattes (text behind the subject, a sticker cut-out), product cut-outs from the site's photos.
(() => {
  const { W, H, bt, sp, spHit, seg, clamp, lerp, put, el, scene, trk, beatOf } = C;
  C.fonts = ['500 100px Display', '600 100px Display', '800 100px Display', 'italic 500 100px Display', '400 100px Script'];
  const X = 80;
  const BEIGE = '#EEEDEC', INK = '#000418', ROSE = '#B86373', WHITE = '#FFFFFF';
  const SOFT = '0 2px 20px rgba(0,4,24,0.35)';
  const POP = (k) => 0.3 + 0.7 * k;
  const R = (x, y, w, h) => ({ x, y, w, h });
  const lerpR = (a, b, k) => R(lerp(a.x, b.x, k), lerp(a.y, b.y, k), lerp(a.w, b.w, k), lerp(a.h, b.h, k));
  const FULL = R(0, 0, W, H);
  const line = (parent, text, x, y, size, o = {}) => TYPE.line(parent, text, { x, y, size, cls: o.cls || 'display', color: o.color, accent: o.accent });
  const tint = (L, color, shadow = false) => put(L.el, { css: { color, textShadow: shadow ? SOFT : 'none' } });
  const rand = C.mulberry32(7);

  // ------------------------------------------------------------------ the products (cut out of the site's photos)
  const ROW1 = ['vanilla', 'vanilla-beige', 'toasted-marshmallow', 'birthday-cake', 'strawberry-soft-serve', 'pink-sugar', 'pink-guava', 'poppy'];
  const ROW2 = ['cherry', 'sugar-plum', 'brown-sugar', 'mocha-bonbon', 'iced-coffee', 'hot-cocoa', 'sweet-mint'];
  const ALL = [...ROW1, ...ROW2];
  const IMG = {}, DOT = {};
  const loads = ALL.flatMap((f) => [['tube', IMG], ['dot', DOT]].map(([kind, store]) => new Promise((ok) => {
    const im = new Image(); im.onload = im.onerror = () => ok(); im.src = `../assets/cut/${f}_${kind}.png`; store[f] = im;
  })));
  const NAME = (f) => f.replace(/-/g, ' ');
  // shelf slots: two rows, tubes at 38 %
  const KS = 0.38, TH = 1100 * KS, SW = 101, GAP = 22;
  const SLOT = {};
  ROW1.forEach((f, i) => (SLOT[f] = { cx: 59 + SW / 2 + i * (SW + GAP), cy: 520 + TH / 2 }));
  ROW2.forEach((f, i) => (SLOT[f] = { cx: 120 + SW / 2 + i * (SW + GAP), cy: 980 + TH / 2 }));
  const ORDER = ALL.map((f) => [rand(), f]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);
  const POPAT = {}; ORDER.forEach((f, i) => (POPAT[f] = 8.5 + i * 0.5));
  const ROT = {}; ALL.forEach((f) => (ROT[f] = (rand() - 0.5) * 16));
  const WAVEAT = {}; ALL.forEach((f) => (WAVEAT[f] = 17 + (SLOT[f].cx / W) * 1.2));
  function tube(ctx, f, cx, cy, k, rot = 0, alpha = 1) {
    const im = IMG[f]; if (!im || !im.naturalWidth || k <= 0.005) return;
    const w = im.naturalWidth * k, h = im.naturalHeight * k;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(cx, cy); if (rot) ctx.rotate(rot * Math.PI / 180);
    ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
  }
  function dot(ctx, f, cx, cy, d) {
    const im = DOT[f]; if (!im || !im.naturalWidth || d <= 1) return;
    const k = d / Math.max(im.naturalWidth, im.naturalHeight);
    ctx.drawImage(im, cx - im.naturalWidth * k / 2, cy - im.naturalHeight * k / 2, im.naturalWidth * k, im.naturalHeight * k);
  }

  // ------------------------------------------------------------------ the four gateway flavours
  const HERO = { cx: 540, cy: 1060, k: 0.72 };
  const FLAV = [
    { f: 'strawberry-soft-serve', A: 20, a: 'strawberry', b: 'soft serve', tag: 'sheer baby pink', life: 'a hint of soft serve.', move: 'shelf' },
    { f: 'cherry', A: 26, a: 'cherry', b: '', tag: 'sheer cool red', life: 'a touch of sheer red.', move: 'whip' },
    { f: 'pink-guava', A: 32, a: 'pink', b: 'guava', tag: 'sheer bright pink', life: 'a hint of juicy guava.', move: 'rise' },
    { f: 'birthday-cake', A: 38, a: 'birthday', b: 'cake', tag: 'light pink shimmer', life: 'a hint of buttercream.', move: 'drop' },
  ];
  const heroRect = (f, cx, cy, k) => { const im = IMG[f]; const w = (im && im.naturalWidth ? im.naturalWidth : 265) * k, h = 1100 * k; return R(cx - w / 2, cy - h / 2, w, h); };

  // ------------------------------------------------------------------ the cut list
  const cut = (from, to, s, o = {}) => ({ from, to, s, t0: from, ...o });
  // texture films start past their dark shadow passes (f0)
  const REEL = [
    cut(-1, 8, 'sc_cone', { t0: 0, rate: 0.22, hold: 7.9, win: true }),   // ≤ frame 25: the source cuts to a close-up at 26 // slow motion, in the meme's square photo: sitting with a soft serve
    cut(20, 23, 'tx_ss', { f0: 12, zoom: 1.15, reveal: 0, fx: 0.7 }), cut(23, 24.5, 'sc_apply', { punch: 0.05 }), cut(24.5, 26, 'lp_ss', { punch: 0.04 }),
    cut(26, 29, 'tx_ch', { f0: 60, zoom: 1.15, reveal: 1, fx: 0.7 }), cut(29, 30.5, 'lp_ch', { punch: 0.05 }), cut(30.5, 32, 'lp_arm', { punch: 0.04 }),
    cut(32, 35, 'tx_pg', { f0: 30, zoom: 1.15, reveal: 2, fx: 0.7 }), cut(35, 38, 'lp_pg', { rate: 0.7, punch: 0.05 }),
    cut(38, 41, 'tx_bc', { zoom: 1.15, reveal: 3, fx: 0.7 }), cut(41, 42.5, 'ck', { punch: 0.05 }), cut(42.5, 44, 'lp_bc', { punch: 0.05 }),
    cut(44, 48, 'hook', { fx: 0.6 }),                                // the wide pink-tube shot: rock wall behind her for the #1
  ];
  const at = (b) => REEL.find((r) => b >= beatOf(r.from) && b < beatOf(r.to));
  const WIN = R(70, 470, 940, 940);                                 // the hook's photo
  const look = (e, t) => {
    let s = (1.05 - 0.05 * seg(t, e.from, e.to)) * (e.zoom || 1);
    if (e.punch) s *= 1 + e.punch * (1 - sp(t, e.from, 'snappy'));
    return e.win ? { s: s * (1 + 0.04 * (1 - sp(t, -0.3, 'heavy'))), r: WIN, round: 22 } : { s, dx: (0.5 - (e.fx ?? 0.5)) * 1920 };
  };
  // the hero tube of flavour i at time t: { cx, cy, k, rot, vis }
  function heroAt(i, t) {
    const F = FLAV[i], A = F.A;
    let cx = HERO.cx, cy = HERO.cy, k = HERO.k, rot = 0;
    const e = spHit(t, A, 'default');
    if (F.move === 'shelf') { const s = SLOT[F.f]; cx = lerp(s.cx, HERO.cx, e); cy = lerp(s.cy, HERO.cy, e); k = lerp(KS, HERO.k, e); }
    if (F.move === 'whip') { cx = lerp(1500, HERO.cx, spHit(t, A, 'snappy')); rot = 14 * (1 - spHit(t, A, 'snappy')); }
    if (F.move === 'rise') { cy = lerp(2600, HERO.cy, e); }
    if (F.move === 'drop') { cy = lerp(-700, HERO.cy, spHit(t, A, 'snappy')); k = HERO.k * POP(spHit(t, A, 'default')); }
    cy -= 2200 * sp(t, A + 2.75, 'snappy');                        // leaves upward before the lifestyle cut
    return { cx, cy, k, rot, vis: t >= bt(A - 0.6) && cy > -900 };
  }

  // ------------------------------------------------------------------ background
  scene({
    name: 'bg', from: 'hook', to: 'done',
    build(root, S) { S.base = C.reg(el('div', { class: 'fill' }, root)); },
    // a new style on every seek: the whole frame re-rasterises (determinism)
    run(t, b, S) {
      const c = b >= 48 && b < 52 ? ROSE : BEIGE;
      put(S.base, { css: { backgroundImage: `linear-gradient(${c}, ${c})`, backgroundPosition: `${Math.round(t * 1e4)}px 0px` } });
    },
  });

  // ------------------------------------------------------------------ footage
  scene({
    name: 'reel', from: 'hook', to: 'done',
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      const e = at(b); if (!e) return;
      if (e.reveal != null) {
        // the hero tube squeezes its flavour into the frame: a tube-shaped window grows to full frame
        const F = FLAV[e.reveal], h = heroAt(e.reveal, t), k = sp(t, F.A + 0.12, 'default');
        const prev = at(F.A - 0.01);
        if (t < bt(F.A + 0.12)) { if (prev) FOOT.draw(ctx, prev, t, look(prev, t)); return; }
        FOOT.draw(ctx, e, t, look(e, t));
        if (k < 0.999) {   // keep the new flavour only inside the growing tube shape, the previous shot behind it
          const r = lerpR(heroRect(F.f, h.cx, h.cy, h.k), FULL, k);
          ctx.save(); ctx.globalCompositeOperation = 'destination-in'; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, lerp(46, 0, k)); ctx.fill(); ctx.restore();
          if (prev) { ctx.save(); ctx.globalCompositeOperation = 'destination-over'; FOOT.draw(ctx, prev, t, look(prev, t)); ctx.restore(); }
        }
        return;
      }
      FOOT.draw(ctx, e, t, look(e, t));
    },
  });

  // ------------------------------------------------------------------ type that sits BEHIND the person
  scene({
    name: 'depth', from: 'hook', to: 48,
    build(root, S) {
      S.oneBox = el('div', { style: `position:absolute;left:${WIN.x}px;top:${WIN.y}px;width:${WIN.w}px;height:${WIN.h}px;overflow:hidden;border-radius:22px` }, root);
      S.one = line(S.oneBox, '1', 650, -10, 600, { cls: 'display heavy', color: WHITE });   // in the wall right of her head; her shoulder in front of its foot
      S.num = line(root, '#1', 528, 150, 450, { cls: 'display heavy', color: WHITE });
      S.strike = C.canvas(root);
    },
    run(t, b, S) {
      TYPE.rise(t, S.one, 'h_one', 7.6, { stagger: 0.1 });
      TYPE.rise(t, S.num, 44.35, 47.75, { stagger: 0.1 });
      // a hand-drawn strike through the "1" (in front of the type, behind the person)
      const ctx = S.strike; ctx.clearRect(0, 0, W, H);
      const k = clamp(seg(t, 'h_strike', 6.15)), out = sp(t, 7.6, 'snappy');
      if (k > 0 && out < 0.99) {
        ctx.save(); ctx.globalAlpha = 1 - out; ctx.strokeStyle = ROSE; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();
        const N = 40;
        for (let i = 0; i <= N * k; i++) { const u = i / N, x = 690 + u * 310, y = 770 - u * 180 + Math.sin(u * 7) * 10; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
        ctx.stroke(); ctx.restore();
      }
    },
  });

  // ------------------------------------------------------------------ the person, cut out, over the depth type
  scene({
    name: 'matte', from: 'hook', to: 52,
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      const e = at(b);
      if (e && (e.s === 'hook' || e.s === 'sc_cone')) FOOT.drawCut(ctx, e, t, look(e, t));
      if (b >= 48) {
        // the sticker: a freeze frame cut out with a white border, slapped onto the rose card
        const k = spHit(t, 'sticker', 'default'), s = POP(k) * 0.62, rot = -6 + 10 * (1 - k);
        if (k > 0.02) {
          ctx.save(); ctx.translate(540, 1270); ctx.rotate(rot * Math.PI / 180); ctx.scale(s, s); ctx.translate(-540, -960);
          FOOT.cutout(ctx, 'sc_apply', 30, { outline: true });
          ctx.restore();
        }
      }
    },
  });

  // ------------------------------------------------------------------ products: the shelf, heroes, dots, end row
  scene({
    name: 'products', from: 'shelf', to: 'done',
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      // the shelf (b8–b21)
      if (b < 21.5) {
        for (const f of ALL) {
          if (f === FLAV[0].f && b >= 19.6) continue;               // it becomes the first hero
          const p = spHit(t, POPAT[f], 'default'); if (p < 0.02) continue;
          const s = SLOT[f];
          const hop = -34 * (sp(t, WAVEAT[f], 'snappy') - sp(t, WAVEAT[f] + 0.4, 'default'));
          const away = 1400 * sp(t, 19.7 + (s.cx / W) * 0.3, 'snappy');
          const settled = p > 0.999 && Math.abs(hop) < 0.01 && away < 0.01;
          tube(ctx, f, s.cx, settled ? s.cy : s.cy - 90 * (1 - p) + hop + away, KS * POP(p), settled ? 0 : ROT[f] * (1 - p));
        }
      }
      // heroes (b19.6–b41)
      FLAV.forEach((F, i) => {
        if (b < F.A - 0.6 || b > F.A + 3.4) return;
        const h = heroAt(i, t); if (!h.vis) return;
        tube(ctx, F.f, h.cx, h.cy, h.k, h.rot);
      });
      // pick your first (b52–b64): fifteen swatch dots; at b56 all but one fall away; at b60 they bounce back
      if (b >= 52 && b < 64.3) {
        const D = 170, G = 30, x0 = (W - (5 * D + 4 * G)) / 2 + D / 2;
        ALL.forEach((f, i) => {
          const col = i % 5, row = Math.floor(i / 5), keep = f === 'pink-sugar';
          let cx = x0 + col * (D + G), cy = 700 + row * (D + G), d = D;
          const p = spHit(t, 52.25 + i * 0.2, 'default'); if (p < 0.02) return;
          d *= POP(p);
          if (keep) { const m = sp(t, 'one', 'default'); cx = lerp(cx, 540, m); cy = lerp(cy, 960, m); d = lerp(d, 420, m) * (1 - 0.6 * sp(t, 'wont', 'default')); }
          else {
            const fall = sp(t, 56 + (i % 7) * 0.06, 'snappy'), back = spHit(t, 60.3 + i * 0.1, 'default');
            cy += 1500 * fall * (1 - back);
            if (back > 0.02) { const j = i - (i > ALL.indexOf('pink-sugar') ? 1 : 0), ang = (j / 14) * Math.PI * 2 - Math.PI / 2, rr = 330; cx = lerp(cx, 540 + Math.cos(ang) * rr, back); cy = lerp(cy + 1500 * fall, 960 + Math.sin(ang) * rr * 1.25, back); d = lerp(d, 130, back); }
          }
          d *= 1 - sp(t, 63.7, 'snappy');
          dot(ctx, f, cx, cy, d);
        });
      }
      // end: the fifteen tubes in a row under the wordmark
      if (b >= 64) {
        const k2 = 0.2, w = 53, g = 10, x0 = (W - (15 * w + 14 * g)) / 2 + w / 2;
        ALL.forEach((f, i) => {
          const p = spHit(t, 64.6 + i * 0.08, 'default'); if (p < 0.02) return;
          tube(ctx, f, x0 + i * (w + g), p > 0.999 ? 1150 : 1150 + 120 * (1 - p), k2 * POP(p));
        });
      }
    },
  });

  // ------------------------------------------------------------------ words
  scene({
    name: 'words', from: 'hook', to: 'done',
    build(root, S) {
      S.me = line(root, 'me:', X, 222, 70, { cls: 'display semi', color: ROSE });
      S.need = line(root, 'i only need', X, 300, 110, { cls: 'display heavy', color: INK });
      S.lb = line(root, 'lip balm.', X, 1440, 110, { cls: 'display heavy', color: INK });
      S.also = line(root, 'also me:', X, 250, 108, { cls: 'display semi', color: INK });
      S.tick = ALL.map((f) => line(root, NAME(f), X + 4, 1470, 54, { cls: 'display caps', color: ROSE }));
      S.self1 = line(root, '15 flavours.', X, 1440, 84, { cls: 'display heavy', color: INK });
      S.self2 = line(root, '0 self-control.', X, 1540, 84, { cls: 'display heavy', color: ROSE });
      S.fl = FLAV.map((F) => ({
        a: line(root, F.a, X, 250, 150, { cls: 'display heavy', color: WHITE }),
        b: line(root, F.b, X, 400, 150, { cls: 'display heavy', color: WHITE }),
        tag: line(root, F.tag, X + 4, 1500, 46, { cls: 'display caps', color: WHITE }),
        // the lifestyle line sits on a rose caption chip (readable over any shot); the chip is built first, so it is under the words
        chip: C.reg(el('div', { style: `position:absolute;left:${X - 22}px;top:1364px;height:100px;width:0;background:${ROSE};border-radius:16px` }, root), { hide: true }),
        life: line(root, F.life, X, 1380, 64, { cls: 'display semi', color: WHITE }),
      }));
      S.the = line(root, 'the', X + 6, 250, 76, { cls: 'display semi', color: WHITE });
      S.brand = line(root, 'lip brand*', X, 1240, 124, { cls: 'display heavy', color: WHITE });
      S.foot = line(root, '*Source: YipitData brand-level ranking, US $ sales of prestige brands, Jan–Dec 2025', X + 4, 1420, 22, { cls: 'display', color: WHITE });
      S.cert1 = line(root, 'certified', X + 10, 250, 140, { cls: 'script', color: WHITE });
      S.cert2 = line(root, 'collector.', X, 420, 150, { cls: 'display heavy', color: WHITE });
      S.pick = line(root, 'pick your first.', X, 300, 110, { cls: 'display heavy', color: INK });
      S.start = line(root, 'start with one.', X, 300, 110, { cls: 'display heavy', color: INK });
      S.wont = line(root, "(you won't stop at one.)", X + 4, 1560, 62, { cls: 'display it', color: ROSE });
      S.lbb = line(root, 'lip butter balm', X, 560, 112, { cls: 'display heavy', color: INK });
      const LW = 900, LH = Math.round(LW * 65.6 / 862.7);
      const box = el('div', { style: `position:absolute;left:${(W - LW) / 2}px;top:790px;width:${LW}px;height:${LH + 6}px;overflow:hidden` }, root);
      S.logo = C.reg(el('img', { src: '../assets/brand/sf-logo-desktop.svg', style: `position:absolute;left:0;top:0;width:${LW}px;height:${LH}px` }, box), { y: 0 });
      S.logoH = LH + 6;
      S.info = line(root, '15 flavours  ·  $24', X + 4, 900, 46, { cls: 'display caps', color: ROSE });
    },
    run(t, b, S) {
      const R_ = TYPE.rise;
      for (const L of [S.the, S.brand, S.foot, ...S.fl.flatMap((x) => [x.a, x.b, x.tag])]) tint(L, WHITE, true);
      R_(t, S.me, -0.4, 7.6);
      R_(t, S.need, 0.35, 7.6, { stagger: 0.12 });
      R_(t, S.lb, 2.6, 7.6, { stagger: 0.12 });
      R_(t, S.also, 'shelf', 19.6, { stagger: 0.15 });
      // the flavour ticker: each name shows from its tube's pop to the next pop
      ORDER.forEach((f, i) => {
        const L = S.tick[ALL.indexOf(f)], a = POPAT[f], z = i < ORDER.length - 1 ? POPAT[ORDER[i + 1]] : 15.95;
        const on = b >= a - 0.1 && b < z - 0.05;
        L.words.forEach((w) => put(w, { y: 0, hide: !on }));
      });
      R_(t, S.self1, 'self', 19.6, { stagger: 0.12 });
      R_(t, S.self2, 16.5, 19.6, { stagger: 0.12 });
      S.fl.forEach((x, i) => {
        const A = FLAV[i].A;
        R_(t, x.a, A + 0.35, A + 2.7, { stagger: 0.1 });
        if (FLAV[i].b) R_(t, x.b, A + 0.6, A + 2.7, { stagger: 0.1 }); else x.b.words.forEach((w) => put(w, { hide: true }));
        R_(t, x.tag, A + 1.1, A + 2.7, { stagger: 0.06, preset: 'default' });
        // chip grows from its left edge, the words rise in after it starts and leave before it shrinks
        const k = spHit(t, A + 3.2, 'snappy') * (1 - sp(t, A + 5.72, 'snappy'));
        put(x.chip, { css: { width: `${((x.life.el.offsetWidth + 40) * Math.max(0, k)).toFixed(1)}px` }, hide: k < 0.01 });
        R_(t, x.life, A + 3.4, A + 5.6, { stagger: 0.08 });
      });
      R_(t, S.the, 44.2, 47.7);
      R_(t, S.brand, 44.9, 47.7, { stagger: 0.12 });
      R_(t, S.foot, 45.4, 47.7, { preset: 'default', stagger: 0.02 });
      R_(t, S.cert1, 48.4, 51.7, { stagger: 0.1 });
      R_(t, S.cert2, 48.8, 51.7, { stagger: 0.1 });
      R_(t, S.pick, 52.4, 55.7, { stagger: 0.12 });
      R_(t, S.start, 56.3, 63.7, { stagger: 0.12 });
      R_(t, S.wont, 'wont', 63.7, { stagger: 0.08 });
      R_(t, S.lbb, 'logo', null, { stagger: 0.12 });
      const y = S.logoH * 1.15 * (1 - spHit(t, 64.5, 'heavy'));
      put(S.logo, { y, hide: y >= S.logoH * 1.149 });
      R_(t, S.info, 65, null, { preset: 'default', stagger: 0.04 });
    },
  });

  C.start();
  const shotCuts = REEL.slice(1).map((r) => bt(r.from));
  window.CUTS = [...new Set([...(window.CUTS || []), ...shotCuts, bt(8), bt(48), bt(52)])].sort((a, b) => a - b);
  const ready0 = window.READY;
  window.READY = Promise.all([ready0, FOOT.ready, ...loads]).then(() => { window.seek(0); return true; });
})();

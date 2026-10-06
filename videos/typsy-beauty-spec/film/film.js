// Typsy Beauty · Spritz body & hair mists — "the dessert menu". A spec reel cut from the brand's own campaign films for
// Chocolate Fondant, Coconut Crumble and Strawberry Cheesecake (typsybeauty.com) to Mixkit's "Pop 05" (95 bpm). 9:16, 29.3 s.
// Story: you can't eat this… but you can wear it → tonight's dessert menu → each row opens into its dessert (what it smells
// like, its notes, the bottle) and folds back with a tick → the bill: 0 calories, 100% compliments, no sharing required →
// Spritz by Typsy, ₹799.
// Device: a café menu. Each dish's thumbnail opens to the full frame and folds back into its row; a blush highlight walks
// down the menu; a receipt prints the punchline.
(() => {
  const { W, H, bt, sp, spHit, seg, clamp, lerp, put, el, scene, trk, beatOf } = C;
  C.fonts = ['500 100px Display', '600 100px Display', 'italic 600 100px Display', '700 40px UI'];
  const X = 90;
  const PINK = '#E24298', PLUM = '#5A034B', BLUSH = '#FDC7CF', PAPER = '#FFF9FE', WHITE = '#FFFFFF';
  const SOFT = '0 2px 22px rgba(40,4,30,0.45)';
  const POP = (k) => 0.3 + 0.7 * k;
  const line = (parent, text, x, y, size, o = {}) => TYPE.line(parent, text, { x, y, size, cls: o.cls || 'display', color: o.color });
  const label = (parent, text, x, y, o = {}) => TYPE.line(parent, text, { x, y, size: o.size || 30, cls: 'ui caps', color: o.color || PINK });
  const tint = (L, color, shadow = false) => put(L.el, { css: { color, textShadow: shadow ? SOFT : 'none' } });
  const R = (x, y, w, h) => ({ x, y, w, h });
  const lerpR = (a, b, k) => R(lerp(a.x, b.x, k), lerp(a.y, b.y, k), lerp(a.w, b.w, k), lerp(a.h, b.h, k));
  const FULL = R(0, 0, W, H);

  // ------------------------------------------------------------------ the menu
  const ROWY = [660, 910, 1160];
  const THUMB = ROWY.map((y) => R(X, y, 170, 170));
  const DISH = [
    { name: 'chocolate fondant', desc: 'smells like a warm choco lava cake', a: 'chocolate', b: 'fondant', thumb: 'ch_pour',
      notes: 'cocoa · hazelnut · pistachio · milk mousse', A: 9, Cl: 16, tick: 16.5, pick: 8.25 },
    { name: 'coconut crumble', desc: 'smells like fresh coconut cream pie', a: 'coconut', b: 'crumble', thumb: 'co_nut',
      notes: 'coconut · peach · sandalwood · vanilla', A: 17.5, Cl: 24.5, tick: 25, pick: 16.75 },
    { name: 'strawberry cheesecake', desc: 'strawberries, whipped cream & honey', a: 'strawberry', b: 'cheesecake', thumb: 'st_berry',
      notes: 'strawberry · blackcurrant · jasmine · amber', A: 26, Cl: 33, tick: 33.4, pick: 25.25 },
  ];
  DISH.forEach((d) => (d.smell = d.desc));

  // ------------------------------------------------------------------ the cut list (what plays full frame / in the open dish)
  const cut = (from, to, s, o = {}) => ({ from, to, s, t0: from, ...o });
  const REEL = [
    cut(-1, 2, 'ch_pour', { t0: 0, rate: 0.8 }),                   // chocolate pouring over the bottle
    cut(2, 3, 'st_cake', { punch: 0.06 }),
    cut(3, 4, 'co_pipe', { punch: 0.06 }),
    cut(4, 5.25, 'ch_spritz', { rate: 0.85, punch: 0.05 }),         // "…but you can wear it."
    cut(5.25, 7.6, 'co_bliss', { rate: 0.5 }),
    // 01 chocolate fondant
    cut(9, 10.25, 'ch_bite'), cut(10.25, 11.25, 'ch_slice', { punch: 0.05 }), cut(11.25, 12.5, 'ch_lips', { punch: 0.05 }),
    cut(12.5, 14, 'ch_candle', { f0: 8, punch: 0.04 }), cut(14, 15.25, 'ch_drip', { punch: 0.05 }), cut(15.25, 17, 'ch_bottle'),
    // 02 coconut crumble
    cut(17.5, 18.75, 'co_turn'), cut(18.75, 19.75, 'co_nut', { punch: 0.05 }), cut(19.75, 21, 'co_smile', { punch: 0.04 }),
    cut(21, 22, 'co_bite', { punch: 0.05 }), cut(22, 23.25, 'co_oven', { punch: 0.04 }), cut(23.25, 25.5, 'co_bottle'),
    // 03 strawberry cheesecake
    cut(26, 27.25, 'st_picnic'), cut(27.25, 28.25, 'st_berry', { punch: 0.05 }), cut(28.25, 29.5, 'st_kiss', { punch: 0.05 }),
    cut(29.5, 30.5, 'st_cake', { punch: 0.05 }), cut(30.5, 31.5, 'st_basket', { punch: 0.04 }), cut(31.5, 34, 'st_bottle'),
  ];
  const FX = { co_smile: 0.6 };
  const pingpong = (k, t, rate = 0.5) => {
    const n = FOOT.SH[k].n - 1, u = Math.round(t * C.FPS) / C.FPS * FOOT.SH[k].fps * rate, m = u % (2 * n);
    return m <= n ? m : 2 * n - m;
  };

  scene({
    name: 'menu', from: 'menu', to: 34.6,
    build(root, S) {
      S.page = C.reg(el('div', { class: 'fill', style: `background:${PAPER}` }, root), { y: 0 });
      const P = S.page;
      S.hi = C.reg(el('div', { style: `position:absolute;left:66px;top:0;width:948px;height:214px;border-radius:30px;background:${BLUSH}` }, P), { hide: true });
      S.kick = label(P, "tonight's", X + 4, 300, { size: 38, color: PINK });
      S.head = line(P, 'dessert menu', X, 350, 132, { color: PLUM });
      S.sub = label(P, 'spritz body & hair mists', X + 4, 520, { size: 34, color: PLUM });
      S.rows = DISH.map((d, i) => ({
        n: line(P, d.name, X + 206, ROWY[i] + 16, 62, { color: PLUM }),
        d: line(P, d.desc, X + 208, ROWY[i] + 100, 36, { cls: 'ui', color: '#8B4E7E' }),
        tick: C.reg(el('div', { style: `position:absolute;left:940px;top:${ROWY[i] + 112}px;width:56px;height:56px;border-radius:28px;background:${PINK};color:#fff;font:700 34px UI;display:flex;align-items:center;justify-content:center;transform-origin:28px 28px` }, P, '✓'), { hide: true }),
      }));
      S.foot = label(P, '₹799 each', X + 4, 1410, { size: 38, color: PINK });
    },
    run(t, b, S) {
      const R_ = TYPE.rise;
      put(S.page, { y: -H * sp(t, 'bill', 'default') });           // the page lifts away for the bill
      R_(t, S.kick, 6.75, null, { preset: 'default' });
      R_(t, S.head, 6.85, null, { stagger: 0.12 });
      R_(t, S.sub, 7.1, null, { preset: 'default', stagger: 0.05 });
      S.rows.forEach((r, i) => {
        R_(t, r.n, 7 + i * 0.25, null, { stagger: 0.08, preset: 'default' });
        R_(t, r.d, 7.12 + i * 0.25, null, { stagger: 0.03, preset: 'default' });
        const k = spHit(t, DISH[i].tick, 'snappy');
        put(r.tick, { hide: k < 0.02, s: Math.round(POP(k) * 1000) / 1000 });
      });
      R_(t, S.foot, 'foot', null, { preset: 'default' });
      // the blush highlight walks down the menu: one spring per move
      const y = trk(t, DISH.map((d, i) => [d.pick, ROWY[i] - 22]), 'default');
      const w = spHit(t, 'i1', 'snappy');
      put(S.hi, { hide: w < 0.01, y: Math.round(y * 100) / 100, clip: `inset(0 ${(100 * (1 - w)).toFixed(2)}% 0 0 round 30px)` });
    },
  });

  // ------------------------------------------------------------------ the picture: full-frame hook, thumbnails, open dishes
  scene({
    name: 'reel', from: 'hook', to: 34.6,
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      const e = REEL.find((r) => b >= beatOf(r.from) && b < beatOf(r.to));
      const lift = -H * sp(t, 'bill', 'default');
      const look = (en, r, open = 1) => {
        let s = 1.05 - 0.05 * seg(t, en.from, en.to);
        if (en.punch) s *= 1 + en.punch * (1 - sp(t, en.from, 'snappy'));
        return { r, s, dx: open * (0.5 - (FX[en.s] ?? 0.5)) * 1920 };
      };
      // hook: full frame, then it slides up off the menu
      if (b < 7.6 && e) {
        const y = -H * sp(t, 'menu', 'default');
        if (y > -H + 1) FOOT.draw(ctx, e, t, look(e, R(0, Math.round(y * 100) / 100, W, H)));
      }
      if (b < 6.6) return;
      // thumbnails, then the open one on top
      const opens = DISH.map((d) => clamp(trk(t, [[0, 0], [d.A, 1], [d.Cl, 0]], 'default'), 0, 1.02));
      const order = [0, 1, 2].sort((i, j) => opens[i] - opens[j]);
      for (const i of order) {
        const d = DISH[i], k = spHit(t, 7 + i * 0.25, 'default');
        if (k < 0.02) continue;
        const o = Math.min(1, opens[i]);
        const th = { ...THUMB[i], y: THUMB[i].y + lift };
        let r = lerpR(th, FULL, o);
        if (o < 0.001) r = R(th.x + th.w * (1 - POP(k)) / 2, th.y + th.h * (1 - POP(k)) / 2, th.w * POP(k), th.h * POP(k));
        const round = lerp(28, 0, o) * (o < 0.001 ? POP(k) : 1);
        const live = b >= d.A && b < d.Cl + 1 && e;                // inside its own act: the act's cut list
        if (live) FOOT.draw(ctx, e, t, { ...look(e, r, o), round });
        else FOOT.paint(ctx, d.thumb, pingpong(d.thumb, t), { r, round });
      }
    },
  });

  // ------------------------------------------------------------------ words over the picture
  scene({
    name: 'words', from: 'hook', to: 34,
    build(root, S) {
      const big = (text, y, it = false) => line(root, text, X, y, 150, { cls: it ? 'display it' : 'display', color: WHITE });
      S.h1 = big("you can't", 1060); S.h2 = big('eat this…', 1222);
      S.mark = C.reg(el('div', { style: `position:absolute;left:${X - 14}px;top:1236px;width:640px;height:168px;border-radius:18px;background:${PINK}` }, root), { hide: true });
      S.h3 = big('…but you can', 1060); S.h4 = big('wear it.', 1222, true);
      S.acts = DISH.map((d) => ({
        a: line(root, d.a, X, 1030, 136, { color: WHITE }),
        b: line(root, d.b, X, 1176, 136, { cls: 'display it', color: WHITE }),
        s: line(root, d.smell, X + 2, 1346, 50, { cls: 'display med', color: WHITE }),
        n: label(root, d.notes, X + 4, 1430, { size: 30, color: WHITE }),
      }));
    },
    run(t, b, S) {
      const R_ = TYPE.rise;
      for (const L of [S.h1, S.h2, S.h3]) tint(L, WHITE, true);
      R_(t, S.h1, -0.4, 3.7, { stagger: 0.1 });
      R_(t, S.h2, 'h_eat', 3.7, { stagger: 0.1 });
      R_(t, S.h3, 'wear', 6.25, { stagger: 0.1 });
      R_(t, S.h4, 'wear_it', 6.25, { stagger: 0.1 });
      // the pink marker wipes in behind "wear it." and leaves with it
      const m = spHit(t, 4.45, 'snappy') - sp(t, 6.05, 'snappy');   // leaves just before its words
      put(S.mark, { hide: m < 0.005, clip: `inset(0 ${(100 * (1 - clamp(m))).toFixed(2)}% 0 0 round 18px)` });
      S.acts.forEach((A, i) => {
        const d = DISH[i];
        for (const L of [A.a, A.b, A.s, A.n]) tint(L, WHITE, true);
        R_(t, A.a, d.A + 0.5, d.A + 5.9, { stagger: 0.1 });
        R_(t, A.b, d.A + 0.8, d.A + 5.9, { stagger: 0.1 });
        R_(t, A.s, d.A + 1.75, d.A + 5.9, { stagger: 0.05, preset: 'default' });
        R_(t, A.n, d.A + 2.75, d.A + 5.9, { stagger: 0.03, preset: 'default' });
      });
    },
  });

  // ------------------------------------------------------------------ the bill
  const BILL = [
    ['3 desserts', '₹799 each', 'b1'], ['calories', '0', 'b2'], ['compliments', '100%', 'b3'], ['sugar crash', 'none', 'b4'],
  ];
  scene({
    name: 'bill', from: 33.85, to: 'done',
    build(root, S) {
      S.bg = C.reg(el('div', { class: 'fill', style: `background:${PINK}` }, root));
      S.card = C.reg(el('div', { style: `position:absolute;left:150px;top:400px;width:780px;height:1010px;background:#FFFDF9;clip-path:polygon(${zig(780, 1010)})` }, root), { y: 0 });
      const c = S.card;
      S.t1 = line(c, 'typsy dessert bar', 64, 70, 58, { color: PLUM });
      S.t2 = label(c, 'table for one · tonight', 68, 160, { size: 26, color: '#8B4E7E' });
      el('div', { style: `position:absolute;left:64px;top:230px;width:652px;border-top:4px dashed ${BLUSH}` }, c);
      S.rows = BILL.map(([l, v], i) => {
        const y = 290 + i * 100;
        const L = el('div', { class: 'ui caps', style: `position:absolute;left:64px;top:${y}px;font-size:40px;color:${PLUM}` }, c, '');
        const V = el('div', { class: 'ui caps', style: `position:absolute;right:64px;top:${y}px;font-size:40px;color:${PLUM};text-align:right` }, c, '');
        return { L: C.reg(L), V: C.reg(V) };
      });
      el('div', { style: `position:absolute;left:64px;top:700px;width:652px;border-top:4px dashed ${BLUSH}` }, c);
      S.punch = line(c, 'no sharing required.', 60, 760, 66, { cls: 'display it', color: PINK });
      S.thanks = label(c, 'thank you, come again', 66, 880, { size: 26, color: '#8B4E7E' });
      // end: the Typsy logo, white on the brand pink
      const LW = 760, LH = Math.round(LW * 163 / 683);
      const box = el('div', { style: `position:absolute;left:${X}px;top:560px;width:${LW}px;height:${LH + 10}px;overflow:hidden` }, root);
      S.logo = C.reg(el('img', { src: '../assets/brand/typsy-logo-pink-crop.png', style: `position:absolute;left:0;top:0;width:${LW}px;height:${LH}px;filter:brightness(0) invert(1)` }, box), { y: 0 });
      S.logoH = LH + 10;
      S.e1 = line(root, 'spritz body & hair mists', X, 800, 70, { color: WHITE });
      S.e2 = label(root, '₹799 each · born from the pout polish balms', X + 4, 910, { size: 30, color: WHITE });
      // the three bottles, served like the menu's dishes
      S.ctx = C.canvas(root);
      S.tags = ['chocolate', 'coconut', 'strawberry'].map((n, i) => label(root, n, X + i * 330 + 4, 1340, { size: 28, color: WHITE }));
    },
    run(t, b, S) {
      const R_ = TYPE.rise;
      const k = sp(t, 'bill', 'default');
      put(S.bg, { clip: `inset(${(100 * (1 - k)).toFixed(2)}% 0 0 0)`, hide: k < 0.002 });
      const up = 1500 * (1 - spHit(t, 34.1, 'default')) - 1500 * sp(t, 'end', 'snappy');
      put(S.card, { y: Math.round(up * 100) / 100, hide: Math.abs(up) > 1499 });
      R_(t, S.t1, 34.4, null, { stagger: 0.08 });
      R_(t, S.t2, 34.6, null, { preset: 'default', stagger: 0.04 });
      BILL.forEach(([l, v, at], i) => {
        TYPE.type(t, S.rows[i].L, l, at, beatOf(at) + 0.4);
        TYPE.type(t, S.rows[i].V, v, beatOf(at) + 0.42, beatOf(at) + 0.62);
      });
      R_(t, S.punch, 'punch', null, { stagger: 0.12, preset: 'default' });
      R_(t, S.thanks, 38.2, null, { preset: 'default', stagger: 0.04 });
      const y = S.logoH * 1.15 * (1 - spHit(t, 'logo', 'heavy'));
      put(S.logo, { y, hide: y >= S.logoH * 1.149 });
      R_(t, S.e1, 'tag', null, { stagger: 0.08 });
      R_(t, S.e2, 41.3, null, { preset: 'default', stagger: 0.03 });
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ['ch_bottle', 'co_bottle', 'st_bottle'].forEach((k, i) => {
        const p = spHit(t, 41.4 + i * 0.2, 'default');
        R_(t, S.tags[i], 41.6 + i * 0.2, null, { preset: 'default', stagger: 0.03 });
        if (p < 0.02) return;
        const s = POP(p), x = X + i * 330, y = 1010, w = 240;
        const r = R(x + w * (1 - s) / 2, y + w * (1 - s) / 2, w * s, w * s);
        FOOT.paint(ctx, k, pingpong(k, t, 0.4), { r, round: 30 * s });
      });
    },
  });
  // a receipt's torn bottom edge
  function zig(w, h) {
    const pts = ['0px 0px', `${w}px 0px`, `${w}px ${h - 20}px`];
    const n = 26;
    for (let i = n; i >= 0; i--) pts.push(`${(w * i / n).toFixed(1)}px ${i % 2 ? h : h - 20}px`);
    return pts.join(',');
  }

  C.start();
  const shotCuts = REEL.slice(1).map((r) => bt(r.from)).concat(DISH.map((d) => bt(d.Cl + 1)));
  window.CUTS = [...new Set([...(window.CUTS || []), ...shotCuts])].sort((a, b) => a - b);
  const ready0 = window.READY;
  window.READY = Promise.all([ready0, FOOT.ready]).then(() => { window.seek(0); return true; });
})();

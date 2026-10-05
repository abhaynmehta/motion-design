// Stock Market 101 · EP 02 · "What are Sensex & Nifty?" — a 34.3 s Reel on a 98 bpm grid (guide: Mixkit "Hip Hop Two").
// Bait-and-switch hook: the family WhatsApp-style group panics ("🚨 SENSEX CRASHED 800 POINTS 🚨 SELL EVERYTHING"), Papa asks
// "Beta… what is Sensex?", the record scratches to a stop and a Ravi Varma painting plays "the whole family right now".
// Then a 25-second countdown explains it with cricket: Sensex = a team of 30 big companies (BSE), Nifty = a team of 50 (NSE),
// every player scores every day, the scores make one number; "down 800" is only about 1% → meme (Munch's Scream vs Ravi
// Varma's Lady in the Moonlight) → 1979: 100, today 72,000+ (stonks) → recap → Done. → "Sharma Uncle left the group".
// Paintings are public domain (Wikimedia Commons; see assets/art/CREDITS.md). Emoji: Noto Color Emoji subset (OFL).
(() => {
  const { W, H, bt, sp, spHit, seg, clamp, lerp, put, el, scene } = C;
  C.fonts = ['900 100px Display', '200 100px Display', '600 100px Display', '700 40px Mono', '800 40px Mono', '800 40px Rupee', '400 40px Emoji'];
  const X = 90;
  const INK = '#0B0D10', PAPER = '#F2EEE6', WHITE = '#F7F7F5', GREY = '#8B9099', UP = '#16E07A', DOWN = '#F2524A', UPINK = '#0B8F4F';
  const line = (p, text, x, y, size, cls, color = WHITE) => TYPE.line(p, text, { x, y, size, cls: `display ${cls}`, color });
  const mono = (p, text, x, y, size, color = WHITE, extra = '') => TYPE.line(p, text, { x, y, size, cls: `mono ${extra}`, color });
  const R = (t, L, a, b, o) => TYPE.rise(t, L, a, b, o);
  const tri = (up, size, color, hollow = false) => el('div', { style: `position:absolute;width:${size}px;height:${size * 0.86}px;${hollow ? '' : `background:${color};`}clip-path:polygon(${up ? '50% 0, 100% 100%, 0 100%' : '0 0, 100% 0, 50% 100%'})` });
  const maskBox = (p, x, y, w, h, child) => { const b = el('div', { style: `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:hidden` }, p); b.appendChild(child); C.reg(child, { y: 0 }); return { b, child, h }; };
  const rise1 = (t, m, a, out = null, preset = 'snappy') => { let y = m.h * 1.15 * (1 - spHit(t, a, preset)); if (out != null) y -= m.h * 1.15 * sp(t, out, 'snappy'); put(m.child, { y, hide: Math.abs(y) >= m.h * 1.149 }); };
  const popIn = (t, e, at, out = null, preset = 'snappy') => { const k = spHit(t, at, preset), o = out == null ? 0 : sp(t, out, 'snappy'); put(e, { hide: k < 0.01 || o > 0.99, s: Math.max(0.001, k * (1 - o)) }); };

  // ------------------------------------------------------------------ background
  scene({
    name: 'bg', from: 'hook', to: 'end',
    build(root) {
      el('div', { class: 'fill', style: `background:${INK}` }, root);
      el('div', { class: 'fill', style: 'background-image:linear-gradient(rgba(255,255,255,0.045) 2px, transparent 2px),linear-gradient(90deg, rgba(255,255,255,0.045) 2px, transparent 2px);background-size:120px 120px;background-position:90px 60px' }, root);
    },
  });

  // ------------------------------------------------------------------ the family group (hook b0–b7, callback b49–b56)
  function chatHeader(root) {
    const h = C.reg(el('div', { style: `position:absolute;left:0;top:250px;width:${W}px;height:120px;border-bottom:2px solid rgba(139,144,153,0.25)` }, root));
    el('div', { style: `position:absolute;left:${X}px;top:16px;width:84px;height:84px;border-radius:50%;background:#1C2026;display:flex;align-items:center;justify-content:center;font:60px Emoji` }, h, '👨‍👩‍👧‍👦');
    el('div', { style: `position:absolute;left:${X + 110}px;top:14px;font:700 46px Display, Emoji;color:${WHITE}` }, h, 'Family Group');
    el('div', { style: `position:absolute;left:${X + 112}px;top:70px;font:700 24px Mono, Emoji;color:${GREY};letter-spacing:0.02em` }, h, 'Sharma Uncle, Mummy, Papa, You');
    return h;
  }
  // a chat bubble: sender label + body html; { x, y, w } in px; returns the registered element (scale from its top-left)
  function bubble(root, { y, w, who, body, time, fwd, sys }) {
    if (sys) {
      const s = el('div', { class: 'pill', style: `left:${(W - w) / 2}px;top:${y}px;width:${w}px;height:96px;background:#1C2026;color:${WHITE};font:700 40px Mono, Emoji;letter-spacing:0.01em;transform-origin:50% 50%` }, root, body);
      return C.reg(s, { hide: true });
    }
    const b = el('div', { style: `position:absolute;left:${X}px;top:${y}px;width:${w}px;box-sizing:border-box;padding:22px 34px 18px;background:${PAPER};border-radius:12px 40px 40px 40px;color:${INK};transform-origin:0 0;box-shadow:0 30px 60px -30px rgba(0,0,0,0.6)` }, root);
    el('div', { style: `font:800 26px Mono, Emoji;letter-spacing:0.06em;text-transform:uppercase;color:${UPINK};margin-bottom:8px` }, b, who);
    if (fwd) el('div', { style: `font:italic 600 24px Display, Emoji;color:${GREY};margin:-2px 0 6px` }, b, '↪ Forwarded 1,000 times');
    el('div', {}, b, body);
    el('div', { style: `font:700 22px Mono, Emoji;color:${GREY};text-align:right;margin-top:6px` }, b, time);
    return C.reg(b, { hide: true });
  }
  const bubbleIn = (t, e, at, out = null) => { const k = spHit(t, at, 'snappy'), o = out == null ? 0 : sp(t, out, 'default'); put(e, { hide: k < 0.01 || o > 0.99, s: Math.max(0.001, k), y: -1400 * o, o: 1 }); };

  scene({
    name: 'chat', from: 'hook', to: 7.8,
    build(root, S) {
      S.wrap = C.reg(el('div', { class: 'fill', style: 'transform-origin:50% 40%' }, root));
      S.head = chatHeader(S.wrap);
      const clip = el('div', { class: 'fill', style: 'clip-path:inset(372px 0 0 0)' }, S.wrap);
      S.list = C.reg(el('div', { class: 'fill' }, clip));             // scrolls up as messages arrive
      S.b1 = bubble(S.list, { y: 420, w: 900, who: 'Sharma Uncle', time: '7:02 am',
        body: `<div style="font:900 132px Display, Emoji;font-stretch:62%;line-height:0.93;text-transform:uppercase">🚨 Sensex<br><span style="color:${DOWN}">crashed</span><br>800 points 🚨</div>` });
      S.b2 = bubble(S.list, { y: 930, w: 900, who: 'Sharma Uncle', time: '7:02 am', fwd: true,
        body: `<div style="font:900 96px Display, Emoji;font-stretch:62%;line-height:0.95;text-transform:uppercase">Sell everything<br>now!!! 😭</div>` });
      S.b3 = bubble(S.list, { y: 1275, w: 500, who: 'Mummy', time: '7:03 am', body: '<div style="font:110px Emoji;line-height:1.05;white-space:nowrap">😱😱😱</div>' });
      S.b4 = bubble(S.list, { y: 1520, w: 880, who: 'Papa', time: '7:05 am', body: `<div style="font:600 64px Display, Emoji;line-height:1.1;white-space:nowrap">Beta… what is Sensex? 🤔</div>` });
      S.dim = C.reg(el('div', { class: 'fill', style: `background:${INK}` }), { hide: true }); root.appendChild(S.dim);
      S.cap = line(root, 'The whole family right now:', X + 4, 470, 54, 'wide');
      S.cap.el.style.fontWeight = 600; S.cap.el.style.textShadow = '0 6px 30px rgba(0,0,0,0.8)';
      S.card = C.reg(el('div', { style: `position:absolute;left:140px;top:580px;width:800px;height:735px;background:#FFFFFF;padding:16px;box-sizing:content-box;box-shadow:0 40px 90px -30px rgba(0,0,0,0.8);transform-origin:50% 50%` }, root), { hide: true });
      const frame = el('div', { style: 'width:800px;height:735px;overflow:hidden' }, S.card);
      S.img = el('img', { src: '../assets/art/expectation_card.jpg', style: 'display:block;width:800px;height:735px;object-fit:cover;transform-origin:50% 40%' }, frame); C.reg(S.img);
      el('div', { style: `position:absolute;left:16px;bottom:-56px;font:700 22px Mono, Emoji;color:${GREY};letter-spacing:0.04em` }, S.card, 'Raja Ravi Varma, “Expectation” (public domain)');
    },
    run(t, b, S) {
      // messages land one by one; the record scratch freezes the group and pushes in on it
      put(S.list, { y: -C.trk(t, [[0, 0], [2.85, 230, 'snappy'], [3.85, 470, 'snappy']]) });
      bubbleIn(t, S.b1, 'hook'); bubbleIn(t, S.b2, 'msg2'); bubbleIn(t, S.b3, 'msg3'); bubbleIn(t, S.b4, 'msg4');
      const punch = spHit(t, 'scratch', 'snappy'), fly = sp(t, 'fix', 'snappy');
      put(S.wrap, { s: 1 + 0.08 * punch, y: -1500 * fly, hide: fly > 0.99 });
      put(S.dim, { hide: b < 5, o: 0.72 * clamp(spHit(t, 'scratch', 'snappy')) * (1 - fly) });
      R(t, S.cap, 5.2, 6.7, { stagger: 0.05 });
      const k = spHit(t, 'family', 'default');
      put(S.card, { hide: b < 5.2 || fly > 0.99, y: 1100 * (1 - k) - 1500 * fly, r: -2.5 * k });
      put(S.img, { s: 1 + 0.06 * seg(t, 'family', 'fix') });
    },
  });

  // ------------------------------------------------------------------ b7–b12 "Let's fix that. in 25 seconds." → "Think cricket. 🏏"
  scene({
    name: 'fix', from: 'fix', to: 12.2,
    build(root, S) {
      S.a = line(root, 'Let’s fix', X, 500, 230, 'cond'); S.a2 = line(root, 'that.', X, 720, 230, 'cond');
      S.b = line(root, 'in 25 seconds.', X + 4, 970, 76, 'wide hair', UP);
      S.c = line(root, 'Think of it like', X + 4, 570, 80, 'wide hair');
      S.d = line(root, 'cricket. 🏏', X, 670, 190, 'cond', UP);
    },
    run(t, b, S) {
      R(t, S.a, 7.3, 9.0, { preset: 'snappy' }); R(t, S.a2, 7.5, 9.0, { preset: 'snappy' }); R(t, S.b, 7.8, 9.0, { stagger: 0.06 });
      R(t, S.c, 9.3, 11.8); R(t, S.d, 'cricket', 11.8, { preset: 'snappy' });
    },
  });

  // ------------------------------------------------------------------ b12–b27 the teams → every player scores → one number
  const JERSEY = 'M30 8 L14 15 L2 36 L18 46 L23 39 L23 96 L77 96 L77 39 L82 46 L98 36 L86 15 L70 8 Q50 24 30 8 Z';
  const rj = C.mulberry32(202), UPS = Array.from({ length: 50 }, () => rj() < 0.6);
  const SLOT30 = (i) => ({ x: X + 15 + (i % 6) * 150, y: 930 + Math.floor(i / 6) * 120, s: 1 });            // 6 × 5, 120 px jerseys
  const SLOT50 = (i) => ({ x: X + 4 + (i % 10) * 90, y: 950 + Math.floor(i / 10) * 100, s: 0.7 });          // 10 × 5
  const BOARD = { x: X, y: 1060, w: 900, h: 400 };
  scene({
    name: 'teams', from: 11.9, to: 'meme',
    build(root, S) {
      S.sx = line(root, 'Sensex', X, 440, 250, 'cond');
      S.sxd = line(root, 'is a team of 30 of India’s', X + 4, 690, 54, 'wide hair'); S.sxe = line(root, 'biggest companies.', X + 4, 752, 54, 'wide hair');
      S.nf = line(root, 'Nifty', X, 440, 250, 'cond', UP);
      S.nfd = line(root, 'is a bigger team', X + 4, 690, 54, 'wide hair'); S.nfe = line(root, 'of 50 big companies.', X + 4, 752, 54, 'wide hair');
      const chip = (txt) => { const c = el('div', { class: 'pill', style: `left:0;top:0;height:76px;padding:0 30px;background:${UP};color:${INK};font:800 40px Mono` }, null, txt); return c; };
      S.bse = maskBox(root, 880, 548, 170, 84, chip('BSE')); S.nse = maskBox(root, 760, 548, 170, 84, chip('NSE'));
      S.ev1 = line(root, 'Every day, each company', X + 4, 470, 60, 'wide hair'); S.ev2 = line(root, 'goes up or down.', X, 545, 132, 'cond');
      S.al1 = line(root, 'Add up the whole team →', X + 4, 470, 60, 'wide hair'); S.al2 = line(root, 'one score.', X, 545, 176, 'cond', UP);
      S.dn1 = line(root, 'Sensex down 800?', X, 470, 128, 'cond');
      S.dn2 = line(root, 'That’s only about', X + 4, 680, 60, 'wide hair'); S.dn3 = line(root, '1%.', X, 750, 260, 'cond', UP);
      // 50 jerseys: the first 30 are Team Sensex, all 50 are Team Nifty
      S.js = Array.from({ length: 50 }, (_, i) => {
        const d = el('div', { style: `position:absolute;left:0;top:0;width:120px;height:120px;transform-origin:50% 50%` }, root);
        d.innerHTML = `<svg viewBox="0 0 100 100" width="120" height="120"><path d="${JERSEY}" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><text x="50" y="76" text-anchor="middle" font-family="Mono" font-weight="800" font-size="30" fill="${INK}">${i + 1}</text></svg>`;
        const badge = el('div', { style: `position:absolute;left:74px;top:-6px;width:46px;height:46px;border-radius:50%;background:${INK};transform-origin:50% 50%` }, d);
        const tr = tri(UPS[i], 26, UPS[i] ? UP : DOWN); tr.style.left = '10px'; tr.style.top = UPS[i] ? '9px' : '12px'; badge.appendChild(tr);
        if (!UPS[i]) { const hole = tri(false, 12, INK); hole.style.left = '17px'; hole.style.top = '15px'; badge.appendChild(hole); }   // down = hollow
        return { d: C.reg(d, { hide: true }), badge: C.reg(badge, { hide: true }) };
      });
      // the scoreboard
      S.board = C.reg(el('div', { style: `position:absolute;left:${BOARD.x}px;top:${BOARD.y}px;width:${BOARD.w}px;height:${BOARD.h}px;border-radius:30px;background:#14181D;border:3px solid #2A2F37;transform-origin:50% 0` }, root), { hide: true });
      const row = (y, name, color) => {
        el('div', { style: `position:absolute;left:44px;top:${y + 26}px;font:800 34px Mono, Emoji;letter-spacing:0.14em;color:${color}` }, S.board, name);
        return el('div', { style: `position:absolute;right:44px;top:${y}px;font:800 104px Mono, Emoji;color:${WHITE};font-variant-numeric:tabular-nums` }, S.board, '0');
      };
      S.vSx = C.reg(row(48, 'SENSEX', WHITE)); S.vNf = C.reg(row(210, 'NIFTY', UP));
      el('div', { style: `position:absolute;left:44px;top:178px;width:812px;height:2px;background:#2A2F37` }, S.board);
      S.chg = C.reg(el('div', { style: `position:absolute;left:44px;top:120px;font:800 30px Mono, Emoji;color:${DOWN}` }, S.board, '▼ 800 (−1.1%)'), { hide: true });
    },
    run(t, b, S) {
      R(t, S.sx, 11.95, 16.15, { preset: 'snappy' }); R(t, S.sxd, 12.3, 16.15, { stagger: 0.05 }); R(t, S.sxe, 12.45, 16.15, { stagger: 0.05 });
      rise1(t, S.bse, 12.2, 16.1);
      R(t, S.nf, 16.55, 20.65, { preset: 'snappy' }); R(t, S.nfd, 16.9, 20.65, { stagger: 0.05 }); R(t, S.nfe, 17.05, 20.65, { stagger: 0.05 });
      rise1(t, S.nse, 16.8, 20.6);
      R(t, S.ev1, 'scores', 23.65); R(t, S.ev2, 21.15, 23.65, { preset: 'snappy' });
      R(t, S.al1, 'onenum', 26.65); R(t, S.al2, 24.15, 26.65, { preset: 'snappy' });
      R(t, S.dn1, 'down', 30.65, { preset: 'snappy' }); R(t, S.dn2, 'onepct', 30.65, { stagger: 0.05 }); R(t, S.dn3, 28.7, 30.65, { preset: 'snappy' });
      // jerseys: 30 pop in a 6×5 grid; on "nifty" they move into a 10×5 grid and 20 more join; scores pop; then all fly into the board
      const toNifty = spHit(t, 16.6, 'default'), gather = sp(t, 24.0, 'default');
      S.js.forEach((J, i) => {
        const a = SLOT30(Math.min(i, 29)), z = SLOT50(i);
        const k = i < 30 ? spHit(t, 12.3 + i * 0.045, 'snappy') : spHit(t, 16.8 + (i - 30) * 0.06, 'snappy');
        let x = i < 30 ? lerp(a.x, z.x, toNifty) : z.x, y = i < 30 ? lerp(a.y, z.y, toNifty) : z.y, s = (i < 30 ? lerp(a.s, z.s, toNifty) : z.s) * k;
        // gather: every jersey flies into the scoreboard's centre and vanishes
        const gx = BOARD.x + BOARD.w / 2 - 60, gy = BOARD.y + 120;
        const g = clamp(gather * 1.15 - (i % 10) * 0.012);
        x = lerp(x, gx, g); y = lerp(y, gy, g); s *= 1 - 0.9 * g;
        put(J.d, { hide: k < 0.01 || g > 0.97, x, y, s: Math.max(0.001, s) });
        const bk = spHit(t, 21.3 + (i % 25) * 0.05, 'snappy');
        put(J.badge, { hide: b < 21.1 || bk < 0.01, s: Math.max(0.001, bk) });
      });
      // the scoreboard: values roll up when the scores land; Sensex ticks down 800 on "down"
      const bin = spHit(t, 24.15, 'default'), bout = sp(t, 30.6, 'snappy');
      put(S.board, { hide: b < 23.9 || bout > 0.99, sy: Math.max(0.001, bin), y: 0, o: 1, css: {} });
      const roll = clamp(sp(t, 24.8, 'heavy') / 0.995), dn = clamp(seg(t, 27.1, 28));
      const sx = Math.round(72382 * roll - 800 * dn), nf = Math.round(22556 * roll - 250 * dn);
      put(S.vSx, { text: sx.toLocaleString('en-IN'), css: { color: b >= 27.1 ? DOWN : WHITE } });
      put(S.vNf, { text: nf.toLocaleString('en-IN') });
      put(S.chg, { hide: b < 27.6 });
    },
  });

  // ------------------------------------------------------------------ b31–b35.5 the meme: Sharma Uncle at −1% vs you, after this video
  scene({
    name: 'meme', from: 'meme', to: 'history',
    build(root, S) {
      const panel = (y, src, pos, caption, credit) => {
        const cap = line(root, caption, X + 4, y, 54, 'wide'); cap.el.style.fontWeight = 600;
        const box = C.reg(el('div', { style: `position:absolute;left:${X}px;top:${y + 76}px;width:900px;height:470px;overflow:hidden;border-radius:24px;transform-origin:50% 50%` }, root), { hide: true });
        const img = C.reg(el('img', { src, style: `position:absolute;left:0;top:0;width:900px;height:470px;object-fit:cover;object-position:${pos};transform-origin:50% 50%` }, box));
        el('div', { style: `position:absolute;right:16px;bottom:12px;font:700 20px Mono, Emoji;color:rgba(255,255,255,0.85);text-shadow:0 1px 6px rgba(0,0,0,0.8)` }, box, credit);
        return { cap, box, img };
      };
      S.p1 = panel(420, '../assets/art/scream_panel.jpg', '50% 35%', 'Sharma Uncle at −1%:', 'Munch, “The Scream” (PD)');
      S.p2 = panel(1000, '../assets/art/moonlight_panel.jpg', '40% 30%', 'You, after this video:', 'Ravi Varma, “Lady in the Moonlight” (PD)');
    },
    run(t, b, S) {
      [[S.p1, 31], [S.p2, 32.5]].forEach(([P, at]) => {
        R(t, P.cap, at - 0.1, 35.0, { stagger: 0.05 });
        const k = spHit(t, at, 'default'), o = sp(t, 35.0, 'snappy');
        put(P.box, { hide: k < 0.01 || o > 0.99, y: 700 * (1 - k) - 1600 * o * (at === 31 ? 1 : 0.7) });
        put(P.img, { s: 1.12 - 0.08 * seg(t, at, 35.5) });
      });
    },
  });

  // ------------------------------------------------------------------ b35.5–b41 1979: 100 → today: 72,000+ (stonks)
  // milestone closes (approximate dates): the line is a sketch through them, not daily data
  const MILES = [[1979.0, 100], [1990.56, 1000], [1999.8, 5000], [2006.1, 10000], [2008.0, 20000], [2009.18, 8160], [2015.17, 30000],
    [2019.4, 40000], [2020.22, 25981], [2021.06, 50000], [2021.73, 60000], [2023.94, 70000], [2024.5, 80000], [2024.74, 85978], [2026.76, 72382]];
  const CH = { x0: X + 10, x1: X + 880, y0: 1470, y1: 930, vmax: 90000 };
  const cx = (yr) => lerp(CH.x0, CH.x1, (yr - 1979) / (2026.76 - 1979)), cy = (v) => lerp(CH.y0, CH.y1, v / CH.vmax);
  scene({
    name: 'history', from: 35.2, to: 'recap',
    build(root, S) {
      S.a1 = mono(root, 'In 1979,', X + 4, 450, 40, GREY, 'caps'); S.a2 = line(root, 'Sensex was 100.', X, 500, 136, 'cond');
      S.b1 = mono(root, 'Today, it’s', X + 4, 680, 40, UP, 'caps'); S.b2 = line(root, '72,000+.', X, 730, 190, 'cond', UP);
      S.ctx = C.canvas(root);
      S.l0 = mono(root, '100 · 1979', CH.x0, CH.y0 + 22, 28, GREY);
      S.l1 = mono(root, '72,382 · Oct 2026', 650, 905, 28, WHITE);
      S.note = mono(root, 'Milestone closes. Past ≠ future.', X, 1560, 24, GREY);
      S.stk = C.reg(el('div', { class: 'pill', style: `left:170px;top:1050px;height:96px;padding:0 34px;background:${UP};color:${INK};font:800 52px Mono, Emoji;transform-origin:50% 50%;box-shadow:0 20px 40px -16px rgba(0,0,0,0.6)` }, root, '📈 stonks'), { hide: true });
    },
    run(t, b, S) {
      R(t, S.a1, 35.3, 40.65); R(t, S.a2, 35.35, 40.65, { preset: 'snappy' });
      R(t, S.b1, 36.95, 40.65); R(t, S.b2, 'today', 40.65, { preset: 'snappy' });
      R(t, S.l0, 35.8, 40.65); R(t, S.l1, 37.2, 40.65); R(t, S.note, 37.5, 40.65);
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      const out = sp(t, 40.6, 'snappy');
      const u = seg(t, 35.7, 37.1);                 // draw progress (linear in time across the years)
      if (u > 0 && out < 0.98) {
        const yrEnd = lerp(1979, 2026.76, u);
        ctx.globalAlpha = 1 - out;
        ctx.strokeStyle = 'rgba(139,144,153,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(CH.x0, CH.y0); ctx.lineTo(CH.x1, CH.y0); ctx.stroke();
        ctx.strokeStyle = WHITE; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath();
        let hx = CH.x0, hy = cy(100);
        for (let i = 0; i < MILES.length; i++) {
          const [yr, v] = MILES[i];
          if (yr <= yrEnd) { hx = cx(yr); hy = cy(v); ctx[i ? 'lineTo' : 'moveTo'](hx, hy); }
          else { const [py, pv] = MILES[i - 1], f = (yrEnd - py) / (yr - py); hx = cx(lerp(py, yr, f)); hy = cy(lerp(pv, v, f)); ctx.lineTo(hx, hy); break; }
        }
        ctx.stroke();
        ctx.fillStyle = UP; ctx.beginPath(); ctx.arc(hx, hy, 13, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
      const k = spHit(t, 'stonks', 'snappy');
      put(S.stk, { hide: k < 0.01 || out > 0.99, s: Math.max(0.001, k * (1 - out)), r: -7 });
    },
  });

  // ------------------------------------------------------------------ b41–b45.5 recap cards
  scene({
    name: 'recap', from: 40.6, to: 'thats',
    build(root, S) {
      const card = (y, label, l1, l2) => {
        const c = C.reg(el('div', { class: 'card', style: `left:${X}px;top:${y}px;width:900px;height:360px;background:${PAPER}` }, root), { hide: true });
        const a = mono(root, label, X + 48, y + 36, 34, UPINK, 'caps'), b1 = line(root, l1, X + 42, y + 100, 112, 'cond', INK), b2 = line(root, l2, X + 42, y + 216, 112, 'cond', INK);
        return { c, a, b1, b2 };
      };
      S.c1 = card(500, 'Sensex = BSE', 'Score of India’s', 'top 30 companies');
      S.c2 = card(900, 'Nifty = NSE', 'Score of India’s', 'top 50 companies');
    },
    run(t, b, S) {
      [[S.c1, 'recap'], [S.c2, 'recap2']].forEach(([k, at]) => {
        const a = C.beatOf(at), p = spHit(t, a, 'default');
        const o = sp(t, 44.95, 'snappy');
        put(k.c, { hide: b < a - 0.4 || o > 0.99, y: 900 * (1 - p) - 1500 * o });
        [k.a, k.b1, k.b2].forEach((L) => put(L.el, { y: -1500 * o, hide: o > 0.99 }));
        R(t, k.a, a + 0.15, null); R(t, k.b1, a + 0.25, null, { preset: 'snappy' }); R(t, k.b2, a + 0.4, null, { preset: 'snappy' });
      });
    },
  });

  // ------------------------------------------------------------------ the HUD: series label + live 25 s countdown (fix → done)
  const SECS = 25;
  const remaining = (t) => SECS * clamp(1 - (Math.round(t * C.FPS) / C.FPS - bt('fix')) / (bt('done') - bt('fix')));
  const fmt = (r) => `00:${String(Math.floor(r + 1e-9)).padStart(2, '0')}.${Math.floor((r % 1) * 10 + 1e-9)}`;
  scene({
    name: 'hud', from: 'fix', to: 'thats',
    build(root, S) {
      S.timer = el('div', { class: 'mono', style: `position:absolute;left:${X}px;top:292px;font-size:52px;font-weight:800;color:${WHITE}` }, root, '00:25.0'); C.reg(S.timer);
      S.track = el('div', { style: `position:absolute;left:290px;top:327px;width:660px;height:6px;background:rgba(139,144,153,0.35)` }, root); C.reg(S.track);
      S.bar = C.reg(el('div', { style: `position:absolute;left:290px;top:325px;width:660px;height:10px;background:${UP};transform-origin:0 50%` }, root));
      S.lab = mono(root, 'Stock Market 101 · EP 02 · Beginner', X + 2, 366, 26, GREY, 'caps');
    },
    run(t, b, S) {
      const r = remaining(t), k = spHit(t, 7.2, 'default'), out = sp(t, 45.3, 'snappy');
      put(S.timer, { text: fmt(r), hide: k < 0.01 || out > 0.99, y: -120 * (1 - k) - 120 * out });
      put(S.track, { hide: k < 0.01 || out > 0.99, y: -120 * (1 - k) - 120 * out });
      put(S.bar, { hide: k < 0.01 || out > 0.99, sx: Math.max(0.0001, r / SECS), y: -120 * (1 - k) - 120 * out });
      R(t, S.lab, 7.4, 45.3);
    },
  });

  // ------------------------------------------------------------------ b45.5–b49 the last seconds, DONE.
  scene({
    name: 'finale', from: 45.1, to: 49.4,
    build(root, S) {
      S.th = line(root, 'That’s it.', X, 600, 70, 'wide hair');
      S.big = el('div', { class: 'mono', style: `position:absolute;left:${X}px;top:760px;font-size:190px;font-weight:800;color:${WHITE}` }, root, '00:02.0'); C.reg(S.big);
      S.done = line(root, 'Done.', X - 6, 820, 260, 'wide', UP); S.done.el.style.fontWeight = 900;
    },
    run(t, b, S) {
      R(t, S.th, 45.45, 47.7, { stagger: 0.08 });
      put(S.big, { text: fmt(remaining(t)), hide: b >= 48.02, y: 260 * (1 - spHit(t, 45.35, 'default')), css: { color: b >= 46.9 ? UP : WHITE } });
      R(t, S.done, 'done', 49.0, { preset: 'snappy' });
      put(S.done.el, { s: 1 + 0.06 * (b >= 48 ? 1 - sp(t, 'done', 'snappy') : 0) });
    },
  });

  // ------------------------------------------------------------------ b49–b56 callback: the group, Sharma Uncle leaves, forward this
  scene({
    name: 'chat2', from: 48.8, to: 'end',
    build(root, S) {
      S.head = chatHeader(root);
      S.p = bubble(root, { y: 420, w: 720, who: 'Papa', time: '7:31 am', body: `<div style="font:600 58px Display, Emoji;line-height:1.1">Only 1%? Relax. 😌</div>` });
      S.sys = bubble(root, { y: 690, w: 900, sys: true, body: 'Sharma Uncle left the group 🚪' });
      S.f1 = line(root, 'Forward this to', X + 4, 880, 70, 'wide hair');
      S.f2 = line(root, 'your Sharma Uncle 😉', X, 970, 104, 'cond', UP);
      S.next = mono(root, 'Next · EP 03 · Demat account', X + 4, 1170, 32, WHITE, 'caps');
      const chip = el('div', { class: 'pill', style: `left:0;top:0;height:86px;padding:0 40px;background:${UP};color:${INK};font:800 34px Mono, Emoji;letter-spacing:0.08em` }, null, 'FOLLOW FOR PART 3');
      S.chip = maskBox(root, X, 1230, 700, 96, chip);
      S.disc = mono(root, 'For education only. Not investment advice.', X, 1452, 28, GREY);
    },
    run(t, b, S) {
      put(S.head, { y: -300 * (1 - spHit(t, 48.9, 'default')) });
      bubbleIn(t, S.p, 'chat2');
      popIn(t, S.sys, 'left');
      R(t, S.f1, 'cta', null, { stagger: 0.06 }); R(t, S.f2, 52.25, null, { preset: 'snappy' });
      R(t, S.next, 52.8, null); rise1(t, S.chip, 53, null); R(t, S.disc, 53.4, null);
    },
  });

  // ------------------------------------------------------------------ grain
  scene({
    name: 'fx', from: 'hook', to: 'end',
    build(root, S) {
      const r2 = C.mulberry32(5150);
      S.tiles = [0, 1, 2, 3, 4, 5].map(() => {
        const c = el('canvas', { width: 540, height: 960, style: 'position:absolute;left:0;top:0;width:1080px;height:1920px;mix-blend-mode:overlay;opacity:0.08' }, root);
        const g = c.getContext('2d'), d = g.createImageData(540, 960);
        for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (r2() + r2() + r2() - 1.5) * 120; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
        g.putImageData(d, 0, 0); return C.reg(c, { hide: true });
      });
    },
    run(t, b, S) { const k = Math.floor(t * 15 + 1e-6) % 6; S.tiles.forEach((c, i) => put(c, { hide: i !== k })); },
  });

  C.start();
})();

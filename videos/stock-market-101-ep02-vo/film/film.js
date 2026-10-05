// Stock Market 101 · EP 02 · Sensex & Nifty — Hinglish VOICEOVER edition (47.8 s, 98 bpm grid).
// Two original characters talk it through: BHAI (know-it-all, glasses) explains to CHUTKI (his little sister) — the
// "two characters explain it" format. Kokoro-82M Hindi voices (Apache-2.0). Each VO line starts on a beat; every visual
// lands on its spoken word (whisper word timestamps → timeline marks). Subtitles are full Hinglish sentences with the
// current word lit; the avatars' mouths follow the voice envelope (film/vo_env.js), so everything is a pure function of t.
// Hook: the family group panics ("SENSEX CRASHED 800 POINTS"), Bhai: "Ruk!" (record scratch) "Pehle ye bata… Sensex hota
// kya hai?" Chutki: "…pata nahi." → Ravi Varma meme → a 30 s countdown with cricket, the scoreboard, 1%, the Scream vs the
// Moonlight meme, 1979 → today, Done. → Chutki forwards it → "Sharma Uncle left the group".
(() => {
  const { W, H, bt, sp, spHit, seg, clamp, lerp, put, el, scene } = C;
  C.fonts = ['900 100px Display', '200 100px Display', '600 100px Display', '700 40px Mono', '800 40px Mono', '800 40px Rupee', '400 40px Emoji'];
  const X = 90;
  const INK = '#0B0D10', PAPER = '#F2EEE6', WHITE = '#F7F7F5', GREY = '#8B9099', UP = '#16E07A', DOWN = '#F2524A', UPINK = '#0B8F4F';
  const line = (p, text, x, y, size, cls, color = WHITE) => TYPE.line(p, text, { x, y, size, cls: `display ${cls}`, color });
  const mono = (p, text, x, y, size, color = WHITE, extra = '') => TYPE.line(p, text, { x, y, size, cls: `mono ${extra}`, color });
  const R = (t, L, a, b, o) => TYPE.rise(t, L, a, b, o);
  const tri = (up, size, color) => el('div', { style: `position:absolute;width:${size}px;height:${size * 0.86}px;background:${color};clip-path:polygon(${up ? '50% 0, 100% 100%, 0 100%' : '0 0, 100% 0, 50% 100%'})` });
  const maskBox = (p, x, y, w, h, child) => { const b = el('div', { style: `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:hidden` }, p); b.appendChild(child); C.reg(child, { y: 0 }); return { b, child, h }; };
  const rise1 = (t, m, a, out = null, preset = 'snappy') => { let y = m.h * 1.15 * (1 - spHit(t, a, preset)); if (out != null) y -= m.h * 1.15 * sp(t, out, 'snappy'); put(m.child, { y, hide: Math.abs(y) >= m.h * 1.149 }); };
  const POP = (k) => 0.3 + 0.7 * k;   // pops start at 30 %: tiny scales rasterise differently depending on the previous frame (render --verify)
  const popIn = (t, e, at, out = null, preset = 'snappy') => { const k = spHit(t, at, preset), o = out == null ? 0 : sp(t, out, 'snappy'); put(e, { hide: k < 0.02 || o > 0.98, s: POP(k) * (1 - 0.7 * o) }); };
  const VO = window.VO || [], ENV = window.VOENV || { fps: 30, B: [], C: [] };
  const env = (who, t) => { const a = ENV[who] || []; return a[Math.min(a.length - 1, Math.max(0, Math.round(t * ENV.fps)))] || 0; };

  // ------------------------------------------------------------------ background
  scene({
    name: 'bg', from: 'hook', to: 'end',
    build(root, S) {
      S.base = C.reg(el('div', { class: 'fill', style: `background:${INK}` }, root));
      el('div', { class: 'fill', style: 'background-image:linear-gradient(rgba(255,255,255,0.045) 2px, transparent 2px),linear-gradient(90deg, rgba(255,255,255,0.045) 2px, transparent 2px);background-size:120px 120px;background-position:90px 60px' }, root);
    },
    // invalidate the whole frame on every seek so everything re-rasterises from scratch: a solid image whose position
    // follows t paints identical pixels but is a new style for every t (partial re-raster left 1-px AA differences)
    run(t, b, S) { put(S.base, { css: { backgroundImage: `linear-gradient(${INK}, ${INK})`, backgroundPosition: `${Math.round(t * 1e4)}px 0px` } }); },
  });

  // ------------------------------------------------------------------ the family group (hook b0–b15, callback b68–b78)
  function chatHeader(root) {
    const h = C.reg(el('div', { style: `position:absolute;left:0;top:250px;width:${W}px;height:120px;border-bottom:2px solid rgba(139,144,153,0.25)` }, root));
    el('div', { style: `position:absolute;left:${X}px;top:16px;width:84px;height:84px;border-radius:50%;background:#1C2026;display:flex;align-items:center;justify-content:center;font:60px Emoji` }, h, '👨‍👩‍👧‍👦');
    el('div', { style: `position:absolute;left:${X + 110}px;top:14px;font:700 46px Display, Emoji;color:${WHITE}` }, h, 'Family Group');
    el('div', { style: `position:absolute;left:${X + 112}px;top:70px;font:700 24px Mono, Emoji;color:${GREY};letter-spacing:0.02em` }, h, 'Sharma Uncle, Mummy, Papa, Bhai, You');
    return h;
  }
  function bubble(root, { y, w, who, body, time, fwd, sys, me }) {
    if (sys) {
      const s = el('div', { class: 'pill', style: `left:${(W - w) / 2}px;top:${y}px;width:${w}px;height:96px;background:#1C2026;color:${WHITE};font:700 40px Mono, Emoji;letter-spacing:0.01em;transform-origin:50% 50%` }, root, body);
      return C.reg(s, { hide: true });
    }
    const left = me ? W - X - w : X;
    const b = el('div', { style: `position:absolute;left:${left}px;top:${y}px;width:${w}px;box-sizing:border-box;padding:22px 34px 18px;background:${me ? UP : PAPER};border-radius:${me ? '40px 12px 40px 40px' : '12px 40px 40px 40px'};color:${INK};transform-origin:${me ? '100% 0' : '0 0'};box-shadow:0 30px 60px -30px rgba(0,0,0,0.6)` }, root);
    el('div', { style: `font:800 26px Mono, Emoji;letter-spacing:0.06em;text-transform:uppercase;color:${me ? INK : UPINK};margin-bottom:8px` }, b, who);
    if (fwd) el('div', { style: `font:italic 600 24px Display, Emoji;color:${me ? INK : GREY};margin:-2px 0 6px` }, b, fwd);
    el('div', {}, b, body);
    el('div', { style: `font:700 22px Mono, Emoji;color:${me ? INK : GREY};text-align:right;margin-top:6px` }, b, time);
    return C.reg(b, { hide: true });
  }
  const bubbleIn = (t, e, at) => { const k = spHit(t, at, 'snappy'); put(e, { hide: k < 0.02, s: POP(k) }); };

  scene({
    name: 'chat', from: 'hook', to: 15.8,
    build(root, S) {
      S.wrap = C.reg(el('div', { class: 'fill', style: 'transform-origin:50% 40%' }, root));
      S.head = chatHeader(S.wrap);
      const clip = el('div', { class: 'fill', style: 'clip-path:inset(372px 0 660px 0)' }, S.wrap);   // the list lives above the dialogue card
      S.list = C.reg(el('div', { class: 'fill' }, clip));
      S.b1 = bubble(S.list, { y: 420, w: 900, who: 'Sharma Uncle', time: '7:02 am',
        body: `<div style="font:900 132px Display, Emoji;font-stretch:62%;line-height:0.93;text-transform:uppercase">🚨 Sensex<br><span style="color:${DOWN}">crashed</span><br>800 points 🚨</div>` });
      S.b2 = bubble(S.list, { y: 921, w: 900, who: 'Sharma Uncle', time: '7:02 am', fwd: '↪ Forwarded 1,000 times',
        body: `<div style="font:900 96px Display, Emoji;font-stretch:62%;line-height:0.95;text-transform:uppercase">Sell everything<br>now!!! 😭</div>` });
      S.b3 = bubble(S.list, { y: 1262, w: 500, who: 'Mummy', time: '7:03 am', body: '<div style="font:110px Emoji;line-height:1.05;white-space:nowrap">😱😱😱</div>' });
      S.dim = C.reg(el('div', { class: 'fill', style: `background:${INK}` }), { hide: true }); root.appendChild(S.dim);
      S.q1 = line(root, 'Sensex', X, 560, 260, 'cond'); S.q2 = line(root, '= ?', X, 800, 260, 'cond', UP);
      S.cap = line(root, 'Poori family right now:', X + 4, 392, 54, 'wide');
      S.cap.el.style.fontWeight = 600; S.cap.el.style.textShadow = '0 6px 30px rgba(0,0,0,0.8)';
      S.card = C.reg(el('div', { style: `position:absolute;left:210px;top:480px;width:660px;height:606px;background:#FFFFFF;padding:14px;box-sizing:content-box;box-shadow:0 40px 90px -30px rgba(0,0,0,0.8);transform-origin:50% 50%` }, root), { hide: true });
      const frame = el('div', { style: 'width:660px;height:606px;overflow:hidden' }, S.card);
      S.img = el('img', { src: '../assets/art/expectation_card.jpg', style: 'display:block;width:660px;height:606px;object-fit:cover;transform-origin:50% 40%' }, frame); C.reg(S.img);
      el('div', { style: `position:absolute;left:14px;bottom:-46px;font:700 20px Mono, Emoji;color:${GREY};letter-spacing:0.04em` }, S.card, 'Raja Ravi Varma, “Expectation” (public domain)');
    },
    run(t, b, S) {
      put(S.list, { y: -C.trk(t, [[0, 0], [5.35, 240, 'snappy']]) });
      bubbleIn(t, S.b1, 'hook'); bubbleIn(t, S.b2, 'msg2'); bubbleIn(t, S.b3, 'msg3');
      const punch = spHit(t, 'scratch', 'snappy'), fly = sp(t, 14.85, 'snappy');
      put(S.wrap, { s: 1 + 0.045 * seg(t, 0, 6) + 0.06 * punch, y: -1500 * fly, hide: fly > 0.99 });   // slow push-in while the panic builds, punch on the scratch
      put(S.dim, { hide: b < 6.5, o: 0.78 * clamp(punch) * (1 - fly) });
      R(t, S.q1, 'q', 12.65, { preset: 'snappy' }); R(t, S.q2, 8.75, 12.65, { preset: 'snappy' });
      R(t, S.cap, 12.85, 14.6, { stagger: 0.05 });
      const k = spHit(t, 'family', 'default');
      put(S.card, { hide: b < 12.6 || fly > 0.99, y: 1100 * (1 - k) - 1500 * fly, r: -2.5 * k });
      put(S.img, { s: 1 + 0.06 * seg(t, 'family', 14.85) });
    },
  });

  // ------------------------------------------------------------------ b15–b19.4 "Chal, cricket se samjhaata hoon." 🏏
  scene({
    name: 'bat', from: 'chal', to: 19.8,
    build(root, S) {
      S.bat = C.reg(el('div', { style: `position:absolute;left:340px;top:520px;width:400px;height:400px;font:330px/1 Emoji;text-align:center;transform-origin:50% 80%` }, root, '🏏'), { hide: true });
      S.w = line(root, 'Cricket', X, 930, 230, 'cond', UP);
    },
    run(t, b, S) {
      const k = spHit(t, 14.95, 'playful'), o = sp(t, 19.35, 'snappy');
      put(S.bat, { hide: k < 0.02 || o > 0.98, s: POP(k) * (1 - 0.7 * o), r: -12 + 12 * k });
      R(t, S.w, 'bat', 19.35, { preset: 'snappy' });
    },
  });

  // ------------------------------------------------------------------ b19.75–b52.3 the teams → up/down → one score → −800 → 1%
  const JERSEY = 'M30 8 L14 15 L2 36 L18 46 L23 39 L23 96 L77 96 L77 39 L82 46 L98 36 L86 15 L70 8 Q50 24 30 8 Z';
  const rj = C.mulberry32(202), UPS = Array.from({ length: 50 }, () => rj() < 0.6);
  const SLOT30 = (i) => ({ x: X + 15 + (i % 6) * 150, y: 650 + Math.floor(i / 6) * 115, s: 1 });
  const SLOT50 = (i) => ({ x: X + 4 + (i % 10) * 90, y: 680 + Math.floor(i / 10) * 100, s: 0.7 });
  const BOARD = { x: X, y: 680, w: 900, h: 400 };
  scene({
    name: 'teams', from: 19.6, to: 'meme',
    build(root, S) {
      S.sx = line(root, 'Sensex', X, 420, 220, 'cond');
      S.nq = line(root, 'Nifty?', X, 420, 220, 'cond', UP);
      S.nf = line(root, 'Nifty', X, 420, 220, 'cond', UP);
      const chip = (txt) => el('div', { class: 'pill', style: `left:0;top:0;height:76px;padding:0 30px;background:${UP};color:${INK};font:800 40px Mono` }, null, txt);
      S.bse = maskBox(root, 690, 488, 170, 84, chip('BSE')); S.nse = maskBox(root, 590, 488, 170, 84, chip('NSE'));
      S.top30 = line(root, 'Top 30', X, 420, 220, 'cond');
      S.one = line(root, 'One score', X, 420, 200, 'cond', UP);
      S.m800 = line(root, '−800?', X, 420, 220, 'cond', DOWN);
      S.pct = line(root, '1%', X, 380, 300, 'cond', UP);
      S.chill = C.reg(el('div', { style: `position:absolute;left:470px;top:440px;font:170px/1 Emoji;transform-origin:50% 50%` }, root, '😌'), { hide: true });
      S.js = Array.from({ length: 50 }, (_, i) => {
        const d = el('div', { style: `position:absolute;left:0;top:0;width:120px;height:120px;transform-origin:50% 50%` }, root);
        d.innerHTML = `<svg viewBox="0 0 100 100" width="120" height="120"><path d="${JERSEY}" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><text x="50" y="76" text-anchor="middle" font-family="Mono" font-weight="800" font-size="30" fill="${INK}">${i + 1}</text></svg>`;
        // the badge is a SIBLING that follows the jersey (as a child it changed the jersey's bounds, and with them how the
        // jersey's raster snaps: a 1-px shift between seeks, caught by render --verify)
        const bw = el('div', { style: `position:absolute;left:0;top:0;width:120px;height:120px;transform-origin:50% 50%` }, root);
        const badge = el('div', { style: `position:absolute;left:74px;top:-6px;width:46px;height:46px;border-radius:50%;background:${INK};transform-origin:50% 50%` }, bw);
        const tr = tri(UPS[i], 26, UPS[i] ? UP : DOWN); tr.style.left = '10px'; tr.style.top = UPS[i] ? '9px' : '12px'; badge.appendChild(tr);
        if (!UPS[i]) { const hole = tri(false, 12, INK); hole.style.left = '17px'; hole.style.top = '15px'; badge.appendChild(hole); }
        return { d: C.reg(d, { hide: true }), bw: C.reg(bw, { hide: true }), badge: C.reg(badge, { hide: true }) };
      });
      S.board = C.reg(el('div', { style: `position:absolute;left:${BOARD.x}px;top:${BOARD.y}px;width:${BOARD.w}px;height:${BOARD.h}px;border-radius:30px;background:#14181D;border:3px solid #2A2F37;transform-origin:50% 0` }, root), { hide: true });
      const row = (y, name, color) => {
        el('div', { style: `position:absolute;left:44px;top:${y + 26}px;font:800 34px Mono;letter-spacing:0.14em;color:${color}` }, S.board, name);
        return el('div', { style: `position:absolute;right:44px;top:${y}px;font:800 104px Mono;color:${WHITE};font-variant-numeric:tabular-nums` }, S.board, '0');
      };
      S.vSx = C.reg(row(48, 'SENSEX', WHITE)); S.vNf = C.reg(row(210, 'NIFTY', UP));
      el('div', { style: `position:absolute;left:44px;top:178px;width:812px;height:2px;background:#2A2F37` }, S.board);
      S.chg = C.reg(el('div', { style: `position:absolute;left:44px;top:120px;font:800 30px Mono;color:${DOWN}` }, S.board, '▼ 800 (−1.1%)'), { hide: true });
    },
    run(t, b, S) {
      R(t, S.top30, 'team30', 25.2, { preset: 'snappy' });
      R(t, S.sx, 'sensex', 26.5, { preset: 'snappy' }); rise1(t, S.bse, 25.75, 26.45);
      R(t, S.nq, 26.85, 28.1, { preset: 'snappy' });
      R(t, S.nf, 28.4, 37.2, { preset: 'snappy' }); rise1(t, S.nse, 'nse', 37.1);
      R(t, S.one, 'onescore', 42.3, { preset: 'snappy' });
      R(t, S.m800, 'girna', 49.2, { preset: 'snappy' });
      R(t, S.pct, 'onepct', 52.15, { preset: 'heavy' });
      popIn(t, S.chill, 'tension', 52.1, 'playful');
      // jerseys: 30 pop on "tees"; on "pachaas" they regroup to 10×5 and 20 join; badges on "upar-neeche"; "sab jodo" → the board
      const toNifty = spHit(t, 'nifty', 'default'), gather = sp(t, 'jodo', 'default');
      S.js.forEach((J, i) => {
        const a = SLOT30(Math.min(i, 29)), z = SLOT50(i);
        const k = i < 30 ? spHit(t, 19.75 + i * 0.045, 'snappy') : spHit(t, 28.5 + (i - 30) * 0.05, 'snappy');
        let x = i < 30 ? lerp(a.x, z.x, toNifty) : z.x, y = i < 30 ? lerp(a.y, z.y, toNifty) : z.y, s = (i < 30 ? lerp(a.s, z.s, toNifty) : z.s) * POP(k);
        const gx = BOARD.x + BOARD.w / 2 - 60, gy = BOARD.y + 120, g = clamp(gather * 1.15 - (i % 10) * 0.012);
        x = lerp(x, gx, g); y = lerp(y, gy, g); s *= 1 - 0.65 * g;
        x = Math.round(x); y = Math.round(y); s = Math.round(s * 1000) / 1000;   // whole pixels: settled springs repaint identically whatever came before
        put(J.d, { hide: k < 0.02 || g > 0.97, x, y, s });
        put(J.bw, { hide: k < 0.02 || g > 0.97, x, y, s });
        const bk = spHit(t, 34.25 + (i % 25) * 0.05, 'snappy');
        put(J.badge, { hide: b < 34.05 || bk < 0.02, s: POP(bk) });
      });
      const bin = spHit(t, 'board', 'default'), bout = sp(t, 52.1, 'snappy');
      put(S.board, { hide: b < 37.7 || bout > 0.99 || bin < 0.02, sy: POP(bin), y: 120 * (b >= 49.4 ? spHit(t, 49.4, 'default') : 0) });
      const roll = clamp(sp(t, 38.4, 'heavy') / 0.995), dn = clamp(seg(t, 'tick', 44.5));
      put(S.vSx, { text: Math.round(72382 * roll - 800 * dn).toLocaleString('en-IN'), css: { color: b >= 43 ? DOWN : WHITE } });
      put(S.vNf, { text: Math.round(22556 * roll - 250 * dn).toLocaleString('en-IN') });
      put(S.chg, { hide: b < 44.4 });
    },
  });

  // ------------------------------------------------------------------ b52.5–b56.3 the meme (no VO): Sharma Uncle at −1% vs you
  scene({
    name: 'meme', from: 52.3, to: 56.5,
    build(root, S) {
      const panel = (y, src, pos, caption, credit) => {
        const cap = line(root, caption, X + 4, y, 54, 'wide'); cap.el.style.fontWeight = 600;
        const box = C.reg(el('div', { style: `position:absolute;left:${X}px;top:${y + 76}px;width:900px;height:470px;overflow:hidden;border-radius:24px;transform-origin:50% 50%` }, root), { hide: true });
        const img = C.reg(el('img', { src, style: `position:absolute;left:0;top:0;width:900px;height:470px;object-fit:cover;object-position:${pos};transform-origin:50% 50%` }, box));
        el('div', { style: `position:absolute;right:16px;bottom:12px;font:700 20px Mono;color:rgba(255,255,255,0.85);text-shadow:0 1px 6px rgba(0,0,0,0.8)` }, box, credit);
        return { cap, box, img };
      };
      S.p1 = panel(400, '../assets/art/scream_panel.jpg', '50% 35%', 'Sharma Uncle at −1%:', 'Munch, “The Scream” (PD)');
      S.p2 = panel(980, '../assets/art/moonlight_panel.jpg', '40% 30%', 'You, after this video:', 'Ravi Varma, “Lady in the Moonlight” (PD)');
    },
    run(t, b, S) {
      [[S.p1, 52.5], [S.p2, 54]].forEach(([P, at]) => {
        R(t, P.cap, at - 0.1, 56.1, { stagger: 0.05 });
        const k = spHit(t, at, 'default'), o = sp(t, 56.1, 'snappy');
        put(P.box, { hide: k < 0.01 || o > 0.99, y: 700 * (1 - k) - 1600 * o * (at === 52.5 ? 1 : 0.7) });
        put(P.img, { s: 1.12 - 0.08 * seg(t, at, 56.5) });
      });
    },
  });

  // ------------------------------------------------------------------ b56.5–b66.2 1979: 100 → aaj 72,000 (rocket / stonks)
  const MILES = [[1979.0, 100], [1990.56, 1000], [1999.8, 5000], [2006.1, 10000], [2008.0, 20000], [2009.18, 8160], [2015.17, 30000],
    [2019.4, 40000], [2020.22, 25981], [2021.06, 50000], [2021.73, 60000], [2023.94, 70000], [2024.5, 80000], [2024.74, 85978], [2026.76, 72382]];
  const CH = { x0: X + 10, x1: X + 880, y0: 1200, y1: 720, vmax: 90000 };
  const cx = (yr) => lerp(CH.x0, CH.x1, (yr - 1979) / (2026.76 - 1979)), cy = (v) => lerp(CH.y0, CH.y1, v / CH.vmax);
  scene({
    name: 'history', from: 56.3, to: 66.4,
    build(root, S) {
      S.a1 = mono(root, '1979', X + 4, 410, 40, GREY, 'caps'); S.a2 = line(root, '100', X, 460, 200, 'cond');
      S.b1 = mono(root, 'Aaj · Oct 2026', 520, 410, 40, UP, 'caps'); S.b2 = line(root, '72,382', 516, 460, 200, 'cond', UP);
      S.ctx = C.canvas(root);
      S.note = mono(root, 'Milestone closes. Past ≠ future.', X, 1216, 24, GREY);
      S.stk = C.reg(el('div', { class: 'pill', style: `left:150px;top:820px;height:110px;padding:0 40px;background:${UP};color:${INK};font:800 60px Mono, Emoji;transform-origin:50% 50%;box-shadow:0 20px 40px -16px rgba(0,0,0,0.6)` }, root, '🚀 stonks'), { hide: true });
    },
    run(t, b, S) {
      R(t, S.a1, 56.55, 66.0); R(t, S.a2, 56.65, 66.0, { preset: 'snappy' });
      R(t, S.b1, 61.4, 66.0); R(t, S.b2, 'today', 66.0, { preset: 'snappy' });
      R(t, S.note, 58, 66.0);
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      const out = sp(t, 66.0, 'snappy'), u = seg(t, 57, 62.2);
      if (u > 0 && out < 0.98) {
        const yrEnd = lerp(1979, 2026.76, u);
        ctx.globalAlpha = 1 - out;
        ctx.strokeStyle = 'rgba(139,144,153,0.35)'; ctx.lineWidth = 2; ctx.lineCap = 'butt'; ctx.beginPath();   // set every frame: canvas state persists between seeks ctx.moveTo(CH.x0, CH.y0); ctx.lineTo(CH.x1, CH.y0); ctx.stroke();
        ctx.strokeStyle = WHITE; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath();
        let hx = CH.x0, hy = cy(100);
        for (let i = 0; i < MILES.length; i++) {
          const [yr, v] = MILES[i];
          if (yr <= yrEnd) { hx = cx(yr); hy = cy(v); ctx[i ? 'lineTo' : 'moveTo'](hx, hy); }
          else { const [py, pv] = MILES[i - 1], f = (yrEnd - py) / (yr - py); hx = cx(lerp(py, yr, f)); hy = cy(lerp(pv, v, f)); ctx.lineTo(hx, hy); break; }
        }
        ctx.stroke();
        ctx.fillStyle = UP; ctx.beginPath(); ctx.arc(hx, hy, 13, 0, Math.PI * 2); ctx.fill();
        if (u < 1) { ctx.font = '800 34px Mono'; ctx.fillStyle = WHITE; ctx.textAlign = hx > 700 ? 'right' : 'left'; ctx.fillText(String(Math.floor(yrEnd)), hx + (hx > 700 ? -24 : 24), hy - 22); }
        ctx.globalAlpha = 1;
      }
      const k = spHit(t, 'rocket', 'playful');
      put(S.stk, { hide: k < 0.02 || out > 0.98, s: POP(k) * (1 - 0.7 * out), r: -7 });
    },
  });

  // ------------------------------------------------------------------ the HUD: series label + live 30 s countdown (soch → done)
  const SECS = 30;
  const remaining = (t) => SECS * clamp(1 - (Math.round(t * C.FPS) / C.FPS - bt('soch')) / (bt('done') - bt('soch')));
  const fmt = (r) => `00:${String(Math.floor(r + 1e-9)).padStart(2, '0')}.${Math.floor((r % 1) * 10 + 1e-9)}`;
  scene({
    name: 'hud', from: 'soch', to: 67.4,
    build(root, S) {
      S.timer = el('div', { class: 'mono', style: `position:absolute;left:${X}px;top:292px;font-size:52px;font-weight:800;color:${WHITE}` }, root, '00:30.0'); C.reg(S.timer);
      S.track = el('div', { style: `position:absolute;left:290px;top:327px;width:660px;height:6px;background:rgba(139,144,153,0.35)` }, root); C.reg(S.track);
      S.bar = C.reg(el('div', { style: `position:absolute;left:290px;top:325px;width:660px;height:10px;background:${UP};transform-origin:0 50%` }, root));
      S.lab = mono(root, 'Stock Market 101 · EP 02 · Beginner', X + 2, 366, 26, GREY, 'caps');
    },
    run(t, b, S) {
      const r = remaining(t), k = spHit(t, 'soch', 'default'), out = sp(t, 67.0, 'snappy');
      put(S.timer, { text: fmt(r), hide: k < 0.01 || out > 0.99, y: -120 * (1 - k) - 120 * out, css: { color: b >= 65.4 ? UP : WHITE } });
      put(S.track, { hide: k < 0.01 || out > 0.99, y: -120 * (1 - k) - 120 * out });
      put(S.bar, { hide: k < 0.01 || out > 0.99, sx: Math.max(0.0001, r / SECS), y: -120 * (1 - k) - 120 * out });
      R(t, S.lab, 18.2, 67.0);
    },
  });

  // ------------------------------------------------------------------ b67 Done.
  scene({
    name: 'done', from: 66.3, to: 68.6,
    build(root, S) { S.done = line(root, 'Done.', X - 6, 640, 260, 'wide', UP); S.done.el.style.fontWeight = 900; },
    run(t, b, S) { R(t, S.done, 'done', 68.2, { preset: 'snappy' }); put(S.done.el, { s: 1 + 0.06 * (b >= 67 ? 1 - sp(t, 'done', 'snappy') : 0) }); },
  });

  // ------------------------------------------------------------------ b68–b78 callback: Chutki forwards it, Sharma Uncle leaves
  scene({
    name: 'chat2', from: 68, to: 'end',
    build(root, S) {
      S.head = chatHeader(root);
      S.me = bubble(root, { y: 420, w: 760, me: true, who: 'You', time: '7:31 am', fwd: '↪ Forwarded',
        body: `<div style="font:900 64px Display, Emoji;font-stretch:62%;line-height:1;text-transform:uppercase">Sensex & Nifty, 30 sec 🏏</div><div style="font:600 34px Display, Emoji;margin-top:6px">Uncle, ye dekho 👇</div>` });
      S.typing = C.reg(el('div', { style: `position:absolute;left:${W - X - 190}px;top:430px;width:190px;height:96px;border-radius:40px 12px 40px 40px;background:${UP};transform-origin:100% 0` }, root), { hide: true });
      S.dots = [0, 1, 2].map((i) => C.reg(el('div', { style: `position:absolute;left:${44 + i * 40}px;top:38px;width:22px;height:22px;border-radius:50%;background:${INK}` }, S.typing)));
      S.sys = bubble(root, { y: 700, w: 900, sys: true, body: 'Sharma Uncle left the group 🚪' });
      S.f1 = line(root, 'Forward this to', X + 4, 870, 70, 'wide hair');
      S.f2 = line(root, 'your Sharma Uncle 😉', X, 960, 104, 'cond', UP);
      S.next = mono(root, 'Next · EP 03 · Demat account', X + 4, 1130, 32, WHITE, 'caps');
      const chip = el('div', { class: 'pill', style: `left:0;top:0;height:86px;padding:0 40px;background:${UP};color:${INK};font:800 34px Mono;letter-spacing:0.08em` }, null, 'FOLLOW FOR PART 3');
      S.chip = maskBox(root, X, 1190, 700, 96, chip);
      S.disc = mono(root, 'For education only. Not investment advice.', X, 1330, 28, GREY);
    },
    run(t, b, S) {
      put(S.head, { y: -300 * (1 - spHit(t, 'chat2', 'default')) });
      const ty = spHit(t, 68.9, 'snappy'), tyo = sp(t, 70.3, 'snappy');
      put(S.typing, { hide: ty < 0.02 || tyo > 0.98, s: POP(ty) * (1 - 0.7 * tyo) });
      S.dots.forEach((d, i) => put(d, { y: -10 * Math.max(0, Math.sin((t * 7 - i * 0.9))) }));
      bubbleIn(t, S.me, 'sent');
      popIn(t, S.sys, 'left');
      R(t, S.f1, 'cta', null, { stagger: 0.06 }); R(t, S.f2, 74.25, null, { preset: 'snappy' });
      R(t, S.next, 74.8, null); rise1(t, S.chip, 75, null); R(t, S.disc, 75.4, null);
    },
  });

  // ------------------------------------------------------------------ the dialogue card: Bhai ⟷ Chutki, subtitles with the word lit
  const AV = {
    B: `<svg viewBox="0 0 160 160" width="150" height="150">
      <circle cx="80" cy="80" r="76" fill="#1C2026" stroke="#3A404A" stroke-width="4"/>
      <circle cx="35" cy="92" r="9" fill="#B07A50"/><circle cx="125" cy="92" r="9" fill="#B07A50"/>
      <circle cx="80" cy="88" r="46" fill="#B9825A"/>
      <path d="M34 82 Q34 34 80 32 Q128 34 127 80 Q118 56 96 54 Q100 46 88 44 Q74 58 46 60 Q38 66 34 82 Z" fill="#141414"/>
      <path d="M44 100 Q50 132 80 136 Q110 132 116 100 Q112 120 80 124 Q48 120 44 100 Z" fill="#2B211B" opacity="0.9"/>
      <rect x="50" y="76" width="26" height="19" rx="6" fill="rgba(255,255,255,0.12)" stroke="#0B0D10" stroke-width="4"/>
      <rect x="84" y="76" width="26" height="19" rx="6" fill="rgba(255,255,255,0.12)" stroke="#0B0D10" stroke-width="4"/>
      <path d="M76 84 H84" stroke="#0B0D10" stroke-width="4"/>
      <circle cx="63" cy="86" r="3.5" fill="#0B0D10"/><circle cx="97" cy="86" r="3.5" fill="#0B0D10"/>
      <ellipse class="mouth" cx="80" cy="113" rx="11" ry="2.5" fill="#4A1414"/></svg>`,
    C: `<svg viewBox="0 0 160 160" width="150" height="150">
      <circle cx="80" cy="80" r="76" fill="#1C2026" stroke="${UP}" stroke-width="4"/>
      <circle cx="38" cy="58" r="17" fill="#141414"/><circle cx="122" cy="58" r="17" fill="#141414"/>
      <circle cx="80" cy="90" r="44" fill="#C68A5E"/>
      <path d="M36 88 Q34 42 80 42 Q126 42 124 88 Q118 64 100 60 Q86 70 60 64 Q42 70 36 88 Z" fill="#141414"/>
      <circle cx="80" cy="72" r="3.6" fill="#D23B3B"/>
      <circle cx="58" cy="104" r="7" fill="#E07A6A" opacity="0.35"/><circle cx="102" cy="104" r="7" fill="#E07A6A" opacity="0.35"/>
      <circle cx="66" cy="90" r="5" fill="#0B0D10"/><circle cx="94" cy="90" r="5" fill="#0B0D10"/>
      <circle cx="67.5" cy="88.5" r="1.6" fill="#FFFFFF"/><circle cx="95.5" cy="88.5" r="1.6" fill="#FFFFFF"/>
      <ellipse class="mouth" cx="80" cy="112" rx="9" ry="2.5" fill="#6B1E1E"/></svg>`,
  };
  const CARD = { x: X, y: 1250, w: 900, h: 250 };
  // split a line into sentence pages (≤ ~2 lines each at 56 px), each with its share of the line's time (∝ characters)
  function pages(sub) {
    const parts = sub.match(/[^.?!…]+[.?!…]+|[^.?!…]+$/g).map((x) => x.trim()).filter(Boolean);
    const out = []; for (const p of parts) { if (out.length && (out[out.length - 1].length < 16 || p.length < 10) && (out[out.length - 1] + ' ' + p).length <= 58) out[out.length - 1] += ' ' + p; else out.push(p); }
    const total = out.reduce((n, p) => n + p.length, 0); let acc = 0;
    return out.map((p) => { const f0 = acc / total; acc += p.length; return { text: p, f0, f1: acc / total }; });
  }
  scene({
    name: 'dialogue', from: 'hook', to: 72.9,
    build(root, S) {
      S.card = C.reg(el('div', { style: `position:absolute;left:${CARD.x}px;top:${CARD.y}px;width:${CARD.w}px;height:${CARD.h}px;border-radius:0;background:#14181D;border:2px solid #2A2F37;border-top:6px solid #2A2F37` }, root));
      const av = (who, x) => {
        const d = el('div', { style: `position:absolute;left:${x}px;top:${CARD.y - 92}px;width:150px;height:150px;transform-origin:50% 100%` }, root, AV[who]);
        d.firstChild.setAttribute('width', 130); d.firstChild.setAttribute('height', 130); d.firstChild.style.cssText = 'position:absolute;left:10px;top:0';
        el('div', { style: `position:absolute;left:${who === 'C' ? -110 : 140}px;top:84px;width:110px;text-align:${who === 'C' ? 'right' : 'left'};font:800 22px Mono;letter-spacing:0.14em;color:${who === 'C' ? UP : GREY}` }, d, who === 'C' ? 'CHUTKI' : 'BHAI');
        const dim = C.reg(el('div', { style: `position:absolute;left:10px;top:0;width:130px;height:130px;border-radius:50%;background:rgba(11,13,16,0.55)` }, d));
        return { d: C.reg(d), mouth: d.querySelector('.mouth'), dim };
      };
      S.avB = av('B', CARD.x + 44); S.avC = av('C', CARD.x + CARD.w - 194);   // clear of the card's rounded corners (a moving edge over an AA corner repaints inexactly)
      S.pages = [];
      VO.forEach((V, li) => pages(V.sub).forEach((P, pi, arr) => {
        const box = el('div', { style: `position:absolute;left:${CARD.x + 36}px;top:${CARD.y + 48}px;width:${CARD.w - 72}px;height:${CARD.h - 64}px;overflow:hidden` }, root);
        const inner = el('div', { style: `position:absolute;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:${V.who === 'C' ? 'flex-end' : 'flex-start'}` }, box);
        const txt = el('div', { style: `font:700 56px/1.12 Display, Emoji;color:${WHITE};text-align:${V.who === 'C' ? 'right' : 'left'};max-width:100%` }, inner);
        const words = P.text.split(' '), total = words.reduce((n, w) => n + w.length + 1, 0); let acc = 0;
        const spans = words.map((w) => { const sEl = el('span', {}, txt, w + ' '); const f = acc / total; acc += w.length + 1; return { s: C.reg(sEl), f }; });
        S.pages.push({ V, li, P, last: pi === arr.length - 1, inner: C.reg(inner), spans });
      }));
    },
    run(t, b, S) {
      let cur = null;
      S.pages.forEach((G, gi) => {
        const V = G.V, dur = V.t1 - V.t0, ta = V.t0 + G.P.f0 * dur, tz = V.t0 + G.P.f1 * dur;
        const ba = C.beatAt(ta), nextLine = VO[G.li + 1];
        const end = !G.last ? C.beatAt(tz) : (nextLine && nextLine.b0 - V.b1 < 1.6 ? nextLine.b0 : V.b1 + 0.5);
        const k = spHit(t, ba, 'snappy'), o = sp(t, end - 0.1, 'snappy');
        put(G.inner, { y: 200 * (1 - k) - 200 * o, hide: k < 0.01 || o > 0.99 });
        if (b >= V.b0 - 0.2 && b < end) cur = G;
        const p = clamp((t - ta) / (tz - ta));
        G.spans.forEach((w) => put(w.s, { css: { color: p >= w.f ? WHITE : '#5E636B' } }));
      });
      // hide the card whenever nobody speaks for more than ~1.6 beats (memes, the gag pause, Done., the CTA)
      const quiet = [[72.8, 99]];
      VO.forEach((V, i) => { const N = VO[i + 1]; if (N && N.b0 - V.b1 > 1.6) quiet.push([V.b1 + 0.45, N.b0 - 0.35]); });
      let off = 0; for (const [a, z] of quiet) off = Math.max(off, sp(t, a, 'snappy') * (1 - spHit(t, z, 'default')));
      const dy = 460 * off;
      put(S.card, { y: dy, hide: off > 0.99 });   // square corners: a rounded border's anti-aliased arc repainted inexactly after other frames (render --verify)
      ['B', 'C'].forEach((who) => {
        const A = who === 'B' ? S.avB : S.avC, active = cur && cur.V.who === who;
        const pop = active ? spHit(t, cur.V.b0, 'playful') : 1, e = env(who, t);
        A.mouth.setAttribute('ry', (2.5 + 11 * e).toFixed(2));
        put(A.d, { y: Math.round(dy - 6 * e), s: (active ? 1 : 0.8) * (active ? 0.88 + 0.12 * pop : 1), hide: off > 0.99 });
        put(A.dim, { hide: active || off > 0.99 });   // dim the listener with an overlay, not group opacity (opacity layers leak raster state)
      });
    },
  });

  // ------------------------------------------------------------------ grain
  scene({
    name: 'fx', from: 'hook', to: 'end',
    build(root, S) {
      const r2 = C.mulberry32(5150);
      S.tiles = [0, 1, 2, 3, 4, 5].map(() => {
        const c = el('canvas', { width: 540, height: 960, style: 'position:absolute;left:0;top:0;width:1080px;height:1920px;mix-blend-mode:overlay;opacity:0.08' }, root);
        const g = c.getContext('2d', { willReadFrequently: true }), d = g.createImageData(540, 960);
        for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (r2() + r2() + r2() - 1.5) * 120; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
        g.putImageData(d, 0, 0); return C.reg(c, { hide: true });
      });
    },
    run(t, b, S) { const k = Math.floor(t * 15 + 1e-6) % 6; S.tiles.forEach((c, i) => put(c, { hide: i !== k })); },
  });

  C.start();
})();

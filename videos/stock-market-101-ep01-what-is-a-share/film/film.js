// Stock Market 101 · EP 01 · "What is a share?" — a 34.7 s Reel on a 76 bpm lo-fi grid (guide: Mixkit "Sweet September").
// Hook: a chaotic candlestick screen ("STOCK MARKET looks scary?") collapses on b2 into one calm line ("It's just a CHAI
// SHOP.") that flies up and becomes a live 30-second countdown. Then, in words a child can follow: Raju's chai stall →
// he wants a bigger shop → needs money → cuts it into 100 pieces → each piece is a SHARE → you buy one for ₹100 → the shop
// does well, your share grows → where? the stock market (NSE, BSE: a mandi for shares) → more buyers, price up; more
// sellers, price down (the music drops out) → recap → DONE. at 00:00.0 → EP 02 Sensex & Nifty.
// Type: Archivo pushed from ultra-condensed black to expanded hairline (one family) + JetBrains Mono for every number.
(() => {
  const { W, H, bt, sp, spHit, seg, clamp, lerp, put, el, scene } = C;
  C.fonts = ['900 100px Display', '200 100px Display', '800 100px Display', '700 40px Mono', '800 40px Mono', '800 40px Rupee', '500 40px Rupee'];
  const X = 90;
  const INK = '#0B0D10', PAPER = '#F2EEE6', WHITE = '#F7F7F5', GREY = '#8B9099', UP = '#16E07A', DOWN = '#F2524A', UPINK = '#0B8F4F', CHAI = '#C8955A';
  const line = (p, text, x, y, size, cls, color = WHITE) => TYPE.line(p, text, { x, y, size, cls: `display ${cls}`, color });
  const mono = (p, text, x, y, size, color = WHITE, extra = '') => TYPE.line(p, text, { x, y, size, cls: `mono ${extra}`, color });
  const R = (t, L, a, b, o) => TYPE.rise(t, L, a, b, o);
  const rnd = C.mulberry32(101);
  const tri = (up, size, color) => el('div', { style: `position:absolute;width:${size}px;height:${size * 0.86}px;background:${color};clip-path:polygon(${up ? '50% 0, 100% 100%, 0 100%' : '0 0, 100% 0, 50% 100%'})` });   // ▲ / ▼ as vectors (no font has them)
  const maskBox = (p, x, y, w, h, child) => { const b = el('div', { style: `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:hidden` }, p); b.appendChild(child); C.reg(child, { y: 0 }); return { b, child, h }; };
  const rise1 = (t, m, a, out = null, preset = 'snappy') => { let y = m.h * 1.15 * (1 - spHit(t, a, preset)); if (out != null) y -= m.h * 1.15 * sp(t, out, 'snappy'); put(m.child, { y, hide: Math.abs(y) >= m.h * 1.149 }); };

  // ------------------------------------------------------------------ background: ink + a recessive chart grid
  scene({
    name: 'bg', from: 'hook', to: 'end',
    build(root) {
      el('div', { class: 'fill', style: `background:${INK}` }, root);
      el('div', { class: 'fill', style: 'background-image:linear-gradient(rgba(255,255,255,0.045) 2px, transparent 2px),linear-gradient(90deg, rgba(255,255,255,0.045) 2px, transparent 2px);background-size:120px 120px;background-position:90px 60px' }, root);
    },
  });

  // ------------------------------------------------------------------ b0–b4 hook: candlestick chaos → one calm line → the timer bar
  const N = 140, OPEN = [], CLOSE = [], HI = [], LO = [];
  { let p = 100; for (let i = 0; i < N; i++) { const o = p, c = p + (rnd() - 0.5) * 9; OPEN.push(o); CLOSE.push(c); HI.push(Math.max(o, c) + rnd() * 4); LO.push(Math.min(o, c) - rnd() * 4); p = c; } }
  const FLAT = 1380;                                            // the y the candles fold onto (below the type)
  scene({
    name: 'chaos', from: 'hook', to: 4.6,
    build(root, S) {
      S.ctx = C.canvas(root); S.cv = root.lastChild;
      S.lineEl = C.reg(el('div', { style: `position:absolute;left:0;top:0;width:1px;height:8px;background:${UP};transform-origin:0 0` }, root), { hide: true });
      S.l1 = line(root, 'Stock', X, 440, 290, 'cond'); S.l2 = line(root, 'market', X, 710, 290, 'cond');
      S.l3 = line(root, 'looks scary?', X + 4, 1010, 104, 'wide'); S.l3.el.style.fontWeight = 500;
      [S.l1, S.l2, S.l3].forEach((L) => (L.el.style.textShadow = '0 8px 40px rgba(0,0,0,0.7)'));
      S.j1 = line(root, 'It’s just a', X + 4, 470, 92, 'wide hair');
      S.j2 = line(root, 'chai', X, 560, 380, 'cond', UP); S.j3 = line(root, 'shop.', X, 900, 380, 'cond', UP);
    },
    run(t, b, S) {
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      const collapse = sp(t, 'snap', 'default');                 // candles fold into one flat line on b2
      const scroll = Math.min(t, bt('snap')) * 14;                // frantic scroll until then, then frozen
      const cw = 22, gap = 8, step = cw + gap, first = Math.floor(scroll), frac = scroll - first;
      const y = (v) => lerp(1000 - (v - 100) * 16, FLAT, collapse);
      ctx.globalAlpha = 0.72 + 0.28 * collapse;
      for (let k = -1; k < W / step + 2; k++) {
        const i = (first + k) % N, x = k * step - frac * step + 20;
        const up = CLOSE[i] >= OPEN[i], col = up ? UP : DOWN;
        const yo = y(OPEN[i]), yc = y(CLOSE[i]), yh = y(HI[i]), yl = y(LO[i]);
        ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x + cw / 2, yh); ctx.lineTo(x + cw / 2, yl); ctx.stroke();
        const top = Math.min(yo, yc), hgt = Math.max(3, Math.abs(yc - yo));
        if (up) ctx.fillRect(x, top, cw, hgt); else { ctx.lineWidth = 4; ctx.strokeRect(x + 2, top + 2, cw - 4, Math.max(2, hgt - 4)); }   // up filled, down hollow
      }
      ctx.globalAlpha = 1;
      put(S.cv, { hide: b >= 2.55 });
      // the flat line → the HUD timer bar
      const fly = spHit(t, 'fly', 'default');
      put(S.lineEl, { hide: b < 2.5 || b >= 3.35, x: lerp(0, 290, fly), y: lerp(FLAT - 4, 330, fly), sx: lerp(W, 660, fly), sy: lerp(1, 0.75, fly) });
      // hook type: nervous until b2
      const jx = b < 2 ? Math.sin(t * 61) * 4 : 0, jy = b < 2 ? Math.cos(t * 47) * 3 : 0;
      R(t, S.l1, -0.6, 2.1, { preset: 'snappy', exit: 0.2 }); R(t, S.l2, -0.5, 2.1, { preset: 'snappy', exit: 0.2 }); R(t, S.l3, 'scary', 2.1, { stagger: 0.12, exit: 0.2 });
      put(S.l1.el, { x: jx, y: jy }); put(S.l2.el, { x: -jx, y: jy });
      R(t, S.j1, 2.2, 3.7, { stagger: 0.06 }); R(t, S.j2, 2.3, 3.75, { preset: 'snappy' }); R(t, S.j3, 'chai', 3.75, { preset: 'snappy' });
    },
  });

  // ------------------------------------------------------------------ b4–b23 on paper: the stall, the pieces, your share
  const BOX = { x: 190, y: 880, w: 700, h: 600 };
  function stall(live = true) {   // Raju's chai stall from flat shapes: counter + poles, kettle, glasses, striped awning, sign
    const ns = 'http://www.w3.org/2000/svg', s = document.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 700 600'); s.setAttribute('width', 700); s.setAttribute('height', 600);
    const add = (tag, at, parent = s) => { const e = document.createElementNS(ns, tag); for (const [k, v] of Object.entries(at)) e.setAttribute(k, v); parent.appendChild(e); return e; };
    const txt = (parent, x, y, size, str, fill, css = '') => { const e = add('text', { x, y, 'text-anchor': 'middle', fill, 'font-family': 'Display', 'font-size': size, 'font-weight': 900, style: `font-stretch:62%;letter-spacing:0.04em;${css}` }, parent); e.textContent = str; return e; };
    const g = {};
    g.body = add('g', {});
    for (const px of [44, 634]) add('rect', { x: px, y: 190, width: 22, height: 230, fill: INK }, g.body);
    add('rect', { x: 20, y: 400, width: 660, height: 190, rx: 14, fill: '#FFFFFF', stroke: INK, 'stroke-width': 8 }, g.body);
    add('rect', { x: 24, y: 440, width: 652, height: 26, fill: UP }, g.body);
    txt(g.body, 350, 556, 74, '₹10 A CUP', INK, 'font-family:Display, Rupee');
    g.kettle = add('g', {});
    add('path', { d: 'M262 338 L318 300 L326 312 L276 358', fill: UP, stroke: INK, 'stroke-width': 7, 'stroke-linejoin': 'round' }, g.kettle);
    add('path', { d: 'M148 336 Q96 350 134 392', fill: 'none', stroke: INK, 'stroke-width': 9, 'stroke-linecap': 'round' }, g.kettle);
    add('path', { d: 'M128 400 L148 306 Q205 284 262 306 L282 400 Z', fill: UP, stroke: INK, 'stroke-width': 7, 'stroke-linejoin': 'round' }, g.kettle);
    add('rect', { x: 176, y: 276, width: 58, height: 24, rx: 9, fill: INK }, g.kettle);
    g.steam = add('g', {});
    for (const sx of [180, 214, 248]) add('path', { d: `M${sx} 262 q-14 -22 0 -44 q14 -22 0 -44`, fill: 'none', stroke: '#B9B3A8', 'stroke-width': 7, 'stroke-linecap': 'round' }, g.steam);
    g.cups = add('g', {});
    for (const cx of [392, 470, 548]) {
      add('path', { d: `M${cx} 334 L${cx + 58} 334 L${cx + 50} 400 L${cx + 8} 400 Z`, fill: '#FFFFFF', stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g.cups);
      add('path', { d: `M${cx + 3} 352 L${cx + 55} 352 L${cx + 50} 396 L${cx + 8} 396 Z`, fill: CHAI }, g.cups);
    }
    g.awn = add('g', {});
    for (let i = 0; i < 7; i++) { const c = i % 2 ? '#FFFFFF' : UP; add('rect', { x: i * 100, y: 120, width: 100, height: 64, fill: c, stroke: INK, 'stroke-width': 6 }, g.awn); add('path', { d: `M${i * 100} 184 a50 26 0 0 0 100 0 Z`, fill: c, stroke: INK, 'stroke-width': 6 }, g.awn); }
    g.sign = add('g', {}); add('rect', { x: 150, y: 14, width: 400, height: 92, rx: 14, fill: INK }, g.sign);
    txt(g.sign, 350, 82, 62, 'RAJU CHAI', PAPER);
    for (const k of Object.keys(g)) { g[k].style.transformBox = 'fill-box'; g[k].style.transformOrigin = '50% 100%'; if (live) C.reg(g[k], { hide: true }); }   // tile clones stay static
    return { s, g };
  }
  function ghost() {   // the bigger shop Raju dreams of: a dashed two-storey outline behind the stall
    const ns = 'http://www.w3.org/2000/svg', s = document.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 860 760'); s.setAttribute('width', 860); s.setAttribute('height', 760);
    s.style.cssText = `position:absolute;left:${BOX.x - 80}px;top:${BOX.y - 160}px;transform-origin:50% 100%`;
    const add = (tag, at) => { const e = document.createElementNS(ns, tag); for (const [k, v] of Object.entries(at)) e.setAttribute(k, v); s.appendChild(e); return e; };
    const st = { fill: 'none', stroke: '#A39D92', 'stroke-width': 6, 'stroke-dasharray': '18 14', 'stroke-linejoin': 'round' };
    add('path', { d: 'M20 120 L430 10 L840 120', ...st });
    add('rect', { x: 40, y: 120, width: 780, height: 630, rx: 10, ...st });
    for (const wx of [100, 330, 560]) add('rect', { x: wx, y: 170, width: 200, height: 120, rx: 8, ...st });
    return s;
  }
  const TILE = { cols: 10, rows: 10 }, TW = BOX.w / 10, TH = BOX.h / 10, MINE = { c: 2, r: 5 };
  const CARD = { y: 1250 }, SLOT = { x: 130, y: CARD.y + 76, s: 1.6 };   // where your tile lands in the card
  scene({
    name: 'paper', from: 'raju', to: 'where',
    build(root, S) {
      S.panel = C.reg(el('div', { class: 'fill', style: `background:${PAPER}` }, root));
      S.ghost = C.reg(ghost(), { hide: true }); root.appendChild(S.ghost);
      S.shopBox = C.reg(el('div', { style: `position:absolute;left:${BOX.x}px;top:${BOX.y}px;width:${BOX.w}px;height:${BOX.h}px` }, root));
      S.shop = stall(); S.shopBox.appendChild(S.shop.s);
      S.coins = [[150, 820], [930, 960], [110, 1250]].map(([x, y]) => {
        const c = el('div', { class: 'pill', style: `left:${x - 64}px;top:${y - 64}px;width:128px;height:128px;background:${UP};color:${INK};font:800 76px Rupee;border:6px solid ${INK}` }, root, '₹');
        return C.reg(c, { hide: true });
      });
      // the tiles: each holds a clone of the finished stall, offset to its piece
      S.tiles = [];
      for (let r = 0; r < TILE.rows; r++) for (let c = 0; c < TILE.cols; c++) {
        const d = el('div', { style: `position:absolute;left:${BOX.x + c * TW}px;top:${BOX.y + r * TH}px;width:${TW}px;height:${TH}px;overflow:hidden;transform-origin:50% 50%` }, root);
        const sh = stall(false);
        sh.s.style.cssText = `position:absolute;left:${-c * TW}px;top:${-r * TH}px`; d.appendChild(sh.s);
        S.tiles.push({ d: C.reg(d, { hide: true }), c, r, n: (rnd() - 0.5) });
      }
      // the card: what you own
      S.card = C.reg(el('div', { class: 'card', style: `left:${X}px;top:${CARD.y}px;width:900px;height:270px` }, root), { hide: true });
      const cardIn = (html, x, y, css) => el('div', { style: `position:absolute;left:${x}px;top:${y}px;${css}` }, S.card, html);
      cardIn('YOU OWN', 40, 26, `font:700 22px Mono;letter-spacing:0.18em;color:${GREY}`);
      el('div', { style: `position:absolute;left:40px;top:72px;width:${TW * SLOT.s}px;height:${TH * SLOT.s}px;border-radius:12px;border:3px dashed #C9C4BA` }, S.card);
      cardIn('RAJU CHAI', 200, 70, `font:900 58px Display;font-stretch:62%;color:${INK};letter-spacing:0.02em`);
      cardIn('1 share of 100', 200, 140, `font:700 34px Mono;color:${GREY}`);
      S.price = C.reg(cardIn('₹100', 600, 66, `font:800 72px Mono, Rupee;color:${INK};font-variant-numeric:tabular-nums`));
      S.chip = C.reg(el('div', { class: 'pill', style: `left:600px;top:158px;height:52px;padding:0 20px 0 54px;background:${UP};color:${INK};font:800 28px Mono` }, S.card, '+80%'), { hide: true });
      const t1 = tri(true, 24, INK); t1.style.left = '20px'; t1.style.top = '14px'; S.chip.appendChild(t1);
      S.spark = el('canvas', { width: 820, height: 40, style: 'position:absolute;left:40px;top:216px;width:820px;height:40px' }, S.card);
      // copy (top zone): a small hairline lead-in + one or two big condensed lines
      const top = 470, big = 550;
      const sm = (s) => line(root, s, X, top, 64, 'wide hair', INK), bg = (s, y = big, c = INK, z = 200) => line(root, s, X, y, z, 'cond', c);
      S.t = {
        this_: sm('This is'), raju: bg('Raju.', big, INK, 230),
        sells: line(root, 'He sells chai.', X + 4, 790, 64, 'wide hair', INK),
        wants: sm('He wants a'), bigger: bg('bigger shop.', big, INK, 180),
        needs: sm('But he needs'), money: bg('money.', big, INK, 230),
        cuts: sm('So he cuts it into'), pieces: bg('100 pieces.'),
        each: line(root, 'Each piece is a', X, top, 56, 'wide hair', INK),
        buy1: sm('You buy 1 piece'), buy2: bg('for ₹100.', big, INK, 210),
        own1: sm('Now this piece is'), own2: bg('yours.', big, UPINK, 230),
        does: sm('Shop does well?'), gr1: bg('Your share', big, INK, 190), gr2: bg('grows.', big + 180, UPINK, 190),
      };
      S.t.buy2.el.style.fontFamily = 'Display, Rupee';
      S.share = line(root, 'SHARE.', X, big - 10, 300, 'cond outline', INK); S.share.el.style.setProperty('--stroke', INK);
      S.shareFill = C.reg(line(root, 'SHARE.', X, big - 10, 300, 'cond', UPINK).el);
    },
    run(t, b, S) {
      put(S.panel, { clip: `inset(${(100 * (1 - spHit(t, 'raju', 'default'))).toFixed(2)}% 0 0 0)` });
      // build the stall piece by piece; it grows a little when Raju dreams bigger; the tiles take over on the split
      const parts = ['body', 'kettle', 'cups', 'awn', 'sign'];
      const dream = sp(t, 7.2, 'default') * (1 - sp(t, 10.8, 'default'));
      parts.forEach((k, i) => { const p = spHit(t, 4.25 + i * 0.25, 'snappy'); put(S.shop.g[k], { hide: b < 4.2 || b >= 11.5, css: { transform: `scale(${(0.6 + 0.4 * p).toFixed(4)}, ${p.toFixed(4)})` } }); });
      put(S.shop.g.steam, { hide: b < 5.2 || b >= 11.5, y: -6 * Math.sin(t * 3.1), o: 0.55 + 0.45 * Math.sin(t * 2.3) ** 2 });
      put(S.shopBox, { s: 1 - 0.16 * dream, css: { transformOrigin: '50% 100%' } });
      const gk = spHit(t, 7.25, 'default'), gout = sp(t, 11.2, 'snappy');
      put(S.ghost, { hide: b < 7 || gout > 0.99, sx: 0.7 + 0.3 * gk, sy: Math.max(0.001, gk * (1 - gout)) });
      S.coins.forEach((c, i) => { const p = spHit(t, 9.3 + i * 0.3, 'snappy'), out = sp(t, 10.8, 'snappy'); put(c, { hide: b < 9 || out > 0.99, s: Math.max(0.001, p * (1 - out)), css: { transformOrigin: '50% 50%' } }); });
      // tiles: separate on the split, your tile flies to the card
      const cx = BOX.x + BOX.w / 2, cy = BOX.y + BOX.h / 2;
      const fly = spHit(t, 'lift', 'default'), dim = sp(t, 17.2, 'default');
      S.tiles.forEach((T) => {
        const ox = BOX.x + T.c * TW + TW / 2, oy = BOX.y + T.r * TH + TH / 2;
        const d = Math.hypot(ox - cx, oy - cy) / 400, k = spHit(t, 11.5 + d * 0.6, 'snappy');
        let x = (ox - cx) * 0.22 * k, y = (oy - cy) * 0.22 * k, s = 1 - 0.14 * k, r = T.n * 14 * k;
        const mine = T.c === MINE.c && T.r === MINE.r;
        let o = 1;
        if (mine && b >= 16.6) {
          const lift = sp(t, 16.6, 'snappy');
          s *= 1 + 0.35 * lift;
          const tx = SLOT.x + TW * SLOT.s / 2 - ox, ty = SLOT.y + TH * SLOT.s / 2 - oy;
          x = lerp(x, tx, fly); y = lerp(y - 40 * lift, ty, fly); s = lerp(s, SLOT.s, fly); r = lerp(r, 0, fly);
        } else if (b >= 17) o = 1 - 0.85 * dim;
        put(T.d, { hide: b < 11.5, x, y, s, r, o, css: mine ? { zIndex: 5, boxShadow: `0 ${(24 * sp(t, 16.6, 'snappy')).toFixed(1)}px 40px rgba(0,0,0,0.25)` } : {} });
      });
      // the card rises as you buy; the price counts up when the shop does well
      const cardIn = spHit(t, 16.8, 'default');
      put(S.card, { hide: b < 16.6, y: 420 * (1 - cardIn) });
      const g = clamp(sp(t, 'count', 'heavy') / 0.995);
      put(S.price, { text: `₹${Math.round(100 + 80 * g)}`, css: { color: b >= 21 ? UPINK : INK } });
      const ch = spHit(t, 21.6, 'snappy'); put(S.chip, { hide: b < 21.5, s: 0.6 + 0.4 * ch, css: { transformOrigin: '0 50%' } });
      const sc = S.spark.getContext('2d'); sc.clearRect(0, 0, 820, 40);
      const n = Math.floor(seg(t, 'count', 22.6) * 60);
      if (n > 1) { sc.strokeStyle = UPINK; sc.lineWidth = 4; sc.lineJoin = 'round'; sc.beginPath(); for (let i = 0; i <= n; i++) { const u = i / 60, v = u + Math.sin(i * 1.7) * 0.05; sc[i ? 'lineTo' : 'moveTo'](u * 816 + 2, 36 - v * 32); } sc.stroke(); }
      // copy: each line leaves ~0.35 beats before the next one lands
      const T = S.t;
      R(t, T.this_, 4.2, 6.65); R(t, T.raju, 4.4, 6.65, { preset: 'snappy' }); R(t, T.sells, 'sells', 6.65, { stagger: 0.1 });
      R(t, T.wants, 'grow', 8.65); R(t, T.bigger, 7.2, 8.65, { preset: 'snappy' });
      R(t, T.needs, 'money', 10.65); R(t, T.money, 9.2, 10.65, { preset: 'snappy' });
      R(t, T.cuts, 'split', 13.65); R(t, T.pieces, 11.2, 13.65, { preset: 'snappy' });
      R(t, T.each, 'share', 16.15, { stagger: 0.05 });
      R(t, S.share, 14.25, 16.15, { preset: 'snappy' });
      put(S.shareFill, { clip: `inset(0 ${(100 * (1 - spHit(t, 'fill', 'default'))).toFixed(2)}% 0 0)`, hide: b < 14.8 || b >= 16.15 });
      R(t, T.buy1, 'buy', 18.15); R(t, T.buy2, 16.7, 18.15, { preset: 'snappy' });
      R(t, T.own1, 'own', 20.15, { stagger: 0.05 }); R(t, T.own2, 18.8, 20.15, { preset: 'snappy' });
      R(t, T.does, 'up', 22.65); R(t, T.gr1, 20.75, 22.65, { preset: 'snappy' }); R(t, T.gr2, 21.0, 22.65, { preset: 'snappy' });
    },
  });

  // ------------------------------------------------------------------ b23–b25.25 "Where do people buy pieces?" (typewriter)
  scene({
    name: 'where', from: 'where', to: 'exch',
    build(root, S) {
      S.l1 = el('div', { class: 'mono', style: `position:absolute;left:${X}px;top:820px;font-size:96px;font-weight:800;color:${WHITE}` }, root, '');
      S.l2 = el('div', { class: 'mono', style: `position:absolute;left:${X}px;top:940px;font-size:96px;font-weight:800;color:${UP}` }, root, '');
      S.caret = C.reg(el('div', { style: `position:absolute;left:0;top:0;width:50px;height:108px;background:${UP}` }, root));
      C.reg(S.l1); C.reg(S.l2);
    },
    run(t, b, S) {
      const a = 'Where do people', z = 'buy pieces?';
      const n1 = TYPE.type(t, S.l1, a, 23.05, 23.75), n2 = TYPE.type(t, S.l2, z, 23.85, 24.35);
      const onSecond = b >= 23.85, n = onSecond ? n2 : n1, row = onSecond ? 940 : 820;
      const blink = b < 24.35 || Math.floor(b * 2) % 2 === 0;
      put(S.caret, { x: X + n * 96 * 0.6 + 8, y: row + 8, hide: !blink || b >= 25.1 });
    },
  });

  // ------------------------------------------------------------------ b25.25–b28 the stock market (NSE, BSE: a mandi for shares)
  const TICK = [['RAJUCHAI', '+2.1%'], ['PIXELTECH', '−0.8%'], ['ROTIBROS', '+1.4%'], ['SOLARSUN', '+3.2%'], ['PAPERCO', '−1.1%'], ['ZINGFOODS', '+0.6%'], ['METROBIKE', '−2.3%'], ['CLOUDNINE', '+0.9%']];
  scene({
    name: 'exch', from: 'exch', to: 'buyers',
    build(root, S) {
      S.a = line(root, 'On the', X + 4, 470, 64, 'wide hair');
      S.b = line(root, 'Stock', X, 545, 300, 'cond');
      S.c = line(root, 'market.', X, 820, 270, 'cond outline'); S.c.el.style.setProperty('--stroke', UP);
      S.chips = ['NSE', 'BSE'].map((s, i) => { const c = el('div', { class: 'pill', style: `left:0;top:0;height:84px;padding:0 34px;background:${UP};color:${INK};font:800 44px Mono` }, null, s); return maskBox(root, X + i * 210, 1110, 200, 90, c); });
      S.mandi = line(root, 'A mandi for shares.', X + 4, 1236, 60, 'wide hair');
      S.rows = [0, 1, 2].map((r) => {
        const row = el('div', { class: 'mono', style: `position:absolute;left:0;top:${1380 + r * 66}px;font-size:34px;font-weight:700;white-space:nowrap` }, root);
        row.innerHTML = Array.from({ length: 3 }, () => TICK.map((_, i) => { const [nm, v] = TICK[(i + r * 3) % TICK.length]; return `<span style="color:${WHITE}">${nm}</span>&nbsp;<span style="color:${v[0] === '+' ? UP : DOWN}">${v}</span>&nbsp;&nbsp;&nbsp;&nbsp;`; }).join('')).join('');
        return C.reg(row);
      });
    },
    run(t, b, S) {
      R(t, S.a, 25.25, 27.65); R(t, S.b, 25.25, 27.65, { preset: 'snappy' }); R(t, S.c, 25.45, 27.65, { preset: 'snappy' });
      S.chips.forEach((m, i) => rise1(t, m, 26 + i * 0.3, 27.6));
      R(t, S.mandi, 26.5, 27.65, { stagger: 0.05 });
      S.rows.forEach((row, r) => { const v = (t - bt(25.25)) * (r % 2 ? 160 : -160) - 400; put(row, { x: v, hide: b < 25.5 }); });
    },
  });

  // ------------------------------------------------------------------ b28–b32 buyers vs sellers move the price
  const PRICE = (b) => {                                       // the price path (deterministic): up on buyers, down on sellers
    const up = clamp((b - 28.2) / 1.6), dn = clamp((b - 30.2) / 1.6);
    return 100 + 24 * (1 - Math.pow(1 - up, 2)) - 27 * (1 - Math.pow(1 - dn, 2)) + Math.sin(b * 9.1) * 0.5;
  };
  scene({
    name: 'market', from: 'buyers', to: 'recap',
    build(root, S) {
      S.u1 = line(root, 'More buyers →', X, 470, 64, 'wide hair'); S.u2 = line(root, 'price up', X, 550, 190, 'cond', UP);
      S.d1 = line(root, 'More sellers →', X, 470, 64, 'wide hair'); S.d2 = line(root, 'price down', X, 550, 190, 'cond', DOWN);
      S.labB = mono(root, 'BUYERS', X, 780, 36, UP, 'caps'); S.labS = mono(root, 'SELLERS', 640, 780, 36, DOWN, 'caps');
      const dot = (x, y, buyer) => C.reg(el('div', { style: `position:absolute;left:${x - 20}px;top:${y - 20}px;width:40px;height:40px;border-radius:50%;box-sizing:border-box;${buyer ? `background:${UP}` : `border:6px solid ${DOWN}`};transform-origin:50% 50%` }, root), { hide: true });
      const crowd = (x0, x1, n, buyer, seed) => { const r = C.mulberry32(seed), out = []; for (let i = 0; i < n; i++) out.push(dot(x0 + 30 + r() * (x1 - x0 - 60), 870 + r() * 260, buyer)); return out; };
      S.buy0 = crowd(90, 450, 6, true, 7); S.buy1 = crowd(90, 450, 18, true, 8);
      S.sell0 = crowd(630, 990, 6, false, 9); S.sell1 = crowd(630, 990, 24, false, 10);
      S.price = el('div', { class: 'mono', style: `position:absolute;left:${X}px;top:1190px;font-size:132px;font-weight:800;color:${WHITE}` }, root, '₹100.00'); C.reg(S.price);
      S.up = C.reg(tri(true, 70, UP), { hide: true }); S.dn = C.reg(tri(false, 70, DOWN), { hide: true });
      [S.up, S.dn].forEach((e) => { root.appendChild(e); e.style.left = '840px'; e.style.top = '1232px'; });
      S.chart = C.canvas(root);
    },
    run(t, b, S) {
      R(t, S.u1, 28.05, 29.65); R(t, S.u2, 28.2, 29.65, { preset: 'snappy' });
      R(t, S.d1, 30.05, 31.5); R(t, S.d2, 30.2, 31.5, { preset: 'snappy' });
      R(t, S.labB, 28.1, 31.5); R(t, S.labS, 28.2, 31.5);
      const pop = (arr, at, every) => arr.forEach((d, i) => { const k = spHit(t, at + i * every, 'snappy'), o = sp(t, 31.55, 'snappy'); put(d, { hide: k < 0.01 || o > 0.99, s: Math.max(0.001, k * (1 - o)) }); });
      pop(S.buy0, 28.1, 0.04); pop(S.sell0, 28.15, 0.04); pop(S.buy1, 28.3, 0.05); pop(S.sell1, 30.2, 0.04);
      const bb = Math.round(t * C.FPS) / C.FPS, p = PRICE(C.beatAt(bb)), rising = b < 30, falling = b >= 30;
      const out = sp(t, 31.55, 'snappy');
      put(S.price, { text: `₹${p.toFixed(2)}`, css: { color: rising ? UP : DOWN }, y: 260 * out, hide: out > 0.99 });
      put(S.up, { hide: !rising }); put(S.dn, { hide: !falling || out > 0.5 });
      // the live line: white path (text tokens stay neutral), head dot in the colour of the move
      const ctx = S.chart; ctx.clearRect(0, 0, W, H);
      const b0 = 28, b1 = C.beatAt(bb); if (b1 > b0 && out < 0.5) {
        ctx.strokeStyle = WHITE; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.beginPath();
        const steps = Math.ceil((b1 - b0) * 16);
        for (let i = 0; i <= steps; i++) { const bx = b0 + (b1 - b0) * i / steps, x = X + (bx - b0) / (32 - b0) * 860, y = 1500 - (PRICE(bx) - 95) * 5.2; ctx[i ? 'lineTo' : 'moveTo'](x, y); }
        ctx.stroke();
        const hx = X + (b1 - b0) / (32 - b0) * 860, hy = 1500 - (p - 95) * 5.2;
        ctx.fillStyle = rising ? UP : DOWN; ctx.beginPath(); ctx.arc(hx, hy, 12, 0, Math.PI * 2); ctx.fill();
      }
    },
  });

  // ------------------------------------------------------------------ b32–b38 recap cards
  scene({
    name: 'recap', from: 31.4, to: 'thats',
    build(root, S) {
      const card = (y, label, l1, l2) => {
        const c = C.reg(el('div', { class: 'card', style: `left:${X}px;top:${y}px;width:900px;height:360px;background:${PAPER}` }, root), { hide: true });
        const a = mono(root, label, X + 48, y + 36, 34, UPINK, 'caps'), b1 = line(root, l1, X + 42, y + 92, 128, 'cond', INK), b2 = line(root, l2, X + 42, y + 214, 128, 'cond', INK);
        return { c, a, b1, b2 };
      };
      S.c1 = card(500, 'Share =', 'A piece of', 'a company.');
      S.c2 = card(900, 'Stock market =', 'Where you', 'buy shares.');
    },
    run(t, b, S) {
      [[S.c1, 31.85], [S.c2, 35]].forEach(([k, at]) => {
        const p = spHit(t, at, 'default');
        put(k.c, { hide: b < at - 0.4 || sp(t, 37.45, 'snappy') > 0.96, y: 900 * (1 - p), clip: b >= 37.45 ? `inset(${(100 * sp(t, 37.45, 'snappy')).toFixed(1)}% 0 0 0 round 30px)` : undefined });
        R(t, k.a, at + 0.15, 37.5); R(t, k.b1, at + 0.25, 37.5, { preset: 'snappy' }); R(t, k.b2, at + 0.4, 37.5, { preset: 'snappy' });
      });
    },
  });

  // ------------------------------------------------------------------ the HUD: series label + live 30 s countdown (snap → done = 30.0 s)
  const remaining = (t) => 30 * clamp(1 - (Math.round(t * C.FPS) / C.FPS - bt('snap')) / (bt('done') - bt('snap')));
  const fmt = (r) => `00:${String(Math.floor(r + 1e-9)).padStart(2, '0')}.${Math.floor((r % 1) * 10 + 1e-9)}`;
  scene({
    name: 'hud', from: 'snap', to: 'thats',
    build(root, S) {
      S.timer = el('div', { class: 'mono', style: `position:absolute;left:${X}px;top:292px;font-size:52px;font-weight:800` }, root, '00:30.0'); C.reg(S.timer);
      S.track = el('div', { style: `position:absolute;left:290px;top:327px;width:660px;height:6px;background:rgba(139,144,153,0.35)` }, root); C.reg(S.track);
      S.bar = C.reg(el('div', { style: `position:absolute;left:290px;top:325px;width:660px;height:10px;background:${UP};transform-origin:0 50%` }, root));
      S.lab = mono(root, 'Stock Market 101 · EP 01 · Beginner', X + 2, 366, 26, GREY, 'caps');
    },
    run(t, b, S) {
      const r = remaining(t), on = b >= 3.3, paper = spHit(t, 'raju', 'default') > 0.8 && b < 23, out = sp(t, 37.8, 'snappy');
      const ink = paper ? INK : WHITE;
      put(S.timer, { text: fmt(r), hide: !on || out > 0.99, y: -120 * out, css: { color: ink } });
      put(S.track, { hide: !on || out > 0.99, y: -120 * out });
      put(S.bar, { hide: !on || out > 0.99, sx: Math.max(0.0001, r / 30), y: -120 * out, css: { background: paper ? UPINK : UP } });
      R(t, S.lab, 3.4, 37.8);
      put(S.lab.el, { css: { color: paper ? '#6F6A60' : GREY } });
    },
  });

  // ------------------------------------------------------------------ b38–b44 the last seconds, DONE., next episode
  scene({
    name: 'finale', from: 37.6, to: 'end',
    build(root, S) {
      S.th = line(root, 'That’s it.', X, 600, 70, 'wide hair');
      S.big = el('div', { class: 'mono', style: `position:absolute;left:${X}px;top:760px;font-size:190px;font-weight:800;color:${WHITE}` }, root, '00:02.0'); C.reg(S.big);
      S.done = line(root, 'Done.', X - 6, 820, 260, 'wide', UP); S.done.el.style.fontWeight = 900;
      S.next = mono(root, 'Next · EP 02', X + 4, 500, 32, UP, 'caps');
      S.n1 = line(root, 'Sensex &', X, 560, 230, 'cond'); S.n2 = line(root, 'Nifty.', X, 780, 230, 'cond', UP);
      const chip = el('div', { class: 'pill', style: `left:0;top:0;height:86px;padding:0 40px;background:${UP};color:${INK};font:800 34px Mono;letter-spacing:0.08em` }, null, 'FOLLOW FOR PART 2');
      S.chip = maskBox(root, X, 1060, 700, 96, chip);
      S.levels = ['Beginner', 'Intermediate', 'Advanced'].map((s, i) => {
        const w = [250, 330, 270][i], x = X + [0, 262, 604][i];
        const seg_ = C.reg(el('div', { style: `position:absolute;left:${x}px;top:1210px;width:${w}px;height:10px;border-radius:5px;background:${i ? 'rgba(139,144,153,0.35)' : UP};transform-origin:0 50%` }, root), { sx: 0 });
        const lab = mono(root, s, x, 1236, 26, i ? GREY : UP, 'caps');
        return { seg_, lab };
      });
      S.disc = mono(root, 'For education only. Not investment advice.', X, 1452, 28, GREY);
    },
    run(t, b, S) {
      R(t, S.th, 37.75, 39.7, { stagger: 0.08 });
      const r = remaining(t);
      put(S.big, { text: fmt(r), hide: b >= 40.02, y: 260 * (1 - spHit(t, 37.7, 'default')), css: { color: b >= 39 ? UP : WHITE } });
      R(t, S.done, 'done', 40.85, { preset: 'snappy' });
      const k = 1 + 0.06 * (b >= 40 ? 1 - sp(t, 'done', 'snappy') : 0); put(S.done.el, { s: k });
      R(t, S.next, 40.55, null); R(t, S.n1, 'cta', null, { preset: 'snappy' }); R(t, S.n2, 41.2, null, { preset: 'snappy' });
      rise1(t, S.chip, 41.6, null);
      S.levels.forEach((L, i) => { put(L.seg_, { sx: spHit(t, 41.9 + i * 0.15, 'snappy') }); R(t, L.lab, 42 + i * 0.15, null); });
      R(t, S.disc, 42.3, null);
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

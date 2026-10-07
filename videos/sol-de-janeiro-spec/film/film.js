// Sol de Janeiro · Cheirosa perfume mists — "departures." A spec reel built from the brand's own packshots (cut out in
// code), its home film and its product-page copy (soldejaneiro.com), to Mixkit's "Latin Lovers" (135 bpm). 9:16, 28.7 s.
// The idea is already in the product: every Cheirosa number is a year in Rio (59 = 1959, bossa nova; 62 = 1962, the girl
// from Ipanema …). So the perfume is a time machine and the reel is a departures board: a split-flap year flips back
// from 2026, the board lists ten flights, four of them board in time order (1948, 1959, 1962, 1976), six more fly by,
// pick your year.
(() => {
  const { W, H, bt, sp, spHit, clamp, lerp, put, el, scene, trk } = C;
  C.fonts = ['600 100px Display', '500 100px Display', '600 100px UI'];
  const X = 90;
  const INK = '#212722', PAPER = '#F5F5F5', YELLOW = '#FFB600', WHITE = '#FFFFFF', FLAP = '#2C332E';
  const SOFT = '0 2px 16px rgba(0,0,0,0.28)';
  const POP = (k) => 0.3 + 0.7 * k;
  const R = (x, y, w, h) => ({ x, y, w, h });
  const line = (parent, text, x, y, size, o = {}) => TYPE.line(parent, text, { x, y, size, cls: o.cls || 'display', color: o.color });
  const rise = TYPE.rise;

  // ------------------------------------------------------------------ the flights (soldejaneiro.com product pages)
  const YEARS = {
    40: { y: '1840', ev: 'CARNAVAL BALL', field: '#EE5F66' }, 39: { y: '1939', ev: 'CARMEN MIRANDA', field: '#22AE97' },
    48: { y: '1948', ev: 'THE BIKINI', field: '#E4528D' }, 59: { y: '1959', ev: 'BOSSA NOVA', field: '#7560B5' },
    62: { y: '1962', ev: 'IPANEMA', field: '#F2961C' }, 68: { y: '1968', ev: 'TROPICALIA', field: '#EF7F92' },
    71: { y: '1971', ev: 'DOCE DE LEITE', field: '#E2852B' }, 76: { y: '1976', ev: 'DISCO NIGHTS', field: '#2D8DD5' },
    87: { y: '1987', ev: 'COPACABANA', field: '#E9BE16' }, 91: { y: '1991', ev: 'POP REMIXES', field: '#EC7A4F' },
  };
  const BOARD = [40, 39, 48, 59, 62, 68, 71, 76, 87, 91];
  const FLIGHTS = [
    { n: 48, A: 16, shot: 'beach', ink: WHITE, lines: ['THE YEAR THE', 'BIKINI WAS FIRST', 'SPOTTED IN BRAZIL.'], notes: 'guava nectar · sunlit orchid · vanilla · pink musk' },
    { n: 59, A: 24, shot: 'orchid', ink: WHITE, lines: ['JOÃO GILBERTO', 'RELEASES CHEGA', 'DE SAUDADE.'], notes: 'vanilla orchid · sugared violet · sandalwood' },
    { n: 62, A: 32, shot: 'jersey', ink: INK, lines: ['THE SUMMER WE', 'FELL FOR THE GIRL', 'FROM IPANEMA.'], notes: 'pistachio · salted caramel · jasmine · vanilla' },
    { n: 76, A: 40, shot: 'dance', ink: WHITE, lines: ['THE RHYTHM', 'OF RIO AFTER', 'HOURS.'], notes: 'black currant · midnight jasmine · amber woods' },
  ];
  const FAST = [40, 39, 68, 71, 87, 91].map((n, j) => ({ n, B: 48 + j }));
  const BOT = {}, loads = [];
  for (const n of BOARD) { const im = new Image(); loads.push(new Promise((ok) => { im.onload = im.onerror = () => ok(); })); im.src = `../assets/cut/${n}.png`; BOT[n] = im; }
  function bottle(ctx, n, cx, cy, k, rot = 0) {
    const im = BOT[n]; if (!im || !im.naturalWidth || k <= 0.005) return;
    const w = im.naturalWidth * k, h = im.naturalHeight * k;
    ctx.save(); ctx.translate(cx, cy); if (rot) ctx.rotate(rot * Math.PI / 180); ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
  }

  // ------------------------------------------------------------------ split-flap engine (canvas, so every frame is exact)
  // A cell steps through its ring one flap at a time (dt seconds a flap) from each key's time. Within a flap the top half
  // falls (accelerating) and the bottom half lands (decelerating); the moving flap darkens as it turns away.
  const RING = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.·?-ÃÕ';
  const DIGITS = ' 0123456789?';
  function flapAt(keys, t, dt, ring = RING) {
    const RING = ring;
    let cur = RING.indexOf(keys[0][1]);
    for (let i = 1; i < keys.length; i++) {
      const [ts, ch] = keys[i]; if (t < ts) break;
      const tgt = RING.indexOf(ch), steps = (tgt - cur + RING.length) % RING.length, done = (t - ts) / dt;
      if (done >= steps) { cur = tgt; continue; }
      const k = Math.floor(done);
      return { cur: RING[(cur + k) % RING.length], next: RING[(cur + k + 1) % RING.length], u: done - k };
    }
    return { cur: RING[cur], next: null, u: 0 };
  }
  const capCache = {};
  function drawFlap(ctx, x, y, w, h, st, o) {
    const r = Math.min(12, w * 0.09), mid = y + h / 2;
    ctx.font = o.font; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    const cap = capCache[o.font] ?? (capCache[o.font] = ctx.measureText('H').actualBoundingBoxAscent);
    const half = (ch, top, sy = 1, shade = 0) => {
      ctx.save();
      ctx.beginPath(); ctx.rect(x - 1, top ? y - 1 : mid, w + 2, h / 2 + 1); ctx.clip();
      if (sy !== 1) { ctx.translate(0, mid); ctx.scale(1, Math.max(sy, 0.002)); ctx.translate(0, -mid); }
      ctx.fillStyle = o.bg; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
      if (ch && ch !== ' ') { ctx.fillStyle = o.color; ctx.fillText(ch, x + w / 2, mid + cap / 2); }
      if (shade > 0.003) { ctx.fillStyle = `rgba(0,0,0,${shade.toFixed(3)})`; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); }
      ctx.restore();
    };
    if (!st.next) { half(st.cur, true); half(st.cur, false); }
    else if (st.u < 0.5) { const s = 1 - Math.pow(st.u / 0.5, 2); half(st.next, true); half(st.cur, false); half(st.cur, true, s, (1 - s) * 0.45); }
    else { const s = 1 - Math.pow(1 - (st.u - 0.5) / 0.5, 2); half(st.next, true); half(st.cur, false); half(st.next, false, s, (1 - s) * 0.45); }
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(x, mid - 1.5, w, 3);
  }
  // keys for a row of cells: [[beat, text], ...] → per cell [[time, char], ...]; stagger per column (seconds)
  function rowKeys(changes, n, stagger) {
    return Array.from({ length: n }, (_, c) => [[-1e9, (changes[0][1][c] || ' ')], ...changes.slice(1).map(([b, s]) => [bt(b) + c * stagger, s[c] || ' '])]);
  }

  // ------------------------------------------------------------------ background (the board's ink)
  scene({
    name: 'bg', from: 'hook', to: 'done',
    build(root, S) { S.base = C.reg(el('div', { class: 'fill' }, root)); },
    run(t, b, S) { put(S.base, { css: { backgroundImage: `linear-gradient(${INK}, ${INK})`, backgroundPosition: `${Math.round(t * 1e4)}px 0px` } }); },
  });

  // ------------------------------------------------------------------ the hook: this perfume is a time machine
  const HOOK_FL = R(110, 560, 200, 300);
  const hookYear = rowKeys([[0, '2026'], ['flipback', '1962']], 4, 0.09);
  scene({
    name: 'hook', from: 'hook', to: 'board',
    build(root, S) {
      S.ctx = C.canvas(root);
      S.l1 = line(root, 'this perfume', X, 200, 104, { color: WHITE });
      S.l2 = line(root, 'is a time machine.', X, 316, 104, { color: YELLOW });
      S.lab = line(root, 'cheirosa 62  =  rio, 1962', X + 20, 900, 38, { cls: 'ui caps', color: WHITE });
      S.every = line(root, 'every number is a year.', X + 20, 960, 38, { cls: 'ui caps', color: YELLOW });
    },
    run(t, b, S) {
      rise(t, S.l1, -1, 7.6, { stagger: 0.08 });
      rise(t, S.l2, -1, 7.6, { stagger: 0.08 });
      rise(t, S.lab, 3.4, 7.6, { stagger: 0.05, preset: 'default' });
      rise(t, S.every, 5, 7.6, { stagger: 0.06, preset: 'default' });
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      const out = -1500 * sp(t, 7.55, 'snappy');
      ctx.save(); ctx.translate(0, out);
      for (let c = 0; c < 4; c++) drawFlap(ctx, HOOK_FL.x + c * (HOOK_FL.w + 20), HOOK_FL.y, HOOK_FL.w, HOOK_FL.h, flapAt(hookYear[c], t, 0.045, DIGITS), { font: '600 250px Display', bg: FLAP, color: WHITE });
      ctx.restore();
      // the bottle lands like a plane, then takes off
      const k = spHit(t, 'h62', 'heavy'), off = sp(t, 7.4, 'snappy');
      if (k > 0.01) bottle(ctx, 62, lerp(-200, 540, k) + 1300 * off, lerp(2300, 1430, k) - 1900 * off, 0.6, lerp(40, 6, k) - 30 * off);
    },
  });

  // ------------------------------------------------------------------ the departures board
  const ROW = (n) => { const Y = YEARS[n]; return `${n} ${Y.y} ${Y.ev}`.padEnd(22, ' '); };
  const HEAD = rowKeys([[0, '          '], [8.05, 'DEPARTURES']], 10, 0.03);
  const ROWS = BOARD.map((n, r) => rowKeys(n === 48 ? [[0, ''], [8.4 + r * 0.32, ROW(n)], ['boarding', `48 1948 NOW BOARDING  `]] : [[0, ''], [8.4 + r * 0.32, ROW(n)]], 22, 0.014));
  scene({
    name: 'board', from: 'board', to: 17,
    build(root, S) {
      S.ctx = C.canvas(root);
      S.sub = line(root, 'rio de janeiro  ·  cheirosa', X - 10, 312, 30, { cls: 'ui caps', color: '#9AA39B' });
      S.cols = line(root, 'no.   year     flight', 38, 364, 22, { cls: 'ui caps', color: '#7E877F' });
      S.ten = line(root, '10 scents. 10 years. 1 city.', X - 10, 1180, 70, { color: WHITE });
    },
    run(t, b, S) {
      rise(t, S.sub, 8.4, 15.6, { stagger: 0.05, preset: 'default' });
      rise(t, S.cols, 8.6, 15.6, { stagger: 0.05, preset: 'default' });
      rise(t, S.ten, 12, 15.6, { stagger: 0.08 });
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      for (let c = 0; c < 10; c++) drawFlap(ctx, 80 + c * 92, 170, 84, 120, flapAt(HEAD[c], t, 0.02), { font: '600 92px Display', bg: FLAP, color: YELLOW });
      ROWS.forEach((cells, r) => {
        const boarding = BOARD[r] === 48 && t >= bt('boarding');
        cells.forEach((keys, c) => drawFlap(ctx, 34 + c * 46, 400 + r * 74, 42, 64, flapAt(keys, t, 0.022), { font: '600 46px Display', bg: FLAP, color: boarding ? YELLOW : PAPER }));
      });
      // the fleet: ten bottles hop onto the tarmac
      BOARD.forEach((n, i) => {
        const p = spHit(t, 10 + i * 0.12, 'default'); if (p < 0.02) return;
        const settled = p > 0.999;
        bottle(ctx, n, 40 + 50 + i * 100, settled ? 1450 : 1450 + 120 * (1 - p), 0.22 * POP(p));
      });
    },
  });

  // ------------------------------------------------------------------ the flights (and the six fast ones)
  const YFL = R(110, 170, 200, 300);
  const yearChanges = [[0, '    '], [16.2, '1948'], [24, '1959'], [32, '1962'], [40, '1976'], ...FAST.map((f) => [f.B, YEARS[f.n].y]), [54, '19??']];
  const YEARK = rowKeys(yearChanges, 4, 0.03);
  const WIN = R(X, 600, 380, 500);
  const fieldAt = (b) => {   // [previous colour, colour, wipe start beat, origin]
    if (b >= 54) return { prev: YEARS[91].field, cur: YELLOW, A: 54, ox: 540, oy: 2100 };
    const f = [...FLIGHTS.map((F) => ({ n: F.n, A: F.A })), ...FAST.map((F) => ({ n: F.n, A: F.B }))].filter((F) => b >= F.A).pop();
    const all = [...FLIGHTS.map((F) => F.n), ...FAST.map((F) => F.n)], i = all.indexOf(f.n);
    return { prev: i ? YEARS[all[i - 1]].field : null, cur: YEARS[f.n].field, A: f.A, ox: -200, oy: 2200 };
  };
  scene({
    name: 'flights', from: 'f1', to: 'done',
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      // the field: each flight's colour grows from where its bottle comes in
      const F = fieldAt(b), k = sp(t, F.A, 'default');
      if (F.prev) { ctx.fillStyle = F.prev; ctx.fillRect(0, 0, W, H); }
      ctx.fillStyle = F.cur; ctx.beginPath(); ctx.arc(F.ox, F.oy, 2900 * k, 0, Math.PI * 2); ctx.fill();
      // the year
      const yOut = b >= 54 ? 0 : 0;
      for (let c = 0; c < 4; c++) drawFlap(ctx, YFL.x + c * (YFL.w + 20), YFL.y + yOut, YFL.w, YFL.h, flapAt(YEARK[c], t, 0.025, DIGITS), { font: '600 250px Display', bg: INK, color: WHITE });
      // the window seat: a slice of today's Rio (the brand's film) through a plane window
      FLIGHTS.forEach((Fl) => {
        const p = spHit(t, Fl.A + 1, 'default'), q = sp(t, Fl.A + 7.45, 'snappy');
        if (p < 0.02 || q > 0.98 || b >= Fl.A + 8) return;
        const s = POP(p) * (1 - 0.7 * q), cx = WIN.x + WIN.w / 2, cy = WIN.y + WIN.h / 2;
        ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy);
        ctx.fillStyle = '#F3EEE6'; ctx.beginPath(); ctx.roundRect(WIN.x - 26, WIN.y - 26, WIN.w + 52, WIN.h + 52, (WIN.w + 52) / 2); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.roundRect(WIN.x - 6, WIN.y - 6, WIN.w + 12, WIN.h + 12, (WIN.w + 12) / 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(WIN.x, WIN.y, WIN.w, WIN.h, WIN.w / 2); ctx.clip();
        const m = FOOT.SH[Fl.shot], tt = Math.round(t * C.FPS) / C.FPS;
        const f = clamp((tt - bt(Fl.A + 0.6)) / (bt(Fl.A + 8) - bt(Fl.A + 0.6))) * (m.n - 1);
        FOOT.paint(ctx, Fl.shot, f, { r: WIN, blend: true });
        ctx.restore();
      });
      // the bottles land from the bottom left and take off to the top right
      FLIGHTS.forEach((Fl) => {
        if (b < Fl.A - 0.2 || b > Fl.A + 8.2) return;
        const kin = spHit(t, Fl.A, 'heavy'), kout = sp(t, Fl.A + 7.4, 'snappy');
        const x = lerp(-260, 770, kin) + 1100 * kout, y = lerp(2300, 1070, kin) - 1900 * kout;
        bottle(ctx, Fl.n, x, y, 0.78, lerp(38, 7, kin) - 32 * kout);
      });
      FAST.forEach((Fa) => {
        if (b < Fa.B - 0.2 || b > Fa.B + 1.2) return;
        const kin = spHit(t, Fa.B, 'snappy'), kout = sp(t, Fa.B + 0.82, 'snappy');
        bottle(ctx, Fa.n, lerp(-200, 760, kin) + 1000 * kout, lerp(2200, 1100, kin) - 1800 * kout, 0.7, lerp(35, 7, kin) - 30 * kout);
      });
      // the end: all ten line up
      if (b >= 54) BOARD.forEach((n, i) => {
        const p = spHit(t, 54.6 + i * 0.12, 'default'); if (p < 0.02) return;
        const hop = -46 * (sp(t, 60.2 + i * 0.07, 'snappy') - sp(t, 60.55 + i * 0.07, 'default'));   // a last wave down the line
        bottle(ctx, n, 75 + i * 103, p > 0.999 && Math.abs(hop) < 0.01 ? 1050 : 1050 + 200 * (1 - p) + hop, 0.3 * POP(p));
      });
    },
  });

  // ------------------------------------------------------------------ words over the flights
  scene({
    name: 'words', from: 'f1', to: 'done',
    build(root, S) {
      S.rio = line(root, 'rio de janeiro', X + 20, 496, 30, { cls: 'ui caps', color: WHITE });
      S.fl = FLIGHTS.map((F) => ({
        lines: F.lines.map((s, i) => line(root, s, X, 1190 + i * 84, 78, { color: F.ink })),
        lab: line(root, 'smells like', X + 2, 1478, 26, { cls: 'ui caps', color: F.ink }),
        notes: line(root, F.notes, X, 1518, 38, { cls: 'ui', color: F.ink }),
      }));
      S.fast = FAST.map((F) => line(root, YEARS[F.n].ev + '.', X, 1300, 92, { color: WHITE }));
      S.also = line(root, 'also departing:', X + 20, 1190, 34, { cls: 'ui caps', color: WHITE });
      S.pick = line(root, 'pick your year.', X, 530, 110, { color: INK });
      S.mists = line(root, 'cheirosa perfume mists  ·  from $26', X + 4, 1300, 36, { cls: 'ui caps', color: INK });
      const LW = 600, LH = Math.round(LW * 22 / 163);
      const box = el('div', { style: `position:absolute;left:${(W - LW) / 2}px;top:1430px;width:${LW}px;height:${LH + 8}px;overflow:hidden` }, root);
      S.logo = C.reg(el('img', { src: '../assets/brand/sdj-logo-ink.svg', style: `position:absolute;left:0;top:0;width:${LW}px;height:${LH}px` }, box), { y: 0 });
      S.logoH = LH + 8;
    },
    run(t, b, S) {
      put(S.rio.el, { css: { color: b >= 32 && b < 40 ? INK : b >= 54 ? INK : WHITE } });
      rise(t, S.rio, 16.4, 53.75, { stagger: 0.05, preset: 'default' });
      S.fl.forEach((x, i) => {
        const A = FLIGHTS[i].A;
        x.lines.forEach((L, j) => { put(L.el, { css: { textShadow: FLIGHTS[i].ink === WHITE ? SOFT : 'none' } }); rise(t, L, A + 1.6 + j * 0.35, A + 7.3, { stagger: 0.06 }); });
        rise(t, x.lab, A + 3.2, A + 7.3, { stagger: 0.04, preset: 'default' });
        rise(t, x.notes, A + 3.4, A + 7.3, { stagger: 0.05, preset: 'default' });
      });
      rise(t, S.also, 48.05, 53.8, { stagger: 0.05, preset: 'snappy' });
      S.fast.forEach((L, j) => { put(L.el, { css: { textShadow: SOFT } }); rise(t, L, FAST[j].B + 0.1, FAST[j].B + 0.82, { stagger: 0.05, preset: 'snappy' }); });
      rise(t, S.pick, 'pick', null, { stagger: 0.1 });
      rise(t, S.mists, 'price', null, { stagger: 0.04, preset: 'default' });
      const y = S.logoH * 1.15 * (1 - spHit(t, 'logo', 'heavy'));
      put(S.logo, { y, hide: y >= S.logoH * 1.149 });
    },
  });

  C.start();
  window.CUTS = [...new Set([...(window.CUTS || [])])].sort((a, b) => a - b);
  const ready0 = window.READY;
  window.READY = Promise.all([ready0, FOOT.ready, ...loads]).then(() => { window.seek(0); return true; });
})();

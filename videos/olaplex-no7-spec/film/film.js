// OLAPLEX Nº.7 Bonding Oil — "humidity vs your hair." A spec reel cut from the brand's own before/after films and
// creator clips (olaplex.com), to Lady Gaga's "Abracadabra" (temp track). 9:16, 24.2 s, 126 bpm.
// SMP: three drops and humidity loses. The device is a live match broadcast: humidity goes 3 – 0 up on three frizzy
// BEFOREs, then the brand's unretouched before/after replays pull your hair back, one point per after; on the song's
// lift the winner, full time 3 – 4: your hair wins. Script and footage tags: script.json / shots.json (playbook gate).
(() => {
  const { W, H, bt, sp, spHit, clamp, lerp, put, el, scene, trk } = C;
  C.fonts = ['800 100px Display', '900 100px Display', '600 100px UI'];
  const X = 70;
  const GROUND = '#0C0B0A', WHITE = '#FFFFFF', MUTE = '#B9B2A7', AMBER = '#F2B33D', PLATE = '#191714';
  const SOFT = '0 2px 22px rgba(0,0,0,0.55)';
  const R = (x, y, w, h) => ({ x, y, w, h });
  const line = (parent, text, x, y, size, o = {}) => TYPE.line(parent, text, { x, y, size, cls: o.cls || 'display', color: o.color || WHITE });
  const rise = TYPE.rise;
  const shade = (L) => put(L.el, { css: { textShadow: SOFT } });
  const BOTTLE = new Image(), loads = [new Promise((ok) => { BOTTLE.onload = BOTTLE.onerror = () => ok(); })];
  BOTTLE.src = '../assets/cut/no7.png';

  // ------------------------------------------------------------------ the picture: replays, creator clips, the bottle
  // Reels/TikTok UI covers the top 14 % (269 px), the bottom 20 % (from 1536 px) and the right 12 %: type stays inside
  const PANEL = R(0, 480, W, 760);                 // the replay screen under the scoreboard (films top-aligned: BEFORE / AFTER show)
  const FULL = R(0, 0, W, H);
  // shot k plays its frames over beats [b0, b1) (frozen outside), optional source offset
  function play(ctx, k, b0, b1, t, r, o = {}) {
    const m = FOOT.SH[k], tt = Math.round(t * C.FPS) / C.FPS;
    const span = o.rate ? (bt(b1) - bt(b0)) * o.rate * m.fps : m.n - 1;
    const f = clamp((o.from || 0) * m.fps + (tt - bt(b0)) / (bt(b1) - bt(b0)) * span, 0, m.n - 1);
    FOOT.paint(ctx, k, f, { r, blend: true, s: o.s, dy: o.dy });
  }
  function bottle(ctx, cx, cy, k, rot = 0) {
    if (!BOTTLE.naturalWidth || k <= 0.005) return;
    const w = BOTTLE.naturalWidth * k, h = BOTTLE.naturalHeight * k;
    ctx.save(); ctx.translate(cx, cy); if (rot) ctx.rotate(rot * Math.PI / 180); ctx.drawImage(BOTTLE, -w / 2, -h / 2, w, h); ctx.restore();
  }
  scene({
    name: 'bg', from: 'hook', to: 'done',
    build(root, S) { S.base = C.reg(el('div', { class: 'fill' }, root)); },
    // a new style on every seek: the whole frame re-rasterises (determinism)
    run(t, b, S) { put(S.base, { css: { backgroundImage: `linear-gradient(${GROUND}, ${GROUND})`, backgroundPosition: `${Math.round(t * 1e4)}px 0px` } }); },
  });
  scene({
    name: 'pic', from: 'hook', to: 'done',
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      if (b < 5) {                                                                                     // three BEFOREs: humidity scores on each
        const i = b < 2 ? 0 : b < 3.5 ? 1 : 2, A = [0, 2, 3.5][i], Z = [2, 3.5, 5][i];
        play(ctx, ['frizz', 'frizz2', 'frizz3'][i], A, Z, t, PANEL, { s: 1.04 + 0.05 * C.seg(t, A, Z), dy: 999 });
      }
      else if (b < 7.5) play(ctx, 'drops', 5, 7.5, t, FULL);                                           // drops into her palm
      else if (b < 8.5) play(ctx, 'work', 7.5, 8.5, t, FULL, { rate: 1 });                             // and through her hair
      else if (b < 13) {                                                                                // the hero lands
        const k = spHit(t, 8.5, 'heavy');
        bottle(ctx, 770, lerp(2300, 1010, k), 0.56, lerp(14, -5, k));
      } else if (b < 34) {
        const i = Math.floor((b - 13) / 7), A = 13 + 7 * i, shot = ['ba_curls', 'ba_copper', 'ba_waves'][i];
        // the after lands on A + 3; at A + 4.5 it takes the whole screen (the point is celebrated), the next replay cuts back in
        const k = spHit(t, A + 4.5, 'default');
        play(ctx, shot, A, A + 7, t, R(0, lerp(PANEL.y, 0, k), W, lerp(PANEL.h, H, k)), { from: 0.17, rate: 1, dy: 999 });
      } else if (b < 39) play(ctx, 'gloss', 34, 39, t, FULL, { rate: 1 });
      else if (b < 44) play(ctx, 'flip', 39, 44, t, FULL);
      else {
        const k = spHit(t, 44.2, 'heavy');
        bottle(ctx, 540, lerp(2400, 880, k), 0.74, lerp(-12, 0, k));
      }
    },
  });

  // ------------------------------------------------------------------ the scoreboard (one plate for the whole match)
  const DIG = 118;
  function odometer(parent, x, y, align) {
    const box = el('div', { class: 'mono', style: `position:absolute;${align}:${x}px;top:${y}px;height:${DIG}px;overflow:hidden;font-size:${DIG}px;line-height:1;font-weight:700;color:${WHITE}` }, parent);
    const col = C.reg(el('div', { style: 'position:relative' }, box));
    col.innerHTML = [0, 1, 2, 3, 4].map((n) => `<div style="height:${DIG}px">${n}</div>`).join('');
    return col;
  }
  scene({
    name: 'board', from: 'hook', to: 'cta',
    build(root, S) {
      S.wrap = C.reg(el('div', { style: `position:absolute;left:${X}px;top:280px;width:${W - 2 * X}px;height:184px;background:${PLATE};border-radius:26px;overflow:hidden` }, root));
      S.hl = el('div', { class: 'mono', style: `position:absolute;left:40px;top:26px;font-size:34px;color:${MUTE}` }, S.wrap, 'humidity');
      S.yl = el('div', { class: 'mono', style: `position:absolute;right:40px;top:26px;font-size:34px;color:${MUTE};text-align:right` }, S.wrap, 'your hair');
      S.h = odometer(S.wrap, 40, 68, 'left');
      S.y = odometer(S.wrap, 40, 68, 'right');
      S.dash = el('div', { class: 'mono', style: `position:absolute;left:0;width:100%;top:66px;text-align:center;font-size:${DIG}px;line-height:1;color:${MUTE}` }, S.wrap, '–');
      S.stMask = el('div', { style: 'position:absolute;left:0;width:100%;top:20px;height:46px;overflow:hidden' }, S.wrap);
      S.live = C.reg(el('div', { class: 'mono', style: `position:absolute;left:0;width:100%;top:4px;text-align:center;font-size:30px;color:${AMBER}` }, S.stMask, '● live'));
      S.ft = C.reg(el('div', { class: 'mono', style: `position:absolute;left:0;width:100%;top:4px;text-align:center;font-size:30px;color:${AMBER}` }, S.stMask, 'full time'));
    },
    run(t, b, S) {
      put(S.h, { y: -DIG * trk(t, [[0, 0], [0.5, 1, 'snappy'], [2, 2, 'snappy'], [3.5, 3, 'snappy']]) });   // humidity 3 – 0 in the hook
      put(S.y, { y: -DIG * trk(t, [[0, 0], [16 - 0.1, 1, 'snappy'], [23 - 0.1, 2, 'snappy'], [30 - 0.1, 3, 'snappy'], [34 - 0.1, 4, 'snappy']]) });
      const ft = spHit(t, 'payoff', 'snappy');
      put(S.live, { y: -46 * ft, hide: ft > 0.999 });
      put(S.ft, { y: 46 * (1 - ft), hide: ft < 0.001 });
      const out = sp(t, 43.6, 'snappy');
      put(S.wrap, { y: -560 * out, hide: out > 0.999 });
    },
  });

  // ------------------------------------------------------------------ words
  scene({
    name: 'words', from: 'hook', to: 'done',
    build(root, S) {
      S.h1 = line(root, 'humidity', X, 1262, 130, { cls: 'display black' });
      S.h2 = line(root, 'wins again.', X, 1392, 130, { cls: 'display black', color: AMBER });
      // a broadcast lower third: the line sits on the scoreboard's dark plate, so it reads over her white shirt
      S.plate = C.reg(el('div', { style: `position:absolute;left:${X - 34}px;top:1150px;width:760px;height:372px;background:${PLATE};border-radius:26px;transform-origin:0 50%` }, root), { sx: 0 });
      S.t1 = line(root, 'until', X, 1180, 120);
      S.t2 = line(root, '3 drops.', X, 1310, 160, { cls: 'display black', color: AMBER });
      S.no = line(root, 'Nº.7', X, 560, 230, { cls: 'display black', color: AMBER });
      S.bo1 = line(root, 'bonding', X, 830, 124);
      S.bo2 = line(root, 'oil.', X, 960, 124);
      S.dr = line(root, '2–3 drops', X + 4, 1130, 46, { cls: 'mono', color: MUTE });
      S.stats = [['125%', 'more shine*'], ['72 hr', 'frizz control'], ['77%', 'less breakage']].map(([n, l]) => ({
        n: line(root, n, X, 1300, 160, { cls: 'display black' }),          // white: the after fills the screen behind it
        l: line(root, l, X + 4, 1462, 70),
      }));
      S.legal = line(root, '*vs. bleached hair · unretouched · with Nº.4 + Nº.5 + Nº.7', X + 4, 1256, 26, { cls: 'mono', color: MUTE });
      // the result caption sits on the same broadcast plate (it reads over the blonde's white top)
      S.plate2 = C.reg(el('div', { style: `position:absolute;left:${X - 34}px;top:1080px;width:860px;height:440px;background:${PLATE};border-radius:26px;transform-origin:0 50%` }, root), { sx: 0 });
      S.w1 = line(root, 'your hair', X, 1110, 170, { cls: 'display black' });
      S.w2 = line(root, 'wins.', X, 1280, 200, { cls: 'display black', color: AMBER });
      const LW = 600, LH = Math.round(LW * 32 / 196);
      const box = el('div', { style: `position:absolute;left:${(W - LW) / 2}px;top:300px;width:${LW}px;height:${LH + 8}px;overflow:hidden` }, root);
      S.logo = C.reg(el('img', { src: '../assets/brand/olaplex-logo-white.svg', style: `position:absolute;left:0;top:0;width:${LW}px;height:${LH}px` }, box), { y: 0 });
      S.logoH = LH + 8;
      S.c1 = line(root, 'Nº.7 Bonding Oil', 0, 1330, 104);
      S.c2 = line(root, '$32  ·  olaplex.com', 0, 1452, 52, { cls: 'mono', color: AMBER });
    },
    run(t, b, S) {
      rise(t, S.h1, -1, 4.7, { stagger: 0.08 });
      rise(t, S.h2, -1, 4.7, { stagger: 0.08 });
      for (const L of [S.legal, ...S.stats.flatMap((x) => [x.n, x.l])]) shade(L);
      const pl2 = sp(t, 34.05, 'snappy') * (1 - sp(t, 43.6, 'snappy'));
      put(S.plate2, { sx: pl2, hide: pl2 < 0.001 });
      const pl = sp(t, 5.05, 'snappy') * (1 - sp(t, 8.2, 'snappy'));
      put(S.plate, { sx: pl, hide: pl < 0.001 });
      rise(t, S.t1, 5.25, 8.2);
      rise(t, S.t2, 5.75, 8.2, { stagger: 0.12 });
      rise(t, S.no, 8.75, 12.6);
      rise(t, S.bo1, 9.25, 12.6);
      rise(t, S.bo2, 9.5, 12.6);
      rise(t, S.dr, 10.25, 12.6, { stagger: 0.04, preset: 'default' });
      S.stats.forEach((x, i) => {
        const A = 13 + 7 * i;
        rise(t, x.n, A + 0.25, A + 6.6, { stagger: 0.1 });          // the claim first, its proof lands with the after
        rise(t, x.l, A + 3, A + 6.6, { stagger: 0.08 });
      });
      rise(t, S.legal, 16, 33.6, { stagger: 0.02, preset: 'default' });
      rise(t, S.w1, 34.25, 43.6, { stagger: 0.1 });
      rise(t, S.w2, 34.75, 43.6);
      const y = S.logoH * 1.15 * (1 - spHit(t, 45, 'heavy'));
      put(S.logo, { y, hide: y >= S.logoH * 1.149 });
      for (const L of [S.c1, S.c2]) put(L.el, { css: { left: '50%', transform: 'translateX(-50%)' } });
      rise(t, S.c1, 45.5, null, { stagger: 0.1 });
      rise(t, S.c2, 46.25, null, { stagger: 0.05, preset: 'default' });
    },
  });

  C.start();
  window.CUTS = [...new Set([...(window.CUTS || []), ...[2, 3.5, 5, 7.5, 8.5, 13, 20, 27, 34, 39, 44].map((x) => bt(x))])].sort((a, b) => a - b);
  const ready0 = window.READY;
  window.READY = Promise.all([ready0, FOOT.ready, ...loads]).then(() => { window.seek(0); return true; });
})();

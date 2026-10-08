// Glossier Ultralip — "the (cashmere) sweatpants of lipstick." A spec reel cut from Glossier's own Ultralip application
// films (glossier.com product page), to SZA's "Snooze" (temp track). 9:16, 22.3 s, 142.9 bpm grid.
// SMP: the brand's own line. The device is a woven care label sewn into the top of the frame, the way clothes tell you
// what they're made of: front = the name, back = the composition (moisture of a balm, sheen of a gloss, colour of a
// tint), then the size (one size, 9 shades), then the care (live in it) on the chorus lift; it ends on a price hang tag.
// The ground is a ribbed berry knit. Script and footage tags: script.json / shots.json (playbook gate).
(() => {
  const { W, H, bt, sp, spHit, clamp, lerp, put, el, scene, trk } = C;
  C.fonts = ['800 100px Display', '900 100px Display', 'italic 800 100px Display', 'italic 900 100px Display', '500 100px UI'];
  const X = 72;
  const KNIT = [64, 15, 28], PINK = '#F5D3DC', WINE = '#4A1222', WHITE = '#FFFFFF';
  const SOFT = '0 2px 26px rgba(30,0,10,0.55)';
  const R = (x, y, w, h) => ({ x, y, w, h });
  // Instagram's UI covers the top ~250 px and everything under ~1550 px (caption); type stays between (review safe_*.jpg)
  const NECK = 150, LX = 520;                         // the neckline seam the label is sewn into, the label's centre
  const FULL = R(0, 0, W, H), WIN = R(0, 810, W, H - 810);
  const line = (parent, text, x, y, size, o = {}) => TYPE.line(parent, text, { x, y, size, cls: o.cls || 'display', color: o.color || WHITE });
  const rise = TYPE.rise;
  const loads = [];
  const img = (src) => { const i = new Image(); loads.push(new Promise((ok) => { i.onload = i.onerror = () => ok(); })); i.src = src; return i; };
  const TUBE = img('../assets/cut/ultralip-ember.png'), SHADES = img('../assets/products/ultralip-shades.jpg');
  const LOGO = img('../assets/brand/glossier-logo.svg');
  const rad = (d) => d * Math.PI / 180;

  // ------------------------------------------------------------------ textures, made once (seeded)
  function knit() {                                   // ribbed knit: a V-stitch per row in every rib, berry wool
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'), im = g.createImageData(W, H), d = im.data, rnd = C.mulberry32(7);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const col = Math.floor(x / 22), rx = (x % 22) - 10.5;
      const rib = 0.5 + 0.5 * Math.cos(Math.PI * rx / 11);
      const row = (y + (col % 2) * 6) % 12, v = Math.exp(-((Math.abs(rx) - row * 0.85) ** 2) / 3);
      const L = 0.62 + 0.28 * rib + 0.1 * v + (rnd() - 0.5) * 0.07, i = (y * W + x) * 4;
      d[i] = KNIT[0] * L; d[i + 1] = KNIT[1] * L; d[i + 2] = KNIT[2] * L; d[i + 3] = 255;
    }
    g.putImageData(im, 0, 0); return c;
  }
  const LW = 820, LH = 610;
  function weave(w, h, fold) {                        // woven satin label: weft and warp threads, a folded top, stitches
    const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
    g.fillStyle = PINK; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 3) { g.fillStyle = 'rgba(74,18,34,0.045)'; g.fillRect(0, y, w, 1); }
    for (let x = 0; x < w; x += 3) { g.fillStyle = 'rgba(255,255,255,0.07)'; g.fillRect(x, 0, 1, h); }
    if (fold) {
      g.fillStyle = 'rgba(74,18,34,0.08)'; g.fillRect(0, 0, w, fold);
      g.fillStyle = 'rgba(74,18,34,0.14)'; g.fillRect(0, fold, w, 2);
      g.fillStyle = 'rgba(74,18,34,0.5)'; for (let x = 20; x < w - 20; x += 26) g.fillRect(x, fold / 2 - 1, 14, 3);
    }
    return c;
  }
  let KNITC, LABEL, TAG;

  // ------------------------------------------------------------------ helpers
  // canvas text: ink(ctx, 'text', x, y, { size, w, f, it, color, align, track })
  function ink(ctx, text, x, y, o) {
    ctx.font = `${o.it ? 'italic ' : ''}${o.w || 800} ${o.size}px ${o.f || 'Display'}`;
    ctx.fillStyle = o.color || WINE; ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic';
    ctx.letterSpacing = `${o.track || 0}px`;
    ctx.fillText(text, x, y); ctx.letterSpacing = '0px';
  }
  // the same, rising through a mask on beat `at` (k: 0 → 1 spring), the way the DOM lines rise
  function riseInk(ctx, text, x, y, at, t, o) {
    const k = spHit(t, at, 'heavy'); if (k <= 0.001) return;
    ctx.save(); ctx.beginPath(); ctx.rect(-20, y - o.size * 1.05, LW + 40, o.size * 1.38); ctx.clip();
    ctx.translate(0, o.size * 1.4 * (1 - k)); ink(ctx, text, x, y, o); ctx.restore();
  }
  // a damped swing: the impulse response of a spring (deg), for a label that hangs from one edge
  const swing = (t, at, A, w = 7.5, z = 0.2) => { const d = t - bt(at); return d <= 0 ? 0 : A * Math.exp(-z * w * d) * Math.sin(w * Math.sqrt(1 - z * z) * d); };
  function play(ctx, k, b0, b1, t, r, o = {}) {        // shot k plays its frames over beats [b0, b1), slight push
    const m = FOOT.SH[k], tt = Math.round(t * C.FPS) / C.FPS;
    const f = clamp((tt - bt(b0)) / (bt(b1) - bt(b0)) * (m.n - 1), 0, m.n - 1);
    const rate = (m.n - 1) / m.fps / (bt(b1) - bt(b0));   // blend frames only in real slow motion: near 1× it ghosts
    FOOT.paint(ctx, k, f, { r, blend: rate < 0.6, s: 1.0 + 0.035 * C.seg(t, b0, b1) });
  }
  function still(ctx, im, b0, b1, t, r) {              // the product photo, cover-fit, slow push
    if (!im.naturalWidth) return;
    const s = Math.max(r.w / im.naturalWidth, r.h / im.naturalHeight) * (1.0 + 0.05 * C.seg(t, b0, b1));
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
    ctx.drawImage(im, r.x + (r.w - w) / 2, r.y + (r.h - h) / 2, w, h); ctx.restore();
  }
  const PLAN = [['swipe', 0, 6], ['swipe2', 6, 8], ['hold', 8, 14], ['press', 14, 18], ['sheen', 18, 22], ['build', 22, 26],
    ['m1', 26, 28], ['m2', 28, 30], ['m3', 30, 32], ['m4', 32, 34], [SHADES, 34, 36], ['smile', 36, 40], ['pose', 40, 44]];

  // ------------------------------------------------------------------ the label
  const FLIPS = [13.6, 25.6, 35.4];                     // front → composition → size → care
  function label(ctx, t, b) {
    const drop = spHit(t, 'label', 'default'), lift = sp(t, 43.55, 'snappy');
    if (drop <= 0.001 || lift >= 0.999) return;
    let side = 0, sx = 1;
    FLIPS.forEach((f) => { const u = clamp(sp(t, f, 'default'), 0, 1); if (u >= 0.5) side++; sx *= Math.abs(Math.cos(Math.PI * u)); });
    const h = trk(t, [[0, 350], [8.4, LH, 'default']]);                  // the front grows for the line; the backs are full
    const y = lerp(-h - 160, NECK, drop) - (LH + NECK + 200) * lift;
    const rot = swing(t, 4.25, 5.5) + swing(t, 13.85, -2.4) + swing(t, 25.85, 2.4) + swing(t, 35.65, -2.4);
    ctx.save(); ctx.translate(LX, y); ctx.rotate(rad(rot)); ctx.scale(Math.max(sx, 0.002), 1); ctx.translate(-LW / 2, 0);
    ctx.save();
    ctx.shadowColor = 'rgba(12,0,4,0.5)'; ctx.shadowBlur = 44; ctx.shadowOffsetY = 18;
    ctx.beginPath(); ctx.roundRect(0, 0, LW, h, [0, 0, 16, 16]); ctx.fillStyle = PINK; ctx.fill();
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, h, [0, 0, 16, 16]); ctx.clip(); ctx.drawImage(LABEL, 0, 0);
    const c = LW / 2;
    if (side === 0) {
      if (LOGO.naturalWidth) ctx.drawImage(LOGO, c - 230, 104, 460, 460 * 62 / 286);
      riseInk(ctx, 'ULTRALIP', c, 300, 4.6, t, { size: 56, f: 'UI', w: 500, align: 'center', track: 18 });
      ctx.fillStyle = 'rgba(74,18,34,0.35)'; ctx.fillRect(c - 310 * spHit(t, 8.6, 'default'), 340, 620 * spHit(t, 8.6, 'default'), 2);
      riseInk(ctx, 'the (cashmere)', c, 430, 9.0, t, { size: 74, it: true, align: 'center' });
      riseInk(ctx, 'sweatpants of', c, 508, 9.35, t, { size: 74, it: true, align: 'center' });
      riseInk(ctx, 'lipstick.', c, 586, 9.7, t, { size: 74, it: true, align: 'center' });
    } else if (side === 1) {
      ink(ctx, 'COMPOSITION', 60, 152, { size: 44, f: 'UI', w: 500, track: 10 });
      [['moisture of a balm', 'r1'], ['sheen of a gloss', 'r2'], ['colour of a tint', 'r3']].forEach(([s, at], i) => {
        const yy = 276 + i * 108, k = spHit(t, at, 'snappy');
        ctx.strokeStyle = WINE; ctx.lineWidth = 5; ctx.strokeRect(60, yy - 52, 50, 50);
        if (k > 0.001) { ctx.fillStyle = WINE; const q = 32 * k; ctx.fillRect(85 - q / 2, yy - 27 - q / 2, q, q); }
        riseInk(ctx, s, 146, yy, at, t, { size: 70, w: 800 });
      });
      riseInk(ctx, 'in one.', 60, 590, 23, t, { size: 70, it: true, w: 900 });
    } else if (side === 2) {
      ink(ctx, 'SIZE', 60, 152, { size: 44, f: 'UI', w: 500, track: 10 });
      riseInk(ctx, 'one size.', 60, 316, 26.2, t, { size: 120, w: 800 });
      riseInk(ctx, '9 shades.', 60, 548, 27, t, { size: 160, it: true, w: 900 });
    } else {
      ink(ctx, 'CARE', 60, 152, { size: 44, f: 'UI', w: 500, track: 10 });
      care(ctx, 300, 106, t);
      riseInk(ctx, 'wear daily.', 60, 330, 36.1, t, { size: 92, w: 800 });
      riseInk(ctx, 'live in it.', 60, 556, 36.6, t, { size: 160, it: true, w: 900 });
    }
    ctx.restore(); ctx.restore();
  }
  function care(ctx, x0, y0, t) {                       // the four laundry symbols, drawn in the label's ink
    ctx.save(); ctx.strokeStyle = WINE; ctx.lineWidth = 4; ctx.lineJoin = 'round';
    const s = 54, gap = 82, k = (i) => spHit(t, 35.9 + i * 0.25, 'snappy');
    const sym = [
      (x, y) => { ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x + 6, y + s); ctx.lineTo(x + s - 6, y + s); ctx.lineTo(x + s, y + 8);
        ctx.moveTo(x + 2, y + 18); ctx.quadraticCurveTo(x + s / 4, y + 8, x + s / 2, y + 18); ctx.quadraticCurveTo(x + 3 * s / 4, y + 28, x + s - 2, y + 18); ctx.stroke(); },
      (x, y) => { ctx.beginPath(); ctx.moveTo(x + s / 2, y + 4); ctx.lineTo(x + s, y + s); ctx.lineTo(x, y + s); ctx.closePath(); ctx.stroke(); },
      (x, y) => { ctx.beginPath(); ctx.moveTo(x + 4, y + s - 6); ctx.lineTo(x + 12, y + 16); ctx.lineTo(x + s - 6, y + 16); ctx.quadraticCurveTo(x + s, y + 30, x + s - 2, y + s - 6); ctx.closePath(); ctx.stroke(); },
      (x, y) => { ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2 + 2, s / 2 - 2, 0, Math.PI * 2); ctx.stroke(); },
    ];
    sym.forEach((f, i) => { const q = k(i); if (q <= 0.001) return; ctx.save(); ctx.translate(x0 + i * gap + s / 2, y0 + s / 2); ctx.scale(q, q); ctx.translate(-(x0 + i * gap + s / 2), -(y0 + s / 2)); f(x0 + i * gap, y0); ctx.restore(); });
    ctx.restore();
  }

  // ------------------------------------------------------------------ the end: the tube and its price tag
  function tube(ctx, t) {
    const k = spHit(t, 'cta', 'heavy'); if (k <= 0.001 || !TUBE.naturalWidth) return;
    const s = 1.3, w = TUBE.naturalWidth * s, h = TUBE.naturalHeight * s;
    ctx.save(); ctx.translate(340, lerp(2600, 880, k)); ctx.rotate(rad(lerp(-14, -4, k)));
    ctx.shadowColor = 'rgba(12,0,4,0.55)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 26;
    ctx.drawImage(TUBE, -w / 2, -h / 2, w, h); ctx.restore();
  }
  const TW = 300, TH = 420;
  function tag(ctx, t) {
    const k = spHit(t, 'tag', 'default'); if (k <= 0.001) return;
    const px = 770, top = lerp(-TH - 420, 470, k);        // the cord comes down from the top edge, like the label did
    const rot = swing(t, 45.4, 6);
    ctx.save(); ctx.translate(px, 0); ctx.rotate(rad(rot));
    ctx.strokeStyle = PINK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, top + 46); ctx.stroke();
    ctx.translate(-TW / 2, top);
    ctx.save(); ctx.shadowColor = 'rgba(12,0,4,0.5)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
    ctx.beginPath(); ctx.roundRect(0, 0, TW, TH, 18); ctx.fillStyle = PINK; ctx.fill(); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, TW, TH, 18); ctx.clip(); ctx.drawImage(TAG, 0, 0);
    ctx.fillStyle = '#2A0A12'; ctx.beginPath(); ctx.arc(TW / 2, 46, 13, 0, Math.PI * 2); ctx.fill();
    ink(ctx, 'Ultralip', TW / 2, 160, { size: 66, it: true, w: 900, align: 'center' });
    ctx.fillStyle = 'rgba(74,18,34,0.35)'; ctx.fillRect(40, 198, TW - 80, 2);
    ink(ctx, '$22', TW / 2, 350, { size: 140, w: 900, align: 'center' });
    ctx.restore(); ctx.restore();
  }

  // ------------------------------------------------------------------ the picture (one canvas: knit, film, label, end)
  scene({
    name: 'pic', from: 'hook', to: 'done',
    build(root, S) {
      S.ctx = C.canvas(root);
      KNITC = knit(); LABEL = weave(LW, LH, 40); TAG = weave(TW, TH, 0);
    },
    run(t, b, S) {
      const ctx = S.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(KNITC, 0, 0);
      ctx.fillStyle = 'rgba(12,0,4,0.45)'; ctx.fillRect(0, NECK - 4, W, 8);       // the neckline seam
      ctx.fillStyle = PINK; for (let x = 10; x < W; x += 30) ctx.fillRect(x, NECK - 26, 18, 4);
      // the film: full-bleed for the hook, then it settles into the window under the label; at the end it slides away
      const k = spHit(t, 'label', 'default'), off = sp(t, 43.7, 'snappy');
      const r = R(0, lerp(FULL.y, WIN.y, k), W, lerp(FULL.h, WIN.h, k));
      if (off < 0.999) {
        ctx.save(); ctx.translate(0, off * (H - WIN.y + 60));
        const p = PLAN.find(([, b0, b1]) => b >= b0 && b < b1) || PLAN[PLAN.length - 1];
        if (p[0] === SHADES) still(ctx, SHADES, p[1], p[2], t, r);
        else play(ctx, p[0], p[1], p[2], t, r);
        if (r.y > 24) {                                  // the seam where the knit meets the film
          ctx.fillStyle = 'rgba(12,0,4,0.45)'; ctx.fillRect(0, r.y - 6, W, 6);
          ctx.fillStyle = PINK; for (let x = 10; x < W; x += 30) ctx.fillRect(x, r.y - 26, 18, 4);
        }
        ctx.restore();
      }
      label(ctx, t, b);
      tube(ctx, t);
      tag(ctx, t);
    },
  });

  // ------------------------------------------------------------------ words
  scene({
    name: 'words', from: 'hook', to: 'done',
    build(root, S) {
      S.h1 = line(root, 'lipstick,', X, 960, 150, { cls: 'display it black' });
      S.h2 = line(root, 'but make it', X, 1140, 100, { cls: 'display it' });
      S.h3 = line(root, 'sweatpants.', X, 1262, 170, { cls: 'display it black' });
      const LGW = 420, LGH = Math.round(LGW * 62 / 286);
      const box = el('div', { style: `position:absolute;left:${(W - LGW) / 2 - 20}px;top:280px;width:${LGW}px;height:${LGH + 10}px;overflow:hidden` }, root);
      S.logo = C.reg(el('img', { src: '../assets/brand/glossier-logo-white.svg', style: `position:absolute;left:0;top:0;width:${LGW}px;height:${LGH}px` }, box), { y: 0 });
      S.logoH = LGH + 10;
      S.c1 = line(root, 'the (cashmere) sweatpants', 0, 1340, 60, { cls: 'display it' });
      S.c2 = line(root, 'of lipstick.', 0, 1408, 60, { cls: 'display it' });
      S.c3 = line(root, 'glossier.com', 0, 1478, 44, { cls: 'mono', color: PINK });
    },
    run(t, b, S) {
      for (const L of [S.h1, S.h2, S.h3]) put(L.el, { css: { textShadow: `${SOFT}, 0 0 4px rgba(40,0,12,0.35)` } });
      rise(t, S.h1, 0.25, 5.6, { stagger: 0.1 });
      rise(t, S.h2, 2, 5.6, { stagger: 0.12 });
      rise(t, S.h3, 3.9, 7.6, { stagger: 0.1 });
      const y = S.logoH * 1.15 * (1 - spHit(t, 'logo', 'heavy'));
      put(S.logo, { y, hide: y >= S.logoH * 1.149 });
      for (const L of [S.c1, S.c2, S.c3]) put(L.el, { css: { left: '50%', transform: 'translateX(-50%)' } });
      rise(t, S.c1, 46.6, null, { stagger: 0.06, preset: 'default' });
      rise(t, S.c2, 46.9, null, { stagger: 0.06, preset: 'default' });
      rise(t, S.c3, 47.6, null, { stagger: 0.05, preset: 'default' });
    },
  });

  C.start();
  window.CUTS = [...new Set([...(window.CUTS || []), ...PLAN.map((p) => bt(p[1]))])].sort((a, b) => a - b);
  const ready0 = window.READY;
  window.READY = Promise.all([ready0, FOOT.ready, ...loads]).then(() => { window.seek(0); return true; });
})();

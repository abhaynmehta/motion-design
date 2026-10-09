// Minimalist SPF 50 — "50 likha. 56.6 nikla." A Hinglish spec reel from Minimalist's own application film, packshot and
// product-page lab report, to Karan Aujla's "Tauba Tauba" (temp track). 9:16, 22 s, 95 bpm.
// SMP: SPF 50 on the label, 56.6 in the lab. Device: a lab readout (a black instrument with a measuring bar and the
// label's 50 marked on it) that climbs on the build, freezes on the song's dead stop and locks past the 50 at 56.6 on the
// slam. She's cut out (person mattes, ≤ 1.38× the source) on Minimalist orange. Type scale: 48 / 72 / 108 / 162 / 300.
(() => {
  const { W, H, bt, sp, spHit, clamp, lerp, put, el, scene, trk, trkObj } = C;
  C.fonts = ['800 100px Display', '900 100px Display', '600 100px UI', '500 100px UI'];
  const X = 80;
  const ORANGE = '#F96A28', INK = '#111111', WHITE = '#FFFFFF';
  const R = (x, y, w, h) => ({ x, y, w, h });
  const PR = R(130, 590, 820, 1456);                 // her cut-out: 820 x 1456 frames drawn 1:1 (1.35x the 608 px source)
  const SQ = R(120, 700, 840, 840);                  // the squeeze window (1.38x)
  const AF = R(130, 640, 820, 1012);                 // the after close-up window (1.35x)
  const line = (parent, text, x, y, size, o = {}) => TYPE.line(parent, text, { x, y, size, cls: o.cls || 'display', color: o.color || INK });
  const rise = TYPE.rise;
  const loads = [];
  const img = (src) => { const i = new Image(); loads.push(new Promise((ok) => { i.onload = i.onerror = () => ok(); })); i.src = src; return i; };
  const TUBE = img('../assets/cut/spf50.png');
  const rad = (d) => d * Math.PI / 180;

  function play(ctx, k, b0, b1, t, r, o = {}) {        // shot k plays over beats [b0, b1); nearest frame unless truly slow
    const m = FOOT.SH[k], tt = Math.round(t * C.FPS) / C.FPS;
    const f = clamp(((o.freeze != null ? Math.min(tt, bt(o.freeze)) : tt) - bt(b0)) / (bt(b1) - bt(b0)) * (m.n - 1), 0, m.n - 1);
    const rate = (m.n - 1) / m.fps / (bt(b1) - bt(b0));
    if (o.cut) FOOT.cutout(ctx, k, f, { r, s: o.s || 1, dy: o.dy || 0 });
    else {
      ctx.save(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 36); ctx.clip();
      FOOT.paint(ctx, k, f, { r, blend: rate < 0.6 }); ctx.restore();
    }
  }
  function tube(ctx, x, y, s, rot) {
    if (!TUBE.naturalWidth || s <= 0.01) return;
    const w = TUBE.naturalWidth * s, h = TUBE.naturalHeight * s;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rad(rot));
    ctx.shadowColor = 'rgba(80,20,0,0.35)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 26;
    ctx.drawImage(TUBE, -w / 2, -h / 2, w, h); ctx.restore();
  }
  // canvas text: ink(ctx, 'text', x, y, { size, w, f, color, align, track })
  function ink(ctx, text, x, y, o) {
    ctx.font = `${o.w || 600} ${o.size}px ${o.f || 'UI'}`; ctx.fillStyle = o.color || WHITE;
    ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = `${o.track || 0}px`;
    ctx.fillText(text, x, y); ctx.letterSpacing = '0px';
  }

  // ------------------------------------------------------------------ the lab readout
  const P = R(X, 1290, W - 2 * X, 244), BAR = { x: X + 44, w: W - 2 * X - 88, y: P.y + 188 }, MAX = 60;
  // the measurement: climbs in steps on the build, holds on the stop, locks at 56.6 on the slam (critical: no overshoot)
  const reading = (t) => trk(t, [[0, 0], [6.2, 18, 'default'], [7.6, 31, 'default'], [9, 42, 'default'], [10.2, 49.9, 'default'], [12 - 0.08, 56.6, 'heavy']]);
  function readout(ctx, t, b) {
    const k = spHit(t, 5.8, 'default') * (1 - sp(t, 15.6, 'snappy'));
    if (k <= 0.001) return;
    const v = reading(t), x50 = BAR.x + BAR.w * 50 / MAX;
    ctx.save(); ctx.translate(0, (1 - k) * 420);
    ctx.fillStyle = INK; ctx.beginPath(); ctx.roundRect(P.x, P.y, P.w, P.h, 30); ctx.fill();
    ink(ctx, 'SPF · ISO 24444', P.x + 44, P.y + 74, { size: 48, track: 4, color: 'rgba(255,255,255,0.62)' });
    const shown = b >= 12.6 ? 56.6 : v;                                // the lock: the readout settles on the lab's figure
    const val = (Math.round(shown * 10) / 10).toFixed(1).padStart(4, '0');
    ink(ctx, val, P.x + P.w - 44, P.y + 110, { size: 108, align: 'right' });
    // the bar: a track, the fill, and the label's claim marked at 50
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(BAR.x, BAR.y, BAR.w, 20);
    ctx.fillStyle = b >= 12 ? ORANGE : WHITE; ctx.fillRect(BAR.x, BAR.y, BAR.w * clamp(v / MAX, 0, 1), 20);
    ctx.fillStyle = WHITE; ctx.fillRect(x50 - 2, BAR.y - 30, 4, 50);
    ink(ctx, 'LABEL 50', x50 - 16, BAR.y - 14, { size: 48, align: 'right', track: 4, color: 'rgba(255,255,255,0.62)' });
    ctx.restore();
  }

  // ------------------------------------------------------------------ the picture
  scene({
    name: 'pic', from: 'hook', to: 'done',
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
      ctx.fillStyle = ORANGE; ctx.fillRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      if (b >= 2.5 && b < 5.5) play(ctx, 'squeeze', 2.5, 5.5, t, SQ);
      // a second, tighter angle on the beat (punch-in); on the song's dead stop (beat 11) the frame freezes with the readout
      else if (b >= 5.5 && b < 12) play(ctx, 'dots', 5.5, 12, t, PR, { cut: true, s: b >= 8.5 && b < 11 ? 1.12 : 1, freeze: 11 });
      else if (b >= 12 && b < 16) play(ctx, 'blend', 12, 16, t, PR, { cut: true, s: b >= 14 ? 1.12 : 1 });
      else if (b >= 16 && b < 20) play(ctx, 'after', 16, 20, t, AF);
      else if (b >= 20 && b < 24) play(ctx, 'press', 20, 24, t, PR, { cut: true, s: b >= 22 ? 1.12 : 1 });
      readout(ctx, t, b);
      // the tube: the hook's hero, gone during the test, back for the payoff, aside for the end card
      const T = trkObj(t, [[-2, { x: 790, y: 2600, s: 0.74, r: 14 }], [-0.7, { x: 790, y: 1160, s: 0.74, r: 7 }, 'heavy'],   // in flight on frame 0
        [2.35, { x: 790, y: 2700, s: 0.74, r: 16 }, 'snappy'], [24 - 0.25, { x: 540, y: 1190, s: 0.78, r: 0 }, 'heavy'],
        [25.5, { x: 540, y: 1290, s: 0.9, r: -4 }, 'default'],
        [28.5, { x: 800, y: 1060, s: 0.6, r: 6 }, 'default']]);
      if (b < 2.6 || b >= 23.6) tube(ctx, T.x, T.y, T.s, T.r);
    },
  });

  // ------------------------------------------------------------------ words (black on orange; sizes 48 / 72 / 108 / 162 / 300)
  scene({
    name: 'words', from: 'hook', to: 'done',
    build(root, S) {
      S.a1 = line(root, 'SPF 50', X, 300, 162, { cls: 'display black' });
      S.a2 = line(root, 'likha hai.', X, 470, 108);
      S.b1 = line(root, 'par hai kya?', X, 330, 162, { cls: 'display black' });
      S.c1 = line(root, 'humne lab se', X, 300, 108);
      S.c2 = line(root, 'poocha.', X, 410, 108, { cls: 'display black' });
      S.c3 = line(root, 'independent lab · in-vivo', X + 4, 528, 48, { cls: 'mono' });
      S.d1 = line(root, 'SPF', X + 8, 300, 72, { cls: 'display black' });
      S.d2 = line(root, 'PA++++', X + 230, 312, 48, { cls: 'mono' });
      S.d3 = line(root, '56.6', X - 10, 380, 300, { cls: 'display black' });
      S.e1 = line(root, 'white cast?', X, 300, 108);
      S.e2 = line(root, 'zero.', X, 410, 162, { cls: 'display black' });
      S.f1 = line(root, 'moisturiser jaisa', X, 300, 108);
      S.f2 = line(root, 'halka.', X, 410, 162, { cls: 'display black' });
      S.g1 = line(root, '50 likha.', X, 290, 162, { cls: 'display black' });
      S.g2 = line(root, '56.6 nikla.', X, 460, 162, { cls: 'display black', color: WHITE });
      const LGW = 460, LGH = Math.round(LGW * 96 / 562);
      const box = el('div', { style: `position:absolute;left:${X}px;top:330px;width:${LGW}px;height:${LGH + 10}px;overflow:hidden` }, root);
      S.logo = C.reg(el('img', { src: '../assets/brand/minimalist-logo.png', style: `position:absolute;left:0;top:0;width:${LGW}px;height:${LGH}px` }, box), { y: 0 });
      S.logoH = LGH + 10;
      S.h1 = line(root, 'SPF 50', X, 480, 162, { cls: 'display black' });
      S.h2 = line(root, 'sunscreen', X + 4, 660, 72);
      S.h3 = line(root, '₹359', X, 800, 162, { cls: 'display black', color: WHITE });
      S.h4 = line(root, 'beminimalist.co', X + 6, 1000, 48, { cls: 'mono' });
      S.h5 = line(root, 'lab report on the page', X + 6, 1070, 48, { cls: 'mono' });
    },
    run(t, b, S) {
      put(S.d3.el, { css: { fontVariantNumeric: 'tabular-nums' } });
      rise(t, S.a1, 0.15, 2.3, { stagger: 0.06 });
      rise(t, S.a2, 0.9, 2.3, { stagger: 0.08 });
      rise(t, S.b1, 2.5, 5.3, { stagger: 0.1 });
      rise(t, S.c1, 5.5, 11.8, { stagger: 0.08 });
      rise(t, S.c2, 6.0, 11.8);
      rise(t, S.c3, 6.6, 11.8, { stagger: 0.03, preset: 'default' });
      rise(t, S.d1, 12, 15.8, { preset: 'snappy' });
      rise(t, S.d3, 12, 15.8, { preset: 'snappy' });
      rise(t, S.d2, 13.5, 15.8, { preset: 'snappy' });
      rise(t, S.e1, 16, 19.8, { stagger: 0.08 });
      rise(t, S.e2, 17, 19.8);
      rise(t, S.f1, 20, 23.8, { stagger: 0.08 });
      rise(t, S.f2, 21, 23.8);
      rise(t, S.g1, 24, 28.3, { stagger: 0.08 });
      rise(t, S.g2, 25.5, 28.3, { stagger: 0.08 });
      const y = S.logoH * 1.15 * (1 - spHit(t, 'logo', 'heavy'));
      put(S.logo, { y, hide: y >= S.logoH * 1.149 });
      rise(t, S.h1, 29.9, null, { stagger: 0.06 });
      rise(t, S.h2, 30.3, null, { stagger: 0.06, preset: 'default' });
      rise(t, S.h3, 30.8, null, { stagger: 0.06 });
      rise(t, S.h4, 31.4, null, { stagger: 0.03, preset: 'default' });
      rise(t, S.h5, 31.7, null, { stagger: 0.03, preset: 'default' });
    },
  });

  C.start();
  window.CUTS = [...new Set([...(window.CUTS || []), ...[2.5, 5.5, 12, 16, 20, 24, 28.5].map((x) => bt(x))])].sort((a, b) => a - b);
  const ready0 = window.READY;
  // unicode-range subsets (₹ lives in the latin-ext file) load lazily on first use: load them before frame 0
  loads.push(document.fonts.load('900 162px Display', '₹1,999 – XS'), document.fonts.load('800 100px Display', '₹1,999 – XS') );
  window.READY = Promise.all([ready0, FOOT.ready, ...loads]).then(() => { window.seek(0); return true; });
})();

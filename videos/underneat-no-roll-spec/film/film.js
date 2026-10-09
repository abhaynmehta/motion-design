// Underneat High Waist Tummy Tucker Shorts — "roll down? aaj nahi." A Hinglish spec reel from Underneat's own how-to film
// for the shorts, to "Shararat" (Dhurandhar; temp track). 9:16, 20.9 s, 131 bpm.
// SMP: shapewear that stays up. Device: a coral waistband — one band across the frame carries every line. While gravity
// wins, the band slips and the words sag and roll off it; on the drop the tiny loop clips on, the band snaps up and
// locks, and from then on the words land and stay. The band sits exactly over the film's burned-in captions.
// Type scale: 52 / 84 / 120 / 160.
(() => {
  const { W, H, bt, sp, spHit, clamp, lerp, put, el, scene, trk } = C;
  C.fonts = ['800 100px Display', '600 100px UI'];
  const CORAL = '#EB6242', GROUND = '#17110F', WHITE = '#FFFFFF';
  const R = (x, y, w, h) => ({ x, y, w, h });
  const WIN = R(120, 210, 840, 1497);                // the film: full source frame at 1.39x
  const BAND = { y: 1096, h: 250 };                  // covers source caption rows 695-760 (global 1173-1263)
  const loads = [];
  const img = (src) => { const i = new Image(); loads.push(new Promise((ok) => { i.onload = i.onerror = () => ok(); })); i.src = src; return i; };
  const LOGO_SVG = img('../assets/brand/underneat-logo-white.svg');
  let LOGO = null;                                    // the SVG rasterised once before frame 0: a canvas draws an SVG
  // <img> lazily on first use, which paints differently cold vs warm (render --verify caught it at the end card)
  function rasterLogo() {
    if (!LOGO_SVG.naturalWidth) return;
    const w = 640, h = Math.round(w * LOGO_SVG.naturalHeight / LOGO_SVG.naturalWidth);
    LOGO = document.createElement('canvas'); LOGO.width = w; LOGO.height = h; LOGO.getContext('2d').drawImage(LOGO_SVG, 0, 0, w, h);
  }

  function play(ctx, k, b0, b1, t, r) {
    const m = FOOT.SH[k], tt = Math.round(t * C.FPS) / C.FPS;
    const f = clamp((tt - bt(b0)) / (bt(b1) - bt(b0)) * (m.n - 1), 0, m.n - 1);
    const rate = (m.n - 1) / m.fps / (bt(b1) - bt(b0));
    ctx.save(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 32); ctx.clip();
    FOOT.paint(ctx, k, f, { r, blend: rate < 0.6 }); ctx.restore();
  }
  // canvas text: ink(ctx, 'text', x, y, { size, f, color, align, track })
  function ink(ctx, text, x, y, o) {
    ctx.font = `${o.f === 'UI' ? 600 : 800} ${o.size}px ${o.f || 'Display'}`; ctx.fillStyle = o.color || WHITE;
    ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'alphabetic';
    ctx.letterSpacing = o.f === 'UI' ? `${Math.round(o.size * 0.06)}px` : `${Math.round(-o.size * 0.03)}px`;
    ctx.fillText(text, x, y); ctx.letterSpacing = '0px';
  }
  // a line on the band: rises in on `at`; if `off` is set it sags (gravity) and rolls off the band at `off`
  function bandLine(ctx, text, base, at, off, t, o) {
    const k = spHit(t, at, 'heavy'); if (k <= 0.001) return;
    let y = base + o.size * 1.3 * (1 - k), sy = 1, rot = 0;
    if (off != null) {
      y += 12 * sp(t, at + 0.6, { response: 1.6, damping: 1 });                      // the slow sag
      const r = sp(t, off, 'default'); y += 260 * r; sy = 1 - 0.55 * clamp(r, 0, 1); rot = -5 * r;   // roll off
      if (r >= 0.999) return;
    }
    ctx.save(); ctx.translate(540, y); ctx.rotate(rot * Math.PI / 180); ctx.scale(1, sy); ink(ctx, text, 0, 0, o); ctx.restore();
  }

  scene({
    name: 'pic', from: 'hook', to: 'done',
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
      ctx.fillStyle = GROUND; ctx.fillRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      // ---------------------------------------------------------------- the film (slides away for the end card)
      const away = sp(t, 36.8, 'default');
      if (away < 0.999) {
        ctx.save(); ctx.translate(0, away * 1800);
        const P = [['roll', 0, 3.5], ['rolled', 3.5, 7], ['laugh', 7, 11.5], ['hold', 11.5, 16], ['loop', 16, 18], ['clip', 18, 20],
          ['clip2', 20, 22], ['boom', 22, 24], ['move', 24, 31], ['dress', 31, 34.5], ['dress2', 34.5, 37]];
        const p = P.find(([, a, z]) => b >= a && b < z) || P[P.length - 1];
        play(ctx, p[0], p[1], p[2], t, WIN);
        ctx.restore();
      }
      // ---------------------------------------------------------------- the waistband band
      // it slips a little each time gravity wins; on the drop it snaps up and locks; for the end card it rises
      const slip = trk(t, [[0, 0], [2.6, 14], [6.4, 26], [15.3, 38], [16 - 0.06, 0, 'snappy'], [36.8, -400, 'default']]);
      const by = BAND.y + slip;
      ctx.fillStyle = CORAL; ctx.fillRect(0, by, W, BAND.h);
      // the tiny loop: clips the band up on the drop
      const lk = spHit(t, 'reveal', 'snappy') * (1 - sp(t, 36.6, 'snappy'));
      if (lk > 0.001) {
        for (const lx of [60, W - 60]) {                    // one at each end, in the dark margins beside the film
          ctx.save(); ctx.translate(lx, by); ctx.scale(lk, lk);
          ctx.strokeStyle = WHITE; ctx.lineWidth = 7; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(0, -8); ctx.bezierCurveTo(-22, -40, 22, -66, 0, -98); ctx.stroke();
          ctx.fillStyle = WHITE; ctx.beginPath(); ctx.roundRect(-16, -124, 32, 26, 7); ctx.fill();
          ctx.beginPath(); ctx.roundRect(-16, -14, 32, 26, 7); ctx.fill();
          ctx.restore();
        }
      }
      ctx.save(); ctx.beginPath(); ctx.rect(0, by, W, BAND.h); ctx.clip();
      const L1 = by + 104, L2 = by + 206, MID = by + 164;    // two-line and one-line baselines
      bandLine(ctx, 'shapewear?', MID, 0.3, 2.6, t, { size: 120 });
      bandLine(ctx, 'phir se roll down.', MID - 20, 3.4, 6.4, t, { size: 84 });
      bandLine(ctx, 'gravity ko belly se', L1, 7.1, 15.3, t, { size: 84 });
      bandLine(ctx, 'pyaar hai.', L2, 8.5, 15.3, t, { size: 84 });
      if (b < 24) bandLine(ctx, 'meet the tiny loop.', MID - 20, 16.15, null, t, { size: 84 });
      if (b >= 24 && b < 25.7) bandLine(ctx, 'walk.', MID, 24, null, t, { size: 120 });
      if (b >= 25.7 && b < 27.3) bandLine(ctx, 'spin.', MID, 25.7, null, t, { size: 120 });
      if (b >= 27.3 && b < 29) bandLine(ctx, 'bend.', MID, 27.3, null, t, { size: 120 });
      if (b >= 29 && b < 31) bandLine(ctx, 'nothing moves.', MID, 29, null, t, { size: 120 });
      if (b >= 31 && b < 36.8) {
        bandLine(ctx, 'roll down?', by + 90, 31, null, t, { size: 84 });
        bandLine(ctx, 'aaj nahi.', by + 218, 32.5, null, t, { size: 120 });
      }
      if (b >= 36.8) {
        bandLine(ctx, 'High Waist', by + 104, 37.8, null, t, { size: 84 });
        bandLine(ctx, 'Tummy Tucker Shorts', by + 206, 38.2, null, t, { size: 84 });
      }
      ctx.restore();
      // ---------------------------------------------------------------- the end card (on the ground)
      if (b >= 37) {
        const k = spHit(t, 'logo', 'heavy');
        if (LOGO && k > 0.001) {
          const w = 320, h = w * LOGO.height / LOGO.width;
          ctx.save(); ctx.beginPath(); ctx.rect(0, 280, W, h + 20); ctx.clip();
          ctx.drawImage(LOGO, (W - w) / 2, 290 + (1 - k) * (h + 30), w, h); ctx.restore();
        }
        // each line rises through its own mask (a shared mask let the price show early)
        const masked = (base, size, at, preset, draw) => {
          const k = spHit(t, at, preset); if (k <= 0.001) return;
          ctx.save(); ctx.beginPath(); ctx.rect(0, base - size * 1.05, W, size * 1.35); ctx.clip();
          ctx.translate(0, size * 1.4 * (1 - k)); draw(); ctx.restore();
        };
        masked(1180, 160, 38.8, 'heavy', () => ink(ctx, '₹1,999', 540, 1180, { size: 160 }));
        masked(1290, 52, 39.4, 'default', () => ink(ctx, 'sizes XS – 5XL', 540, 1290, { size: 52, f: 'UI', color: 'rgba(255,255,255,0.75)' }));
        masked(1380, 52, 39.7, 'default', () => ink(ctx, 'underneat.in', 540, 1380, { size: 52, f: 'UI', color: CORAL }));
      }
    },
  });

  C.start();
  window.CUTS = [...new Set([...(window.CUTS || []), ...[3.5, 7, 11.5, 16, 18, 20, 22, 24, 31, 34.5].map((x) => bt(x))])].sort((a, b) => a - b);
  const ready0 = window.READY;
  // unicode-range subsets (₹ lives in the latin-ext file) load lazily on first use: load them before frame 0
  loads.push(document.fonts.load('800 160px Display', '₹1,999 – XS'), document.fonts.load('600 52px UI', '₹1,999 – XS') );
  window.READY = Promise.all([ready0, FOOT.ready, ...loads]).then(() => LOGO_SVG.decode().catch(() => {})).then(() => { rasterLogo(); window.seek(0); return true; });
})();

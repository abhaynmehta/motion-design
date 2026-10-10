// Raised Right by Youthiapa — "Mummy ke rules." A Hinglish spec reel from Youthiapa's own Raised Right films (the
// campaign film and Bhuvan Bam on the sofa), to "In The Night No Control" (1996; temp track). 9:16, 21 s, 137.3 bpm.
// SMP: Raised Right (mostly): tees for kids who broke every house rule. Device: Mummy's rules, handwritten; as each is
// broken, a printed evidence photo slaps onto a pile and the rule is struck through in orange marker. The song's dead
// stop is the glare ("aur ye kya pehna hai?"); the slam is the answer: Raised Right.
// Type scale: 52 / 84 / 120 (Kalam: Mummy's hand) / 180 (Bodoni Moda: the brand).
(() => {
  const { W, H, bt, sp, spHit, clamp, scene } = C;
  C.fonts = ['800 100px Display', '700 100px Hand'];
  const GREEN = '#0E1A15', ORANGE = '#FF6B1A', WHITE = '#FFFFFF';
  const X = 72, NX = X + 112;                           // the rule number hangs at X, its words at NX

  // ------------------------------------------------------------------ type
  // ink(ctx, 'text', x, y, { size, f: 'D' (Bodoni) | Hand, color, align })
  function ink(ctx, text, x, y, o) {
    const d = o.f === 'D';
    ctx.font = `${d ? 800 : 700} ${o.size}px ${d ? 'Display' : 'Hand'}`; ctx.fillStyle = o.color || WHITE;
    ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic';
    ctx.letterSpacing = d ? `${(-o.size * 0.02).toFixed(1)}px` : '0px';
    ctx.fillText(text, x, y); ctx.letterSpacing = '0px';
  }
  const wid = (ctx, text, size, d) => { ctx.font = `${d ? 800 : 700} ${size}px ${d ? 'Display' : 'Hand'}`; ctx.letterSpacing = d ? `${(-size * 0.02).toFixed(1)}px` : '0px'; const w = ctx.measureText(text).width; ctx.letterSpacing = '0px'; return w; };
  // a line that rises in through its own mask at beat a (a <= 0: already there on frame 0) and rises out at beat b
  function rise(ctx, t, a, b, base, size, draw, pin = 'heavy') {
    const k = a <= 0 ? 1 : spHit(t, a, pin), q = b == null ? 0 : sp(t, b, 'snappy');
    if (k <= 0.001 || q >= 0.999) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, base - size * 1.05, W, size * 1.45); ctx.clip();
    ctx.translate(0, size * 1.25 * (1 - k) - size * 1.35 * q); draw(); ctx.restore();
  }
  // Mummy's rule struck through: an orange marker swipe across [x0, x1] at height y, left to right
  function strike(ctx, t, at, x0, x1, y, tilt) {
    const k = clamp(spHit(t, at, { response: 0.26, damping: 1 }), 0, 1); if (k <= 0.001) return;
    const xe = x0 + (x1 - x0) * k, ye = y + tilt * k;
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = ORANGE;
    ctx.globalAlpha = 0.95; ctx.lineWidth = 17; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xe, ye); ctx.stroke();
    ctx.globalAlpha = 0.55; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x0 + 6, y - 9); ctx.lineTo(xe - 4, ye - 7); ctx.stroke();   // the felt tip's second edge
    ctx.restore();
  }

  // ------------------------------------------------------------------ the rules
  const RULES = [
    { a: 0, out: 5, n: '1.', l1: 'sofa pe', l2: 'joote nahi.', s: 2.5 },
    { a: 5, out: 10, n: '2.', l1: 'ghar mein', l2: 'ball nahi.', s: 8.5 },
    { a: 10, out: 15, n: '3.', l1: 'skateboard?', l2: 'haddi tootegi.', s: 12.5 },
    { a: 15, out: 20, n: '4.', l1: 'phone pe', l2: 'sirf 2 minute.', s: 17.5 },
  ];
  const L1 = 470, L2 = 592;                            // rule baselines
  function rules(ctx, t, b) {
    if (b < 20.4) rise(ctx, t, 0, 20, 330, 52, () => ink(ctx, 'Mummy ke rules:', X, 330, { size: 52, color: 'rgba(255,255,255,0.62)' }));
    for (const r of RULES) {
      if (b < r.a - 1 || b > r.out + 1) continue;
      rise(ctx, t, r.a, r.out, L1, 120, () => { ink(ctx, r.n, X, L1, { size: 120, color: ORANGE }); ink(ctx, r.l1, NX, L1, { size: 120 }); });
      rise(ctx, t, r.a > 0 ? r.a + 0.25 : 0, r.out, L2, 120, () => ink(ctx, r.l2, NX, L2, { size: 120 }));
      // the strikes ride out with their lines
      const q = sp(t, r.out, 'snappy'), dy = -120 * 1.35 * q;
      if (q < 0.999) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, 330, W, 330); ctx.clip(); ctx.translate(0, dy);
        strike(ctx, t, r.s, NX - 14, NX + wid(ctx, r.l1, 120) + 14, L1 - 36, -6);
        strike(ctx, t, r.s + 0.35, NX - 14, NX + wid(ctx, r.l2, 120) + 14, L2 - 36, 5);
        ctx.restore();
      }
    }
    // the question: not a rule, never struck
    rise(ctx, t, 20, 26.6, L1, 120, () => ink(ctx, 'aur ye kya', X, L1, { size: 120 }));
    rise(ctx, t, 20.3, 26.6, L2, 120, () => ink(ctx, 'pehna hai?', X, L2, { size: 120 }));
  }

  // ------------------------------------------------------------------ the evidence photos
  // a white-bordered print of shot k that slaps onto the pile on beat `at`; footage plays from just before it lands
  const PILE = { cx: 540, cy: 1190 };
  function photo(ctx, t, p, g) {
    const k = spHit(t, p.at, { response: 0.3, damping: 0.8 }); if (k <= 0.001) return;
    const m = FOOT.SH[p.k], s = (p.scale || 0.92) * g.s * (1 + 0.06 * (1 - clamp(k, 0, 1)));
    const w = m.w * s, h = m.h * s, B = 20 * g.s;
    ctx.save();
    ctx.translate(g.cx + (p.dx || 0) * g.s, g.cy + g.dy + (p.dy || 0) + (1 - k) * 1300);
    ctx.rotate(((p.rot || 0) + (1 - k) * (p.rot || 0) * 3) * Math.PI / 180);
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 36; ctx.shadowOffsetY = 18;
    ctx.fillStyle = '#F4F1EA'; ctx.fillRect(-w / 2 - B, -h / 2 - B, w + 2 * B, h + 2 * B);
    ctx.shadowColor = 'transparent';
    const tt = Math.round(t * C.FPS) / C.FPS;
    const f = clamp((tt - bt(p.at - 0.4)) * m.fps * (p.rate ?? 1), 0, m.n - 1);
    const push = p.push ? 1 + 0.14 * sp(t, p.at + 0.5, { response: 3.2, damping: 1 }) : 1;
    FOOT.paint(ctx, p.k, f, { r: { x: -w / 2, y: -h / 2, w, h }, blend: (p.rate ?? 1) < 0.6, s: push });
    ctx.restore();
  }
  const G1 = [                                         // the rules being broken
    { k: 'sofa', at: 0.6, rate: 0.75, rot: -4, dx: -14 },
    { k: 'dribble', at: 6, rate: 0.5, rot: 3, dx: 18 },
    { k: 'spin', at: 7.5, rate: 0.55, rot: -2, dx: -22 },
    { k: 'skate', at: 11, rate: 0.6, rot: 4, dx: 10 },
    { k: 'phone', at: 16, rate: 0.28, rot: -3, dx: -8 },
    { k: 'glare', at: 21, rate: 0.2, rot: 2, push: true },
  ];
  const G2 = [                                         // the slam: the name, then the prints
    { k: 'emboss', at: 27, rate: 0.5, rot: -2, scale: 0.88 },
    { k: 'flowers', at: 28, rate: 0.6, rot: 3, dx: 12 },
    { k: 'turtle', at: 29, rate: 0.7, rot: -4, dx: -16 },
    { k: 'butterfly', at: 30, rate: 0.7, rot: 2, dx: 14 },
    { k: 'mushroom', at: 31, rate: 0.6, rot: -3, dx: -6 },
  ];
  const G3 = [                                         // Bhuvan, tee after tee
    { k: 'w1', at: 33, rate: 0.5, rot: -3 }, { k: 'o1', at: 34, rate: 0.5, rot: 2, dx: 10 }, { k: 'k1', at: 35, rate: 0.9, rot: -2, dx: -12 },
    { k: 'w2', at: 36, rate: 0.5, rot: 3 }, { k: 'g1', at: 37, rate: 0.9, rot: -4, dx: 14 }, { k: 'o2', at: 38, rate: 0.7, rot: 1 },
  ];
  // a pile is swept off the bottom when the next one starts; the last pile shrinks under the end card
  function pile(ctx, t, b, list, from, to, endCard) {
    if (b < C.beatOf(from) - 1 || (to != null && sp(t, C.beatOf(to) - 0.15, 'default') >= 0.999)) return;
    const away = to == null ? 0 : sp(t, C.beatOf(to) - 0.15, 'default');
    const e = endCard ? sp(t, 'cta', 'default') : 0;
    const g = { cx: PILE.cx, cy: PILE.cy + 330 * e, dy: away * 1500, s: 1 - 0.4 * e };
    // only the top three prints of a pile can show
    const live = list.filter((p) => spHit(t, p.at, { response: 0.3, damping: 0.8 }) > 0.001);
    for (const p of live.slice(-3)) photo(ctx, t, p, g);
  }

  // ------------------------------------------------------------------ the brand
  const LOGO_Y = 290;
  function brand(ctx, t, b) {
    // "Raised" on the vocal pickup in the stop, "Right." on the slam; both leave for the end card
    rise(ctx, t, 'raised', 'cta', 470, 180, () => ink(ctx, 'Raised', X, 470, { size: 180, f: 'D' }), 'default');
    rise(ctx, t, 'slam', 'cta', 640, 180, () => ink(ctx, 'Right.', X, 640, { size: 180, f: 'D' }));
    const rx = X + wid(ctx, 'Right.', 180, true) + 26;
    const mk = spHit(t, 'mostly', 'snappy'), mq = sp(t, 'cta', 'snappy');
    if (mk > 0.001 && mq < 0.999) {                    // Mummy's hand adds a note
      ctx.save(); ctx.beginPath(); ctx.rect(rx - 10, 520, W - rx + 10, 150); ctx.clip();
      ctx.translate(rx, 630 + 110 * (1 - mk) - 160 * mq); ctx.rotate(-5 * Math.PI / 180);
      ink(ctx, '(mostly.)', 0, 0, { size: 84, color: ORANGE }); ctx.restore();
    }
    if (b >= 38.5) {                                   // the end card: the logo, the prices, the site
      const k = spHit(t, 'cta', 'heavy');
      if (k > 0.001) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, LOGO_Y, W, 540); ctx.clip();
        ctx.translate(0, 540 * (1 - k)); ctx.globalCompositeOperation = 'lighten';
        FOOT.paint(ctx, 'logo', 0, { r: { x: 0, y: LOGO_Y, w: 1080, h: 540 } }); ctx.restore();
      }
      rise(ctx, t, 'price', null, 930, 84, () => ink(ctx, 'tees ₹1,499', W / 2, 930, { size: 84, align: 'center' }));
      rise(ctx, t, 40.9, null, 1030, 84, () => ink(ctx, 'cargos ₹1,999', W / 2, 1030, { size: 84, align: 'center' }));
      rise(ctx, t, 'url', null, 1112, 52, () => ink(ctx, 'youthiapa.com', W / 2, 1112, { size: 52, align: 'center', color: ORANGE }), 'default');
    }
  }

  // ------------------------------------------------------------------ the film
  scene({
    name: 'pic', from: 'hook', to: 'done',
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = GREEN; ctx.fillRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      pile(ctx, t, b, G1, 0, 'slam', false);
      pile(ctx, t, b, G2, 'slam', 'pay', false);
      pile(ctx, t, b, G3, 'pay', null, true);
      if (b < 27.5) rules(ctx, t, b);
      brand(ctx, t, b);
    },
  });

  C.start();
  window.CUTS = [...new Set([...(window.CUTS || [])])];
  const ready0 = window.READY;
  const loads = [document.fonts.load('700 84px Hand', '₹1,499 · ₹1,999'), document.fonts.load('800 180px Display', 'Raised Right.')];
  window.READY = Promise.all([ready0, FOOT.ready, ...loads]).then(() => { window.seek(0); return true; });
})();

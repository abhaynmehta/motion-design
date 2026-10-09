// Mokobara Transit Z — "time spent digging: 0 seconds." A Hinglish spec reel from Mokobara's own product films, to
// "Big Dawgs" (Hanumankind & Kalmi; temp track). 9:16, 18.6 s, 120 bpm.
// SMP: in the Transit Z, time spent digging is zero seconds. Device: zips. The hook is the inside of a black bag: dark,
// a torch beam hunting for the charger. On the 808 a zip rips the dark open into Mokobara yellow, and from then on every
// compartment opens with its own zip and its item is found in 0 sec. Every shot is keyed off its white studio sweep onto
// the yellow (scripts/prep_key.py), so the reel lives inside the bag's lining.
// Type scale: 52 (Space Mono labels) / 84 / 168 / 520 (the 0; its unit at 84).
(() => {
  const { W, H, bt, sp, spHit, clamp, trk, scene } = C;
  C.fonts = ['700 100px Display', '700 100px UI'];
  const YEL = '#F7C443', INK = '#121110', DARK = '#0F0E0D', WHITE = '#FFFFFF';
  const X = 72;                                        // the left edge every line hangs from
  const loads = [];
  const img = (src) => { const i = new Image(); loads.push(new Promise((ok) => { i.onload = i.onerror = () => ok(); })); i.src = src; return i; };
  const LOGO_SVG = img('../assets/brand/mokobara-logo-ink.svg');
  let LOGO = null;                                     // rasterised once before frame 0 (a canvas draws SVG lazily)
  function rasterLogo() {
    if (!LOGO_SVG.naturalWidth) return;
    const w = 1020, h = Math.round(w * LOGO_SVG.naturalHeight / LOGO_SVG.naturalWidth);
    LOGO = document.createElement('canvas'); LOGO.width = w; LOGO.height = h; LOGO.getContext('2d').drawImage(LOGO_SVG, 0, 0, w, h);
  }
  const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
  const OLD = mk(), octx = OLD.getContext('2d'), VEIL = mk(), vctx = VEIL.getContext('2d');

  // ------------------------------------------------------------------ type
  // ink(ctx, 'text', x, y, { size, f: 'UI', color, align, hl: [word, colour] })
  function ink(ctx, text, x, y, o) {
    const ui = o.f === 'UI';
    ctx.font = `700 ${o.size}px ${ui ? 'UI' : 'Display'}`; ctx.fillStyle = o.color || INK;
    ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic';
    ctx.letterSpacing = ui ? `${Math.round(o.size * 0.08)}px` : `${(-o.size * 0.035).toFixed(1)}px`;
    if (o.hl && text.includes(o.hl[0])) {              // one word in the accent colour
      const [pre, post] = text.split(o.hl[0]); let cx = x;
      for (const [s, c] of [[pre, o.color || INK], [o.hl[0], o.hl[1]], [post, o.color || INK]]) { ctx.fillStyle = c; ctx.fillText(s, cx, y); cx += ctx.measureText(s).width; }
    } else ctx.fillText(text, x, y);
    ctx.letterSpacing = '0px';
  }
  const wid = (ctx, text, size, ui) => { ctx.font = `700 ${size}px ${ui ? 'UI' : 'Display'}`; ctx.letterSpacing = ui ? `${Math.round(size * 0.08)}px` : `${(-size * 0.035).toFixed(1)}px`; const w = ctx.measureText(text).width; ctx.letterSpacing = '0px'; return w; };
  // a line rises into place through its own mask
  function rise(ctx, t, at, preset, base, size, draw) {
    const k = spHit(t, at, preset); if (k <= 0.001) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, base - size * 1.02, W, size * 1.3); ctx.clip();
    ctx.translate(0, size * 1.2 * (1 - k)); draw(); ctx.restore();
  }
  // the "0 SEC" tag: an ink pill that grows from its left edge, text revealed by the same edge
  function tag(ctx, t, at, y) {
    const k = spHit(t, at, 'snappy'); if (k <= 0.001) return;
    const w = wid(ctx, '0 SEC', 52, true) + 56, h = 80;
    ctx.save(); ctx.beginPath(); ctx.rect(X - 4, y - 4, (w + 8) * clamp(k, 0, 1.05), h + 8); ctx.clip();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.roundRect(X, y, w, h, h / 2); ctx.fill();
    ink(ctx, '0 SEC', X + 30, y + 58, { size: 52, f: 'UI', color: YEL });
    ctx.restore();
  }

  // ------------------------------------------------------------------ footage
  // shot k with its top-left at (0, y): frames play from beat t0 at `rate` (negative = reversed, from the last frame)
  function shot(ctx, k, t, y, t0, rate = 1, hold = null) {
    const m = FOOT.SH[k];
    const f = FOOT.frameAt({ s: k, t0, rate, f0: rate < 0 ? m.n - 1 : 0, hold }, t);
    FOOT.paint(ctx, k, f, { r: { x: 0, y, w: m.w, h: m.h }, blend: Math.abs(rate) < 0.6 });
  }

  // ------------------------------------------------------------------ pages (one per compartment)
  // an item page: the footage bottom-anchored on the yellow, a Space Mono label, the item word, its 0 SEC tag
  function item(ctx, t, a, k, y, cut, label, word, found) {
    ctx.fillStyle = YEL; ctx.fillRect(0, 0, W, H);
    shot(ctx, k, t, y, cut[0], cut[1], cut[2]);
    rise(ctx, t, a + 0.25, 'default', 340, 52, () => ink(ctx, label, X, 340, { size: 52, f: 'UI', color: 'rgba(18,17,16,0.72)' }));
    rise(ctx, t, a + 0.45, 'heavy', 512, 168, () => ink(ctx, word, X, 512, { size: 168 }));
    tag(ctx, t, found, 552);
  }
  const PAGES = [
    { a: 0, draw: hook },
    { a: 4.66, draw: (c, t) => {                       // the lid flips open: Transit Z
      c.fillStyle = YEL; c.fillRect(0, 0, W, H);
      shot(c, 'open', t, H - 1253, 4.5, 0.62);
      rise(c, t, 5.05, 'default', 340, 52, () => ink(c, 'MOKOBARA', X, 340, { size: 52, f: 'UI', color: 'rgba(18,17,16,0.72)' }));
      rise(c, t, 5.3, 'heavy', 512, 168, () => ink(c, 'Transit Z.', X, 512, { size: 168 }));
    } },
    { a: 7, draw: (c, t) => {                          // the charger pocket unzips; the charger comes out (reversed shot)
      if (C.beatAt(t) < 8.6) item(c, t, 7, 'charger', H - 1056, [7, 1.15], 'SUSPENDED CHARGER POCKET', 'charger.', 9.3);
      else item(c, t, 7, 'charger2', H - 1056, [8.6, -0.72], 'SUSPENDED CHARGER POCKET', 'charger.', 9.3);
    } },
    { a: 10, draw: (c, t) => item(c, t, 10, 'cards', H - 1253, [9.8, 0.55], 'CARD HOLDER', 'cards.', 11.2) },
    { a: 12.33, draw: (c, t) => item(c, t, 12.33, 'keys', H - 1253, [12.1, -0.6], 'KEY HOLDER', 'chaabi.', 14.3) },   // reversed: the hand closes on the keys
    { a: 15.33, draw: (c, t) => item(c, t, 15.33, 'phone', H - 1253, [15.1, 0.42], 'SECRET MAGNETIC POCKET', 'phone.', 17.0) },
    { a: 18.66, draw: (c, t) => {                      // zipped shut: sab sorted
      c.fillStyle = YEL; c.fillRect(0, 0, W, H);
      shot(c, 'shut', t, H - 1440, 18.5, 0.5);
      rise(c, t, 19.0, 'heavy', 440, 168, () => ink(c, 'sab sorted.', X, 440, { size: 168 }));
    } },
    { a: 21, draw: payoff },
    { a: 27, draw: cta },
  ];
  // zips at these page boundaries (the slider crosses mid-frame on the beat); 7 and 21 are hard cuts on the 808
  const ZIPS = { 4.66: { dir: 'v', slope: 0.55 }, 10: { dir: 'h', slope: 0.3 }, 12.33: { dir: 'v', slope: 0.3 },
    15.33: { dir: 'h', slope: 0.3 }, 18.66: { dir: 'v', slope: 0.3 }, 27: { dir: 'h', slope: 0.3 } };

  // ------------------------------------------------------------------ the hook: inside a black bag, a torch hunting
  function hook(ctx, t) {
    const b = C.beatAt(t);
    ctx.fillStyle = DARK; ctx.fillRect(0, 0, W, H);
    shot(ctx, 'zip', t, 890, 3, 0.8);                   // frame 0 held, then the hands start on the zip
    // the beam: frantic moves while it searches the lower half, then it lands on the hands at the zip and widens
    const bx = trk(t, [[0, 300], [0.3, 830], [1.5, 330], [2.7, 720]]);
    const by = trk(t, [[0, 1640], [0.3, 1520], [1.5, 1380], [2.7, 1460]]);
    const R = 250 + 80 * sp(t, 2.9, 'default');
    vctx.setTransform(1, 0, 0, 1, 0, 0); vctx.globalCompositeOperation = 'source-over';
    vctx.clearRect(0, 0, W, H); vctx.fillStyle = 'rgba(5,4,3,0.94)'; vctx.fillRect(0, 0, W, H);
    vctx.globalCompositeOperation = 'destination-out';
    const g = vctx.createRadialGradient(bx, by, R * 0.45, bx, by, R);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    vctx.fillStyle = g; vctx.fillRect(0, 0, W, H);
    ctx.drawImage(VEIL, 0, 0);
    // the torch's warm light lifts the black nylon inside the beam
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    const lg = ctx.createRadialGradient(bx, by, 0, bx, by, R); lg.addColorStop(0, 'rgba(255,232,190,0.30)'); lg.addColorStop(1, 'rgba(255,232,190,0)');
    ctx.fillStyle = lg; ctx.fillRect(bx - R, by - R, 2 * R, 2 * R); ctx.restore();
    if (b < 5) {
      // cold open: the battery is already at 2 % on frame 0 (it rhymes with the payoff's giant 0)
      ink(ctx, 'laptop:', X, 380, { size: 84, color: WHITE });
      ink(ctx, '2%', X - 14, 820, { size: 520, color: YEL });
      rise(ctx, t, 1.6, 'heavy', 1000, 168, () => ink(ctx, 'charger', X, 1000, { size: 168, color: WHITE }));
      rise(ctx, t, 1.85, 'heavy', 1150, 168, () => ink(ctx, 'kahan hai?', X, 1150, { size: 168, color: WHITE }));
    }
  }

  // ------------------------------------------------------------------ payoff + CTA on the bag alone
  function payoff(ctx, t) {
    ctx.fillStyle = YEL; ctx.fillRect(0, 0, W, H);
    if (C.beatAt(t) < 25) shot(ctx, 'pack', t, 547, 21, 0.3);
    else shot(ctx, 'pack3', t, 712, 25, 0.4);         // punch in: three-quarters behind, the S-shaped straps
    rise(ctx, t, 21.4, 'default', 380, 84, () => ink(ctx, 'time spent digging:', X, 380, { size: 84 }));
    rise(ctx, t, 'zero', 'heavy', 900, 520, () => ink(ctx, '0', X - 16, 900, { size: 520 }));
    const zx = X - 16 + wid(ctx, '0', 520) + 28;
    rise(ctx, t, 'secs', 'heavy', 900, 84, () => ink(ctx, 'seconds.', zx, 900, { size: 84 }));
  }
  function cta(ctx, t) {
    ctx.fillStyle = YEL; ctx.fillRect(0, 0, W, H);
    shot(ctx, 'pack2', t, 560, 27, 0.2);
    if (LOGO) {
      const k = spHit(t, 27.4, 'heavy'), w = 380, h = w * LOGO.height / LOGO.width;
      if (k > 0.001) { ctx.save(); ctx.beginPath(); ctx.rect(0, 296, W, h + 16); ctx.clip(); ctx.drawImage(LOGO, X, 300 + (1 - k) * (h + 24), w, h); ctx.restore(); }
    }
    rise(ctx, t, 27.8, 'default', 510, 84, () => ink(ctx, 'Transit Z Backpack', X, 510, { size: 84 }));
    rise(ctx, t, 'price', 'heavy', 680, 168, () => ink(ctx, '₹6,299', X - 6, 680, { size: 168 }));
    rise(ctx, t, 29.5, 'default', 770, 52, () => ink(ctx, 'mokobara.com', X, 770, { size: 52, f: 'UI', color: 'rgba(18,17,16,0.72)' }));
  }

  // ------------------------------------------------------------------ the zip
  // the old page is torn along a centre line by a slider that crosses the frame on the beat; behind it the two halves
  // part in a V (tape and teeth on each edge), the closed seam below it shows interlocked teeth; then the halves part off
  const ZP = { response: 0.34, damping: 1 };
  function zipState(t, a) {
    const z = ZIPS[a], L = z.dir === 'v' ? H : W, M = 220;
    const u = spHit(t, a, ZP);                          // slider travel 0 → 1, mid-frame on the beat
    const s = -M + u * (L + 2 * M);
    const part = sp(t, a + 0.35, 'default') * (z.dir === 'v' ? W : H) * 0.62;
    return { z, L, s, part, u };
  }
  function zipDraw(ctx, t, a, drawOld) {
    const { z, L, s, part, u } = zipState(t, a);
    const v = z.dir === 'v', cx = v ? W / 2 : H / 2;
    const P = (along, across) => (v ? [across, along] : [along, across]);   // axis coords → canvas
    const gap = (al) => Math.max(0, s - al) * z.slope + part;               // half-gap at a point along the axis
    octx.setTransform(1, 0, 0, 1, 0, 0); octx.globalAlpha = 1; drawOld(octx, t);
    const end = Math.min(Math.max(s, 0), L);
    for (const side of [-1, 1]) {
      const far = side < 0 ? -40 : (v ? W : H) + 40;
      const pts = [P(-40, far), P(-40, cx + side * gap(-40)), P(end, cx + side * gap(end)), P(L + 40, cx + side * gap(L + 40)), P(L + 40, far)];
      ctx.save(); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip();
      ctx.drawImage(OLD, 0, 0);
      // the zip tape + teeth along this half's edge
      ctx.lineCap = 'butt';
      const edge = (al) => P(al, cx + side * (gap(al) + 9));
      ctx.strokeStyle = '#1B1A19'; ctx.lineWidth = 20; ctx.beginPath();
      [[-40], [end], [Math.min(L + 40, s + 260)]].forEach(([al], i) => { const [x, y] = edge(al); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();   // tape: open edges + a short closed run ahead
      ctx.restore();
    }
    // teeth: on the open edges behind the slider (each side), interlocked on the closed seam ahead of it
    const tooth = (al, off) => { const [x, y] = P(al, cx + off); ctx.fillRect(x - (v ? 7 : 4), y - (v ? 4 : 7), v ? 14 : 8, v ? 8 : 14); };
    ctx.fillStyle = '#3A3836';
    for (let al = -10; al < L + 20; al += 15) {
      if (al < s) { if (part < (v ? W : H) * 0.5) { tooth(al, -(gap(al) + 2)); tooth(al + 7, gap(al) + 2); } }
      else if (al < s + 260) { tooth(al, -5); tooth(al + 7.5, 5); }   // a short closed run ahead of the slider
    }
    // the slider and its pull, travelling along the seam (only while on screen)
    if (s > -120 && s < L + 120 && u < 0.999) {
      const [x, y] = P(s, cx);
      ctx.save(); ctx.translate(x, y); if (!v) ctx.rotate(-Math.PI / 2);
      const gr = ctx.createLinearGradient(-34, 0, 34, 0); gr.addColorStop(0, '#2B2A29'); gr.addColorStop(0.5, '#6A6866'); gr.addColorStop(1, '#2B2A29');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.roundRect(-34, -46, 68, 92, 16); ctx.fill();
      ctx.fillStyle = '#4C4A48'; ctx.beginPath(); ctx.roundRect(-20, 40, 40, 120, 12); ctx.fill();   // the pull, ahead of it
      ctx.fillStyle = '#1B1A19'; ctx.beginPath(); ctx.roundRect(-9, 120, 18, 28, 6); ctx.fill();
      ctx.restore();
    }
  }

  // ------------------------------------------------------------------ the film
  scene({
    name: 'pic', from: 'hook', to: 'done',
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      // the page whose zip has started is drawn whole; the page before it is torn open over it until it has parted
      let i = 0;
      for (let j = 1; j < PAGES.length; j++) {
        const a = PAGES[j].a, z = ZIPS[a];
        const start = z ? bt(a) - C.leadFor(ZP) - 0.12 : bt(a);
        if (t >= start) i = j;
      }
      PAGES[i].draw(ctx, t);
      const a = PAGES[i].a;
      if (ZIPS[a] && i > 0 && sp(t, a + 0.35, 'default') < 0.995) zipDraw(ctx, t, a, (c, tt) => PAGES[i - 1].draw(c, tt));
    },
  });

  C.start();
  window.CUTS = [...new Set([...(window.CUTS || []), bt(7), bt(21), bt(8.6), bt(25)])].sort((a, b) => a - b);
  const ready0 = window.READY;
  loads.push(document.fonts.load('700 136px Display', '₹6,299 – 0'), document.fonts.load('700 52px UI', '0 SEC ₹'));
  window.READY = Promise.all([ready0, FOOT.ready, ...loads]).then(() => LOGO_SVG.decode().catch(() => {})).then(() => { rasterLogo(); window.seek(0); return true; });
})();

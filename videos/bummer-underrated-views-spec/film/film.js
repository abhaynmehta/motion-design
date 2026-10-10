// Bummer Modal Stretch Trunks — "underrated views." A spec reel from Bummer's own product packshots, to "Aap Jaisa Koi"
// (Nazia Hassan, 1980; temp track). 9:16, 17.7 s, 108.4 bpm. SMP: Bummer Modal Stretch Trunks hide a view only you get.
// Device: a window — each trunk's scenic printed waistband is framed as a little landscape and named like a holiday spot;
// four postcards swap in on the four-on-the-floor kick, then stack into a wall of views. Built from still packshots
// (1254 px) drawn at ≤0.7× (crisp, playbook L16); no video. Type scale: 44 / 72 / 120 / 160.
(() => {
  const { W, H, bt, sp, spHit, clamp, scene } = C;
  C.fonts = ['900 100px Display', '500 100px Mono'];
  const NAVY = '#0C1E4A', CYAN = '#58C7FF', WHITE = '#FFFFFF', GREY = '#2A3A66';
  // the four scenic-waistband trunks (real Bummer product names + the view each waistband is)
  const TR = [
    { k: 'aurora', name: 'Aurora', place: 'NORTHERN LIGHTS', fy: 0.33, at: 'aurora' },
    { k: 'cold-rush', name: 'Cold Rush', place: 'FRESH SNOW', fy: 0.30, at: 'cold' },
    { k: 'foliage', name: 'Foliage', place: 'DEEP WOODS', fy: 0.34, at: 'foliage' },
    { k: 'sunspill', name: 'Sunspill', place: 'GOLDEN HOUR', fy: 0.44, at: 'sunspill' },
  ];
  const IMG = {}; const loads = [];
  for (const t of TR) { const i = new Image(); loads.push(new Promise((ok) => { i.onload = i.onerror = () => ok(); })); i.src = `../assets/products/${t.k}.png`; IMG[t.k] = i; }

  // ---- type ----------------------------------------------------------------
  function ink(ctx, text, x, y, o) {
    const m = o.f === 'M';
    ctx.font = `${m ? 500 : (o.w || 900)} ${o.size}px ${m ? 'Mono' : 'Display'}`; ctx.fillStyle = o.color || WHITE;
    ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'alphabetic';
    ctx.letterSpacing = m ? `${Math.round(o.size * 0.14)}px` : `${(-o.size * 0.02).toFixed(1)}px`;
    ctx.fillText(text, x, y); ctx.letterSpacing = '0px';
  }
  // a line rises into place through its own mask on beat `a`, leaves on beat `b`
  function rise(ctx, t, a, b, base, size, draw, pin = 'default') {
    const k = a == null ? 1 : spHit(t, a, pin), q = b == null ? 0 : sp(t, b, 'snappy');
    if (k <= 0.001 || q >= 0.999) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, base - size * 1.05, W, size * 1.4); ctx.clip();
    ctx.translate(0, size * 1.2 * (1 - k) - size * 1.3 * q); draw(); ctx.restore();
  }

  // ---- a postcard ----------------------------------------------------------
  // the trunk image cover-fit in rect r, vertically anchored on its waistband (fy), with a white matte + cyan viewfinder
  function card(ctx, im, fy, r, o = {}) {
    const B = o.border ?? 18, rad = o.rad ?? 10;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
    ctx.fillStyle = WHITE; ctx.beginPath(); ctx.roundRect(r.x - B, r.y - B, r.w + 2 * B, r.h + 2 * B, rad + B); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, rad); ctx.clip();
    if (im && im.naturalWidth) {
      const s = Math.max(r.w / im.naturalWidth, r.h / im.naturalHeight);   // cover-fit (always a downscale: src 1254)
      const dw = im.naturalWidth * s, dh = im.naturalHeight * s;
      const dx = r.x + (r.w - dw) / 2, dy = r.y + r.h / 2 - fy * dh;        // anchor the waistband at the card's middle
      ctx.save();
      if (o.kb) {   // a slow push + drift so the "view" is alive (and every frame changes): scale about the card centre
        const cx = r.x + r.w / 2, cy = r.y + r.h / 2, ks = 1 + 0.06 * o.kb;
        ctx.translate(cx, cy); ctx.scale(ks, ks); ctx.translate(-cx, -cy); ctx.translate(0, -o.kb * 10);
      }
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(im, dx, clamp(dy, r.y + r.h - dh, r.y), dw, dh);
      ctx.restore();
    } else {
      ctx.fillStyle = GREY; ctx.fillRect(r.x, r.y, r.w, r.h);
      if (o.scan != null) {   // a cyan scan line sweeping the empty viewfinder (keeps the hold alive)
        const sy = r.y + 30 + (r.h - 60) * o.scan;
        ctx.strokeStyle = 'rgba(88,199,255,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(r.x + 24, sy); ctx.lineTo(r.x + r.w - 24, sy); ctx.stroke();
      }
    }
    ctx.restore();
    if (o.viewfinder) {                                                    // cyan corner ticks: "a window"
      ctx.save(); ctx.strokeStyle = CYAN; ctx.lineWidth = 6; ctx.lineCap = 'round'; const L = 46, p = 26;
      for (const [cx, cy, sx, sy] of [[r.x + p, r.y + p, 1, 1], [r.x + r.w - p, r.y + p, -1, 1], [r.x + p, r.y + r.h - p, 1, -1], [r.x + r.w - p, r.y + r.h - p, -1, -1]]) {
        ctx.beginPath(); ctx.moveTo(cx, cy + sy * L); ctx.lineTo(cx, cy); ctx.lineTo(cx + sx * L, cy); ctx.stroke();
      }
      ctx.restore();
    }
  }
  // the filmstrip: the four views sit on a long horizontal track that scrolls at a constant speed behind a fixed cyan
  // viewfinder; a view is centred on each four-on-the-floor kick. CW card width, P pitch (card + gap), CY top.
  const CW = 620, CH = 760, P = 760, CY = 356, VIEW = { x: W / 2 - CW / 2, y: CY, w: CW, h: CH };
  function fixedViewfinder(ctx) {
    ctx.save(); ctx.strokeStyle = CYAN; ctx.lineWidth = 6; ctx.lineCap = 'round'; const L = 50, p = 24, r = VIEW;
    for (const [cx, cy, sx, sy] of [[r.x + p, r.y + p, 1, 1], [r.x + r.w - p, r.y + p, -1, 1], [r.x + p, r.y + r.h - p, 1, -1], [r.x + r.w - p, r.y + r.h - p, -1, -1]]) {
      ctx.beginPath(); ctx.moveTo(cx, cy + sy * L); ctx.lineTo(cx, cy); ctx.lineTo(cx + sx * L, cy); ctx.stroke();
    }
    ctx.restore();
  }

  // ---- the film ------------------------------------------------------------
  scene({
    name: 'pic', from: 'hook', to: 'done',
    build(root, S) { S.ctx = C.canvas(root); },
    run(t, b, S) {
      const ctx = S.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = NAVY; ctx.fillRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';

      if (b < 26) {   // the scrolling filmstrip of views (hook → payoff), always moving → never a dead hold
        const s = (b - 4) / 4;                       // which card is centred (0 = Aurora on the kick at beat 4)
        const pull = 0.16 * clamp(1 - Math.abs(b - 20) / 2.2, 0, 1);   // on the big kick, pull back to see the views roll
        const za = clamp(1 - sp(t, 25.4, 'snappy'), 0, 1);            // the strip leaves for the CTA
        ctx.save(); ctx.globalAlpha = za;
        const cx0 = W / 2, cy0 = CY + CH / 2, z = 1 - pull;
        ctx.translate(cx0, cy0); ctx.scale(z, z); ctx.translate(-cx0, -cy0);
        for (let k = Math.floor(s) - 1; k <= Math.floor(s) + 2; k++) {
          const x = W / 2 + (k - s) * P, r = { x: x - CW / 2, y: CY, w: CW, h: CH };
          if (x < -CW || x > W + CW) continue;
          if (k === -1) card(ctx, null, 0.5, r, { scan: (t * 0.5) % 1 });        // the "no view" grey card before Aurora
          else if (k >= 0) { const tr = TR[k % 4]; card(ctx, IMG[tr.k], tr.fy, r, { kb: 0.4 + 0.3 * Math.abs(((k - s) + 10) % 1) }); }
        }
        ctx.restore();
        fixedViewfinder(ctx);
        // the label of whichever view is in the window
        const kc = Math.round(s), la = clamp(1 - Math.abs(kc - s) * 1.8, 0, 1) * za;
        if (b < 4) {   // hook, over the grey card
          ctx.save(); ctx.globalAlpha = clamp(-s, 0, 1) * za;
          ink(ctx, 'desk pe', W / 2, 1300, { size: 120 }); ink(ctx, 'view nahi?', W / 2, 1430, { size: 120 });
          ctx.restore();
        }
        if (kc >= 0 && la > 0.01 && b >= 4 && b < 19.5) {   // the centred view's name + place
          const tr = TR[kc % 4]; ctx.save(); ctx.globalAlpha = la;
          ink(ctx, tr.name, W / 2, 1300, { size: 120 });
          ink(ctx, tr.place, W / 2, 1380, { size: 44, f: 'M', color: CYAN });
          ink(ctx, 'scenic waistband · modal-soft', W / 2, 1455, { size: 44, f: 'M', color: 'rgba(255,255,255,0.55)' });
          ctx.restore();
        }
        if (b >= 19.5) rise(ctx, t, 'pay', 25.4, 1320, 120, () => ink(ctx, 'ek naya view, roz.', W / 2, 1320, { size: 120 }), 'heavy');
      }

      // CTA
      if (b >= 25) {
        rise(ctx, t, 'cta', null, 700, 160, () => ink(ctx, 'bummer', W / 2, 700, { size: 160, color: CYAN }), 'heavy');
        rise(ctx, t, 'cta', null, 820, 72, () => ink(ctx, 'Modal Stretch Trunks', W / 2, 820, { size: 72 }));
        rise(ctx, t, 'price', null, 980, 120, () => ink(ctx, '₹599', W / 2, 980, { size: 120 }), 'heavy');
        rise(ctx, t, 'url', null, 1080, 44, () => ink(ctx, 'bummer.in', W / 2, 1080, { size: 44, f: 'M', color: CYAN }));
      }
    },
  });

  C.start();
  const ready0 = window.READY;
  loads.push(document.fonts.load('900 160px Display', '₹599 bummer'), document.fonts.load('500 44px Mono', '₹599 .in'));
  window.READY = Promise.all([ready0, ...loads])
    .then(() => Promise.all(TR.map((t) => IMG[t.k].decode().catch(() => {}))))   // decode packshots before frame 0 (determinism)
    .then(() => { window.seek(0); return true; });
})();

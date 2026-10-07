// Footage layer: shots pre-extracted as JPEG frames (scripts/prep_frames.py → film/shots.js), drawn with ctx.drawImage
// (synchronous decode, so frame t is always complete). Footage time is quantized to the output frame; transforms keep
// continuous t. Person mattes (scripts/prep_mattes.py) for the shots in window.MATTE_SHOTS let a shot be drawn cut out
// (text behind the subject, stickers): the frame is drawn into an offscreen canvas and kept where the matte is.
(() => {
  const C = window.C, SH = window.SHOTS, W = C.W, H = C.H;
  const IM = {}, MT = {}, OL = {}, ST = {};
  // every Image exists from the start (an early seek draws nothing rather than throwing); ready resolves when all load
  const pend = [];
  const load = (src) => { const im = new Image(); pend.push(new Promise((ok) => { im.onload = () => ok(); im.onerror = () => { console.warn(`missing: ${src}`); ok(); }; })); im.src = src; return im; };
  const pad = (i) => String(i).padStart(4, '0');
  for (const [k, m] of Object.entries(SH)) IM[k] = Array.from({ length: m.n }, (_, i) => load(`../assets/frames/${k}/${pad(i)}.jpg`));
  for (const k of window.MATTE_SHOTS || []) MT[k] = Array.from({ length: SH[k].n }, (_, i) => load(`../assets/mattes/${k}/${pad(i)}.png`));
  for (const [k, idx] of Object.entries(window.STICKERS || {})) { OL[k] = {}; ST[k] = {}; for (const i of idx) { OL[k][i] = load(`../assets/mattes/${k}/${pad(i)}_outline.png`); ST[k][i] = load(`../assets/mattes/${k}/${pad(i)}_sticker.png`); } }
  const ready = Promise.all(pend);
  const OFF = Object.assign(document.createElement('canvas'), { width: W, height: H });
  const octx = OFF.getContext('2d', { willReadFrequently: true });

  // a cut: { s: shot, t0: beat where frame f0 plays, f0 (default 0), rate (default 1), hold: beat to freeze at }
  function frameAt(cut, t) {
    const m = SH[cut.s];
    let tt = Math.round(t * C.FPS) / C.FPS;
    if (cut.hold != null) tt = Math.min(tt, C.bt(cut.hold));
    const f = (cut.f0 || 0) + (tt - C.bt(cut.t0)) * m.fps * (cut.rate ?? 1);
    return C.clamp(f, 0, m.n - 1);
  }
  /** Cover-fit geometry of shot k in rect r (default full frame), scaled by s (≥1) about its centre, offset (dx, dy). */
  function geo(k, o = {}) {
    const m = SH[k], r = o.r || { x: 0, y: 0, w: W, h: H };
    const s = Math.max(r.w / m.w, r.h / m.h) * Math.max(1, o.s ?? 1);
    const dw = m.w * s, dh = m.h * s;
    const x = C.clamp(r.x + (r.w - dw) / 2 + (o.dx || 0), r.x + r.w - dw, r.x), y = C.clamp(r.y + (r.h - dh) / 2 + (o.dy || 0), r.y + r.h - dh, r.y);
    return { r, x, y, dw, dh };
  }
  function paint(ctx, k, f, o = {}) {
    const g = geo(k, o), ims = IM[k], i0 = o.blend ? Math.floor(f + 1e-6) : Math.round(f), a = o.blend ? f - i0 : 0;
    ctx.save();
    ctx.beginPath(); if (o.round) ctx.roundRect(g.r.x, g.r.y, g.r.w, g.r.h, o.round); else ctx.rect(g.r.x, g.r.y, g.r.w, g.r.h); ctx.clip();
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.globalAlpha = o.alpha ?? 1;
    ctx.drawImage(ims[C.clamp(i0, 0, ims.length - 1)], g.x, g.y, g.dw, g.dh);
    if (a > 0.02 && ims[i0 + 1]) { ctx.globalAlpha = (o.alpha ?? 1) * a; ctx.drawImage(ims[i0 + 1], g.x, g.y, g.dw, g.dh); }
    ctx.restore();
  }
  /** The subject alone: frame f of shot k where its person matte is, same geometry as paint(). outline: draw the
   *  sticker border (white, from STICKERS) under it. into: a context to draw the result into (default ctx). */
  function cutout(ctx, k, f, o = {}) {
    const g = geo(k, o), i = C.clamp(Math.round(f), 0, IM[k].length - 1);
    octx.save(); octx.setTransform(1, 0, 0, 1, 0, 0); octx.globalCompositeOperation = 'source-over'; octx.globalAlpha = 1;
    octx.clearRect(0, 0, W, H);
    octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high';
    octx.drawImage(IM[k][i], g.x, g.y, g.dw, g.dh);
    octx.globalCompositeOperation = 'destination-in';
    octx.drawImage(o.outline && ST[k] && ST[k][i] ? ST[k][i] : MT[k][i], g.x, g.y, g.dw, g.dh);   // a sticker uses its cleaned single-blob matte
    if (o.outline && OL[k] && OL[k][i]) { octx.globalCompositeOperation = 'destination-over'; octx.drawImage(OL[k][i], g.x, g.y, g.dw, g.dh); }
    octx.restore();
    ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.drawImage(OFF, 0, 0); ctx.restore();
  }
  const draw = (ctx, cut, t, o = {}) => paint(ctx, cut.s, frameAt(cut, t), { blend: cut.blend ?? (cut.rate ?? 1) < 0.85, ...o });
  const drawCut = (ctx, cut, t, o = {}) => cutout(ctx, cut.s, frameAt(cut, t), o);
  window.FOOT = { ready, frameAt, geo, paint, cutout, draw, drawCut, SH };
})();

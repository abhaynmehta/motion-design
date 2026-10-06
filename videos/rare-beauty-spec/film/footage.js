// Footage layer: shots pre-extracted as JPEG frames (scripts/prep_frames.py → film/shots.js): 'full' shots are 1080x1920
// 9:16 crops, 'square' shots 1080x1080. Frames are painted with ctx.drawImage, which decodes synchronously, so frame t is
// always complete. Footage time is quantized to the output frame (motion-blur sub-samples show the same source frame);
// transforms keep continuous t.
(() => {
  const C = window.C, SH = window.SHOTS;
  const IM = {};
  const ready = Promise.all(Object.entries(SH).map(([k, m]) => {
    IM[k] = [];
    return Promise.all(Array.from({ length: m.n }, (_, i) => new Promise((ok) => {
      const im = new Image();
      im.onload = () => ok();
      im.onerror = () => { console.warn(`frame missing: ${k}/${i}`); ok(); };
      im.src = `../assets/frames/${k}/${String(i).padStart(4, '0')}.jpg`;
      IM[k][i] = im;
    })));
  }));
  // a cut: { s: shot, t0: beat where frame f0 plays, f0 (default 0), rate (default 1), hold: beat to freeze at }
  function frameAt(cut, t) {
    const m = SH[cut.s];
    let tt = Math.round(t * C.FPS) / C.FPS;
    if (cut.hold != null) tt = Math.min(tt, C.bt(cut.hold));
    const f = (cut.f0 || 0) + (tt - C.bt(cut.t0)) * m.fps * (cut.rate ?? 1);
    return C.clamp(f, 0, m.n - 1);
  }
  /** Paint shot k at frame f, cover-fit into rect r (default full frame), scaled by s (≥1) about its centre, offset by (dx, dy). */
  function paint(ctx, k, f, o = {}) {
    const m = SH[k], r = o.r || { x: 0, y: 0, w: C.W, h: C.H };
    const s = Math.max(r.w / m.w, r.h / m.h) * Math.max(1, o.s ?? 1);
    const dw = m.w * s, dh = m.h * s;
    const x = C.clamp(r.x + (r.w - dw) / 2 + (o.dx || 0), r.x + r.w - dw, r.x), y = C.clamp(r.y + (r.h - dh) / 2 + (o.dy || 0), r.y + r.h - dh, r.y);
    const ims = IM[k], i0 = o.blend ? Math.floor(f + 1e-6) : Math.round(f), a = o.blend ? f - i0 : 0;
    ctx.save();
    ctx.beginPath(); if (o.round) ctx.roundRect(r.x, r.y, r.w, r.h, o.round); else ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.globalAlpha = o.alpha ?? 1;
    ctx.drawImage(ims[C.clamp(i0, 0, ims.length - 1)], x, y, dw, dh);
    if (a > 0.02 && ims[i0 + 1]) { ctx.globalAlpha = (o.alpha ?? 1) * a; ctx.drawImage(ims[i0 + 1], x, y, dw, dh); }
    ctx.restore();
  }
  const draw = (ctx, cut, t, o = {}) => paint(ctx, cut.s, frameAt(cut, t), { blend: cut.blend ?? (cut.rate ?? 1) < 0.85, ...o });
  window.FOOT = { ready, frameAt, paint, draw, SH };
})();

// Footage layer: shots from the BMW PressClub films, pre-extracted as 1920x1080 JPEG frames (scripts/prep_frames.py →
// film/shots.js). Frames are painted with ctx.drawImage, which decodes synchronously, so frame t is always complete.
// Footage time is quantized to the output frame (every motion-blur sub-sample of a frame shows the same source frame);
// transforms keep continuous t. In 9:16 each shot is cropped around its own horizontal focus (shots.json fx).
(() => {
  const C = window.C, SH = window.SHOTS;
  const IW = 1920, IH = 1080;
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

  /** Paint shot k at frame position f, cover-fit to rect r (default full frame), scaled by s about image point (ax, ay) which
   *  lands on screen point (px, py). In 9:16 the default anchor is the shot's focus fx. Clamped so the image always covers r. */
  function paint(ctx, k, f, o = {}) {
    const r = o.r || { x: 0, y: 0, w: C.W, h: C.H };
    const lb = SH[k].lb || 0, ih = IH - 2 * lb;                     // letterboxed sources: only the active picture is used
    const base = Math.max(r.w / IW, r.h / ih), s = base * Math.max(1, o.s ?? 1);
    const ax = o.ax ?? (C.FMT === '9x16' ? SH[k].fx * IW : IW / 2), ay = o.ay ?? ih / 2;
    const px = o.px ?? r.x + r.w / 2, py = o.py ?? r.y + r.h / 2;
    const dw = IW * s, dh = ih * s;
    const dx = C.clamp(px - ax * s, r.x + r.w - dw, r.x), dy = C.clamp(py - ay * s, r.y + r.h - dh, r.y);
    const ims = IM[k], i0 = o.blend ? Math.floor(f + 1e-6) : Math.round(f), a = o.blend ? f - i0 : 0;
    ctx.save();
    ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.globalAlpha = 1;
    ctx.drawImage(ims[C.clamp(i0, 0, ims.length - 1)], 0, lb, IW, ih, dx, dy, dw, dh);
    if (a > 0.02 && ims[i0 + 1]) { ctx.globalAlpha = a; ctx.drawImage(ims[i0 + 1], 0, lb, IW, ih, dx, dy, dw, dh); }
    ctx.restore();
  }
  const draw = (ctx, cut, t, o = {}) => paint(ctx, cut.s, frameAt(cut, t), { blend: cut.blend ?? (cut.rate ?? 1) < 0.85, ...o });
  window.FOOT = { IW, IH, ready, frameAt, paint, draw };
})();

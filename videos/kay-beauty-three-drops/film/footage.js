// Footage layer: the brand's three launch reels, pre-extracted as upscaled 1080x1920 JPEG frames (scripts/prep_frames.sh).
// Frames are painted with ctx.drawImage, which decodes synchronously, so a frame drawn inside seek(t) is always complete and
// identical however the timeline was reached. In slow motion, fractional frame positions blend the two neighbours; at ~1x the
// nearest frame is shown (motion-compensated interpolation was tested and warps the rotating compacts). No <video>, no timers.
(() => {
  const C = window.C;
  const CLIPS = { A: { n: 270, fps: 25 }, B: { n: 166, fps: 25 }, C: { n: 198, fps: 30 } };
  const IW = 1080, IH = 1920;
  const IM = {};
  const ready = Promise.all(Object.entries(CLIPS).map(([k, c]) => {
    IM[k] = [];
    return Promise.all(Array.from({ length: c.n }, (_, i) => new Promise((ok) => {
      const im = new Image();
      im.onload = () => ok();
      im.onerror = () => { console.warn(`frame missing: ${k}/${i}`); ok(); };
      im.src = `../assets/frames/${k}/${String(i).padStart(4, '0')}.jpg`;
      IM[k][i] = im;
    })));
  }));

  // A shot: { k: clip, f0: first frame, t0: beat where f0 plays, rate: playback speed, f1: last usable frame, hold: beat to freeze at }
  // Footage time is quantized to the output frame, so every motion-blur sub-sample of a frame shows the SAME source frame
  // (the footage carries its own camera blur; blending two source frames inside one shutter would double-expose fast moves).
  // Transforms (zooms, strips) still use continuous t and keep their blur.
  function frameAt(sh, t) {
    const c = CLIPS[sh.k];
    let tt = Math.round(t * C.FPS) / C.FPS;
    if (sh.hold != null) tt = Math.min(tt, C.bt(sh.hold));
    const f = sh.f0 + (tt - C.bt(sh.t0)) * c.fps * (sh.rate ?? 1);
    return C.clamp(f, sh.fmin ?? sh.f0, sh.f1 ?? c.n - 1);
  }

  /**
   * Paint frame position f of clip k. The image (1080x1920 at s = 1) is scaled by s about image point (ax, ay), which lands
   * on screen point (px, py); it is clamped so it always covers the target rect r = {x, y, w, h} (default: full frame),
   * and is clipped to r (optionally rounded by r.round).
   */
  function paint(ctx, k, f, o = {}) {
    const r = o.r || { x: 0, y: 0, w: C.W, h: C.H };
    const s = Math.max(o.s ?? 1, r.w / IW, r.h / IH);
    const ax = o.ax ?? IW / 2, ay = o.ay ?? IH / 2;
    const px = o.px ?? r.x + r.w / 2, py = o.py ?? r.y + r.h / 2;
    const dw = IW * s, dh = IH * s;
    const dx = C.clamp(px - ax * s, r.x + r.w - dw, r.x), dy = C.clamp(py - ay * s, r.y + r.h - dh, r.y);
    // blend neighbours only in slow motion (small motion per frame); at ~1x a blend double-exposes fast moves, so take the nearest frame
    const ims = IM[k], i0 = o.blend ? Math.floor(f + 1e-6) : Math.round(f), a = o.blend ? f - i0 : 0;
    ctx.save();
    ctx.beginPath();
    if (r.round > 0.5) ctx.roundRect(r.x, r.y, r.w, r.h, r.round); else ctx.rect(r.x, r.y, r.w, r.h);   // springs overshoot: never a negative radius
    ctx.clip();
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.globalAlpha = 1;
    ctx.drawImage(ims[i0], dx, dy, dw, dh);
    if (a > 0.02 && ims[i0 + 1]) { ctx.globalAlpha = a; ctx.drawImage(ims[i0 + 1], dx, dy, dw, dh); }
    ctx.restore();
  }

  const draw = (ctx, sh, t, o = {}) => paint(ctx, sh.k, frameAt(sh, t), { blend: sh.blend ?? (sh.rate ?? 1) < 0.9, ...o });

  window.FOOT = { CLIPS, IW, IH, ready, frameAt, paint, draw };
})();

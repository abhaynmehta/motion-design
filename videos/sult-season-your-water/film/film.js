// SULT — "Season your water." Spec reel · 9:16 · 20 s · 119.87 BPM (measured) · 40 beats.
// Shotlist: docs/shotlist.md (APPROVED). Pure function of time: springs released on measured beats; linear seg()
// only for pushes, the counter, the powder fall and the push-through. No timers, no Math.random.
(() => {
  const { W, H, put, reg, el, scene, sp, spHit, seg, trk, clamp, lerp, ease, bt, beatOf, mulberry32 } = C;
  const { line, rise } = TYPE;
  const TL = C.TL, CP = TL.copy;
  C.fonts = ['900 100px Display', '700 40px UI', '600 40px UI', '500 20px UI'];
  const PAD = 90;
  const NS = 'http://www.w3.org/2000/svg';
  const px = (v) => v + 'px';
  const LOGO = '../assets/brand/sult-logo-lime.png', LOGO_AR = 2000 / 713;
  const FLAV = [
    { name: 'Watermelon Berry', stripe: '#A1326A', bg: '#F6B6E0', powder: [236, 150, 196], water: '#F08FCB', bottle: 'bottle-pink' },
    { name: 'Peach Citrus', stripe: '#D9836C', bg: '#F9C9B1', powder: [246, 180, 150], water: '#F6B08F', bottle: 'bottle-peach' },
    { name: 'Mango Tropical', stripe: '#E3A64A', bg: '#F6E29E', powder: [244, 205, 120], water: '#F4C766', bottle: 'bottle-mango' },
  ];
  const tracked = (L, em) => { L.el.style.letterSpacing = em + 'em'; return L; };
  const frag = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };

  // ---------------------------------------------------------------- the sachet, rebuilt in vector from the product photo
  // (assets/site/src/products-cards.webp): teal stick pack, crimped ends, lime top band + flavour line, "hydrate",
  // the SULT logo running down the pack, the pack's nutrition lines and the flavour pill. Two parts so it can tear.
  let SID = 0;
  function zig(x0, x1, yA, yB, n) { let d = ''; for (let i = 0; i <= n; i++) d += ` L${(x0 + (x1 - x0) * i / n).toFixed(1)},${i % 2 ? yB : yA}`; return d; }
  function makeSachet(parent, f, k = 1) {
    const id = 'sa' + (SID++), F = FLAV[f], w = 200 * k, h = 640 * k;
    const wrap = el('div', { class: 'abs shadow', style: `width:${w}px;height:${h}px;transform-origin:50% 50%` }, parent);
    const body = frag(`<svg viewBox="0 0 200 640" width="${w}" height="${h}" xmlns="${NS}" style="position:absolute;left:0;top:0;overflow:visible">
      <defs>
        <linearGradient id="t${id}" x1="0" x2="1"><stop offset="0" stop-color="#127F7B"/><stop offset=".16" stop-color="#28AFA8"/><stop offset=".3" stop-color="#55CEC5"/>
          <stop offset=".5" stop-color="#2DB2AA"/><stop offset=".84" stop-color="#1A9690"/><stop offset="1" stop-color="#0D736F"/></linearGradient>
        <linearGradient id="l${id}" x1="0" x2="1"><stop offset="0" stop-color="#AFC524"/><stop offset=".3" stop-color="#DCF04A"/><stop offset=".7" stop-color="#D2E83C"/><stop offset="1" stop-color="#A9BD22"/></linearGradient>
      </defs>
      <path d="M0,56 L200,56 L200,626${zig(200, 0, 626, 640, 20).replace(/^ L200,626/, '')} Z" fill="url(#t${id})"/>
      <rect x="0" y="56" width="200" height="18" fill="url(#l${id})"/>
      <rect x="0" y="74" width="200" height="6" fill="${F.stripe}"/>
      <text x="24" y="124" font-family="UI" font-weight="700" font-size="31" fill="#D6EF3E">hydrate</text>
      <image href="${LOGO}" x="0" y="0" width="330" height="${(330 / LOGO_AR).toFixed(1)}" transform="translate(${(40 + 330 / LOGO_AR).toFixed(1)},150) rotate(90)"/>
      <g font-family="UI" font-weight="500" font-size="11.5" fill="#D6EF3E">
        <text x="26" y="512">500mg Sodium</text><text x="26" y="527">304mg Potassium</text><text x="26" y="542">120mg Calcium</text>
        <text x="26" y="557">100mg Magnesium</text><text x="26" y="572">Coconut Water</text><text x="26" y="587">Zero Sugar</text></g>
      <rect x="150" y="468" width="28" height="134" rx="14" fill="${F.stripe}"/>
      <text transform="translate(168.5,535) rotate(90)" text-anchor="middle" font-family="UI" font-weight="600" font-size="11.5" fill="#fff">${F.name}</text>
      <rect x="16" y="80" width="13" height="546" fill="#fff" opacity=".2"/><rect x="140" y="80" width="6" height="546" fill="#fff" opacity=".1"/>
    </svg>`);
    wrap.appendChild(body);
    const top = el('div', { class: 'abs', style: `width:${w}px;height:${62 * k}px;transform-origin:0 100%` }, wrap);
    top.appendChild(frag(`<svg viewBox="0 0 200 62" width="${w}" height="${62 * k}" xmlns="${NS}" style="position:absolute;left:0;top:0;overflow:visible">
      <defs><linearGradient id="u${id}" x1="0" x2="1"><stop offset="0" stop-color="#AFC524"/><stop offset=".3" stop-color="#DCF04A"/><stop offset=".7" stop-color="#D2E83C"/><stop offset="1" stop-color="#A9BD22"/></linearGradient></defs>
      <path d="M0,14${zig(0, 200, 14, 0, 20).replace(/^ L0,14/, '')} L200,58${zig(200, 0, 58, 62, 16).replace(/^ L200,58/, '')} Z" fill="url(#u${id})"/>
    </svg>`));
    reg(wrap, { o: 0 }); reg(top);
    return { wrap, top, w, h };
  }

  // ---------------------------------------------------------------- a glass of water whose colour blooms with the powder
  function makeGlass(parent, k, f) {
    const id = 'gl' + (SID++), w = 400 * k, h = 540 * k, F = FLAV[f];
    const wrap = el('div', { class: 'abs', style: `width:${w}px;height:${h}px` }, parent);
    const svg = frag(`<svg viewBox="0 0 400 540" width="${w}" height="${h}" xmlns="${NS}" style="position:absolute;left:0;top:0;overflow:visible">
      <defs>
        <clipPath id="c${id}"><path d="M53,150 L347,150 L331,492 Q329,516 304,516 L96,516 Q71,516 69,492 Z"/></clipPath>
        <radialGradient id="r${id}"><stop offset="0" stop-color="${F.water}" stop-opacity=".95"/><stop offset=".6" stop-color="${F.water}" stop-opacity=".55"/><stop offset="1" stop-color="${F.water}" stop-opacity="0"/></radialGradient>
        <linearGradient id="w${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAFBFB" stop-opacity=".55"/><stop offset="1" stop-color="#BFEBEC" stop-opacity=".75"/></linearGradient>
      </defs>
      <ellipse cx="200" cy="532" rx="150" ry="12" fill="#000" opacity=".18"/>
      <path d="M40,20 L360,20 L333,500 Q330,530 300,530 L100,530 Q70,530 67,500 Z" fill="#fff" fill-opacity=".14"/>
      <g clip-path="url(#c${id})">
        <rect x="0" y="150" width="400" height="390" fill="url(#w${id})"/>
        <rect class="tint" x="0" y="150" width="400" height="390" fill="${F.water}" opacity="0"/>
        <g class="bloom"></g><g class="bub" fill="#fff" fill-opacity=".55"></g>
      </g>
      <ellipse class="surf" cx="200" cy="150" rx="147" ry="11" fill="#fff" fill-opacity=".35"/>
      <path d="M40,20 L360,20 L333,500 Q330,530 300,530 L100,530 Q70,530 67,500 Z" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="3.5"/>
      <ellipse cx="200" cy="20" rx="160" ry="10" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="3"/>
      <path d="M70,40 L92,500" stroke="#fff" stroke-opacity=".45" stroke-width="10" stroke-linecap="round"/>
      <path d="M318,48 L304,470" stroke="#fff" stroke-opacity=".25" stroke-width="6" stroke-linecap="round"/>
    </svg>`);
    wrap.appendChild(svg);
    const bloom = svg.querySelector('.bloom'), bub = svg.querySelector('.bub');
    const blobs = [...Array(6)].map((_, i) => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('fill', `url(#r${id})`); bloom.appendChild(c); return c; });
    const r = mulberry32(77 + f);
    const bubbles = [...Array(14)].map(() => { const c = document.createElementNS(NS, 'circle'); bub.appendChild(c); return { c, x: 80 + r() * 240, s: r(), sz: 2 + r() * 5, sp: 60 + r() * 90 }; });
    const seeds = blobs.map(() => ({ x: 150 + r() * 100, dx: (r() - 0.5) * 220, d: r() * 0.5, sz: 0.8 + r() * 0.6 }));
    reg(wrap);
    // per-frame water state from t (written every frame the glass is live)
    function paint(t, t0) {   // t0 = when the first powder hits the water (s)
      const q = clamp((t - t0) / 1.8), e = ease.out(q);
      svg.querySelector('.tint').setAttribute('opacity', (0.86 * e).toFixed(3));
      blobs.forEach((c, i) => {
        const s = seeds[i], p = clamp((t - t0 - s.d * 0.6) / 1.4);
        c.setAttribute('cx', (s.x + s.dx * ease.out(p)).toFixed(1));
        c.setAttribute('cy', (160 + 300 * ease.out(p)).toFixed(1));
        c.setAttribute('r', (p <= 0 ? 0 : 30 + 190 * s.sz * ease.out(p)).toFixed(1));
        c.setAttribute('opacity', (p <= 0 ? 0 : 0.9 * (1 - 0.5 * p)).toFixed(3));
      });
      bubbles.forEach((B) => {
        const life = 3.2, ph = ((t * B.sp / 300 + B.s) % 1), y = 510 - ph * 360;
        B.c.setAttribute('cx', (B.x + Math.sin((t + B.s * 9) * 3) * 6).toFixed(1)); B.c.setAttribute('cy', y.toFixed(1)); B.c.setAttribute('r', (B.sz * (0.6 + 0.4 * ph)).toFixed(2));
      });
    }
    return { wrap, w, h, paint, waterTop: 150 * k, waterMid: 330 * k };
  }

  // ---------------------------------------------------------------- 1 · hook + sachet + pour  (b0 → b8)
  scene({
    name: 'open', from: 0, to: 'season',
    build(root, S) {
      root.style.background = 'var(--lime)';
      S.cam = el('div', { class: 'abs', style: `width:${W}px;height:${H}px` }, root); reg(S.cam);
      S.hook = el('div', { class: 'abs', style: `width:${W}px;height:${H}px` }, S.cam); reg(S.hook);
      const Y0 = 560;
      S.nots = CP.nots.map(([a, bTxt], i) => {
        const y = Y0 + i * 300;
        const small = line(S.hook, a, { x: PAD, y, size: 70, cls: 'ui' });
        const big = line(S.hook, bTxt, { x: PAD - 6, y: y + 80, size: 156, cls: 'display' });
        big.el.style.fontStretch = '74%';
        const strike = el('div', { class: 'abs', style: `left:${PAD - 12}px;top:${y + 80 + 72}px;height:20px;width:10px;background:var(--ink);transform-origin:0 50%;border-radius:4px` }, S.hook);
        reg(strike, { sx: 0 });
        return { small, big, strike };
      });
      S.rightG = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;transform-origin:${PAD}px 560px` }, S.cam); reg(S.rightG);
      S.r1 = line(S.rightG, CP.right[0], { x: PAD - 8, y: 560, size: 290, cls: 'display' });
      S.r2 = line(S.rightG, CP.right[1], { x: PAD - 8, y: 560 + 270, size: 290, cls: 'display' });
      S.glass = makeGlass(S.cam, 0.95, 0);
      Object.assign(S.glass.wrap.style, { left: px(540 - S.glass.w / 2), top: '1290px' });
      S.ctx = C.canvas(S.cam);
      S.sachet = makeSachet(S.cam, 0, 1.25);
      const r = mulberry32(2025);
      S.grains = [...Array(220)].map(() => ({ s: r(), j: (r() - 0.5) * 22, vx: (r() - 0.5) * 50, sz: 1.4 + r() * 2.6, a: 0.55 + r() * 0.45 }));
    },
    run(t, b, S) {
      // hook: three lines, each struck through on the next beat; all lift out before "Just right." lands
      const notB = [beatOf('not1'), beatOf('not2'), beatOf('not3')], strB = [beatOf('strike1'), beatOf('strike2'), beatOf('strike3')];
      const OUT = 3.6;
      S.nots.forEach((n, i) => {
        rise(t, n.small, notB[i], OUT, { preset: 'heavy', exit: 0.3 });
        rise(t, n.big, notB[i] + 0.04, OUT, { preset: 'heavy', exit: 0.3 });
        const k = spHit(t, strB[i], 'snappy');
        const gone = sp(t, OUT - 0.22, 'snappy');                           // the strike retracts as its line lifts out
        put(n.strike, { sx: k * (1 - gone), x: 0 });
        put(n.big.el, { o: 1 - 0.5 * k }); put(n.small.el, { o: 1 - 0.5 * k });
      });
      rise(t, S.r1, beatOf('right') - 0.28, null, { preset: 'heavy' });   // rises as the struck lines finish lifting out
      rise(t, S.r2, beatOf('right') - 0.12, null, { preset: 'heavy', lead: 0.07 });
      const up = sp(t, beatOf('sachet') - 0.2, 'heavy');
      put(S.rightG, { y: -250 * up, s: 1 - 0.42 * up });
      // sachet: rises, tears on b6, tips over the glass on b7 and pours
      const rs = spHit(t, 'sachet', 'default'), pour = sp(t, 'pour', 'default');
      const sw = S.sachet.w, sh = S.sachet.h;
      const up0 = { cx: 690, cy: 1170, r: -9 }, po = { cx: 728, cy: 830, r: -152 };
      const cx = lerp(up0.cx, po.cx, pour), cy = lerp(up0.cy, po.cy, pour) + (1 - rs) * 1350, rot = lerp(up0.r, po.r, pour) - 10 * (1 - rs);
      put(S.sachet.wrap, { o: rs > 0.001 ? 1 : 0, x: cx - sw / 2, y: cy - sh / 2, r: rot });
      const tear = spHit(t, 'tear', 'snappy', 0.02);
      put(S.sachet.top, { x: -420 * tear, y: -1100 * tear, r: -50 * tear, hide: tear > 0.98 });
      // glass rises for the pour
      const g = sp(t, 6.4, 'default');
      put(S.glass.wrap, { y: (1 - g) * 760 });
      const tHit = bt('pour') + 0.38;
      S.glass.paint(t, tHit);
      // powder: grains leave the sachet mouth and fall into the glass (seeded; positions are a function of t)
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      const th = rot * Math.PI / 180, mouth = { x: cx + (sh / 2) * Math.sin(th), y: cy - (sh / 2) * Math.cos(th) };
      const surf = 1290 + S.glass.waterTop + (1 - g) * 760;
      const t0 = bt('pour') + 0.18, t1 = bt('season') - 0.05;
      if (t > t0 && b < beatOf('season')) {
        for (const p of S.grains) {
          const born = t0 + p.s * (t1 - t0) * 0.85, age = t - born;
          if (age <= 0) continue;
          const y = mouth.y + 40 * age + 0.5 * 2600 * age * age;
          if (y > surf) continue;
          const x = mouth.x + p.j + p.vx * age;
          ctx.fillStyle = `rgba(${FLAV[0].powder.join(',')},${p.a})`;
          ctx.beginPath(); ctx.arc(x, y, p.sz, 0, Math.PI * 2); ctx.fill();
        }
      }
      // push-through: the camera dives into the water, which fills the frame exactly on b8
      const k = ease.expoIn(seg(t, 7.35, 'season'));
      const wx = 540, wy = 1290 + S.glass.waterMid, sc = lerp(1, 6.5, k);
      put(S.cam, { x: lerp(wx, W / 2, k) - wx * sc, y: lerp(wy, H / 2, k) - wy * sc, s: sc });
    },
  });

  // ---------------------------------------------------------------- 2 · "Season your water."  (b8 → b12)
  scene({
    name: 'season', from: 'season', to: 'facts',
    build(root, S) {
      root.style.background = 'linear-gradient(180deg, #0B8A92 0%, #066970 55%, #04494E 100%)';
      S.push = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;transform-origin:540px 960px` }, root); reg(S.push);
      S.glass = makeGlass(S.push, 2.05, 0);
      S.gx = 540 - S.glass.w / 2; S.gy = 760;
      Object.assign(S.glass.wrap.style, { left: px(S.gx), top: px(S.gy), transformOrigin: `${S.glass.w / 2}px ${S.glass.waterMid}px` });
      S.l1 = line(S.push, CP.season[0], { x: PAD - 6, y: 300, size: 190, cls: 'display', color: 'var(--cream)' });
      S.l2 = line(S.push, CP.season[1], { x: PAD - 6, y: 300 + 178, size: 158, cls: 'display', color: 'var(--cream)', accent: [1] });
    },
    run(t, b, S) {
      put(S.push, { s: 1 + 0.035 * seg(t, 'season', 'facts') });
      // pull back out of the water: the glass starts filling the frame and settles (heavy)
      const m = sp(t, 'season', 'heavy');
      const restCy = S.gy + S.glass.waterMid;
      put(S.glass.wrap, { s: lerp(2.3, 1, m), y: lerp(960 - restCy, 0, m) });
      S.glass.paint(t, bt('season') - 0.15);
      rise(t, S.l1, beatOf('season') + 0.15, null, { preset: 'heavy' });
      rise(t, S.l2, 'season_w2', null, { preset: 'heavy', stagger: 0.12, lead: 0.07 });
    },
  });

  // ---------------------------------------------------------------- 3 · the facts  (b12 → b20)
  scene({
    name: 'facts', from: 'facts', to: 'flavours', post: 0.7,
    build(root, S) {
      root.style.background = 'var(--paper)';
      S.mark = el('div', { class: 'abs', style: 'background:var(--lime-ui);border-radius:28px;transform-origin:0 50%' }, root); reg(S.mark, { sx: 0 });
      S.s1 = line(root, CP.six[0], { x: PAD - 8, y: 360, size: 270, cls: 'display' });
      S.s2 = line(root, CP.six[1], { x: PAD - 6, y: 640, size: 134, cls: 'display' });
      S.pills = CP.elements.map(([sym, name], i) => {
        const x = PAD + (i % 2) * 442, y = 900 + Math.floor(i / 2) * 160;
        const p = el('div', { class: 'pill', style: `left:${x}px;top:${y}px;width:418px;height:132px;padding:0 38px;transform-origin:30% 50%` }, root,
          `<span class="display" style="font-size:62px;font-stretch:100%">${sym}</span><span class="ui" style="font-size:40px;font-weight:600">${name}</span>`);
        return reg(p, { o: 0 });
      });
      S.z0 = line(root, CP.zero[0], { x: PAD - 34, y: 330, size: 740, cls: 'display' });
      S.z1 = line(root, CP.zero[1], { x: PAD - 6, y: 1100, size: 240, cls: 'display' });
      S.m1 = line(root, CP.middle[0], { x: PAD - 6, y: 470, size: 150, cls: 'display' });
      S.m2 = line(root, CP.middle[1], { x: PAD, y: 660, size: 86, cls: 'ui' });
      const TY = 1180, TW = 840;
      S.track = el('div', { class: 'abs', style: `left:${PAD}px;top:${TY}px;width:${TW}px;height:8px;border-radius:4px;background:var(--ink);transform-origin:0 50%` }, root); reg(S.track, { sx: 0 });
      S.ticks = [0, 0.5, 1].map((u) => reg(el('div', { class: 'abs', style: `left:${PAD + u * TW - 3}px;top:${TY - 22}px;width:6px;height:52px;border-radius:3px;background:var(--ink)` }, root), { o: 0 }));
      S.lo = tracked(line(root, CP.scale[0], { x: PAD, y: TY + 104, size: 40, cls: 'ui caps' }), 0.08);
      S.hi = tracked(line(root, CP.scale[1], { x: PAD + TW - 272, y: TY + 104, size: 40, cls: 'ui caps' }), 0.08);
      S.dot = el('div', { class: 'abs', style: `left:0;top:${TY + 4 - 75}px;width:150px;height:150px;margin-left:-75px;border-radius:50%;background:var(--lime-ui);border:8px solid var(--ink);box-sizing:border-box;transform-origin:50% 50%` }, root);
      el('div', { class: 'logo', style: `left:23px;top:${(134 - 88 / LOGO_AR) / 2}px;width:88px;height:${88 / LOGO_AR}px` }, S.dot);
      reg(S.dot, { o: 0 });
      S.TW = TW;
    },
    run(t, b, S) {
      rise(t, S.s1, 'facts', 15.2, { preset: 'heavy', exit: 0.3 });
      rise(t, S.s2, beatOf('facts') + 0.12, 15.2, { preset: 'heavy', exit: 0.3 });
      put(S.mark, { sx: sp(t, beatOf('facts') + 0.25, 'default') * (1 - sp(t, 15.05, 'snappy')), hide: b >= 15.2 });
      S.pills.forEach((p, i) => {
        const k = spHit(t, beatOf('el1') + i * 0.5, 'snappy'), out = sp(t, 15.2, 'default');
        put(p, { o: clamp(k / 0.3), y: 40 * (1 - k) - 1500 * out, hide: out > 0.995 });
      });
      rise(t, S.z0, 'zero', 16.8, { preset: 'heavy', exit: 0.3 });
      rise(t, S.z1, beatOf('zero') + 0.1, 16.8, { preset: 'heavy', exit: 0.3 });
      // the scale: sweet ← → salty; the dot swings right, then lands in the middle
      const sc = beatOf('scale');
      put(S.track, { sx: sp(t, sc - 0.1, 'default') });
      S.ticks.forEach((k, i) => put(k, { o: b >= sc + i * 0.1 ? 1 : 0 }));
      rise(t, S.lo, sc, null, { preset: 'heavy' }); rise(t, S.hi, sc + 0.1, null, { preset: 'heavy' });
      rise(t, S.m1, sc, null, { preset: 'heavy' });
      rise(t, S.m2, 'natural', null, { preset: 'heavy', stagger: 0.06 });
      const lead = C.leadFor('snappy') / (C.bt(1) - C.bt(0));
      const x = trk(t, [[0, PAD], [sc - lead, PAD + S.TW, 'snappy'], [beatOf('middle') - lead, PAD + S.TW / 2, 'default']]);
      const pop = spHit(t, sc - 0.25, 'snappy');
      put(S.dot, { o: clamp(pop / 0.3), x, s: lerp(0.6, 1, pop) });
    },
    after(t, b, S) {   // the lime marker sits behind the "6"
      const r = C.rectOf(S.s1.words[1]);
      put(S.mark, { x: r.x - 24, y: r.y + 30, css: { width: px(r.w + 48), height: px(r.h - 70) } });
      S.nW = r;
    },
  });

  // ---------------------------------------------------------------- 4 · three flavours, whipping in  (b20 → b26)
  scene({
    name: 'flavours', from: 'flavours', to: 'fan', post: 0.6,
    build(root, S) {
      S.panels = FLAV.map((F, i) => {
        const p = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;background:${F.bg}` }, root); reg(p, { x: W });
        const label = tracked(line(p, `Flavour 0${i + 1}`, { x: PAD, y: 300, size: 30, cls: 'ui caps', color: 'rgba(20,20,20,.62)' }), 0.14);
        const [a, bb] = CP.flavours[i];
        const n1 = line(p, a, { x: PAD - 6, y: 352, size: 164, cls: 'display' });
        const n2 = line(p, bb + '.', { x: PAD - 6, y: 352 + 150, size: 164, cls: 'display' });
        const bottle = el('img', { src: `../assets/site/${F.bottle}.png`, class: 'abs shadow', style: `height:930px;left:575px;top:540px;transform-origin:50% 100%` }, p); reg(bottle, { o: 0 });
        const sachet = makeSachet(p, i, 1.08);
        return { p, label, n1, n2, bottle, sachet };
      });
      S.cap = line(root, CP.natural[0], { x: PAD, y: 1488, size: 36, cls: 'ui' });
    },
    run(t, b, S) {
      const fb = [beatOf('flavours'), beatOf('f2'), beatOf('f3')];
      S.panels.forEach((P, i) => {
        const k = spHit(t, fb[i], 'default'), next = i < 2 ? spHit(t, fb[i + 1], 'default') : 0;
        put(P.p, { x: W * (1 - k) - 260 * next, hide: k <= 0.0005 || next >= 0.9995 });
        rise(t, P.label, fb[i] + 0.1, null, { preset: 'heavy' });
        rise(t, P.n1, fb[i] + 0.12, null, { preset: 'heavy' });
        rise(t, P.n2, fb[i] + 0.24, null, { preset: 'heavy' });
        const bo = sp(t, fb[i] + 0.12, 'default'), drift = seg(t, fb[i], fb[i] + 2.6);
        put(P.bottle, { o: clamp(bo / 0.25), y: 160 * (1 - bo) - 24 * drift, r: 3 * (1 - bo) - 2 * drift });
        const sa = sp(t, fb[i] + 0.3, 'default');
        put(P.sachet.wrap, { o: sa > 0.001 ? 1 : 0, x: 250 - 60 * (1 - sa), y: 760 + 260 * (1 - sa) - 20 * drift, r: -16 + 10 * (1 - sa) + 3 * drift });
      });
      rise(t, S.cap, beatOf('flavours') + 0.6, null, { preset: 'heavy', stagger: 0.04 });
    },
  });

  // ---------------------------------------------------------------- 5 · the product card + the sachets fanning out  (b26 → b28)
  // The card is SULT's own product-card UI rebuilt element by element from the site screenshot: white rounded card,
  // product image, ★★★★★ (497), VARIETY PACK, From £19.99, lime SHOP NOW pill.
  scene({
    name: 'card', from: 'fan', to: 'proof',
    build(root, S) {
      root.style.background = 'var(--paper)';
      S.sachets = [0, 1, 2].map((i) => makeSachet(root, i, 1.0));
      S.card = el('div', { class: 'card', style: `left:${PAD}px;top:430px;width:650px;height:1000px;transform-origin:50% 100%` }, root); reg(S.card, { o: 0 });
      el('img', { src: '../assets/site/variety-box.png', style: 'position:absolute;left:40px;top:44px;width:540px' }, S.card);
      el('div', { class: 'ui', style: 'position:absolute;left:52px;top:712px;font-size:34px;font-weight:600;letter-spacing:.06em' }, S.card, '★★★★★ <span style="font-weight:500">(497)</span>');
      el('div', { class: 'ui', style: 'position:absolute;left:52px;top:764px;font-size:54px;font-weight:600;font-stretch:92%' }, S.card, 'VARIETY PACK');
      el('div', { class: 'ui', style: 'position:absolute;left:52px;top:832px;font-size:44px;font-weight:800' }, S.card, 'From £19.99');
      S.btn = el('div', { class: 'pill ui', style: 'left:52px;top:898px;height:76px;width:300px;justify-content:center;font-size:30px;font-weight:700;transform-origin:50% 50%' }, S.card, 'SHOP NOW');
      reg(S.btn);
      S.uk = line(root, CP.natural[1], { x: PAD, y: 1488, size: 40, cls: 'ui' });
    },
    run(t, b, S) {
      const k = spHit(t, 'fan', 'default');
      put(S.card, { o: clamp(k / 0.25), y: 300 * (1 - k), s: lerp(0.9, 1, k) });
      const press = spHit(t, 27.75, 'snappy') - sp(t, 28.0, 'snappy');
      put(S.btn, { s: 1 - 0.06 * press });
      const pose = [[770, 380, 8], [862, 470, 18], [950, 570, 28]];
      S.sachets.forEach((s, i) => {
        const f = spHit(t, 26.5 + i * 0.5, 'default');
        const [x, y, r] = pose[i];
        put(s.wrap, { o: f > 0.001 ? 1 : 0, x: lerp(430, x, f) - s.w / 2, y: lerp(700, y, f), r: lerp(0, r, f) });
      });
      rise(t, S.uk, 27, null, { preset: 'heavy' });
    },
  });

  // ---------------------------------------------------------------- 6 · proof  (b28 → b34)
  // Three blocks stacked one frame-height apart; each new line pushes the last one up past camera (no blank, no overlap).
  scene({
    name: 'proof', from: 'proof', to: 'logo',
    build(root, S) {
      root.style.background = 'var(--ink)';
      S.push = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;transform-origin:${PAD}px 900px` }, root); reg(S.push);
      S.strip = el('div', { class: 'abs', style: `width:${W}px;height:${H * 3}px` }, S.push); reg(S.strip);
      S.a1 = line(S.strip, CP.proof[0][0], { x: PAD - 6, y: 640, size: 236, cls: 'display', color: 'var(--cream)' });
      S.a2 = line(S.strip, CP.proof[0][1], { x: PAD - 6, y: 640 + 218, size: 236, cls: 'display', color: 'var(--lime)' });
      S.num = el('div', { class: 'display abs', style: `left:${PAD - 14}px;top:${H + 500}px;font-size:500px;color:var(--lime);font-variant-numeric:tabular-nums` }, S.strip, '0');
      reg(S.num);
      S.b1 = el('div', { class: 'display abs', style: `left:${PAD - 6}px;top:${H + 1010}px;font-size:156px;color:var(--cream)` }, S.strip, CP.proof[1][0]);
      S.c1 = el('div', { class: 'display abs', style: `left:${PAD - 6}px;top:${2 * H + 720}px;font-size:170px;color:var(--cream)` }, S.strip, CP.proof[2][0]);
      S.c2 = el('div', { class: 'display abs', style: `left:${PAD - 6}px;top:${2 * H + 720 + 172}px;font-size:170px;color:var(--lime)` }, S.strip, CP.proof[2][1]);
    },
    run(t, b, S) {
      put(S.push, { s: 1 + 0.04 * seg(t, 'proof', 'logo') });
      rise(t, S.a1, 'proof', null, { preset: 'heavy' });
      rise(t, S.a2, beatOf('proof') + 0.12, null, { preset: 'heavy' });
      const k1 = spHit(t, 'proof_n', 'default', 0.08), k2 = spHit(t, 'community', 'default', 0.08);
      put(S.strip, { y: -H * (k1 + k2) });
      // counter: ticks 0 → 150 over a beat and a half (one tick sound per eighth), then holds
      const n = Math.round(150 * ease.out(seg(t, 'proof_n', 31.5)));
      put(S.num, { text: String(n) });
    },
  });

  // ---------------------------------------------------------------- 7 · end card  (b34 → b40)
  scene({
    name: 'end', from: 'logo', to: 'done',
    build(root, S) {
      root.style.background = 'var(--lime)';
      S.push = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;transform-origin:${PAD}px 800px` }, root); reg(S.push);
      S.bottles = el('img', { src: '../assets/site/bottles-trio.png', class: 'abs shadow', style: 'left:350px;top:1250px;width:620px' }, S.push); reg(S.bottles, { o: 0 });
      const LW = 860;
      S.logo = el('div', { class: 'logo', style: `left:${PAD}px;top:540px;width:${LW}px;height:${LW / LOGO_AR}px;transform-origin:50% 50%` }, S.push); reg(S.logo, { o: 0 });
      S.slogan = line(S.push, CP.slogan, { x: PAD - 4, y: 900, size: 84, cls: 'display' });
      S.cta = el('div', { class: 'pill', style: `left:${PAD}px;top:1040px;width:620px;height:118px;justify-content:center;background:var(--ink);color:var(--lime);overflow:hidden;transform-origin:30% 50%` }, S.push,
        `<span class="ui" style="font-size:52px;font-weight:800">${CP.cta}</span>`);
      S.shine = el('div', { class: 'abs', style: 'top:0;width:160px;height:118px;background:linear-gradient(100deg, transparent, rgba(215,252,0,.45), transparent)' }, S.cta); reg(S.shine, { o: 0 });
      reg(S.cta, { o: 0 });
      S.boots = tracked(line(S.push, CP.boots, { x: PAD, y: 1196, size: 34, cls: 'ui caps' }), 0.12);
    },
    run(t, b, S) {
      put(S.push, { s: 1 + 0.04 * seg(t, 'logo', 'done') });
      const l = spHit(t, 'logo', 'heavy');
      put(S.logo, { o: clamp(l / 0.25), s: lerp(1.22, 1, l), y: 60 * (1 - l) });
      rise(t, S.slogan, beatOf('logo') + 1, null, { preset: 'heavy', stagger: 0.08 });
      const c = spHit(t, 'cta', 'snappy');
      put(S.cta, { o: clamp(c / 0.3), s: lerp(0.86, 1, c) });
      const sh = seg(t, 38.5, 39.4);
      put(S.shine, { o: sh > 0 && sh < 1 ? 1 : 0, x: -180 + 820 * ease.inOut(sh) });
      const bo = spHit(t, 'bottles', 'default');
      put(S.bottles, { o: clamp(bo / 0.25), y: 520 * (1 - bo) });
      rise(t, S.boots, 37, null, { preset: 'heavy' });
    },
  });

  C.start();

  // strike widths follow each struck line's live width (rectOf only in after hooks)
  C.hooks.after.push((t, b) => {
    const S = C.SCENES.find((s) => s.name === 'open');
    if (!S || b >= beatOf('season')) return;
    S.nots.forEach((n) => { const r = C.rectOf(n.big.el); put(n.strike, { css: { width: px(r.w + 6) } }); });
  });
})();

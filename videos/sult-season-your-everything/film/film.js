// SULT — "SEASON YOUR ___" · a motion concept for SULT™ · 9:16 · 30 s · 120 BPM · 60 beats.
// Source of truth: ../../brand/SULT_BRAND_BRIEF.md (tokens §3, headlines §2 verbatim, data §5, concept A §8, rules §10).
// Pure function of time: springs on measured beats; linear seg() only for typing, the counter, marquee scrolls, pours and
// slow pushes. No timers, no Math.random, nothing carried between frames.
(() => {
  const { W, H, FPS, put, reg, el, scene, sp, spHit, seg, trk, clamp, lerp, ease, bt, beatOf, mulberry32, noise1 } = C;
  const { line, rise } = TYPE;
  C.fonts = ['900 100px Display', '700 40px UI', '400 40px UI'];
  const PAD = 90, NS = 'http://www.w3.org/2000/svg', px = (v) => v + 'px';
  const LOGO_LIME = '../assets/brand/logo-lime.png', LOGO_DARK = '../assets/brand/logo-dark.png', LOGO_AR = 2000 / 713;
  const frag = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
  const BEAT = C.bt(1) - C.bt(0);
  const FLAV = [
    { name: 'Watermelon Berry', stripe: '#C23C7E', bg: '#F5B5DA', water: '#EE8FCB', powder: [238, 160, 205], bottle: 'bottle-pink-tall' },
    { name: 'Peach Citrus', stripe: '#E08A6C', bg: '#F8C8AE', water: '#F4B08D', powder: [246, 184, 152], bottle: 'bottle-peach' },
    { name: 'Mango Tropical', stripe: '#E3A13E', bg: '#F6DF92', water: '#F2C766', powder: [244, 205, 120], bottle: 'bottle-mango' },
  ];

  // ---------------------------------------------------------------- the sachet (vector rebuild of the SULT stick pack)
  let SID = 0;
  const zig = (x0, x1, yA, yB, n) => { let d = ''; for (let i = 1; i <= n; i++) d += ` L${(x0 + (x1 - x0) * i / n).toFixed(1)},${i % 2 ? yB : yA}`; return d; };
  function makeSachet(parent, f, k = 1, generic = false) {
    const id = 'sa' + (SID++), F = FLAV[f], w = 200 * k, h = 640 * k;
    const wrap = el('div', { class: 'abs shadow', style: `width:${w}px;height:${h}px;transform-origin:50% 50%` }, parent);
    const c = generic ? ['#8E8E95', '#B9B9C0', '#DADADF', '#B5B5BC', '#9C9CA3', '#7E7E85'] : ['#06918F', '#16B8B6', '#4FD6D3', '#1ABEBC', '#0AA3A1', '#057C7A'];
    const body = frag(`<svg viewBox="0 0 200 640" width="${w}" height="${h}" xmlns="${NS}" style="position:absolute;left:0;top:0;overflow:visible">
      <defs><linearGradient id="t${id}" x1="0" x2="1">${c.map((col, i) => `<stop offset="${[0, .16, .3, .52, .84, 1][i]}" stop-color="${col}"/>`).join('')}</linearGradient>
        <linearGradient id="l${id}" x1="0" x2="1"><stop offset="0" stop-color="#B9D400"/><stop offset=".35" stop-color="#E4FA22"/><stop offset=".7" stop-color="#DAF214"/><stop offset="1" stop-color="#B2CB00"/></linearGradient></defs>
      <path d="M0,56 L200,56 L200,626${zig(200, 0, 626, 640, 20)} Z" fill="url(#t${id})"/>
      ${generic ? '' : `<rect x="0" y="56" width="200" height="18" fill="url(#l${id})"/><rect x="0" y="74" width="200" height="6" fill="${F.stripe}"/>
      <text x="24" y="124" font-family="UI" font-weight="700" font-size="31" fill="#DDF52A">hydrate</text>
      <image href="${LOGO_LIME}" x="0" y="0" width="330" height="${(330 / LOGO_AR).toFixed(1)}" transform="translate(${(40 + 330 / LOGO_AR).toFixed(1)},150) rotate(90)"/>
      <g font-family="UI" font-weight="400" font-size="11.5" fill="#DDF52A"><text x="26" y="512">500mg Sodium</text><text x="26" y="527">304mg Potassium</text>
        <text x="26" y="542">120mg Calcium</text><text x="26" y="557">100mg Magnesium</text><text x="26" y="572">Coconut Water</text><text x="26" y="587">Zero Sugar</text></g>
      <rect x="150" y="468" width="28" height="134" rx="14" fill="${F.stripe}"/>
      <text transform="translate(168.5,535) rotate(90)" text-anchor="middle" font-family="UI" font-weight="700" font-size="11.5" fill="#fff">${F.name}</text>`}
      <rect x="16" y="80" width="13" height="546" fill="#fff" opacity=".22"/><rect x="140" y="80" width="6" height="546" fill="#fff" opacity=".1"/>
    </svg>`);
    wrap.appendChild(body);
    const top = el('div', { class: 'abs', style: `width:${w}px;height:${62 * k}px;transform-origin:0 100%` }, wrap);
    top.appendChild(frag(`<svg viewBox="0 0 200 62" width="${w}" height="${62 * k}" xmlns="${NS}" style="position:absolute;left:0;top:0;overflow:visible">
      <defs><linearGradient id="u${id}" x1="0" x2="1"><stop offset="0" stop-color="${generic ? '#8E8E95' : '#B9D400'}"/><stop offset=".35" stop-color="${generic ? '#D2D2D8' : '#E4FA22'}"/><stop offset="1" stop-color="${generic ? '#86868D' : '#B2CB00'}"/></linearGradient></defs>
      <path d="M0,14${zig(0, 200, 14, 0, 20)} L200,58${zig(200, 0, 58, 62, 16)} Z" fill="url(#u${id})"/></svg>`));
    const back = el('div', { class: 'abs', style: `width:${w}px;height:${h}px` }, wrap);
    back.appendChild(frag(`<svg viewBox="0 0 200 640" width="${w}" height="${h}" xmlns="${NS}" style="position:absolute;left:0;top:0;overflow:visible">
      <path d="M0,14${zig(0, 200, 14, 0, 20)} L200,626${zig(200, 0, 626, 640, 20)} Z" fill="url(#t${id})"/>
      <rect x="0" y="14" width="200" height="60" fill="url(#l${id})"/><rect x="0" y="74" width="200" height="6" fill="${F.stripe}"/>
      <text transform="translate(118,150) rotate(90)" font-family="Display" font-weight="900" font-size="34" fill="#DDF52A">season your water.</text>
      <g font-family="UI" font-weight="700" font-size="12" fill="#DDF52A"><text x="24" y="560">6 ELECTROLYTES</text><text x="24" y="578">ZERO SUGAR · MADE IN THE UK</text></g>
      <rect x="16" y="80" width="13" height="546" fill="#fff" opacity=".22"/></svg>`));
    reg(wrap, { o: 0 }); reg(top); reg(body); reg(back, { hide: true });
    return { wrap, top, body, back, w, h };
  }

  // ---------------------------------------------------------------- the glass: clear water that blooms with the powder
  function makeGlass(parent, k, f) {
    const id = 'gl' + (SID++), w = 400 * k, h = 540 * k, F = FLAV[f];
    const wrap = el('div', { class: 'abs', style: `width:${w}px;height:${h}px` }, parent);
    const svg = frag(`<svg viewBox="0 0 400 540" width="${w}" height="${h}" xmlns="${NS}" style="position:absolute;left:0;top:0;overflow:visible">
      <defs><clipPath id="c${id}"><path d="M53,150 L347,150 L331,492 Q329,516 304,516 L96,516 Q71,516 69,492 Z"/></clipPath>
        <radialGradient id="r${id}"><stop offset="0" stop-color="${F.water}" stop-opacity=".95"/><stop offset=".6" stop-color="${F.water}" stop-opacity=".55"/><stop offset="1" stop-color="${F.water}" stop-opacity="0"/></radialGradient>
        <linearGradient id="w${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2FCFC" stop-opacity=".6"/><stop offset="1" stop-color="#C9EFF0" stop-opacity=".8"/></linearGradient></defs>
      <ellipse cx="200" cy="532" rx="150" ry="12" fill="#000" opacity=".16"/>
      <path d="M40,20 L360,20 L333,500 Q330,530 300,530 L100,530 Q70,530 67,500 Z" fill="#fff" fill-opacity=".18"/>
      <g clip-path="url(#c${id})"><rect x="0" y="150" width="400" height="390" fill="url(#w${id})"/>
        <rect class="tint" x="0" y="150" width="400" height="390" fill="${F.water}" opacity="0"/><g class="bloom"></g><g class="bub" fill="#fff" fill-opacity=".6"></g></g>
      <ellipse cx="200" cy="150" rx="147" ry="11" fill="#fff" fill-opacity=".4"/>
      <path d="M40,20 L360,20 L333,500 Q330,530 300,530 L100,530 Q70,530 67,500 Z" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="3.5"/>
      <ellipse cx="200" cy="20" rx="160" ry="10" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="3"/>
      <path d="M70,40 L92,500" stroke="#fff" stroke-opacity=".5" stroke-width="10" stroke-linecap="round"/><path d="M318,48 L304,470" stroke="#fff" stroke-opacity=".3" stroke-width="6" stroke-linecap="round"/>
    </svg>`);
    wrap.appendChild(svg);
    const tint = svg.querySelector('.tint'), bloom = svg.querySelector('.bloom'), bub = svg.querySelector('.bub');
    const r = mulberry32(91 + f);
    const blobs = [...Array(6)].map(() => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('fill', `url(#r${id})`); bloom.appendChild(c); return { c, x: 150 + r() * 100, dx: (r() - 0.5) * 220, d: r() * 0.5, sz: 0.8 + r() * 0.6 }; });
    const bubbles = [...Array(14)].map(() => { const c = document.createElementNS(NS, 'circle'); bub.appendChild(c); return { c, x: 80 + r() * 240, s: r(), sz: 2 + r() * 5, sp: 60 + r() * 90 }; });
    reg(wrap);
    function paint(t, t0) {
      const e = ease.out(clamp((t - t0) / 1.8));
      tint.setAttribute('opacity', (0.86 * e).toFixed(3));
      for (const B of blobs) {
        const p = clamp((t - t0 - B.d * 0.6) / 1.4), q = ease.out(p);
        B.c.setAttribute('cx', (B.x + B.dx * q).toFixed(1)); B.c.setAttribute('cy', (160 + 300 * q).toFixed(1));
        B.c.setAttribute('r', (p <= 0 ? 0 : 30 + 190 * B.sz * q).toFixed(1)); B.c.setAttribute('opacity', (p <= 0 ? 0 : 0.9 * (1 - 0.5 * p)).toFixed(3));
      }
      for (const B of bubbles) {
        const ph = (t * B.sp / 300 + B.s) % 1;
        B.c.setAttribute('cx', (B.x + Math.sin((t + B.s * 9) * 3) * 6).toFixed(1)); B.c.setAttribute('cy', (510 - ph * 360).toFixed(1)); B.c.setAttribute('r', (B.sz * (0.6 + 0.4 * ph)).toFixed(2));
      }
    }
    return { wrap, w, h, paint, waterTop: 150 * k, waterMid: 330 * k };
  }

  // a typed line with a lime highlight box that tracks the text and a blinking cursor
  function makeSlot(parent, x, y, size) {
    const box = el('div', { class: 'abs', style: `left:${x - 14}px;top:${y - 10}px;height:${size * 1.02}px;background:var(--lime);transform-origin:0 50%` }, parent);
    const txt = el('div', { class: 'display abs', style: `left:${x}px;top:${y}px;font-size:${size}px` }, parent, '');
    const cur = el('div', { class: 'abs', style: `left:${x}px;top:${y - 2}px;width:${Math.round(size * 0.09)}px;height:${size * 0.86}px;background:var(--ink)` }, parent);
    reg(box, { o: 0 }); reg(txt); reg(cur, { o: 0 });
    return { box, txt, cur, x, size };
  }

  // ---------------------------------------------------------------- 1 · hook  (b0 → b4)
  scene({
    name: 'hook', from: 0, to: 'pov', post: 0.6,
    build(root, S) {
      root.style.background = 'var(--ink)';
      S.push = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;transform-origin:${PAD}px 800px` }, root); reg(S.push);
      S.box = el('div', { class: 'abs', style: `left:${PAD - 18}px;top:684px;height:158px;width:880px;background:var(--lime);transform-origin:0 50%` }, S.push); reg(S.box, { sx: 0 });
      S.l1 = line(S.push, '70% OF US', { x: PAD, y: 700, size: 148, cls: 'display' });
      S.l2 = line(S.push, 'ARE', { x: PAD, y: 880, size: 148, cls: 'display', color: 'var(--white)' });
      S.l3 = line(S.push, 'DEHYDRATED.', { x: PAD, y: 1040, size: 122, cls: 'display', color: 'var(--white)' });
      S.sub = line(S.push, "It's not that we're not", { x: PAD, y: 1230, size: 52, cls: 'ui', color: 'rgba(255,255,255,.85)' });
      S.sub2 = line(S.push, 'drinking enough.', { x: PAD, y: 1296, size: 52, cls: 'ui', color: 'rgba(255,255,255,.85)' });
    },
    run(t, b, S) {
      put(S.push, { s: 1 + 0.03 * seg(t, 'hook', 'pov') });
      put(S.box, { sx: sp(t, -0.7, 'snappy') });
      rise(t, S.l1, [-0.45, -0.38, -0.31], null, { preset: 'heavy' });
      rise(t, S.l2, 'h_are', null, { preset: 'heavy', lead: 0.13 });
      rise(t, S.l3, 'h_dehy', null, { preset: 'heavy', lead: 0.13 });
      rise(t, S.sub, 'h_sub', null, { preset: 'heavy', stagger: 0.04, lead: 0.05 });
      rise(t, S.sub2, beatOf('h_sub') + 0.2, null, { preset: 'heavy', stagger: 0.04 });
    },
  });

  // ---------------------------------------------------------------- 2 · POV  (b3.5 → b8): hard lime wipe, fisheye photos
  scene({
    name: 'pov', from: 'pov', to: 'season', pre: 0.5,
    build(root, S) {
      root.style.background = 'var(--lime)';
      S.p1 = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;overflow:hidden` }, root); reg(S.p1);
      S.i1 = el('img', { src: '../assets/photo/pov1.jpg', class: 'cover', style: 'transform-origin:50% 45%' }, S.p1); reg(S.i1);
      S.p2 = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;overflow:hidden` }, root); reg(S.p2, { x: W });
      S.i2 = el('img', { src: '../assets/photo/pov2.jpg', class: 'cover', style: 'transform-origin:50% 40%' }, S.p2); reg(S.i2);
      S.edge = el('div', { class: 'abs', style: `width:${W}px;height:70px;background:var(--lime)` }, root); reg(S.edge, { o: 0 });
      const cap = (txt, y) => { const c = el('div', { class: 'abs ui', style: `left:${PAD}px;top:${y}px;padding:22px 34px;border-radius:22px;background:#fff;color:var(--ink);font-size:56px;box-shadow:0 10px 30px rgba(0,0,0,.18);transform-origin:0 50%` }, root, txt); return reg(c, { o: 0 }); };
      S.c1 = cap('POV: YOU TAKE SULT', 1180);
      S.c2 = cap('WHEN DO I SULT?', 1180);
    },
    run(t, b, S) {
      const k = sp(t, beatOf('pov') - 0.45, 'default');      // the wipe lands on the beat (the whoosh peaks there)
      put(S.root, { clip: k >= 0.999 ? 'none' : `inset(${((1 - k) * 100).toFixed(3)}% 0 0 0)` });
      put(S.edge, { o: k > 0.002 && k < 0.995 ? 1 : 0, y: (1 - k) * H - 2 });
      put(S.i1, { s: lerp(1.16, 1.0, sp(t, 'pov', 'heavy')) * (1 + 0.04 * seg(t, 'pov', 'season')) });
      const k2 = spHit(t, 'pov2', 'default', 0.05);
      put(S.p2, { x: W * (1 - k2) });
      put(S.p1, { x: -260 * k2 });
      put(S.i2, { s: lerp(1.12, 1.0, sp(t, 'pov2', 'heavy')) });
      const c1 = sp(t, beatOf('pov_cap') + 0.03, 'snappy'), c1o = sp(t, beatOf('pov2') - 0.3, 'snappy');
      put(S.c1, { o: clamp(c1 / 0.3) * (c1o < 0.98 ? 1 : 0), s: lerp(0.7, 1, c1) * (1 - 0.3 * c1o), y: 0 });
      const c2 = sp(t, beatOf('pov2_cap') + 0.03, 'snappy');
      put(S.c2, { o: clamp(c2 / 0.3), s: lerp(0.7, 1, c2) });
    },
  });

  // ---------------------------------------------------------------- 3–4 · SEASON YOUR ___  (b8 → b24)
  const WORDS = [['w1', 'MORNING.'], ['w2', 'WORKOUT.'], ['w3', '3PM SLUMP.'], ['w4', 'HANGOVER.'], ['water', 'WATER.']];
  const PORTRAITS = ['ellen', 'freeman', 'omac', 'yaz'];
  const GROUNDS = ['var(--sky)', 'var(--teal)', 'var(--stone)', 'var(--ink)'];
  scene({
    name: 'season', from: 'season', to: 'marquee', post: 0.6,
    build(root, S) {
      S.grounds = GROUNDS.concat(['var(--sky)']).map((g) => reg(el('div', { class: 'abs', style: `width:${W}px;height:${H}px;background:${g}` }, root), { o: 0 }));
      S.cam = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;transform-origin:540px 960px` }, root); reg(S.cam);
      S.cards = PORTRAITS.map((p) => {
        const c = el('div', { class: 'card', style: `left:${PAD}px;top:640px;width:900px;height:1125px;transform-origin:50% 0%` }, S.cam);
        const img = el('img', { src: `../assets/photo/${p}.jpg`, class: 'cover', style: 'transform-origin:50% 40%' }, c);
        return { c: reg(c, { o: 0 }), img: reg(img) };
      });
      S.head = el('div', { class: 'display abs', style: `left:${PAD}px;top:300px;font-size:120px` }, S.cam, 'SEASON YOUR'); reg(S.head, { o: 0 });
      S.slot = makeSlot(S.cam, PAD, 440, 120);
      // WATER. — the product moment
      S.glass = makeGlass(S.cam, 1.08, 0);
      Object.assign(S.glass.wrap.style, { left: '520px', top: '980px' });
      S.ctx = C.canvas(S.cam);
      S.sachet = makeSachet(S.cam, 0, 1.15);
      const r = mulberry32(2026);
      S.grains = [...Array(240)].map(() => ({ s: r(), j: (r() - 0.5) * 24, vx: (r() - 0.5) * 50, sz: 1.4 + r() * 2.6, a: 0.55 + r() * 0.45 }));
      S.facts = ['1,900MG', '6 ELECTROLYTES', '0G SUGAR'].map((s, i) => {
        const p = el('div', { class: 'pill display', style: `left:${PAD}px;top:${1020 + i * 136}px;height:112px;padding:0 34px;font-size:64px;transform-origin:0 50%` }, S.cam, s);
        return reg(p, { o: 0 });
      });
      S.shake = noise1(14);
    },
    run(t, b, S) {
      const wb = WORDS.map(([m]) => beatOf(m));
      let cur = -1; for (let i = 0; i < wb.length; i++) if (b >= wb[i] - 0.02) cur = i;
      S.grounds.forEach((g, i) => put(g, { o: i === cur ? 1 : 0 }));       // hard cuts on the beat
      const dark = cur === 3;
      put(S.head, { o: 1, css: { color: dark ? '#fff' : 'var(--ink)' } });
      // typewriter: types each word in, backspaces it out before the next cut
      let txt = '';
      if (cur >= 0) {
        const full = WORDS[cur][1], w0 = wb[cur];
        let n = Math.floor(seg(t, w0 + 0.08, w0 + 0.7) * full.length + 1e-6);
        if (cur < 4) n = Math.min(n, Math.ceil(full.length * (1 - seg(t, w0 + 1.5, w0 + 1.85)) - 1e-6));
        txt = full.slice(0, n);
      }
      put(S.slot.txt, { text: txt });
      const blink = Math.floor(b * 2) % 2 === 0 || (cur >= 0 && b - wb[cur] < 0.75);
      put(S.slot.cur, { o: blink ? 1 : 0, css: { background: dark && !txt ? '#fff' : 'var(--ink)' } });
      put(S.slot.box, { o: txt ? 1 : 0 });
      // portraits: a flash cut on every word; punch in, then drift; a little camera shake on HANGOVER
      S.cards.forEach((c, i) => {
        const on = cur === i, k = sp(t, wb[i], 'heavy');
        put(c.c, { o: on ? 1 : 0, y: on ? 30 * (1 - k) : 0 });
        put(c.img, { s: lerp(1.18, 1.03, k) + 0.03 * seg(t, wb[i], wb[i] + 2) });
      });
      if (cur === 3) {
        const a = clamp((b - wb[3]) / 0.2) * (1 - clamp((b - wb[3] - 1.6) / 0.3));
        put(S.cam, { x: 14 * a * S.shake(t * 9), y: 10 * a * S.shake(t * 9 + 50), r: 0.9 * a * S.shake(t * 7 + 99) });
      }
      // WATER.: the sachet rises, tears and pours into the glass, which blooms; the facts stack up
      const live = b >= wb[4] - 0.2;
      const rs = spHit(t, 'sachet', 'default'), pour = sp(t, 'pour', 'default'), sw = S.sachet.w, sh = S.sachet.h;
      const up0 = { cx: 760, cy: 1150, r: 8 }, po = { cx: 831, cy: 760, r: -165 };
      const cx = lerp(up0.cx, po.cx, pour), cy = lerp(up0.cy, po.cy, pour) + (1 - rs) * 1300, rot = lerp(up0.r, po.r, pour) + 12 * (1 - rs);
      put(S.sachet.wrap, { o: live && rs > 0.001 ? 1 : 0, x: cx - sw / 2, y: cy - sh / 2, r: rot });
      const tear = spHit(t, 'tear', 'snappy', 0.02);
      put(S.sachet.top, { x: 380 * tear, y: -1000 * tear, r: 45 * tear, hide: tear > 0.98 });
      const g = spHit(t, 'pour', 'default');
      const gl = sp(t, beatOf('water') + 0.1, 'default');
      put(S.glass.wrap, { o: live ? 1 : 0, y: (1 - gl) * 900 });
      S.glass.paint(t, bt('pour') + 0.4);
      const ctx = S.ctx; ctx.clearRect(0, 0, W, H);
      const th = rot * Math.PI / 180, mouth = { x: cx + (sh / 2) * Math.sin(th), y: cy - (sh / 2) * Math.cos(th) };
      const surf = 980 + S.glass.waterTop + (1 - gl) * 900;
      const t0 = bt('pour') + 0.2, t1 = bt('bloom') + 0.8;
      if (live && t > t0 && t < t1 + 0.6) for (const p of S.grains) {
        const age = t - (t0 + p.s * (t1 - t0)); if (age <= 0) continue;
        const y = mouth.y + 40 * age + 1300 * age * age; if (y > surf) continue;
        ctx.fillStyle = `rgba(${FLAV[0].powder.join(',')},${p.a})`; ctx.beginPath(); ctx.arc(mouth.x + p.j + p.vx * age, y, p.sz, 0, 6.2832); ctx.fill();
      }
      const fb = ['f1900', 'f6', 'f0g'].map(beatOf);
      S.facts.forEach((p, i) => { const k = spHit(t, fb[i], 'snappy', 0.02); put(p, { o: live ? clamp(k / 0.3) : 0, s: lerp(0.7, 1, k), x: -40 * (1 - k) }); });
      if (cur !== 3) put(S.cam, { s: 1 + (live ? 0.03 * seg(t, 'water', 'marquee') : 0) });
    },
    after(t, b, S) {   // the highlight box and the cursor follow the typed text
      const r = C.rectOf(S.slot.txt);
      const w = S.slot.txt.textContent ? r.w : 0;
      put(S.slot.box, { css: { width: px(w + 28) } });
      put(S.slot.cur, { x: w + (w ? 10 : 0) });
    },
  });

  // ---------------------------------------------------------------- 5 · free-from marquee + "NO BULLSH*T."  (b23.5 → b28)
  const FREE = ['GMO', 'ADDED SUGAR', 'CAFFEINE', 'FILLERS', 'GLUTEN', 'DAIRY'];
  scene({
    name: 'marquee', from: 'marquee', to: 'built', pre: 0.5,
    build(root, S) {
      root.style.background = 'var(--lime)';
      S.rows = [...Array(7)].map((_, ri) => {
        const row = el('div', { class: 'abs', style: `top:${250 + ri * 200}px;left:0;white-space:nowrap` }, root);
        const words = [];
        for (let k = 0; k < 10; k++) {
          const wtxt = FREE[(k + ri * 2) % FREE.length];
          const sp_ = el('span', { class: 'display', style: 'position:relative;display:inline-block;font-size:150px;margin-right:70px' }, row, wtxt);
          const strike = el('span', { style: 'position:absolute;left:-6px;right:-6px;top:52%;height:16px;background:var(--ink);transform-origin:0 50%' }, sp_);
          words.push(reg(strike, { sx: 0 }));
        }
        return { row: reg(row), words, dir: ri % 2 ? 1 : -1 };
      });
      S.l = [['NO SUGAR,', 'bs1'], ['NO CAFFEINE,', 'bs2'], ['NO BULLSH*T.', 'bs3']].map(([s, m], i) => {
        const bx = el('div', { class: 'abs', style: `left:${PAD - 18}px;top:${640 + i * 170}px;height:150px;width:900px;background:var(--ink);transform-origin:0 50%` }, root);
        reg(bx, { sx: 0 });
        return { bx, L: line(root, s, { x: PAD, y: 652 + i * 170, size: 118, cls: 'display', color: 'var(--lime)' }), m };
      });
    },
    run(t, b, S) {
      const k = sp(t, beatOf('marquee') - 0.45, 'default');
      put(S.root, { clip: k >= 0.999 ? 'none' : `inset(${((1 - k) * 100).toFixed(3)}% 0 0 0)` });
      const dim = sp(t, beatOf('bs1') - 0.3, 'default');
      S.rows.forEach((R, ri) => {
        const off = (R.dir < 0 ? -200 : -1600) + R.dir * 520 * (t - bt('marquee') + 0.25);
        put(R.row, { x: off, o: 1 - 0.82 * dim });
        R.words.forEach((s, wi) => put(s, { sx: sp(t, 24.5 + ((wi + ri) % 4) * 0.5, 'snappy') }));
      });
      S.l.forEach((o) => {
        const kk = sp(t, beatOf(o.m) - 0.04, 'snappy');
        put(o.bx, { sx: kk });
        rise(t, o.L, o.m, null, { preset: 'heavy', stagger: 0.05, lead: 0.05 });
      });
    },
  });

  // ---------------------------------------------------------------- 6 · WE'RE BUILT DIFFERENT. — racing bars (brief §5 table)
  const ROWS = [['SULT', true], ['OTHER BRANDS', false], ['SPORTS DRINKS', false], ['COCONUT WATER', false]];
  const SUGAR = [[0, '0G'], [11, '5–11G'], [30, '20–30G'], [18, '15–18G']], ELEC = [[1900, '1,900MG'], [910, '910MG'], [350, '300–350MG'], [800, '700–800MG']];
  scene({
    name: 'built', from: 'built', to: 'six',
    build(root, S) {
      root.style.background = 'var(--sky)';
      S.h1 = line(root, "WE'RE BUILT", { x: PAD, y: 290, size: 124, cls: 'display' });
      S.h2 = line(root, 'DIFFERENT.', { x: PAD, y: 410, size: 124, cls: 'display' });
      S.kSug = line(root, 'SUGAR PER SERVING', { x: PAD, y: 630, size: 40, cls: 'ui caps' });
      S.kEl = line(root, 'TOTAL ELECTROLYTES', { x: PAD, y: 630, size: 40, cls: 'ui caps' });
      S.rows = ROWS.map(([name, us], i) => {
        const y = 720 + i * 158;
        const lab = line(root, name, { x: PAD, y, size: 34, cls: 'ui caps' });
        const bar = el('div', { class: 'abs', style: `left:${PAD}px;top:${y + 50}px;height:62px;width:10px;border-radius:31px;background:${us ? 'var(--ink)' : 'rgba(38,30,30,.18)'};transform-origin:0 50%` }, root);
        const val = el('div', { class: 'display abs', style: `left:0;top:${y + 54}px;font-size:54px;color:${us ? 'var(--ink)' : 'rgba(38,30,30,.7)'}` }, root, '');
        return { lab, bar: reg(bar, { o: 0 }), val: reg(val, { o: 0 }), us };
      });
      S.zero = el('div', { class: 'pill display', style: `left:${PAD}px;top:770px;height:62px;padding:0 26px;font-size:46px;transform-origin:0 50%` }, root, '0G SUGAR'); reg(S.zero, { o: 0 });
      S.price = el('div', { class: 'pill display', style: `left:${PAD}px;top:1380px;height:110px;padding:0 40px;font-size:62px;transform-origin:0 50%` }, root, '£1 PER SERVING.'); reg(S.price, { o: 0 });
    },
    run(t, b, S) {
      rise(t, S.h1, 'built', null, { preset: 'heavy', lead: 0.06 });
      rise(t, S.h2, beatOf('built') + 0.15, null, { preset: 'heavy' });
      const toEl = beatOf('elec');
      rise(t, S.kSug, beatOf('sugar') - 0.3, toEl - 0.3, { preset: 'heavy', exit: 0.25 });
      rise(t, S.kEl, toEl, null, { preset: 'heavy' });
      const MAXW = 560;
      S.rows.forEach((R, i) => {
        rise(t, R.lab, beatOf('sugar') - 0.3 + i * 0.06, null, { preset: 'heavy' });
        const sw = SUGAR[i][0] / 30 * MAXW, ew = ELEC[i][0] / 1900 * MAXW;
        const wv = trk(t, [[0, 0], [beatOf('sugar') + i * 0.08 - 0.08, R.us ? 0 : Math.max(18, sw), 'default'], [toEl + (R.us ? 0.46 : i * 0.06), ew, R.us ? 'snappy' : 'default']]);
        put(R.bar, { o: b >= beatOf('sugar') - 0.1 && wv > 2 ? 1 : 0, css: { width: px(Math.max(0, wv)), background: R.us ? (b >= toEl ? 'var(--lime)' : 'var(--ink)') : 'rgba(38,30,30,.18)' } });
        const txt = b < toEl ? SUGAR[i][1] : ELEC[i][1];
        put(R.val, { o: b >= beatOf('sugar') + 0.3 + i * 0.08 && !(R.us && b < toEl) ? 1 : 0, x: PAD + Math.max(18, wv) + 22, text: txt });
      });
      const z = spHit(t, 30, 'snappy', 0.02), zo = sp(t, toEl - 0.2, 'snappy');
      put(S.zero, { o: clamp(z / 0.3) * (zo < 0.98 ? 1 : 0), s: lerp(0.6, 1, z) * (1 - 0.4 * zo) });
      const pr = spHit(t, 'price', 'snappy', 0.02);
      put(S.price, { o: clamp(pr / 0.3), s: lerp(0.7, 1, pr) });
    },
  });

  // ---------------------------------------------------------------- 7 · ALL 6 — ingredients burst out of the sachet  (b36 → b42)
  const ING = ['PINK HIMALAYAN SALT', 'POTASSIUM', 'MAGNESIUM', 'COCONUT WATER', 'CALCIUM · AQUAMIN', 'PHOSPHORUS'];
  scene({
    name: 'six', from: 'six', to: 'flav',
    build(root, S) {
      root.style.background = 'linear-gradient(180deg, #00C3C8 0%, #00AEB4 100%)';
      S.h = line(root, 'ALL 6', { x: PAD - 6, y: 270, size: 230, cls: 'display' });
      S.sub = line(root, "If it's in our product, there's a reason.", { x: PAD, y: 520, size: 40, cls: 'ui' });
      S.sachet = makeSachet(root, 0, 1.25);
      S.cards = ING.map((s, i) => {
        const c = el('div', { class: 'pill ui caps', style: `left:${PAD}px;top:${660 + i * 128}px;height:100px;padding:0 34px;font-size:36px;transform-origin:50% 50%` }, root,
          `<span class="display" style="font-size:40px;margin-right:22px;opacity:.55">0${i + 1}</span>${s}`);
        return reg(c, { o: 0 });
      });
    },
    run(t, b, S) {
      rise(t, S.h, 'six', null, { preset: 'heavy', lead: 0.06 });
      rise(t, S.sub, beatOf('six') + 0.4, null, { preset: 'heavy', stagger: 0.03 });
      const s = spHit(t, 'six', 'default'), sw = S.sachet.w, sh = S.sachet.h;
      put(S.sachet.wrap, { o: s > 0.001 ? 1 : 0, x: 800 - sw / 2, y: 1080 - sh / 2 + 900 * (1 - s), r: 10 - 4 * Math.sin(t * 2) });
      S.cards.forEach((c, i) => {
        const k = sp(t, beatOf('ing1') + i * 0.5, 'default');
        put(c, { o: clamp(k / 0.25), x: (800 - 300) * (1 - k), y: (1080 - (660 + i * 128)) * (1 - k), s: lerp(0.3, 1, k) });
      });
    },
  });

  // ---------------------------------------------------------------- 8 · flavour drops: iris floods  (b42 → b48)
  scene({
    name: 'flav', from: 'flav', to: 'proof',
    build(root, S) {
      root.style.background = 'linear-gradient(180deg, #00C3C8 0%, #00AEB4 100%)';
      S.p = FLAV.map((F, i) => {
        const p = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;background:${F.bg}` }, root); reg(p, { clip: 'circle(0px at 760px 1100px)' });
        const [a, bb] = F.name.toUpperCase().split(' ');
        const n1 = line(p, a, { x: PAD, y: 300, size: 132, cls: 'display' }), n2 = line(p, bb + '.', { x: PAD, y: 420, size: 132, cls: 'display' });
        const bottle = el('img', { src: `../assets/product/${F.bottle}.png`, class: 'abs shadow', style: `height:1100px;left:${i === 0 ? 560 : 540}px;top:560px;transform-origin:50% 100%` }, p);
        const sachet = makeSachet(p, i, 1.05);
        return { p, n1, n2, bottle: reg(bottle, { o: 0 }), sachet };
      });
    },
    run(t, b, S) {
      const fb = ['flav', 'flav2', 'flav3'].map(beatOf);
      S.p.forEach((P, i) => {
        const k = spHit(t, fb[i], 'default');
        put(P.p, { clip: `circle(${(2300 * k).toFixed(1)}px at 760px 1100px)`, hide: k <= 0.0005 || (i < 2 && spHit(t, fb[i + 1], 'default') > 0.9995) });
        rise(t, P.n1, fb[i] - 0.05, null, { preset: 'heavy' }); rise(t, P.n2, fb[i] + 0.05, null, { preset: 'heavy' });
        const bo = sp(t, fb[i] - 0.2, 'default'), d = seg(t, fb[i], fb[i] + 2.4);
        put(P.bottle, { o: clamp(bo / 0.25), y: -700 * (1 - bo) - 20 * d, r: 8 * (1 - bo) - 2 * d });
        // the sachet spins once (a flip across its vertical axis) as it lands
        const sa = sp(t, fb[i] - 0.05, 'default'), flip = Math.cos(Math.PI * 2 * ease.out(seg(t, fb[i] + 0.1, fb[i] + 1.2)));
        put(P.sachet.wrap, { o: sa > 0.001 ? 1 : 0, x: 200, y: 820 + 400 * (1 - sa), r: -14 + 6 * d, sx: flip });
        put(P.sachet.body, { hide: flip < 0 }); put(P.sachet.top, { hide: flip < 0 }); put(P.sachet.back, { hide: flip >= 0 });
      });
    },
  });

  // ---------------------------------------------------------------- 9 · proof  (b48 → b54)
  const PRESS = [['vogue', 900 / 249], ['dazed', 819 / 197], ['british-vogue', 704 / 300], ['boots', 566 / 300]];
  scene({
    name: 'proof', from: 'proof', to: 'logo',
    build(root, S) {
      root.style.background = 'var(--stone)';
      S.num = el('div', { class: 'display abs', style: `left:${PAD}px;top:300px;font-size:142px;font-variant-numeric:tabular-nums` }, root, '0'); reg(S.num, { o: 0 });
      S.sub = line(root, 'SULT SACHETS.', { x: PAD, y: 460, size: 108, cls: 'display' });
      S.stars = el('div', { class: 'abs', style: `left:${PAD}px;top:640px;display:flex;align-items:center;gap:24px` }, root,
        `<span class="pill display" style="position:relative;height:96px;padding:0 30px;font-size:56px">★★★★★ 4.9</span><span class="ui" style="font-size:34px;line-height:1.25">497 REVIEWS<br>97% WOULD RECOMMEND</span>`);
      reg(S.stars, { o: 0 });
      S.card = el('div', { class: 'card', style: `left:${PAD}px;top:800px;width:880px;height:300px;padding:48px 50px;box-sizing:border-box;transform-origin:0 50%` }, root,
        `<div class="ui" style="font-size:30px;margin-bottom:18px">★★★★★</div><div class="ui" style="font-size:54px;line-height:1.1">“they literally taste like juice”</div><div class="ui" style="font-weight:400;font-size:32px;margin-top:22px;opacity:.7">— Savannah S.</div>`);
      reg(S.card, { o: 0 });
      S.seen = line(root, 'AS SEEN IN', { x: PAD, y: 1180, size: 36, cls: 'ui caps' });
      let x = PAD;
      S.logos = PRESS.map(([n, ar], i) => {
        const h = n === 'dazed' ? 64 : 78, w = h * ar;
        const m = el('div', { class: 'mask', style: `left:${x}px;top:${1262 + (78 - h) / 2}px;width:${w}px;height:${h}px;-webkit-mask-image:url(../assets/press/${n}.png);mask-image:url(../assets/press/${n}.png);transform-origin:50% 50%` }, root);
        x += w + 44;
        return reg(m, { o: 0 });
      });
      S.logoRowW = x - PAD - 44;
    },
    run(t, b, S) {
      const ni = spHit(t, 'proof', 'heavy');
      const n = Math.round(1000000 * ease.out(seg(t, 48.25, 49.75)));
      put(S.num, { o: clamp(ni / 0.3), y: 80 * (1 - ni), text: n.toLocaleString('en-GB') + (n >= 1000000 ? '+' : '') });
      rise(t, S.sub, beatOf('proof') + 0.2, null, { preset: 'heavy' });
      const st = spHit(t, 'stars', 'snappy', 0.02); put(S.stars, { o: clamp(st / 0.3), x: -40 * (1 - st) });
      const rc = spHit(t, 'review', 'default'); put(S.card, { o: clamp(rc / 0.25), y: 120 * (1 - rc), s: lerp(0.94, 1, rc) });
      rise(t, S.seen, beatOf('press') - 0.25, null, { preset: 'heavy' });
      S.logos.forEach((m, i) => { const k = sp(t, beatOf('press') + i * 0.25, 'snappy'); put(m, { o: clamp(k / 0.3), s: lerp(0.6, 1, k), y: 20 * (1 - k) }); });
      // the row is wider than the frame: it drifts left so every logo passes the safe area
      const drift = Math.max(0, S.logoRowW - (950 - PAD)) * ease.inOut(seg(t, 52.5, 54));
      S.logos.forEach((m) => put(m, { x: -drift }));
    },
  });

  // ---------------------------------------------------------------- 10 · end card  (b54 → b60)
  scene({
    name: 'end', from: 'logo', to: 'done',
    build(root, S) {
      root.style.background = 'var(--lime)';
      S.push = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;transform-origin:${PAD}px 700px` }, root); reg(S.push);
      S.bottle = el('img', { src: '../assets/product/bottle-pink-tall.png', class: 'abs shadow', style: 'height:880px;left:640px;top:1120px' }, S.push); reg(S.bottle, { o: 0 });
      S.sachets = [0, 1, 2].map((i) => makeSachet(S.push, i, 0.95));
      S.logo = el('img', { src: LOGO_DARK, class: 'abs', style: `left:${PAD}px;top:500px;width:860px;transform-origin:50% 50%` }, S.push); reg(S.logo, { o: 0 });
      S.slogan = line(S.push, 'season your water.', { x: PAD - 4, y: 860, size: 100, cls: 'display lower' });
      S.cta = el('div', { class: 'pill ui', style: `left:${PAD}px;top:1010px;height:116px;width:580px;justify-content:center;background:var(--ink);color:var(--lime);font-size:52px;overflow:hidden;transform-origin:30% 50%` }, S.push, 'drinksult.com');
      reg(S.cta, { o: 0 });
      S.label = line(S.push, 'A MOTION CONCEPT FOR SULT™', { x: PAD, y: 1170, size: 30, cls: 'ui caps' });
    },
    run(t, b, S) {
      put(S.push, { s: 1 + 0.035 * seg(t, 'logo', 'done') });
      const l = spHit(t, 'logo', 'heavy');
      put(S.logo, { o: clamp(l / 0.25), s: lerp(1.25, 1, l) });
      rise(t, S.slogan, 'slogan', null, { preset: 'heavy', stagger: 0.08, lead: 0.15 });
      const c = spHit(t, 'cta', 'snappy'); put(S.cta, { o: clamp(c / 0.3), s: lerp(0.85, 1, c) });
      rise(t, S.label, 'label', null, { preset: 'heavy', stagger: 0.04, lead: 0.05 });
      const bo = spHit(t, beatOf('cta') + 0.5, 'default'); put(S.bottle, { o: clamp(bo / 0.25), y: 600 * (1 - bo) });
      const pose = [[330, 1330, -18], [450, 1280, -6], [570, 1320, 8]];
      S.sachets.forEach((s, i) => {
        const k = spHit(t, beatOf('cta') + 0.75 + i * 0.25, 'default'), [x, y, r] = pose[i];
        put(s.wrap, { o: k > 0.001 ? 1 : 0, x: x - s.w / 2, y: y + 700 * (1 - k), r: r * k });
      });
    },
  });

  // ---------------------------------------------------------------- finish: flash-photo pops on the portrait cuts (≤ 1/s)
  scene({
    name: 'fx', from: 0, to: 'done',
    build(root, S) {
      root.style.pointerEvents = 'none';
      S.flash = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;background:#fff` }, root); reg(S.flash, { o: 0 });
      S.times = ['pov', 'w1', 'w2', 'w3', 'w4', 'water'].map((m) => C.bt(m));
    },
    run(t, b, S) {
      let o = 0;
      for (const ft of S.times) if (t >= ft - 1 / FPS) o = Math.max(o, 0.82 * Math.exp(-(t - ft + 1 / FPS) / 0.075));
      put(S.flash, { o: o < 0.01 ? 0 : o });
    },
  });

  C.start();
})();

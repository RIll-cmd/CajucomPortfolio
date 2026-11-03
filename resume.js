/* The middle card: draw a circle on the glass, your name appears, scroll into a server room in the sky, and hold until a human hand and a robot hand touch. Then the résumé.
   Certifications, awards and skills come from tome.js and the projects from works.js, so each is written once. The pictures are rendered by tools/ in Blender. */
const RESUME_WORDS = {
  name: 'Cyrill', role: 'ASPIRING SOFTWARE / AI ENGINEER',
  full: 'Cyrill Gerard P. Cajucom',
  intro: ['Aspiring software and AI engineer, based in Manila.', '4th-year BS Computer Science student at FEU Tech, specializing in software engineering. Looking for a 500-hour internship.'],
  experience: [{ h: 'Backend AI Engineering Intern', logo: 'flyrank', d: ['FlyRank AI, Sep 2026 to present. Remote.', 'AI capstones, automation and data-heavy apps, agent skills with documentation, and token and cost analysis.'] }],
  education: [{ h: 'BS Computer Science, Software Engineering', logo: 'feutech', d: ["FEU Institute of Technology, 2023 to 2027. 4th year, Dean's Lister."] }, { h: 'Senior High, STEM', logo: 'spusm', d: ['St. Paul University at San Miguel, 2021 to 2023. With High Honors.'] }],
  talk: "Let's talk", boxes: [['Have a role or an internship in mind?', 'Say hello', 'hello'], ['Everything I have made', 'See my works', 'works'], ['The full record, page by page', 'Open Experiences', 'experiences']],
  banner: 'Open to work', sections: ['About', 'Experience', 'Education', 'Works', 'Certifications', 'Awards', 'Skills', "Let's talk"],
};
// Where each hand sits in its render: the crop, and the index fingertip in each frame, as fractions of the 1120 x 800 stage.
const RESUME_HANDS = {
  robot: { box: [0, .1925, .683, .45], tips: [[.6482, .4788], [.6509, .4875], [.6536, .495], [.6571, .5025], [.6598, .5088], [.6634, .5138], [.667, .5162], [.6705, .5188], [.6741, .52], [.6786, .5212]] },
  point: { box: [.4179, .4, .2661, .55], tips: [[.4991, .4075]] },
  human: { box: [.3321, .4475, .6679, .5525], tips: [[.3527, .485], [.3527, .4863], [.3509, .4888], [.3491, .4913], [.35, .4913], [.3464, .495], [.3464, .495], [.3446, .4963], [.342, .4975], [.3393, .4988]] },
};
const RESUME_ASPECT = 800 / 1120, RESUME_INK = '#10302d', RESUME_SOFT = '#3f5c58', RESUME_TEAL = '#0f8f7f', RESUME_RULE = 'rgba(16,48,45,.16)';
const RESUME_SERIF = '"Playfair Display", Georgia, serif', RESUME_SANS = '"Instrument Sans", "Segoe UI", sans-serif', RESUME_MONO = '"JetBrains Mono", Consolas, monospace';
const RESUME_HOLD_S = reduced ? .01 : 1.5, RESUME_FLASH_S = reduced ? .01 : 1.1, RESUME_TITLE_S = reduced ? .01 : 1.1, RESUME_FLOOD_S = reduced ? .01 : .85;
let resume = null, resumeDone = false, resumePics = null, resumeSprites = null;
const resumeClamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const resumeEase = t => { t = resumeClamp(t); return t * t * (3 - 2 * t); };

/* ---------- Pictures, fetched once ---------- */
function resumeLoad() {
  if (resumePics) return resumePics;
  const pic = src => { const i = new Image(); i.onload = () => { dirty = true; }; i.src = src; return i; }, frames = n => Array.from({ length: RESUME_HANDS[n].tips.length }, (_, k) => pic(`photos/hands/${n}-${String(k).padStart(2, '0')}.webp`));
  return resumePics = { world: pic('photos/hands/world.webp'), veil: pic('photos/hands/veil.webp'), glass: pic('photos/hands/glass.webp'), tie: pic('photos/me-tie.jpg'), barong: pic('photos/me-barong.jpg'), flyrank: pic('photos/flyrank.webp'), feutech: pic('photos/feutech.webp'), spusm: pic('photos/spusm.webp'), robot: frames('robot'), human: frames('human'), point: frames('point'), works: WORKS_WORDS.items.map(it => pic(`photos/works/${it.shots[0].names[0]}.jpg`)) };
}
function resumeSpritesMake() { // data and blossom petals drifting through the air: soft lights, near and far, petals, and bits
  if (resumeSprites) return resumeSprites;
  const sheet = (size, draw) => { const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size); return c; };
  const dot = color => sheet(64, (x, s) => { const l = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); l.addColorStop(0, color); l.addColorStop(.35, color.replace(/[\d.]+\)$/, '.5)')); l.addColorStop(1, color.replace(/[\d.]+\)$/, '0)')); x.fillStyle = l; x.fillRect(0, 0, s, s); });
  const petal = () => sheet(64, (x, s) => { x.translate(s / 2, s / 2); x.rotate(-.45); const l = x.createRadialGradient(-4, -4, 1, 0, 0, s * .38); l.addColorStop(0, 'rgba(255,215,230,.92)'); l.addColorStop(.65, 'rgba(244,158,192,.75)'); l.addColorStop(1, 'rgba(235,130,175,0)'); x.fillStyle = l; x.beginPath(); x.ellipse(0, 0, s * .34, s * .21, 0, 0, 7); x.fill(); });
  const bit = t => sheet(48, (x, s) => { x.font = `500 ${s * .62}px ${RESUME_MONO}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.shadowColor = 'rgba(30,230,200,.9)'; x.shadowBlur = 8; x.fillStyle = 'rgba(235,255,250,.95)'; x.fillText(t, s / 2, s / 2); });
  const rnd = seeded(61), count = COARSE ? 36 : 68, list = Array.from({ length: count }, (_, i) => { const near = i % 7 === 0, isPetal = !near && i % 5 === 0; return { x: rnd(), y: rnd(), z: near ? 1.6 + rnd() : .4 + rnd(), kind: near ? 0 : isPetal ? 4 : i % 3 ? 1 : 2 + (i % 2), v: .012 + rnd() * .03, sway: rnd() * 6.28, spin: rnd() }; });
  return resumeSprites = { soft: dot('rgba(140,245,225,.8)'), glint: dot('rgba(255,255,255,.95)'), petal: petal(), bits: [bit('0'), bit('1')], list };
}
function resumeOrb() { // the little planet on the dock
  const c = document.createElement('canvas'), s = 96; c.width = c.height = s; const x = c.getContext('2d'), l = x.createRadialGradient(s * .38, s * .32, 2, s / 2, s / 2, s / 2); l.addColorStop(0, '#c9f7ea'); l.addColorStop(.55, '#39b49c'); l.addColorStop(1, '#0d5c54'); x.fillStyle = l; x.beginPath(); x.arc(s / 2, s / 2, s / 2, 0, 7); x.fill();
  x.strokeStyle = 'rgba(235,255,250,.55)'; x.lineWidth = 3; for (const r of [.16, .3, .44]) { x.beginPath(); x.ellipse(s / 2, s / 2, s * r, s * r * .42, -.6, 0, 7); x.stroke(); } return c;
}

/* ---------- Laying out, once for each screen size ---------- */
function resumeMeasure(L, dt = 0) { // places each section on its own full-screen slot so one scroll steps cleanly from part to part
  const r = resume, topY = L.narrow ? 66 : 72, botY = H - (L.narrow ? 82 : 88), viewH = Math.max(160, botY - topY);
  const secs = [], panels = [], stops = [], tops = new Array(L.blocks.length);
  let cur = null, moving = false;
  L.blocks.forEach((b, i) => {
    if (b.kind === 'mark') { cur = { name: b.name, list: [], h: 0 }; secs.push(cur); }
    let h = b.h;
    if (b.kind === 'open') {
      const want = r && r.open[b.key] ? 1 : 0, was = r && r.k[b.key] !== undefined ? r.k[b.key] : want;
      if (Math.abs(want - was) >= .004) moving = true;
      b.kNow = !r || reduced || !dt ? want : Math.abs(want - was) < .004 ? want : was + (want - was) * (1 - Math.exp(-dt * 11));
      if (r) r.k[b.key] = b.kNow;
      h += b.bodyH * resumeEase(b.kNow);
    }
    b.hNow = h;
    cur.list.push(i);
    cur.h += h;
  });
  L.moving = moving;
  let slotY = 0, panel = null;
  for (const sec of secs) {
    sec.slotY = slotY;
    sec.padTop = sec.h <= viewH ? topY + (viewH - sec.h) * .42 : sec.h <= viewH + 48 ? Math.max(58, topY - (sec.h - viewH) * .4) : topY;
    sec.span = sec.h > viewH + 48 ? sec.h - viewH : 0;
    const steps = sec.span > 0 ? Math.ceil(sec.span / (viewH * .78)) : 0;
    for (let k = 0; k <= steps; k++) stops.push({ y: slotY + (steps ? sec.span * k / steps : 0), name: sec.name });
    let y = slotY + sec.padTop;
    for (const i of sec.list) {
      const b = L.blocks[i];
      tops[i] = y;
      if (b.kind === 'on') panel = { from: y };
      else if (b.kind === 'off' && panel) { panel.to = y + b.hNow; panels.push(panel); panel = null; }
      y += b.hNow;
    }
    slotY += sec.span + H;
  }
  L.secs = secs; L.tops = tops; L.panels = panels; L.stops = stops;
  L.max = stops.length ? stops[stops.length - 1].y : 0;
}
function resumeLayout() {
  if (resume.L && resume.L.W === W && resume.L.H === H && resume.L.pr === pr) return resume.L;
  const tall = W / H < 1, narrow = W < 760, L = { W, H, pr, tall, narrow, blocks: [], hot: [], max: 0 };
  const colW = Math.min(W * (tall ? .92 : .8), 1040), x0 = (W - colW) / 2, pad = tall ? 20 : 34, inner = colW - pad * 2, left = x0 + pad;
  const title = resumeClamp(tall ? W * .1 : Math.min(W * .05, H * .09), 32, 64), row = resumeClamp(tall ? W * .056 : Math.min(W * .022, H * .04), 19, 28), note = resumeClamp(row * .64, 14.5, 17), mid = left + inner * .46, midW = inner * .54;
  const serif = (s, w = 500) => `${w} ${s}px ${RESUME_SERIF}`, sans = (s, w = 500) => `${w} ${s}px ${RESUME_SANS}`, mono = s => `500 ${s}px ${RESUME_MONO}`;
  const put = (list, t, x, y, font, size, color = RESUME_INK, grad = false) => list.push({ t, x, y, font, size, color, grad });
  const para = (list, t, x, y, w, font, size, color, lead = 1.45, grad = false) => { g.font = font; for (const l of wrapLines(t, w)) { put(list, l, x, y, font, size, color, grad); y += size * lead; } return y; };
  const add = b => { L.blocks.push(Object.assign({ items: [], pics: [] }, b)); return L.blocks[L.blocks.length - 1]; };
  const mark = name => add({ kind: 'mark', name, h: 0 }), gap = h => add({ kind: 'gap', h }), panelOn = () => add({ kind: 'on', h: pad * .7 }), panelOff = () => add({ kind: 'off', h: pad * .7 });
  const heading = name => { mark(name); const b = add({ kind: 'title', h: title * 1.4 }); put(b.items, name, left, 0, serif(title, 500), title, RESUME_INK, true); };
  // About.
  mark('About');
  {
    const a = add({ kind: 'plain', h: 0 }), big = resumeClamp(tall ? W * .115 : Math.min(W * .058, H * .1), 36, 76), photoW = tall ? colW * .62 : colW * .36, photoH = photoW * 823 / 941, textW = tall ? inner : colW - photoW - pad * 1.5;
    let y = tall ? photoH + pad : H * .03; a.pics.push({ img: 'tie', x: tall ? (W - photoW) / 2 : x0 + colW - photoW, y: 0, w: photoW, h: photoH, r: 18 });
    y = para(a.items, RESUME_WORDS.full, tall ? left : x0, y, textW, serif(big, 500), big, RESUME_INK, 1.12, true) + big * .3;
    for (const l of RESUME_WORDS.intro) y = para(a.items, l, tall ? left : x0, y, textW, sans(row * .92), row * .92, RESUME_SOFT, 1.5) + row * .35;
    a.h = Math.max(y, tall ? 0 : photoH);
  }
  const entries = (list, photo) => {
    panelOn();
    const pw = photo ? (tall ? colW * .48 : Math.min(inner * .22, H * .25)) : 0, b = add({ kind: 'plain', h: 0 }), w = photo && !tall ? inner - pw - pad : inner; let y = 0;
    if (photo) { const ph = pw * 1418 / 941; b.pics.push({ img: photo, x: tall ? (W - pw) / 2 : left + inner - pw, y: 0, w: pw, h: ph, r: 12 }); if (tall) y = ph + pad * .7; b.minH = ph; }
    const ls = resumeClamp(row * 2.5, 48, 66), lg = Math.round(ls * .28);
    list.forEach((e, i) => {
      const ey = y, tx = e.logo ? left + ls + lg : left, tw = e.logo ? w - ls - lg : w;
      y = para(b.items, e.h, tx, y, tw, serif(row, 500), row, RESUME_INK, 1.25) + row * .18;
      for (const d of e.d) y = para(b.items, d, tx, y, tw, sans(note), note, RESUME_SOFT, 1.5) + note * .2;
      if (e.logo) { const eh = y - ey, ly = ey + Math.max(0, (eh - ls) * .35); b.pics.push({ img: e.logo, x: left, y: ly, w: ls, h: ls, r: e.logo === 'flyrank' ? 14 : 0, contain: e.logo !== 'flyrank' }); y = Math.max(y, ey + ls); }
      if (i < list.length - 1) y += row * .65;
    });
    b.h = Math.max(y, b.minH || 0); panelOff();
  };
  heading('Experience'); entries(RESUME_WORDS.experience);
  heading('Education'); entries(RESUME_WORDS.education, 'barong');
  heading('Works');
  if (tall) {
    WORKS_WORDS.items.forEach((it, n) => {
      add({ kind: 'on', h: pad * .55 });
      const b = add({ kind: 'plain', h: 0 }), iw = inner, ih = Math.min(iw * .4, H * .16); b.pics.push({ works: n, x: left, y: 0, w: iw, h: ih, r: 10 });
      let y = ih + pad * .45;
      y = para(b.items, it.t, left, y, inner, serif(row * 1.02, 500), row * 1.02, RESUME_INK, 1.2) + row * .12; y = para(b.items, it.copy.replace(/ Solo project\.$/, ''), left, y, inner, sans(note * .95), note * .95, RESUME_SOFT, 1.38) + note * .28; y = para(b.items, it.topics.join('  ·  '), left, y, inner, mono(note * .8), note * .8, RESUME_TEAL, 1.35);
      b.h = y; add({ kind: 'off', h: pad * .55 }); if (n < WORKS_WORDS.items.length - 1) gap(10);
    });
  } else {
    panelOn();
    WORKS_WORDS.items.forEach((it, n) => {
      const b = add({ kind: 'plain', h: 0, rule: n > 0 }), iw = Math.min(inner * .22, H * .25), ih = iw * .56, padY = n ? row * .45 : 0; b.pics.push({ works: n, x: left, y: padY, w: iw, h: ih, r: 10 });
      let y = padY; const x = left + iw + pad * .85, w = inner - iw - pad * .85;
      y = para(b.items, it.t, x, y, w, serif(row * 1.04, 500), row * 1.04, RESUME_INK, 1.22) + row * .14; y = para(b.items, it.copy.replace(/ Solo project\.$/, ''), x, y, w, sans(note * .96), note * .96, RESUME_SOFT, 1.42) + note * .32; y = para(b.items, it.topics.join('  ·  '), x, y, w, mono(note * .8), note * .8, RESUME_TEAL, 1.4);
      b.h = Math.max(y, padY + ih) + (n < WORKS_WORDS.items.length - 1 ? row * .45 : 0);
    });
    panelOff();
  }
  const chapter = name => TOME_WORDS.chapters.find(c => c.name === name);
  heading('Certifications'); panelOn();
  chapter('Certifications').parts.forEach((p, n) => {
    const key = p.label, b = add({ kind: 'open', key, rule: n > 0 }); let y = row * .55; y = para(b.items, key, left, y, inner * .7, serif(row, 500), row, RESUME_INK, 1.3); if (p.lead) y = para(b.items, p.lead, left, y, inner * .7, sans(note), note, RESUME_SOFT, 1.5);
    b.h = y + row * .55; b.body = []; let by = 0; for (const e of p.entries || (p.pills || p.badges.map(b => b[0])).map(h => ({ h }))) /* the Claude courses are badges in the book now */ { const start = by; by = para(b.body, e.h, left, by, tall ? inner : inner * .56, serif(row * .8, 400), row * .8, RESUME_INK, 1.3); if (e.m) { if (tall) by = para(b.body, e.m, left, by, inner, sans(note), note, RESUME_SOFT, 1.5); else by = Math.max(by, para(b.body, e.m, left + inner * .6, start + (row * .8 - note) * .35, inner * .4, sans(note), note, RESUME_SOFT, 1.5)); } by += row * .42; }
    b.bodyH = by + row * .35; b.linkX = left + inner;
  });
  panelOff();
  const twoCol = list => { panelOn(); list.forEach((e, n) => { const b = add({ kind: 'row', rule: n > 0 }); let hy = row * .55, ry = hy; hy = para(b.items, e.h, left, hy, narrow ? inner : inner * .42, serif(row, 500), row, RESUME_INK, 1.3); if (narrow) ry = hy + row * .1; for (const r of e.right) ry = para(b.items, r, narrow ? left : mid, ry, narrow ? inner : midW, e.mono ? mono(note * .86) : sans(note), e.mono ? note * .86 : note, e.mono ? RESUME_TEAL : RESUME_SOFT, 1.55); b.h = Math.max(hy, ry) + row * .55; }); panelOff(); };
  heading('Awards'); twoCol(chapter('Awards').entries.map(e => ({ h: e.h, right: [e.m, e.d].filter(Boolean) })));
  heading('Skills'); twoCol(chapter('Skills').entries.map(e => ({ h: e.h, right: [e.pills.join('  ·  ')], mono: true })));
  heading(RESUME_WORDS.talk); panelOn();
  RESUME_WORDS.boxes.forEach(([label, button, go], n) => {
    const b = add({ kind: 'box', go, button, rule: n > 0 }); g.font = sans(16, 600); b.bw = g.measureText(button).width + 44; const lw = narrow ? inner : inner - b.bw - pad; let y = row * .6; y = para(b.items, label, left, y, lw, serif(row * .92, 500), row * .92, RESUME_INK, 1.3);
    b.bx = narrow ? left : left + inner - b.bw; b.by = narrow ? y + row * .2 : Math.max(row * .5, (y + row * .6 - 50) / 2); b.h = narrow ? b.by + 50 + row * .6 : Math.max(y + row * .6, 50 + row);
  });
  panelOff();
  L.colX = x0; L.colW = colW; L.left = left; L.inner = inner;
  // Baked once: light coming through, and mist low down.
  const rays = document.createElement('canvas'); rays.width = 640; rays.height = 360; const ra = rays.getContext('2d'), rr = seeded(5); ra.translate(640 * .82, -40); ra.filter = 'blur(9px)';
  for (let i = 0; i < 14; i++) { const a = 1.2 + rr() * 1.15, w = .012 + rr() * .05, len = 340 + rr() * 380, l = ra.createLinearGradient(0, 0, Math.cos(a) * len, Math.sin(a) * len); l.addColorStop(0, `rgba(255,255,255,${.1 + rr() * .34})`); l.addColorStop(1, 'rgba(255,255,255,0)'); ra.fillStyle = l; ra.beginPath(); ra.moveTo(0, 0); ra.lineTo(Math.cos(a - w) * len, Math.sin(a - w) * len); ra.lineTo(Math.cos(a + w) * len, Math.sin(a + w) * len); ra.fill(); }
  L.rays = rays;
  const mist = document.createElement('canvas'); mist.width = 320; mist.height = 180; const m = mist.getContext('2d'), mr = seeded(9), low = m.createLinearGradient(0, 40, 0, 180); low.addColorStop(0, 'rgba(226,246,240,0)'); low.addColorStop(1, 'rgba(226,246,240,.85)'); m.fillStyle = low; m.fillRect(0, 0, 320, 180); m.filter = 'blur(14px)'; for (let i = 0; i < 26; i++) { m.fillStyle = `rgba(240,252,248,${.1 + mr() * .26})`; m.beginPath(); m.ellipse(mr() * 320, 110 + mr() * 70, 26 + mr() * 60, 9 + mr() * 18, 0, 0, 7); m.fill(); }
  m.filter = 'none'; const side = m.createLinearGradient(0, 0, 320, 0); side.addColorStop(0, 'rgba(226,246,240,.34)'); side.addColorStop(.26, 'rgba(226,246,240,0)'); side.addColorStop(.74, 'rgba(226,246,240,0)'); side.addColorStop(1, 'rgba(226,246,240,.34)'); m.fillStyle = side; m.fillRect(0, 0, 320, 180);
  L.mist = mist;
  // The name, cut once in a big script.
  const size = resumeClamp(tall ? W * .3 : Math.min(W * .19, H * .36), 90, 300), tc = document.createElement('canvas'), tw = Math.ceil(size * 3.6), th = Math.ceil(size * 1.8), scale = Math.min(pr, 2); tc.width = tw * scale; tc.height = th * scale; const t = tc.getContext('2d'); t.scale(scale, scale); t.font = `italic 500 ${size}px ${RESUME_SERIF}`; t.textAlign = 'center'; t.textBaseline = 'middle'; const lg = t.createLinearGradient(tw * .2, 0, tw * .8, th); lg.addColorStop(0, '#0fc7a8'); lg.addColorStop(.5, '#0f6f7e'); lg.addColorStop(1, '#16a3a0'); t.fillStyle = lg; t.fillText(RESUME_WORDS.name, tw / 2, th * .47);
  L.titleBmp = tc; L.titleW = tw; L.titleH = th;
  L.orb = resumeOrb();
  resumeMeasure(L, 0);
  return resume.L = L;
}

/* ---------- Opening, closing, moving ---------- */
function resumeSnapshot() { const s = document.createElement('canvas'); s.width = sceneCanvas.width; s.height = sceneCanvas.height; s.getContext('2d').drawImage(sceneCanvas, 0, 0); return s; }
function openResume(c, viaKeyboard) {
  const now = performance.now(); resumeLoad(); resumeSpritesMake();
  resume = { c, viaKeyboard, phase: resumeDone ? 'read' : reduced ? 'world' : 'intro', at: now, y: 0, ty: 0, a: reduced ? 1 : 0, last: now, from: resumeSnapshot(), fadeAt: now, moved: false, hover: null, L: null, vy: 0, vyAt: 0, px: W / 2, py: H * .36, tx: W / 2, ty2: H * .36, seen: false, trail: [], path: [], hold: 0, holding: false, auto: false, flood: null, flashAt: 0, open: { Professional: true }, k: { Professional: 1 }, menu: false, menuK: 0, kb: -1, wash: 0, section: 'About', jump: null, jumpSec: null, pull: 0, acc: 0, lock: 0, brush: null };
  if (resume.phase === 'world') resume.y = resume.ty = H * 1.1;
  hover = null; focusCard = null; glitch = 0; dirty = true;
  $('#btn-about').hidden = $('#btn-talk').hidden = true; // the dock has Say hello, and Tab reaches it
  if (!COARSE) crt.style.cursor = resume.phase === 'intro' ? 'none' : 'default';
  Promise.all(['500 40px "Playfair Display"', 'italic 500 40px "Playfair Display"', '400 30px "Playfair Display"', '500 16px "Instrument Sans"', '600 16px "Instrument Sans"', '500 14px "JetBrains Mono"'].map(f => document.fonts.load(f))).catch(() => {}).finally(() => { if (resume) { resume.L = null; resumeSprites = null; resumeSpritesMake(); } }); // letter widths change once the font arrives
  const facts = TOME_WORDS.chapters.flatMap(ch => (ch.parts || [ch]).flatMap(p => [p.label, p.lead, ...(p.pills || []), ...(p.badges || []).map(b => b[0]), ...(p.entries || []).flatMap(e => [e.h, e.m, e.d, ...(e.pills || [])])]).filter(Boolean)), about = `Resume: ${RESUME_WORDS.full}. ${RESUME_WORDS.intro.join(' ')} ${facts.join('. ')}. Works: ${WORKS_WORDS.items.map(i => i.t).join(', ')}.`;
  live.textContent = resume.phase === 'read' ? about : `Hold the mouse button or a finger down and draw a circle to begin, or press Enter. ${about}`;
  if (document.activeElement) document.activeElement.blur(); // Enter moves this page along, so it mustn't land on Back. Tab still reaches it
}
function closeResume() {
  resume = null; glitch = reduced ? 0 : .5; dirty = true;
  $('#btn-about').hidden = $('#btn-talk').hidden = false;
  live.textContent = ''; crt.style.cursor = 'grab';
}
const resumeMax = () => resume.phase === 'read' ? (resume.L ? resume.L.max : 0) : H * 1.1;
const resumeTo = v => { if (resume.phase === 'intro' || resume.phase === 'flash') return; resume.jumpSec = null; resume.ty = resumeClamp(v, 0, resumeMax()); if (v > 4) resume.moved = true; dirty = true; };
function resumeStopAt(y = resume.ty) {
  const stops = (resume.L && resume.L.stops) || [{ y: 0 }];
  let best = 0;
  for (let i = 1; i < stops.length; i++) if (Math.abs(stops[i].y - y) < Math.abs(stops[best].y - y)) best = i;
  return best;
}
function resumeStep(dir) {
  const L = resume.L || resumeLayout(), stops = L.stops || [{ y: 0 }];
  const next = resumeClamp(resumeStopAt(resume.ty) + dir, 0, stops.length - 1);
  resume.pull = 0;
  if (resume.phase === 'read' && next !== resumeStopAt(resume.ty) && !reduced) resume.melt = { from: resumeSnapshot(), at: performance.now(), dir: Math.sign(dir), seed: Math.random() * 100 }; // the page it leaves melts away
  resumeTo(stops[next].y);
}
function resumeWheel(dy) { // in the résumé, one wheel or trackpad gesture moves one part at a time
  const r = resume;
  if (r.phase !== 'read') { resumeTo(r.ty + dy); return; }
  const now = performance.now();
  if (now < (r.lock || 0)) { r.acc = 0; return; }
  r.acc = (r.acc || 0) + dy;
  if (Math.abs(r.acc) >= 40) { resumeStep(Math.sign(r.acc)); r.acc = 0; r.lock = now + (reduced ? 180 : 700); }
}
function resumePointer(clientX, clientY) { const [x, y] = toScene(clientX, clientY); resume.tx = x; resume.ty2 = y; resume.seen = true; return [x, y]; }
function resumeTrace(x, y, now = performance.now()) { // following the finger round: a full turn about the middle of the path is a circle
  const r = resume; if (r.phase !== 'intro') return;
  const last = r.path[r.path.length - 1]; if (last && now - last[2] > 1100) r.path = [];
  if (last && Math.hypot(x - last[0], y - last[1]) < 3) return;
  r.path.push([x, y, now]); r.trail.push([x, y, now]); if (r.path.length > 240) r.path.shift();
  if (r.path.length < 14) return;
  let cx = 0, cy = 0; for (const p of r.path) { cx += p[0]; cy += p[1]; } cx /= r.path.length; cy /= r.path.length;
  let turn = 0, radius = 0, prev = Math.atan2(r.path[0][1] - cy, r.path[0][0] - cx); for (const p of r.path) { const a = Math.atan2(p[1] - cy, p[0] - cx); let d = a - prev; if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; turn += d; prev = a; radius += Math.hypot(p[0] - cx, p[1] - cy); } radius /= r.path.length;
  if (Math.abs(turn) > 5.95 && radius > Math.min(W, H) * .08 && now - r.path[0][2] > 650) resumeWake(cx, cy, now, radius); // nearly a full turn, not a flick
}
const RESUME_CRACK_S = .55, RESUME_FALL_S = 1.35; // the cracks spreading, then the pieces falling
function resumeShards(x, y, ring) { // a web of cracks round the circle, cut into pieces: rings of points between spokes, a little crooked
  const spokes = 15, R = Math.hypot(W, H), radii = [ring * .55, ring * 1.05, ring * 1.9, R * .32, R * .55, R * .85, R * 1.2], rnd = seeded(Math.floor(x * 7 + y * 13) + 1);
  const angles = Array.from({ length: spokes }, (_, i) => (i + rnd() * .7 - .35) / spokes * Math.PI * 2);
  const pt = (j, i) => { const a = angles[(i + spokes) % spokes] + (rnd() - .5) * .08, r = radii[j] * (.9 + rnd() * .2); return [x + Math.cos(a) * r, y + Math.sin(a) * r]; };
  const grid = radii.map((_, j) => angles.map((_, i) => pt(j, i))), shards = [];
  for (let i = 0; i < spokes; i++) shards.push({ pts: [[x, y], grid[0][i], grid[0][(i + 1) % spokes]], ring: 0 }); // the middle, round the circle
  for (let j = 0; j < radii.length - 1; j++) for (let i = 0; i < spokes; i++) shards.push({ pts: [grid[j][i], grid[j + 1][i], grid[j + 1][(i + 1) % spokes], grid[j][(i + 1) % spokes]], ring: j + 1 });
  for (const sh of shards) {
    const cx = sh.pts.reduce((a, p) => a + p[0], 0) / sh.pts.length, cy = sh.pts.reduce((a, p) => a + p[1], 0) / sh.pts.length, d = Math.hypot(cx - x, cy - y) || 1;
    Object.assign(sh, { cx, cy, vx: (cx - x) / d * (90 + rnd() * 160) + (rnd() - .5) * 60, vy: (cy - y) / d * 70 - 120 - rnd() * 120, spin: (rnd() - .5) * 3.2, delay: Math.min(.45, sh.ring * .07 + rnd() * .05) });
  }
  return { shards, grid, ring };
}
function resumeDrawShatter(sh, now) {
  const t = (now - sh.at) / 1000, snap = sh.snap, path = pts => { g.beginPath(); pts.forEach((p, i) => g[i ? 'lineTo' : 'moveTo'](p[0], p[1])); g.closePath(); };
  if (t < RESUME_CRACK_S) { // the circle seals into a ring of light, and cracks run out from it across the glass
    const k = t / RESUME_CRACK_S, reach = Math.hypot(W, H) * resumeEase(k) * 1.1;
    g.drawImage(snap, 0, 0, W, H);
    g.save(); g.globalCompositeOperation = 'lighter'; const glow = g.createRadialGradient(sh.x, sh.y, sh.ring * .6, sh.x, sh.y, sh.ring * 1.6); glow.addColorStop(0, `rgba(200,255,240,${.15 + k * .35})`); glow.addColorStop(1, 'rgba(200,255,240,0)'); g.fillStyle = glow; g.fillRect(sh.x - sh.ring * 1.6, sh.y - sh.ring * 1.6, sh.ring * 3.2, sh.ring * 3.2);
    g.strokeStyle = `rgba(235,255,250,${.6 + k * .4})`; g.lineWidth = 3 + k * 3; g.beginPath(); g.arc(sh.x, sh.y, sh.ring, 0, Math.PI * 2 * Math.min(1, k * 2.2)); g.stroke(); g.restore();
    g.save(); g.lineCap = 'round';
    for (const [w, c] of [[3.2, 'rgba(40,70,64,.35)'], [1.3, 'rgba(255,255,255,.95)']]) { g.strokeStyle = c; g.lineWidth = w; g.beginPath();
      sh.grid.forEach((row, j) => row.forEach((p, i) => { const q = row[(i + 1) % row.length], o = j ? sh.grid[j - 1][i] : [sh.x, sh.y]; for (const [a, b] of [[o, p], [p, q]]) { if (Math.hypot(b[0] - sh.x, b[1] - sh.y) > reach) continue; g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); } }));
      g.stroke(); }
    g.restore(); return;
  }
  const u0 = t - RESUME_CRACK_S; if (u0 > RESUME_FALL_S + .5) { sh.snap = null; resume.shatter = null; return; }
  if (u0 < .18) { g.fillStyle = `rgba(255,255,255,${.55 * (1 - u0 / .18)})`; g.fillRect(0, 0, W, H); } // the break: a flash
  for (const p of sh.shards) { // each piece falls away, spinning, the inner ones first
    const u = u0 - p.delay; if (u < 0) { g.save(); path(p.pts); g.clip(); g.drawImage(snap, 0, 0, W, H); g.restore(); continue; }
    const k = u / RESUME_FALL_S; if (k >= 1) continue;
    g.save(); g.globalAlpha = 1 - k * k; g.translate(p.cx + p.vx * u, p.cy + p.vy * u + 900 * u * u); g.rotate(p.spin * u); g.scale(1 - k * .25, 1 - k * .25); g.translate(-p.cx, -p.cy);
    path(p.pts); g.save(); g.clip(); g.drawImage(snap, 0, 0, W, H); g.fillStyle = `rgba(255,255,255,${.1 + k * .2})`; g.fill(); g.restore();
    g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.4; g.stroke(); g.restore();
  }
}
function resumeWake(x = W / 2, y = H * .42, now = performance.now(), ring = Math.min(W, H) * .16) { const r = resume; r.phase = 'title'; r.at = now + (reduced ? 0 : RESUME_CRACK_S * 1000); r.flood = null; r.shatter = reduced ? null : { x, y, at: now, snap: resumeSnapshot(), ...resumeShards(x, y, ring) }; r.y = r.ty = 0; r.path = []; if (!COARSE) crt.style.cursor = 'default'; live.textContent = `${RESUME_WORDS.name}. ${RESUME_WORDS.role}. Scroll to continue, or press Enter.`; }
function resumeRead(now = performance.now()) { const r = resume; r.phase = 'read'; r.y = r.ty = 0; r.pull = r.acc = r.lock = 0; r.holding = r.auto = false; r.fadeAt = now; r.wash = 1; resumeDone = true; if (!COARSE) crt.style.cursor = 'default'; }
function resumeOnRuler(clientX, clientY) { const R = resume.L && resume.L.ruler; if (!R) return false; const [x, y] = toScene(clientX, clientY); return x > R.x && x < R.x + R.w && y > R.y && y < R.y + R.h; }
function resumePress(clientX, clientY) {
  if (resume.phase === 'read' && resumeOnRuler(clientX, clientY)) { resume.scrub = { x: toScene(clientX, clientY)[0], ty: resume.ty }; resume.jumpSec = null; return; } // scrubbing: dragging the ruler moves through the résumé
  if (resume.phase === 'intro') { resume.path = []; const [x, y] = resumePointer(clientX, clientY); resumeTrace(x, y); return; }
  if (resume.phase === 'world' && resume.a > .92 && !resumeSpot(clientX, clientY)) resume.holding = true;
}
function resumeDrag(dy, clientX, clientY) {
  const r = resume, [x, y] = resumePointer(clientX, clientY); if (r.phase === 'intro') { resumeTrace(x, y); return; }
  if (r.scrub) { const L = r.L, w = L.ruler ? L.ruler.w - 20 : W * .34; r.ty = resumeClamp(r.scrub.ty - (x - r.scrub.x) * L.max / w, 0, L.max); r.moved = true; dirty = true; return; } // left moves on, like the ticks
  if (r.holding || r.phase === 'flash') return;
  if (r.phase === 'read') {
    r.pull = (r.pull || 0) - dy;
    if ((r.ty <= 0 && r.pull < 0) || (r.ty >= resumeMax() && r.pull > 0)) r.pull *= .7;
    if (Math.abs(dy) > 1) r.moved = true;
    r.vy = dy; r.vyAt = performance.now(); dirty = true;
    return;
  }
  r.y = r.ty = resumeClamp(r.y - dy * 1.6, 0, resumeMax()); if (Math.abs(dy) > 1) r.moved = true; r.vy = dy; r.vyAt = performance.now();
}
function resumeRelease(clicked, clientX, clientY) {
  const r = resume; r.holding = false;
  if (r.scrub) { r.scrub = null; const L = r.L, stops = L.stops || []; if (stops.length) resumeTo(stops[resumeStopAt(r.ty)].y); return; } // lands on the nearest part
  if (r.phase === 'intro') r.path = []; // lifting the finger ends the stroke, so the circle has to be drawn in one go
  if (clicked) { r.pull = 0; const h = resumeSpot(clientX, clientY); if (h) { resumeGo(h.go); return; } if (r.menu) r.menu = false; }
  else if (r.phase === 'read') {
    const flick = performance.now() - r.vyAt < 90 && Math.abs(r.vy) > 5, p = r.pull || 0;
    const dir = p > H * .1 || (flick && r.vy < 0) ? 1 : p < -H * .1 || (flick && r.vy > 0) ? -1 : 0;
    r.pull = 0; if (dir) resumeStep(dir); dirty = true;
  } else if (r.phase !== 'intro' && performance.now() - r.vyAt < 80) resumeTo(r.y - r.vy * 16); // a flick keeps the page moving
  if (!COARSE && r.phase !== 'intro') crt.style.cursor = r.hover ? 'pointer' : 'default';
}
function resumeSpot(clientX, clientY) { const L = resume.L; if (!L) return null; const [x, y] = toScene(clientX, clientY); return L.hot.find(h => x > h.x && x < h.x + h.w && y > h.y && y < h.y + h.h) || null; }
function resumeGo(go) {
  const r = resume;
  if (go === 'hello') { $('#contact').showModal(); return; }
  if (go.startsWith('zoom:')) { const k = go.slice(5), im = k.startsWith('works') ? resumePics.works[+k.slice(5)] : resumePics[k]; if (im) zoomPicture(im.src, '', ...[resume.tx, resume.ty2].map((v, i) => v * (i ? innerHeight / H : innerWidth / W))); return; }
  if (go === 'menu') { r.menu = !r.menu; return; }
  if (go === 'skip') { resumeRead(); return; }
  if (go === 'works' || go === 'experiences') { closeResume(); openProject(projects[go === 'works' ? 0 : 2]); return; }
  if (go.startsWith('sec:')) { r.menu = false; if (r.phase !== 'read') resumeRead(); r.jump = go.slice(4); return; }
  r.open[go] = !r.open[go]; live.textContent = `${go} ${r.open[go] ? 'opened' : 'closed'}.`;
}
function resumeHover(clientX, clientY) { resumePointer(clientX, clientY); const h = resumeSpot(clientX, clientY) || (resumeOnRuler(clientX, clientY) ? { go: 'ruler' } : null); resume.hover = h; crt.style.cursor = h && h.go === 'ruler' ? 'grab' : h ? 'pointer' : resume.phase === 'intro' ? 'none' : 'default'; }
function resumeKey(e) {
  const r = resume, L = r.L || { hot: [] }; // keys can arrive before the first frame is laid out
  if (r.phase === 'read' && e.key === 'Tab' && !e.shiftKey) { // the buttons are drawn, so Tab walks them by hand, then carries on to the page
    r.kb++; if (r.kb >= L.hot.length) { r.kb = -1; return; }
    e.preventDefault(); if (L.hot[r.kb].doc !== undefined) resumeTo((L.stops || [{ y: 0 }])[resumeStopAt(L.hot[r.kb].doc)].y); return;
  }
  if ((e.key === 'Enter' || e.key === ' ') && document.activeElement !== backBtn) {
    e.preventDefault();
    if (r.phase === 'intro') resumeWake();
    else if (r.phase === 'title' || r.phase === 'world') { if (r.a < .92) { r.phase = 'world'; r.ty = H * 1.1; } else r.auto = true; }
    else if (r.phase === 'read' && r.kb >= 0) resumeGo(L.hot[r.kb].go);
    else if (r.phase === 'read') resumeStep(1);
    return;
  }
  if (r.phase === 'intro') return;
  if (r.phase === 'read') {
    const step = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 }[e.key];
    if (step) { e.preventDefault(); resumeStep(step); return; }
    if (e.key === 'Home') { e.preventDefault(); resumeTo(0); return; }
    if (e.key === 'End') { e.preventDefault(); resumeTo(resumeMax()); return; }
    return;
  }
  const go = { ArrowDown: r.ty + H * .22, ArrowUp: r.ty - H * .22, PageDown: r.ty + H * .8, PageUp: r.ty - H * .8, Home: 0, End: resumeMax() }[e.key];
  if (go !== undefined) { e.preventDefault(); resumeTo(go); }
}

/* ---------- Drawing ---------- */
// The glass, rewritten in falling code: each 15 px cell of it becomes a glyph, brighter where the glass is, under a slow wave,
// with bloom, scanlines and a vignette. Glyphs are drawn once into an atlas; the layer redraws about 15 times a second.
const RESUME_GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾊﾋﾌﾍﾎ0123456789Z:+';
let resumeAscii = null;
function resumeAsciiLayer(img, time) {
  const cell = 15, cols = Math.ceil(W / cell), rows = Math.ceil(H / cell), n = RESUME_GLYPHS.length, q = Math.min(2, pr);
  let A = resumeAscii;
  if (!img.naturalWidth) return null;
  if (!A || A.cols !== cols || A.rows !== rows || A.q !== q) {
    const sample = document.createElement('canvas'), sx = sample.getContext('2d', { willReadFrequently: true }); sample.width = cols; sample.height = rows;
    const k = Math.max(cols / img.naturalWidth, rows / img.naturalHeight) * 1.08; sx.drawImage(img, (cols - img.naturalWidth * k) / 2, (rows - img.naturalHeight * k) / 2, img.naturalWidth * k, img.naturalHeight * k);
    const d = sx.getImageData(0, 0, cols, rows).data, lum = new Float32Array(cols * rows), seed = new Float32Array(cols * rows);
    let lo = 1, hi = 0; for (let i = 0; i < lum.length; i++) { lum[i] = (.2126 * d[i * 4] + .7152 * d[i * 4 + 1] + .0722 * d[i * 4 + 2]) / 255; lo = Math.min(lo, lum[i]); hi = Math.max(hi, lum[i]); seed[i] = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1; }
    for (let i = 0; i < lum.length; i++) lum[i] = Math.max(0, Math.min(1, ((lum[i] - lo) / Math.max(.01, hi - lo) - .5) * 1.15 + .5)); // stretched, then contrast 115
    const atlas = document.createElement('canvas'), ax = atlas.getContext('2d'); atlas.width = n * cell * q; atlas.height = 4 * cell * q; ax.scale(q, q);
    ax.font = `600 ${cell - 3}px ${RESUME_MONO}, "MS Gothic", monospace`; ax.textAlign = 'center'; ax.textBaseline = 'middle';
    for (let l = 0; l < 4; l++) { ax.fillStyle = `rgba(${[150, 190, 220, 240][l]},255,${[200, 225, 240, 250][l]},${[.28, .5, .75, 1][l]})`; for (let i = 0; i < n; i++) ax.fillText(RESUME_GLYPHS[i], i * cell + cell / 2, l * cell + cell / 2 + .5); }
    const layer = document.createElement('canvas'); layer.width = Math.round(W * q); layer.height = Math.round(H * q);
    const glow = document.createElement('canvas'); glow.width = Math.ceil(W / 6); glow.height = Math.ceil(H / 6);
    const finish = document.createElement('canvas'), fx = finish.getContext('2d'); finish.width = Math.round(W * q); finish.height = Math.round(H * q); fx.scale(q, q); // scanlines and vignette, once
    fx.fillStyle = 'rgba(4,20,16,.16)'; for (let y = 0; y < H; y += 3) fx.fillRect(0, y, W, 1);
    const v = fx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.hypot(W, H) * .58); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(4,22,18,.55)'); fx.fillStyle = v; fx.fillRect(0, 0, W, H);
    A = resumeAscii = { cols, rows, q, lum, seed, atlas, layer, glow, finish, at: -1 };
  }
  if (time - A.at >= 1 / 15 || reduced && A.at < 0) {
    A.at = time;
    const x = A.layer.getContext('2d'), t = reduced ? 0 : time, cq = cell * q; x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, A.layer.width, A.layer.height);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c, wave = .5 + .5 * Math.sin(c * .32 + r * .19 - t * 2.2), level = A.lum[i] * .78 + wave * .36 - .3;
      if (level <= 0) continue;
      const li = Math.min(3, Math.floor(level * 4)), flick = A.seed[i] > .9 ? Math.floor(t * 8 + A.seed[i] * 50) : 0, gi = Math.floor(A.seed[i] * n * 7 + flick) % n; // a few cells keep changing, like running code
      x.drawImage(A.atlas, gi * cq, li * cq, cq, cq, c * cq, r * cq, cq, cq);
    }
    const gx = A.glow.getContext('2d'); gx.clearRect(0, 0, A.glow.width, A.glow.height); gx.drawImage(A.layer, 0, 0, A.glow.width, A.glow.height); // a tiny copy, smeared back up, is the bloom
  }
  return A;
}
function resumeAsciiDraw(time, alpha) {
  const A = resumeAsciiLayer(resumePics.glass, time); if (!A) return;
  g.save(); g.globalAlpha = alpha * .8; g.globalCompositeOperation = 'screen'; g.drawImage(A.layer, 0, 0, W, H);
  g.globalCompositeOperation = 'lighter'; g.globalAlpha = alpha * .35; g.drawImage(A.glow, 0, 0, W, H);
  g.globalCompositeOperation = 'source-over'; g.globalAlpha = alpha; g.drawImage(A.finish, 0, 0, W, H); g.restore();
}
const resumeCover = (img, x = 0, y = 0, over = 1.08) => { if (!img.naturalWidth) return; const k = Math.max(W / img.naturalWidth, H / img.naturalHeight) * over, dw = img.naturalWidth * k, dh = img.naturalHeight * k; g.drawImage(img, (W - dw) / 2 + x, (H - dh) / 2 + y, dw, dh); };
const resumeWrite = (it, y) => { g.font = it.font; if (it.grad) { const w = g.measureText(it.t).width, l = g.createLinearGradient(it.x, y, it.x + w, y + it.size); l.addColorStop(0, '#0fa58e'); l.addColorStop(.55, '#0d5f66'); l.addColorStop(1, '#128e8c'); g.fillStyle = l; } else g.fillStyle = it.color; g.fillText(it.t, it.x, y + it.size * .86); };
function resumeAir(time, alpha, lift) {
  const S = resumeSprites; g.globalCompositeOperation = 'lighter';
  for (const p of S.list) {
    const y = (((p.y - time * p.v * (p.z > 1.5 ? 1.6 : 1) - lift * .00014 * p.z) % 1) + 1) % 1, x = (p.x + Math.sin(time * .3 + p.sway) * .018) * W + (resume.px - W / 2) * -.018 * p.z, sy = y * H * 1.1 - H * .05;
    if (p.kind === 0) { const s = 90 * p.z; g.globalAlpha = alpha * .22; g.drawImage(S.soft, x - s / 2, sy - s / 2, s, s); }
    else if (p.kind === 1) { const s = 13 * p.z, tw = .4 + .6 * Math.abs(Math.sin(time * (1 + p.spin) + p.sway)); g.globalAlpha = alpha * tw * .9; g.drawImage(S.glint, x - s / 2, sy - s / 2, s, s); }
    else if (p.kind === 4) { const s = 22 + 18 * p.z, ang = Math.sin(time * .7 + p.sway) * .4; g.save(); g.globalCompositeOperation = 'source-over'; g.globalAlpha = alpha * .72; g.translate(x, sy); g.rotate(ang); g.drawImage(S.petal, -s / 2, -s / 2, s, s); g.restore(); }
    else { const s = 16 + 12 * p.z; g.globalAlpha = alpha * .55; g.drawImage(S.bits[p.kind - 2], x - s / 2, sy - s / 2, s, s); }
  }
  g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
}
function resumeHand(name, p, cx, cy, size, alpha) { // the hand, placed by its fingertip. Frames cross, so the fingers move smoothly
  const d = RESUME_HANDS[name], frames = resumePics[name], f = resumeClamp(p) * (frames.length - 1), i = Math.floor(f), j = Math.min(frames.length - 1, i + 1), k = f - i, sh = size * RESUME_ASPECT;
  const one = (n, a) => { const im = frames[n]; if (!im.naturalWidth || a <= 0) return; const t = d.tips[n]; g.globalAlpha = alpha * a; g.drawImage(im, cx + (d.box[0] - t[0]) * size, cy + (d.box[1] - t[1]) * sh, d.box[2] * size, d.box[3] * sh); };
  one(i, 1); if (k > .001) one(j, k); g.globalAlpha = 1;
}
// The robot hand is made of data: 0s and 1s stream through it toward the fingertip under a sweeping scan line, and loose bits drift off it.
let resumeBits = null;
const resumeLayer = document.createElement('canvas'), resumeLayerG = resumeLayer.getContext('2d');
function resumeBitsTile() { // one tile of scattered digits, drawn once and scrolled, so a frame never sets thousands of glyphs
  if (resumeBits) return resumeBits;
  const c = document.createElement('canvas'), x = c.getContext('2d'); c.width = c.height = 240; let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  x.font = `600 13px ${RESUME_MONO}`; x.textBaseline = 'top';
  for (let row = 0; row < 240; row += 15) for (let col = 0; col < 240; col += 10) { if (rnd() < .3) continue; x.fillStyle = `rgba(226,255,246,${(.3 + rnd() * .7).toFixed(2)})`; x.fillText(rnd() > .5 ? '1' : '0', col, row); }
  return resumeBits = c;
}
// The green hand behind a dither veil: teal and mint pixel cells, with the real hand showing through round the pointer.
// melt (0 to 1) dissolves the veil everywhere, so as the hold completes the AI hand turns real.
const RESUME_BAYER = (() => { let m = [[0]]; for (let k = 1; k < 8; k *= 2) m = [...m.map(r => [...r.map(v => 4 * v), ...r.map(v => 4 * v + 2)]), ...m.map(r => [...r.map(v => 4 * v + 3), ...r.map(v => 4 * v + 1)])]; return m.flat().map(v => (v + .5) / 64); })();
const resumeVeil = document.createElement('canvas'), resumeVeilG = resumeVeil.getContext('2d', { willReadFrequently: true });
function resumeDither(im, x0, y0, w, h, alpha, melt) {
  const cell = 3, cw = Math.max(1, Math.round(w / cell)), ch = Math.max(1, Math.round(h / cell)), x = resumeVeilG, rr = 85 + melt * 60;
  if (resumeVeil.width !== cw || resumeVeil.height !== ch) { resumeVeil.width = cw; resumeVeil.height = ch; } else x.clearRect(0, 0, cw, ch);
  x.drawImage(im, 0, 0, cw, ch);
  const img = x.getImageData(0, 0, cw, ch), d = img.data, tones = [[9, 58, 48], [36, 172, 134], [170, 250, 222]], px = resume.tx, py = resume.ty2;
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
    const o = (j * cw + i) * 4;
    if (d[o + 3] < 90) { d[o + 3] = 0; continue; }
    const t = RESUME_BAYER[(j & 7) * 8 + (i & 7)], near = resume.seen ? 1 - Math.hypot(x0 + (i + .5) * cell - px, y0 + (j + .5) * cell - py) / rr : 0;
    if (t < Math.max(melt, near / .5)) { d[o + 3] = 0; continue; } // the real hand shows here, through a dithered edge
    const l = (.2126 * d[o] + .7152 * d[o + 1] + .0722 * d[o + 2]) / 255, v = Math.max(0, Math.min(1, (l - .45) * 1.3 + .5)) * 2, base = Math.floor(v);
    const tone = tones[Math.min(2, base + (RESUME_BAYER[((j + 5) & 7) * 8 + ((i + 3) & 7)] < v - base ? 1 : 0))];
    d[o] = tone[0]; d[o + 1] = tone[1]; d[o + 2] = tone[2]; d[o + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  g.save(); g.imageSmoothingEnabled = false; g.globalAlpha = alpha; g.drawImage(resumeVeil, x0, y0, cw * cell, ch * cell); g.restore();
}
function resumeCode(name, p, cx, cy, size, alpha, time, melt = 0) {
  const d = RESUME_HANDS[name], frames = resumePics[name], n = Math.round(resumeClamp(p) * (frames.length - 1)), im = frames[n];
  if (!im || !im.naturalWidth || alpha <= .01) return;
  const sh = size * RESUME_ASPECT, t = d.tips[n], x0 = cx + (d.box[0] - t[0]) * size, y0 = cy + (d.box[1] - t[1]) * sh, w = d.box[2] * size, h = d.box[3] * sh, up = name === 'point', q = .5; // half resolution is plenty under the glow
  resumeDither(im, x0, y0, w, h, alpha, melt);
  const cw = Math.ceil(w * q), ch = Math.ceil(h * q), x = resumeLayerG, still = reduced ? 0 : time;
  if (resumeLayer.width !== cw || resumeLayer.height !== ch) { resumeLayer.width = cw; resumeLayer.height = ch; } else x.clearRect(0, 0, cw, ch);
  x.globalCompositeOperation = 'source-over';
  for (const [speed, a, k] of [[46, .95, .75], [24, .5, .5]]) { // a near layer and a slower, smaller far one
    const pat = x.createPattern(resumeBitsTile(), 'repeat'), run = still * speed;
    pat.setTransform(new DOMMatrix().translate(up ? 0 : run, up ? -run : 0).scale(k));
    x.globalAlpha = a; x.fillStyle = pat; x.fillRect(0, 0, cw, ch);
  }
  const sweep = ((still * .32) % 1.4 - .2), band = up ? x.createLinearGradient(0, ch * (1 - sweep) - ch * .12, 0, ch * (1 - sweep) + ch * .12) : x.createLinearGradient(cw * sweep - cw * .1, 0, cw * sweep + cw * .1, 0);
  band.addColorStop(0, 'rgba(190,255,236,0)'); band.addColorStop(.5, 'rgba(190,255,236,.85)'); band.addColorStop(1, 'rgba(190,255,236,0)');
  x.globalAlpha = 1; x.fillStyle = band; x.fillRect(0, 0, cw, ch); // the scan line
  x.globalCompositeOperation = 'destination-in'; x.drawImage(im, 0, 0, cw, ch); // keep it all inside the hand
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = alpha * .38 * (1 - melt * .7); g.drawImage(resumeLayer, x0, y0, w, h); g.restore(); // the data fades as it turns real
  // Loose bits drifting off it and fading, along the line from the wrist to the fingertip.
  const fs = Math.max(10, Math.min(18, size * .012)), base = up ? [cx, cy + sh * .34] : [cx - size * .42, cy + sh * .02];
  g.save(); g.font = `600 ${fs}px ${RESUME_MONO}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#bfffe9'; g.shadowColor = 'rgba(60,240,190,.9)'; g.shadowBlur = 8;
  for (let i = 0; i < 22; i++) {
    const seedA = Math.sin(i * 91.7) * 43758.5453 % 1, seedB = Math.sin(i * 12.9) * 9133.1 % 1, life = ((still * (.18 + Math.abs(seedB) * .14) + Math.abs(seedA)) % 1), along = .15 + Math.abs(seedA) * .8;
    const sx = base[0] + (cx - base[0]) * along, sy = base[1] + (cy - base[1]) * along, drift = life * size * .06;
    const px = sx + (up ? seedB * 30 + drift * seedB : -drift * .6 + seedB * 20), py = sy + (up ? drift * .2 : -drift) + (up ? 0 : seedB * sh * .03);
    g.globalAlpha = alpha * Math.sin(life * Math.PI) * .85; g.fillText((i + Math.floor(still * 3)) % 3 ? '1' : '0', up ? px - drift * .5 : px, up ? py : py);
  }
  g.restore();
}
function resumeTop(L) { // a ruler across the top, reading how connected we are, then where in the résumé
  const r = resume, w = L.narrow ? W * .42 : Math.min(W * .34, 420), cx = L.narrow ? 16 + w / 2 : W / 2, y = 22 + (L.narrow ? 6 : 0), prog = r.phase === 'read' ? r.y / Math.max(1, L.max) : r.a * .5 + r.hold * .5, n = 44, gap = 11, off = (prog * n * gap) % gap;
  const grab = r.phase === 'read', on = grab && (r.scrub || (r.hover && r.hover.go === 'ruler'));
  L.ruler = grab ? { x: cx - w / 2 - 10, y: y - 10, w: w + 20, h: 52 } : null; // in the résumé it can be dragged to scrub through the parts
  g.save(); g.fillStyle = on ? 'rgba(255,255,255,.82)' : 'rgba(255,255,255,.6)'; g.strokeStyle = 'rgba(15,143,127,.35)'; g.lineWidth = 1; g.beginPath(); g.roundRect(cx - w / 2 - 10, y - 10, w + 20, 52, 26); g.fill(); g.stroke(); g.restore(); // a frosted pill, so it reads on the glass
  g.save(); g.beginPath(); g.rect(cx - w / 2, y - 4, w, 40); g.clip();
  for (let i = -n; i <= n; i++) { const x = cx + i * gap - off, tick = Math.round(i + prog * n), e = 1 - Math.abs(x - cx) / (w / 2); if (e <= 0) continue; g.fillStyle = `rgba(16,48,45,${e * .75})`; g.fillRect(x, y, 1.2, tick % 10 === 0 ? 15 : 8); }
  g.restore(); g.fillStyle = RESUME_TEAL; g.fillRect(cx - 1.25, y - 4, 2.5, 21); g.beginPath(); g.moveTo(cx - 5, y - 6); g.lineTo(cx + 5, y - 6); g.lineTo(cx, y); g.fill(); // the marker
  const label = grab ? r.section.toUpperCase() : `${Math.round(prog * 100)}% SYNC`; g.font = `700 ${L.narrow ? 11.5 : 12.5}px ${RESUME_MONO}`; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillStyle = RESUME_TEAL; g.fillText(label, cx, y + 32);
  if (grab) { g.fillStyle = `rgba(15,143,127,${on ? .9 : .5})`; g.font = `700 11px ${RESUME_MONO}`; g.fillText('◀', cx - w / 2 + 4, y + 32); g.fillText('▶', cx + w / 2 - 4, y + 32); } // it moves
  g.textAlign = 'left';
}
function resumeDock(L, hot, alpha, dt) { // bottom of the screen: the way to say hello, and to jump around
  const r = resume, w = Math.min(W * .9, 440), h = 60, x = (W - w) / 2, y = H - h - Math.max(14, H * .022), pad = 6, on = q => r.hover && r.hover.go === q; if (alpha <= 0) return;
  g.save(); g.globalAlpha = alpha;
  g.fillStyle = 'rgba(232,240,237,.8)'; g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1.5; g.beginPath(); g.roundRect(x, y, w, h, h / 2); g.fill(); g.stroke();
  const orb = h - pad * 2; g.drawImage(L.orb, x + pad, y + pad, orb, orb);
  const bx = x + pad * 2 + orb, bw = w - pad * 4 - orb * 2; g.fillStyle = on('hello') ? '#123e39' : '#1a2422'; g.beginPath(); g.roundRect(bx, y + pad, bw, orb, orb / 2); g.fill(); g.fillStyle = '#f7fbf9'; g.font = `600 17px ${RESUME_SANS}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Say hello', bx + bw / 2, y + h / 2 + 1);
  const mx = x + w - pad - orb; g.fillStyle = on('menu') ? '#ffffff' : '#f7fbf9'; g.beginPath(); g.arc(mx + orb / 2, y + h / 2, orb / 2, 0, 7); g.fill(); g.fillStyle = '#1a2422'; for (const k of [-4, 4]) g.fillRect(mx + orb / 2 - 10, y + h / 2 + k - 1, 20, 2);
  g.restore(); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  hot.push({ x: bx, y, w: bw, h, go: 'hello' }, { x: mx - 4, y, w: orb + 8, h, go: 'menu' });
  // The list of sections, above it.
  r.menuK += ((r.menu ? 1 : 0) - r.menuK) * (reduced ? 1 : 1 - Math.exp(-dt * 16));
  if (r.menuK > .01) {
    const rows = RESUME_WORDS.sections, rh = Math.min(38, (y - 60) / rows.length), lw = Math.min(w, 280), lh = rows.length * rh + 14, lx = x + w - lw, ly = y - lh - 10 + (1 - r.menuK) * 10;
    g.save(); g.globalAlpha = r.menuK * alpha; g.fillStyle = 'rgba(240,247,244,.96)'; g.strokeStyle = 'rgba(255,255,255,.95)'; g.beginPath(); g.roundRect(lx, ly, lw, lh, 18); g.fill(); g.stroke(); g.font = `600 15px ${RESUME_SANS}`; g.textBaseline = 'middle';
    rows.forEach((name, i) => { const ry = ly + 7 + i * rh, go = `sec:${name}`; if (on(go)) { g.fillStyle = 'rgba(15,143,127,.14)'; g.beginPath(); g.roundRect(lx + 6, ry, lw - 12, rh, 10); g.fill(); } g.fillStyle = name === r.section && r.phase === 'read' ? RESUME_TEAL : RESUME_INK; g.fillText(name, lx + 20, ry + rh / 2); if (r.menu) hot.unshift({ x: lx, y: ry, w: lw, h: rh, go }); });
    g.restore(); g.textBaseline = 'alphabetic';
  }
}
function resumeBanner(L, hot, y, alpha) { // a small note above the dock, with the way straight to the résumé
  if (alpha <= 0) return;
  const r = resume, size = 14.5, button = 'Skip to resume', text = RESUME_WORDS.banner; g.font = `600 ${size}px ${RESUME_SANS}`; const tw = g.measureText(text).width, bw = g.measureText(button).width + 26, h = 42, w = tw + bw + 34, x = (W - w) / 2;
  g.save(); g.globalAlpha = alpha; g.fillStyle = 'rgba(40,62,58,.62)'; g.beginPath(); g.roundRect(x, y, w, h, h / 2); g.fill(); g.fillStyle = '#f7fbf9'; g.textBaseline = 'middle'; g.fillText(text, x + 18, y + h / 2 + 1); const bx = x + w - bw - 5; g.fillStyle = r.hover && r.hover.go === 'skip' ? '#d8efe9' : '#fbfdfc'; g.beginPath(); g.roundRect(bx, y + 5, bw, h - 10, (h - 10) / 2); g.fill(); g.fillStyle = '#1a2422'; g.textAlign = 'center'; g.fillText(button, bx + bw / 2, y + h / 2 + 1); g.restore(); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  hot.push({ x: bx, y, w: bw, h, go: 'skip' });
}
function drawResume(now) {
  const L = resumeLayout(), r = resume, P = resumePics, dt = Math.min(.05, (now - r.last) / 1000), time = now / 1000; r.last = now;
  r.y += (r.ty - r.y) * (reduced ? 1 : 1 - Math.exp(-dt * 8));
  const follow = reduced ? 1 : 1 - Math.exp(-dt * 7); r.px += (r.tx - r.px) * follow; r.py += (r.ty2 - r.py) * follow;
  const lookX = COARSE ? Math.sin(time * .28) * W * .04 : r.px - W / 2, lookY = COARSE ? 0 : r.py - H / 2, hot = [];
  if (r.phase === 'intro') {
    // The glass, a robot finger, and a line of light.
    g.fillStyle = '#5c8a78'; g.fillRect(0, 0, W, H); resumeCover(P.glass, reduced ? 0 : -lookX * .02, reduced ? 0 : -lookY * .02); g.fillStyle = 'rgba(52,96,82,.42)'; g.fillRect(0, 0, W, H); resumeAsciiDraw(time, 1); // darker glass, so the code reads on it
    const size = Math.max(H * 1.15, W * (L.tall ? 1.55 : .74)), bob = reduced ? 0 : Math.sin(time * 1.1) * 5; const ptX = W / 2 + (r.px - W / 2) * .72, ptY = H * .44 + (r.py - H * .4) * .32 + bob; resumeHand('point', 0, ptX, ptY, size, .92); resumeCode('point', 0, ptX, ptY, size, .92, time);
    const guideA = r.trail.length > 2 ? Math.max(0, 1 - r.trail.length / 10) : 1;
    if (guideA > .01) {
      const gr = Math.min(W, H) * .17, gcx = W / 2, gcy = H * .38, ang = reduced ? -.6 : time * 1.55;
      g.save(); g.globalAlpha = guideA * .78; g.strokeStyle = 'rgba(255,255,255,.55)'; g.shadowColor = 'rgba(210,255,245,.8)'; g.shadowBlur = 14; g.lineWidth = Math.max(3, gr * .045); g.lineCap = 'round';
      g.beginPath(); g.arc(gcx, gcy, gr, ang - 2.3, ang); g.stroke();
      const hx = gcx + Math.cos(ang) * gr, hy = gcy + Math.sin(ang) * gr;
      g.fillStyle = '#fff'; g.shadowBlur = 18; g.beginPath(); g.arc(hx, hy, Math.max(5, gr * .065), 0, 7); g.fill(); g.restore();
    }
    r.trail = r.trail.filter(p => now - p[2] < 1100);
    if (r.trail.length > 1) { g.lineCap = g.lineJoin = 'round'; for (let i = 1; i < r.trail.length; i++) { const a = r.trail[i - 1], b = r.trail[i], k = 1 - (now - b[2]) / 1100; g.strokeStyle = `rgba(255,255,255,${k * .95})`; g.lineWidth = 2 + k * 6; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); } }
    if (r.seen) { g.save(); g.shadowColor = '#fff'; g.shadowBlur = 16; g.fillStyle = '#fff'; g.beginPath(); g.arc(r.tx, r.ty2, 8, 0, 7); g.fill(); g.restore(); }
    const size2 = Math.max(16, Math.min(W * .045, 22)); g.font = `500 ${size2}px ${RESUME_MONO}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.save(); g.shadowColor = 'rgba(10,40,36,.6)'; g.shadowBlur = 10; g.fillStyle = '#fff'; g.fillText(COARSE ? 'DRAW A CIRCLE' : 'HOLD AND DRAW A CIRCLE', W / 2, H * .38); g.restore();
    const sk = COARSE ? 'Skip' : 'Skip  (Enter)'; g.font = `600 14px ${RESUME_SANS}`; const sw = g.measureText(sk).width + 32, sx = L.narrow ? 16 : W / 2 - sw / 2, sy = 22; g.fillStyle = r.hover && r.hover.go === 'skip' ? 'rgba(255,255,255,.34)' : 'rgba(255,255,255,.2)'; g.beginPath(); g.roundRect(sx, sy, sw, 36, 18); g.fill(); g.fillStyle = '#fff'; g.fillText(sk, sx + sw / 2, sy + 19); g.textAlign = 'left'; g.textBaseline = 'alphabetic'; hot.push({ x: sx, y: sy, w: sw, h: 36, go: 'skip' });
  } else if (r.phase !== 'read') {
    // The world, the hands, and the name fading away as you go in.
    r.a = resumeClamp(r.y / (H * 1.1)); const a = r.a; if (r.phase === 'title' && a > .01) r.phase = 'world';
    if (r.auto || r.holding) r.hold = Math.min(1, r.hold + dt / RESUME_HOLD_S); else r.hold = Math.max(0, r.hold - dt * 1.4 / RESUME_HOLD_S);
    if (r.phase !== 'flash' && r.hold >= 1) { r.phase = 'flash'; r.flashAt = now; live.textContent = 'Connected. The resume follows.'; }
    const shiftY = (1 - resumeEase(a)) * H * .06; g.fillStyle = '#dcebe8'; g.fillRect(0, 0, W, H); resumeCover(P.world, reduced ? 0 : -lookX * .018, (reduced ? 0 : -lookY * .012) + shiftY);
    g.globalCompositeOperation = 'lighter'; g.globalAlpha = .55 + Math.sin(time * .5) * .12; g.drawImage(L.rays, W * .1, -H * .05, W, H * .95); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    g.drawImage(L.mist, 0, 0, W, H);
    // Hands.
    const slide = 1 - resumeEase((a - .2) / .8), size = L.tall ? W * 1.95 : Math.max(W * .78, H * 1.05), cx = W / 2, cy = H * (L.tall ? .44 : .46), start = size * (L.tall ? .062 : .082), e = r.hold * r.hold * (3 - 2 * r.hold), breathe = reduced ? 0 : (1 - e) * Math.sin(time * .9), para = reduced ? 0 : 1;
    // The hands ride a spring toward the hold: eager while it's pressed, a little bounce back when let go.
    if (r.near === undefined || reduced) { r.near = e; r.nearV = 0; } else { const k = 140, step = Math.min(.05, dt); r.nearV += (k * (e - r.near) - 2 * Math.sqrt(k) * .5 * r.nearV) * step; r.near += r.nearV * step; }
    const n = resumeClamp(r.near, -.15, 1.05), tug = Math.exp(-((((r.beat || 0) % 1 - .48) / .035) ** 2)) * e; // each beat of the heart line pulls them together
    const reach = Math.max(2, start * (1 - n) + 3 - tug * 5), p = resumeClamp(.1 + a * .25 + resumeClamp(n) * .65), shake = reduced ? 0 : e * e * 2.4, lean = -resumeClamp(n) * .06; // trembling as they near, and levelling out
    const jx = shake * Math.sin(time * 71.3) * Math.sin(time * 13.1), jy = shake * Math.cos(time * 63.7) * Math.sin(time * 9.3);
    L.tipGap = reach * 2;
    if (a > .18) {
      const handA = resumeEase((a - .18) / .4), tilted = (x, y, draw) => { g.save(); g.translate(x, y); g.rotate(lean); g.translate(-x, -y); draw(); g.restore(); }; // turned about the fingertip, so the tips stay put
      const rbX = cx - reach - slide * W * .8 + lookX * -.012 * para + jx, rbY = cy + breathe * 4 - slide * H * .12 + lookY * -.01 * para + jy;
      const hmX = cx + reach + slide * W * .8 + lookX * -.022 * para - jx, hmY = cy - breathe * 4 + slide * H * .14 + lookY * -.016 * para - jy;
      tilted(rbX, rbY, () => { resumeHand('robot', p, rbX, rbY, size, handA); resumeCode('robot', p, rbX, rbY, size, handA, time, e); });
      tilted(hmX, hmY, () => resumeHand('human', p, hmX, hmY, size, handA));
      if (e > .01) { // light gathering at each fingertip
        g.save(); g.globalCompositeOperation = 'lighter';
        for (const [x, y, col] of [[rbX, rbY, '120,255,215'], [hmX, hmY, '255,214,170']]) { const rad = 8 + e * 34, glow = g.createRadialGradient(x, y, 0, x, y, rad); glow.addColorStop(0, `rgba(${col},${(e * .75).toFixed(3)})`); glow.addColorStop(1, `rgba(${col},0)`); g.fillStyle = glow; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
        g.restore();
      }
    }
    g.globalAlpha = .35; g.drawImage(L.mist, 0, H * .3, W, H * .7); g.globalAlpha = 1;
    resumeAir(time, resumeEase((a - .1) / .6), r.y);
    // The ring to hold.
    if (a > .92 && r.phase === 'world') {
      const k = (a - .92) / .08, ring = Math.max(32, Math.min(W, H) * .062), grow = r.holding || r.auto ? 1 + e * .25 : 1 + Math.sin(time * 2.2) * .05;
      g.save();
      if (!reduced) {
        for (const off of [0, .5]) {
          const rp = ((time / 2.8 + off) % 1), ra = (rp < .18 ? rp / .18 : 1 - (rp - .18) / .82) * .48 * k * (1 - e * .5);
          if (ra > .01) { g.globalAlpha = ra; g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, ring * (.85 + rp * 1.95), 0, 7); g.stroke(); }
        }
      }
      g.globalAlpha = k * (1 - e * .4); g.strokeStyle = 'rgba(255,255,255,.95)'; g.shadowColor = 'rgba(180,255,240,.95)'; g.shadowBlur = 26; g.lineWidth = Math.max(9, ring * .28) * (1 - e * .6); g.beginPath(); g.arc(cx, cy, ring * grow, 0, 7); g.stroke(); g.shadowBlur = 0;
      const lw = Math.max(9, ring * .28) * (1 - e * .6), R = ring * grow;
      if (r.hold > .002) { // progress, drawn on the ring itself: clockwise from the top, draining back when let go
        const end = -Math.PI / 2 + r.hold * Math.PI * 2;
        g.globalAlpha = k; g.lineCap = 'round'; g.strokeStyle = '#19c79c'; g.shadowColor = 'rgba(40,230,180,.9)'; g.shadowBlur = 18; g.lineWidth = lw * .9 + 2;
        g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2, end); g.stroke(); g.shadowBlur = 0; g.lineCap = 'butt';
        g.fillStyle = '#eafff8'; g.beginPath(); g.arc(cx + Math.cos(end) * R, cy + Math.sin(end) * R, lw * .38 + 1.5, 0, 7); g.fill(); // its bright tip
      }
      // A heartbeat inside the ring, beating faster and taller the longer it's held: the human and the machine syncing up.
      r.beat = (r.beat || 0) + (reduced ? 0 : Math.min(.05, dt) * (1.1 + e * 3.4));
      const inner = R - lw / 2 - 4, amp = inner * (.32 + e * .4), pulse = u => { // one beat of a heart monitor trace, u from 0 to 1
        const bump = (c, w, h) => h * Math.exp(-(((u - c) / w) ** 2));
        return bump(.28, .035, .16) - bump(.44, .012, .28) + bump(.48, .014, 1) - bump(.52, .014, .42) + bump(.7, .05, .22);
      };
      if (inner > 8) {
        g.save(); g.beginPath(); g.arc(cx, cy, inner, 0, 7); g.clip();
        g.lineJoin = 'round'; g.lineWidth = 2 + e; g.strokeStyle = e > .02 ? '#13b48e' : 'rgba(16,80,72,.7)'; g.shadowColor = 'rgba(40,230,180,.7)'; g.shadowBlur = 6 + e * 10;
        g.beginPath(); for (let x = -inner; x <= inner; x += 1.5) { const u = ((x / (inner * 2) + .5 - r.beat) % 1 + 1) % 1; g.lineTo(cx + x, cy - pulse(u) * amp); } g.globalAlpha = k; g.stroke();
        g.restore();
      }
      g.restore(); const hs = Math.max(13, Math.min(W * .034, 18)); g.save(); g.globalAlpha = k * (1 - resumeEase(e * 3)); g.font = `600 ${hs}px ${RESUME_MONO}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = RESUME_INK; g.fillText(COARSE ? 'TOUCH AND HOLD' : 'PRESS AND HOLD', cx, cy - ring * (L.tall ? 3.3 : 2.3)); g.restore(); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    }
    // White, then the name in it.
    const veil = 1 - resumeEase(a * 1.7); if (veil > 0) { g.fillStyle = `rgba(250,253,252,${veil})`; g.fillRect(0, 0, W, H); const tint = g.createRadialGradient(W / 2, H * .45, Math.min(W, H) * .2, W / 2, H * .45, Math.max(W, H) * .78); tint.addColorStop(0, 'rgba(160,215,200,0)'); tint.addColorStop(1, `rgba(150,205,190,${veil * .75})`); g.fillStyle = tint; g.fillRect(0, 0, W, H); }
    if (a < .55) {
      const tA = 1 - resumeEase(a * 2.2), appear = resumeEase((now - r.at) / 1000 / RESUME_TITLE_S), k = 1 + a * .5, bw = L.titleW * k, bh = L.titleH * k, tx = (W - bw) / 2, ty = H * .44 - bh / 2;
      g.save(); g.globalAlpha = tA; g.beginPath(); g.rect(0, 0, tx + bw * (.12 + appear * .88), H); g.clip(); g.drawImage(L.titleBmp, tx, ty, bw, bh); g.restore();
      const rs = Math.max(12, Math.min(W * .032, 17)); g.save(); g.globalAlpha = tA * resumeEase(((now - r.at) / 1000 - RESUME_TITLE_S * .7) / .5); g.font = `500 ${rs}px ${RESUME_MONO}`; g.textAlign = 'center'; g.fillStyle = '#17514b'; g.fillText(RESUME_WORDS.role, W / 2, H * .44 + L.titleH * .34); g.restore(); g.textAlign = 'left';
    }
    if (r.shatter) resumeDrawShatter(r.shatter, now);
    // Say scroll, until they do.
    if (a < .06 && r.phase === 'title' && !r.shatter) { const s = Math.max(13, Math.min(H * .022, 15)), hint = COARSE ? 'SWIPE UP' : 'SCROLL', bob = reduced ? 0 : Math.sin(time * 2.4) * 3; g.save(); g.globalAlpha = resumeEase(((now - r.at) / 1000 - RESUME_TITLE_S) / .5) * (1 - a / .06); g.font = `600 ${s}px ${RESUME_MONO}`; g.textAlign = 'center'; g.fillStyle = '#17514b'; g.fillText(hint, W / 2, H - 150 + bob); g.restore(); g.textAlign = 'left'; }
    const fadeUi = resumeEase((now - r.at) / 1000 / 1.4 - .4); resumeDock(L, hot, fadeUi, dt); if (r.phase !== 'flash') resumeBanner(L, hot, H - 60 - Math.max(14, H * .022) - 52, fadeUi);
    resumeTop(L);
    // Touch: a spark at the fingertips, then light fills everything.
    if (r.phase === 'flash') {
      const t = (now - r.flashAt) / 1000 / RESUME_FLASH_S, s = Math.max(W, H) * (.12 + resumeEase(t) * 1.6), l = g.createRadialGradient(cx, cy, 0, cx, cy, s); l.addColorStop(0, 'rgba(255,255,255,1)'); l.addColorStop(.25, 'rgba(225,255,248,.92)'); l.addColorStop(1, 'rgba(180,255,235,0)'); g.globalCompositeOperation = 'lighter'; g.fillStyle = l; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over';
      g.fillStyle = `rgba(250,253,252,${resumeEase((t - .35) / .55)})`; g.fillRect(0, 0, W, H);
      if (t >= 1) resumeRead(now);
    }
  } else {
    // The résumé, on light through frosted glass: one part per scroll.
    g.fillStyle = '#dfeeea'; g.fillRect(0, 0, W, H); resumeCover(P.veil, reduced ? 0 : -lookX * .012, (reduced ? 0 : -lookY * .008) - r.y * .012, 1.12); g.fillStyle = 'rgba(238,247,244,.58)'; g.fillRect(0, 0, W, H);
    resumeAir(time, .34, r.y);
    resumeMeasure(L, dt);
    if (r.jump) { const sec = L.secs.find(q => q.name === r.jump); if (sec) { r.ty = sec.slotY; r.jumpSec = sec.name; r.moved = true; } r.jump = null; }
    if (r.jumpSec) { const sec = L.secs.find(q => q.name === r.jumpSec); if (sec && L.moving) r.ty = sec.slotY; else r.jumpSec = null; }
    r.ty = resumeClamp(r.ty, 0, L.max);
    const s = r.y + (r.pull || 0) * .35, tops = L.tops, panels = L.panels;
    let section = 'About'; for (const sec of L.secs) if (s >= sec.slotY - H * .45) section = sec.name;
    r.section = section;
    for (const p of panels) { const top = p.from - s; if (top > H || p.to - s < 0) continue; g.fillStyle = 'rgba(255,255,255,.62)'; g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 1; g.beginPath(); g.roundRect(L.colX, top, L.colW, p.to - p.from, 22); g.fill(); g.stroke(); }
    g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    L.blocks.forEach((b, i) => {
      const top = tops[i] - s;
      if (b.kind === 'open') hot.push({ x: L.colX, y: top, w: L.colW, h: b.h, go: b.key, doc: tops[i] });
      if (b.kind === 'box') hot.push({ x: b.bx, y: top + b.by, w: b.bw, h: 50, go: b.go, doc: tops[i] });
      if (top > H + 40 || top + b.hNow < -40 || !b.h) return;
      if (b.rule) { g.fillStyle = RESUME_RULE; g.fillRect(L.left, top, L.inner, 1); }
      for (const q of b.pics) { const im = q.img ? P[q.img] : P.works[q.works]; if (!im || !im.naturalWidth) continue; if (!q.contain) hot.push({ x: q.x, y: top + q.y, w: q.w, h: q.h, go: `zoom:${q.img || 'works' + q.works}`, doc: tops[i] }); /* photos open large; logos don't */ g.save(); if (q.r) { g.beginPath(); g.roundRect(q.x, top + q.y, q.w, q.h, q.r); g.clip(); } const k = (q.contain ? Math.min : Math.max)(q.w / im.naturalWidth, q.h / im.naturalHeight), dw = im.naturalWidth * k, dh = im.naturalHeight * k; g.drawImage(im, q.x + (q.w - dw) / 2, top + q.y + (q.h - dh) * (q.contain ? .5 : q.img === 'barong' ? .08 : .3), dw, dh); g.restore(); }
      for (const it of b.items) { const yy = top + it.y; if (yy < H + 40 && yy > -60) resumeWrite(it, yy); }
      if (b.kind === 'open') {
        const label = r.open[b.key] ? 'Close' : 'View', on = r.hover && r.hover.go === b.key; g.font = `600 15.5px ${RESUME_SANS}`; g.fillStyle = RESUME_INK; const lw = g.measureText(label).width, lx = b.linkX - lw, ly = top + b.h * .5 + 5; g.fillText(label, lx, ly); g.fillRect(lx, ly + 6, on ? lw * .4 : lw, 1);
        if (b.kNow > .002) { g.save(); g.beginPath(); g.rect(0, top + b.h - 2, W, b.bodyH * resumeEase(b.kNow) + 2); g.clip(); g.globalAlpha = resumeEase(b.kNow * 1.4); for (const it of b.body) { const yy = top + b.h + it.y; if (yy < H + 40) resumeWrite(it, yy); } g.restore(); }
      }
      if (b.kind === 'box') { const on = r.hover && r.hover.go === b.go, by = top + b.by; g.fillStyle = on ? RESUME_TEAL : '#1a2422'; g.beginPath(); g.roundRect(b.bx, by, b.bw, 50, 25); g.fill(); g.fillStyle = '#f7fbf9'; g.font = `600 16px ${RESUME_SANS}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(b.button, b.bx + b.bw / 2, by + 26); g.textAlign = 'left'; g.textBaseline = 'alphabetic'; }
    });
    const focused = r.kb >= 0 && L.hot[r.kb]; if (focused) { g.strokeStyle = RESUME_TEAL; g.lineWidth = 2; g.strokeRect(focused.x - 3, focused.y - 3, focused.w + 6, focused.h + 6); }
    if (r.melt) { // moving between parts, the old view melts like wax: thin strips slide off at their own speeds, the way it was scrolling, as they fade
      const m = r.melt, t = (now - m.at) / 700;
      if (t >= 1) r.melt = null;
      else {
        const im = m.from, k = im.width / W, strips = 60, sw = W / strips, e = t * t * (3 - 2 * t);
        g.save(); g.beginPath(); g.rect(0, 64, W, H - 64 - 150); g.clip(); g.globalAlpha = Math.max(0, 1 - t * 1.2); // the ruler and the dock stay put
        for (let i = 0; i < strips; i++) { const nz = .5 + .5 * Math.sin(i * 1.7 + m.seed) * Math.cos(i * .53 + m.seed * 1.3); g.drawImage(im, i * sw * k, 0, sw * k + 1, im.height, i * sw, -m.dir * e * H * (.12 + nz * .45), sw + 1, H); }
        g.restore();
      }
    }
    const dockHot = []; resumeDock(L, dockHot, 1, dt); hot.unshift(...dockHot); resumeTop(L);
    if (r.wash > 0) { r.wash = Math.max(0, r.wash - dt / (reduced ? .01 : .7)); g.fillStyle = `rgba(250,253,252,${resumeEase(r.wash)})`; g.fillRect(0, 0, W, H); }
  }
  L.hot = hot;
  if (r.from) { const t = (now - r.fadeAt) / (reduced ? 1 : 500); if (t >= 1 || r.phase === 'read' && r.wash > 0) r.from = null; else { g.globalAlpha = 1 - t * t; g.drawImage(r.from, 0, 0, W, H); g.globalAlpha = 1; } }
}

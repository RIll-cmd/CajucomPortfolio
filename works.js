/* Box 1's page, behind the door: one full screen at a time through a night sky, in navy, teal and coral.
   All project names, tags, words and screenshots are placeholders, kept together here so they're easy to swap. */
const WORKS_WORDS = {
  name: 'Cyrill',
  role: 'YOUR ROLE HERE',
  aboutTitle: 'About me',
  about: 'Placeholder lines about what I make, how I work, and what I care about. Swap this for the real thing when you are ready.',
  aboutMore: 'More about me',
  highlight: { make: 0, work: 1, care: 2 }, // words that sit on a coloured chip, by which colour
  portfolioLabel: 'PORTFOLIO',
  portfolioTitle: 'Works',
  portfolio: 'My latest works. A placeholder line about where craft and curiosity meet.',
  filters: ['All', 'Design', 'Development'],
  ask: 'Have a world in mind?',
  talk: "Let's talk",
  email: 'your@email.here',
  items: [
    { t: 'Project One', tags: ['Design', 'Development'], colors: ['#160c52', '#fff4e0', '#ff7a59', '#c62e6d'], layout: 0 },
    { t: 'Project Two', tags: ['Design', 'Development'], colors: ['#f6efe0', '#1f3a4d', '#2f9d8f', '#f2b84b'], layout: 1 },
    { t: 'Project Three', tags: ['Development'], colors: ['#14323a', '#eafff6', '#7fe0b0', '#2c6e6b'], layout: 2 },
    { t: 'Project Four', tags: ['Design'], colors: ['#fff0f3', '#5a1f3d', '#e8527c', '#ffc1cf'], layout: 0 },
    { t: 'Project Five', tags: ['Design', 'Development'], colors: ['#1c2a6b', '#f7f4ff', '#ffd25e', '#5668d8'], layout: 1 },
    { t: 'Project Six', tags: ['Development'], colors: ['#f2e6d3', '#3b2a1e', '#c8622f', '#e3b98a'], layout: 2 },
  ],
};
const WORKS_NAVY = '#14284b', WORKS_DUSK = '#27527a', WORKS_TEAL = '#3fc1b0', WORKS_CORAL = '#ff8a5c', WORKS_CREAM = '#f4ecd8', WORKS_BODY = 'Poppins, "Segoe UI", sans-serif', WORKS_LABEL = 'Righteous, "Segoe UI", sans-serif', WORKS_SCRIPT = '"Kaushan Script", Righteous, cursive';
const worksEase = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
const worksClamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- Placeholder screenshots: a made-up site, one per project. Swap draw() for a real image ---------- */
function worksMock(x, w, h, it) {
  const [bg, ink, accent, soft] = it.colors, u = w / 100, bar = (a, b, c, d, color, r = .8) => { x.fillStyle = color; x.beginPath(); x.roundRect(a * u, b * u, c * u, d * u, r * u); x.fill(); };
  x.fillStyle = bg; x.fillRect(0, 0, w, h);
  bar(5, 4, 12, 3, ink); for (const a of [52, 63, 74]) bar(a, 4.6, 8, 1.6, ink); bar(85, 3.4, 11, 4, accent, 2);
  x.textBaseline = 'middle'; x.fillStyle = ink; x.font = `700 ${9 * u}px Georgia, serif`;
  const circle = (a, b, r, color) => { x.fillStyle = color; x.beginPath(); x.arc(a * u, b * u, r * u, 0, 7); x.fill(); };
  if (it.layout === 0) {
    x.textAlign = 'left'; x.fillText(it.t, 6, 20 * u); bar(6, 28, 42, 1.7, ink); bar(6, 32, 34, 1.7, ink); bar(6, 38, 18, 5, accent, 2.5);
    circle(74, 28, 19, soft); circle(82, 20, 8, accent); bar(52, 40, 42, 3, soft);
  } else if (it.layout === 1) {
    x.textAlign = 'center'; x.fillText(it.t, w / 2, 19 * u); bar(25, 27, 50, 1.7, ink); bar(33, 31, 34, 1.7, ink); bar(41, 36, 18, 5, accent, 2.5);
    bar(8, 46, 84, 26, soft, 2); circle(30, 59, 8, accent); bar(45, 54, 38, 3, bg); bar(45, 60, 28, 3, bg);
  } else {
    bar(5, 12, 90, 30, soft, 2); x.textAlign = 'left'; x.fillStyle = bg; x.fillText(it.t, 10, 27 * u); bar(10, 34, 26, 4, accent, 2);
    for (let i = 0; i < 3; i++) bar(5 + i * 31, 46, 28, 26, i === 1 ? accent : soft, 2);
  }
  for (let row = 0; row < 7; row++) {
    const y = 78 + row * 22;
    if (row % 2) { bar(5, y, 42, 18, soft, 1.6); bar(53, y + 3, 38, 2, ink); bar(53, y + 8, 30, 2, ink); bar(53, y + 13, 14, 3, accent, 1.5); }
    else { bar(53, y, 42, 18, row % 4 ? accent : soft, 1.6); bar(5, y + 3, 38, 2, ink); bar(5, y + 8, 30, 2, ink); bar(5, y + 13, 14, 3, accent, 1.5); }
  }
}
for (const it of WORKS_WORDS.items) Object.assign(it, { c: it.tags.join(' and '), w: 340, h: 225, draw: (x, w, h) => worksMock(x, w, Math.max(h, w * 1.2), it), s: 1, y: 0 });

/* ---------- Painted parts ---------- */
function worksPuffs(lit, dark, rim) {
  if (gateWorld) return gateWorld.puffSheet(lit, dark, rim);
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); // no baked clouds on this device: soft blobs
  for (const [a, b] of [[64, 64], [192, 64], [64, 192], [192, 192]]) { const l = x.createRadialGradient(a, b - 16, 4, a, b, 62); l.addColorStop(0, lit); l.addColorStop(.55, lit); l.addColorStop(1, `${lit}00`); x.fillStyle = l; x.fillRect(a - 64, b - 64, 128, 128); }
  return c;
}
function worksClouds(w, h, seed, sheet, shade, edge) { // a bank of billows, tops set by edge(0 to 1), filling in solid toward the bottom and fading out below that
  const c = document.createElement('canvas'), res = COARSE ? .6 : .8; c.width = Math.ceil(w * res); c.height = Math.ceil(h * res);
  const x = c.getContext('2d'), rnd = seeded(seed), puffs = [], unit = Math.min(w, h * 1.7), cell = sheet.width / 2; x.scale(res, res);
  for (let i = 0; i < 130; i++) { const u = rnd(); puffs.push([u * w, (edge(u) + rnd() * rnd() * (1 - edge(u))) * h, unit * (.17 + rnd() * .17), Math.floor(rnd() * 4)]); }
  puffs.sort((a, b) => a[1] - b[1]);
  const body = x.createLinearGradient(0, h * .5, 0, h * .78); body.addColorStop(0, `${shade}00`); body.addColorStop(1, shade);
  for (const [px, py, r, n] of puffs) x.drawImage(sheet, (n % 2) * cell, (n >> 1) * cell, cell, cell, px - r, py - r * .5, r * 2, r * 1.44);
  x.fillStyle = body; x.fillRect(0, h * .5, w, h * .5);
  const gone = x.createLinearGradient(0, h * .82, 0, h); gone.addColorStop(0, 'rgba(0,0,0,0)'); gone.addColorStop(1, 'rgba(0,0,0,1)');
  x.globalCompositeOperation = 'destination-out'; x.fillStyle = gone; x.fillRect(0, h * .82, w, h * .18);
  return c;
}
function worksStar(x, y, r, color, waist = .13) {
  g.fillStyle = color; g.beginPath();
  for (let i = 0; i < 4; i++) { const a = i * 1.5708 - 1.5708, b = a + 1.5708, m = a + .7854; const ax = x + Math.cos(a) * r, ay = y + Math.sin(a) * r, bx = x + Math.cos(b) * r, by = y + Math.sin(b) * r; if (!i) g.moveTo(ax, ay); g.quadraticCurveTo(x + Math.cos(m) * r * waist, y + Math.sin(m) * r * waist, bx, by); }
  g.closePath(); g.fill();
}
function worksWords(s, x, y, size, color = WORKS_CREAM, { font = WORKS_LABEL, weight = 400, align = 'center', spread = 0 } = {}) {
  g.font = `${weight} ${size}px ${font}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillStyle = color;
  try { g.letterSpacing = `${spread}px`; } catch { /* older browsers set it tighter */ }
  g.fillText(s, x, y);
  try { g.letterSpacing = '0px'; } catch { /* as above */ }
}
function worksPill(label, cx, cy, size, active, hovered, act) { // a soft pill with a white star at each compass point
  g.font = `400 ${size}px ${WORKS_LABEL}`; const w = g.measureText(label).width + size * 3.2, h = size * 2.5, x = cx - w / 2, y = cy - h / 2;
  const l = g.createLinearGradient(0, y, 0, y + h);
  if (active) { l.addColorStop(0, '#62d8c8'); l.addColorStop(1, WORKS_TEAL); } else { l.addColorStop(0, hovered ? '#3a709f' : WORKS_DUSK); l.addColorStop(1, hovered ? '#27527a' : '#1b3c63'); }
  g.fillStyle = l; g.beginPath(); g.roundRect(x, y, w, h, h / 2); g.fill();
  g.strokeStyle = WORKS_CREAM; g.lineWidth = 1.6; g.stroke();
  for (const [a, b] of [[x, cy], [x + w, cy], [cx, y], [cx, y + h]]) worksStar(a, b, size * .42, WORKS_CREAM);
  worksWords(label, cx, cy + size * .04, size, active ? WORKS_NAVY : WORKS_CREAM);
  if (act) works.hot.push({ x: x - 4, y: y - 8, w: w + 8, h: h + 16, act, label }); // tall enough for a thumb
  return w;
}
/* ---------- Crayon: a rough, broken outline, waxy strokes over the colour, and flecks where the paper shows through ---------- */
function worksRough(x, path, color, width, rnd) {
  x.strokeStyle = color; x.lineCap = 'round';
  for (let i = 0; i < 3; i++) { x.setLineDash([2 + rnd() * 10, 1 + rnd() * 5, 4 + rnd() * 14, 1 + rnd() * 4]); x.lineDashOffset = rnd() * 40; x.lineWidth = width * (.55 + rnd() * .6); x.stroke(path); }
  x.setLineDash([]);
}
/* ---------- Laying each screen out ---------- */
function worksWrapWords(text, size, width, tones) { // lines of words, with room left for the chips behind highlighted ones
  g.font = `600 ${size}px ${WORKS_BODY}`;
  const space = g.measureText(' ').width, chipPad = size * .3, lines = [[]]; let used = 0;
  for (const word of text.split(' ')) {
    const clean = word.replace(/[.,]/g, ''), tone = tones[clean], w = g.measureText(word).width + (tone === undefined ? 0 : chipPad * 2);
    if (used && used + space + w > width) { lines.push([]); used = 0; }
    lines[lines.length - 1].push({ s: word, w, tone }); used += (used ? space : 0) + w;
  }
  return { lines, space, chipPad };
}
function worksLayout() {
  const tall = W < H * .9, pad = tall ? Math.max(20, W * .07) : Math.max(24, W * .08);
  works.pages = [{ kind: 'hero' }, { kind: 'about' }, { kind: 'portfolio' }];
  for (const it of WORKS_WORDS.items) { it.on = works.filter === 'All' || it.tags.includes(works.filter); if (it.on) works.pages.push({ kind: 'work', it }); }
  works.pages.push({ kind: 'talk' });
  // About: the words on one side and the figure on the other, or stacked on a tall screen.
  const a = { title: tall ? Math.min(W * .17, H * .1) : Math.min(W * .082, H * .17), size: tall ? worksClamp(W * .05, 17, 28) : worksClamp(Math.min(W * .021, H * .04), 15, 30) };
  const colW = tall ? W - pad * 2 : W * .4, flow = worksWrapWords(WORKS_WORDS.about, a.size, colW, WORKS_WORDS.highlight), leading = a.size * 1.86;
  a.x = tall ? pad : W * .5; a.titleY = H * (tall ? .13 : .2); let y = a.titleY + a.title * .95 + a.size; a.words = [];
  flow.lines.forEach(line => { let x = a.x; for (const w of line) { a.words.push({ ...w, x, y, pad: flow.chipPad }); x += w.w + flow.space; } y += leading; });
  a.pillY = y + a.size * .9; a.pillX = a.x + a.size * 5.1; works.about = a;
  // Portfolio: a heading screen, with the filters on it.
  const pSize = tall ? worksClamp(W * .05, 16, 24) : worksClamp(Math.min(W * .019, H * .034), 14, 26);
  g.font = `600 ${pSize}px ${WORKS_BODY}`;
  const pLines = wrapLines(WORKS_WORDS.portfolio, Math.min(W - pad * 2, 760));
  g.font = `400 100px ${WORKS_LABEL}`;
  const pillGap = tall ? 1.2 : 1.8, pillUnits = WORKS_WORDS.filters.reduce((n, f) => n + g.measureText(f).width / 100 + 3.2, 0) + pillGap * 2;
  works.portfolio = { size: pSize, lines: pLines, title: Math.min(W * (tall ? .24 : .13), H * .24) };
  // A work: one frame, as big as fits with its name beside or across it.
  const cardW = tall ? W - pad * 2 : Math.min(W * .56, H * .68 / .64), cardH = Math.round(cardW * .64), cardY = tall ? H * .2 : (H - cardH) / 2;
  let side = 0, n = 0; for (const it of WORKS_WORDS.items) { Object.assign(it, { cardW, cardH, side, n: ++n, x: tall ? pad : side ? W - pad - cardW : pad * 1.2, y: cardY }); if (it.on) side = 1 - side; }
  Object.assign(works, { tall, pad, pillSize: Math.min(tall ? 16 : worksClamp(W * .017, 13, 19), (W - pad * 1.5) / pillUnits), pillGap });
  works.page = worksClamp(works.page, 0, works.pages.length - 1);
}
/* ---------- Under the water: the boy is boy.png, 1024 by 572, with the background already cut out. His hair carries on as paint into the next screen ---------- */
const WORKS_BOY_IMG = new Image();
WORKS_BOY_IMG.onload = () => { if (works) { works.water = worksPaintWater(); dirty = true; } };
WORKS_BOY_IMG.src = 'boy.png';
function worksPaintWater() { // from the surface, down this screen, and on to fill the whole next one, ending in drips of hair
  const tall = W < H * .9, res = COARSE ? .6 : .8, bottom = H * 1.97, tips = H * 1.82, rnd = seeded(83), a = works.about, clear = a.pillY + a.size * 1.8;
  const S = tall ? Math.min((H - clear) / 502, W * .9 / 330) : Math.min(H / 572, W * .48 / 440), oy = H - 572 * S, ox = tall ? W / 2 - 275 * S : 0, ix = u => ox + u * S, iy = v => oy + v * S, k = H / 720;
  const c = document.createElement('canvas'); c.width = Math.ceil(W * res); c.height = Math.ceil(bottom * res); const x = c.getContext('2d'); x.scale(res, res); x.lineJoin = x.lineCap = 'round';
  const deep = x.createLinearGradient(0, 0, 0, bottom); deep.addColorStop(0, '#2ceaf6'); deep.addColorStop(H * .13 / bottom, '#16a6f4'); deep.addColorStop(H * .42 / bottom, '#0a58dc'); deep.addColorStop(H * .85 / bottom, '#0827ad'); deep.addColorStop(1, '#06107e'); x.fillStyle = deep; x.fillRect(0, 0, W, bottom);

  for (let i = 0; i < 70; i++) { // ripples of light on the surface above
    const px = W * rnd(), py = H * (.035 + rnd() * rnd() * (tall ? .05 : .08)), r = Math.min(W, H) * (.02 + rnd() * .06);
    x.fillStyle = rnd() < .6 ? `rgba(255,255,255,${.22 + rnd() * .4})` : `rgba(150,245,255,${.2 + rnd() * .3})`; x.beginPath(); x.ellipse(px, py, r * 1.8, r * (.1 + rnd() * .12), (rnd() - .5) * .12, 0, 7); x.fill();
  }
  for (const [a, b, r] of [[.55, .74, .018], [.57, .78, .012], [.77, .66, .022], [.79, .7, .012]]) { x.fillStyle = 'rgba(70,195,255,.6)'; x.beginPath(); x.ellipse(W * (tall ? a * 1.2 - .1 : a), H * b, Math.min(W, H) * r * 1.2, Math.min(W, H) * r, .4, 0, 7); x.fill(); }
  for (const [a, w] of [[.82, .05], [.9, .03], [.68, .025]]) { const ray = x.createLinearGradient(0, H * .1, 0, H * .78); ray.addColorStop(0, 'rgba(190,245,255,.24)'); ray.addColorStop(1, 'rgba(190,245,255,0)'); x.fillStyle = ray; x.beginPath(); x.moveTo(W * a, H * .1); x.lineTo(W * (a + w), H * .1); x.lineTo(W * (a + w * 2 - .05), H * .78); x.lineTo(W * (a - .05), H * .78); x.closePath(); x.fill(); } // shafts of light
  // The rest of his hair, starting behind the picture and filling the next screen. Its top colour is sampled from the picture's bottom edge.
  const hair = new Path2D(); hair.moveTo(-10, iy(540)); hair.bezierCurveTo(ix(100), iy(515), ix(300), iy(495), ix(500), iy(510)); hair.bezierCurveTo(ix(700), iy(525), ix(880), iy(540), ix(960), iy(572)); hair.bezierCurveTo(ix(960) + (W - ix(960)) * .4, H * .99, W, H * .99, W + 10, H * .99); hair.lineTo(W + 10, bottom + 10); hair.lineTo(-10, bottom + 10); hair.closePath();
  const fall = x.createLinearGradient(0, iy(520), 0, bottom); fall.addColorStop(0, '#1b3460'); fall.addColorStop(.35, '#0f2a78'); fall.addColorStop(1, '#081a70');
  x.save(); x.fillStyle = fall; x.fill(hair); x.clip(hair); x.lineCap = 'round';
  const strands = COARSE ? 70 : 130;
  for (let i = 0; i < strands; i++) { // each one picks up at the picture's bottom edge and fans outward as it falls
    const t = (i + rnd()) / strands, sx = t * W, sy = H * (.96 + rnd() * .07), ex = -W * .05 + W * 1.1 * t * t, tone = rnd();
    x.strokeStyle = tone < .3 ? `rgba(150,215,255,${.16 + rnd() * .34})` : tone < .7 ? `rgba(2,4,20,${.2 + rnd() * .3})` : `rgba(30,90,220,${.2 + rnd() * .3})`; x.lineWidth = (rnd() < .12 ? 5 + rnd() * 8 : 1.2 + rnd() * 2.4) * k; x.setLineDash([60 * k + rnd() * 240 * k, 2 + rnd() * 10]);
    x.beginPath(); x.moveTo(sx, sy); x.bezierCurveTo(sx + (t - .5) * W * .1, sy + H * .25, ex, bottom - (bottom - sy) * .58, ex, bottom); x.stroke();
  }
  x.setLineDash([]); x.restore();
  if (WORKS_BOY_IMG.complete && WORKS_BOY_IMG.naturalWidth) { // on his own sheet, so his edges can fade without touching the water
    const sheet = document.createElement('canvas'); sheet.width = c.width; sheet.height = c.height; const y = sheet.getContext('2d'); y.scale(res, res); y.imageSmoothingQuality = 'high';
    y.drawImage(WORKS_BOY_IMG, ox, oy, 1024 * S, 572 * S);
    y.globalCompositeOperation = 'destination-out';
    const seam = y.createLinearGradient(0, iy(530), 0, iy(572)); seam.addColorStop(0, 'rgba(0,0,0,0)'); seam.addColorStop(1, '#000'); y.fillStyle = seam; y.fillRect(0, iy(530), W, 42 * S + 2); // melts into the painted hair
    if (oy > 1) { const fade = y.createLinearGradient(0, iy(40), 0, iy(100)); fade.addColorStop(0, '#000'); fade.addColorStop(1, 'rgba(0,0,0,0)'); y.fillStyle = fade; y.fillRect(0, 0, W, iy(100)); } // keeps clear of the words above
    x.drawImage(sheet, 0, 0, W, bottom);
  }
  // Above the surface, and below the last drips, there's only sky.
  x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000';
  const top = new Path2D(); top.moveTo(-10, -10); top.lineTo(W + 10, -10); const wave = W / 14; for (let i = 14; i >= 0; i--) top.quadraticCurveTo(i * wave + wave * .5, H * (i % 2 ? .012 : .036), i * wave, H * .024); top.closePath(); x.fill(top);
  const end = new Path2D(); end.moveTo(-10, tips); const lump = (W + 20) / 9; for (let i = 0; i < 9; i++) { const from = -10 + i * lump, drop = H * (.04 + rnd() * .1); end.quadraticCurveTo(from + lump * .22, tips + drop, from + lump * .5, tips + drop); end.quadraticCurveTo(from + lump * .78, tips + drop, from + lump, tips - H * .012); } end.lineTo(W + 10, bottom + 10); end.lineTo(-10, bottom + 10); end.closePath(); x.fill(end);
  x.restore();
  const foam = new Path2D(); foam.moveTo(0, H * .024); for (let i = 0; i < 14; i++) foam.quadraticCurveTo(i * wave + wave * .5, H * (i % 2 ? .012 : .036), (i + 1) * wave, H * .024); worksRough(x, foam, '#e8fbff', 5, rnd);
  return c;
}
function worksPaintSky() { // night: soft washes of blue and teal, and a dust of faint stars
  const c = document.createElement('canvas'), res = COARSE ? .6 : .8, cw = c.width = Math.ceil(W * res), ch = c.height = Math.ceil(H * res), x = c.getContext('2d'), rnd = seeded(31), reach = Math.max(cw, ch);
  const l = x.createLinearGradient(0, 0, 0, ch); l.addColorStop(0, '#0e1d39'); l.addColorStop(.6, WORKS_NAVY); l.addColorStop(1, '#1f4268'); x.fillStyle = l; x.fillRect(0, 0, cw, ch);
  for (let i = 0; i < 40; i++) { const px = rnd() * cw, py = rnd() * ch, r = reach * (.1 + rnd() * .26), tint = ['39,82,122', '63,193,176', '30,60,110', '39,82,122'][i % 4], w = x.createRadialGradient(px, py, 0, px, py, r); w.addColorStop(0, `rgba(${tint},${i % 4 === 1 ? .06 : .2})`); w.addColorStop(1, `rgba(${tint},0)`); x.fillStyle = w; x.fillRect(px - r, py - r, r * 2, r * 2); }
  for (let i = 0; i < 90; i++) { const px = rnd() * cw, py = rnd() * ch, r = reach * (.02 + rnd() * .07), tint = rnd() < .5 ? '8,18,44' : '58,110,160', w = x.createRadialGradient(px, py, r * .2, px, py, r); w.addColorStop(0, `rgba(${tint},.14)`); w.addColorStop(.8, `rgba(${tint},.1)`); w.addColorStop(1, `rgba(${tint},0)`); x.fillStyle = w; x.fillRect(px - r, py - r, r * 2, r * 2); } // pooled paint
  for (let i = 0; i < 34; i++) { const px = rnd() * cw, py = rnd() * ch; for (let k = 0; k < 12; k++) { const a = rnd() * 6.28, d = rnd() * rnd() * reach * .05; x.fillStyle = `rgba(5,12,34,${.2 + rnd() * .4})`; x.beginPath(); x.ellipse(px + Math.cos(a) * d * 1.6, py + Math.sin(a) * d, .4 + rnd() * rnd() * 1.8, .3 + rnd() * rnd() * 1.1, rnd() * 3, 0, 7); x.fill(); } } // flecks
  for (let i = 0; i < 300; i++) { x.fillStyle = `rgba(244,236,216,${.08 + rnd() * .3})`; x.beginPath(); x.arc(rnd() * cw, rnd() * ch, .3 + rnd() * rnd() * 1.1, 0, 7); x.fill(); }
  return c;
}
function worksPrepare() {
  works.sky = worksPaintSky();
  const cw = Math.ceil(W * 1.3), ch = Math.ceil(H * .95), valley = u => .2 + (.34 + Math.sin(u * 19) * .04) * Math.exp(-(((u - .5) / .26) ** 2));
  works.clouds = [
    worksClouds(cw, ch, 5, worksPuffs('#3a6a96', '#1b3c63', '#6fa3c4'), '#1b3c63', valley),
    worksClouds(cw, ch, 9, worksPuffs('#6a9dbd', '#27527a', '#a9cfdc'), '#27527a', valley),
    worksClouds(cw, ch, 13, worksPuffs('#a9cbd9', '#3f6f96', '#7fa6bd'), '#3f6f96', u => valley(u) + .05),
  ];
  const rnd = seeded(77); works.motes = Array.from({ length: COARSE ? 30 : 80 }, () => ({ x: rnd(), y: rnd(), d: .05 + rnd() * .3, r: 1 + rnd() * rnd() * 7, p: rnd() * 6.28, gold: rnd() < .2 }));
  works.bubbles = Array.from({ length: COARSE ? 12 : 22 }, () => ({ x: rnd(), y: rnd(), r: 2 + rnd() * rnd() * 16, rate: .3 + rnd() * .8, p: rnd() * 6.28 }));
  for (const it of WORKS_WORDS.items) it.bmp = null;
  worksLayout();
  works.water = worksPaintWater();
  worksBakeTitle();
  works.key = `${W}x${H}`;
  works.y = works.page * H;
}
function worksArcText(x, text, cx, cy, rx, ry, mid, size, top) { // letters set one by one along an ellipse
  x.font = `400 ${size}px ${WORKS_LABEL}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = WORKS_CREAM;
  const gap = size * .14, widths = [...text].map(ch => x.measureText(ch).width + gap), total = widths.reduce((a, b) => a + b);
  let run = -total / 2;
  [...text].forEach((ch, i) => {
    const along = (run + widths[i] / 2) / ((rx + ry) / 2), a = top ? mid + along : mid - along;
    x.save(); x.translate(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); x.rotate(top ? a + 1.5708 : a - 1.5708); x.fillText(ch, 0, 0); x.restore();
    run += widths[i];
  });
}
function worksBakeTitle() { // the swirl, the crescents, the vines and the word's glow are too slow to redraw every frame
  const tall = W < H * .9, c = document.createElement('canvas'); c.width = sceneCanvas.width; c.height = Math.ceil(H * pr); const x = c.getContext('2d'), size = Math.min(W * (tall ? .25 : .19), H * .32), cy = H * (tall ? .38 : .36), cx = W / 2, rnd = seeded(61); x.scale(pr, pr); x.lineCap = 'round';
  x.font = `400 ${size}px ${WORKS_LABEL}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round';
  const word = WORKS_WORDS.name, half = Math.min(x.measureText(word).width / 2, W / 2 - 26), ring = half * 1.16, tilt = Math.min(.62, (cy - H * .05) / ring);
  x.strokeStyle = 'rgba(63,193,176,.32)'; // hand-drawn strokes circling the word
  for (let i = 0; i < (COARSE ? 50 : 90); i++) { const r = ring * (1.05 + rnd() * 1.1), a = rnd() * 6.28, len = .1 + rnd() * .28; x.lineWidth = 1.2 + rnd() * 2.2; x.setLineDash([5 + rnd() * 26, 1 + rnd() * 5]); x.beginPath(); x.ellipse(cx, cy, r, r * tilt * 1.1, 0, a, a + len); x.stroke(); }
  x.setLineDash([]);
  const crescent = (from, to, bulge) => { x.fillStyle = WORKS_TEAL; x.beginPath(); x.ellipse(cx, cy, ring, ring * tilt, 0, from, to, false); x.ellipse(cx, cy + bulge, ring * .98, ring * tilt, 0, to, from, true); x.closePath(); x.fill(); };
  x.shadowColor = 'rgba(63,193,176,.6)'; x.shadowBlur = 12 * pr;
  crescent(3.55, 5.75, size * .07); crescent(.4, 2.05, -size * .07);
  x.shadowBlur = 0;
  const roleSize = Math.max(13, Math.min(W * .022, H * .03));
  worksArcText(x, WORKS_WORDS.role, cx, cy, ring * 1.04, ring * tilt * 1.08, tall ? 1.5708 : 1.3, roleSize, false);
  x.save(); x.translate(cx, cy); x.rotate(-.09); x.font = `400 ${size}px ${WORKS_LABEL}`; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.shadowColor = 'rgba(255,138,92,.5)'; x.shadowBlur = size * .18 * pr; x.fillStyle = '#0b1730'; x.fillText(word, size * .022, size * .036); x.shadowBlur = 0;
  x.fillStyle = WORKS_CORAL; x.fillText(word, 0, 0); x.restore();
  Object.assign(works, { titleBmp: c, titleSize: size, titleY: cy, titleHalf: half });
}

/* ---------- Opening, moving, and clicking: one screen at a time ---------- */
function openWorks(c, viaKeyboard) {
  const now = performance.now();
  works = { c, viaKeyboard, y: 0, page: 0, pull: 0, acc: 0, lock: 0, arrive: now, last: now, at: now, filter: 'All', hot: [], hover: null, key: '', flash: 1 };
  worksPrepare();
  Promise.all(['600 30px Poppins', '400 30px Righteous', '400 80px "Kaushan Script"'].map(f => document.fonts.load(f))).catch(() => {}).finally(() => { if (works) { worksLayout(); worksBakeTitle(); } }); // letter widths change once the font arrives
  hover = null; focusCard = null; glitch = 0; dirty = true;
  $('#btn-about').hidden = $('#btn-talk').hidden = true;
  live.textContent = 'Scroll, swipe or use the arrow keys to move one section at a time.';
  keyboardFocus(backBtn);
}
function closeWorks() {
  works = null; glitch = reduced ? 0 : .6; dirty = true;
  $('#btn-about').hidden = $('#btn-talk').hidden = false;
  live.textContent = ''; crt.style.cursor = 'grab';
}
function worksGo(i) {
  i = worksClamp(i, 0, works.pages.length - 1); dirty = true;
  if (i === works.page) return;
  works.page = i; works.arrive = performance.now(); works.hover = null;
  const p = works.pages[i]; live.textContent = { hero: WORKS_WORDS.name, about: `${WORKS_WORDS.aboutTitle}. ${WORKS_WORDS.about}`, portfolio: `${WORKS_WORDS.portfolioLabel}. ${WORKS_WORDS.portfolio}`, talk: `${WORKS_WORDS.talk}. ${WORKS_WORDS.email}`, work: p.it ? `${p.it.t}. Press Enter to open.` : '' }[p.kind];
}
function worksJump(i) { worksGo(i); works.y = works.page * H; works.lock = 0; } // no slide
function worksWheel(by) { // a wheel or trackpad moves one screen, then waits out the rest of the gesture
  const now = performance.now();
  if (now < works.lock) { works.acc = 0; return; }
  works.acc += by;
  if (Math.abs(works.acc) >= 60) { worksGo(works.page + Math.sign(works.acc)); works.acc = 0; works.lock = now + (reduced ? 200 : 850); }
}
function worksDrag(dy) { works.pull -= dy; const stuck = (works.page === 0 && works.pull < 0) || (works.page === works.pages.length - 1 && works.pull > 0); if (stuck) works.pull *= .7; dirty = true; }
function worksRelease(vy, at) { // far enough, or flicked: on to the next. Otherwise it settles back
  const flick = performance.now() - at < 90 && Math.abs(vy) > 5, dir = works.pull > H * .12 || (flick && vy < 0) ? 1 : works.pull < -H * .12 || (flick && vy > 0) ? -1 : 0;
  works.pull = 0; if (dir) worksGo(works.page + dir); dirty = true;
}
function worksHit(clientX, clientY) { const [sx, sy] = toScene(clientX, clientY); for (let i = works.hot.length - 1; i >= 0; i--) { const h = works.hot[i]; if (sx >= h.x && sx <= h.x + h.w && sy >= h.y && sy <= h.y + h.h) return h; } return null; }
function worksHover(clientX, clientY) { const h = worksHit(clientX, clientY); works.hover = h ? h.label : null; crt.style.cursor = h ? 'pointer' : 'grab'; }
function worksClick(clientX, clientY) { const h = worksHit(clientX, clientY); if (h) h.act(); }
function worksSetFilter(name) {
  works.filter = name; worksLayout(); works.y = works.page * H;
  live.textContent = `${name}: ${WORKS_WORDS.items.filter(i => i.on).length} projects.`;
}
function worksOpenItem(it) { openProject(it, false, true); }
function worksKey(e) {
  const by = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[e.key];
  if (by) { if (e.key === ' ' && document.activeElement === backBtn) return; e.preventDefault(); worksGo(works.page + by); return; }
  if (e.key === 'Home') { e.preventDefault(); worksGo(0); return; }
  if (e.key === 'End') { e.preventDefault(); worksGo(works.pages.length - 1); return; }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { const f = WORKS_WORDS.filters; worksSetFilter(f[(f.indexOf(works.filter) + (e.key === 'ArrowRight' ? 1 : f.length - 1)) % f.length]); return; }
  if (e.key === 'Enter' && document.activeElement !== backBtn) {
    const p = works.pages[works.page];
    if (p.kind === 'work') { e.preventDefault(); worksOpenItem(p.it); } else if (p.kind === 'about') { e.preventDefault(); $('#about').showModal(); } else if (p.kind === 'talk') { e.preventDefault(); $('#contact').showModal(); }
  }
}

/* ---------- Drawing ---------- */
const worksScript = (s, x, y, size, rotate = -.06, align = 'center') => {
  g.save(); g.translate(x, y); g.rotate(rotate); g.font = `400 ${size}px ${WORKS_SCRIPT}`; g.textAlign = align; g.textBaseline = 'middle';
  g.fillStyle = '#0b1730'; g.fillText(s, size * .03, size * .04); g.fillStyle = WORKS_CORAL; g.fillText(s, 0, 0); g.restore();
};
function worksHill(y, color) {
  g.fillStyle = color; g.beginPath(); g.moveTo(0, y + H * .04); g.bezierCurveTo(W * .25, y - H * .09, W * .45, y + H * .08, W * .68, y + H * .1); g.bezierCurveTo(W * .84, y + H * .11, W * .94, y + H * .05, W, y + H * .04); g.lineTo(W, y + H * 2); g.lineTo(0, y + H * 2); g.fill();
}
const WORKS_DRAW = {
  hero(p, sy, k, now, t) {
    const shift = sy * .55, rise = reduced ? 1 : 1 - (1 - worksClamp((t - .25) / 1.1, 0, 1)) ** 3, cy = works.titleY + shift + (1 - rise) * 40, half = works.titleHalf, size = works.titleSize;
    g.globalAlpha = k * rise; g.drawImage(works.titleBmp, 0, shift + (1 - rise) * 40, W, H);
    const tw = n => reduced ? 1 : .86 + .14 * Math.sin(t * 2 + n), glow = (x, y, r, n) => { const l = g.createRadialGradient(x, y, 0, x, y, r * 1.6); l.addColorStop(0, 'rgba(63,193,176,.4)'); l.addColorStop(1, 'rgba(63,193,176,0)'); g.fillStyle = l; g.fillRect(x - r * 1.6, y - r * 1.6, r * 3.2, r * 3.2); worksStar(x, y, r * tw(n), WORKS_TEAL, .1); };
    const big = works.tall ? .17 : .24;
    glow(Math.max(24, W / 2 - half * 1.12), cy + size * (works.tall ? .62 : .1), size * big, 0); glow(Math.max(24, W / 2 - half * 1.02), cy + size * (works.tall ? .78 : .5), size * .1, 1); glow(Math.min(W - 24, W / 2 + half * 1.12), cy - size * (works.tall ? .58 : .12), size * big * .85, 2); glow(Math.min(W - 24, W / 2 + half * 1.06), cy + size * (works.tall ? .66 : .34), size * big, 3);
    g.globalAlpha = k;
    works.clouds.forEach((c, i) => g.drawImage(c, -W * .15, H * [.46, .58, .7][i] + sy * [.5, .85, 1.25][i], W * 1.3, H * .95));
    const hint = worksClamp(H * .022, 13, 18), bob = reduced ? 0 : Math.sin(t * 2.4) * 4; g.globalAlpha = k * k * worksClamp(t - 1, 0, 1);
    worksWords(COARSE ? 'Swipe up' : 'Scroll down', W / 2, H * .9 + bob * .3 + sy, hint, WORKS_CREAM, { spread: hint * .12 }); worksStar(W / 2, H * .9 + hint * 1.4 + bob + sy, hint * .5, WORKS_CREAM);
    g.globalAlpha = 1;
  },
  about(p, sy, k, now, t, since) {
    const a = works.about;
    g.globalAlpha = k;
    for (const b of works.bubbles) { // rising past
      const bx = works.tall ? W * (.76 + b.x * .2) : W * (.48 + b.x * .5) + (reduced ? 0 : Math.sin(t * b.rate + b.p) * 8), by = ((b.y * H * 1.2 - (reduced ? 0 : t * b.rate * H * .05)) % H + H) % H + sy;
      const page = by - sy, nearText = page > a.titleY - a.title && page < a.pillY + a.size * 2; if (nearText && (works.tall || bx < W * .93)) continue;
      g.fillStyle = 'rgba(190,240,255,.2)'; g.strokeStyle = 'rgba(210,246,255,.75)'; g.lineWidth = 1.4; g.beginPath(); g.arc(bx, by, b.r, 0, 7); g.fill(); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.arc(bx - b.r * .35, by - b.r * .35, b.r * .18, 0, 7); g.fill();
    }
    worksScript(WORKS_WORDS.aboutTitle, a.x + a.title * .05, a.titleY + sy, a.title, -.05, 'left');
    g.font = `600 ${a.size}px ${WORKS_BODY}`; g.textAlign = 'left'; g.textBaseline = 'middle';
    a.words.forEach((w, i) => {
      const e = reduced ? 1 : worksEase((since / 460) - i * .035), y = w.y + sy + (1 - e) * 22; if (e <= 0) return;
      g.globalAlpha = k * e;
      if (w.tone !== undefined) { g.fillStyle = [WORKS_CORAL, WORKS_TEAL, '#7fb0d0'][w.tone]; g.beginPath(); g.roundRect(w.x, y - a.size * .78, w.w, a.size * 1.56, a.size * .28); g.fill(); g.fillStyle = WORKS_NAVY; g.fillText(w.s, w.x + w.pad, y); }
      else { g.fillStyle = WORKS_CREAM; g.fillText(w.s, w.x, y); }
    });
    g.globalAlpha = k * (reduced ? 1 : worksEase((since - 500) / 400));
    worksPill(WORKS_WORDS.aboutMore, a.pillX, a.pillY + sy, works.pillSize, false, works.hover === WORKS_WORDS.aboutMore, k > .7 ? () => $('#about').showModal() : null);
    g.globalAlpha = 1;
  },
  portfolio(p, sy, k, now, t, since) {
    const o = works.portfolio, up = sy * .2;
    g.globalAlpha = k;
    worksWords(WORKS_WORDS.portfolioLabel, W / 2, H * .17 + sy + up, Math.max(13, o.size * .85), '#8fe6ff', { spread: o.size * .3 });
    worksScript(WORKS_WORDS.portfolioTitle, W / 2, H * .34 + sy, o.title);
    let y = H * .52 + sy; for (const line of o.lines) { worksWords(line, W / 2, y, o.size, WORKS_CREAM, { font: WORKS_BODY, weight: 600 }); y += o.size * 1.6; }
    g.font = `400 ${works.pillSize}px ${WORKS_LABEL}`; const widths = WORKS_WORDS.filters.map(f => g.measureText(f).width + works.pillSize * 3.2), space = works.pillSize * works.pillGap, total = widths.reduce((a, b) => a + b) + space * 2; let x = (W - total) / 2;
    const py = y + works.pillSize * 1.8;
    WORKS_WORDS.filters.forEach((f, i) => { worksPill(f, x + widths[i] / 2, py, works.pillSize, works.filter === f, works.hover === f, k > .7 ? () => worksSetFilter(f) : null); x += widths[i] + space; });
    g.globalAlpha = 1;
  },
  work(p, sy, k, now, t) {
    const it = p.it, { cardW, cardH, x } = it, top = it.y + sy, hov = works.hover === it.t, lean = (it.side ? 1 : -1) * (1 - k) * .05;
    it.lift = (it.lift || 0) + ((hov ? 1 : 0) - (it.lift || 0)) * .14;
    if (!it.bmp) { // a tall sheet that drifts up and down inside the frame
      const scale = Math.min(pr, 1.5), c = document.createElement('canvas'); c.width = Math.ceil(cardW * scale); c.height = Math.ceil(cardW * 1.75 * scale);
      const x2 = c.getContext('2d'); x2.scale(scale, scale); worksMock(x2, cardW, cardW * 1.75, it); it.bmp = c; it.bmpH = cardW * 1.75;
    }
    g.save(); g.globalAlpha = k;
    g.translate(x + cardW / 2, top + cardH / 2 - it.lift * 6); g.rotate(lean); const grow = 1 + it.lift * .018; g.scale(grow, grow); g.translate(-cardW / 2, -cardH / 2);
    for (const [more, a] of [[22, .07], [14, .1], [7, .13]]) { g.fillStyle = `rgba(5,12,30,${a * 1.6 * k})`; g.beginPath(); g.roundRect(-more, -more + 12, cardW + more * 2, cardH + more * 2, 18 + more); g.fill(); } // a soft shadow, without a blur on every frame
    g.fillStyle = '#0b1730'; g.beginPath(); g.roundRect(0, 0, cardW, cardH, 18); g.fill();
    g.save(); g.beginPath(); g.roundRect(0, 0, cardW, cardH, 18); g.clip();
    const pan = reduced ? 0 : (.5 - Math.cos(t * .22 + it.n) * .5) * (it.bmpH - cardH); g.drawImage(it.bmp, 0, -pan, cardW, it.bmpH);
    if (it.lift > .01) { const sweep = ((now - (it.hovAt || now)) / 900) % 1, band = cardW * (sweep * 1.8 - .4), l = g.createLinearGradient(band - 120, 0, band + 120, cardH * .3); l.addColorStop(0, 'rgba(255,240,200,0)'); l.addColorStop(.5, `rgba(255,240,200,${.28 * it.lift})`); l.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = l; g.fillRect(0, 0, cardW, cardH); }
    g.restore();
    g.strokeStyle = WORKS_CREAM; g.lineWidth = 2.5; g.beginPath(); g.roundRect(0, 0, cardW, cardH, 18); g.stroke();
    g.strokeStyle = 'rgba(244,236,216,.55)'; g.lineWidth = 1; g.beginPath(); g.roundRect(9, 9, cardW - 18, cardH - 18, 11); g.stroke();
    const twinkle = reduced ? 1 : 1 + Math.sin(now / 500 + it.n) * .12;
    for (const [a, b] of [[9, 9], [cardW - 9, 9], [9, cardH - 9], [cardW - 9, cardH - 9]]) worksStar(a, b, 12 * twinkle, WORKS_TEAL);
    g.restore();
    if (k > .7) works.hot.push({ x, y: top, w: cardW, h: cardH, act: () => worksOpenItem(it), label: it.t });
    // The name, on cream blocks that step down across the frame's edge.
    const size = works.tall ? worksClamp(W * .082, 24, 40) : worksClamp(Math.min(W * .042, H * .09), 22, 58), words = it.t.toUpperCase().split(' '), blockH = size * 1.5, right = !works.tall && !it.side, nameTop = works.tall ? top + cardH - blockH * .7 : top + cardH * .34;
    g.save(); g.globalAlpha = k; g.translate((1 - k) * (it.side ? -46 : 46), sy * .25);
    words.forEach((word, i) => {
      g.font = `400 ${size}px ${WORKS_LABEL}`; const w = g.measureText(word).width + size * .9, y = nameTop + i * (blockH + 5);
      const px = works.tall ? (i % 2 ? W - works.pad - w - 6 : works.pad + 6) : right ? x + cardW + size * 1.1 - w + (i ? size * .9 : 0) : x - size * 1.1 - (i ? size * .9 : 0);
      g.fillStyle = 'rgba(5,12,30,.45)'; g.beginPath(); g.roundRect(px + 3, y + 5, w, blockH, 10); g.fill();
      g.fillStyle = WORKS_CREAM; g.beginPath(); g.roundRect(px, y, w, blockH, 10); g.fill();
      worksWords(word, px + w / 2, y + blockH / 2 + size * .04, size, WORKS_NAVY);
      if (k > .7) works.hot.push({ x: px, y: y + sy * .25, w, h: blockH, act: () => worksOpenItem(it), label: it.t });
    });
    const tagY = nameTop + words.length * (blockH + 5) + size * .62, tagSize = worksClamp(W * .012, 11, 14);
    let tagX = works.tall ? W - works.pad - 8 : right ? x + cardW + size * .3 : x + 10;
    for (const tag of (right || works.tall ? [...it.tags].reverse() : it.tags)) {
      g.font = `400 ${tagSize}px ${WORKS_LABEL}`; const w = g.measureText(tag).width + tagSize * 2.2, at = right || works.tall ? tagX - w / 2 : tagX + w / 2, h = tagSize * 2.1, left = at - w / 2;
      g.fillStyle = WORKS_TEAL; g.beginPath(); g.roundRect(left, tagY - h / 2, w, h, h / 2); g.fill();
      worksWords(tag, at, tagY + tagSize * .04, tagSize, '#0b2e2a');
      tagX += (right || works.tall ? -1 : 1) * (w + 8);
    }
    g.restore();
  },
  talk(p, sy, k, now, t) {
    g.globalAlpha = k;
    works.clouds.slice(0, 2).forEach((c, i) => { g.save(); g.translate(-W * .15, H * (i ? .36 : .46) + sy * (i ? 1.1 : .7)); g.scale(1, -1); g.drawImage(c, 0, 0, W * 1.3, H * .95); g.restore(); });
    const size = Math.min(W * (works.tall ? .19 : .12), H * .2), cy = H * .36 + sy;
    worksWords(WORKS_WORDS.ask, W / 2, cy - size * .85, Math.max(13, Math.min(W * .032, H * .036)), WORKS_CREAM, { spread: 1.5 });
    worksScript(WORKS_WORDS.talk, W / 2, cy, size);
    worksPill('Contact', W / 2, cy + size * .95, worksClamp(W * .02, 14, 22), works.hover === 'Contact', works.hover === 'Contact', k > .7 ? () => $('#contact').showModal() : null);
    const foot = H * .7 + sy * 1.2; worksHill(foot, '#0b1730');
    const logo = worksClamp(Math.min(W * .06, H * .085), 26, 70), left = works.pad + 6, ly = H * .81 + sy * 1.2, small = worksClamp(H * .02, 12, 16);
    worksWords(WORKS_WORDS.name.toUpperCase(), left, ly, logo, WORKS_CORAL, { align: 'left' }); g.font = `400 ${logo}px ${WORKS_LABEL}`; worksStar(left + g.measureText(WORKS_WORDS.name.toUpperCase()).width + logo * .34, ly - logo * .1, logo * .3, WORKS_TEAL, .1);
    worksWords(WORKS_WORDS.email, left, ly + logo * .85, small * 1.1, WORKS_CREAM, { align: 'left', font: WORKS_BODY, weight: 600 });
    worksWords('All rights reserved © 2026', left, ly + logo * .85 + small * 1.7, small * .9, 'rgba(244,236,216,.72)', { align: 'left', spread: small * .08, font: WORKS_BODY, weight: 600 });
    g.globalAlpha = 1;
  },
};
function drawWorks(now) {
  if (works.key !== `${W}x${H}`) worksPrepare();
  const dt = Math.min(.05, (now - works.last) / 1000), goal = works.page * H + works.pull; works.last = now;
  works.y += (goal - works.y) * (reduced || works.pull ? 1 : 1 - Math.exp(-dt * 6.5));
  if (Math.abs(goal - works.y) < .4) works.y = goal;
  works.hot = [];
  const y = works.y, t = (now - works.at) / 1000, since = now - works.arrive;
  g.drawImage(works.sky, 0, 0, W, H);
  for (const m of works.motes) { const py = ((m.y * H - y * m.d) % H + H) % H, tw = reduced ? .8 : .55 + .45 * Math.sin(t * (1 + m.d * 3) + m.p); g.globalAlpha = tw * .9; worksStar(m.x * W, py, m.r + 1.5, m.gold ? WORKS_TEAL : WORKS_CREAM); } g.globalAlpha = 1;
  const waterY = H - y; // the second screen is where the water starts; it slides with the page
  if (waterY > -H * 2 && waterY < H) g.drawImage(works.water, 0, waterY, W, H * 1.97);
  works.pages.forEach((p, i) => {
    const sy = i * H - y; if (Math.abs(sy) >= H) return;
    if (p.it) { const was = p.it.wasHover; p.it.wasHover = works.hover === p.it.t; if (p.it.wasHover && !was) p.it.hovAt = now; }
    WORKS_DRAW[p.kind](p, sy, worksEase(1 - Math.abs(sy) / H), now, t, i === works.page ? since : 0);
  });
  // Where you are: a dot for each screen. Tap one to go there.
  const n = works.pages.length, step = Math.min(20, H * .6 / n), rx = W - Math.max(13, W * .028), top = H / 2 - step * (n - 1) / 2;
  for (let i = 0; i < n; i++) {
    const dy = top + i * step, on = i === works.page;
    if (on) worksStar(rx, dy, 8, WORKS_CORAL, .12); else { g.fillStyle = 'rgba(244,236,216,.45)'; g.beginPath(); g.arc(rx, dy, 2.6, 0, 7); g.fill(); }
    works.hot.push({ x: rx - 15, y: dy - step / 2, w: 30, h: step, act: () => worksGo(i), label: `dot${i}` });
  }
  // Coming through the door: the dark it left on eases away.
  works.flash = Math.max(0, 1 - (now - works.at) / (reduced ? 1 : 900));
  if (works.flash > 0) { g.globalAlpha = worksEase(works.flash); g.fillStyle = WORKS_NAVY; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
}

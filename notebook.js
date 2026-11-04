/* Box 2's notebook: everything that isn't a project. Hoshi, a yellow Exotic Persian, rides through a pop-up book on lined paper.
   Every drawing is made here in code, and the photos are in photos/. The words are kept together below so they're easy to change. */
const BOOK_WORDS = {
  worlds: ['Home', 'Food', 'Up late', 'Places', 'My cats'],
  hello: ['i am Hoshi. this is the notebook. no projects allowed.', 'is it dinner yet?', 'one more episode. then bed.', 'i do not like water. we go anyway.', 'everyone here is nicer than me.'],
  welcome: ["Hi, it's me!", "Cyrill's notebook", 'p.s. Hoshi the cat is in charge'],
  about: ['About me', 'From San Miguel, Bulacan, now in Manila. Aspiring software and AI engineer.', 'No projects past this page.'],
  food: ['Things I eat', 'Forever meal: Katsu', 'Comfort food: French fries', 'Will never eat: Ginisang Ampalaya'],
  late: ['Up too late', 'On repeat: Mr. Incorrect', 'Favorite game: Black Myth: Wukong', 'Favorite show: Loki'],
  places: ['Places', 'Been to: Hong Kong, Baguio, La Union', 'Going next: Japan', 'Took my breath away: La Union', 'Most memories: Baguio'],
  people: ['My cats', 'The two cats who run the house.', 'Hoshi: orange, exotic, in charge.', 'Shiro: grey tabby, blue eyes.'],
  hi: ['Say hi!', 'cyrillgerardc@gmail.com', 'I reply faster than this cat.'],
};
// focus says where to look when a photo is cropped to fit: 0 is its top, 1 its bottom. No src leaves a sketch in the frame.
const BOOK_PHOTOS = [
  { id: 'photo-home', src: 'photos/orange.jpg', cap: 'Hoshi, on duty', tint: '#ffd9a0', focus: .35 },
  { id: 'photo-food', src: 'photos/coffee.jpg', cap: 'beach coffee', tint: '#a9dcf0', focus: .6 },
  { id: 'photo-late', src: 'photos/lanterns.jpg', cap: 'a late one', tint: '#3f4a8c', focus: .2 },
  { id: 'photo-falls', src: 'photos/waterfall.jpg', cap: 'somewhere green', tint: '#a5ddf2', focus: .5 },
  { id: 'photo-hk', src: 'photos/hongkong.jpg', cap: 'Hong Kong', tint: '#a5ddf2', focus: .7 },
  { id: 'photo-launion', src: 'photos/hut.jpg', cap: 'La Union', tint: '#a5ddf2', focus: .6 },
  { id: 'photo-baguio', src: 'photos/garden.jpg', cap: 'Baguio', tint: '#a5ddf2', focus: .6 },
  { id: 'photo-shiro-chin', src: 'photos/tabby-chin.jpg', cap: 'Shiro, chin scratch', tint: '#a9dcf0', focus: .2 },
  { id: 'photo-shiro-wide', src: 'photos/shiro-wide.jpg', cap: 'Shiro, surprised', tint: '#a9dcf0', focus: .4 },
  { id: 'photo-shiro-pat', src: 'photos/shiro-scratch.jpg', cap: 'Shiro, head pats', tint: '#a9dcf0', focus: .3 },
  { id: 'photo-shiro-up', src: 'photos/shiro-up.jpg', cap: 'Shiro, waiting', tint: '#a9dcf0', focus: .25 },
  { id: 'photo-hoshi', src: 'photos/orange-face.jpg', cap: 'Hoshi', tint: '#ffd9a0', focus: .4 },
  { id: 'photo-off', src: 'photos/hoshi-floor.jpg', cap: 'Hoshi, off duty', tint: '#ffd9a0', focus: .5 },
  { id: 'photo-me', src: 'photos/me-view.jpg', cap: 'the human', tint: '#c7e6b4', focus: .3 },
  { id: 'photo-view', src: 'photos/me-view.jpg', cap: 'up in the mountains', tint: '#a5ddf2', focus: .55 },
  { id: 'photo-shiro', src: 'photos/tabby-bow.jpg', cap: 'Shiro', tint: '#a9dcf0', focus: .25 },
];
const BOOK_SIZE = 80, BOOK_FLAT = 22, BOOK_LOOP = BOOK_SIZE * BOOK_WORDS.worlds.length, BOOK_FLIP_MS = reduced ? 1 : 850;
const BOOK_PX = COARSE ? .75 : 1.25, BOOK_FOV = 36, BOOK_CAT = 1.22;
const BOOK_INK = '#26252b', BOOK_FONT = 'Gaegu, "Comic Sans MS", cursive';
/* ---------- The land: never quite flat, and a different way across at every crossing ----------
   Home to Food: a steep hump. Food to Up late: a cliff climbed straight up. Up late to Places: a lip, a jump over a chasm, a landing at the sea.
   Places to My cats: a rope bridge over a river. My cats back to Home: one long ride down. Each world sits at its own height. */
const BOOK_BASE = [0, 0, 0, 0, 0], BOOK_GAP = [-2, -1], BOOK_BRIDGE = [-2, -1], BOOK_FADE_W = 16; // no chasm or bridge in this layout
const BOOK_PEAK = 6, BOOK_TOP = 2; // how high each crossing climbs, and half the width of the flat top the signpost stands on
const bookMod = x => ((x % BOOK_LOOP) + BOOK_LOOP) % BOOK_LOOP;
const bookStep = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
const bookBase = x => BOOK_BASE[Math.floor(bookMod(x) / BOOK_SIZE)];
function bookGround(x) { // the height of the paper ground: flat, then one straight slope up to a flat top where two worlds meet, then straight down
  const u = bookMod(x) % BOOK_SIZE, d = Math.min(u, BOOK_SIZE - u); // how far from the nearest top
  return d <= BOOK_TOP ? BOOK_PEAK : d >= BOOK_FLAT ? 0 : BOOK_PEAK * (BOOK_FLAT - d) / (BOOK_FLAT - BOOK_TOP);
}
const bookRide = bookGround;
// Each key: where in the loop, how far the view turns (degrees, + looks back left), how far it tips down, how far back it sits, how much higher it aims.
const BOOK_CAM = [0, 1, 2, 3, 4].flatMap(i => { const d = i % 2 ? -1 : 1, b = i * BOOK_SIZE; // per world: the top behind, the way down, the flat, the way up
  return [[b, 2 * d, 10, 1.42, 1.4], [b + 8, -4 * d, 15, 1.16, .2], [b + 19, -7 * d, 11, .9, -.3], [b + 30, -8 * d, 5, .96, 0], [b + 44, 3 * d, 6, 1, 0], [b + 57, -3 * d, 4, 1.02, 0], [b + 66, 4 * d, -3, 1.2, 1.3], [b + 75, 5 * d, 1, 1.38, 1.6]]; });
function bookCamAt(m) { // a smooth curve through the keys, round the loop
  const n = BOOK_CAM.length, k = BOOK_CAM, at = i => k[((i % n) + n) % n], span = i => { const a = at(i)[0], b = at(i + 1)[0]; return b > a ? b - a : b + BOOK_LOOP - a; };
  let i = n - 1; for (let j = 0; j < n; j++) if (m >= k[j][0] && (j === n - 1 || m < k[j + 1][0])) { i = j; break; }
  if (m < k[0][0]) i = n - 1;
  const t = (((m - k[i][0]) % BOOK_LOOP) + BOOK_LOOP) % BOOK_LOOP / span(i), p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
  const cr = c => .5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t * t + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t * t * t);
  return { yaw: cr(1) * Math.PI / 180, pitch: cr(2) * Math.PI / 180, dist: cr(3), lift: cr(4) };
}
const bookSlope = (x, f = bookRide) => (f(x + .05) - f(x - .05)) / .1;
const bookIn = (x, [a, b]) => { const m = bookMod(x); return m > a && m < b; };
// The look: thin ink lines, light shading and soft colour for everything but Hoshi and his wheels, who keep their crayon.
let bookCatStyle = false;
const BOOK_LINE = .55;
const bookSoft = c => { if (bookCatStyle || !/^#[0-9a-f]{6}$/i.test(c)) return c; const n = parseInt(c.slice(1), 16), mix = (v, p) => Math.round(v * .85 + p * .15); return `rgb(${mix(n >> 16, 251)},${mix(n >> 8 & 255, 246)},${mix(n & 255, 234)})`; };
// Things that are always a little alive, by name.
const BOOK_IDLE = { bush: { sway: .02, bend: true }, kite: { sway: .12 }, lantern: { sway: .07 }, bunting: { sway: .012 }, mushroom: { sway: .02 }, shell: { sway: .01 }, tree: { sway: .02 }, pine: { sway: .025 }, grass: { sway: .07, bend: true }, flower: { sway: .08, bend: true }, cloud: { slide: .6 }, star: { twinkle: true }, sun: { sway: .05 }, moon: { bob: .12 }, egg: { bob: .1 }, mailbox: { sway: .015 }, bowl: { bob: .04 }, boba: { sway: .03 }, owl: { sway: .04 }, gull: { sway: .12 }, tent: { sway: .008 }, lighthouse: { sway: .006 }, icecream: { sway: .03 } };
const BOOK_SKY = ['#ffffff', '#fff0dc', '#cfc8f2', '#e2f2ff', '#f6dbe6']; // the page's tint in each world, blended across the hills
let bookWorld = null, bookBuilder = null, bookBuilt = 0, bookRnd = Math.random;

/* ---------- A shaky hand: lines, pencil fill, marker outline ---------- */
function bookBox(pts) { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); return [Math.min(...xs) - 8, Math.min(...ys) - 8, Math.max(...xs) + 8, Math.max(...ys) + 8]; }
function bookCurve(pts, closed = true, shake = 1.2) { // smooth, through the midpoints
  const q = pts.map(([x, y]) => [x + (bookRnd() - .5) * shake * 2, y + (bookRnd() - .5) * shake * 2]), p = new Path2D(), mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  if (closed) { p.moveTo(...mid(q[q.length - 1], q[0])); q.forEach((a, i) => { const m = mid(a, q[(i + 1) % q.length]); p.quadraticCurveTo(a[0], a[1], m[0], m[1]); }); p.closePath(); }
  else { p.moveTo(...q[0]); for (let i = 1; i < q.length - 1; i++) { const m = mid(q[i], q[i + 1]); p.quadraticCurveTo(q[i][0], q[i][1], m[0], m[1]); } p.lineTo(...q[q.length - 1]); }
  p.box = bookBox(pts); return p;
}
function bookPoly(pts, closed = true, shake = 1.2) { // straight sides, slightly off
  const p = new Path2D(); pts.forEach(([x, y], i) => p[i ? 'lineTo' : 'moveTo'](x + (bookRnd() - .5) * shake * 2, y + (bookRnd() - .5) * shake * 2)); if (closed) p.closePath(); p.box = bookBox(pts); return p;
}
const bookOval = (cx, cy, rx, ry = rx, shake = 1.2, n = 16) => bookCurve(Array.from({ length: n }, (_, i) => [cx + Math.cos(i / n * 6.2832) * rx, cy + Math.sin(i / n * 6.2832) * ry]), true, shake);
const bookFluff = (cx, cy, rx, ry = rx, n = 26, tuft = .08) => bookCurve(Array.from({ length: n * 2 }, (_, i) => { const a = i / (n * 2) * 6.2832, k = i % 2 ? 1 + tuft : 1 - tuft * .3; return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]; }), true, .8);
function bookPencil(x, shape, color, angle = -.9) { // flat colour, then the strokes of a pencil over it
  x.save(); x.fillStyle = bookSoft(color); x.globalAlpha = .9; x.fill(shape); x.clip(shape); x.globalAlpha = 1;
  const [x0, y0, x1, y1] = shape.box, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, reach = Math.hypot(x1 - x0, y1 - y0) / 2 + 4, dx = Math.cos(angle), dy = Math.sin(angle);
  for (let d = -reach; d < reach; d += 4.5 + bookRnd() * 3) {
    const ox = cx - dy * d, oy = cy + dx * d;
    x.strokeStyle = bookRnd() < .5 ? `rgba(255,255,255,${bookCatStyle ? .2 : .1})` : `rgba(40,20,50,${bookCatStyle ? .08 : .04})`; x.lineWidth = 1.5 + bookRnd() * 2;
    x.beginPath(); x.moveTo(ox - dx * reach, oy - dy * reach); x.lineTo(ox + dx * reach, oy + dy * reach); x.stroke();
  }
  x.restore();
}
function bookInk(x, shape, width = 4.2, color = BOOK_INK) { width *= bookCatStyle ? 1 : BOOK_LINE; x.lineJoin = x.lineCap = 'round'; x.strokeStyle = color; x.lineWidth = width; x.stroke(shape); x.globalAlpha = .4; x.save(); x.translate(.9, -.7); x.lineWidth = width * .6; x.stroke(shape); x.restore(); x.globalAlpha = 1; }
const bookDraw = (x, shape, color, width = 4.2, angle) => { bookPencil(x, shape, color, angle); bookInk(x, shape, width); };
const bookLine = (x, pts, width = 3.4, color = BOOK_INK) => bookInk(x, bookCurve(pts, false, .7), width, color);
function bookWrite(x, text, px, py, size, color = '#34323a', { align = 'center', bold = false, width = 0, gap = 1.12 } = {}) { // returns where the next line goes
  x.font = `${bold ? 700 : 400} ${size}px ${BOOK_FONT}`; x.textAlign = align; x.textBaseline = 'middle'; x.fillStyle = color;
  const lines = []; let line = '';
  for (const word of String(text).split(' ')) { const next = line ? `${line} ${word}` : word; if (width && x.measureText(next).width > width && line) { lines.push(line); line = word; } else line = next; }
  lines.push(line);
  lines.forEach((l, i) => x.fillText(l, px, py + i * size * gap));
  return py + lines.length * size * gap;
}
function bookCrayon(x, text, px, py, size, colors) { // a title, each letter its own crayon
  x.font = `700 ${size}px ${BOOK_FONT}`; x.textBaseline = 'middle'; x.textAlign = 'left'; x.lineJoin = 'round';
  let left = px - x.measureText(text).width / 2;
  [...text].forEach((ch, i) => {
    x.save(); x.translate(left, py + (bookRnd() - .5) * size * .1); x.rotate((bookRnd() - .5) * .14);
    x.strokeStyle = BOOK_INK; x.lineWidth = size * .08; x.strokeText(ch, 0, 0); x.fillStyle = colors[i % colors.length]; x.fillText(ch, 0, 0); x.restore();
    left += x.measureText(ch).width;
  });
}

/* ---------- Sprites: drawn at 100 to a world unit, then cut out with scissors, leaving a paper edge ---------- */
function bookSprite(w, h, draw, { scale = BOOK_PX, edge = 5, grain = true } = {}) {
  const pad = edge + 2, cw = Math.ceil((w * 100 + pad * 2) * scale), ch = Math.ceil((h * 100 + pad * 2) * scale);
  const art = document.createElement('canvas'); art.width = cw; art.height = ch;
  const x = art.getContext('2d'); x.scale(scale, scale); x.translate(pad, pad); draw(x, w * 100, h * 100);
  let out = art;
  if (edge) {
    out = document.createElement('canvas'); out.width = cw; out.height = ch; const o = out.getContext('2d'), r = edge * scale;
    for (let i = 0; i < 14; i++) { const a = i / 14 * 6.2832; o.drawImage(art, Math.cos(a) * r, Math.sin(a) * r); }
    o.globalCompositeOperation = 'source-in'; o.fillStyle = '#fbf8ee'; o.fillRect(0, 0, cw, ch);
    o.globalCompositeOperation = 'source-over'; o.drawImage(art, 0, 0);
  }
  if (grain) {
    const o = out.getContext('2d'); o.globalCompositeOperation = 'source-atop';
    for (let i = 0; i < cw * ch / 900; i++) { o.fillStyle = bookRnd() < .5 ? 'rgba(255,255,255,.07)' : 'rgba(30,20,40,.05)'; o.fillRect(bookRnd() * cw, bookRnd() * ch, 1 + bookRnd() * 2, 1 + bookRnd() * 2); }
    o.globalCompositeOperation = 'source-over';
  }
  const tex = new THREE.CanvasTexture(out); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4;
  const W2 = w + pad * 2 / 100, H2 = h + pad * 2 / 100;
  return { tex, w: W2, h: H2, canvas: out, mat: new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: .04, side: THREE.DoubleSide, toneMapped: false, depthWrite: false }) };
}

/* ---------- The cat: flat face, round head, tiny low ears, huge amber eyes, and a permanent mild objection ---------- */
const CAT = { fur: '#f6c531', shade: '#e0a11f', cream: '#fff1c7' };
function bookCat(x, cx, cy, s, { body = true, lean = 0 } = {}) {
  if (body) {
    const bx = cx - s * .35 - lean, by = cy + s * 1.28;
    const tail = bookCurve([[bx - s * .75, by + s * .75], [bx - s * 1.3, by + s * .55], [bx - s * 1.55, by - s * .05], [bx - s * 1.35, by - s * .55], [bx - s * 1.05, by - s * .3], [bx - s * 1.15, by + s * .15], [bx - s * .7, by + s * .25]]);
    bookDraw(x, tail, CAT.shade);
    for (const k of [.1, .4, .7]) bookLine(x, [[bx - s * (1.05 + k * .35), by + s * (.4 - k)], [bx - s * (1.3 + k * .3), by + s * (.3 - k)]], 2.2, '#b47a12');
    bookDraw(x, bookFluff(bx, by, s * 1.02, s * .98), CAT.fur);
    for (const k of [-.5, 0, .5]) bookLine(x, [[bx - s * .85, by + k * s * .9], [bx - s * .45, by + k * s * .75]], 2.4, '#c98d16');
    bookDraw(x, bookFluff(cx + s * .1 - lean * .4, by - s * .22, s * .56, s * .62, 13, .12), CAT.cream, 2.4);
    bookDraw(x, bookOval(cx + s * .15, by + s * .86, s * .3, s * .17), CAT.fur);
    bookDraw(x, bookOval(cx + s * .78, by + s * .86, s * .3, s * .17), CAT.fur);
  }
  for (const k of [-1, 1]) { // ears: small, and set wide and low
    bookDraw(x, bookCurve([[cx + k * s * .5, cy - s * .78], [cx + k * s * .78, cy - s * 1.2], [cx + k * s * 1.05, cy - s * .45]], true, .5), CAT.fur);
    bookPencil(x, bookCurve([[cx + k * s * .62, cy - s * .78], [cx + k * s * .78, cy - s * 1.04], [cx + k * s * .92, cy - s * .58]], true, .4), '#f3a4a0');
  }
  bookDraw(x, bookFluff(cx, cy, s * 1.16, s * 1.02, 30, .06), CAT.fur, 4.2, -.4);
  for (const k of [-.26, 0, .26]) bookLine(x, [[cx + k * s, cy - s * .9], [cx + k * s * .8, cy - s * .56]], 3, '#c98d16'); // the tabby M
  bookPencil(x, bookFluff(cx, cy + s * .42, s * .66, s * .44, 14, .06), CAT.cream);
  for (const k of [-1, 1]) {
    const ex = cx + k * s * .47, ey = cy - s * .06, r = s * .335;
    bookDraw(x, bookOval(ex, ey, r), '#e4851b', 3.6, .4);
    x.fillStyle = '#1c1720'; x.beginPath(); x.arc(ex + s * .02, ey + s * .02, r * .62, 0, 7); x.fill();
    x.fillStyle = '#fff'; x.beginPath(); x.arc(ex - r * .26, ey - r * .3, r * .22, 0, 7); x.fill(); x.beginPath(); x.arc(ex + r * .3, ey + r * .28, r * .1, 0, 7); x.fill();
    bookLine(x, [[ex - r * 1.05, ey - r * (k > 0 ? .78 : .98)], [ex, ey - r * 1.12], [ex + r * 1.05, ey - r * (k > 0 ? .98 : .78)]], 4.4); // the lid, which is why it looks unimpressed
    bookLine(x, [[cx + k * s * .13, cy + s * .1], [cx + k * s * .19, cy + s * .36]], 2.4, '#a8701a'); // tear lines, from that flat face
    for (const w of [-.08, .06, .2]) bookLine(x, [[cx + k * s * .55, cy + s * (.42 + w * .4)], [cx + k * s * 1.34, cy + s * (.36 + w * 1.1)]], 1.6);
  }
  bookDraw(x, bookCurve([[cx - s * .11, cy + s * .14], [cx + s * .11, cy + s * .14], [cx, cy + s * .27]], true, .3), '#e77f85', 2.4);
  bookLine(x, [[cx, cy + s * .27], [cx, cy + s * .37]], 2.4);
  bookLine(x, [[cx - s * .25, cy + s * .44], [cx - s * .12, cy + s * .35], [cx, cy + s * .37], [cx + s * .12, cy + s * .35], [cx + s * .25, cy + s * .44]], 2.8);
}
function bookPaperBoat(x, w, y) {
  bookDraw(x, bookPoly([[w * .04, y], [w * .96, y], [w * .78, y + 105], [w * .22, y + 105]]), '#f4efe0', 4.4, 1.3);
  bookDraw(x, bookPoly([[w * .3, y], [w * .5, y - 74], [w * .7, y]]), '#e3ddcc', 3.6);
  for (let i = 0; i < 4; i++) bookLine(x, [[w * .16 + i * 8, y + 26 + i * 18], [w * .84 - i * 8, y + 26 + i * 18]], 1.6, '#8aa6cc');
  bookLine(x, [[w * .5, y], [w * .5, y + 105]], 2.4, '#8d8778');
}
const BOOK_COSTUMES = [
  (x, w) => { bikeFrame(x); bookCat(x, 232, 112, 68, { lean: 10 }); bookDraw(x, bookOval(305, 205, 18, 12), CAT.fur); },
  (x, w) => {
    bikeFrame(x); bookCat(x, 232, 112, 68, { lean: 10 }); bookDraw(x, bookOval(305, 205, 18, 12), CAT.fur);
    bookDraw(x, bookCurve([[172, 56], [158, 20], [188, 2], [232, -16], [276, 2], [306, 20], [292, 56]]), '#fffaf0', 3.8); bookDraw(x, bookPoly([[172, 54], [292, 54], [288, 74], [176, 74]]), '#f4efe2', 3.4);
    bookDraw(x, bookCurve([[342, 172], [382, 128], [398, 138], [360, 186]]), '#d8a25a'); // a baguette in the basket
  },
  (x, w) => {
    bookDraw(x, bookCurve([[34, 346], [64, 362], [390, 362], [420, 342], [424, 354], [392, 378], [62, 378], [30, 358]]), '#e4584f', 4.4, .2);
    bookCat(x, 232, 132, 68);
    bookInk(x, bookCurve([[150, 124], [162, 42], [232, 24], [302, 42], [314, 124]], false), 8, '#d94d55');
    for (const k of [-1, 1]) bookDraw(x, bookOval(232 + k * 86, 126, 19, 33), '#3d3c8f');
  },
  (x, w) => {
    bookCat(x, 225, 118, 66);
    bookDraw(x, bookCurve([[154, 62], [170, 22], [225, 10], [280, 22], [296, 62]]), '#fffdf6', 3.6); bookDraw(x, bookPoly([[146, 60], [304, 60], [300, 78], [150, 78]]), '#3f76c8', 3.4);
    bookPaperBoat(x, w, 274);
  },
  (x, w) => {
    x.fillStyle = '#c99758'; x.fillRect(216, 300, 12, 118); bookInk(x, bookPoly([[216, 300], [228, 300], [228, 418], [216, 418]]), 2.6);
    bookDraw(x, bookCurve([[64, 134], [134, 108], [156, 200], [116, 288], [58, 280]]), '#5f8f4e');
    bookLine(x, [[92, 160], [108, 262]], 3);
    bookCat(x, 232, 112, 68, { lean: 6 });
    bookLine(x, [[300, 228], [346, 150], [372, 104]], 4.6, '#7c5230'); bookDraw(x, bookOval(382, 88, 25, 21), '#fff7e6', 3.6);
  },
];
function bikeFrame(x) {
  const c = '#3d78c9';
  for (const seg of [[[116, 342], [212, 342]], [[116, 342], [196, 238]], [[212, 342], [186, 226]], [[212, 342], [316, 244]], [[196, 240], [316, 226]], [[316, 214], [352, 342]]]) { bookLine(x, seg, 8, BOOK_INK); bookLine(x, seg, 4.4, c); }
  bookDraw(x, bookOval(212, 342, 15), '#d8d3c6', 3);
  bookLine(x, [[318, 216], [328, 180], [362, 174]], 5);
  bookDraw(x, bookPoly([[338, 172], [410, 170], [400, 222], [348, 222]]), '#caa16a', 3.6);
  for (const k of [356, 372, 388]) bookLine(x, [[k, 174], [k - 2, 220]], 1.6, '#7c5a30');
}

/* ---------- Things to find on the way. Each takes the context and its size in drawing units ---------- */
const bookArt = {
  cloud(x, w, h) { bookDraw(x, bookCurve([[w * .14, h * .86], [w * .02, h * .55], [w * .22, h * .34], [w * .34, h * .08], [w * .58, h * .16], [w * .78, h * .1], [w * .9, h * .4], [w * 1.02, h * .66], [w * .84, h * .88]]), '#fbfbfb', 3.6, 1.2); for (const k of [.4, .62]) { x.fillStyle = BOOK_INK; x.beginPath(); x.arc(w * k, h * .48, 4.6, 0, 7); x.fill(); } bookLine(x, [[w * .45, h * .6], [w * .51, h * .68], [w * .58, h * .6]], 3); },
  hills(x, w, h) { bookDraw(x, bookCurve([[-40, h], [-40, h * .6], [w * .14, h * .22], [w * .3, h * .6], [w * .48, h * .3], [w * .66, h * .58], [w * .84, h * .2], [w + 40, h * .55], [w + 40, h]], true, 3), '#b4d9a4', 3.6, -1.1); },
  house(x, w, h) {
    const t = h * .46;
    bookDraw(x, bookPoly([[w * .72, h * .02], [w * .84, h * .02], [w * .84, t * .7], [w * .72, t * .5]]), '#c56a58');
    bookDraw(x, bookPoly([[w * .1, t], [w * .9, t], [w * .9, h], [w * .1, h]], true, 1.6), '#fdf2d6', 4.6, -1.4);
    for (let y = t + 26; y < h; y += 42) bookLine(x, [[w * .1, y], [w * .9, y + 1]], 1.2, '#d6c295');
    bookDraw(x, bookPoly([[-6, t + 8], [w * .5, 6], [w + 6, t + 8]], true, 1.8), '#e05b4c', 4.8, .9);
    for (let r = 1; r < 5; r++) { const y = t * (.2 + r * .18), half = (y / t) * w * .5; for (let a = -half; a < half; a += 42) bookLine(x, [[w * .5 + a, y], [w * .5 + a + 20, y + 12], [w * .5 + a + 40, y]], 1.8, '#a93a30'); }
    bookDraw(x, bookCurve([[w * .4, h], [w * .4, h * .68], [w * .5, h * .58], [w * .6, h * .68], [w * .6, h]]), '#3f76c8'); x.fillStyle = '#f6c531'; x.beginPath(); x.arc(w * .56, h * .82, 5, 0, 7); x.fill();
    for (const k of [.19, .71]) { bookDraw(x, bookPoly([[w * k, h * .6], [w * (k + .13), h * .6], [w * (k + .13), h * .78], [w * k, h * .78]]), '#a9dcf0'); bookLine(x, [[w * (k + .065), h * .6], [w * (k + .065), h * .78]], 2.2); bookLine(x, [[w * k, h * .69], [w * (k + .13), h * .69]], 2.2); bookDraw(x, bookPoly([[w * (k - .012), h * .78], [w * (k + .142), h * .78], [w * (k + .13), h * .82], [w * k, h * .82]]), '#7a9e50', 3); for (let i = 0; i < 4; i++) { x.fillStyle = ['#f16a7c', '#ffd24c'][i % 2]; x.beginPath(); x.arc(w * (k + .02 + i * .03), h * .77, 5, 0, 7); x.fill(); } }
    bookDraw(x, bookOval(w * .5, h * .35, 22), '#a9dcf0', 3.4); // an attic window, and a yellow someone watching from it
    bookDraw(x, bookOval(w * .5, h * .37, 11, 9, .5), CAT.fur, 2.2);
  },
  tree(x, w, h) {
    bookDraw(x, bookPoly([[w * .42, h * .5], [w * .58, h * .5], [w * .66, h], [w * .34, h]], true, 2), '#a2703f', 4.4, 1.4);
    for (const [a, b, r] of [[.5, .3, .32], [.24, .42, .22], [.76, .42, .22], [.32, .17, .2], [.68, .17, .2]]) bookDraw(x, bookFluff(w * a, h * b, w * r, h * r * .72, 13, .1), a === .5 ? '#6db55a' : '#7cc266', 4);
    for (const [a, b] of [[.3, .36], [.55, .22], [.72, .42], [.46, .46], [.2, .47]]) bookDraw(x, bookOval(w * a, h * b, 11), '#e8524a', 2.6);
  },
  mailbox(x, w, h) { x.fillStyle = '#9b6c3c'; x.fillRect(w * .42, h * .36, w * .16, h * .64); bookInk(x, bookPoly([[w * .42, h * .36], [w * .58, h * .36], [w * .58, h], [w * .42, h]]), 3); bookDraw(x, bookCurve([[w * .02, h * .4], [w * .02, h * .14], [w * .14, h * .02], [w * .86, h * .02], [w * .98, h * .14], [w * .98, h * .4]]), '#e3584f'); bookDraw(x, bookPoly([[w * .86, h * .1], [w * .86, -6], [w, -6], [w, h * .04], [w * .92, h * .1]]), '#ffd24c', 2.6); bookWrite(x, 'CYRILL', w * .46, h * .22, h * .13, '#fff', { bold: true }); },
  grass(x, w, h) { bookDraw(x, bookCurve([[w * .08, h], [w * .02, h * .44], [w * .3, h * .7], [w * .34, h * .1], [w * .54, h * .62], [w * .78, h * .04], [w * .76, h * .64], [w, h * .38], [w * .9, h]], true, 1), '#5eb25a', 3.4); },
  flower(x, w, h) { bookLine(x, [[w * .5, h], [w * .48, h * .4]], 4, '#4d9a4c'); bookDraw(x, bookOval(w * .3, h * .72, w * .18, h * .06), '#6cbd5f', 2.4); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.2832; bookDraw(x, bookOval(w * .5 + Math.cos(a) * w * .26, h * .28 + Math.sin(a) * w * .26, w * .17), '#f58ca3', 2.4); } bookDraw(x, bookOval(w * .5, h * .28, w * .15), '#ffd24c', 2.4); },
  stall(x, w, h) {
    for (const k of [.05, .91]) bookDraw(x, bookPoly([[w * k, h * .3], [w * (k + .04), h * .3], [w * (k + .04), h], [w * k, h]]), '#a2703f', 3.4);
    bookDraw(x, bookPoly([[w * .02, h * .62], [w * .98, h * .62], [w * .98, h], [w * .02, h]], true, 1.6), '#e8b26b', 4.6, 1.4);
    for (let i = 0; i < 4; i++) { const a = .08 + i * .22; bookDraw(x, bookPoly([[w * a, h * .7], [w * (a + .18), h * .7], [w * (a + .18), h * .94], [w * a, h * .94]]), '#c98b4a', 3); for (let k = 0; k < 7; k++) { x.fillStyle = ['#e8524a', '#ffb13d', '#7cc266', '#f58ca3'][i]; x.beginPath(); x.arc(w * (a + .025 + k * .022), h * (.67 + (k % 2) * .025), 15, 0, 7); x.fill(); x.strokeStyle = BOOK_INK; x.lineWidth = 2.4; x.stroke(); } }
    const n = 8; for (let i = 0; i < n; i++) { const a = i / n, b = a + 1 / n; bookDraw(x, bookPoly([[w * a, h * .03], [w * b, h * .03], [w * b, h * .28], [w * (b - .0625), h * .36], [w * a, h * .28]], true, .8), i % 2 ? '#fff8ea' : '#e0554f', 3.6); }
    bookCrayon(x, 'EAT', w * .5, h * .48, h * .17, ['#e0554f', '#3f76c8', '#f2a91c']);
  },
  bowl(x, w, h) {
    for (const k of [.34, .5, .66]) bookLine(x, [[w * k, h * .42], [w * (k - .05), h * .3], [w * (k + .04), h * .2], [w * (k - .03), h * .08], [w * (k + .02), 0]], 3.4, '#9fa7ba');
    bookLine(x, [[w * .62, h * .54], [w * 1.0, h * .08]], 6.5, '#a2703f'); bookLine(x, [[w * .7, h * .56], [w * 1.04, h * .14]], 6.5, '#a2703f');
    bookDraw(x, bookOval(w * .5, h * .55, w * .46, h * .12), '#f3d27a');
    for (let i = 0; i < 9; i++) { const a = .12 + i * .09; bookLine(x, [[w * a, h * .58], [w * (a + .04), h * .46], [w * (a + .09), h * .58], [w * (a + .13), h * .49]], 3, '#d39b26'); }
    bookDraw(x, bookOval(w * .34, h * .5, w * .1, h * .06), '#fffdf4', 2.8); bookDraw(x, bookOval(w * .34, h * .5, w * .04, h * .03), '#f5a524', 2);
    bookDraw(x, bookPoly([[w * .54, h * .5], [w * .72, h * .46], [w * .76, h * .55], [w * .56, h * .59]]), '#e78a7b', 2.8);
    bookDraw(x, bookCurve([[w * .02, h * .57], [w * .98, h * .57], [w * .9, h * .8], [w * .68, h * .94], [w * .68, h], [w * .32, h], [w * .32, h * .94], [w * .1, h * .8]]), '#e0554f', 4.8, 1.1);
    for (let i = 0; i < 5; i++) bookLine(x, [[w * (.18 + i * .16), h * .68], [w * (.24 + i * .16), h * .74], [w * (.3 + i * .16), h * .68]], 3, '#fff3d8');
  },
  egg(x, w, h) {
    bookDraw(x, bookCurve([[w * .1, h * .3], [w * .34, h * .03], [w * .7, h * .06], [w * .98, h * .36], [w * .9, h * .78], [w * .56, h * .98], [w * .2, h * .84], [w * .02, h * .6]], true, 2), '#fffdf6', 4);
    bookDraw(x, bookOval(w * .5, h * .5, w * .25), '#ffc42e', 3.6);
    x.fillStyle = BOOK_INK; for (const k of [.42, .58]) { x.beginPath(); x.arc(w * k, h * .46, 5, 0, 7); x.fill(); }
    bookLine(x, [[w * .44, h * .57], [w * .5, h * .62], [w * .56, h * .57]], 3);
  },
  boba(x, w, h) {
    bookLine(x, [[w * .6, h * .22], [w * .72, -2]], 7, '#f16a7c');
    bookDraw(x, bookPoly([[w * .1, h * .2], [w * .9, h * .2], [w * .76, h], [w * .24, h]]), '#e9c8a0', 4.4, 1.2);
    bookDraw(x, bookCurve([[w * .08, h * .22], [w * .3, h * .1], [w * .7, h * .1], [w * .92, h * .22]]), '#fffdf4', 3.2);
    for (let i = 0; i < 11; i++) { x.fillStyle = '#2e2531'; x.beginPath(); x.arc(w * (.3 + (i % 4) * .13), h * (.82 + (i % 3) * .05 - (i > 7 ? .09 : 0)), 8, 0, 7); x.fill(); }
  },
  dumplings(x, w, h) { bookDraw(x, bookOval(w * .5, h * .78, w * .49, h * .2), '#7fb7da', 4.2); for (const [a, b] of [[.26, .56], [.5, .46], [.74, .56]]) { bookDraw(x, bookCurve([[w * (a - .17), h * (b + .12)], [w * (a - .13), h * (b - .1)], [w * a, h * (b - .24)], [w * (a + .13), h * (b - .1)], [w * (a + .17), h * (b + .12)]]), '#fff6e0', 3.4); for (const k of [-.06, 0, .06]) bookLine(x, [[w * (a + k), h * (b - .18)], [w * (a + k * 1.1), h * (b - .06)]], 2, '#a8946a'); } },
  icecream(x, w, h) { bookDraw(x, bookPoly([[w * .18, h * .42], [w * .82, h * .42], [w * .5, h]]), '#e3aa62', 4.2, 1); for (const k of [.3, .5, .7]) bookLine(x, [[w * k, h * .44], [w * .5 + (k - .5) * .2, h * .9]], 1.8, '#a96f2e'); bookDraw(x, bookFluff(w * .5, h * .32, w * .42, h * .17, 9, .08), '#ffc0cf', 3.8); bookDraw(x, bookFluff(w * .5, h * .17, w * .3, h * .13, 8, .08), '#fff2d0', 3.4); bookDraw(x, bookOval(w * .5, h * .05, w * .1), '#d92e3c', 2.6); },
  lights(x, w, h) { const pts = Array.from({ length: 13 }, (_, i) => [w * i / 12, h * (.08 + Math.sin(i / 12 * 3.1416) * .4)]); bookLine(x, pts, 3); pts.slice(1, -1).forEach(([a, b], i) => bookDraw(x, bookOval(a, b + 18, 11, 15), ['#ffd24c', '#f16a7c', '#79c2e8', '#7cc266'][i % 4], 2.6)); },
  night(x, w, h) {
    const pts = []; for (let i = 0; i <= 40; i++) pts.push([w * i / 40, (i % 2 ? 0 : 9) + bookRnd() * 8]); for (let i = 0; i <= 12; i++) pts.push([w + (i % 2 ? 5 : -5), h * i / 12]); pts.push([-5, h]); for (let i = 12; i >= 0; i--) pts.push([(i % 2 ? 5 : -5), h * i / 12]);
    bookPencil(x, bookPoly(pts, true, .6), '#26305f', -.7);
    x.save(); for (let i = 0; i < 90; i++) { x.fillStyle = `rgba(255,248,210,${.3 + bookRnd() * .7})`; x.beginPath(); x.arc(bookRnd() * w, bookRnd() * h * .86, 1.2 + bookRnd() * 2.6, 0, 7); x.fill(); } x.restore();
    let left = -10; while (left < w) { const bw = 70 + bookRnd() * 150, top = h - 90 - bookRnd() * 240; x.fillStyle = '#1a2049'; x.fillRect(left, top, bw, h - top); for (let wy = top + 16; wy < h - 12; wy += 26) for (let wx = left + 12; wx < left + bw - 14; wx += 24) if (bookRnd() < .35) { x.fillStyle = '#ffd86b'; x.fillRect(wx, wy, 9, 12); } left += bw + 4; }
  },
  moon(x, w, h) { bookDraw(x, bookOval(w * .5, h * .5, w * .47), '#fbeaa6', 4.2); for (const [a, b, r] of [[.72, .26, .07], [.74, .66, .05], [.34, .78, .06]]) bookDraw(x, bookOval(w * a, h * b, w * r), '#eacd76', 2.2); for (const k of [.34, .56]) bookLine(x, [[w * (k - .07), h * .42], [w * k, h * .47], [w * (k + .07), h * .42]], 3.4); bookLine(x, [[w * .4, h * .62], [w * .46, h * .67], [w * .52, h * .62]], 3); },
  star(x, w, h) { const pts = []; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.2832 - 1.57, r = i % 2 ? .22 : .5; pts.push([w * (.5 + Math.cos(a) * r), h * (.5 + Math.sin(a) * r)]); } bookDraw(x, bookPoly(pts, true, .8), '#ffd24c', 3.4); },
  desk(x, w, h) {
    bookDraw(x, bookPoly([[w * .3, h * .03], [w * .72, h * .03], [w * .72, h * .4], [w * .3, h * .4]]), '#35375e', 4.4); bookDraw(x, bookPoly([[w * .33, h * .07], [w * .69, h * .07], [w * .69, h * .36], [w * .33, h * .36]]), '#8fe0e8', 2.8);
    bookWrite(x, 'zzz...', w * .51, h * .22, h * .1, '#30506a', { bold: true });
    bookDraw(x, bookPoly([[w * .47, h * .4], [w * .55, h * .4], [w * .57, h * .5], [w * .45, h * .5]]), '#55567f', 3);
    bookDraw(x, bookPoly([[w * .02, h * .5], [w * .98, h * .5], [w * .98, h * .58], [w * .02, h * .58]]), '#b4794a', 4.2, 0);
    for (const k of [.06, .88]) bookDraw(x, bookPoly([[w * k, h * .58], [w * (k + .06), h * .58], [w * (k + .06), h], [w * k, h]]), '#94603a', 3.4);
    bookLine(x, [[w * .14, h * .49], [w * .12, h * .24], [w * .21, h * .12]], 6, '#3d3c8f'); bookDraw(x, bookPoly([[w * .17, h * .05], [w * .28, h * .1], [w * .27, h * .24], [w * .15, h * .17]]), '#f4b02a');
    bookDraw(x, bookPoly([[w * .77, h * .3], [w * .9, h * .3], [w * .9, h * .5], [w * .77, h * .5]]), '#e8e2d2', 3.2); bookLine(x, [[w * .79, h * .38], [w * .88, h * .38]], 2);
  },
  guitar(x, w, h) {
    bookDraw(x, bookPoly([[w * .42, h * .1], [w * .58, h * .1], [w * .58, h * .56], [w * .42, h * .56]]), '#7c5230', 3.6); bookDraw(x, bookPoly([[w * .36, 0], [w * .64, 0], [w * .6, h * .1], [w * .4, h * .1]]), '#2f2a35', 3.2);
    bookDraw(x, bookCurve([[w * .24, h * .5], [w * .5, h * .46], [w * .76, h * .5], [w * .72, h * .62], [w * .98, h * .72], [w * .92, h * .93], [w * .5, h], [w * .08, h * .93], [w * .02, h * .72], [w * .28, h * .62]]), '#e0883a', 4.6, 1);
    bookDraw(x, bookOval(w * .5, h * .7, w * .13), '#2f2a35', 2.8); for (const k of [.46, .5, .54]) bookLine(x, [[w * k, h * .08], [w * k, h * .84]], 1.2, '#f3ecd8');
  },
  record(x, w, h) { bookDraw(x, bookPoly([[0, h * .06], [w, h * .06], [w, h], [0, h]]), '#e65b7a', 4.4); bookDraw(x, bookOval(w * .5, h * .5, w * .4), '#25242c', 3.4); for (const r of [.3, .22]) bookInk(x, bookOval(w * .5, h * .5, w * r), 1.4, '#55535f'); bookDraw(x, bookOval(w * .5, h * .5, w * .12), '#ffd24c', 2.6); },
  controller(x, w, h) { bookDraw(x, bookCurve([[w * .16, h * .16], [w * .5, h * .08], [w * .84, h * .16], [w, h * .68], [w * .9, h * .96], [w * .7, h * .66], [w * .3, h * .66], [w * .1, h * .96], [0, h * .68]]), '#6c6bc4', 4.4); x.fillStyle = BOOK_INK; x.fillRect(w * .18, h * .3, w * .16, h * .1); x.fillRect(w * .22, h * .2, w * .08, h * .3); for (const [a, b, c] of [[.68, .24, '#f16a7c'], [.78, .36, '#ffd24c']]) bookDraw(x, bookOval(w * a, h * b, w * .05), c, 2); },
  cassette(x, w, h) { bookDraw(x, bookPoly([[0, 0], [w, 0], [w, h], [0, h]]), '#f19a4a', 4.2); bookDraw(x, bookPoly([[w * .1, h * .12], [w * .9, h * .12], [w * .9, h * .68], [w * .1, h * .68]]), '#fff6e0', 2.6); for (const k of [.32, .68]) bookDraw(x, bookOval(w * k, h * .42, h * .14), '#35343c', 2.2); bookWrite(x, 'mixtape', w * .5, h * .84, h * .15, '#34323a', { bold: true }); },
  lighthouse(x, w, h) {
    bookDraw(x, bookPoly([[w * .3, h * .17], [w * .7, h * .17], [w * .86, h], [w * .14, h]], true, 1.6), '#fff8ea', 4.6, 1.3);
    for (const [a, b] of [[.3, .45], [.6, .75]]) { const f = y => .3 - (y - .17) / .83 * .16, s = y => 1 - f(y) * 2; bookDraw(x, bookPoly([[w * f(a), h * a], [w * (f(a) + s(a)), h * a], [w * (f(b) + s(b)), h * b], [w * f(b), h * b]]), '#e0554f', 3.4); }
    bookDraw(x, bookPoly([[w * .34, h * .07], [w * .66, h * .07], [w * .66, h * .17], [w * .34, h * .17]]), '#ffe28a', 3.8); bookDraw(x, bookPoly([[w * .26, h * .08], [w * .5, 0], [w * .74, h * .08]]), '#3f76c8', 3.8); bookDraw(x, bookPoly([[w * .24, h * .165], [w * .76, h * .165], [w * .76, h * .185], [w * .24, h * .185]]), '#43424c', 2.8);
    bookDraw(x, bookCurve([[w * .4, h], [w * .4, h * .9], [w * .5, h * .86], [w * .6, h * .9], [w * .6, h]]), '#79573a', 3.2);
  },
  island(x, w, h) {
    bookDraw(x, bookCurve([[-4, h], [w * .1, h * .8], [w * .4, h * .66], [w * .74, h * .72], [w * .96, h * .84], [w + 4, h]], true, 1.6), '#f2d68a', 4.4);
    bookDraw(x, bookCurve([[w * .46, h * .78], [w * .46, h * .46], [w * .52, h * .22], [w * .57, h * .24], [w * .54, h * .5], [w * .56, h * .78]], true, 1), '#a2703f', 3.8);
    for (const [a, b] of [[-.9, 1], [-.3, 1.1], [.3, .95], [.9, 1], [1.8, .8], [2.6, .8]]) { const ex = w * .55 + Math.cos(a) * w * .34 * b, ey = h * .2 + Math.sin(a) * h * .18 * b + h * .06, cx = (w * .55 + ex) / 2, cy = h * .14; bookDraw(x, bookCurve([[w * .55, h * .2], [cx, cy - 14], [ex, ey], [cx, cy + 22]], true, 1), '#58ab55', 3.4); }
    for (const k of [.5, .58]) bookDraw(x, bookOval(w * k, h * .25, 13), '#7c5230', 2.6);
  },
  whale(x, w, h) {
    for (const k of [-1, 0, 1]) bookLine(x, [[w * .42, h * .3], [w * (.42 + k * .1), h * .08], [w * (.42 + k * .17), h * .1]], 4, '#68b6e8');
    bookDraw(x, bookCurve([[w * .02, h * .7], [w * .14, h * .38], [w * .44, h * .3], [w * .72, h * .46], [w * .86, h * .56], [w * 1, h * .32], [w * .96, h * .6], [w * .8, h * .82], [w * .44, h], [w * .14, h * .94]], true, 1.2), '#5d8fd8', 4.6, -.6);
    bookPencil(x, bookCurve([[w * .05, h * .76], [w * .3, h * .7], [w * .52, h * .76], [w * .42, h * .96], [w * .14, h * .92]], true, .8), '#dfeaf6');
    for (let i = 0; i < 5; i++) bookLine(x, [[w * (.12 + i * .07), h * .76], [w * (.15 + i * .07), h * .92]], 1.8, '#86a0c4');
    x.fillStyle = BOOK_INK; x.beginPath(); x.arc(w * .2, h * .58, 6, 0, 7); x.fill(); bookLine(x, [[w * .04, h * .7], [w * .24, h * .72], [w * .4, h * .68]], 2.8);
  },
  sun(x, w, h) { for (let i = 0; i < 12; i++) { const a = i / 12 * 6.2832; bookDraw(x, bookPoly([[w * .5 + Math.cos(a - .14) * w * .33, h * .5 + Math.sin(a - .14) * h * .33], [w * .5 + Math.cos(a) * w * .5, h * .5 + Math.sin(a) * h * .5], [w * .5 + Math.cos(a + .14) * w * .33, h * .5 + Math.sin(a + .14) * h * .33]], true, .8), '#f9b73a', 3); } bookDraw(x, bookOval(w * .5, h * .5, w * .33), '#ffd64c', 4); for (const k of [.36, .64]) bookDraw(x, bookOval(w * k, h * .47, w * .11, h * .08), '#26252b', 2.4); bookLine(x, [[w * .36, h * .45], [w * .64, h * .45]], 4); bookLine(x, [[w * .4, h * .63], [w * .5, h * .69], [w * .6, h * .63]], 3.4); },
  gull(x, w, h) { bookLine(x, [[0, h * .4], [w * .24, h * .06], [w * .5, h * .5], [w * .76, h * .06], [w, h * .4]], 5.4); },
  bottle(x, w, h) { bookDraw(x, bookCurve([[w * .36, 0], [w * .64, 0], [w * .64, h * .28], [w * .9, h * .44], [w * .9, h], [w * .1, h], [w * .1, h * .44], [w * .36, h * .28]], true, .6), '#a8e0cf', 3.8); bookDraw(x, bookPoly([[w * .34, -8], [w * .66, -8], [w * .64, h * .1], [w * .36, h * .1]]), '#a2703f', 2.8); bookDraw(x, bookPoly([[w * .28, h * .52], [w * .72, h * .48], [w * .74, h * .88], [w * .3, h * .9]]), '#fdf6e0', 2.4); for (const k of [.6, .7, .8]) bookLine(x, [[w * .35, h * k], [w * .66, h * k]], 1.4); },
  waves(x, w, h) { const pts = [[-8, h]]; for (let a = -8; a < w + 40; a += 58) { pts.push([a, h * .44]); pts.push([a + 28, h * .02]); pts.push([a + 46, h * .34]); } pts.push([w + 8, h]); bookPencil(x, bookCurve(pts, true, 1), '#74b4ea', -1.5); bookInk(x, bookCurve(pts.slice(1, -1), false, 1), 3.8, '#23538f'); },
  dusk(x, w, h) {
    const l = x.createLinearGradient(0, 0, 0, h); l.addColorStop(0, '#50468f'); l.addColorStop(.55, '#d9778a'); l.addColorStop(1, '#fbbf74');
    const pts = []; for (let i = 0; i <= 40; i++) pts.push([w * i / 40, (i % 2 ? 0 : 9) + bookRnd() * 8]); pts.push([w, h], [0, h]);
    const shape = bookPoly(pts, true, .6); x.fillStyle = l; x.fill(shape);
    for (let i = 0; i < 50; i++) { x.fillStyle = `rgba(255,248,220,${.3 + bookRnd() * .6})`; x.beginPath(); x.arc(bookRnd() * w, bookRnd() * h * .42, 1 + bookRnd() * 2.2, 0, 7); x.fill(); }
    for (const [c, top, seed] of [['#6a5a9e', .4, 90], ['#4b4380', .58, 60]]) { const m = [[-8, h]]; let k = 0; for (let a = -8; a < w + 200; a += seed + bookRnd() * 130) { m.push([a, h * (top + (k++ % 2 ? .26 : bookRnd() * .08))]); } m.push([w + 8, h]); bookPencil(x, bookPoly(m, true, 1.4), c, -1.2); }
  },
  pine(x, w, h) { bookDraw(x, bookPoly([[w * .42, h * .82], [w * .58, h * .82], [w * .58, h], [w * .42, h]]), '#7c5230', 3.4); for (const [t, b, r] of [[.42, .86, .5], [.2, .62, .4], [0, .38, .3]]) { const pts = [[w * .5, h * t]]; const n = 6; for (let i = 0; i <= n; i++) pts.push([w * (.5 + r - i / n * r * 2), h * (b + (i % 2 ? -.025 : 0))]); bookDraw(x, bookPoly([pts[0], ...pts.slice(1)], true, 1), '#3f8a60', 3.8, -1.2); } },
  tent(x, w, h) {
    bookDraw(x, bookPoly([[0, h], [w * .5, h * .04], [w, h]], true, 1.6), '#f08a3c', 4.8, 1);
    bookDraw(x, bookPoly([[w * .32, h], [w * .5, h * .34], [w * .68, h]]), '#3a2d4a', 3.8);
    bookDraw(x, bookPoly([[w * .5, h * .34], [w * .68, h], [w * .62, h], [w * .48, h * .5]], true, .8), '#f6c47e', 3);
    bookLine(x, [[w * .5, h * .04], [w * .5, -14]], 3.6); bookDraw(x, bookPoly([[w * .5, -14], [w * .66, -4], [w * .5, 4]]), '#e0554f', 2.8);
  },
  fire(x, w, h) {
    bookDraw(x, bookCurve([[w * .2, h * .84], [w * .1, h * .5], [w * .3, h * .3], [w * .42, h * .04], [w * .56, h * .3], [w * .72, h * .18], [w * .9, h * .52], [w * .8, h * .84]], true, 1.4), '#f5812f', 4);
    bookDraw(x, bookCurve([[w * .34, h * .84], [w * .3, h * .62], [w * .5, h * .36], [w * .68, h * .62], [w * .66, h * .84]], true, 1), '#ffd24c', 3);
    for (const [a, b] of [[.04, .96], [.96, .96]]) bookLine(x, [[w * a, h * .98], [w * (1 - a), h * .78]], 11, BOOK_INK), bookLine(x, [[w * a, h * .98], [w * (1 - a), h * .78]], 7, '#94603a');
  },
  owl(x, w, h) { bookDraw(x, bookCurve([[w * .16, h * .22], [w * .14, h * .02], [w * .36, h * .12], [w * .64, h * .12], [w * .86, h * .02], [w * .84, h * .22], [w * .96, h * .6], [w * .78, h], [w * .22, h], [w * .04, h * .6]]), '#a17748', 4.2); for (const k of [.33, .67]) { bookDraw(x, bookOval(w * k, h * .34, w * .17), '#fff6e0', 2.8); x.fillStyle = BOOK_INK; x.beginPath(); x.arc(w * k, h * .35, w * .07, 0, 7); x.fill(); } bookDraw(x, bookPoly([[w * .44, h * .42], [w * .56, h * .42], [w * .5, h * .54]], true, .4), '#f4b02a', 2.2); for (let i = 0; i < 6; i++) bookLine(x, [[w * (.3 + (i % 3) * .2), h * (.62 + (i > 2 ? .14 : 0))], [w * (.34 + (i % 3) * .2), h * (.67 + (i > 2 ? .14 : 0))], [w * (.38 + (i % 3) * .2), h * (.62 + (i > 2 ? .14 : 0))]], 2); },
  marshmallow(x, w, h) { bookLine(x, [[0, h * .94], [w * .8, h * .2]], 6, '#7c5230'); bookDraw(x, bookOval(w * .82, h * .16, w * .17, h * .15), '#fff4dd', 3.4); },
  shiro(x, w, h) { // Shiro, sitting up by the fire: a silver lynx-point tabby with tall ears and round blue eyes, lit from the fire on his right
    const cx = w * .5, cy = h * .3, s = w * .26, fur = '#bdbabb', dark = '#5f5c68', cream = '#efebe6';
    bookDraw(x, bookFluff(cx, h * .68, w * .3, h * .27, 22, .05), fur);
    for (const k of [-1, 1]) for (const t of [.6, .71, .82]) bookLine(x, [[cx + k * w * .29, h * t], [cx + k * w * .19, h * (t + .035)]], 2.4, dark); // stripes down his sides
    bookDraw(x, bookCurve([[cx - w * .15, h * .58], [cx + w * .15, h * .58], [cx + w * .16, h * .93], [cx - w * .16, h * .93]], true, .5), cream, 3.2); // chest and front legs
    bookLine(x, [[cx, h * .72], [cx, h * .93]], 2.4);
    for (const k of [-1, 1]) bookDraw(x, bookOval(cx + k * w * .085, h * .93, w * .085, h * .035), cream, 3);
    const tail = bookCurve([[w * .86, h * .72], [w * .93, h * .88], [w * .66, h * .995], [w * .26, h * .995], [w * .16, h * .95], [w * .26, h * .925], [w * .6, h * .945], [w * .78, h * .87], [w * .78, h * .74]]); // curled round his paws
    bookDraw(x, tail, fur, 3.6); for (const a of [.32, .46, .6, .74]) bookLine(x, [[w * a, h * (.935 + (a > .6 ? -.02 : 0))], [w * (a + .025), h * .99]], 2.4, dark);
    for (const k of [-1, 1]) { // ears: tall and pointed
      bookDraw(x, bookCurve([[cx + k * s * .22, cy - s * .78], [cx + k * s * .8, cy - s * 1.6], [cx + k * s * 1.02, cy - s * .42]], true, .5), fur);
      bookPencil(x, bookCurve([[cx + k * s * .4, cy - s * .8], [cx + k * s * .76, cy - s * 1.3], [cx + k * s * .88, cy - s * .6]], true, .4), '#f1b3b0');
    }
    bookDraw(x, bookFluff(cx, cy, s * 1.1, s * .96, 26, .05), fur);
    for (const k of [-.32, -.11, .11, .32]) bookLine(x, [[cx + k * s, cy - s * .9], [cx + k * s * .7, cy - s * .46]], 2.8, dark); // forehead stripes
    for (const k of [-1, 1]) for (const t of [0, .17]) bookLine(x, [[cx + k * s * .66, cy + s * (.14 + t)], [cx + k * s * 1.02, cy + s * (.05 + t)]], 2.2, dark); // cheek stripes
    bookPencil(x, bookFluff(cx, cy + s * .44, s * .48, s * .34, 12, .06), cream);
    for (const k of [-1, 1]) {
      const ex = cx + k * s * .43, ey = cy - s * .02, r = s * .28;
      bookDraw(x, bookOval(ex, ey, r, r * 1.04), '#8ec3ea', 3.6, .4);
      x.fillStyle = '#1c1720'; x.beginPath(); x.arc(ex, ey + r * .06, r * .52, 0, 7); x.fill();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(ex - r * .28, ey - r * .3, r * .22, 0, 7); x.fill(); x.beginPath(); x.arc(ex + r * .3, ey + r * .3, r * .1, 0, 7); x.fill();
      for (const t of [-.06, .08, .22]) bookLine(x, [[cx + k * s * .5, cy + s * (.44 + t * .4)], [cx + k * s * 1.3, cy + s * (.38 + t * 1.1)]], 1.6);
    }
    bookDraw(x, bookCurve([[cx - s * .12, cy + s * .2], [cx + s * .12, cy + s * .2], [cx, cy + s * .33]], true, .3), '#ef9ca6', 2.4);
    bookLine(x, [[cx, cy + s * .33], [cx, cy + s * .42]], 2.4);
    bookLine(x, [[cx - s * .22, cy + s * .48], [cx - s * .1, cy + s * .41], [cx, cy + s * .42], [cx + s * .1, cy + s * .41], [cx + s * .22, cy + s * .48]], 2.6);
    x.save(); x.globalCompositeOperation = 'source-atop'; // firelight
    const glow = x.createRadialGradient(w * 1.15, h * .78, 0, w * 1.15, h * .78, w * .95); glow.addColorStop(0, 'rgba(255,150,60,.38)'); glow.addColorStop(1, 'rgba(255,150,60,0)');
    x.fillStyle = glow; x.fillRect(-20, -20, w + 40, h + 40); x.restore();
  },
};
const bookNote = (lines, { paper = '#fffef6', tape = '#f7c3cf', title = null } = {}) => (x, w, h) => {
  const pts = []; for (let i = 0; i <= 12; i++) pts.push([w * i / 12, i % 2 ? 2 : 6]); for (let i = 1; i <= 12; i++) pts.push([w + (i % 2 ? -2 : -5), h * i / 12]); for (let i = 12; i >= 0; i--) pts.push([w * i / 12, h - (i % 2 ? 2 : 6)]); for (let i = 11; i >= 1; i--) pts.push([i % 2 ? 2 : 5, h * i / 12]);
  const sheet = bookPoly(pts, true, .6); x.fillStyle = paper; x.fill(sheet); bookInk(x, sheet, 2.2, 'rgba(38,37,43,.55)');
  x.save(); x.clip(sheet); x.strokeStyle = 'rgba(112,152,206,.32)'; x.lineWidth = 1.4; for (let y = 34; y < h; y += 34) { x.beginPath(); x.moveTo(0, y); x.lineTo(w, y); x.stroke(); } x.restore();
  x.save(); x.translate(w / 2, 4); x.rotate(-.03); x.globalAlpha = .82; x.fillStyle = tape; x.fillRect(-w * .16, -13, w * .32, 26); x.restore();
  let y = 44;
  if (title) { bookCrayon(x, title, w / 2, y + 6, 60, ['#e0554f', '#f2a91c', '#3fa55f', '#3f76c8', '#a35bc4']); y += 62; bookLine(x, [[w * .18, y - 10], [w * .5, y - 6], [w * .82, y - 10]], 3, '#e0554f'); y += 12; }
  for (const line of lines) y = bookWrite(x, line, w / 2, y + 8, 40, '#34323a', { width: w - 40, bold: true, gap: 1 }) + 10;
};
const bookPhoto = (caption, picture, pic, focus = .5) => (x, w, h) => {
  const frame = bookPoly([[0, 0], [w, 0], [w, h], [0, h]], true, .8); x.fillStyle = '#fffdf5'; x.fill(frame); bookInk(x, frame, 2.4, 'rgba(38,37,43,.6)');
  const shot = bookPoly([[12, 12], [w - 12, 12], [w - 12, h - 56], [12, h - 56]], true, .4); bookPencil(x, shot, picture);
  if (pic && pic.naturalWidth) { const bw = w - 24, bh = h - 68, k = Math.max(bw / pic.naturalWidth, bh / pic.naturalHeight), dw = pic.naturalWidth * k, dh = pic.naturalHeight * k; x.save(); x.clip(shot); x.drawImage(pic, 12 + (bw - dw) / 2, 12 + (bh - dh) * focus, dw, dh); x.restore(); }
  else { bookLine(x, [[12, h - 86], [w * .36, h * .36], [w * .56, h * .54], [w * .72, h * .4], [w - 12, h - 86]], 3); x.fillStyle = '#fff7d2'; x.beginPath(); x.arc(w * .74, h * .2, 15, 0, 7); x.fill(); }
  bookInk(x, shot, 2);
  bookWrite(x, caption, w / 2, h - 28, 28, '#34323a');
  x.fillStyle = '#e0554f'; x.beginPath(); x.arc(w / 2, 3, 8, 0, 7); x.fill(); bookInk(x, bookOval(w / 2, 3, 8, 8, .2), 2);
};

/* ---------- Building the world, a step per frame ---------- */
function bookFloor(colors, strip) {
  const c = document.createElement('canvas'), w = c.width = COARSE ? 1024 : 2048, h = c.height = COARSE ? 256 : 512, x = c.getContext('2d'); x.scale(w / 2048, h / 512);
  x.fillStyle = colors[0]; x.fillRect(0, 0, 2048, 512);
  for (let i = 0; i < 2800; i++) { const a = bookRnd() * 2048, b = bookRnd() * 512; x.strokeStyle = bookRnd() < .5 ? 'rgba(255,255,255,.14)' : colors[1]; x.lineWidth = 1 + bookRnd() * 2; x.beginPath(); x.moveTo(a, b); x.lineTo(a + 22 + bookRnd() * 40, b - 18 - bookRnd() * 28); x.stroke(); }
  x.strokeStyle = 'rgba(30,50,110,.2)'; x.lineWidth = 2; for (let a = 0; a < 2048; a += 92) { x.beginPath(); x.moveTo(a, 0); x.lineTo(a, 512); x.stroke(); } // the page's own rules, carrying on across the ground
  if (strip) strip(x);
  const shade = x.createLinearGradient(0, 0, 0, 512); shade.addColorStop(0, 'rgba(40,40,80,.28)'); shade.addColorStop(.14, 'rgba(40,40,80,0)'); shade.addColorStop(1, 'rgba(40,40,80,.05)'); x.fillStyle = shade; x.fillRect(0, 0, 2048, 512);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; return t;
}
function* buildBook() {
  bookRnd = seeded(41);
  let fonts = false;
  Promise.race([Promise.all(['400 40px Gaegu', '700 40px Gaegu'].map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 2500))]).catch(() => {}).finally(() => { fonts = true; });
  while (!fonts) yield;
  const spr = {};
  const make = function* (list) { for (const [name, w, h, draw, opts] of list) { bookCatStyle = name === 'wheel' || name === 'smallWheel' || name === 'shiro'; spr[name] = bookSprite(w, h, draw, opts); bookCatStyle = false; bookBuilt += .9 / 58; yield; } };
  bookCatStyle = true; spr.cat = BOOK_COSTUMES.map((draw, i) => bookSprite(4.4, 4.2, draw, { edge: 5 })); bookCatStyle = false; bookBuilt = .1; yield;
  yield* make([
    ['wheel', 1.34, 1.34, (x, w) => { bookDraw(x, bookOval(w / 2, w / 2, w * .47), '#fbf7ec', 7); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.2832; bookLine(x, [[w / 2, w / 2], [w / 2 + Math.cos(a) * w * .44, w / 2 + Math.sin(a) * w * .44]], 1.8, '#74727f'); } bookDraw(x, bookOval(w / 2, w / 2, 8), '#d8d3c6', 2.4); }, { edge: 2 }],
    ['smallWheel', .5, .5, (x, w) => { bookDraw(x, bookOval(w / 2, w / 2, w * .46), '#ffd24c', 3.6); bookLine(x, [[w / 2 - 12, w / 2], [w / 2 + 12, w / 2]], 2); }, { edge: 2 }],
    ['cloud', 4.4, 2.5, bookArt.cloud], ['hills', 34, 6, bookArt.hills, { scale: .4, edge: 0 }], ['house', 8, 7.4, bookArt.house], ['tree', 5.2, 7, bookArt.tree], ['mailbox', 1.9, 3.1, bookArt.mailbox], ['grass', 1.4, 1, bookArt.grass], ['flower', 1, 1.9, bookArt.flower],
    ['welcome', 6.6, 3.4, (x, w, h) => { bookCrayon(x, BOOK_WORDS.welcome[0], w / 2, 66, 94, ['#e0554f', '#f2a91c', '#3fa55f', '#3f76c8', '#a35bc4']); bookWrite(x, BOOK_WORDS.welcome[1], w / 2, 164, 62, '#34323a', { bold: true }); bookWrite(x, BOOK_WORDS.welcome[2], w / 2, 244, 46, '#5d5a65', { bold: true }); bookLine(x, [[w * .14, 292], [w * .45, 304], [w * .86, 290]], 3.4, '#e0554f'); }, { edge: 0, grain: false }],
    ['about', 5, 4.1, bookNote(BOOK_WORDS.about.slice(1), { title: BOOK_WORDS.about[0] })],
    ['stall', 10, 7, bookArt.stall], ['bowl', 5.4, 5.2, bookArt.bowl], ['egg', 3.8, 3.4, bookArt.egg], ['boba', 1.9, 3.5, bookArt.boba], ['dumplings', 3.4, 1.9, bookArt.dumplings], ['icecream', 1.6, 3.2, bookArt.icecream], ['lights', 12, 1.6, bookArt.lights],
    ['food', 5.4, 4.7, bookNote(BOOK_WORDS.food.slice(1), { title: BOOK_WORDS.food[0], tape: '#ffd98a' })],
    ['night', 35.4, 16, bookArt.night, { scale: .42, edge: 0 }], ['moon', 3.8, 3.8, bookArt.moon], ['star', 1.1, 1.1, bookArt.star], ['desk', 8, 5, bookArt.desk], ['guitar', 2.3, 6, bookArt.guitar], ['record', 2.7, 2.8, bookArt.record], ['controller', 3.1, 2, bookArt.controller], ['cassette', 3.2, 2.1, bookArt.cassette],
    ['late', 5.4, 4.7, bookNote(BOOK_WORDS.late.slice(1), { title: BOOK_WORDS.late[0], tape: '#b9b8f0' })],
    ['lighthouse', 3.8, 10, bookArt.lighthouse], ['island', 7.4, 6.2, bookArt.island], ['whale', 6, 3.6, bookArt.whale], ['sun', 4.4, 4.4, bookArt.sun], ['gull', 1.8, .8, bookArt.gull], ['bottle', 1.4, 2.3, bookArt.bottle], ['waves', 36, 1.2, bookArt.waves, { scale: .7, edge: 0 }],
    ['places', 5.4, 4.7, bookNote(BOOK_WORDS.places.slice(1), { title: BOOK_WORDS.places[0], tape: '#a5ddf2' })],
    ['dusk', 35.4, 13, bookArt.dusk, { scale: .42, edge: 0 }], ['pine', 3.6, 7.4, bookArt.pine], ['tent', 6.4, 4.6, bookArt.tent], ['fire', 2.5, 2.7, bookArt.fire], ['owl', 1.7, 2.2, bookArt.owl], ['marshmallow', 2.2, 2.2, bookArt.marshmallow], ['shiro', 2.6, 3.4, bookArt.shiro],
    ['people', 5.4, 4.7, bookNote(BOOK_WORDS.people.slice(1), { title: BOOK_WORDS.people[0], tape: '#c7e6b4' })],
    ['fence', 2.8, 1.5, (x, w, h) => { for (const a of [14, w / 2, w - 14]) bookDraw(x, bookPoly([[a - 9, h], [a - 9, 18], [a, 6], [a + 9, 18], [a + 9, h]]), '#e9d3a8', 3.4); for (const y of [h * .38, h * .72]) bookDraw(x, bookPoly([[2, y - 9], [w - 2, y - 8], [w - 2, y + 9], [2, y + 8]]), '#e9d3a8', 3.4); }],
    ['lamp', 1.2, 4.8, (x, w, h) => { bookDraw(x, bookPoly([[w / 2 - 7, h], [w / 2 - 7, 70], [w / 2 + 7, 70], [w / 2 + 7, h]]), '#4b4e5c', 3.6); bookDraw(x, bookPoly([[w / 2 - 34, 72], [w / 2 + 34, 72], [w / 2 + 22, 20], [w / 2 - 22, 20]]), '#ffe29a', 4); bookDraw(x, bookPoly([[w / 2 - 40, 22], [w / 2 + 40, 22], [w / 2, 2]]), '#4b4e5c', 3.4); bookDraw(x, bookPoly([[w / 2 - 26, h], [w / 2 + 26, h], [w / 2 + 18, h - 14], [w / 2 - 18, h - 14]]), '#4b4e5c', 3); }],
    ['bunting', 9, 1.5, (x, w, h) => { bookLine(x, [[0, 10], [w * .25, 34], [w * .5, 42], [w * .75, 34], [w, 10]], 3); const cols = ['#e4584f', '#ffd24c', '#7dbf6a', '#4f7fd0', '#f2a7c3']; for (let i = 1; i < 14; i++) { const t = i / 14, ax = t * w, ay = 10 + 32 * Math.sin(t * Math.PI); bookDraw(x, bookPoly([[ax - 20, ay], [ax + 20, ay], [ax, ay + 62]]), cols[i % 5], 2.8); } }],
    ['rock', 1.9, 1.1, (x, w, h) => { bookDraw(x, bookCurve([[8, h], [16, 40], [60, 8], [130, 18], [w - 10, 60], [w - 6, h]]), '#b9b6c4', 4); bookLine(x, [[60, 40], [86, 60]], 2.4, 'rgba(60,55,70,.5)'); }],
    ['shell', .9, .75, (x, w, h) => { bookDraw(x, bookCurve([[8, h - 8], [w / 2, 4], [w - 8, h - 8], [w / 2, h - 2]]), '#f6c1cf', 3.2); for (const a of [-.5, -.25, 0, .25, .5]) bookLine(x, [[w / 2, h - 6], [w / 2 + a * 70, 18]], 2); }],
    ['bush', 2.4, 1.5, (x, w, h) => { bookDraw(x, bookFluff(w / 2, h * .62, w * .46, h * .5, 18, .12), '#86c27a', 4); for (const [a, b] of [[.3, .5], [.62, .4], [.48, .7]]) bookDraw(x, bookOval(w * a, h * b, 7), '#f2a7c3', 2.2); }],
    ['crate', 1.7, 1.4, (x, w, h) => { bookDraw(x, bookPoly([[4, 40], [w - 4, 40], [w - 4, h - 2], [4, h - 2]]), '#c99a5e', 3.6); bookLine(x, [[4, 40], [w - 4, h - 2]], 2.4); bookLine(x, [[w - 4, 40], [4, h - 2]], 2.4); for (let i = 0; i < 5; i++) bookDraw(x, bookOval(26 + i * 30, 34, 16), ['#e4584f', '#ffb347', '#7dbf6a'][i % 3], 2.6); }],
    ['kite', 1.6, 3.6, (x, w, h) => { bookDraw(x, bookPoly([[w / 2, 4], [w - 8, 70], [w / 2, 150], [8, 70]]), '#f2a7c3', 3.6); bookLine(x, [[w / 2, 4], [w / 2, 150]], 2.2); bookLine(x, [[8, 70], [w - 8, 70]], 2.2); bookLine(x, [[w / 2, 150], [w / 2 + 20, 200], [w / 2 - 14, 250], [w / 2 + 10, 300], [w / 2 - 6, h - 4]], 2.4); for (const y of [205, 260, 315]) bookDraw(x, bookPoly([[w / 2 - 12, y - 8], [w / 2 + 12, y - 8], [w / 2, y + 10]]), '#ffd24c', 2); }],
    ['mushroom', 1.2, 1.3, (x, w, h) => { bookDraw(x, bookPoly([[w / 2 - 16, h], [w / 2 - 12, 60], [w / 2 + 12, 60], [w / 2 + 16, h]]), '#fdf6ec', 3.2); bookDraw(x, bookCurve([[8, 66], [w / 2, 6], [w - 8, 66]]), '#e4584f', 3.6); for (const [a, b] of [[.32, .3], [.6, .22], [.72, .42]]) bookDraw(x, bookOval(w * a, h * b, 7), '#fdf6ec', 1.8); }],
    ['lantern', 1, 1.6, (x, w, h) => { bookDraw(x, bookPoly([[w / 2 - 16, 4], [w / 2 + 16, 4], [w / 2 + 16, 22], [w / 2 - 16, 22]]), '#4b4e5c', 2.8); bookDraw(x, bookOval(w / 2, 86, 40, 62), '#ff8a5c', 3.6); for (const y of [60, 86, 112]) bookLine(x, [[w / 2 - 36, y], [w / 2 + 36, y]], 1.8, 'rgba(90,40,20,.5)'); bookDraw(x, bookPoly([[w / 2 - 12, 146], [w / 2 + 12, 146], [w / 2 + 12, 158], [w / 2 - 12, 158]]), '#4b4e5c', 2.4); }],
    ...BOOK_WORDS.worlds.map((_, i) => [`climb${i}`, 4.6, 2.6, bookNote([['back to where it started.', 'food this way. pedal faster.', 'it is getting dark...', 'smells like the sea up here.', 'nearly there. everyone is waiting.'][i]], { title: ['home soon', 'almost dinner', 'one more climb', 'fresh air', 'up we go'][i], tape: ['#f7c3cf', '#ffd98a', '#b9b8f0', '#a5ddf2', '#c7e6b4'][i] })]),
    ['plank', .66, .26, (x, w, h) => bookDraw(x, bookPoly([[4, 4], [w - 4, 6], [w - 4, h - 4], [4, h - 6]]), '#c58f55', 3.4), { edge: 2 }], ['post', .24, 1.7, (x, w, h) => bookDraw(x, bookPoly([[5, 4], [w - 5, 4], [w - 5, h], [5, h]]), '#9b6b3c', 3.4), { edge: 2 }],
    ...BOOK_WORDS.worlds.map((next, i) => [`sign${i}`, 3.8, 4.4, (x, w, h) => {
      const back = BOOK_WORDS.worlds[(i + BOOK_WORDS.worlds.length - 1) % BOOK_WORDS.worlds.length];
      bookDraw(x, bookPoly([[w / 2 - 12, 40], [w / 2 + 12, 40], [w / 2 + 14, h], [w / 2 - 14, h]]), '#c99a5e', 4.4);
      bookDraw(x, bookPoly([[22, 62], [w - 66, 58], [w - 14, 108], [w - 66, 156], [22, 152]]), '#ffe9a8', 4.4);
      bookWrite(x, next, (w - 50) / 2 + 4, 108, 50, '#34323a', { bold: true });
      bookDraw(x, bookPoly([[66, 186], [w - 22, 190], [w - 22, 278], [66, 282], [14, 234]]), '#f7c3cf', 4.4);
      bookWrite(x, back, (w + 50) / 2 - 4, 236, 44, '#34323a', { bold: true });
      bookDraw(x, bookOval(w / 2, 40, 16), '#c99a5e', 3.4);
    }]),
    ['hi', 5, 3.7, bookNote(BOOK_WORDS.hi.slice(1), { title: BOOK_WORDS.hi[0], tape: '#ffd98a' })],
  ]);
  let waiting = 0;
  for (const p of BOOK_PHOTOS) if (p.src && !p.pic) { waiting++; p.pic = new Image(); p.pic.onload = p.pic.onerror = () => { waiting--; }; p.pic.src = p.src; }
  const giveUp = performance.now() + 8000; // a photo that never arrives leaves a sketch in its frame
  while (waiting > 0 && performance.now() < giveUp) yield;
  yield* make(BOOK_PHOTOS.map(p => [p.id, 2.7, 3.2, bookPhoto(p.cap, p.tint, p.pic, p.focus), { scale: COARSE ? 1 : 1.8, grain: false }]));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf3f0e6).convertSRGBToLinear();
  const cam = new THREE.PerspectiveCamera(BOOK_FOV, 1, .5, 200);
  // The page behind everything: repeats every 30 units, a red margin on each.
  const pc = document.createElement('canvas'), ps = COARSE ? 1024 : 2048; pc.width = pc.height = ps; const px = pc.getContext('2d'); px.scale(ps / 2048, ps / 2048);
  px.fillStyle = '#f5f2e8'; px.fillRect(0, 0, 2048, 2048);
  for (let i = 0; i < 9000; i++) { px.fillStyle = bookRnd() < .5 ? 'rgba(255,255,255,.3)' : 'rgba(90,80,70,.05)'; px.fillRect(bookRnd() * 2048, bookRnd() * 2048, 1 + bookRnd() * 3, 1 + bookRnd() * 3); }
  px.strokeStyle = 'rgba(96,136,196,.55)'; px.lineWidth = 3; for (let y = 34; y < 2048; y += 68.3) { px.beginPath(); px.moveTo(0, y); px.lineTo(2048, y + (bookRnd() - .5) * 2); px.stroke(); }
  px.strokeStyle = 'rgba(226,84,92,.7)'; px.lineWidth = 4; px.beginPath(); px.moveTo(1024, 0); px.lineTo(1026, 2048); px.stroke();
  const pt = new THREE.CanvasTexture(px.canvas); pt.encoding = THREE.sRGBEncoding; pt.anisotropy = 8; pt.wrapS = pt.wrapT = THREE.RepeatWrapping; pt.repeat.set(4, 2);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(120, 60), new THREE.MeshBasicMaterial({ map: pt, toneMapped: false })); wall.position.set(0, 26, 0); wall.renderOrder = -3; scene.add(wall); // reaches below the ground, for the chasm and the river
  bookBuilt = .94; yield;

  const flatMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const stickMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xb98a52).convertSRGBToLinear(), toneMapped: false });
  const threadMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x9b7a56).convertSRGBToLinear(), toneMapped: false });
  const blob = new THREE.Mesh(new THREE.CircleGeometry(.5, 20).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x28305a, transparent: true, opacity: .14, depthWrite: false, toneMapped: false })); // a soft-ish contact shadow on the ground, under the real one
  const props = [];
  const put = (name, wx, z, o = {}) => {
    const s = o.model ? { w: o.mw, h: o.mh } : spr[name], hang = !!o.hang, y = o.y || 0, mesh = o.model ? BOOK_MODELS[name]() : new THREE.Mesh(new THREE.PlaneGeometry(s.w, s.h).translate(0, hang ? -s.h / 2 : s.h / 2, 0), s.mat);
    if (!o.model && o.shadow !== false && !o.noPop) { mesh.castShadow = true; mesh.customDepthMaterial = s.depth || (s.depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: s.tex, alphaTest: .5 })); } // the shadow of the drawing's own shape
    const p = { name, s, x: wx, z, y, hang, mesh, say: o.say, tilt: o.tilt || 0, flat: !!o.flat, ground: !hang && !o.flat && !o.noPop, /* things on the ground stand on the land */ sway: o.sway ?? BOOK_IDLE[name]?.sway ?? (hang ? .035 : 0), bob: o.bob || BOOK_IDLE[name]?.bob || 0, phase: wx * 1.3, flick: !!o.flick, slide: o.slide || BOOK_IDLE[name]?.slide || 0, kick: -1e9, noPop: !!o.noPop, shadow: o.shadow !== false, bend: !!BOOK_IDLE[name]?.bend, twinkle: !!BOOK_IDLE[name]?.twinkle };
    mesh.position.set(wx, y, z); mesh.renderOrder = o.order || 0; scene.add(mesh);
    if (hang) { const t = new THREE.Mesh(new THREE.PlaneGeometry(.035, 30).translate(0, 15, 0), threadMat); t.position.y = -.02; mesh.add(t); }
    if (o.stick) { const t = new THREE.Mesh(new THREE.PlaneGeometry(.12, y + .2).translate(0, -(y + .2) / 2, 0), stickMat); t.position.set(0, .2, -.01); mesh.add(t); }
    if (!hang && !p.flat && !y && p.shadow) { p.contact = blob.clone(); p.contact.scale.set(s.w * 1.05, 1, Math.min(1.4, s.w * .24)); scene.add(p.contact); }
    props.push(p); return p;
  };
  const at = (world, u) => world * BOOK_SIZE + BOOK_FLAT + u; // a world's things stand on its flat middle
  // Home
  put('hills', at(0, 18), .04, { noPop: true, shadow: false, order: -2 });
  put('cloud', at(0, 3), 1.2, { hang: true, y: 10.1, say: 'i am just a cloud.' }); put('cloud', at(0, 25), .8, { hang: true, y: 10.8, say: 'still a cloud.' });
  put('welcome', at(0, 7), .08, { y: 5, flat: true, shadow: false, tilt: .025 });
  put('tree', at(0, 1), 1.6, { say: 'just a tree. a good one.' });
  put('about', at(0, 15.7), .1, { y: 4.1, flat: true, tilt: -.03, say: 'hi. this is me.' }); put('photo-home', at(0, 20), .1, { y: 4.7, flat: true, tilt: .06, say: 'that is me. Hoshi. look at the tongue.' }); put('photo-off', at(0, 11.8), .1, { y: 5.3, flat: true, tilt: -.05, say: 'also me. working hard.' });
  put('photo-me', at(0, 30), .1, { y: 4.9, flat: true, tilt: -.05, say: 'this one is Cyrill. i let him stay.' }); put('house', at(0, 26), .35, { model: true, mw: 7, mh: 6.8, say: 'Home: San Miguel, Bulacan.' }); put('mailbox', at(0, 18.5), 3.6, { say: 'no letters. only cat hair.' }); put('tree', at(0, 33.2), 1.5);
  for (const [u, z, n] of [[5.5, 5.6, 'grass'], [11.5, 3.6, 'flower'], [13, 5.8, 'grass'], [21, 5.7, 'flower'], [22.5, 5.9, 'grass'], [30, 5.2, 'grass'], [33, 3.5, 'flower']]) put(n, at(0, u), z, { shadow: n === 'grass' ? false : undefined });
  // Food
  put('lights', at(1, 7), 1.2, { hang: true, y: 10.5, sway: .015 }); put('lights', at(1, 22), 1.2, { hang: true, y: 10.1, sway: .015 });
  put('food', at(1, 7.6), .1, { y: 3.9, flat: true, tilt: .025, say: 'katsu first. questions later.' });
  put('egg', at(1, 1.8), .9, { hang: true, y: 9.8, say: 'i am the sun of this page.' });
  put('stall', at(1, 16), .1, { model: true, mw: 8.6, mh: 6.2, say: 'my usual spot.' }); put('bowl', at(1, 26), 2.8, { say: 'hot. wait.' });
  put('boba', at(1, 12.6), 4.4, { say: 'half sugar. no regrets.' }); put('dumplings', at(1, 4), 4.4, { say: 'there were six.' }); put('icecream', at(1, 31.5), 4, { say: 'mine.' }); put('photo-food', at(1, 32), .1, { y: 4.6, flat: true, tilt: -.05, say: 'coffee, by the sea.' });
  // Up late
  put('night', at(2, 18), .05, { noPop: true, shadow: false, order: -2, y: -.2 });
  put('moon', at(2, 6), .9, { hang: true, y: 11, say: 'go to sleep.' });
  for (const [u, y] of [[1.5, 10.4], [11.5, 11.4], [20.5, 11], [28, 10.4], [33.5, 11.6]]) put('star', at(2, u), 1, { hang: true, y, sway: .08 });
  put('late', at(2, 10.2), .1, { y: 3.9, flat: true, tilt: -.025, say: 'what keeps me up.' });
  put('desk', at(2, 21), .3, { model: true, mw: 7, mh: 5.2, say: 'This is where the hours go.' }); put('guitar', at(2, 3), 2.6, { say: 'mostly for decoration.' }); put('record', at(2, 15.6), .1, { y: 4.4, flat: true, tilt: .08, say: 'Mr. Incorrect. on repeat.' }); put('cassette', at(2, 28.5), .1, { y: 5.4, flat: true, tilt: -.06, say: 'still Mr. Incorrect.' });
  put('controller', at(2, 30), 3.6, { y: 1.8, stick: true, say: 'Wukong. one more try.', bob: .06 }); put('photo-late', at(2, 33.5), .1, { y: 3.2, flat: true, tilt: .05, say: 'a late night worth keeping.' });
  // Places
  put('sun', at(3, 23), .9, { hang: true, y: 11.3, say: 'too cool to set.' }); put('cloud', at(3, 7), .8, { hang: true, y: 10.8 }); put('gull', at(3, 12), 1.5, { hang: true, y: 8.9, sway: .1, say: 'mine? mine? mine?' }); put('gull', at(3, 16), 1.2, { hang: true, y: 10, sway: .1 });
  put('places', at(3, 8.5), .1, { y: 3.9, flat: true, tilt: .03, say: 'where I have been.' });
  put('lighthouse', at(3, 3.4), .2, { model: true, mw: 2.6, mh: 9.6, say: 'Hong Kong. Baguio. La Union.' }); put('island', at(3, 18), 1.8, { say: 'Japan is next.' }); put('whale', at(3, 28), 3, { bob: .22, say: 'wooooo.' }); put('bottle', at(3, 13), 4.5, { bob: .2, sway: .09, say: 'a memory, in a bottle.' }); put('photo-view', at(3, 22.5), .1, { y: 4.7, flat: true, tilt: -.04, say: 'good view. no cats.' }); put('photo-falls', at(3, 33.2), .1, { y: 4.6, flat: true, tilt: -.06, say: 'a good day out.' }); put('photo-hk', at(3, 13.4), .1, { y: 4.8, flat: true, tilt: .05, say: 'Hong Kong. been there.' }); put('photo-baguio', at(3, 17.4), .1, { y: 5.5, flat: true, tilt: -.04, say: 'Baguio. the most memories.' }); put('photo-launion', at(3, 27.6), .1, { y: 4.9, flat: true, tilt: .05, say: 'La Union. took my breath away.' });
  for (const [z, off] of [[1.1, 0], [3.7, 11], [5.9, 23]]) put('waves', at(3, 18) + off * .05, z, { noPop: true, shadow: false, slide: .32, bob: .05 });
  // My cats
  put('dusk', at(4, 18), .05, { noPop: true, shadow: false, order: -2, y: -.2 });
  put('star', at(4, 5), 1, { hang: true, y: 11.4, sway: .08 }); put('star', at(4, 27.55), 1, { hang: true, y: 11.1, sway: .08 });
  put('people', at(4, 7.6), .1, { y: 4.3, flat: true, tilt: -.03, say: 'me and Shiro. mostly me.' });
  for (const [id, u, y, tilt, say] of [['photo-shiro-chin', 12.3, 4.8, .05, 'Shiro. chin scratches only. he decides when.'], ['photo-shiro-pat', 15.35, 5.2, -.05, 'head pats. Shiro allows it.'], ['photo-shiro-wide', 18.4, 4.8, .04, 'Shiro, surprised. he is always surprised.'], ['photo-hoshi', 21.45, 5.1, -.04, 'Hoshi. orange. exotic. in charge.'], ['photo-shiro-up', 24.5, 4.8, .05, 'Shiro, looking up. he wants something.'], ['photo-shiro', 27.55, 5.1, -.05, 'Shiro. bow tie optional.']]) put(id, at(4, u), .1, { y, flat: true, tilt, say });
  put('shiro', at(4, 13.9), 3.4, { say: 'Shiro. the warm side of the fire. always.' });
  put('pine', at(4, 6.2), 1.6); put('pine', at(4, 15.8), .08); put('tent', at(4, 21), .2, { model: true, mw: 6, mh: 4.5, say: 'Sleeps two. And one very large cat.' }); put('pine', at(4, 34.5), 1.4); // the middle pine stands behind the photos, so they stay clear
  put('owl', at(4, 15.8), 1.6, { y: 2.4, stick: false, say: 'who?', shadow: false }); put('fire', at(4, 15.8), 4.2, { flick: true, say: 'careful. the cat has already tried.' });
  put('marshmallow', at(4, 19.6), 5.1, { shadow: false, say: 'toasted, not burnt.' });
  put('hi', at(4, 32.1), .1, { y: 4.6, flat: true, tilt: .03, say: 'open to work. come say hi.' });
  // Each slope gets things for the world it leads to (j): on the ground either side of the top, hanging above it, and a note on the page.
  const slopes = [
    { ground: [['tree', -17, 1.6], ['flower', -12, 5.4], ['fence', -7, 2.8], ['bush', -4.5, 5.1], ['bush', 6, 5], ['fence', 10, 2.8], ['flower', 14, 5.3], ['grass', 18, 5.8]], hang: [['kite', -11, 9.8, 1], ['cloud', 12, 10.8, .9]] },
    { ground: [['fence', -18, 2.8], ['lamp', -13, 2.2], ['flower', -9, 5.4], ['bush', -4.5, 5], ['crate', 5, 4.4], ['lamp', 11, 2.2], ['flower', 15, 5.3], ['bush', 18.5, 4.8]], hang: [['cloud', -14, 10.6, 1], ['bunting', 8, 9.4, 1.2]] },
    { ground: [['bush', -18, 5], ['lamp', -13, 2.2], ['rock', -8, 5.5], ['crate', -4.5, 4.6], ['lamp', 7, 2.2], ['rock', 12, 5.6], ['bush', 17, 4.9]], hang: [['star', -15, 9.8, 1], ['star', -6, 10.6, 1], ['star', 9, 9.6, 1], ['star', 16, 10.2, 1]] },
    { ground: [['rock', -17, 5.4], ['shell', -11, 5.8], ['bush', -5, 5], ['rock', 6, 5.5], ['shell', 11, 5.9], ['bottle', 15, 5], ['shell', 18.5, 5.6]], hang: [['gull', -13, 9.2, 1.5], ['gull', 9, 9.8, 1.2], ['cloud', 15, 10.8, .9]] },
    { ground: [['pine', -17, 1.6], ['mushroom', -11, 5.4], ['rock', -5, 5.6], ['mushroom', 6.5, 5.5], ['pine', 12, 1.4], ['bush', 17.5, 5]], hang: [['lantern', -13, 9, 1.2], ['lantern', 9, 9.4, 1.2], ['star', 15, 10.6, 1]] },
  ];
  const says = { fence: 'keeps nothing in.', lamp: 'on all night.', bush: 'it rustles. that is all.', rock: 'a rock. very still.', shell: 'from La Union.', crate: 'fresh fruit. not for cats.', kite: 'stuck up here forever.', mushroom: 'do not eat.', lantern: 'for the walk home.' };
  slopes.forEach((sl, j) => {
    const top = j * BOOK_SIZE; // the top between world j - 1 and world j
    for (const [name, d, z] of sl.ground) put(name, top + d, z, { say: says[name] });
    for (const [name, d, y, z] of sl.hang) put(name, top + d, z, { hang: true, y, sway: name === 'bunting' ? .012 : undefined });
    put(`climb${j}`, top - 9.5, .1, { y: 4.6, flat: true, tilt: (j % 2 ? -1 : 1) * .05, say: 'a note on the way up.' });
  });
  // More in every world: a layer behind the main things and a layer in front.
  for (const [w, list] of [
    [0, [['bush', 2.6, 5], ['fence', 8.6, 2.6], ['fence', 11.3, 2.6], ['rock', 20, 5.7], ['bush', 35, 5.1]]],
    [1, [['lamp', .5, 2.2], ['crate', 9, 3.9], ['crate', 21.5, 3.7], ['bush', 34.5, 5.2], ['bunting', 16, 1.2, 8.6]]],
    [2, [['lamp', 8.2, 2.4], ['rock', 13, 5.6], ['bush', 33, 5], ['star', 7, 1, 9.6], ['star', 25, 1, 9.2]]],
    [3, [['rock', 6, 5.6], ['shell', 9.5, 5.9], ['shell', 24, 6], ['rock', 34, 5.3], ['gull', 31, 1.4, 9.4]]],
    [4, [['mushroom', 3, 5.4], ['bush', 11.5, 5.2], ['mushroom', 25, 5.7], ['rock', 33, 5.3], ['lantern', 10, 1.2, 8.8], ['lantern', 28, 1.2, 9]]],
  ]) for (const [name, u, z, y] of list) put(name, at(w, u), z, y ? { hang: true, y, sway: name === 'bunting' ? .012 : undefined } : { say: says[name] });
  // And more again: trees and bushes along every slope (behind the path, clear of the notes), and a front row of small things in every world.
  const greens = [['tree', 'bush'], ['tree', 'bush'], ['pine', 'bush'], ['bush', 'rock'], ['pine', 'mushroom']], smalls = [['grass', 'flower'], ['flower', 'grass'], ['grass', 'rock'], ['shell', 'rock'], ['mushroom', 'grass']];
  for (let j = 0; j < 5; j++) {
    const top = j * BOOK_SIZE, [big, low] = greens[j];
    for (const [d, z] of [[-20, 1.1], [-15.5, .8], [-2.8, 1.3], [3, 1.1], [16.5, .8], [20.5, 1.2]]) put(big, top + d, z, { say: says[big] });
    [[-18.5, 6.2], [-13.5, 6.4], [-8, 6.1], [-3.4, 6.3], [4.2, 6.2], [9, 6.4], [13.5, 6.1], [19, 6.3]].forEach(([d, z], k) => put(k % 2 ? low : smalls[j][0], top + d, z, { say: says[low] }));
    let n = 0; for (let u = 1.5; u < 36; u += 4.2) put(smalls[j][n++ % 2], at(j, u), 6.3 + (n % 3) * .12);
  }
  BOOK_WORDS.worlds.forEach((name, i) => put(`sign${i}`, i * BOOK_SIZE + .6, .9, { say: `this way to ${name}. ${['downhill. finally.', 'all that climbing for a sign.', 'the view is better up here.', 'downhill to the sea. no.', 'last climb. promise.'][i]}` }));
  // Keep the words and photos clear: anything decorative standing or hanging in front of a note, a photo or a signpost moves aside.
  const MOVABLE = new Set(['tree', 'pine', 'lamp', 'kite', 'bush', 'fence', 'rock', 'mushroom', 'crate', 'bunting', 'lantern', 'star', 'gull', 'cloud', 'flower', 'grass', 'shell']);
  const span = p => p.hang ? [p.y - p.s.h, p.y] : p.flat ? [p.y - p.s.h * .05, p.y + p.s.h * 1.05] : [0, p.s.h]; // heights above the ground there
  const keep = props.filter(q => q.flat && !q.noPop || q.name.startsWith('sign'));
  for (let pass = 0; pass < 3; pass++) for (const p of props) {
    if (!MOVABLE.has(p.name) || p.flat) continue;
    for (const q of keep) {
      if (q === p || p.z <= q.z) continue;
      const need = (p.s.w + q.s.w) / 2 * .92, dx = p.x - q.x, [a0, a1] = span(p), [b0, b1] = span(q);
      if (Math.abs(dx) >= need || a1 <= b0 || b1 <= a0) continue;
      p.x = q.x + (dx >= 0 ? 1 : -1) * need; p.phase = p.x * 1.3; p.mesh.position.x = p.x;
    }
  }
  // The skies of Up late and My cats fade out at their edges, over the hills, instead of stopping in a straight line.
  for (const name of ['night', 'dusk']) {
    const old = spr[name].canvas, c = document.createElement('canvas'), o = c.getContext('2d'), fw = old.width * .13; c.width = old.width; c.height = old.height; o.drawImage(old, 0, 0); // a fresh sheet: the drawing's own context still carries its scale and clip
    o.globalCompositeOperation = 'destination-out';
    for (const [a, b] of [[0, fw], [c.width, c.width - fw]]) { const l = o.createLinearGradient(a, 0, b, 0); l.addColorStop(0, '#000'); l.addColorStop(1, 'rgba(0,0,0,0)'); o.fillStyle = l; o.fillRect(Math.min(a, b), 0, fw, c.height); }
    spr[name].canvas = c; spr[name].tex.image = c; spr[name].tex.needsUpdate = true;
  }
  // The ground: one coloured sheet a world, folded down at the front, rising into a hill at each end.
  const floors = [
    [['#9fd18c', 'rgba(50,110,50,.14)'], x => { x.fillStyle = '#eba98f'; x.fillRect(0, 300, 2048, 96); x.strokeStyle = '#b9755e'; x.lineWidth = 3; for (let i = 0; i < 2048; i += 58) { x.beginPath(); x.moveTo(i, 300 + (i % 116 ? 0 : 48)); x.lineTo(i, 348 + (i % 116 ? 0 : 48)); x.stroke(); } x.beginPath(); x.moveTo(0, 348); x.lineTo(2048, 348); x.moveTo(0, 300); x.lineTo(2048, 300); x.moveTo(0, 396); x.lineTo(2048, 396); x.stroke(); }],
    [['#f6cf9a', 'rgba(160,90,30,.14)'], x => { for (let a = 0; a < 2048; a += 92) for (let b = 0; b < 512; b += 92) if (((a + b) / 92) % 2) { x.fillStyle = 'rgba(224,110,80,.3)'; x.fillRect(a, b, 92, 92); } }],
    [['#8c7fd0', 'rgba(40,20,110,.17)'], x => { x.fillStyle = '#d95f76'; x.fillRect(0, 290, 2048, 130); x.fillStyle = '#ffd24c'; x.fillRect(0, 306, 2048, 8); x.fillRect(0, 396, 2048, 8); }],
    [['#a7d8f4', 'rgba(30,90,160,.16)'], null],
    [['#7db587', 'rgba(20,70,50,.17)'], x => { x.fillStyle = '#c9a26b'; x.beginPath(); x.moveTo(0, 310); for (let a = 0; a <= 2048; a += 64) x.lineTo(a, 310 + Math.sin(a * .03) * 10); for (let a = 2048; a >= 0; a -= 64) x.lineTo(a, 402 + Math.cos(a * .03) * 10); x.fill(); }],
  ];
  const grounds = [], shadowOnly = new THREE.ShadowMaterial({ opacity: .2, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 });
  floors.forEach(([colors, strip], i) => {
    const shape = new THREE.Shape(), half = BOOK_SIZE / 2 + .01;
    shape.moveTo(-half, -10); for (let lx = -half; lx <= half + 1e-6; lx += .125) shape.lineTo(lx, bookGround(i * BOOK_SIZE + BOOK_SIZE / 2 + lx)); shape.lineTo(half, -10); shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 7, bevelEnabled: false, steps: 1 }), uv = geo.attributes.uv, pos = geo.attributes.position, caps = geo.groups[0];
    for (let k = 0; k < pos.count; k++) if (k < caps.start + caps.count) uv.setXY(k, pos.getX(k) / 6, pos.getY(k) / 6); else uv.setXY(k, (pos.getX(k) + BOOK_SIZE / 2) / BOOK_SIZE, 1 - pos.getZ(k) / 7); // the top takes the world's floor; the cut edge, layers of paper
    const edge = document.createElement('canvas'); edge.width = edge.height = COARSE ? 256 : 512; const ex = edge.getContext('2d'), base = new THREE.Color(colors[0]);
    ex.fillStyle = `#${base.clone().multiplyScalar(.8).getHexString()}`; ex.fillRect(0, 0, edge.width, edge.height);
    for (let y = 0; y < edge.height; y += 9 + bookRnd() * 10) { ex.fillStyle = bookRnd() < .5 ? 'rgba(255,255,255,.16)' : 'rgba(30,20,40,.1)'; ex.fillRect(0, y, edge.width, 2 + bookRnd() * 3); } // the layers of a thick card
    for (let n = 0; n < 2500; n++) { ex.fillStyle = bookRnd() < .5 ? 'rgba(255,255,255,.1)' : 'rgba(30,20,40,.06)'; ex.fillRect(bookRnd() * edge.width, bookRnd() * edge.height, 1 + bookRnd() * 2, 1 + bookRnd() * 2); }
    const edgeTex = new THREE.CanvasTexture(edge); edgeTex.encoding = THREE.sRGBEncoding; edgeTex.wrapS = edgeTex.wrapT = THREE.RepeatWrapping;
    const slab = new THREE.Mesh(geo, [new THREE.MeshBasicMaterial({ map: edgeTex, toneMapped: false }), new THREE.MeshBasicMaterial({ map: bookFloor(colors, strip), toneMapped: false })]);
    const over = new THREE.Mesh(geo, shadowOnly); over.receiveShadow = true; // the shadows that fall on it
    const rim = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 4), new THREE.LineBasicMaterial({ color: new THREE.Color(0x3a3438).convertSRGBToLinear(), transparent: true, opacity: .35, toneMapped: false })); // a pencil line along its folds
    scene.add(slab, over, rim); grounds.push({ x: at(i, 18), meshes: [slab, over, rim] });
    bookBuilt = Math.min(.99, bookBuilt + .008);
  });
  // One soft light, high at the front left, so everything throws its shadow down and back onto the page and the ground.
  const sun = new THREE.DirectionalLight(0xffffff, 1); sun.castShadow = true; sun.shadow.mapSize.set(COARSE ? 1024 : 2048, COARSE ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -36, right: 36, top: 26, bottom: -12, near: 1, far: 90 }); sun.shadow.bias = -.0006; sun.shadow.radius = 3; scene.add(sun, sun.target);
  const wallShade = new THREE.Mesh(new THREE.PlaneGeometry(120, 60), new THREE.ShadowMaterial({ opacity: .16, depthWrite: false })); wallShade.receiveShadow = true; wallShade.position.set(0, 26, .02); scene.add(wallShade);
  yield;
  // The guide.
  const guide = new THREE.Group(), body = new THREE.Mesh(new THREE.PlaneGeometry(spr.cat[0].w, spr.cat[0].h).translate(0, spr.cat[0].h / 2, 0), spr.cat[0].mat); guide.add(body); scene.add(guide);
  const wheel = () => { const m = new THREE.Mesh(new THREE.PlaneGeometry(spr.wheel.w, spr.wheel.h), spr.wheel.mat); guide.add(m); return m; };
  const small = () => { const m = new THREE.Mesh(new THREE.PlaneGeometry(spr.smallWheel.w, spr.smallWheel.h), spr.smallWheel.mat); guide.add(m); return m; };
  const wheels = [wheel(), wheel()], tiny = [small(), small()];
  for (const m of [body, ...wheels, ...tiny]) { m.castShadow = true; m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: m.material.map, alphaTest: .5 }); }
  const stick = bookFold(new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 16, 8).translate(0, -8, 0), bookTint('#c99a5e'))); scene.add(stick); // a paper puppet on a dowel, held from below
  const guideShadow = blob.clone(); scene.add(guideShadow);
  bookWorld = { scene, cam, spr, props, grounds, wall, wallShade, sun, stick, guide, body, wheels, tiny, guideShadow, sky: BOOK_SKY.map(c => new THREE.Color(c).convertSRGBToLinear()) };
  bookBuilt = 1;
  yield;
}

/* ---------- Opening and closing, by turning a page ---------- */
function bookSnapshot() { const s = document.createElement('canvas'); s.width = sceneCanvas.width; s.height = sceneCanvas.height; s.getContext('2d').drawImage(sceneCanvas, 0, 0); return s; }
function openBook(c, viaKeyboard) {
  if (!renderer || !renderer.capabilities.isWebGL2) { openProject(c, viaKeyboard, true); return; } // can't draw the world here, so show the plain page
  if (!bookWorld && !bookBuilder) bookBuilder = buildBook();
  book = { c, viaKeyboard, phase: bookWorld ? 'ride' : 'build', x: BOOK_FLAT + 7, tx: BOOK_FLAT + 7, last: performance.now(), from: bookSnapshot(), flipAt: performance.now(), world: -1, say: null, moved: false, side: 1, spinAt: -1e9, costume: 0, hover: null, unit: .02, flingBy: 0, flingAt: 0 };
  if (COARSE) renderer.setPixelRatio(Math.min(maxPr, 1.5));
  hover = null; focusCard = null; glitch = 0; dirty = true;
  $('#btn-about').hidden = $('#btn-talk').hidden = true;
  live.textContent = 'A notebook. Scroll or use the arrow keys to move through it.';
  keyboardFocus(backBtn);
}
function closeBook() {
  book = null; renderer.setPixelRatio(maxPr); renderer.setRenderTarget(null); glitch = reduced ? 0 : .5; dirty = true;
  $('#btn-about').hidden = $('#btn-talk').hidden = false;
  live.textContent = ''; crt.style.cursor = 'grab';
}
const bookMove = amount => { book.tx += amount; if (Math.abs(amount) > .01) book.moved = true; dirty = true; };
const bookDrag = dx => { book.flingBy = dx; book.flingAt = performance.now(); bookMove(-dx * book.unit); }; // the page follows the finger
const bookFling = () => { if (performance.now() - book.flingAt < 80) bookMove(-book.flingBy * book.unit * 12); };
function bookProject(v) { v.project(bookWorld.cam); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H]; }
function bookPick(clientX, clientY) { // nearest thing under the pointer. Rectangles are close enough for paper cut-outs
  const [sx, sy] = toScene(clientX, clientY), v = new THREE.Vector3(); let best = null;
  for (const p of bookWorld.props) {
    if (!p.say || !p.mesh.visible) continue;
    const bottom = p.hang ? p.mesh.position.y - p.s.h : p.mesh.position.y;
    v.set(p.mesh.position.x, bottom, p.z); const [ax, ay] = bookProject(v);
    v.set(p.mesh.position.x + p.s.w / 2, bottom + p.s.h, p.z); const [bx, by] = bookProject(v);
    if (sx > ax - (bx - ax) && sx < bx && sy < ay && sy > by && (!best || p.z > best.z)) best = p;
  }
  return best;
}
function bookMapAt(clientX, clientY) { const [sx, sy] = toScene(clientX, clientY); const m = (book.mapHot || []).find(q => Math.hypot(sx - q.x, sy - q.y) < q.r); return m ? m.i : -1; }
function bookRideTo(i) { const base = i * BOOK_SIZE + BOOK_SIZE * .45; bookMove(base + BOOK_LOOP * Math.round((book.tx - base) / BOOK_LOOP) - book.tx); }
function bookHover(clientX, clientY) { book.mapHover = bookMapAt(clientX, clientY); if (book.mapHover >= 0) { book.hover = null; crt.style.cursor = 'pointer'; return; } const p = bookPick(clientX, clientY); if (p && p !== book.hover) p.kick = performance.now(); book.hover = p; crt.style.cursor = p ? 'pointer' : 'grab'; }
function bookClick(clientX, clientY) {
  const m = bookMapAt(clientX, clientY); if (m >= 0) { bookRideTo(m); return; }
  const p = bookPick(clientX, clientY);
  if (!p) return;
  p.kick = performance.now(); book.say = { text: p.say, prop: p, at: p.kick }; live.textContent = p.say;
  const photo = p.name.startsWith('photo-') && BOOK_PHOTOS.find(q => q.id === p.name); if (photo) zoomPicture(photo.src, photo.cap, clientX, clientY); // a pinned photo opens large
}

/* ---------- Drawing ---------- */
function bookWrapped(text, size, maxW) { g.font = `700 ${size}px ${BOOK_FONT}`; const lines = []; let line = ''; for (const w of text.split(' ')) { const n = line ? `${line} ${w}` : w; if (g.measureText(n).width > maxW && line) { lines.push(line); line = w; } else line = n; } lines.push(line); return lines; }
// The outfit for where Hoshi is, except while the song from the desk plays: then the headphones (Up late's outfit) stay on everywhere.
let bookSongOn = false;
const bookWear = () => bookSongOn ? 2 : book.world;
function bookBubble(text, ax, ay, alpha, below = false, side = false) { // below: the thing hangs from above, so the bubble sits under it and points up
  const size = Math.max(19, Math.min(28, H * .034)), lines = bookWrapped(text, size, Math.min(W * .62, 340)), bw = Math.max(...lines.map(l => g.measureText(l).width)) + size * 1.5, bh = lines.length * size * 1.14 + size * .95;
  if (side && ax - bw - size * 1.1 > W * .03) { // beside, to the left, pointing right: clear of the notes and titles above
    const x = ax - bw - size * 1.1, y = Math.max(H * .07, Math.min(H * .93 - bh, ay - bh * .2)), ty = Math.max(y + size * .8, Math.min(y + bh - size * .8, ay + size * .4)), edge = x + bw;
    g.save(); g.globalAlpha = alpha; g.lineJoin = 'round'; g.lineWidth = 3; g.strokeStyle = BOOK_INK; g.fillStyle = '#fffef6';
    g.beginPath(); g.roundRect(x, y, bw, bh, size * .7); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(edge - 1.5, ty - size * .42); g.lineTo(edge + size * .6, ty + size * .08); g.lineTo(edge - 1.5, ty + size * .42); g.fill(); g.beginPath(); g.moveTo(edge, ty - size * .42); g.lineTo(edge + size * .6, ty + size * .08); g.lineTo(edge, ty + size * .42); g.stroke();
    g.fillStyle = '#2d2b33'; g.textAlign = 'center'; g.textBaseline = 'middle'; lines.forEach((l, i) => g.fillText(l, x + bw / 2, y + size * .95 + i * size * 1.14)); g.restore();
    return;
  }
  const under = below || ay - bh - size * .8 < H * .07; // no room above, so it goes under and points up
  const x = Math.max(W * .06, Math.min(W * .94 - bw, ax - bw / 2)), y = under ? Math.min(H * .93 - bh, ay + size * .8) : ay - bh - size * .8;
  g.save(); g.globalAlpha = alpha; g.lineJoin = 'round'; g.lineWidth = 3; g.strokeStyle = BOOK_INK; g.fillStyle = '#fffef6';
  g.beginPath(); g.roundRect(x, y, bw, bh, size * .7); g.fill(); g.stroke();
  const tx = Math.max(x + size, Math.min(x + bw - size, ax)), edge = under ? y : y + bh, dir = under ? -1 : 1; // the tail leaves the edge nearest the thing, toward it
  g.beginPath(); g.moveTo(tx - size * .42, edge - dir * 1.5); g.lineTo(tx - size * .08, edge + dir * size * .6); g.lineTo(tx + size * .42, edge - dir * 1.5); g.fill(); g.beginPath(); g.moveTo(tx - size * .42, edge); g.lineTo(tx - size * .08, edge + dir * size * .6); g.lineTo(tx + size * .42, edge); g.stroke();
  g.fillStyle = '#2d2b33'; g.textAlign = 'center'; g.textBaseline = 'middle'; lines.forEach((l, i) => g.fillText(l, x + bw / 2, y + size * .95 + i * size * 1.14)); g.restore();
}
function bookPage() { // the blank page the loader sits on
  g.fillStyle = '#f5f2e8'; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(96,136,196,.5)'; g.lineWidth = 1.5; for (let y = H * .03; y < H; y += H * .05) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.strokeStyle = 'rgba(226,84,92,.65)'; g.beginPath(); g.moveTo(W * .12, 0); g.lineTo(W * .12, H); g.stroke();
}
function bookFlip(now) {
  if (!book.from) return;
  const t = (now - book.flipAt) / BOOK_FLIP_MS; if (t >= 1) { book.from = null; return; }
  const e = t * t * (3 - 2 * t), a = e * Math.PI / 2, c = Math.cos(a), s = Math.sin(a);
  g.fillStyle = `rgba(30,25,45,${(1 - e) * .28})`; g.fillRect(0, 0, W, H);
  g.save(); g.transform(c, -s * .13, 0, 1, 0, s * H * .05); g.drawImage(book.from, 0, 0, W, H);
  const l = g.createLinearGradient(0, 0, W, 0); l.addColorStop(0, `rgba(20,15,30,${e * .55})`); l.addColorStop(1, `rgba(255,255,255,${e * .25})`); g.fillStyle = l; g.fillRect(0, 0, W, H); g.restore();
  g.fillStyle = 'rgba(30,25,45,.45)'; g.fillRect(W * c, 0, 3, H);
}
/* ---------- The map: a small icon for each world, the one you are in raised; tap one to ride there ---------- */
const BOOK_MAP_ICONS = [
  (x, y, r) => { bookMapPath([[x - r * .42, y - r * .02], [x, y - r * .42], [x + r * .42, y - r * .02]], false); g.strokeRect(x - r * .3, y - r * .04, r * .6, r * .42); g.fillRect(x - r * .07, y + r * .14, r * .14, r * .24); }, // a house
  (x, y, r) => { g.beginPath(); g.arc(x, y - r * .04, r * .4, 0, Math.PI); g.closePath(); g.fill(); for (const d of [-.16, .04, .22]) bookMapPath([[x + r * d, y - r * .14], [x + r * (d - .06), y - r * .3], [x + r * (d + .02), y - r * .44]], false); }, // a bowl, steaming
  (x, y, r) => { g.beginPath(); g.arc(x, y, r * .4, .6, Math.PI * 2 - .6, false); g.arc(x + r * .18, y - r * .04, r * .3, Math.PI * 2 - .9, .9, true); g.closePath(); g.fill(); }, // the moon
  (x, y, r) => { g.beginPath(); g.moveTo(x - r * .44, y + r * .1); g.lineTo(x + r * .44, y + r * .1); g.lineTo(x + r * .28, y + r * .34); g.lineTo(x - r * .28, y + r * .34); g.closePath(); g.fill(); bookMapPath([[x, y + r * .1], [x, y - r * .42], [x + r * .3, y + r * .02], [x, y + r * .02]], false); }, // a boat
  (x, y, r) => { g.beginPath(); g.moveTo(x - r * .44, y + r * .34); g.lineTo(x, y - r * .4); g.lineTo(x + r * .44, y + r * .34); g.closePath(); g.fill(); g.fillStyle = '#fffef6'; g.beginPath(); g.moveTo(x - r * .1, y + r * .34); g.lineTo(x, y + r * .08); g.lineTo(x + r * .1, y + r * .34); g.closePath(); g.fill(); }, // a tent
];
function bookMapPath(pts, closed) { g.beginPath(); pts.forEach(([a, b], i) => g[i ? 'lineTo' : 'moveTo'](a, b)); if (closed) g.closePath(); g.stroke(); }
function bookMap(now) {
  const n = BOOK_MAP_ICONS.length, tall = W < H, r = tall ? 19 : 21, gap = r * .75, total = n * r * 2 + (n - 1) * gap;
  const x0 = (tall ? (W - total) / 2 : Math.max(28, W * .065)) + r, y = tall ? 98 : 70, a = Math.min(1, Math.max(0, (now - book.flipAt - BOOK_FLIP_MS) / 400));
  if (a <= 0) return;
  book.mapHot = [];
  g.save(); g.globalAlpha = a; g.lineCap = g.lineJoin = 'round';
  g.strokeStyle = 'rgba(38,37,43,.45)'; g.lineWidth = 2.5; g.setLineDash([4, 7]); g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + (n - 1) * (r * 2 + gap), y); g.stroke(); g.setLineDash([]); // the dotted road between them
  for (let i = 0; i < n; i++) {
    const on = i === book.world, hov = i === book.mapHover, cx = x0 + i * (r * 2 + gap), rr = r * (on ? 1.15 : hov ? 1.07 : 1), cy = y - (on ? 3 : 0);
    g.fillStyle = 'rgba(30,25,45,.3)'; g.beginPath(); g.arc(cx + 2.5, cy + 3.5, rr, 0, 7); g.fill();
    g.fillStyle = on ? '#ffd23f' : '#fffef6'; g.strokeStyle = BOOK_INK; g.lineWidth = 2.6; g.beginPath(); g.arc(cx, cy, rr, 0, 7); g.fill(); g.stroke();
    g.fillStyle = BOOK_INK; g.strokeStyle = BOOK_INK; g.lineWidth = 2.2; BOOK_MAP_ICONS[i](cx, cy, rr);
    if (on || hov) { g.font = `700 ${Math.round(r * .82)}px ${BOOK_FONT}`; g.textAlign = 'center'; g.textBaseline = 'top'; g.lineWidth = 5; g.strokeStyle = '#fffef6'; g.strokeText(BOOK_WORDS.worlds[i], cx, cy + rr + 5); g.fillStyle = BOOK_INK; g.fillText(BOOK_WORDS.worlds[i], cx, cy + rr + 5); }
    book.mapHot.push({ x: cx, y: cy, r: Math.max(22, rr + 4), i });
  }
  g.restore();
}
/* ---------- Bits in the air: dust behind the wheels, splashes behind the boat, petals blowing past on the way downhill ---------- */
function bookBits(dt, gx, ground, speed, onBoat, now) {
  if (reduced) return;
  const bits = book.bits || (book.bits = []), moving = Math.min(1, Math.abs(speed) / 3), side = book.side, back = gx - side * 1.1 * BOOK_CAT, rnd = Math.random;
  book.bitAt = (book.bitAt || 0) + dt * (onBoat ? 10 + moving * 30 : moving * 34);
  while (book.bitAt >= 1) {
    book.bitAt -= 1;
    if (onBoat) bits.push({ kind: 'splash', x: back - side * .4, y: -.15, z: 5, vx: -side * (.6 + rnd() * 1.6), vy: 1.4 + rnd() * 2, life: 0, max: .55 + rnd() * .3, r: .05 + rnd() * .07 });
    else if (moving > .1) bits.push({ kind: 'dust', x: back, y: bookRide(back) + .08, z: 5.05, vx: -side * (.5 + rnd() * .9), vy: .35 + rnd() * .5, life: 0, max: .5 + rnd() * .35, r: .12 + rnd() * .14 });
    if (!onBoat && moving > .3 && bookSlope(gx) * side < -.08 && rnd() < .35) bits.push({ kind: 'petal', x: gx + side * (2 + rnd() * 5), y: ground + 1 + rnd() * 3, z: 5.4, vx: -side * (2.4 + rnd() * 1.6), vy: -.25 - rnd() * .3, life: 0, max: 1.4 + rnd() * .6, r: .1 + rnd() * .06, spin: rnd() * 6, tone: rnd() < .6 ? '#f7a8c0' : '#fffef6' });
  }
  const v = new THREE.Vector3();
  for (let i = bits.length - 1; i >= 0; i--) {
    const b = bits[i]; b.life += dt; if (b.life >= b.max) { bits.splice(i, 1); continue; }
    b.x += b.vx * dt; b.y += b.vy * dt; if (b.kind === 'splash') b.vy -= 7 * dt; if (b.kind === 'petal') { b.spin += dt * 5; b.vy = -.3 + Math.sin(now / 300 + b.x) * .4; }
    v.set(b.x, b.y, b.z); const [sx, sy] = bookProject(v), k = 1 - b.life / b.max, px = b.r / book.unit;
    g.save(); g.globalAlpha = b.kind === 'dust' ? k * .55 : k;
    if (b.kind === 'dust') { g.fillStyle = '#e9dcc4'; g.beginPath(); g.arc(sx, sy, px * (1 + (1 - k) * 1.4), 0, 7); g.fill(); g.strokeStyle = 'rgba(38,37,43,.35)'; g.lineWidth = 1.2; g.stroke(); }
    else if (b.kind === 'splash') { g.fillStyle = '#7cc3ee'; g.strokeStyle = BOOK_INK; g.lineWidth = 1.4; g.beginPath(); g.ellipse(sx, sy, px, px * 1.3, 0, 0, 7); g.fill(); g.stroke(); }
    else { g.translate(sx, sy); g.rotate(b.spin); g.fillStyle = b.tone; g.strokeStyle = BOOK_INK; g.lineWidth = 1.3; g.beginPath(); g.ellipse(0, 0, px * 1.4, px * .7, 0, 0, 7); g.fill(); g.stroke(); }
    g.restore();
  }
}
function drawBook(now) {
  if (book.phase === 'build') {
    if (bookBuilder) { const r = bookBuilder.next(); if (r.done) bookBuilder = null; }
    bookPage();
    const y = H * .54, bw = Math.min(W * .62, 460), x = (W - bw) / 2, size = Math.max(18, Math.min(W * .05, 34));
    g.fillStyle = '#34323a'; g.font = `700 ${size}px ${BOOK_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('sharpening the pencils...', W / 2, y - size * 1.5);
    g.strokeStyle = BOOK_INK; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); for (let i = 0; i <= 60 && i / 60 <= bookBuilt; i++) g[i ? 'lineTo' : 'moveTo'](x + bw * i / 60, y + Math.sin(i * 1.7) * 7); g.stroke();
    bookFlip(now);
    if (bookWorld && !bookBuilder && !book.from) { book.from = bookSnapshot(); book.flipAt = now; book.phase = 'ride'; book.last = now; }
    return;
  }
  const w = bookWorld, dt = Math.min(.05, (now - book.last) / 1000); book.last = now;
  const before = book.x; book.x += (book.tx - book.x) * (reduced ? 1 : 1 - Math.exp(-dt * 6));
  const x = book.x, speed = dt ? (x - before) / dt : 0, aspect = W / H, tan = Math.tan(BOOK_FOV / 2 * Math.PI / 180);
  // The camera pulls back on climbs, drops, the jump and the bridge, and comes in close when Hoshi stops by something.
  const lead = aspect < 1 ? 0 : (book.lead || 2.4), cx = x - lead, steep = Math.min(1, Math.abs(bookSlope(cx)) / .7), wild = bookIn(cx, BOOK_GAP) || bookIn(cx, BOOK_BRIDGE);
  book.still = Math.abs(speed) < .15 ? (book.still || 0) + dt : 0;
  const zoomTo = book.still > 1.4 && steep < .05 ? .86 : 1; book.zoom = reduced ? 1 : (book.zoom || 1) + (zoomTo - (book.zoom || 1)) * (1 - Math.exp(-dt * 1.6)); // in close when he stops on the flat; the slopes' zoom is in BOOK_CAM
  // The camera rides its own curve (BOOK_CAM): turning to look along the land, tipping down over drops, sitting back on the wild parts.
  // A phone sees the same height of world, further back, so a whole note fits across it.
  const key = bookCamAt(bookMod(cx)), ease = reduced ? 1 : 1 - Math.exp(-dt * 2.4), c = book.cam || (book.cam = { ...key });
  for (const k of ['yaw', 'pitch', 'dist', 'lift']) c[k] += (key[k] - c[k]) * ease;
  const dist = Math.max(22, 8.6 / (2 * tan * aspect)) * book.zoom * c.dist, span = 2 * tan * dist, half = span * aspect / 2, time = now / 1000;
  book.unit = half * 2 / W; book.lead = half * .18;
  w.cam.aspect = aspect; w.cam.updateProjectionMatrix();
  const camTo = bookRide(cx); book.camY = book.camY == null || reduced ? camTo : book.camY + (camTo - book.camY) * (1 - Math.exp(-dt * 4)); const rise = book.camY; // the view climbs with the land
  const aimY = rise + 3.6 + c.lift + (aspect < 1 ? span * .12 : 0), yaw = c.yaw + look.x * .00012, pitch = c.pitch + look.y * .00008, tz = 2.6;
  w.cam.position.set(x + Math.sin(yaw) * Math.cos(pitch) * dist, aimY + Math.sin(pitch) * dist, tz + Math.cos(yaw) * Math.cos(pitch) * dist); w.cam.lookAt(x, aimY, tz);
  w.cam.updateMatrixWorld();
  w.sun.position.set(x - 9, 16, 20); w.sun.target.position.set(x, 0, 2); w.sun.target.updateMatrixWorld(); w.wallShade.position.x = w.wall.position.x;
  renderer.shadowMap.needsUpdate = true; // things move, so the shadows are drawn every frame
  w.wall.position.x = Math.round(x / 30) * 30;
  { const n = BOOK_WORDS.worlds.length, c = Math.round(x / BOOK_SIZE), d = x - c * BOOK_SIZE, t = Math.max(0, Math.min(1, (d + BOOK_FADE_W) / (BOOK_FADE_W * 2))), at = i => ((i % n) + n) % n; // the page's tint, crossfading over the nearest hill
    w.wall.material.color.lerpColors(w.sky[at(c - 1)], w.sky[at(c)], t * t * (3 - 2 * t)); }
  for (const f of w.grounds) { const fx = f.x + BOOK_LOOP * Math.round((x - f.x) / BOOK_LOOP); for (const m of f.meshes) m.position.x = fx; }
  const gx = x + Math.max(-half * .1, Math.min(half * .1, speed * .05)) - (aspect < 1 ? 0 : half * .18); // where Hoshi is
  // Things stand up out of the page as they come into view, and sink back on the way out.
  for (const p of w.props) {
    const px = p.x + BOOK_LOOP * Math.round((x - p.x) / BOOK_LOOP), away = Math.abs(px - x), spread = half * (1.3 + p.z / dist * .4), shown = away < spread + Math.max(p.s.w, 2) + 2;
    p.mesh.visible = shown; if (p.contact) p.contact.visible = shown;
    if (shown && p.mesh.userData.beam && !reduced) p.mesh.userData.beam.rotation.y = time * p.mesh.userData.beam.userData.spin; // the lighthouse's light, sweeping
    if (!shown) continue;
    const raw = reduced || p.noPop ? 1 : Math.max(0, Math.min(1, (spread + p.s.w * .5 + .4 - away) / (half * .34))), k = raw === 1 ? 1 : 1 + 2.7 * (raw - 1) ** 3 + 1.7 * (raw - 1) ** 2; // overshoots a little
    const kickT = (now - p.kick) / 1000, wiggle = kickT < 1.4 ? Math.sin(kickT * 16) * Math.exp(-kickT * 3.6) * .13 : 0, idle = reduced ? 0 : Math.sin(time * 1.3 + p.phase);
    p.mesh.position.x = px + (p.slide ? Math.sin(time * .7 + p.z) * p.slide : 0);
    // Hoshi passing by: things jump a little as he arrives, grass and flowers lean out of his way, the whale spouts.
    const near = px - gx;
    if (!p.flat && !p.noPop) { if (Math.abs(near) < 1.3 + p.s.w * .3) { if (!p.near) { p.near = true; if (!reduced) { p.kick = now; if (p.name === 'whale') for (let i = 0; i < 14; i++) (book.bits || (book.bits = [])).push({ kind: 'splash', x: px - .9 + Math.random() * .4, y: bookGround(px) + 2.6, z: p.z, vx: (Math.random() - .5) * 1.4, vy: 3 + Math.random() * 2.2, life: 0, max: .9, r: .06 + Math.random() * .06 }); } } } else if (Math.abs(near) > 3 + p.s.w * .3) p.near = false; }
    const bend = p.bend && !reduced ? -Math.sign(near) * .4 * Math.max(0, 1 - Math.abs(near) / 1.6) : 0;
    p.mesh.position.y = p.y + idle * p.bob + (p.hang ? (1 - k) * 7 : 0) + (p.flat && aspect < 1 ? span * .14 : 0) + (p.ground ? bookGround(px) : bookGround(p.x) - (p.noPop && !p.slide ? .35 : 0)); // tall screens have room above, clear of the speech bubbles; each world's things sit at its height
    p.mesh.rotation.z = p.tilt + wiggle + idle * p.sway + bend;
    if (p.twinkle && !reduced) p.mesh.scale.setScalar(1 + .12 * Math.sin(time * 3 + p.phase));
    if (p.mesh.isGroup) p.mesh.position.z = p.z; // models keep their depth
    if (p.flat) p.mesh.scale.setScalar(Math.max(.001, k)); else if (!p.hang) p.mesh.rotation.x = -(1 - k) * 1.35;
    if (p.flick && !reduced) p.mesh.scale.set(1 + Math.sin(time * 19) * .035, 1 + Math.sin(time * 13) * .07, 1);
    if (p.contact) { p.contact.position.set(px + .08, bookGround(px + .08) + .012, p.z + .04); p.contact.rotation.z = Math.atan(bookSlope(px + .08, bookGround)); }
  }
  // The cat, in whatever this world calls for.
  const inWorld = Math.floor((((x + 2) % BOOK_LOOP) + BOOK_LOOP) % BOOK_LOOP / BOOK_SIZE);
  if (inWorld !== book.world) {
    const first = book.world < 0; book.world = inWorld; book.spinAt = first || reduced ? -1e9 : now; if (first || reduced) book.costume = bookWear();
    book.say = { text: BOOK_WORDS.hello[inWorld], cat: true, at: now + (first ? BOOK_FLIP_MS + 250 : 500) };
    live.textContent = `${BOOK_WORDS.worlds[inWorld]}. ${BOOK_WORDS.hello[inWorld]}`;
  }
  if (Math.abs(speed) > .25) book.side = Math.sign(speed);
  const spin = Math.max(0, Math.min(1, (now - book.spinAt) / 460));
  if (spin >= .5 && book.costume !== bookWear()) book.costume = bookWear();
  w.body.material = w.spr.cat[book.costume].mat;
  const hopping = book.costume === 4, onBoat = book.costume === 3, moving = Math.min(1, Math.abs(speed) / 3);
  let lift = onBoat ? (reduced ? 0 : Math.sin(time * 1.6) * .13) - .3 : hopping ? Math.abs(Math.sin(gx * 1.6)) * .32 * moving : Math.abs(Math.sin(gx * 2.3)) * .05 * moving;
  // Over the land: along the slope; through the air over the chasm; on the bridge, which sags under him.
  const inAir = bookIn(gx, [BOOK_GAP[0] + .2, BOOK_GAP[1] - .2]), onBridge = bookIn(gx, BOOK_BRIDGE);
  const ground = bookRide(gx) - (onBridge ? .35 : 0), tilt = Math.max(-.75, Math.min(.75, Math.atan(bookSlope(gx))));
  if (inAir) lift = 0;
  if (!reduced) lift += Math.sin(time * 1.8 + 1.2) * .06; // held from below, never quite still
  // Hoshi at work: pushing hard uphill, leaning back downhill, a wobble on landing.
  const climb = bookSlope(gx) * book.side;
  if (!onBoat && !inAir && climb > .12 && moving > .15 && !reduced) lift += Math.abs(Math.sin(time * 15)) * .08 * Math.min(1, climb * 2);
  if (book.wasAir && !inAir) book.landAt = now; book.wasAir = inAir;
  const landT = (now - (book.landAt || -1e9)) / 1000, wobble = !reduced && landT < .9 ? Math.sin(landT * 26) * Math.exp(-landT * 5) * .14 : 0;
  w.guide.position.set(gx, lift + ground, 4.9); w.guide.scale.setScalar(BOOK_CAT);
  w.stick.position.set(gx + .08, lift + ground + 1.6, 4.82); w.stick.rotation.z = tilt * .3;
  w.guide.rotation.y = (book.side < 0 ? Math.PI : 0) + (spin < 1 ? spin * Math.PI * 2 : 0);
  w.guide.rotation.z = (onBoat ? (reduced ? 0 : Math.sin(time * 1.1) * .045) : -Math.max(-.05, Math.min(.05, speed * .004)) * book.side) + tilt * book.side + (climb < -.12 ? .08 : 0) + wobble; // facing left mirrors the turn, so the slope's sign follows the side
  const toX = u => (u - 220) / 100, toY = v => (427 - v) / 100; // from drawing units on the costume, whose sheet has a 7 unit margin
  const biking = book.costume <= 1, boarding = book.costume === 2;
  [[116, 342], [352, 342]].forEach(([u, v], i) => { const m = w.wheels[i]; m.visible = biking; m.position.set(toX(u), toY(v), i ? .01 : -.01); m.rotation.z = -gx / .67; });
  [[130, 392], [322, 392]].forEach(([u, v], i) => { const m = w.tiny[i]; m.visible = boarding; m.position.set(toX(u), toY(v), .01); m.rotation.z = -gx / .25; });
  w.guideShadow.position.set(gx, ground + .012, 4.95); w.guideShadow.rotation.z = tilt; w.guideShadow.scale.set(3.6 * BOOK_CAT, 1, .8); w.guideShadow.visible = !onBoat && !inAir;
  w.scene.updateMatrixWorld();
  renderer.setRenderTarget(null); renderer.render(w.scene, w.cam);
  g.drawImage(renderer.domElement, 0, 0, W, H); // same task as the render, while its buffer is still valid
  bookBits(dt, gx, ground, speed, onBoat, now);
  bookMap(now);
  // Words on top of the world.
  if (book.say && now >= book.say.at) {
    const t = now - book.say.at, hold = book.say.cat ? 2200 : 3200, alpha = Math.min(1, t / 160) * (1 - Math.max(0, (t - hold) / 300));
    if (alpha <= 0) book.say = null;
    else {
      const v = new THREE.Vector3(), p = book.say.prop;
      if (book.say.cat) v.set(gx + .05, 4.3 * BOOK_CAT + lift + ground, 4.9); else if (p.hang) v.set(p.mesh.position.x, p.mesh.position.y - p.s.h - .1, p.z); else v.set(p.mesh.position.x, p.mesh.position.y + p.s.h + .05, p.z);
      const [ax, ay] = bookProject(v);
      if (ax > -40 && ax < W + 40) bookBubble(book.say.text, ax, ay, alpha, !!(p && p.hang), book.say.cat && W > H); // Hoshi talks sideways on a wide screen, so the bubble never covers a title else book.say = null;
    }
  }
  if (!book.moved) { // how to get going, until they do
    const a = Math.min(1, Math.max(0, (now - book.flipAt - BOOK_FLIP_MS) / 500)), size2 = Math.max(18, Math.min(H * .036, 28)), bob = reduced ? 0 : Math.sin(now / 280) * 5;
    g.save(); g.globalAlpha = a; g.font = `700 ${size2}px ${BOOK_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 6; g.strokeStyle = '#fffef6';
    const hint = COARSE ? 'swipe to ride  →' : 'scroll to ride  →'; g.translate(bob, 0); const hy = aspect < 1 ? H * .935 : H * .9; g.strokeText(hint, W / 2, hy); g.fillStyle = '#2d2b33'; g.fillText(hint, W / 2, hy); g.restore();
  }
  bookFlip(now);
}

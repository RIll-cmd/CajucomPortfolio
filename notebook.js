/* Box 2's notebook: everything that isn't a project. Hoshi, a yellow Exotic Persian, rides through a pop-up book on lined paper.
   Every drawing is made here in code, and the photos are in photos/. The words are kept together below so they're easy to change. */
const BOOK_WORDS = {
  worlds: ['Home', 'Food', 'Up late', 'Places', 'My people'],
  hello: ['i am Hoshi. this is the notebook. no projects allowed.', 'is it dinner yet?', 'one more episode. then bed.', 'i do not like water. we go anyway.', 'everyone here is nicer than me.'],
  welcome: ["Hi, it's me!", "Cyrill's notebook", 'p.s. Hoshi the cat is in charge'],
  about: ['About me', 'From San Miguel, Bulacan. Aspiring software and AI engineer.', 'No projects past this page.'],
  food: ['Things I eat', "Forever meal: Yabu's Tornado Omelette Curry", 'Comfort food: McDo fries', 'Will never eat: Ginisang Ampalaya'],
  late: ['Up too late', 'On repeat: Mr. Incorrect', 'Now playing: ZZZ', 'Still watching: Loki'],
  places: ['Places', 'Been to: Hong Kong, Baguio, La Union', 'Going next: Japan', 'Took my breath away: La Union', 'Most memories: Baguio'],
  people: ['My people', 'My family, and the two cats who run the house.'],
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
  { id: 'photo-clarissa', src: 'photos/clarissa.jpg', cap: 'Clarissa', tint: '#f4b6a5', focus: .1 },
  { id: 'photo-erwin', src: 'photos/erwin.jpg', cap: 'Erwin', tint: '#f4b6a5', focus: .1 },
  { id: 'photo-hoshi', src: 'photos/orange-face.jpg', cap: 'Hoshi', tint: '#ffd9a0', focus: .4 },
  { id: 'photo-off', src: 'photos/hoshi-floor.jpg', cap: 'Hoshi, off duty', tint: '#ffd9a0', focus: .5 },
  { id: 'photo-shiro', src: 'photos/tabby-bow.jpg', cap: 'Shiro', tint: '#a9dcf0', focus: .25 },
];
const BOOK_SIZE = 36, BOOK_LOOP = BOOK_SIZE * BOOK_WORDS.worlds.length, BOOK_FLIP_MS = reduced ? 1 : 850;
const BOOK_PX = COARSE ? .75 : 1.25, BOOK_FOV = 36, BOOK_CAT = 1.22;
const BOOK_INK = '#26252b', BOOK_FONT = 'Gaegu, "Comic Sans MS", cursive';
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
  x.save(); x.fillStyle = color; x.globalAlpha = .9; x.fill(shape); x.clip(shape); x.globalAlpha = 1;
  const [x0, y0, x1, y1] = shape.box, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, reach = Math.hypot(x1 - x0, y1 - y0) / 2 + 4, dx = Math.cos(angle), dy = Math.sin(angle);
  for (let d = -reach; d < reach; d += 4.5 + bookRnd() * 3) {
    const ox = cx - dy * d, oy = cy + dx * d;
    x.strokeStyle = bookRnd() < .5 ? 'rgba(255,255,255,.2)' : 'rgba(40,20,50,.08)'; x.lineWidth = 1.5 + bookRnd() * 2;
    x.beginPath(); x.moveTo(ox - dx * reach, oy - dy * reach); x.lineTo(ox + dx * reach, oy + dy * reach); x.stroke();
  }
  x.restore();
}
function bookInk(x, shape, width = 4.2, color = BOOK_INK) { x.lineJoin = x.lineCap = 'round'; x.strokeStyle = color; x.lineWidth = width; x.stroke(shape); x.globalAlpha = .4; x.save(); x.translate(.9, -.7); x.lineWidth = width * .6; x.stroke(shape); x.restore(); x.globalAlpha = 1; }
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
  const make = function* (list) { for (const [name, w, h, draw, opts] of list) { spr[name] = bookSprite(w, h, draw, opts); bookBuilt += .9 / 58; yield; } };
  spr.cat = BOOK_COSTUMES.map((draw, i) => bookSprite(4.4, 4.2, draw, { edge: 5 })); bookBuilt = .1; yield;
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
    ['dusk', 35.4, 13, bookArt.dusk, { scale: .42, edge: 0 }], ['pine', 3.6, 7.4, bookArt.pine], ['tent', 6.4, 4.6, bookArt.tent], ['fire', 2.5, 2.7, bookArt.fire], ['owl', 1.7, 2.2, bookArt.owl], ['marshmallow', 2.2, 2.2, bookArt.marshmallow],
    ['people', 5, 3.9, bookNote(BOOK_WORDS.people.slice(1), { title: BOOK_WORDS.people[0], tape: '#c7e6b4' })],
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
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(120, 60), new THREE.MeshBasicMaterial({ map: pt, toneMapped: false })); wall.position.set(0, 30, 0); wall.renderOrder = -3; scene.add(wall);
  bookBuilt = .94; yield;

  const flatMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const stickMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xb98a52).convertSRGBToLinear(), toneMapped: false });
  const threadMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x9b7a56).convertSRGBToLinear(), toneMapped: false });
  const blur = tex => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, toneMapped: false, uniforms: { map: { value: tex }, a: { value: .3 } }, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }', fragmentShader: 'varying vec2 vUv; uniform sampler2D map; uniform float a; void main(){ float s = texture2D(map,vUv,3.5).a; gl_FragColor = vec4(.2,.24,.42,s*a); }' });
  const blob = new THREE.Mesh(new THREE.CircleGeometry(.5, 20).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x28305a, transparent: true, opacity: .2, depthWrite: false, toneMapped: false })); // a soft-ish contact shadow on the ground
  const props = [];
  const put = (name, wx, z, o = {}) => {
    const s = spr[name], hang = !!o.hang, y = o.y || 0, geo = new THREE.PlaneGeometry(s.w, s.h).translate(0, hang ? -s.h / 2 : s.h / 2, 0), mesh = new THREE.Mesh(geo, s.mat);
    const p = { name, s, x: wx, z, y, hang, mesh, say: o.say, tilt: o.tilt || 0, flat: !!o.flat, sway: o.sway ?? (hang ? .035 : 0), bob: o.bob || 0, phase: wx * 1.3, flick: !!o.flick, slide: o.slide || 0, kick: -1e9, noPop: !!o.noPop, shadow: o.shadow !== false };
    mesh.position.set(wx, y, z); mesh.renderOrder = o.order || 0; scene.add(mesh);
    if (hang) { const t = new THREE.Mesh(new THREE.PlaneGeometry(.035, 30).translate(0, 15, 0), threadMat); t.position.y = -.02; mesh.add(t); }
    if (o.stick) { const t = new THREE.Mesh(new THREE.PlaneGeometry(.12, y + .2).translate(0, -(y + .2) / 2, 0), stickMat); t.position.set(0, .2, -.01); mesh.add(t); }
    if (p.shadow && !o.noPop) { p.shade = new THREE.Mesh(geo, blur(s.tex)); p.shade.renderOrder = -1; scene.add(p.shade); }
    if (!hang && !p.flat && !y && p.shadow) { p.contact = blob.clone(); p.contact.scale.set(s.w * 1.05, 1, Math.min(1.4, s.w * .24)); scene.add(p.contact); }
    props.push(p); return p;
  };
  const at = (world, u) => world * BOOK_SIZE + u;
  // Home
  put('hills', at(0, 18), .04, { noPop: true, shadow: false, order: -2 });
  put('cloud', at(0, 3), 1.2, { hang: true, y: 10.1, say: 'i am just a cloud.' }); put('cloud', at(0, 25), .8, { hang: true, y: 10.8, say: 'still a cloud.' });
  put('welcome', at(0, 7), .08, { y: 5, flat: true, shadow: false, tilt: .025 });
  put('tree', at(0, 1), 1.6, { say: 'just a tree. a good one.' });
  put('about', at(0, 15.7), .1, { y: 4.1, flat: true, tilt: -.03, say: 'hi. this is me.' }); put('photo-home', at(0, 20), .1, { y: 4.7, flat: true, tilt: .06, say: 'that is me. Hoshi. look at the tongue.' }); put('photo-off', at(0, 11.8), .1, { y: 5.3, flat: true, tilt: -.05, say: 'also me. working hard.' });
  put('house', at(0, 26), 1.4, { say: 'Home: San Miguel, Bulacan.' }); put('mailbox', at(0, 18.5), 3.6, { say: 'no letters. only cat hair.' }); put('tree', at(0, 33.2), 1.5);
  for (const [u, z, n] of [[5.5, 5.6, 'grass'], [11.5, 3.6, 'flower'], [13, 5.8, 'grass'], [21, 5.7, 'flower'], [22.5, 5.9, 'grass'], [30, 5.2, 'grass'], [33, 3.5, 'flower']]) put(n, at(0, u), z, { shadow: n === 'grass' ? false : undefined });
  // Food
  put('lights', at(1, 7), 1.2, { hang: true, y: 10.5, sway: .015 }); put('lights', at(1, 22), 1.2, { hang: true, y: 10.1, sway: .015 });
  put('food', at(1, 7.6), .1, { y: 3.9, flat: true, tilt: .025, say: 'curry first. questions later.' });
  put('egg', at(1, 1.8), .9, { hang: true, y: 9.8, say: 'i am the sun of this page.' });
  put('stall', at(1, 16), 1.4, { say: 'Yabu, if you are asking.' }); put('bowl', at(1, 26), 2.8, { say: 'Tornado Omelette Curry. hot. wait.' });
  put('boba', at(1, 12.6), 4.4, { say: 'half sugar. no regrets.' }); put('dumplings', at(1, 4), 4.4, { say: 'there were six.' }); put('icecream', at(1, 31.5), 4, { say: 'mine.' }); put('photo-food', at(1, 32), .1, { y: 4.6, flat: true, tilt: -.05, say: 'coffee, by the sea.' });
  // Up late
  put('night', at(2, 18), .05, { noPop: true, shadow: false, order: -2, y: -.2 });
  put('moon', at(2, 6), .9, { hang: true, y: 11, say: 'go to sleep.' });
  for (const [u, y] of [[1.5, 10.4], [11.5, 11.4], [20.5, 11], [28, 10.4], [33.5, 11.6]]) put('star', at(2, u), 1, { hang: true, y, sway: .08 });
  put('late', at(2, 10.2), .1, { y: 3.9, flat: true, tilt: -.025, say: 'what keeps me up.' });
  put('desk', at(2, 21), 1.6, { say: 'This is where the hours go.' }); put('guitar', at(2, 3), 2.6, { say: 'mostly for decoration.' }); put('record', at(2, 15.6), .1, { y: 4.4, flat: true, tilt: .08, say: 'Mr. Incorrect. on repeat.' }); put('cassette', at(2, 28.5), .1, { y: 5.4, flat: true, tilt: -.06, say: 'still Mr. Incorrect.' });
  put('controller', at(2, 30), 3.6, { y: 1.8, stick: true, say: 'ZZZ. one more run.', bob: .06 }); put('photo-late', at(2, 33.5), .1, { y: 3.2, flat: true, tilt: .05, say: 'a late night worth keeping.' });
  // Places
  put('sun', at(3, 23), .9, { hang: true, y: 11.3, say: 'too cool to set.' }); put('cloud', at(3, 7), .8, { hang: true, y: 10.8 }); put('gull', at(3, 12), 1.5, { hang: true, y: 8.9, sway: .1, say: 'mine? mine? mine?' }); put('gull', at(3, 16), 1.2, { hang: true, y: 10, sway: .1 });
  put('places', at(3, 8.5), .1, { y: 3.9, flat: true, tilt: .03, say: 'where I have been.' });
  put('lighthouse', at(3, 3), 1.2, { say: 'Hong Kong. Baguio. La Union.' }); put('island', at(3, 18), 1.8, { say: 'Japan is next.' }); put('whale', at(3, 28), 3, { bob: .22, say: 'wooooo.' }); put('bottle', at(3, 13), 4.5, { bob: .2, sway: .09, say: 'a memory, in a bottle.' }); put('photo-falls', at(3, 33.2), .1, { y: 4.6, flat: true, tilt: -.06, say: 'a good day out.' }); put('photo-hk', at(3, 13.4), .1, { y: 4.8, flat: true, tilt: .05, say: 'Hong Kong. been there.' }); put('photo-baguio', at(3, 17.4), .1, { y: 5.5, flat: true, tilt: -.04, say: 'Baguio. the most memories.' }); put('photo-launion', at(3, 27.6), .1, { y: 4.9, flat: true, tilt: .05, say: 'La Union. took my breath away.' });
  for (const [z, off] of [[1.1, 0], [3.7, 11], [5.9, 23]]) put('waves', at(3, 18) + off * .05, z, { noPop: true, shadow: false, slide: .32, bob: .05 });
  // My people
  put('dusk', at(4, 18), .05, { noPop: true, shadow: false, order: -2, y: -.2 });
  put('star', at(4, 5), 1, { hang: true, y: 11.4, sway: .08 }); put('star', at(4, 26), 1, { hang: true, y: 11.1, sway: .08 });
  put('people', at(4, 7.6), .1, { y: 4.3, flat: true, tilt: -.03, say: 'my family, and two cats.' }); put('photo-clarissa', at(4, 12), .1, { y: 4.8, flat: true, tilt: .05, say: 'Clarissa Cajucom.' }); put('photo-erwin', at(4, 18.3), .1, { y: 4.9, flat: true, tilt: -.04, say: 'Erwin Cajucom.' }); put('photo-hoshi', at(4, 22), .1, { y: 4.7, flat: true, tilt: .05, say: 'Hoshi. orange. exotic. in charge.' }); put('photo-shiro', at(4, 26), .1, { y: 4.9, flat: true, tilt: -.05, say: 'Shiro. bow tie optional.' });
  put('pine', at(4, 1.4), 1.6); put('pine', at(4, 15.8), 1.1); put('tent', at(4, 21), 1.8, { say: 'Sleeps two. And one very large cat.' }); put('pine', at(4, 34.5), 1.4);
  put('owl', at(4, 15.8), 1.6, { y: 3.4, stick: false, say: 'who?', shadow: false }); put('fire', at(4, 15.8), 4.2, { flick: true, say: 'careful. the cat has already tried.' });
  put('marshmallow', at(4, 19.6), 5.1, { shadow: false, say: 'toasted, not burnt.' });
  put('hi', at(4, 31), .1, { y: 4.6, flat: true, tilt: .03, say: 'open to work. come say hi.' });
  // The ground: one coloured sheet a world, folded down at the front.
  const floors = [
    [['#9fd18c', 'rgba(50,110,50,.14)'], x => { x.fillStyle = '#eba98f'; x.fillRect(0, 300, 2048, 96); x.strokeStyle = '#b9755e'; x.lineWidth = 3; for (let i = 0; i < 2048; i += 58) { x.beginPath(); x.moveTo(i, 300 + (i % 116 ? 0 : 48)); x.lineTo(i, 348 + (i % 116 ? 0 : 48)); x.stroke(); } x.beginPath(); x.moveTo(0, 348); x.lineTo(2048, 348); x.moveTo(0, 300); x.lineTo(2048, 300); x.moveTo(0, 396); x.lineTo(2048, 396); x.stroke(); }],
    [['#f6cf9a', 'rgba(160,90,30,.14)'], x => { for (let a = 0; a < 2048; a += 92) for (let b = 0; b < 512; b += 92) if (((a + b) / 92) % 2) { x.fillStyle = 'rgba(224,110,80,.3)'; x.fillRect(a, b, 92, 92); } }],
    [['#8c7fd0', 'rgba(40,20,110,.17)'], x => { x.fillStyle = '#d95f76'; x.fillRect(0, 290, 2048, 130); x.fillStyle = '#ffd24c'; x.fillRect(0, 306, 2048, 8); x.fillRect(0, 396, 2048, 8); }],
    [['#a7d8f4', 'rgba(30,90,160,.16)'], null],
    [['#7db587', 'rgba(20,70,50,.17)'], x => { x.fillStyle = '#c9a26b'; x.beginPath(); x.moveTo(0, 310); for (let a = 0; a <= 2048; a += 64) x.lineTo(a, 310 + Math.sin(a * .03) * 10); for (let a = 2048; a >= 0; a -= 64) x.lineTo(a, 402 + Math.cos(a * .03) * 10); x.fill(); }],
  ];
  const grounds = [];
  floors.forEach(([colors, strip], i) => {
    const tex = bookFloor(colors, strip), top = new THREE.Mesh(new THREE.PlaneGeometry(BOOK_SIZE + .02, 7).rotateX(-Math.PI / 2).translate(0, 0, 3.5), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    const drop = new THREE.Mesh(new THREE.PlaneGeometry(BOOK_SIZE + .02, 8).translate(0, -4, 7), new THREE.MeshBasicMaterial({ map: tex, color: 0xb6b6c6, toneMapped: false }));
    scene.add(top, drop); grounds.push({ x: at(i, 18), top, drop });
    bookBuilt = Math.min(.99, bookBuilt + .008);
  });
  yield;
  // The guide.
  const guide = new THREE.Group(), body = new THREE.Mesh(new THREE.PlaneGeometry(spr.cat[0].w, spr.cat[0].h).translate(0, spr.cat[0].h / 2, 0), spr.cat[0].mat); guide.add(body); scene.add(guide);
  const wheel = () => { const m = new THREE.Mesh(new THREE.PlaneGeometry(spr.wheel.w, spr.wheel.h), spr.wheel.mat); guide.add(m); return m; };
  const small = () => { const m = new THREE.Mesh(new THREE.PlaneGeometry(spr.smallWheel.w, spr.smallWheel.h), spr.smallWheel.mat); guide.add(m); return m; };
  const wheels = [wheel(), wheel()], tiny = [small(), small()];
  const guideShadow = blob.clone(); scene.add(guideShadow);
  bookWorld = { scene, cam, spr, props, grounds, wall, guide, body, wheels, tiny, guideShadow };
  bookBuilt = 1;
  yield;
}

/* ---------- Opening and closing, by turning a page ---------- */
function bookSnapshot() { const s = document.createElement('canvas'); s.width = sceneCanvas.width; s.height = sceneCanvas.height; s.getContext('2d').drawImage(sceneCanvas, 0, 0); return s; }
function openBook(c, viaKeyboard) {
  if (!renderer || !renderer.capabilities.isWebGL2) { openProject(c, viaKeyboard, true); return; } // can't draw the world here, so show the plain page
  if (!bookWorld && !bookBuilder) bookBuilder = buildBook();
  book = { c, viaKeyboard, phase: bookWorld ? 'ride' : 'build', x: 7, tx: 7, last: performance.now(), from: bookSnapshot(), flipAt: performance.now(), world: -1, say: null, moved: false, side: 1, spinAt: -1e9, costume: 0, hover: null, unit: .02, flingBy: 0, flingAt: 0 };
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
function bookHover(clientX, clientY) { const p = bookPick(clientX, clientY); if (p && p !== book.hover) p.kick = performance.now(); book.hover = p; crt.style.cursor = p ? 'pointer' : 'grab'; }
function bookClick(clientX, clientY) {
  const p = bookPick(clientX, clientY);
  if (!p) return;
  p.kick = performance.now(); book.say = { text: p.say, prop: p, at: p.kick }; live.textContent = p.say;
}

/* ---------- Drawing ---------- */
function bookWrapped(text, size, maxW) { g.font = `700 ${size}px ${BOOK_FONT}`; const lines = []; let line = ''; for (const w of text.split(' ')) { const n = line ? `${line} ${w}` : w; if (g.measureText(n).width > maxW && line) { lines.push(line); line = w; } else line = n; } lines.push(line); return lines; }
function bookBubble(text, ax, ay, alpha) {
  const size = Math.max(19, Math.min(28, H * .034)), lines = bookWrapped(text, size, Math.min(W * .62, 340)), bw = Math.max(...lines.map(l => g.measureText(l).width)) + size * 1.5, bh = lines.length * size * 1.14 + size * .95;
  const x = Math.max(W * .06, Math.min(W * .94 - bw, ax - bw / 2)), y = Math.max(H * .07, ay - bh - size * .8);
  g.save(); g.globalAlpha = alpha; g.lineJoin = 'round'; g.lineWidth = 3; g.strokeStyle = BOOK_INK; g.fillStyle = '#fffef6';
  g.beginPath(); g.roundRect(x, y, bw, bh, size * .7); g.fill(); g.stroke();
  const tx = Math.max(x + size, Math.min(x + bw - size, ax)); g.beginPath(); g.moveTo(tx - size * .42, y + bh - 1.5); g.lineTo(tx - size * .08, y + bh + size * .6); g.lineTo(tx + size * .42, y + bh - 1.5); g.fill(); g.beginPath(); g.moveTo(tx - size * .42, y + bh); g.lineTo(tx - size * .08, y + bh + size * .6); g.lineTo(tx + size * .42, y + bh); g.stroke();
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
  // A phone sees the same height of world, further back, so a whole note fits across it.
  const dist = Math.max(23, 8.6 / (2 * tan * aspect)), span = 2 * tan * dist, half = span * aspect / 2, aim = Math.max(4.1, span * .5 - 2.6), time = now / 1000;
  book.unit = half * 2 / W;
  w.cam.aspect = aspect; w.cam.updateProjectionMatrix();
  w.cam.position.set(x + look.x * .004, aim + 2.6 - look.y * .003, dist); w.cam.lookAt(x + look.x * .002, aim, 0); w.cam.updateMatrixWorld();
  w.wall.position.x = Math.round(x / 30) * 30;
  for (const f of w.grounds) { const fx = f.x + BOOK_LOOP * Math.round((x - f.x) / BOOK_LOOP); f.top.position.x = f.drop.position.x = fx; }
  // Things stand up out of the page as they come into view, and sink back on the way out.
  for (const p of w.props) {
    const px = p.x + BOOK_LOOP * Math.round((x - p.x) / BOOK_LOOP), away = Math.abs(px - x), spread = half * (1 + p.z / dist * .4), shown = away < spread + Math.max(p.s.w, 2) + 2;
    p.mesh.visible = shown; if (p.shade) p.shade.visible = shown; if (p.contact) p.contact.visible = shown;
    if (!shown) continue;
    const raw = reduced || p.noPop ? 1 : Math.max(0, Math.min(1, (spread + p.s.w * .5 + .4 - away) / (half * .34))), k = raw === 1 ? 1 : 1 + 2.7 * (raw - 1) ** 3 + 1.7 * (raw - 1) ** 2; // overshoots a little
    const kickT = (now - p.kick) / 1000, wiggle = kickT < 1.4 ? Math.sin(kickT * 16) * Math.exp(-kickT * 3.6) * .13 : 0, idle = reduced ? 0 : Math.sin(time * 1.3 + p.phase);
    p.mesh.position.x = px + (p.slide ? Math.sin(time * .7 + p.z) * p.slide : 0);
    p.mesh.position.y = p.y + idle * p.bob + (p.hang ? (1 - k) * 7 : 0) + (p.flat && aspect < 1 ? span * .14 : 0); // tall screens have room above, clear of the speech bubbles
    p.mesh.rotation.z = p.tilt + wiggle + idle * p.sway;
    if (p.flat) p.mesh.scale.setScalar(Math.max(.001, k)); else if (!p.hang) p.mesh.rotation.x = -(1 - k) * 1.35;
    if (p.flick && !reduced) p.mesh.scale.set(1 + Math.sin(time * 19) * .035, 1 + Math.sin(time * 13) * .07, 1);
    if (p.shade) { const off = .22 + p.z * .13; p.shade.position.set(p.mesh.position.x + off, p.mesh.position.y - p.z * .055 + (p.flat ? -.07 : 0), .03); p.shade.rotation.z = p.mesh.rotation.z; p.shade.scale.set(p.flat ? k : 1, Math.max(.001, p.flat ? k : k), 1); p.shade.material.uniforms.a.value = p.flat ? .3 : Math.max(.12, .32 - p.z * .03); }
    if (p.contact) p.contact.position.set(px + .08, .012, p.z + .04);
  }
  // The cat, in whatever this world calls for.
  const inWorld = Math.floor((((x + 2) % BOOK_LOOP) + BOOK_LOOP) % BOOK_LOOP / BOOK_SIZE);
  if (inWorld !== book.world) {
    const first = book.world < 0; book.world = inWorld; book.spinAt = first || reduced ? -1e9 : now; if (first || reduced) book.costume = inWorld;
    book.say = { text: BOOK_WORDS.hello[inWorld], cat: true, at: now + (first ? BOOK_FLIP_MS + 250 : 500) };
    live.textContent = `${BOOK_WORDS.worlds[inWorld]}. ${BOOK_WORDS.hello[inWorld]}`;
  }
  if (Math.abs(speed) > .25) book.side = Math.sign(speed);
  const spin = Math.max(0, Math.min(1, (now - book.spinAt) / 460));
  if (spin >= .5 && book.costume !== book.world) book.costume = book.world;
  w.body.material = w.spr.cat[book.costume].mat;
  const gx = x + Math.max(-half * .1, Math.min(half * .1, speed * .05)) - (aspect < 1 ? 0 : half * .18), hopping = book.costume === 4, onBoat = book.costume === 3, moving = Math.min(1, Math.abs(speed) / 3);
  const lift = onBoat ? (reduced ? 0 : Math.sin(time * 1.6) * .13) - .3 : hopping ? Math.abs(Math.sin(gx * 1.6)) * .32 * moving : Math.abs(Math.sin(gx * 2.3)) * .05 * moving;
  w.guide.position.set(gx, lift, 4.9); w.guide.scale.setScalar(BOOK_CAT);
  w.guide.rotation.y = (book.side < 0 ? Math.PI : 0) + (spin < 1 ? spin * Math.PI * 2 : 0);
  w.guide.rotation.z = onBoat ? (reduced ? 0 : Math.sin(time * 1.1) * .045) : -Math.max(-.05, Math.min(.05, speed * .004)) * book.side;
  const toX = u => (u - 220) / 100, toY = v => (427 - v) / 100; // from drawing units on the costume, whose sheet has a 7 unit margin
  const biking = book.costume <= 1, boarding = book.costume === 2;
  [[116, 342], [352, 342]].forEach(([u, v], i) => { const m = w.wheels[i]; m.visible = biking; m.position.set(toX(u), toY(v), i ? .01 : -.01); m.rotation.z = -gx / .67; });
  [[130, 392], [322, 392]].forEach(([u, v], i) => { const m = w.tiny[i]; m.visible = boarding; m.position.set(toX(u), toY(v), .01); m.rotation.z = -gx / .25; });
  w.guideShadow.position.set(gx, .012, 4.95); w.guideShadow.scale.set(3.6 * BOOK_CAT, 1, .8); w.guideShadow.visible = !onBoat;
  w.scene.updateMatrixWorld();
  renderer.setRenderTarget(null); renderer.render(w.scene, w.cam);
  g.drawImage(renderer.domElement, 0, 0, W, H); // same task as the render, while its buffer is still valid
  // Words on top of the world.
  if (book.say && now >= book.say.at) {
    const t = now - book.say.at, hold = book.say.cat ? 2200 : 3200, alpha = Math.min(1, t / 160) * (1 - Math.max(0, (t - hold) / 300));
    if (alpha <= 0) book.say = null;
    else {
      const v = new THREE.Vector3(), p = book.say.prop;
      if (book.say.cat) v.set(gx + .05, 4.3 * BOOK_CAT + lift, 4.9); else if (p.hang) v.set(p.mesh.position.x, p.mesh.position.y - p.s.h - .1, p.z); else v.set(p.mesh.position.x, p.mesh.position.y + p.s.h + .05, p.z);
      const [ax, ay] = bookProject(v);
      if (ax > -40 && ax < W + 40) bookBubble(book.say.text, ax, p && p.hang ? ay + H * .17 : ay, alpha); else book.say = null;
    }
  }
  if (!book.moved) { // how to get going, until they do
    const a = Math.min(1, Math.max(0, (now - book.flipAt - BOOK_FLIP_MS) / 500)), size2 = Math.max(18, Math.min(H * .036, 28)), bob = reduced ? 0 : Math.sin(now / 280) * 5;
    g.save(); g.globalAlpha = a; g.font = `700 ${size2}px ${BOOK_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 6; g.strokeStyle = '#fffef6';
    const hint = COARSE ? 'swipe to ride  →' : 'scroll to ride  →'; g.translate(bob, 0); const hy = aspect < 1 ? H * .935 : H * .9; g.strokeText(hint, W / 2, hy); g.fillStyle = '#2d2b33'; g.fillText(hint, W / 2, hy); g.restore();
  }
  bookFlip(now);
}

/* Personal's folded-paper models: the house, the food stall, the desk, the lighthouse, the tent and the bridge's planks.
   Boxes, prisms and cylinders with drawn faces, ink along every fold, and real shadows. Each one's origin is the bottom of its
   back face, so standing up from lying flat against the page is a turn about that edge, like a pop-up. All original drawings. */
let BOOK_FOLD_INK = null;
function bookFace(w, h, draw, { scale = 70, repeat = false } = {}) { // a drawn face, w by h world units, in the notebook's own pencil
  const c = document.createElement('canvas'); c.width = Math.max(8, Math.ceil(w * scale)); c.height = Math.max(8, Math.ceil(h * scale));
  const x = c.getContext('2d'); x.scale(c.width / (w * 100), c.height / (h * 100)); draw(x, w * 100, h * 100);
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-atop';
  for (let i = 0; i < c.width * c.height / 700; i++) { x.fillStyle = bookRnd() < .5 ? 'rgba(255,255,255,.08)' : 'rgba(30,20,40,.05)'; x.fillRect(bookRnd() * c.width, bookRnd() * c.height, 1 + bookRnd() * 2, 1 + bookRnd() * 2); } // paper grain
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
// Faces are lit by hand, as the reference bakes its light: the front full, the top a touch brighter, the sides darker.
const bookLit = (tex, shade = 1, o = {}) => new THREE.MeshBasicMaterial({ map: tex, color: new THREE.Color(shade, shade, shade), toneMapped: false, ...o });
const bookTint = (hex, shade = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).convertSRGBToLinear().multiplyScalar(shade), toneMapped: false });
function bookFold(mesh, angle = 25) { // ink along the folds, and a shadow
  BOOK_FOLD_INK = BOOK_FOLD_INK || new THREE.LineBasicMaterial({ color: new THREE.Color(0x3a3438).convertSRGBToLinear(), toneMapped: false, transparent: true, opacity: .8 });
  mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, angle), BOOK_FOLD_INK)); mesh.castShadow = true; return mesh;
}
// A box, given [right, left, top, bottom, front, back] or one colour for all, shaded by side.
function bookBlock(w, h, d, faces) {
  const mats = Array.isArray(faces) ? faces : [bookTint(faces, .78), bookTint(faces, .9), bookTint(faces, 1.06), bookTint(faces, .6), bookTint(faces, 1), bookTint(faces, .7)];
  return bookFold(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats));
}
// A prism along z from 0 to d: a triangle w wide and h high (its peak shifted by lean); caps and slopes may take drawn faces.
function bookPrism(w, h, d, capMat, slopeMat, lean = 0) {
  const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(lean, h); s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
  const uv = geo.attributes.uv, pos = geo.attributes.position, caps = geo.groups[0];
  for (let i = 0; i < pos.count; i++) if (i < caps.start + caps.count) uv.setXY(i, (pos.getX(i) + w / 2) / w, pos.getY(i) / h); else { const along = Math.hypot(pos.getX(i) + w / 2, pos.getY(i)); uv.setXY(i, along / (w * .6), pos.getZ(i) / d); }
  return bookFold(new THREE.Mesh(geo, [capMat, slopeMat]));
}
const bookPlace = (m, x, y, z, ry = 0) => { m.position.set(x, y, z); m.rotation.y = ry; return m; };

const BOOK_MODELS = {
  house() { // a cream house with a red tiled roof, a blue door and a chimney
    const g = new THREE.Group(), w = 6, h = 4.2, d = 3.2;
    const wall = (ww, hh, door) => bookFace(ww, hh, (x, W, H) => {
      bookPencil(x, bookPoly([[0, 0], [W, 0], [W, H], [0, H]], true, .2), '#fbefd5', -.4);
      x.strokeStyle = 'rgba(160,120,80,.25)'; x.lineWidth = 2; for (let y = 34; y < H; y += 34) { x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); }
      const win = (cx, cy, s) => { bookDraw(x, bookPoly([[cx - s, cy - s * .9], [cx + s, cy - s * .9], [cx + s, cy + s * .9], [cx - s, cy + s * .9]]), '#bfe1f5', 5); bookLine(x, [[cx, cy - s * .9], [cx, cy + s * .9]], 4); bookLine(x, [[cx - s, cy], [cx + s, cy]], 4); bookDraw(x, bookPoly([[cx - s * 1.15, cy + s * .9], [cx + s * 1.15, cy + s * .9], [cx + s * 1.1, cy + s * 1.25], [cx - s * 1.1, cy + s * 1.25]]), '#7dbf6a', 4); for (let i = -2; i <= 2; i++) bookDraw(x, bookOval(cx + i * s * .4, cy + s * .82, s * .12), ['#f2a7c3', '#ffd24c', '#e4584f'][(i + 3) % 3], 2.5); };
      if (door) { bookDraw(x, bookPoly([[W / 2 - 62, H], [W / 2 - 62, H - 165], [W / 2 + 62, H - 165], [W / 2 + 62, H]]), '#4f7fd0', 5); bookDraw(x, bookOval(W / 2, H - 165, 62, 52), '#4f7fd0', 5); bookDraw(x, bookOval(W / 2 + 34, H - 95, 8), '#ffd24c', 3); win(W * .2, H * .44, 62); win(W * .8, H * .44, 62); }
      else win(W / 2, H * .44, 56);
    });
    const front = wall(w, h, true), side = wall(d, h, false);
    g.add(bookPlace(bookBlock(w, h, d, [bookLit(side, .8), bookLit(side, .92), bookTint('#fbefd5', 1.05), bookTint('#fbefd5', .6), bookLit(front), bookTint('#fbefd5', .7)]), 0, h / 2, d / 2));
    const tiles = bookFace(4, 2.4, (x, W, H) => { x.fillStyle = '#e2685d'; x.fillRect(0, 0, W, H); x.strokeStyle = 'rgba(120,40,40,.55)'; x.lineWidth = 3; for (let y = 30; y < H + 40; y += 40) for (let a = (y / 40) % 2 ? 0 : 25; a < W + 50; a += 50) { x.beginPath(); x.arc(a, y, 25, 0, Math.PI); x.stroke(); } }, { repeat: true });
    const gable = bookFace(7, 2.6, (x, W, H) => { x.fillStyle = '#fbefd5'; x.fillRect(0, 0, W, H); bookDraw(x, bookOval(W / 2, H * .62, 34), '#bfe1f5', 4); bookLine(x, [[W / 2 - 34, H * .62], [W / 2 + 34, H * .62]], 3); });
    g.add(bookPlace(bookPrism(7, 2.6, d + .5, bookLit(gable), bookLit(tiles, .95)), 0, h, -.25));
    g.add(bookPlace(bookBlock(.7, 1.7, .7, '#c55a4f'), 1.75, h + 1.6, d * .45));
    return g;
  },
  stall() { // a market stall: a plank counter, four posts, a striped awning with a scalloped edge, crates of fruit
    const g = new THREE.Group(), w = 8, d = 2.2;
    const planks = bookFace(w, 2.3, (x, W, H) => { bookPencil(x, bookPoly([[0, 0], [W, 0], [W, H], [0, H]], true, .2), '#dba36a', 1.4); x.strokeStyle = 'rgba(110,60,20,.45)'; x.lineWidth = 3; for (let a = 60; a < W; a += 60) { x.beginPath(); x.moveTo(a, 0); x.lineTo(a + (bookRnd() - .5) * 4, H); x.stroke(); } bookWrite(x, 'EAT', W / 2, H * .48, 120, '#e4584f', { bold: true }); });
    g.add(bookPlace(bookBlock(w, 2.3, d, [bookTint('#dba36a', .78), bookTint('#dba36a', .9), bookTint('#e8bf87', 1), bookTint('#dba36a', .6), bookLit(planks), bookTint('#dba36a', .7)]), 0, 1.15, .7 + d / 2));
    for (const [px, pz] of [[-w / 2 + .15, .45], [w / 2 - .15, .45], [-w / 2 + .15, d + .95], [w / 2 - .15, d + .95]]) g.add(bookPlace(bookBlock(.22, 5.6, .22, '#b98a52'), px, 2.8, pz));
    const stripes = bookFace(8.6, 3, (x, W, H) => { for (let i = 0; i < 10; i++) { x.fillStyle = i % 2 ? '#fdf6ec' : '#e4584f'; x.fillRect(i * W / 10, 0, W / 10 + 1, H); } });
    const awning = bookPlace(bookBlock(8.6, .1, 3.2, [bookTint('#e4584f', .8), bookTint('#e4584f', .9), bookLit(stripes, 1.03), bookLit(stripes, .7), bookTint('#e4584f'), bookTint('#e4584f', .7)]), 0, 5.75, 1.9); awning.rotation.x = .32; g.add(awning);
    const scallop = bookFace(8.6, .8, (x, W, H) => { for (let i = 0; i < 10; i++) { const a = i * W / 10; x.fillStyle = i % 2 ? '#fdf6ec' : '#e4584f'; x.beginPath(); x.moveTo(a, 0); x.lineTo(a + W / 10, 0); x.lineTo(a + W / 20, H); x.closePath(); x.fill(); x.strokeStyle = BOOK_INK; x.lineWidth = 3; x.stroke(); } });
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(8.6, .8), bookLit(scallop, 1, { transparent: true, alphaTest: .3, side: THREE.DoubleSide })); edge.castShadow = true; g.add(bookPlace(edge, 0, 4.9, 3.45));
    const fruit = (color) => bookFace(.9, .7, (x, W, H) => { x.fillStyle = '#c58f55'; x.fillRect(0, 0, W, H); for (let i = 0; i < 5; i++) bookDraw(x, bookOval(14 + i * 16, H / 2 + (i % 2 ? 8 : -8), 13), color, 2.5); });
    [['#e4584f', -2.6], ['#7dbf6a', -1.4], ['#f2a7c3', -.2]].forEach(([c, px]) => { const f = fruit(c); g.add(bookPlace(bookBlock(.9, .5, .7, [bookTint('#c58f55', .8), bookTint('#c58f55', .9), bookLit(f, 1.05), bookTint('#c58f55', .6), bookTint('#c58f55'), bookTint('#c58f55', .7)]), px, 2.55, 1.6)); });
    return g;
  },
  desk() { // a wooden desk with a sleeping computer, a keyboard, a mug and a lamp
    const g = new THREE.Group(), w = 7, d = 2.4, top = 3;
    g.add(bookPlace(bookBlock(w, .3, d, '#c99a5e'), 0, top, d / 2 + .2));
    for (const [px, pz] of [[-w / 2 + .3, .5], [w / 2 - .3, .5], [-w / 2 + .3, d - .1], [w / 2 - .3, d - .1]]) g.add(bookPlace(bookBlock(.26, top, .26, '#a8794a'), px, top / 2, pz));
    const screen = bookFace(2.6, 1.6, (x, W, H) => { x.fillStyle = '#9fd8ea'; x.fillRect(0, 0, W, H); bookWrite(x, 'zzz...', W / 2, H / 2, 46, '#34323a', { bold: true }); });
    g.add(bookPlace(bookBlock(2.9, 1.9, .22, [bookTint('#4b4e5c', .8), bookTint('#4b4e5c', .9), bookTint('#4b4e5c', 1.05), bookTint('#4b4e5c', .6), bookLit(screen), bookTint('#4b4e5c', .7)]), -.6, top + 1.45, .75));
    g.add(bookPlace(bookBlock(.3, .5, .3, '#4b4e5c'), -.6, top + .4, .75));
    g.add(bookPlace(bookBlock(2.1, .1, .7, '#e8e4dc'), -.6, top + .2, 1.75));
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(.24, .22, .5, 16), [bookTint('#fdf6ec'), bookTint('#e4584f'), bookTint('#e4584f')]); g.add(bookPlace(bookFold(mug), 1.3, top + .4, 1.8));
    g.add(bookPlace(bookBlock(.12, 1.6, .12, '#f2c14e'), 2.5, top + .95, .9));
    const shade = new THREE.Mesh(new THREE.ConeGeometry(.45, .55, 16, 1, true), bookTint('#f2c14e')); shade.rotation.z = .5; g.add(bookPlace(bookFold(shade), 2.2, top + 1.75, .9));
    return g;
  },
  lighthouse() { // a red and white striped tower with a lit lantern room and a light that sweeps
    const g = new THREE.Group(), r = 1.25, h = 7;
    const stripes = bookFace(4.4, 3, (x, W, H) => { for (let i = 0; i < 5; i++) { x.fillStyle = i % 2 ? '#e4584f' : '#fdf6ec'; x.fillRect(0, i * H / 5, W, H / 5 + 1); } bookDraw(x, bookPoly([[W / 2 - 22, H], [W / 2 - 22, H - 54], [W / 2 + 22, H - 54], [W / 2 + 22, H]]), '#8b5a3c', 3); bookDraw(x, bookOval(W / 2, H - 54, 22, 16), '#8b5a3c', 3); for (const y of [H * .36, H * .6]) bookDraw(x, bookOval(W / 2, y, 9, 13), '#bfe1f5', 2.5); });
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(r * .68, r, h, 24, 1, false, Math.PI, Math.PI * 2), [bookLit(stripes), bookTint('#fdf6ec'), bookTint('#fdf6ec')]); g.add(bookPlace(bookFold(tower), 0, h / 2, r + .1));
    g.add(bookPlace(bookFold(new THREE.Mesh(new THREE.CylinderGeometry(r * .95, r * .95, .16, 24), bookTint('#4b4e5c'))), 0, h + .08, r + .1));
    const glass = bookFace(3.6, 1, (x, W, H) => { x.fillStyle = '#ffe9a0'; x.fillRect(0, 0, W, H); x.strokeStyle = BOOK_INK; x.lineWidth = 4; for (let a = 0; a < W; a += 45) { x.beginPath(); x.moveTo(a, 0); x.lineTo(a, H); x.stroke(); } });
    g.add(bookPlace(bookFold(new THREE.Mesh(new THREE.CylinderGeometry(r * .6, r * .6, 1.1, 24), [bookLit(glass), bookTint('#ffe9a0'), bookTint('#ffe9a0')])), 0, h + .7, r + .1));
    g.add(bookPlace(bookFold(new THREE.Mesh(new THREE.ConeGeometry(r * .82, 1.1, 24), bookTint('#4f7fd0'))), 0, h + 1.8, r + .1));
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.2).translate(3.5, 0, 0), new THREE.MeshBasicMaterial({ map: bookFace(7, 1.2, (x, W, H) => { const l = x.createLinearGradient(0, 0, W, 0); l.addColorStop(0, 'rgba(255,233,160,.7)'); l.addColorStop(1, 'rgba(255,233,160,0)'); x.fillStyle = l; x.beginPath(); x.moveTo(0, H / 2 - 10); x.lineTo(W, 0); x.lineTo(W, H); x.lineTo(0, H / 2 + 10); x.fill(); }), transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
    beam.userData.spin = .6; g.add(bookPlace(beam, 0, h + .7, r + .1)); g.userData.beam = beam;
    return g;
  },
  tent() { // an orange tent with an open door, a ridge pole and two pegs
    const g = new THREE.Group(), w = 6, h = 4.2, d = 3.8;
    const canvas = bookFace(5, 4, (x, W, H) => { x.fillStyle = '#f2a04a'; x.fillRect(0, 0, W, H); x.strokeStyle = 'rgba(140,70,20,.35)'; x.lineWidth = 3; for (let a = 50; a < W; a += 70) { x.beginPath(); x.moveTo(a, 0); x.lineTo(a, H); x.stroke(); } }, { repeat: true });
    const front = bookFace(w, h, (x, W, H) => { x.fillStyle = '#f5ad5a'; x.fillRect(0, 0, W, H); bookDraw(x, bookPoly([[W / 2 - 120, H], [W / 2, H * .3], [W / 2 + 120, H]]), '#5b3a2a', 4); bookDraw(x, bookPoly([[W / 2, H * .3], [W / 2 + 120, H], [W / 2 + 170, H * .82]]), '#ffc77a', 4); });
    g.add(bookPlace(bookPrism(w, h, d, bookLit(front), bookLit(canvas, .9)), 0, 0, .2));
    g.add(bookPlace(bookBlock(.14, .9, .14, '#8b5a3c'), 0, h + .3, d + .2));
    return g;
  },
};

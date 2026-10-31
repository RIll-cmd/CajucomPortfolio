/* Box 1's gate: a late-afternoon walk through a sky city while it loads, then one long glide up to a door.
   Everything here is generated on first open, with no image files. The white loading screen is the real wait for that. */
const GATE_LOAD_MS = reduced ? 1200 : 5200, GATE_ARRIVE_MS = reduced ? 1 : 6500, GATE_READY_MS = 1200, GATE_ENTER_MS = reduced ? 300 : 3400;
const GATE_Q = COARSE ? { tex: .5, shadow: 1024, msaa: 0, rays: 14, bake: .5, seg: .5, motes: 90 } : { tex: 1, shadow: 2048, msaa: 4, rays: 32, bake: 1, seg: 1, motes: 240 };
const lin = hex => new THREE.Color(hex).convertSRGBToLinear();
const GATE_SKY = { top: lin(0x2e2670), mid: lin(0xb0589a), low: lin(0xffa766), cirrus: lin(0xffc0b0), cloudLit: lin(0xffdba4).multiplyScalar(1.45), cloudDark: lin(0x8a5a9c), cloudRim: lin(0xffb060).multiplyScalar(1.1), sunTint: lin(0xffc27a).multiplyScalar(6), sunDir: [.14, .13, -.98], sunPower: 3.2, sunColor: 0xffbf85, fill: 0xb79ae8, fillPower: 1.5, fog: lin(0xee9f80), fogSun: lin(0xffd29a), fogDensity: .0028, fogFall: .05, rays: .5, exposure: .58, lightFrom: [.2, .34, -.92], focus: [0, 0, 50], wide: 75, tall: 62 };
let gateBuilder = null, gateBuilt = 0;

/* ---------- Painted materials: a colour, a height that becomes a normal map, metal and shine, and glow ---------- */
function gateSheet(w, h, base, raise = 128, shine = 190) {
  const layer = fill => { const c = document.createElement('canvas'); c.width = Math.ceil(w * GATE_Q.tex); c.height = Math.ceil(h * GATE_Q.tex); const x = c.getContext('2d'); x.fillStyle = fill; x.fillRect(0, 0, c.width, c.height); x.scale(GATE_Q.tex, GATE_Q.tex); x.lineCap = x.lineJoin = 'round'; return x; };
  const grey = v => `rgb(${v},${v},${v})`;
  const s = { w, h, color: layer(base), height: layer(grey(raise)), surface: layer(`rgb(0,${shine},0)`), glow: null };
  // A stroke with a rounded profile, standing up from (or cut into) the surface.
  s.line = (path, color, width, lift, metal) => {
    s.color.strokeStyle = color; s.color.lineWidth = width; s.color.stroke(path);
    for (const [k, part] of [[1, .4], [.66, .75], [.33, 1]]) { s.height.strokeStyle = grey(Math.max(0, Math.min(255, raise + lift * part))); s.height.lineWidth = width * k; s.height.stroke(path); }
    if (metal) { s.surface.strokeStyle = 'rgb(0,80,255)'; s.surface.lineWidth = width; s.surface.stroke(path); }
  };
  s.fill = (path, color, lift, metal) => {
    s.color.fillStyle = color; s.color.fill(path);
    s.height.fillStyle = grey(Math.max(0, Math.min(255, raise + lift))); s.height.fill(path);
    if (metal) { s.surface.fillStyle = 'rgb(0,80,255)'; s.surface.fill(path); }
  };
  s.shine = (path, color) => { s.glow = s.glow || layer('#000'); s.glow.fillStyle = color; s.glow.fill(path); };
  s.shineLine = (path, color, width) => { s.glow = s.glow || layer('#000'); s.glow.strokeStyle = color; s.glow.lineWidth = width; s.glow.stroke(path); };
  return s;
}
function gateNormal(height, strength) {
  const c = height.canvas, w = c.width, h = c.height, src = height.getImageData(0, 0, w, h).data, out = new ImageData(w, h), d = out.data;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const at = (a, b) => src[((b + h) % h * w + (a + w) % w) * 4];
    const dx = (at(x + 1, y) - at(x - 1, y)) * strength / 255, dy = (at(x, y + 1) - at(x, y - 1)) * strength / 255, m = 1 / Math.hypot(dx, dy, 1), i = (y * w + x) * 4;
    d[i] = (-dx * m * .5 + .5) * 255; d[i + 1] = (dy * m * .5 + .5) * 255; d[i + 2] = (m * .5 + .5) * 255; d[i + 3] = 255;
  }
  const n = document.createElement('canvas'); n.width = w; n.height = h; n.getContext('2d').putImageData(out, 0, 0);
  return n;
}
function gateMaterial(sheet, { normal = 3, repeat, color, extra } = {}) {
  const tex = (canvas, srgb) => {
    const t = new THREE.CanvasTexture(canvas); t.anisotropy = 8; if (srgb) t.encoding = THREE.sRGBEncoding;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; if (repeat) t.repeat.set(...repeat);
    return t;
  };
  const m = new THREE.MeshStandardMaterial({ map: tex(sheet.color.canvas, true), normalMap: tex(gateNormal(sheet.height, normal)), roughnessMap: null, metalnessMap: null, roughness: 1, metalness: 1, ...extra });
  m.roughnessMap = m.metalnessMap = tex(sheet.surface.canvas);
  if (color !== undefined) m.color = lin(color);
  if (sheet.glow) { m.emissiveMap = tex(sheet.glow.canvas, true); m.emissive = new THREE.Color(0xffffff); }
  return m;
}
const gateMottle = (s, rnd, tints, n, size) => { // old stone: soft patches of near-colours, then fine speckle
  for (let i = 0; i < n; i++) {
    const r = size * (.2 + rnd()), x = rnd() * s.w, y = rnd() * s.h, l = s.color.createRadialGradient(x, y, 0, x, y, r);
    l.addColorStop(0, tints[Math.floor(rnd() * tints.length)]); l.addColorStop(1, 'rgba(0,0,0,0)'); s.color.fillStyle = l; s.color.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let i = 0; i < n * 8; i++) {
    const a = rnd() * .09; s.color.fillStyle = rnd() < .5 ? `rgba(60,40,60,${a})` : `rgba(255,255,255,${a})`; s.color.fillRect(rnd() * s.w, rnd() * s.h, 1 + rnd() * 3, 1 + rnd() * 3);
    const v = 100 + rnd() * 56; s.height.fillStyle = `rgba(${v},${v},${v},.5)`; s.height.fillRect(rnd() * s.w, rnd() * s.h, 1 + rnd() * 4, 1 + rnd() * 4);
  }
};
const gateStar = (p, cx, cy, r, waist = .24) => { for (let i = 0; i < 8; i++) { const a = i / 8 * 6.2832 - 1.5708, m = i % 2 ? r * waist : r; p[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * m, cy + Math.sin(a) * m); } p.closePath(); return p; };
// A climbing tendril that curls in at the end and throws off smaller ones.
function gateVine(p, x, y, a, len, turn, depth, rnd) {
  p.moveTo(x, y);
  const n = 26, branches = [];
  for (let i = 1; i <= n; i++) {
    a += turn * (.5 + i / n * 2.4) / n * 3.2; x += Math.cos(a) * len / n; y += Math.sin(a) * len / n; p.lineTo(x, y);
    if (depth > 0 && (i === 8 || i === 15)) branches.push([x, y, a + (i === 8 ? -.9 : .8) * Math.sign(turn), len * (i === 8 ? .55 : .42), -turn]);
  }
  for (const b of branches) gateVine(p, b[0], b[1], b[2], b[3], b[4], depth - 1, rnd);
}
function gateArch(p, cx, w, top, bottom) { // the door's outline, in texture space
  const h = bottom - top;
  p.moveTo(cx - w, bottom); p.lineTo(cx - w, bottom - h * .76); p.bezierCurveTo(cx - w, bottom - h * .93, cx - w * .5, bottom - h * .97, cx, top); p.bezierCurveTo(cx + w * .5, bottom - h * .97, cx + w, bottom - h * .93, cx + w, bottom - h * .76); p.lineTo(cx + w, bottom); p.closePath();
  return p;
}
function gateTextures() {
  const rnd = seeded(23), t = {};
  // Walls: ivory blocks in running bond.
  const wall = gateSheet(1024, 1024, '#e9dfd2', 170, 200);
  gateMottle(wall, rnd, ['rgba(190,165,150,.18)', 'rgba(255,248,235,.2)', 'rgba(170,160,190,.14)'], 200, 150);
  const joints = new Path2D();
  for (let r = 0; r < 8; r++) { joints.moveTo(0, r * 128); joints.lineTo(1024, r * 128); for (let c = 0; c < 4; c++) { const x = (c + (r % 2) * .5) * 256; joints.moveTo(x, r * 128); joints.lineTo(x, r * 128 + 128); } }
  wall.line(joints, 'rgba(120,100,105,.75)', 5, -110);
  t.wall = wall;
  // Spires, drawn from the base (bottom) up: courses, tall lit windows, a frieze, then small arches under the cornice.
  const sp = gateSheet(512, 2048, '#efe6da', 170, 200);
  gateMottle(sp, rnd, ['rgba(180,160,150,.2)', 'rgba(255,250,240,.2)'], 220, 90);
  const V = v => 2048 * (1 - v);
  const courses = new Path2D(); for (let y = 0; y < 2048; y += 32) { courses.moveTo(0, y); courses.lineTo(512, y); }
  sp.line(courses, 'rgba(120,105,110,.35)', 2, -40);
  const lancet = (x, w, top, bottom, frame, gold) => {
    const glass = gateArch(new Path2D(), x, w, top, bottom);
    sp.line(glass, gold ? '#d6a94f' : '#b8a99c', frame, 60, gold);
    const c = sp.color.createLinearGradient(0, top, 0, bottom); c.addColorStop(0, '#dce9ff'); c.addColorStop(.5, '#8fb0f6'); c.addColorStop(1, '#5a74d8');
    sp.color.fillStyle = c; sp.color.fill(glass); sp.height.fillStyle = 'rgb(70,70,70)'; sp.height.fill(glass); sp.surface.fillStyle = 'rgb(0,40,0)'; sp.surface.fill(glass);
    sp.shine(glass, '#3a4fa8');
    const bars = new Path2D(); bars.moveTo(x, top + 6); bars.lineTo(x, bottom); for (let y = top + (bottom - top) * .25; y < bottom; y += (bottom - top) * .17) { bars.moveTo(x - w, y); bars.lineTo(x + w, y); }
    sp.line(bars, '#3f3f78', 3, 30);
  };
  lancet(256, 150, V(.59), V(.095), 16, true);
  lancet(256, 92, V(.79), V(.665), 10, true);
  for (const v of [.092, .6, .655, .805]) { const b = new Path2D(); b.moveTo(0, V(v)); b.lineTo(512, V(v)); sp.line(b, '#d3a64c', 15, 90, true); }
  const frieze = new Path2D(); for (let x = 0; x <= 512; x += 64) { gateStar(frieze, x, V(.63), 20); } sp.fill(frieze, '#c7b6a8', 50);
  t.spire = sp;
  // Domes: overlapping slate-violet scales.
  const dome = gateSheet(256, 256, '#7f80d6', 128, 90);
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const x = (c + (r % 2) * .5) * 32, y = r * 32, p = new Path2D(); p.arc(x, y, 18, 0, Math.PI); dome.line(p, r % 3 ? '#a3a6ee' : '#5e5fb8', 5, 70);
  }
  t.dome = dome;
  // Columns: flutes up the shaft, gold where they meet the capital and the base.
  const col = gateSheet(256, 1024, '#9c6b6e', 150, 170);
  gateMottle(col, rnd, ['rgba(70,40,60,.22)', 'rgba(220,160,140,.16)'], 90, 80);
  for (const x of [32, 96, 160, 224]) { const p = new Path2D(); p.moveTo(x, 120); p.lineTo(x, 940); col.line(p, 'rgba(50,28,44,.6)', 22, -110); }
  for (const y of [70, 92, 112, 950, 976, 480, 500]) { const p = new Path2D(); p.moveTo(0, y); p.lineTo(256, y); col.line(p, '#d0a24c', 12, 90, true); }
  t.column = col;
  // The plaza: big worn slabs with bevelled joints, mineral stains, cracks, and a star set in brass.
  const slab = gateSheet(1024, 1024, '#efe4e2', 190, 238);
  gateMottle(slab, rnd, ['rgba(200,160,185,.2)', 'rgba(255,255,250,.3)', 'rgba(170,175,205,.16)', 'rgba(205,175,150,.14)'], 200, 170);
  const seams = new Path2D(); seams.rect(0, 0, 1024, 1024); seams.moveTo(0, 340); seams.lineTo(380, 332); seams.lineTo(392, 0); seams.moveTo(380, 332); seams.lineTo(1024, 350); seams.moveTo(700, 340); seams.lineTo(690, 1024);
  slab.line(seams, '#a48d9d', 8, -150);
  for (let i = 0; i < 16; i++) { const p = new Path2D(); let x = rnd() * 1024, y = rnd() * 1024, a = rnd() * 6.28; p.moveTo(x, y); for (let k = 0; k < 7; k++) { a += (rnd() - .5) * 1.4; x += Math.cos(a) * 26; y += Math.sin(a) * 26; p.lineTo(x, y); } slab.line(p, i % 4 ? 'rgba(120,90,110,.55)' : 'rgba(170,70,90,.55)', 1.6 + rnd() * 1.4, -70); }
  slab.fill(gateStar(new Path2D(), 350, 680, 165), '#cdbcc6', -36);
  slab.line(gateStar(new Path2D(), 350, 680, 165), '#c79c52', 7, 50, true);
  slab.fill(gateStar(new Path2D(), 350, 680, 70, .3), '#d8ab58', 30, true);
  const ring = new Path2D(); ring.arc(350, 680, 112, 0, 6.2832); slab.line(ring, '#b9a6b2', 5, -50);
  t.slab = slab;
  // The causeway: bricks, with carved violet borders edged in brass.
  const pave = gateSheet(512, 512, '#ece0d6', 180, 238);
  gateMottle(pave, rnd, ['rgba(205,170,160,.2)', 'rgba(255,250,240,.26)', 'rgba(180,165,195,.16)'], 90, 70);
  const bricks = new Path2D();
  for (let r = 0; r < 8; r++) { bricks.moveTo(84, r * 64); bricks.lineTo(428, r * 64); for (let c = 0; c < 6; c++) { const x = 84 + (c + (r % 2) * .5) * 69; if (x < 428) { bricks.moveTo(x, r * 64); bricks.lineTo(x, r * 64 + 64); } } }
  pave.line(bricks, '#a98f90', 5, -120);
  for (const [from, to] of [[0, 84], [428, 512]]) {
    const band = new Path2D(); band.rect(from, 0, to - from, 512); pave.fill(band, '#54486e', -40);
    const m = (from + to) / 2, knots = new Path2D();
    for (let i = 0; i < 2; i++) { gateVine(knots, m - 18, i * 256 + 8, 1.2, 180, 1.1, 1, rnd); gateVine(knots, m + 18, i * 256 + 136, -1.9 + 3.14, 180, -1.1, 1, rnd); }
    pave.line(knots, '#2a2442', 6, -90);
    const edge = new Path2D(); edge.moveTo(from + (from ? 4 : 80), 0); edge.lineTo(from + (from ? 4 : 80), 512); pave.line(edge, '#d0a24c', 7, 70, true);
  }
  t.pave = pave;
  // A carved panel for the door surround: tendrils in low relief.
  const carve = gateSheet(512, 512, '#5a68b4', 150, 150);
  gateMottle(carve, rnd, ['rgba(40,40,110,.25)', 'rgba(140,160,230,.2)'], 60, 80);
  const curls = new Path2D(); for (const [x, y, a, tn] of [[20, 500, -1.2, 1], [180, 500, -1.8, -1], [270, 490, -1.2, 1], [440, 490, -1.8, -1], [30, 240, -1.1, 1], [200, 240, -1.9, -1], [300, 230, -1.1, 1], [470, 230, -1.9, -1]]) gateVine(curls, x, y, a, 260, tn * 1.1, 2, rnd);
  carve.line(curls, '#9fb0ec', 7, 80);
  t.carve = carve;
  // The door itself, both leaves on one sheet: nested arches, tendrils, a medallion, studs, and thread-thin light.
  const W = 1024, H = 2048, cx = W / 2, door = gateSheet(W, H, '#2a2966', 120, 110);
  const shade = door.color.createLinearGradient(0, 0, 0, H); shade.addColorStop(0, 'rgba(84,76,160,.9)'); shade.addColorStop(.5, 'rgba(46,44,112,.5)'); shade.addColorStop(1, 'rgba(18,16,56,.95)'); door.color.fillStyle = shade; door.color.fillRect(0, 0, W, H);
  gateMottle(door, rnd, ['rgba(120,110,210,.14)', 'rgba(10,8,40,.25)'], 90, 180);
  door.line(gateArch(new Path2D(), cx, 470, 60, 2020), '#aebbf4', 26, 110);
  door.line(gateArch(new Path2D(), cx, 416, 150, 1960), '#d9b264', 11, 90, true);
  door.line(gateArch(new Path2D(), cx, 340, 310, 1880), '#8e9ce6', 16, 90);
  door.line(gateArch(new Path2D(), cx, 262, 490, 1800), '#6f7dd6', 9, 70);
  for (const flip of [1, -1]) { // each leaf is the mirror of the other
    for (const s of [door.color, door.height, door.surface]) { s.save(); s.translate(cx, 0); s.scale(flip, 1); s.translate(-cx, 0); }
    const v = new Path2D();
    gateVine(v, cx + 40, 1030, -.5, 520, -1.15, 2, rnd); gateVine(v, cx + 40, 1110, .5, 520, 1.15, 2, rnd);
    gateVine(v, cx + 90, 620, -.9, 300, -1.2, 2, rnd); gateVine(v, cx + 100, 1560, .7, 320, 1.2, 2, rnd);
    door.line(v, '#b6c3fa', 9, 90);
    const small = new Path2D(); gateVine(small, cx + 300, 1820, -1.5, 240, -1, 1, rnd); gateVine(small, cx + 380, 520, 1.6, 230, 1, 1, rnd);
    door.line(small, '#d9b264', 6, 70, true);
    const studs = new Path2D(); for (let y = 760; y < 1960; y += 80) { studs.moveTo(cx + 443 + 10, y); studs.arc(cx + 443, y, 10, 0, 6.2832); }
    door.fill(studs, '#e0bd72', 110, true);
    for (const s of [door.color, door.height, door.surface]) s.restore();
  }
  // The medallion at the meeting of the leaves.
  for (const [r, c, w, lift] of [[230, '#d9b264', 14, 110], [188, '#9fb0ec', 7, 70], [150, '#d9b264', 5, 60]]) { const p = new Path2D(); p.arc(cx, 1050, r, 0, 6.2832); door.line(p, c, w, lift, c === '#d9b264'); }
  const petals = new Path2D(); for (let i = 0; i < 16; i++) { const a = i / 16 * 6.2832, x = cx + Math.cos(a) * 168, y = 1050 + Math.sin(a) * 168; petals.moveTo(x + 15, y); petals.arc(x, y, 15, 0, 6.2832); }
  door.fill(petals, '#c5d0ff', 80);
  door.fill(gateStar(new Path2D(), cx, 1050, 140, .2), '#f2d48c', 130, true);
  door.fill(gateStar(new Path2D(), cx, 1050, 60, .34), '#fff6dc', 150, true);
  door.shine(gateStar(new Path2D(), cx, 1050, 60, .34), '#ffe6a8');
  const threads = new Path2D(); gateArch(threads, cx, 298, 400, 1840); threads.moveTo(cx + 228, 1050); threads.arc(cx, 1050, 228, 0, 6.2832);
  door.shineLine(threads, '#5f80f0', 3);
  const crown = new Path2D(); gateStar(crown, cx, 240, 58, .28); for (const [x, y] of [[-120, 340], [120, 340], [-60, 430], [60, 430], [0, 480]]) gateStar(crown, cx + x, y, 20, .3);
  door.fill(crown, '#e6c37a', 110, true); door.shine(crown, '#6a5430');
  const seam = new Path2D(); seam.rect(cx - 3, 0, 6, H); door.fill(seam, '#08072a', -120);
  t.door = door;
  return t;
}

/* ---------- Clouds: billowing fields baked once on the GPU into textures, then just looked up ---------- */
const GATE_NOISE = `
  float hash(vec2 p, vec2 per){ p = mod(p, per); return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec2 hash2(vec2 p, vec2 per){ p = mod(p, per); return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
  float vnoise(vec2 p, vec2 per){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(hash(i,per),hash(i+vec2(1,0),per),f.x),mix(hash(i+vec2(0,1),per),hash(i+vec2(1,1),per),f.x),f.y); }
  float worley(vec2 p, vec2 per){ vec2 i = floor(p), f = fract(p); float d = 1.; for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){ vec2 g = vec2(float(x),float(y)); vec2 o = hash2(i+g,per); vec2 r = g+o-f; d = min(d, dot(r,r)); } return sqrt(d); }
  float billow(vec2 p, vec2 per){ float a=.55, n=0.; for(int i=0;i<4;i++){ n += (1.-worley(p,per))*a; p = p*2.+vec2(3.1,1.7); per *= 2.; a *= .5; } return n; }`;
function gateBake(fragment, width, height) {
  const target = new THREE.WebGLRenderTarget(width, height, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter, wrapS: THREE.RepeatWrapping, depthBuffer: false });
  const mat = new THREE.RawShaderMaterial({ depthTest: false, depthWrite: false, vertexShader: 'attribute vec3 position; attribute vec2 uv; varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }', fragmentShader: `precision highp float; varying vec2 vUv; ${GATE_NOISE} ${fragment}` });
  const scene = new THREE.Scene(), cam = new THREE.Camera(), quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); quad.frustumCulled = false; scene.add(quad);
  renderer.setRenderTarget(target); renderer.render(scene, cam); renderer.setRenderTarget(null);
  mat.dispose(); quad.geometry.dispose();
  return target.texture;
}
function gateClouds() {
  const size = GATE_Q.bake;
  // A whole horizon of cumulus: red is how lit it is, green its body, blue the bright rim.
  const horizon = gateBake(`
    float field(vec2 uv){
      vec2 p = vec2(uv.x*14., uv.y*4.2);
      float top = .3 + .34*vnoise(vec2(uv.x*7.,3.), vec2(7.,99.)) + .16*vnoise(vec2(uv.x*19.,9.), vec2(19.,99.));
      float body = smoothstep(top, top-.42, uv.y);
      float warp = vnoise(p*1.7, vec2(23.8,99.))*.5;
      return body*.95 + billow(p+warp, vec2(14.,999.))*1.12 - 1.02;
    }
    void main(){
      float d = field(vUv), sum = 0.;
      for(int i=1;i<=7;i++) sum += max(field(vUv+vec2(-.0065,.03)*float(i)),0.);
      float lit = exp(-sum*1.15);
      float rim = smoothstep(.0,.05,d)*(1.-smoothstep(.05,.2,d));
      gl_FragColor = vec4(lit, smoothstep(0.,.09,d), rim, 1.);
    }`, Math.round(2048 * size), Math.round(512 * size));
  // Four single clouds for the sea below, lit from above.
  const puffs = gateBake(`
    float field(vec2 q, float seed){
      vec2 c = (q-.5)*vec2(2.,2.6); c.y += .18;
      float m = 1.-smoothstep(.2,1.,length(c));
      m *= smoothstep(-.62,-.3,c.y);
      return m*1.5 + billow(q*5.+seed, vec2(999.))*.72 - 1.02;
    }
    void main(){
      vec2 cell = floor(vUv*2.), q = fract(vUv*2.); float seed = cell.x*7.3+cell.y*13.1;
      float d = field(q,seed), sum = 0.;
      for(int i=1;i<=6;i++) sum += max(field(q+vec2(-.012,.05)*float(i),seed),0.);
      float lit = exp(-sum*1.);
      float rim = smoothstep(.0,.05,d)*(1.-smoothstep(.05,.2,d));
      gl_FragColor = vec4(lit, smoothstep(0.,.4,d), rim, 1.);
    }`, Math.round(1024 * size), Math.round(1024 * size));
  return { horizon, puffs };
}

/* ---------- Geometry ---------- */
function gateLathe(points, seg, top = 1) {
  const g = new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(Math.max(r, .0001), y)), Math.max(6, Math.round(seg * GATE_Q.seg)));
  const pos = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < pos.count; i++) uv.setY(i, pos.getY(i) / top);
  return g;
}
const gateMerge = list => THREE.BufferGeometryUtils.mergeBufferGeometries(list, false);
const gateMergeGroups = list => THREE.BufferGeometryUtils.mergeBufferGeometries(list, true);
function gateSpire(seg, detailed) {
  const body = [gateLathe([[.0001, 0], [.092, 0], [.092, .018], [.074, .03], [.074, .058], [.062, .07], [.056, .09], [.05, .1], [.05, .59], [.056, .6], [.073, .612], [.073, .632], [.052, .655], [.046, .665], [.046, .795], [.052, .805], [.07, .818], [.07, .84], [.0001, .84]], seg)];
  const gold = [gateLathe([[.0001, .955], [.012, .962], [.009, .975], [.016, .985], [.006, 1], [.004, 1.05], [.0001, 1.16]], seg * .5, 1.2)];
  if (detailed) {
    for (let i = 0; i < 8; i++) { // buttresses, and little spikes round the dome
      const a = i / 8 * 6.2832;
      body.push(new THREE.BoxGeometry(.006, .05, .012).translate(Math.cos(a) * .063, .64, Math.sin(a) * .063));
      const fin = new THREE.BoxGeometry(.012, .065, .016); fin.translate(0, .09, 0); fin.rotateY(-a); fin.translate(Math.cos(a) * .056, 0, Math.sin(a) * .056); body.push(fin);
      const pin = new THREE.ConeGeometry(.0035, .03, 5).translate(Math.cos(a) * .066, .857, Math.sin(a) * .066); gold.push(pin);
    }
    const band = new THREE.TorusGeometry(.0715, .0035, 6, Math.round(28 * GATE_Q.seg)).rotateX(1.5708).translate(0, .84, 0); gold.push(band);
    const band2 = new THREE.TorusGeometry(.0735, .003, 6, Math.round(28 * GATE_Q.seg)).rotateX(1.5708).translate(0, .612, 0); gold.push(band2);
  }
  const dome = gateLathe([[.0001, .84], [.062, .84], [.06, .862], [.054, .888], [.042, .915], [.026, .936], [.012, .952], [.0001, .966]], seg, 1);
  return gateMergeGroups([gateMerge(body), dome, gateMerge(gold)]);
}
function gateBaluster() { return gateLathe([[.0001, 0], [.09, 0], [.09, .06], [.05, .1], [.04, .2], [.075, .4], [.06, .55], [.032, .68], [.03, .8], [.07, .88], [.09, .93], [.09, 1], [.0001, 1]], 10); }
function gateArcade(length, height, bay, depth, material) {
  const s = new THREE.Shape(); s.moveTo(-length / 2, 0); s.lineTo(length / 2, 0); s.lineTo(length / 2, height); s.lineTo(-length / 2, height); s.closePath();
  const r = bay * .34;
  for (let x = -length / 2 + bay / 2; x < length / 2; x += bay) { const h = new THREE.Path(); h.moveTo(x - r, 0); h.lineTo(x + r, 0); h.lineTo(x + r, height * .62); h.absarc(x, height * .62, r, 0, Math.PI, false); h.lineTo(x - r, 0); s.holes.push(h); }
  return new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 8 }), material);
}

/* ---------- Building the world, a step per frame ---------- */
function* buildGateWorld() {
  const rnd = seeded(19), scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(42, 1, .3, 2400);
  gateBuilt = .05; yield;
  const tex = gateTextures(); gateBuilt = .35; yield;
  const clouds = gateClouds(); gateBuilt = .5; yield;
  const skyUni = { top: { value: new THREE.Color() }, mid: { value: new THREE.Color() }, low: { value: new THREE.Color() }, cirrusTint: { value: new THREE.Color() }, cloudLit: { value: new THREE.Color() }, cloudDark: { value: new THREE.Color() }, cloudRim: { value: new THREE.Color() }, sunTint: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3() }, time: { value: 0 }, night: { value: 0 }, horizon: { value: clouds.horizon } };
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1800, 40, 24), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, toneMapped: false, uniforms: skyUni,
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `varying vec3 vDir; uniform vec3 top, mid, low, cirrusTint, cloudLit, cloudDark, cloudRim, sunTint, sunDir; uniform float time, night; uniform sampler2D horizon;
      float h1(vec2 p){ return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453); }
      float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y); }
      float fbm(vec2 p){ float a=.5, n=0.; for(int i=0;i<5;i++){ n+=vn(p)*a; p=mat2(1.6,1.2,-1.2,1.6)*p; a*=.5; } return n; }
      vec3 bank(vec2 uv, vec3 behind, float amount){
        vec4 c = texture2D(horizon, uv);
        vec3 lit = mix(cloudDark, cloudLit, smoothstep(.02,.75,c.r)) + cloudRim*c.b;
        return mix(behind, lit, c.g*amount);
      }
      void main(){
        vec3 d = normalize(vDir); float h = d.y, az = atan(d.x,-d.z)/6.2832+.5, s = max(dot(d,sunDir),0.);
        vec3 c = mix(low, mid, smoothstep(-.01,.2,h)); c = mix(c, top, smoothstep(.12,.72,h));
        c += sunTint*(pow(s,3.)*.05+pow(s,14.)*.12);
        // Long high streaks, like brush strokes.
        float flow = fbm(vec2(d.x*2.6+d.y*1.4, d.z*1.2)/(max(h,.04)+.28)*vec2(1.1,3.2)+vec2(time*.008,0.));
        c = mix(c, cirrusTint, smoothstep(.5,.82,flow)*smoothstep(.05,.34,h)*.72);
        // Cumulus: a far pale bank, then a near one that towers.
        float e = max(h,0.)/.62;
        c = bank(vec2(az*2.+time*.0006, e*1.65+.015), c, .75*smoothstep(-.02,.01,h));
        c = mix(c, low, .35*(1.-smoothstep(.0,.16,h)));
        c = bank(vec2(az*1.+.31-time*.0011, e*.95), c, smoothstep(-.02,.01,h));
        c += sunTint*(pow(s,70.)*.5+pow(s,600.)*3.);
        if (h < 0.) c = mix(c, low, smoothstep(0.,-.08,h));
        c += vec3(1.,.96,.86)*step(.9965,h1(floor(vec2(az*1100.,d.y*520.))))*smoothstep(.02,.16,h)*night*1.6; // stars come out as it gets dark
        gl_FragColor = vec4(c,1.);
      }`,
  }));
  sky.frustumCulled = false; scene.add(sky);
  // Materials, all from the painted sheets.
  const wallMat = gateMaterial(tex.wall, { normal: 2.2, repeat: [.14, .14] });
  const spireMat = gateMaterial(tex.spire, { normal: 2.4, repeat: [6, 1] });
  const domeMat = gateMaterial(tex.dome, { normal: 2, repeat: [10, 30] });
  const goldMat = new THREE.MeshStandardMaterial({ color: lin(0xe0b050), metalness: 1, roughness: .34 });
  const columnMat = gateMaterial(tex.column, { normal: 2.4, repeat: [3, 1] });
  const ironMat = new THREE.MeshStandardMaterial({ color: lin(0x3a3158), metalness: .5, roughness: .5 });
  const roseMat = wallMat.clone(); roseMat.color = lin(0xb07c84);
  const plinthMat = wallMat.clone(); plinthMat.color = lin(0x9c3d50);
  const frameMat = wallMat.clone(); frameMat.color = lin(0x6e7fe0);
  const carveMat = gateMaterial(tex.carve, { normal: 3, repeat: [.5, .5] });
  gateBuilt = .65; yield;
  // Spires and columns: instanced, so a skyline costs a few draw calls.
  const near = gateSpire(36, true), far = gateSpire(14, false);
  const instanced = (geometry, material, list, shadow = true) => {
    const m = new THREE.InstancedMesh(geometry, material, list.length), o = new THREE.Object3D();
    list.forEach(([x, y, z, a, b = a, c = a], i) => { o.position.set(x, y, z); o.scale.set(a, b, c); o.updateMatrix(); m.setMatrixAt(i, o.matrix); });
    m.frustumCulled = false; m.castShadow = shadow; m.receiveShadow = true; scene.add(m); return m;
  };
  const spireSet = (geometry, list) => instanced(geometry, [spireMat, domeMat, goldMat], list.map(([x, z, h, w = .72]) => [x, -.16 * h, z, h * w, h, h * w]));
  const distant = []; for (let i = 0; i < 30; i++) { const side = rnd() < .5 ? -1 : 1; distant.push([side * (22 + rnd() * 170), -40 - rnd() * 230, 46 + rnd() * 60]); }
  spireSet(far, distant);
  spireSet(near, [[-24, -26, 62], [34, -40, 72], [-46, -60, 74], [58, -74, 66], [17, -92, 58], [-16, -118, 60]]);
  spireSet(near, [[-22, 16, 60], [24, 40, 44], [33, 14, 60], [-40, 30, 46], [52, 28, 42], [-60, 8, 46], [80, 8, 54], [-88, 2, 52], [9, -6, 38], [-11, -18, 32], [14.5, 7, 80, .8]]);
  const columnGeo = gateLathe([[.0001, 0], [1.05, 0], [1.05, .012], [.84, .03], [.72, .05], [.62, .07], [.6, .1], [.6, .5], [.66, .505], [.6, .51], [.6, .9], [.68, .91], [.62, .925], [.78, .955], [1.08, .978], [1.22, .988], [1.22, 1], [.0001, 1]], 20);
  const columns = [];
  for (let i = 0; i < 34; i++) { const side = rnd() < .5 ? -1 : 1; columns.push([side * (9 + rnd() * 70), -26, -18 - rnd() * 120, .7 + rnd() * .9, 40 + rnd() * 40]); }
  instanced(columnGeo, columnMat, columns);
  for (const x of [-3.95, 3.95]) instanced(columnGeo, columnMat, [[x, 0, -.5, .34, 13.5]]);
  instanced(gateLathe([[.0001, 0], [.16, .02], [.09, .1], [.15, .16], [.05, .3], [.02, .5], [.0001, .9]], 12), goldMat, [[-3.95, 13.5, -.5, 1.4], [3.95, 13.5, -.5, 1.4]]);
  // Arched bridges strung across the middle distance.
  for (const [x, y, z, len, h, bay, d] of [[-42, -8, -30, 66, 14, 8, 1.8], [42, -8, -30, 66, 14, 8, 1.8], [-58, -6, -66, 90, 20, 11, 2.2], [58, -6, -66, 90, 20, 11, 2.2]]) { const a = gateArcade(len, h, bay, d, roseMat); a.position.set(x, y, z); a.castShadow = a.receiveShadow = true; scene.add(a); }
  // Islands far out, with a tower or two on them.
  const rock = new THREE.IcosahedronGeometry(1, 4), rp = rock.attributes.position;
  for (let i = 0; i < rp.count; i++) { let x = rp.getX(i), y = rp.getY(i), z = rp.getZ(i); const n = Math.sin(x * 5.1 + z * 3.3) * .1 + Math.sin(z * 9 + y * 4) * .05 + Math.cos(x * 13) * .03; if (y > .1) y = .1 + (y - .1) * .08; else y *= 1.7; rp.setXYZ(i, x * (1 + n), y, z * (1 + n)); }
  rock.computeVertexNormals();
  const isleMat = new THREE.MeshStandardMaterial({ color: lin(0x8c7f9c), roughness: 1, flatShading: true, metalness: 0 });
  const isles = [[-170, 36, -300, 42], [190, 58, -340, 56], [-70, 74, -420, 40], [96, 22, -260, 26], [-280, 90, -440, 70]];
  instanced(rock, isleMat, isles.map(([x, y, z, s]) => [x, y, z, s, s * .7, s]), false);
  instanced(far, [spireMat, domeMat, goldMat], isles.flatMap(([x, y, z, s]) => [[x - s * .2, y, z, s * .75, s * 1.05, s * .75], [x + s * .35, y, z + 4, s * .5, s * .7, s * .5]]), false);
  gateBuilt = .75; yield;
  // Plaza.
  const plaza = new THREE.Mesh(new THREE.PlaneGeometry(90, 90).rotateX(-Math.PI / 2), gateMaterial(tex.slab, { normal: 2.6, repeat: [9, 9] })); plaza.position.set(0, 0, 130); plaza.receiveShadow = true; scene.add(plaza);
  // Causeway from the door step to the plaza's edge, with kerbs and stone railings.
  const road = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 86).rotateX(-Math.PI / 2), gateMaterial(tex.pave, { normal: 2.8, repeat: [1, 12] })); road.position.set(0, 0, 42); road.receiveShadow = true; scene.add(road);
  const under = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2.2, 86), roseMat); under.position.set(0, -1.14, 42); scene.add(under);
  const kerb = new THREE.BoxGeometry(1, 1, 1), baluster = gateBaluster();
  instanced(kerb, ironMat, [[-3.75, .08, 42, .28, .2, 86], [3.75, .08, 42, .28, .2, 86]]);
  const rails = [], lamps = [], lampPosts = [];
  for (let z = 5; z < 85; z += .86) if (Math.round(z / .86) % 8) for (const x of [-3.75, 3.75]) rails.push([x, .16, z, .75, .92, .75]);
  for (let z = 5.5; z < 85; z += 6.88) for (const x of [-3.75, 3.75]) { lampPosts.push([x, .16, z, 1.5, 1.7, 1.5]); lamps.push([x, 1.98, z, .15]); }
  instanced(baluster, wallMat, rails); instanced(baluster, wallMat, lampPosts);
  instanced(kerb, goldMat, [[-3.75, 1.09, 45, .16, .05, 80], [3.75, 1.09, 45, .16, .05, 80]]);
  const glowBall = new THREE.SphereGeometry(1, 12, 8);
  instanced(glowBall, new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 1.7, .9), toneMapped: false }), lamps, false);
  instanced(new THREE.TorusGeometry(1, .14, 6, 12).rotateX(1.5708), goldMat, lamps.map(([x, y, z]) => [x, y - .14, z, .16]));
  // The plaza's railing, with the rose-lit lanterns from the walk.
  const edge = [], edgePosts = [], edgeLamps = [], arcs = [];
  for (let x = 4.45; x < 46; x += .7) for (const s of [-1, 1]) edge.push([s * x, 0, 85, 1, 1.25, 1]);
  for (let x = 4.6; x < 46; x += 5.6) for (const s of [-1, 1]) { edgePosts.push([s * x, 0, 85, 1.9, 2.4, 1.9]); edgeLamps.push([s * x, 2.55, 85, .2]); arcs.push([s * (x + 2.8), 2.1, 85, 2.8, 1.1, 1]); }
  instanced(baluster, ironMat, edge); instanced(baluster, ironMat, edgePosts);
  instanced(kerb, goldMat, [[25, 1.3, 85, 42, .09, .22], [-25, 1.3, 85, 42, .09, .22]]);
  instanced(glowBall, new THREE.MeshBasicMaterial({ color: new THREE.Color(3.4, 1.3, 2), toneMapped: false }), edgeLamps, false);
  instanced(new THREE.TorusGeometry(1, .03, 6, 20, Math.PI), ironMat, arcs);
  // The door surround: stepped mouldings, carved panel, brass inlay, a crowning star.
  const arch = (path, w, h) => { path.moveTo(-w, 0); path.lineTo(-w, h * .76); path.bezierCurveTo(-w, h * .93, -w * .5, h * .97, 0, h); path.bezierCurveTo(w * .5, h * .97, w, h * .93, w, h * .76); path.lineTo(w, 0); path.closePath(); return path; };
  const ring = (outerW, outerH, innerW, innerH, z, depth, material, bevel = .05) => {
    const s = arch(new THREE.Shape(), outerW, outerH); s.holes.push(arch(new THREE.Path(), innerW, innerH));
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 3, curveSegments: 28 }), material);
    m.position.z = z; m.castShadow = m.receiveShadow = true; scene.add(m); return m;
  };
  const DOOR_W = 1.75, DOOR_H = 6.1;
  ring(3.1, 8.3, 2.86, 7.98, -.3, .55, frameMat, .07);
  ring(2.86, 7.98, 2.5, 7.45, -.3, .82, carveMat, .04);
  ring(2.5, 7.45, 2.42, 7.32, -.3, 1, goldMat, .03);
  ring(2.42, 7.32, 2.06, 6.78, -.3, .84, frameMat, .05);
  ring(2.06, 6.78, 1.96, 6.6, -.3, 1.02, goldMat, .03);
  ring(1.96, 6.6, DOOR_W, DOOR_H, -.3, .78, wallMat, .04);
  const crown = gateLathe([[.0001, 0], [.3, 0], [.3, .06], [.16, .14], [.24, .22], [.08, .34], [.11, .4], [.03, .55], [.0001, 1]], 16); const crownM = new THREE.Mesh(crown, goldMat); crownM.position.set(0, 8.25, .1); crownM.scale.setScalar(1.15); scene.add(crownM);
  // Corbelled shoulders and pilasters each side of the arch.
  for (const s of [-1, 1]) {
    const pilaster = new THREE.Mesh(gateLathe([[.0001, 0], [.42, 0], [.42, .03], [.3, .05], [.26, .08], [.26, .9], [.34, .92], [.44, .97], [.44, 1], [.0001, 1]], 16), frameMat); pilaster.position.set(s * 3.3, .3, .35); pilaster.scale.set(1, 6, 1); pilaster.castShadow = true; scene.add(pilaster);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(.2, 16, 12), goldMat); orb.position.set(s * 3.3, 6.5, .35); scene.add(orb);
    const spike = new THREE.Mesh(new THREE.ConeGeometry(.09, .9, 8), goldMat); spike.position.set(s * 3.3, 7.1, .35); scene.add(spike);
  }
  // The leaves, hinged at each side, with light behind them.
  const leafMat = gateMaterial(tex.door, { normal: 3.4, extra: { side: THREE.DoubleSide } }); leafMat.emissiveIntensity = 1;
  const leaf = side => {
    const s = new THREE.Shape(), w = DOOR_W, h = DOOR_H;
    s.moveTo(0, 0); s.lineTo(side * w, 0); s.lineTo(side * w, h * .76); s.bezierCurveTo(side * w, h * .93, side * w * .5, h * .97, 0, h); s.closePath();
    const geo = new THREE.ShapeGeometry(s, 24), pos = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w) / (2 * w), pos.getY(i) / h);
    geo.translate(-side * w, 0, 0);
    const m = new THREE.Mesh(geo, leafMat); m.position.set(side * w, 0, .14); m.receiveShadow = true; scene.add(m); return m;
  };
  const leaves = [leaf(-1), leaf(1)];
  const glow = new THREE.Mesh(new THREE.ShapeGeometry(arch(new THREE.Shape(), DOOR_W, DOOR_H), 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 5.2, 3.6), toneMapped: false })); glow.position.z = .08; scene.add(glow);
  // Steps up to it, and the plum plinths from your picture, trimmed and lit.
  const stepMat = wallMat.clone(); stepMat.color = lin(0xe8c47c);
  instanced(kerb, stepMat, [[0, .1, 1.5, 8.2, .2, 3], [0, .3, 1.15, 7.2, .2, 2.3], [0, .5, .8, 6.4, .2, 1.6]]);
  instanced(kerb, goldMat, [[0, .205, 3.01, 8.24, .03, .05], [0, .405, 2.31, 7.24, .03, .05], [0, .605, 1.61, 6.44, .03, .05]]);
  instanced(kerb, plinthMat, [[-5.2, -1.4, 7.5, 2.4, 4.4, 3], [5.2, -1.4, 7.5, 2.4, 4.4, 3]]);
  instanced(kerb, goldMat, [[-5.2, .85, 7.5, 2.52, .1, 3.12], [5.2, .85, 7.5, 2.52, .1, 3.12], [-5.2, .5, 7.5, 2.46, .05, 3.06], [5.2, .5, 7.5, 2.46, .05, 3.06]]);
  instanced(baluster, wallMat, [[-5.2, .9, 7.5, 3, 1.3, 3], [5.2, .9, 7.5, 3, 1.3, 3]]);
  instanced(glowBall, new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 2, 1.1), toneMapped: false }), [[-5.2, 2.36, 7.5, .24], [5.2, 2.36, 7.5, .24]], false);
  gateBuilt = .85; yield;
  // The sea of clouds: billboards in one draw, far ones first since they can't be depth-sorted live.
  const puffs = [];
  for (let i = 0; i < 110; i++) { const side = rnd() < .5 ? -1 : 1, z = 70 - rnd() * 240, nearby = z > -10; puffs.push([side * (8.5 + rnd() * 110), nearby ? -7 + rnd() * 3.5 : -5.5 + rnd() * 4.5, z, nearby ? 12 + rnd() * 16 : 24 + rnd() * 30]); } // close ones sit lower and smaller, so they read as cloud and not a wall
  for (let i = 0; i < 24; i++) puffs.push([(rnd() - .5) * 120, -2.6 + rnd() * 1.6, 80 - rnd() * 8, 9 + rnd() * 10]);
  for (let i = 0; i < 26; i++) { const side = rnd() < .5 ? -1 : 1; puffs.push([side * (30 + rnd() * 260), 2 + rnd() * 34, -180 - rnd() * 170, 60 + rnd() * 110]); }
  for (const p of puffs) if (p[2] > -10 && Math.abs(p[0]) - p[3] / 2 < 5.5) p[1] = Math.min(p[1], -p[3] * .36); // anything under road level can't cover the road
  puffs.sort((a, b) => a[2] - b[2]);
  const puffGeo = new THREE.PlaneGeometry(1, 1), cells = new Float32Array(puffs.length);
  puffs.forEach((_, i) => { cells[i] = Math.floor(rnd() * 4); }); puffGeo.setAttribute('cell', new THREE.InstancedBufferAttribute(cells, 1));
  const puffUni = { map: { value: clouds.puffs }, lit: skyUni.cloudLit, dark: skyUni.cloudDark, rim: skyUni.cloudRim, time: skyUni.time };
  const puffMesh = instanced(puffGeo, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, toneMapped: false, uniforms: puffUni,
    vertexShader: `attribute float cell; varying vec2 vC; uniform float time; void main(){
      vec4 center = instanceMatrix*vec4(0.,0.,0.,1.); float s = length(instanceMatrix[0].xyz);
      center.x += sin(time*.05+center.z*.2)*1.2;
      vec4 mv = viewMatrix*center; mv.xy += position.xy*vec2(s,s*.72);
      vC = (uv+vec2(mod(cell,2.),floor(cell/2.)))*.5; gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `varying vec2 vC; uniform sampler2D map; uniform vec3 lit, dark, rim; void main(){
      vec4 c = texture2D(map,vC); if(c.g<.01) discard;
      gl_FragColor = vec4(mix(dark,lit,smoothstep(.04,.8,c.r))+rim*c.b*.8, c.g); }`,
  }), puffs.map(([x, y, z, s]) => [x, y, z, s]), false);
  puffMesh.receiveShadow = false; puffMesh.renderOrder = 2;
  // Motes of light, wrapping round the camera.
  const moteGeo = new THREE.BufferGeometry(), motePos = new Float32Array(GATE_Q.motes * 3), moteSeed = new Float32Array(GATE_Q.motes);
  for (let i = 0; i < GATE_Q.motes; i++) { motePos.set([rnd() * 34, rnd() * 16, rnd() * 34], i * 3); moteSeed[i] = rnd(); }
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3)); moteGeo.setAttribute('seed', new THREE.BufferAttribute(moteSeed, 1));
  const moteUni = { time: skyUni.time, eye: { value: new THREE.Vector3() }, tint: { value: new THREE.Color() }, px: { value: 1 } };
  const motes = new THREE.Points(moteGeo, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, uniforms: moteUni,
    vertexShader: `attribute float seed; uniform float time, px; uniform vec3 eye; varying float vA; void main(){
      vec3 p = position + vec3(sin(time*.2+seed*40.)*1.4, time*(.12+seed*.2), cos(time*.17+seed*30.)*1.4);
      p = mod(p-eye+17., vec3(34.,16.,34.))-vec3(17.,5.,17.)+eye;
      vec4 mv = viewMatrix*vec4(p,1.); gl_PointSize = px*(1.4+seed*2.6)*40./max(-mv.z,.5);
      vA = (.35+.65*sin(time*(.7+seed)+seed*90.)*.5+.32)*smoothstep(0.,4.,-mv.z); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `varying float vA; uniform vec3 tint; void main(){ float d = length(gl_PointCoord-.5); gl_FragColor = vec4(tint*smoothstep(.5,0.,d)*vA,1.); }`,
  }));
  motes.frustumCulled = false; motes.renderOrder = 3; scene.add(motes);
  // Light: a low sun ahead, and a soft fill keeps the shaded side painted, not black.
  const sun = new THREE.DirectionalLight(0xffffff, 1); sun.castShadow = true; sun.shadow.mapSize.set(GATE_Q.shadow, GATE_Q.shadow); sun.shadow.bias = -.0005; sun.shadow.normalBias = .03; sun.shadow.radius = 3;
  const fill = new THREE.DirectionalLight(0xffffff, 1); fill.position.set(.1, .4, 1);
  scene.add(sun, sun.target, fill);
  // Image-based light from the sky, so metal and stone pick up its colour.
  const pmrem = new THREE.PMREMGenerator(renderer), envScene = new THREE.Scene(), envSky = sky.clone(); envScene.add(envSky);
  const Z = GATE_SKY;
  for (const k of ['top', 'mid', 'low', 'cloudLit', 'cloudDark', 'cloudRim', 'sunTint']) skyUni[k].value.copy(Z[k]);
  skyUni.cirrusTint.value.copy(Z.cirrus); skyUni.sunDir.value.set(...Z.sunDir).normalize();
  scene.environment = pmrem.fromScene(envScene, .02, 1, 3000).texture;
  pmrem.dispose();
  gateBuilt = .95; yield;
  /* ---------- Finishing the picture: fog from depth, bloom, sun shafts, and a graded tone curve ---------- */
  const screen = new THREE.Scene(), flat = new THREE.Camera(), quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); quad.frustumCulled = false; screen.add(quad);
  const vertex = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }';
  const pass = (uniforms, fragmentShader) => new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader, depthTest: false, depthWrite: false, toneMapped: false });
  const atmos = pass({ color: { value: null }, depth: { value: null }, unproject: { value: new THREE.Matrix4() }, eye: { value: new THREE.Vector3() }, fog: { value: new THREE.Color() }, fogSun: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3() }, density: { value: 0 }, fall: { value: 0 } }, `
    varying vec2 vUv; uniform sampler2D color, depth; uniform mat4 unproject; uniform vec3 eye, fog, fogSun, sunDir; uniform float density, fall;
    void main(){
      vec3 c = texture2D(color,vUv).rgb; float z = texture2D(depth,vUv).r;
      if (z < .99999) {
        vec4 w = unproject*vec4(vUv*2.-1., z*2.-1., 1.); vec3 ray = w.xyz/w.w-eye; float dist = length(ray); ray /= dist;
        // Mist that thickens toward the clouds below: exponential height fog, integrated along the view ray.
        float rise = ray.y*fall, along = abs(rise) < 1e-4 ? dist : (1.-exp(-dist*rise))/rise;
        float amount = 1.-exp(-density*exp(-(eye.y+1.)*fall)*along-dist*density*.12), s = pow(max(dot(ray,sunDir),0.),5.);
        c = mix(c, mix(fog,fogSun*1.5,s), clamp(amount,0.,1.));
      }
      gl_FragColor = vec4(c,1.);
    }`);
  const bright = pass({ map: { value: null }, texel: { value: new THREE.Vector2() } }, `
    varying vec2 vUv; uniform sampler2D map; uniform vec2 texel;
    void main(){ vec3 c = vec3(0.); for(int i=0;i<4;i++){ vec2 o = vec2(mod(float(i),2.)*2.-1., float(i/2)*2.-1.)*texel; c += texture2D(map,vUv+o).rgb; } c *= .25;
      float l = max(c.r,max(c.g,c.b)); gl_FragColor = vec4(min(c*smoothstep(1.2,2.6,l),vec3(8.)),1.); }`);
  const down = pass({ map: { value: null }, texel: { value: new THREE.Vector2() } }, `
    varying vec2 vUv; uniform sampler2D map; uniform vec2 texel;
    void main(){ vec3 c = texture2D(map,vUv).rgb*4.; c += texture2D(map,vUv+texel*vec2(-1,-1)).rgb+texture2D(map,vUv+texel*vec2(1,-1)).rgb+texture2D(map,vUv+texel*vec2(-1,1)).rgb+texture2D(map,vUv+texel*vec2(1,1)).rgb; gl_FragColor = vec4(c/8.,1.); }`);
  const up = pass({ map: { value: null }, base: { value: null }, texel: { value: new THREE.Vector2() } }, `
    varying vec2 vUv; uniform sampler2D map, base; uniform vec2 texel;
    void main(){ vec3 c = vec3(0.); for(int i=0;i<8;i++){ float a = float(i)*.7854; c += texture2D(map,vUv+vec2(cos(a),sin(a))*texel*1.8).rgb*(mod(float(i),2.)<.5?1.:2.); } gl_FragColor = vec4(c/12.+texture2D(base,vUv).rgb,1.); }`);
  const shafts = pass({ map: { value: null }, depth: { value: null }, sun: { value: new THREE.Vector2() }, power: { value: 0 } }, `
    varying vec2 vUv; uniform sampler2D map, depth; uniform vec2 sun; uniform float power;
    float gate(vec2 uv){ vec3 c = texture2D(map,uv).rgb; return step(.99999,texture2D(depth,uv).r)*smoothstep(.8,3.2,max(c.r,max(c.g,c.b))); }
    void main(){ vec2 d = (sun-vUv)/float(${GATE_Q.rays}); vec2 p = vUv; float sum = 0., w = 1.; for(int i=0;i<${GATE_Q.rays};i++){ sum += gate(p)*w; w *= .965; p += d; } gl_FragColor = vec4(vec3(sum/float(${GATE_Q.rays})*power),1.); }`);
  const final = pass({ color: { value: null }, bloom: { value: null }, rays: { value: null }, rayTint: { value: new THREE.Color() }, exposure: { value: 1 } }, `
    varying vec2 vUv; uniform sampler2D color, bloom, rays; uniform vec3 rayTint; uniform float exposure;
    vec3 aces(vec3 x){ return clamp(x*(2.51*x+.03)/(x*(2.43*x+.59)+.14),0.,1.); }
    void main(){
      vec3 c = texture2D(color,vUv).rgb + texture2D(bloom,vUv).rgb*.32 + texture2D(rays,vUv).r*rayTint;
      c *= exposure*1.32; c = aces(c);
      float l = dot(c,vec3(.2126,.7152,.0722)); c = mix(vec3(l),c,1.2); // anime colour wants more chroma than film
      c = pow(max(c,vec3(0.)),vec3(1./2.2));
      vec2 q = vUv-.5; c *= 1.-dot(q,q)*.34;
      gl_FragColor = vec4(c,1.);
    }`);
  const air = { fog: Z.fog.clone(), fogSun: Z.fogSun.clone(), rays: Z.rays, exposure: Z.exposure };
  const targets = { w: 0, h: 0 };
  const sizeTargets = (w, h) => {
    if (targets.w === w && targets.h === h) return;
    for (const k of ['scene', 'air', 'rays', 'b0', 'b1', 'b2', 'b3', 'u0', 'u1', 'u2']) if (targets[k]) targets[k].dispose();
    const rt = (tw, th, more) => new THREE.WebGLRenderTarget(Math.max(1, tw), Math.max(1, th), { type: THREE.HalfFloatType, depthBuffer: false, ...more });
    targets.scene = rt(w, h, { depthBuffer: true, samples: GATE_Q.msaa, depthTexture: new THREE.DepthTexture(w, h, THREE.UnsignedIntType) });
    targets.air = rt(w, h);
    targets.rays = rt(w >> 2, h >> 2);
    for (let i = 0; i < 4; i++) targets['b' + i] = rt(w >> (i + 1), h >> (i + 1));
    for (let i = 0; i < 3; i++) targets['u' + i] = rt(w >> (i + 1), h >> (i + 1));
    targets.w = w; targets.h = h;
  };
  const run = (material, target) => { quad.material = material; renderer.setRenderTarget(target); renderer.render(screen, flat); };
  const sunWorld = new THREE.Vector3();
  const present = (drawW, drawH) => {
    sizeTargets(drawW, drawH);
    renderer.setRenderTarget(targets.scene); renderer.render(scene, cam);
    const au = atmos.uniforms; au.color.value = targets.scene.texture; au.depth.value = targets.scene.depthTexture;
    au.unproject.value.multiplyMatrices(cam.matrixWorld, cam.projectionMatrixInverse); au.eye.value.copy(cam.position);
    au.fog.value.copy(air.fog); au.fogSun.value.copy(air.fogSun); au.sunDir.value.set(...Z.sunDir).normalize(); au.density.value = Z.fogDensity; au.fall.value = Z.fogFall;
    run(atmos, targets.air);
    bright.uniforms.map.value = targets.air.texture; bright.uniforms.texel.value.set(1 / drawW, 1 / drawH); run(bright, targets.b0);
    for (let i = 1; i < 4; i++) { const from = targets['b' + (i - 1)]; down.uniforms.map.value = from.texture; down.uniforms.texel.value.set(1 / from.width, 1 / from.height); run(down, targets['b' + i]); }
    let last = targets.b3;
    for (let i = 2; i >= 0; i--) { up.uniforms.map.value = last.texture; up.uniforms.base.value = targets['b' + i].texture; up.uniforms.texel.value.set(1 / last.width, 1 / last.height); run(up, targets['u' + i]); last = targets['u' + i]; }
    sunWorld.set(...Z.sunDir).normalize().multiplyScalar(1500).add(cam.position).project(cam);
    shafts.uniforms.map.value = targets.air.texture; shafts.uniforms.depth.value = targets.scene.depthTexture; shafts.uniforms.sun.value.set(sunWorld.x * .5 + .5, sunWorld.y * .5 + .5); shafts.uniforms.power.value = sunWorld.z < 1 ? air.rays : 0;
    run(shafts, targets.rays);
    final.uniforms.color.value = targets.air.texture; final.uniforms.bloom.value = last.texture; final.uniforms.rays.value = targets.rays.texture; final.uniforms.rayTint.value.copy(skyUni.sunTint.value).multiplyScalar(.2); final.uniforms.exposure.value = air.exposure;
    run(final, null);
  };
  // The low sun squashes the whole walk, plaza to door, into one shadow map. Nothing here moves, so it renders once.
  const dir = new THREE.Vector3(...Z.lightFrom).normalize(), at = new THREE.Vector3(...Z.focus);
  sun.target.position.copy(at); sun.position.copy(at).addScaledVector(dir, 260); sun.color = lin(Z.sunColor); sun.intensity = Z.sunPower;
  const sc = sun.shadow.camera; sc.left = -Z.wide; sc.right = Z.wide; sc.bottom = -Z.tall; sc.top = Z.tall; sc.near = 1; sc.far = 520; sc.updateProjectionMatrix();
  fill.color = lin(Z.fill); fill.intensity = Z.fillPower;
  moteUni.tint.value.copy(lin(0xffdca0)).multiplyScalar(2.4);
  scene.traverse(o => { for (const m of [].concat(o.material || [])) if (m.isMeshStandardMaterial) m.envMapIntensity = m.metalness === 1 && !m.metalnessMap ? .9 : .4; }); // bright skies would otherwise wash the stone out; plain gold needs them
  renderer.compile(scene, cam);
  renderer.shadowMap.needsUpdate = true;
  // Behind the door it's night, on the Works page's colours. k runs from the afternoon (0) to that night (1).
  const NIGHT = { top: lin(0x0e1d39), mid: lin(0x14284b), low: lin(0x1f4268), cirrus: lin(0x27527a), cloudLit: lin(0x6a9dbd), cloudDark: lin(0x1b3c63), cloudRim: lin(0xa9cfdc).multiplyScalar(.35), sunTint: lin(0x3a6a96).multiplyScalar(.6), fog: lin(0x1c3658), fogSun: lin(0x27527a), sunColor: lin(0x9db8e0), fillColor: lin(0x5c7bb0) };
  const envLit = []; const glowLit = glow.material.color.clone(), glowEnd = lin(0x14284b);
  const setNight = (k, doorFade = 0) => {
    for (const n of ['top', 'mid', 'low', 'cloudLit', 'cloudDark', 'cloudRim', 'sunTint']) skyUni[n].value.copy(Z[n]).lerp(NIGHT[n], k);
    skyUni.cirrusTint.value.copy(Z.cirrus).lerp(NIGHT.cirrus, k); skyUni.night.value = k;
    air.fog.copy(Z.fog).lerp(NIGHT.fog, k); air.fogSun.copy(Z.fogSun).lerp(NIGHT.fogSun, k); air.rays = Z.rays * (1 - k); air.exposure = Z.exposure + k * .12;
    sun.color = lin(Z.sunColor).lerp(NIGHT.sunColor, k); sun.intensity = Z.sunPower * (1 - k * .78);
    fill.color = lin(Z.fill).lerp(NIGHT.fillColor, k); fill.intensity = Z.fillPower * (1 - k * .55);
    for (const [m, base] of envLit) m.envMapIntensity = base * (1 - k * .6);
    glow.material.color.copy(glowLit).lerp(glowEnd, doorFade); // the light through the door ends up the colour of what's beyond it
  };
  const puffSheet = (lit, dark, rim) => { // the gate's own baked clouds, coloured and handed over as a picture with soft edges
    const size = Math.round(1024 * GATE_Q.bake), target = new THREE.WebGLRenderTarget(size, size, { depthBuffer: false });
    quad.material = pass({ map: { value: clouds.puffs }, lit: { value: new THREE.Color(lit) }, dark: { value: new THREE.Color(dark) }, rim: { value: new THREE.Color(rim) } }, 'varying vec2 vUv; uniform sampler2D map; uniform vec3 lit, dark, rim; void main(){ vec4 c = texture2D(map,vUv); gl_FragColor = vec4(mix(dark,lit,smoothstep(.04,.8,c.r))+rim*c.b*.35, c.g); }');
    renderer.setRenderTarget(target); renderer.render(screen, flat);
    const pixels = new Uint8ClampedArray(size * size * 4); renderer.readRenderTargetPixels(target, 0, 0, size, size, pixels); renderer.setRenderTarget(null);
    quad.material.dispose(); target.dispose();
    const raw = document.createElement('canvas'), out = document.createElement('canvas'); raw.width = raw.height = out.width = out.height = size;
    raw.getContext('2d').putImageData(new ImageData(pixels, size, size), 0, 0);
    const x = out.getContext('2d'); x.translate(0, size); x.scale(1, -1); x.drawImage(raw, 0, 0); // pixels come back bottom row first
    return out;
  };
  scene.traverse(o => { for (const m of [].concat(o.material || [])) if (m.isMeshStandardMaterial) envLit.push([m, m.envMapIntensity]); });
  gateWorld = { scene, cam, sky, skyUni, moteUni, leaves, leafMat, present, puffSheet, setNight };
  gateBuilt = 1;
}
const gateSmooth = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
function gateCan() { return renderer && renderer.capabilities.isWebGL2 && (renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float')); }
function openGate(c, viaKeyboard) {
  if (!gateCan()) { openWorks(c, viaKeyboard); return; } // no HDR rendering on this device, so straight to the page behind the door
  if (!gateWorld && !gateBuilder) gateBuilder = buildGateWorld();
  gate = { c, viaKeyboard, phase: gateWorld ? 'load' : 'build', at: performance.now(), buildSpan: gateWorld ? 0 : .34 };
  if (gateWorld) { gateWorld.leaves[0].rotation.y = gateWorld.leaves[1].rotation.y = 0; gateWorld.leafMat.emissiveIntensity = 1; gateWorld.setNight(0); }
  if (COARSE) renderer.setPixelRatio(Math.min(maxPr, 1.25)); // this canvas gets copied again for the tube, so a phone can't afford full resolution
  hover = null; focusCard = null; glitch = reduced ? 0 : 1; dirty = true;
  $('#btn-about').hidden = $('#btn-talk').hidden = true;
  live.textContent = `Loading ${c.t}.`;
  keyboardFocus(backBtn);
}
function closeGate() {
  gate = null; renderer.setPixelRatio(maxPr); renderer.setRenderTarget(null); glitch = reduced ? 0 : .6; dirty = true;
  $('#btn-about').hidden = $('#btn-talk').hidden = false;
  live.textContent = '';
}
function gateClick() {
  if (gate.phase !== 'door' && !(gate.phase === 'arrive' && performance.now() - gate.at >= GATE_ARRIVE_MS - GATE_READY_MS)) return; // the door takes clicks once it asks for them
  gate.phase = 'enter'; gate.at = performance.now(); live.textContent = 'Entering.';
}
function gateWords(s, y, size, alpha, glow = 'rgba(255,214,150,.9)') {
  g.save(); g.globalAlpha = alpha; g.font = `600 ${size}px Cinzel, Georgia, serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; try { g.letterSpacing = `${size * .12}px`; } catch { /* older browsers just set it tighter */ }
  g.shadowColor = glow; g.shadowBlur = size * .9; g.fillStyle = '#fff8ea'; g.fillText(s, W / 2, y);
  g.shadowColor = 'rgba(40,20,70,.75)'; g.shadowBlur = size * .22; g.fillText(s, W / 2, y); g.restore();
}
function drawGateLoader(p, alpha, onWhite) {
  const bw = Math.min(W * .62, 460), x = (W - bw) / 2, y = H * .88, size = Math.max(10, Math.min(W * .03, 16)), ink = onWhite ? 'rgba(52,62,110,' : 'rgba(255,255,255,';
  g.globalAlpha = alpha;
  for (let i = 0; i < 5; i++) { // five boxes on the board, five stars to light
    const sx = x + bw * (i + .5) / 5, sy = y - size * 3, lit = gateSmooth((p - i / 5) * 5);
    g.beginPath(); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.2832, m = k % 2 ? size * .26 : size * (1 + lit * .3); g[k ? 'lineTo' : 'moveTo'](sx + Math.cos(a) * m, sy + Math.sin(a) * m); } g.closePath();
    g.save(); g.shadowColor = 'rgba(255,214,150,.95)'; g.shadowBlur = lit * size * 1.2; g.fillStyle = lit > .5 ? (onWhite ? '#b98a34' : '#fff6dc') : `${ink}.32)`; g.fill(); g.restore();
  }
  g.fillStyle = `${ink}.28)`; g.fillRect(x, y, bw, 2);
  g.fillStyle = onWhite ? '#b98a34' : '#fff6dc'; g.fillRect(x, y, bw * p, 2);
  g.globalAlpha = 1;
  if (onWhite) { g.save(); g.globalAlpha = alpha; g.font = `600 ${Math.max(14, H * .02)}px Cinzel, Georgia, serif`; g.textAlign = 'center'; g.fillStyle = '#4a4f78'; g.fillText('Loading', W / 2, y + Math.max(24, H * .034)); g.restore(); }
  else gateWords('Loading', y + Math.max(24, H * .034), Math.max(14, H * .02), alpha);
}
const gateShown = p => (p < .3 ? p * 1.6 : p < .55 ? .48 + (p - .3) * .3 : p < .8 ? .555 + (p - .55) * 1.1 : .83 + (p - .8) * .85); // eases on in fits and starts
function drawGate(now) {
  let t = now - gate.at;
  if (gate.phase === 'build') {
    if (gateBuilder) {
      let r;
      try { r = gateBuilder.next(); }
      catch (e) { // out of memory, most likely. The page behind the door works without the world, so don't leave them on the loader
        console.error(e); gateBuilder = null;
        const { c, viaKeyboard } = gate; closeGate(); openWorks(c, viaKeyboard); drawWorks(now); return;
      }
      if (r.done) gateBuilder = null;
    }
    g.fillStyle = '#f4f4f1'; g.fillRect(0, 0, W, H);
    drawGateLoader(gateBuilt * gate.buildSpan, gateSmooth(t / 300), true);
    if (gateWorld && !gateBuilder) { gate.phase = 'load'; gate.at = now; }
    return;
  }
  const w = gateWorld, stop = W < H * .9 ? 31 : 22, stride = reduced ? 0 : 1.5; // walking pace, units a second
  gate.walkFrom = gate.walkFrom || now;
  const walkZ = () => 112 - (now - gate.walkFrom) / 1000 * stride, bob = reduced ? 0 : Math.sin(now / 340) * .03;
  if (gate.phase === 'load' && t >= GATE_LOAD_MS) { gate.phase = 'arrive'; gate.at = now; gate.startZ = walkZ(); t = 0; }
  if (gate.phase === 'arrive' && t >= GATE_ARRIVE_MS) { gate.phase = 'door'; live.textContent = 'A door. Press Enter to go in.'; }
  let z, y, aimY, aimZ, white = 0, loading = 0;
  if (gate.phase === 'load') {
    z = walkZ(); y = 1.75 + bob; aimY = y + 6.6; aimZ = z - 50; white = 1 - gateSmooth(t / 700); loading = 1;
  } else if (gate.phase === 'arrive' || gate.phase === 'door') {
    // One unbroken move: it leaves at walking pace, gathers speed, and takes its time settling in front of the door.
    const s = Math.min(1, t / GATE_ARRIVE_MS), k = gateSmooth(1 - (1 - s) ** 1.6);
    z = gate.startZ + (stop - gate.startZ) * k - stride * GATE_ARRIVE_MS / 1000 * s * (1 - s) ** 4;
    y = 1.75 + .55 * k + bob * (1 - k); aimY = 8.35 + (4.3 - 8.35) * k; aimZ = (z - 50) * (1 - k);
    loading = 1 - gateSmooth(t / 600);
    gate.held = { z, y, aimY, aimZ };
  } else {
    // The door opens as night falls, and only then does the camera go through, into the dark beyond it.
    const u = t / GATE_ENTER_MS, open = gateSmooth(u / .42), push = gateSmooth((u - .42) / .58) ** 2, f = gate.held;
    w.setNight(gateSmooth(u / .6), gateSmooth((u - .42) / .3));
    w.leaves[0].rotation.y = open * 1.55; w.leaves[1].rotation.y = -open * 1.55; w.leafMat.emissiveIntensity = 1 + open * 2;
    z = f.z + (.9 - f.z) * push; y = f.y + (3.05 - f.y) * push; aimY = f.aimY + (3.6 - f.aimY) * push; aimZ = f.aimZ + (-10 - f.aimZ) * push; white = gateSmooth((u - .88) / .12);
    if (t >= GATE_ENTER_MS) { const { c, viaKeyboard } = gate; closeGate(); openWorks(c, viaKeyboard); drawWorks(now); return; }
  }
  w.skyUni.time.value = now / 1000;
  w.cam.aspect = W / H; w.cam.updateProjectionMatrix();
  w.cam.position.set(look.x * .012 + (reduced ? 0 : Math.sin(now / 2300) * .06), y - look.y * .006, z);
  w.cam.lookAt(0, aimY, aimZ); w.cam.updateMatrixWorld();
  w.sky.position.copy(w.cam.position);
  w.moteUni.eye.value.copy(w.cam.position); w.moteUni.px.value = renderer.getPixelRatio();
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  w.present(size.x, size.y);
  g.drawImage(renderer.domElement, 0, 0, W, H); // same task as the render, while its buffer is still valid
  if (loading > 0) drawGateLoader(gate.phase === 'load' ? gate.buildSpan + (1 - gate.buildSpan) * gateShown(Math.min(1, t / GATE_LOAD_MS)) : 1, loading * (1 - white), false);
  if (white > 0) { g.globalAlpha = white; g.fillStyle = gate.phase === 'enter' ? '#14284b' : '#fff'; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
  if (gate.phase === 'arrive' || gate.phase === 'door') {
    const a = gateSmooth((t - (GATE_ARRIVE_MS - GATE_READY_MS)) / 700);
    if (a > 0) {
      gateWords(gate.c.t.toUpperCase(), H * .115, Math.min(W * .082, H * .06), a);
      gateWords(COARSE ? 'Tap to Enter' : 'Click to Enter', H * .905, Math.max(15, H * .024), a * (reduced ? 1 : .8 + .2 * Math.sin(now / 480)));
    }
  }
}

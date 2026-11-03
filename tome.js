/* Box 3: a pop-up book on a wooden table. Each page turn is a new chapter of the résumé. */

/* ---------- Words: a chapter with parts takes a page for each part, all in the same world ---------- */
const TOME_WORDS = {
  cover: 'Chronicle',
  chapters: [
    { name: 'Summary', lead: "Backend AI engineering intern at FlyRank AI, building AI capstones, automations and agent skills. BS Computer Science at FEU Institute of Technology, Dean's Lister. 16 certifications, from SAP and PMI to seven Claude Academy courses.", pills: ['1 internship', '16 certifications', "Dean's Lister", 'Open to work'] },
    { name: 'Experience', entries: [{ h: 'Backend AI Engineering Intern', m: 'FlyRank AI, Sep 2026 to present. Manila, remote', d: 'AI capstones, automation and data-heavy apps, agent skills with documentation, and token and cost analysis.' }] },
    { name: 'Education', entries: [
      { h: 'BS Computer Science, Software Engineering', m: 'FEU Institute of Technology, 2023 to 2027', d: "Dean's Lister, 3rd Term, S.Y. 2024-2025" },
      { h: 'Senior High School, STEM', m: 'St. Paul University at San Miguel, 2022 to 2023' },
      { h: 'Senior High School, STEM', m: 'San Miguel National High School, 2021 to 2022', d: 'With High Honors' },
      { h: 'Primary and Junior High School', m: 'St. Paul University at San Miguel, 2011 to 2021' },
    ] },
    { name: 'Certifications', parts: [
      { label: 'Professional', entries: [
        { h: 'SAP Certified: Positioning the Autonomous Enterprise', m: 'SAP, Jul 2026', img: 'sap-autonomous-enterprise', big: true, verify: ['Verify', 'https://www.credly.com/badges/a696c2ef-883c-4170-b81c-14a42787a711'] },
        { h: 'PMI Project Management Ready', m: 'Project Management Institute, Mar 2026', img: 'pmi-project-management-ready', big: true, d: 'Certiport code wYUQy-2FaU', verify: ['Verify', 'https://verify.certiport.com'] },
        { h: 'IT Specialist: Python', m: 'Pearson, Jul 2025', img: 'it-specialist-python', big: true, d: 'Certiport code bhzD-s4NA', verify: ['Verify', 'https://verify.certiport.com'] },
      ] },
      { label: 'Claude Academy', lead: 'Seven courses from Anthropic, September 2026.', badges: [['Building effective human-agent teams', 'claude-human-agent-teams'], ['Claude Platform 101', 'claude-platform-101'], ['Claude Code 101', 'claude-code-101'], ['Claude Code in action', 'claude-code-in-action'], ['AI capabilities and limitations', 'claude-ai-capabilities', true, 'https://academy.claude.com/verify/00df819cd8f793402ac8a521e5a422d3'], ['Introduction to Model Context Protocol', 'claude-mcp-intro'], ['Model Context Protocol: Advanced topics', 'claude-mcp-advanced']] },
      { label: 'Courses', dense: true, entries: [
        { h: 'AI Agent Fundamentals', m: 'Databricks, Sep 2026', img: 'databricks-ai-agents', big: true },
        { h: 'Intro to Deep Learning', m: 'Kaggle, Sep 2026', img: 'kaggle-deep-learning', big: false },
        { h: 'MATLAB Onramp', m: 'MathWorks, Nov 2025', img: 'matlab-onramp', big: true },
        { h: 'CCNA: Introduction to Networks', m: 'Cisco, Sep 2025', img: 'cisco-ccna-itn', big: false },
        { h: 'Android Development with Kotlin', m: 'LinkedIn Learning, Nov 2025', img: 'linkedin-kotlin', big: false },
        { h: 'Agile Software Development', m: 'LinkedIn Learning, Nov 2025', img: 'linkedin-agile', big: false },
      ] },
    ] },
    { name: 'Awards', entries: [
      { h: "Dean's Bronze Certificate", m: 'FEU Institute of Technology, Jul 2025', d: '3rd Term, S.Y. 2024-2025', img: 'feu-deans-bronze' },
      { h: 'Academic Excellence Award', m: 'San Miguel National High School, Jun 2022', d: 'With High Honors, Grade 11 STEM', img: 'smnhs-academic-excellence', big: true },
    ] },
    { name: 'Skills', entries: [
      { h: 'Languages', pills: ['TypeScript', 'JavaScript', 'Python', 'C++', 'C#', 'Java', 'Kotlin', 'MATLAB'] },
      { h: 'AI', pills: ['AI Agents', 'Orchestration', 'MCP', 'RAG', 'LLMs', 'Prompt Engineering', 'Deep Learning', 'TensorFlow', 'Computer Vision'] },
      { h: 'Software', pills: ['React', 'Full-stack', 'APIs', 'CI/CD', 'System Architecture', 'Android', 'Agile', 'Networking'] },
    ] },
  ],
};
// Which projects show each skill (from what each project's page says it uses); a skill with none isn't a link.
const TOME_SKILL_PROJECTS = { Python: ['Ascend Core', 'Ascend Vision', 'Wake&Brake'], JavaScript: ['Ascend Hub', 'Ascend Core'], 'C++': ['Wake&Brake'], 'AI Agents': ['Ascend Hub', 'Ascend Vision'], Orchestration: ['Ascend Hub'], LLMs: ['Ascend Hub', 'Ascend Core', 'Ascend Vision'], 'Prompt Engineering': ['Ascend Vision'], 'Computer Vision': ['Ascend Vision', 'Wake&Brake'], React: ['Ascend Hub', 'Ascend Core'], 'Full-stack': ['Ascend Core'], APIs: ['Ascend Core', 'Wake&Brake'] };
const TOME_CERTS = {}; // the certificate pictures, loaded when the book first opens
function tomeCertsLoad() {
  for (const c of TOME_WORDS.chapters) for (const part of c.parts || [c]) for (const name of [...(part.entries || []).map(e => e.img), ...(part.badges || []).map(b => b[1])]) {
    if (!name || TOME_CERTS[name]) continue;
    const im = TOME_CERTS[name] = new Image(); im.onload = () => { if (tome && tome.layout) { tome.layout.cards = []; dirty = true; } }; im.src = `photos/certs/${name}.jpg`;
  }
}
const TOME_PAGES = TOME_WORDS.chapters.flatMap((c, ci) => (c.parts || [c]).map(p => ({ ...p, name: c.name, ci })));
const TOME_NUM = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const TOME_FIT_H = 17, TOME_FIT_TALL = 17.5, TOME_LIFT = 2.2; // how much height the camera keeps for the book and its pop-ups, and how far above the pages it aims
const TOME_PW = 10, TOME_PD = 13, TOME_TOP = 1.5, TOME_GUT = .42; // page width, page depth, height of the page block, how far the pages dip at the spine
const TOME_TURN_MS = reduced ? 1 : 1150, TOME_OPEN_MS = reduced ? 1 : 1900, TOME_FOLD_MS = 320, TOME_POP_MS = 640, TOME_TILT = new THREE.Vector3(0, .64, .77).normalize(), TOME_AIM = new THREE.Vector3(0, 2.6, 1.3);
const TOME_INK = '#3b2a1c', TOME_GOLD = '#c9a24a', TOME_SERIF = 'Cinzel, Georgia, serif', TOME_SANS = 'Poppins, "Segoe UI", sans-serif';
let tome = null, tomeWorld = null, tomeBuilder = null, tomeBuilt = 0;
const tomeY = d => TOME_TOP - TOME_GUT * Math.exp(-d / .9) + .2 * Math.sin(Math.PI * Math.min(1, d / TOME_PW)); // the height of a page, d from the spine

/* ---------- Low-poly parts ---------- */
const tomeMats = new Map(), tomeLinear = c => new THREE.Color(c).convertSRGBToLinear(); // colours are written as sRGB, and this version of three reads them as linear
function tomeMat(color, extra) {
  const key = color + JSON.stringify(extra || 0);
  if (!tomeMats.has(key)) tomeMats.set(key, new THREE.MeshStandardMaterial({ roughness: .85, flatShading: true, envMapIntensity: .12, ...extra, color: tomeLinear(color), emissive: tomeLinear((extra && extra.emissive) || 0) }));
  return tomeMats.get(key);
}
const tomeGlow = (color, power = 1.3) => tomeMat(color, { emissive: color, emissiveIntensity: power, roughness: .5 });
function tomeMesh(geo, mat, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geo, typeof mat === 'string' ? tomeMat(mat) : mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; return m; }
const tomeBox = (w, h, d, mat, x = 0, y = h / 2, z = 0) => tomeMesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z);
const tomeCyl = (a, b, h, mat, x = 0, y = h / 2, z = 0, seg = 8) => tomeMesh(new THREE.CylinderGeometry(a, b, h, seg), mat, x, y, z);
const tomeCone = (r, h, mat, x = 0, y = h / 2, z = 0, seg = 7) => tomeMesh(new THREE.ConeGeometry(r, h, seg), mat, x, y, z);
const tomeBall = (r, mat, x = 0, y = r, z = 0, sx = 1, sy = 1, sz = 1) => { const m = tomeMesh(new THREE.IcosahedronGeometry(r, 0), mat, x, y, z); m.scale.set(sx, sy, sz); return m; };
const tomeGroup = (...parts) => { const o = new THREE.Group(); o.add(...parts); return o; };
function tomeRoof(w, d, mat, y) { const r = w / 1.62, m = tomeMesh(new THREE.CylinderGeometry(r, r, d, 3).rotateX(-Math.PI / 2), mat, 0, y + r * .5); return m; } // a prism with its edge up

function tomeTree(rnd, kind, s = 1, leaf) {
  const o = new THREE.Group();
  if (kind === 'pine') {
    o.add(tomeCyl(.14, .2, .7, '#6a4a30'));
    const c = leaf || ['#55805f', '#648f6a', '#4c7557'][Math.floor(rnd() * 3)];
    [[1.15, 1.5, .5], [.92, 1.3, 1.2], [.66, 1.1, 1.9]].forEach(([r, h, y]) => o.add(tomeCone(r, h, c, 0, y + h / 2, 0, 6)));
  } else {
    o.add(tomeCyl(.11, .19, 1.1, '#7a5a3c'));
    const c = leaf || ['#b9cc8c', '#a4bd7b', '#c8d69a'][Math.floor(rnd() * 3)];
    o.add(tomeBall(.82, c, 0, 1.7)); o.add(tomeBall(.55, c, .55, 1.25)); o.add(tomeBall(.5, c, -.5, 1.4));
  }
  o.scale.setScalar(s); o.rotation.y = rnd() * 6.28;
  return o;
}
function tomeHouse(w, d, h, wall, roof, timber = '#4c3322') {
  const o = tomeGroup(tomeBox(w, h, d, wall), tomeRoof(w, d * 1.12, roof, h));
  for (const k of [-1, 1]) o.add(tomeBox(.1, h, .05, timber, k * (w / 2 - .06), h / 2, d / 2 + .02));
  o.add(tomeBox(w, .1, .05, timber, 0, h * .55, d / 2 + .02));
  o.add(tomeBox(.5, h * .5, .06, timber, 0, h * .25, d / 2 + .03));
  o.add(tomeBox(.34, .34, .06, tomeGlow('#ffcf70', 1.2), w * .3, h * .76, d / 2 + .03), tomeBox(.34, .34, .06, tomeGlow('#ffcf70', 1.2), -w * .3, h * .76, d / 2 + .03));
  o.add(tomeBox(.35, h * .7, .35, '#8a7a70', w * .28, h + h * .3, -d * .2));
  return o;
}
function tomeTower(r, h, stone, cap, flag) {
  const o = tomeGroup(tomeCyl(r * .92, r, h, stone), tomeCyl(r * 1.16, r * .95, .35, stone, 0, h + .17), tomeCone(r * 1.22, r * 2.1, cap, 0, h + .35 + r * 1.05, 0, 8));
  o.add(tomeBox(.3, .55, .08, tomeGlow('#ffcf70', 1.1), 0, h * .68, r * .92));
  if (flag) o.add(tomeFlag(flag, 1.1, h + .35 + r * 2.1));
  return o;
}
function tomeFlag(color, s = 1, y = 0) {
  const cloth = tomeMesh(new THREE.ConeGeometry(.28 * s, .95 * s, 3).rotateZ(-Math.PI / 2), tomeMat(color, { side: THREE.DoubleSide }), .46 * s, y + 1 * s);
  cloth.scale.z = .15; cloth.userData.wave = true;
  return tomeGroup(tomeCyl(.035, .035, 1.25 * s, '#5a4632', 0, y + .62 * s, 0, 5), cloth);
}
function tomeMountain(rnd, r, h, rock, snow) {
  const geo = new THREE.ConeGeometry(r, h, 6, 2).toNonIndexed(), p = geo.attributes.position, jitter = new Map();
  for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (y > -h / 2 + .01 && y < h / 2 - .01) { const key = `${p.getX(i).toFixed(2)}|${y.toFixed(2)}|${p.getZ(i).toFixed(2)}`; if (!jitter.has(key)) jitter.set(key, [(rnd() - .5) * r * .22, (rnd() - .5) * r * .22]); const [a, b] = jitter.get(key); p.setX(i, p.getX(i) + a); p.setZ(i, p.getZ(i) + b); } }
  geo.computeVertexNormals();
  const o = tomeGroup(tomeMesh(geo, rock, 0, h / 2));
  if (snow) o.add(tomeCone(r * .36, h * .36, snow, 0, h * .82, 0, 6));
  return o;
}
function tomeRock(rnd, s, color = '#a9adb4') { const m = tomeMesh(new THREE.DodecahedronGeometry(s, 0), color, 0, s * .55); m.scale.y = .72; m.rotation.y = rnd() * 6; return tomeGroup(m); }
function tomeSheep() { const o = tomeGroup(tomeBall(.3, '#f3efe2', 0, .32, 0, 1.25, .9, 1), tomeBall(.14, '#3c332c', .36, .42)); for (const [x, z] of [[-.16, .12], [.16, .12], [-.16, -.12], [.16, -.12]]) o.add(tomeBox(.05, .16, .05, '#3c332c', x, .08, z)); return o; }
function tomeTent(color) { const m = tomeCone(1.25, 1.7, color, 0, .85, 0, 4); m.rotation.y = Math.PI / 4; return tomeGroup(m, tomeCyl(.03, .03, 2, '#5a4632', 0, 1, 0, 5), tomeBox(.5, .9, .06, '#3a2a20', 0, .45, .82)); }
function tomeSign(color = '#8a6238') { const b = tomeBox(1.05, .3, .07, color, .18, 1.2); return tomeGroup(tomeCyl(.05, .06, 1.5, '#5a4632', 0, .75, 0, 5), b, tomeBox(.9, .24, .07, '#a67a48', -.14, .8)); }
function tomeFire() { const flame = tomeCone(.2, .6, tomeGlow('#ff9d3a', 2.4), 0, .4, 0, 5); flame.userData.flick = true; const o = tomeGroup(flame); for (let i = 0; i < 5; i++) { const a = i / 5 * 6.28, l = tomeBox(.5, .08, .08, '#54392a', Math.cos(a) * .15, .08, Math.sin(a) * .15); l.rotation.y = -a; o.add(l); } return o; }
function tomeScroll() {
  const sheet = tomeBox(1.9, 2.4, .05, '#efe2c2', 0, 1.65);
  const o = tomeGroup(sheet);
  for (const y of [.45, 2.85]) { const r = tomeCyl(.17, .17, 2.2, '#dcc99e', 0, y, 0, 8); r.rotation.z = Math.PI / 2; o.add(r); }
  for (const y of [1.15, 1.55, 1.95, 2.35]) o.add(tomeBox(1.35, .07, .06, '#8f7a5a', 0, y, .02));
  const seal = tomeCyl(.3, .3, .1, tomeMat('#b33a35', { roughness: .4 }), .32, .82, .06, 10); seal.rotation.x = Math.PI / 2; o.add(seal);
  return o;
}
function tomeTrophy(s = 1) {
  const gold = tomeMat('#e7b53f', { metalness: .85, roughness: .32, flatShading: false, envMapIntensity: .8 });
  const cup = new THREE.LatheGeometry([[0, 0], [.62, 0], [.62, .14], [.17, .3], [.12, 1.1], [.24, 1.3], [.62, 1.72], [.74, 2.95], [.66, 2.95], [.52, 1.84], [0, 1.52]].map(([x, y]) => new THREE.Vector2(x, y)), 16);
  const o = tomeGroup(tomeMesh(cup, gold));
  for (const k of [-1, 1]) { const h = tomeMesh(new THREE.TorusGeometry(.33, .065, 6, 12), gold, k * .76, 2.35); h.scale.y = 1.25; o.add(h); }
  o.scale.setScalar(s);
  return o;
}
function tomeStar(color = '#ffd76a') {
  const shape = new THREE.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? .19 : .46, a = i / 10 * 6.2832 + Math.PI / 2; shape[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
  return tomeMesh(new THREE.ExtrudeGeometry(shape, { depth: .12, bevelEnabled: false }).center(), tomeGlow(color, 1));
}
function tomeCrystal(color, s = 1) { const m = tomeMesh(new THREE.OctahedronGeometry(.5 * s, 0), tomeGlow(color, 1.5)); m.scale.y = 1.6; return m; }
function tomeBooks(rnd, s = 1) {
  const o = new THREE.Group(); let y = 0;
  ['#a0433a', '#3f6e8c', '#d2a44a', '#55805f'].forEach(c => { const h = .55 * s, b = tomeBox(3 * s * (.8 + rnd() * .3), h, 2.1 * s, c, 0, y + h / 2); b.rotation.y = (rnd() - .5) * .35; o.add(b); o.add(tomeBox(b.geometry.parameters.width * .96, h * .68, 2.1 * s + .02, '#efe7d2', .05 * s, y + h / 2)); y += h; });
  return o;
}

/* ---------- The six worlds: painted land on the pages, things that pop up off them ---------- */
const tomeBlob = (x, pts, color) => { x.fillStyle = color; x.beginPath(); pts.forEach((p, i) => { const a = pts[(i + 1) % pts.length], mx = (p[0] + a[0]) / 2, my = (p[1] + a[1]) / 2; if (!i) x.moveTo((pts[pts.length - 1][0] + p[0]) / 2, (pts[pts.length - 1][1] + p[1]) / 2); x.quadraticCurveTo(p[0], p[1], mx, my); }); x.closePath(); x.fill(); };
const tomePath = (x, pts, width, color) => { x.strokeStyle = color; x.lineWidth = width; x.lineCap = x.lineJoin = 'round'; x.beginPath(); x.moveTo(...pts[0]); for (let i = 1; i < pts.length - 1; i++) x.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); x.lineTo(...pts[pts.length - 1]); x.stroke(); };
const TOME_LANDS = [
  { sky: ['#a9c07f', '#98b271', '#bcd08f'], road: '#e4c79a', water: '#8fb9d6',
    paint(x, P, rnd) { tomePath(x, P([[-1, -7], [.8, -3], [-.6, 1], [.6, 5.2]]), 62, '#7fa8c4'); tomePath(x, P([[-1, -7], [.8, -3], [-.6, 1], [.6, 5.2]]), 46, '#a6cce0'); tomePath(x, P([[-9.6, 2.6], [-5, 2.2], [-1, 1.6], [3, 2.4], [6, .6], [9.6, 1]]), 20, '#e4c79a'); tomePath(x, P([[6, .6], [5.4, -2.2], [7, -5.8]]), 16, '#e4c79a'); },
    props(put, rnd) {
      const mill = tomeGroup(tomeCyl(.95, 1.45, 3.1, '#e9e1d0'), tomeCone(1.25, 1.1, '#d9743f', 0, 3.6)), blades = new THREE.Group(); blades.position.set(0, 3.2, 1.2);
      for (let i = 0; i < 4; i++) { const b = tomeGroup(tomeBox(.1, 2.5, .05, '#6e5238', 0, 1.25), tomeBox(.55, 1.9, .03, '#f1e9d8', .3, 1.5)); b.rotation.z = i * Math.PI / 2; blades.add(b); }
      blades.userData.spin = [0, 0, .9]; mill.add(blades);
      put(mill, -6.6, -2.4, { s: 1 });
      put(tomeHouse(3.2, 2.5, 1.9, '#f3ead6', '#d9743f'), 3.6, -1, { ry: -.25 });
      put(tomeHouse(2.2, 1.8, 1.4, '#efe3cb', '#b45f3a'), 6.9, -3.4, { ry: .35 });
      put(tomeSign(), -2.4, 2.9);
      for (const [a, b] of [[-3, 3.6], [-2.2, 4.1], [-3.8, 4.2]]) put(tomeSheep(), a, b, { ry: rnd() * 6 });
      for (const [a, b, s] of [[-8.6, -4.8, 1.2], [-4, -4.8, 1], [-3.2, -1.2, .9], [1.9, -4.8, 1.2], [8.6, 3.4, 1], [5.2, 3.8, .85], [-8.4, 3.6, .9], [8.6, -.8, 1.05]]) put(tomeTree(rnd, 'leaf', s), a, b);
      for (const [a, b, s] of [[-9, -2.4, 1], [3.6, -4.6, 1.1], [8.9, -5, 1.1]]) put(tomeTree(rnd, 'pine', s), a, b);
      for (const [a, b] of [[2, 3.8], [-5.8, 3.8]]) put(tomeRock(rnd, .42), a, b);
      const balloon = tomeGroup(tomeBall(1.15, '#e2694b', 0, 0, 0, 1, 1.12, 1), tomeBall(1.16, '#f4e3bf', 0, 0, 0, .55, 1.13, 1.01), tomeBox(.55, .4, .55, '#8a6238', 0, -1.9));
      for (const [a, b] of [[-.22, -.22], [.22, -.22], [-.22, .22], [.22, .22]]) balloon.add(tomeCyl(.012, .012, .8, '#5a4632', a, -1.35, b, 4));
      put(balloon, -1.6, -3.4, { y: 6.2, fly: true, bob: .3 });
    } },
  { sky: ['#d8b56a', '#c9a257', '#e6c67c'], road: '#f0dcae', water: '#7fa8a8',
    paint(x, P) { tomePath(x, P([[-9.6, 4.4], [-5.6, 3], [-3.4, 0], [.2, .8], [3.2, 2.4], [6, -.6], [4, -3.4], [8, -5.8]]), 56, '#b08a4c'); tomePath(x, P([[-9.6, 4.4], [-5.6, 3], [-3.4, 0], [.2, .8], [3.2, 2.4], [6, -.6], [4, -3.4], [8, -5.8]]), 42, '#f0dcae'); },
    props(put, rnd) {
      put(tomeTent('#b5543f'), -7, .9, { ry: .4 }); put(tomeTent('#e0ad5a'), -8.6, 3.2, { ry: -.3, s: .8 }); put(tomeFire(), -5.8, 1.6);
      put(tomeHouse(3.4, 2.5, 2.2, '#efe0c2', '#7f4a30'), .4, -2.1, { ry: .15 });
      const crane = tomeGroup(tomeBox(.16, 3.6, .16, '#6e5238', 0, 1.8)), arm = tomeBox(2.2, .14, .14, '#6e5238', .8, 3.5); crane.add(arm, tomeCyl(.015, .015, 1, '#3a2a20', 1.75, 3, 0, 4), tomeBox(.4, .35, .4, '#a67a48', 1.75, 2.35)); put(crane, 3.1, -3);
      put(tomeTower(1.05, 4.2, '#c6bba6', '#b5543f', '#b5543f'), 7.6, -3.6);
      for (const [a, b] of [[-3.9, 2.2], [1.1, 2.7], [6.9, 1]]) put(tomeSign(), a, b, { ry: rnd() - .5 });
      const wagon = tomeGroup(tomeBox(1.6, .55, 1, '#8a6238', 0, .55), tomeBox(1.2, .5, .8, '#e0ad5a', 0, 1.05)); for (const [a, b] of [[-.55, .52], [.55, .52], [-.55, -.52], [.55, -.52]]) { const w = tomeCyl(.26, .26, .08, '#4c3322', a, .26, b, 10); w.rotation.x = Math.PI / 2; wagon.add(w); } put(wagon, -2, -3.4, { ry: .5 });
      for (const [a, b, s] of [[-9, -2.2, 1.1], [-5.2, -4.7, 1.2], [-7.4, -4.7, 1], [4.7, 3.8, 1], [8.6, 3.2, 1.2], [2.4, -4.9, .95], [-3.1, 4, .85], [9, -.6, .9]]) put(tomeTree(rnd, 'leaf', s, ['#d6793c', '#e29a3e', '#c9592f'][Math.floor(rnd() * 3)]), a, b);
    } },
  { sky: ['#8fb29a', '#7ea38b', '#a0c0a4'], road: '#d9d3c0', water: '#7da8cf',
    paint(x, P) { tomeBlob(x, P([[-9.4, 1], [-5.6, -.3], [-1.6, 1.4], [-2, 4.4], [-6.6, 5], [-9.4, 4.6]]), '#6f9dc4'); tomeBlob(x, P([[-8.8, 1.8], [-5.6, .9], [-2.6, 2], [-3, 3.9], [-6.6, 4.3], [-8.8, 3.9]]), '#92bcd9'); tomePath(x, P([[9.4, 4.4], [5.4, 3], [2.2, 2.6], [1.8, .4]]), 34, '#d9d3c0'); },
    props(put, rnd) {
      const hall = tomeGroup(tomeBox(6.4, 2.8, 2.6, '#d9d3c6'), tomeRoof(6.4, 2.9, '#3f6e8c', 2.8)), roofFix = hall.children[1]; roofFix.geometry = new THREE.CylinderGeometry(1.7, 1.7, 6.5, 3).rotateX(-Math.PI / 2).rotateY(Math.PI / 2); roofFix.position.y = 2.8 + .85;
      for (let i = 0; i < 5; i++) hall.add(tomeBox(.5, 1.2, .06, tomeGlow('#ffd98a', .9), -2.4 + i * 1.2, 1.5, 1.32));
      hall.add(tomeBox(1, 1.5, .08, '#4c3322', 0, .75, 1.34));
      put(hall, 2.2, -2.6);
      put(tomeTower(1.05, 5.4, '#d9d3c6', '#3f6e8c', '#d2a44a'), -1.6, -3.2); put(tomeTower(1.05, 5.4, '#d9d3c6', '#3f6e8c', '#d2a44a'), 6, -3.2); put(tomeTower(.8, 5.6, '#cfc8ba', '#2f5a78', '#a0433a'), 2.2, -5);
      const cap = tomeGroup(tomeBox(2.5, .12, 2.5, '#2b2d3a', 0, 1.82), tomeBox(1.25, .55, 1.25, '#2b2d3a', 0, 1.5), tomeBox(.08, .9, .08, '#d2a44a', 1, 1.35, 1), tomeBall(.13, tomeGlow('#d2a44a', .5), 1, .86, 1)); cap.children[0].rotation.y = Math.PI / 4;
      const books = tomeBooks(rnd, 1); cap.position.y = .4; books.add(cap); put(books, 7.4, 1.4, { ry: -.35 });
      const bridge = tomeGroup(tomeBox(3, .22, 1, '#b8ae9a', 0, .55)); for (const k of [-1, 1]) bridge.add(tomeBox(.3, .55, 1, '#a79d8a', k * 1.1, .27)); put(bridge, -2.2, .8, { ry: -.25 });
      for (const [a, b, s] of [[-8.4, -3.6, 1.3], [-6, -4.6, 1.15], [-4, -5, 1.3], [-7.6, -1.2, 1], [9, -4.9, 1.2], [9, -1.6, 1], [3.8, 3.4, .9], [.4, 4, 1], [9.2, 4, .95]]) put(tomeTree(rnd, 'pine', s), a, b);
    } },
  { sky: ['#e3c99a', '#d6b985', '#ecd7ac'], road: '#f6e8c7', water: '#64b8b0',
    paint(x, P) { tomeBlob(x, P([[-9.3, -1], [-5, -2.6], [-3, .4], [-5.6, 2.2], [-9.3, 1.6]]), '#4fa49c'); tomeBlob(x, P([[-8.6, -.8], [-5.2, -1.9], [-3.8, .3], [-5.8, 1.5], [-8.6, 1]]), '#7ed1c6'); tomePath(x, P([[0, 5.2], [.8, 2.2], [1.8, -.4]]), 72, '#f6e8c7'); for (let i = 0; i < 6; i++) tomePath(x, P([[-.8 + i * .5, 4.6 - i * .15], [-.1 + i * .5, 4.6 - i * .15]]), 7, '#d8c49a'); },
    props(put, rnd) {
      const temple = new THREE.Group(); [[8, .35, 4.4, 0], [7.4, .35, 3.9, .35]].forEach(([w, h, d, y]) => temple.add(tomeBox(w, h, d, '#efe6d2', 0, y + h / 2)));
      for (let i = 0; i < 6; i++) for (const z of [1.6, -1.4]) temple.add(tomeCyl(.26, .3, 2.7, '#f2ead8', -3.1 + i * 1.24, .7 + 1.35, z, 8));
      temple.add(tomeBox(7.4, .36, 3.8, '#e6dcc4', 0, 3.58));
      const ped = tomeMesh(new THREE.CylinderGeometry(2.3, 2.3, 7.5, 3).rotateX(-Math.PI / 2).rotateY(Math.PI / 2), '#2f8a84', 0, 4.9); ped.scale.y = .5; temple.add(ped); temple.add(tomeBox(6.2, 2.6, 2.6, '#cdbf9f', 0, 2.05));
      put(temple, 3, -3);
      [[-1.4, 2.6, -.1], [2.1, 2.9, 0], [7.8, 2.2, -.2]].forEach(([a, b, ry]) => { const stand = tomeGroup(tomeBox(2.1, .35, 1, '#c6b692'), tomeBox(1.5, .3, .7, '#d9cbaa', 0, .5)); const sc = tomeScroll(); sc.position.y = .55; sc.scale.setScalar(.92); stand.add(sc); put(stand, a, b, { ry }); });
      for (const [a, b, s] of [[-8.2, 3, 1.2], [-3.4, -4.4, 1.3], [-8.8, -3.6, 1.1], [-2.2, -2, .95]]) { const palm = tomeGroup(tomeCyl(.08, .16, 2.2, '#8a6a44', 0, 1.1, 0, 5)); for (let i = 0; i < 6; i++) { const f = tomeCone(.2, 1.5, '#4c9a7a', 0, 0, 0, 4); f.scale.z = .35; const h = new THREE.Group(); f.rotation.z = -Math.PI / 2; f.position.x = .7; h.add(f); h.rotation.y = i / 6 * 6.28; h.rotation.z = -.4; h.position.y = 2.2; palm.add(h); } palm.scale.setScalar(s); palm.rotation.y = rnd() * 6; put(palm, a, b); }
      for (const [a, b, s] of [[-6, 4.2, .45], [5.4, 3.8, .35], [9.2, -.2, .5], [-.4, -4.9, .55]]) put(tomeRock(rnd, s, '#c9b48d'), a, b);
    } },
  { sky: ['#cbdbe6', '#b8ccd9', '#e2ecf2'], road: '#f6fafc', water: '#8ab4d8',
    paint(x, P, rnd) { for (let i = 0; i < 14; i++) { const a = -9 + rnd() * 18, b = -5.2 + rnd() * 9.8; tomeBlob(x, P([[a - 1, b], [a, b - .5], [a + 1.2, b], [a, b + .5]]), 'rgba(255,255,255,.62)'); } tomePath(x, P([[0, 5.2], [0, 2.8]]), 90, '#e3cf8f'); tomePath(x, P([[0, 5.2], [0, 2.8]]), 66, '#a33d38'); },
    props(put, rnd) {
      for (const [a, b, r, h] of [[-7.2, -3.6, 3, 7], [-3, -4.6, 2.6, 5.4], [7, -3.8, 3.1, 7.6], [3.2, -4.8, 2.4, 5], [-9, .2, 1.7, 3.4], [9, 0, 1.8, 3.8]]) put(tomeMountain(rnd, r, h, '#7c8796', '#f8fbff'), a, b);
      const podium = tomeGroup(tomeBox(2.2, 1.9, 2.2, '#eee5ca'), tomeBox(2.1, 1.2, 2.2, '#dcd3b8', -2.15, .6), tomeBox(2.1, .75, 2.2, '#dcd3b8', 2.15, .375));
      const number = (s, x, y) => { const c = document.createElement('canvas'); c.width = c.height = 128; const t = c.getContext('2d'); t.fillStyle = '#7c5a24'; t.font = `700 92px ${TOME_SERIF}`; t.textAlign = 'center'; t.textBaseline = 'middle'; t.fillText(s, 64, 70); const m = new THREE.Mesh(new THREE.PlaneGeometry(.95, .95), new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(c), transparent: true, roughness: .8 })); m.material.map.encoding = THREE.sRGBEncoding; m.position.set(x, y, 1.12); return m; };
      podium.add(number('I', 0, .95), number('II', -2.15, .6), number('III', 2.15, .375));
      const big = tomeTrophy(1.2); big.position.y = 1.9; podium.add(big);
      const a = tomeTrophy(.72); a.position.set(-2.15, 1.2, 0); podium.add(a); const b = tomeTrophy(.6); b.position.set(2.15, .75, 0); podium.add(b);
      put(podium, 0, .4);
      for (const [x, z, y] of [[-3.8, .4, 5.4], [3.8, 1.2, 5], [-1.9, -2, 7.2], [2.2, -2.2, 7.4]]) { const s = tomeStar(); s.userData.spin = [0, 1.1, 0]; put(tomeGroup(s), x, z, { y, fly: true, bob: .22 }); }
      for (const [x, z, c] of [[-6, 3, '#a33d38'], [6, 3, '#3f6e8c'], [-5, -.9, '#d2a44a'], [5.2, -.8, '#a33d38']]) put(tomeFlag(c, 1.6), x, z);
      for (const [x, z, s] of [[-8.3, 3.6, 1], [8.4, 3.8, 1.1], [-3.6, 4, .8], [3.8, 4.1, .85]]) put(tomeTree(rnd, 'pine', s, '#5d8d7c'), x, z);
    } },
  { sky: ['#3d3468', '#332b5c', '#4a3f7c'], road: '#7ee8d8', water: '#7ee8d8',
    paint(x, P, rnd) { x.save(); x.shadowColor = '#7ee8d8'; x.shadowBlur = 22; for (let r = 0; r < 3; r++) { x.strokeStyle = 'rgba(126,232,216,.75)'; x.lineWidth = 5; const c = P([[0, -.2]])[0], rad = 170 + r * 150; x.beginPath(); x.arc(c[0], c[1], rad, 0, 7); x.stroke(); } x.restore(); for (let i = 0; i < 90; i++) { x.fillStyle = `rgba(240,235,255,${.2 + rnd() * .6})`; const p = P([[-9.3 + rnd() * 18.6, -5.8 + rnd() * 10.6]])[0]; x.fillRect(p[0], p[1], 3, 3); } },
    props(put, rnd) {
      const tree = tomeGroup(tomeCyl(.35, .72, 3, '#5a3f73', 0, 1.5)), limbs = [[-1.9, 4.4, -.7, .05, 1], [1.9, 4.6, .7, .05, 1], [-1, 5.8, -.35, 0, .85], [1.05, 6, .35, 0, .85], [0, 6.9, 0, 0, .9]];
      limbs.forEach(([x, y, tilt]) => { const l = Math.hypot(x, y - 2.7), b = tomeCyl(.09, .26, l, '#5a3f73', x / 2, 2.7 + (y - 2.7) / 2); b.rotation.z = -Math.atan2(x, y - 2.7); tree.add(b); });
      const orbs = ['#6fe3d6', '#ff9fd2', '#ffd76a', '#6fe3d6', '#ff9fd2'];
      limbs.forEach(([x, y, , , s], i) => { const c = tomeCrystal(orbs[i], 1.45 * s); c.position.set(x, y + .45, 0); c.userData.spin = [0, .7 + i * .1, 0]; tree.add(c); });
      put(tree, 0, 1, { s: .82 });
      for (const [x, z, h, c] of [[-4.5, 2.6, 1.9, '#6fe3d6'], [4.5, 2.6, 2.2, '#ff9fd2'], [-6.2, -1.2, 2.4, '#ffd76a'], [6.2, -1.2, 2.6, '#6fe3d6'], [-3.6, -3.8, 2.3, '#ff9fd2'], [3.6, -3.8, 2.1, '#ffd76a']]) { const stone = tomeBox(.85, h, .5, '#6a6490'); stone.rotation.y = rnd() - .5; const rune = tomeBox(.28, h * .55, .03, tomeGlow(c, 1.6), 0, h * .55, .27); stone.add(rune); rune.position.y -= h / 2; put(tomeGroup(stone), x, z); }
      put(tomeTower(.95, 6, '#544d80', '#7a3f9c', '#ff9fd2'), -8, -3.8);
      for (const [x, z, s, c] of [[-8.6, 2.8, 1, '#ff9fd2'], [8.4, 3.2, 1.2, '#6fe3d6'], [8.6, -3.8, 1.3, '#ffd76a'], [-1.6, 3.9, .8, '#6fe3d6'], [1.7, 4, .75, '#ffd76a']]) { const shroom = tomeGroup(tomeCyl(.14 * s, .2 * s, .75 * s, '#e8def5'), tomeBall(.46 * s, tomeGlow(c, .8), 0, .9 * s, 0, 1, .62, 1)); put(shroom, x, z); }
      for (const [x, z, y, c, s] of [[-2.8, -1.8, 5.6, '#ffd76a', .9], [3.1, -1.5, 6.1, '#6fe3d6', 1], [-6, 1, 4.6, '#ff9fd2', .8], [6.1, 1.1, 4.8, '#ffd76a', .85]]) { const k = tomeCrystal(c, s); k.userData.spin = [0, .9, 0]; put(tomeGroup(k), x, z, { y, fly: true, bob: .28 }); }
    } },
];
function tomePageTexture(i) {
  const c = document.createElement('canvas'); c.width = 1536; c.height = 1000;
  const x = c.getContext('2d'), rnd = seeded(70 + i), land = TOME_LANDS[i], sx = 1536 / (TOME_PW * 2), sz = 1000 / TOME_PD, P = pts => pts.map(([a, b]) => [(a + TOME_PW) * sx, (b + TOME_PD / 2) * sz]);
  x.fillStyle = '#f1e6c9'; x.fillRect(0, 0, 1536, 1000);
  for (let n = 0; n < 900; n++) { x.fillStyle = `rgba(120,90,50,${rnd() * .05})`; x.fillRect(rnd() * 1536, rnd() * 1000, 1 + rnd() * 5, 1 + rnd() * 3); }
  const shape = P([[-9.5, -6], [0, -6.1], [9.5, -6], [9.7, 0], [9.5, 5], [0, 5.1], [-9.5, 5], [-9.7, 0]]);
  x.save(); x.shadowColor = 'rgba(80,55,25,.5)'; x.shadowBlur = 16; tomeBlob(x, shape, land.sky[0]); x.restore();
  x.save(); tomeBlob(x, shape, land.sky[0]); x.clip();
  for (let n = 0; n < 34; n++) { const a = -10 + rnd() * 20, b = -6.5 + rnd() * 12, w = 1 + rnd() * 3, h = .5 + rnd() * 1.2; tomeBlob(x, P([[a - w, b], [a, b - h], [a + w, b + rnd() * .3], [a, b + h]]), land.sky[1 + (n % 2)]); }
  land.paint(x, P, rnd);
  x.restore();
  x.fillStyle = '#5a4026'; x.font = `700 30px ${TOME_SERIF}`; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillText(`Chapter ${TOME_NUM[i]}`, 62, 950); x.textAlign = 'right'; x.fillText(TOME_WORDS.chapters[i].name, 1474, 950);
  x.strokeStyle = 'rgba(90,64,38,.5)'; x.lineWidth = 2; x.beginPath(); x.moveTo(250, 950); x.lineTo(640, 950); x.moveTo(896, 950); x.lineTo(1286, 950); x.stroke();
  const gut = x.createLinearGradient(768 - 120, 0, 768 + 120, 0); gut.addColorStop(0, 'rgba(50,30,15,0)'); gut.addColorStop(.5, 'rgba(50,30,15,.5)'); gut.addColorStop(1, 'rgba(50,30,15,0)'); x.fillStyle = gut; x.fillRect(648, 0, 240, 1000);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); return t;
}

/* ---------- The table ---------- */
function tomeWoodTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 1024; const x = c.getContext('2d'), rnd = seeded(5), planks = 5, ph = 1024 / planks;
  for (let p = 0; p < planks; p++) {
    x.fillStyle = ['#6a4128', '#5f3923', '#74482c', '#633c25', '#6e442a'][p]; x.fillRect(0, p * ph, 1024, ph);
    for (let n = 0; n < 150; n++) { const y = p * ph + rnd() * ph; x.strokeStyle = rnd() < .75 ? `rgba(35,18,8,${.08 + rnd() * .22})` : `rgba(190,130,80,${.03 + rnd() * .1})`; x.lineWidth = .6 + rnd() * 2; x.beginPath(); x.moveTo(0, y); const w = (rnd() - .5) * 8; x.bezierCurveTo(340, y + w, 680, y - w, 1024, y); x.stroke(); }
    for (let n = 0; n < 2; n++) { const kx = rnd() * 1024, ky = p * ph + ph * (.25 + rnd() * .5); x.strokeStyle = 'rgba(28,14,6,.4)'; for (let r = 2; r < 17; r += 3) { x.lineWidth = 1.1; x.beginPath(); x.ellipse(kx, ky, r * 2.1, r * .75, 0, 0, 7); x.stroke(); } }
    x.fillStyle = 'rgba(12,6,2,.9)'; x.fillRect(0, p * ph, 1024, 3); x.fillStyle = 'rgba(210,160,110,.1)'; x.fillRect(0, p * ph + 3, 1024, 2);
  }
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 5); t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); return t;
}
function tomeSpot(color) { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), l = x.createRadialGradient(64, 64, 0, 64, 64, 64); l.addColorStop(0, color); l.addColorStop(.35, color.replace(/[\d.]+\)$/, '.32)')); l.addColorStop(1, color.replace(/[\d.]+\)$/, '0)')); x.fillStyle = l; x.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t; }
function tomeSetTable(scene, flames, moving) {
  const add = (o, x, z, ry = 0) => { o.position.x = x; o.position.z = z; o.rotation.y = ry; scene.add(o); return o; };
  const glow = tomeSpot('rgba(255,178,92,.95)');
  const candle = (r, h, x, z) => {
    const o = tomeGroup(tomeCyl(r * 1.9, r * 2.1, .16, tomeMat('#a07a3c', { metalness: .8, roughness: .4 })), tomeCyl(r, r * 1.04, h, tomeMat('#eadfc4', { flatShading: false }), 0, h / 2 + .1, 0, 12), tomeCyl(.03, .03, .22, '#2b2018', 0, h + .2, 0, 4));
    const flame = tomeMesh(new THREE.SphereGeometry(.17, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffd486 }), 0, h + .52); flame.scale.set(1, 1.9, 1); flame.castShadow = false; o.add(flame);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false })); halo.scale.setScalar(4.6); halo.position.y = h + .55; o.add(halo);
    flames.push({ flame, halo, phase: x * 3 + z }); return add(o, x, z);
  };
  candle(.42, 4.4, -16, -7); candle(.36, 3, -14.4, -8.6); candle(.3, 2, -17.4, -5);
  candle(.4, 3.6, 16.4, -6.4); candle(.3, 2.2, 15, -8);
  candle(.34, 2.6, -5, -10.8); candle(.32, 1.8, 7, -11.4);
  candle(.34, 2.3, 14.6, 7.6);
  const potion = (color, x, z, s) => {
    const shape = [[0, 0], [.62, 0], [.82, .35], [.82, 1.05], [.42, 1.6], [.22, 1.8], [.22, 2.35], [.3, 2.42], [0, 2.42]].map(([a, b]) => new THREE.Vector2(a, b));
    const liquid = tomeMesh(new THREE.LatheGeometry([[0, .04], [.58, .04], [.75, .36], [.75, 1], [0, 1]].map(([a, b]) => new THREE.Vector2(a, b)), 12), new THREE.MeshStandardMaterial({ color: tomeLinear(color), emissive: tomeLinear(color), emissiveIntensity: .42, roughness: .3 }));
    const glass = tomeMesh(new THREE.LatheGeometry(shape, 12), new THREE.MeshStandardMaterial({ color: tomeLinear('#cfe6e2'), transparent: true, opacity: .3, roughness: .1, metalness: .1, envMapIntensity: .5, side: THREE.DoubleSide })); glass.castShadow = false;
    const o = tomeGroup(liquid, glass, tomeCyl(.17, .2, .32, '#9a7648', 0, 2.5, 0, 8)); o.scale.setScalar(s); return add(o, x, z);
  };
  potion('#49d0b8', -14.8, 1.4, 1.25); potion('#d04f8a', -13.4, 3.8, .95); potion('#7a5be0', 14.2, .6, 1.15); potion('#e0a13a', -2.2, -10.4, .85);
  const orb = tomeGroup(tomeCyl(.95, 1.15, .4, tomeMat('#6d4f2a', { metalness: .6, roughness: .5 })), tomeCyl(.34, .55, .5, tomeMat('#a07a3c', { metalness: .85, roughness: .35 }), 0, .6));
  const ball = tomeMesh(new THREE.SphereGeometry(1.15, 24, 18), new THREE.MeshStandardMaterial({ color: tomeLinear('#6a55e8'), emissive: tomeLinear('#4a38c8'), emissiveIntensity: 1, roughness: .08, metalness: .1, envMapIntensity: .6 }), 0, 1.9); orb.add(ball); add(orb, 15.4, -3.2);
  const coins = (x, z, n) => { const o = new THREE.Group(); const rnd = seeded(Math.round(x * 7 + z)); for (let i = 0; i < n; i++) o.add(tomeCyl(.62, .62, .13, tomeMat('#e0ae3c', { metalness: .9, roughness: .35, flatShading: false, envMapIntensity: .8 }), (rnd() - .5) * .16, .07 + i * .135, (rnd() - .5) * .16, 16)); return add(o, x, z); };
  coins(-13.4, 6.6, 7); coins(-12.2, 7.5, 4); coins(-14.5, 7.6, 2); coins(-11.8, 6, 1);
  const die = tomeMesh(new THREE.IcosahedronGeometry(.8, 0), tomeMat('#8f2b3f', { roughness: .25, metalness: .25 }), 0, .72); add(tomeGroup(die), 13, 5.4, .6);
  const ink = tomeGroup(tomeCyl(.72, .86, .9, tomeMat('#1f2436', { roughness: .15, metalness: .25 })), tomeCyl(.34, .4, .3, tomeMat('#a07a3c', { metalness: .85, roughness: .35 }), 0, 1.05));
  const feather = tomeMesh(new THREE.ConeGeometry(.42, 4.6, 5), tomeMat('#efe8da')); feather.scale.z = .16; feather.position.set(.8, 3, -.2); feather.rotation.z = -.45; ink.add(feather); add(ink, -10.4, -10.6);
  const scroll = (x, z, ry) => { const o = new THREE.Group(); const body = tomeCyl(.44, .44, 5, tomeMat('#e4d4ab', { flatShading: false }), 0, .44, 0, 12); body.rotation.z = Math.PI / 2; o.add(body); const tie = tomeCyl(.47, .47, .3, tomeMat('#9e2f34'), 0, .44, 0, 12); tie.rotation.z = Math.PI / 2; o.add(tie); return add(o, x, z, ry); };
  scroll(15.8, 3.8, 1.2); scroll(-17, -2.6, 1.9); scroll(3, -11.2, .12);
  // Faint runes carved around the book.
  const c = document.createElement('canvas'); c.width = c.height = 1024; const x = c.getContext('2d'); x.translate(512, 512); x.strokeStyle = 'rgba(255,206,128,.9)'; x.shadowColor = '#ffb95e'; x.shadowBlur = 16; x.lineWidth = 3;
  for (const r of [486, 440]) { x.beginPath(); x.arc(0, 0, r, 0, 7); x.stroke(); }
  const rnd = seeded(12); for (let i = 0; i < 44; i++) { x.save(); x.rotate(i / 44 * 6.2832); x.translate(0, -463); x.beginPath(); x.moveTo(-6, -11); x.lineTo(rnd() * 8 - 4, 0); x.lineTo(6, 11); if (i % 2) { x.moveTo(-6, 6); x.lineTo(6, -2); } else { x.moveTo(6, -11); x.lineTo(-3, 2); } x.stroke(); x.restore(); }
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  const ring = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: .3, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); ring.rotation.x = -Math.PI / 2; ring.position.y = .02; scene.add(ring); moving.ring = ring;
  // Motes in the candlelight.
  const dots = new Float32Array(90 * 3), r2 = seeded(9); for (let i = 0; i < 90; i++) dots.set([(r2() - .5) * 42, 1 + r2() * 14, (r2() - .5) * 28], i * 3);
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(dots, 3));
  moving.motes = new THREE.Points(pg, new THREE.PointsMaterial({ map: tomeSpot('rgba(255,226,170,1)'), size: .42, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); scene.add(moving.motes);
}

/* ---------- The book ---------- */
function tomePageGeo(x0, x1, uvOf) { // a sheet following the page's curve, x from x0 to x1
  const n = 20, rows = 2, pos = [], uv = [], idx = [];
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; pos.push(x, tomeY(Math.abs(x)), -TOME_PD / 2 + TOME_PD * j / rows); uv.push(uvOf(x), 1 - j / rows); }
  for (let j = 0; j < rows; j++) for (let i = 0; i < n; i++) { const a = j * (n + 1) + i, b = a + n + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g3 = new THREE.BufferGeometry(); g3.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g3.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g3.setIndex(idx); g3.computeVertexNormals(); return g3;
}
const TOME_SEG = 22, TOME_ROWS = 8;
function tomeBendPage(w, t) { // t 0 lies on the right, t 1 on the left. The near corner leads and the far edge of the sheet lags, like a real page
  const p = w.turnGeo.attributes.position, ds = TOME_PW / TOME_SEG;
  for (let j = 0; j <= TOME_ROWS; j++) {
    const z01 = j / TOME_ROWS, e = Math.max(0, Math.min(1, t * 1.14 - .14 * (1 - z01))), th = Math.PI * e, bend = Math.sin(Math.PI * e) * 1.3, flat = Math.cos(th) ** 2, z = -TOME_PD / 2 + TOME_PD * z01;
    let x = 0, y = TOME_TOP - TOME_GUT;
    for (let i = 0; i <= TOME_SEG; i++) {
      if (i) { const a = Math.max(0, th - bend * (i - .5) / TOME_SEG); x += Math.cos(a) * ds; y += Math.sin(a) * ds; }
      const s = i * ds; p.setXYZ(j * (TOME_SEG + 1) + i, x, y + (tomeY(s) - (TOME_TOP - TOME_GUT)) * flat + .04, z);
    }
  }
  p.needsUpdate = true; w.turnGeo.computeVertexNormals();
}
function tomeBuildBook(scene) {
  const edges = (vertical) => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.fillStyle = '#eee3c8'; x.fillRect(0, 0, 64, 64); x.fillStyle = 'rgba(120,95,60,.45)'; for (let i = 0; i < 64; i += 5) vertical ? x.fillRect(i, 0, 1.5, 64) : x.fillRect(0, i, 64, 1.5); const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); return t; };
  const capMat = new THREE.MeshStandardMaterial({ map: edges(false), roughness: .95, envMapIntensity: .08 }), wallMat = new THREE.MeshStandardMaterial({ map: edges(true), roughness: .95, envMapIntensity: .08 });
  const block = sign => { // the stack of pages, cut to the curve of the top page
    const s = new THREE.Shape(); s.moveTo(0, .35); s.lineTo(sign * TOME_PW, .35); for (let i = 16; i >= 0; i--) { const d = TOME_PW * i / 16; s.lineTo(sign * d, tomeY(d)); }
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: TOME_PD, bevelEnabled: false }).translate(0, 0, -TOME_PD / 2), [capMat, wallMat]); m.castShadow = m.receiveShadow = true; return m;
  };
  const leather = tomeMat('#3a1c16', { roughness: .62, flatShading: false }), brass = tomeMat('#c9a24a', { metalness: .85, roughness: .35 });
  // The front cover's outside is only seen while the book is shut.
  const c = document.createElement('canvas'); c.width = 768; c.height = 1000; const x = c.getContext('2d');
  x.fillStyle = '#3a1c16'; x.fillRect(0, 0, 768, 1000); x.strokeStyle = TOME_GOLD; x.lineWidth = 8; x.strokeRect(46, 46, 676, 908); x.lineWidth = 3; x.strokeRect(66, 66, 636, 868);
  x.fillStyle = TOME_GOLD; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `700 84px ${TOME_SERIF}`; x.fillText(TOME_WORDS.cover, 384, 300);
  x.save(); x.translate(384, 600); x.lineWidth = 6; x.beginPath(); x.arc(0, 0, 118, 0, 7); x.stroke(); for (let i = 0; i < 8; i++) { x.rotate(Math.PI / 4); x.beginPath(); x.moveTo(0, -96); x.lineTo(20, -18); x.lineTo(-20, -18); x.closePath(); x.fill(); } x.restore();
  const coverTex = new THREE.CanvasTexture(c); coverTex.encoding = THREE.sRGBEncoding; coverTex.center.set(.5, .5); coverTex.rotation = Math.PI;
  const coverOut = new THREE.MeshStandardMaterial({ map: coverTex, roughness: .55, envMapIntensity: .5 });
  const CW = TOME_PW + .55, CD = TOME_PD + .9;
  const cover = sign => { const m = new THREE.Mesh(new THREE.BoxGeometry(CW, .35, CD), sign < 0 ? [leather, leather, leather, coverOut, leather, leather] : leather); m.position.set(sign * CW / 2, .175, 0); m.castShadow = m.receiveShadow = true; return m; };
  const corners = sign => { const o = new THREE.Group(); for (const k of [-1, 1]) { const b = tomeBox(.9, .39, .9, brass, sign * (CW - .42), .195, k * (CD / 2 - .42)); o.add(b); } return o; };
  const right = new THREE.Group(); right.add(cover(1), corners(1), block(1)); scene.add(right);
  const leftPage = new THREE.Mesh(tomePageGeo(-TOME_PW, 0, x => .5 + x / (TOME_PW * 2)), new THREE.MeshStandardMaterial({ roughness: .92, envMapIntensity: .08 })), rightPage = new THREE.Mesh(tomePageGeo(0, TOME_PW, x => .5 + x / (TOME_PW * 2)), new THREE.MeshStandardMaterial({ roughness: .92, envMapIntensity: .08 }));
  leftPage.receiveShadow = rightPage.receiveShadow = true; leftPage.position.y = rightPage.position.y = .015; rightPage.castShadow = leftPage.castShadow = false;
  right.add(rightPage);
  // The left half hinges at the spine, which is how the book opens.
  const wing = new THREE.Group(); wing.position.y = TOME_TOP; const inner = new THREE.Group(); inner.position.y = -TOME_TOP; inner.add(cover(-1), corners(-1), block(-1), leftPage); wing.add(inner); scene.add(wing);
  const spine = tomeMesh(new THREE.CylinderGeometry(.62, .62, CD, 16, 1, false, Math.PI / 2, Math.PI).rotateX(Math.PI / 2).rotateZ(Math.PI / 2), leather, 0, .32); spine.scale.y = .58; scene.add(spine);
  // The sheet that turns: shared shape, a texture on each side.
  const pos = new Float32Array((TOME_SEG + 1) * (TOME_ROWS + 1) * 3), uvF = [], uvB = [], idx = [];
  for (let j = 0; j <= TOME_ROWS; j++) for (let i = 0; i <= TOME_SEG; i++) { uvF.push(.5 + .5 * i / TOME_SEG, 1 - j / TOME_ROWS); uvB.push(.5 - .5 * i / TOME_SEG, 1 - j / TOME_ROWS); }
  for (let j = 0; j < TOME_ROWS; j++) for (let i = 0; i < TOME_SEG; i++) { const a = j * (TOME_SEG + 1) + i, b = a + TOME_SEG + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const turnGeo = new THREE.BufferGeometry(), backGeo = new THREE.BufferGeometry(); turnGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); turnGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvF, 2)); turnGeo.setIndex(idx);
  backGeo.setAttribute('position', turnGeo.attributes.position); backGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvB, 2)); backGeo.setIndex(idx); turnGeo.computeVertexNormals(); backGeo.setAttribute('normal', turnGeo.attributes.normal);
  const turnFront = new THREE.Mesh(turnGeo, new THREE.MeshStandardMaterial({ roughness: .92, envMapIntensity: .08, side: THREE.FrontSide })), turnBack = new THREE.Mesh(backGeo, new THREE.MeshStandardMaterial({ roughness: .92, envMapIntensity: .08, side: THREE.BackSide }));
  turnFront.castShadow = true; turnFront.frustumCulled = turnBack.frustumCulled = false; turnFront.visible = turnBack.visible = false; scene.add(turnFront, turnBack);
  // A ribbon marking the place.
  const ribbon = tomeMesh(new THREE.PlaneGeometry(.42, 1.2, 1, 6), tomeMat('#a32e36', { side: THREE.DoubleSide, flatShading: false }), 0, 0, 0); ribbon.geometry.rotateX(-Math.PI / 2); const rp = ribbon.geometry.attributes.position; for (let i = 0; i < rp.count; i++) { const k = (rp.getZ(i) + .6) / 1.2; rp.setY(i, Math.max(.03 - .32, TOME_TOP - .32 - k * k * 3)); } ribbon.geometry.computeVertexNormals(); ribbon.position.set(.1, .32, TOME_PD / 2 + .6); scene.add(ribbon);
  return { wing, leftPage, rightPage, turnGeo, turnFront, turnBack };
}
function tomeBuildChapter(i, scene) {
  const rnd = seeded(300 + i), root = new THREE.Group(), items = [], moving = [];
  root.visible = false; scene.add(root);
  TOME_LANDS[i].props((o, x, z, opts = {}) => {
    const holder = new THREE.Group(), y = opts.y || 0; holder.position.set(x, tomeY(Math.abs(x)) + y, z); if (opts.ry) o.rotation.y = opts.ry; if (opts.s) o.scale.setScalar(opts.s); holder.add(o); root.add(holder);
    o.traverse(n => { const u = n.userData; if (u.spin || u.wave || u.flick) moving.push(n); });
    items.push({ holder, fly: !!opts.fly, bob: opts.bob || 0, y: holder.position.y, phase: x + z, delay: Math.abs(x) * 24 + (rnd() * 90) });
  }, rnd);
  return { root, items, moving, popAt: 0, foldAt: 0 };
}
function* buildTome() {
  let fonts = false;
  Promise.race([Promise.all([`700 40px Cinzel`, '600 40px Cinzel', '600 20px Poppins'].map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 2500))]).catch(() => {}).finally(() => { fonts = true; });
  while (!fonts) yield;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, 1, 900), flames = [], moving = {};
  scene.background = new THREE.Color(0x120904); scene.fog = new THREE.Fog(0x120904, 60, 160); scene.environment = scene3d && scene3d.environment;
  const wood = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshStandardMaterial({ map: tomeWoodTexture(), roughness: .62, envMapIntensity: .08 })); wood.material.map.repeat.set(30, 30); wood.rotation.x = -Math.PI / 2; wood.receiveShadow = true; scene.add(wood);
  scene.add(new THREE.HemisphereLight(0xffe6c8, 0x2c170a, .55));
  const sun = new THREE.DirectionalLight(0xffe3bf, 2.6); sun.position.set(-13, 34, 15); sun.castShadow = true; sun.shadow.mapSize.set(COARSE ? 1024 : 2048, COARSE ? 1024 : 2048); Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 24, bottom: -24, near: 4, far: 80 }); sun.shadow.bias = -.0006; sun.shadow.normalBias = .04; scene.add(sun);
  const rim = new THREE.DirectionalLight(0x8aa2ff, .3); rim.position.set(20, 12, -22); scene.add(rim);
  const warmL = new THREE.PointLight(0xff9c50, 170, 0, 2); warmL.position.set(-15.4, 7.5, -7); const warmR = new THREE.PointLight(0xff9c50, 140, 0, 2); warmR.position.set(15.6, 6.5, -6); const warmF = new THREE.PointLight(0xff9c50, 60, 0, 2); warmF.position.set(15.4, 5, 8.2); scene.add(warmL, warmR, warmF);
  tomeBuilt = .1; yield;
  tomeSetTable(scene, flames, moving); tomeBuilt = .22; yield;
  const parts = tomeBuildBook(scene); tomeBuilt = .3; yield;
  const textures = [], chapters = [];
  for (let i = 0; i < TOME_LANDS.length; i++) { textures.push(tomePageTexture(i)); tomeBuilt += .05; yield; chapters.push(tomeBuildChapter(i, scene)); tomeBuilt += .05; yield; }
  // Hand every texture to the GPU now, so the first turn doesn't stall.
  for (const t of textures) { renderer.initTexture(t); yield; }
  parts.leftPage.material.map = parts.rightPage.material.map = textures[0];
  parts.turnFront.material.map = parts.turnBack.material.map = textures[0];
  tomeWorld = { scene, cam, flames, moving, warmL, warmR, warmF, textures, chapters, ...parts };
  tomeBuilt = 1; yield;
}

/* ---------- Opening, closing, turning ---------- */
function tomeSnapshot() { const s = document.createElement('canvas'); s.width = sceneCanvas.width; s.height = sceneCanvas.height; s.getContext('2d').drawImage(sceneCanvas, 0, 0); return s; }
function openTome(c, viaKeyboard) {
  if (!renderer || !renderer.capabilities.isWebGL2) { openProject(c, viaKeyboard, true); return; } // can't draw the book here, so show the plain page
  if (!tomeWorld && !tomeBuilder) tomeBuilder = buildTome();
  tomeCertsLoad();
  const now = performance.now();
  tome = { c, viaKeyboard, phase: tomeWorld ? 'open' : 'build', at: 0, shown: 0, turn: null, queue: null, openAt: now, from: tomeSnapshot(), fadeAt: now, hot: [], rect: null, hover: null, wheel: 0, wheelAt: 0, dragX: 0, moved: false, cardK: 0, cardOutAt: 0, layout: null, shadow: true };
  if (tomeWorld) tomeReset();
  if (COARSE) renderer.setPixelRatio(Math.min(maxPr, 1.5));
  hover = null; focusCard = null; glitch = 0; dirty = true;
  $('#btn-about').hidden = $('#btn-talk').hidden = true;
  live.textContent = `A book on a table with ${TOME_WORDS.chapters.length} chapters. Scroll, swipe or use the arrow keys to turn the page.`;
  keyboardFocus(backBtn);
}
function tomeReset() {
  const w = tomeWorld;
  w.chapters.forEach(c => { c.root.visible = false; c.popAt = c.foldAt = 0; });
  w.leftPage.material.map = w.rightPage.material.map = w.textures[0];
  w.turnFront.visible = w.turnBack.visible = false;
  tome.openAt = performance.now();
}
function closeTome() {
  tome = null; renderer.setPixelRatio(maxPr); renderer.setRenderTarget(null); if (tomeWorld) tomeWorld.cam.clearViewOffset(); glitch = reduced ? 0 : .5; dirty = true;
  $('#btn-about').hidden = $('#btn-talk').hidden = false;
  live.textContent = ''; crt.style.cursor = 'grab';
}
function tomeSay(i) { const c = TOME_PAGES[i]; live.textContent = [`Chapter ${c.ci + 1}, ${c.name}${c.label ? `, ${c.label}` : ''}.`, c.lead, ...(c.pills || []), ...(c.badges || []).map(b => b[0]), ...(c.entries || []).map(e => [e.h, e.m, e.d, ...(e.pills || [])].filter(Boolean).join(', '))].filter(Boolean).join(' '); }
function tomeGo(i) {
  if (!tome || tome.phase !== 'read') { if (tome && tome.phase === 'open') tome.openAt = -1e9; return; }
  if (i < 0 || i >= TOME_PAGES.length) return;
  if (tome.turn) { tome.queue = i; return; }
  if (i === tome.at) return;
  const w = tomeWorld, now = performance.now(), dir = i > tome.at ? 1 : -1, from = tome.at, oldLand = w.textures[TOME_PAGES[from].ci], newLand = w.textures[TOME_PAGES[i].ci];
  tome.moved = true; tome.turn = { from, to: i, dir, at: now, popped: false, landed: false }; tome.at = i; tome.cardOutAt = now;
  w.chapters[TOME_PAGES[from].ci].foldAt = now; tomeSay(i);
  if (dir > 0) { w.rightPage.material.map = newLand; w.turnFront.material.map = oldLand; w.turnBack.material.map = newLand; tomeBendPage(w, 0); }
  else { w.leftPage.material.map = newLand; w.turnFront.material.map = newLand; w.turnBack.material.map = oldLand; tomeBendPage(w, 1); }
  w.turnFront.visible = w.turnBack.visible = true;
  if (reduced) { tomeFinishTurn(now); return; }
}
function tomeFinishTurn(now) {
  const w = tomeWorld, t = tome.turn, was = w.chapters[TOME_PAGES[t.from].ci], next = w.chapters[TOME_PAGES[t.to].ci];
  w.leftPage.material.map = w.rightPage.material.map = w.textures[TOME_PAGES[t.to].ci];
  w.turnFront.visible = w.turnBack.visible = false;
  if (was !== next) { was.root.visible = false; was.foldAt = 0; }
  if (!t.popped) { const c = next; c.popAt = now; c.foldAt = 0; c.root.visible = true; tome.shown = t.to; tome.cardOutAt = 0; tome.cardInAt = now; }
  tome.turn = null; tome.shadow = true;
  if (tome.queue !== null) { const q = tome.queue; tome.queue = null; tomeGo(q); }
}
function tomeWheel(delta) { // a trackpad keeps coasting after the fingers lift, and that shouldn't turn a second page
  const now = performance.now(); if (now - tome.wheelAt > 300 || tome.turn) tome.wheel = 0; tome.wheelAt = now;
  if (tome.turn) return;
  tome.wheel += delta; if (Math.abs(tome.wheel) > 70) { tomeGo(tome.at + Math.sign(tome.wheel)); tome.wheel = 0; }
}
const tomeDrag = dx => { tome.dragX += dx; };
function tomeRelease(clicked, clientX, clientY) {
  const dx = tome.dragX; tome.dragX = 0;
  if (clicked) tomeClick(clientX, clientY); else if (Math.abs(dx) > 34) tomeGo(tome.at + (dx < 0 ? 1 : -1));
}
function tomeSpotAt(clientX, clientY) {
  const [x, y] = toScene(clientX, clientY);
  for (const h of tome.hot) if (x > h.x && x < h.x + h.w && y > h.y && y < h.y + h.h && h.go >= 0 && h.go < TOME_PAGES.length && h.go !== tome.at) return h;
  const r = tome.rect; if (r && x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h && !(tome.cardBox && x > tome.cardBox.x && x < tome.cardBox.x + tome.cardBox.w && y > tome.cardBox.y && y < tome.cardBox.y + tome.cardBox.h)) { const go = tome.at + (x > r.spine ? 1 : -1); if (go >= 0 && go < TOME_PAGES.length) return { go }; }
  return null;
}
function tomeCardSpot(clientX, clientY) { // a button, picture or skill on the card under the pointer
  const b = tome.cardBox, l = tome.layout; if (!b || !l || tome.phase !== 'read' || tome.turn) return null;
  const [sx, sy] = toScene(clientX, clientY), cx = sx - b.x, cy = sy - b.y;
  return (l.hot[tome.shown] || []).find(h => cx > h.x && cx < h.x + h.w && cy > h.y && cy < h.y + h.h) || null;
}
const tomeClick = (x, y) => { if (tome.phase === 'open') { tome.openAt = -1e9; return; } const c = tomeCardSpot(x, y); if (c) { c.act(x, y); return; } const h = tomeSpotAt(x, y); if (h) tomeGo(h.go); };
function tomeHover(x, y) { const c = tomeCardSpot(x, y), h = c ? null : tomeSpotAt(x, y); tome.hover = h; crt.style.cursor = c || h ? 'pointer' : 'grab'; }
function tomeKey(e) {
  const go = { ArrowRight: tome.at + 1, ArrowDown: tome.at + 1, PageDown: tome.at + 1, ArrowLeft: tome.at - 1, ArrowUp: tome.at - 1, PageUp: tome.at - 1, Home: 0, End: TOME_PAGES.length - 1 }[e.key];
  if (go !== undefined) { e.preventDefault(); tomeGo(go); }
}

/* ---------- The parchment card ---------- */
function tomeWrap(x, text, maxW) { const lines = []; let line = ''; for (const w of text.split(' ')) { const n = line ? `${line} ${w}` : w; if (x.measureText(n).width > maxW && line) { lines.push(line); line = w; } else line = n; } lines.push(line); return lines; }
function tomePills(x, pills, cx, y, maxW, size, align, { hot, link } = {}) { // returns the bottom edge. link(p) gives a pill's click, which draws it as a button
  x.font = `600 ${size}px ${TOME_SANS}`; const gap = size * .5, h = size * 1.9, rows = [[]]; let used = 0;
  const label = p => link && link(p) ? `${p}  ↗` : p;
  for (const p of pills) { const w = x.measureText(label(p)).width + size * 1.5; if (used + w > maxW && rows[rows.length - 1].length) { rows.push([]); used = 0; } rows[rows.length - 1].push([p, w]); used += w + gap; }
  rows.forEach((row, r) => { const total = row.reduce((s, [, w]) => s + w + gap, -gap); let px = align === 'center' ? cx - total / 2 : cx; for (const [p, w] of row) {
    const act = link && link(p), on = act && tome && tome.skill === p, py = y + r * (h + gap);
    x.fillStyle = on ? TOME_GOLD : '#4a2f1b'; x.beginPath(); x.roundRect(px, py, w, h, h / 2); x.fill();
    if (act && !on) { x.strokeStyle = TOME_GOLD; x.lineWidth = 2; x.stroke(); }
    x.fillStyle = on ? '#2a1a0e' : '#f3e4bf'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(label(p), px + w / 2, py + h / 2 + 1);
    if (act && hot) hot.push({ x: px, y: py, w, h, act, label: p }); px += w + gap; } });
  return y + rows.length * (h + gap) - gap;
}
function tomeThumb(x, name, bx, by, bw, bh) { // a certificate's picture, framed in gold, cropped to fill
  x.save(); x.fillStyle = 'rgba(60,35,15,.25)'; x.fillRect(bx + 2, by + 3, bw, bh); x.fillStyle = '#fbf3dc'; x.fillRect(bx, by, bw, bh);
  const im = TOME_CERTS[name]; if (im && im.naturalWidth) { const k = Math.max(bw / im.naturalWidth, bh / im.naturalHeight); x.beginPath(); x.rect(bx + 2, by + 2, bw - 4, bh - 4); x.clip(); x.drawImage(im, bx + (bw - im.naturalWidth * k) / 2, by + (bh - im.naturalHeight * k) / 2, im.naturalWidth * k, im.naturalHeight * k); }
  x.restore(); x.strokeStyle = TOME_GOLD; x.lineWidth = 1.5; x.strokeRect(bx + .5, by + .5, bw - 1, bh - 1);
}
function tomeButton(x, text, bx, by, size, hot, act) { // a small outlined button on the card
  x.font = `700 ${size}px ${TOME_SANS}`; const w = x.measureText(text).width + size * 1.6, h = size * 1.9;
  x.fillStyle = '#fbf3dc'; x.beginPath(); x.roundRect(bx, by, w, h, h / 2); x.fill(); x.strokeStyle = '#7a5a2e'; x.lineWidth = 1.5; x.stroke();
  x.fillStyle = '#4a2f1b'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, bx + w / 2, by + h / 2 + 1);
  if (hot) hot.push({ x: bx, y: by, w, h, act, label: text }); return by + h;
}
const tomeOpen = url => window.open(url, '_blank', 'noopener');
function tomeJump(title) { // from a skill to its project's page, in the Projects box
  const it = WORKS_WORDS.items.find(t => t.t === title); if (!it) return;
  closeTome(); openWorks(projects[0]); worksOpenItem(it);
}
function tomeInk(x, i, w, l) { // draws chapter i's words. Returns the height they took, so the same code measures and paints
  const c = TOME_PAGES[i], s = l.size, pad = s * 1.35, hot = x === l.measure ? null : (l.hot[i] = []); let y = pad * 1.05;
  const zoom = (name, cap) => (cx, cy) => zoomPicture(`photos/certs/${name}.jpg`, cap, cx, cy);
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillStyle = '#8b6c3c'; x.font = `600 ${s * .86}px ${TOME_SERIF}`; x.fillText(`CHAPTER ${TOME_NUM[c.ci]}${c.label ? `  ·  ${c.label.toUpperCase()}` : ''}`, w / 2, y); y += s * 1.5;
  x.fillStyle = TOME_INK; x.font = `700 ${s * 2.05}px ${TOME_SERIF}`; x.fillText(c.name, w / 2, y); y += s * 1.5;
  x.strokeStyle = TOME_GOLD; x.lineWidth = 1.5; x.beginPath(); x.moveTo(w / 2 - s * 5, y); x.lineTo(w / 2 - s * .6, y); x.moveTo(w / 2 + s * .6, y); x.lineTo(w / 2 + s * 5, y); x.stroke();
  x.fillStyle = TOME_GOLD; x.beginPath(); x.moveTo(w / 2, y - s * .34); x.lineTo(w / 2 + s * .34, y); x.lineTo(w / 2, y + s * .34); x.lineTo(w / 2 - s * .34, y); x.fill(); y += s * 1.1;
  if (c.lead) { x.fillStyle = TOME_INK; x.font = `600 ${s}px ${TOME_SANS}`; x.textAlign = 'center'; for (const line of tomeWrap(x, c.lead, Math.min(w - pad * 2, s * 40))) { x.fillText(line, w / 2, y + s * .6); y += s * 1.45; } y += s * .55; }
  if (c.pills) y = tomePills(x, c.pills, w / 2, y, w - pad * 2, s * .88, 'center') + s * .3;
  if (c.badges) { // each badge's picture with its name under it; the ones big enough open large, and one can be verified
    const fit = Math.max(2, Math.min(c.badges.length, Math.floor((w - pad * 2 + s) / (s * 7.2)))), per = Math.ceil(c.badges.length / Math.ceil(c.badges.length / fit)), gap = s * .8, bw = (w - pad * 2 - gap * (per - 1)) / per, bh = bw / 1.45;
    let rowTop = y, bottom = y;
    c.badges.forEach(([name, img, big, url], n) => {
      const col = n % per; if (n && !col) rowTop = bottom + s * .7; const inRow = Math.min(per, c.badges.length - (n - col)), bx = (w - (inRow * bw + (inRow - 1) * gap)) / 2 + col * (bw + gap); let by = rowTop; // each row centred
      tomeThumb(x, img, bx, by, bw, bh); if (big && hot) hot.push({ x: bx, y: by, w: bw, h: bh, act: zoom(img, name), label: name }); by += bh + s * .55;
      x.fillStyle = TOME_INK; x.font = `600 ${s * .74}px ${TOME_SANS}`; x.textAlign = 'center'; x.textBaseline = 'middle'; for (const line of tomeWrap(x, name, bw)) { x.fillText(line, bx + bw / 2, by + s * .4); by += s * 1.02; }
      if (url) by = tomeButton(x, 'Verify ↗', bx + bw / 2 - s * 3, by + s * .2, s * .7, hot, () => tomeOpen(url));
      bottom = Math.max(bottom, by);
    });
    y = bottom + s * .3;
  }
  if (c.entries) {
    const cols = Math.min(l.cols === 1 ? (c.dense ? 2 : 1) : c.entries.length === 4 ? 2 : l.cols, c.entries.length), gap = s * 1.6, colW = (w - pad * 2 - gap * (cols - 1)) / cols; let rowTop = y, bottom = y;
    c.entries.forEach((e, n) => {
      const col = n % cols; if (n && !col) rowTop = bottom + s * .75; let ey = rowTop;
      // a certificate's picture sits to the left of its words
      const tw = e.img ? Math.min(colW * .34, s * 5.4) : 0, th = tw / 1.42, cx = pad + col * (colW + gap) + (tw ? tw + s * .7 : 0), tx = colW - (tw ? tw + s * .7 : 0);
      if (e.img) { const bx = pad + col * (colW + gap); tomeThumb(x, e.img, bx, rowTop + s * .2, tw, th); if (e.big && hot) hot.push({ x: bx, y: rowTop + s * .2, w: tw, h: th, act: zoom(e.img, `${e.h}. ${e.m || ''}`), label: e.h }); }
      x.textAlign = 'left'; x.textBaseline = 'middle';
      x.fillStyle = TOME_INK; x.font = `700 ${s * 1.1}px ${TOME_SERIF}`; for (const line of tomeWrap(x, e.h, tx)) { x.fillText(line, cx, ey + s * .68); ey += s * 1.38; }
      if (e.m) { x.fillStyle = '#7a5a2e'; x.font = `600 ${s * .86}px ${TOME_SANS}`; for (const line of tomeWrap(x, e.m, tx)) { x.fillText(line, cx, ey + s * .6); ey += s * 1.26; } }
      if (e.d) { x.fillStyle = TOME_INK; x.font = `600 ${s * .86}px ${TOME_SANS}`; for (const line of tomeWrap(x, e.d, tx)) { x.fillText(line, cx, ey + s * .6); ey += s * 1.26; } }
      if (e.verify) ey = tomeButton(x, `${e.verify[0]}  ↗`, cx, ey + s * .35, s * .72, hot, () => tomeOpen(e.verify[1]));
      const skill = c.name === 'Skills' ? p => TOME_SKILL_PROJECTS[p] && (() => { tome.skill = tome.skill === p ? null : p; if (tome.layout) tome.layout.cards[i] = null; dirty = true; }) : null;
      if (e.pills) ey = tomePills(x, e.pills, cx, ey + s * .3, tx, s * .8, 'left', { hot, link: skill });
      bottom = Math.max(bottom, ey, e.img ? rowTop + s * .2 + th : 0);
    });
    y = bottom;
  }
  // A skill picked: the projects that show it, each one a way there.
  if (c.name === 'Skills' && x !== l.measure && tome && tome.skill && TOME_SKILL_PROJECTS[tome.skill]) {
    y += s * .9; x.fillStyle = '#7a5a2e'; x.font = `600 ${s * .86}px ${TOME_SANS}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(`${tome.skill} shows up in:`, w / 2, y); y += s * .9;
    y = tomePills(x, TOME_SKILL_PROJECTS[tome.skill], w / 2, y, w - pad * 2, s * .86, 'center', { hot, link: t => () => tomeJump(t) });
  } else if (c.name === 'Skills') y += s * .9 + s * 1.9 * 1.5; // room kept for that line, so the card doesn't jump
  if (c.name === 'Skills' && x !== l.measure && !(tome && tome.skill)) { x.fillStyle = '#7a5a2e'; x.font = `italic 600 ${s * .78}px ${TOME_SANS}`; x.textAlign = 'center'; x.fillText('Click a skill with ↗ to see the projects that use it.', w / 2, y - s * 1.9); }
  return y + pad * .8;
}
function tomeCard(i, l) {
  const cached = l.cards[i]; if (cached) return cached;
  const h = tomeInk(l.measure, i, l.cardW, l), c = document.createElement('canvas'); c.width = Math.ceil(l.cardW * pr); c.height = Math.ceil(h * pr);
  const x = c.getContext('2d'); x.scale(pr, pr);
  const paper = x.createLinearGradient(0, 0, 0, h); paper.addColorStop(0, '#f7ecd0'); paper.addColorStop(1, '#ecdcb6'); x.fillStyle = paper; x.beginPath(); x.roundRect(1, 1, l.cardW - 2, h - 2, 10); x.fill();
  x.strokeStyle = '#7a5a2e'; x.lineWidth = 2; x.stroke(); x.strokeStyle = 'rgba(122,90,46,.45)'; x.lineWidth = 1; x.beginPath(); x.roundRect(6, 6, l.cardW - 12, h - 12, 7); x.stroke();
  x.fillStyle = TOME_GOLD; for (const [a, b] of [[12, 12], [l.cardW - 12, 12], [12, h - 12], [l.cardW - 12, h - 12]]) { x.beginPath(); x.moveTo(a, b - 5); x.lineTo(a + 5, b); x.lineTo(a, b + 5); x.lineTo(a - 5, b); x.fill(); }
  tomeInk(x, i, l.cardW, l);
  return l.cards[i] = c;
}
function tomeLayout() {
  if (tome.layout && tome.layout.W === W && tome.layout.H === H && tome.layout.pr === pr) return tome.layout;
  const tall = W / H < 1, short = !tall && H < 520, compact = tall || W < 860, measure = document.createElement('canvas').getContext('2d');
  const cardW = tall ? W * .88 : short ? W * .4 : Math.min(W * .56, 800), cols = tall || short ? 1 : 3;
  const l = { W, H, pr, tall, short, compact, measure, cardW, cols, cards: [], hot: [], size: Math.max(11.5, Math.min(15.5, tall ? W / 27 : short ? H / 27 : Math.min(W / 72, H / 46))) };
  const room = H * (tall ? .5 : short ? .84 : .46); // the fullest page sets the size, so the book stays put between pages
  for (;;) { l.cardH = Math.max(...TOME_PAGES.map((c, i) => tomeInk(measure, i, cardW, l))); if (l.cardH <= room || l.size <= 9.5) break; l.size -= .5; }
  l.navH = compact ? 44 : 40; l.navY = short ? H * .955 - l.navH : H * (tall ? .945 : .95) - l.navH;
  l.navCx = W / 2; l.navW = Math.min(W * .86, 340);
  if (short) { l.cardX = W * .055; l.cardY = (H - l.cardH) / 2; l.free = { x: W * .46, y: H * .1, w: W * .5, h: l.navY - H * .1 }; l.navCx = l.free.x + l.free.w / 2; l.navW = Math.min(l.free.w, 300); }
  else { l.cardX = (W - cardW) / 2; l.cardY = H * (tall ? .085 : .075); const top = l.cardY + l.cardH + H * .015; l.free = { x: W * .04, y: top, w: W * .92, h: l.navY - top }; } // starts below the card, so nothing of the scene hides under it
  return tome.layout = l;
}
function tomeNav(l, now) {
  tome.hot = [];
  const chapters = TOME_WORDS.chapters, y = l.navY, h = l.navH, pill = (x, w) => { g.fillStyle = 'rgba(22,12,6,.78)'; g.strokeStyle = 'rgba(201,162,74,.75)'; g.lineWidth = 1.5; g.beginPath(); g.roundRect(x, y, w, h, h / 2); g.fill(); g.stroke(); };
  g.textBaseline = 'middle'; g.textAlign = 'center';
  const arrow = (x, go) => { const on = go >= 0 && go < TOME_PAGES.length; g.fillStyle = on ? '#f3e4bf' : 'rgba(243,228,191,.28)'; g.font = `700 ${h * .62}px ${TOME_SERIF}`; g.fillText(go > tome.at ? '›' : '‹', x, y + h / 2 - 2); tome.hot.push({ x: x - 26, y: y - 6, w: 52, h: h + 12, go }); };
  if (l.compact) {
    const w = l.navW, x = l.navCx - w / 2; pill(x, w);
    arrow(x + 26, tome.at - 1); arrow(x + w - 26, tome.at + 1);
    g.fillStyle = '#f3e4bf'; g.font = `600 ${Math.min(15, w / 22)}px ${TOME_SERIF}`; const page = TOME_PAGES[tome.at], parts = TOME_PAGES.filter(p => p.ci === page.ci); g.fillText(`${TOME_NUM[page.ci]}. ${page.name}${parts.length > 1 ? ` ${parts.indexOf(page) + 1}/${parts.length}` : ''}`, l.navCx, y + h / 2 + 1);
    return;
  }
  g.font = `600 14px ${TOME_SERIF}`; const gap = 26, widths = chapters.map(c => g.measureText(c.name).width), total = widths.reduce((a, b) => a + b + gap, -gap) + 104, x0 = (W - total) / 2; pill(x0, total);
  arrow(x0 + 26, tome.at - 1); arrow(x0 + total - 26, tome.at + 1);
  let x = x0 + 52; chapters.forEach((c, i) => {
    const go = TOME_PAGES.findIndex(p => p.ci === i), on = TOME_PAGES[tome.at].ci === i, hov = tome.hover && tome.hover.go === go && tome.hover.x !== undefined; g.font = `600 14px ${TOME_SERIF}`; g.fillStyle = on ? '#ffd98a' : hov ? '#fff4d8' : 'rgba(243,228,191,.72)'; g.textAlign = 'left'; g.fillText(c.name, x, y + h / 2 + 1);
    if (on) { g.fillStyle = '#ffd98a'; g.fillRect(x, y + h - 9, widths[i], 2); }
    tome.hot.push({ x: x - gap / 2, y: y - 6, w: widths[i] + gap, h: h + 12, go }); x += widths[i] + gap; g.textAlign = 'center';
  });
}

/* ---------- Drawing ---------- */
const tomeBack = (t, s = 1.7) => { const k = t - 1; return 1 + (s + 1) * k * k * k + s * k * k; };
function tomeFade(now) {
  if (!tome.from) return;
  const t = (now - tome.fadeAt) / (reduced ? 1 : 650); if (t >= 1) { tome.from = null; return; }
  g.save(); g.globalAlpha = 1 - t * t; g.drawImage(tome.from, 0, 0, W, H); g.restore();
}
function drawTome(now) {
  if (tome.phase === 'build') {
    if (tomeBuilder) { const r = tomeBuilder.next(); if (r.done) tomeBuilder = null; }
    g.fillStyle = '#1a0e07'; g.fillRect(0, 0, W, H);
    const y = H * .52, bw = Math.min(W * .6, 420), x = (W - bw) / 2, size = Math.max(15, Math.min(W * .04, 24));
    g.fillStyle = '#f3e4bf'; g.font = `600 ${size}px ${TOME_SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Lighting the candles...', W / 2, y - size * 1.6);
    g.fillStyle = 'rgba(243,228,191,.2)'; g.fillRect(x, y, bw, 3); g.fillStyle = '#ffd98a'; g.fillRect(x, y, bw * tomeBuilt, 3);
    tomeFade(now);
    if (tomeWorld && !tomeBuilder && !tome.from) { tome.phase = 'open'; tome.from = tomeSnapshot(); tome.fadeAt = now; tomeReset(); }
    return;
  }
  const w = tomeWorld, l = tomeLayout(), time = now / 1000;
  // Opening: the book starts shut and swings open.
  let openK = 1;
  if (tome.phase === 'open') {
    const t = (now - tome.openAt - 300) / TOME_OPEN_MS; openK = Math.max(0, Math.min(1, t));
    if (t >= 1 || reduced) { tome.phase = 'read'; openK = 1; const c = w.chapters[0]; c.root.visible = true; c.popAt = now; tome.cardInAt = now; tomeSay(0); }
    tome.shadow = true;
  }
  const opened = openK * openK * (3 - 2 * openK);
  w.wing.rotation.z = -Math.PI * (1 - opened);
  // The turning sheet.
  if (tome.turn) {
    const t = tome.turn, raw = Math.max(0, Math.min(1, (now - t.at - 150) / TOME_TURN_MS)), e = raw < .5 ? 4 * raw ** 3 : 1 - (-2 * raw + 2) ** 3 / 2;
    tomeBendPage(w, t.dir > 0 ? e : 1 - e);
    tome.shadow = true;
    if (!t.popped && e > .58) { t.popped = true; const c = w.chapters[TOME_PAGES[t.to].ci]; c.root.visible = true; c.popAt = now; c.foldAt = 0; tome.shown = t.to; tome.cardOutAt = 0; tome.cardInAt = now; }
    if (raw >= 1) tomeFinishTurn(now);
  }
  // Pop-ups stand up off the page, outward from the spine, and fold back down.
  for (const c of w.chapters) {
    if (!c.root.visible) continue;
    let busy = false;
    for (const it of c.items) {
      let k = 1;
      if (c.foldAt) { const t = (now - c.foldAt) / TOME_FOLD_MS; k = reduced ? 0 : 1 - Math.min(1, Math.max(0, t)); k = k * k * (3 - 2 * k); if (t < 1) busy = true; }
      else { const t = reduced ? 1 : (now - c.popAt - it.delay) / TOME_POP_MS; k = t <= 0 ? 0 : t >= 1 ? 1 : tomeBack(t); if (t < 1) busy = true; }
      const h = it.holder; h.visible = k > .004;
      if (it.fly) { h.scale.setScalar(Math.max(.001, k)); h.position.y = it.y + (reduced ? 0 : Math.sin(time * 1.2 + it.phase) * it.bob) - (1 - Math.min(1, k)) * 2; }
      else h.scale.set(.82 + .18 * k, Math.max(.001, k), .82 + .18 * k);
    }
    if (busy) tome.shadow = true;
    if (!reduced) for (const n of c.moving) {
      const u = n.userData;
      if (u.spin) { n.rotation.x += u.spin[0] * .016; n.rotation.y += u.spin[1] * .016; n.rotation.z += u.spin[2] * .016; }
      if (u.wave) n.rotation.y = Math.sin(time * 3.4 + n.id) * .3;
      if (u.flick) { n.scale.set(1 + Math.sin(time * 17) * .1, 1 + Math.sin(time * 23) * .2, 1); }
    }
  }
  // Candles.
  if (!reduced) {
    for (const f of w.flames) { const a = Math.sin(time * 9 + f.phase) * .5 + Math.sin(time * 23 + f.phase * 2) * .3; f.flame.scale.set(1 + a * .1, 1.9 + a * .24, 1 + a * .1); f.halo.scale.setScalar(4.6 + a * .5); }
    const a = Math.sin(time * 7) * .5 + Math.sin(time * 17) * .5;
    w.warmL.intensity = 170 + a * 20; w.warmR.intensity = 140 - a * 16; w.warmF.intensity = 60 + a * 7;
    w.moving.motes.rotation.y = time * .012; w.moving.motes.position.y = Math.sin(time * .2) * .8;
    w.moving.ring.material.opacity = .28 + Math.sin(time * .8) * .07;
  }
  // Camera: fit the book into what this page's card and the chapter buttons leave free. A short card leaves more room, so the
  // camera comes in and the book grows into it; a long one pushes the book back. The space eases between pages, so the camera glides.
  let f = l.free;
  if (!l.short) {
    const card = tomeCard(tome.phase === 'read' ? tome.shown : 0, l).height / pr, goal = l.cardY + card + H * .02, dt = Math.min(.1, (now - (tome.fitAt || now)) / 1000); tome.fitAt = now;
    tome.fitTop = tome.fitTop == null || reduced ? goal : tome.fitTop + (goal - tome.fitTop) * (1 - Math.exp(-dt * 2.6));
    f = { x: l.free.x, y: tome.fitTop, w: l.free.w, h: l.navY - tome.fitTop };
  }
  const tan = Math.tan(w.cam.fov / 2 * Math.PI / 180), fw = f.w / W, fh = f.h / H, aspect = W / H;
  const fit = Math.max(l.tall ? 21.5 / (2 * tan * aspect * fw) : 23.5 / (2 * tan * aspect * fw), (l.tall ? TOME_FIT_TALL : TOME_FIT_H) / (2 * tan * fh)); // the width counts the book and its nearest candles; the height counts the pop-ups standing up off the far pages
  const dist = fit * (1 - (1 - opened) * .2);
  w.scene.fog.near = dist * 1.05; w.scene.fog.far = dist * 2.6;
  const aim = TOME_AIM.clone(); aim.x += (1 - opened) * TOME_PW / 2; aim.y += opened * TOME_LIFT; // aimed a little above the pages, at the middle of the pop-ups as well as the book
  w.cam.position.copy(aim).addScaledVector(TOME_TILT, dist); w.cam.position.x += look.x * dist * .00022; w.cam.position.y -= look.y * dist * .00016;
  w.cam.up.set(0, 1, 0); w.cam.lookAt(aim); w.cam.aspect = aspect;
  const keep = 1 - opened; w.cam.setViewOffset(W, H, -((f.x + f.w / 2) / W - .5) * W * (1 - keep), -((f.y + f.h / 2) / H - .5) * H * (1 - keep), W, H); w.cam.updateMatrixWorld();
  renderer.shadowMap.needsUpdate = tome.shadow; tome.shadow = false;
  renderer.setRenderTarget(null); renderer.render(w.scene, w.cam);
  g.drawImage(renderer.domElement, 0, 0, W, H); // same task as the render, while its buffer is still valid
  // A soft dark edge, like a room lit by candles.
  const vig = g.createRadialGradient(W / 2, H * .55, Math.min(W, H) * .42, W / 2, H * .55, Math.max(W, H) * .78); vig.addColorStop(0, 'rgba(10,5,2,0)'); vig.addColorStop(1, 'rgba(10,5,2,.62)'); g.fillStyle = vig; g.fillRect(0, 0, W, H);
  // Where the book sits on screen, for clicks.
  const v = new THREE.Vector3(), pts = [[-TOME_PW, -TOME_PD / 2], [TOME_PW, -TOME_PD / 2], [-TOME_PW, TOME_PD / 2], [TOME_PW, TOME_PD / 2]].map(([a, b]) => { v.set(a, TOME_TOP, b).project(w.cam); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H]; });
  v.set(0, TOME_TOP, 0).project(w.cam);
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); tome.rect = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys), spine: (v.x + 1) / 2 * W };
  // The card.
  if (tome.phase === 'read') {
    const out = tome.cardOutAt ? Math.min(1, (now - tome.cardOutAt) / 200) : 0, inn = tome.cardInAt && !tome.cardOutAt ? Math.min(1, (now - tome.cardInAt) / 320) : tome.cardOutAt ? 1 : 0, a = reduced ? 1 : inn * (1 - out), card = tomeCard(tome.shown, l), ch = card.height / pr;
    const top = l.short ? (H - ch) / 2 : l.cardY;
    tome.cardBox = { x: l.cardX, y: top, w: l.cardW, h: ch };
    if (a > 0) { g.save(); g.globalAlpha = a; g.shadowColor = 'rgba(8,4,1,.65)'; g.shadowBlur = 26; g.shadowOffsetY = 8; g.drawImage(card, l.cardX, top + (1 - a) * (l.short ? 0 : -10), l.cardW, ch); g.restore(); }
    tomeNav(l, now);
    if (!tome.moved) {
      const hint = COARSE ? 'swipe to turn the page' : 'scroll to turn the page', bob = reduced ? 0 : Math.sin(now / 300) * 3, size = Math.max(13, Math.min(H * .021, 16));
      g.save(); g.font = `600 ${size}px ${TOME_SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 4; g.strokeStyle = 'rgba(18,9,4,.85)'; g.strokeText(hint, l.navCx, l.navY - size * 1 + bob); g.fillStyle = '#ffe9bd'; g.fillText(hint, l.navCx, l.navY - size * 1 + bob); g.restore();
    }
  }
  tomeFade(now);
}

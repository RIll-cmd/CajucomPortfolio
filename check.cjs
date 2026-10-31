// End-to-end check: node check.cjs (needs playwright-core and a system Edge). Screenshots land in the current directory.
// Pass "calibrate" to only take a straight-on shot of the TV, for lining up SCREEN and DIALS in index.html.
// Pass "serve" to only run the local server on port 8765, for viewing the page in a real browser.
const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');

const TYPES = { '.html': 'text/html', '.jpg': 'image/jpeg', '.png': 'image/png', '.js': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm' };
const wrapper = () => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0;font:14px/1.4 system-ui,sans-serif}[hidden]{display:none!important}</style></head><body>${fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')}</body></html>`; // same skeleton the Artifact host wraps around the file

(async () => {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    if (url === '/') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(wrapper()); }
    const file = path.join(__dirname, url);
    if (!file.startsWith(__dirname) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  }).listen(process.argv[2] === 'serve' ? 8765 : 0);
  if (process.argv[2] === 'serve') return;
  const { chromium } = require('playwright-core');
  const origin = `http://localhost:${server.address().port}/`;
  const browser = await chromium.launch({ channel: 'msedge', args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });

  if (process.argv[2] === 'calibrate') {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
    await page.goto(origin);
    await page.waitForFunction(() => roomReady, null, { timeout: 120000 });
    await page.evaluate(() => {
      mode = 'calibrate'; scene3d.environment = null; scene3d.add(new THREE.AmbientLight(0xffffff, 3));
      const y = CABINET_TOP + .23 * TV_SCALE; camera.position.set(0, y, TV_Z + 1.6); camLook.v.set(0, y, TV_Z); camera.lookAt(camLook.v); screenMesh.material.opacity = .35;
    });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'calibrate.png' });
    await browser.close(); server.close();
    return;
  }

  const PHONE = { deviceScaleFactor: 3, hasTouch: true, isMobile: true };
  for (const [name, viewport, device] of [['desktop', { width: 1440, height: 860 }], ['phone', { width: 390, height: 844 }, PHONE], ['small', { width: 360, height: 640 }, PHONE], ['landscape', { width: 844, height: 390 }, PHONE]]) {
    const context = await browser.newContext({ viewport, ...device });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
    page.on('response', r => { if (r.status() >= 400 && !/favicon/.test(r.url())) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto(origin);
    await page.waitForFunction(() => roomReady, null, { timeout: 120000 });
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `${name}-1-room.png` });
    const litShare = await page.evaluate(() => sg.getImageData(0, 0, SCREEN_W, SCREEN_H).data.filter((v, i) => i % 4 === 1 && v > 60).length / (SCREEN_W * SCREEN_H));
    assert.ok(litShare > .2, `TV picture is not black (${litShare} lit)`);

    assert.ok(await page.evaluate(() => !!gl), 'WebGL active');
    assert.deepStrictEqual(await page.evaluate(() => toScene(W / 2, H / 2).map(Math.round)), [viewport.width / 2, viewport.height / 2], 'warp keeps centre');
    assert.ok(await page.evaluate(() => toScene(0, 0)[0] < 0), 'warp pushes corners off the scene');
    assert.notStrictEqual(await page.evaluate(() => flickerAt(0)), await page.evaluate(() => flickerAt(5300 * .42)), 'TV light blinks');

    const click = async local => { const [x, y] = await page.evaluate(l => screenPoint(l), local); await page.mouse.click(x, y); };

    // The dials on the model are real controls and must not trigger the dive.
    await click(await page.evaluate(() => DIALS.channel));
    await page.waitForTimeout(500);
    assert.strictEqual(await page.evaluate(() => channel), 2, 'channel dial');
    assert.strictEqual(await page.evaluate(() => mode), 'room');
    await click(await page.evaluate(() => DIALS.channel));
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${name}-2-bars.png` });
    await click(await page.evaluate(() => DIALS.volume));
    assert.strictEqual(await page.evaluate(() => vol.value), '20', 'volume dial');
    await click(await page.evaluate(() => DIALS.power));
    await page.waitForTimeout(900);
    assert.strictEqual(await page.evaluate(() => tvOn), false, 'power button');
    await page.screenshot({ path: `${name}-3-off.png` });
    await click(await page.evaluate(() => DIALS.power));
    await page.evaluate(() => { vol.value = 0; chan.value = 1; chan.dispatchEvent(new Event('input')); vol.dispatchEvent(new Event('input')); });
    await page.waitForTimeout(600);

    // Dive in through a real click on the screen.
    await click(await page.evaluate(() => [SCREEN.x, SCREEN.y]));
    assert.strictEqual(await page.evaluate(() => mode), 'dive');
    // Software rendering is too slow to catch mid-flight, so hold the clock at 72% of the dive for one shot.
    await page.evaluate(() => { const held = dive; window.heldT = setInterval(() => { held.t0 = performance.now() - DIVE_MS * .72; }, 10); });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${name}-4-dive.png` });
    await page.evaluate(() => clearInterval(window.heldT));
    await page.waitForFunction(() => mode === 'inside', null, { timeout: 60000 });
    await page.waitForTimeout(700);
    assert.strictEqual(await page.evaluate(() => crt.classList.contains('full') && room.hidden), true);
    await page.screenshot({ path: `${name}-5-inside.png` });

    // One page: every card fits on screen without overlapping another or the stickers' corners.
    const layout = await page.evaluate(() => {
      const box = c => { const [x, y] = place(c), w = c.w * c.s * sc / 2, h = c.h * c.s * sc / 2; return { t: c.t, l: x - w, r: x + w, top: y - h, b: y + h }; };
      const boxes = items.map(box), off = boxes.filter(b => b.l < 0 || b.top < 0 || b.r > W || b.b > H).map(b => b.t), hits = [];
      boxes.forEach((a, i) => boxes.slice(i + 1).forEach(b => { if (a.l < b.r && b.l < a.r && a.top < b.b && b.top < a.b) hits.push(`${a.t} + ${b.t}`); }));
      return { off, hits };
    });
    assert.deepStrictEqual(layout, { off: [], hits: [] }, 'cards fit one screen, no overlaps');

    // Drag tugs the board with resistance, then it springs back: there is no other area.
    const cx = viewport.width / 2, cy = viewport.height / 2;
    await page.mouse.move(cx, cy); await page.mouse.down();
    await page.mouse.move(cx - 180, cy + 40, { steps: 6 });
    await page.waitForFunction(() => pan.x < -10, null, { timeout: 30000 });
    assert.ok(await page.evaluate(() => Math.abs(pan.x) < PULL), 'tug is limited');
    await page.mouse.up();
    await page.waitForFunction(() => pan.x === 0 && pan.y === 0, null, { timeout: 60000 });

    // The mouse looks around the board.
    if (name === 'desktop') {
      await page.mouse.move(40, 40);
      await page.waitForFunction(() => look.x > 5 && look.y > 5, null, { timeout: 30000 });
    }

    // Wheel up selects the screen nearest the mouse, with no click; wheel down lets go.
    if (!device) { // touch screens have no wheel
      const orbit = await page.evaluate(() => { const c = projects[0]; return [...place(c)]; });
      await page.mouse.move(orbit[0], orbit[1]);
      await page.mouse.wheel(0, -500);
      await page.waitForFunction(() => focus && zoomGoal === 1, null, { timeout: 30000 });
      assert.strictEqual(await page.evaluate(() => focus.t), 'Works', 'wheel selects nearest card');
      await page.waitForFunction(() => popAt > 0, null, { timeout: 60000 });
      await page.waitForTimeout(350);
      await page.screenshot({ path: `${name}-6-focus.png` });
      await page.mouse.wheel(0, 500);
      await page.waitForFunction(() => zoomGoal === 0 && !focus, null, { timeout: 60000 });
    }

    // First click selects a card, the second opens it.
    const spot = await page.evaluate(() => {
      for (let y = 40; y < H - 40; y += 20) for (let x = 40; x < W - 40; x += 20) { const c = hit(x, y); if (c && !c.hero && !c.stories && !c.portal && !c.notebook && document.elementFromPoint(x, y) === crt) return { x, y, t: c.t }; }
    });
    assert.ok(spot, 'a project is on screen');
    await page.mouse.click(spot.x, spot.y);
    await page.waitForFunction(() => focus && popAt > 0, null, { timeout: 60000 });
    assert.strictEqual(await page.evaluate(() => [focus.t, view]).then(v => v[0] === spot.t && v[1] === null), true, 'first click selects');
    const centre = await page.evaluate(() => [...place(focus)]);
    await page.mouse.click(centre[0], centre[1]);
    await page.waitForTimeout(900);
    assert.strictEqual(await page.evaluate(() => view && view.c.t), spot.t, 'second click opens');
    await page.screenshot({ path: `${name}-7-project.png` });
    await page.mouse.move(cx, cy); await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500);
    assert.ok(await page.evaluate(() => view.max === 0 || view.scroll > 0), 'project scrolls when taller than the screen');
    await page.keyboard.press('Escape');
    assert.strictEqual(await page.evaluate(() => view), null);
    await page.keyboard.press('Escape');
    assert.strictEqual(await page.evaluate(() => zoomGoal), 0, 'Escape lets go of the selection');

    // Stories: selecting shows the current picture, and clicking it moves on.
    await page.evaluate(() => setFocus(stories));
    await page.waitForFunction(() => popAt > 0, null, { timeout: 60000 });
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${name}-9-stories.png` });
    const before = await page.evaluate(() => storyIndex);
    const storyCentre = await page.evaluate(() => [...place(stories)]);
    await page.mouse.click(storyCentre[0], storyCentre[1]);
    assert.notStrictEqual(await page.evaluate(() => storyIndex), before, 'clicking a story moves on');
    await page.evaluate(() => clearFocus());
    await page.waitForFunction(() => !focus, null, { timeout: 60000 });
    // A story changing on the board must not disturb another selected card.
    const calm = await page.evaluate(() => { focus = projects[0]; zoomGoal = 1; popAt = 123; glitch = 0; stepStory(1); const r = popAt === 123 && glitch === 0; clearFocus(); return r; });
    assert.ok(calm, 'background story change leaves the selected card alone');
    await page.waitForFunction(() => !focus, null, { timeout: 60000 });

    // Boxes 1 and 2 open onto their own backgrounds. The rest of the board can't be hit behind them.
    const corner = () => page.evaluate(() => [...sceneCanvas.getContext('2d').getImageData(sceneCanvas.width >> 1, 2, 1, 1).data].slice(0, 3).join());
    const openTheme = async c => {
      await page.evaluate(i => setFocus(projects[i]), c);
      await page.waitForFunction(i => projects[i].themeK === 1 && zoomNow > .98 && popAt > 0, c, { timeout: 90000 });
      await page.waitForTimeout(1800); // the burst clears and the words fade in
    };
    await openTheme(0);
    await page.screenshot({ path: `${name}-a-clouds.png` });
    assert.notStrictEqual(await corner(), '13,13,14', 'clouds cover the board');
    const onlySelected = () => page.evaluate(() => { for (let y = 10; y < H; y += 20) for (let x = 10; x < W; x += 20) { const c = hit(x, y); if (c && c !== focus) return false; } return true; });
    assert.ok(await onlySelected(), 'other cards cannot be hit behind the clouds');
    await openTheme(1);
    await page.screenshot({ path: `${name}-b-paper.png` });
    assert.ok(await onlySelected(), 'other cards cannot be hit behind the paper');
    // Dragging on the paper combs new rows through it and stays on the selected card.
    const tall = viewport.width < viewport.height, from = tall ? [.2, .2] : [.06, .5], to = tall ? [.8, .23] : [.2, .4];
    const rowsAt = () => page.evaluate(() => { const d = paper.lines.getContext('2d').getImageData(0, 0, paper.lines.width, paper.lines.height).data; let sum = 0; for (let i = 3; i < d.length; i += 4) sum += d[i]; return sum; });
    const beforeRake = await rowsAt();
    await page.mouse.move(viewport.width * from[0], viewport.height * from[1]); await page.mouse.down();
    await page.mouse.move(viewport.width * to[0], viewport.height * to[1], { steps: 8 }); await page.mouse.up();
    assert.notStrictEqual(await rowsAt(), beforeRake, 'a drag rakes the paper');
    assert.strictEqual(await page.evaluate(() => [focus.t, pan.x, paper.raked].join()), 'Field Notes,0,true', 'raking leaves the board where it is');
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${name}-c-raked.png` });
    // The middle box and the last two keep the plain board.
    await page.evaluate(() => setFocus(hero));
    await page.waitForFunction(() => projects[1].themeK === 0 && zoomNow > .98, null, { timeout: 90000 });
    // Polled: under software rendering the first read after a fade can return an old frame.
    await page.waitForFunction(() => [...sceneCanvas.getContext('2d').getImageData(sceneCanvas.width >> 1, 2, 1, 1).data].slice(0, 3).join() === '13,13,14', null, { timeout: 30000, polling: 200 });
    await page.evaluate(() => clearFocus());
    await page.waitForFunction(() => !focus, null, { timeout: 60000 });

    // Box 1: opening it loads through the sky to a door, and only the door leads on. Back leaves at any point.
    const clickOrbit = async () => {
      await openTheme(0);
      const [x, y] = await page.evaluate(() => [...place(projects[0])]);
      await page.mouse.click(x, y);
      assert.ok(await page.evaluate(() => gate && ['build', 'load'].includes(gate.phase)), 'clicking the selected box starts loading');
    };
    await clickOrbit();
    await page.screenshot({ path: `${name}-d-white.png` });
    await page.waitForFunction(() => gate && gate.phase === 'load', null, { timeout: 180000 }).catch(async e => {
      console.log('gate stalled', JSON.stringify(await page.evaluate(() => ({ phase: gate && gate.phase, built: gateBuilt, builder: !!gateBuilder, world: !!gateWorld, works: !!works, mode, dirty, hidden: document.hidden, lost: renderer.getContext().isContextLost() }))), 'errors', errors);
      throw e;
    });
    // Software rendering is too slow to catch this on the clock, so hold loading halfway.
    await page.evaluate(() => { window.heldLoad = setInterval(() => { if (gate) gate.at = performance.now() - GATE_LOAD_MS / 2; }, 10); });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${name}-e-loading.png` });
    await page.mouse.click(cx, cy);
    assert.strictEqual(await page.evaluate(() => gate && gate.phase), 'load', 'a click does nothing while loading');
    await page.evaluate(() => clearInterval(window.heldLoad));
    await page.click('#back');
    assert.strictEqual(await page.evaluate(() => [gate, view, focus && focus.t].join()), ',,Works', 'back leaves the loading screen for the selected card');
    assert.strictEqual(await page.evaluate(() => $('#btn-talk').hidden), false, 'stickers come back');
    await clickOrbit();
    // The camera goes one way, from the plaza to the door, with no fade to white on the way.
    await page.evaluate(() => { window.gateTrip = []; const log = () => { if (!gate || gate.phase === 'door') return; if (gate.phase !== 'build') window.gateTrip.push(gateWorld.cam.position.z); requestAnimationFrame(log); }; log(); });
    await page.waitForFunction(() => gate && gate.phase === 'door', null, { timeout: 90000 });
    // The first sample is left over from the last visit, read before this visit's first frame moves the camera.
    assert.deepStrictEqual(await page.evaluate(() => window.gateTrip.slice(1).flatMap((z, i, a) => i && z > a[i - 1] ? [[a[i - 1], z]] : [])), [], 'the camera never jumps back on the way to the door');
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${name}-f-door.png` });
    assert.strictEqual(await page.evaluate(() => view), null, 'the door waits to be clicked');
    await page.mouse.click(cx, cy);
    assert.strictEqual(await page.evaluate(() => gate.phase), 'enter', 'a click on the door opens it');
    // Held partway for the same reason as the loading screen: a slow frame could skip right past it.
    await page.evaluate(() => { window.heldDoor = setInterval(() => { if (gate) gate.at = performance.now() - GATE_ENTER_MS * .62; }, 10); });
    await page.waitForFunction(() => gate && gateWorld.leaves[0].rotation.y > 1, null, { timeout: 60000 });
    await page.screenshot({ path: `${name}-g-open.png` });
    await page.evaluate(() => clearInterval(window.heldDoor));
    await page.waitForFunction(() => works && !gate, null, { timeout: 60000 });
    assert.strictEqual(await page.evaluate(() => works.c.t), 'Works', 'the door leads to the works page');
    await page.waitForFunction(() => works.flash === 0, null, { timeout: 30000 });
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${name}-j-works.png` });
    // One screen at a time: a wheel gesture moves exactly one section, however large.
    await page.mouse.move(cx, cy); await page.mouse.wheel(0, 700);
    await page.waitForFunction(() => works.page === 1 && Math.abs(works.y - H) < 1, null, { timeout: 30000 });
    assert.strictEqual(await page.evaluate(() => works.pages[works.page].kind), 'about', 'the first scroll shows the about section');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${name}-o-about.png` });
    assert.ok(await page.evaluate(() => WORKS_BOY_IMG.complete && WORKS_BOY_IMG.naturalWidth > 0), 'the boy picture loads');
    await page.keyboard.press('ArrowUp');
    assert.strictEqual(await page.evaluate(() => works.page), 0, 'arrow up goes back one section');
    const pageOf = kind => page.evaluate(k => works.pages.findIndex(p => p.kind === k), kind);
    const settle = () => page.waitForFunction(() => { window.settled = (window.settled || 0) + 1; return true; }).then(() => page.waitForTimeout(1200));
    // Filters: Solo leaves out the thesis, and All brings it back.
    const onCount = () => page.evaluate(() => WORKS_WORDS.items.filter(i => i.on).length);
    const allCount = await onCount();
    await page.evaluate(i => worksJump(i), await pageOf('portfolio')); await settle();
    const spotOf = label => page.evaluate(l => { for (let y = 20; y < H; y += 6) for (let x = 20; x < W; x += 6) { const h = worksHit(x, y); if (h && h.label === l) return [x, y]; } return null; }, label);
    const pill = await spotOf('Solo');
    assert.ok(pill, 'the Solo filter can be clicked');
    await page.mouse.click(...pill);
    assert.ok(await onCount() < allCount, 'Solo hides the thesis');
    await settle();
    await page.screenshot({ path: `${name}-k-filter.png` });
    await page.keyboard.press('ArrowLeft');
    assert.strictEqual(await onCount(), allCount, 'left goes back to All');
    assert.ok(await page.evaluate(() => WORKS_WORDS.items.every(i => i.topics.length && i.c === i.topics.join(' · '))), 'every project lists its topics');
    assert.strictEqual(await page.evaluate(() => works.pages.length), allCount + 4, 'one screen for each project, plus four');
    // A project opens from its frame, and back returns to the page, not the board.
    await page.evaluate(i => worksJump(i), await pageOf('work')); await settle();
    await page.screenshot({ path: `${name}-l-project.png` });
    const first = await page.evaluate(() => WORKS_WORDS.items[0].t);
    const frame = await spotOf(first);
    assert.ok(frame, 'the first project can be clicked');
    await page.mouse.click(...frame);
    assert.strictEqual(await page.evaluate(() => view && view.c.t), first, 'a project opens');
    assert.ok(await page.evaluate(() => !linksBox.hidden && linksBox.querySelector('a').href.includes('github.com/RIll-cmd/')), 'the project links to its repo');
    await page.waitForFunction(() => view.c.shots.every(shot => shot.pics.length && shot.pics.every(pic => pic.naturalWidth > 0)), null, { timeout: 60000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${name}-p-case.png` });
    assert.ok(await page.evaluate(() => view.max > H), 'the gallery and features make the page scroll');
    await page.evaluate(() => { view.scroll = view.target = view.max * .3; });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${name}-q-features.png` });
    await page.evaluate(() => { view.scroll = view.target = 0; });
    await page.click('#back');
    assert.strictEqual(await page.evaluate(() => [!!works, view].join()), 'true,', 'back returns to the works page');
    assert.strictEqual(await page.evaluate(() => linksBox.hidden), true, 'the links leave with the project');
    if (device) { // real touches: a long enough drag moves one section without opening anything, a short one settles back, and a tap opens
      const finger = await context.newCDPSession(page);
      const touch = (type, x, y) => finger.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
      const before = await page.evaluate(() => works.page);
      await touch('touchStart', 40, cy); await touch('touchMove', 40, cy - 12); await page.waitForTimeout(300); await touch('touchEnd');
      assert.strictEqual(await page.evaluate(() => works.page), before, 'a small drag stays on the same section');
      await touch('touchStart', 40, cy + 70); for (let i = 1; i <= 5; i++) await touch('touchMove', 40, cy + 70 - i * 30); await page.waitForTimeout(150); await touch('touchEnd');
      assert.strictEqual(await page.evaluate(() => works.page), before + 1, 'a finger drag moves one section');
      assert.strictEqual(await page.evaluate(() => view), null, 'a drag opens nothing');
      await page.evaluate(i => worksJump(i), before); await settle();
      const tapAt = await spotOf(first);
      await touch('touchStart', ...tapAt); await touch('touchEnd');
      await page.waitForFunction(() => view, null, { timeout: 20000 });
      await page.click('#back');
      const fits = await page.evaluate(() => { const units = WORKS_WORDS.filters.map(f => { g.font = `400 ${works.pillSize}px ${WORKS_LABEL}`; return g.measureText(f).width + works.pillSize * 3.2; }).reduce((a, b) => a + b) + works.pillSize * works.pillGap * 2; return units <= W - works.pad; });
      assert.ok(fits, 'the filters fit one row');
    }
    await page.keyboard.press('End'); await page.waitForFunction(() => Math.abs(works.y - works.page * H) < 1, null, { timeout: 30000 }); await page.waitForTimeout(800);
    assert.strictEqual(await page.evaluate(() => works.pages[works.page].kind), 'talk', 'End goes to the last section');
    await page.screenshot({ path: `${name}-n-ask.png` });
    await page.click('#back');
    assert.strictEqual(await page.evaluate(() => [works, focus && focus.t].join()), ',Works', 'back leaves the works page for the selected card');
    await page.evaluate(() => clearFocus());
    await page.waitForFunction(() => !focus, null, { timeout: 60000 });

    // Box 2: the selected card opens the notebook, which loops, and its drawings answer when clicked.
    await openTheme(1);
    const [fx, fy] = await page.evaluate(() => [...place(projects[1])]);
    await page.mouse.click(fx, fy);
    assert.ok(await page.evaluate(() => !!book), 'clicking the selected box opens the notebook');
    await page.waitForFunction(() => book && book.phase === 'ride' && !book.from, null, { timeout: 180000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${name}-h-notebook.png` });
    assert.strictEqual(await page.evaluate(() => bookWorld.body.material === bookWorld.spr.cat[0].mat), true, 'the cat rides in the first world');
    await page.mouse.move(cx, cy);
    await page.mouse.wheel(0, 500);
    await page.waitForFunction(() => book.tx > 7 && book.moved, null, { timeout: 20000 });
    const afterWheel = await page.evaluate(() => book.tx);
    await page.keyboard.press('ArrowRight');
    assert.ok(await page.evaluate(t => book.tx > t, afterWheel), 'the arrow keys ride on');
    const afterKey = await page.evaluate(() => book.tx);
    await page.mouse.move(cx, cy); await page.mouse.down(); await page.mouse.move(cx - 90, cy, { steps: 3 }); await page.mouse.up();
    assert.ok(await page.evaluate(t => book.tx > t, afterKey), 'dragging the page rides on');
    assert.strictEqual(await page.evaluate(() => gate || view), null, 'a drag does not leave the notebook');
    // Round the loop to the start again: everything should come back around.
    await page.evaluate(() => { book.x = book.tx = BOOK_LOOP + 15; });
    await page.waitForFunction(() => { const p = bookWorld.props.find(n => n.name === 'about'); return p.mesh.visible && Math.abs(p.mesh.position.x - (BOOK_LOOP + 15)) < 1; }, null, { timeout: 30000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${name}-i-looped.png` });
    const notePoint = await page.evaluate(() => { for (let y = 20; y < H; y += 12) for (let x = 20; x < W; x += 12) { const p = bookPick(x, y); if (p && p.name === 'about') return [x, y]; } return null; });
    assert.ok(notePoint, 'the note can be picked somewhere on screen');
    await page.mouse.click(...notePoint);
    await page.waitForTimeout(100);
    assert.strictEqual(await page.evaluate(() => book.say && book.say.prop && book.say.prop.name), 'about', 'clicking a drawing makes it speak');
    await page.click('#back');
    assert.strictEqual(await page.evaluate(() => [book, gate, view, focus && focus.t].join()), ',,,Field Notes', 'back leaves the notebook for the selected card');
    assert.strictEqual(await page.evaluate(() => $('#btn-talk').hidden), false, 'stickers come back');
    await page.evaluate(() => clearFocus());
    await page.waitForFunction(() => !focus, null, { timeout: 60000 });

    // Touch: real swipes change card, and sideways on Stories changes picture.
    if (device) {
      const cdp = await context.newCDPSession(page);
      const swipe = async (dx, dy) => {
        const at = (x, y) => [{ x: cx + x, y: cy + y }];
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: at(0, 0) });
        for (let i = 1; i <= 4; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: at(dx * i / 4, dy * i / 4) });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await page.waitForTimeout(150);
      };
      await page.evaluate(() => setFocus(projects[0]));
      await page.waitForFunction(() => popAt > 0 && zoomNow > .98, null, { timeout: 60000 });
      await page.waitForTimeout(2500); // the burst clears and the hint fades in
      await page.screenshot({ path: `${name}-6-focus.png` });
      await swipe(-120, 0);
      assert.strictEqual(await page.evaluate(() => focus.t), 'Field Notes', 'swipe left moves to the next card');
      await swipe(120, 0);
      assert.strictEqual(await page.evaluate(() => focus.t), 'Works', 'swipe right moves back');
      await page.evaluate(() => setFocus(stories));
      const picture = await page.evaluate(() => storyIndex);
      await swipe(-120, 0);
      assert.strictEqual(await page.evaluate(() => focus.t), 'Stories', 'sideways swipe stays on Stories');
      assert.notStrictEqual(await page.evaluate(() => storyIndex), picture, 'sideways swipe turns the picture');
      await swipe(0, -120);
      assert.strictEqual(await page.evaluate(() => focus.t), 'Works', 'swipe up leaves Stories');
      await page.evaluate(() => clearFocus());
      await page.waitForFunction(() => !focus, null, { timeout: 60000 });
      await swipe(-120, 0);
      assert.strictEqual(await page.evaluate(() => focus), null, 'a swipe on the whole board only tugs it');
      await page.waitForFunction(() => pan.x === 0 && pan.y === 0, null, { timeout: 60000 });
      assert.ok(await page.evaluate(() => $('#back').getBoundingClientRect().height >= 44), 'back button is a full finger target');
      await page.waitForTimeout(2500); // the tear from the tug settles
      await page.screenshot({ path: `${name}-5-inside.png` });
    }

    // The dialogs fit their width, whatever the screen, and More about me leaves out the controls.
    for (const id of ['about', 'contact']) {
      assert.deepStrictEqual(await page.evaluate(i => { const d = $('#' + i); d.showModal(); const r = [d.scrollWidth > d.clientWidth, d.getBoundingClientRect().right > innerWidth]; return r; }, id), [false, false], `#${id} has no sideways scroll`);
      await page.screenshot({ path: `${name}-r-${id}.png` });
      await page.evaluate(i => $('#' + i).close(), id);
    }
    assert.strictEqual(await page.evaluate(() => { worksAbout(); const hidden = getComputedStyle($('.keys')).display; $('#about').close(); return hidden; }), 'none', 'More about me hides the controls');
    await page.waitForFunction(() => !$('#about').classList.contains('no-keys'), null, { timeout: 5000 }); // the close event fires a moment later
    // Stickers open dialogs, and Escape closes the dialog only.
    await page.click('#btn-talk');
    await page.waitForTimeout(150);
    await page.keyboard.press('Escape');
    assert.strictEqual(await page.evaluate(() => mode), 'inside');
    assert.strictEqual(await page.evaluate(() => !!document.querySelector('dialog[open]')), false);

    // Fly back out.
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => mode === 'room', null, { timeout: 60000 });
    await page.waitForTimeout(1500);
    assert.strictEqual(await page.evaluate(() => !crt.classList.contains('full') && !room.hidden), true);
    await page.screenshot({ path: `${name}-8-back.png` });

    assert.deepStrictEqual(errors, []);
    console.log(name, 'ok');
    await context.close();
  }
  await browser.close();
  server.close();
})().catch(e => { console.error(e); process.exit(1); });

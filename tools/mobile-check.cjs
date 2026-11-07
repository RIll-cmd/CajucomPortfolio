// Run: node tools/mobile-check.cjs (install playwright-core and Chrome/Edge first).
// Screenshots and diagnostics stay in the ignored .check-tmp directory.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require('../.check-tmp/node_modules/playwright-core')); }
const root = path.resolve(__dirname, '..'), out = path.join(root, '.check-tmp');
fs.mkdirSync(out, { recursive: true });
const types = { '.html': 'text/html', '.svg': 'image/svg+xml', '.js': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(req.url.split('?')[0]);
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
const seed = page => page.addInitScript(() => localStorage.setItem('cc-seen', JSON.stringify({ room: 1, board: 1, 'box-resume': 1, 'box-works': 1, 'box-tome': 1, 'box-book': 1 })));
const shot = (page, name) => page.screenshot({ path: path.join(out, name + '.png') });
async function checkBack(page, closed) {
  await page.locator('#back').waitFor({ state: 'visible' });
  const boxes = await page.evaluate(() => ['back', 'sound', 'help'].filter(id => !document.getElementById(id).hidden).map(id => {
    const r = document.getElementById(id).getBoundingClientRect(); return { id, x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom };
  }));
  const { width, height } = page.viewportSize();
  for (const b of boxes) assert.ok(b.x >= 0 && b.y >= 0 && b.right <= width && b.bottom <= height && b.h >= 44, `control fits: ${JSON.stringify(b)}`);
  for (let i = 1; i < boxes.length; i++) for (let j = 0; j < i; j++) {
    const a = boxes[i], b = boxes[j]; assert.ok(a.right <= b.x || b.right <= a.x || a.bottom <= b.y || b.bottom <= a.y, `controls overlap: ${a.id}, ${b.id}`);
  }
  await page.locator('#back').click();
  await page.waitForFunction(closed);
}
(async () => {
  await new Promise(r => server.listen(0, r));
  const browser = await chromium.launch({ channel: process.env.TEST_BROWSER || 'chrome', args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
  try {
    for (const [name, width, height, mobile] of [['phone', 390, 700, true], ['small', 360, 640, true], ['compact', 320, 568, true], ['landscape', 844, 390, true], ['short-landscape', 568, 320, true], ['desktop', 1440, 860, false]]) {
      if (process.env.TEST_SIZE && process.env.TEST_SIZE !== name) continue;
      const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 3 : 1 });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await seed(page);
      // Exercise the actual production failure: a room asset fails, and a private photo is absent.
      await page.route('**/models/Television_01/Television_01.json', r => r.abort());
      await page.route('**/photos/me-barong.jpg', r => r.fulfill({ status: 404, body: '' }));
      await page.goto(`http://localhost:${server.address().port}/`);
      await page.waitForFunction(() => typeof resumeLayout === 'function' && !document.querySelector('[data-retry]').hidden);
      assert.equal(await page.evaluate(() => mode), 'room', 'failed room waits for the visitor rather than jumping ahead');
      await shot(page, name + '-loading');
      await page.locator('#load-skip').click();
      await page.waitForFunction(() => mode === 'inside');
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => {
        const bad = [], fill = g.fillText;
        // Record drawn text using the real canvas metrics, after all fonts have settled.
        g.fillText = function (s, x, y, ...args) {
          const tw = g.measureText(s).width, left = g.textAlign === 'center' ? x - tw / 2 : g.textAlign === 'right' ? x - tw : x;
          if (y >= 0 && y < H && x > 0 && x < W && (left < 10 || left + tw > W - 10)) bad.push(String(s));
          return fill.call(this, s, x, y, ...args);
        };
        for (const it of WORKS_WORDS.items) {
          openProject(it, false, true); view.p = 1; drawProject();
          for (let n = 0; n < view.parts; n++) { view.scroll = n * H; drawProject(); }
          closeProject();
        }
        g.fillText = fill; return bad;
      });
      assert.deepEqual(overflow, [], name + ': project text stays within the screen');
      await page.evaluate(() => { openWorks(projects[0]); works.page = 1; works.y = H; works.arrive = works.at = performance.now() - 10000; });
      const about = await page.evaluate(() => ({ bottom: works.about.pillY, size: works.about.size, maxX: Math.max(...works.about.words.map(w => w.x + w.w)) }));
      assert.ok(about.maxX <= width - 12, name + ': about text wraps');
      if (mobile) assert.ok(about.bottom + about.size * 1.6 < height * .98, name + ': about button fits below the words');
      await page.waitForFunction(() => WORKS_WATER_FRAMES.some(im => im.complete && im.naturalWidth));
      const characterDraws = await page.evaluate(() => {
        const original = g.drawImage; let count = 0;
        g.drawImage = function (im, ...args) {
          if ((works.charSheet && im === works.charSheet) || (WORKS_WATER_FRAMES.includes(im) && args[0] === 0)) count++;
          return original.call(this, im, ...args);
        };
        try { worksDrawWater(0, 1); } finally { g.drawImage = original; }
        return count;
      });
      assert.ok(mobile ? characterDraws === 0 : characterDraws > 0, name + ': water figure is hidden only on phones');
      await shot(page, name + '-about');
      await checkBack(page, () => !works);
      await page.evaluate(() => { openProject(WORKS_WORDS.items.find(i => /Hub/.test(i.t)), false, true); view.p = 1; drawProject(); view.scroll = view.target = Math.max(0, view.parts - 6) * H; });
      await shot(page, name + '-case-study');
      await checkBack(page, () => !view);
      await page.evaluate(() => { openResume(hero); resume.phase = 'read'; resume.from = null; resume.fadeAt = -1e9; resume.y = resume.ty = 0; resumeLayout(); });
      const resumeFit = await page.evaluate(() => {
        const L = resumeLayout(), bad = [];
        for (const b of L.blocks) for (const it of [...b.items, ...(b.body || [])]) { g.font = it.font; if (it.x < 0 || it.x + g.measureText(it.t).width > W - 10) bad.push(it.t); }
        return { bad, privatePhoto: L.blocks.flatMap(b => b.pics).some(p => p.img === 'barong') };
      });
      assert.deepEqual(resumeFit.bad, [], name + ': résumé text fits');
      assert.equal(resumeFit.privatePhoto, false, name + ': missing portrait reserves no empty space');
      if (mobile) assert.ok(await page.evaluate(() => {
        const L = resumeLayout();
        return L.secs.every(sec => sec.h <= L.readBottom - L.readTop || sec.padTop + sec.h - sec.span <= L.readBottom + 1);
      }), name + ': every section can scroll its final line into the reading area');
      await page.evaluate(() => { const L = resumeLayout(); resume.y = resume.ty = L.stops.find(s => s.name === 'Education').y; });
      await page.waitForTimeout(200);
      await shot(page, name + '-education');
      await page.evaluate(() => { const L = resumeLayout(); resume.y = resume.ty = L.stops.find(s => s.name === 'Skills').y; });
      await page.waitForTimeout(200);
      await shot(page, name + '-skills');
      await checkBack(page, () => !resume);
      const bookFit = await page.evaluate(() => {
        tome = { layout: null }; const l = tomeLayout();
        const result = { card: l.cardY + l.cardH <= (l.short ? H : l.navY), free: l.free.h, nav: l.navY + l.navH <= H, cardH: l.cardH, size: l.size };
        tome = null; return result;
      });
      assert.ok(bookFit.card && bookFit.free > 60 && bookFit.nav, name + ': Experiences card, scene, and navigation fit ' + JSON.stringify(bookFit));
      assert.deepEqual(errors, [], name + ': no browser errors');
      console.log(name + ': PASS (fallback navigation, project text, résumé, about, book layout)');
      await context.close();
    }
    if (process.env.TEST_LAYOUT_ONLY) return;
    // Normal mobile startup: progress, actual room, and the flight all remain usable.
    const context = await browser.newContext({ viewport: { width: 390, height: 700 }, isMobile: true, hasTouch: true });
    const page = await context.newPage(), errors = [], waterRequests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => { if (/photos\/water\//.test(r.url())) waterRequests.push(r.url()); });
    await seed(page);
    await page.goto(`http://localhost:${server.address().port}/`);
    await page.waitForFunction(() => roomReady, null, { timeout: 120000 });
    assert.equal(await page.locator('#load-progress').inputValue().catch(() => page.locator('#load-progress').getAttribute('value')), '100');
    assert.deepEqual(waterRequests, [], 'underwater frames are deferred until Projects opens');
    await page.waitForTimeout(800);
    await shot(page, 'phone-room');
    await page.evaluate(() => { enter(); dive.t0 -= 5000; dive.last = performance.now() - 5000; });
    await page.waitForTimeout(80);
    assert.equal(await page.evaluate(() => mode), 'dive', 'a stalled phone still sees the flight');
    await page.waitForFunction(() => mode === 'inside', null, { timeout: 60000 });
    await page.evaluate(() => openTome(projects[2]));
    await page.waitForFunction(() => tome && tome.phase === 'read' && !tome.from && !tome.turn, null, { timeout: 180000 });
    await shot(page, 'phone-experiences');
    await checkBack(page, () => !tome);
    assert.deepEqual(errors, [], 'normal room and book have no browser errors');
    await context.close();
    console.log('mobile startup: PASS (progress, lazy assets, slow-frame flight, actual Experiences navigation)');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

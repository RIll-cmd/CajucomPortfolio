// Phone interaction and rotation regressions. Run with playwright-core and Chrome installed.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http');
let chromium; try { ({ chromium } = require('playwright-core')); } catch { ({ chromium } = require('../.check-tmp/node_modules/playwright-core')); }
const root = path.resolve(__dirname, '..'), out = path.join(root, '.check-tmp');
fs.mkdirSync(out, { recursive: true });
const types = { '.html': 'text/html', '.svg': 'image/svg+xml', '.js': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(req.url.split('?')[0]), f = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!f.startsWith(root + path.sep) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(res);
});
const snap = (page, name) => page.screenshot({ path: path.join(out, `journey-${name}.png`) });
async function viewport(page, width, height) {
  await page.setViewportSize({ width, height });
  await page.waitForFunction(([w, h]) => W === w && H === h, [width, height]);
}
async function buttonFits(page, locator) {
  const b = await locator.boundingBox(), { width, height } = page.viewportSize();
  assert.ok(b && b.width >= 44 && b.height >= 44 && b.x >= 0 && b.y >= 0 && b.x + b.width <= width + 1 && b.y + b.height <= height + 1, '44px control fits: ' + JSON.stringify(b));
}
(async () => {
  await new Promise(r => server.listen(0, r));
  const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
  try {
    for (const [width, height] of [[390, 700], [320, 568], [568, 320], [844, 390]]) {
      if (process.env.TEST_SIZE && process.env.TEST_SIZE !== `${width}x${height}`) continue;
      const context = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(() => localStorage.setItem('cc-seen', JSON.stringify({ room: 1, board: 1, 'box-works': 1, 'box-book': 1, 'box-resume': 1, 'box-tome': 1 })));
      await page.route('**/models/Television_01/Television_01.json', r => r.abort());
      // The compact phone also exercises missing web fonts.
      if (width === 320) await page.route('**/fonts.googleapis.com/**', r => r.abort());
      await page.goto(`http://localhost:${server.address().port}/`);
      await page.locator('#load-skip').click(); await page.waitForFunction(() => mode === 'inside' && typeof mobileLayout === 'function');
      await page.evaluate(() => document.fonts.ready);
      assert.ok(await page.evaluate(() => Object.keys(soundBufs).filter(name => SOUND_FX.includes(name)).length <= 12), 'phone startup does not fetch every sound effect');
      assert.deepEqual(await page.evaluate(() => renderer.getSize(new THREE.Vector2()).toArray()), [width, height], 'fallback sizes the 3D canvas for later sections');

      await page.evaluate(() => openWorks(projects[0]));
      const next = page.locator('#phone-nav [data-next]'); await next.waitFor({ state: 'visible' });
      await buttonFits(page, next); await buttonFits(page, page.locator('#phone-nav .phone-status'));
      await next.tap(); await page.waitForFunction(() => works.page === 1);
      assert.ok(await page.evaluate(() => works.about.pillY + Math.max(16, works.pillSize) * 1.25 + 8 < document.querySelector('#phone-nav').getBoundingClientRect().top - 4), 'About button clears bottom navigation');
      await next.focus(); await page.keyboard.press('Enter'); await page.waitForFunction(() => works.page === 2);
      assert.equal(await page.evaluate(() => works.page), 2, 'native Enter advances once');
      await page.locator('#phone-filters').waitFor({ state: 'visible' });
      for (const b of await page.locator('#phone-filters button').all()) assert.ok((await b.boundingBox()).height >= 44, 'filter has a full touch target');
      await page.locator('#phone-filters button').filter({ hasText: /^Thesis$/ }).tap();
      assert.equal(await page.evaluate(() => works.filter), 'Thesis');
      assert.deepEqual(await page.evaluate(() => {
        works.y = works.page * H; works.arrive = works.at = performance.now() - 20000;
        const boundary = document.querySelector('#phone-filters').getBoundingClientRect().top, original = g.fillText, covered = [];
        g.fillText = function(s, x, y, ...args) {
          if (String(s).length > 1 && g.globalAlpha > .95) {
            const metrics = g.measureText(s), p = new DOMPoint(x, y + (metrics.actualBoundingBoxDescent || 0)).matrixTransform(g.getTransform()), [, cy] = toClient(p.x / pr, p.y / pr);
            if (cy > boundary - 4 && cy < H) covered.push(String(s));
          }
          return original.call(this, s, x, y, ...args);
        };
        try { drawScene(); } finally { g.fillText = original; }
        return covered;
      }), [], 'portfolio copy is above the native filters');
      await snap(page, `${width}-${height}-filters`);

      await page.locator('#phone-nav .phone-status').tap();
      await page.locator('#phone-jump button').filter({ hasText: /^Contact$/ }).tap();
      await page.waitForFunction(() => works.pages[works.page].kind === 'talk');
      await page.evaluate(() => { works.y = works.page * H; works.arrive = works.at = performance.now() - 20000; drawScene(); });
      await page.locator('#phone-socials').waitFor({ state: 'visible' });
      const footer = await page.locator('#phone-socials a').evaluateAll(links => links.map(a => {
        const r = a.getBoundingClientRect(); return { label: a.getAttribute('aria-label'), x:r.x, y:r.y, right:r.right, bottom:r.bottom, width:r.width };
      }));
      assert.equal(footer.length, 5, 'all five social links are present');
      const navTop = (await page.locator('#phone-nav').boundingBox()).y;
      for (const b of footer) assert.ok(b.x >= 8 && b.right <= width - 8 && b.y >= 60 && b.bottom < navTop && b.width >=44 && b.bottom - b.y >= 44, 'footer link stays clear of the nav: ' + JSON.stringify(b));
      await snap(page, `${width}-${height}-footer`);
      await page.locator('#back').tap(); await page.waitForFunction(() => !works);

      await page.evaluate(() => openWorks(projects[0])); await next.waitFor({ state: 'visible' });
      const touch = await context.newCDPSession(page);
      await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: width / 2, y: height / 2 }] });
      await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: width / 2, y: height / 2 - 100 }] });
      await touch.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
      assert.deepEqual(await page.evaluate(() => [works.page, works.pull, drag]), [0, 0, null], 'cancelled swipe never navigates');
      await touch.detach();
      await page.evaluate(() => { worksOpenItem(WORKS_WORDS.items[0]); drawScene(); });
      await page.waitForFunction(() => mobileNavContext()?.kind === 'project');
      const media = await page.evaluate(() => { const index = view.partKeys.findIndex(p => p.key.startsWith('media:')); view.scroll = view.target = index * H; drawScene(); return view.partKeys[index].key; });
      await page.waitForFunction(() => view.zoomHot.length > 0);
      assert.ok(await page.evaluate(() => view.zoomHot.every(h => { const [x, y] = toClient(h.x, h.y), [right, bottom] = toClient(h.x + h.w, h.y + h.h); return y >= 60 && bottom <= H - 74; })), 'project media clears the phone controls');
      await viewport(page, height, width); await page.evaluate(() => drawScene());
      assert.equal(await page.evaluate(() => view.partKeys[Math.round(view.target / H)].key), media, 'rotation preserves the same project media');
      await viewport(page, width, height); await page.evaluate(() => { drawScene(); view.scroll = view.target = 0; });
      await next.tap(); assert.equal(await page.evaluate(() => view.target), height, 'project next button moves one screen');
      await page.locator('#phone-nav .phone-status').tap();
      await page.locator('#phone-jump .phone-choices button').last().tap();
      assert.equal(await page.evaluate(() => view.target === view.max), true, 'project jump reaches the end');
      await page.locator('#back').tap(); await page.waitForFunction(() => !view);
      await page.locator('#back').tap(); await page.waitForFunction(() => !works);

      await page.evaluate(() => openResume(hero)); await page.locator('#phone-action').waitFor({ state: 'visible' });
      await buttonFits(page, page.locator('#phone-action')); await page.locator('#phone-action').tap();
      await page.waitForFunction(() => resume?.phase === 'read');
      await page.evaluate(() => { const L = resumeLayout(); resume.y = resume.ty = L.secs.find(s => s.name === 'Skills').slotY; resume.melt = null; drawScene(); });
      assert.equal(await page.evaluate(() => resume.section), 'Skills');
      await viewport(page, height, width);
      assert.equal(await page.evaluate(() => resume.section), 'Skills', 'rotation preserves the reading section');
      assert.ok(await page.evaluate(() => { const L = resumeLayout(), sec = L.secs.find(s => s.name === 'Skills'); return resume.ty >= sec.slotY && resume.ty <= sec.slotY + sec.span + 1; }), 'rotation preserves a valid scroll position');
      await viewport(page, width, height); await snap(page, `${width}-${height}-resume`);
      await page.locator('#back').tap(); await page.waitForFunction(() => !resume);

      await page.evaluate(() => zoomPicture('photos/me-jacket.jpg', 'A long photo caption must remain readable and scroll within the phone, while its Close button stays accessible. '.repeat(4)));
      const zoom = await page.locator('#zoom').boundingBox();
      assert.ok(zoom.y >= 0 && zoom.y + zoom.height <= height + 1 && zoom.x >= 0 && zoom.x + zoom.width <= width + 1, 'photo viewer stays within the viewport');
      await buttonFits(page, page.locator('#zoom .phone-close'));
      await page.locator('#zoom p').tap(); assert.equal(await page.locator('#zoom').evaluate(d => d.open), true, 'tapping the caption does not dismiss the photo');
      await page.locator('#zoom').evaluate(d => { d.scrollTop = d.scrollHeight; });
      await buttonFits(page, page.locator('#zoom .phone-close'));
      await snap(page, `${width}-${height}-photo`); await page.locator('#zoom .phone-close').tap();
      await page.evaluate(() => tourStart()); await page.waitForFunction(() => tour?.placed);
      const coach = await page.locator('#coach .card').boundingBox();
      assert.ok(coach.y >= 0 && coach.y + coach.height <= height + 1, 'first-visit guide fits short landscape screens');
      await page.locator('#coach [data-skip]').scrollIntoViewIfNeeded(); await page.locator('#coach [data-skip]').tap();
      assert.deepEqual(errors, [], `${width}x${height}: no browser errors`);
      console.log(`${width}x${height}: PASS (tap navigation, filters, footer, cancelled touch, rotation, photos, tour)`);

      if (width === 390) {
        await page.evaluate(() => openTome(projects[2]));
        await page.waitForFunction(() => tome?.phase === 'read' && !tome.from && !tome.turn, null, { timeout: 180000 });
        const point = await page.evaluate(() => { const b = tome.cardBox; return toClient(b.x + b.w / 2, b.y + b.h / 2); });
        await page.touchscreen.tap(...point); await page.locator('#phone-reader').waitFor({ state: 'visible' });
        assert.equal(await page.locator('#phone-reader h2').textContent(), 'Summary');
        assert.ok(await page.locator('#phone-reader p').first().evaluate(p => parseFloat(getComputedStyle(p).fontSize)) >= 14);
        await page.locator('#phone-reader [aria-label="Next page"]').tap();
        assert.equal(await page.locator('#phone-reader h2').textContent(), 'Experience');
        const experienceBullets = await page.evaluate(() => TOME_WORDS.chapters.find(c => c.name === 'Experience').entries.reduce((n, e) => n + (Array.isArray(e.d) ? e.d.length : 0), 0));
        assert.equal(await page.locator('#phone-reader li').count(), experienceBullets, 'reading view contains the complete experience');
        await page.locator('#phone-reader').evaluate(d => { d.scrollTop = d.scrollHeight; });
        await buttonFits(page, page.locator('#phone-reader [aria-label="Close reading view"]'));
        await buttonFits(page, page.locator('#phone-reader [aria-label="Next page"]'));
        await page.locator('#phone-reader').evaluate(d => { d.scrollTop = 0; });
        await snap(page, 'readable-experience');
        await page.evaluate(() => mobileReadChapter(TOME_PAGES.findIndex(p => p.name === 'Skills' && p.entries.some(e => e.pills.includes('Python')))));
        await page.locator('#phone-reader button').filter({ hasText: /^Python ↗$/ }).tap();
        const project = page.locator('#phone-reader .phone-choices .phone-choices:not([hidden]) button').first();
        const projectName = await project.textContent(); await project.tap();
        await page.waitForFunction(() => !!view); assert.equal(await page.evaluate(() => view.c.t), projectName, 'a readable skill opens its linked project');
        await page.locator('#back').tap(); await page.waitForFunction(() => !view); await page.locator('#back').tap(); await page.waitForFunction(() => !works);
        await page.evaluate(() => openBook(projects[1]));
        await page.waitForFunction(() => book?.phase === 'ride' && !book.from, null, { timeout: 180000 });
        const oldTarget = await page.evaluate(() => book.tx); await next.tap(); assert.notEqual(await page.evaluate(() => book.tx), oldTarget, 'notebook arrows ride to another world');
        await page.evaluate(() => { book.x = book.tx; });
        await page.waitForFunction(() => book.world === 1);
        await snap(page, 'notebook-food');
        await viewport(page, 568, 320);
        await page.evaluate(() => { book.say = { cat: true, text: BOOK_WORDS.hello[0], at: performance.now() - 1000 }; drawScene(); });
        const map = await page.evaluate(() => book.mapHot.map(m => toClient(m.x, m.y - m.r)));
        assert.ok(map.every(([, y]) => y >= 54), 'notebook map clears the top toolbar in landscape');
        await snap(page, 'notebook-landscape');
        await page.evaluate(() => mobileReadNote('about', BOOK_WORDS.about.join('\n')));
        assert.equal(await page.locator('#phone-reader h2').textContent(), 'About me');
        await page.locator('#phone-reader [aria-label="Close reading view"]').tap();
        await page.locator('#back').tap(); await page.waitForFunction(() => !book);
        assert.deepEqual(errors, [], '3D reading and notebook journeys have no browser errors');
        console.log('PASS (readable Experiences, skill links, notebook controls and notes)');
      }
      await context.close();
    }
    const fallback = await browser.newContext({ viewport: { width: 390, height: 700 }, isMobile: true, hasTouch: true });
    const page = await fallback.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, ...args) { return /webgl/i.test(type) ? null : original.call(this, type, ...args); };
      localStorage.setItem('cc-seen', JSON.stringify({ room: 1, board: 1, 'box-works': 1, 'box-book': 1, 'box-resume': 1, 'box-tome': 1 }));
    });
    await page.goto(`http://localhost:${server.address().port}/`); await page.locator('#load-skip').click();
    await page.evaluate(() => openTome(projects[2]));
    await page.locator('#phone-reader').waitFor({ state: 'visible', timeout: 5000 });
    assert.equal(await page.locator('#phone-reader h2').textContent(), 'Summary', 'a phone without WebGL can read Experiences');
    await page.locator('#phone-reader [aria-label="Close reading view"]').tap();
    await page.evaluate(() => openBook(projects[1]));
    await page.locator('#phone-reader').waitFor({ state: 'visible' });
    assert.ok((await page.locator('#phone-reader').textContent()).includes('Forever meal: Katsu'), 'the complete notebook remains available without WebGL');
    await page.locator('#phone-reader [aria-label="Close reading view"]').tap();
    assert.deepEqual(errors, [], 'graphics fallback has no runtime errors');
    await fallback.close(); console.log('PASS (complete Experiences and notebook without WebGL)');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

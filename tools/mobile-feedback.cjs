// Regression checks for footer links, compact notebook music, and chapter shortcuts.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http');
let chromium; try { ({chromium} = require('playwright-core')); } catch { ({chromium} = require('../.check-tmp/node_modules/playwright-core')); }
const root = path.resolve(__dirname, '..'), out = path.join(root, '.check-tmp'); fs.mkdirSync(out, {recursive:true});
const types = {'.html':'text/html','.js':'text/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.json':'application/json','.wasm':'application/wasm','.mp3':'audio/mpeg'};
const server = http.createServer((req,res) => {
  const name=decodeURIComponent(req.url.split('?')[0]), f=path.resolve(root,'.'+(name==='/'?'/index.html':name));
  if (!f.startsWith(root+path.sep)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);
});
const screenshot = (p,name) => p.screenshot({path:path.join(out,'feedback-'+name+'.png')});
(async()=>{
 await new Promise(r=>server.listen(0,r));
 const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader','--use-angle=swiftshader','--ignore-gpu-blocklist']});
 try {
  const context=await browser.newContext({viewport:{width:390,height:700},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  const page=await context.newPage(), errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem('cc-seen',JSON.stringify({room:1,board:1,'box-works':1,'box-book':1,'box-tome':1})));
  await page.route('**/models/Television_01/Television_01.json',r=>r.abort());
  await page.route('https://www.youtube-nocookie.com/embed/**',r=>r.fulfill({contentType:'text/html',body:`<script>const say=s=>parent.postMessage(JSON.stringify({event:'infoDelivery',info:{playerState:s}}),'*');addEventListener('message',e=>{try{const d=JSON.parse(e.data);if(d.func==='pauseVideo')say(2);else say(1);}catch{}});setTimeout(()=>say(1),100);<\/script>`}));
  await page.goto(`http://localhost:${server.address().port}/`);await page.locator('#load-skip').click();await page.waitForFunction(()=>typeof mobileLayout==='function'&&mode==='inside');
  for(const [w,h] of [[390,700],[320,568],[568,320],[480,828]]){
   await page.setViewportSize({width:w,height:h});await page.waitForFunction(([w,h])=>W===w&&H===h,[w,h]);
   await page.evaluate(()=>{openWorks(projects[0]);worksJump(works.pages.length-1);works.arrive=works.at=performance.now()-20000;});
   await page.locator('#phone-socials').waitFor({state:'visible',timeout:5000});
   const links=page.locator('#phone-socials a');assert.equal(await links.count(),5);
   const bounds=[];for(const link of await links.all()){
    const b=await link.boundingBox();assert.ok(b.width>=44&&b.height>=44&&b.x>=12&&b.x+b.width<=w-12,'footer anchor fits');bounds.push(b);
    const im=link.locator('img');assert.ok(await im.evaluate(i=>i.complete&&i.naturalWidth>0),'clean SVG icon loads');assert.ok(await link.getAttribute('aria-label'));
   }
   for(let i=1;i<bounds.length;i++)assert.ok(bounds[i].x>=bounds[i-1].x+bounds[i-1].width,'footer links do not overlap');
   assert.ok(bounds.every(b=>b.y+b.height<h-75),'footer clears pager');await screenshot(page,`${w}-${h}-footer`);
   await page.locator('#back').tap();await page.waitForFunction(()=>!works);
  }
  await page.setViewportSize({width:390,height:700});await page.waitForFunction(()=>W===390&&H===700);
  const introPages = await page.evaluate(()=>{openWorks(projects[0]);worksOpenItem(WORKS_WORDS.items.find(it=>it.t==='Image Relevance Engine'));view.p=1;drawScene();return view.partInfo.map((name,i)=>name==='Introduction'?i:-1).filter(i=>i>=0);});
  let reachableLinks=0;
  for (const i of introPages) {
    await page.evaluate(i=>{view.scroll=view.target=i*H;drawScene();},i);await page.waitForTimeout(250);
    if(await page.locator('#links').isVisible()){const link=await page.locator('#links').boundingBox(),nav=await page.locator('#phone-nav').boundingBox();assert.ok(link.y+link.height<nav.y-4,'project links clear the pager');reachableLinks++;}
    await screenshot(page,`project-intro-${i+1}`);
  }
  assert.ok(reachableLinks>0,'the project repository link remains reachable');
  await page.evaluate(()=>{closeProject();closeWorks();});
  await page.evaluate(()=>openBook(projects[1]));await page.waitForFunction(()=>book?.phase==='ride'&&!book.from,null,{timeout:180000});
  await page.evaluate(()=>{book.tx=book.x=BOOK_SIZE*2+BOOK_SIZE*.45;book.world=2;songCardSync();});
  await page.locator('#song').waitFor({state:'visible'});
  assert.ok((await page.locator('#song').boundingBox()).height<=76,'idle player is compact');
  await page.locator('#song .song-play').tap();await page.waitForFunction(()=>!!songFrame&&songHeard);
  assert.ok((await page.locator('#song').boundingBox()).height<=76,'playing player stays compact');
  assert.equal(await page.locator('#song .song-play').getAttribute('aria-pressed'),'true');
  await screenshot(page,'music-compact');
  await page.locator('#song .song-play').tap();await page.waitForFunction(()=>!songOn);
  await page.locator('#song .song-expand').tap();assert.ok((await page.locator('#song').boundingBox()).height>100,'video expands only when asked');
  await page.locator('#song .song-expand').tap();assert.ok((await page.locator('#song').boundingBox()).height<=76,'video minimizes');
  await page.locator('#back').tap();await page.waitForFunction(()=>!book);assert.equal(await page.locator('#song').isVisible(),false);
  await page.evaluate(()=>openTome(projects[2]));await page.waitForFunction(()=>tome?.phase==='read'&&!tome.from&&!tome.turn,null,{timeout:180000});
  await page.locator('#phone-nav .phone-status').tap();await page.locator('#phone-jump button').filter({hasText:/^Skills · Web and tools$/}).tap();
  await page.waitForFunction(()=>TOME_PAGES[tome.at].name==='Skills'&&!tome.turn,null,{timeout:60000});assert.equal(await page.evaluate(()=>TOME_PAGES[tome.at].label),'Web and tools');
  await page.locator('#phone-nav .phone-status').tap();await page.locator('#phone-jump button').filter({hasText:/^Education$/}).tap();
  await page.waitForFunction(()=>TOME_PAGES[tome.at].name==='Education'&&!tome.turn,null,{timeout:60000});await screenshot(page,'chapters');
  await page.evaluate(()=>mobileReadChapter());await page.locator('#phone-reader select').selectOption({label:'Experience'});assert.equal(await page.locator('#phone-reader h2').textContent(),'Experience');
  await page.locator('#phone-reader [aria-label="Close reading view"]').tap();await page.locator('#back').tap();assert.deepEqual(errors,[]);
  await context.close();console.log('PASS: four phone footer layouts, compact Play/Pause/video toggle, direct chapter jumps, reading dropdown.');
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});

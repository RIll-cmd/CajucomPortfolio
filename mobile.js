/* Phone controls and readable sheets. The desktop canvas layouts stay in their own files. */
function mobileLayout() { return (COARSE && W <= 900) || W < 600; }

function mobileCapturePosition() {
  if (!mobileLayout() || mode !== 'inside' || (W === innerWidth && H === innerHeight)) return null;
  const position = { height: H };
  if (view?.partKeys) position.project = view.partKeys[Math.round(view.target / H)];
  if (resume?.phase === 'read' && resume.L?.secs) {
    const sec = [...resume.L.secs].reverse().find(s => s.slotY <= resume.ty + 1) || resume.L.secs[0];
    position.resume = { name: sec.name, progress: sec.span ? Math.max(0, Math.min(1, (resume.ty - sec.slotY) / sec.span)) : 0 };
  }
  return position;
}
function mobileRestorePosition(position) {
  if (works && position.height) works.y = works.page * H;
  if (view && position.height) { const page = Math.round(view.target / position.height); view.scroll = view.target = page * H; view.restorePart = position.project || null; }
  if (position.resume && resume?.phase === 'read') {
    resume.L = null; resume.melt = null; resume.jump = resume.jumpSec = null;
    const L = resumeLayout(), sec = L.secs.find(s => s.name === position.resume.name);
    if (sec) { resume.y = resume.ty = sec.slotY + sec.span * position.resume.progress; resume.section = sec.name; }
  }
}

document.head.insertAdjacentHTML('beforeend', `<style>
#phone-nav, #phone-filters, #phone-action, #zoom .phone-close { display: none; }
@media (pointer: coarse) and (max-width: 900px), (max-width: 600px) {
  dialog { overscroll-behavior: contain; overflow-wrap: anywhere; }
  #phone-nav { display: grid; grid-template-columns: 48px minmax(0,1fr) 48px; gap: 8px; align-items: center; position: fixed; z-index: 11; left: max(16px, env(safe-area-inset-left)); right: max(16px, env(safe-area-inset-right)); bottom: calc(10px + env(safe-area-inset-bottom, 0px)); padding: 4px; border: 1px solid rgba(244,241,232,.65); border-radius: 12px; background: rgba(5,9,12,.94); box-shadow: 0 3px 16px #0006; }
  #phone-nav button, #phone-action { min-width: 44px; min-height: 44px; touch-action: manipulation; border: 1px solid #f4f1e866; border-radius: 8px; background: #17252a; color: #f4f1e8; font: 600 15px/1.2 var(--body); padding: 8px; cursor: pointer; }
  #phone-nav .phone-arrow { font: 30px/1 var(--mono); }
  #phone-nav .phone-status { border-color: transparent; background: transparent; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #phone-nav button:disabled { opacity: .35; cursor: default; }
  #phone-filters { display: flex; position: fixed; z-index: 11; left: 16px; right: 16px; bottom: calc(76px + env(safe-area-inset-bottom, 0px)); gap: 8px; overflow-x: auto; padding: 5px 2px; overscroll-behavior-x: contain; }
  #phone-filters button { flex: 1 0 auto; min-height: 44px; padding: 8px 16px; border: 1px solid #f4ecd8; border-radius: 24px; background: #14284b; color: #f4ecd8; font: 400 15px/1.2 Righteous, var(--body); touch-action: manipulation; }
  #phone-filters button[aria-pressed=true] { background: #3fc1b0; color: #10302d; }
  #phone-action { display: block; position: fixed; z-index: 11; bottom: calc(16px + env(safe-area-inset-bottom, 0px)); left: 50%; transform: translateX(-50%); max-width: calc(100% - 32px); background: #163d3a; padding: 12px 20px; }
  #phone-jump, #phone-reader { color: #10302d; background: #f4f7ef; border: 2px solid #8ca59b; max-height: calc(100dvh - 24px); padding: 16px; }
  #phone-jump h2, #phone-reader h2 { margin: 0 0 20px; font: 500 28px/1.2 'Playfair Display', Georgia, serif; color: #10302d; }
  #phone-reader h3 { margin: 24px 0 10px; font: 500 22px/1.25 'Playfair Display', Georgia, serif; }
  #phone-reader p, #phone-reader li { color: #24433d; font: 400 16px/1.65 var(--body); margin: 0 0 12px; }
  #phone-reader ul { padding-left: 24px; }
  #phone-reader a { color: #06685f; text-underline-offset: 3px; }
  #phone-jump .phone-choices, #phone-reader .phone-choices { display: grid; gap: 8px; }
  #phone-jump button, #phone-reader button, #phone-reader a.phone-link { box-sizing: border-box; display: block; min-width: 44px; min-height: 44px; padding: 10px 14px; border: 1px solid #7a9d91; border-radius: 8px; background: #fff; color: #10302d; font: 600 16px/1.4 var(--body); text-align: left; cursor: pointer; touch-action: manipulation; }
  #phone-jump button[aria-current=true] { background: #d2ebe1; }
  #phone-reader .phone-reader-tools { display: flex; gap: 8px; position: sticky; top: -16px; z-index: 1; justify-content: flex-end; padding: 8px 0; margin-bottom: 12px; background: #f4f7ef; }
  #phone-reader .phone-reader-tools button { text-align: center; }
  #phone-reader .phone-reader-tools button:disabled { opacity: .4; }
  #phone-reader img { display: block; max-width: 100%; max-height: 220px; object-fit: contain; margin: 10px auto; }
  #phone-reader .phone-meta { font-size: 14px; color: #4b655b; }
  #phone-reader :focus-visible, #phone-jump :focus-visible { outline-color: #087467; }
  #song { bottom: calc(82px + env(safe-area-inset-bottom, 0px)); max-height: calc(100dvh - 150px); overflow: hidden auto; overscroll-behavior: contain; touch-action: pan-y; }
  #phone-jump .phone-sheet-close { margin-top: 18px; margin-left: auto; }
  #zoom[open] { display: flex; flex-direction: column; align-items: center; box-sizing: border-box; inset: 12px; width: calc(100% - 24px); max-width: calc(100% - 24px); height: fit-content; max-height: calc(100dvh - 24px); margin: auto; padding: 62px 12px 16px; overflow: hidden auto; background: #0c1929f5; border-radius: 14px; cursor: default; }
  #zoom img, #zoom video { flex: 0 0 auto; box-sizing: border-box; max-width: 100%; max-height: calc(100dvh - 164px); object-fit: contain; }
  #zoom p { flex: 0 0 auto; width: 100%; font: 400 16px/1.5 var(--body); overflow-wrap: anywhere; }
  #zoom .phone-close { display: block; position: fixed; top: max(18px, calc(env(safe-area-inset-top, 0px) + 10px)); right: max(24px, calc(env(safe-area-inset-right, 0px) + 12px)); z-index: 3; min-width: 76px; min-height: 44px; padding: 10px 16px; border-radius: 8px; border: 1px solid #f4ecd8; background: #14284b; color: #f4ecd8; font: 600 16px/1.2 var(--body); }
  #zoom.many .zoom-nav { top: auto; bottom: 22px; margin-top: 0; width: 44px; height: 44px; }
  #zoom.many { padding-bottom: 68px; }
  #coach .card { max-height: calc(100dvh - 32px); overflow: hidden auto; overscroll-behavior: contain; }
}
</style>`);

const phoneNav = document.createElement('nav'); phoneNav.id = 'phone-nav'; phoneNav.hidden = true; phoneNav.setAttribute('aria-label', 'Section navigation');
phoneNav.innerHTML = '<button class="phone-arrow" type="button" data-prev aria-label="Previous section">‹</button><button class="phone-status" type="button" aria-haspopup="dialog"></button><button class="phone-arrow" type="button" data-next aria-label="Next section">›</button>';
const phoneFilters = document.createElement('div'); phoneFilters.id = 'phone-filters'; phoneFilters.hidden = true; phoneFilters.setAttribute('aria-label', 'Project filters');
for (const filter of WORKS_WORDS.filters) {
  const button = document.createElement('button'); button.type = 'button'; button.textContent = filter;
  button.addEventListener('click', () => { if (works) worksSetFilter(filter); }); phoneFilters.append(button);
}
const phoneAction = document.createElement('button'); phoneAction.id = 'phone-action'; phoneAction.type = 'button'; phoneAction.hidden = true;
const phoneJump = document.createElement('dialog'); phoneJump.id = 'phone-jump'; phoneJump.setAttribute('aria-labelledby', 'phone-jump-title');
const phoneReader = document.createElement('dialog'); phoneReader.id = 'phone-reader'; phoneReader.setAttribute('aria-labelledby', 'phone-reader-title');
document.body.append(phoneNav, phoneFilters, phoneAction, phoneJump, phoneReader);
const zoomClose = document.createElement('button'); zoomClose.className = 'phone-close'; zoomClose.type = 'button'; zoomClose.textContent = 'Close'; zoomClose.setAttribute('aria-label', 'Close picture or video');
zoomClose.addEventListener('click', e => { e.stopPropagation(); $('#zoom').close(); }); $('#zoom').append(zoomClose);

function mobileNavContext() {
  if (!mobileLayout() || mode !== 'inside') return null;
  if (view) return { kind: 'project', page: Math.round(view.target / H), count: view.parts || 1, title: view.c.t };
  if (works && !gate) return { kind: 'works', page: works.page, count: works.pages.length, title: works.pages[works.page]?.it?.t || ({ hero: 'Projects', about: 'Deep dive', portfolio: 'Browse projects', talk: 'Contact' }[works.pages[works.page]?.kind] || 'Projects') };
  if (book?.phase === 'ride') return { kind: 'book', page: Math.max(0, book.world), count: BOOK_WORDS.worlds.length, title: BOOK_WORDS.worlds[Math.max(0, book.world)] };
  if (!book && !tome && !resume && !gate && focus === stories && zoomGoal) return { kind: 'stories', page: storyIndex, count: STORIES.length, title: STORIES[storyIndex].name };
  return null;
}
function mobileMove(direction) {
  const c = mobileNavContext(); if (!c) return;
  if (c.kind === 'project') viewStep(direction);
  else if (c.kind === 'works') worksGo(c.page + direction);
  else if (c.kind === 'book') bookRideTo((c.page + direction + c.count) % c.count);
  else stepStory(direction);
}
phoneNav.querySelector('[data-prev]').addEventListener('click', () => mobileMove(-1));
phoneNav.querySelector('[data-next]').addEventListener('click', () => mobileMove(1));
phoneAction.addEventListener('click', () => {
  if (resume && resume.phase !== 'read') resumeRead();
  else if (gate) { const card = gate.c; closeGate(); openWorks(card); }
});
function phoneElement(tag, text, parent, attrs = {}) {
  const e = document.createElement(tag); if (text) e.textContent = text;
  for (const [key, value] of Object.entries(attrs)) e.setAttribute(key, value);
  if (parent) parent.append(e); return e;
}
function mobileOpenJump() {
  const c = mobileNavContext(); if (!c) return;
  phoneJump.replaceChildren(); phoneElement('h2', 'Go to…', phoneJump, { id: 'phone-jump-title' });
  const choices = phoneElement('div', '', phoneJump, { class: 'phone-choices' });
  let labels;
  if (c.kind === 'works') labels = works.pages.map(p => p.it?.t || ({ hero: 'Projects', about: 'Deep dive', portfolio: 'Browse projects', talk: 'Contact' }[p.kind]));
  else if (c.kind === 'book') labels = BOOK_WORDS.worlds;
  else if (c.kind === 'stories') labels = STORIES.map(s => s.name);
  else labels = (view.partInfo || []).map((p, i) => `${i + 1}. ${p}`);
  labels.forEach((label, i) => {
    const b = phoneElement('button', label, choices, { type: 'button', 'aria-current': String(i === c.page) });
    b.addEventListener('click', () => {
      if (c.kind === 'works' && works) worksJump(i);
      else if (c.kind === 'book' && book) bookRideTo(i);
      else if (c.kind === 'stories') stepStory(i - storyIndex);
      else if (view) { view.scroll = view.target = i * H; dirty = true; }
      phoneJump.close();
    });
  });
  phoneElement('button', 'Close', phoneJump, { type: 'button', class: 'phone-sheet-close' }).addEventListener('click', () => phoneJump.close());
  phoneJump.showModal();
}
phoneNav.querySelector('.phone-status').addEventListener('click', mobileOpenJump);

let phoneReaderPage = 0, phoneReadingStandalone = false;
const phoneReadingSections = TOME_WORDS.chapters.flatMap((chapter, ci) => (chapter.parts || [chapter]).map(part => ({ ...part, name: chapter.name, ci, page: TOME_PAGES.findIndex(p => p.ci === ci && p.label === part.label) })));
function mobileReadChapter(page = tome?.shown || 0) {
  if ((!tome && !phoneReadingStandalone) || !mobileLayout()) return;
  phoneReaderPage = Math.max(0, Math.min(TOME_PAGES.length - 1, page));
  const leaf = TOME_PAGES[phoneReaderPage], sectionIndex = phoneReadingSections.findIndex(p => p.ci === leaf.ci && p.label === leaf.label), chapter = phoneReadingSections[sectionIndex]; phoneReader.replaceChildren();
  const tools = phoneElement('div', '', phoneReader, { class: 'phone-reader-tools' });
  const prev = phoneElement('button', '‹', tools, { type: 'button', 'aria-label': 'Previous page' }); prev.disabled = sectionIndex === 0;
  const next = phoneElement('button', '›', tools, { type: 'button', 'aria-label': 'Next page' }); next.disabled = sectionIndex === phoneReadingSections.length - 1;
  prev.addEventListener('click', () => mobileReadChapter(phoneReadingSections[sectionIndex - 1].page)); next.addEventListener('click', () => mobileReadChapter(phoneReadingSections[sectionIndex + 1].page));
  phoneElement('button', 'Close', tools, { type: 'button', 'aria-label': 'Close reading view' }).addEventListener('click', () => phoneReader.close());
  phoneElement('h2', chapter.name, phoneReader, { id: 'phone-reader-title' });
  phoneElement('p', `${chapter.label ? chapter.label + ' · ' : ''}Chapter ${chapter.ci + 1} of ${TOME_WORDS.chapters.length}`, phoneReader, { class: 'phone-meta' });
  if (chapter.lead) phoneElement('p', chapter.lead, phoneReader);
  const pills = list => {
    const group = phoneElement('div', '', phoneReader, { class: 'phone-choices' });
    for (const skill of list) {
      const related = TOME_SKILL_PROJECTS[skill];
      if (chapter.name !== 'Skills' || !related) { phoneElement('p', skill, group); continue; }
      const b = phoneElement('button', `${skill} ↗`, group, { type: 'button', 'aria-expanded': 'false' });
      const linked = phoneElement('div', '', group, { class: 'phone-choices' }); linked.hidden = true;
      b.addEventListener('click', () => { linked.hidden = !linked.hidden; b.setAttribute('aria-expanded', String(!linked.hidden)); });
      for (const project of related) phoneElement('button', project, linked, { type: 'button' }).addEventListener('click', () => {
        phoneReader.close();
        if (tome) tomeJump(project);
        else { const item = WORKS_WORDS.items.find(it => it.t === project); if (item) { openWorks(projects[0]); worksOpenItem(item); } }
      });
    }
  };
  if (chapter.pills) pills(chapter.pills);
  for (const entry of chapter.entries || []) {
    phoneElement('h3', entry.h, phoneReader);
    if (entry.m) phoneElement('p', entry.m, phoneReader, { class: 'phone-meta' });
    if (Array.isArray(entry.d)) { const ul = phoneElement('ul', '', phoneReader); entry.d.forEach(d => phoneElement('li', d, ul)); }
    else if (entry.d) phoneElement('p', entry.d, phoneReader);
    if (entry.img) {
      const a = phoneElement('a', '', phoneReader, { href: `photos/certs/${entry.img}.jpg`, class: 'phone-link', 'aria-label': `Open ${entry.h}` });
      phoneElement('img', '', a, { src: `photos/certs/${entry.img}.jpg`, alt: entry.h, loading: 'lazy', width: '400', height: '280' });
      a.addEventListener('click', e => { e.preventDefault(); zoomPicture(a.href, entry.h); });
    }
    if (entry.verify) phoneElement('a', entry.verify[0], phoneReader, { href: entry.verify[1], target: '_blank', rel: 'noopener', class: 'phone-link' });
    if (entry.pills) pills(entry.pills);
  }
  for (const [label, image, , verify] of chapter.badges || []) {
    phoneElement('h3', label, phoneReader);
    if (verify) phoneElement('a', 'Verify certificate ↗', phoneReader, { href: verify, target: '_blank', rel: 'noopener', class: 'phone-link' });
    phoneElement('button', 'View certificate', phoneReader, { type: 'button' }).addEventListener('click', () => zoomPicture(`photos/certs/${image}.jpg`, label));
  }
  phoneReader.scrollTop = 0;
  if (!phoneReader.open) phoneReader.showModal();
}
phoneReader.addEventListener('close', () => { phoneReadingStandalone = false; if (tome?.phase === 'read' && phoneReaderPage !== tome.at) tomeGo(phoneReaderPage); });
function mobileReadExperiences() { phoneReadingStandalone = true; mobileReadChapter(0); }
function mobileReadNotebook() {
  if (!mobileLayout()) return;
  phoneReader.replaceChildren();
  const tools = phoneElement('div', '', phoneReader, { class: 'phone-reader-tools' });
  phoneElement('button', 'Close', tools, { type: 'button', 'aria-label': 'Close reading view' }).addEventListener('click', () => phoneReader.close());
  phoneElement('h2', 'Personal', phoneReader, { id: 'phone-reader-title' });
  for (const key of ['about', 'food', 'late', 'places', 'people', 'hi']) {
    const [title, ...lines] = BOOK_WORDS[key]; phoneElement('h3', title, phoneReader);
    lines.forEach(line => phoneElement('p', line, phoneReader));
  }
  for (const photo of BOOK_PHOTOS.filter(p => p.src)) {
    const a = phoneElement('a', photo.cap, phoneReader, { href: photo.src, class: 'phone-link' });
    a.addEventListener('click', e => { e.preventDefault(); zoomPicture(photo.src, photo.cap); });
  }
  phoneReader.showModal(); phoneReader.scrollTop = 0;
}
function mobileReadNote(name, text) {
  if (!mobileLayout()) return;
  const titles = { about: 'About me', food: 'Things I eat', late: 'Up too late', places: 'Places', people: 'My cats', hi: 'Say hi' };
  phoneReader.replaceChildren();
  const tools = phoneElement('div', '', phoneReader, { class: 'phone-reader-tools' });
  phoneElement('button', 'Close', tools, { type: 'button', 'aria-label': 'Close reading view' }).addEventListener('click', () => phoneReader.close());
  phoneElement('h2', titles[name] || 'From the notebook', phoneReader, { id: 'phone-reader-title' });
  String(text).split('\n').filter(Boolean).forEach(line => phoneElement('p', line, phoneReader));
  phoneReader.showModal(); phoneReader.scrollTop = 0;
}

let phoneNavKey = '';
function mobileTick() {
  requestAnimationFrame(mobileTick); if (document.hidden) return;
  const c = mobileNavContext(), action = mobileLayout() && mode === 'inside' && ((resume && resume.phase !== 'read') ? 'Read résumé' : gate ? 'Skip intro · View projects' : '');
  const key = JSON.stringify([c, action, works?.filter, !!document.querySelector('dialog[open]')]);
  if (key === phoneNavKey) return; phoneNavKey = key;
  phoneNav.hidden = !c; phoneAction.hidden = !action; phoneAction.textContent = action || '';
  phoneFilters.hidden = !c || c.kind !== 'works' || works.pages[works.page]?.kind !== 'portfolio';
  if (c) {
    phoneNav.querySelector('.phone-status').textContent = `${c.title} · ${c.page + 1}/${c.count}`;
    phoneNav.querySelector('.phone-status').setAttribute('aria-label', `${c.title}, ${c.page + 1} of ${c.count}. Choose section`);
    phoneNav.querySelector('[data-prev]').disabled = (c.kind === 'works' || c.kind === 'project') && c.page === 0;
    phoneNav.querySelector('[data-next]').disabled = (c.kind === 'works' || c.kind === 'project') && c.page >= c.count - 1;
  }
  if (works) for (const b of phoneFilters.children) b.setAttribute('aria-pressed', String(b.textContent === works.filter));
}
requestAnimationFrame(mobileTick);

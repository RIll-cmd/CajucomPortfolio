/* The whole portfolio as plain text, hidden from view. The site is drawn on a canvas, so without this Google, screen readers,
   Ctrl+F and copy-paste would find almost no words. Built from the same words the pages draw (resume.js, tome.js, works.js), so each is written once. */
(() => {
  const el = (tag, text, attrs = {}) => { const e = document.createElement(tag); if (text) e.textContent = text; for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const list = items => { const ul = el('ul'); for (const i of items) ul.append(i instanceof Node ? el('li').appendChild(i).parentNode : el('li', i)); return ul; };
  const main = el('main', '', { class: 'sr-only', id: 'plain', 'aria-label': 'Portfolio as text' });
  const R = RESUME_WORDS;
  main.append(el('h2', `${R.full}, ${R.role.toLowerCase()}`), ...R.intro.map(p => el('p', p)));

  for (const c of TOME_WORDS.chapters) {
    const s = el('section'); s.append(el('h2', c.name));
    if (c.lead) s.append(el('p', c.lead));
    for (const part of c.parts || [c]) {
      if ((part.label || part.h) && c.parts) s.append(el('h3', part.label || part.h));
      for (const e of part.entries || []) s.append(el(c.name === 'Skills' ? 'h3' : 'h4', e.h), ...(e.pills ? [list(e.pills)] : [e.m, e.d].filter(Boolean).map(t => Array.isArray(t) ? list(t) : el('p', t))));
      if (part.badges) s.append(list(part.badges.map(b => b[0])));
    }
    main.append(s);
  }

  const works = el('section'); works.append(el('h2', WORKS_WORDS.heroTitle), el('p', WORKS_WORDS.about));
  for (const it of WORKS_WORDS.items) {
    works.append(el('h3', it.t), el('p', it.copy));
    if (it.topics) works.append(el('p', `Topics: ${it.topics.join(', ')}`));
    if (it.features) works.append(el('h4', 'What it does'), list(it.features));
    if (it.results) works.append(el('h4', 'Results'), list(it.results));
    if (it.hard) works.append(el('h4', 'The hardest part'), el('p', it.hard));
    if (it.demo) works.append(el('p').appendChild(el('a', `${it.demo.about} (video)`, { href: `photos/works/${it.demo.video}.mp4` })).parentNode);
    if (it.links) works.append(list(it.links.map(([label, href]) => el('a', `${it.t}: ${label}`, { href }))));
  }
  main.append(works);

  const talk = el('section'); talk.append(el('h2', 'Contact'), list([
    el('a', WORKS_WORDS.email, { href: `mailto:${WORKS_WORDS.email}` }),
    el('a', 'LinkedIn', { href: 'https://www.linkedin.com/in/cyrillcajucom/' }),
    el('a', 'GitHub', { href: 'https://github.com/cyrillcajucom' }),
  ]));
  main.append(talk);
  for (const a of main.querySelectorAll('a')) a.tabIndex = -1; // screen readers still reach them; Tab doesn't land on links nobody can see
  document.body.append(main);
})();

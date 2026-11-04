/* ---------- First visit: a tour, and a "?" in every box ---------- */
// In the room an arrow points at the TV. On the board a short walk points at each card and says what's in it.
// Inside each box a "?" beside Back opens how that box works; the first time in a box, a bubble points at it.
// What a visitor has seen is kept per browser, so each part shows once. The lemon's help offers the walk again.

const TOUR_KEY = 'cc-seen';
let tourSeen = {}; try { tourSeen = JSON.parse(localStorage.getItem(TOUR_KEY)) || {}; } catch { /* storage blocked: the tour just shows again next time */ }
const tourMark = k => { tourSeen[k] = 1; try { localStorage.setItem(TOUR_KEY, JSON.stringify(tourSeen)); } catch { /* as above */ } };

// Small line icons for each kind of move, in the dialogs' cream.
const TOUR_ICONS = {
  click: '<rect x="11" y="5" width="18" height="30" rx="9"/><path d="M20 5v11M11 16h18"/><path d="M11.5 16V14a8.5 9 0 0 1 8.5-9v11z" fill="currentColor"/>',
  hold: '<rect x="11" y="5" width="18" height="30" rx="9"/><path d="M20 5v11M11 16h18"/><path d="M11.5 16V14a8.5 9 0 0 1 8.5-9v11z" fill="currentColor"/><path d="M4 9a18 18 0 0 0 0 22M36 9a18 18 0 0 1 0 22" stroke-dasharray="3 3"/>',
  wheel: '<rect x="11" y="5" width="18" height="30" rx="9"/><path d="M20 10v7"/><path d="M4 12l3-4 3 4M4 28l3 4 3-4M7 9v22"/>',
  drag: '<path d="M20 4v32M4 20h32M15 9l5-5 5 5M15 31l5 5 5-5M9 15l-5 5 5 5M31 15l5 5-5 5"/><circle cx="20" cy="20" r="3.5" fill="currentColor"/>',
  circle: '<path d="M33 20a13 13 0 1 1-4.5-9.8"/><path d="M29 4v7h7"/><circle cx="20" cy="20" r="2.5" fill="currentColor"/>',
  back: '<rect x="4" y="9" width="32" height="22" rx="5"/><path d="M23 14l-6 6 6 6"/>',
  key: '<rect x="5" y="7" width="30" height="26" rx="5"/><path d="M27 14v7H14M18 17l-4 4 4 4"/>',
  wait: '<path d="M11 5h18M11 35h18M13 5c0 9 14 9 14 15S13 26 13 35M27 5c0 9-14 9-14 15s14 6 14 15"/>',
  zoom: '<circle cx="17" cy="17" r="11"/><path d="M25 25l10 10M17 12v10M12 17h10"/>',
  link: '<path d="M17 23a6 6 0 0 0 8.5 0l6-6a6 6 0 0 0-8.5-8.5l-2 2M23 17a6 6 0 0 0-8.5 0l-6 6a6 6 0 0 0 8.5 8.5l2-2"/>',
  music: '<path d="M15 30V9l18-4v21"/><circle cx="11" cy="30" r="4" fill="currentColor"/><circle cx="29" cy="26" r="4" fill="currentColor"/>',
  talk: '<path d="M6 8h28v18H18l-8 7v-7H6z"/>',
  tap: '<path d="M17 37V17a3 3 0 0 1 6 0v9l6.5 1.5a3 3 0 0 1 2.3 3.4L31 37"/><path d="M11 13a9 9 0 0 1 18 0" stroke-dasharray="3 3"/>',
  swipe: '<path d="M17 37V19a3 3 0 0 1 6 0v8l6.5 1.5a3 3 0 0 1 2.3 3.4L31 37"/><path d="M5 9h30M9 5L5 9l4 4M31 5l4 4-4 4"/>',
};
const TOUR_TOUCH = { click: 'tap', hold: 'tap', wheel: 'swipe', drag: 'swipe', circle: 'circle' }; // fingers, not a mouse, on a touch screen
const tourIcon = k => `<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${TOUR_ICONS[COARSE && TOUR_TOUCH[k] || k]}</svg>`;
const tourMoves = list => `<ul class="moves">${list.map(([k, s]) => `<li>${tourIcon(k)}<span>${s}</span></li>`).join('')}</ul>`;
const tap = () => COARSE ? 'Tap' : 'Click', tapLow = () => COARSE ? 'tap' : 'click';

// The board walk. A card step points at that card; the last points at the lemon.
const TOUR_BOARD = () => [
  { title: 'Welcome inside', text: 'This is the board: one card for each part of me.', moves: [
    ['drag', COARSE ? 'Swipe to move around the board.' : 'Drag to move around the board.'],
    ...(COARSE ? [] : [['wheel', 'Scroll to zoom in.']]),
    ['click', `${tap()} a card to look closer, ${tapLow()} it again to open it.`],
    ['back', `Back${COARSE ? '' : ', or Esc,'} takes you out again.`]] },
  { card: () => projects[0], title: 'Projects', text: "What I've built. Rise up through the sky to a door, then open any project for what it does, screenshots, and links to the code." },
  { card: () => hero, title: 'Résumé', text: 'Who I am, where I studied and worked. Draw a circle, hold until the two hands touch, and the whole résumé opens.' },
  { card: () => projects[1], title: 'Personal', text: `Life outside work. Ride through a pop-up notebook with my cat Hoshi: ${BOOK_WORDS.worlds.join(', ').toLowerCase()}.` },
  { card: () => projects[2], title: 'Experiences', text: 'Work, school, certifications and awards, in a book on a table. Every page is a chapter.' },
  { card: () => stories, title: 'Stories', text: 'Photos from my life. Flick through the stack, then browse them in a row.' },
  { el: () => $('#btn-about'), title: 'Lost?', text: 'The lemon opens help and the keyboard keys any time. Inside each box, the ? beside Back shows how that box works. The green sticker is for saying hello.' },
];

// Each box's own help, opened by its "?".
const TOUR_GUIDES = {
  works: () => ({ title: 'Projects', moves: [
    ['wait', 'First the sky loads and carries you up to a door.'],
    ['click', `${tap()} the door${COARSE ? '' : ', or press Enter,'} to go through.`],
    ['wheel', `${COARSE ? 'Swipe' : 'Scroll, swipe or use ↑ ↓'} to move one section at a time.`],
    ['click', `The tabs pick a kind: ${WORKS_WORDS.filters.join(', ')}.${COARSE ? '' : ' ← → switch them too.'}`],
    ['zoom', `${tap()} a project to open its page.`],
    ['back', 'Back returns to the board.']] }),
  view: () => ({ title: 'A project', moves: [
    ['wheel', `${COARSE ? 'Swipe' : 'Scroll, swipe or use ↑ ↓'}: one part per screen. The stars on the right show where you are.`],
    ['zoom', `${tap()} a screenshot to see it large; ${tapLow()} again${COARSE ? '' : ' or press Esc'} to close it.`],
    ['link', "The buttons under the project's words open the code on GitHub, or the live site."],
    ['back', 'Back returns to the list of projects.']] }),
  resume: () => ({ title: 'Résumé', moves: [
    ['circle', COARSE ? 'Press and draw a circle on the glass with your finger.' : 'Hold the mouse button down and draw a circle on the glass.'],
    ['wheel', `${COARSE ? 'Swipe up' : 'Scroll down'} into the sky.`],
    ['hold', `${COARSE ? 'Press' : 'Press the mouse'} and hold until the two hands touch.`],
    ['key', `Skip${COARSE ? '' : ', or Enter,'} jumps ahead at any step.`],
    ['wheel', `Then read: ${COARSE ? 'swipe' : 'scroll or ↑ ↓'} one part at a time, or drag the ruler at the top.`],
    ['talk', `The bar at the bottom says hello, and its menu jumps to a section. ${tap()} a photo to see it large.`]] }),
  book: () => ({ title: 'Personal', moves: [
    ['drag', `${COARSE ? 'Swipe' : 'Scroll, drag or use ← →'} to ride along the notebook.`],
    ['click', `${tap()} things on the page: they talk. Pinned photos open large.`],
    ['click', `The icons at the top are the five worlds: ${tapLow()} one to ride straight there.`],
    ['music', 'In Up late, the card on the desk plays a song: Play, Pause, and ✕ to stop it.'],
    ['back', 'Back closes the notebook.']] }),
  tome: () => ({ title: 'Experiences', moves: [
    ['wheel', `${COARSE ? 'Swipe' : 'Scroll, swipe, drag or use ← →'} to turn the page.`],
    ['click', 'Every page is a chapter. The bar along the bottom jumps straight to one.'],
    ['back', 'Back closes the book.']] }),
};
// Which box is open, as the guides name them. Projects' gate and its list share one guide.
const tourPlace = () => view ? 'view' : gate || works ? 'works' : resume ? 'resume' : book ? 'book' : tome ? 'tome' : null;

document.head.insertAdjacentHTML('beforeend', `<style>
/* Each place dresses the tour its own way: the room as the TV's on-screen display, the board in its black, cream and yellow,
   Projects in the sky's navy and teal, the résumé as frosted glass, Personal on notebook paper, Experiences on the book's parchment. */
[data-look] { --radius: 18px; --btn-radius: 99px; --pad: 18px 20px 16px; --title-tf: none; --title-bg: none; --title-pad: 0; --title-rot: 0deg; --title-edge: 0; --count-tf: none; --tilt: 0deg; --lines: none; --blur: none; }
[data-look="room"] { --bg: rgba(0,0,0,.9); --ink: #ffd166; --soft: #ffe7a8; --edge: 2px solid #ffd166; --radius: 4px; --btn-radius: 4px; --shadow: 0 0 22px rgba(255,209,102,.35), 0 12px 40px rgba(0,0,0,.7);
  --title-font: 400 40px/1 VT323, Consolas, monospace; --title-ink: #ffd166; --title-glow: 0 0 10px rgba(255,209,102,.8); --body-font: 400 22px/1.15 VT323, Consolas, monospace; --count-font: 400 18px/1 VT323, monospace; --count-ink: #ffd166;
  --btn-font: 400 22px/1 VT323, Consolas, monospace; --btn-bg: #ffd166; --btn-ink: #000; --btn-edge: 2px solid #ffd166; --ghost-bg: #000; --ghost-ink: #ffd166; --icon: #ffd166;
  --lines: repeating-linear-gradient(0deg, rgba(255,209,102,.07) 0 1px, transparent 1px 3px); --b-bg: #000; --b-ink: #ffd166; --b-edge: #ffd166; }
[data-look="board"] { --bg: #0d0d0e; --ink: #f4f1e8; --soft: #f4f1e8; --edge: 2px solid #f4f1e8; --radius: 8px; --btn-radius: 6px; --shadow: 6px 7px 0 rgba(0,0,0,.6), 0 18px 40px rgba(0,0,0,.6); --pad: 22px 20px 16px;
  --title-font: 400 30px/1 "Lilita One", Impact, sans-serif; --title-ink: #000; --title-glow: none; --title-tf: uppercase; --title-bg: #ffe600; --title-pad: 4px 14px 6px; --title-rot: -2deg; --title-edge: 3px solid #000;
  --body-font: 500 15px/1.5 "Instrument Sans", "Segoe UI", sans-serif; --count-font: 400 20px/1 VT323, Consolas, monospace; --count-ink: #ffe600;
  --btn-font: 400 20px/1 VT323, Consolas, monospace; --btn-bg: #ffe600; --btn-ink: #000; --btn-edge: 2px solid #ffe600; --ghost-bg: #000; --ghost-ink: #f4f1e8; --icon: #ffe600; --b-bg: #ffe600; --b-ink: #14141a; --b-edge: #000; }
[data-look="works"] { --bg: #14284b radial-gradient(circle at 85% 8%, #27527a, transparent 62%); --ink: #f4ecd8; --soft: #f4ecd8; --edge: 2px solid #f4ecd8; --shadow: 0 0 0 5px #14284b, 0 0 0 6px rgba(244,236,216,.55), 0 18px 50px rgba(5,12,30,.7);
  --title-font: 400 36px/1.1 "Kaushan Script", Righteous, cursive; --title-ink: #ff8a5c; --title-glow: 2px 3px 0 #0b1730; --body-font: 600 14px/1.55 Poppins, "Segoe UI", sans-serif; --count-font: 400 13px/1.2 Righteous, sans-serif; --count-ink: #3fc1b0;
  --btn-font: 400 15px/1 Righteous, "Segoe UI", sans-serif; --btn-bg: #3fc1b0; --btn-ink: #14284b; --btn-edge: 1.5px solid #f4ecd8; --ghost-bg: #1b3c63; --ghost-ink: #f4ecd8; --icon: #3fc1b0; --b-bg: #3fc1b0; --b-ink: #0b2e2a; --b-edge: #f4ecd8; }
[data-look="resume"] { --bg: rgba(240,247,244,.9); --blur: blur(14px) saturate(1.2); --ink: #10302d; --soft: #3f5c58; --edge: 1.5px solid rgba(255,255,255,.95); --radius: 24px; --shadow: 0 18px 50px rgba(16,48,45,.28), inset 0 1px 0 #fff;
  --title-font: italic 500 34px/1.1 "Playfair Display", Georgia, serif; --title-ink: #10302d; --title-glow: none; --body-font: 500 15px/1.55 "Instrument Sans", "Segoe UI", sans-serif; --count-font: 500 12px/1 "JetBrains Mono", Consolas, monospace; --count-ink: #0f8f7f; --count-tf: uppercase;
  --btn-font: 600 15px/1 "Instrument Sans", "Segoe UI", sans-serif; --btn-bg: #1a2422; --btn-ink: #f7fbf9; --btn-edge: 1.5px solid #1a2422; --ghost-bg: rgba(255,255,255,.6); --ghost-ink: #10302d; --icon: #0f8f7f; --b-bg: rgba(240,247,244,.95); --b-ink: #10302d; --b-edge: #0f8f7f; }
[data-look="book"] { --bg: #fffef6; --ink: #26252b; --soft: #2d2b33; --edge: 3px solid #34323a; --radius: 14px; --shadow: 4px 6px 0 rgba(30,25,45,.35); --tilt: -1.2deg; --pad: 16px 22px 16px 40px;
  --lines: linear-gradient(90deg, transparent 26px, rgba(228,88,79,.5) 26px 28px, transparent 28px), repeating-linear-gradient(180deg, transparent 0 27px, rgba(90,140,210,.28) 27px 28px);
  --title-font: 700 36px/1 Gaegu, "Comic Sans MS", cursive; --title-ink: #e4584f; --title-glow: none; --body-font: 700 19px/1.32 Gaegu, "Comic Sans MS", cursive; --count-font: 700 16px/1 Gaegu, cursive; --count-ink: #6a6670;
  --btn-font: 700 19px/1 Gaegu, "Comic Sans MS", cursive; --btn-bg: #ffd23f; --btn-ink: #26252b; --btn-edge: 2.5px solid #34323a; --ghost-bg: #fffef6; --ghost-ink: #26252b; --icon: #26252b; --b-bg: #fffef6; --b-ink: #26252b; --b-edge: #34323a; }
[data-look="tome"] { --bg: #f1e6c9 radial-gradient(circle at 50% 0, #fbf3dc, transparent 70%); --ink: #3b2a1c; --soft: #4a3624; --edge: 2px solid #c9a24a; --radius: 6px; --btn-radius: 99px; --shadow: inset 0 0 0 5px #f1e6c9, inset 0 0 0 6.5px rgba(201,162,74,.7), 0 18px 46px rgba(26,14,7,.6);
  --title-font: 700 30px/1.1 Cinzel, Georgia, serif; --title-ink: #3a1c16; --title-glow: none; --body-font: 600 14px/1.6 Poppins, "Segoe UI", sans-serif; --count-font: 600 13px/1 Cinzel, Georgia, serif; --count-ink: #8b6c3c; --count-tf: uppercase;
  --btn-font: 600 15px/1 Cinzel, Georgia, serif; --btn-bg: #3a2516; --btn-ink: #f3e4bf; --btn-edge: 1.5px solid #3a2516; --ghost-bg: transparent; --ghost-ink: #3a2516; --icon: #8b6c3c; --b-bg: #f1e6c9; --b-ink: #3b2a1c; --b-edge: #c9a24a; }

#coach { position: fixed; inset: 0; z-index: 12; pointer-events: none; }
#coach[hidden] { display: none; }
#coach .spot { position: absolute; border: 3px dashed #ffe600; border-radius: 16px; box-shadow: 0 0 0 9999px rgba(4,8,20,.45), 0 0 24px rgba(255,230,0,.5); animation: spot 1.4s ease-in-out infinite; transition: left .35s, top .35s, width .35s, height .35s; }
#coach .spot.round { border-radius: 50%; }
@keyframes spot { 50% { border-color: #fff6a8; box-shadow: 0 0 0 9999px rgba(4,8,20,.45), 0 0 36px rgba(255,230,0,.8); } }
#coach .arrow { position: absolute; width: 0; height: 0; transform-origin: 0 0; }
#coach .arrow svg { position: absolute; right: 0; top: -22px; width: 96px; height: 44px; animation: nudge .9s ease-in-out infinite; filter: drop-shadow(0 4px 4px rgba(0,0,0,.55)); }
@keyframes nudge { 50% { transform: translateX(-14px); } }
#coach .card, #guide[data-look], #leave { box-sizing: border-box; padding: var(--pad); background: var(--lines), var(--bg); color: var(--ink); border: var(--edge); border-radius: var(--radius); box-shadow: var(--shadow); backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur); transform: rotate(var(--tilt)); }
#coach .card { position: absolute; width: min(360px, calc(100vw - 32px)); pointer-events: auto; animation: card-in .35s cubic-bezier(.2,.9,.25,1.2) both; }
@keyframes card-in { from { translate: 0 10px; scale: .96; opacity: 0; } }
#coach .count { margin: 0 0 6px; font: var(--count-font); color: var(--count-ink); letter-spacing: .08em; text-transform: var(--count-tf); }
#coach h2, #guide[data-look] h2, #leave h2 { display: inline-block; margin: 0 0 10px; padding: var(--title-pad); font: var(--title-font); color: var(--title-ink); text-shadow: var(--title-glow); text-transform: var(--title-tf); background: var(--title-bg); border: var(--title-edge); border-radius: 8px; transform: rotate(var(--title-rot)); }
#coach p.text { margin: 0 0 10px; font: var(--body-font); color: var(--soft); }
#coach .row, #guide[data-look] .row, #leave .row { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
#coach button, #guide[data-look] button, #leave button { display: inline-flex; align-items: center; min-height: 44px; box-sizing: border-box; padding: 9px 18px; border: var(--btn-edge); border-radius: var(--btn-radius); background: var(--btn-bg); color: var(--btn-ink); font: var(--btn-font); cursor: pointer; touch-action: manipulation; }
#coach button:hover, #guide[data-look] button:hover, #leave button:hover { filter: brightness(1.1); }
#coach button.ghost, #leave button.ghost { background: var(--ghost-bg); color: var(--ghost-ink); border-color: currentColor; }
#coach .bubble { position: absolute; padding: 10px 14px; max-width: min(260px, calc(100vw - 32px)); box-sizing: border-box; pointer-events: auto; cursor: pointer; background: var(--b-bg); color: var(--b-ink); border: 2px solid var(--b-edge); border-radius: 14px; font: var(--body-font); box-shadow: 0 8px 18px rgba(0,0,0,.45); backdrop-filter: var(--blur); animation: card-in .35s both, bob 1.6s .35s ease-in-out infinite; }
#coach .bubble::before { content: ''; position: absolute; top: -9px; right: var(--tail, 22px); width: 14px; height: 14px; background: var(--b-bg); border: 2px solid var(--b-edge); border-right: 0; border-bottom: 0; transform: rotate(45deg); }
@keyframes bob { 50% { transform: translateY(4px); } }
.moves { display: grid; gap: 10px; margin: 6px 0 0; padding: 0; list-style: none; }
.moves li { display: flex; gap: 12px; align-items: center; font: var(--body-font); color: var(--soft); }
.moves svg { flex: none; color: var(--icon); }
#help { position: fixed; z-index: 11; min-width: 44px; min-height: 44px; box-sizing: border-box; padding: 0 14px; background: #000; color: var(--paper); border: 2px solid var(--paper); border-radius: 6px; font: 400 24px/1 var(--mono); cursor: pointer; touch-action: manipulation; }
#help:hover { background: var(--paper); color: #000; }
#help.new { animation: help-pulse 1.2s ease-in-out infinite; }
@keyframes help-pulse { 50% { box-shadow: 0 0 0 7px rgba(255,230,0,.55); border-color: #ffe600; } }
#guide[data-look], #leave { width: min(520px, calc(100vw - 32px)); }
#guide[data-look]::backdrop, #leave::backdrop { background: rgba(6,10,20,.55); }
#guide .moves { gap: 14px; margin: 4px 0 0; }
#leave p { margin: 0; max-width: none; font: var(--body-font); color: var(--soft); }
</style>`);

const coach = document.createElement('div'); coach.id = 'coach'; coach.hidden = true; document.body.append(coach);
const helpBtn = document.createElement('button'); helpBtn.id = 'help'; helpBtn.type = 'button'; helpBtn.textContent = '?'; helpBtn.setAttribute('aria-label', 'How this works'); helpBtn.hidden = true; $('#ui').append(helpBtn);
document.body.insertAdjacentHTML('beforeend', '<dialog id="guide" aria-labelledby="guide-title"><h2 id="guide-title" class="tape"></h2><div class="body"></div><div class="row"><button type="button" data-close>Got it</button></div></dialog>');
const guide = $('#guide');
guide.querySelector('[data-close]').addEventListener('click', () => guide.close());
$('#about .row').insertAdjacentHTML('afterbegin', '<button type="button" class="ghost" id="tour-again">Show me around</button>');
$('#tour-again').addEventListener('click', () => { $('#about').close(); tourStart(); });

function openGuide() {
  const k = tourPlace(); if (!k) return;
  const d = TOUR_GUIDES[k]();
  guide.dataset.look = k === 'view' ? 'works' : k; guide.querySelector('h2').textContent = d.title; guide.querySelector('.body').innerHTML = tourMoves(d.moves);
  helpBtn.classList.remove('new'); tourBubbleOff(); guide.showModal();
}
helpBtn.addEventListener('click', openGuide);

// The tour's state: which walk (room or board), which step, and the elements on screen.
let tour = null, tourBubble = null;
function tourStart() { tour = { kind: 'board', i: 0 }; tourRender(); }
function tourEnd() { if (tour) tourMark(tour.kind); tour = null; coach.innerHTML = ''; coach.hidden = !tourBubble; if (tourBubble) coach.append(tourBubble.el); }
function tourNext() { if (!tour) return; if (++tour.i >= TOUR_BOARD().length) tourEnd(); else tourRender(); }
function tourRender() {
  coach.hidden = false; coach.innerHTML = '';
  const steps = tour.kind === 'room' ? null : TOUR_BOARD(), s = steps ? steps[tour.i] : { title: 'Welcome', text: `${tap()} the TV to step inside.` };
  const card = document.createElement('div'); card.className = 'card'; card.dataset.look = tour.kind; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Tour'); card.setAttribute('aria-live', 'polite');
  card.innerHTML = `${steps ? `<p class="count">${tour.i + 1} / ${steps.length}</p>` : ''}<h2>${s.title}</h2><p class="text">${s.text}</p>${s.moves ? tourMoves(s.moves) : ''}
    <div class="row">${steps && tour.i === steps.length - 1 ? '' : '<button type="button" class="ghost" data-skip>Skip tour</button>'}${steps ? `<button type="button" data-next>${tour.i === steps.length - 1 ? 'Done' : 'Next'}</button>` : ''}</div>`;
  card.querySelector('[data-skip]')?.addEventListener('click', () => { if (tour.kind === 'room') tourMark('board'); tourEnd(); }); // skipping in the room skips the board's walk too
  const next = card.querySelector('[data-next]'); if (next) next.addEventListener('click', tourNext);
  tour.spot = document.createElement('div'); tour.spot.className = 'spot';
  tour.arrow = document.createElement('div'); tour.arrow.className = 'arrow';
  tour.arrow.innerHTML = '<svg viewBox="0 0 96 44" aria-hidden="true"><path d="M4 16h58V4l30 18-30 18V28H4z" fill="#ffe600" stroke="#000" stroke-width="4" stroke-linejoin="round"/></svg>';
  coach.append(tour.spot, tour.arrow, card); tour.card = card; tour.step = s; tour.placed = null;
  if (next) keyboardFocus(next); else keyboardFocus(card.querySelector('button'));
}

// Where the thing being pointed at is, in page pixels: [x, y, half width, half height], or null to point at nothing.
function tourTarget() {
  if (tour.kind === 'room') {
    if (!screenMesh.geometry.boundingBox) screenMesh.geometry.computeBoundingBox();
    const b = screenMesh.geometry.boundingBox, xs = [], ys = [];
    for (const [x, y] of [[b.min.x, b.min.y], [b.max.x, b.min.y], [b.min.x, b.max.y], [b.max.x, b.max.y]]) { const v = screenMesh.localToWorld(new THREE.Vector3(x, y, 0)).project(camera); xs.push((v.x + 1) / 2 * innerWidth); ys.push((1 - v.y) / 2 * innerHeight); }
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    return [(x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + 10, (y1 - y0) / 2 + 10];
  }
  const s = tour.step;
  if (s.el) { const r = s.el().getBoundingClientRect(); return r.width ? [r.x + r.width / 2, r.y + r.height / 2, r.width / 2 + 8, r.height / 2 + 8] : null; }
  if (s.card) {
    const c = s.card(), [px, py] = place(c), [w, h] = sizeOf(c), [ax, ay] = toClient(px - w / 2, py - h / 2), [bx, by] = toClient(px + w / 2, py + h / 2);
    return [(ax + bx) / 2, (ay + by) / 2, (bx - ax) / 2 + 8, (by - ay) / 2 + 8];
  }
  return null;
}
// The card goes on whichever side of the target has room, the arrow runs from the card to the target's edge.
function tourPlaceCard(t) {
  const vw = innerWidth, vh = innerHeight, cw = tour.card.offsetWidth, ch = tour.card.offsetHeight, m = 16, gap = 70;
  if (!t) return [(vw - cw) / 2, (vh - ch) / 2];
  const [x, y, hw, hh] = t, clampX = v => Math.max(m, Math.min(vw - cw - m, v)), clampY = v => Math.max(m, Math.min(vh - ch - m, v));
  const tries = [
    [x + hw + gap, clampY(y - ch / 2), x + hw + gap + cw <= vw - m],
    [x - hw - gap - cw, clampY(y - ch / 2), x - hw - gap - cw >= m],
    [clampX(x - cw / 2), y + hh + gap, y + hh + gap + ch <= vh - m],
    [clampX(x - cw / 2), y - hh - gap - ch, y - hh - gap - ch >= m],
  ];
  const fit = tries.find(q => q[2]);
  return fit ? [fit[0], fit[1]] : [clampX(x - cw / 2), vh - ch - m]; // nothing fits: along the bottom, over the board
}
function tourTick() {
  requestAnimationFrame(tourTick);
  // Begin or end each walk with the place: the room's when the room is ready, the board's once inside with nothing open.
  const onBoard = mode === 'inside' && !tourPlace() && !(focus && zoomGoal) && !document.querySelector('dialog[open]');
  if (!tour && mode === 'room' && roomReady && !tourSeen.room && !noRoom) { tour = { kind: 'room', i: 0 }; tourRender(); }
  if (tour && tour.kind === 'room' && mode !== 'room') { tourMark('room'); tour = null; coach.innerHTML = ''; coach.hidden = true; tourArrived = performance.now(); }
  if (!tour && onBoard && !tourSeen.board && performance.now() - tourArrived > 1600) tourStart();
  if (tour && tour.kind === 'board' && mode === 'inside' && !onBoard) tourEnd(); // a card was opened or selected: the visitor has found their way
  if (mode !== 'inside') tourArrived = performance.now();

  // Each box's "?" beside Sound, and the first-time bubble pointing at it.
  const here = mode === 'inside' ? tourPlace() : null;
  helpBtn.hidden = !here;
  if (here) {
    const r = soundBtn.getBoundingClientRect(); helpBtn.style.top = `${r.top}px`; helpBtn.style.height = `${r.height}px`; helpBtn.style.right = `${innerWidth - r.left + 8}px`;
    const key = `box-${here === 'view' ? 'works' : here}`;
    const ready = !(book && book.phase !== 'ride') && !(tome && tome.phase !== 'read'); // not over a loading screen, where it would run out unseen
    if (!tourSeen[key] && !tour && ready) { tourMark(key); helpBtn.classList.add('new'); tourBubbleOn(); }
  } else if (tourBubble) tourBubbleOff();
  if (tourBubble) {
    if (performance.now() - tourBubble.at > 9000) tourBubbleOff();
    else { const r = helpBtn.getBoundingClientRect(), b = tourBubble.el, w = b.offsetWidth, x = Math.max(16, Math.min(innerWidth - w - 16, r.left + r.width / 2 - w + 30)); b.style.left = `${x}px`; b.style.top = `${r.bottom + 14}px`; b.style.setProperty('--tail', `${x + w - (r.left + r.width / 2) - 9}px`); }
  }

  if (!tour) return;
  const t = tourTarget(), card = tour.card, p = tour.placed; // the card holds still while the board drifts; it moves only if its target goes far or the window changes
  if (!p || p.w !== innerWidth || p.h !== innerHeight || (t && Math.hypot(t[0] - p.tx, t[1] - p.ty) > 80)) { const [x, y] = tourPlaceCard(t); tour.placed = { x, y, w: innerWidth, h: innerHeight, tx: t ? t[0] : 0, ty: t ? t[1] : 0 }; card.style.left = `${x}px`; card.style.top = `${y}px`; }
  const cx = tour.placed.x, cy = tour.placed.y;
  tour.spot.hidden = tour.arrow.hidden = !t;
  if (!t) return;
  const [x, y, hw, hh] = t;
  Object.assign(tour.spot.style, { left: `${x - hw}px`, top: `${y - hh}px`, width: `${hw * 2}px`, height: `${hh * 2}px` });
  tour.spot.classList.toggle('round', !!tour.step.el);
  // The arrow's tip sits just outside the target, on the line from the nearest point of the card (so a wide card above still points straight down).
  const mx = Math.max(cx + 30, Math.min(cx + card.offsetWidth - 30, x)), my = Math.max(cy + 30, Math.min(cy + card.offsetHeight - 30, y)), dx = x - mx, dy = y - my, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
  const edge = Math.min(hw / Math.max(1e-6, Math.abs(ux)), hh / Math.max(1e-6, Math.abs(uy))) + 10;
  Object.assign(tour.arrow.style, { left: `${x - ux * edge}px`, top: `${y - uy * edge}px`, transform: `rotate(${Math.atan2(uy, ux)}rad)` });
}
let tourArrived = performance.now();
function tourBubbleOn() {
  tourBubbleOff();
  const el = document.createElement('div'); el.className = 'bubble'; el.dataset.look = tourPlace() === 'view' ? 'works' : tourPlace(); el.textContent = `First time here? ${tap()} ? to see how this works.`;
  el.addEventListener('click', openGuide);
  tourBubble = { el, at: performance.now() }; coach.hidden = false; coach.append(el);
}
function tourBubbleOff() { if (!tourBubble) return; tourBubble.el.remove(); tourBubble = null; if (!tour) coach.hidden = true; }

// Esc leaves the tour rather than the place; "?" opens the open box's help.
addEventListener('keydown', e => {
  if (document.querySelector('dialog[open]')) return;
  if (tour && e.key === 'Escape') { e.stopImmediatePropagation(); if (tour.kind === 'room') tourMark('board'); tourEnd(); return; }
  if (e.key === '?' && mode === 'inside' && tourPlace()) { e.stopImmediatePropagation(); openGuide(); }
}, true);
requestAnimationFrame(tourTick);

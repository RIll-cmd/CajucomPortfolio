/* Box 1's page, behind the door: one full screen at a time through a night sky, in navy, teal and coral.
   The words and projects are kept together here so they're easy to change. */
const WORKS_WORDS = {
  name: 'Cyrill',
  heroTitle: 'Projects',
  heroLine: "WHAT I'VE BUILT",
  aboutTitle: 'Deep dive',
  about: "A collection of what I've built so far: AI agents that work as a team or chase unpaid invoices, apps that see, listen and talk back, and hardware that keeps tired drivers awake. Swim down for a closer look at each one.",
  aboutMore: 'More about me',
  highlight: { agents: 0, see: 1, hardware: 2 }, // words that sit on a coloured chip, by which colour
  portfolioLabel: 'PORTFOLIO',
  portfolioTitle: 'Works',
  portfolio: 'Four solo projects, my thesis and my internship capstone: AI agents, automation, computer vision, and hardware for the road.',
  filters: ['All', 'Solo', 'Thesis', 'Capstone'],
  ask: 'Have a role or an internship in mind?',
  talk: "Let's talk",
  email: 'cyrillgerardc@gmail.com',
  items: [
    { t: 'Kinsenas', tags: ['Solo'], topics: ['AI', 'Automation', 'n8n'], links: [['View on GitHub', 'https://github.com/cyrillcajucom/Kinsenas-Collection-Agent']],
      copy: 'An AI collections agent built in n8n. It chases unpaid invoices for Philippine small businesses: politely, in Taglish, and timed for payday. Solo project.',
      features: ['Reminders go out 1 to 3 days after payday, the 15th and the end of the month, and never on Sundays or Philippine holidays', 'Gemini writes each email, firmer at each stage, following the owner\'s notes and the customer\'s promise history', 'Firmer emails and payment-plan offers wait for one tap in Telegram', 'Reads Taglish replies as paid, promise, dispute or payment plan, and turns "babayaran ko sa Friday" into a real date', 'A promise score for each customer: a broken promise gets chased again', 'Fake-receipt red flags: Gemini reads GCash and bank screenshots and flags reused reference numbers, wrong amounts and old dates', 'An n8n Agent on Telegram answers the owner in Taglish, and asks before it changes anything', 'A daily call list, a Monday summary, and an alert whenever a run fails'],
      results: ['5 workflows and 1 n8n Agent, about 48 nodes', 'About 40 test runs with test invoices, covering every path: approve, decline, promise, paid, broken promise, payday, holiday, receipt flags and duplicates', 'Fixed while testing: a table update wiping columns, a hidden tab in a field name, runs on UTC instead of Manila time, and Gemini\'s free-tier limits'],
      hard: 'Checking GCash screenshots without trusting them: a screenshot is never proof of payment, so the agent only flags what looks wrong and leaves marking it paid to the owner.',
      demo: { video: 'kinsenas-demo', poster: 'kinsenas-poster', cap: 'Watch the demo, 90 s', about: 'Kinsenas in 90 seconds, with test invoices.' },
      shots: [['kinsenas-approval', 'A Gemini-written reminder, waiting for one tap'], ['kinsenas-chase', 'The daily chase, in n8n'], ['kinsenas-promise', 'A Taglish promise, turned into a date'], ['kinsenas-receipt', 'A reused GCash receipt, flagged'], ['kinsenas-agent', 'The owner\'s assistant, asking before it acts'], ['kinsenas-replies', 'Sorting replies with a Text Classifier'], ['kinsenas-call-list', 'Approved, then the daily call list']] },
    { t: 'Ascend Hub', tags: ['Solo'], topics: ['AI', 'Orchestration', 'React'], links: [['View on GitHub', 'https://github.com/cyrillcajucom/ascend-hub']],
      copy: 'A retro orchestrator for AI coding agents, with you in charge of every step. Solo project.',
      features: ['Codex, Claude and Antigravity plan, build, review and merge as a team in the Agent Room, with a commit and your checks after every task', 'Approval gates: you approve the roles, the plan and the result, and can send a step back with a note', 'Skills: each role gets a library of skills, and the agents open the ones a task needs. The room counts which ones get read and flags the stale ones', 'Skills the agents write: after a session, the orchestrator can turn what it learned into a new skill, safety-scanned before it is saved', 'Subscription limits: a 5-hour and a weekly bar for each agent, and a task moves to another coder when one is nearly out', 'Debates: the agents argue a question, then show where they agree, where they disagree, and a verdict', 'A scorecard of how each agent\'s work went', 'A shelf of CRT televisions showing every agent\'s status', 'Between sessions, the same TV plays Spotify, the weather, YouTube and a little game'],
      results: ['Three AI agents on one task, with three approval gates for you', '100 automated test files, across the Agent Room, the status shelf and the media TVs', 'Runs entirely on your computer, on 127.0.0.1 only'],
      hard: 'Letting three agents edit the same code without breaking it: each session gets its own git branch and worktree, tests run after every task, and nothing merges unless it fast-forwards cleanly.',
      demo: { video: 'hub-demo', poster: 'hub-poster', cap: 'Watch the demo, 77 s', about: 'Ascend Hub in 77 seconds, with a real Agent Room session.' },
      shots: [['hub-room-coding', 'The Agent Room while the team codes'], ['hub-room-start', 'Starting a new session'], ['hub-room-debate', 'A debate, ending in a verdict'], ['hub-room-gate', 'An approval gate waiting for you'], ['hub-room-workflow', 'The workflow behind a task'], ['hub-room-themes', 'Room themes'], ['hub-tray-remote', 'The tray remote']] },
    { t: 'Ascend Core', tags: ['Solo'], topics: ['AI', 'Gamification', 'Full-stack'], links: [['Live site', 'https://ascend-core.vercel.app/landing'], ['GitHub', 'https://github.com/cyrillcajucom/ascend-core']],
      copy: 'A gamified self-mastery platform that turns workouts, habits, focus, sleep and real-world goals into RPG progression. Solo project.',
      features: ['AIRA, an AI advisor built on Gemini, acts for you: tell it what you did and it logs the quest, builds habit schedules and generates workouts', 'AI briefings: a morning report, decay warnings and readiness alerts', 'AI analysis of your progress and stats: workout performance, boss trajectory, tower defeats and shop spending', 'A quest board: three quest sizes, subtask checklists, and columns you drag quests between', 'A merchant shop with a rotating daily stock: gear, potions, streak shields and mystery eggs', 'Eggs hatch from your real walking steps into one of 20 dragons, which level up beside you', 'Achievements across combat, fitness, discipline, knowledge and exploration, unlocking titles and perks', 'Automations: rules that react to phone use, drowsiness and posture signals', 'A skill tree, world bosses fed by your habits, and a 20-floor auto-combat tower', 'Built with Next.js, FastAPI and PostgreSQL'],
      results: ['19 app screens, backed by more than 20 API routers', 'Live on Vercel, with the FastAPI backend on Render and PostgreSQL on Neon', 'Tested with Vitest and Playwright'],
      hard: 'Keeping progress honest: a habit strength score that blends consistency, success rate and quality and fades on missed days, so the game only moves when real life does.',
      demo: { video: 'core-demo', poster: 'core-poster', cap: 'Watch the demo, 64 s', about: 'Ascend Core in 64 seconds, on a fresh guest account.' },
      shots: [['core-skills', 'The Celestial Starchart skill tree'], ['core-aira-system', 'AIRA, the AI advisor'], ['core-workout', 'Workout logging, by muscle group'], ['core-tower', 'The Ascend Tower'], ['core-sleep', 'Sleep tracking'], ['core-missions', 'Missions and the quest board'], ['core-achievements', 'Achievements'], ['core-automations', 'The automations engine']] },
    { t: 'Ascend Vision', tags: ['Solo'], topics: ['AI', 'Computer Vision', 'Voice'], links: [['View on GitHub', 'https://github.com/cyrillcajucom/ascend-vision']],
      copy: 'A desktop companion that watches for your phone, keeps you focused, and talks with you. Detection runs entirely on your computer. Solo project.',
      features: ['She watches how you work: phone pickups with YOLO and MediaPipe, plus posture, drowsiness, yawns, expressions and hand gestures', 'She talks in her own voice, made offline with Kokoro, and listens with faster-whisper on your computer', 'An animated eye that follows your face, reacts to your voice, and shows when she is listening, thinking or asleep', 'Browser use: research and page tasks in a separate browser that asks before anything changes', 'Gentle reminders through the day: meals with your calories so far, water by the glass, the weather for your places, and your GitHub streak', 'A Discord bot and phone chat, so you can ask her things away from the desk', 'Commitment chaser: say "remind me Friday", and it looks for a matching commit before it asks', 'Focus blocks that hold notices, answer Discord messages for you, and sum up what waited', 'Slump detector: compares your last three days with your usual and offers one small step', 'Show me once: say "watch me" and get a step-by-step guide with screenshots, narrated video and a transcript', 'Read this for me: your screen, a page or a PDF, as a plain summary with the red flags ranked', 'Approved memory: nothing is kept until you press Keep','For AI coding: prompt coach, license check, release notes and dormant work revival, and she answers Ascend Hub\'s approval gates by voice'],
      results: ['A phone pickup only counts after a steady hold, which cuts false alarms', 'Assistant mode runs in about 620 MB of memory instead of 1.1 GB', 'Detection never leaves your computer; AI replies fall back from Gemini to Groq to Cerebras'],
      hard: 'Telling a real phone pickup from a hand passing by: YOLO finds the phone, MediaPipe finds the hand, and a state machine waits for a steady hold before it counts.',
      demo: { video: 'vision-demo', poster: 'vision-poster', cap: 'Watch the demo, 81 s', about: 'Ascend Vision in 81 seconds, in her own voice. The camera is a stock clip.' },
      shots: [['vision-chat', 'Talking with Vision'], ['vision-reminders', 'Reminders: dinner, water and the weather'], ['vision-discord', 'Asking Vision on Discord'], ['vision-eye', 'Focus mode, and the eye'], ['vision-stats', 'Phone and focus stats'], ['vision-food', 'Food and water'], ['vision-memory', 'Memory you approve'], ['vision-themes', 'Tuning the eye']] },
    { t: 'Wake&Brake', tags: ['Thesis'], topics: ['Computer Vision', 'Hardware', 'Thesis'], links: [['View on GitHub', 'https://github.com/sutayniee/Wake-Brake']],
      copy: 'My thesis: a real-time driver fatigue detector on a Raspberry Pi, with an Arduino as the haptic actuator. My role: project manager and main researcher. I led the 4-person team, integrated detection, alerts and the app, and wrote the Arduino alert code.',
      features: ['Face and eye tracking with Haar cascades and dlib landmarks', 'Eye aspect ratio, blink rate, PERCLOS and head posture, to catch micro-sleeps and sustained drowsiness', 'Alerts that escalate through sound, vibration, a buzzer and scent', 'A live feed and stats served locally over Flask, shown in a companion app'],
      results: ['Tested with 20 drivers in 45 to 60 minute driving-simulator sessions', 'The Pi hands each alert to the serial port in 0.19 ms (median of 110 alerts), 95% of them under 1 ms', 'About 12 frames per second on a Raspberry Pi 4', 'Rated 4.56 out of 5 for reliability and 4.47 for detection by the participants'],
      hard: 'Alerts that wake you without wearing off: a non-blocking state machine on the Arduino escalates from vibration to buzzer to scent, and a 90-second lockout keeps the scent from spraying so often your nose stops noticing it.',
      demo: { video: 'wake-avp', poster: 'wake-poster', cap: 'Watch our AVP, 3 min', about: 'Wake&Brake, our thesis AVP.' },
      shots: [['wake-exploded5_0372', 'The whole system, wired together'], [['1.0', '0.7', '0.45', '0.25', '0.1', '0.0'].map(n => `wake-eye-${n}`), 'What it watches for: eyes drifting shut'], ['wake-app-states', 'The app, from safe to severe'], ['wake-pi_hero', 'The Raspberry Pi 4 running detection'], ['wake-squad_0096', 'The alert hardware: vibration, buzzer and scent'], ['wake-demo_console_0825', 'The buzzer at the console'], ['wake-demo_seat_0695', 'Vibration in the seat'], ['wake-diffuser_mist', 'The scent diffuser'], ['wake-lab2_0210', 'The driving simulator setup'], ['wake-drive_wide', 'The night drive it was built for']] },
    { t: 'Image Relevance Engine', tags: ['Capstone'], topics: ['AI', 'Computer Vision', 'FastAPI'], links: [['View on GitHub', 'https://github.com/cyrillcajucom/flyrank-capstone-image-relevance-rebuild']],
      copy: 'My capstone for the FlyRank AI Backend AI Engineering internship: an API that picks the right photo for an article, and refuses the wrong ones. A local vision model describes each image, embeddings rank them, and a guard says no when nothing fits.',
      features: ['A local vision model (qwen3-vl, through Ollama) describes each image: subject, category, attributes and a confidence', 'Articles and images are compared as embeddings (nomic-embed-text) and ranked by similarity', 'A guard checks the subject, the confidence and the similarity, and explains every rejection', 'Answers "no confident match" instead of guessing when no image fits', 'Reviewers approve or reject suggestions through the API, and an unsafe one can\'t be approved', 'Background batch jobs with retries, a daily model-call budget, and an alert when an image fails three times', 'A separate database per tenant, versioned SQL migrations, and no paid cloud services'],
      results: ['Picked the exact labeled image for 7 of 10 articles; 9 of 10 picks were judged relevant on human review. They\'re two different measures, and neither is 10 of 10', 'Refused a wolf forced onto a fox article, and returned no match for a story about a submarine', '40 licensed images, and 21 passing tests'],
      hard: 'Telling the right picture from a merely similar one: a wolf and a fox sit close together as embeddings, so ranking alone isn\'t enough. The guard also checks the subject the vision model saw, and refuses when the two disagree.',
      demo: { video: 'capstone-demo', poster: 'capstone-poster', cap: 'Watch the demo, 35 s', about: 'The Image Relevance Engine in 35 seconds, on its own API.' },
      shots: [['capstone-match', 'Ranked photos for a brown bear article, each with a reason'], ['capstone-mismatch', 'A wolf forced onto a fox article, refused'], ['capstone-refuse', 'No right photo for a submarine story, so no guess'], ['capstone-eval', 'Measured on 10 labeled articles'], ['capstone-docs', 'The API, in its own docs'], ['capstone-tests', 'The test suite: 21 passed']] },
  ],
};
const WORKS_NAVY = '#14284b', WORKS_DUSK = '#27527a', WORKS_TEAL = '#3fc1b0', WORKS_CORAL = '#ff8a5c', WORKS_CREAM = '#f4ecd8', WORKS_BODY = 'Poppins, "Segoe UI", sans-serif', WORKS_LABEL = 'Righteous, "Segoe UI", sans-serif', WORKS_SCRIPT = '"Kaushan Script", Righteous, cursive';
const worksEase = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
const worksClamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- Each project's screenshots, playing as a looping reel. A shot with several frames (the eye) plays them in turn ---------- */
const WORKS_REEL_MS = 3000, WORKS_FADE = .17;
for (const it of WORKS_WORDS.items) {
  it.shots = it.shots.map(([names, cap]) => ({ names: [].concat(names), cap, pics: [] }));
  Object.assign(it, { c: it.topics.join(' · '), w: 340, h: 225, s: 1, y: 0 });
}
function worksLoadShots(it) { // only once someone reaches the project
  if (it.loading) return;
  it.loading = true;
  for (const shot of it.shots) shot.pics = shot.names.map(name => { const pic = new Image(); pic.onload = () => { dirty = true; }; pic.src = `photos/works/${name}.jpg`; return pic; });
  if (it.demo) { it.demo.pic = new Image(); it.demo.pic.onload = () => { dirty = true; }; it.demo.pic.src = `photos/works/${it.demo.poster}.jpg`; } // the video's still, with a play button on it
}
function worksShot(x, shot, rx, ry, rw, rh, k) {
  const pic = shot.pics[shot.pics.length > 1 ? Math.round((1 - Math.abs(2 * Math.min(k / (1 - WORKS_FADE), 1) - 1)) * (shot.pics.length - 1)) : 0]; // shut and open again
  const grow = reduced ? 1 : 1 + k * .035, fit = Math.max(rw / pic.naturalWidth, rh / pic.naturalHeight) * grow, dw = pic.naturalWidth * fit, dh = pic.naturalHeight * fit;
  x.drawImage(pic, rx + (rw - dw) / 2, ry + (rh - dh) / 2, dw, dh);
}
function worksReel(x, it, rx, ry, rw, rh, now) { // the caller clips to the frame
  worksLoadShots(it);
  const ready = it.shots.filter(shot => shot.pics.every(pic => pic.naturalWidth));
  if (!ready.length) return;
  it.reelAt = it.reelAt || now;
  const run = reduced ? 0 : (now - it.reelAt) / WORKS_REEL_MS, at = Math.floor(run) % ready.length, k = run % 1, alpha = x.globalAlpha;
  worksShot(x, ready[at], rx, ry, rw, rh, k);
  if (ready.length > 1 && k > 1 - WORKS_FADE) { x.globalAlpha = alpha * (k - 1 + WORKS_FADE) / WORKS_FADE; worksShot(x, ready[(at + 1) % ready.length], rx, ry, rw, rh, 0); x.globalAlpha = alpha; }
}

/* ---------- Painted parts ---------- */
function worksPuffs(lit, dark, rim) {
  if (gateWorld) return gateWorld.puffSheet(lit, dark, rim);
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); // no baked clouds on this device: soft blobs
  for (const [a, b] of [[64, 64], [192, 64], [64, 192], [192, 192]]) { const l = x.createRadialGradient(a, b - 16, 4, a, b, 62); l.addColorStop(0, lit); l.addColorStop(.55, lit); l.addColorStop(1, `${lit}00`); x.fillStyle = l; x.fillRect(a - 64, b - 64, 128, 128); }
  return c;
}
function worksClouds(w, h, seed, sheet, shade, edge) { // a bank of billows, tops set by edge(0 to 1), filling in solid toward the bottom and fading out below that
  const c = document.createElement('canvas'), res = COARSE ? .6 : .8; c.width = Math.ceil(w * res); c.height = Math.ceil(h * res);
  const x = c.getContext('2d'), rnd = seeded(seed), puffs = [], unit = Math.min(w, h * 1.7), cell = sheet.width / 2; x.scale(res, res);
  for (let i = 0; i < 130; i++) { const u = rnd(); puffs.push([u * w, (edge(u) + rnd() * rnd() * (1 - edge(u))) * h, unit * (.17 + rnd() * .17), Math.floor(rnd() * 4)]); }
  puffs.sort((a, b) => a[1] - b[1]);
  const body = x.createLinearGradient(0, h * .5, 0, h * .78); body.addColorStop(0, `${shade}00`); body.addColorStop(1, shade);
  for (const [px, py, r, n] of puffs) x.drawImage(sheet, (n % 2) * cell, (n >> 1) * cell, cell, cell, px - r, py - r * .5, r * 2, r * 1.44);
  x.fillStyle = body; x.fillRect(0, h * .5, w, h * .5);
  const gone = x.createLinearGradient(0, h * .82, 0, h); gone.addColorStop(0, 'rgba(0,0,0,0)'); gone.addColorStop(1, 'rgba(0,0,0,1)');
  x.globalCompositeOperation = 'destination-out'; x.fillStyle = gone; x.fillRect(0, h * .82, w, h * .18);
  return c;
}
function worksStar(x, y, r, color, waist = .13) {
  g.fillStyle = color; g.beginPath();
  for (let i = 0; i < 4; i++) { const a = i * 1.5708 - 1.5708, b = a + 1.5708, m = a + .7854; const ax = x + Math.cos(a) * r, ay = y + Math.sin(a) * r, bx = x + Math.cos(b) * r, by = y + Math.sin(b) * r; if (!i) g.moveTo(ax, ay); g.quadraticCurveTo(x + Math.cos(m) * r * waist, y + Math.sin(m) * r * waist, bx, by); }
  g.closePath(); g.fill();
}
function worksWords(s, x, y, size, color = WORKS_CREAM, { font = WORKS_LABEL, weight = 400, align = 'center', spread = 0 } = {}) {
  g.font = `${weight} ${size}px ${font}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillStyle = color;
  try { g.letterSpacing = `${spread}px`; } catch { /* older browsers set it tighter */ }
  g.fillText(s, x, y);
  try { g.letterSpacing = '0px'; } catch { /* as above */ }
}
function worksPill(label, cx, cy, size, active, hovered, act) { // a soft pill with a white star at each compass point
  g.font = `400 ${size}px ${WORKS_LABEL}`; const w = g.measureText(label).width + size * 3.2, h = size * 2.5, x = cx - w / 2, y = cy - h / 2;
  const l = g.createLinearGradient(0, y, 0, y + h);
  if (active) { l.addColorStop(0, '#62d8c8'); l.addColorStop(1, WORKS_TEAL); } else { l.addColorStop(0, hovered ? '#3a709f' : WORKS_DUSK); l.addColorStop(1, hovered ? '#27527a' : '#1b3c63'); }
  g.fillStyle = l; g.beginPath(); g.roundRect(x, y, w, h, h / 2); g.fill();
  g.strokeStyle = WORKS_CREAM; g.lineWidth = 1.6; g.stroke();
  for (const [a, b] of [[x, cy], [x + w, cy], [cx, y], [cx, y + h]]) worksStar(a, b, size * .42, WORKS_CREAM);
  worksWords(label, cx, cy + size * .04, size, active ? WORKS_NAVY : WORKS_CREAM);
  if (act) works.hot.push({ x: x - 4, y: y - 8, w: w + 8, h: h + 16, act, label }); // tall enough for a thumb
  return w;
}
/* ---------- Crayon: a rough, broken outline, waxy strokes over the colour, and flecks where the paper shows through ---------- */
function worksRough(x, path, color, width, rnd) {
  x.strokeStyle = color; x.lineCap = 'round';
  for (let i = 0; i < 3; i++) { x.setLineDash([2 + rnd() * 10, 1 + rnd() * 5, 4 + rnd() * 14, 1 + rnd() * 4]); x.lineDashOffset = rnd() * 40; x.lineWidth = width * (.55 + rnd() * .6); x.stroke(path); }
  x.setLineDash([]);
}
/* ---------- Laying each screen out ---------- */
function worksWrapWords(text, size, width, tones) { // lines of words, with room left for the chips behind highlighted ones
  g.font = `700 ${size}px ${WORKS_BODY}`;
  const space = g.measureText(' ').width, chipPad = size * .3, lines = [[]]; let used = 0;
  for (const word of text.split(' ')) {
    const clean = word.replace(/[.,]/g, ''), tone = tones[clean], w = g.measureText(word).width + (tone === undefined ? 0 : chipPad * 2);
    if (used && used + space + w > width) { lines.push([]); used = 0; }
    lines[lines.length - 1].push({ s: word, w, tone }); used += (used ? space : 0) + w;
  }
  return { lines, space, chipPad };
}
function worksLayout() {
  const tall = W < H * .9, pad = tall ? Math.max(20, W * .07) : Math.max(24, W * .08);
  works.pages = [{ kind: 'hero' }, { kind: 'about' }, { kind: 'portfolio' }];
  for (const it of WORKS_WORDS.items) { it.on = works.filter === 'All' || it.tags.includes(works.filter); if (it.on) works.pages.push({ kind: 'work', it }); }
  works.pages.push({ kind: 'talk' });
  // About: the words on one side and the figure on the other, or stacked on a tall screen.
  const a = { title: tall ? Math.min(W * .17, H * .1) : Math.min(W * .075, H * .15), size: tall ? worksClamp(W * .056, 18, 30) : worksClamp(Math.min(W * .027, H * .05), 17, 40) };
  const colW = tall ? W - pad * 2 : W * .44, flow = worksWrapWords(WORKS_WORDS.about, a.size, colW, WORKS_WORDS.highlight), leading = a.size * 1.62;
  a.x = tall ? pad : W * .48; a.titleY = H * (tall ? .12 : .17); let y = a.titleY + a.title * .9 + a.size * .9; a.words = [];
  g.font = `700 ${a.size}px ${WORKS_BODY}`; // where each letter of a word starts, so the letters can arrive one by one
  flow.lines.forEach(line => { let x = a.x; for (const w of line) { a.words.push({ ...w, x, y, pad: flow.chipPad, chars: [...w.s].map((ch, j) => [ch, g.measureText(w.s.slice(0, j)).width]) }); x += w.w + flow.space; } y += leading; });
  a.pillY = y + a.size * .9; a.pillX = a.x + a.size * 5.1; works.about = a;
  // Portfolio: a title screen after Cyrill's reference, the word big in the middle with sparkles round it.
  const pSize = tall ? worksClamp(W * .04, 14, 19) : worksClamp(Math.min(W * .015, H * .027), 13, 20);
  g.font = `600 ${pSize}px ${WORKS_BODY}`;
  const pLines = wrapLines(WORKS_WORDS.portfolio, Math.min(W - pad * 2, 760) - pSize * 1.8);
  g.font = `400 100px ${WORKS_LABEL}`;
  const pillGap = tall ? 1.2 : 1.8, pillUnits = WORKS_WORDS.filters.reduce((n, f) => n + g.measureText(f).width / 100 + 3.2, 0) + pillGap * 2;
  works.portfolio = { size: pSize, lines: pLines, title: Math.min(W * (tall ? .23 : .19), H * .3) }; // drawn a quarter larger, and it must clear both edges
  // A work: one frame, as big as fits with its name beside or across it.
  const cardW = tall ? W - pad * 2 : Math.min(W * .52, H * .68 / .64), cardH = Math.round(cardW * .64), cardY = tall ? H * .2 : (H - cardH) / 2;
  let side = 1, n = 0; for (const it of WORKS_WORDS.items) { Object.assign(it, { cardW, cardH, side, n: ++n, x: tall ? pad : side ? W - pad - cardW : pad * 1.2, y: cardY }); if (it.on) side = 1 - side; }
  Object.assign(works, { tall, pad, pillSize: Math.min(tall ? 16 : worksClamp(W * .017, 13, 19), (W - pad * 1.5) / pillUnits), pillGap });
  works.page = worksClamp(works.page, 0, works.pages.length - 1);
}
/* ---------- Under the water: animated underwater scene (photos/water/water-00..14.webp) with live caustics, light rays, and rising glossy bubbles ---------- */
const WORKS_BOY_IMG = new Image();
WORKS_BOY_IMG.onload = () => { dirty = true; };
WORKS_BOY_IMG.src = 'boy.png';
const WORKS_WATER_FRAMES = Array.from({ length: 15 }, (_, k) => { const i = new Image(); i.onload = () => { dirty = true; }; i.src = `photos/water/water-${String(k).padStart(2, '0')}.webp`; return i; });
function worksPaintWater() { return document.createElement('canvas'); }
function worksBubble(bx, by, r, t, p, alpha = 1) {
  const wob = reduced ? 0 : Math.sin(t * 3.8 + p) * .065, rx = r * (1 + wob), ry = r * (1 - wob);
  g.save(); g.globalAlpha *= alpha;
  const glow = g.createRadialGradient(bx, by, r * .2, bx, by, r * 1.55);
  glow.addColorStop(0, 'rgba(60,235,255,.28)'); glow.addColorStop(1, 'rgba(60,235,255,0)');
  g.fillStyle = glow; g.beginPath(); g.arc(bx, by, r * 1.55, 0, 7); g.fill();
  const body = g.createRadialGradient(bx - r * .28, by - r * .28, r * .08, bx, by, r * 1.05);
  body.addColorStop(0, 'rgba(200,252,255,.62)'); body.addColorStop(.45, 'rgba(25,155,250,.22)'); body.addColorStop(.85, 'rgba(55,225,255,.55)'); body.addColorStop(1, 'rgba(180,250,255,.85)');
  g.fillStyle = body; g.strokeStyle = 'rgba(205,253,255,.9)'; g.lineWidth = Math.max(1.2, r * .11);
  g.beginPath(); g.ellipse(bx, by, rx, ry, -.2, 0, 7); g.fill(); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.92)'; g.beginPath(); g.ellipse(bx - rx * .36, by - ry * .34, Math.max(1.2, rx * .26), Math.max(.9, ry * .15), -.65, 0, 7); g.fill();
  if (r > 6) { g.fillStyle = 'rgba(215,255,255,.75)'; g.beginPath(); g.arc(bx + rx * .34, by + ry * .34, Math.max(1, r * .1), 0, 7); g.fill(); }
  g.restore();
}
function worksDrawWater(waterY, t) {
  const tall = works.tall, ready = WORKS_WATER_FRAMES.filter(im => im.complete && im.naturalWidth);
  const tailH = H * .42, base = g.createLinearGradient(0, waterY, 0, waterY + H + tailH);
  base.addColorStop(0, '#3ff6fd'); base.addColorStop(.16, '#158ee1'); base.addColorStop(.42, '#064baa'); base.addColorStop(.7, '#011892'); base.addColorStop(H / (H + tailH), '#00088d'); base.addColorStop(1, 'rgba(14,29,57,0)');
  g.fillStyle = base; g.fillRect(0, Math.max(0, waterY), W, H + tailH);
  const drawFrame = (im, alpha) => {
    if (!im || !im.naturalWidth) return;
    g.save(); g.globalAlpha = alpha;
    if (!tall) {
      const dw = Math.min(Math.round(580 * H / 720), Math.round(W * .47));
      g.drawImage(im, 0, 0, 580, 720, 0, waterY, dw, H);
      g.drawImage(im, 580, 0, 700, 720, dw - 1, waterY, W - dw + 1, H);
    } else {
      g.drawImage(im, 580, 0, 700, 720, 0, waterY, W, H);
      const a = works.about, clear = a.pillY + a.size * 1.45, oy = Math.max(clear - H * .03, H * .46), ch = Math.ceil(H - oy), cw = Math.ceil(Math.min(W * .92, ch * 580 / 720));
      if (!works.charSheet || works.charSheet.width !== cw || works.charSheet.height !== ch) { works.charSheet = document.createElement('canvas'); works.charSheet.width = cw; works.charSheet.height = ch; }
      const sc = works.charSheet.getContext('2d'); sc.clearRect(0, 0, cw, ch); sc.drawImage(im, 0, 0, 580, 720, 0, 0, cw, ch);
      sc.globalCompositeOperation = 'destination-out';
      const topFade = sc.createLinearGradient(0, 0, 0, ch * .2); topFade.addColorStop(0, '#000'); topFade.addColorStop(1, 'rgba(0,0,0,0)'); sc.fillStyle = topFade; sc.fillRect(0, 0, cw, ch * .2);
      const rightFade = sc.createLinearGradient(cw * .72, 0, cw, 0); rightFade.addColorStop(0, 'rgba(0,0,0,0)'); rightFade.addColorStop(1, '#000'); sc.fillStyle = rightFade; sc.fillRect(cw * .72, 0, cw * .28, ch);
      sc.globalCompositeOperation = 'source-over';
      g.drawImage(works.charSheet, 0, waterY + oy, cw, ch);
    }
    g.restore();
  };
  if (ready.length) {
    const u = reduced ? 0 : (.5 - .5 * Math.cos(t * 2.1)) * (ready.length - 1), i0 = Math.floor(u), i1 = Math.min(ready.length - 1, i0 + 1), f = u - i0;
    drawFrame(ready[i0], 1);
    if (i1 !== i0 && f > .01) drawFrame(ready[i1], f);
  }
  // The pictures end without a line: their bottom melts into the water's deepest colour, which the gradient above then fades into the sky.
  const melt = g.createLinearGradient(0, waterY + H * .7, 0, waterY + H); melt.addColorStop(0, 'rgba(0,8,141,0)'); melt.addColorStop(1, '#00088d');
  g.fillStyle = melt; g.fillRect(0, waterY + H * .7, W, H * .3 + 1);
  // Animated light shafts and surface caustic shimmer on the water.
  const x0 = tall ? W * .15 : Math.min(580 * H / 720, W * .47);
  g.save();
  for (const [rx, rw, sp, ph] of [[.56, .055, .9, 0], [.72, .042, 1.15, 2.1], [.86, .035, .8, 4.2]]) {
    const sway = reduced ? 0 : Math.sin(t * sp + ph) * W * .018, pulse = reduced ? .14 : .11 + .06 * Math.sin(t * 1.4 + ph);
    const sx = W * rx + sway, ray = g.createLinearGradient(0, waterY + H * .04, 0, waterY + H * .78);
    ray.addColorStop(0, `rgba(140,250,255,${pulse})`); ray.addColorStop(1, 'rgba(140,250,255,0)');
    g.fillStyle = ray; g.beginPath(); g.moveTo(sx, waterY + H * .04); g.lineTo(sx + W * rw, waterY + H * .04); g.lineTo(sx + W * rw * 1.9 - W * .04, waterY + H * .78); g.lineTo(sx - W * .04, waterY + H * .78); g.closePath(); g.fill();
  }
  for (let i = 0; i < 18; i++) {
    const u = (i + .5) / 18, cx = x0 + (W - x0) * ((u + (reduced ? 0 : Math.sin(t * .7 + i * 1.7) * .035)) % 1), cy = waterY + H * (.018 + (i % 5) * .032 + (reduced ? 0 : Math.cos(t * 1.6 + i) * .006));
    const rw = (W - x0) * (.035 + (i % 4) * .018) * (reduced ? 1 : .82 + .28 * Math.sin(t * 2.1 + i * 1.3)), rh = Math.max(2.5, H * (.005 + (i % 3) * .0035));
    g.fillStyle = i % 2 ? `rgba(185,255,255,${reduced ? .25 : .18 + .14 * Math.sin(t * 2.4 + i)})` : `rgba(45,235,255,${reduced ? .22 : .15 + .12 * Math.cos(t * 1.9 + i)})`;
    g.beginPath(); g.ellipse(cx, cy, rw, rh, (reduced ? 0 : Math.sin(t + i) * .06), 0, 7); g.fill();
  }
  g.restore();
}
function worksPaintSky() { // night: soft washes of blue and teal, and a dust of faint stars
  const c = document.createElement('canvas'), res = COARSE ? .6 : .8, cw = c.width = Math.ceil(W * res), ch = c.height = Math.ceil(H * res), x = c.getContext('2d'), rnd = seeded(31), reach = Math.max(cw, ch);
  const l = x.createLinearGradient(0, 0, 0, ch); l.addColorStop(0, '#0e1d39'); l.addColorStop(.6, WORKS_NAVY); l.addColorStop(1, '#1f4268'); x.fillStyle = l; x.fillRect(0, 0, cw, ch);
  for (let i = 0; i < 40; i++) { const px = rnd() * cw, py = rnd() * ch, r = reach * (.1 + rnd() * .26), tint = ['39,82,122', '63,193,176', '30,60,110', '39,82,122'][i % 4], w = x.createRadialGradient(px, py, 0, px, py, r); w.addColorStop(0, `rgba(${tint},${i % 4 === 1 ? .06 : .2})`); w.addColorStop(1, `rgba(${tint},0)`); x.fillStyle = w; x.fillRect(px - r, py - r, r * 2, r * 2); }
  for (let i = 0; i < 90; i++) { const px = rnd() * cw, py = rnd() * ch, r = reach * (.02 + rnd() * .07), tint = rnd() < .5 ? '8,18,44' : '58,110,160', w = x.createRadialGradient(px, py, r * .2, px, py, r); w.addColorStop(0, `rgba(${tint},.14)`); w.addColorStop(.8, `rgba(${tint},.1)`); w.addColorStop(1, `rgba(${tint},0)`); x.fillStyle = w; x.fillRect(px - r, py - r, r * 2, r * 2); } // pooled paint
  for (let i = 0; i < 34; i++) { const px = rnd() * cw, py = rnd() * ch; for (let k = 0; k < 12; k++) { const a = rnd() * 6.28, d = rnd() * rnd() * reach * .05; x.fillStyle = `rgba(5,12,34,${.2 + rnd() * .4})`; x.beginPath(); x.ellipse(px + Math.cos(a) * d * 1.6, py + Math.sin(a) * d, .4 + rnd() * rnd() * 1.8, .3 + rnd() * rnd() * 1.1, rnd() * 3, 0, 7); x.fill(); } } // flecks
  for (let i = 0; i < 300; i++) { x.fillStyle = `rgba(244,236,216,${.08 + rnd() * .3})`; x.beginPath(); x.arc(rnd() * cw, rnd() * ch, .3 + rnd() * rnd() * 1.1, 0, 7); x.fill(); }
  return c;
}
function worksPrepare() {
  works.sky = worksPaintSky();
  const cw = Math.ceil(W * 1.3), ch = Math.ceil(H * .95), valley = u => .2 + (.34 + Math.sin(u * 19) * .04) * Math.exp(-(((u - .5) / .26) ** 2));
  works.clouds = [
    worksClouds(cw, ch, 5, worksPuffs('#3a6a96', '#1b3c63', '#6fa3c4'), '#1b3c63', valley),
    worksClouds(cw, ch, 9, worksPuffs('#6a9dbd', '#27527a', '#a9cfdc'), '#27527a', valley),
    worksClouds(cw, ch, 13, worksPuffs('#a9cbd9', '#3f6f96', '#7fa6bd'), '#3f6f96', u => valley(u) + .05),
  ];
  const rnd = seeded(77); works.motes = Array.from({ length: COARSE ? 30 : 80 }, () => ({ x: rnd(), y: rnd(), d: .05 + rnd() * .3, r: 1 + rnd() * rnd() * 7, p: rnd() * 6.28, gold: rnd() < .2 }));
  works.bubbles = Array.from({ length: COARSE ? 16 : 28 }, (_, i) => ({ x: rnd(), y: rnd(), r: i < 5 ? 11 + rnd() * 11 : 2.2 + rnd() * rnd() * 11, rate: .38 + rnd() * .72, p: rnd() * 6.28, sat: i < 7 || rnd() < .35 }));
  worksLayout();
  works.water = worksPaintWater();
  worksBakeTitle();
  works.key = `${W}x${H}`;
  works.y = works.page * H;
}
function worksArcText(x, text, cx, cy, rx, ry, mid, size, top) { // letters set one by one along an ellipse
  x.font = `400 ${size}px ${WORKS_LABEL}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = WORKS_CREAM;
  const gap = size * .14, widths = [...text].map(ch => x.measureText(ch).width + gap), total = widths.reduce((a, b) => a + b);
  let run = -total / 2;
  [...text].forEach((ch, i) => {
    const along = (run + widths[i] / 2) / ((rx + ry) / 2), a = top ? mid + along : mid - along;
    x.save(); x.translate(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); x.rotate(top ? a + 1.5708 : a - 1.5708); x.fillText(ch, 0, 0); x.restore();
    run += widths[i];
  });
}
function worksBakeTitle() { // the swirl, the crescents, the vines and the word's glow are too slow to redraw every frame
  const tall = W < H * .9, c = document.createElement('canvas'); c.width = sceneCanvas.width; c.height = Math.ceil(H * pr); const x = c.getContext('2d'), cy = H * (tall ? .38 : .36), cx = W / 2, rnd = seeded(61), word = WORKS_WORDS.heroTitle; x.scale(pr, pr); x.lineCap = 'round';
  x.font = `400 100px ${WORKS_LABEL}`; const size = Math.min(W * (tall ? .25 : .19), H * .32, W * (tall ? .86 : .6) / (x.measureText(word).width / 100)); // a longer word shrinks, so its ring stays clear of the clouds
  x.font = `400 ${size}px ${WORKS_LABEL}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round';
  const half = Math.min(x.measureText(word).width / 2, W / 2 - 26), ring = half * 1.16, tilt = Math.min(.62, (cy - H * .05) / ring);
  // The hand-drawn strokes circling the word, on their own round sheet so they can turn slowly round it (squashed to the ring's tilt when drawn).
  const reach = ring * 2.3, L = Math.ceil(reach * 2), lines = document.createElement('canvas'); lines.width = lines.height = Math.ceil(L * Math.min(pr, 2)); const lx = lines.getContext('2d'); lx.scale(lines.width / L, lines.width / L); lx.lineCap = 'round'; lx.strokeStyle = 'rgba(63,193,176,.32)';
  for (let i = 0; i < (COARSE ? 50 : 90); i++) { const r = ring * (1.05 + rnd() * 1.1), a = rnd() * 6.28, len = .1 + rnd() * .28; lx.lineWidth = (1.2 + rnd() * 2.2) / Math.max(.4, tilt * 1.1) ** .5; lx.setLineDash([5 + rnd() * 26, 1 + rnd() * 5]); lx.beginPath(); lx.arc(L / 2, L / 2, r, a, a + len); lx.stroke(); }
  const crescent = (from, to, bulge) => { x.fillStyle = WORKS_TEAL; x.beginPath(); x.ellipse(cx, cy, ring, ring * tilt, 0, from, to, false); x.ellipse(cx, cy + bulge, ring * .98, ring * tilt, 0, to, from, true); x.closePath(); x.fill(); };
  x.shadowColor = 'rgba(63,193,176,.6)'; x.shadowBlur = 12 * pr;
  crescent(3.55, 5.75, size * .07); crescent(.4, 2.05, -size * .07);
  x.shadowBlur = 0;
  const roleSize = Math.max(13, Math.min(W * .022, H * .03));
  worksArcText(x, WORKS_WORDS.heroLine, cx, cy, ring * 1.14, Math.min(ring * tilt * 1.42, H * .27), 1.5708, roleSize, false);
  x.save(); x.translate(cx, cy); x.rotate(-.09); x.font = `400 ${size}px ${WORKS_LABEL}`; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.shadowColor = 'rgba(255,138,92,.5)'; x.shadowBlur = size * .18 * pr; x.fillStyle = '#0b1730'; x.fillText(word, size * .022, size * .036); x.shadowBlur = 0;
  x.fillStyle = WORKS_CORAL; x.fillText(word, 0, 0); x.restore();
  Object.assign(works, { titleBmp: c, titleSize: size, titleY: cy, titleHalf: half, titleLines: { c: lines, L, squash: tilt * 1.1 } });
}

/* ---------- Opening, moving, and clicking: one screen at a time ---------- */
const worksAbout = () => { $('#about').classList.add('no-keys'); $('#about').showModal(); };
$('#about').addEventListener('close', () => $('#about').classList.remove('no-keys'));
function openWorks(c, viaKeyboard) {
  const now = performance.now();
  document.body.classList.add('in-works'); // dialogs opened from here wear Projects' look
  works = { c, viaKeyboard, y: 0, page: 0, pull: 0, acc: 0, lock: 0, arrive: now, last: now, at: now, filter: 'All', hot: [], hover: null, key: '', flash: 1 };
  worksPrepare();
  Promise.all(['600 30px Poppins', '700 30px Poppins', '400 30px Righteous', '400 80px "Kaushan Script"'].map(f => document.fonts.load(f))).catch(() => {}).finally(() => { if (works) { worksLayout(); worksBakeTitle(); } }); // letter widths change once the font arrives
  hover = null; focusCard = null; glitch = 0; dirty = true;
  $('#btn-about').hidden = $('#btn-talk').hidden = true;
  live.textContent = 'Scroll, swipe or use the arrow keys to move one section at a time.';
  keyboardFocus(backBtn);
}
function closeWorks() {
  document.body.classList.remove('in-works');
  works = null; glitch = reduced ? 0 : .6; dirty = true;
  $('#btn-about').hidden = $('#btn-talk').hidden = false;
  live.textContent = ''; crt.style.cursor = 'grab';
}
function worksGo(i) {
  i = worksClamp(i, 0, works.pages.length - 1); dirty = true;
  if (i === works.page) return;
  works.page = i; works.arrive = performance.now(); works.hover = null;
  const p = works.pages[i]; if (p.it) p.it.reelAt = 0; // starts from its first picture
  live.textContent = { hero: WORKS_WORDS.name, about: `${WORKS_WORDS.aboutTitle}. ${WORKS_WORDS.about}`, portfolio: `${WORKS_WORDS.portfolioLabel}. ${WORKS_WORDS.portfolio}`, talk: `${WORKS_WORDS.talk}. ${WORKS_WORDS.email}`, work: p.it ? `${p.it.t}. Press Enter to open.` : '' }[p.kind];
}
function worksJump(i) { worksGo(i); works.y = works.page * H; works.lock = 0; } // no slide
function worksWheel(by) { // a wheel or trackpad moves one screen, then waits out the rest of the gesture
  const now = performance.now();
  if (now < works.lock) { works.acc = 0; return; }
  works.acc += by;
  if (Math.abs(works.acc) >= 60) { worksGo(works.page + Math.sign(works.acc)); works.acc = 0; works.lock = now + (reduced ? 200 : 850); }
}
function worksDrag(dy) { works.pull -= dy; const stuck = (works.page === 0 && works.pull < 0) || (works.page === works.pages.length - 1 && works.pull > 0); if (stuck) works.pull *= .7; dirty = true; }
function worksRelease(vy, at) { // far enough, or flicked: on to the next. Otherwise it settles back
  const flick = performance.now() - at < 90 && Math.abs(vy) > 5, dir = works.pull > H * .12 || (flick && vy < 0) ? 1 : works.pull < -H * .12 || (flick && vy > 0) ? -1 : 0;
  works.pull = 0; if (dir) worksGo(works.page + dir); dirty = true;
}
function worksHit(clientX, clientY) { const [sx, sy] = toScene(clientX, clientY); for (let i = works.hot.length - 1; i >= 0; i--) { const h = works.hot[i]; if (sx >= h.x && sx <= h.x + h.w && sy >= h.y && sy <= h.y + h.h) return h; } return null; }
function worksHover(clientX, clientY) { const h = worksHit(clientX, clientY); works.hover = h ? h.label : null; crt.style.cursor = h ? 'pointer' : 'grab'; }
function worksClick(clientX, clientY) { const h = worksHit(clientX, clientY); if (h) h.act(); }
function worksSetFilter(name) {
  works.filter = name; worksLayout(); works.y = works.page * H;
  live.textContent = `${name}: ${WORKS_WORDS.items.filter(i => i.on).length} projects.`;
}
function worksOpenItem(it) { it.reelAt = 0; openProject(it, false, true); }
function worksKey(e) {
  const by = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[e.key];
  if (by) { if (e.key === ' ' && document.activeElement === backBtn) return; e.preventDefault(); worksGo(works.page + by); return; }
  if (e.key === 'Home') { e.preventDefault(); worksGo(0); return; }
  if (e.key === 'End') { e.preventDefault(); worksGo(works.pages.length - 1); return; }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { const f = WORKS_WORDS.filters; worksSetFilter(f[(f.indexOf(works.filter) + (e.key === 'ArrowRight' ? 1 : f.length - 1)) % f.length]); return; }
  if (e.key === 'Enter' && document.activeElement !== backBtn) {
    const p = works.pages[works.page];
    if (p.kind === 'work') { e.preventDefault(); worksOpenItem(p.it); } else if (p.kind === 'about') { e.preventDefault(); worksAbout(); } else if (p.kind === 'talk') { e.preventDefault(); $('#contact').showModal(); }
  }
}

/* ---------- Drawing ---------- */
const worksScript = (s, x, y, size, rotate = -.06, align = 'center') => {
  g.save(); g.translate(x, y); g.rotate(rotate); g.font = `400 ${size}px ${WORKS_SCRIPT}`; g.textAlign = align; g.textBaseline = 'middle';
  g.fillStyle = '#0b1730'; g.fillText(s, size * .03, size * .04); g.fillStyle = WORKS_CORAL; g.fillText(s, 0, 0); g.restore();
};
/* ---------- The footer: a painted wave of night with grain and sparkles, the name, the address, and icon buttons ---------- */
const WORKS_ICONS = { // drawn in navy on a cream disc of radius r
  LinkedIn: (x, y, r) => { g.fillStyle = WORKS_NAVY; g.fillRect(x - r * .38, y - r * .12, r * .16, r * .5); g.beginPath(); g.arc(x - r * .3, y - r * .32, r * .1, 0, 7); g.fill(); g.lineWidth = r * .16; g.strokeStyle = WORKS_NAVY; g.beginPath(); g.moveTo(x - r * .06, y + r * .38); g.lineTo(x - r * .06, y - r * .1); g.moveTo(x - r * .06, y + r * .05); g.quadraticCurveTo(x + r * .05, y - r * .14, x + r * .2, y - r * .12); g.quadraticCurveTo(x + r * .36, y - r * .1, x + r * .36, y + r * .1); g.lineTo(x + r * .36, y + r * .38); g.stroke(); },
  GitHub: (x, y, r) => { g.fillStyle = WORKS_NAVY; g.beginPath(); g.ellipse(x, y + r * .06, r * .42, r * .34, 0, 0, 7); g.fill(); for (const d of [-1, 1]) { g.beginPath(); g.moveTo(x + d * r * .4, y - r * .02); g.lineTo(x + d * r * .36, y - r * .46); g.lineTo(x + d * r * .1, y - r * .24); g.fill(); } g.fillStyle = WORKS_CREAM; for (const d of [-1, 1]) { g.beginPath(); g.ellipse(x + d * r * .16, y + r * .06, r * .06, r * .09, 0, 0, 7); g.fill(); } g.fillStyle = WORKS_NAVY; g.fillRect(x - r * .1, y + r * .36, r * .2, r * .2); }, // a cat's head, after the mark
  Facebook: (x, y, r) => { g.fillStyle = WORKS_NAVY; g.font = `700 ${r * 1.15}px ${WORKS_BODY}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('f', x + r * .04, y + r * .08); },
  Discord: (x, y, r) => { g.fillStyle = WORKS_NAVY; g.beginPath(); g.roundRect(x - r * .46, y - r * .3, r * .92, r * .62, r * .26); g.fill(); g.beginPath(); g.moveTo(x - r * .42, y + r * .1); g.lineTo(x - r * .3, y + r * .42); g.lineTo(x - r * .12, y + r * .28); g.moveTo(x + r * .42, y + r * .1); g.lineTo(x + r * .3, y + r * .42); g.lineTo(x + r * .12, y + r * .28); g.fill(); g.fillStyle = WORKS_CREAM; for (const d of [-1, 1]) { g.beginPath(); g.ellipse(x + d * r * .17, y, r * .08, r * .1, 0, 0, 7); g.fill(); } },
  Gmail: (x, y, r) => { g.strokeStyle = WORKS_NAVY; g.lineWidth = r * .12; g.lineJoin = 'round'; g.beginPath(); g.roundRect(x - r * .44, y - r * .3, r * .88, r * .6, r * .08); g.stroke(); g.beginPath(); g.moveTo(x - r * .4, y - r * .24); g.lineTo(x, y + r * .06); g.lineTo(x + r * .4, y - r * .24); g.stroke(); },
};
function worksFooterBake() { // the wave, its grain and its sparkles, once per size
  const w = Math.ceil(W), h = Math.ceil(H * .5), c = document.createElement('canvas'), res = COARSE ? .6 : .8, x = c.getContext('2d'), rnd = seeded(97); c.width = Math.ceil(w * res); c.height = Math.ceil(h * res); x.scale(res, res);
  const wave = new Path2D(); wave.moveTo(0, h * .16); wave.bezierCurveTo(w * .22, h * .02, w * .42, h * .18, w * .6, h * .5); wave.bezierCurveTo(w * .74, h * .74, w * .9, h * .62, w, h * .4); wave.lineTo(w, h); wave.lineTo(0, h); wave.closePath();
  const fill = x.createLinearGradient(0, 0, 0, h); fill.addColorStop(0, '#1d4470'); fill.addColorStop(.5, '#14284b'); fill.addColorStop(1, '#0b1730'); x.fillStyle = fill; x.fill(wave);
  x.save(); x.clip(wave);
  for (let i = 0; i < (COARSE ? 2500 : 6000); i++) { x.fillStyle = rnd() < .5 ? `rgba(120,170,215,${.04 + rnd() * .1})` : `rgba(4,10,26,${.08 + rnd() * .16})`; x.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2.2, 1 + rnd() * 2.2); } // canvas-like grain
  for (let i = 0; i < 26; i++) { const px = rnd() * w, py = h * (.25 + rnd() * .75), r = 2 + rnd() * 4; x.fillStyle = `rgba(244,236,216,${.25 + rnd() * .4})`; x.beginPath(); for (let k = 0; k < 4; k++) { const a = k * 1.5708, b = a + 1.5708; x.lineTo(px + Math.cos(a) * r, py + Math.sin(a) * r); x.quadraticCurveTo(px + Math.cos(a + .785) * r * .14, py + Math.sin(a + .785) * r * .14, px + Math.cos(b) * r, py + Math.sin(b) * r); } x.fill(); } // sparkles
  x.restore();
  worksRough(x, wave, 'rgba(111,163,196,.55)', 4, rnd); // a crayon edge along the top
  return c;
}
function worksFooter(sy, t) {
  if (!works.footer || works.footer.key !== `${W}x${H}`) works.footer = { c: worksFooterBake(), key: `${W}x${H}` };
  const top = H * .56 + sy * 1.2; g.drawImage(works.footer.c, 0, top, W, H * .5);
  const tall = works.tall, logo = worksClamp(Math.min(W * .06, H * .085), 28, 72), left = works.pad + 6, small = worksClamp(H * .021, 12, 16), name = WORKS_WORDS.name.toUpperCase();
  const ly = top + H * (tall ? .27 : .25);
  // The name, cream with a coral shadow, and a teal sparkle at its end.
  worksWords(name, left + logo * .04, ly + logo * .06, logo, WORKS_CORAL, { align: 'left' }); worksWords(name, left, ly, logo, WORKS_CREAM, { align: 'left' });
  g.font = `400 ${logo}px ${WORKS_LABEL}`; const nw = g.measureText(name).width; worksStar(left + nw + logo * .36, ly + logo * .16, logo * .32, WORKS_TEAL, .1); worksStar(left + nw + logo * .62, ly - logo * .2, logo * .12, WORKS_CREAM, .1);
  // The address, with a little envelope.
  const my = ly + logo * .7 + small * 1.4, ew = small * 1.5, eh = small * 1.05; g.strokeStyle = WORKS_CREAM; g.lineWidth = 1.6; g.lineJoin = 'round'; g.beginPath(); g.roundRect(left, my - eh / 2, ew, eh, 2); g.stroke(); g.beginPath(); g.moveTo(left + 2, my - eh / 2 + 2); g.lineTo(left + ew / 2, my + eh * .1); g.lineTo(left + ew - 2, my - eh / 2 + 2); g.stroke();
  worksWords(WORKS_WORDS.email, left + ew + small * .7, my, small * 1.1, WORKS_CREAM, { align: 'left', font: WORKS_BODY, weight: 600 });
  if (works.k > .7) works.hot.push({ x: left, y: my - small, w: ew + small * .7 + small * 1.1 * WORKS_WORDS.email.length * .58, h: small * 2, act: () => window.open(WORKS_LINKS().Gmail, '_blank', 'noopener'), label: 'footer-mail' });
  worksWords('ALL RIGHTS RESERVED © 2026', left, my + small * 2.1, small * .85, 'rgba(244,236,216,.78)', { align: 'left', spread: small * .32, font: WORKS_BODY, weight: 600 });
  // The icon buttons: in a row on the right, or under the rest when tall. Each lifts a little under the pointer.
  const links = WORKS_LINKS(), names = Object.keys(WORKS_ICONS).filter(n => links[n]), r = worksClamp(Math.min(W * .02, H * .032), 17, 26), gap = r * .8;
  const rowW = names.length * r * 2 + (names.length - 1) * gap, x0 = tall ? left + r : W - works.pad * 1.6 - rowW + r, iy = tall ? my + small * 4.4 + r : my + small * 1.2;
  names.forEach((n, i) => {
    const on = works.hover === `footer-${n}`, cx = x0 + i * (r * 2 + gap), cy = iy - (on ? 4 : 0);
    g.fillStyle = 'rgba(5,12,30,.45)'; g.beginPath(); g.arc(cx + 2, cy + 4, r, 0, 7); g.fill();
    g.fillStyle = on ? '#ffffff' : WORKS_CREAM; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill();
    if (on) { g.strokeStyle = WORKS_TEAL; g.lineWidth = 2.5; g.stroke(); }
    g.save(); WORKS_ICONS[n](cx, cy, r); g.restore();
    if (works.k > .7) works.hot.push({ x: cx - r - 4, y: iy - r - 4, w: r * 2 + 8, h: r * 2 + 8, act: () => window.open(links[n], '_blank', 'noopener'), label: `footer-${n}` });
  });
}
const WORKS_LINKS = () => Object.fromEntries([...document.querySelectorAll('#contact .socials a')].map(a => [a.textContent.trim(), a.href])); // the Say hello dialog's links, so they live in one place
const WORKS_DRAW = {
  hero(p, sy, k, now, t) {
    const shift = sy * .55, rise = reduced ? 1 : 1 - (1 - worksClamp((t - .25) / 1.1, 0, 1)) ** 3, cy = works.titleY + shift + (1 - rise) * 40, half = works.titleHalf, size = works.titleSize;
    g.globalAlpha = k * rise;
    const ln = works.titleLines; // the strokes turn slowly, two copies at different speeds so they seem to drift past each other
    for (const [speed, grow, alpha] of [[.05, 1, 1], [-.03, 1.12, .55]]) { g.save(); g.globalAlpha = k * rise * alpha; g.translate(W / 2, works.titleY + shift + (1 - rise) * 40); g.scale(1, ln.squash); g.rotate(reduced ? 0 : t * speed); g.drawImage(ln.c, -ln.L * grow / 2, -ln.L * grow / 2, ln.L * grow, ln.L * grow); g.restore(); }
    g.drawImage(works.titleBmp, 0, shift + (1 - rise) * 40, W, H);
    const tw = n => reduced ? 1 : .86 + .14 * Math.sin(t * 2 + n), glow = (x, y, r, n) => { const l = g.createRadialGradient(x, y, 0, x, y, r * 1.6); l.addColorStop(0, 'rgba(63,193,176,.4)'); l.addColorStop(1, 'rgba(63,193,176,0)'); g.fillStyle = l; g.fillRect(x - r * 1.6, y - r * 1.6, r * 3.2, r * 3.2); worksStar(x, y, r * tw(n), WORKS_TEAL, .1); };
    const big = works.tall ? .17 : .24;
    glow(Math.max(24, W / 2 - half * 1.12), cy - size * (works.tall ? .72 : -.1), size * big, 0); glow(Math.max(24, W / 2 - half * .9), cy - size * (works.tall ? 1 : -.5), size * .1, 1); glow(Math.min(W - 24, W / 2 + half * 1.12), cy - size * (works.tall ? .58 : .12), size * big * .85, 2); glow(Math.min(W - 24, W / 2 + half * .86), cy - size * (works.tall ? .95 : -.34), size * big * (works.tall ? .6 : 1), 3);
    g.globalAlpha = k;
    works.clouds.forEach((c, i) => g.drawImage(c, -W * .15, H * [.46, .58, .7][i] + sy * [.5, .85, 1.25][i], W * 1.3, H * .95));
    const hint = worksClamp(H * .022, 13, 18), bob = reduced ? 0 : Math.sin(t * 2.4) * 4; g.globalAlpha = k * k * worksClamp(t - 1, 0, 1);
    worksWords(COARSE ? 'Swipe up' : 'Scroll down', W / 2, H * .9 + bob * .3 + sy, hint, WORKS_CREAM, { spread: hint * .12 }); worksStar(W / 2, H * .9 + hint * 1.4 + bob + sy, hint * .5, WORKS_CREAM);
    g.globalAlpha = 1;
  },
  about(p, sy, k, now, t, since) {
    const a = works.about;
    g.globalAlpha = k;
    for (const b of works.bubbles) { // rising past
      const sway = reduced ? 0 : Math.sin(t * b.rate * 2.2 + b.p) * (6 + b.r * .35);
      const bx = (works.tall ? W * (.22 + b.x * .72) : W * (.47 + b.x * .49)) + sway;
      const by = ((b.y * H * 1.15 - (reduced ? 0 : t * b.rate * H * .085)) % H + H) % H + sy;
      const page = by - sy, nearText = page > a.titleY - a.title * .7 && page < a.pillY + a.size * 1.6 && (works.tall || bx < W * .91);
      const fadeTop = worksClamp((page - H * .03) / (H * .08), 0, 1), alpha = fadeTop * (nearText ? .28 : .95);
      if (alpha > .04) {
        worksBubble(bx, by, b.r, t, b.p, alpha);
        if (b.sat && b.r > 6) worksBubble(bx + b.r * .78, by + b.r * .42, Math.max(2.2, b.r * .28), t, b.p + 1.7, alpha * .9);
      }
    }
    const head = reduced ? 1 : worksEase(since / 500);
    g.globalAlpha = k * head; worksScript(WORKS_WORDS.aboutTitle, a.x + a.title * .05, a.titleY + sy + (1 - head) * 30, a.title, -.05, 'left');
    // The words arrive a letter at a time, each rising and turning upright as it lands, the way her paragraph settles in.
    g.font = `700 ${a.size}px ${WORKS_BODY}`; g.textAlign = 'left'; g.textBaseline = 'middle';
    const land = i => reduced ? 1 : worksEase((since - 260) / 360 - i * .013);
    let li = 0;
    for (const w of a.words) {
      const first = land(li), chip = w.tone !== undefined, x0 = w.x + (chip ? w.pad : 0);
      if (chip && first > 0) { g.globalAlpha = k * first; g.fillStyle = [WORKS_CORAL, WORKS_TEAL, '#7fb0d0'][w.tone]; g.beginPath(); g.roundRect(w.x, w.y + sy - a.size * .76, w.w * (.4 + .6 * first), a.size * 1.52, a.size * .28); g.fill(); }
      for (const [ch, off] of w.chars) {
        const e = land(li++); if (e <= 0) continue;
        g.save(); g.globalAlpha = k * e; g.translate(x0 + off, w.y + sy + (1 - e) * a.size * .9); g.rotate((1 - e) * .4);
        if (!chip) { g.fillStyle = 'rgba(4,16,58,.55)'; g.fillText(ch, 1.5, 2.5); }
        g.fillStyle = chip ? WORKS_NAVY : WORKS_CREAM; g.fillText(ch, 0, 0); g.restore();
      }
      li++; // the space
    }
    g.globalAlpha = k * (reduced ? 1 : worksEase((since - 260 - li * 4.7 - 200) / 400));
    worksPill(WORKS_WORDS.aboutMore, a.pillX, a.pillY + sy, works.pillSize, false, works.hover === WORKS_WORDS.aboutMore, k > .7 ? worksAbout : null);
    g.globalAlpha = 1;
  },
  portfolio(p, sy, k, now, t, since) {
    const o = works.portfolio, tall = works.tall, arrive = n => reduced ? 1 : worksEase((since - n) / 600), cy = H * (tall ? .32 : .36) + sy * .6;
    // Sparkles round the word: four big yellow ones close in, a scatter of small cream ones twinkling further out.
    const span = o.title * 1.7, tw = n => reduced ? 1 : .75 + .25 * Math.sin(t * 2.2 + n * 1.9);
    const sparks = [[-.62, -.55, .2, 1], [-.75, -.2, .13, 1], [.66, .42, .2, 1], [.78, .08, .08, 1], [-.3, .8, .05, 0], [.1, -.85, .06, 0], [.95, -.7, .05, 0], [-1.05, .45, .05, 0], [.4, .95, .045, 0], [-.9, -.95, .04, 0], [1.15, .5, .04, 0], [.2, .62, .035, 0]];
    sparks.forEach(([dx, dy, r, gold], i) => { const e = arrive(250 + i * 50); if (e <= 0) return; g.globalAlpha = k * e; worksStar(W / 2 + dx * span * (tall ? .55 : 1), cy + dy * o.title * .8, o.title * r * tw(i) * (.6 + .4 * e), gold ? '#ffd98a' : WORKS_CREAM, .12); });
    // The word, big and tilted, settling in from slightly lower.
    const e = arrive(80); g.globalAlpha = k * e; worksScript(WORKS_WORDS.portfolioTitle, W / 2, cy + (1 - e) * 40, o.title * (1.25 + .1 * (1 - e)), -.08);
    // Under it: the line about the projects on teal strips, and the filters.
    let y = H * (tall ? .6 : .64) + sy;
    o.lines.forEach((line, i) => {
      g.font = `600 ${o.size}px ${WORKS_BODY}`; const sw = g.measureText(line).width + o.size * 1.8, sh = o.size * 2.1, f = arrive(500 + i * 90);
      g.globalAlpha = k * f; g.fillStyle = 'rgba(5,12,30,.4)'; g.beginPath(); g.roundRect(W / 2 - sw / 2 + 3, y + 5 + (1 - f) * 20, sw, sh, sh / 2); g.fill();
      g.fillStyle = WORKS_TEAL; g.beginPath(); g.roundRect(W / 2 - sw / 2, y + (1 - f) * 20, sw, sh, sh / 2); g.fill();
      worksWords(line, W / 2, y + sh / 2 + o.size * .04 + (1 - f) * 20, o.size, '#0b2e2a', { font: WORKS_BODY, weight: 600 });
      y += sh + o.size * .45;
    });
    g.font = `400 ${works.pillSize}px ${WORKS_LABEL}`; const widths = WORKS_WORDS.filters.map(f => g.measureText(f).width + works.pillSize * 3.2), space = works.pillSize * works.pillGap, total = widths.reduce((a, b) => a + b) + space * (widths.length - 1);
    let x = (W - total) / 2; y += works.pillSize * 2.2;
    g.globalAlpha = k * arrive(700 + o.lines.length * 90);
    WORKS_WORDS.filters.forEach((f, i) => { worksPill(f, x + widths[i] / 2, y, works.pillSize, works.filter === f, works.hover === f, k > .7 ? () => worksSetFilter(f) : null); x += widths[i] + space; });
    g.globalAlpha = 1;
  },
  work(p, sy, k, now, t) {
    const it = p.it, { cardW, cardH, x } = it, top = it.y + sy, hov = works.hover === it.t, lean = (it.side ? 1 : -1) * (1 - k) * .05;
    it.lift = (it.lift || 0) + ((hov ? 1 : 0) - (it.lift || 0)) * .14;
    g.save(); g.globalAlpha = k;
    g.translate(x + cardW / 2, top + cardH / 2 - it.lift * 6); g.rotate(lean); const grow = 1 + it.lift * .018; g.scale(grow, grow); g.translate(-cardW / 2, -cardH / 2);
    for (const [more, a] of [[22, .07], [14, .1], [7, .13]]) { g.fillStyle = `rgba(5,12,30,${a * 1.6 * k})`; g.beginPath(); g.roundRect(-more, -more + 12, cardW + more * 2, cardH + more * 2, 18 + more); g.fill(); } // a soft shadow, without a blur on every frame
    g.fillStyle = '#0b1730'; g.beginPath(); g.roundRect(0, 0, cardW, cardH, 18); g.fill();
    g.save(); g.beginPath(); g.roundRect(0, 0, cardW, cardH, 18); g.clip();
    worksReel(g, it, 0, 0, cardW, cardH, now);
    if (it.lift > .01) { const sweep = ((now - (it.hovAt || now)) / 900) % 1, band = cardW * (sweep * 1.8 - .4), l = g.createLinearGradient(band - 120, 0, band + 120, cardH * .3); l.addColorStop(0, 'rgba(255,240,200,0)'); l.addColorStop(.5, `rgba(255,240,200,${.28 * it.lift})`); l.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = l; g.fillRect(0, 0, cardW, cardH); }
    g.restore();
    g.strokeStyle = WORKS_CREAM; g.lineWidth = 2.5; g.beginPath(); g.roundRect(0, 0, cardW, cardH, 18); g.stroke();
    g.strokeStyle = 'rgba(244,236,216,.55)'; g.lineWidth = 1; g.beginPath(); g.roundRect(9, 9, cardW - 18, cardH - 18, 11); g.stroke();
    const twinkle = reduced ? 1 : 1 + Math.sin(now / 500 + it.n) * .12;
    for (const [a, b] of [[9, 9], [cardW - 9, 9], [9, cardH - 9], [cardW - 9, cardH - 9]]) worksStar(a, b, 12 * twinkle, WORKS_TEAL);
    g.restore();
    if (k > .7) works.hot.push({ x, y: top, w: cardW, h: cardH, act: () => worksOpenItem(it), label: it.t });
    // The name, on cream blocks that step down just over the frame's outer edge, most of each in the open sky so the picture stays clear.
    const right = !works.tall && !it.side, words = it.t.toUpperCase().split(' '), room = right ? W - works.pad * 1.5 - (x + cardW) : x - works.pad * .6;
    g.font = `400 100px ${WORKS_LABEL}`; const unit = Math.max(...words.map((s, i) => g.measureText(s).width / 100 + .9 + i * .6)); // the widest block, with its step
    const size = works.tall ? worksClamp(W * .082, 24, 40) : Math.min(worksClamp(Math.min(W * .042, H * .09), 22, 58), room / .8 / unit), blockH = size * 1.5, nameTop = works.tall ? top + cardH - blockH * .7 : top + cardH * .4;
    g.save(); g.globalAlpha = k; g.translate((1 - k) * (it.side ? -46 : 46), sy * .25);
    words.forEach((word, i) => {
      g.font = `400 ${size}px ${WORKS_LABEL}`; const w = g.measureText(word).width + size * .9, y = nameTop + i * (blockH + 5), over = Math.min(w * .2, size * 1.2); // how far a block reaches over the picture
      const px = works.tall ? (i % 2 ? W - works.pad - w - 6 : works.pad + 6) : right ? Math.min(x + cardW - over + i * size * .6, W - works.pad * 1.5 - w) : Math.max(x + over - w - i * size * .6, works.pad * .6);
      g.fillStyle = 'rgba(5,12,30,.45)'; g.beginPath(); g.roundRect(px + 3, y + 5, w, blockH, 10); g.fill();
      g.fillStyle = WORKS_CREAM; g.beginPath(); g.roundRect(px, y, w, blockH, 10); g.fill();
      worksWords(word, px + w / 2, y + blockH / 2 + size * .04, size, WORKS_NAVY);
      if (k > .7) works.hot.push({ x: px, y: y + sy * .25, w, h: blockH, act: () => worksOpenItem(it), label: it.t });
    });
    const tagY = nameTop + words.length * (blockH + 5) + size * .62, tagSize = worksClamp(W * .012, 11, 14);
    g.font = `400 ${size}px ${WORKS_LABEL}`; const last = g.measureText(words[words.length - 1]).width + size * .9, lastOver = Math.min(last * .2, size * 1.2), step = (words.length - 1) * size * .6; // under the last block's outer end
    let tagX = works.tall ? W - works.pad - 8 : right ? Math.min(x + cardW - lastOver + step, W - works.pad * 1.5 - last) + last : Math.max(x + lastOver - last - step, works.pad * .6);
    for (const tag of (right || works.tall ? [...it.topics].reverse() : it.topics)) {
      g.font = `400 ${tagSize}px ${WORKS_LABEL}`; const w = g.measureText(tag).width + tagSize * 2.2, at = right || works.tall ? tagX - w / 2 : tagX + w / 2, h = tagSize * 2.1, left = at - w / 2;
      g.fillStyle = WORKS_TEAL; g.beginPath(); g.roundRect(left, tagY - h / 2, w, h, h / 2); g.fill();
      worksWords(tag, at, tagY + tagSize * .04, tagSize, '#0b2e2a');
      tagX += (right || works.tall ? -1 : 1) * (w + 8);
    }
    g.restore();
  },
  talk(p, sy, k, now, t) {
    g.globalAlpha = k;
    works.clouds.slice(0, 2).forEach((c, i) => { g.save(); g.translate(-W * .15, H * (i ? .36 : .46) + sy * (i ? 1.1 : .7)); g.scale(1, -1); g.drawImage(c, 0, 0, W * 1.3, H * .95); g.restore(); });
    const size = Math.min(W * (works.tall ? .19 : .12), H * .2), cy = H * .36 + sy;
    worksWords(WORKS_WORDS.ask, W / 2, cy - size * .85, Math.max(13, Math.min(W * .032, H * .036)), WORKS_CREAM, { spread: 1.5 });
    worksScript(WORKS_WORDS.talk, W / 2, cy, size);
    worksPill('Contact', W / 2, cy + size * .95, worksClamp(W * .02, 14, 22), works.hover === 'Contact', works.hover === 'Contact', k > .7 ? () => $('#contact').showModal() : null);
    worksFooter(sy, t);
    g.globalAlpha = 1;
  },
};
function drawWorks(now) {
  if (works.key !== `${W}x${H}`) worksPrepare();
  const dt = Math.min(.05, (now - works.last) / 1000), goal = works.page * H + works.pull; works.last = now;
  works.y += (goal - works.y) * (reduced || works.pull ? 1 : 1 - Math.exp(-dt * 6.5));
  if (Math.abs(goal - works.y) < .4) works.y = goal;
  works.hot = [];
  const y = works.y, t = (now - works.at) / 1000, since = now - works.arrive;
  g.drawImage(works.sky, 0, 0, W, H);
  for (const m of works.motes) { const py = ((m.y * H - y * m.d) % H + H) % H, tw = reduced ? .8 : .55 + .45 * Math.sin(t * (1 + m.d * 3) + m.p); g.globalAlpha = tw * .9; worksStar(m.x * W, py, m.r + 1.5, m.gold ? WORKS_TEAL : WORKS_CREAM); } g.globalAlpha = 1;
  const waterY = H - y; // the second screen is where the water starts; it slides with the page
  if (waterY > -H * 1.45 && waterY < H) worksDrawWater(waterY, t);
  // The clouds you sink through: solid over the sea's top edge the whole way, so no line ever shows; as the About screen settles they
  // rise off the top instead of fading, and at the title screen they hand over to its own clouds.
  const settle = worksClamp(waterY / (H * .35), 0, 1), fadeTop = worksClamp((H * 1.15 - waterY) / (H * .4), 0, 1);
  if (fadeTop > .01 && waterY > -H * .1) { const hh = H * .95, cy = waterY - hh * .64 - (1 - settle) ** 2 * hh * .34; g.globalAlpha = fadeTop; works.clouds.forEach((c, i) => g.drawImage(c, -W * (.15 + i * .05), cy + i * H * .04, W * (1.3 + i * .1), hh)); g.globalAlpha = 1; }
  const join = waterY + H; // where the water gives way to the sky: bubbles keep rising through it, so the two read as one place
  if (join > -H * .3 && join < H * 1.3) works.bubbles.slice(0, 14).forEach((b, i) => {
    const rise = H * .7, travel = (reduced ? b.p * 40 : t * (30 + b.rate * 50) + b.p * 97) % rise, by = join + H * .25 - travel, bx = W * (.06 + ((b.x + i * .37) % 1) * .88) + (reduced ? 0 : Math.sin(t * 1.3 + b.p) * 10);
    const f = Math.sin(Math.PI * travel / rise); if (f > .02) worksBubble(bx, by, Math.max(2, b.r * .7), t, b.p, f * .85);
  });
  works.pages.forEach((p, i) => {
    const sy = i * H - y; if (Math.abs(sy) >= H) return;
    if (p.it) { const was = p.it.wasHover; p.it.wasHover = works.hover === p.it.t; if (p.it.wasHover && !was) p.it.hovAt = now; }
    works.k = worksEase(1 - Math.abs(sy) / H); WORKS_DRAW[p.kind](p, sy, works.k, now, t, i === works.page ? since : 0);
  });
  // Where you are: a dot for each screen. Tap one to go there.
  const n = works.pages.length, step = Math.min(20, H * .6 / n), rx = W - Math.max(13, W * .028), top = H / 2 - step * (n - 1) / 2;
  for (let i = 0; i < n; i++) {
    const dy = top + i * step, on = i === works.page;
    if (on) worksStar(rx, dy, 8, WORKS_CORAL, .12); else { g.fillStyle = 'rgba(244,236,216,.45)'; g.beginPath(); g.arc(rx, dy, 2.6, 0, 7); g.fill(); }
    works.hot.push({ x: rx - 15, y: dy - step / 2, w: 30, h: step, act: () => worksGo(i), label: `dot${i}` });
  }
  // Coming through the door: the dark it left on eases away.
  works.flash = Math.max(0, 1 - (now - works.at) / (reduced ? 1 : 900));
  if (works.flash > 0) { g.globalAlpha = worksEase(works.flash); g.fillStyle = WORKS_NAVY; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
}

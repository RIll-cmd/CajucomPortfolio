/* Sound and music. Everything is a file made in advance (audio/), played through the TV's audioCtx, so the volume dial and the Sound button control it all.
   Nothing here changes the boxes: each frame it compares their state with the last frame's and plays what changed. */
const SOUND_FX = ['tv_on', 'tv_off', 'channel', 'dial', 'dive_in', 'arrive', 'dive_out', 'hover', 'select', 'open', 'back', 'story', 'sticker', 'close', 'copy',
  'gate_load', 'gate_arrive', 'gate_door', 'gate_enter', 'works_page', 'works_tick', 'book_flip', 'book_pop', 'book_world', 'tome_open', 'tome_turn', 'tome_pop',
  'res_glass', 'res_title', 'res_world', 'res_hold', 'res_flash', 'res_read',
  'meow_1', 'meow_2', 'meow_3', 'splash', 'pg_windmill', 'pg_work', 'pg_school', 'pg_cert', 'pg_award', 'pg_skills'];
// Music per place. Projects has three: the gate, the night sky, and the water (the sky's music, heard from under the surface).
const SOUND_MUSIC_LEVEL = .55; // raised from .32 at Cyrill's request
const SOUND_MUSIC = { room: 'board', board: 'board', gate: 'gate', sky: 'sky', water: 'sky', notebook: 'notebook', tome: 'tome', resume: 'resume' }; // the room hears the board's music through the TV's speaker
// Background sound per place, up to two loops at once. The notebook's depends on its world: Home, Food, Up late, Places, My people.
const SOUND_AMB = { gate: ['amb_gate'], sky: ['amb_gate'], water: ['amb_water'], tome: ['amb_tavern', 'amb_candle'], resume: ['amb_server'] };
const SOUND_BOOK_AMB = [['amb_forest'], ['amb_food'], [], ['amb_sea'], ['amb_camp']];
const SOUND_PAGES = { Summary: 'pg_windmill', Experience: 'pg_work', Education: 'pg_school', Certifications: 'pg_cert', Awards: 'pg_award', Skills: 'pg_skills' }; // Experiences: each chapter's own sound as its page turns
const SOUND_LOUD = { hover: .35, story: .6, works_tick: .5, meow_1: .7, meow_2: .7, meow_3: .7, splash: .7, dial: .5, channel: .7, gate_arrive: .7, res_world: .8 }; // the rest play at 1
let soundAmb = null, soundLoops = {}, soundOut = null, soundFx = null, soundMusic = null, soundTv = null, soundTvLow = null, soundBufs = {}, soundTrack = null, soundHold = null, soundWas = {}, soundLastVol = 60, soundHoverAt = 0;

const soundBtn = document.createElement('button');
soundBtn.id = 'sound'; soundBtn.type = 'button';
document.head.insertAdjacentHTML('beforeend', `<style>
#sound { position: fixed; z-index: 11; left: calc(clamp(16px, 4vw, 64px) + env(safe-area-inset-left, 0px)); bottom: calc(clamp(16px, 3vw, 40px) + env(safe-area-inset-bottom, 0px));
  min-height: 44px; padding: 9px 13px; background: #000; color: var(--paper); border: 2px solid var(--paper); border-radius: 6px; font: 400 18px/1 var(--mono); letter-spacing: .04em; cursor: pointer; touch-action: manipulation; }
#sound:hover { background: var(--paper); color: #000; }
body:not(.inside) #sound { bottom: auto; top: calc(clamp(16px, 3vw, 40px) + env(safe-area-inset-top, 0px)); } /* the room's hint runs along the bottom */
#sound.by-back { left: auto; bottom: auto; } /* inside the TV the bottom belongs to the ticker and the boxes, so it sits beside Back (placed in soundSpot) */
@media (max-width: 600px) { #sound { min-width: 44px; padding: 7px 0; } #sound .word { display: none; } #sound[aria-pressed="false"] { text-decoration: line-through; } }
</style>`);
document.body.append(soundBtn);
const soundOn = () => +vol.value > 0;
function soundLabel() { soundBtn.innerHTML = `♪<span class="word"> Sound ${soundOn() ? 'on' : 'off'}</span>`; soundBtn.setAttribute('aria-pressed', soundOn()); soundBtn.setAttribute('aria-label', 'Sound'); }
function soundSpot() { // beside Back anywhere inside the TV, so it never sits on the ticker or a box's own controls
  const by = document.body.classList.contains('inside') && !backBtn.hidden, r = by && backBtn.getBoundingClientRect();
  soundBtn.classList.toggle('by-back', by);
  soundBtn.style.top = by ? `${r.top + (r.height - soundBtn.offsetHeight) / 2}px` : '';
  soundBtn.style.right = by ? `${innerWidth - r.left + 8}px` : '';
}
soundBtn.addEventListener('click', () => { // the same as turning the dial, so the room's knob and the hiss follow
  if (soundOn()) { soundLastVol = +vol.value; vol.value = 0; } else vol.value = soundLastVol;
  vol.dispatchEvent(new Event('input'));
});
vol.addEventListener('input', () => { soundLabel(); if (soundOn()) soundStart(); if (soundOut) soundOut.gain.setTargetAtTime(+vol.value / 100, audioCtx.currentTime, .05); soundPlay('dial'); });
soundLabel();

function soundStart() { // runs inside the click or dial turn, which is what lets a browser play sound
  if (soundOut || !audioCtx) return;
  audioCtx.resume();
  soundOut = audioCtx.createGain(); soundOut.gain.value = +vol.value / 100; soundOut.connect(audioCtx.destination);
  soundFx = audioCtx.createGain(); soundFx.gain.value = .8; soundFx.connect(soundOut);
  // Music goes through a band like a small TV speaker while we're in the room, and opens up to full range inside.
  soundTvLow = audioCtx.createBiquadFilter(); soundTvLow.type = 'highpass'; soundTvLow.frequency.value = 20;
  soundTv = audioCtx.createBiquadFilter(); soundTv.type = 'lowpass'; soundTv.frequency.value = 20000;
  soundMusic = audioCtx.createGain(); soundMusic.gain.value = SOUND_MUSIC_LEVEL;
  soundMusic.connect(soundTvLow).connect(soundTv).connect(soundOut);
  soundAmb = audioCtx.createGain(); soundAmb.gain.value = .5; soundAmb.connect(soundOut);
  for (const n of SOUND_FX) soundLoad(n, `audio/${n}.mp3`);
}
function soundLoad(name, url) {
  if (soundBufs[name] !== undefined) return soundBufs[name];
  soundBufs[name] = fetch(url).then(r => r.arrayBuffer()).then(b => audioCtx.decodeAudioData(b)).then(b => (soundBufs[name] = b)).catch(() => (soundBufs[name] = null)); // a missing file just stays quiet
  return soundBufs[name];
}
function soundPlay(name, { rate = 1, gain = SOUND_LOUD[name] || 1 } = {}) {
  const b = soundBufs[name];
  if (!soundOut || !soundOn() || !(b instanceof AudioBuffer)) return null;
  const s = audioCtx.createBufferSource(), v = audioCtx.createGain();
  s.buffer = b; s.playbackRate.value = rate; v.gain.value = gain;
  s.connect(v).connect(soundFx); s.start();
  return { s, v };
}

/* ---------- Music: one loop per place, crossfaded ---------- */
async function soundMusicTo(name) {
  if ((soundTrack && soundTrack.name) === name) return;
  const old = soundTrack, now = audioCtx.currentTime;
  soundTrack = name ? { name } : null;
  if (old && old.v) { old.v.gain.setTargetAtTime(0, now, .4); old.s.stop(now + 2.5); }
  if (!name) return;
  const b = await soundLoad(`music_${name}`, `audio/music_${name}.mp3`);
  if (!b || !soundTrack || soundTrack.name !== name || soundTrack.s) return; // moved on while it loaded
  const s = audioCtx.createBufferSource(), v = audioCtx.createGain();
  s.buffer = b; s.loop = true; v.gain.value = 0; v.gain.setTargetAtTime(1, audioCtx.currentTime, .6);
  s.connect(v).connect(soundMusic); s.start();
  Object.assign(soundTrack, { s, v });
}
function soundPlace() {
  if (!document.body.classList.contains('inside')) return tvOn && channel !== 2 ? 'room' : null; // channel 2 is the static
  if (resume) return 'resume';
  if (gate) return 'gate';
  if (works) return view || works.page >= 1 ? 'water' : 'sky'; // below the first screen, and inside a project, is under the water
  return book ? 'notebook' : tome ? 'tome' : 'board';
}
const soundMusicCorner = () => book && book.world === 2; // Up late, by the record player: the song card plays there instead
function soundLoopsTo(names) { // crossfade the background loops to these
  const t = audioCtx.currentTime;
  for (const [name, l] of Object.entries(soundLoops)) if (!names.includes(name)) { if (l.v) { l.v.gain.setTargetAtTime(0, t, .5); l.s.stop(t + 3); } delete soundLoops[name]; }
  for (const name of names) {
    if (soundLoops[name]) continue;
    const l = soundLoops[name] = {};
    Promise.resolve(soundLoad(name, `audio/${name}.mp3`)).then(b => { // a loop heard before is already decoded, not a promise
      if (!b || soundLoops[name] !== l) return;
      l.s = audioCtx.createBufferSource(); l.v = audioCtx.createGain(); l.s.buffer = b; l.s.loop = true; l.v.gain.value = 0; l.v.gain.setTargetAtTime(name === 'amb_candle' ? .5 : 1, audioCtx.currentTime, .8);
      l.s.connect(l.v).connect(soundAmb); l.s.start();
    });
  }
}

/* ---------- Watching for what changed ---------- */
function soundWatch() {
  requestAnimationFrame(soundWatch);
  soundSpot(); songCardSync();
  if (!soundOut) return;
  const dialog = document.querySelector('dialog[open]');
  const s = {
    tvOn, channel, mode, view: !!view, focus: zoomGoal ? focus : null, hover: !view && !gate && !book && !tome && !resume && !works ? hover : null, story: storyIndex, tip: !tip.hidden && tip.textContent,
    dialog: dialog && dialog.id,
    gate: gate && gate.phase, works: !!works, page: works && works.page, filter: works && works.filter, worksHover: works && works.hover,
    book: !!book, world: book && book.world, say: book && book.say, bookHover: book && book.hover,
    tome: !!tome, turn: tome && tome.turn, pop: tome && tome.cardInAt, tomeHover: tome && tome.hover,
    resume: resume && resume.phase, place: soundPlace(), page: tome && tome.at,
  };
  const w = soundWas, changed = k => 'mode' in w && s[k] !== w[k]; // the first frame after sound starts only takes notes
  if (changed('tvOn')) soundPlay(s.tvOn ? 'tv_on' : 'tv_off');
  if (changed('channel')) soundPlay('channel');
  if (changed('mode')) updateSound(); // the static fades as you go in, and comes back in the room
  if (changed('mode') && w.mode) soundPlay(s.mode === 'dive' ? (w.mode === 'room' ? 'dive_in' : 'dive_out') : s.mode === 'inside' ? 'arrive' : '');
  if (changed('tip') && s.tip) soundHover();
  if (changed('hover') && s.hover) soundHover();
  if (changed('worksHover') && s.worksHover) soundHover();
  if (changed('bookHover') && s.bookHover) soundHover();
  if (changed('tomeHover') && s.tomeHover) soundHover();
  if (changed('focus') && s.focus && !s.view) soundPlay('select');
  if (changed('story') && focus === stories && zoomGoal) soundPlay('story'); // on the board the pictures change by themselves, so stay quiet there
  if (changed('view')) soundPlay(s.view ? 'open' : 'back');
  if (changed('dialog')) soundPlay(s.dialog ? 'sticker' : 'close');
  // Box 1: the loader, the walk up to the door, the door, then the page behind it
  if (changed('gate')) soundPlay(s.gate ? { load: w.gate === 'build' ? '' : 'gate_load', build: 'gate_load', arrive: 'gate_arrive', door: 'gate_door', enter: 'gate_enter' }[s.gate] : w.gate === 'enter' ? '' : 'back'); // closing plays back, unless it closed by going through the door
  if (changed('works') && !w.gate) soundPlay(s.works ? 'open' : 'back');
  if (changed('page') && s.works && w.works) soundPlay('works_page');
  if (changed('filter') && s.works && w.works) soundPlay('works_tick');
  // Box 2: the notebook turns its page to open and close
  if (changed('book')) soundPlay('book_flip');
  if (changed('world') && s.book && w.world >= 0) soundPlay('book_world');
  if (changed('say') && s.say) soundPlay(`meow_${1 + Math.floor(Math.random() * 3)}`, { rate: .95 + Math.random() * .1 }); // every bubble is Hoshi talking
  // Box 3: the book lands, pages turn, scenes pop up
  if (changed('tome')) soundPlay(s.tome ? 'tome_open' : 'back');
  if (changed('turn') && s.turn) soundPlay('tome_turn', { rate: .92 + Math.random() * .16 });
  if (changed('page') && s.tome && w.tome && SOUND_PAGES[TOME_PAGES[s.page].name] && TOME_PAGES[s.page].name !== (TOME_PAGES[w.page] || {}).name) setTimeout(() => soundPlay(SOUND_PAGES[TOME_PAGES[s.page].name], { gain: .8 }), 350); // after the page has turned
  if (changed('place') && s.place === 'water' && w.place === 'sky') soundPlay('splash'); // diving in
  if (changed('pop') && s.pop) soundPlay('tome_pop');
  // The middle card
  if (changed('resume')) soundPlay(!s.resume ? 'back' : { intro: 'open', title: w.resume === 'intro' ? 'res_glass' : 'res_title', world: 'res_world', flash: 'res_flash', read: w.resume === 'flash' ? 'res_read' : 'open' }[s.resume]);
  if (changed('resume') && s.resume === 'title' && w.resume === 'intro') setTimeout(() => soundPlay('res_title'), 500);
  soundHolding();
  soundWas = s;
  const place = soundPlace(), t = audioCtx.currentTime;
  soundMusicTo(soundOn() && !soundMusicCorner() && !songOn ? SOUND_MUSIC[place] : null);
  soundLoopsTo(!soundOn() ? [] : place === 'notebook' ? (book.world >= 0 ? SOUND_BOOK_AMB[book.world] : []) : SOUND_AMB[place] || []);
  const inRoom = place === 'room', under = place === 'water'; // a small TV speaker in the room; the music muffled under the water
  soundTv.frequency.setTargetAtTime(inRoom ? 3800 : under ? 650 : 20000, t, .3); soundTvLow.frequency.setTargetAtTime(inRoom ? 320 : 20, t, .3);
  if (soundTrack && soundTrack.v) soundMusic.gain.setTargetAtTime(resume && resume.holding ? SOUND_MUSIC_LEVEL * .44 : SOUND_MUSIC_LEVEL, t, .3); // the hold's swell takes over
}
function soundHover() { const now = performance.now(); if (now - soundHoverAt > 70) { soundHoverAt = now; soundPlay('hover', { rate: .95 + Math.random() * .1 }); } }
function soundHolding() { // the press-and-hold swell follows how far the hands have closed in
  const h = resume && resume.phase === 'world' ? resume.hold || 0 : 0;
  if (h > .01 && !soundHold) { soundHold = soundPlay('res_hold', { gain: 0 }); if (soundHold) soundHold.s.loop = true; }
  if (!soundHold) return;
  const t = audioCtx.currentTime;
  soundHold.v.gain.setTargetAtTime(h * 1.1, t, .08); soundHold.s.playbackRate.setTargetAtTime(.85 + h * .3, t, .08);
  if (h <= .01) { soundHold.v.gain.setTargetAtTime(0, t, .15); soundHold.s.stop(t + 1); soundHold = null; }
}
$('#copy').addEventListener('click', () => soundPlay('copy'));

/* ---------- The music corner: in the notebook's Up late world, by the record player, a song card ---------- */
// The song is played by YouTube's own player, started by the visitor, never copied onto the site. With no id, Play opens it on
// YouTube Music in a new tab. It loops; the card's own Pause and Close drive it, and Hoshi wears the headphones while it plays.
const SOUND_SONG = { title: 'Mr Incorrect', artist: 'Malcolm Todd', id: 'zwtMZ4l9t4s', // the lyric video on Malcolm Todd's own channel
  search: 'https://music.youtube.com/search?q=Mr%20Incorrect%20Malcolm%20Todd' };
const songCard = document.createElement('div');
songCard.id = 'song'; songCard.hidden = true;
songCard.innerHTML = `<p class="song-what">♪ playing at the desk</p><p class="song-name">${SOUND_SONG.title}<span>${SOUND_SONG.artist}</span></p><div class="song-player"></div><div class="song-row"><button type="button" class="song-play"><span class="song-icon"></span><span class="song-label">Play</span></button><button type="button" class="song-close" hidden aria-label="Close the player"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button></div>`;
document.head.insertAdjacentHTML('beforeend', `<style>
#song { position: fixed; z-index: 11; left: calc(clamp(16px, 4vw, 64px) + env(safe-area-inset-left, 0px)); bottom: calc(clamp(16px, 3vw, 40px) + env(safe-area-inset-bottom, 0px)); width: min(300px, calc(100vw - 32px));
  padding: 12px 14px; box-sizing: border-box; background: #fffef6; color: #2d2b33; border: 3px solid #34323a; border-radius: 14px; box-shadow: 4px 6px 0 rgba(30,25,45,.35); font: 700 17px/1.2 Gaegu, "Segoe UI", sans-serif; transform: rotate(-1.5deg); }
#song[hidden] { display: none; }
#song p { margin: 0; } #song .song-what { font-size: 15px; color: #6a6670; } #song .song-name { font-size: 22px; margin: 2px 0 8px; } #song .song-name span { display: block; font-size: 16px; color: #e4584f; }
#song .song-row { display: flex; gap: 8px; }
#song button { min-height: 44px; padding: 8px 18px; border: 2.5px solid #34323a; border-radius: 99px; background: #ffd23f; font: inherit; cursor: pointer; }
#song .song-close { display: inline-flex; align-items: center; justify-content: center; min-width: 44px; padding: 8px 12px; background: #fffef6; color: #34323a; }
#song .song-play { display: inline-flex; align-items: center; gap: 8px; }
#song .song-icon { display: inline-block; width: 12px; height: 13px; background: #34323a; clip-path: polygon(0 0, 100% 50%, 0 100%); } /* play: drawn, since the handwriting font has no such symbol */
#song .song-play.on .song-icon { clip-path: none; background: linear-gradient(90deg, #34323a 0 35%, transparent 35% 65%, #34323a 65%); } /* pause: two bars */
#song .song-player { position: relative; }
#song .song-player:empty { display: none; }
#song iframe { display: block; width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 8px; margin-bottom: 8px; pointer-events: none; } /* YouTube's own hover controls never show; the card's buttons drive it */
#song.away .song-player { display: none; } /* out of the corner it shrinks to its title and buttons, still playing */
</style>`);
document.body.append(songCard);
let songOn = false, songFrame = null;
const songSay = (func) => songFrame && songFrame.contentWindow && songFrame.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: [] }), 'https://www.youtube-nocookie.com');
function songState(playing) { // the player said whether it's playing: the headphones follow it
  songOn = playing; const b = songCard.querySelector('.song-play'); b.querySelector('.song-label').textContent = playing ? 'Pause' : 'Play'; b.classList.toggle('on', playing);
  if (typeof bookSongOn !== 'undefined' && bookSongOn !== playing) { bookSongOn = playing; if (book) book.spinAt = performance.now(); } // a spin to change outfit
}
function songStop() { songFrame = null; songCard.querySelector('.song-player').innerHTML = ''; songCard.querySelector('.song-close').hidden = true; songState(false); }
addEventListener('message', e => { // the YouTube player reports its state when asked to, through the same channel its own API uses
  if (!songFrame || e.source !== songFrame.contentWindow) return;
  let d; try { d = JSON.parse(e.data); } catch { return; }
  const st = d.event === 'onStateChange' ? d.info : d.event === 'infoDelivery' && d.info && 'playerState' in d.info ? d.info.playerState : null;
  if (st !== null && st !== undefined) songState(st === 1 || st === 3); // playing or buffering
});
songCard.querySelector('.song-play').addEventListener('click', () => {
  if (!SOUND_SONG.id) { window.open(SOUND_SONG.search, '_blank', 'noopener'); return; }
  if (songFrame) { songSay(songOn ? 'pauseVideo' : 'playVideo'); songState(!songOn); return; }
  const q = new URLSearchParams({ autoplay: 1, controls: 0, disablekb: 1, loop: 1, playlist: SOUND_SONG.id, rel: 0, iv_load_policy: 3, playsinline: 1, enablejsapi: 1, origin: location.origin }); // loop needs the playlist set to itself
  songCard.querySelector('.song-player').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${SOUND_SONG.id}?${q}" title="${SOUND_SONG.title} by ${SOUND_SONG.artist}" allow="autoplay; encrypted-media"></iframe>`;
  songFrame = songCard.querySelector('iframe');
  songFrame.addEventListener('load', () => songFrame && songFrame.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), 'https://www.youtube-nocookie.com'));
  songCard.querySelector('.song-close').hidden = false; songState(true);
});
songCard.querySelector('.song-close').addEventListener('click', songStop);
function songCardSync() { // in the corner it's a full card; while the song plays it rides along, small; leaving the notebook ends it
  const inBook = !!(document.body.classList.contains('inside') && book && book.phase === 'ride'), corner = inBook && soundMusicCorner();
  if (!inBook && songFrame) songStop();
  songCard.hidden = !(corner || (inBook && songFrame));
  songCard.classList.toggle('away', !corner);
}
requestAnimationFrame(soundWatch);

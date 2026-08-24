/* ============================================================
   world.js - o mapa explorável: andar, falar, apanhar, entrar
   ============================================================ */
import { ctx, view, TILE, clear, text, measure } from '../engine/screen.js';
import { TILES, DEFAULT_TILE } from '../data/tiles.js';
import { MAPS } from '../data/maps.js';
import { CHARS, CHICKEN, PROPS, ENEMY_SPRITES } from '../data/sprites.js';
import { SCRIPT, IDLE_BUBBLES } from '../data/script.js';
import { draw as blit } from '../engine/sprites.js';
import { dialog } from '../engine/dialog.js';
import { fx } from '../engine/fx.js';
import { heldDir, consume, idleTime, resetIdle } from '../engine/input.js';
import { playMusic, sfx, musicVolume } from '../engine/audio.js';
import { register, go } from '../engine/scene.js';
import { state, addItem, isUnlocked, learnFact } from './state.js';
import { showHud, refreshHud, toastArea, toastItem, hideToasts } from './ui.js';
import { openMenu, isMenuOpen } from './menu.js';
import { WILD } from '../data/enemies.js';

const MOVE_TIME = 0.16;      // segundos por tile
const TURN_DELAY = 0.07;     // pequena pausa ao virar (sensação de RPG)

let def = null, tiles = [], mw = 0, mh = 0;
let objects = [], npcs = [], items = [], triggers = [];
let camX = 0, camY = 0, animT = 0;
let busy = false;            // cutscene / diálogo a decorrer
let turnT = 0, stepsWild = 0;
let bumpCount = 0, bumpCool = 0;
let bubble = null, idleStage = 0;

const player = {
  tx: 0, ty: 0, px: 0, py: 0, dir: 'down',
  moving: false, sx: 0, sy: 0, mt: 0, animT: 0
};

const WALK_CYCLE = [1, 0, 2, 0];
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };
const DX = { up: 0, down: 0, left: -1, right: 1 };
const DY = { up: -1, down: 1, left: 0, right: 0 };

/* ------------------------------------------------------------
   carregar mapa
   ------------------------------------------------------------ */
export function loadMap(id, sx, sy, dir) {
  def = MAPS[id];
  state.map = id;
  tiles = def.tiles;
  mh = tiles.length;
  mw = tiles[0].length;

  objects = (def.objects || []).filter(o => !state.flags['removed_' + o.key]).map(o => Object.assign({}, o));
  npcs = (def.npcs || []).map(n => Object.assign({}, n, {
    tx: n.x, ty: n.y, px: n.x * TILE, py: n.y * TILE,
    moving: false, sx: 0, sy: 0, mt: 0, animT: 0,
    wanderT: 1 + Math.random() * 2
  }));
  items = (def.items || []).filter(i => !state.flags['got_' + i.key]).map(i => Object.assign({}, i));
  triggers = (def.triggers || []).map(t => Object.assign({}, t));

  player.tx = sx; player.ty = sy;
  player.px = sx * TILE; player.py = sy * TILE;
  player.dir = dir || 'down';
  player.moving = false; player.mt = 0; player.animT = 0;

  stepsWild = 0; bumpCount = 0; bubble = null; idleStage = 0;
  fx.clearParticles();
  updateCamera();

  musicVolume(0.55);
  playMusic(musicFor(id));
  toastArea(def.name);
  resetIdle();
}

function musicFor(id) {
  if (id === 'clareira' && state.flags.bossDefeated) return 'fim';
  return MAPS[id].music;
}

/* ------------------------------------------------------------
   colisões
   ------------------------------------------------------------ */
function tileAt(x, y) {
  if (x < 0 || y < 0 || x >= mw || y >= mh) return null;
  return TILES[tiles[y][x]] || DEFAULT_TILE;
}
function objAt(x, y) {
  for (const o of objects) if (x >= o.x && x < o.x + o.w && y >= o.y && y < o.y + o.h) return o;
  return null;
}
function npcAt(x, y) {
  for (const n of npcs) if (n.tx === x && n.ty === y) return n;
  return null;
}
function itemAt(x, y) {
  for (const i of items) if (i.x === x && i.y === y) return i;
  return null;
}
function lockedExitAt(x, y) {
  for (const e of (def.exits || [])) {
    if (e.need && !isUnlocked(e.need) && inside(x, y, e)) return true;
  }
  return false;
}
function solidAt(x, y) {
  const t = tileAt(x, y);
  if (!t || t.solid) return true;
  if (objAt(x, y)) return true;
  if (npcAt(x, y)) return true;
  if (lockedExitAt(x, y)) return true;
  return false;
}
function inside(x, y, r) { return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h; }
function isBorder(x, y) { return x <= 0 || y <= 0 || x >= mw - 1 || y >= mh - 1; }

/* ------------------------------------------------------------
   movimento
   ------------------------------------------------------------ */
function tryMove(dir) {
  const nx = player.tx + DX[dir], ny = player.ty + DY[dir];
  if (solidAt(nx, ny)) {
    // bateu numa parede: será que está a tentar sair do mapa?
    const o = objAt(nx, ny);
    if (o && o.gate && isUnlocked(o.gate)) { openGate(o); return; }
    if (bumpCool <= 0 && (nx < 0 || ny < 0 || nx >= mw || ny >= mh || isBorder(nx, ny))) {
      bumpCount++;
      if (bumpCount >= 3) {
        bumpCount = 0; bumpCool = 25;
        say(SCRIPT.limite);
      }
    }
    sfx('step');
    return;
  }
  player.moving = true;
  player.sx = player.px; player.sy = player.py;
  player.tx = nx; player.ty = ny;
  player.mt = 0;
}

function finishStep() {
  player.px = player.tx * TILE;
  player.py = player.ty * TILE;
  player.moving = false;

  // poeira debaixo dos pés
  if (Math.random() < 0.5) {
    fx.burst(player.px + 8, player.py + 15, { count: 2, speed: 8, life: 0.28, size: 1, color: '#e6dcc0', grav: 10 });
  }

  const it = itemAt(player.tx, player.ty);
  if (it) pickUp(it);

  for (const e of (def.exits || [])) {
    if (inside(player.tx, player.ty, e)) { leaveTo(e); return; }
  }
  for (const t of triggers) {
    if (!state.flags['trig_' + t.id] && inside(player.tx, player.ty, t)) {
      state.flags['trig_' + t.id] = true;
      fireEvent(t.event);
      return;
    }
  }
  const t = tileAt(player.tx, player.ty);
  if (def.encounters && t && t.encounter) {
    stepsWild++;
    if (stepsWild > 4 && Math.random() < 0.16) {
      stepsWild = 0;
      startBattle(WILD[(Math.random() * WILD.length) | 0]);
    }
  }
}

function leaveTo(e) {
  busy = true;
  hideToasts();
  fx.transition(() => {
    loadMap(e.to, e.sx, e.sy, e.dir);
    busy = false;
  }, { dur: 0.25, hold: 0.05 });
}

/* ------------------------------------------------------------
   interacção
   ------------------------------------------------------------ */
function say(lines, after) {
  busy = true;
  dialog.start(lines, () => {
    if (lines && lines.forEach) lines.forEach(l => { if (l.fact) learnFact(l.fact); });
    busy = false;
    resetIdle();
    if (after) after();
  });
}

function interact() {
  const fxx = player.tx + DX[player.dir], fyy = player.ty + DY[player.dir];
  const n = npcAt(fxx, fyy);
  if (n) { talkNpc(n); return; }
  const o = objAt(fxx, fyy);
  if (o) { talkObject(o); return; }
  const it = itemAt(fxx, fyy);
  if (it) { pickUp(it); return; }
}

function talkNpc(n) {
  if (n.kind === 'chicken') {
    n.dir = OPPOSITE[player.dir] || 'down';
    const seq = SCRIPT.galinha;
    const i = Math.min(state.chickenTalks, seq.length - 1);
    state.chickenTalks++;
    sfx('chicken');
    if (state.chickenTalks === 6) { fx.burst(n.px + 8, n.py + 4, { count: 10, speed: 26, life: 0.7, color: '#ffd447', grav: 20 }); }
    say(seq[i]);
    return;
  }
  n.dir = OPPOSITE[player.dir] || 'down';
  const first = !state.flags[n.flag];
  const key = (!first && n.repeat) ? n.repeat : n.talk;
  const lines = SCRIPT[key] || SCRIPT[n.talk];
  sfx('confirm');
  say(lines, () => {
    if (n.flag) state.flags[n.flag] = true;
    if (n.give) grant(n.give);
  });
}

function talkObject(o) {
  if (o.gate) {
    if (isUnlocked(o.gate)) { openGate(o); return; }
    sfx('cancel');
    say(SCRIPT[o.talk]);
    return;
  }
  if (o.enter) { enterFinalHouse(o); return; }
  if (o.hibernardo) {
    const seq = SCRIPT.cama;
    const i = Math.min(state.camaTalks || 0, seq.length - 1);
    state.camaTalks = (state.camaTalks || 0) + 1;
    say(seq[i]);
    return;
  }
  if (!o.talk) return;
  const first = !state.flags[o.flag];
  const key = (!first && o.repeat) ? o.repeat : o.talk;
  const lines = SCRIPT[key] || SCRIPT[o.talk];
  sfx('confirm');
  say(lines, () => {
    if (o.flag) state.flags[o.flag] = true;
    if (o.give) grant(o.give);
  });
}

function openGate(o) {
  sfx('open');
  say(SCRIPT[o.talk + '_abre'], () => {
    state.flags['removed_' + o.key] = true;
    const i = objects.indexOf(o);
    if (i >= 0) objects.splice(i, 1);
    fx.burst(o.x * TILE + o.w * 8, o.y * TILE + 8, { count: 14, speed: 34, life: 0.8, color: '#f6f2e2', grav: -10 });
    sfx('item');
  });
}

function grant(itemId) {
  if (state.flags['gave_' + itemId]) return;
  state.flags['gave_' + itemId] = true;
  addItem(itemId);
  toastItem(itemId);
  sfx('item');
  fx.burst(player.px + 8, player.py + 4, { count: 10, speed: 30, life: 0.7, color: '#ffd447', grav: 30 });
}

function pickUp(it) {
  state.flags['got_' + it.key] = true;
  const i = items.indexOf(it);
  if (i >= 0) items.splice(i, 1);
  addItem(it.item);
  toastItem(it.item);
  sfx('item');
  fx.burst(it.x * TILE + 8, it.y * TILE + 8, { count: 12, speed: 34, life: 0.8, color: '#ffd447', grav: 40 });
  fx.flash('#fff3b0', 0.1);
}

/* ------------------------------------------------------------
   eventos e combate
   ------------------------------------------------------------ */
function fireEvent(ev) {
  if (ev === 'boss') {
    busy = true;
    sfx('boss');
    fx.flash('#ffd447', 0.35);
    fx.shake(3, 1.4);
    setTimeout(() => {
      dialog.start(SCRIPT.boss_intro, () => {
        SCRIPT.boss_intro.forEach(l => { if (l.fact) learnFact(l.fact); });
        startBattle('boss');
      });
    }, 400);
  } else if (ev === 'chegada') {
    musicVolume(0.32);
    say(SCRIPT.alentejo_chegada);
  }
}

function startBattle(enemyId) {
  busy = true;
  fx.flash('#ffffff', 0.2);
  sfx('hit');
  fx.transition(() => go('battle', { enemy: enemyId }), { dur: 0.3, hold: 0.1 });
}

function enterFinalHouse(o) {
  busy = true;
  sfx('open');
  dialog.start(SCRIPT.alentejo_casa, () => {
    fx.transition(() => go('ending', {}), { dur: 0.8, hold: 0.3, color: '#000000' });
  });
}

/* ------------------------------------------------------------
   NPCs que passeiam (a galinha)
   ------------------------------------------------------------ */
function updateNpc(n, dt) {
  if (n.moving) {
    n.mt += dt / (MOVE_TIME * 1.6);
    n.animT += dt;
    if (n.mt >= 1) {
      n.px = n.tx * TILE; n.py = n.ty * TILE; n.moving = false;
    } else {
      n.px = n.sx + (n.tx * TILE - n.sx) * n.mt;
      n.py = n.sy + (n.ty * TILE - n.sy) * n.mt;
    }
    return;
  }
  if (!n.wander || busy) return;
  n.wanderT -= dt;
  if (n.wanderT > 0) return;
  n.wanderT = 1.5 + Math.random() * 2.5;
  const dirs = ['up', 'down', 'left', 'right'];
  const d = dirs[(Math.random() * 4) | 0];
  const nx = n.tx + DX[d], ny = n.ty + DY[d];
  n.dir = d;
  if (solidAt(nx, ny) || (nx === player.tx && ny === player.ty)) return;
  n.sx = n.px; n.sy = n.py; n.tx = nx; n.ty = ny; n.mt = 0; n.moving = true;
}

/* ------------------------------------------------------------
   câmara
   ------------------------------------------------------------ */
function updateCamera() {
  const mapW = mw * TILE, mapH = mh * TILE;
  let x = player.px + TILE / 2 - view.w / 2;
  let y = player.py + TILE / 2 - view.h / 2;
  camX = mapW <= view.w ? (mapW - view.w) / 2 : Math.max(0, Math.min(x, mapW - view.w));
  camY = mapH <= view.h ? (mapH - view.h) / 2 : Math.max(0, Math.min(y, mapH - view.h));
}

/* ------------------------------------------------------------
   desenho
   ------------------------------------------------------------ */
function spriteOf(o) {
  if (o.anim && PROPS[o.anim]) {
    const fr = PROPS[o.anim];
    return fr[Math.floor(animT * 1.6) % fr.length];
  }
  if (o.fromEnemies) return ENEMY_SPRITES[o.sprite];
  return PROPS[o.sprite];
}

function drawTiles(cx, cy) {
  const x0 = Math.max(0, Math.floor(cx / TILE));
  const y0 = Math.max(0, Math.floor(cy / TILE));
  const x1 = Math.min(mw - 1, Math.ceil((cx + view.w) / TILE));
  const y1 = Math.min(mh - 1, Math.ceil((cy + view.h) / TILE));
  for (let y = y0; y <= y1; y++) {
    const row = tiles[y];
    for (let x = x0; x <= x1; x++) {
      const t = TILES[row[x]] || DEFAULT_TILE;
      const f = t.frames.length > 1 ? t.frames[Math.floor(animT * 4) % t.frames.length] : t.frames[0];
      ctx.drawImage(f, (x * TILE - cx) | 0, (y * TILE - cy) | 0);
    }
  }
}

function drawEntities(cx, cy) {
  const list = [];

  for (const o of objects) {
    const spr = spriteOf(o);
    if (!spr) continue;
    const bottom = (o.y + o.h) * TILE;
    list.push({
      sort: bottom,
      draw: () => blit(ctx, spr, o.x * TILE + ((o.w * TILE - spr.width) / 2 | 0) - cx, bottom - spr.height - cy)
    });
  }

  for (const it of items) {
    const bob = Math.sin(animT * 4 + it.x) * 2;
    list.push({
      sort: it.y * TILE + TILE,
      draw: () => blit(ctx, PROPS.brilho, it.x * TILE + 4 - cx, it.y * TILE + 4 + bob - cy)
    });
  }

  for (const n of npcs) {
    list.push({ sort: n.py + TILE, draw: () => drawActor(n, cx, cy) });
  }

  list.push({ sort: player.py + TILE + 1, draw: () => drawActor(player, cx, cy, true) });

  list.sort((a, b) => a.sort - b.sort);
  for (const e of list) e.draw();
}

function drawActor(a, cx, cy, isPlayer) {
  const x = (a.px - cx) | 0, y = (a.py - cy) | 0;
  // sombra
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + 3, y + 13, 10, 3);
  ctx.globalAlpha = 1;

  if (a.kind === 'chicken') {
    const f = a.moving ? (Math.floor(a.animT * 8) % 2) : 0;
    blit(ctx, CHICKEN[f], x, y, a.dir === 'left');
    return;
  }
  const set = CHARS[isPlayer ? 'bernardo' : a.char] || CHARS.bernardo;
  const frames = a.dir === 'up' ? set.up : (a.dir === 'down' ? set.down : set.side);
  const idx = a.moving ? WALK_CYCLE[Math.floor(a.animT * 9) % 4] : 0;
  blit(ctx, frames[idx], x, y, a.dir === 'left');
}

function drawBubble(cx, cy) {
  if (!bubble) return;
  const t = bubble.text;
  const w = Math.ceil(measure(t, 6)) + 8;
  const h = 13;
  const x = Math.round(player.px - cx + 8 - w / 2);
  const y = Math.round(player.py - cy - h - 3);
  ctx.fillStyle = '#f6f2e2';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#0a0a14';
  ctx.fillRect(x, y, w, 1); ctx.fillRect(x, y + h - 1, w, 1);
  ctx.fillRect(x, y, 1, h); ctx.fillRect(x + w - 1, y, 1, h);
  ctx.fillRect(x + (w / 2 | 0) - 1, y + h, 3, 2);
  text(t, x + 4, y + 4, { size: 6, color: '#241a2b', shadow: false });
}

/* ------------------------------------------------------------
   a cena
   ------------------------------------------------------------ */
register('world', {
  enter(params) {
    showHud(true);
    refreshHud();
    document.getElementById('battle').classList.add('hidden');
    if (params.resume) {
      busy = false;
      musicVolume(0.55);
      playMusic(musicFor(state.map));
      if (params.afterBoss) {
        state.flags.bossDefeated = true;
        const bf = objects.find(o => o.key === 'bossFigure');
        if (bf) {
          state.flags['removed_bossFigure'] = true;
          objects.splice(objects.indexOf(bf), 1);
          fx.burst(bf.x * TILE + 32, bf.y * TILE + 32, { count: 26, speed: 40, life: 1.2, color: '#8a86b8', grav: -6 });
        }
        playMusic('fim');
        say(SCRIPT.boss_win);
      }
      resetIdle();
      return;
    }
    loadMap(params.map || 'aldeia', params.x, params.y, params.dir);
  },

  update(dt) {
    animT += dt;
    if (bumpCool > 0) bumpCool -= dt;

    if (bubble) { bubble.t -= dt; if (bubble.t <= 0) bubble = null; }

    for (const n of npcs) updateNpc(n, dt);

    if (dialog.active) {
      dialog.update(dt);
      if (consume('a')) dialog.advance();
      consume('menu');
      updateCamera();
      return;
    }
    if (isMenuOpen()) { consume('a'); return; }
    if (busy || fx.busy) { consume('a'); consume('menu'); updateCamera(); return; }

    if (consume('menu')) { openMenu(); return; }
    if (consume('a')) { interact(); resetIdle(); return; }

    if (player.moving) {
      player.mt += dt / MOVE_TIME;
      player.animT += dt;
      if (player.mt >= 1) finishStep();
      else {
        player.px = player.sx + (player.tx * TILE - player.sx) * player.mt;
        player.py = player.sy + (player.ty * TILE - player.sy) * player.mt;
      }
    } else {
      const d = heldDir();
      if (d) {
        bubble = null;
        if (d !== player.dir) { player.dir = d; turnT = TURN_DELAY; }
        else if (turnT > 0) turnT -= dt;
        else { tryMove(d); player.animT += dt; }
      } else {
        turnT = 0;
        player.animT = 0;
        // easter egg: ficar parado
        if (idleTime() > 14000) {
          bubble = { text: IDLE_BUBBLES[Math.min(idleStage, IDLE_BUBBLES.length - 1)], t: 2.6 };
          idleStage++;
          resetIdle();
          sfx('blip2');
        }
      }
    }
    updateCamera();
  },

  draw() {
    if (!def) return;
    clear('#0b0b16');
    const cx = Math.round(camX + fx.offsetX);
    const cy = Math.round(camY + fx.offsetY);
    drawTiles(cx, cy);
    drawEntities(cx, cy);
    if (def.shade) {
      ctx.fillStyle = def.shade;
      ctx.fillRect(0, 0, view.w, view.h);
    }
    fx.drawParticles(cx, cy);
    drawBubble(cx, cy);
  }
});

export { player };

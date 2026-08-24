/* ============================================================
   battle.js - combate por turnos, muito simples e muito parvo
   ============================================================ */
import { ctx, view, clear, text } from '../engine/screen.js';
import { ENEMIES, ATTACKS, DRAMA_COST, DRAMA_DAMAGE, DRAMA_LINES, WIN_LINES } from '../data/enemies.js';
import { FLAVOUR } from '../data/script.js';
import { ENEMY_SPRITES, CHARS } from '../data/sprites.js';
import { ITEMS, ITEM_ORDER } from '../data/items.js';
import { draw as blit, tinted } from '../engine/sprites.js';
import { fx } from '../engine/fx.js';
import { consume } from '../engine/input.js';
import { playMusic, sfx, musicVolume } from '../engine/audio.js';
import { register, go } from '../engine/scene.js';
import { state, damage, healHp, addDrama, addEnergia, addSono, removeItem } from './state.js';
import { showHud, refreshHud } from './ui.js';

const el = {
  root: document.getElementById('battle'),
  eName: document.getElementById('bt-enemy-name'),
  eBar: document.getElementById('bt-enemy-bar'),
  hBar: document.getElementById('bt-hero-bar'),
  hHp: document.getElementById('bt-hero-hp'),
  hDr: document.getElementById('bt-hero-dr'),
  log: document.getElementById('bt-log'),
  logText: document.getElementById('bt-log-text'),
  cmd: document.getElementById('bt-cmd'),
  cmdTitle: document.getElementById('bt-cmd-title'),
  grid: document.getElementById('bt-cmd-grid')
};

let enemy = null, enemySpr = null, enemyFlash = 0, enemyShake = 0, enemyDead = false;
let heroFlash = 0, t = 0;
let phase = 'intro';          // intro | menu | sub | msg | over
let msgs = [], afterMsgs = null;
let options = [], sel = 0, cols = 2;
let dmgPops = [];
let logTyping = 0, logFull = '';

/* posições dos combatentes (fração da área de jogo) */
const EX = 0.62, EY = 0.26, HX = 0.27, HY = 0.46;

const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[(Math.random() * a.length) | 0];

/* ---------------- barras e texto ---------------- */
function refresh() {
  el.eName.textContent = enemy.name;
  el.eBar.style.width = Math.max(0, (enemy.hp / enemy.maxHp) * 100) + '%';
  el.hBar.style.width = Math.max(0, (state.hp / state.maxHp) * 100) + '%';
  el.hBar.parentElement.classList.toggle('low', state.hp / state.maxHp <= 0.3);
  el.hHp.textContent = state.hp + '/' + state.maxHp;
  el.hDr.textContent = String(state.drama);
}

function showLog(str) {
  logFull = str; logTyping = 0;
  el.logText.textContent = '';
  el.log.classList.remove('hidden');
  el.cmd.classList.add('hidden');
  document.getElementById('bt-log-next').classList.add('hidden');
}

function say(str, on) { msgs.push({ t: str, on }); }

function runMsgs(after) {
  afterMsgs = after || null;
  phase = 'msg';
  nextMsg();
}

function nextMsg() {
  if (!msgs.length) {
    const cb = afterMsgs; afterMsgs = null;
    if (cb) cb();
    return;
  }
  const m = msgs.shift();
  showLog(m.t);
  if (m.on) m.on();
  refresh();
}

/* ---------------- menus ---------------- */
function showOptions(title, list, columns) {
  phase = title ? 'sub' : 'menu';
  options = list; sel = 0; cols = columns || 2;
  el.cmdTitle.textContent = title || '';
  el.cmdTitle.classList.toggle('hidden', !title);
  el.grid.classList.toggle('one', cols === 1);
  el.log.classList.add('hidden');
  el.cmd.classList.remove('hidden');
  renderOptions();
}

function renderOptions() {
  el.grid.innerHTML = '';
  options.forEach((o, i) => {
    const b = document.createElement('button');
    b.className = 'cmd' + (i === sel ? ' sel' : '') + (o.dim ? ' dim' : '');
    b.textContent = o.label;
    b.onpointerdown = e => { e.preventDefault(); sel = i; renderOptions(); choose(); };
    el.grid.appendChild(b);
  });
}

function mainMenu() {
  showOptions('', [
    { label: 'ATACAR', act: attackMenu },
    { label: 'DRAMA', act: useDrama },
    { label: 'ITEM', act: itemMenu },
    { label: 'FUGIR', act: flee }
  ], 2);
}

function attackMenu() {
  const list = ATTACKS.map(a => ({ label: a.name, act: () => doAttack(a) }));
  list.push({ label: 'VOLTAR', act: mainMenu, dim: true });
  showOptions('O que é que o BERNARDO faz?', list, 1);
}

function itemMenu() {
  const inv = state.inventory.slice().sort((a, b) => ITEM_ORDER.indexOf(a.id) - ITEM_ORDER.indexOf(b.id));
  const list = inv.map(entry => {
    const it = ITEMS[entry.id];
    return { label: it.icon + ' ' + it.name + ' x' + entry.qty, act: () => useItem(entry) };
  });
  if (!list.length) list.push({ label: 'Mochila vazia.', act: mainMenu, dim: true });
  list.push({ label: 'VOLTAR', act: mainMenu, dim: true });
  showOptions('Usar o quê?', list, 1);
}

function choose() {
  const o = options[sel];
  if (!o) return;
  sfx('confirm');
  o.act();
}

/* ---------------- ações ---------------- */
function hitEnemy(dmg) {
  enemy.hp = Math.max(0, enemy.hp - dmg);
  enemyFlash = 0.28; enemyShake = 0.3;
  fx.shake(2, 0.18);
  sfx('hit');
  dmgPops.push({ v: dmg, x: 0.62, y: 0.30, t: 0.9, color: '#ffd447' });
}

function hitHero(dmg) {
  damage(dmg);
  heroFlash = 0.28;
  fx.shake(2.5, 0.2);
  sfx('hurt');
  dmgPops.push({ v: dmg, x: HX, y: HY, t: 0.9, color: '#ff8a7a' });
  refreshHud();
}

function doAttack(a) {
  const dmg = rnd(a.min, a.max);
  msgs = [];
  say(a.text(enemy.name));
  say(enemy.name + ' perdeu ' + dmg + ' HP.', () => hitEnemy(dmg));
  say(a.after(enemy.name, dmg));
  runMsgs(afterPlayerTurn);
}

function useDrama() {
  msgs = [];
  if (state.drama < DRAMA_COST) {
    say('Não tens DRAMA suficiente.');
    say('Que ironia.');
    runMsgs(mainMenu);
    return;
  }
  addDrama(-DRAMA_COST);
  say(pick(DRAMA_LINES));
  say(enemy.name + ' perdeu ' + DRAMA_DAMAGE + ' HP.', () => {
    hitEnemy(DRAMA_DAMAGE);
    fx.flash('#ef5f9c', 0.3);
    fx.shake(4, 0.5);
    sfx('drama');
  });
  say('Foi demais. Para toda a gente.');
  runMsgs(afterPlayerTurn);
}

function useItem(entry) {
  const it = ITEMS[entry.id];
  const r = it.use();
  msgs = [];
  say(r.text, () => {
    if (r.hp) { healHp(r.hp); sfx('heal'); fx.flash('#5fdc8b', 0.2); }
    if (r.drama) addDrama(r.drama);
    if (r.energia) addEnergia(r.energia);
    if (r.sono) addSono(r.sono);
    if (r.consume) removeItem(entry.id);
    refreshHud();
  });
  if (r.extra) say(r.extra);
  runMsgs(afterPlayerTurn);
}

function flee() {
  msgs = [];
  if (enemy.noFlee) {
    say(enemy.noFlee);
    runMsgs(enemyTurn);
    return;
  }
  if (Math.random() < 0.75) {
    say('BERNARDO fugiu com uma dignidade discutível.', () => sfx('flee'));
    runMsgs(() => leave(false));
  } else {
    say('BERNARDO tentou fugir.');
    say('Não resultou. Foi constrangedor.');
    runMsgs(enemyTurn);
  }
}

function afterPlayerTurn() {
  if (enemy.hp <= 0) { win(); return; }
  enemyTurn();
}

function enemyTurn() {
  const a = pick(enemy.attacks);
  const dmg = rnd(a.min, a.max);
  msgs = [];
  say(enemy.name + ' usa ' + a.name + '.');
  if (dmg <= 0) {
    say('Não aconteceu nada. Nem sabia bem o que estava a fazer.');
    runMsgs(mainMenu);
    return;
  }
  say('BERNARDO perdeu ' + dmg + ' HP.', () => hitHero(dmg));
  runMsgs(() => {
    if (state.hp <= 0) faint();
    else mainMenu();
  });
}

function win() {
  enemyDead = true;
  state.battlesWon++;
  sfx('win');
  fx.burst(view.w * EX, view.h * EY, { count: 22, speed: 44, life: 1, color: '#ffd447', grav: 26 });
  msgs = [];
  say(enemy.death);
  say(pick(WIN_LINES));
  if (Math.random() < 0.4) say(pick(FLAVOUR));
  runMsgs(() => leave(enemy.boss));
}

function faint() {
  msgs = [];
  say('BERNARDO desmaiou dramaticamente.');
  say('Alguém lhe deu um café. Não se sabe quem.', () => {
    state.hp = Math.max(1, Math.floor(state.maxHp * 0.5));
    addEnergia(20); addSono(-10);
    sfx('heal');
    refreshHud();
  });
  say('BERNARDO levantou-se como se nada fosse.');
  runMsgs(() => leave(false));
}

function leave(afterBoss) {
  phase = 'over';
  el.root.classList.add('hidden');
  fx.transition(() => {
    go('world', { resume: true, afterBoss: !!afterBoss });
  }, { dur: 0.3, hold: 0.05 });
}

/* ---------------- desenho ---------------- */
function drawBattlefield() {
  const w = view.w, h = view.h;
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, enemy.boss ? '#160f2e' : '#2a2450');
  g.addColorStop(1, '#0d0b1c');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // chão
  const horizon = Math.round(h * 0.40);
  ctx.fillStyle = enemy.boss ? '#241a44' : '#3a2f68';
  ctx.fillRect(0, horizon, w, h - horizon);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let i = 0; i < 6; i++) ctx.fillRect(0, horizon + i * i * 2, w, 1);
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = enemy.color;
  ctx.beginPath();
  ctx.ellipse(w * EX, h * EY + 26, 30, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(w * HX, h * HY + 15, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // inimigo
  const spr = enemyDead ? null : enemySpr;
  if (spr) {
    const bob = Math.sin(t * 3) * 2;
    const jitter = enemyShake > 0 ? (Math.random() - 0.5) * 4 : 0;
    const ex = (w * EX - spr.width / 2 + jitter) | 0;
    const ey = (h * EY - spr.height / 2 + bob) | 0;
    if (enemyFlash > 0 && Math.floor(enemyFlash * 20) % 2 === 0) {
      blit(ctx, tinted(spr, '#ffffff'), ex, ey);
    } else {
      blit(ctx, spr, ex, ey);
    }
  }

  // Bernardo de costas
  const set = CHARS.bernardo.up;
  const idx = 0;
  // o Bernardo aparece maior no combate (fica melhor a ler)
  const hx = (w * HX - 16) | 0, hy = (h * HY - 16) | 0;
  const heroSpr = (heroFlash > 0 && Math.floor(heroFlash * 20) % 2 === 0) ? tinted(set[idx], '#ff8a7a') : set[idx];
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(heroSpr, hx, hy, 32, 32);

  // números de dano
  for (const p of dmgPops) {
    const y = h * p.y - (0.9 - p.t) * 22 - 10;
    text('-' + p.v, w * p.x, y, { size: 8, color: p.color, align: 'center' });
  }

  fx.drawParticles(0, 0);
}

/* ---------------- a cena ---------------- */
register('battle', {
  enter(params) {
    const base = ENEMIES[params.enemy] || ENEMIES.sono;
    enemy = Object.assign({}, base);
    enemy.maxHp = base.hp;
    enemy.hp = base.hp;
    enemySpr = ENEMY_SPRITES[base.sprite];
    enemyDead = false; enemyFlash = 0; enemyShake = 0; heroFlash = 0;
    dmgPops = []; msgs = []; afterMsgs = null; t = 0;

    showHud(false);
    el.root.classList.remove('hidden');
    refresh();
    musicVolume(0.55);
    playMusic(enemy.boss ? 'boss' : 'combate');

    msgs = [];
    say(enemy.name + ' apareceu!');
    if (enemy.boss) say('Isto parece muito importante.');
    runMsgs(mainMenu);
  },

  exit() {
    el.root.classList.add('hidden');
  },

  update(dt) {
    t += dt;
    if (enemyFlash > 0) enemyFlash -= dt;
    if (enemyShake > 0) enemyShake -= dt;
    if (heroFlash > 0) heroFlash -= dt;
    for (let i = dmgPops.length - 1; i >= 0; i--) {
      dmgPops[i].t -= dt;
      if (dmgPops[i].t <= 0) dmgPops.splice(i, 1);
    }

    // efeito de máquina de escrever no texto de combate
    if (logFull && logTyping < logFull.length) {
      logTyping = Math.min(logFull.length, logTyping + 48 * dt);
      el.logText.textContent = logFull.slice(0, Math.floor(logTyping));
      if (logTyping >= logFull.length) {
        document.getElementById('bt-log-next').classList.remove('hidden');
      }
    }

    if (phase === 'over') return;

    if (phase === 'msg') {
      if (consume('a')) {
        if (logTyping < logFull.length) { logTyping = logFull.length; el.logText.textContent = logFull; }
        else nextMsg();
      }
      consume('menu');
      return;
    }

    // navegação nos menus
    if (consume('a')) { choose(); return; }
    if (consume('menu')) { if (phase === 'sub') { sfx('cancel'); mainMenu(); } return; }

    const n = options.length;
    if (n) {
      let moved = false;
      if (consume('dir:up')) { sel = (sel - cols + n) % n; moved = true; }
      if (consume('dir:down')) { sel = (sel + cols) % n; moved = true; }
      if (cols > 1) {
        if (consume('dir:left')) { sel = (sel - 1 + n) % n; moved = true; }
        if (consume('dir:right')) { sel = (sel + 1) % n; moved = true; }
      }
      if (moved) { sfx('blip'); renderOptions(); }
    }
  },

  draw() {
    clear('#0d0b1c');
    ctx.save();
    ctx.translate(fx.offsetX, fx.offsetY);
    drawBattlefield();
    ctx.restore();
  }
});

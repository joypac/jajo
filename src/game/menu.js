/* ============================================================
   menu.js - mochila + DADOS DO JAJO
   ============================================================ */
import { ITEMS, ITEM_ORDER } from '../data/items.js';
import { DADOS } from '../data/dados.js';
import { state, removeItem, healHp, addDrama, addEnergia, addSono, knowsFact } from './state.js';
import { consume } from '../engine/input.js';
import { sfx } from '../engine/audio.js';
import { refreshHud } from './ui.js';

const root = document.getElementById('menu');
const panel = root.querySelector('.menu-panel');
const listEl = document.getElementById('menu-list');
const descEl = document.getElementById('menu-desc');
const footEl = document.getElementById('menu-foot');

let open = false, tab = 0, sel = 0;

export function isMenuOpen() { return open; }

export function openMenu() {
  open = true; sel = 0;
  root.classList.remove('hidden');
  sfx('open');
  render();
}

export function closeMenu() {
  open = false;
  root.classList.add('hidden');
  sfx('cancel');
}

function sortedItems() {
  return state.inventory.slice().sort(
    (a, b) => ITEM_ORDER.indexOf(a.id) - ITEM_ORDER.indexOf(b.id)
  );
}

function render() {
  // cabeçalho com separadores
  let head = panel.querySelector('header');
  head.innerHTML =
    '<span class="tab' + (tab === 0 ? ' on' : '') + '" data-tab="0">MOCHILA</span>' +
    '<span class="tab' + (tab === 1 ? ' on' : '') + '" data-tab="1">DADOS DO JAJO</span>';
  head.querySelectorAll('.tab').forEach(el => {
    el.onpointerdown = e => { e.preventDefault(); tab = +el.dataset.tab; sel = 0; sfx('blip'); render(); };
  });

  listEl.innerHTML = '';
  if (tab === 0) {
    const stats = document.createElement('li');
    stats.className = 'stats-row';
    stats.innerHTML =
      '<span>HP <b>' + state.hp + '/' + state.maxHp + '</b></span>' +
      '<span>DRAMA <b>' + state.drama + '</b></span>' +
      '<span>ENERGIA <b>' + state.energia + '</b></span>' +
      '<span>SONO <b>' + state.sono + '</b></span>';
    listEl.appendChild(stats);
    const inv = sortedItems();
    if (!inv.length) {
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = 'A mochila está vazia. Como o frigorífico.';
      listEl.appendChild(li);
      descEl.textContent = '';
    } else {
      inv.forEach((entry, i) => {
        const it = ITEMS[entry.id];
        const li = document.createElement('li');
        if (i === sel) li.className = 'sel';
        li.innerHTML = '<span>' + it.icon + '</span><span class="nm">' + it.name + '</span>' +
                       '<span class="qty">x' + entry.qty + '</span>';
        li.onpointerdown = e => { e.preventDefault(); sel = i; render(); useSelected(); };
        listEl.appendChild(li);
      });
      const cur = ITEMS[inv[Math.min(sel, inv.length - 1)].id];
      descEl.innerHTML = cur.desc + (cur.stats ? '<br><b class="stats">' + cur.stats + '</b>' : '');
    }
    footEl.textContent = 'A usar  •  MENU fechar';
  } else {
    DADOS.forEach(d => {
      const known = d.always || knowsFact(d.key);
      const li = document.createElement('li');
      li.className = 'dado' + (known ? '' : ' empty');
      li.innerHTML = '<span class="nm">' + d.label + '</span><span class="val' +
        (d.warn ? ' warn' : '') + (d.heart ? ' heart' : '') + '">' +
        (known ? d.value : '???') + '</span>';
      listEl.appendChild(li);
    });
    const total = DADOS.length;
    const got = DADOS.filter(d => d.always || knowsFact(d.key)).length;
    descEl.innerHTML = 'Ficheiro oficial. ' + got + '/' + total + ' confirmado.';
    footEl.textContent = 'MENU fechar';
  }
}

function useSelected() {
  if (tab !== 0) return;
  const inv = sortedItems();
  if (!inv.length) return;
  const entry = inv[Math.min(sel, inv.length - 1)];
  const it = ITEMS[entry.id];
  const r = it.use();
  if (r.hp) healHp(r.hp);
  if (r.drama) addDrama(r.drama);
  if (r.energia) addEnergia(r.energia);
  if (r.sono) addSono(r.sono);
  if (r.consume) removeItem(entry.id);
  sfx(r.hp ? 'heal' : 'blip');
  refreshHud();
  render();
  descEl.textContent = r.text + (r.extra ? ' ' + r.extra : '');
}

function move(d) {
  const n = tab === 0 ? sortedItems().length : 0;
  if (!n) return;
  sel = (sel + d + n) % n;
  sfx('blip');
  render();
}

export function updateMenu() {
  if (!open) return;
  if (consume('menu') || consume('cancel')) { closeMenu(); return; }
  if (consume('a')) { useSelected(); return; }

  if (consume('dir:up')) move(-1);
  if (consume('dir:down')) move(1);
  if (consume('dir:left') || consume('dir:right')) {
    tab = tab === 0 ? 1 : 0; sel = 0; sfx('blip'); render();
  }
}

footEl.onpointerdown = e => { e.preventDefault(); closeMenu(); };
root.onpointerdown = e => { if (e.target === root) { e.preventDefault(); closeMenu(); } };

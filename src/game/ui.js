/* ============================================================
   ui.js - HUD, avisos de area e de item
   ============================================================ */
import { state } from './state.js';
import { ITEMS } from '../data/items.js';

const hud = document.getElementById('hud');
const hpBar = document.getElementById('hud-hp-bar');
const hpTxt = document.getElementById('hud-hp-txt');
const drBar = document.getElementById('hud-dr-bar');
const drTxt = document.getElementById('hud-dr-txt');
const areaToast = document.getElementById('area-toast');
const itemToast = document.getElementById('item-toast');

let areaTimer = null, itemTimer = null;

export function showHud(on) { hud.classList.toggle('hidden', !on); }

export function refreshHud() {
  const p = Math.max(0, state.hp / state.maxHp);
  hpBar.style.width = (p * 100) + '%';
  hpBar.parentElement.classList.toggle('low', p <= 0.3);
  hpTxt.textContent = state.hp + '/' + state.maxHp;
  drBar.style.width = Math.min(100, state.drama) + '%';
  drTxt.textContent = String(state.drama);
}

export function toastArea(name) {
  areaToast.textContent = name;
  areaToast.classList.remove('hidden');
  clearTimeout(areaTimer);
  areaTimer = setTimeout(() => areaToast.classList.add('hidden'), 2200);
}

export function toastItem(itemId) {
  const it = ITEMS[itemId];
  if (!it) return;
  itemToast.textContent = it.icon + '  ' + it.name;
  itemToast.classList.remove('hidden');
  clearTimeout(itemTimer);
  itemTimer = setTimeout(() => itemToast.classList.add('hidden'), 2000);
}

export function hideToasts() {
  areaToast.classList.add('hidden');
  itemToast.classList.add('hidden');
}

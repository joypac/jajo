/* ============================================================
   state.js - o estado do jogo todo num sitio so
   ============================================================ */
import { ITEMS } from '../data/items.js';

export const state = {
  hp: 100, maxHp: 100,
  drama: 37, maxDrama: 100,
  paciencia: 12,
  energia: 40, maxEnergia: 100,
  sono: 68,
  inventory: [],
  flags: {},
  chickenTalks: 0,
  camaTalks: 0,
  battlesWon: 0,
  map: 'aldeia',
  startTime: 0,
  endTime: 0
};

export function resetState() {
  state.hp = 100; state.maxHp = 100;
  state.drama = 37; state.maxDrama = 100;
  state.paciencia = 12;
  state.energia = 40;
  state.sono = 68;
  state.inventory = [];
  state.flags = {};
  state.chickenTalks = 0;
  state.camaTalks = 0;
  state.battlesWon = 0;
  state.map = 'aldeia';
  state.startTime = performance.now();
  state.endTime = 0;
}

/* ---------- mochila ---------- */
export function addItem(id, qty) {
  if (!ITEMS[id]) return;
  const found = state.inventory.find(i => i.id === id);
  if (found) found.qty += (qty || 1);
  else state.inventory.push({ id, qty: qty || 1 });
}
export function removeItem(id) {
  const i = state.inventory.findIndex(x => x.id === id);
  if (i < 0) return;
  state.inventory[i].qty--;
  if (state.inventory[i].qty <= 0) state.inventory.splice(i, 1);
}
export function hasItem(id) { return state.inventory.some(i => i.id === id); }

/* ---------- vida / drama ---------- */
export function damage(n) { state.hp = Math.max(0, state.hp - n); }
export function healHp(n) { state.hp = Math.min(state.maxHp, state.hp + n); }
export function addDrama(n) { state.drama = Math.max(0, Math.min(state.maxDrama, state.drama + n)); }
export function addEnergia(n) { state.energia = Math.max(0, Math.min(state.maxEnergia, state.energia + n)); }
export function addSono(n) { state.sono = Math.max(0, Math.min(100, state.sono + n)); }

/* ---------- DADOS DO JAJO ---------- */
export function learnFact(key) { if (key) state.flags['fact_' + key] = true; }
export function knowsFact(key) { return !!state.flags['fact_' + key]; }

/* ---------- progressao ---------- */
export function isUnlocked(gate) {
  const f = state.flags;
  if (gate === 'fatima') return !!(f.npc1 && f.npc2 && f.npc3);
  if (gate === 'floresta') return !!f.padre;
  if (gate === 'boss') return !!(f.arvore && f.sabio);
  if (gate === 'alentejo') return !!f.bossDefeated;
  return true;
}

/* ---------- tempo ---------- */
export function elapsedMs() {
  return (state.endTime || performance.now()) - state.startTime;
}
export function formatTime(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m + 'm ' + String(r).padStart(2, '0') + 's';
}

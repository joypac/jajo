/* ============================================================
   ui.js - HUD, avisos, balões de conversa, atendimento e caixa
   ============================================================ */
import { S, relogio } from './state.js';
import { sfx } from '../engine/audio.js';

const el = id => document.getElementById(id);
const hud = el('hud'), clock = el('hud-clock'), face = el('hud-face');
const barEnergia = el('bar-energia'), barLoja = el('bar-loja'), txtLoja = el('txt-loja');
const chipStock = el('chip-stock'), chipChao = el('chip-chao'), chipFila = el('chip-fila');
const toasts = el('toasts');
const tasklist = el('tasklist'), tasklistItems = el('tasklist-items');
const talk = el('talk'), talkWho = el('talk-who'), talkText = el('talk-text');
const serve = el('serve'), serveQ = el('serve-q'), serveOpts = el('serve-opts'), serveTimer = el('serve-timer').firstElementChild;
const caixa = el('caixa'), caixaStep = el('caixa-step'), caixaOpts = el('caixa-opts'), caixaProg = el('caixa-prog').firstElementChild;

export function showHud(on) {
  hud.classList.toggle('hidden', !on);
  const t = document.getElementById('touch');
  if (document.body.classList.contains('touch')) t.classList.toggle('hidden', !on);
}

export function refreshHud(info) {
  clock.textContent = relogio();
  clock.classList.toggle('rush', S.fase === 'ultima');
  barEnergia.style.width = S.energia + '%';
  barEnergia.parentElement.classList.toggle('low', S.energia <= 30);
  barLoja.style.width = info.arrumacao + '%';
  txtLoja.textContent = info.arrumacao + '%';
  chipStock.textContent = '📦 ' + info.stock;
  chipStock.classList.toggle('warn', info.stock > 40);
  chipChao.textContent = '🧦 ' + info.meiasChao;
  chipChao.classList.toggle('warn', info.meiasChao > 8);
  chipFila.textContent = '🛍️ ' + info.aEspera;
  chipFila.classList.toggle('warn', info.aEspera > 2);
  face.textContent = '🙂';
}

/* ---------------- avisos ---------------- */
export function toast(texto, tipo, ms) {
  const d = document.createElement('div');
  d.className = 'toast' + (tipo ? ' ' + tipo : '');
  d.textContent = texto;
  toasts.appendChild(d);
  if (toasts.children.length > 3) toasts.removeChild(toasts.firstChild);
  setTimeout(() => { if (d.parentNode) d.remove(); }, ms || 2400);
}

/* ---------------- lista da última hora ---------------- */
export function showTasklist(on) { tasklist.classList.toggle('hidden', !on); }
export function renderTasklist(tarefas) {
  tasklistItems.innerHTML = tarefas.map(t =>
    '<li class="' + (t.feito ? 'done' : '') + '">' + (t.feito ? '✔ ' : '□ ') + t.label + '</li>'
  ).join('');
}

/* ---------------- diálogo curto (cutscene) ---------------- */
let talkQueue = [], talkTimer = 0, talkDone = null;
export function playTalk(linhas, aoAcabar) {
  talkQueue = linhas.slice();
  talkDone = aoAcabar || null;
  nextTalk();
}
function nextTalk() {
  if (!talkQueue.length) {
    talk.classList.add('hidden');
    const cb = talkDone; talkDone = null;
    if (cb) cb();
    return;
  }
  const [quem, texto] = talkQueue.shift();
  talkWho.textContent = quem;
  talkText.textContent = texto;
  talk.classList.remove('hidden');
  talkTimer = 0.85 + texto.length * 0.028;
  sfx(quem === 'SÓNIA' ? 'sonia' : 'clique');
}
export function updateTalk(dt) {
  if (talk.classList.contains('hidden')) return false;
  talkTimer -= dt;
  if (talkTimer <= 0) nextTalk();
  return true;
}
export function talkAtivo() { return !talk.classList.contains('hidden'); }
talk.addEventListener('pointerdown', e => { e.preventDefault(); talkTimer = 0; });

/* ---------------- atendimento ---------------- */
let serveCb = null, serveSel = 0, serveN = 0;
export function abrirAtendimento(pergunta, opcoes, aoEscolher) {
  serveCb = aoEscolher; serveSel = 0; serveN = opcoes.length;
  serveQ.textContent = '“' + pergunta + '”';
  serveOpts.innerHTML = '';
  opcoes.forEach((o, i) => {
    const b = document.createElement('button');
    b.className = 'opt' + (i === 0 ? ' sel' : '');
    b.textContent = o;
    b.onpointerdown = e => { e.preventDefault(); escolher(i); };
    serveOpts.appendChild(b);
  });
  serve.classList.remove('hidden');
  sfx('pergunta');
}
export function atendimentoAberto() { return !serve.classList.contains('hidden'); }
export function moverAtendimento(d) {
  if (!atendimentoAberto()) return;
  serveSel = (serveSel + d + serveN) % serveN;
  [...serveOpts.children].forEach((c, i) => c.classList.toggle('sel', i === serveSel));
  sfx('clique');
}
export function confirmarAtendimento() { if (atendimentoAberto()) escolher(serveSel); }
function escolher(i) {
  const cb = serveCb; serveCb = null;
  serve.classList.add('hidden');
  if (cb) cb(i);
}
export function fecharAtendimento() { serveCb = null; serve.classList.add('hidden'); }
export function tempoAtendimento(p) { serveTimer.style.width = Math.max(0, p * 100) + '%'; }

/* ---------------- caixa ---------------- */
let caixaCb = null, caixaSel = 0, caixaN = 0;
export function abrirCaixa(label, opcoes, progresso, aoEscolher) {
  caixaCb = aoEscolher; caixaSel = 0; caixaN = opcoes.length;
  caixaStep.textContent = label;
  caixaProg.style.width = Math.round(progresso * 100) + '%';
  caixaOpts.innerHTML = '';
  opcoes.forEach((o, i) => {
    const b = document.createElement('button');
    b.className = 'opt' + (i === 0 ? ' sel' : '');
    b.textContent = o;
    b.onpointerdown = e => { e.preventDefault(); escolherCaixa(i); };
    caixaOpts.appendChild(b);
  });
  caixa.classList.remove('hidden');
}
export function caixaAberta() { return !caixa.classList.contains('hidden'); }
export function moverCaixa(d) {
  if (!caixaAberta()) return;
  caixaSel = (caixaSel + d + caixaN) % caixaN;
  [...caixaOpts.children].forEach((c, i) => c.classList.toggle('sel', i === caixaSel));
  sfx('clique');
}
export function confirmarCaixa() { if (caixaAberta()) escolherCaixa(caixaSel); }
function escolherCaixa(i) {
  const cb = caixaCb;
  if (cb) cb(i);
}
export function fecharCaixa() { caixaCb = null; caixa.classList.add('hidden'); }

export function esconderTudo() {
  serve.classList.add('hidden');
  caixa.classList.add('hidden');
  talk.classList.add('hidden');
  tasklist.classList.add('hidden');
  toasts.innerHTML = '';
}

/* ============================================================
   shop.js - a Loja das Meias. É aqui que a Andreia faz literalmente tudo.
   ============================================================ */
import { ctx, view, clear, text, measure } from '../engine/screen.js';
import { draw as blit } from '../engine/sprites.js';
import { TILES, DEFAULT_TILE } from '../data/tiles.js';
import { MAP } from '../data/map.js';
import { CHARS, CLIENTS, PROPS, SONIA_SIT, makeSockBig } from '../data/sprites.js';
import { MEIAS, meiaAleatoria } from '../data/socks.js';
import { TIPOS_CLIENTE } from '../data/dialogue.js';
import {
  SONIA_FALAS, SONIA_SAIDA, RECUSAS, RECUSAS_EXTRA, COMPRAS, ANDREIA_SIM,
  ANDREIA_CANSACO, EVENTOS_TEXTO, CAIXA_PASSOS
} from '../data/dialogue.js';
import { criarCliente, atualizarCliente, sair, verdicto } from './customers.js';
import { S, resetTurno, relogio, gastarEnergia, darEnergia, DURACAO_NORMAL, DURACAO_TOTAL } from './state.js';
import * as UI from './ui.js';
import { fx } from '../engine/fx.js';
import { moveVector, btn, consume } from '../engine/input.js';
import { playMusic, sfx, musicVolume } from '../engine/audio.js';
import { register, go } from '../engine/scene.js';

const T = 16;
const MW = MAP.tiles[0].length, MH = MAP.tiles.length;

/* ---------------- sprites derivados ---------------- */
const SOCK_SPR = {};
for (const m of MEIAS) SOCK_SPR[m.id] = makeSockBig(m.cor, m.punho);

/* ---------------- estado da cena ---------------- */
const A = {                       // a Andreia (x,y = pés)
  x: 0, y: 0, dir: 'down', anim: 0, mov: false,
  carrega: null,                  // null | {tipo:'caixa', pares} | {tipo:'esfregona'}
  trabalho: null,                 // { tipo, alvo, prog }
  passo: 0
};
const SONIA = { x: 0, y: 0, saindo: false, saiu: false, chama: 0, anim: 0 };

let prateleiras = [], solidos = [], deco = [], pontosValidos = [];
let clientes = [], caixasStock = [], meiasChao = [], meiasRua = [], meiasTeto = [];
let chao = null, chaoMolhado = null, chaoTiles = [];
let camX = 0, camY = 0, animT = 0;
let bolhas = [];
let promptAcao = null;
let tSpawn = 0, tStock = 0, tSonia = 0, tEvento = 0;
let avisoMolhado = 0, avisoEnergia = 0;
let clienteAtivo = null, tempoAtendimento = 0;
let caixaPasso = 0, caixaResposta = null, caixaInterrupcao = 0;
let cutscene = null;
let tarefas = [];

/* ============================================================
   ARRANQUE
   ============================================================ */
export function iniciarTurno() {
  resetTurno();
  A.x = MAP.spawn.x * T; A.y = MAP.spawn.y * T;
  A.dir = 'up'; A.carrega = null; A.trabalho = null; A.anim = 0;

  const sec = MAP.objects.find(o => o.kind === 'secretaria');
  SONIA.x = (sec.x + sec.w / 2) * T; SONIA.y = (sec.y + sec.h) * T + 4;
  SONIA.saindo = false; SONIA.saiu = false; SONIA.chama = 0;

  prateleiras = MAP.objects.filter(o => o.kind === 'prateleira').map(o => Object.assign({}, o, {
    arrumacao: 88 + Math.random() * 12,
    frente: { x: (o.x + o.w / 2) * T, y: (o.y + o.h) * T + 8 }
  }));
  solidos = MAP.objects.filter(o => !o.deco).map(o => ({
    x: o.x * T, y: o.y * T, w: o.w * T, h: o.h * T, kind: o.kind, key: o.key
  }));
  deco = MAP.objects.filter(o => o.deco);

  clientes = []; caixasStock = []; meiasChao = []; meiasRua = []; bolhas = [];
  clienteAtivo = null; caixaPasso = 0; cutscene = null; promptAcao = null;
  tSpawn = 4; tStock = 6; tSonia = 20; tEvento = 16;
  avisoMolhado = 0; avisoEnergia = 0;

  meiasTeto = MAP.teto.slice(0, 3).map(p => ({ x: p.x * T, y: p.y * T, meia: meiaAleatoria().id, fase: Math.random() * 6 }));
  S.stats.meiasTeto = meiasTeto.length;

  // chão: sujo aqui e ali
  chao = new Uint8Array(MW * MH);
  chaoMolhado = new Float32Array(MW * MH);
  chaoTiles = [];
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
    const t = TILES[MAP.tiles[y][x]];
    if (t && t.chao && !tapadoPorObjeto(x, y)) {
      chaoTiles.push(y * MW + x);
      chao[y * MW + x] = Math.random() < 0.06 * S.dia.sujidade ? 1 : 0;
    }
  }

  construirGrelha();
  // só usamos pontos de paragem a que os clientes conseguem mesmo chegar
  const porta = MAP.portaLoja;
  pontosValidos = MAP.pontosCliente.filter(p =>
    calcularRota(porta.x * T, porta.y * T, p.x * T, p.y * T) !== null);
  if (!pontosValidos.length) pontosValidos = MAP.pontosCliente.slice();

  for (let i = 0; i < 2; i++) largarMeiaEm(3 + Math.random() * 11, 6 + Math.random() * 6);

  tarefas = [
    { id: 'loja', label: 'Arrumar loja', feito: false },
    { id: 'stock', label: 'Fazer stock', feito: false },
    { id: 'caixa', label: 'Fazer caixa', feito: false },
    { id: 'chao', label: 'Limpar chão', feito: false },
    { id: 'clientes', label: 'Atender', feito: false },
    { id: 'meias', label: 'Apanhar meias', feito: false }
  ];
  UI.showTasklist(false);
  UI.esconderTudo();
  UI.showHud(true);
  playMusic('loja');
  musicVolume(0.5);
  setTimeout(() => UI.toast(S.dia.nome, S.dia.id === 'complicado' ? 'bad' : 'good', 2800), 900);
}

/* ------------------------------------------------------------
   O RITMO DO DIA
   De manhã há tempo para respirar e para tratar do stock.
   À tarde entra mais gente e a loja suja-se a sério.
   Na última hora é a correr, mas já não chega stock novo.
   ------------------------------------------------------------ */
function progressoDoDia() {
  if (S.fase === 'ultima' || S.fase === 'fim') return 1;
  return Math.min(1, S.t / DURACAO_NORMAL);
}
function ritmoClientes() {
  const p = progressoDoDia();
  let base;
  if (S.fase === 'ultima') base = 7.5;
  else if (p < 0.30) base = 13;      // manhã: quase de preparação
  else if (p < 0.62) base = 10;      // meio do dia
  else base = 8.2;                   // tarde
  return base * S.dia.clientes;
}
function maxClientes() {
  const p = progressoDoDia();
  if (S.fase === 'ultima') return 5;
  if (p < 0.30) return 3;
  if (p < 0.62) return 4;
  return 5;
}
function ritmoStock() {
  const p = progressoDoDia();
  if (S.fase === 'ultima') return 1e9;   // já não chega stock a esta hora
  let base;
  if (p < 0.32) base = 18;               // as entregas são de manhã
  else if (p < 0.62) base = 30;
  else base = 58;                        // ao fim da tarde quase nada
  return base / S.dia.stock;
}
function fatorSujidade() {
  const p = progressoDoDia();
  const curva = S.fase === 'ultima' ? 0.7 : (0.22 + p * 0.9);
  return curva * S.dia.sujidade;
}
function fatorDesarruma() {
  const p = progressoDoDia();
  const curva = S.fase === 'ultima' ? 1.05 : (0.42 + p * 0.7);
  return curva * S.dia.desarruma;
}
function ritmoEventos() {
  const p = progressoDoDia();
  if (S.fase === 'ultima') return 13 + Math.random() * 10;
  if (p < 0.32) return 22 + Math.random() * 14;
  if (p < 0.62) return 16 + Math.random() * 12;
  return 13 + Math.random() * 11;
}

function tapadoPorObjeto(tx, ty) {
  return MAP.objects.some(o => !o.deco && tx >= o.x && tx < o.x + o.w && ty >= o.y && ty < o.y + o.h);
}

/* ============================================================
   COLISÕES E CHÃO
   ============================================================ */
function tileEm(px, py) {
  const tx = Math.floor(px / T), ty = Math.floor(py / T);
  if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) return DEFAULT_TILE;
  return TILES[MAP.tiles[ty][tx]] || DEFAULT_TILE;
}
function solidoEm(px, py) {
  if (tileEm(px, py).solid) return true;
  for (const o of solidos) if (px >= o.x && px < o.x + o.w && py >= o.y && py < o.y + o.h) return true;
  return false;
}
export function podeAndar(px, py) {
  return !(solidoEm(px - 5, py - 3) || solidoEm(px + 5, py - 3) ||
           solidoEm(px - 5, py + 3) || solidoEm(px + 5, py + 3));
}
/* ------------------------------------------------------------
   Caminhos: grelha de tiles andáveis + BFS.
   Os clientes seguem waypoints, nunca andam "a direito contra
   as estantes" - era isso que os deixava presos a tremer.
   ------------------------------------------------------------ */
let grelha = null;

function construirGrelha() {
  grelha = new Uint8Array(MW * MH);
  for (let y = 0; y < MH; y++) {
    for (let x = 0; x < MW; x++) {
      grelha[y * MW + x] = podeAndar(x * T + T / 2, y * T + T / 2) ? 1 : 0;
    }
  }
}
function tileAndavel(tx, ty) {
  if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) return false;
  return grelha[ty * MW + tx] === 1;
}
function tileMaisPerto(tx, ty) {
  if (tileAndavel(tx, ty)) return [tx, ty];
  for (let r = 1; r <= 5; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
        if (tileAndavel(tx + dx, ty + dy)) return [tx + dx, ty + dy];
      }
    }
  }
  return null;
}
function calcularRota(x0, y0, x1, y1) {
  const a = tileMaisPerto(Math.floor(x0 / T), Math.floor(y0 / T));
  const b = tileMaisPerto(Math.floor(x1 / T), Math.floor(y1 / T));
  if (!a || !b) return null;
  const inicio = a[1] * MW + a[0], destino = b[1] * MW + b[0];
  if (inicio === destino) return [{ x: x1, y: y1 }];

  const prev = new Int32Array(MW * MH).fill(-1);
  prev[inicio] = -2;
  const fila = [inicio];
  let achou = false;
  for (let head = 0; head < fila.length; head++) {
    const cur = fila[head];
    if (cur === destino) { achou = true; break; }
    const cx = cur % MW, cy = (cur / MW) | 0;
    const viz = [cx + 1, cy, cx - 1, cy, cx, cy + 1, cx, cy - 1];
    for (let k = 0; k < 8; k += 2) {
      const nx = viz[k], ny = viz[k + 1];
      if (!tileAndavel(nx, ny)) continue;
      const ni = ny * MW + nx;
      if (prev[ni] !== -1) continue;
      prev[ni] = cur;
      fila.push(ni);
    }
  }
  if (!achou) return null;

  const pontos = [];
  let cur = destino;
  while (cur >= 0) {
    const cx = cur % MW, cy = (cur / MW) | 0;
    pontos.push({ x: cx * T + T / 2, y: cy * T + T / 2 });
    const p = prev[cur];
    if (p === -2) break;
    cur = p;
  }
  pontos.reverse();
  const ultimoTile = Math.floor(x1 / T) + ',' + Math.floor(y1 / T);
  if (b[0] + ',' + b[1] === ultimoTile) pontos.push({ x: x1, y: y1 });
  return pontos;
}

function idxTile(px, py) {
  const tx = Math.floor(px / T), ty = Math.floor(py / T);
  if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) return -1;
  return ty * MW + tx;
}
function sujar(px, py) {
  const i = idxTile(px, py);
  if (i < 0 || !chaoTiles.includes(i)) return;
  if (chao[i] !== 1) { chao[i] = 1; chaoMolhado[i] = 0; }
}
function percentChaoLimpo() {
  if (!chaoTiles.length) return 100;
  let limpos = 0;
  // molhado também conta como limpo: acabou de ser esfregado, está só a secar
  for (const i of chaoTiles) if (chao[i] !== 1) limpos++;
  return Math.round(limpos / chaoTiles.length * 100);
}

/* ============================================================
   MEIAS, STOCK, PRATELEIRAS
   ============================================================ */
function largarMeiaEm(tx, ty) {
  meiasChao.push({ x: tx * T, y: ty * T, meia: meiaAleatoria().id, t: 0 });
  S.stats.meiasChao++;
}
function largarMeia(px, py) {
  if (meiasChao.length > 26) return;
  meiasChao.push({ x: px + (Math.random() - 0.5) * 14, y: py + (Math.random() - 0.5) * 10, meia: meiaAleatoria().id, t: 0 });
  S.stats.meiasChao++;
  sfx('meia');
}
function desarrumar(p, q) { p.arrumacao = Math.max(0, p.arrumacao - q * fatorDesarruma()); }
function arrumacaoMedia() {
  if (!prateleiras.length) return 100;
  return Math.round(prateleiras.reduce((a, p) => a + p.arrumacao, 0) / prateleiras.length);
}
function stockPendente() { return caixasStock.reduce((a, c) => a + c.pares, 0); }

function chegarStock(surpresa) {
  const p = MAP.pontosStock[(Math.random() * MAP.pontosStock.length) | 0];
  const pares = Math.round((6 + Math.random() * 11) * (S.fase === 'ultima' ? 0.5 : 1));
  caixasStock.push({ x: p.x * T + (Math.random() - .5) * 10, y: p.y * T, pares, t: 0 });
  S.stats.stockRecebido += pares;
  sfx('caixote');
  fx.burst(p.x * T, p.y * T, { count: 8, speed: 26, life: .5, color: '#d4a771', grav: 40 });
  UI.toast(surpresa ? EVENTOS_TEXTO.stockSurpresa : EVENTOS_TEXTO.stock, '', 2200);
  if (stockPendente() > 45) UI.toast('STOCK ACUMULADO: ' + stockPendente() + ' PARES', 'bad', 2600);
}

/* ============================================================
   BOLHAS
   ============================================================ */
function bolha(x, y, texto, cor, dur, quem) {
  bolhas.push({ x, y, texto, cor: cor || '#f8f4ea', t: dur || 2, quem });
}

/* ============================================================
   ANDREIA
   ============================================================ */
let areaAtual = 'loja';
function musicaDaArea() {
  const ty = A.y / T;
  const nova = ty > 18 ? 'cafe' : (ty > 13.6 ? 'rua' : 'loja');
  if (nova === areaAtual) return;
  areaAtual = nova;
  if (nova === 'cafe') playMusic('venezia');
  else playMusic(S.fase === 'ultima' ? 'corrida' : 'loja');
}

function velocidade() {
  let v = 48;
  if (A.carrega && A.carrega.tipo === 'caixa') v = 36;
  if (A.carrega && A.carrega.tipo === 'esfregona') v = 42;
  if (S.energia <= 0) v *= 0.62;
  else if (S.energia < 25) v *= 0.82;
  return v;
}

function moverAndreia(dt) {
  const v = moveVector();
  const sp = velocidade();
  const dx = v.x * sp * dt, dy = v.y * sp * dt;
  A.mov = (v.x !== 0 || v.y !== 0);
  if (A.mov) {
    if (Math.abs(v.x) > Math.abs(v.y)) A.dir = v.x > 0 ? 'right' : 'left';
    else A.dir = v.y > 0 ? 'down' : 'up';
    A.anim += dt;
    A.passo += Math.abs(dx) + Math.abs(dy);
    if (A.passo > 26) { A.passo = 0; if (Math.random() < 0.5) sfx('clique'); }
  }
  const antes = idxTile(A.x, A.y);
  if (dx && podeAndar(A.x + dx, A.y)) A.x += dx;
  if (dy && podeAndar(A.x, A.y + dy)) A.y += dy;
  const agora = idxTile(A.x, A.y);
  if (agora !== antes) pisar(agora);

  // apanhar meias do chão só de passar por cima
  for (let i = meiasChao.length - 1; i >= 0; i--) {
    const m = meiasChao[i];
    if (Math.abs(m.x - A.x) < 9 && Math.abs(m.y - A.y) < 9) {
      meiasChao.splice(i, 1);
      S.stats.apanhadas++;
      sfx('meia');
      fx.burst(m.x, m.y, { count: 4, speed: 22, life: .4, color: '#ffc44d', grav: 30 });
    }
  }
  for (let i = meiasRua.length - 1; i >= 0; i--) {
    const m = meiasRua[i];
    if (Math.abs(m.x - A.x) < 9 && Math.abs(m.y - A.y) < 9) {
      meiasRua.splice(i, 1);
      S.stats.meiasRua++;
      sfx('meia');
      UI.toast('Meia recuperada da rua.', 'good', 1600);
    }
  }
}

function pisar(i) {
  if (i < 0 || !chaoTiles.includes(i)) return;
  const comEsfregona = A.carrega && A.carrega.tipo === 'esfregona';
  if (chao[i] === 2) {                        // chão molhado
    chao[i] = 1; chaoMolhado[i] = 0;
    if (avisoMolhado <= 0) {
      avisoMolhado = 2.5;
      UI.toast('ANDREIA PISOU O CHÃO MOLHADO.', 'bad', 1800);
      bolha(A.x, A.y - 20, '🙂', '#ffc44d', 1.4);
      sfx('erro');
    }
    return;
  }
  if (!comEsfregona) return;

  // a esfregona limpa uma faixa: o tile debaixo dos pés e os dois ao lado
  const tx = i % MW, ty = (i / MW) | 0;
  const lado = (A.dir === 'left' || A.dir === 'right') ? [[0, -1], [0, 0], [0, 1]] : [[-1, 0], [0, 0], [1, 0]];
  let limpou = false;
  for (const [dx, dy] of lado) {
    const j = (ty + dy) * MW + (tx + dx);
    if (tx + dx < 0 || tx + dx >= MW || ty + dy < 0 || ty + dy >= MH) continue;
    if (!chaoTiles.includes(j)) continue;
    if (chao[j] !== 1) continue;
    chao[j] = 2; chaoMolhado[j] = 4.5;
    limpou = true;
  }
  if (limpou) {
    gastarEnergia(0.8);
    sfx('esfregona');
    fx.burst(A.x, A.y, { count: 3, speed: 16, life: .4, color: '#9fd4ea', grav: 10 });
  }
}

/* ---------------- o que a Andreia pode fazer aqui ---------------- */
function alvoDeAcao() {
  let melhor = null;
  const testar = (px, py, alcance, obj) => {
    const d = Math.hypot(px - A.x, py - A.y);
    if (d > alcance) return;
    if (!melhor || d < melhor.d) melhor = Object.assign({ d }, obj);
  };

  // cliente à espera
  for (const c of clientes) {
    if (c.estado === 'esperar') testar(c.x, c.y, 26, { tipo: 'atender', label: 'ATENDER', alvo: c });
  }
  // caixa de stock
  if (!A.carrega) {
    for (const cx of caixasStock) testar(cx.x, cx.y, 22, { tipo: 'pegarCaixa', label: 'PEGAR CAIXA', alvo: cx });
  }
  // prateleiras
  for (const p of prateleiras) {
    if (A.carrega && A.carrega.tipo === 'caixa') {
      testar(p.frente.x, p.frente.y, 26, { tipo: 'stock', label: 'ARRUMAR STOCK', alvo: p });
    } else if (!A.carrega && p.arrumacao < 99) {
      testar(p.frente.x, p.frente.y, 26, { tipo: 'arrumar', label: 'ARRUMAR ' + p.nome, alvo: p });
    }
  }
  // esfregona / balde
  const balde = solidos.find(o => o.kind === 'balde');
  if (balde) {
    const bx = balde.x + balde.w / 2, by = balde.y + balde.h + 4;
    if (!A.carrega) testar(bx, by, 24, { tipo: 'pegarEsfregona', label: 'PEGAR ESFREGONA' });
  }
  // balcão / caixa
  const maosLivres = !A.carrega || A.carrega.tipo === 'esfregona';
  const bal = solidos.find(o => o.kind === 'balcao');
  if (bal && maosLivres) {
    const bx = bal.x + bal.w / 2, by = bal.y + bal.h + 6;
    if (!S.caixaFeita) testar(bx, by, 28, { tipo: 'caixa', label: S.fase === 'ultima' ? 'FAZER A CAIXA' : 'CAIXA (SÓ NO FIM)' });
  }
  // Venezia
  const cafe = solidos.find(o => o.kind === 'balcaoCafe');
  if (cafe && maosLivres) {
    const bx = cafe.x + cafe.w / 2, by = cafe.y + cafe.h + 7;
    testar(bx, by, 34, { tipo: 'sandes', label: '🥪 SANDES DE ATUM' });
  }
  const maq = solidos.find(o => o.kind === 'maquinaCafe');
  if (maq && maosLivres) {
    const bx = maq.x + maq.w / 2, by = maq.y + maq.h + 7;
    testar(bx, by, 30, { tipo: 'cafe', label: '☕ CAFÉ' });
  }
  // Sónia
  if (!SONIA.saiu && SONIA.chama > 0) testar(SONIA.x, SONIA.y + 6, 26, { tipo: 'sonia', label: 'FALAR COM A SÓNIA' });

  return melhor;
}

function acaoInstantanea(a) {
  if (a.tipo === 'atender') { atender(a.alvo); return true; }
  if (a.tipo === 'pegarCaixa') {
    A.carrega = { tipo: 'caixa', pares: a.alvo.pares };
    caixasStock.splice(caixasStock.indexOf(a.alvo), 1);
    sfx('caixote'); gastarEnergia(2);
    return true;
  }
  if (a.tipo === 'pegarEsfregona') {
    A.carrega = { tipo: 'esfregona' };
    sfx('esfregona');
    UI.toast('Esfregona na mão. Cuidado onde pisas.', '', 2000);
    return true;
  }
  if (a.tipo === 'caixa') {
    if (S.fase !== 'ultima') { bolha(A.x, A.y - 22, 'Só ao fim do dia 😊', '#ffc44d', 1.8); return true; }
    abrirCaixaMini();
    return true;
  }
  if (a.tipo === 'sonia') { falarComSonia(); return true; }
  if (a.tipo === 'sandes') {
    darEnergia(35);
    S.stats.sandes++;
    sfx('energia');
    UI.refreshHud(infoHud());
    UI.toast('🥪 Andreia comeu uma sandes de atum.  +35 ENERGIA', 'good', 2400);
    bolha(A.x, A.y - 24, 'Já me sinto melhor 😊', '#6fd18a', 2);
    fx.burst(A.x, A.y - 6, { count: 8, speed: 24, life: .6, color: '#6fd18a', grav: 20 });
    return true;
  }
  if (a.tipo === 'cafe') {
    darEnergia(15);
    S.stats.cafes++;
    sfx('energia');
    UI.refreshHud(infoHud());
    UI.toast('☕ Andreia bebeu um café.  +15 ENERGIA', 'good', 2200);
    bolha(A.x, A.y - 24, 'Era mesmo disto que eu precisava.', '#6fd18a', 2);
    return true;
  }
  return false;
}

function trabalhoDuracao(tipo) {
  if (tipo === 'arrumar') return 0.85;
  if (tipo === 'stock') return 1.2;
  return 1;
}

function concluirTrabalho(w) {
  if (w.tipo === 'arrumar') {
    const ganho = 46 + Math.random() * 16;
    const antes = w.alvo.arrumacao;
    w.alvo.arrumacao = Math.min(100, w.alvo.arrumacao + ganho);
    S.stats.arrumados += Math.round((w.alvo.arrumacao - antes) / 100 * 24);
    gastarEnergia(5);
    sfx('arrumar');
    fx.burst(w.alvo.frente.x, w.alvo.frente.y - 8, { count: 5, speed: 20, life: .5, color: '#ff86b0', grav: 20 });
    if (w.alvo.arrumacao >= 99) bolha(A.x, A.y - 22, 'Pronto 😊', '#6fd18a', 1.4);
  } else if (w.tipo === 'stock') {
    const pares = A.carrega ? A.carrega.pares : 0;
    S.stats.stockArrumado += pares;
    w.alvo.arrumacao = Math.min(100, w.alvo.arrumacao + 18);
    A.carrega = null;
    gastarEnergia(7);
    sfx('caixote');
    fx.burst(w.alvo.frente.x, w.alvo.frente.y - 10, { count: 8, speed: 26, life: .6, color: '#d4a771', grav: 20 });
    UI.toast('+' + pares + ' pares arrumados', 'good', 1500);
  }
}

/* ---------------- atendimento ---------------- */
function atender(c) {
  clienteAtivo = c;
  c.estado = 'atendido';
  tempoAtendimento = 8;
  const p = c.pergunta;
  bolha(A.x, A.y - 22, ANDREIA_SIM[(Math.random() * ANDREIA_SIM.length) | 0], '#ffc44d', 1.6);
  UI.abrirAtendimento(p.q, p.opts, i => responder(c, i === p.bom));
}

function responder(c, boa) {
  clienteAtivo = null;
  S.stats.atendidos++;
  gastarEnergia(1.5);
  c.perguntasFeitas++;
  c.atendido = true;

  const seg = c.pergunta && c.pergunta.seguimento;
  if (seg && seg.length) {
    c.estado = 'conversa';
    c.seg = seg.map(l => l.slice());
    c.segT = 0.15;
    c.segBoa = boa;
    return;
  }
  concluirAtendimento(c, boa);
}

/* as falas de seguimento aparecem em balão, sem parar o jogo */
function atualizarConversas(dt) {
  for (const c of clientes.slice()) {
    if (c.estado !== 'conversa') continue;
    c.segT -= dt;
    if (c.segT > 0) continue;
    if (!c.seg.length) { concluirAtendimento(c, c.segBoa); continue; }
    const [quem, texto] = c.seg.shift();
    if (quem === 'ANDREIA') bolha(A.x, A.y - 24, texto, '#ffc44d', 2, 'ANDREIA');
    else bolha(c.x, c.y - 22, texto, c.tipo.cor, 2, quem === 'ALBERTO' ? 'SR. ALBERTO' : 'CLIENTE');
    c.segT = 1.1 + texto.length * 0.022;
  }
}

function concluirAtendimento(c, boa) {
  if (!clientes.includes(c)) return;
  if (c.perguntasFeitas < c.tipo.perguntas && Math.random() < 0.75) {
    c.estado = 'ver';
    c.timer = 1.2 + Math.random() * 1.8;
    bolha(c.x, c.y - 22, 'E aquelas ali?', c.tipo.cor, 1.8);
    return;
  }
  if (verdicto(c, boa)) {
    S.stats.vendas++;
    sfx('registo');
    bolha(c.x, c.y - 22, COMPRAS[(Math.random() * COMPRAS.length) | 0], '#6fd18a', 2);
    UI.toast('VENDA! +1  (' + S.stats.vendas + ' hoje)', 'good', 2200);
    fx.burst(c.x, c.y - 8, { count: 12, speed: 32, life: .8, color: '#6fd18a', grav: 30 });
    setTimeout(() => bolha(A.x, A.y - 24, 'Obrigada 😊', '#ffc44d', 1.8), 500);
  } else {
    S.stats.recusas++;
    sfx('recusa');
    const pool = Math.random() < 0.5 ? RECUSAS : RECUSAS_EXTRA;
    bolha(c.x, c.y - 22, pool[(Math.random() * pool.length) | 0], c.tipo.cor, 2.2);
  }
  sair(c, mundo);
}

/* ---------------- caixa ---------------- */
function abrirCaixaMini() {
  caixaInterrupcao = 3 + Math.random() * 5;
  passoCaixa();
}
function passoCaixa() {
  const passo = CAIXA_PASSOS[caixaPasso];
  if (!passo) return;
  if (passo.tipo === 'contar') {
    const valores = [];
    const n = 3 + ((Math.random() * 2) | 0);
    for (let i = 0; i < n; i++) valores.push([5, 10, 20, 50][(Math.random() * 4) | 0]);
    const total = valores.reduce((a, b) => a + b, 0);
    caixaResposta = total;
    const ops = [total, total + 5 + ((Math.random() * 10) | 0), Math.max(5, total - 5 - ((Math.random() * 10) | 0))]
      .sort(() => Math.random() - 0.5);
    UI.abrirCaixa(passo.label + ': ' + valores.map(v => v + '€').join(' + '),
      ops.map(o => o + '€'), caixaPasso / CAIXA_PASSOS.length,
      i => {
        if (ops[i] === caixaResposta) { sfx('registo'); caixaPasso++; avancarCaixa(); }
        else { sfx('erro'); UI.toast('A conta não bate certo.', 'bad', 1600); passoCaixa(); }
      });
  } else if (passo.tipo === 'confirmar') {
    UI.abrirCaixa('Bate tudo certo?', ['SIM', 'CONTAR OUTRA VEZ'], caixaPasso / CAIXA_PASSOS.length, i => {
      if (i === 0) { sfx('registo'); caixaPasso++; avancarCaixa(); }
      else { caixaPasso = Math.max(0, caixaPasso - 1); sfx('clique'); passoCaixa(); }
    });
  } else {
    UI.abrirCaixa('Fechar a caixa', ['FECHAR'], caixaPasso / CAIXA_PASSOS.length, () => {
      S.caixaFeita = true;
      UI.fecharCaixa();
      sfx('registo');
      UI.toast('CAIXA FEITA ✔', 'good', 2200);
      bolha(A.x, A.y - 22, 'Feito 😊', '#6fd18a', 1.6);
    });
  }
}
function avancarCaixa() {
  if (caixaPasso >= CAIXA_PASSOS.length) { UI.fecharCaixa(); S.caixaFeita = true; return; }
  passoCaixa();
}
function interromperCaixa() {
  UI.fecharCaixa();
  sfx('pergunta');
  UI.toast('“Desculpe…”', 'bad', 2000);
  bolha(A.x, A.y - 22, 'Sim? 😊', '#ffc44d', 1.6);
}

/* ---------------- Sónia ---------------- */
function falarComSonia() {
  SONIA.chama = 0;
  const falas = SONIA_FALAS[(Math.random() * SONIA_FALAS.length) | 0];
  UI.playTalk(falas);
  sfx('sonia');
}
function soniaAmbiente() {
  const falas = SONIA_FALAS[(Math.random() * SONIA_FALAS.length) | 0];
  let i = 0;
  const proxima = () => {
    if (i >= falas.length) return;
    const [quem, texto] = falas[i++];
    if (quem === 'SÓNIA') bolha(SONIA.x, SONIA.y - 26, texto, '#9fd4ea', 2.2, 'SÓNIA');
    else bolha(A.x, A.y - 24, texto, '#ffc44d', 2.2, 'ANDREIA');
    setTimeout(proxima, 1200);
  };
  proxima();
  sfx('sonia');
}

/* ============================================================
   MUNDO (o que os clientes precisam de saber)
   ============================================================ */
const mundo = {
  porta: MAP.portaLoja,
  escolherPonto: () => pontosValidos[(Math.random() * pontosValidos.length) | 0] || MAP.pontosCliente[0],
  prateleiraPerto: (px, py) => {
    let melhor = null, dm = 1e9;
    for (const p of prateleiras) {
      const d = Math.hypot(p.frente.x - px, p.frente.y - py);
      if (d < dm) { dm = d; melhor = p; }
    }
    return dm < 40 ? melhor : null;
  },
  desarrumar,
  largarMeia,
  fatorCaos: () => fatorDesarruma(),
  aviso: c => { sfx('pergunta'); bolha(c.x, c.y - 22, c.saudacao, c.tipo.cor, 1.8); },
  aoSair: c => {
    if (c.desarrumou > 16) {
      UI.toast('+' + Math.round(c.desarrumou) + ' MEIAS DESARRUMADAS', 'bad', 2200);
      bolha(A.x, A.y - 24, '🙂', '#ffc44d', 1.6);
    }
  },
  remover: c => {
    const i = clientes.indexOf(c);
    if (i >= 0) clientes.splice(i, 1);
    if (c.estado !== 'sair' || !c.atendido) { /* nada */ }
  },
  irPara: (c, alvo, sp, dt) => {
    const chave = Math.round(alvo.x) + ',' + Math.round(alvo.y);
    if (c.rotaChave !== chave) {
      c.rota = calcularRota(c.x, c.y, alvo.x, alvo.y);
      c.rotaChave = chave;
      c.rotaI = 0;
      c.tentativas = (c.tentativas || 0) + 1;
    }
    const rota = c.rota;
    if (!rota || !rota.length) { c.mov = false; return true; }   // sem caminho: fica por aqui
    if (c.rotaI >= rota.length) { c.mov = false; return true; }

    let p = rota[c.rotaI];
    let dx = p.x - c.x, dy = p.y - c.y;
    let d = Math.hypot(dx, dy);
    while (d < 1.5) {
      c.rotaI++;
      if (c.rotaI >= rota.length) { c.x = p.x; c.y = p.y; c.mov = false; return true; }
      p = rota[c.rotaI];
      dx = p.x - c.x; dy = p.y - c.y; d = Math.hypot(dx, dy);
    }
    const passo = Math.min(d, sp * dt);
    const antes = idxTile(c.x, c.y);
    c.x += dx / d * passo;
    c.y += dy / d * passo;
    c.mov = true;
    if (Math.abs(dx) > Math.abs(dy)) c.dir = dx > 0 ? 'right' : 'left';
    else c.dir = dy > 0 ? 'down' : 'up';
    const agora = idxTile(c.x, c.y);
    if (agora !== antes) pisarCliente(agora, c);
    return false;
  }
};

function pisarCliente(i, c) {
  if (i < 0 || !chaoTiles.includes(i)) return;
  if (chao[i] === 2 || chao[i] === 0) {
    if (Math.random() < 0.34 * fatorSujidade()) {
      const eraLimpo = chao[i] === 0 || chao[i] === 2;
      chao[i] = 1; chaoMolhado[i] = 0;
      if (eraLimpo && Math.random() < 0.3) {
        S.stats.pegadas += 3;
        UI.toast('+3 PEGADAS', 'bad', 1400);
        sfx('pegadas');
      }
    }
  }
}

/* ============================================================
   EVENTOS ALEATÓRIOS
   ============================================================ */
function eventoAleatorio() {
  const opcoes = ['meiaCaiu', 'desarrumou', 'stockSurpresa', 'meiaRua', 'meiaTeto', 'soniaChama', 'meiaCaiu', 'desarrumou'];
  let e = opcoes[(Math.random() * opcoes.length) | 0];
  // na última hora só muito raramente chega uma caixa (e pequena)
  if (e === 'stockSurpresa') {
    const faltaPouco = DURACAO_TOTAL - S.t < 45;
    if (faltaPouco || (S.fase === 'ultima' && Math.random() > 0.22)) e = 'meiaCaiu';
  }
  if (e === 'meiaCaiu') {
    const p = prateleiras[(Math.random() * prateleiras.length) | 0];
    largarMeia(p.frente.x, p.frente.y);
    desarrumar(p, 6);
    UI.toast(EVENTOS_TEXTO.meiaCaiu, '', 1800);
  } else if (e === 'desarrumou') {
    const p = prateleiras[(Math.random() * prateleiras.length) | 0];
    desarrumar(p, 38);
    largarMeia(p.frente.x - 6, p.frente.y);
    largarMeia(p.frente.x + 6, p.frente.y + 4);
    UI.toast(EVENTOS_TEXTO.desarrumou, 'bad', 2000);
  } else if (e === 'stockSurpresa') {
    chegarStock(true);
  } else if (e === 'meiaRua') {
    meiasRua.push({ x: (2 + Math.random() * 14) * T, y: (15 + Math.random() * 2) * T, meia: meiaAleatoria().id });
    UI.toast(EVENTOS_TEXTO.meiaRua, '', 2000);
  } else if (e === 'meiaTeto') {
    if (meiasTeto.length < MAP.teto.length) {
      const p = MAP.teto[meiasTeto.length];
      meiasTeto.push({ x: p.x * T, y: p.y * T, meia: meiaAleatoria().id, fase: Math.random() * 6 });
      S.stats.meiasTeto = meiasTeto.length;
      UI.toast(EVENTOS_TEXTO.meiaTeto, '', 2000);
    }
  } else if (e === 'soniaChama' && !SONIA.saiu) {
    SONIA.chama = 14;
    UI.toast(EVENTOS_TEXTO.soniaChama, '', 2000);
    sfx('sonia');
  }
}

/* ============================================================
   FASES DO TURNO
   ============================================================ */
function comecarCutscene() {
  S.fase = 'cutscene';
  UI.fecharAtendimento();
  UI.fecharCaixa();
  if (clienteAtivo) { clienteAtivo.estado = 'ver'; clienteAtivo.timer = 1; clienteAtivo = null; }
  SONIA.saindo = true;
  cutscene = { fase: 'sair', t: 0, falaAcabou: false };
  UI.playTalk(SONIA_SAIDA, () => { if (cutscene) cutscene.falaAcabou = true; });
  musicVolume(0.25);
}

function atualizarCutscene(dt) {
  cutscene.t += dt;
  if (cutscene.fase === 'sair') {
    if (!SONIA.saiu) {
      const porta = { x: MAP.portaLoja.x * T, y: MAP.portaLoja.y * T };
      const dx = porta.x - SONIA.x, dy = porta.y - SONIA.y;
      const d = Math.hypot(dx, dy);
      SONIA.anim += dt;
      if (d < 5) {
        SONIA.saiu = true;
        sfx('porta');
        fx.burst(porta.x, porta.y, { count: 6, speed: 20, life: .5, color: '#f8f4ea', grav: 10 });
      } else {
        SONIA.x += dx / d * 52 * dt;
        SONIA.y += dy / d * 52 * dt;
      }
    }
    // só avança quando a Sónia saiu E a conversa acabou
    if (SONIA.saiu && (cutscene.falaAcabou || cutscene.t > 8)) {
      cutscene.fase = 'pausa';
      cutscene.t = 0;
    }
  }
  if (cutscene.fase === 'pausa' && cutscene.t > 1.2) {
    S.fase = 'ultima';
    cutscene = null;
    UI.toast('ÚLTIMA HORA', 'bad big', 3200);
    setTimeout(() => UI.toast('TUDO TEM DE FICAR FEITO ANTES DE FECHAR', 'bad', 3000), 900);
    UI.showTasklist(true);
    playMusic('corrida');
    musicVolume(0.5);
    sfx('aviso');
    fx.flash('#ff6b6b', 0.3);
  }
}

function atualizarTarefas() {
  tarefas[0].feito = arrumacaoMedia() >= 90;
  tarefas[1].feito = caixasStock.length === 0 && !(A.carrega && A.carrega.tipo === 'caixa');
  tarefas[2].feito = S.caixaFeita;
  tarefas[3].feito = percentChaoLimpo() >= 88;
  tarefas[4].feito = !clientes.some(c => c.estado === 'esperar');
  tarefas[5].feito = meiasChao.length === 0;
  UI.renderTasklist(tarefas);
}

function fecharLoja() {
  S.fase = 'fim';
  UI.fecharAtendimento();
  UI.fecharCaixa();
  UI.showTasklist(false);
  sfx('fim');
  fx.transition(() => go('resumo', { tarefas, arrumacao: arrumacaoMedia(), chao: percentChaoLimpo(), stock: stockPendente(), meias: meiasChao.length }), { dur: 0.6, hold: 0.2 });
}

/* ============================================================
   CÂMARA E DESENHO
   ============================================================ */
function atualizarCamara() {
  const mapW = MW * T, mapH = MH * T;
  let x = A.x - view.w / 2, y = A.y - view.h / 2;
  camX = mapW <= view.w ? (mapW - view.w) / 2 : Math.max(0, Math.min(x, mapW - view.w));
  camY = mapH <= view.h ? (mapH - view.h) / 2 : Math.max(0, Math.min(y, mapH - view.h));
}

function desenharChao(cx, cy) {
  const x0 = Math.max(0, Math.floor(cx / T)), y0 = Math.max(0, Math.floor(cy / T));
  const x1 = Math.min(MW - 1, Math.ceil((cx + view.w) / T)), y1 = Math.min(MH - 1, Math.ceil((cy + view.h) / T));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const t = TILES[MAP.tiles[y][x]] || DEFAULT_TILE;
      ctx.drawImage(t.frames[0], (x * T - cx) | 0, (y * T - cy) | 0);
      const i = y * MW + x;
      const est = chao[i];
      if (!est) continue;
      const px = (x * T - cx) | 0, py = (y * T - cy) | 0;
      if (est === 1) {
        ctx.fillStyle = 'rgba(126,100,62,0.24)';
        ctx.fillRect(px, py, T, T);
        ctx.fillStyle = 'rgba(92,72,44,0.55)';
        ctx.fillRect(px + 3, py + 5, 3, 2); ctx.fillRect(px + 9, py + 10, 4, 2); ctx.fillRect(px + 6, py + 2, 2, 2);
      } else if (est === 2) {
        ctx.fillStyle = 'rgba(110,190,240,0.5)';
        ctx.fillRect(px, py, T, T);
        ctx.fillStyle = 'rgba(230,250,255,0.55)';
        const f = (Math.floor(animT * 4) + x + y) % 4;
        ctx.fillRect(px + 2 + f, py + 4, 3, 1);
        ctx.fillRect(px + 8, py + 11 - f, 4, 1);
      }
    }
  }
}

function desenharPersonagem(e, cx, cy, chars) {
  const set = chars[e.dir === 'up' ? 'up' : (e.dir === 'down' ? 'down' : 'side')];
  const ciclo = [1, 0, 2, 0];
  const idx = e.mov ? ciclo[Math.floor(e.anim * 9) % 4] : 0;
  const x = (e.x - 8 - cx) | 0, y = (e.y - 14 - cy) | 0;
  ctx.globalAlpha = 0.2; ctx.fillStyle = '#000';
  ctx.fillRect(x + 3, y + 13, 10, 3); ctx.globalAlpha = 1;
  blit(ctx, set[idx], x, y, e.dir === 'left');
}

function caixaTexto(x, y, txt, cor, tamanho) {
  const s = tamanho || 6;
  const w = Math.ceil(measure(txt, s)) + 7;
  const h = s + 7;
  const bx = Math.round(x - w / 2), by = Math.round(y - h);
  ctx.fillStyle = 'rgba(13,9,24,0.86)';
  ctx.fillRect(bx, by, w, h);
  ctx.fillStyle = cor;
  ctx.fillRect(bx, by, w, 1); ctx.fillRect(bx, by + h - 1, w, 1);
  ctx.fillRect(bx, by, 1, h); ctx.fillRect(bx + w - 1, by, 1, h);
  ctx.fillRect(bx + (w >> 1) - 1, by + h, 3, 2);
  text(txt, bx + 4, by + 4, { size: s, color: cor, shadow: false });
}

function desenhar() {
  clear('#14111f');
  atualizarCamara();
  const cx = Math.round(camX + fx.offsetX), cy = Math.round(camY + fx.offsetY);
  desenharChao(cx, cy);

  const lista = [];
  const push = (sort, fn) => lista.push({ sort, fn });

  for (const o of MAP.objects) {
    let spr = null;
    if (o.kind === 'prateleira') {
      const p = prateleiras.find(q => q.key === o.key);
      const est = p.arrumacao > 70 ? 0 : (p.arrumacao > 35 ? 1 : 2);
      spr = PROPS.prateleira[est];
    } else if (o.kind === 'balcao') spr = PROPS.balcao;
    else if (o.kind === 'secretaria') spr = PROPS.secretaria;
    else if (o.kind === 'balde') spr = PROPS.balde;
    else if (o.kind === 'planta') spr = PROPS.planta;
    else if (o.kind === 'letreiro') spr = PROPS.letreiro;
    else if (o.kind === 'venezia') spr = PROPS.venezia;
    else if (o.kind === 'balcaoCafe') spr = PROPS.balcaoCafe;
    else if (o.kind === 'maquinaCafe') spr = PROPS.maquinaCafe;
    else if (o.kind === 'mesaCafe') spr = PROPS.mesaCafe;
    if (!spr) continue;
    const baixo = (o.y + o.h) * T;
    const px = o.x * T + ((o.w * T - spr.width) / 2 | 0);
    push(o.deco ? -100 : baixo, () => blit(ctx, spr, px - cx, baixo - spr.height - cy));
  }

  // esfregona pousada no balde
  if (!A.carrega || A.carrega.tipo !== 'esfregona') {
    const b = solidos.find(o => o.kind === 'balde');
    if (b) push(b.y + b.h, () => blit(ctx, PROPS.esfregona, b.x + 2 - cx, b.y + b.h - PROPS.esfregona.height - cy));
  }

  for (const m of meiasChao) push(m.y + 6, () => blit(ctx, SOCK_SPR[m.meia], (m.x - 6 - cx) | 0, (m.y - 6 - cy) | 0));
  for (const m of meiasRua) push(m.y + 6, () => blit(ctx, SOCK_SPR[m.meia], (m.x - 6 - cx) | 0, (m.y - 6 - cy) | 0));

  for (const c of caixasStock) {
    push(c.y + 6, () => {
      blit(ctx, PROPS.caixaStock[1], (c.x - 10 - cx) | 0, (c.y - 14 - cy) | 0);
      caixaTexto(c.x - cx, c.y - 16 - cy, c.pares + '', '#d4a771', 6);
    });
  }

  for (const c of clientes) {
    push(c.y, () => {
      desenharPersonagem(c, cx, cy, c.spr);
      if (c.estado === 'esperar') {
        const bob = Math.sin(animT * 6) * 2;
        blit(ctx, PROPS.interrogacao, (c.x - 5 - cx) | 0, (c.y - 34 + bob - cy) | 0);
        const p = Math.max(0, c.paciencia / c.pacienciaMax);
        ctx.fillStyle = '#0d0918';
        ctx.fillRect((c.x - 9 - cx) | 0, (c.y - 20 - cy) | 0, 18, 3);
        ctx.fillStyle = p > 0.4 ? '#6fd18a' : '#ff6b6b';
        ctx.fillRect((c.x - 9 - cx) | 0, (c.y - 20 - cy) | 0, Math.round(18 * p), 3);
      }
    });
  }

  if (!SONIA.saiu) {
    push(SONIA.y, () => {
      if (SONIA.saindo && cutscene && cutscene.fase === 'sair') {
        desenharPersonagem({ x: SONIA.x, y: SONIA.y, dir: 'down', anim: SONIA.anim, mov: true }, cx, cy, CHARS.sonia);
      } else {
        const f = Math.floor(animT * 3) % 2;
        blit(ctx, SONIA_SIT[f], (SONIA.x - 8 - cx) | 0, (SONIA.y - 18 - cy) | 0);
        if (SONIA.chama > 0) {
          const bob = Math.sin(animT * 7) * 2;
          caixaTexto(SONIA.x - cx, SONIA.y - 26 + bob - cy, '!', '#ffc44d', 6);
        }
      }
    });
  }

  push(A.y, () => {
    desenharPersonagem(A, cx, cy, CHARS.andreia);
    if (A.carrega && A.carrega.tipo === 'caixa') {
      blit(ctx, PROPS.caixaStock[0], (A.x - 10 - cx) | 0, (A.y - 30 - cy) | 0);
    } else if (A.carrega && A.carrega.tipo === 'esfregona') {
      blit(ctx, PROPS.esfregona, (A.x + (A.dir === 'left' ? -12 : 4) - cx) | 0, (A.y - 22 - cy) | 0);
    }
  });

  lista.sort((a, b) => a.sort - b.sort);
  for (const e of lista) e.fn();

  // meias no teto (ficam sempre por cima da parede de trás)
  for (const m of meiasTeto) {
    const sw = Math.sin(animT * 1.6 + m.fase) * 2;
    blit(ctx, SOCK_SPR[m.meia], (m.x - 6 + sw - cx) | 0, (m.y - cy) | 0);
  }

  fx.drawParticles(cx, cy);

  // balões e etiqueta de acção: em DOM, para o texto ficar nítido
  const paraMostrar = bolhas.slice();
  if (promptAcao && !UI.atendimentoAberto() && !UI.caixaAberta() && !UI.talkAtivo()) {
    paraMostrar.push({ x: A.x, y: A.y - 20, texto: promptAcao.label, cor: '#6fd18a', acao: true, t: 1 });
  }
  UI.syncBubbles(paraMostrar, camX, camY, view.scale);

  if (A.trabalho) {
    const w = 26, p = Math.min(1, A.trabalho.prog / trabalhoDuracao(A.trabalho.tipo));
    const bx = (A.x - w / 2 - cx) | 0, by = (A.y - 34 - cy) | 0;
    ctx.fillStyle = '#0d0918'; ctx.fillRect(bx, by, w, 4);
    ctx.fillStyle = '#ffc44d'; ctx.fillRect(bx, by, Math.round(w * p), 4);
  }
}

/* ============================================================
   CENA
   ============================================================ */
register('loja', {
  enter() {
    iniciarTurno();
  },

  update(dt) {
    animT += dt;
    if (avisoMolhado > 0) avisoMolhado -= dt;

    for (let i = bolhas.length - 1; i >= 0; i--) {
      bolhas[i].t -= dt;
      if (bolhas[i].t <= 0) bolhas.splice(i, 1);
    }
    for (const i of chaoTiles) {
      if (chaoMolhado[i] > 0) {
        chaoMolhado[i] -= dt;
        if (chaoMolhado[i] <= 0 && chao[i] === 2) chao[i] = 0;
      }
    }

    // painéis abertos: o mundo continua, mas a Andreia está ocupada
    if (UI.atendimentoAberto()) {
      tempoAtendimento -= dt;
      UI.tempoAtendimento(tempoAtendimento / 8);
      if (consume('a')) UI.confirmarAtendimento();
      const v = moveVector();
      if (v.y < -0.5 && !A.navSub) { A.navSub = true; UI.moverAtendimento(-1); }
      else if (v.y > 0.5 && !A.navSub) { A.navSub = true; UI.moverAtendimento(1); }
      else if (Math.abs(v.y) < 0.3) A.navSub = false;
      if (tempoAtendimento <= 0 && clienteAtivo) {
        const c = clienteAtivo;
        UI.fecharAtendimento();
        clienteAtivo = null;
        S.stats.recusas++;
        bolha(c.x, c.y - 22, 'Vou pensar.', c.tipo.cor, 2);
        sair(c, mundo);
      }
    } else if (UI.caixaAberta()) {
      if (consume('a')) UI.confirmarCaixa();
      const v = moveVector();
      if (v.y < -0.5 && !A.navSub) { A.navSub = true; UI.moverCaixa(-1); }
      else if (v.y > 0.5 && !A.navSub) { A.navSub = true; UI.moverCaixa(1); }
      else if (Math.abs(v.y) < 0.3) A.navSub = false;
      if (consume('b')) { UI.fecharCaixa(); }
      caixaInterrupcao -= dt;
      if (caixaInterrupcao <= 0 && clientes.some(c => c.estado === 'esperar')) {
        interromperCaixa();
      }
    }

    UI.updateTalk(dt);

    /* ---- relógio ---- */
    if (S.fase !== 'fim') S.t += dt;
    if (S.fase === 'normal' && S.t >= DURACAO_NORMAL) comecarCutscene();
    if (S.fase === 'cutscene') { atualizarCutscene(dt); }
    atualizarTarefas();
    if (S.fase === 'ultima' && S.t >= DURACAO_TOTAL) { fecharLoja(); return; }

    const parado = S.fase === 'cutscene' || UI.atendimentoAberto() || UI.caixaAberta() || S.fase === 'fim';

    /* ---- Andreia ---- */
    if (!parado) {
      moverAndreia(dt);
      musicaDaArea();
      promptAcao = alvoDeAcao();

      // trabalho contínuo (manter A)
      if (A.trabalho) {
        const alvoT = A.trabalho.alvo;
        let aoAlcance = true;
        if (alvoT && alvoT.frente) {
          aoAlcance = Math.hypot(alvoT.frente.x - A.x, alvoT.frente.y - A.y) < 30;
        } else {
          aoAlcance = !!(promptAcao && promptAcao.tipo === A.trabalho.tipo);
        }
        if (!btn.a || !aoAlcance) { A.trabalho = null; }
        else {
          A.trabalho.prog += dt;
          if (A.trabalho.tipo === 'arrumar') gastarEnergia(4 * dt);
          if (A.trabalho.prog >= trabalhoDuracao(A.trabalho.tipo)) {
            concluirTrabalho(A.trabalho);
            A.trabalho = null;
          }
        }
      } else if (consume('a') && promptAcao) {
        if (!acaoInstantanea(promptAcao)) {
          A.trabalho = { tipo: promptAcao.tipo, alvo: promptAcao.alvo, prog: 0 };
        }
      }
      if (consume('b') && A.carrega) {
        if (A.carrega.tipo === 'caixa') {
          caixasStock.push({ x: A.x, y: A.y + 6, pares: A.carrega.pares, t: 0 });
          sfx('caixote');
        } else sfx('esfregona');
        A.carrega = null;
        A.trabalho = null;
      }

      // energia
      gastarEnergia((A.mov ? 0.55 : 0.28) * dt + (A.carrega && A.carrega.tipo === 'caixa' ? 0.7 * dt : 0));
      if (S.energia < 30 && avisoEnergia <= 0) {
        avisoEnergia = 26;
        UI.toast('ENERGIA BAIXA', 'bad', 2200);
        setTimeout(() => UI.toast(ANDREIA_CANSACO[(Math.random() * ANDREIA_CANSACO.length) | 0], '', 2400), 800);
      }
      avisoEnergia -= dt;
    }

    /* ---- clientes ---- */
    if (S.fase !== 'fim') {
      tSpawn -= dt;
      const podeEntrar = S.t < DURACAO_TOTAL - 13;   // ninguém entra mesmo à hora de fechar
      if (tSpawn <= 0 && clientes.length < maxClientes() && podeEntrar) {
        tSpawn = ritmoClientes() * (0.75 + Math.random() * 0.6);
        const c = criarCliente(MAP.portaLoja);
        clientes.push(c);
        S.stats.clientes++;
        sfx('porta');
        fx.burst(MAP.portaLoja.x * T, MAP.portaLoja.y * T, { count: 4, speed: 18, life: .4, color: '#f8f4ea', grav: 10 });
      }
      for (const c of clientes.slice()) atualizarCliente(c, dt, mundo);
      atualizarConversas(dt);
    }

    /* ---- stock ---- */
    if (S.fase !== 'fim') {
      tStock -= dt;
      if (tStock <= 0) {
        const r = ritmoStock();
        tStock = r * (0.8 + Math.random() * 0.5);
        if (r < 1e8) chegarStock(false);
      }
    }

    /* ---- Sónia ---- */
    if (!SONIA.saiu && S.fase === 'normal') {
      tSonia -= dt;
      if (tSonia <= 0) { tSonia = 22 + Math.random() * 18; soniaAmbiente(); }
      if (SONIA.chama > 0) SONIA.chama -= dt;
    }

    /* ---- eventos ---- */
    if (S.fase === 'normal' || S.fase === 'ultima') {
      tEvento -= dt;
      if (tEvento <= 0) { tEvento = ritmoEventos(); eventoAleatorio(); }
    }

    UI.refreshHud(infoHud());
  },

  draw() { desenhar(); }
});

function infoHud() {
  return {
    arrumacao: percentLoja(),
    stock: stockPendente(),
    meiasChao: meiasChao.length,
    aEspera: clientes.filter(c => c.estado === 'esperar').length
  };
}

export function percentLoja() {
  const pShelf = arrumacaoMedia();
  const pChao = percentChaoLimpo();
  const pMeias = Math.max(0, 100 - meiasChao.length * 6);
  const pStock = Math.max(0, 100 - stockPendente() * 1.6);
  return Math.round(pShelf * 0.4 + pChao * 0.25 + pMeias * 0.2 + pStock * 0.15);
}
/* ajudas de teste */
export function debugSujarTudo(frac) {
  for (const i of chaoTiles) chao[i] = Math.random() < (frac == null ? 1 : frac) ? 1 : 0;
}
export function debugRota(x, y) { return calcularRota(A.x, A.y, x, y); }
export function debugEstado() {
  return {
    tarefas: tarefas.map(t => ({ id: t.id, feito: t.feito })),
    arrumacao: arrumacaoMedia(),
    chao: percentChaoLimpo(),
    stock: stockPendente(),
    caixas: caixasStock.map(c => ({ x: c.x, y: c.y, pares: c.pares })),
    meias: meiasChao.map(m => ({ x: m.x, y: m.y })),
    prateleiras: prateleiras.map(p => ({ key: p.key, arrumacao: p.arrumacao, x: p.frente.x, y: p.frente.y })),
    clientes: clientes.map(c => ({ id: c.id, estado: c.estado, x: c.x, y: c.y, paciencia: c.paciencia })),
    carrega: A.carrega ? A.carrega.tipo : null,
    andreia: { x: A.x, y: A.y },
    sujos: (() => { const out = []; for (const i of chaoTiles) if (chao[i] === 1) out.push([(i % MW) * 16 + 8, ((i / MW) | 0) * 16 + 8]); return out; })(),
    caixaFeita: S.caixaFeita, fase: S.fase, t: S.t, dia: S.dia.id
  };
}

/* ajuda de teste: forçar um tipo de cliente à porta */
export function debugSpawn(tipoId) {
  const c = criarCliente(MAP.portaLoja);
  const t = TIPOS_CLIENTE.find(t => t.id === tipoId);
  if (t) {
    c.tipo = t;
    c.paciencia = c.pacienciaMax = t.paciencia;
    if (t.sprite != null) c.spr = CLIENTS[t.sprite % CLIENTS.length];
  }
  clientes.push(c);
  S.stats.clientes++;
  return c;
}

export { A, clientes, prateleiras };

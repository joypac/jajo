/* ============================================================
   customers.js - os clientes: entram, mexem em tudo, vão-se embora
   A lógica recebe um "mundo" com as ajudas de que precisa,
   para este ficheiro não depender da cena.
   ============================================================ */
import { TIPOS_CLIENTE, PESOS_CLIENTE, PERGUNTAS, CHEGADAS } from '../data/dialogue.js';
import { CLIENTS } from '../data/sprites.js';

let proximoId = 1;

function tipoAleatorio() {
  const total = Object.values(PESOS_CLIENTE).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const t of TIPOS_CLIENTE) {
    r -= PESOS_CLIENTE[t.id] || 0;
    if (r <= 0) return t;
  }
  return TIPOS_CLIENTE[0];
}

export function criarCliente(porta) {
  const tipo = tipoAleatorio();
  return {
    id: proximoId++,
    tipo,
    spr: CLIENTS[(Math.random() * CLIENTS.length) | 0],
    x: porta.x * 16, y: porta.y * 16,
    dir: 'up', anim: 0, mov: false,
    estado: 'entrar',
    alvo: null, prateleira: null,
    timer: 0,
    paciencia: tipo.paciencia,
    pacienciaMax: tipo.paciencia,
    perguntasFeitas: 0,
    pergunta: null,
    saudacao: CHEGADAS[(Math.random() * CHEGADAS.length) | 0],
    bolha: 1.6,
    atendido: false
  };
}

export function novaPergunta() {
  return PERGUNTAS[(Math.random() * PERGUNTAS.length) | 0];
}

/**
 * m = mundo: { dt, porta, escolherPonto, prateleiraPerto, mover,
 *              desarrumar, largarMeia, sujarChao, remover, stats }
 */
export function atualizarCliente(c, dt, m) {
  if (c.bolha > 0) c.bolha -= dt;
  c.anim += dt;

  if (c.estado === 'atendido') return;      // congelado enquanto fala com a Andreia

  if (c.estado === 'entrar') {
    if (!c.alvo) {
      const p = m.escolherPonto();
      c.alvo = { x: p.x * 16, y: p.y * 16 };
      c.prateleira = m.prateleiraPerto(c.alvo.x, c.alvo.y);
    }
    if (m.mover(c, c.alvo, 34, dt)) {
      c.estado = 'ver';
      c.timer = 1.4 + Math.random() * 2.6;
    }
    return;
  }

  if (c.estado === 'ver') {
    c.mov = false;
    c.timer -= dt;
    // mexer nas meias
    if (c.prateleira) m.desarrumar(c.prateleira, c.tipo.desarruma * 5.5 * dt);
    if (Math.random() < c.tipo.desarruma * 0.28 * dt) m.largarMeia(c.x, c.y + 8);
    if (c.timer <= 0) {
      if (c.perguntasFeitas < c.tipo.perguntas) {
        c.pergunta = novaPergunta();
        c.estado = 'esperar';
        c.paciencia = c.pacienciaMax;
        m.aviso(c);
      } else {
        sair(c, m);
      }
    }
    return;
  }

  if (c.estado === 'esperar') {
    c.mov = false;
    c.paciencia -= dt;
    if (c.prateleira && Math.random() < 0.5 * dt) m.desarrumar(c.prateleira, 3 * dt);
    if (c.paciencia <= 0) {
      c.foiEmbora = true;
      sair(c, m);
    }
    return;
  }

  if (c.estado === 'sair') {
    const porta = { x: m.porta.x * 16, y: m.porta.y * 16 };
    if (m.mover(c, porta, 38, dt)) m.remover(c);
    return;
  }
}

export function sair(c, m) {
  c.estado = 'sair';
  c.alvo = null;
}

/** decide se o cliente compra, depois de a Andreia responder */
export function verdicto(c, escolhaBoa) {
  let p = c.tipo.compra + (escolhaBoa ? 0.2 : 0);
  if (c.tipo.id === 'comprador') p = escolhaBoa ? 0.95 : 0.7;
  return Math.random() < p;
}

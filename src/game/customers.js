/* ============================================================
   customers.js - os clientes: entram, mexem em tudo, vão-se embora
   O movimento é por waypoints (a cena trata do caminho), por isso
   nunca ficam encravados contra as estantes.
   ============================================================ */
import { TIPOS_CLIENTE, PESOS_CLIENTE, PERGUNTAS, POOLS, CHEGADAS } from '../data/dialogue.js';
import { CLIENTS } from '../data/sprites.js';

let proximoId = 1;

function tipoAleatorio() {
  const total = TIPOS_CLIENTE.reduce((a, t) => a + (PESOS_CLIENTE[t.id] || 0), 0);
  let r = Math.random() * total;
  for (const t of TIPOS_CLIENTE) {
    r -= PESOS_CLIENTE[t.id] || 0;
    if (r <= 0) return t;
  }
  return TIPOS_CLIENTE[0];
}

/** a pergunta certa para este tipo de cliente */
export function perguntaPara(tipo) {
  const pool = (tipo.pool && POOLS[tipo.pool]) || PERGUNTAS;
  return pool[(Math.random() * pool.length) | 0];
}

export function criarCliente(porta) {
  const tipo = tipoAleatorio();
  const spr = tipo.sprite != null
    ? CLIENTS[tipo.sprite % CLIENTS.length]          // o senhor Alberto é sempre o mesmo
    : CLIENTS[(Math.random() * CLIENTS.length) | 0];
  return {
    id: proximoId++,
    tipo, spr,
    x: porta.x * 16, y: porta.y * 16,
    dir: 'up', anim: 0, mov: false,
    estado: 'entrar',
    alvo: null, prateleira: null,
    rota: null, rotaChave: null, rotaI: 0, tentativas: 0,
    timer: 0, vida: 0,
    paciencia: tipo.paciencia,
    pacienciaMax: tipo.paciencia,
    perguntasFeitas: 0,
    pergunta: null,
    desarrumou: 0,
    saudacao: (tipo.saudacoes || CHEGADAS)[(Math.random() * (tipo.saudacoes || CHEGADAS).length) | 0],
    atendido: false
  };
}

export function novaPergunta() { return PERGUNTAS[(Math.random() * PERGUNTAS.length) | 0]; }

/**
 * m = mundo: { porta, escolherPonto, prateleiraPerto, irPara,
 *              desarrumar, largarMeia, aviso, remover }
 */
export function atualizarCliente(c, dt, m) {
  c.anim += dt;
  c.vida += dt;

  if (c.estado === 'atendido' || c.estado === 'conversa') return;   // a falar com a Andreia

  // ninguém fica na loja para sempre
  if (c.vida > 100 && c.estado !== 'sair') { sair(c, m); }

  if (c.estado === 'entrar') {
    if (!c.alvo) {
      const p = m.escolherPonto();
      c.alvo = { x: p.x * 16, y: p.y * 16 };
      c.prateleira = m.prateleiraPerto(c.alvo.x, c.alvo.y);
    }
    if (m.irPara(c, c.alvo, 34, dt)) {
      c.estado = 'ver';
      c.timer = 1.4 + Math.random() * 2.6;
    }
    return;
  }

  if (c.estado === 'ver') {
    c.mov = false;
    c.timer -= dt;
    if (c.prateleira) {
      const q = c.tipo.desarruma * 3.2 * dt;
      m.desarrumar(c.prateleira, q);
      c.desarrumou += q;
    }
    const caos = m.fatorCaos ? m.fatorCaos() : 1;
    if (Math.random() < c.tipo.desarruma * 0.28 * caos * dt) m.largarMeia(c.x, c.y + 8);
    if (c.timer <= 0) {
      if (c.perguntasFeitas < c.tipo.perguntas) {
        c.pergunta = perguntaPara(c.tipo);
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
    if (m.irPara(c, porta, 40, dt)) m.remover(c);
    return;
  }
}

export function sair(c, m) {
  if (c.estado === 'sair') return;
  if (m && m.aoSair) m.aoSair(c);
  c.estado = 'sair';
  c.alvo = null;
  c.rota = null;
  c.rotaChave = null;
}

/** decide se o cliente compra, depois de a Andreia responder */
export function verdicto(c, escolhaBoa) {
  if (c.pergunta && c.pergunta.nuncaCompra) return false;
  let p = c.tipo.compra + (escolhaBoa ? 0.2 : 0);
  if (c.tipo.id === 'comprador') p = escolhaBoa ? 0.95 : 0.7;
  return Math.random() < p;
}

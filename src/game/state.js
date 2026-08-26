/* ============================================================
   state.js - o estado do turno todo num sítio só
   ============================================================ */

export const DURACAO_NORMAL = 200;   // segundos de 09:00 às 18:00
export const DURACAO_ULTIMA = 100;   // a última hora
export const DURACAO_TOTAL = DURACAO_NORMAL + DURACAO_ULTIMA;

/* ---------- como corre o dia ----------
   Nem todos os dias são iguais. Multiplicadores:
   clientes > 1 = mais tempo entre clientes (mais calmo).       */
export const DIAS = [
  { id: 'calmo',      nome: 'Hoje está um dia calmo.',        peso: 30, clientes: 1.30, stock: 0.75, sujidade: 0.70, desarruma: 0.78 },
  { id: 'normal',     nome: 'Hoje parece um dia normal.',     peso: 45, clientes: 1.00, stock: 1.00, sujidade: 1.00, desarruma: 1.00 },
  { id: 'complicado', nome: 'Hoje isto promete.',             peso: 25, clientes: 0.84, stock: 1.18, sujidade: 1.25, desarruma: 1.20 }
];

export function sortearDia() {
  const total = DIAS.reduce((a, d) => a + d.peso, 0);
  let r = Math.random() * total;
  for (const d of DIAS) { r -= d.peso; if (r <= 0) return d; }
  return DIAS[1];
}

export const S = {
  t: 0,
  dia: DIAS[1],
  fase: 'normal',        // normal | cutscene | ultima | fim
  energia: 100,
  caixaFeita: false,
  soniaSaiu: false,
  stats: {
    atendidos: 0, vendas: 0, recusas: 0, arrumados: 0,
    meiasChao: 0, meiasTeto: 0, meiasRua: 0, apanhadas: 0,
    stockRecebido: 0, stockArrumado: 0,
    sandes: 0, cafes: 0, pegadas: 0, ajudaSonia: 0, clientes: 0
  }
};

export function resetTurno() {
  S.t = 0;
  S.dia = sortearDia();
  S.fase = 'normal';
  S.energia = 100;
  S.caixaFeita = false;
  S.soniaSaiu = false;
  for (const k in S.stats) S.stats[k] = 0;
}

/** relógio da loja: 09:00 -> 19:00 */
export function relogio() {
  let h;
  if (S.fase === 'ultima' || S.fase === 'fim') {
    const p = Math.min(1, (S.t - DURACAO_NORMAL) / DURACAO_ULTIMA);
    h = 18 + p;
  } else {
    h = 9 + Math.min(1, S.t / DURACAO_NORMAL) * 9;
  }
  const hh = Math.min(19, Math.floor(h));
  const mm = Math.min(59, Math.floor((h - hh) * 60));
  return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
}

export function minutosParaFechar() {
  return Math.max(0, Math.ceil((DURACAO_TOTAL - S.t) / DURACAO_ULTIMA * 60));
}

export function gastarEnergia(n) { S.energia = Math.max(0, S.energia - n); }
export function darEnergia(n) { S.energia = Math.min(100, S.energia + n); }

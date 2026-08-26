/* ============================================================
   state.js - o estado do turno todo num sítio só
   ============================================================ */

export const DURACAO_NORMAL = 200;   // segundos de 09:00 às 18:00
export const DURACAO_ULTIMA = 100;   // a última hora
export const DURACAO_TOTAL = DURACAO_NORMAL + DURACAO_ULTIMA;

export const S = {
  t: 0,
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

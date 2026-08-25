/* ============================================================
   socks.js - os tipos de meia (só precisam de ser reconhecíveis)
   ============================================================ */
export const MEIAS = [
  { id: 'pretas',       nome: 'PRETAS',       cor: '#2b2438', punho: '#463d5c' },
  { id: 'brancas',      nome: 'BRANCAS',      cor: '#f2eee4', punho: '#d4cec0' },
  { id: 'rosa',         nome: 'ROSA',         cor: '#e0577f', punho: '#f28fae' },
  { id: 'azuis',        nome: 'AZUIS',        cor: '#4a7fd0', punho: '#7fa8e8' },
  { id: 'verdes',       nome: 'VERDES',       cor: '#5fbf7f', punho: '#8fe0a8' },
  { id: 'amarelas',     nome: 'AMARELAS',     cor: '#f0b03f', punho: '#f8d07f' },
  { id: 'algodao',      nome: 'ALGODÃO',      cor: '#e8d8b8', punho: '#f5ebd6' },
  { id: 'desportivas',  nome: 'DESPORTIVAS',  cor: '#f2eee4', punho: '#4a7fd0' },
  { id: 'compressao',   nome: 'COMPRESSÃO',   cor: '#7a5fc0', punho: '#a88fe0' },
  { id: 'canoalto',     nome: 'CANO ALTO',    cor: '#3f8f9c', punho: '#63b6c4' },
  { id: 'bege',         nome: 'BEGE',         cor: '#d8bb92', punho: '#e8d2b0' }
];
export const MEIA_POR_ID = Object.fromEntries(MEIAS.map(m => [m.id, m]));
export function meiaAleatoria() { return MEIAS[(Math.random() * MEIAS.length) | 0]; }

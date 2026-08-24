/* ============================================================
   dados.js - o ecrã "DADOS DO JAJO"
   Cada campo aparece quando o jogador descobre o facto
   (as falas do script marcadas com  fact:'chave').
   ============================================================ */

export const DADOS = [
  { key: 'nome',      label: 'Nome',           value: 'Jajo / Jaja / Dina' },
  { key: 'origem',    label: 'Origem',         value: 'Fátima' },
  { key: 'destino',   label: 'Destino',        value: 'Alentejo' },
  { key: 'profissao', label: 'Profissão',      value: '???', always: true },
  { key: 'teatro',    label: 'Estudou teatro', value: 'SIM' },
  { key: 'actor',     label: 'É actor',        value: 'NÃO', warn: true },
  { key: 'cafe',      label: 'Café',           value: 'SIM' },
  { key: 'sono',      label: 'Sono',           value: 'NÃO' },
  { key: 'fofo',      label: 'Fofo',           value: 'SIM', heart: true }
];

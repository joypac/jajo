/* ============================================================
   summary.js - o resumo do turno
   ============================================================ */
import { ctx, view, clear } from '../engine/screen.js';
import { S } from './state.js';
import { register, go } from '../engine/scene.js';
import { playMusic, sfx } from '../engine/audio.js';
import { fx } from '../engine/fx.js';
import { showHud, esconderTudo } from './ui.js';

const el = document.getElementById('summary');
const elTitle = document.getElementById('sum-title');
const elRows = document.getElementById('sum-rows');
const elStore = document.getElementById('sum-store');
const elStars = document.getElementById('sum-stars');
const elVerdict = document.getElementById('sum-verdict');
const btnAgain = document.getElementById('btn-again');

const VEREDICTOS = [
  'Amanhã há mais.',
  'Bom trabalho, Andreia.',
  'Bom trabalho, Andreia.',
  'Excelente turno, Andreia.',
  'A loja nunca esteve assim.'
];

btnAgain.addEventListener('click', e => {
  e.preventDefault();
  el.classList.add('hidden');
  sfx('clique');
  fx.transition(() => go('titulo', {}), { dur: 0.4 });
});

register('resumo', {
  enter(p) {
    showHud(false);
    esconderTudo();
    playMusic('resumo');

    const st = S.stats;
    const tudoFeito = (p.tarefas || []).every(t => t.feito);
    const arrum = p.arrumacao != null ? p.arrumacao : 0;
    const chao = p.chao != null ? p.chao : 0;

    const loja = Math.round(arrum * 0.4 + chao * 0.3 +
      Math.max(0, 100 - (p.meias || 0) * 6) * 0.15 +
      Math.max(0, 100 - (p.stock || 0) * 1.6) * 0.15);

    const linhas = [
      ['Clientes atendidos', st.atendidos],
      ['Meias vendidas', st.vendas],
      ['"Vou pensar."', st.recusas],
      ['Pares de meias arrumados', st.arrumados],
      ['Meias apanhadas do chão', st.apanhadas],
      ['Meias encontradas no teto', st.meiasTeto],
      ['Meias encontradas na rua', st.meiasRua],
      ['Stock recebido', st.stockRecebido],
      ['Stock arrumado', st.stockArrumado],
      ['Pegadas', st.pegadas],
      ['Sandes de atum', st.sandes],
      ['Ajuda da Sónia', st.ajudaSonia]
    ];

    elTitle.textContent = tudoFeito ? '🏆 TURNO PERFEITO' : 'RESUMO DO TURNO';
    elTitle.classList.toggle('perfect', tudoFeito);

    elRows.innerHTML = linhas.map(([k, v]) =>
      '<div class="row' + (k === 'Ajuda da Sónia' ? ' zero' : '') + '"><span>' + k + '</span><b>' + v + '</b></div>'
    ).join('');

    elStore.innerHTML = 'LOJA: <b>' + loja + '% ARRUMADA</b>';

    let estrelas = 1;
    if (loja >= 45) estrelas = 2;
    if (loja >= 62) estrelas = 3;
    if (loja >= 78) estrelas = 4;
    if (loja >= 90 && S.caixaFeita) estrelas = 5;
    if (tudoFeito) estrelas = 5;
    elStars.textContent = '★'.repeat(estrelas) + '☆'.repeat(5 - estrelas);
    elStars.style.color = '#ffc44d';

    elVerdict.textContent = tudoFeito
      ? 'A Andreia fez literalmente tudo. A Sónia não fez nada.'
      : VEREDICTOS[Math.min(VEREDICTOS.length - 1, estrelas - 1)];

    el.classList.remove('hidden');
    sfx(tudoFeito ? 'vitoria' : 'fim');
  },
  update() {},
  draw() {
    clear('#0d0918');
  }
});

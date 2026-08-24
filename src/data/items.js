/* ============================================================
   items.js - a mochila
   use(): devolve { hp, drama, text, consume }
   ============================================================ */

export const ITEMS = {
  maca: {
    id: 'maca', icon: '🍎', name: 'Maçã Suspeita',
    desc: 'Ninguém sabe de onde veio.',
    use: () => ({ hp: 30, consume: true, text: 'BERNARDO comeu a Maçã Suspeita. Recuperou 30 HP e alguma confiança.' })
  },
  telemovel: {
    id: 'telemovel', icon: '📱', name: 'Telemóvel',
    desc: 'Tem 2% de bateria.',
    useless: true,
    use: () => ({ consume: false, text: 'Abres o telemóvel. 1% de bateria. Fechas o telemóvel.' })
  },
  meia: {
    id: 'meia', icon: '🧦', name: 'Meia Perdida',
    desc: 'Não é do Jajo.',
    use: () => ({ drama: 12, consume: true, text: 'Cheiraste a meia. Isso foi uma escolha. DRAMA +12.' })
  },
  cafe: {
    id: 'cafe', icon: '☕', name: 'Café',
    desc: 'Resolve aproximadamente 4% dos problemas.',
    use: () => ({ hp: 15, drama: 20, consume: true, text: 'BERNARDO bebeu o Café. 4% dos problemas resolvidos. DRAMA +20.' })
  }
};

export const ITEM_ORDER = ['maca', 'cafe', 'meia', 'telemovel'];

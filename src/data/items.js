/* ============================================================
   items.js - a mochila
   use(): devolve { hp, drama, energia, sono, consume, text, extra }
   ============================================================ */

export const ITEMS = {
  cafe: {
    id: 'cafe', icon: '☕', name: 'CAFÉ',
    desc: 'Combustível oficial do Jajo.',
    stats: '+20 ENERGIA  -10 SONO',
    use: () => ({
      hp: 15, energia: 20, sono: -10, drama: 10, consume: true,
      text: 'BERNARDO bebeu o café. O café resolveu o problema.',
      extra: 'O problema voltou.'
    })
  },
  maca: {
    id: 'maca', icon: '🍎', name: 'Maçã Suspeita',
    desc: 'Ninguém sabe de onde veio.',
    use: () => ({
      hp: 30, consume: true,
      text: 'BERNARDO comeu a Maçã Suspeita. Recuperou 30 HP e alguma confiança.'
    })
  },
  cigarro: {
    id: 'cigarro', icon: '🚬', name: 'CIGARRO DO JAJO',
    desc: 'Não é uma poção.',
    use: () => ({
      consume: false,
      text: 'Não é uma poção.',
      extra: 'Continua a não ser.'
    })
  },
  meia: {
    id: 'meia', icon: '🧦', name: 'Meia Perdida',
    desc: 'Não é do Jajo.',
    use: () => ({
      drama: 12, consume: true,
      text: 'Cheiraste a meia. Isso foi uma escolha. DRAMA +12.'
    })
  },
  telemovel: {
    id: 'telemovel', icon: '📱', name: 'Telemóvel',
    desc: 'Tem 2% de bateria.',
    useless: true,
    use: () => ({
      consume: false,
      text: 'Abres o telemóvel. 1% de bateria.',
      extra: 'Fechas o telemóvel.'
    })
  }
};

export const ITEM_ORDER = ['cafe', 'maca', 'cigarro', 'meia', 'telemovel'];

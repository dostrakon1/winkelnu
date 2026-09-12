import type { EditorialCollection } from './types'

export const halloweenCollection = {
  slug: 'halloween',
  title: 'Halloween',
  description: 'Halloween-inspiratie voor decoratie, kostuums, verlichting, spel en creatieve activiteiten. Ontdek handige routes per plan en budget bij Winkelnu.',
  intro: 'Halloween draait om sfeer, verkleden en samen iets beleven. Winkelnu brengt decoratie, verlichting, accessoires, spel en creatieve ideeën uit meerdere rubrieken bij elkaar, zodat je vanuit één plan gericht verder kunt zoeken en vergelijken.',
  sections: [
    {
      slug: 'decoratie-sfeer',
      title: 'Decoratie & sfeer',
      description: 'Bouw een Halloween-setting op vanuit één stijl: begin met licht en een paar grotere blikvangers en voeg daarna pas kleinere details toe.',
      categorySlugs: ['wonen-huishouden', 'huis-tuin-klussen'],
    },
    {
      slug: 'verkleden-accessoires',
      title: 'Verkleden & accessoires',
      description: 'Stel een Halloween-look als geheel samen met kleding, accessoires en passende verzorging, van subtiel en stijlvol tot uitgesproken en griezelig.',
      categorySlugs: ['mode-accessoires', 'persoonlijke-verzorging'],
    },
    {
      slug: 'spel-creatief',
      title: 'Spel & creatief',
      description: 'Maak Halloween interactief met spellen, knutselideeën en activiteiten die passen bij een middag met kinderen of een gezellige avond thuis.',
      categorySlugs: ['speelgoed-hobby', 'baby-kind'],
    },
    {
      slug: 'licht-techniek',
      title: 'Licht & techniek',
      description: 'Gebruik verlichting en slimme sfeermakers om binnen, buiten of bij de entree snel een duidelijke Halloween-sfeer neer te zetten.',
      categorySlugs: ['elektronica', 'wonen-huishouden'],
    },
  ],
} as const satisfies EditorialCollection

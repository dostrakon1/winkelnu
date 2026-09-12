import type { EditorialCollection } from './types'

export const halloweenCollection = {
  slug: 'halloween',
  title: 'Halloween',
  description: 'Halloween-inspiratie voor sfeer, verkleden, spel en feestelijke momenten.',
  intro: 'Halloween is geen vaste productcategorie. Winkelnu brengt daarom tijdelijk passende inspiratie uit meerdere rubrieken samen. Zo kun je gericht ontdekken, terwijl ieder product en iedere keuzehulp in de eigen vaste categorie blijft staan.',
  sections: [
    { slug: 'decoratie-sfeer', title: 'Decoratie & sfeer', description: 'Ideeën voor een spannende, warme of speelse Halloween-sfeer in en rond huis.', categorySlugs: ['wonen-huishouden', 'huis-tuin-klussen'] },
    { slug: 'verkleden-accessoires', title: 'Verkleden & accessoires', description: 'Inspiratie voor kleding en accessoires waarmee je een Halloween-look samenstelt.', categorySlugs: ['mode-accessoires', 'persoonlijke-verzorging'] },
    { slug: 'spel-creatief', title: 'Spel & creatief', description: 'Spellen, knutselideeën en activiteiten voor een gezellige griezelavond.', categorySlugs: ['speelgoed-hobby', 'baby-kind'] },
    { slug: 'licht-techniek', title: 'Licht & techniek', description: 'Slimme verlichting en kleine technische sfeermakers voor binnen en buiten.', categorySlugs: ['elektronica', 'wonen-huishouden'] },
  ],
} as const satisfies EditorialCollection

import type { EditorialCollection } from './types'

export const kerstCollection = {
  slug: 'kerst',
  title: 'Kerst',
  description: 'Warme kerst- en cadeau-inspiratie uit meerdere Winkelnu-rubrieken.',
  intro: 'Kerst draait om verschillende momenten: cadeaus, samen koken, sfeer in huis en tijd met familie of vrienden. Winkelnu brengt daarom tijdelijk relevante rubrieken samen, terwijl de vaste productstructuur intact blijft.',
  sections: [
    { slug: 'kerstcadeaus', title: 'Kerstcadeaus', description: 'Cadeau-inspiratie voor verschillende interesses, leeftijden en gebruiksmomenten.', categorySlugs: ['elektronica', 'mode-accessoires', 'persoonlijke-verzorging', 'speelgoed-hobby'] },
    { slug: 'voor-thuis', title: 'Voor thuis', description: 'Warme en praktische inspiratie voor wonen, sfeer en gezellige dagen binnenshuis.', categorySlugs: ['wonen-huishouden', 'huis-tuin-klussen'] },
    { slug: 'koken-tafelen', title: 'Koken & tafelen', description: 'Keukenapparaten en praktische inspiratie voor koken, koffie en samen tafelen.', categorySlugs: ['keuken-koffie', 'wonen-huishouden'] },
    { slug: 'voor-kinderen', title: 'Voor kinderen', description: 'Speel- en cadeau-inspiratie voor verschillende leeftijden en interesses.', categorySlugs: ['speelgoed-hobby', 'baby-kind', 'sport-outdoor'] },
    { slug: 'tech-gadgets', title: 'Tech & gadgets', description: 'Elektronica en slimme producten voor ontspanning, werk en dagelijks gebruik.', categorySlugs: ['elektronica', 'kantoor-studie'] },
  ],
} as const satisfies EditorialCollection

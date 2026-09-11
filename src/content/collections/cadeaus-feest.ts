import type { EditorialCollection } from './types'

export const cadeausFeestCollection = {
  slug: 'cadeaus-feest',
  title: 'Cadeaus & feest',
  description: 'Vind cadeau-ideeën en feestelijke selecties over meerdere Winkelnu-categorieën heen.',
  intro: 'Cadeaus en feestartikelen vormen geen vaste productcategorie. Daarom verzamelt Winkelnu hier producten uit meerdere rubrieken op basis van gelegenheid, ontvanger en gebruik. Zo blijft ieder product technisch in zijn eigen categorie, terwijl je toch gericht inspiratie kunt ontdekken.',
  sections: [
    { slug: 'cadeaus-voor-haar', title: 'Cadeaus voor haar', description: 'Inspiratie uit onder meer mode, verzorging, wonen en hobby.', categorySlugs: ['mode-accessoires', 'persoonlijke-verzorging', 'wonen-huishouden', 'speelgoed-hobby'] },
    { slug: 'cadeaus-voor-hem', title: 'Cadeaus voor hem', description: 'Inspiratie uit onder meer elektronica, mode, sport en huis & tuin.', categorySlugs: ['elektronica', 'mode-accessoires', 'sport-outdoor', 'huis-tuin-klussen'] },
    { slug: 'cadeaus-voor-kinderen', title: 'Cadeaus voor kinderen', description: 'Selecties uit speelgoed, hobby, baby & kind en actieve producten.', categorySlugs: ['speelgoed-hobby', 'baby-kind', 'sport-outdoor'] },
    { slug: 'verjaardag', title: 'Verjaardag', description: 'Cadeau-ideeën voor verschillende leeftijden, interesses en budgetten.', categorySlugs: ['elektronica', 'mode-accessoires', 'keuken-koffie', 'speelgoed-hobby'] },
    { slug: 'kerst', title: 'Kerst', description: 'Feestelijke inspiratie en cadeaus uit meerdere categorieën.', categorySlugs: ['wonen-huishouden', 'keuken-koffie', 'elektronica', 'speelgoed-hobby'] },
    { slug: 'valentijn', title: 'Valentijn', description: 'Persoonlijke cadeaus en kleine attenties voor een bijzonder moment.', categorySlugs: ['mode-accessoires', 'persoonlijke-verzorging', 'wonen-huishouden'] },
    { slug: 'moederdag-vaderdag', title: 'Moederdag & Vaderdag', description: 'Inspiratie op basis van interesses in plaats van één vaste productsoort.', categorySlugs: ['keuken-koffie', 'huis-tuin-klussen', 'sport-outdoor', 'persoonlijke-verzorging'] },
    { slug: 'feestartikelen', title: 'Feestartikelen', description: 'Decoratie, aankleding en praktische benodigdheden voor een feestelijk moment.', categorySlugs: ['wonen-huishouden', 'speelgoed-hobby'] },
  ],
} as const satisfies EditorialCollection

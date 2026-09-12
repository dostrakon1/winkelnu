import type { EditorialCollection } from './types'

export const sinterklaasCollection = {
  slug: 'sinterklaas',
  title: 'Sinterklaas',
  description: 'Cadeau-inspiratie voor schoenmomenten en pakjesavond uit meerdere Winkelnu-rubrieken.',
  intro: 'Sinterklaascadeaus lopen dwars door meerdere productcategorieën heen. Winkelnu bundelt daarom tijdelijk inspiratie voor verschillende leeftijden, interesses en momenten, zonder producten uit hun vaste categorie te halen.',
  sections: [
    { slug: 'voor-kinderen', title: 'Voor kinderen', description: 'Inspiratie voor spelen, leren, bewegen en dagelijkse momenten van jonge kinderen.', categorySlugs: ['speelgoed-hobby', 'baby-kind', 'sport-outdoor'] },
    { slug: 'schoencadeaus', title: 'Schoencadeaus', description: 'Kleine cadeau-ideeën uit verschillende rubrieken die passen bij een schoenmoment.', categorySlugs: ['speelgoed-hobby', 'persoonlijke-verzorging', 'kantoor-studie', 'mode-accessoires'] },
    { slug: 'voor-hem-haar', title: 'Voor hem & haar', description: 'Cadeau-inspiratie rond hobby, verzorging, wonen, mode en elektronica.', categorySlugs: ['elektronica', 'mode-accessoires', 'persoonlijke-verzorging', 'wonen-huishouden'] },
    { slug: 'pakjesavond', title: 'Pakjesavond', description: 'Een brede mix van cadeau-inspiratie voor een gezellige avond met verschillende leeftijden en interesses.', categorySlugs: ['speelgoed-hobby', 'elektronica', 'keuken-koffie', 'wonen-huishouden'] },
  ],
} as const satisfies EditorialCollection

import type { CategoryContent } from './types'

export const speelgoedHobbyCategory = {
  slug: 'speelgoed-hobby',
  title: 'Speelgoed & hobby',
  description: 'Spelen, bouwen en creatief bezig zijn met aandacht voor leeftijd, interesse, veiligheid en hergebruik.',
  intro: 'Een goede keuze sluit aan bij de leeftijd, interesse en manier van spelen of maken. Kijk daarnaast naar veiligheid, moeilijkheid, uitbreidbaarheid, materiaal en hoeveel ruimte je nodig hebt om alles te gebruiken en op te bergen.',
  feedAliases: ['speelgoed hobby', 'toys hobbies', 'toys games', 'hobbies crafts'],
  topics: ['Leeftijd en niveau', 'Creativiteit en uitdaging', 'Samen of zelfstandig', 'Veiligheid en materiaal'],
  subcategories: [
    { slug: 'bouwen-constructie', title: 'Bouwen & constructie', description: 'Sets en systemen waarmee kinderen en volwassenen kunnen bouwen en experimenteren.', feedAliases: ['bouwen constructie', 'building construction toys', 'building sets', 'construction toys', 'bouwsets'] },
    { slug: 'creatief-knutselen', title: 'Creatief & knutselen', description: 'Materialen voor tekenen, schilderen, maken en andere creatieve hobby\'s.', feedAliases: ['creatief knutselen', 'arts crafts', 'craft kits', 'knutselsets', 'creative crafts'] },
    { slug: 'spellen-puzzels', title: 'Spellen & puzzels', description: 'Activiteiten voor alleen spelen, gezinnen en groepen.', feedAliases: ['spellen puzzels', 'games puzzles', 'board games', 'bordspellen', 'puzzles', 'puzzels'] },
    { slug: 'buitenspeelgoed', title: 'Buitenspeelgoed', description: 'Speelgoed voor tuin, park en actieve beweging buiten.', feedAliases: ['buitenspeelgoed', 'outdoor toys', 'garden toys'] },
    { slug: 'hobby-volwassenen', title: 'Hobby voor volwassenen', description: 'Materialen en sets voor ontspanning, verzamelen en creatief bezig zijn.', feedAliases: ['hobby voor volwassenen', 'adult hobbies', 'modelbouw', 'model kits', 'collecting hobbies'] },
  ],
  buyingTips: [
    { title: 'Kijk naar leeftijd én vaardigheid', description: 'Leeftijdsadvies is een startpunt; interesse, ervaring en motoriek bepalen mede of iets leuk en passend is.' },
    { title: 'Denk aan hergebruik', description: 'Uitbreidbare systemen en materialen die vaker bruikbaar zijn kunnen langer interessant blijven.' },
    { title: 'Controleer ruimte en opruimen', description: 'Grote sets en hobbyprojecten vragen niet alleen speelruimte, maar ook een praktische plek om onderdelen te bewaren.' },
  ],
  popularProductTypes: ['Bouwsets', 'Bordspellen', 'Puzzels', 'Knutselsets', 'Buitenspeelgoed', 'Modelbouw'],
  faq: [
    { question: 'Is leeftijdsadvies hetzelfde als moeilijkheid?', answer: 'Niet helemaal. Leeftijdsadvies kan ook met veiligheid en kleine onderdelen te maken hebben. Kijk daarnaast naar vaardigheid en interesse.' },
    { question: 'Hoe voorkom ik dat speelgoed snel ongebruikt blijft?', answer: 'Kies iets dat past bij actuele interesses en dat eventueel op meerdere manieren gebruikt of uitgebreid kan worden.' },
    { question: 'Waar moet ik bij creatief materiaal op letten?', answer: 'Controleer geschiktheid voor leeftijd, gebruiksinstructies, benodigde begeleiding en hoe materiaal wordt opgeborgen of schoongemaakt.' },
  ],
  featuredGuideSlugs: [],
} as const satisfies CategoryContent

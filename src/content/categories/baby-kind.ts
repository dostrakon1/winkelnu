import type { CategoryContent } from './types'

export const babyKindCategory = {
  slug: 'baby-kind',
  title: 'Baby & kind',
  description: 'Praktische keuzehulp voor producten rond onderweg zijn, slapen, veiligheid en de dagelijkse verzorging van jonge kinderen.',
  intro: 'Bij baby- en kinderproducten wegen veiligheid, leeftijd, formaat en praktisch dagelijks gebruik vaak zwaarder dan extra functies. Begin bij de leeftijd en situatie waarin je een product gebruikt en controleer bij veiligheidsproducten altijd de actuele instructies en productspecificaties van het exacte model.',
  feedAliases: ['baby kind', 'baby children', 'baby kids', 'baby products'],
  topics: ['Veiligheid en leeftijd', 'Dagelijks gebruik', 'Formaat en meenemen', 'Onderhoud en levensduur'],
  subcategories: [
    { slug: 'onderweg', title: 'Onderweg', description: 'Kinderwagens, draagoplossingen en andere producten voor dagelijks reizen.', feedAliases: ['baby onderweg', 'strollers', 'pushchairs', 'kinderwagens', 'baby carriers'] },
    { slug: 'veilig-in-de-auto', title: 'Veilig in de auto', description: 'Autostoeltjes en accessoires waarbij maat, installatie en gebruik centraal staan.', feedAliases: ['veilig in de auto', 'car seats', 'child car seats', 'autostoeltjes', 'baby car seats'] },
    { slug: 'slapen-kinderkamer', title: 'Slapen & kinderkamer', description: 'Producten voor slapen, rust en inrichting van de kinderkamer.', feedAliases: ['slapen kinderkamer', 'nursery', 'baby sleep', 'cots cribs', 'baby room'] },
    { slug: 'voeding-verzorging', title: 'Voeding & verzorging', description: 'Praktische hulpmiddelen voor eten, drinken en dagelijkse verzorging.', feedAliases: ['baby voeding verzorging', 'baby feeding', 'feeding nursing', 'bottle feeding', 'baby care feeding'] },
    { slug: 'babyfoons-veiligheid', title: 'Babyfoons & veiligheid', description: 'Apparaten en hulpmiddelen voor toezicht en een praktische thuisomgeving.', feedAliases: ['babyfoons veiligheid', 'baby monitors', 'baby safety', 'baby monitoring'] },
  ],
  buyingTips: [
    { title: 'Begin bij leeftijd, lengte en gewicht', description: 'Controleer altijd voor welke gebruiksfase het exacte product is bedoeld en wanneer je naar een volgende maat of categorie moet.' },
    { title: 'Test dagelijks gebruik', description: 'Denk aan tillen, inklappen, schoonmaken, monteren en hoeveel ruimte een product in huis of auto inneemt.' },
    { title: 'Volg veiligheidsinstructies', description: 'Bij autostoeltjes, slaapproducten en andere veiligheidsproducten zijn correcte installatie en gebruik belangrijker dan extra functies.' },
  ],
  popularProductTypes: ['Kinderwagens', 'Autostoeltjes', 'Babyfoons', 'Kinderstoelen', 'Reisbedjes', 'Flessenwarmers'],
  faq: [
    { question: 'Kan ik babyproducten vooral op reviews kiezen?', answer: 'Reviews kunnen gebruikservaringen tonen, maar controleer bij veiligheidsproducten altijd de officiële instructies, maatvoering en geschiktheid van het exacte model.' },
    { question: 'Is een duurder model veiliger?', answer: 'Prijs alleen zegt niets over passend en correct gebruik. Controleer normen, instructies, maatvoering en onafhankelijke informatie waar relevant.' },
    { question: 'Wat is belangrijk bij tweedehands babyproducten?', answer: 'Controleer historie, slijtage, compleetheid en of veiligheidsinformatie nog actueel is. Voor sommige veiligheidsproducten is de gebruiksgeschiedenis extra belangrijk.' },
  ],
  featuredGuideSlugs: ['kinderwagen-kopen'],
} as const satisfies CategoryContent

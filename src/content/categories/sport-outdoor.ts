import type { CategoryContent } from './types'

export const sportOutdoorCategory = {
  slug: 'sport-outdoor',
  title: 'Sport & outdoor',
  description: 'Van dagelijkse beweging tot wandelen en kamperen: kies materiaal dat past bij jouw activiteit en omgeving.',
  intro: 'Bij sport- en outdoorproducten bepalen pasvorm, weersomstandigheden, gebruiksduur en draagcomfort vaak meer dan een indrukwekkende specificatielijst. Begin daarom bij je activiteit en de omstandigheden waarin je het product gebruikt.',
  topics: ['Pasvorm en comfort', 'Duurzaamheid en materiaal', 'Weer en gebruiksomgeving', 'Meenemen, opladen en opbergen'],
  subcategories: [
    { title: 'Fitness', description: 'Materiaal voor training thuis, in de sportschool of onderweg.' },
    { title: 'Wandelen', description: 'Schoenen, rugzakken en accessoires voor korte en langere tochten.' },
    { title: 'Kamperen', description: 'Uitrusting voor slapen, koken en verblijven buiten.' },
    { title: 'Fietssport', description: 'Sportieve accessoires en uitrusting voor verschillende soorten ritten.' },
    { title: 'Outdoor accessoires', description: 'Praktische hulpmiddelen voor navigatie, verlichting en bescherming.' },
  ],
  buyingTips: [
    { title: 'Pasvorm gaat vóór specificaties', description: 'Bij kleding, schoenen, rugzakken en beschermingsmiddelen kan een goede pasvorm belangrijker zijn dan extra functies.' },
    { title: 'Kies voor je omgeving', description: 'Regen, kou, warmte, terrein en gebruiksduur bepalen welke materialen en eigenschappen relevant zijn.' },
    { title: 'Let op gewicht én bruikbaarheid', description: 'Lichter is prettig onderweg, maar niet wanneer comfort, stevigheid of capaciteit daardoor onvoldoende wordt.' },
  ],
  popularProductTypes: ['Wandelschoenen', 'Sporthorloges', 'Rugzakken', 'Tenten', 'Slaapzakken', 'Fitnessapparatuur'],
  faq: [
    { question: 'Hoe kies ik outdoorproducten voor wisselend weer?', answer: 'Werk met lagen en producten die passen bij de omstandigheden die je daadwerkelijk verwacht. Controleer materiaal en gebruiksgrenzen.' },
    { question: 'Is ultralicht altijd beter?', answer: 'Nee. Een lager gewicht kan ten koste gaan van stevigheid, comfort, prijs of levensduur.' },
    { question: 'Waar let ik op bij sportelektronica?', answer: 'Denk aan accuduur, leesbaarheid, sensoren, compatibiliteit en of je de extra functies werkelijk gebruikt.' },
  ],
  featuredGuideSlugs: [],
} as const satisfies CategoryContent

import type { CategoryContent } from './types'

export const wonenHuishoudenCategory = {
  slug: 'wonen-huishouden',
  title: 'Wonen & huishouden',
  description: 'Praktische keuzehulp voor huishoudelijke apparaten, van schoonmaken tot de was.',
  intro: 'Bij huishoudelijke apparaten tellen niet alleen de aanschafprijs en het vermogen. Formaat, energie- en waterverbruik, onderhoud en gebruiksgemak bepalen hoe prettig een apparaat op de lange termijn is.',
  feedAliases: ['wonen huishouden', 'home household', 'household', 'home appliances'],
  topics: ['Afmetingen en capaciteit', 'Energie- en waterverbruik', 'Onderhoud en verbruikskosten', 'Geluid en gebruiksgemak'],
  subcategories: [
    { slug: 'schoonmaken', title: 'Schoonmaken', description: 'Stofzuigen, dweilen en andere hulpmiddelen voor dagelijks onderhoud.', feedAliases: ['schoonmaken', 'stofzuigers', 'vacuum cleaners', 'floor care', 'cleaning appliances'] },
    { slug: 'was-drogen', title: 'Was & drogen', description: 'Apparaten en hulpmiddelen voor wassen, drogen en kledingverzorging.', feedAliases: ['was drogen', 'wasmachines', 'washing machines', 'dryers', 'tumble dryers', 'laundry appliances'] },
    { slug: 'klimaat-in-huis', title: 'Klimaat in huis', description: 'Ventileren, verwarmen, koelen en luchtkwaliteit.', feedAliases: ['klimaat in huis', 'luchtreinigers', 'air purifiers', 'fans', 'ventilatoren', 'indoor climate'] },
    { slug: 'opbergen-organiseren', title: 'Opbergen & organiseren', description: 'Praktische oplossingen voor een overzichtelijk huishouden.', feedAliases: ['opbergen organiseren', 'storage organization', 'home storage', 'organizers'] },
    { slug: 'kleine-huishoudelijke-apparaten', title: 'Kleine huishoudelijke apparaten', description: 'Compacte apparaten voor terugkerende taken in huis.', feedAliases: ['kleine huishoudelijke apparaten', 'small household appliances', 'small domestic appliances'] },
  ],
  buyingTips: [
    { title: 'Meet vóór je vergelijkt', description: 'Controleer beschikbare ruimte, deuropeningen en aansluitpunten voordat je een groot apparaat kiest.' },
    { title: 'Kijk naar gebruikskosten', description: 'Energie, water, filters, zakken en andere verbruiksartikelen kunnen op termijn belangrijker zijn dan een klein prijsverschil bij aankoop.' },
    { title: 'Denk aan onderhoud', description: 'Een apparaat dat eenvoudig schoon te maken en te onderhouden is, blijft vaak prettiger in dagelijks gebruik.' },
  ],
  popularProductTypes: ['Stofzuigers', 'Robotstofzuigers', 'Luchtreinigers', 'Wasmachines', 'Wasdrogers', 'Ventilatoren'],
  faq: [
    { question: 'Welke capaciteit heb ik nodig?', answer: 'Dat hangt af van huishouden, beschikbare ruimte en hoe vaak je het apparaat gebruikt. Kies niet automatisch de grootste uitvoering.' },
    { question: 'Hoe vergelijk ik energieverbruik?', answer: 'Gebruik waar beschikbaar het energielabel en productinformatieblad van het exacte model en vergelijk apparaten binnen dezelfde productgroep.' },
    { question: 'Is een slim huishoudelijk apparaat automatisch handiger?', answer: 'Niet altijd. Een app of netwerkfunctie is vooral nuttig wanneer die een taak oplost die je regelmatig uitvoert.' },
  ],
  featuredGuideSlugs: ['stofzuiger-kopen', 'luchtreiniger-kopen'],
} as const satisfies CategoryContent

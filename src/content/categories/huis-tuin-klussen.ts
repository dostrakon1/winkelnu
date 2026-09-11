import type { CategoryContent } from './types'

export const huisTuinKlussenCategory = {
  slug: 'huis-tuin-klussen',
  title: 'Huis, tuin & klussen',
  description: 'Praktische keuzehulp voor gereedschap, tuinonderhoud en klussen rond het huis.',
  intro: 'Goed gereedschap en tuinmateriaal passen bij de klus die je daadwerkelijk uitvoert. Kijk niet alleen naar vermogen of een lange functielijst, maar ook naar veiligheid, formaat, accuplatform, onderhoud en hoe vaak je het product gebruikt.',
  feedAliases: ['huis tuin klussen', 'home garden diy', 'home improvement', 'tools garden'],
  topics: ['Kracht en accuduur', 'Formaat en gebruiksgemak', 'Onderhoud en accessoires', 'Veilig werken binnen en buiten'],
  subcategories: [
    { slug: 'elektrisch-gereedschap', title: 'Elektrisch gereedschap', description: 'Machines voor boren, zagen, schuren en andere terugkerende klussen.', feedAliases: ['elektrisch gereedschap', 'power tools', 'boormachines', 'drills', 'saws'] },
    { slug: 'handgereedschap', title: 'Handgereedschap', description: 'Basisgereedschap voor montage, reparatie en onderhoud.', feedAliases: ['handgereedschap', 'hand tools', 'tool sets', 'gereedschapssets'] },
    { slug: 'tuinmachines', title: 'Tuinmachines', description: 'Machines voor gras, snoeiwerk en onderhoud van buitenruimte.', feedAliases: ['tuinmachines', 'garden machinery', 'lawn mowers', 'grasmaaiers', 'pressure washers', 'hogedrukreinigers'] },
    { slug: 'tuin-bewatering', title: 'Tuin & bewatering', description: 'Hulpmiddelen voor planten, watergeven en seizoensonderhoud.', feedAliases: ['tuin bewatering', 'garden watering', 'irrigation', 'watering'] },
    { slug: 'werkplaats-opbergen', title: 'Werkplaats & opbergen', description: 'Oplossingen om gereedschap veilig en overzichtelijk te bewaren.', feedAliases: ['werkplaats opbergen', 'tool storage', 'workshop storage', 'tool boxes'] },
  ],
  buyingTips: [
    { title: 'Kies op klus, niet op maximumvermogen', description: 'Bepaal materiaal, frequentie en duur van je klussen voordat je een zwaarder model kiest.' },
    { title: 'Denk aan het accuplatform', description: 'Bij accugereedschap kan compatibiliteit met bestaande accu\'s en laders veel verschil maken in kosten en gemak.' },
    { title: 'Neem veiligheid serieus', description: 'Gebruik passend beschermingsmateriaal en volg de handleiding van machine en accessoire.' },
  ],
  popularProductTypes: ['Boormachines', 'Accuschroefmachines', 'Cirkelzagen', 'Grasmaaiers', 'Hogedrukreinigers', 'Gereedschapssets'],
  faq: [
    { question: 'Heb ik professioneel gereedschap nodig voor thuis?', answer: 'Niet per se. Kies op gebruiksfrequentie, materiaal en belasting. Voor incidentele klussen kan een eenvoudiger model voldoende zijn.' },
    { question: 'Is één accuplatform handig?', answer: 'Dat kan handig en voordelig zijn wanneer meerdere machines dezelfde accu\'s en laders ondersteunen. Controleer compatibiliteit per model.' },
    { question: 'Waar let ik op bij tuinmachines?', answer: 'Naast prestaties zijn bereik, gewicht, geluid, onderhoud, opslag en geschiktheid voor jouw tuin belangrijk.' },
  ],
  featuredGuideSlugs: [],
} as const satisfies CategoryContent

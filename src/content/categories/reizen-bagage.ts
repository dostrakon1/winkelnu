import type { CategoryContent } from './types'

export const reizenBagageCategory = {
  slug: 'reizen-bagage',
  title: 'Reizen & bagage',
  description: 'Praktische keuzehulp voor koffers, reistassen en accessoires met aandacht voor formaat, gewicht, vervoer en reiscomfort.',
  intro: 'Goede reisbagage past bij je vervoermiddel, reisduur en wat je daadwerkelijk meeneemt. Formaat, leeggewicht, indeling, stevigheid en draagcomfort zijn daarom vaak belangrijker dan extra vakken of opvallende functies. Controleer bij vliegen ook altijd de actuele bagageregels van je vervoerder.',
  feedAliases: ['reizen bagage', 'travel luggage', 'luggage travel', 'travel gear', 'bags luggage'],
  topics: ['Formaat en gewicht', 'Indeling en toegankelijkheid', 'Stevigheid en beveiliging', 'Draagcomfort en vervoer'],
  subcategories: [
    { slug: 'koffers', title: 'Koffers', description: 'Harde en zachte koffers voor cabine- en ruimbagage.', feedAliases: ['koffers', 'suitcases', 'luggage cases', 'travel suitcases'] },
    { slug: 'reistassen', title: 'Reistassen', description: 'Flexibele tassen voor weekendtrips, sport en reizen met verschillende vervoermiddelen.', feedAliases: ['reistassen', 'travel bags', 'duffel bags', 'weekend bags'] },
    { slug: 'rugzakken-reizen', title: 'Rugzakken', description: 'Rugzakken voor reizen en dagelijks meenemen met aandacht voor inhoud en draagcomfort.', feedAliases: ['reisrugzakken', 'travel backpacks', 'luggage backpacks', 'cabin backpacks'] },
    { slug: 'reisaccessoires', title: 'Reisaccessoires', description: 'Organizers, sloten, adapters en andere praktische hulpmiddelen voor onderweg.', feedAliases: ['reisaccessoires', 'travel accessories', 'luggage accessories', 'packing accessories'] },
    { slug: 'reiscomfort', title: 'Reiscomfort', description: 'Producten voor rust, ondersteuning en gemak tijdens langere reizen.', feedAliases: ['reiscomfort', 'travel comfort', 'travel pillows', 'travel comfort accessories'] },
  ],
  buyingTips: [
    { title: 'Controleer maat en gewicht', description: 'Meet inclusief wielen en handgrepen en vergelijk bij vliegen met de actuele limieten van je vervoerder.' },
    { title: 'Kies de juiste constructie', description: 'Harde en zachte bagage hebben verschillende voordelen voor bescherming, flexibiliteit en gewicht.' },
    { title: 'Test draag- en rolcomfort', description: 'Let op handgrepen, schouderbanden, wielconstructie en hoe prettig de bagage beweegt wanneer hij vol is.' },
  ],
  popularProductTypes: ['Cabinekoffers', 'Ruimbagagekoffers', 'Weekendtassen', 'Reisrugzakken', 'Packing cubes', 'Reisadapters'],
  faq: [
    { question: 'Welke maat koffer mag mee als handbagage?', answer: 'Dat verschilt per luchtvaartmaatschappij en ticket. Controleer altijd de actuele afmetingen en gewichtslimieten van je vervoerder.' },
    { question: 'Is een harde koffer altijd beter beschermd?', answer: 'Een harde schaal kan goede bescherming bieden, maar constructie, sluiting en inhoud bepalen mede hoe goed spullen beschermd blijven.' },
    { question: 'Hoe kies ik een reisrugzak?', answer: 'Let op inhoud, ruglengte, banden, eigen gewicht, opening en of de afmetingen passen bij de manier waarop je reist.' },
  ],
  featuredGuideSlugs: [],
} as const satisfies CategoryContent

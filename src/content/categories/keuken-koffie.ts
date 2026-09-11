import type { CategoryContent } from './types'

export const keukenKoffieCategory = {
  slug: 'keuken-koffie',
  title: 'Keuken & koffie',
  description: 'Ontdek welke keukenapparaten aansluiten bij je kookgewoonten, huishouden en beschikbare ruimte.',
  intro: 'Een keukenapparaat is pas een goede aankoop wanneer je het regelmatig en met plezier gebruikt. Denk aan porties, bereidingstijd, schoonmaken en de ruimte op je aanrecht voordat je naar extra functies kijkt.',
  feedAliases: ['keuken koffie', 'kitchen coffee', 'kitchen appliances', 'kitchen dining'],
  topics: ['Porties en capaciteit', 'Bereidingsmogelijkheden', 'Schoonmaken en onderhoud', 'Ruimte en gebruikskosten'],
  subcategories: [
    { slug: 'koffie-espresso', title: 'Koffie & espresso', description: 'Apparaten en accessoires voor verschillende manieren van koffiezetten.', feedAliases: ['koffie espresso', 'coffee espresso', 'coffee machines', 'koffiemachines', 'espresso machines'] },
    { slug: 'koken-bakken', title: 'Koken & bakken', description: 'Apparaten die dagelijkse bereiding of specifieke kooktechnieken ondersteunen.', feedAliases: ['koken bakken', 'cooking baking', 'airfryers', 'ovens', 'cooking appliances'] },
    { slug: 'mixen-bereiden', title: 'Mixen & bereiden', description: 'Keukenmachines, blenders en hulpmiddelen voor voorbereiding.', feedAliases: ['mixen bereiden', 'food preparation', 'keukenmachines', 'stand mixers', 'blenders', 'food processors'] },
    { slug: 'koelen-bewaren', title: 'Koelen & bewaren', description: 'Oplossingen om eten en drinken praktisch te bewaren.', feedAliases: ['koelen bewaren', 'cooling storage', 'refrigeration', 'food storage', 'koelkasten'] },
    { slug: 'keukenaccessoires', title: 'Keukenaccessoires', description: 'Handige hulpmiddelen die veelgebruikte taken eenvoudiger maken.', feedAliases: ['keukenaccessoires', 'kitchen accessories', 'kitchen tools'] },
  ],
  buyingTips: [
    { title: 'Begin bij wat je echt maakt', description: 'Schrijf op welke gerechten of dranken je wekelijks bereidt en kies functies die daarbij aansluiten.' },
    { title: 'Tel schoonmaakwerk mee', description: 'Losse onderdelen, vaatwasserbestendigheid en bereikbaarheid bepalen hoeveel moeite een apparaat na gebruik kost.' },
    { title: 'Meet je werkruimte', description: 'Controleer breedte, diepte en hoogte, inclusief ruimte om deksel, reservoir of machineonderdeel te openen.' },
  ],
  popularProductTypes: ['Koffiemachines', 'Airfryers', 'Keukenmachines', 'Blenders', 'Waterkokers', 'Broodroosters'],
  faq: [
    { question: 'Hoeveel capaciteit heb ik nodig?', answer: 'Kijk naar het aantal personen, normale porties en hoe vaak je grotere hoeveelheden maakt. Extra capaciteit neemt ook meer ruimte in.' },
    { question: 'Is een hoger wattage altijd beter?', answer: 'Nee. Vermogen alleen zegt weinig over prestaties; ontwerp, regeling en het type taak spelen ook mee.' },
    { question: 'Wanneer zijn extra accessoires de moeite waard?', answer: 'Vooral wanneer je ze regelmatig gebruikt. Neem aanschafprijs, opslagruimte en schoonmaakwerk mee.' },
  ],
  featuredGuideSlugs: ['keukenmachine-kopen'],
} as const satisfies CategoryContent

import type { CategoryContent } from './types'

export const elektronicaCategory = {
  slug: 'elektronica',
  title: 'Elektronica',
  description: 'Maak een bewuste keuze voor apparaten die passen bij je werk, studie en dagelijks gebruik.',
  intro: 'Een lange specificatielijst zegt niet automatisch welk apparaat het beste bij je past. Begin bij wat je ermee doet, bepaal welke eigenschappen belangrijk zijn en vergelijk daarna pas modellen en prijzen.',
  topics: [
    'Prestaties voor jouw gebruik',
    'Comfort en dagelijks gemak',
    'Aansluitingen en compatibiliteit',
    'Onderhoud en levensduur',
  ],
  subcategories: [
    { title: 'Laptops & computers', description: 'Voor werk, studie, creatie en dagelijks gebruik.' },
    { title: 'Beeld & monitoren', description: 'Schermen, monitoren en accessoires voor thuis en werk.' },
    { title: 'Audio', description: 'Hoofdtelefoons, speakers en andere luisterapparatuur.' },
    { title: 'Smart home', description: 'Slimme apparaten die comfort en bediening in huis combineren.' },
    { title: 'Mobiel & accessoires', description: 'Telefoons, opladen, bescherming en handige uitbreidingen.' },
  ],
  buyingTips: [
    { title: 'Begin bij je gebruik', description: 'Noteer eerst wat je dagelijks met het apparaat wilt doen. Dat voorkomt dat je betaalt voor prestaties of functies die je nauwelijks gebruikt.' },
    { title: 'Controleer compatibiliteit', description: 'Kijk vóór aankoop naar aansluitingen, besturingssysteem, accessoires en bestaande apparaten die ermee moeten samenwerken.' },
    { title: 'Vergelijk totale kosten', description: 'Neem noodzakelijke kabels, abonnementen, accessoires, energieverbruik en eventuele vervangingsonderdelen mee.' },
  ],
  popularProductTypes: ['Laptops', 'Monitoren', 'Hoofdtelefoons', 'Tablets', 'Smartwatches', 'Routers'],
  faq: [
    { question: 'Hoe kies ik tussen twee apparaten met vergelijkbare specificaties?', answer: 'Vergelijk vooral gebruiksgemak, aansluitingen, ondersteuning, garantie en de eigenschappen die voor jouw dagelijkse gebruik belangrijk zijn.' },
    { question: 'Is duurder altijd beter?', answer: 'Nee. Een duurder model kan extra prestaties of functies bieden, maar die hebben alleen waarde wanneer je ze daadwerkelijk nodig hebt.' },
    { question: 'Waar moet ik op letten bij een aanbieding?', answer: 'Controleer het exacte modelnummer, de uiteindelijke prijs, meegeleverde accessoires, verkoper, garantie en retourvoorwaarden.' },
  ],
  featuredGuideSlugs: ['laptop-kopen', 'hoofdtelefoon-kopen', 'monitor-kopen'],
} as const satisfies CategoryContent

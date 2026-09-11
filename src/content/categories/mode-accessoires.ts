import type { CategoryContent } from './types'

export const modeAccessoiresCategory = {
  slug: 'mode-accessoires',
  title: 'Mode & accessoires',
  description: 'Praktische keuzehulp voor kleding, schoenen en accessoires met aandacht voor pasvorm, materiaal, gebruik en onderhoud.',
  intro: 'Bij mode draait een goede keuze niet alleen om stijl of prijs. Pasvorm, materiaal, seizoen, onderhoud en hoe vaak je iets draagt bepalen of een aankoop echt bij je past. Vergelijk daarom eerst op gebruik en draagcomfort en kijk daarna naar merk of trend.',
  feedAliases: ['mode accessoires', 'fashion accessories', 'fashion', 'apparel', 'clothing'],
  topics: ['Pasvorm en maatvoering', 'Materiaal en comfort', 'Seizoen en gebruik', 'Onderhoud en levensduur'],
  subcategories: [
    { slug: 'damesmode', title: 'Damesmode', description: 'Kleding voor dagelijks gebruik, werk, vrije tijd en bijzondere momenten.', feedAliases: ['damesmode', 'womens fashion', 'womens clothing', 'women apparel'] },
    { slug: 'herenmode', title: 'Herenmode', description: 'Kleding voor dagelijks gebruik, werk, vrije tijd en bijzondere momenten.', feedAliases: ['herenmode', 'mens fashion', 'mens clothing', 'men apparel'] },
    { slug: 'schoenen', title: 'Schoenen', description: 'Schoenen waarbij pasvorm, ondersteuning, materiaal en gebruikssituatie centraal staan.', feedAliases: ['schoenen', 'shoes', 'footwear', 'fashion footwear'] },
    { slug: 'tassen-accessoires', title: 'Tassen & accessoires', description: 'Tassen, riemen, portemonnees en andere accessoires voor dagelijks gebruik.', feedAliases: ['tassen accessoires', 'fashion bags accessories', 'handbags accessories', 'wallets belts'] },
    { slug: 'sieraden-horloges', title: 'Sieraden & horloges', description: 'Accessoires waarbij materiaal, maat, draagcomfort en afwerking belangrijk zijn.', feedAliases: ['sieraden horloges', 'jewelry watches', 'jewellery watches', 'fashion watches jewelry'] },
  ],
  buyingTips: [
    { title: 'Begin bij pasvorm', description: 'Gebruik maattabellen van het exacte merk en vergelijk maten in centimeters wanneer die beschikbaar zijn.' },
    { title: 'Lees het materiaal', description: 'Samenstelling en afwerking bepalen comfort, onderhoud en hoe een product zich bij dragen gedraagt.' },
    { title: 'Denk aan gebruiksfrequentie', description: 'Een product dat je vaak draagt mag vooral praktisch, comfortabel en goed te onderhouden zijn.' },
  ],
  popularProductTypes: ['Jassen', 'Broeken', 'Sneakers', 'Handtassen', 'Horloges', 'Sieraden'],
  faq: [
    { question: 'Hoe vergelijk ik maten tussen merken?', answer: 'Gebruik waar mogelijk lichaams- en productmaten in centimeters. Een letter- of confectiemaat kan per merk anders vallen.' },
    { question: 'Is een duurder materiaal altijd beter?', answer: 'Niet automatisch. Geschiktheid hangt af van draagcomfort, onderhoud, gebruik en persoonlijke voorkeur.' },
    { question: 'Waar let ik op bij accessoires?', answer: 'Controleer afmetingen, materiaal, sluitingen, gewicht en of het product past bij de manier waarop je het dagelijks wilt gebruiken.' },
  ],
  featuredGuideSlugs: [],
} as const satisfies CategoryContent

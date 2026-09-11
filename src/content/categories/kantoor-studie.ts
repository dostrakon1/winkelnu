import type { CategoryContent } from './types'

export const kantoorStudieCategory = {
  slug: 'kantoor-studie',
  title: 'Kantoor & studie',
  description: 'Praktische keuzehulp voor werk- en studieproducten die helpen bij organiseren, schrijven, printen en comfortabel werken.',
  intro: 'Een prettige werk- of studieplek ontstaat niet door zoveel mogelijk spullen te kopen, maar door producten te kiezen die passen bij je taken, beschikbare ruimte en dagelijkse routine. Let op ergonomie, verbruikskosten, compatibiliteit en hoe eenvoudig alles georganiseerd blijft.',
  feedAliases: ['kantoor studie', 'office school', 'office supplies', 'school supplies', 'stationery office'],
  topics: ['Ergonomie en comfort', 'Organisatie en overzicht', 'Compatibiliteit en verbruik', 'Ruimte en dagelijks gebruik'],
  subcategories: [
    { slug: 'schrijven-papier', title: 'Schrijven & papier', description: 'Pennen, notitieboeken, papier en andere basisbenodigdheden voor werk en studie.', feedAliases: ['schrijven papier', 'writing paper', 'stationery', 'paper products'] },
    { slug: 'bureau-organisatie', title: 'Bureau & organisatie', description: 'Opbergers, bureaumateriaal en hulpmiddelen om werk overzichtelijk te houden.', feedAliases: ['bureau organisatie', 'desk organization', 'desk organisers', 'office organization'] },
    { slug: 'school-studie', title: 'School & studie', description: 'Praktische benodigdheden voor lessen, huiswerk, planning en leren.', feedAliases: ['school studie', 'school study supplies', 'student supplies', 'back to school'] },
    { slug: 'printers-accessoires', title: 'Printers & accessoires', description: 'Printers, papier, inkt en accessoires waarbij gebruikskosten en compatibiliteit belangrijk zijn.', feedAliases: ['printers accessoires', 'printers accessories', 'printer supplies', 'printing supplies'] },
    { slug: 'ergonomisch-werken', title: 'Ergonomisch werken', description: 'Hulpmiddelen voor een comfortabele en praktische werk- of studiehouding.', feedAliases: ['ergonomisch werken', 'ergonomic office', 'ergonomic workspace', 'office ergonomics'] },
  ],
  buyingTips: [
    { title: 'Begin bij je taak', description: 'Bepaal of je vooral schrijft, leest, print, tekent of langdurig achter een scherm werkt en kies daarna pas hulpmiddelen.' },
    { title: 'Tel verbruik mee', description: 'Bij printers en andere verbruiksproducten kunnen inkt, papier en vervangingsonderdelen belangrijker zijn dan de aanschafprijs.' },
    { title: 'Werk met je beschikbare ruimte', description: 'Meet bureau, kastruimte en aansluitingen voordat je grotere apparatuur of organizers kiest.' },
  ],
  popularProductTypes: ['Notitieboeken', 'Pennen', 'Bureau-organizers', 'Printers', 'Laptophouders', 'Bureaulampen'],
  faq: [
    { question: 'Wat maakt een werkplek ergonomisch?', answer: 'Een goede werkplek ondersteunt een ontspannen houding en laat je scherm, stoel en werkvlak aanpassen aan jouw lichaam en taak.' },
    { question: 'Welke printer past bij incidenteel gebruik?', answer: 'Vergelijk vooral printvolume, type documenten, kosten per pagina en hoe vaak je print. Een goedkoper apparaat kan hogere gebruikskosten hebben.' },
    { question: 'Hoe voorkom ik een vol bureau?', answer: 'Kies alleen hulpmiddelen die een terugkerende taak ondersteunen en geef papier, kabels en kleine spullen een vaste plek.' },
  ],
  featuredGuideSlugs: [],
} as const satisfies CategoryContent

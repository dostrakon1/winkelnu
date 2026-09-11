import type { CategoryContent } from './types'

export const persoonlijkeVerzorgingCategory = {
  slug: 'persoonlijke-verzorging',
  title: 'Persoonlijke verzorging',
  description: 'Praktische keuzehulp voor elektrische verzorgingsapparaten die passen bij je dagelijkse routine.',
  intro: 'Bij persoonlijke verzorgingsapparaten zijn comfort, onderhoud en passend gebruik vaak belangrijker dan een lange lijst extra standen. Begin bij je eigen routine, controleer waarvoor een apparaat bedoeld is en neem vervangingsonderdelen en gebruikskosten mee in je keuze.',
  feedAliases: ['persoonlijke verzorging', 'personal care', 'beauty personal care', 'grooming'],
  topics: ['Comfort en dagelijks gebruik', 'Nat of droog gebruiken', 'Onderhoud en hygiëne', 'Accu en vervangingsonderdelen'],
  subcategories: [
    { slug: 'mondverzorging', title: 'Mondverzorging', description: 'Elektrische hulpmiddelen voor dagelijkse mondverzorging.', feedAliases: ['mondverzorging', 'oral care', 'electric toothbrushes', 'elektrische tandenborstels'] },
    { slug: 'scheren-trimmen', title: 'Scheren & trimmen', description: 'Apparaten voor scheren, trimmen en persoonlijke grooming.', feedAliases: ['scheren trimmen', 'shaving grooming', 'shavers', 'trimmers', 'scheerapparaten', 'baardtrimmers'] },
    { slug: 'haarverzorging', title: 'Haarverzorging', description: 'Styling- en droogapparaten voor verschillende haartypen en routines.', feedAliases: ['haarverzorging', 'hair care', 'hair styling', 'hair dryers', 'haardrogers'] },
    { slug: 'huidverzorging', title: 'Huidverzorging', description: 'Elektrische hulpmiddelen die onderdeel kunnen zijn van een verzorgingsroutine.', feedAliases: ['huidverzorging', 'skin care', 'skincare devices', 'beauty devices'] },
    { slug: 'verzorging-onderweg', title: 'Verzorging onderweg', description: 'Compacte apparaten en accessoires voor reizen en dagelijks meenemen.', feedAliases: ['verzorging onderweg', 'travel grooming', 'travel personal care'] },
  ],
  buyingTips: [
    { title: 'Kies voor dagelijks comfort', description: 'Een apparaat dat prettig vasthoudt en eenvoudig te bedienen is, wordt waarschijnlijk vaker gebruikt dan een model met veel extra standen.' },
    { title: 'Controleer onderhoud', description: 'Kijk hoe onderdelen gereinigd worden en welke koppen, mesjes of andere onderdelen periodiek vervangen moeten worden.' },
    { title: 'Let op gebruiksomgeving', description: 'Controleer of het exacte apparaat geschikt is voor nat gebruik, de badkamer of reizen wanneer dat voor jou belangrijk is.' },
  ],
  popularProductTypes: ['Elektrische tandenborstels', 'Scheerapparaten', 'Baardtrimmers', 'Haardrogers', 'Stijltangen', 'Tondeuses'],
  faq: [
    { question: 'Heb ik veel standen nodig?', answer: 'Meestal niet. Kies standen die passen bij je eigen routine in plaats van het model met de langste functielijst.' },
    { question: 'Hoe belangrijk zijn vervangingsonderdelen?', answer: 'Zeer belangrijk voor producten met slijtende koppen, mesjes of borstels. Controleer beschikbaarheid en prijs vooraf.' },
    { question: 'Kan ik ieder apparaat onder de douche gebruiken?', answer: 'Nee. Controleer altijd de waterbestendigheid en gebruiksinstructies van het exacte model.' },
  ],
  featuredGuideSlugs: ['elektrische-tandenborstel-kopen'],
} as const satisfies CategoryContent

import type { CategoryContent } from './types'

export const dierenCategory = {
  slug: 'dieren',
  title: 'Dieren',
  description: 'Praktische keuzehulp voor producten rond rust, verzorging, spelen en veilig vervoer van huisdieren.',
  intro: 'Bij producten voor huisdieren draait een goede keuze niet alleen om formaat of prijs. Het product moet passen bij het dier, de ruimte in huis en de manier waarop je het dagelijks gebruikt. Begin daarom bij gedrag, comfort, veiligheid en schoonmaakgemak voordat je naar extra functies kijkt.',
  topics: ['Formaat en comfort', 'Veiligheid en stevigheid', 'Gedrag en dagelijks gebruik', 'Schoonmaken en onderhoud'],
  subcategories: [
    { title: 'Hond', description: 'Manden, riemen, verzorging en praktische producten voor dagelijks gebruik.' },
    { title: 'Kat', description: 'Krabben, rusten, spelen en verzorging in en rond het huis.' },
    { title: 'Voeren & drinken', description: 'Bakken, drinkoplossingen en hulpmiddelen rond de dagelijkse voerplek.' },
    { title: 'Verzorging', description: 'Borstels, nagelverzorging en andere praktische hulpmiddelen.' },
    { title: 'Reizen & vervoer', description: 'Producten om huisdieren veilig en praktisch mee te nemen.' },
  ],
  buyingTips: [
    { title: 'Meet je dier en je ruimte', description: 'Gebruik echte afmetingen in plaats van alleen labels als klein, middel of groot.' },
    { title: 'Kijk naar gedrag', description: 'Een rustige slaper, sterke kauwer of actieve kat stelt andere eisen aan materiaal en constructie.' },
    { title: 'Maak schoonmaak onderdeel van je keuze', description: 'Wasbare hoezen, losse onderdelen en goed bereikbare oppervlakken maken dagelijks onderhoud eenvoudiger.' },
  ],
  popularProductTypes: ['Hondenmanden', 'Krabpalen', 'Transportboxen', 'Drinkfonteinen', 'Voerbakken', 'Verzorgingsborstels'],
  faq: [
    { question: 'Hoe bepaal ik de juiste maat?', answer: 'Meet je huisdier in een natuurlijke houding en vergelijk dat met de binnenmaten en maatadviezen van het product.' },
    { question: 'Zijn automatische voer- of drinksystemen altijd handig?', answer: 'Ze kunnen gemak bieden, maar vragen nog steeds controle, schoonmaak en een passend voedings- of drinkregime.' },
    { question: 'Wat is belangrijk bij vervoer?', answer: 'Kies een oplossing die past bij dier en vervoermiddel, stevig bevestigd kan worden en volgens de instructies wordt gebruikt.' },
  ],
  featuredGuideSlugs: ['hondenmand-kopen'],
} as const satisfies CategoryContent

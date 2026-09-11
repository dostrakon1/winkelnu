import type { CategoryContent } from './types'

export const autoFietsCategory = {
  slug: 'auto-fiets',
  title: 'Auto & fiets',
  description: 'Praktische keuzehulp voor accessoires en uitrusting waarmee je veiliger, comfortabeler en handiger onderweg bent.',
  intro: 'Bij auto- en fietsaccessoires draait een goede keuze vooral om compatibiliteit, veiligheid en dagelijks gebruiksgemak. Controleer daarom eerst of een product bij jouw voertuig, fiets of telefoon past en kijk daarna pas naar extra functies en prijs.',
  topics: ['Compatibiliteit en maatvoering', 'Veilig gebruik onderweg', 'Bevestiging en draagvermogen', 'Onderhoud en duurzaamheid'],
  subcategories: [
    { title: 'Fietsveiligheid', description: 'Helmen, verlichting en andere uitrusting voor zichtbaar en passend gebruik.' },
    { title: 'Fietsaccessoires', description: 'Tassen, sloten, houders en praktische toevoegingen voor dagelijks fietsen.' },
    { title: 'Auto-accessoires', description: 'Producten voor comfort, organisatie en dagelijks gebruik in de auto.' },
    { title: 'Laden & elektronica', description: 'Opladers, houders en apparaten waarbij compatibiliteit belangrijk is.' },
    { title: 'Bagage & vervoer', description: 'Dragers, dakkoffers en andere oplossingen om spullen mee te nemen.' },
  ],
  buyingTips: [
    { title: 'Controleer compatibiliteit eerst', description: 'Maat, aansluiting, bevestigingspunt en draagvermogen moeten passen bij jouw voertuig of fiets.' },
    { title: 'Veiligheid gaat vóór gemak', description: 'Een houder, drager of accessoire moet veilig bevestigd zijn en mag bediening of zicht niet hinderen.' },
    { title: 'Denk aan dagelijks monteren', description: 'Een product dat vaak geplaatst, opgeladen of opgeborgen wordt moet ook praktisch blijven na de eerste week.' },
  ],
  popularProductTypes: ['Fietshelmen', 'Fietssloten', 'Fietstassen', 'Telefoonhouders', 'Dakkoffers', 'Auto-opladers'],
  faq: [
    { question: 'Hoe weet ik of een accessoire op mijn fiets of auto past?', answer: 'Controleer maatvoering, type aansluiting, bevestigingspunten en de compatibiliteitsinformatie van het exacte product.' },
    { question: 'Kan ik universele accessoires altijd gebruiken?', answer: 'Universeel betekent niet automatisch geschikt voor iedere situatie. Controleer montage, maatbereik en gebruiksinstructies.' },
    { question: 'Waar let ik op bij producten die gewicht dragen?', answer: 'Controleer maximaal draagvermogen van zowel accessoire als voertuig of drager en volg de montage-instructies.' },
  ],
  featuredGuideSlugs: ['fietshelm-kopen'],
} as const satisfies CategoryContent

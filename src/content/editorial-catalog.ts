import type { BuyingGuide } from './koopgidsen'
import {
  buyingGuides as existingBuyingGuides,
  editorialCategories as existingEditorialCategories,
} from './koopgidsen-public'
import {
  personalCareBuyingGuides,
  personalCareEditorialCategory,
} from './persoonlijke-verzorging-guides'

const babyKindEditorialCategory = {
  slug: 'baby-kind',
  title: 'Baby & Kind',
  description: 'Praktische keuzehulp voor baby- en kinderproducten, met aandacht voor veiligheid, leeftijd, gebruiksgemak en dagelijks comfort.',
  intro: 'Bij baby- en kinderproducten staan veiligheid en passend gebruik voorop. Kijk naar leeftijd, maatvoering, montage, onderhoud en hoe een product in jullie dagelijkse routine past. Vergelijk functies pas nadat de basisvoorwaarden helder zijn.',
  topics: ['Veiligheid en leeftijd', 'Formaat en ergonomie', 'Onderhoud en materiaal', 'Dagelijks gebruik en meenemen'],
} as const

export const editorialCategories = [
  ...existingEditorialCategories,
  personalCareEditorialCategory,
  babyKindEditorialCategory,
] as const

export const buyingGuides: BuyingGuide[] = [
  ...existingBuyingGuides,
  ...personalCareBuyingGuides,
]

export function getBuyingGuide(slug: string): BuyingGuide | undefined {
  return buyingGuides.find((guide) => guide.slug === slug)
}

export function getEditorialCategory(slug: string) {
  return editorialCategories.find((category) => category.slug === slug)
}

export function guidesForCategory(slug: string): BuyingGuide[] {
  return buyingGuides.filter((guide) => guide.category === slug)
}

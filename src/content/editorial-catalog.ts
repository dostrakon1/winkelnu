import type { BuyingGuide } from './koopgidsen'
import {
  buyingGuides as existingBuyingGuides,
  editorialCategories as existingEditorialCategories,
} from './koopgidsen-public'
import {
  personalCareBuyingGuides,
  personalCareEditorialCategory,
} from './persoonlijke-verzorging-guides'
import {
  babyKindBuyingGuides,
  babyKindEditorialCategory,
} from './baby-kind-guides'
import {
  dierenBuyingGuides,
  dierenEditorialCategory,
} from './dieren-guides'
import {
  autoFietsBuyingGuides,
  autoFietsEditorialCategory,
} from './auto-fiets-guides'

export const editorialCategories = [
  ...existingEditorialCategories,
  personalCareEditorialCategory,
  babyKindEditorialCategory,
  dierenEditorialCategory,
  autoFietsEditorialCategory,
] as const

export const buyingGuides: BuyingGuide[] = [
  ...existingBuyingGuides,
  ...personalCareBuyingGuides,
  ...babyKindBuyingGuides,
  ...dierenBuyingGuides,
  ...autoFietsBuyingGuides,
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

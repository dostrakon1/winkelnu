import type { BuyingGuide } from './koopgidsen'
import { buyingGuides as existingBuyingGuides } from './koopgidsen-public'
import { personalCareBuyingGuides } from './persoonlijke-verzorging-guides'
import { babyKindBuyingGuides } from './baby-kind-guides'
import { dierenBuyingGuides } from './dieren-guides'
import { autoFietsBuyingGuides } from './auto-fiets-guides'
import { categories, getCategoryContent } from './categories'

export const editorialCategories = categories

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
  return getCategoryContent(slug)
}

export function guidesForCategory(slug: string): BuyingGuide[] {
  const category = getCategoryContent(slug)
  const guides = buyingGuides.filter((guide) => guide.category === slug)

  if (!category || category.featuredGuideSlugs.length === 0) return guides

  const priority = new Map<string, number>(category.featuredGuideSlugs.map((guideSlug, index) => [guideSlug, index]))
  return [...guides].sort(
    (a, b) => (priority.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (priority.get(b.slug) ?? Number.MAX_SAFE_INTEGER),
  )
}

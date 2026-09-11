import { elektronicaCategory } from './elektronica'
import { wonenHuishoudenCategory } from './wonen-huishouden'
import { keukenKoffieCategory } from './keuken-koffie'
import { persoonlijkeVerzorgingCategory } from './persoonlijke-verzorging'
import { huisTuinKlussenCategory } from './huis-tuin-klussen'
import { sportOutdoorCategory } from './sport-outdoor'
import { speelgoedHobbyCategory } from './speelgoed-hobby'
import { babyKindCategory } from './baby-kind'
import { dierenCategory } from './dieren'
import { autoFietsCategory } from './auto-fiets'
import { modeAccessoiresCategory } from './mode-accessoires'
import { kantoorStudieCategory } from './kantoor-studie'
import { reizenBagageCategory } from './reizen-bagage'

export const categories = [
  elektronicaCategory,
  wonenHuishoudenCategory,
  keukenKoffieCategory,
  persoonlijkeVerzorgingCategory,
  huisTuinKlussenCategory,
  sportOutdoorCategory,
  speelgoedHobbyCategory,
  babyKindCategory,
  dierenCategory,
  autoFietsCategory,
  modeAccessoiresCategory,
  kantoorStudieCategory,
  reizenBagageCategory,
] as const

export type CategorySlug = (typeof categories)[number]['slug']
export type SubcategorySlug = (typeof categories)[number]['subcategories'][number]['slug']

export const subcategories = categories.flatMap((category) =>
  category.subcategories.map((subcategory) => ({
    ...subcategory,
    categorySlug: category.slug,
  })),
)

export function getCategoryContent(slug: string) {
  return categories.find((category) => category.slug === slug)
}

export function getSubcategoryContent(categorySlug: string, subcategorySlug: string) {
  return getCategoryContent(categorySlug)?.subcategories.find((subcategory) => subcategory.slug === subcategorySlug)
}

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
] as const

export type CategorySlug = (typeof categories)[number]['slug']

export function getCategoryContent(slug: string) {
  return categories.find((category) => category.slug === slug)
}

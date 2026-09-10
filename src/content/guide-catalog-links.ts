import {
  getProductComparisonGroupLabel,
  type ProductComparisonGroup,
} from '@/domain/catalog/comparison'

const CATALOG_CATEGORY_BY_EDITORIAL: Record<string, string> = {
  elektronica: 'elektronica',
  'wonen-huishouden': 'wonen-huishouden',
  'keuken-koffie': 'keuken-koffie',
  'persoonlijke-verzorging': 'persoonlijke-verzorging',
  'sport-outdoor': 'sport-outdoor',
  'huis-tuin-klussen': 'tuin-klussen',
}

const PRODUCT_GROUP_BY_GUIDE: Record<string, ProductComparisonGroup> = {
  'laptop-kopen': 'laptops',
  'hoofdtelefoon-kopen': 'headphones',
  'stofzuiger-kopen': 'vacuum-cleaners',
  'wasmachine-kopen': 'washing-machines',
  'koffiezetapparaat-kopen': 'coffee-machines',
  'airfryer-kopen': 'airfryers',
  'keukenmachine-kopen': 'stand-mixers',
  'accuboormachine-kopen': 'drills',
  'grasmaaier-kopen': 'lawn-mowers',
  'hogedrukreiniger-kopen': 'pressure-washers',
  'sporthorloge-kopen': 'fitness-wearables',
  'kampeertent-kopen': 'tents',
  'elektrische-tandenborstel-kopen': 'electric-toothbrushes',
  'scheerapparaat-kopen': 'shavers',
  'epilator-kopen': 'epilators',
}

export function getCatalogCategorySlug(editorialCategorySlug: string): string | null {
  return CATALOG_CATEGORY_BY_EDITORIAL[editorialCategorySlug] ?? null
}

export function getGuideCatalogTarget(guideSlug: string): {
  productType: ProductComparisonGroup
  label: string
  href: string
} | null {
  const productType = PRODUCT_GROUP_BY_GUIDE[guideSlug]
  if (!productType) return null
  const label = getProductComparisonGroupLabel(productType)
  return {
    productType,
    label,
    href: `/zoeken?type=${encodeURIComponent(productType)}`,
  }
}

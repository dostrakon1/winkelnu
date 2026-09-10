import type { Product, ProductVisualKind } from './types'

export const MIN_COMPARISON_PRODUCTS = 2
export const MAX_COMPARISON_PRODUCTS = 4
export const NOT_APPLICABLE_COMPARISON_VALUE = 'Niet van toepassing'

export type ProductComparisonRow = {
  label: string
  values: Array<string | null>
}

const COMPARISON_GROUP_BY_VISUAL_KIND: Record<ProductVisualKind, string> = {
  laptop: 'laptops',
  headphones: 'headphones',
  tablet: 'tablets',
  mouse: 'computer-mice',
  'stick-vacuum': 'vacuum-cleaners',
  'canister-vacuum': 'vacuum-cleaners',
  'smart-lighting': 'smart-lighting',
  'washing-machine': 'washing-machines',
  airfryer: 'airfryers',
  'coffee-machine': 'coffee-machines',
  'dual-airfryer': 'airfryers',
  'stand-mixer': 'stand-mixers',
  toothbrush: 'electric-toothbrushes',
  shaver: 'shavers',
  epilator: 'epilators',
  watch: 'fitness-wearables',
  'fitness-band': 'fitness-wearables',
  bottle: 'drink-bottles',
  tent: 'tents',
  mower: 'lawn-mowers',
  'pressure-washer': 'pressure-washers',
  drill: 'drills',
  'robot-mower': 'lawn-mowers',
}

const PRODUCT_TYPE_LABEL_BY_VISUAL_KIND: Record<ProductVisualKind, string> = {
  laptop: 'Laptop',
  headphones: 'Hoofdtelefoon',
  tablet: 'Tablet',
  mouse: 'Computermuis',
  'stick-vacuum': 'Steelstofzuiger',
  'canister-vacuum': 'Sledestofzuiger',
  'smart-lighting': 'Slimme verlichting',
  'washing-machine': 'Wasmachine',
  airfryer: 'Airfryer',
  'coffee-machine': 'Koffiemachine',
  'dual-airfryer': 'Dual-zone airfryer',
  'stand-mixer': 'Keukenmachine',
  toothbrush: 'Elektrische tandenborstel',
  shaver: 'Scheerapparaat',
  epilator: 'Epilator',
  watch: 'Sporthorloge',
  'fitness-band': 'Fitnessband',
  bottle: 'Drinkfles',
  tent: 'Tent',
  mower: 'Grasmaaier',
  'pressure-washer': 'Hogedrukreiniger',
  drill: 'Accuboormachine',
  'robot-mower': 'Robotmaaier',
}

const NOT_APPLICABLE_SPECIFICATIONS: Partial<Record<string, ProductVisualKind[]>> = {
  gebruiksduur: ['canister-vacuum'],
  actieradius: ['stick-vacuum'],
  stofreservoir: ['canister-vacuum'],
  stofzak: ['stick-vacuum'],
}

function normalizeLabel(value: string): string {
  return value.trim().toLocaleLowerCase('nl-NL')
}

function getProductTypeLabel(product: Product): string | null {
  if (!product.visualKind) return null
  return PRODUCT_TYPE_LABEL_BY_VISUAL_KIND[product.visualKind] ?? null
}

function missingSpecificationValue(product: Product, key: string): string | null {
  if (!product.visualKind) return null
  return NOT_APPLICABLE_SPECIFICATIONS[key]?.includes(product.visualKind)
    ? NOT_APPLICABLE_COMPARISON_VALUE
    : null
}

export function getProductComparisonGroup(product: Product): string | null {
  if (!product.visualKind) return null
  return COMPARISON_GROUP_BY_VISUAL_KIND[product.visualKind] ?? null
}

export function productsAreComparable(products: Product[]): boolean {
  if (products.length < MIN_COMPARISON_PRODUCTS || products.length > MAX_COMPARISON_PRODUCTS) return false
  const group = getProductComparisonGroup(products[0])
  return Boolean(group && products.every((product) => getProductComparisonGroup(product) === group))
}

export function parseComparisonProductSlugs(
  raw: string | string[] | undefined,
): string[] {
  const values = Array.isArray(raw) ? raw : raw ? [raw] : []
  const result: string[] = []
  const seen = new Set<string>()

  for (const value of values) {
    for (const candidate of value.split(',')) {
      const slug = candidate.trim()
      if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug) || seen.has(slug)) continue
      seen.add(slug)
      result.push(slug)
      if (result.length === MAX_COMPARISON_PRODUCTS) return result
    }
  }

  return result
}

export function buildProductComparisonRows(products: Product[]): ProductComparisonRow[] {
  if (products.length === 0) return []

  const rows: ProductComparisonRow[] = []
  const productTypes = products.map(getProductTypeLabel)

  if (productTypes.some(Boolean)) {
    rows.push({ label: 'Producttype', values: productTypes })
  }

  if (products.some((product) => product.brand)) {
    rows.push({
      label: 'Merk',
      values: products.map((product) => product.brand?.trim() || null),
    })
  }

  const labels: string[] = []
  const labelByKey = new Map<string, string>()

  for (const product of products) {
    for (const specification of product.specifications ?? []) {
      const label = specification.label.trim()
      const key = normalizeLabel(label)
      if (!label || !key || labelByKey.has(key)) continue
      labelByKey.set(key, label)
      labels.push(key)
    }
  }

  for (const key of labels) {
    const label = labelByKey.get(key)
    if (!label) continue

    const values = products.map((product) => {
      const match = (product.specifications ?? []).find(
        (specification) => normalizeLabel(specification.label) === key,
      )
      return match?.value.trim() || missingSpecificationValue(product, key)
    })

    if (values.some(Boolean)) rows.push({ label, values })
  }

  return rows
}

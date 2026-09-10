import type { Product, ProductVisualKind } from './types'

export const MIN_COMPARISON_PRODUCTS = 2
export const MAX_COMPARISON_PRODUCTS = 4

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

function normalizeLabel(value: string): string {
  return value.trim().toLocaleLowerCase('nl-NL')
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
      return match?.value.trim() || null
    })

    if (values.some(Boolean)) rows.push({ label, values })
  }

  return rows
}

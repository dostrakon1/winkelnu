import type { Product } from './types'

export const MIN_COMPARISON_PRODUCTS = 2
export const MAX_COMPARISON_PRODUCTS = 4

export type ProductComparisonRow = {
  label: string
  values: Array<string | null>
}

function normalizeLabel(value: string): string {
  return value.trim().toLocaleLowerCase('nl-NL')
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

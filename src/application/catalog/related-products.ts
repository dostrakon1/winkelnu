import { getProductComparisonGroup } from '@/domain/catalog/comparison'
import type { Product } from '@/domain/catalog/types'

export type RelatedProductBuckets<T extends { product: Product }> = {
  comparable: T[]
  categoryAlternatives: T[]
}

function byRelevanceToCurrent<T extends { product: Product }>(current: Product) {
  return (a: T, b: T): number => {
    const aSameVisualKind = Number(Boolean(current.visualKind && a.product.visualKind === current.visualKind))
    const bSameVisualKind = Number(Boolean(current.visualKind && b.product.visualKind === current.visualKind))

    return bSameVisualKind - aSameVisualKind
      || a.product.title.localeCompare(b.product.title, 'nl-NL')
  }
}

export function selectRelatedProducts<T extends { product: Product }>(
  current: Product,
  candidates: T[],
  limit = 3,
): RelatedProductBuckets<T> {
  const safeLimit = Math.min(12, Math.max(0, Math.floor(limit)))
  if (safeLimit === 0) return { comparable: [], categoryAlternatives: [] }

  const uniquePeers: T[] = []
  const seen = new Set<string>([current.slug])

  for (const candidate of candidates) {
    if (seen.has(candidate.product.slug)) continue
    seen.add(candidate.product.slug)
    uniquePeers.push(candidate)
  }

  const currentGroup = getProductComparisonGroup(current)
  const allComparable = currentGroup
    ? uniquePeers.filter(({ product }) => getProductComparisonGroup(product) === currentGroup)
    : []
  const comparable = allComparable
    .sort(byRelevanceToCurrent(current))
    .slice(0, safeLimit)

  const allComparableSlugs = new Set(allComparable.map(({ product }) => product.slug))
  const categoryAlternatives = uniquePeers
    .filter(({ product }) => !allComparableSlugs.has(product.slug))
    .sort((a, b) => a.product.title.localeCompare(b.product.title, 'nl-NL'))
    .slice(0, safeLimit)

  return { comparable, categoryAlternatives }
}

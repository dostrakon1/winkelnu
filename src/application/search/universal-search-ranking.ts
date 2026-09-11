import type { CatalogProductListItem } from '@/application/catalog/catalog-service'
import {
  normalizeSearchText,
  type PredictiveSearchAnalysis,
  type PredictiveSearchKind,
  type PredictiveSearchSuggestion,
} from './predictive-search-core'

export type UniversalSearchRouteItem = {
  type: 'route'
  kind: PredictiveSearchKind
  eyebrow: string
  title: string
  description: string
  href: string
  score: number
  reason: string
}

export type UniversalSearchProductItem = {
  type: 'product'
  item: CatalogProductListItem
  score: number
  reason: string
}

export type UniversalSearchItem = UniversalSearchRouteItem | UniversalSearchProductItem

export type UniversalSearchRanking = {
  primary?: UniversalSearchItem
  items: UniversalSearchItem[]
  productCount: number
  routeCount: number
}

const ROUTE_KIND_BIAS: Record<PredictiveSearchKind, number> = {
  category: 8,
  subcategory: 16,
  guide: 4,
  collection: 10,
  'collection-section': 18,
}

function routeReason(suggestion: PredictiveSearchSuggestion): string {
  if (suggestion.reason === 'intent') return 'Past sterk bij de bedoeling achter je vraag'
  if (suggestion.reason === 'fuzzy') return 'Sterke match nadat Winkelnu een typefout herkende'
  if (suggestion.kind === 'subcategory') return 'Specifieke productgroep die goed bij je zoekterm past'
  if (suggestion.kind === 'guide') return 'Keuzehulp die je verder helpt vóór je vergelijkt'
  if (suggestion.kind === 'collection' || suggestion.kind === 'collection-section') return 'Slimme inspiratie over meerdere productcategorieën heen'
  return 'Sterke inhoudelijke route voor je zoekopdracht'
}

function scoreRoute(suggestion: PredictiveSearchSuggestion, analysis: PredictiveSearchAnalysis): UniversalSearchRouteItem {
  const navigationBoost = analysis.navigationOnly ? 24 : 0
  const intentBoost = suggestion.reason === 'intent' ? 10 : 0

  return {
    type: 'route',
    kind: suggestion.kind,
    eyebrow: suggestion.eyebrow,
    title: suggestion.title,
    description: suggestion.description,
    href: suggestion.href,
    score: suggestion.score + ROUTE_KIND_BIAS[suggestion.kind] + navigationBoost + intentBoost,
    reason: routeReason(suggestion),
  }
}

function productTextScore(item: CatalogProductListItem, term?: string): number {
  const needle = normalizeSearchText(term ?? '')
  if (!needle) return 0

  const title = normalizeSearchText(item.product.title)
  const brand = normalizeSearchText(item.product.brand ?? '')
  const description = normalizeSearchText(item.product.description ?? '')
  const tokens = needle.split(' ').filter((token) => token.length >= 2)
  const titleTokens = title.split(' ')

  if (title === needle) return 154
  if (title.startsWith(needle)) return 142
  if (title.includes(needle)) return 128
  if (tokens.length > 0 && tokens.every((token) => titleTokens.some((candidate) => candidate === token || candidate.startsWith(token)))) return 116
  if (tokens.length > 0 && tokens.every((token) => `${title} ${brand}`.includes(token))) return 105
  if (tokens.some((token) => title.includes(token))) return 94
  if (brand && (brand === needle || brand.startsWith(needle))) return 88
  if (description && tokens.some((token) => description.includes(token))) return 72
  return 0
}

function productQualityTieBreaker(item: CatalogProductListItem): number {
  // Relevance stays dominant. Commercial availability only breaks close ties.
  let score = 0
  if (item.product.imageUrl) score += 2
  if (item.product.description) score += 1
  if (item.bestOffer) score += 3
  if (item.offerCount > 1) score += Math.min(3, item.offerCount - 1)
  return score
}

function productReason(score: number, item: CatalogProductListItem): string {
  if (score >= 150) return 'Exacte productmatch'
  if (score >= 138) return 'Productnaam begint sterk met je zoekterm'
  if (score >= 122) return 'Sterke match in de productnaam'
  if (score >= 110) return 'Alle belangrijke zoekwoorden komen terug in het product'
  if (item.bestOffer) return 'Relevant product met gecontroleerde aanbiedingsdata'
  return 'Relevant product uit de Winkelnu-catalogus'
}

function scoreProduct(item: CatalogProductListItem, analysis: PredictiveSearchAnalysis): UniversalSearchProductItem | undefined {
  const searchTerm = analysis.productTerm ?? analysis.correctedTerm ?? analysis.normalizedTerm
  const relevance = productTextScore(item, searchTerm)
  if (relevance <= 0) return undefined
  const score = relevance + productQualityTieBreaker(item)

  return {
    type: 'product',
    item,
    score,
    reason: productReason(relevance, item),
  }
}

function itemKey(item: UniversalSearchItem): string {
  return item.type === 'product' ? `product:${item.item.product.id}` : `route:${item.href}`
}

function diversify(items: UniversalSearchItem[], limit: number, navigationOnly: boolean): UniversalSearchItem[] {
  if (navigationOnly) return items.filter((item) => item.type === 'route').slice(0, limit)

  const result: UniversalSearchItem[] = []
  const seen = new Set<string>()
  let products = 0
  let routes = 0

  for (const item of items) {
    if (result.length >= limit) break
    const key = itemKey(item)
    if (seen.has(key)) continue

    // The universal answer should remain mixed. Full product browsing lives below it.
    if (item.type === 'product' && products >= 3) continue
    if (item.type === 'route' && routes >= 4) continue

    result.push(item)
    seen.add(key)
    if (item.type === 'product') products += 1
    else routes += 1
  }

  // If products exist, keep at least one concrete product in the universal answer.
  if (!result.some((item) => item.type === 'product')) {
    const bestProduct = items.find((item) => item.type === 'product')
    if (bestProduct) {
      if (result.length >= limit) result.pop()
      result.push(bestProduct)
    }
  }

  // If a useful route exists, keep at least one navigational/decision route visible too.
  if (!result.some((item) => item.type === 'route')) {
    const bestRoute = items.find((item) => item.type === 'route')
    if (bestRoute) {
      if (result.length >= limit) result.pop()
      result.push(bestRoute)
    }
  }

  return result.sort((a, b) => b.score - a.score || itemKey(a).localeCompare(itemKey(b), 'nl-NL'))
}

export function buildUniversalSearchRanking(input: {
  analysis: PredictiveSearchAnalysis
  products: readonly CatalogProductListItem[]
  limit?: number
}): UniversalSearchRanking {
  const limit = Math.max(1, Math.min(10, input.limit ?? 7))
  const routes = input.analysis.suggestions.map((suggestion) => scoreRoute(suggestion, input.analysis))
  const products = input.products
    .map((item) => scoreProduct(item, input.analysis))
    .filter((item): item is UniversalSearchProductItem => Boolean(item))

  const all = [...routes, ...products]
    .sort((a, b) => b.score - a.score || itemKey(a).localeCompare(itemKey(b), 'nl-NL'))
  const items = diversify(all, limit, input.analysis.navigationOnly)

  return {
    primary: items[0],
    items,
    productCount: items.filter((item) => item.type === 'product').length,
    routeCount: items.filter((item) => item.type === 'route').length,
  }
}

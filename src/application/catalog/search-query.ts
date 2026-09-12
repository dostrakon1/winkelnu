import { parseProductComparisonGroup, type ProductComparisonGroup } from '@/domain/catalog/comparison'

export type CatalogSearchSort = 'relevance' | 'price_asc' | 'price_desc' | 'title_asc'

export type CatalogSearchQuery = {
  term?: string
  /** Internal original natural-language query. Not a separate URL contract. */
  contextTerm?: string
  categorySlug?: string
  productType?: ProductComparisonGroup
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly: boolean
  sort: CatalogSearchSort
  page: number
  pageSize: number
}

const MAX_PAGE = 100
const MAX_PAGE_SIZE = 48
const DEFAULT_PAGE_SIZE = 24

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function cleanText(value: string | undefined, maxLength: number): string | undefined {
  const normalized = value?.trim().replace(/\s+/g, ' ')
  return normalized ? normalized.slice(0, maxLength) : undefined
}

function positiveNumber(value: string | undefined): number | undefined {
  if (!value) return undefined
  const parsed = Number(value.replace(',', '.'))
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

function positiveInt(value: string | undefined, fallback: number, max: number): number {
  const parsed = Number.parseInt(value ?? '', 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return Math.min(parsed, max)
}

export function parseCatalogSearchQuery(
  params: Record<string, string | string[] | undefined>,
): CatalogSearchQuery {
  const rawSort = first(params.sort)
  const sort: CatalogSearchSort =
    rawSort === 'price_asc' || rawSort === 'price_desc' || rawSort === 'title_asc'
      ? rawSort
      : 'relevance'

  let minPrice = positiveNumber(first(params.min))
  let maxPrice = positiveNumber(first(params.max))
  if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
    ;[minPrice, maxPrice] = [maxPrice, minPrice]
  }

  const term = cleanText(first(params.q), 120)

  return {
    term,
    contextTerm: term,
    categorySlug: cleanText(first(params.categorie), 80)?.toLowerCase(),
    productType: parseProductComparisonGroup(cleanText(first(params.type), 80)),
    brand: cleanText(first(params.merk), 80),
    minPrice,
    maxPrice,
    inStockOnly: first(params.voorraad) === '1',
    sort,
    page: positiveInt(first(params.pagina), 1, MAX_PAGE),
    pageSize: positiveInt(first(params.perPagina), DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
  }
}

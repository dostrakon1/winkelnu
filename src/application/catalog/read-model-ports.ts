import type { CatalogSearchQuery } from './search-query'
import type { CatalogProductListItem } from './catalog-service'

export interface CatalogRankingReadModel {
  listRankedProducts(input: {
    categorySlug?: string
    limit: number
    offset: number
    now: string
  }): Promise<CatalogProductListItem[]>

  searchRankedProducts(input: {
    query: CatalogSearchQuery
    now: string
  }): Promise<{ items: CatalogProductListItem[]; hasNext: boolean }>
}

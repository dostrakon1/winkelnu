import { CatalogService, type CatalogProductListItem, type CatalogSearchResult } from './catalog-service'
import type { CatalogReadRepository } from './ports'
import type { CatalogRankingReadModel } from './read-model-ports'
import type { CatalogSearchQuery } from './search-query'

export class ScalableCatalogService extends CatalogService {
  constructor(
    repository: CatalogReadRepository,
    private readonly readModel: CatalogRankingReadModel,
    private readonly clock: () => string = () => new Date().toISOString(),
  ) {
    super(repository, clock)
  }

  override async listProducts(input?: {
    categorySlug?: string
    limit?: number
    offset?: number
  }): Promise<CatalogProductListItem[]> {
    return this.readModel.listRankedProducts({
      categorySlug: input?.categorySlug,
      limit: input?.limit ?? 24,
      offset: input?.offset ?? 0,
      now: this.clock(),
    })
  }

  override async searchProducts(query: CatalogSearchQuery): Promise<CatalogSearchResult> {
    // Producttype is currently derived from the normalized storefront comparison group.
    // Until that canonical type is persisted in the scalable read model, fail closed
    // through the base filtering path instead of silently ignoring the filter.
    if (query.productType) return super.searchProducts(query)

    const result = await this.readModel.searchRankedProducts({ query, now: this.clock() })
    return {
      query,
      products: result.items,
      page: query.page,
      pageSize: query.pageSize,
      hasPrevious: query.page > 1,
      hasNext: result.hasNext,
    }
  }
}

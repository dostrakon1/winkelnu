import { CatalogService, type CatalogProductListItem, type CatalogSearchResult } from './catalog-service'
import type { CatalogReadRepository } from './ports'
import type { CatalogRankingReadModel } from './read-model-ports'
import type { CatalogSearchQuery } from './search-query'
import { extractPreferenceConstraints } from '@/application/search/preference-constraint-extraction'
import { rankConstraintAwareCandidates } from '@/application/search/constraint-aware-candidate-ranking'

const MAX_CONTEXT_CANDIDATES = 96

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

    const contextSignals = query.contextTerm ? extractPreferenceConstraints(query.contextTerm) : []
    const useContextRanking = query.sort === 'relevance' && contextSignals.length > 0
    const offset = (query.page - 1) * query.pageSize

    if (!useContextRanking || offset >= MAX_CONTEXT_CANDIDATES) {
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

    // Re-rank a bounded pool, not merely the already paginated page. This lets a strong
    // evidence-backed candidate move into page 1 while keeping the database as the first
    // relevance gate. The read model caps this pool at 96 (+1 lookahead).
    const desiredEnd = Math.min(MAX_CONTEXT_CANDIDATES, offset + query.pageSize)
    const candidateWindow = Math.min(
      MAX_CONTEXT_CANDIDATES,
      Math.max(desiredEnd + 1, Math.min(MAX_CONTEXT_CANDIDATES, query.pageSize * 2)),
    )
    const candidateQuery: CatalogSearchQuery = {
      ...query,
      page: 1,
      pageSize: candidateWindow,
    }
    const result = await this.readModel.searchRankedProducts({ query: candidateQuery, now: this.clock() })
    const ranked = rankConstraintAwareCandidates(result.items, query.contextTerm)
    const pageItems = ranked.slice(offset, offset + query.pageSize).map((candidate) => candidate.item)

    return {
      query,
      products: pageItems,
      page: query.page,
      pageSize: query.pageSize,
      hasPrevious: query.page > 1,
      hasNext: ranked.length > offset + query.pageSize || result.hasNext,
    }
  }
}

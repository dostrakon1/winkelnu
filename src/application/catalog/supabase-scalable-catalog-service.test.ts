import { describe, expect, it } from 'vitest'
import type { CatalogProductListItem } from './catalog-service'
import type { CatalogReadRepository } from './ports'
import type { CatalogRankingReadModel } from './read-model-ports'
import type { CatalogSearchQuery } from './search-query'
import { ScalableCatalogService } from './supabase-scalable-catalog-service'

const repository: CatalogReadRepository = {
  getProductBySlug: async () => null,
  listProducts: async () => [],
  listCategories: async () => [],
  listActiveMerchants: async () => [],
  listImportRuns: async () => [],
  listImportRejects: async () => [],
  listPendingMatchReviews: async () => [],
}

function product(index: number, memory?: string): CatalogProductListItem {
  return {
    product: {
      id: `laptop-${index}`,
      slug: `laptop-${index}`,
      title: `Laptop ${index}`,
      specifications: memory ? [{ label: 'RAM', value: memory }] : undefined,
    },
    offerCount: 0,
  }
}

function query(overrides: Partial<CatalogSearchQuery> = {}): CatalogSearchQuery {
  return {
    term: 'laptop',
    contextTerm: 'laptop met minimaal 16 GB RAM',
    inStockOnly: false,
    sort: 'relevance',
    page: 1,
    pageSize: 24,
    ...overrides,
  }
}

describe('ScalableCatalogService constraint-aware ranking', () => {
  it('reranks a bounded database candidate window before page 1 is sliced', async () => {
    const candidates = Array.from({ length: 60 }, (_, index) => product(index))
    candidates[0] = product(0, '8 GB')
    candidates[30] = product(30, '16 GB')
    const calls: CatalogSearchQuery[] = []

    const readModel: CatalogRankingReadModel = {
      listRankedProducts: async () => [],
      searchRankedProducts: async ({ query: readQuery }) => {
        calls.push(readQuery)
        const offset = (readQuery.page - 1) * readQuery.pageSize
        const items = candidates.slice(offset, offset + readQuery.pageSize)
        return { items, hasNext: candidates.length > offset + readQuery.pageSize }
      },
    }

    const service = new ScalableCatalogService(repository, readModel, () => '2026-09-12T00:00:00.000Z')
    const result = await service.searchProducts(query())

    expect(calls).toHaveLength(1)
    expect(calls[0].page).toBe(1)
    expect(calls[0].pageSize).toBe(48)
    expect(result.products[0].product.id).toBe('laptop-30')
    expect(result.products).toHaveLength(24)
    expect(result.hasNext).toBe(true)
  })

  it('keeps normal database pagination when there is no recognized context signal', async () => {
    const calls: CatalogSearchQuery[] = []
    const readModel: CatalogRankingReadModel = {
      listRankedProducts: async () => [],
      searchRankedProducts: async ({ query: readQuery }) => {
        calls.push(readQuery)
        return { items: [product(0), product(1)], hasNext: false }
      },
    }

    const service = new ScalableCatalogService(repository, readModel)
    const result = await service.searchProducts(query({ contextTerm: 'laptop' }))

    expect(calls).toHaveLength(1)
    expect(calls[0].pageSize).toBe(24)
    expect(result.products.map((item) => item.product.id)).toEqual(['laptop-0', 'laptop-1'])
  })

  it('does not let context silently override an explicit non-relevance sort', async () => {
    const calls: CatalogSearchQuery[] = []
    const readModel: CatalogRankingReadModel = {
      listRankedProducts: async () => [],
      searchRankedProducts: async ({ query: readQuery }) => {
        calls.push(readQuery)
        return { items: [product(0, '8 GB'), product(1, '16 GB')], hasNext: false }
      },
    }

    const service = new ScalableCatalogService(repository, readModel)
    const result = await service.searchProducts(query({ sort: 'title_asc' }))

    expect(calls[0].sort).toBe('title_asc')
    expect(result.products.map((item) => item.product.id)).toEqual(['laptop-0', 'laptop-1'])
  })
})

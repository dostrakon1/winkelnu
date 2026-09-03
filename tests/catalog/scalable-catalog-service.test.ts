import { describe, expect, it } from 'vitest'
import type { CatalogProductListItem } from '@/application/catalog/catalog-service'
import type { CatalogReadRepository } from '@/application/catalog/ports'
import type { CatalogRankingReadModel } from '@/application/catalog/read-model-ports'
import type { CatalogSearchQuery } from '@/application/catalog/search-query'
import { ScalableCatalogService } from '@/application/catalog/supabase-scalable-catalog-service'

const item: CatalogProductListItem = {
  product: { id: 'product:1', slug: 'product-1', title: 'Product 1' },
  bestOffer: {
    offer: {
      id: 'offer:1', productId: 'product:1', merchantId: 'merchant:1', merchantProductId: 'SKU-1',
      price: { amount: '9.00', currency: 'EUR' }, productUrl: 'https://shop.example/p', affiliateUrl: 'https://shop.example/a',
      importedAt: '2026-09-03T08:00:00.000Z', lastSeenAt: '2026-09-03T08:00:00.000Z', isActive: true,
    },
    merchant: { id: 'merchant:1', slug: 'shop', name: 'Shop', websiteUrl: 'https://shop.example', isActive: true },
    totalAmount: '9.00',
    freshness: 'fresh',
  },
  offerCount: 2,
}

function repository(): CatalogReadRepository {
  return {
    async getProductBySlug() { throw new Error('N+1 detail lookup must not be used') },
    async listProducts() { throw new Error('legacy product listing must not be used') },
    async listCategories() { return [{ id: 'category:1', slug: 'test', name: 'Test' }] },
    async listActiveMerchants() { return [] },
    async listImportRuns() { return [] },
    async listImportRejects() { return [] },
    async listPendingMatchReviews() { return [] },
  }
}

class FakeReadModel implements CatalogRankingReadModel {
  listCalls = 0
  searchCalls = 0

  async listRankedProducts(): Promise<CatalogProductListItem[]> {
    this.listCalls += 1
    return [item]
  }

  async searchRankedProducts(input: { query: CatalogSearchQuery; now: string }): Promise<{ items: CatalogProductListItem[]; hasNext: boolean }> {
    this.searchCalls += 1
    expect(input.query.pageSize).toBe(24)
    return { items: [item], hasNext: true }
  }
}

describe('ScalableCatalogService', () => {
  it('uses one ranked read-model call for product listings', async () => {
    const readModel = new FakeReadModel()
    const service = new ScalableCatalogService(repository(), readModel, () => '2026-09-03T09:00:00.000Z')
    const result = await service.listProducts({ categorySlug: 'test', limit: 24 })
    expect(result).toEqual([item])
    expect(readModel.listCalls).toBe(1)
  })

  it('pushes search pagination and filtering into the read model', async () => {
    const readModel = new FakeReadModel()
    const service = new ScalableCatalogService(repository(), readModel, () => '2026-09-03T09:00:00.000Z')
    const query: CatalogSearchQuery = { term: 'product', brand: 'Brand', minPrice: 5, maxPrice: 20, inStockOnly: true, sort: 'price_asc', page: 2, pageSize: 24 }
    const result = await service.searchProducts(query)
    expect(result.products).toEqual([item])
    expect(result.hasPrevious).toBe(true)
    expect(result.hasNext).toBe(true)
    expect(readModel.searchCalls).toBe(1)
  })
})

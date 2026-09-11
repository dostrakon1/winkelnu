import { describe, expect, it } from 'vitest'
import { CatalogService } from '@/application/catalog/catalog-service'
import type { CatalogReadRepository, ProductWithOffers } from '@/application/catalog/ports'
import type { Merchant, Product } from '@/domain/catalog/types'

const merchant: Merchant = {
  id: 'merchant:test',
  slug: 'test',
  name: 'Testwinkel',
  websiteUrl: 'https://example.invalid',
  isActive: true,
}

const products: Product[] = [
  { id: 'product:1', slug: 'alpha-headphone', title: 'Alpha Headphone', brand: 'SoundCo', description: 'Draadloos model' },
  { id: 'product:2', slug: 'beta-speaker', title: 'Beta Speaker', brand: 'SoundCo', description: 'Compact audio product' },
  { id: 'product:3', slug: 'gamma-bottle', title: 'Gamma Bottle', brand: 'OutdoorCo', description: 'Drinkfles' },
]

const details = new Map<string, ProductWithOffers>([
  ['alpha-headphone', {
    product: products[0],
    offers: [{
      id: 'offer:1', productId: 'product:1', merchantId: merchant.id, merchantProductId: '1',
      price: { amount: '100.00', currency: 'EUR' }, shippingCost: { amount: '5.00', currency: 'EUR' },
      availability: 'in_stock', productUrl: 'https://example.invalid/1', affiliateUrl: 'https://example.invalid/a1',
      importedAt: '2026-09-03T00:00:00.000Z', lastSeenAt: '2026-09-03T00:00:00.000Z', isActive: true,
    }],
  }],
  ['beta-speaker', {
    product: products[1],
    offers: [{
      id: 'offer:2', productId: 'product:2', merchantId: merchant.id, merchantProductId: '2',
      price: { amount: '70.00', currency: 'EUR' }, shippingCost: { amount: '0.00', currency: 'EUR' },
      availability: 'in_stock', productUrl: 'https://example.invalid/2', affiliateUrl: 'https://example.invalid/a2',
      importedAt: '2026-09-03T00:00:00.000Z', lastSeenAt: '2026-09-03T00:00:00.000Z', isActive: true,
    }],
  }],
  ['gamma-bottle', {
    product: products[2],
    offers: [{
      id: 'offer:3', productId: 'product:3', merchantId: merchant.id, merchantProductId: '3',
      price: { amount: '20.00', currency: 'EUR' }, shippingCost: { amount: '3.95', currency: 'EUR' },
      availability: 'in_stock', productUrl: 'https://example.invalid/3', affiliateUrl: 'https://example.invalid/a3',
      importedAt: '2026-09-03T00:00:00.000Z', lastSeenAt: '2026-09-03T00:00:00.000Z', isActive: true,
    }],
  }],
])

function repository(): CatalogReadRepository {
  return {
    async getProductBySlug(slug) { return details.get(slug) ?? null },
    async listProducts() { return products },
    async listCategories() { return [] },
    async listActiveMerchants() { return [merchant] },
    async listImportRuns() { return [] },
    async listImportRejects() { return [] },
    async listPendingMatchReviews() { return [] },
  }
}

describe('CatalogService searchProducts', () => {
  it('filters on term, brand, total price and stock status', async () => {
    const service = new CatalogService(repository(), () => '2026-09-03T01:00:00.000Z')
    const result = await service.searchProducts({
      term: 'headphone',
      brand: 'SoundCo',
      minPrice: 100,
      maxPrice: 110,
      inStockOnly: true,
      sort: 'relevance',
      page: 1,
      pageSize: 24,
    })

    expect(result.products.map((item) => item.product.slug)).toEqual(['alpha-headphone'])
  })

  it('sorts on total price instead of product price only', async () => {
    const service = new CatalogService(repository(), () => '2026-09-03T01:00:00.000Z')
    const result = await service.searchProducts({
      inStockOnly: false,
      sort: 'price_asc',
      page: 1,
      pageSize: 24,
    })

    expect(result.products.map((item) => item.product.slug)).toEqual([
      'gamma-bottle',
      'beta-speaker',
      'alpha-headphone',
    ])
  })
})

import { describe, expect, it } from 'vitest'
import { CatalogService } from '@/application/catalog/catalog-service'
import type { CatalogReadRepository, ProductWithOffers } from '@/application/catalog/ports'
import type { Category, Merchant, Product } from '@/domain/catalog/types'

const product: Product = {
  id: 'product:test',
  slug: 'test-product',
  title: 'Testproduct',
  brand: 'Winkelnu Test',
}

const merchants: Merchant[] = [
  { id: 'merchant:a', slug: 'a', name: 'Winkel A', websiteUrl: 'https://a.invalid', isActive: true },
  { id: 'merchant:b', slug: 'b', name: 'Winkel B', websiteUrl: 'https://b.invalid', isActive: true },
]

const detail: ProductWithOffers = {
  product,
  offers: [
    {
      id: 'offer:a',
      productId: product.id,
      merchantId: 'merchant:a',
      merchantProductId: 'A-1',
      price: { amount: '10.00', currency: 'EUR' },
      shippingCost: { amount: '5.00', currency: 'EUR' },
      productUrl: 'https://a.invalid/p',
      affiliateUrl: 'https://a.invalid/a',
      importedAt: '2026-09-03T00:00:00.000Z',
      lastSeenAt: '2026-09-03T00:00:00.000Z',
      isActive: true,
    },
    {
      id: 'offer:b',
      productId: product.id,
      merchantId: 'merchant:b',
      merchantProductId: 'B-1',
      price: { amount: '12.00', currency: 'EUR' },
      shippingCost: { amount: '0.00', currency: 'EUR' },
      productUrl: 'https://b.invalid/p',
      affiliateUrl: 'https://b.invalid/a',
      importedAt: '2026-09-03T00:00:00.000Z',
      lastSeenAt: '2026-09-03T00:00:00.000Z',
      isActive: true,
    },
  ],
}

function repository(): CatalogReadRepository {
  return {
    async getProductBySlug(slug) {
      return slug === product.slug ? detail : null
    },
    async listProducts() {
      return [product]
    },
    async listCategories() {
      return [{ id: 'category:test', slug: 'test', name: 'Test' } satisfies Category]
    },
    async listActiveMerchants() {
      return merchants
    },
    async listImportRuns() {
      return []
    },
    async listImportRejects() {
      return []
    },
    async listPendingMatchReviews() {
      return []
    },
  }
}

describe('CatalogService', () => {
  it('ranks offers on purchase total including shipping', async () => {
    const service = new CatalogService(repository())
    const result = await service.getProduct(product.slug)

    expect(result?.offers.map((item) => item.merchant?.name)).toEqual(['Winkel B', 'Winkel A'])
    expect(result?.offers.map((item) => item.totalAmount)).toEqual(['12.00', '15.00'])
  })

  it('uses the cheapest landed offer as the listing offer', async () => {
    const service = new CatalogService(repository())
    const [item] = await service.listProducts()

    expect(item.bestOffer?.merchant?.id).toBe('merchant:b')
    expect(item.bestOffer?.totalAmount).toBe('12.00')
    expect(item.offerCount).toBe(2)
  })

  it('returns null for an unknown product', async () => {
    const service = new CatalogService(repository())
    await expect(service.getProduct('missing')).resolves.toBeNull()
  })
})

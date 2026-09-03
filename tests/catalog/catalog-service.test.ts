import { describe, expect, it } from 'vitest'
import { CatalogService } from '@/application/catalog/catalog-service'
import type { CatalogReadRepository, ProductWithOffers } from '@/application/catalog/ports'
import type { Category, Merchant, Product } from '@/domain/catalog/types'

const category: Category = { id: 'category:test', slug: 'test', name: 'Test' }

const product: Product = {
  id: 'product:test',
  slug: 'test-product',
  title: 'Testproduct',
  brand: 'Winkelnu Test',
  categoryId: category.id,
}

const secondProduct: Product = {
  id: 'product:second',
  slug: 'second-product',
  title: 'Tweede product',
  brand: 'Winkelnu Test',
  categoryId: category.id,
}

const merchants: Merchant[] = [
  { id: 'merchant:a', slug: 'a', name: 'Winkel A', websiteUrl: 'https://a.invalid', isActive: true },
  { id: 'merchant:b', slug: 'b', name: 'Winkel B', websiteUrl: 'https://b.invalid', isActive: true },
]

const details = new Map<string, ProductWithOffers>([
  [product.slug, {
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
  }],
  [secondProduct.slug, {
    product: secondProduct,
    offers: [
      {
        id: 'offer:second',
        productId: secondProduct.id,
        merchantId: 'merchant:a',
        merchantProductId: 'A-2',
        price: { amount: '9.00', currency: 'EUR' },
        shippingCost: { amount: '0.00', currency: 'EUR' },
        productUrl: 'https://a.invalid/second',
        affiliateUrl: 'https://a.invalid/second-affiliate',
        importedAt: '2026-09-03T00:00:00.000Z',
        lastSeenAt: '2026-09-03T00:00:00.000Z',
        isActive: true,
      },
    ],
  }],
])

function repository(): CatalogReadRepository {
  return {
    async getProductBySlug(slug) {
      return details.get(slug) ?? null
    },
    async listProducts(input) {
      const all = [product, secondProduct]
      const filtered = input?.categorySlug === category.slug || !input?.categorySlug ? all : []
      const offset = input?.offset ?? 0
      const limit = input?.limit ?? filtered.length
      return filtered.slice(offset, offset + limit)
    },
    async listCategories() {
      return [category]
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
    const items = await service.listProducts({ limit: 1 })

    expect(items[0]?.bestOffer?.merchant?.id).toBe('merchant:b')
    expect(items[0]?.bestOffer?.totalAmount).toBe('12.00')
    expect(items[0]?.offerCount).toBe(2)
  })

  it('returns null for an unknown product', async () => {
    const service = new CatalogService(repository())
    await expect(service.getProduct('missing')).resolves.toBeNull()
  })

  it('returns null for an unknown category', async () => {
    const service = new CatalogService(repository())
    await expect(service.getCategoryDiscovery({ categorySlug: 'missing' })).resolves.toBeNull()
  })

  it('paginates category discovery with lookahead and ranks visible items by total price', async () => {
    const service = new CatalogService(repository())
    const firstPage = await service.getCategoryDiscovery({ categorySlug: category.slug, page: 1, pageSize: 1 })
    const secondPage = await service.getCategoryDiscovery({ categorySlug: category.slug, page: 2, pageSize: 1 })

    expect(firstPage?.hasPreviousPage).toBe(false)
    expect(firstPage?.hasNextPage).toBe(true)
    expect(firstPage?.items).toHaveLength(1)
    expect(secondPage?.hasPreviousPage).toBe(true)
    expect(secondPage?.hasNextPage).toBe(false)
    expect(secondPage?.items[0]?.bestOffer?.totalAmount).toBe('9.00')
  })
})

import { describe, expect, it } from 'vitest'
import { CatalogService } from '@/application/catalog/catalog-service'
import { classifyOfferFreshness } from '@/domain/catalog/offer-freshness'
import type { CatalogReadRepository, ProductWithOffers } from '@/application/catalog/ports'
import type { Merchant, Offer, Product } from '@/domain/catalog/types'

const product: Product = { id: 'product:freshness', slug: 'freshness', title: 'Freshness product' }
const merchant: Merchant = { id: 'merchant:freshness', slug: 'freshness', name: 'Freshness Shop', websiteUrl: 'https://fresh.example', isActive: true }

function offer(lastSeenAt: string): Offer {
  return {
    id: `offer:${lastSeenAt}`,
    productId: product.id,
    merchantId: merchant.id,
    merchantProductId: lastSeenAt,
    price: { amount: '10.00', currency: 'EUR' },
    productUrl: 'https://fresh.example/product',
    affiliateUrl: 'https://fresh.example/click',
    importedAt: lastSeenAt,
    lastSeenAt,
    isActive: true,
  }
}

function repository(offers: Offer[]): CatalogReadRepository {
  const detail: ProductWithOffers = { product, offers }
  return {
    async getProductBySlug() { return detail },
    async listProducts() { return [product] },
    async listCategories() { return [] },
    async listActiveMerchants() { return [merchant] },
    async listImportRuns() { return [] },
    async listImportRejects() { return [] },
    async listPendingMatchReviews() { return [] },
  }
}

describe('offer freshness', () => {
  const now = '2026-09-03T12:00:00.000Z'

  it('classifies fresh, stale and expired verification ages', () => {
    expect(classifyOfferFreshness(offer('2026-09-03T00:00:00.000Z'), now)).toBe('fresh')
    expect(classifyOfferFreshness(offer('2026-09-02T00:00:00.000Z'), now)).toBe('stale')
    expect(classifyOfferFreshness(offer('2026-08-30T00:00:00.000Z'), now)).toBe('expired')
  })

  it('keeps stale offers visible but suppresses expired offers', async () => {
    const service = new CatalogService(repository([
      offer('2026-09-02T00:00:00.000Z'),
      offer('2026-08-30T00:00:00.000Z'),
    ]), () => now)

    const detail = await service.getProduct(product.slug)
    expect(detail?.offers).toHaveLength(1)
    expect(detail?.offers[0]?.freshness).toBe('stale')
  })
})

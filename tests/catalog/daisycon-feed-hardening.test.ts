import { describe, expect, it } from 'vitest'
import { CatalogService } from '@/application/catalog/catalog-service'
import type { CatalogReadRepository, ProductWithOffers } from '@/application/catalog/ports'
import { classifyOfferAvailability } from '@/domain/catalog/offer-availability'
import { decideStrongProductIdentity } from '@/domain/catalog/matching'
import type { Merchant, Offer, Product } from '@/domain/catalog/types'
import { validateFeedCandidate } from '@/domain/catalog/validate-feed-candidate'
import { mapDaisyconStandardProductRecord } from '@/infrastructure/feeds/daisycon/register-daisycon-adapter'

const product: Product = { id: 'product:test', slug: 'test-product', title: 'Test product' }
const merchant: Merchant = {
  id: 'merchant:test',
  slug: 'test',
  name: 'Test shop',
  websiteUrl: 'https://shop.example',
  isActive: true,
}

function offer(overrides: Partial<Offer> = {}): Offer {
  return {
    id: 'offer:test',
    productId: product.id,
    merchantId: merchant.id,
    merchantProductId: 'SKU-1',
    price: { amount: '10.00', currency: 'EUR' },
    availability: 'in_stock',
    productUrl: 'https://shop.example/product',
    affiliateUrl: 'https://track.example/click',
    importedAt: '2026-09-11T08:00:00.000Z',
    lastSeenAt: '2026-09-11T08:00:00.000Z',
    isActive: true,
    ...overrides,
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

describe('Daisycon feed hardening', () => {
  it('normalizes ordinary euro amounts without inventing a missing shipping cost', () => {
    const mapped = mapDaisyconStandardProductRecord({
      id: 1,
      name: 'Product',
      price: 10,
      shipping: '2,5',
      product_url: 'https://shop.example/product',
      deeplink: 'https://track.example/click',
    }, { sourceKey: 'daisycon:test', importedAt: '2026-09-11T08:00:00.000Z' })

    expect(mapped.price.amount).toBe('10.00')
    expect(mapped.shippingCost?.amount).toBe('2.50')

    const withoutShipping = mapDaisyconStandardProductRecord({
      id: 2,
      name: 'Product without shipping',
      price: '12.95',
      product_url: 'https://shop.example/product-2',
      deeplink: 'https://track.example/click-2',
    }, { sourceKey: 'daisycon:test', importedAt: '2026-09-11T08:00:00.000Z' })

    expect(withoutShipping.shippingCost).toBeUndefined()
  })

  it('rejects malformed shipping money and impossible GTIN lengths while allowing a missing GTIN', () => {
    const base = mapDaisyconStandardProductRecord({
      id: 1,
      name: 'Product',
      price: '10.00',
      product_url: 'https://shop.example/product',
      deeplink: 'https://track.example/click',
    }, { sourceKey: 'daisycon:test', importedAt: '2026-09-11T08:00:00.000Z' })

    expect(validateFeedCandidate(base).ok).toBe(true)
    expect(validateFeedCandidate({
      ...base,
      shippingCost: { amount: 'gratis', currency: 'EUR' },
      gtin: '123456789',
    })).toMatchObject({
      ok: false,
      issues: expect.arrayContaining([
        expect.objectContaining({ field: 'shippingCost.amount', code: 'invalid_money' }),
        expect.objectContaining({ field: 'gtin', code: 'invalid_gtin' }),
      ]),
    })
  })

  it('keeps missing strong identifiers reviewable instead of pretending two products are identical', () => {
    const decision = decideStrongProductIdentity({
      sourceKey: 'daisycon:test',
      merchantProductId: 'SKU-weak',
      decidedAt: '2026-09-11T08:00:00.000Z',
    })

    expect(decision.method).toBe('source_identity')
    expect(decision.requiresReview).toBe(true)
  })

  it('classifies explicit stock signals conservatively', () => {
    expect(classifyOfferAvailability('in stock')).toBe('available')
    expect(classifyOfferAvailability('out-of-stock')).toBe('unavailable')
    expect(classifyOfferAvailability('provider-specific-state')).toBe('unknown')
    expect(classifyOfferAvailability(undefined)).toBe('unknown')
  })

  it('suppresses known unavailable offers and never promotes unknown shipping as free shipping', async () => {
    const service = new CatalogService(repository([
      offer({
        id: 'offer:unknown-shipping',
        merchantProductId: 'SKU-unknown-shipping',
        price: { amount: '5.00', currency: 'EUR' },
        shippingCost: undefined,
        availability: 'unknown',
      }),
      offer({
        id: 'offer:known-shipping',
        merchantProductId: 'SKU-known-shipping',
        price: { amount: '8.00', currency: 'EUR' },
        shippingCost: { amount: '2.00', currency: 'EUR' },
        availability: 'in_stock',
      }),
      offer({
        id: 'offer:unavailable',
        merchantProductId: 'SKU-unavailable',
        price: { amount: '1.00', currency: 'EUR' },
        shippingCost: { amount: '0.00', currency: 'EUR' },
        availability: 'out_of_stock',
      }),
    ]), () => '2026-09-11T09:00:00.000Z')

    const detail = await service.getProduct(product.slug)

    expect(detail?.offers.map(({ offer: ranked }) => ranked.id)).toEqual([
      'offer:known-shipping',
      'offer:unknown-shipping',
    ])
    expect(detail?.offers[0]?.totalAmount).toBe('10.00')
    expect(detail?.offers[1]?.totalAmount).toBe('5.00')
  })
})

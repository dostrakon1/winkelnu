import { describe, expect, it } from 'vitest'
import { decideStrongProductIdentity } from '@/domain/catalog/matching'

describe('decideStrongProductIdentity', () => {
  it('uses GTIN as a certain cross-merchant identity', () => {
    const decision = decideStrongProductIdentity({
      sourceKey: 'demo',
      merchantProductId: 'SKU-1',
      gtin: '8712345678901',
      decidedAt: '2026-09-03T04:00:00.000Z',
    })

    expect(decision).toMatchObject({
      canonicalProductId: 'product:8712345678901',
      method: 'gtin_exact',
      confidence: 'certain',
      requiresReview: false,
    })
  })

  it('uses brand plus MPN when GTIN is unavailable', () => {
    const decision = decideStrongProductIdentity({
      sourceKey: 'demo',
      merchantProductId: 'SKU-2',
      brand: 'Acme Audio',
      mpn: 'PRO 45/BLACK',
      decidedAt: '2026-09-03T04:00:00.000Z',
    })

    expect(decision).toMatchObject({
      canonicalProductId: 'product:mpn:acme-audio:pro-45-black',
      method: 'mpn_brand_exact',
      confidence: 'high',
      requiresReview: false,
    })
  })

  it('preserves source identity and requires review without strong identifiers', () => {
    const decision = decideStrongProductIdentity({
      sourceKey: 'merchant-a',
      merchantProductId: 'SKU-3',
      decidedAt: '2026-09-03T04:00:00.000Z',
    })

    expect(decision).toMatchObject({
      canonicalProductId: 'product:source:merchant-a:SKU-3',
      method: 'source_identity',
      confidence: 'review',
      requiresReview: true,
    })
  })
})

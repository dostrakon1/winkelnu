export type ProductMatchMethod = 'gtin_exact' | 'mpn_brand_exact' | 'source_identity' | 'manual' | 'unmatched'

export type ProductMatchConfidence = 'certain' | 'high' | 'review' | 'none'

export type ProductMatchDecision = {
  merchantProductId: string
  canonicalProductId?: string
  method: ProductMatchMethod
  confidence: ProductMatchConfidence
  reasons: string[]
  decidedAt: string
  requiresReview: boolean
}

export function decideStrongProductIdentity(input: {
  sourceKey: string
  merchantProductId: string
  gtin?: string
  mpn?: string
  brand?: string
  decidedAt: string
}): ProductMatchDecision {
  if (input.gtin) {
    return {
      merchantProductId: input.merchantProductId,
      canonicalProductId: `product:${input.gtin}`,
      method: 'gtin_exact',
      confidence: 'certain',
      reasons: ['A valid strong GTIN identifier was supplied by the source.'],
      decidedAt: input.decidedAt,
      requiresReview: false,
    }
  }

  if (input.mpn && input.brand) {
    const normalisedBrand = input.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const normalisedMpn = input.mpn.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return {
      merchantProductId: input.merchantProductId,
      canonicalProductId: `product:mpn:${normalisedBrand}:${normalisedMpn}`,
      method: 'mpn_brand_exact',
      confidence: 'high',
      reasons: ['Brand and manufacturer part number were both supplied.'],
      decidedAt: input.decidedAt,
      requiresReview: false,
    }
  }

  return {
    merchantProductId: input.merchantProductId,
    canonicalProductId: `product:source:${input.sourceKey}:${input.merchantProductId}`,
    method: 'source_identity',
    confidence: 'review',
    reasons: ['No sufficiently strong cross-merchant identifier was available; source identity is preserved.'],
    decidedAt: input.decidedAt,
    requiresReview: true,
  }
}

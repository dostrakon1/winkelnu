import type { Money } from './types'

export type FeedCandidate = {
  sourceKey: string
  merchantProductId: string
  title: string
  description?: string
  brand?: string
  gtin?: string
  mpn?: string
  merchantSku?: string
  sourceCategory?: string
  imageUrls: string[]
  price: Money
  previousPrice?: Money
  shippingCost?: Money
  availability?: string
  productUrl: string
  affiliateUrl: string
  sourceUpdatedAt?: string
  importedAt: string
}

export type FeedValidationIssue = {
  field: string
  code: string
  message: string
}

export type FeedValidationResult =
  | { ok: true; candidate: FeedCandidate }
  | { ok: false; issues: FeedValidationIssue[] }

import type { FeedCandidate, FeedValidationResult } from './feed'

const MONEY_PATTERN = /^\d+(\.\d{2})$/
const GTIN_PATTERN = /^(?:\d{8}|\d{12}|\d{13}|\d{14})$/

export function validateFeedCandidate(candidate: FeedCandidate): FeedValidationResult {
  const issues: { field: string; code: string; message: string }[] = []

  if (!candidate.merchantProductId.trim()) {
    issues.push({ field: 'merchantProductId', code: 'required', message: 'Merchant product id is required.' })
  }

  if (!candidate.title.trim()) {
    issues.push({ field: 'title', code: 'required', message: 'Title is required.' })
  }

  if (!MONEY_PATTERN.test(candidate.price.amount)) {
    issues.push({ field: 'price.amount', code: 'invalid_money', message: 'Price must use a decimal string with two digits.' })
  }

  if (candidate.shippingCost && !MONEY_PATTERN.test(candidate.shippingCost.amount)) {
    issues.push({ field: 'shippingCost.amount', code: 'invalid_money', message: 'Shipping cost must use a decimal string with two digits when supplied.' })
  }

  if (!candidate.affiliateUrl.startsWith('https://')) {
    issues.push({ field: 'affiliateUrl', code: 'invalid_url', message: 'Affiliate URL must use HTTPS.' })
  }

  if (candidate.gtin && !GTIN_PATTERN.test(candidate.gtin)) {
    issues.push({ field: 'gtin', code: 'invalid_gtin', message: 'GTIN must contain 8, 12, 13 or 14 digits.' })
  }

  return issues.length === 0 ? { ok: true, candidate } : { ok: false, issues }
}

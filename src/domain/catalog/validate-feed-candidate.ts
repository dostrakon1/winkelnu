import type { FeedCandidate, FeedValidationResult } from './feed'

export function validateFeedCandidate(candidate: FeedCandidate): FeedValidationResult {
  const issues: { field: string; code: string; message: string }[] = []

  if (!candidate.merchantProductId.trim()) {
    issues.push({ field: 'merchantProductId', code: 'required', message: 'Merchant product id is required.' })
  }

  if (!candidate.title.trim()) {
    issues.push({ field: 'title', code: 'required', message: 'Title is required.' })
  }

  if (!/^\d+(\.\d{2})$/.test(candidate.price.amount)) {
    issues.push({ field: 'price.amount', code: 'invalid_money', message: 'Price must use a decimal string with two digits.' })
  }

  if (!candidate.affiliateUrl.startsWith('https://')) {
    issues.push({ field: 'affiliateUrl', code: 'invalid_url', message: 'Affiliate URL must use HTTPS.' })
  }

  if (candidate.gtin && !/^\d{8,14}$/.test(candidate.gtin)) {
    issues.push({ field: 'gtin', code: 'invalid_gtin', message: 'GTIN must contain 8 to 14 digits.' })
  }

  return issues.length === 0 ? { ok: true, candidate } : { ok: false, issues }
}

import type { Offer } from './types'

export type OfferFreshnessStatus = 'fresh' | 'stale' | 'expired'

export type OfferFreshnessPolicy = {
  staleAfterMs: number
  expireAfterMs: number
}

export const DEFAULT_OFFER_FRESHNESS_POLICY: OfferFreshnessPolicy = {
  staleAfterMs: 24 * 60 * 60_000,
  expireAfterMs: 72 * 60 * 60_000,
}

export function classifyOfferFreshness(
  offer: Offer,
  now: string,
  policy: OfferFreshnessPolicy = DEFAULT_OFFER_FRESHNESS_POLICY,
): OfferFreshnessStatus {
  const verifiedAt = Date.parse(offer.lastSeenAt || offer.importedAt)
  const current = Date.parse(now)
  if (!Number.isFinite(verifiedAt) || !Number.isFinite(current)) return 'expired'
  const age = Math.max(0, current - verifiedAt)
  if (age > policy.expireAfterMs) return 'expired'
  if (age > policy.staleAfterMs) return 'stale'
  return 'fresh'
}

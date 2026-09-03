import type { AffiliateAttributionRepository } from './ports'
import type { AffiliateClickEvent } from '@/domain/affiliate/types'

export type AffiliateRedirectDecision =
  | { ok: true; destination: string; event: AffiliateClickEvent }
  | { ok: false; reason: 'offer_not_found' | 'offer_inactive' | 'invalid_destination' }

function safeSourcePath(value?: string): string | undefined {
  if (!value) return undefined
  if (!value.startsWith('/') || value.startsWith('//')) return undefined
  return value.slice(0, 500)
}

export function validateAffiliateDestination(value: string): boolean {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return false
    if (url.username || url.password) return false
    if (!url.hostname || url.hostname === 'localhost') return false
    if (/^(127\.0\.0\.1|0\.0\.0\.0|::1)$/.test(url.hostname)) return false
    return true
  } catch {
    return false
  }
}

export class AffiliateRedirectService {
  constructor(
    private readonly repository: AffiliateAttributionRepository,
    private readonly now: () => string = () => new Date().toISOString(),
    private readonly id: () => string = () => crypto.randomUUID(),
  ) {}

  async resolve(input: { offerId: string; sourcePath?: string }): Promise<AffiliateRedirectDecision> {
    const target = await this.repository.getRedirectTarget(input.offerId)
    if (!target) return { ok: false, reason: 'offer_not_found' }
    if (!target.isActive) return { ok: false, reason: 'offer_inactive' }
    if (!validateAffiliateDestination(target.affiliateUrl)) {
      return { ok: false, reason: 'invalid_destination' }
    }

    const event: AffiliateClickEvent = {
      id: `click:${this.id()}`,
      offerId: target.offerId,
      productId: target.productId,
      merchantId: target.merchantId,
      sourcePath: safeSourcePath(input.sourcePath),
      occurredAt: this.now(),
    }

    await this.repository.recordClick(event)

    return { ok: true, destination: target.affiliateUrl, event }
  }
}

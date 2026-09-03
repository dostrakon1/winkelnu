import type { AffiliateClickEvent, AffiliateRedirectTarget } from '@/domain/affiliate/types'

export interface AffiliateAttributionRepository {
  getRedirectTarget(offerId: string): Promise<AffiliateRedirectTarget | null>
  recordClick(event: AffiliateClickEvent): Promise<void>
}

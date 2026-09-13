import 'server-only'

import type { GiftingInsightsRange } from '@/application/gifting/gifting-insights'

export type GiftingHealthOverview = {
  activeGroupsNearingExpiry: number
  staleActiveGroups: number
  staleStandaloneLists: number
  orphanedGroupLists: number
  expiryMismatches: number
  drawnAssignmentMismatches: number
  groupsOverParticipantLimit: number
  rateLimitRejections: number
  rawEventRetentionViolations: number
  productMetricRetentionViolations: number
}

export type GiftingRateLimitRejection = {
  action: string
  rejectionCount: number
}

export type GiftingCleanupStatus = {
  configured: boolean
  active: boolean
  schedule?: string
  lastStartedAt?: string
  lastFinishedAt?: string
  lastStatus?: string
  lastSuccessAt?: string
}

export type GiftingHealthSnapshot = {
  generatedAt: string
  overview: GiftingHealthOverview
  rateLimitRejections: GiftingRateLimitRejection[]
  cleanup: GiftingCleanupStatus
}

export interface GiftingHealthInsightsRepository {
  readOverview(range: GiftingInsightsRange): Promise<GiftingHealthOverview>
  readRateLimitRejections(range: GiftingInsightsRange): Promise<GiftingRateLimitRejection[]>
  readCleanupStatus(): Promise<GiftingCleanupStatus>
}

export class GiftingHealthInsightsReadService {
  constructor(private readonly repository: GiftingHealthInsightsRepository) {}

  async read(range: GiftingInsightsRange): Promise<GiftingHealthSnapshot> {
    const [overview, rateLimitRejections, cleanup] = await Promise.all([
      this.repository.readOverview(range),
      this.repository.readRateLimitRejections(range),
      this.repository.readCleanupStatus(),
    ])

    return {
      generatedAt: new Date().toISOString(),
      overview,
      rateLimitRejections,
      cleanup,
    }
  }
}

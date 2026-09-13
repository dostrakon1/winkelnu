import 'server-only'

export type GiftingInsightsRange = {
  from: string
  to: string
  fromDate: string
  toDate: string
}

export type GiftingOverviewMetrics = {
  groupsCreated: number
  activeGroupsNow: number
  groupsDrawnCohort: number
  groupsWithThreePlusParticipants: number
  participantsJoined: number
  averageParticipantsPerGroup: number
  standaloneListsCreated: number
  giftItemsPresentFromPeriod: number
  winkelnuProductsPresentFromPeriod: number
  activeReservationsNow: number
  averageGroupBudgetCents: number
  groupsWithEventDate: number
  redrawGroupsCohort: number
}

export type GiftingDailyActivity = {
  date: string
  groupsCreated: number
  participantsJoined: number
  standaloneListsCreated: number
  giftItemsPresent: number
  winkelnuProductsPresent: number
}

export type GiftingRecentGroup = {
  internalRef: string
  createdAt: string
  occasion: 'sinterklaas' | 'kerst' | 'verjaardag' | 'anders'
  status: 'draft' | 'drawn' | 'closed'
  participantCount: number
  wishCount: number
  budgetBucket: string
  hasEventDate: boolean
  drawVersion: number
  expiresAt: string
  healthStatus: 'ok' | 'stale' | 'draw_mismatch'
}

export type GiftingInsightsSnapshot = {
  generatedAt: string
  overview: GiftingOverviewMetrics
  dailyActivity: GiftingDailyActivity[]
  recentGroups: GiftingRecentGroup[]
}

export interface GiftingInsightsRepository {
  readOverview(range: GiftingInsightsRange): Promise<GiftingOverviewMetrics>
  readDailyActivity(range: GiftingInsightsRange): Promise<GiftingDailyActivity[]>
  listRecentGroups(limit: number): Promise<GiftingRecentGroup[]>
}

export class GiftingInsightsReadService {
  constructor(private readonly repository: GiftingInsightsRepository) {}

  async read(range: GiftingInsightsRange): Promise<GiftingInsightsSnapshot> {
    const [overview, dailyActivity, recentGroups] = await Promise.all([
      this.repository.readOverview(range),
      this.repository.readDailyActivity(range),
      this.repository.listRecentGroups(12),
    ])

    return {
      generatedAt: new Date().toISOString(),
      overview,
      dailyActivity,
      recentGroups,
    }
  }
}

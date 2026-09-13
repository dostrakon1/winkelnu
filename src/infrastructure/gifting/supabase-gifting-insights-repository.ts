import 'server-only'

import type {
  GiftingDailyActivity,
  GiftingInsightsRange,
  GiftingInsightsRepository,
  GiftingOverviewMetrics,
  GiftingRecentGroup,
} from '@/application/gifting/gifting-insights'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

type OverviewRow = {
  groups_created: unknown
  active_groups_now: unknown
  groups_drawn_cohort: unknown
  groups_with_three_plus_participants: unknown
  participants_joined: unknown
  average_participants_per_group: unknown
  standalone_lists_created: unknown
  gift_items_present_from_period: unknown
  winkelnu_products_present_from_period: unknown
  active_reservations_now: unknown
  average_group_budget_cents: unknown
  groups_with_event_date: unknown
  redraw_groups_cohort: unknown
}

type DailyRow = {
  metric_date: string
  groups_created: unknown
  participants_joined: unknown
  standalone_lists_created: unknown
  gift_items_present: unknown
  winkelnu_products_present: unknown
}

type RecentGroupRow = {
  internal_ref: string
  created_at: string
  occasion: GiftingRecentGroup['occasion']
  status: GiftingRecentGroup['status']
  participant_count: unknown
  wish_count: unknown
  budget_bucket: string
  has_event_date: boolean
  draw_version: unknown
  expires_at: string
  health_status: GiftingRecentGroup['healthStatus']
}

function number(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

const emptyOverview: GiftingOverviewMetrics = {
  groupsCreated: 0,
  activeGroupsNow: 0,
  groupsDrawnCohort: 0,
  groupsWithThreePlusParticipants: 0,
  participantsJoined: 0,
  averageParticipantsPerGroup: 0,
  standaloneListsCreated: 0,
  giftItemsPresentFromPeriod: 0,
  winkelnuProductsPresentFromPeriod: 0,
  activeReservationsNow: 0,
  averageGroupBudgetCents: 0,
  groupsWithEventDate: 0,
  redrawGroupsCohort: 0,
}

export class SupabaseGiftingInsightsRepository implements GiftingInsightsRepository {
  private readonly db = createSupabaseServerClient()

  async readOverview(range: GiftingInsightsRange): Promise<GiftingOverviewMetrics> {
    const { data, error } = await this.db.rpc('gifting_insights_overview', {
      p_from: range.from,
      p_to: range.to,
    })

    if (error) throw new Error(`Read gifting insights overview: ${error.message}`)
    const row = ((data ?? []) as OverviewRow[])[0]
    if (!row) return emptyOverview

    return {
      groupsCreated: number(row.groups_created),
      activeGroupsNow: number(row.active_groups_now),
      groupsDrawnCohort: number(row.groups_drawn_cohort),
      groupsWithThreePlusParticipants: number(row.groups_with_three_plus_participants),
      participantsJoined: number(row.participants_joined),
      averageParticipantsPerGroup: number(row.average_participants_per_group),
      standaloneListsCreated: number(row.standalone_lists_created),
      giftItemsPresentFromPeriod: number(row.gift_items_present_from_period),
      winkelnuProductsPresentFromPeriod: number(row.winkelnu_products_present_from_period),
      activeReservationsNow: number(row.active_reservations_now),
      averageGroupBudgetCents: number(row.average_group_budget_cents),
      groupsWithEventDate: number(row.groups_with_event_date),
      redrawGroupsCohort: number(row.redraw_groups_cohort),
    }
  }

  async readDailyActivity(range: GiftingInsightsRange): Promise<GiftingDailyActivity[]> {
    const { data, error } = await this.db.rpc('gifting_insights_daily_activity', {
      p_from: range.fromDate,
      p_to: range.toDate,
    })

    if (error) throw new Error(`Read gifting daily activity: ${error.message}`)

    return ((data ?? []) as DailyRow[]).map((row) => ({
      date: row.metric_date,
      groupsCreated: number(row.groups_created),
      participantsJoined: number(row.participants_joined),
      standaloneListsCreated: number(row.standalone_lists_created),
      giftItemsPresent: number(row.gift_items_present),
      winkelnuProductsPresent: number(row.winkelnu_products_present),
    }))
  }

  async listRecentGroups(limit: number): Promise<GiftingRecentGroup[]> {
    const { data, error } = await this.db.rpc('gifting_insights_recent_groups', {
      p_limit: Math.max(1, Math.min(limit, 50)),
    })

    if (error) throw new Error(`Read recent gifting groups: ${error.message}`)

    return ((data ?? []) as RecentGroupRow[]).map((row) => ({
      internalRef: row.internal_ref,
      createdAt: row.created_at,
      occasion: row.occasion,
      status: row.status,
      participantCount: number(row.participant_count),
      wishCount: number(row.wish_count),
      budgetBucket: row.budget_bucket,
      hasEventDate: row.has_event_date,
      drawVersion: number(row.draw_version),
      expiresAt: row.expires_at,
      healthStatus: row.health_status,
    }))
  }
}

import 'server-only'

import type { GiftingInsightsRange } from '@/application/gifting/gifting-insights'
import type {
  GiftingCleanupStatus,
  GiftingHealthInsightsRepository,
  GiftingHealthOverview,
  GiftingRateLimitRejection,
} from '@/application/gifting/gifting-health-insights'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

type HealthOverviewRow = {
  active_groups_nearing_expiry: unknown
  stale_active_groups: unknown
  stale_standalone_lists: unknown
  orphaned_group_lists: unknown
  expiry_mismatches: unknown
  drawn_assignment_mismatches: unknown
  groups_over_participant_limit: unknown
  rate_limit_rejections: unknown
  raw_event_retention_violations: unknown
  product_metric_retention_violations: unknown
}

type RateLimitRow = {
  action: string
  rejection_count: unknown
}

type CleanupRow = {
  configured: boolean | null
  active: boolean | null
  schedule: string | null
  last_started_at: string | null
  last_finished_at: string | null
  last_status: string | null
  last_success_at: string | null
}

function number(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

const emptyOverview: GiftingHealthOverview = {
  activeGroupsNearingExpiry: 0,
  staleActiveGroups: 0,
  staleStandaloneLists: 0,
  orphanedGroupLists: 0,
  expiryMismatches: 0,
  drawnAssignmentMismatches: 0,
  groupsOverParticipantLimit: 0,
  rateLimitRejections: 0,
  rawEventRetentionViolations: 0,
  productMetricRetentionViolations: 0,
}

export class SupabaseGiftingHealthInsightsRepository implements GiftingHealthInsightsRepository {
  private readonly db = createSupabaseServerClient()

  async readOverview(range: GiftingInsightsRange): Promise<GiftingHealthOverview> {
    const { data, error } = await this.db.rpc('gifting_insights_health_overview', {
      p_from: range.fromDate,
      p_to: range.toDate,
    })

    if (error) throw new Error(`Read gifting health overview: ${error.message}`)
    const row = ((data ?? []) as HealthOverviewRow[])[0]
    if (!row) return emptyOverview

    return {
      activeGroupsNearingExpiry: number(row.active_groups_nearing_expiry),
      staleActiveGroups: number(row.stale_active_groups),
      staleStandaloneLists: number(row.stale_standalone_lists),
      orphanedGroupLists: number(row.orphaned_group_lists),
      expiryMismatches: number(row.expiry_mismatches),
      drawnAssignmentMismatches: number(row.drawn_assignment_mismatches),
      groupsOverParticipantLimit: number(row.groups_over_participant_limit),
      rateLimitRejections: number(row.rate_limit_rejections),
      rawEventRetentionViolations: number(row.raw_event_retention_violations),
      productMetricRetentionViolations: number(row.product_metric_retention_violations),
    }
  }

  async readRateLimitRejections(range: GiftingInsightsRange): Promise<GiftingRateLimitRejection[]> {
    const { data, error } = await this.db.rpc('gifting_insights_rate_limit_rejections', {
      p_from: range.fromDate,
      p_to: range.toDate,
    })

    if (error) throw new Error(`Read gifting rate-limit rejections: ${error.message}`)

    return ((data ?? []) as RateLimitRow[]).map((row) => ({
      action: row.action,
      rejectionCount: number(row.rejection_count),
    }))
  }

  async readCleanupStatus(): Promise<GiftingCleanupStatus> {
    const { data, error } = await this.db.rpc('gifting_insights_cleanup_status')
    if (error) throw new Error(`Read gifting cleanup status: ${error.message}`)

    const row = ((data ?? []) as CleanupRow[])[0]
    if (!row) return { configured: false, active: false }

    return {
      configured: Boolean(row.configured),
      active: Boolean(row.active),
      schedule: row.schedule ?? undefined,
      lastStartedAt: row.last_started_at ?? undefined,
      lastFinishedAt: row.last_finished_at ?? undefined,
      lastStatus: row.last_status ?? undefined,
      lastSuccessAt: row.last_success_at ?? undefined,
    }
  }
}

import 'server-only'

import type { GiftingInsightsRange } from '@/application/gifting/gifting-insights'
import type {
  GiftingFunnelInsightsRepository,
  GiftingFunnelMetrics,
  GiftingInteractionBySurface,
} from '@/application/gifting/gifting-funnel-insights'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

type FunnelRow = {
  gifting_landing_views: unknown
  group_create_form_views: unknown
  groups_created: unknown
  group_invite_views: unknown
  participants_joined: unknown
  groups_three_participants_reached: unknown
  draws_completed: unknown
  list_create_form_views: unknown
  standalone_lists_created: unknown
  shared_list_views: unknown
  share_links_copied: unknown
  whatsapp_shares_clicked: unknown
  native_shares_invoked: unknown
}

type SurfaceRow = {
  event_type: GiftingInteractionBySurface['eventType']
  source_surface: string
  event_count: unknown
}

function number(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

const emptyFunnel: GiftingFunnelMetrics = {
  giftingLandingViews: 0,
  groupCreateFormViews: 0,
  groupsCreated: 0,
  groupInviteViews: 0,
  participantsJoined: 0,
  groupsThreeParticipantsReached: 0,
  drawsCompleted: 0,
  listCreateFormViews: 0,
  standaloneListsCreated: 0,
  sharedListViews: 0,
  shareLinksCopied: 0,
  whatsappSharesClicked: 0,
  nativeSharesInvoked: 0,
}

export class SupabaseGiftingFunnelInsightsRepository implements GiftingFunnelInsightsRepository {
  private readonly db = createSupabaseServerClient()

  async readFunnel(range: GiftingInsightsRange): Promise<GiftingFunnelMetrics> {
    const { data, error } = await this.db.rpc('gifting_insights_funnel', {
      p_from: range.fromDate,
      p_to: range.toDate,
    })

    if (error) throw new Error(`Read gifting funnel insights: ${error.message}`)
    const row = ((data ?? []) as FunnelRow[])[0]
    if (!row) return emptyFunnel

    return {
      giftingLandingViews: number(row.gifting_landing_views),
      groupCreateFormViews: number(row.group_create_form_views),
      groupsCreated: number(row.groups_created),
      groupInviteViews: number(row.group_invite_views),
      participantsJoined: number(row.participants_joined),
      groupsThreeParticipantsReached: number(row.groups_three_participants_reached),
      drawsCompleted: number(row.draws_completed),
      listCreateFormViews: number(row.list_create_form_views),
      standaloneListsCreated: number(row.standalone_lists_created),
      sharedListViews: number(row.shared_list_views),
      shareLinksCopied: number(row.share_links_copied),
      whatsappSharesClicked: number(row.whatsapp_shares_clicked),
      nativeSharesInvoked: number(row.native_shares_invoked),
    }
  }

  async readInteractionsBySurface(range: GiftingInsightsRange): Promise<GiftingInteractionBySurface[]> {
    const { data, error } = await this.db.rpc('gifting_insights_interactions_by_surface', {
      p_from: range.fromDate,
      p_to: range.toDate,
    })

    if (error) throw new Error(`Read gifting interaction surfaces: ${error.message}`)

    return ((data ?? []) as SurfaceRow[]).map((row) => ({
      eventType: row.event_type,
      sourceSurface: row.source_surface,
      eventCount: number(row.event_count),
    }))
  }
}

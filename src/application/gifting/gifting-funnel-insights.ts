import 'server-only'

import type { GiftingInsightsRange } from '@/application/gifting/gifting-insights'

export type GiftingFunnelMetrics = {
  giftingLandingViews: number
  groupCreateFormViews: number
  groupsCreated: number
  groupInviteViews: number
  participantsJoined: number
  groupsThreeParticipantsReached: number
  drawsCompleted: number
  listCreateFormViews: number
  standaloneListsCreated: number
  sharedListViews: number
  shareLinksCopied: number
  whatsappSharesClicked: number
  nativeSharesInvoked: number
}

export type GiftingInteractionBySurface = {
  eventType:
    | 'gifting_landing_viewed'
    | 'group_create_form_viewed'
    | 'list_create_form_viewed'
    | 'group_invite_viewed'
    | 'shared_list_viewed'
    | 'share_link_copied'
    | 'whatsapp_share_clicked'
    | 'native_share_invoked'
  sourceSurface: string
  eventCount: number
}

export type GiftingFunnelSnapshot = {
  generatedAt: string
  funnel: GiftingFunnelMetrics
  interactionsBySurface: GiftingInteractionBySurface[]
}

export interface GiftingFunnelInsightsRepository {
  readFunnel(range: GiftingInsightsRange): Promise<GiftingFunnelMetrics>
  readInteractionsBySurface(range: GiftingInsightsRange): Promise<GiftingInteractionBySurface[]>
}

export class GiftingFunnelInsightsReadService {
  constructor(private readonly repository: GiftingFunnelInsightsRepository) {}

  async read(range: GiftingInsightsRange): Promise<GiftingFunnelSnapshot> {
    const [funnel, interactionsBySurface] = await Promise.all([
      this.repository.readFunnel(range),
      this.repository.readInteractionsBySurface(range),
    ])

    return {
      generatedAt: new Date().toISOString(),
      funnel,
      interactionsBySurface,
    }
  }
}

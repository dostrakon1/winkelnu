import 'server-only'

import type {
  GiftDrawAssignment,
  GiftGroupExclusion,
} from '@/domain/gifting/types'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

type GiftExclusionRow = {
  id: string
  group_id: string
  participant_id: string
  excluded_recipient_id: string
  created_at: string
}

function mapExclusion(row: GiftExclusionRow): GiftGroupExclusion {
  return {
    id: row.id,
    groupId: row.group_id,
    participantId: row.participant_id,
    excludedRecipientId: row.excluded_recipient_id,
    createdAt: row.created_at,
  }
}

export class SupabaseGiftGroupDrawRepository {
  async listExclusions(groupId: string): Promise<GiftGroupExclusion[]> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_group_exclusions')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(`Unable to list gift group exclusions: ${error.message}`)
    return ((data ?? []) as GiftExclusionRow[]).map(mapExclusion)
  }

  async setMutualExclusion(
    groupId: string,
    participantAId: string,
    participantBId: string,
    enabled: boolean,
  ): Promise<void> {
    const db = createSupabaseServerClient()
    const { error } = await db.rpc('set_gift_group_exclusion_pair', {
      p_group_id: groupId,
      p_participant_a: participantAId,
      p_participant_b: participantBId,
      p_enabled: enabled,
    })

    if (error) throw new Error(`Unable to update gift group exclusion: ${error.message}`)
  }

  async applyDraw(input: {
    groupId: string
    expectedDrawVersion: number
    assignments: GiftDrawAssignment[]
    redraw: boolean
  }): Promise<number> {
    const db = createSupabaseServerClient()
    const { data, error } = await db.rpc('apply_gift_group_draw', {
      p_group_id: input.groupId,
      p_expected_draw_version: input.expectedDrawVersion,
      p_assignments: input.assignments.map((assignment) => ({
        giverParticipantId: assignment.giverParticipantId,
        recipientParticipantId: assignment.recipientParticipantId,
      })),
      p_redraw: input.redraw,
    })

    if (error) throw new Error(`Unable to persist gift group draw: ${error.message}`)
    if (typeof data !== 'number') throw new Error('Unable to persist gift group draw: missing draw version')
    return data
  }
}

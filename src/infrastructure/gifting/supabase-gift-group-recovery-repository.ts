import 'server-only'

import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

export class SupabaseGiftGroupRecoveryRepository {
  async rotateOrganizerToken(groupId: string, organizerTokenHash: string): Promise<void> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_groups')
      .update({ organizer_token_hash: organizerTokenHash, updated_at: new Date().toISOString() })
      .eq('id', groupId)
      .select('id')
      .maybeSingle()

    if (error || !data) {
      throw new Error(`Unable to rotate gift group organizer token: ${error?.message ?? 'missing row'}`)
    }
  }

  async rotateParticipantToken(participantId: string, participantTokenHash: string): Promise<void> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_group_participants')
      .update({ participant_token_hash: participantTokenHash, updated_at: new Date().toISOString() })
      .eq('id', participantId)
      .select('id')
      .maybeSingle()

    if (error || !data) {
      throw new Error(`Unable to rotate gift group participant token: ${error?.message ?? 'missing row'}`)
    }
  }

  async organizerTokenMatches(groupId: string, organizerTokenHash: string): Promise<boolean> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_groups')
      .select('id')
      .eq('id', groupId)
      .eq('organizer_token_hash', organizerTokenHash)
      .maybeSingle()

    if (error) throw new Error(`Unable to verify gift group organizer token: ${error.message}`)
    return Boolean(data)
  }

  async participantIdForToken(groupId: string, participantTokenHash: string): Promise<string | null> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_group_participants')
      .select('id')
      .eq('group_id', groupId)
      .eq('participant_token_hash', participantTokenHash)
      .maybeSingle()

    if (error) throw new Error(`Unable to verify gift group participant token: ${error.message}`)
    return data?.id ?? null
  }
}

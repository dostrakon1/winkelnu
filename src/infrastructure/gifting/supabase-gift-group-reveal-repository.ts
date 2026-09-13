import 'server-only'

import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

type RevealRow = {
  draw_version: number
  recipient_participant_id: string
  recipient_display_name: string
  recipient_gift_list_id: string
}

export type GiftParticipantRevealRecord = {
  drawVersion: number
  recipientParticipantId: string
  recipientDisplayName: string
  recipientGiftListId: string
}

export class SupabaseGiftGroupRevealRepository {
  async getReveal(groupId: string, giverParticipantId: string): Promise<GiftParticipantRevealRecord | null> {
    const db = createSupabaseServerClient()
    const { data, error } = await db.rpc('get_gift_group_participant_reveal', {
      p_group_id: groupId,
      p_giver_participant_id: giverParticipantId,
    })

    if (error) throw new Error(`Unable to reveal gift group recipient: ${error.message}`)
    const row = Array.isArray(data) ? data[0] as RevealRow | undefined : undefined
    if (!row) return null

    return {
      drawVersion: row.draw_version,
      recipientParticipantId: row.recipient_participant_id,
      recipientDisplayName: row.recipient_display_name,
      recipientGiftListId: row.recipient_gift_list_id,
    }
  }

  async listReservedItemIds(groupId: string, giverParticipantId: string): Promise<string[]> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_item_reservations')
      .select('gift_list_item_id')
      .eq('group_id', groupId)
      .eq('reserved_by_participant_id', giverParticipantId)

    if (error) throw new Error(`Unable to list gift reservations: ${error.message}`)
    return (data ?? []).map((row) => row.gift_list_item_id as string)
  }

  async setReservation(input: {
    groupId: string
    giverParticipantId: string
    giftListItemId: string
    reserved: boolean
  }): Promise<void> {
    const db = createSupabaseServerClient()
    const { error } = await db.rpc('set_gift_item_reservation', {
      p_group_id: input.groupId,
      p_reserved_by_participant_id: input.giverParticipantId,
      p_gift_list_item_id: input.giftListItemId,
      p_reserved: input.reserved,
    })

    if (error) throw new Error(`Unable to update gift reservation: ${error.message}`)
  }
}

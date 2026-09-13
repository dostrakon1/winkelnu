import 'server-only'

import type { GiftList, GiftListItem, GiftListWithItems } from '@/domain/gifting/types'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

type RevealRow = {
  draw_version: number
  recipient_participant_id: string
  recipient_display_name: string
  recipient_gift_list_id: string
}

type GiftListRow = {
  id: string
  external_key: string
  display_name: string
  title: string | null
  occasion: GiftList['occasion']
  budget_min_cents: number | null
  budget_max_cents: number | null
  event_date: string | null
  status: GiftList['status']
  expires_at: string
  created_at: string
  updated_at: string
}

type GiftListItemRow = {
  id: string
  gift_list_id: string
  item_type: GiftListItem['itemType']
  product_external_key: string | null
  product_slug_snapshot: string | null
  external_url: string | null
  title: string
  image_url_snapshot: string | null
  price_cents_snapshot: number | null
  currency_snapshot: string | null
  note: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

function mapList(row: GiftListRow): GiftList {
  return {
    id: row.id,
    externalKey: row.external_key,
    displayName: row.display_name,
    title: row.title ?? undefined,
    occasion: row.occasion,
    budgetMinCents: row.budget_min_cents ?? undefined,
    budgetMaxCents: row.budget_max_cents ?? undefined,
    eventDate: row.event_date ?? undefined,
    status: row.status,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapItem(row: GiftListItemRow): GiftListItem {
  return {
    id: row.id,
    giftListId: row.gift_list_id,
    itemType: row.item_type,
    productExternalKey: row.product_external_key ?? undefined,
    productSlugSnapshot: row.product_slug_snapshot ?? undefined,
    externalUrl: row.external_url ?? undefined,
    title: row.title,
    imageUrlSnapshot: row.image_url_snapshot ?? undefined,
    priceCentsSnapshot: row.price_cents_snapshot ?? undefined,
    currencySnapshot: row.currency_snapshot ?? undefined,
    note: row.note ?? undefined,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
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

  async getRecipientList(giftListId: string): Promise<GiftListWithItems | null> {
    const db = createSupabaseServerClient()
    const { data: listData, error: listError } = await db
      .from('gift_lists')
      .select('*')
      .eq('id', giftListId)
      .maybeSingle()

    if (listError) throw new Error(`Unable to read recipient gift list: ${listError.message}`)
    if (!listData) return null

    const { data: itemData, error: itemError } = await db
      .from('gift_list_items')
      .select('*')
      .eq('gift_list_id', giftListId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (itemError) throw new Error(`Unable to read recipient gift list items: ${itemError.message}`)
    return {
      ...mapList(listData as GiftListRow),
      items: ((itemData ?? []) as GiftListItemRow[]).map(mapItem),
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

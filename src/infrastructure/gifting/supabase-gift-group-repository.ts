import 'server-only'

import type {
  CreateGiftGroupInput,
  GiftGroup,
  GiftGroupParticipant,
  GiftGroupParticipantSummary,
  GiftList,
  GiftListItem,
  GiftListWithItems,
} from '@/domain/gifting/types'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'
import { retryTransientGiftingRead } from '@/infrastructure/gifting/transient-read'

type GiftGroupRow = {
  id: string
  external_key: string
  name: string
  occasion: GiftGroup['occasion']
  budget_cents: number | null
  event_date: string | null
  status: GiftGroup['status']
  draw_version: number
  expires_at: string
  created_at: string
  updated_at: string
}

type GiftParticipantRow = {
  id: string
  external_key: string
  group_id: string
  gift_list_id: string
  display_name: string
  joined_at: string
  created_at: string
  updated_at: string
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

function mapGroup(row: GiftGroupRow): GiftGroup {
  return {
    id: row.id,
    externalKey: row.external_key,
    name: row.name,
    occasion: row.occasion,
    budgetCents: row.budget_cents ?? undefined,
    eventDate: row.event_date ?? undefined,
    status: row.status,
    drawVersion: row.draw_version,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapParticipant(row: GiftParticipantRow): GiftGroupParticipant {
  return {
    id: row.id,
    externalKey: row.external_key,
    groupId: row.group_id,
    giftListId: row.gift_list_id,
    displayName: row.display_name,
    joinedAt: row.joined_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
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

export class SupabaseGiftGroupRepository {
  async createGroupWithOrganizer(input: CreateGiftGroupInput & {
    groupExternalKey: string
    groupCodeHash: string
    organizerTokenHash: string
    participantExternalKey: string
    participantTokenHash: string
    listExternalKey: string
    listShareCodeHash: string
    expiresAt: string
  }): Promise<{ group: GiftGroup; participant: GiftGroupParticipant }> {
    const db = createSupabaseServerClient()
    const { data: groupData, error: groupError } = await db
      .from('gift_groups')
      .insert({
        external_key: input.groupExternalKey,
        group_code_hash: input.groupCodeHash,
        organizer_token_hash: input.organizerTokenHash,
        name: input.name,
        occasion: input.occasion,
        budget_cents: input.budgetCents ?? null,
        event_date: input.eventDate ?? null,
        status: 'draft',
        draw_version: 0,
        expires_at: input.expiresAt,
      })
      .select('*')
      .single()

    if (groupError || !groupData) {
      throw new Error(`Unable to create gift group: ${groupError?.message ?? 'missing row'}`)
    }

    const group = mapGroup(groupData as GiftGroupRow)
    const { data: listData, error: listError } = await db
      .from('gift_lists')
      .insert({
        external_key: input.listExternalKey,
        share_code_hash: input.listShareCodeHash,
        owner_token_hash: null,
        display_name: input.organizerDisplayName,
        title: null,
        occasion: input.occasion,
        budget_min_cents: null,
        budget_max_cents: null,
        event_date: input.eventDate ?? null,
        status: 'active',
        expires_at: input.expiresAt,
      })
      .select('id')
      .single()

    if (listError || !listData) {
      await db.from('gift_groups').delete().eq('id', group.id)
      throw new Error(`Unable to create organizer gift list: ${listError?.message ?? 'missing row'}`)
    }

    const { data: participantData, error: participantError } = await db
      .from('gift_group_participants')
      .insert({
        external_key: input.participantExternalKey,
        group_id: group.id,
        gift_list_id: listData.id,
        participant_token_hash: input.participantTokenHash,
        display_name: input.organizerDisplayName,
      })
      .select('*')
      .single()

    if (participantError || !participantData) {
      await db.from('gift_lists').delete().eq('id', listData.id)
      await db.from('gift_groups').delete().eq('id', group.id)
      throw new Error(`Unable to create organizer participant: ${participantError?.message ?? 'missing row'}`)
    }

    return { group, participant: mapParticipant(participantData as GiftParticipantRow) }
  }

  async getGroupByCodeHash(groupCodeHash: string): Promise<GiftGroup | null> {
    return retryTransientGiftingRead(async () => {
      const db = createSupabaseServerClient()
      const { data, error } = await db
        .from('gift_groups')
        .select('*')
        .eq('group_code_hash', groupCodeHash)
        .maybeSingle()

      if (error) throw new Error(`Unable to read gift group: ${error.message}`)
      return data ? mapGroup(data as GiftGroupRow) : null
    })
  }

  async joinGroup(input: {
    group: GiftGroup
    displayName: string
    participantExternalKey: string
    participantTokenHash: string
    listExternalKey: string
    listShareCodeHash: string
  }): Promise<GiftGroupParticipant> {
    const db = createSupabaseServerClient()
    const { data: listData, error: listError } = await db
      .from('gift_lists')
      .insert({
        external_key: input.listExternalKey,
        share_code_hash: input.listShareCodeHash,
        owner_token_hash: null,
        display_name: input.displayName,
        title: null,
        occasion: input.group.occasion,
        budget_min_cents: null,
        budget_max_cents: null,
        event_date: input.group.eventDate ?? null,
        status: 'active',
        expires_at: input.group.expiresAt,
      })
      .select('id')
      .single()

    if (listError || !listData) {
      throw new Error(`Unable to create participant gift list: ${listError?.message ?? 'missing row'}`)
    }

    const { data: participantData, error: participantError } = await db
      .from('gift_group_participants')
      .insert({
        external_key: input.participantExternalKey,
        group_id: input.group.id,
        gift_list_id: listData.id,
        participant_token_hash: input.participantTokenHash,
        display_name: input.displayName,
      })
      .select('*')
      .single()

    if (participantError || !participantData) {
      await db.from('gift_lists').delete().eq('id', listData.id)
      throw new Error(`Unable to join gift group: ${participantError?.message ?? 'missing row'}`)
    }

    return mapParticipant(participantData as GiftParticipantRow)
  }

  async listParticipantSummaries(groupId: string): Promise<GiftGroupParticipantSummary[]> {
    return retryTransientGiftingRead(async () => {
      const db = createSupabaseServerClient()
      const { data: participantRows, error } = await db
        .from('gift_group_participants')
        .select('*')
        .eq('group_id', groupId)
        .order('joined_at', { ascending: true })

      if (error) throw new Error(`Unable to list group participants: ${error.message}`)
      const participants = ((participantRows ?? []) as GiftParticipantRow[]).map(mapParticipant)
      const listIds = participants.map((participant) => participant.giftListId)
      const wishCountByList = new Map<string, number>()

      if (listIds.length > 0) {
        const { data: itemRows, error: itemError } = await db
          .from('gift_list_items')
          .select('gift_list_id')
          .in('gift_list_id', listIds)
        if (itemError) throw new Error(`Unable to count participant wishes: ${itemError.message}`)
        for (const row of itemRows ?? []) {
          wishCountByList.set(row.gift_list_id, (wishCountByList.get(row.gift_list_id) ?? 0) + 1)
        }
      }

      return participants.map((participant) => ({
        ...participant,
        wishCount: wishCountByList.get(participant.giftListId) ?? 0,
      }))
    })
  }

  async getParticipantForGroupByIds(groupId: string, participantIds: string[]): Promise<GiftGroupParticipant | null> {
    if (participantIds.length === 0) return null
    return retryTransientGiftingRead(async () => {
      const db = createSupabaseServerClient()
      const { data, error } = await db
        .from('gift_group_participants')
        .select('*')
        .eq('group_id', groupId)
        .in('id', participantIds)
        .limit(1)
        .maybeSingle()

      if (error) throw new Error(`Unable to resolve current group participant: ${error.message}`)
      return data ? mapParticipant(data as GiftParticipantRow) : null
    })
  }

  async getParticipantList(participant: GiftGroupParticipant): Promise<GiftListWithItems> {
    return retryTransientGiftingRead(async () => {
      const db = createSupabaseServerClient()
      const { data: listData, error: listError } = await db
        .from('gift_lists')
        .select('*')
        .eq('id', participant.giftListId)
        .single()

      if (listError || !listData) {
        throw new Error(`Unable to read participant gift list: ${listError?.message ?? 'missing row'}`)
      }

      const { data: itemRows, error: itemError } = await db
        .from('gift_list_items')
        .select('*')
        .eq('gift_list_id', participant.giftListId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (itemError) throw new Error(`Unable to read participant gift list items: ${itemError.message}`)
      return {
        ...mapList(listData as GiftListRow),
        items: ((itemRows ?? []) as GiftListItemRow[]).map(mapItem),
      }
    })
  }

  async removeParticipant(groupId: string, participantId: string): Promise<boolean> {
    const db = createSupabaseServerClient()
    const { data: participant, error } = await db
      .from('gift_group_participants')
      .select('gift_list_id')
      .eq('id', participantId)
      .eq('group_id', groupId)
      .maybeSingle()

    if (error) throw new Error(`Unable to resolve participant removal: ${error.message}`)
    if (!participant) return false

    // Deleting the participant list cascades to the participant row. The L3
    // participant trigger rejects this operation once the group is no longer draft.
    const { error: deleteError } = await db.from('gift_lists').delete().eq('id', participant.gift_list_id)
    if (deleteError) throw new Error(`Unable to remove participant: ${deleteError.message}`)
    return true
  }
}

import 'server-only'

import type {
  CreateGiftListInput,
  CreateGiftListItemInput,
  CreateWinkelnuGiftListItemInput,
  GiftList,
  GiftListItem,
  GiftListWithItems,
  UpdateGiftListInput,
} from '@/domain/gifting/types'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

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

async function attachItems(db: ReturnType<typeof createSupabaseServerClient>, list: GiftList): Promise<GiftListWithItems> {
  const { data, error } = await db
    .from('gift_list_items')
    .select('*')
    .eq('gift_list_id', list.id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw new Error(`Unable to read gift list items: ${error.message}`)
  return { ...list, items: ((data ?? []) as GiftListItemRow[]).map(mapItem) }
}

async function nextSortOrder(db: ReturnType<typeof createSupabaseServerClient>, listId: string): Promise<number> {
  const { count, error: countError } = await db
    .from('gift_list_items')
    .select('id', { count: 'exact', head: true })
    .eq('gift_list_id', listId)

  if (countError) throw new Error(`Unable to count gift list items: ${countError.message}`)
  if ((count ?? 0) >= 100) throw new Error('GIFT_LIST_ITEM_LIMIT')

  const { data: lastItem, error: lastItemError } = await db
    .from('gift_list_items')
    .select('sort_order')
    .eq('gift_list_id', listId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (lastItemError) throw new Error(`Unable to determine gift list item order: ${lastItemError.message}`)
  return typeof lastItem?.sort_order === 'number' ? lastItem.sort_order + 1 : 0
}

async function touchList(db: ReturnType<typeof createSupabaseServerClient>, listId: string, expiresAt: string): Promise<void> {
  const { error } = await db
    .from('gift_lists')
    .update({ expires_at: expiresAt, updated_at: new Date().toISOString() })
    .eq('id', listId)
  if (error) throw new Error(`Unable to extend gift list retention: ${error.message}`)
}

export class SupabaseGiftRepository {
  async createStandaloneList(input: CreateGiftListInput & {
    externalKey: string
    shareCodeHash: string
    ownerTokenHash: string
    expiresAt: string
  }): Promise<GiftList> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_lists')
      .insert({
        external_key: input.externalKey,
        share_code_hash: input.shareCodeHash,
        owner_token_hash: input.ownerTokenHash,
        display_name: input.displayName,
        title: input.title ?? null,
        occasion: input.occasion,
        budget_min_cents: input.budgetMinCents ?? null,
        budget_max_cents: input.budgetMaxCents ?? null,
        event_date: input.eventDate ?? null,
        status: 'active',
        expires_at: input.expiresAt,
      })
      .select('*')
      .single()

    if (error || !data) throw new Error(`Unable to create gift list: ${error?.message ?? 'missing row'}`)
    return mapList(data as GiftListRow)
  }

  async getListByShareCodeHash(shareCodeHash: string): Promise<GiftListWithItems | null> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_lists')
      .select('*')
      .eq('share_code_hash', shareCodeHash)
      .maybeSingle()

    if (error) throw new Error(`Unable to read gift list: ${error.message}`)
    if (!data) return null
    return attachItems(db, mapList(data as GiftListRow))
  }

  async getListByOwnerTokenHash(ownerTokenHash: string): Promise<GiftList | null> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_lists')
      .select('*')
      .eq('owner_token_hash', ownerTokenHash)
      .maybeSingle()

    if (error) throw new Error(`Unable to resolve gift list owner token: ${error.message}`)
    return data ? mapList(data as GiftListRow) : null
  }

  async updateList(listId: string, input: UpdateGiftListInput, expiresAt: string): Promise<GiftList> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_lists')
      .update({
        display_name: input.displayName,
        title: input.title ?? null,
        occasion: input.occasion,
        budget_min_cents: input.budgetMinCents ?? null,
        budget_max_cents: input.budgetMaxCents ?? null,
        event_date: input.eventDate ?? null,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', listId)
      .select('*')
      .single()

    if (error || !data) throw new Error(`Unable to update gift list: ${error?.message ?? 'missing row'}`)
    return mapList(data as GiftListRow)
  }

  async addListItem(listId: string, input: CreateGiftListItemInput, expiresAt: string): Promise<GiftListItem> {
    const db = createSupabaseServerClient()
    const sortOrder = await nextSortOrder(db, listId)

    const { data, error } = await db
      .from('gift_list_items')
      .insert({
        gift_list_id: listId,
        item_type: input.itemType,
        product_external_key: null,
        product_slug_snapshot: null,
        external_url: input.externalUrl ?? null,
        title: input.title,
        note: input.note ?? null,
        sort_order: sortOrder,
      })
      .select('*')
      .single()

    if (error || !data) throw new Error(`Unable to add gift list item: ${error?.message ?? 'missing row'}`)
    await touchList(db, listId, expiresAt)
    return mapItem(data as GiftListItemRow)
  }

  async addWinkelnuProductItem(
    listId: string,
    input: CreateWinkelnuGiftListItemInput,
    expiresAt: string,
  ): Promise<GiftListItem> {
    const db = createSupabaseServerClient()
    const sortOrder = await nextSortOrder(db, listId)

    const { data, error } = await db
      .from('gift_list_items')
      .insert({
        gift_list_id: listId,
        item_type: 'winkelnu_product',
        product_external_key: input.productExternalKey,
        product_slug_snapshot: input.productSlugSnapshot,
        external_url: null,
        title: input.title,
        image_url_snapshot: input.imageUrlSnapshot ?? null,
        price_cents_snapshot: input.priceCentsSnapshot ?? null,
        currency_snapshot: input.currencySnapshot ?? null,
        note: input.note ?? null,
        sort_order: sortOrder,
      })
      .select('*')
      .single()

    if (error || !data) throw new Error(`Unable to add Winkelnu gift list item: ${error?.message ?? 'missing row'}`)
    await touchList(db, listId, expiresAt)
    return mapItem(data as GiftListItemRow)
  }

  async updateListItem(listId: string, itemId: string, input: CreateGiftListItemInput, expiresAt: string): Promise<GiftListItem> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_list_items')
      .update({
        item_type: input.itemType,
        product_external_key: null,
        product_slug_snapshot: null,
        external_url: input.externalUrl ?? null,
        title: input.title,
        image_url_snapshot: null,
        price_cents_snapshot: null,
        currency_snapshot: null,
        note: input.note ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .eq('gift_list_id', listId)
      .neq('item_type', 'winkelnu_product')
      .select('*')
      .maybeSingle()

    if (error) throw new Error(`Unable to update gift list item: ${error.message}`)
    if (!data) throw new Error('GIFT_LIST_ITEM_NOT_FOUND')

    await touchList(db, listId, expiresAt)
    return mapItem(data as GiftListItemRow)
  }

  async updateWinkelnuProductNote(listId: string, itemId: string, note: string | undefined, expiresAt: string): Promise<GiftListItem> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_list_items')
      .update({ note: note ?? null, updated_at: new Date().toISOString() })
      .eq('id', itemId)
      .eq('gift_list_id', listId)
      .eq('item_type', 'winkelnu_product')
      .select('*')
      .maybeSingle()

    if (error) throw new Error(`Unable to update Winkelnu gift list item: ${error.message}`)
    if (!data) throw new Error('GIFT_LIST_ITEM_NOT_FOUND')

    await touchList(db, listId, expiresAt)
    return mapItem(data as GiftListItemRow)
  }

  async deleteListItem(listId: string, itemId: string, expiresAt: string): Promise<void> {
    const db = createSupabaseServerClient()
    const { error } = await db
      .from('gift_list_items')
      .delete()
      .eq('id', itemId)
      .eq('gift_list_id', listId)

    if (error) throw new Error(`Unable to delete gift list item: ${error.message}`)
    await touchList(db, listId, expiresAt)
  }

  async rotateOwnerToken(listId: string, ownerTokenHash: string, expiresAt: string): Promise<void> {
    const db = createSupabaseServerClient()
    const { error } = await db
      .from('gift_lists')
      .update({
        owner_token_hash: ownerTokenHash,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', listId)

    if (error) throw new Error(`Unable to rotate gift list recovery token: ${error.message}`)
  }
}

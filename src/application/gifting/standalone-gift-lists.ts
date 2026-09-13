import 'server-only'

import type { CreateGiftListInput, CreateGiftListItemInput, GiftListWithItems, UpdateGiftListInput } from '@/domain/gifting/types'
import { canManageGiftList, grantGiftListOwnerAccess } from '@/application/gifting/access-grants'
import { createGiftExternalKey, createGiftRecoveryToken, createGiftShareCode, hashGiftCapability } from '@/infrastructure/gifting/gift-capabilities'
import { SupabaseGiftRepository } from '@/infrastructure/gifting/supabase-gift-repository'

const RETENTION_DAYS = 180

export class GiftListAccessError extends Error {
  constructor(message = 'Geen toegang tot dit lijstje.') {
    super(message)
    this.name = 'GiftListAccessError'
  }
}

function nextExpiry(): string {
  return new Date(Date.now() + RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()
}

function isActive(list: GiftListWithItems): boolean {
  return list.status === 'active' && new Date(list.expiresAt).getTime() > Date.now()
}

export async function createStandaloneGiftList(input: CreateGiftListInput): Promise<{
  list: GiftListWithItems
  shareCode: string
}> {
  const repository = new SupabaseGiftRepository()
  const shareCode = createGiftShareCode()
  const initialOwnerToken = createGiftRecoveryToken()
  const list = await repository.createStandaloneList({
    ...input,
    externalKey: createGiftExternalKey('list'),
    shareCodeHash: hashGiftCapability(shareCode),
    ownerTokenHash: hashGiftCapability(initialOwnerToken),
    expiresAt: nextExpiry(),
  })

  await grantGiftListOwnerAccess(list.id, list.expiresAt)
  return { list: { ...list, items: [] }, shareCode }
}

export async function getSharedGiftList(shareCode: string): Promise<GiftListWithItems | null> {
  if (!shareCode || shareCode.length > 120) return null
  const repository = new SupabaseGiftRepository()
  const list = await repository.getListByShareCodeHash(hashGiftCapability(shareCode))
  return list && isActive(list) ? list : null
}

export async function getEditableGiftList(shareCode: string): Promise<GiftListWithItems | null> {
  const list = await getSharedGiftList(shareCode)
  if (!list) return null
  return (await canManageGiftList(list.id)) ? list : null
}

async function requireEditableGiftList(shareCode: string): Promise<GiftListWithItems> {
  const list = await getSharedGiftList(shareCode)
  if (!list || !(await canManageGiftList(list.id))) throw new GiftListAccessError()
  return list
}

export async function updateStandaloneGiftList(shareCode: string, input: UpdateGiftListInput): Promise<void> {
  const list = await requireEditableGiftList(shareCode)
  const repository = new SupabaseGiftRepository()
  const updated = await repository.updateList(list.id, input, nextExpiry())
  await grantGiftListOwnerAccess(updated.id, updated.expiresAt)
}

export async function addStandaloneGiftListItem(shareCode: string, input: CreateGiftListItemInput): Promise<void> {
  const list = await requireEditableGiftList(shareCode)
  const repository = new SupabaseGiftRepository()
  await repository.addListItem(list.id, input, nextExpiry())
}

export async function updateStandaloneGiftListItem(shareCode: string, itemId: string, input: CreateGiftListItemInput): Promise<void> {
  const list = await requireEditableGiftList(shareCode)
  if (!itemId) throw new GiftListAccessError('Ongeldige wens.')
  const repository = new SupabaseGiftRepository()
  await repository.updateListItem(list.id, itemId, input, nextExpiry())
}

export async function deleteStandaloneGiftListItem(shareCode: string, itemId: string): Promise<void> {
  const list = await requireEditableGiftList(shareCode)
  if (!itemId) throw new GiftListAccessError('Ongeldige wens.')
  const repository = new SupabaseGiftRepository()
  await repository.deleteListItem(list.id, itemId, nextExpiry())
}

export async function createGiftListRecoveryPath(shareCode: string): Promise<string> {
  const list = await requireEditableGiftList(shareCode)
  const repository = new SupabaseGiftRepository()
  const token = createGiftRecoveryToken()
  const expiresAt = nextExpiry()
  await repository.rotateOwnerToken(list.id, hashGiftCapability(token), expiresAt)
  await grantGiftListOwnerAccess(list.id, expiresAt)

  return `/lootje-lijstje/toegang/${encodeURIComponent(token)}?lijst=${encodeURIComponent(shareCode)}`
}

export async function recoverGiftListOwnerAccess(token: string, shareCode: string): Promise<GiftListWithItems | null> {
  if (!token || token.length > 180 || !shareCode || shareCode.length > 120) return null

  const repository = new SupabaseGiftRepository()
  const [tokenList, sharedList] = await Promise.all([
    repository.getListByOwnerTokenHash(hashGiftCapability(token)),
    repository.getListByShareCodeHash(hashGiftCapability(shareCode)),
  ])

  if (!tokenList || !sharedList || tokenList.id !== sharedList.id || !isActive(sharedList)) return null
  await grantGiftListOwnerAccess(sharedList.id, sharedList.expiresAt)
  return sharedList
}

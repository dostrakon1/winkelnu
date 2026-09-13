import 'server-only'

import { addGiftAccessGrant, hasGiftAccessGrant } from '@/infrastructure/gifting/gift-session-cookie'

function expiryEpochSeconds(expiresAt: string): number {
  const value = Math.floor(new Date(expiresAt).getTime() / 1000)
  if (!Number.isFinite(value)) throw new Error('Invalid gifting grant expiry.')
  return value
}

export async function grantGiftListOwnerAccess(listId: string, expiresAt: string): Promise<void> {
  await addGiftAccessGrant({
    kind: 'list-owner',
    entityId: listId,
    expiresAt: expiryEpochSeconds(expiresAt),
  })
}

export async function canManageGiftList(listId: string): Promise<boolean> {
  return hasGiftAccessGrant('list-owner', listId)
}

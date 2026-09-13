import 'server-only'

import { getOrganizerGiftGroupContext, GiftGroupAccessError } from '@/application/gifting/gift-groups'
import { getEditableGiftList, GiftListAccessError } from '@/application/gifting/standalone-gift-lists'
import { SupabaseGiftDeletionRepository } from '@/infrastructure/gifting/supabase-gift-deletion-repository'

export async function deleteStandaloneGiftList(shareCode: string): Promise<void> {
  const list = await getEditableGiftList(shareCode)
  if (!list) throw new GiftListAccessError('Beheer-toegang nodig om dit lijstje te verwijderen.')

  const deleted = await new SupabaseGiftDeletionRepository().deleteStandaloneList(list.id)
  if (!deleted) throw new GiftListAccessError('Dit lijstje bestaat niet meer.')
}

export async function deleteGiftGroup(groupCode: string): Promise<void> {
  const context = await getOrganizerGiftGroupContext(groupCode)
  if (!context) throw new GiftGroupAccessError('Beheer-toegang nodig om deze groep te verwijderen.')

  const deleted = await new SupabaseGiftDeletionRepository().deleteGroup(context.group.id)
  if (!deleted) throw new GiftGroupAccessError('Deze groep bestaat niet meer.')
}

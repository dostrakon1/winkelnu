'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  addStandaloneGiftListItem,
  createGiftListRecoveryPath,
  createStandaloneGiftList,
  deleteStandaloneGiftListItem,
  GiftListAccessError,
  updateStandaloneGiftList,
} from '@/application/gifting/standalone-gift-lists'
import { GiftValidationError, validateGiftListInput, validateGiftListItemInput } from '@/domain/gifting/validation'

function field(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

function message(error: unknown): string {
  if (error instanceof GiftValidationError || error instanceof GiftListAccessError) return error.message
  if (error instanceof Error && error.message === 'GIFT_LIST_ITEM_LIMIT') return 'Je lijstje heeft het maximum van 100 wensen bereikt.'
  return 'Dat ging niet goed. Probeer het nog een keer.'
}

function editPath(shareCode: string, key?: 'gemaakt' | 'opgeslagen' | 'toegevoegd' | 'verwijderd', error?: string): string {
  const params = new URLSearchParams()
  if (key) params.set(key, '1')
  if (error) params.set('fout', error)
  const suffix = params.toString()
  return `/lootje-lijstje/lijstje/${encodeURIComponent(shareCode)}/bewerken${suffix ? `?${suffix}` : ''}`
}

export async function createGiftListAction(formData: FormData): Promise<void> {
  let shareCode: string
  try {
    const input = validateGiftListInput({
      displayName: field(formData, 'displayName'),
      title: field(formData, 'title'),
      occasion: field(formData, 'occasion'),
      budgetMin: field(formData, 'budgetMin'),
      budgetMax: field(formData, 'budgetMax'),
      eventDate: field(formData, 'eventDate'),
    })
    ;({ shareCode } = await createStandaloneGiftList(input))
  } catch (error) {
    redirect(`/lootje-lijstje/lijstje/nieuw?fout=${encodeURIComponent(message(error))}`)
  }

  redirect(editPath(shareCode, 'gemaakt'))
}

export async function updateGiftListAction(formData: FormData): Promise<void> {
  const shareCode = field(formData, 'shareCode')
  try {
    const input = validateGiftListInput({
      displayName: field(formData, 'displayName'),
      title: field(formData, 'title'),
      occasion: field(formData, 'occasion'),
      budgetMin: field(formData, 'budgetMin'),
      budgetMax: field(formData, 'budgetMax'),
      eventDate: field(formData, 'eventDate'),
    })
    await updateStandaloneGiftList(shareCode, input)
  } catch (error) {
    redirect(editPath(shareCode, undefined, message(error)))
  }

  revalidatePath(`/lootje-lijstje/lijstje/${shareCode}`)
  revalidatePath(`/lootje-lijstje/lijstje/${shareCode}/bewerken`)
  redirect(editPath(shareCode, 'opgeslagen'))
}

export async function addGiftListItemAction(formData: FormData): Promise<void> {
  const shareCode = field(formData, 'shareCode')
  try {
    const input = validateGiftListItemInput({
      itemType: field(formData, 'itemType'),
      title: field(formData, 'title'),
      externalUrl: field(formData, 'externalUrl'),
      note: field(formData, 'note'),
    })
    await addStandaloneGiftListItem(shareCode, input)
  } catch (error) {
    redirect(editPath(shareCode, undefined, message(error)))
  }

  revalidatePath(`/lootje-lijstje/lijstje/${shareCode}`)
  revalidatePath(`/lootje-lijstje/lijstje/${shareCode}/bewerken`)
  redirect(editPath(shareCode, 'toegevoegd'))
}

export async function deleteGiftListItemAction(formData: FormData): Promise<void> {
  const shareCode = field(formData, 'shareCode')
  const itemId = field(formData, 'itemId')
  try {
    await deleteStandaloneGiftListItem(shareCode, itemId)
  } catch (error) {
    redirect(editPath(shareCode, undefined, message(error)))
  }

  revalidatePath(`/lootje-lijstje/lijstje/${shareCode}`)
  revalidatePath(`/lootje-lijstje/lijstje/${shareCode}/bewerken`)
  redirect(editPath(shareCode, 'verwijderd'))
}

export async function createRecoveryLinkAction(_previousState: string | null, formData: FormData): Promise<string | null> {
  const shareCode = field(formData, 'shareCode')
  try {
    return await createGiftListRecoveryPath(shareCode)
  } catch {
    return null
  }
}

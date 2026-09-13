'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  drawGiftGroup,
  GiftGroupDrawError,
  setGiftGroupExclusionPair,
} from '@/application/gifting/gift-group-draw'
import {
  createGiftGroupOrganizerRecoveryPath,
  createGiftGroupParticipantRecoveryPath,
} from '@/application/gifting/gift-group-recovery'
import {
  addParticipantGiftListItem,
  addWinkelnuProductToParticipantList,
  createGiftGroup,
  deleteParticipantGiftListItem,
  GiftGroupAccessError,
  joinGiftGroup,
  removeGiftGroupParticipant,
  updateParticipantGiftListItem,
  updateParticipantWinkelnuProductNote,
} from '@/application/gifting/gift-groups'
import { requireGiftingEnabled } from '@/application/gifting/gifting-release'
import {
  GiftValidationError,
  validateGiftGroupInput,
  validateGiftGroupJoinInput,
  validateGiftListItemInput,
} from '@/domain/gifting/validation'

function field(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

function message(error: unknown): string {
  if (
    error instanceof GiftValidationError
    || error instanceof GiftGroupAccessError
    || error instanceof GiftGroupDrawError
  ) return error.message
  if (error instanceof Error && error.message === 'GIFT_LIST_ITEM_LIMIT') return 'Je lijstje heeft het maximum van 100 wensen bereikt.'
  if (error instanceof Error && error.message === 'GIFT_LIST_ITEM_NOT_FOUND') return 'Deze wens bestaat niet meer.'
  return 'Dat ging niet goed. Probeer het nog een keer.'
}

function participantPath(groupCode: string, key?: string, error?: string): string {
  const params = new URLSearchParams()
  if (key) params.set(key, '1')
  if (error) params.set('fout', error)
  const suffix = params.toString()
  return `/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/mijn${suffix ? `?${suffix}` : ''}`
}

function organizerPath(groupCode: string, key?: string, error?: string): string {
  const params = new URLSearchParams()
  if (key) params.set(key, '1')
  if (error) params.set('fout', error)
  const suffix = params.toString()
  return `/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/beheer${suffix ? `?${suffix}` : ''}`
}

function revalidateGiftGroup(groupCode: string): void {
  revalidatePath(`/lootje-lijstje/groep/${groupCode}`)
  revalidatePath(`/lootje-lijstje/groep/${groupCode}/beheer`)
  revalidatePath(`/lootje-lijstje/groep/${groupCode}/mijn`)
}

export async function createGiftGroupAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  let groupCode: string
  try {
    const input = validateGiftGroupInput({
      name: field(formData, 'name'),
      organizerDisplayName: field(formData, 'organizerDisplayName'),
      occasion: field(formData, 'occasion'),
      budget: field(formData, 'budget'),
      eventDate: field(formData, 'eventDate'),
    })
    ;({ groupCode } = await createGiftGroup(input))
  } catch (error) {
    redirect(`/lootje-lijstje/groep/nieuw?fout=${encodeURIComponent(message(error))}`)
  }
  redirect(organizerPath(groupCode, 'gemaakt'))
}

export async function joinGiftGroupAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  const groupCode = field(formData, 'groupCode')
  try {
    const input = validateGiftGroupJoinInput({ displayName: field(formData, 'displayName') })
    await joinGiftGroup(groupCode, input)
  } catch (error) {
    redirect(`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}?fout=${encodeURIComponent(message(error))}`)
  }
  redirect(participantPath(groupCode, 'deelname'))
}

export async function removeGiftGroupParticipantAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  const groupCode = field(formData, 'groupCode')
  try {
    await removeGiftGroupParticipant(groupCode, field(formData, 'participantId'))
  } catch (error) {
    redirect(organizerPath(groupCode, undefined, message(error)))
  }
  revalidateGiftGroup(groupCode)
  redirect(organizerPath(groupCode, 'verwijderd'))
}

export async function addGiftGroupExclusionAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  const groupCode = field(formData, 'groupCode')
  try {
    await setGiftGroupExclusionPair(
      groupCode,
      field(formData, 'participantAId'),
      field(formData, 'participantBId'),
      true,
    )
  } catch (error) {
    redirect(organizerPath(groupCode, undefined, message(error)))
  }
  revalidateGiftGroup(groupCode)
  redirect(organizerPath(groupCode, 'uitsluiting'))
}

export async function removeGiftGroupExclusionAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  const groupCode = field(formData, 'groupCode')
  try {
    await setGiftGroupExclusionPair(
      groupCode,
      field(formData, 'participantAId'),
      field(formData, 'participantBId'),
      false,
    )
  } catch (error) {
    redirect(organizerPath(groupCode, undefined, message(error)))
  }
  revalidateGiftGroup(groupCode)
  redirect(organizerPath(groupCode, 'uitsluiting'))
}

export async function drawGiftGroupAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  const groupCode = field(formData, 'groupCode')
  try {
    await drawGiftGroup(groupCode)
  } catch (error) {
    redirect(organizerPath(groupCode, undefined, message(error)))
  }
  revalidateGiftGroup(groupCode)
  redirect(organizerPath(groupCode, 'getrokken'))
}

export async function redrawGiftGroupAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  const groupCode = field(formData, 'groupCode')
  if (field(formData, 'confirmation') !== 'OPNIEUW TREKKEN') {
    redirect(organizerPath(groupCode, undefined, 'Typ exact OPNIEUW TREKKEN om de volledige trekking te vervangen.'))
  }

  try {
    await drawGiftGroup(groupCode, { redraw: true })
  } catch (error) {
    redirect(organizerPath(groupCode, undefined, message(error)))
  }
  revalidateGiftGroup(groupCode)
  redirect(organizerPath(groupCode, 'opnieuw'))
}

export async function addParticipantGiftListItemAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  const groupCode = field(formData, 'groupCode')
  try {
    const input = validateGiftListItemInput({
      itemType: field(formData, 'itemType'),
      title: field(formData, 'title'),
      externalUrl: field(formData, 'externalUrl'),
      note: field(formData, 'note'),
    })
    await addParticipantGiftListItem(groupCode, input)
  } catch (error) {
    redirect(participantPath(groupCode, undefined, message(error)))
  }
  revalidatePath(`/lootje-lijstje/groep/${groupCode}/mijn`)
  revalidatePath(`/lootje-lijstje/groep/${groupCode}/beheer`)
  redirect(participantPath(groupCode, 'toegevoegd'))
}

export async function addParticipantWinkelnuProductAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  const groupCode = field(formData, 'groupCode')
  try {
    await addWinkelnuProductToParticipantList(
      groupCode,
      field(formData, 'productSlug'),
      field(formData, 'note'),
    )
  } catch (error) {
    redirect(participantPath(groupCode, undefined, message(error)))
  }
  revalidatePath(`/lootje-lijstje/groep/${groupCode}/mijn`)
  revalidatePath(`/lootje-lijstje/groep/${groupCode}/beheer`)
  redirect(participantPath(groupCode, 'toegevoegd'))
}

export async function updateParticipantGiftListItemAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  const groupCode = field(formData, 'groupCode')
  try {
    const input = validateGiftListItemInput({
      itemType: field(formData, 'itemType'),
      title: field(formData, 'title'),
      externalUrl: field(formData, 'externalUrl'),
      note: field(formData, 'note'),
    })
    await updateParticipantGiftListItem(groupCode, field(formData, 'itemId'), input)
  } catch (error) {
    redirect(participantPath(groupCode, undefined, message(error)))
  }
  revalidatePath(`/lootje-lijstje/groep/${groupCode}/mijn`)
  redirect(participantPath(groupCode, 'bijgewerkt'))
}

export async function updateParticipantWinkelnuProductNoteAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  const groupCode = field(formData, 'groupCode')
  try {
    await updateParticipantWinkelnuProductNote(
      groupCode,
      field(formData, 'itemId'),
      field(formData, 'note'),
    )
  } catch (error) {
    redirect(participantPath(groupCode, undefined, message(error)))
  }
  revalidatePath(`/lootje-lijstje/groep/${groupCode}/mijn`)
  redirect(participantPath(groupCode, 'bijgewerkt'))
}

export async function deleteParticipantGiftListItemAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  const groupCode = field(formData, 'groupCode')
  try {
    await deleteParticipantGiftListItem(groupCode, field(formData, 'itemId'))
  } catch (error) {
    redirect(participantPath(groupCode, undefined, message(error)))
  }
  revalidatePath(`/lootje-lijstje/groep/${groupCode}/mijn`)
  revalidatePath(`/lootje-lijstje/groep/${groupCode}/beheer`)
  redirect(participantPath(groupCode, 'verwijderd'))
}

export async function createGiftGroupOrganizerRecoveryLinkAction(
  _previousState: string | null,
  formData: FormData,
): Promise<string | null> {
  requireGiftingEnabled()
  try {
    return await createGiftGroupOrganizerRecoveryPath(field(formData, 'groupCode'))
  } catch {
    return null
  }
}

export async function createGiftGroupParticipantRecoveryLinkAction(
  _previousState: string | null,
  formData: FormData,
): Promise<string | null> {
  requireGiftingEnabled()
  try {
    return await createGiftGroupParticipantRecoveryPath(field(formData, 'groupCode'))
  } catch {
    return null
  }
}

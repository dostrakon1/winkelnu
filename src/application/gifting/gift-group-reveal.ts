import 'server-only'

import type { GiftGroup, GiftGroupParticipant, GiftListWithItems } from '@/domain/gifting/types'
import { SupabaseGiftGroupRevealRepository } from '@/infrastructure/gifting/supabase-gift-group-reveal-repository'
import { getParticipantGiftGroupContext } from './gift-groups'

export class GiftGroupRevealError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GiftGroupRevealError'
  }
}

export type GiftGroupRevealContext = {
  group: GiftGroup
  participant: GiftGroupParticipant
  drawVersion: number
  recipient: {
    participantId: string
    displayName: string
  }
  recipientList: GiftListWithItems
  reservedItemIds: string[]
}

function persistenceMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : ''
  if (raw.includes('GIFT_RESERVATION_GROUP_NOT_DRAWN')) return 'De lootjes zijn nog niet getrokken.'
  if (raw.includes('GIFT_RESERVATION_GIVER_NOT_ASSIGNED')) return 'Je huidige lootje kon niet veilig worden gevonden.'
  if (raw.includes('GIFT_RESERVATION_ITEM_NOT_RECIPIENT')) return 'Deze wens hoort niet bij jouw getrokken persoon.'
  return 'Dat ging niet goed. Probeer het nog een keer.'
}

export async function getGiftGroupRevealContext(groupCode: string): Promise<GiftGroupRevealContext | null> {
  const context = await getParticipantGiftGroupContext(groupCode)
  if (!context) return null
  if (context.group.status !== 'drawn' || context.group.drawVersion < 1) {
    throw new GiftGroupRevealError('De lootjes zijn nog niet getrokken.')
  }

  const repository = new SupabaseGiftGroupRevealRepository()
  const reveal = await repository.getReveal(context.group.id, context.participant.id)
  if (!reveal || reveal.drawVersion !== context.group.drawVersion) {
    throw new GiftGroupRevealError('Je huidige lootje kon niet veilig worden gevonden.')
  }

  const [recipientList, reservedItemIds] = await Promise.all([
    repository.getRecipientList(reveal.recipientGiftListId),
    repository.listReservedItemIds(context.group.id, context.participant.id),
  ])

  if (!recipientList) throw new GiftGroupRevealError('Het lijstje van je getrokken persoon is niet meer beschikbaar.')

  return {
    group: context.group,
    participant: context.participant,
    drawVersion: reveal.drawVersion,
    recipient: {
      participantId: reveal.recipientParticipantId,
      displayName: reveal.recipientDisplayName,
    },
    recipientList,
    reservedItemIds,
  }
}

export async function setGiftItemReservation(
  groupCode: string,
  giftListItemId: string,
  reserved: boolean,
): Promise<void> {
  const context = await getParticipantGiftGroupContext(groupCode)
  if (!context) throw new GiftGroupRevealError('Deelnemerstoegang nodig.')
  if (context.group.status !== 'drawn' || context.group.drawVersion < 1) {
    throw new GiftGroupRevealError('De lootjes zijn nog niet getrokken.')
  }
  if (!giftListItemId) throw new GiftGroupRevealError('Ongeldige wens.')

  try {
    await new SupabaseGiftGroupRevealRepository().setReservation({
      groupId: context.group.id,
      giverParticipantId: context.participant.id,
      giftListItemId,
      reserved,
    })
  } catch (error) {
    throw new GiftGroupRevealError(persistenceMessage(error))
  }
}

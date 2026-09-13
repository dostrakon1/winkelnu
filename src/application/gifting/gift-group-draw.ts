import 'server-only'

import { randomInt } from 'node:crypto'
import { drawGiftAssignments } from '@/domain/gifting/draw'
import type {
  GiftGroupExclusionPair,
  GiftGroupParticipantSummary,
} from '@/domain/gifting/types'
import { SupabaseGiftGroupDrawRepository } from '@/infrastructure/gifting/supabase-gift-group-draw-repository'
import {
  getOrganizerGiftGroupContext,
  type GiftGroupOrganizerContext,
} from './gift-groups'

export class GiftGroupDrawError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GiftGroupDrawError'
  }
}

export type GiftGroupDrawContext = GiftGroupOrganizerContext & {
  exclusionPairs: GiftGroupExclusionPair[]
}

function participantExists(participants: GiftGroupParticipantSummary[], participantId: string): boolean {
  return participants.some((participant) => participant.id === participantId)
}

function mutualPairs(
  exclusions: { participantId: string; excludedRecipientId: string }[],
): GiftGroupExclusionPair[] {
  const directed = new Set(exclusions.map((item) => `${item.participantId}:${item.excludedRecipientId}`))
  const seen = new Set<string>()
  const pairs: GiftGroupExclusionPair[] = []

  for (const exclusion of exclusions) {
    if (!directed.has(`${exclusion.excludedRecipientId}:${exclusion.participantId}`)) continue
    const [participantAId, participantBId] = [exclusion.participantId, exclusion.excludedRecipientId].sort()
    const key = `${participantAId}:${participantBId}`
    if (seen.has(key)) continue
    seen.add(key)
    pairs.push({ participantAId, participantBId })
  }

  return pairs
}

function persistenceMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : ''
  if (raw.includes('GIFT_GROUP_STRUCTURE_LOCKED')) return 'Uitsluitingen kunnen na de trekking niet meer worden aangepast.'
  if (raw.includes('GIFT_GROUP_EXCLUSION_SELF')) return 'Kies twee verschillende deelnemers.'
  if (raw.includes('GIFT_GROUP_EXCLUSION_PARTICIPANT_MISMATCH')) return 'Deze deelnemers horen niet bij deze groep.'
  if (raw.includes('GIFT_GROUP_DRAW_MIN_PARTICIPANTS')) return 'Er zijn minimaal 2 deelnemers nodig om lootjes te trekken.'
  if (raw.includes('GIFT_GROUP_DRAW_STALE')) return 'De groep is ondertussen gewijzigd. Vernieuw de pagina en probeer opnieuw.'
  if (raw.includes('GIFT_GROUP_DRAW_EXCLUSION_VIOLATION')) return 'De trekking voldoet niet meer aan de actuele uitsluitingen. Probeer opnieuw.'
  if (raw.includes('GIFT_GROUP_DRAW_STATE')) return 'De lootjes zijn al getrokken of de groep is niet meer klaar voor een eerste trekking.'
  if (raw.includes('GIFT_GROUP_REDRAW_STATE')) return 'Deze groep kan op dit moment niet opnieuw worden getrokken.'
  if (raw.includes('GIFT_GROUP_DRAW_CLOSED')) return 'Deze groep is gesloten of verlopen.'
  if (raw.includes('GIFT_GROUP_DRAW_INVALID_ASSIGNMENTS')) return 'De trekking kon niet veilig worden opgeslagen. Probeer opnieuw.'
  return 'Dat ging niet goed. Probeer het nog een keer.'
}

export async function getGiftGroupDrawContext(groupCode: string): Promise<GiftGroupDrawContext | null> {
  const context = await getOrganizerGiftGroupContext(groupCode)
  if (!context) return null
  const exclusions = await new SupabaseGiftGroupDrawRepository().listExclusions(context.group.id)
  return { ...context, exclusionPairs: mutualPairs(exclusions) }
}

export async function setGiftGroupExclusionPair(
  groupCode: string,
  participantAId: string,
  participantBId: string,
  enabled: boolean,
): Promise<void> {
  const context = await getOrganizerGiftGroupContext(groupCode)
  if (!context) throw new GiftGroupDrawError('Beheer-toegang nodig.')
  if (context.group.status !== 'draft') {
    throw new GiftGroupDrawError('Uitsluitingen kunnen na de trekking niet meer worden aangepast.')
  }
  if (!participantAId || !participantBId || participantAId === participantBId) {
    throw new GiftGroupDrawError('Kies twee verschillende deelnemers.')
  }
  if (
    !participantExists(context.participants, participantAId)
    || !participantExists(context.participants, participantBId)
  ) {
    throw new GiftGroupDrawError('Deze deelnemers horen niet bij deze groep.')
  }

  try {
    await new SupabaseGiftGroupDrawRepository().setMutualExclusion(
      context.group.id,
      participantAId,
      participantBId,
      enabled,
    )
  } catch (error) {
    throw new GiftGroupDrawError(persistenceMessage(error))
  }
}

export async function drawGiftGroup(
  groupCode: string,
  options: { redraw?: boolean } = {},
): Promise<number> {
  const context = await getOrganizerGiftGroupContext(groupCode)
  if (!context) throw new GiftGroupDrawError('Beheer-toegang nodig.')

  const redraw = options.redraw === true
  if (redraw && context.group.status !== 'drawn') {
    throw new GiftGroupDrawError('Deze groep kan op dit moment niet opnieuw worden getrokken.')
  }
  if (!redraw && context.group.status !== 'draft') {
    throw new GiftGroupDrawError('De lootjes zijn al getrokken of de groep is niet meer klaar voor een eerste trekking.')
  }
  if (context.participants.length < 2) {
    throw new GiftGroupDrawError('Er zijn minimaal 2 deelnemers nodig om lootjes te trekken.')
  }

  const repository = new SupabaseGiftGroupDrawRepository()
  const exclusions = await repository.listExclusions(context.group.id)
  const result = drawGiftAssignments(
    context.participants.map((participant) => participant.id),
    exclusions,
    (upperExclusive) => randomInt(upperExclusive),
  )

  if (!result.ok) {
    if (result.reason === 'NO_VALID_DRAW') {
      throw new GiftGroupDrawError('Met deze uitsluitingen is geen geldige trekking mogelijk. Pas één of meer uitsluitingen aan.')
    }
    throw new GiftGroupDrawError('De deelnemerslijst is niet geldig voor een trekking.')
  }

  try {
    return await repository.applyDraw({
      groupId: context.group.id,
      expectedDrawVersion: context.group.drawVersion,
      assignments: result.assignments,
      redraw,
    })
  } catch (error) {
    throw new GiftGroupDrawError(persistenceMessage(error))
  }
}

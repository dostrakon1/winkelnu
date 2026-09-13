import type { GiftDrawAssignment, GiftGroupExclusion } from './types'

export type GiftDrawRandomIndex = (upperExclusive: number) => number

export type GiftDrawResult =
  | { ok: true; assignments: GiftDrawAssignment[] }
  | { ok: false; reason: 'NO_VALID_DRAW' | 'INVALID_PARTICIPANTS' }

function shuffled<T>(values: T[], randomIndex: GiftDrawRandomIndex): T[] {
  const result = [...values]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1)
    if (!Number.isInteger(swapIndex) || swapIndex < 0 || swapIndex > index) {
      throw new Error('Gift draw random source returned an invalid index.')
    }
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

export function drawGiftAssignments(
  participantIds: string[],
  exclusions: Pick<GiftGroupExclusion, 'participantId' | 'excludedRecipientId'>[],
  randomIndex: GiftDrawRandomIndex,
): GiftDrawResult {
  const uniqueParticipantIds = [...new Set(participantIds)]
  if (
    participantIds.length < 2
    || participantIds.length > 50
    || uniqueParticipantIds.length !== participantIds.length
    || participantIds.some((id) => !id)
  ) {
    return { ok: false, reason: 'INVALID_PARTICIPANTS' }
  }

  const participantSet = new Set(participantIds)
  const blocked = new Map<string, Set<string>>()

  for (const exclusion of exclusions) {
    if (
      !participantSet.has(exclusion.participantId)
      || !participantSet.has(exclusion.excludedRecipientId)
      || exclusion.participantId === exclusion.excludedRecipientId
    ) {
      return { ok: false, reason: 'INVALID_PARTICIPANTS' }
    }

    const blockedRecipients = blocked.get(exclusion.participantId) ?? new Set<string>()
    blockedRecipients.add(exclusion.excludedRecipientId)
    blocked.set(exclusion.participantId, blockedRecipients)
  }

  const eligibleRecipients = new Map<string, string[]>()
  for (const giverId of participantIds) {
    const blockedRecipients = blocked.get(giverId) ?? new Set<string>()
    const eligible = participantIds.filter(
      (recipientId) => recipientId !== giverId && !blockedRecipients.has(recipientId),
    )
    if (eligible.length === 0) return { ok: false, reason: 'NO_VALID_DRAW' }
    eligibleRecipients.set(giverId, shuffled(eligible, randomIndex))
  }

  // Process constrained givers first. The initial shuffle randomizes ties while
  // sorting by option count keeps the augmenting-path matcher efficient.
  const giverOrder = shuffled(participantIds, randomIndex)
    .sort((left, right) => (
      (eligibleRecipients.get(left)?.length ?? 0) - (eligibleRecipients.get(right)?.length ?? 0)
    ))

  const recipientToGiver = new Map<string, string>()
  const giverToRecipient = new Map<string, string>()

  function tryAssign(giverId: string, visitedRecipients: Set<string>): boolean {
    const candidates = eligibleRecipients.get(giverId) ?? []
    for (const recipientId of candidates) {
      if (visitedRecipients.has(recipientId)) continue
      visitedRecipients.add(recipientId)

      const existingGiver = recipientToGiver.get(recipientId)
      if (!existingGiver || tryAssign(existingGiver, visitedRecipients)) {
        recipientToGiver.set(recipientId, giverId)
        giverToRecipient.set(giverId, recipientId)
        return true
      }
    }
    return false
  }

  for (const giverId of giverOrder) {
    if (!tryAssign(giverId, new Set<string>())) {
      return { ok: false, reason: 'NO_VALID_DRAW' }
    }
  }

  const assignments = participantIds.map((giverParticipantId) => ({
    giverParticipantId,
    recipientParticipantId: giverToRecipient.get(giverParticipantId) ?? '',
  }))

  if (assignments.some((assignment) => !assignment.recipientParticipantId)) {
    return { ok: false, reason: 'NO_VALID_DRAW' }
  }

  return { ok: true, assignments }
}

import { describe, expect, it } from 'vitest'
import { drawGiftAssignments } from './draw'

function zeroRandom() {
  return 0
}

function assertValidDraw(
  participantIds: string[],
  assignments: { giverParticipantId: string; recipientParticipantId: string }[],
) {
  expect(assignments).toHaveLength(participantIds.length)
  expect(new Set(assignments.map((item) => item.giverParticipantId))).toEqual(new Set(participantIds))
  expect(new Set(assignments.map((item) => item.recipientParticipantId))).toEqual(new Set(participantIds))
  for (const assignment of assignments) {
    expect(assignment.giverParticipantId).not.toBe(assignment.recipientParticipantId)
  }
}

describe('Lootje & Lijstje draw engine', () => {
  it('draws two participants reciprocally', () => {
    const result = drawGiftAssignments(['a', 'b'], [], zeroRandom)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.assignments).toEqual([
      { giverParticipantId: 'a', recipientParticipantId: 'b' },
      { giverParticipantId: 'b', recipientParticipantId: 'a' },
    ])
  })

  it.each([3, 10, 50])('creates one complete assignment for %s participants', (count) => {
    const participants = Array.from({ length: count }, (_, index) => `p-${index + 1}`)
    const result = drawGiftAssignments(participants, [], (upperExclusive) => upperExclusive - 1)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    assertValidDraw(participants, result.assignments)
  })

  it('respects directed exclusions', () => {
    const participants = ['a', 'b', 'c', 'd']
    const exclusions = [
      { participantId: 'a', excludedRecipientId: 'b' },
      { participantId: 'b', excludedRecipientId: 'a' },
      { participantId: 'c', excludedRecipientId: 'd' },
    ]
    const result = drawGiftAssignments(participants, exclusions, zeroRandom)
    expect(result.ok).toBe(true)
    if (!result.ok) return

    assertValidDraw(participants, result.assignments)
    for (const exclusion of exclusions) {
      expect(result.assignments).not.toContainEqual({
        giverParticipantId: exclusion.participantId,
        recipientParticipantId: exclusion.excludedRecipientId,
      })
    }
  })

  it('returns NO_VALID_DRAW when exclusions make a perfect matching impossible', () => {
    const result = drawGiftAssignments(
      ['a', 'b', 'c'],
      [
        { participantId: 'a', excludedRecipientId: 'b' },
        { participantId: 'a', excludedRecipientId: 'c' },
      ],
      zeroRandom,
    )
    expect(result).toEqual({ ok: false, reason: 'NO_VALID_DRAW' })
  })

  it('rejects duplicate participant identities and foreign exclusion identities', () => {
    expect(drawGiftAssignments(['a', 'a'], [], zeroRandom)).toEqual({
      ok: false,
      reason: 'INVALID_PARTICIPANTS',
    })
    expect(drawGiftAssignments(
      ['a', 'b'],
      [{ participantId: 'a', excludedRecipientId: 'c' }],
      zeroRandom,
    )).toEqual({ ok: false, reason: 'INVALID_PARTICIPANTS' })
  })

  it('is repeatable with an injected deterministic random source', () => {
    const participants = ['a', 'b', 'c', 'd', 'e']
    const first = drawGiftAssignments(participants, [], zeroRandom)
    const second = drawGiftAssignments(participants, [], zeroRandom)
    expect(first).toEqual(second)
  })
})

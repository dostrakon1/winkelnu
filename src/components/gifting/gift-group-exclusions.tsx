import type {
  GiftGroupExclusionPair,
  GiftGroupParticipantSummary,
  GiftGroupStatus,
} from '@/domain/gifting/types'

type GiftGroupExclusionsProps = {
  groupCode: string
  status: GiftGroupStatus
  participants: GiftGroupParticipantSummary[]
  pairs: GiftGroupExclusionPair[]
  addAction: (formData: FormData) => void | Promise<void>
  removeAction: (formData: FormData) => void | Promise<void>
}

export function GiftGroupExclusions({
  groupCode,
  status,
  participants,
  pairs,
  addAction,
  removeAction,
}: GiftGroupExclusionsProps) {
  const nameById = new Map(participants.map((participant) => [participant.id, participant.displayName]))
  const editable = status === 'draft'

  return (
    <section className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-6 shadow-[var(--wn-shadow-xs)] sm:p-8">
      <p className="wn-eyebrow">Uitsluitingen</p>
      <h2 className="wn-heading mt-2 text-3xl">Wie mogen elkaar niet trekken?</h2>
      <p className="wn-body-muted mt-3 leading-7">
        Handig voor partners of andere combinaties die je wilt voorkomen. Een paar werkt in beide richtingen.
      </p>

      {editable && participants.length >= 2 ? (
        <form action={addAction} className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <input type="hidden" name="groupCode" value={groupCode} />
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Persoon 1</span>
            <select name="participantAId" required defaultValue="" className="wn-input">
              <option value="" disabled>Kies deelnemer</option>
              {participants.map((participant) => (
                <option key={participant.id} value={participant.id}>{participant.displayName}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Persoon 2</span>
            <select name="participantBId" required defaultValue="" className="wn-input">
              <option value="" disabled>Kies deelnemer</option>
              {participants.map((participant) => (
                <option key={participant.id} value={participant.id}>{participant.displayName}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="wn-button wn-button-secondary">Voeg toe</button>
        </form>
      ) : editable ? (
        <p className="mt-5 rounded-xl bg-[var(--wn-cream)] p-4 text-sm text-[var(--wn-text-muted)]">
          Voeg eerst minimaal twee deelnemers toe voordat je uitsluitingen instelt.
        </p>
      ) : (
        <p className="mt-5 rounded-xl bg-[var(--wn-petrol-soft)] p-4 text-sm font-semibold text-[var(--wn-petrol-deep)]">
          De uitsluitingen zijn vergrendeld omdat de lootjes al zijn getrokken.
        </p>
      )}

      <div className="mt-6 space-y-3">
        {pairs.length > 0 ? pairs.map((pair) => (
          <div key={`${pair.participantAId}:${pair.participantBId}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--wn-border)] bg-[var(--wn-cream)] px-4 py-3">
            <span className="text-sm font-bold text-[var(--wn-petrol-deep)]">
              {nameById.get(pair.participantAId) ?? 'Deelnemer'} ↔ {nameById.get(pair.participantBId) ?? 'Deelnemer'}
            </span>
            {editable ? (
              <form action={removeAction}>
                <input type="hidden" name="groupCode" value={groupCode} />
                <input type="hidden" name="participantAId" value={pair.participantAId} />
                <input type="hidden" name="participantBId" value={pair.participantBId} />
                <button type="submit" className="inline-flex min-h-10 items-center text-sm font-semibold text-[var(--wn-text-muted)] hover:text-[var(--wn-petrol-deep)]">
                  Verwijder
                </button>
              </form>
            ) : null}
          </div>
        )) : (
          <p className="text-sm text-[var(--wn-text-muted)]">Nog geen uitsluitingen ingesteld.</p>
        )}
      </div>
    </section>
  )
}

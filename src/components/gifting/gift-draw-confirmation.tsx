import type { GiftGroupStatus } from '@/domain/gifting/types'

type GiftDrawConfirmationProps = {
  groupCode: string
  status: GiftGroupStatus
  participantCount: number
  drawVersion: number
  drawAction: (formData: FormData) => void | Promise<void>
  redrawAction: (formData: FormData) => void | Promise<void>
}

export function GiftDrawConfirmation({
  groupCode,
  status,
  participantCount,
  drawVersion,
  drawAction,
  redrawAction,
}: GiftDrawConfirmationProps) {
  if (status === 'closed') {
    return (
      <section className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-6 shadow-[var(--wn-shadow-xs)]">
        <p className="wn-eyebrow">Trekking</p>
        <h2 className="wn-ui-heading mt-2 text-xl">Deze groep is gesloten.</h2>
      </section>
    )
  }

  if (status === 'draft') {
    const canDraw = participantCount >= 2
    return (
      <section className="rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.18)] bg-[var(--wn-petrol-soft)] p-6 sm:p-7">
        <span className="inline-flex rounded-full border border-[color:rgba(18,59,58,0.14)] bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--wn-petrol)]">Klaar voor de trekking</span>
        <h2 className="wn-heading mt-4 text-2xl">Trek de lootjes.</h2>
        <p className="wn-body-muted mt-3 text-sm leading-6">
          Winkelnu maakt één volledige geldige verdeling. Niemand trekt zichzelf en alle ingestelde uitsluitingen worden gerespecteerd.
        </p>
        <p className="mt-4 text-sm font-bold text-[var(--wn-petrol-deep)]">
          {participantCount === 1 ? '1 deelnemer' : `${participantCount} deelnemers`}
        </p>
        <form action={drawAction} className="mt-5">
          <input type="hidden" name="groupCode" value={groupCode} />
          <button type="submit" disabled={!canDraw} className="wn-button wn-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50">
            Trek de lootjes ✦
          </button>
        </form>
        {!canDraw ? <p className="mt-3 text-xs leading-5 text-[var(--wn-text-muted)]">Er zijn minimaal twee deelnemers nodig.</p> : null}
      </section>
    )
  }

  return (
    <section className="rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.18)] bg-[var(--wn-petrol-soft)] p-6 sm:p-7">
      <span className="inline-flex rounded-full border border-[color:rgba(18,59,58,0.14)] bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--wn-petrol)]">Lootjes getrokken ✓</span>
      <h2 className="wn-heading mt-4 text-2xl">De trekking staat vast.</h2>
      <p className="wn-body-muted mt-3 text-sm leading-6">
        De geheime verdeling is veilig opgeslagen als trekking #{drawVersion}. Deelnemers krijgen hun eigen resultaat pas in L6 te zien.
      </p>

      <div className="mt-6 border-t border-[color:rgba(18,59,58,0.14)] pt-5">
        <p className="text-sm font-bold text-[var(--wn-petrol-deep)]">Opnieuw trekken</p>
        <p className="mt-2 text-xs leading-5 text-[var(--wn-text-muted)]">
          Dit vervangt de volledige huidige trekking. Typ exact <strong>OPNIEUW TREKKEN</strong> om te bevestigen.
        </p>
        <form action={redrawAction} className="mt-4 space-y-3">
          <input type="hidden" name="groupCode" value={groupCode} />
          <input
            name="confirmation"
            required
            autoComplete="off"
            className="wn-input"
            placeholder="OPNIEUW TREKKEN"
          />
          <button type="submit" className="wn-button wn-button-secondary w-full">Trek alles opnieuw</button>
        </form>
      </div>
    </section>
  )
}

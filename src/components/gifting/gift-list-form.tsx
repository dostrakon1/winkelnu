import type { GiftList } from '@/domain/gifting/types'

type GiftListFormProps = {
  action: (formData: FormData) => void | Promise<void>
  submitLabel: string
  shareCode?: string
  list?: GiftList
}

function amount(cents: number | undefined): string {
  if (cents === undefined) return ''
  return (cents / 100).toFixed(2).replace('.', ',').replace(',00', '')
}

export function GiftListForm({ action, submitLabel, shareCode, list }: GiftListFormProps) {
  return (
    <form action={action} className="gift-premium-form">
      {shareCode ? <input type="hidden" name="shareCode" value={shareCode} /> : null}

      {!shareCode ? (
        <div className="gift-premium-form-header">
          <p className="gift-kicker">Mijn lijstje</p>
          <h2>Begin met de basis.</h2>
          <p>Na deze stap voeg je pas de echte wensen toe. Je kunt je lijstje later altijd aanpassen.</p>
        </div>
      ) : null}

      <div className="gift-premium-form-grid">
        <label className="gift-premium-field">
          <span className="gift-premium-field-label"><span>Jouw naam</span></span>
          <input
            name="displayName"
            required
            minLength={2}
            maxLength={80}
            defaultValue={list?.displayName}
            autoComplete="name"
            className="wn-input"
            placeholder="Vul je naam in"
          />
        </label>

        <label className="gift-premium-field">
          <span className="gift-premium-field-label"><span>Waarvoor is het lijstje?</span></span>
          <select name="occasion" defaultValue={list?.occasion ?? 'sinterklaas'} className="wn-input">
            <option value="sinterklaas">Sinterklaas</option>
            <option value="kerst">Kerst / Secret Santa</option>
            <option value="verjaardag">Verjaardag</option>
            <option value="anders">Iets anders</option>
          </select>
        </label>

        <label className="gift-premium-field gift-premium-field-wide">
          <span className="gift-premium-field-label">
            <span>Titel</span>
            <small>optioneel</small>
          </span>
          <input
            name="title"
            maxLength={100}
            defaultValue={list?.title}
            className="wn-input"
            placeholder="Bijvoorbeeld Mijn Sinterklaaslijstje"
          />
        </label>

        <label className="gift-premium-field">
          <span className="gift-premium-field-label">
            <span>Budget vanaf</span>
            <small>optioneel</small>
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--wn-text-muted)]">€</span>
            <input
              name="budgetMin"
              inputMode="decimal"
              defaultValue={amount(list?.budgetMinCents)}
              className="wn-input pl-9"
              placeholder="10"
            />
          </div>
        </label>

        <label className="gift-premium-field">
          <span className="gift-premium-field-label">
            <span>Budget tot</span>
            <small>optioneel</small>
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--wn-text-muted)]">€</span>
            <input
              name="budgetMax"
              inputMode="decimal"
              defaultValue={amount(list?.budgetMaxCents)}
              className="wn-input pl-9"
              placeholder="50"
            />
          </div>
        </label>

        <label className="gift-premium-field gift-premium-field-wide">
          <span className="gift-premium-field-label">
            <span>Datum</span>
            <small>optioneel</small>
          </span>
          <input name="eventDate" type="date" defaultValue={list?.eventDate} className="wn-input" />
        </label>
      </div>

      <div className="gift-premium-help">
        <strong className="text-[var(--gift-petrol-deep)]">Geen account nodig.</strong><br />
        Je krijgt na het aanmaken een geheime beheer-toegang. De link die je met anderen deelt is alleen om je wensen te bekijken.
      </div>

      <div className="gift-premium-form-actions">
        <button type="submit" className="wn-button wn-button-primary">
          {submitLabel}
        </button>
        {!shareCode ? <span>Je kunt alles later wijzigen</span> : null}
      </div>
    </form>
  )
}

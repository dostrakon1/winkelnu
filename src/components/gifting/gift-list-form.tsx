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
    <form action={action} className="space-y-6">
      {shareCode ? <input type="hidden" name="shareCode" value={shareCode} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Jouw naam</span>
          <input
            name="displayName"
            required
            minLength={2}
            maxLength={80}
            defaultValue={list?.displayName}
            autoComplete="name"
            className="wn-input"
            placeholder="Bijvoorbeeld Dogan"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Waarvoor is het lijstje?</span>
          <select name="occasion" defaultValue={list?.occasion ?? 'sinterklaas'} className="wn-input">
            <option value="sinterklaas">Sinterklaas</option>
            <option value="kerst">Kerst / Secret Santa</option>
            <option value="verjaardag">Verjaardag</option>
            <option value="anders">Iets anders</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Titel <span className="font-normal text-[var(--wn-text-muted)]">(optioneel)</span></span>
        <input
          name="title"
          maxLength={100}
          defaultValue={list?.title}
          className="wn-input"
          placeholder="Bijvoorbeeld Mijn Sinterklaaslijstje"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Vanaf € <span className="font-normal text-[var(--wn-text-muted)]">(optioneel)</span></span>
          <input
            name="budgetMin"
            inputMode="decimal"
            defaultValue={amount(list?.budgetMinCents)}
            className="wn-input"
            placeholder="10"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Tot € <span className="font-normal text-[var(--wn-text-muted)]">(optioneel)</span></span>
          <input
            name="budgetMax"
            inputMode="decimal"
            defaultValue={amount(list?.budgetMaxCents)}
            className="wn-input"
            placeholder="50"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Datum <span className="font-normal text-[var(--wn-text-muted)]">(optioneel)</span></span>
          <input name="eventDate" type="date" defaultValue={list?.eventDate} className="wn-input" />
        </label>
      </div>

      <p className="text-sm leading-6 text-[var(--wn-text-muted)]">Geen account nodig. Je krijgt straks een geheime beheer-toegang voor dit lijstje.</p>

      <button type="submit" className="wn-button wn-button-primary w-full sm:w-auto">
        {submitLabel}
      </button>
    </form>
  )
}

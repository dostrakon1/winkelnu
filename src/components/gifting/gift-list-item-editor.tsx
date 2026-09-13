'use client'

import { useActionState } from 'react'
import {
  initialGiftListItemFormState,
  type GiftListItemFormState,
} from '@/domain/gifting/gift-list-item-form-state'

type GiftListItemEditorProps = {
  action: (previousState: GiftListItemFormState, formData: FormData) => Promise<GiftListItemFormState>
  shareCode?: string
  contextFields?: Record<string, string>
}

export function GiftListItemEditor({ action, shareCode, contextFields }: GiftListItemEditorProps) {
  const hiddenFields = contextFields ?? (shareCode ? { shareCode } : {})
  const [state, formAction, pending] = useActionState(action, initialGiftListItemFormState)

  return (
    <form action={formAction} className="space-y-5 rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-5 shadow-[var(--wn-shadow-xs)] sm:p-6">
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <div>
        <p className="wn-eyebrow">Eigen wens of externe link</p>
        <h2 className="wn-heading mt-2 text-2xl">Staat het niet op Winkelnu?</h2>
        <p className="wn-body-muted mt-2 text-sm">Schrijf zelf een wens op of voeg een beveiligde productlink van een andere website toe.</p>
      </div>

      {state.error ? (
        <div role="alert" className="rounded-xl border border-[#d9a99f] bg-[#fff3ef] p-4 text-sm font-semibold leading-6 text-[#7f2d23]">
          {state.error}
        </div>
      ) : null}

      <div key={state.revision} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Type wens</span>
            <select name="itemType" defaultValue={state.values.itemType} className="wn-input">
              <option value="text">Zelf iets opschrijven</option>
              <option value="external_link">Productlink toevoegen</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Wens</span>
            <input
              name="title"
              required
              minLength={2}
              maxLength={120}
              defaultValue={state.values.title}
              className="wn-input"
              placeholder="Bijvoorbeeld Een goed kookboek"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Productlink <span className="font-normal text-[var(--wn-text-muted)]">(alleen bij productlink)</span></span>
          <input
            name="externalUrl"
            type="url"
            inputMode="url"
            defaultValue={state.values.externalUrl}
            className="wn-input"
            placeholder="https://..."
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Toelichting <span className="font-normal text-[var(--wn-text-muted)]">(optioneel)</span></span>
          <textarea
            name="note"
            rows={3}
            maxLength={300}
            defaultValue={state.values.note}
            className="wn-input resize-y"
            placeholder="Bijvoorbeeld: liefst zwart of donkerblauw"
          />
        </label>
      </div>

      <button type="submit" disabled={pending} className="wn-button wn-button-primary w-full disabled:cursor-wait disabled:opacity-65 sm:w-auto">
        {pending ? 'Bezig…' : '+ Voeg wens toe'}
      </button>
    </form>
  )
}

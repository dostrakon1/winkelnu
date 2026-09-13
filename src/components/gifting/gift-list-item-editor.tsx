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
    <form id="eigen-wens" action={formAction} className="gift-wishlist-panel gift-own-wish-form">
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <div className="gift-wishlist-panel-head">
        <div>
          <p className="gift-kicker">Eigen wens of externe link</p>
          <h2>Staat het niet op Winkelnu?</h2>
          <p>Schrijf het gewoon zelf op of voeg een link toe van een andere website. Een korte toelichting maakt je wens extra duidelijk.</p>
        </div>
        <span className="gift-own-wish-badge">Vrij toevoegen</span>
      </div>

      {state.error ? (
        <div role="alert" className="gift-wishlist-notice is-error">
          {state.error}
        </div>
      ) : null}

      <div key={state.revision} className="gift-own-wish-fields">
        <label>
          <span>Type wens</span>
          <select name="itemType" defaultValue={state.values.itemType} className="wn-input">
            <option value="text">Zelf iets opschrijven</option>
            <option value="external_link">Productlink toevoegen</option>
          </select>
          <small>Kies een productlink als je al precies weet welk artikel je bedoelt.</small>
        </label>

        <label>
          <span>Wat wil je graag?</span>
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

        <label className="gift-own-wish-wide">
          <span>Productlink <small>optioneel</small></span>
          <input
            name="externalUrl"
            type="url"
            inputMode="url"
            defaultValue={state.values.externalUrl}
            className="wn-input"
            placeholder="https://..."
          />
        </label>

        <label className="gift-own-wish-wide">
          <span>Toelichting <small>optioneel</small></span>
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

      <div className="gift-own-wish-actions">
        <button type="submit" disabled={pending} className="wn-button wn-button-primary disabled:cursor-wait disabled:opacity-65">
          {pending ? 'Bezig…' : '+ Voeg wens toe'}
        </button>
        <span>Je kunt de wens later altijd nog aanpassen.</span>
      </div>
    </form>
  )
}

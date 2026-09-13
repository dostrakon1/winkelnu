type GiftListItemEditorProps = {
  action: (formData: FormData) => void | Promise<void>
  shareCode: string
}

export function GiftListItemEditor({ action, shareCode }: GiftListItemEditorProps) {
  return (
    <form action={action} className="space-y-5 rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-5 shadow-[var(--wn-shadow-xs)] sm:p-6">
      <input type="hidden" name="shareCode" value={shareCode} />

      <div>
        <p className="wn-eyebrow">Nieuwe wens</p>
        <h2 className="wn-heading mt-2 text-2xl">Wat zou je graag willen?</h2>
        <p className="wn-body-muted mt-2 text-sm">In L1 kun je een eigen wens of een productlink toevoegen. Winkelnu-producten volgen in L2.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Type wens</span>
          <select name="itemType" defaultValue="text" className="wn-input">
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
          className="wn-input resize-y"
          placeholder="Bijvoorbeeld: liefst zwart of donkerblauw"
        />
      </label>

      <button type="submit" className="wn-button wn-button-primary w-full sm:w-auto">
        + Voeg wens toe
      </button>
    </form>
  )
}

type GiftGroupFormProps = {
  action: (formData: FormData) => void | Promise<void>
}

export function GiftGroupForm({ action }: GiftGroupFormProps) {
  return (
    <form action={action} className="gift-premium-form">
      <div className="gift-premium-form-header">
        <p className="gift-kicker">Nieuwe groep</p>
        <h2>De basis in één keer goed.</h2>
        <p>Jij wordt automatisch de eerste deelnemer én organisator. Na het aanmaken krijg je direct de uitnodigingslink voor de rest.</p>
      </div>

      <div className="gift-premium-form-grid">
        <label className="gift-premium-field gift-premium-field-wide">
          <span className="gift-premium-field-label">
            <span>Naam van de groep</span>
            <small>2–100 tekens</small>
          </span>
          <input name="name" required minLength={2} maxLength={100} className="wn-input" placeholder="Bijvoorbeeld Sinterklaas familie 2026" />
        </label>

        <label className="gift-premium-field">
          <span className="gift-premium-field-label"><span>Jouw naam</span></span>
          <input name="organizerDisplayName" required minLength={2} maxLength={80} className="wn-input" placeholder="Bijvoorbeeld Dogan" autoComplete="name" />
        </label>

        <label className="gift-premium-field">
          <span className="gift-premium-field-label"><span>Gelegenheid</span></span>
          <select name="occasion" defaultValue="sinterklaas" className="wn-input">
            <option value="sinterklaas">Sinterklaas</option>
            <option value="kerst">Kerst / Secret Santa</option>
            <option value="verjaardag">Verjaardag / feestje</option>
            <option value="anders">Anders</option>
          </select>
        </label>

        <label className="gift-premium-field">
          <span className="gift-premium-field-label">
            <span>Budget per cadeau</span>
            <small>optioneel</small>
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--wn-text-muted)]">€</span>
            <input name="budget" inputMode="decimal" className="wn-input pl-9" placeholder="25,00" />
          </div>
        </label>

        <label className="gift-premium-field">
          <span className="gift-premium-field-label">
            <span>Datum</span>
            <small>optioneel</small>
          </span>
          <input name="eventDate" type="date" className="wn-input" />
        </label>
      </div>

      <div className="gift-premium-help">
        <strong className="text-[var(--gift-petrol-deep)]">Na het aanmaken</strong><br />
        Je krijgt één uitnodigingslink om te delen via bijvoorbeeld WhatsApp. Deelnemers hoeven alleen hun naam in te vullen — geen e-mail, telefoonnummer of account.
      </div>

      <div className="gift-premium-form-actions">
        <button type="submit" className="wn-button wn-button-primary">Maak de groep →</button>
        <span>Maximaal 50 deelnemers</span>
      </div>
    </form>
  )
}

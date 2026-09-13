type GiftGroupFormProps = {
  action: (formData: FormData) => void | Promise<void>
}

export function GiftGroupForm({ action }: GiftGroupFormProps) {
  return (
    <form action={action} className="space-y-6 rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-6 shadow-[var(--wn-shadow-sm)] sm:p-8">
      <div>
        <p className="wn-eyebrow">Nieuwe groep</p>
        <h2 className="wn-heading mt-2 text-3xl">Wie doen er mee?</h2>
        <p className="wn-body-muted mt-3 max-w-2xl leading-7">Maak de groep aan zonder account. Jij wordt automatisch als eerste deelnemer toegevoegd en krijgt daarnaast het beheer over de groep.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Naam van de groep</span>
          <input name="name" required minLength={2} maxLength={100} className="wn-input" placeholder="Bijvoorbeeld Sinterklaas familie 2026" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Jouw naam</span>
          <input name="organizerDisplayName" required minLength={2} maxLength={80} className="wn-input" placeholder="Dogan" autoComplete="name" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Gelegenheid</span>
          <select name="occasion" defaultValue="sinterklaas" className="wn-input">
            <option value="sinterklaas">Sinterklaas</option>
            <option value="kerst">Kerst / Secret Santa</option>
            <option value="verjaardag">Verjaardag / feestje</option>
            <option value="anders">Anders</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Budget per cadeau <span className="font-normal text-[var(--wn-text-muted)]">(optioneel)</span></span>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--wn-text-muted)]">€</span>
            <input name="budget" inputMode="decimal" className="wn-input pl-9" placeholder="25,00" />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Datum <span className="font-normal text-[var(--wn-text-muted)]">(optioneel)</span></span>
          <input name="eventDate" type="date" className="wn-input" />
        </label>
      </div>

      <div className="rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] p-4 text-sm leading-6 text-[var(--wn-text-muted)]">
        Na het aanmaken krijg je één uitnodigingslink. Die kun je via WhatsApp delen. Deelnemers vullen alleen hun naam in — geen e-mail, telefoonnummer of account.
      </div>

      <button type="submit" className="wn-button wn-button-primary w-full sm:w-auto">Maak de groep →</button>
    </form>
  )
}

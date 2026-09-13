type GiftGroupJoinFormProps = {
  action: (formData: FormData) => void | Promise<void>
  groupCode: string
}

export function GiftGroupJoinForm({ action, groupCode }: GiftGroupJoinFormProps) {
  return (
    <form action={action} className="gift-join-card">
      <input type="hidden" name="groupCode" value={groupCode} />
      <p className="gift-kicker">Doe mee</p>
      <h2 className="mt-2 font-[var(--wn-font-display)] text-3xl font-semibold tracking-[-0.04em] text-[var(--gift-petrol-deep)]">Hoe mogen we je noemen?</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--gift-muted)]">Alleen je naam is nodig. Die is zichtbaar voor de andere deelnemers van deze groep.</p>

      <label className="gift-premium-field mt-6">
        <span className="gift-premium-field-label"><span>Jouw naam</span></span>
        <input name="displayName" required minLength={2} maxLength={80} className="wn-input" placeholder="Vul je naam in" autoComplete="name" />
      </label>

      <div className="gift-premium-help mt-5">
        Gebruikt iemand al dezelfde naam? Voeg dan een initiaal of andere korte herkenning toe.
      </div>

      <button type="submit" className="wn-button wn-button-primary mt-6 w-full">Ik doe mee →</button>
      <p className="mt-3 text-center text-xs font-semibold leading-5 text-[var(--gift-muted)]">Geen account, e-mail of telefoonnummer nodig.</p>
    </form>
  )
}

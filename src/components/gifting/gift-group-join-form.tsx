type GiftGroupJoinFormProps = {
  action: (formData: FormData) => void | Promise<void>
  groupCode: string
}

export function GiftGroupJoinForm({ action, groupCode }: GiftGroupJoinFormProps) {
  return (
    <form action={action} className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-6 shadow-[var(--wn-shadow-sm)] sm:p-8">
      <input type="hidden" name="groupCode" value={groupCode} />
      <p className="wn-eyebrow">Doe mee</p>
      <h2 className="wn-heading mt-2 text-2xl sm:text-3xl">Hoe mogen we je noemen?</h2>
      <p className="wn-body-muted mt-3 leading-7">Alleen je naam is nodig. Die is zichtbaar voor de andere deelnemers van deze groep.</p>

      <label className="mt-6 block">
        <span className="mb-2 block text-sm font-bold text-[var(--wn-petrol-deep)]">Jouw naam</span>
        <input name="displayName" required minLength={2} maxLength={80} className="wn-input" placeholder="Bijvoorbeeld Dogan" autoComplete="name" />
      </label>

      <div className="mt-5 rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] p-4 text-sm leading-6 text-[var(--wn-text-muted)]">
        Gebruikt iemand al dezelfde naam? Voeg dan een initiaal of andere herkenning toe, bijvoorbeeld “Dogan A.”.
      </div>

      <button type="submit" className="wn-button wn-button-primary mt-6 w-full sm:w-auto">Ik doe mee →</button>
    </form>
  )
}

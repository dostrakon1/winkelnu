import { deleteGiftGroupAction } from '@/app/lootje-lijstje/groep/delete-actions'

export function GiftGroupDeletePanel({ groupCode }: { groupCode: string }) {
  return (
    <section className="rounded-[var(--wn-radius-xl)] border border-[#d9a99f] bg-[#fff8f5] p-5 sm:p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8a3a2d]">Groep verwijderen</p>
      <h2 className="wn-ui-heading mt-2 text-xl">Verwijder de hele groep.</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--wn-text-muted)]">Dit verwijdert de groep, deelnemers, wensen, trekking, uitsluitingen en eventuele “geregeld”-markeringen definitief. Deze actie kan niet worden teruggedraaid.</p>
      <form action={deleteGiftGroupAction} className="mt-5 space-y-3">
        <input type="hidden" name="groupCode" value={groupCode} />
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-[#7f2d23]">Typ VERWIJDER GROEP</span>
          <input name="confirmation" autoComplete="off" className="wn-input" placeholder="VERWIJDER GROEP" />
        </label>
        <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#b96c5c] bg-white px-4 text-sm font-extrabold text-[#7f2d23] transition hover:bg-[#fff0eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b96c5c]">
          Groep definitief verwijderen
        </button>
      </form>
    </section>
  )
}

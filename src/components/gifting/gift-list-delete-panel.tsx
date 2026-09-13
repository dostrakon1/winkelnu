import { deleteStandaloneGiftListAction } from '@/app/lootje-lijstje/delete-actions'

export function GiftListDeletePanel({ shareCode }: { shareCode: string }) {
  return (
    <section className="rounded-[var(--wn-radius-xl)] border border-[#d9a99f] bg-[#fff8f5] p-5 sm:p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8a3a2d]">Lijstje verwijderen</p>
      <h2 className="wn-ui-heading mt-2 text-xl">Verwijder al je lijstgegevens.</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--wn-text-muted)]">Dit verwijdert het lijstje, alle wensen en de bijbehorende geheime toegang definitief. Deze actie kan niet worden teruggedraaid.</p>
      <form action={deleteStandaloneGiftListAction} className="mt-5 space-y-3">
        <input type="hidden" name="shareCode" value={shareCode} />
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-[#7f2d23]">Typ VERWIJDER LIJSTJE</span>
          <input name="confirmation" autoComplete="off" className="wn-input" placeholder="VERWIJDER LIJSTJE" />
        </label>
        <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#b96c5c] bg-white px-4 text-sm font-extrabold text-[#7f2d23] transition hover:bg-[#fff0eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b96c5c]">
          Lijstje definitief verwijderen
        </button>
      </form>
    </section>
  )
}

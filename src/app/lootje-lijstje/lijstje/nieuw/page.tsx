import type { Metadata } from 'next'
import Link from 'next/link'
import { createGiftListAction } from '@/app/lootje-lijstje/actions'
import { GiftListForm } from '@/components/gifting/gift-list-form'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export const metadata: Metadata = {
  title: 'Nieuw verlanglijstje',
  description: 'Maak zonder account een verlanglijstje op Winkelnu.',
  robots: { index: false, follow: false },
}

export default async function NewGiftListPage({
  searchParams,
}: {
  searchParams: Promise<{ fout?: string | string[] }>
}) {
  const query = await searchParams
  const rawError = Array.isArray(query.fout) ? query.fout[0] : query.fout

  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud" className="wn-container py-10 sm:py-14">
        <Link href="/lootje-lijstje" className="inline-flex min-h-10 items-center text-sm font-bold text-[var(--wn-petrol)] hover:underline">← Lootje &amp; Lijstje</Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <section className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-6 shadow-[var(--wn-shadow-sm)] sm:p-8">
            <p className="wn-eyebrow">Mijn lijstje</p>
            <h1 className="wn-heading mt-3 text-3xl sm:text-4xl">Maak je verlanglijstje.</h1>
            <p className="wn-body-muted mt-4 max-w-2xl">Begin met een paar basisgegevens. Daarna voeg je je wensen toe en krijg je een link die je met anderen kunt delen.</p>

            {rawError ? (
              <div role="alert" className="mt-6 rounded-xl border border-[#d9a99f] bg-[#fff3ef] p-4 text-sm font-semibold leading-6 text-[#7f2d23]">
                {rawError}
              </div>
            ) : null}

            <div className="mt-8">
              <GiftListForm action={createGiftListAction} submitLabel="Maak mijn lijstje →" />
            </div>
          </section>

          <aside className="rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.12)] bg-[var(--wn-petrol-soft)] p-5 sm:p-6">
            <p className="wn-eyebrow">Geen login nodig</p>
            <h2 className="wn-ui-heading mt-3 text-xl">Licht en privé.</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--wn-text-muted)]">
              <li>• Geen wachtwoord of account.</li>
              <li>• Geen verplicht e-mailadres.</li>
              <li>• Je gedeelde lijstje kan niet door Google worden geïndexeerd.</li>
              <li>• Beheer-toegang staat los van de openbare deel-link.</li>
            </ul>
          </aside>
        </div>
      </main>
      <WinkelnuFooter />
    </div>
  )
}

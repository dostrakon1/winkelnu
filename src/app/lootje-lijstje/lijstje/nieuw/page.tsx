import type { Metadata } from 'next'
import Link from 'next/link'
import { createGiftListAction } from '@/app/lootje-lijstje/actions'
import { GiftListForm } from '@/components/gifting/gift-list-form'

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
    <div className="min-h-screen text-[var(--gift-ink)]">
      <main id="inhoud">
        <section className="gift-onboarding-hero">
          <div className="gift-shell-container gift-onboarding-hero-inner">
            <div>
              <Link href="/lootje-lijstje" className="gift-onboarding-back">← Terug naar start</Link>
              <p className="gift-kicker mt-6">Verlanglijstje · stap 1</p>
              <h1 className="gift-onboarding-title">Maak een lijstje dat fijn deelt.</h1>
              <p className="gift-onboarding-lead">Eerst de basis, daarna je wensen. Je kiest zelf of je Winkelnu-producten, eigen wensen of externe links toevoegt.</p>
            </div>

            <nav className="gift-progress" aria-label="Voortgang verlanglijstje">
              <ol>
                <li data-state="current"><span className="gift-progress-dot">1</span><span>Basis</span></li>
                <li><span className="gift-progress-dot">2</span><span>Wensen</span></li>
                <li><span className="gift-progress-dot">3</span><span>Delen</span></li>
              </ol>
            </nav>
          </div>
        </section>

        <section className="gift-shell-container gift-onboarding-layout">
          <div>
            {rawError ? (
              <div role="alert" className="mb-4 rounded-[1.1rem] border border-[#d9a99f] bg-[#fff3ef] p-4 text-sm font-semibold leading-6 text-[#7f2d23]">
                {rawError}
              </div>
            ) : null}

            <div className="gift-onboarding-card">
              <GiftListForm action={createGiftListAction} submitLabel="Maak mijn lijstje →" />
            </div>
          </div>

          <aside className="gift-onboarding-aside" aria-label="Over je verlanglijstje">
            <div className="gift-onboarding-aside-card">
              <strong>Daarna voeg je wensen toe</strong>
              <ul>
                <li>Zoek producten in Winkelnu.</li>
                <li>Schrijf zelf een wens op.</li>
                <li>Voeg een veilige externe link toe.</li>
                <li>Deel één alleen-lezen link.</li>
              </ul>
            </div>
            <div className="gift-onboarding-aside-card" data-tone="warm">
              <strong>Jij houdt het beheer</strong>
              <p>De gedeelde link bevat geen bewerkknoppen. Jouw geheime beheer-toegang staat los van wat anderen te zien krijgen.</p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

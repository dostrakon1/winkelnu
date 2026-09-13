import type { Metadata } from 'next'
import Link from 'next/link'
import { createGiftGroupAction } from '@/app/lootje-lijstje/groep/actions'
import { GiftGroupForm } from '@/components/gifting/gift-group-form'
import { GiftingInsightBeacon } from '@/components/gifting/gifting-insight-beacon'

export const metadata: Metadata = {
  title: 'Lootjesgroep maken',
  description: 'Maak zonder account een groep voor Lootje & Lijstje.',
  robots: { index: false, follow: false },
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function NewGiftGroupPage({
  searchParams,
}: {
  searchParams: Promise<{ fout?: string | string[] }>
}) {
  const query = await searchParams
  const error = first(query.fout)

  return (
    <div className="min-h-screen text-[var(--gift-ink)]">
      <GiftingInsightBeacon eventType="group_create_form_viewed" sourceSurface="group_create" />
      <main id="inhoud">
        <section className="gift-onboarding-hero">
          <div className="gift-shell-container gift-onboarding-hero-inner">
            <div>
              <Link href="/lootje-lijstje" className="gift-onboarding-back">← Terug naar start</Link>
              <p className="gift-kicker mt-6">Lootjesgroep · stap 1</p>
              <h1 className="gift-onboarding-title">Maak de groep klaar.</h1>
              <p className="gift-onboarding-lead">Een paar gegevens zijn genoeg. Daarna nodig je iedereen uit en maakt elke deelnemer zijn eigen verlanglijstje.</p>
            </div>

            <nav className="gift-progress" aria-label="Voortgang lootjesgroep">
              <ol>
                <li data-state="current"><span className="gift-progress-dot">1</span><span>Groep</span></li>
                <li><span className="gift-progress-dot">2</span><span>Uitnodigen</span></li>
                <li><span className="gift-progress-dot">3</span><span>Lijstjes</span></li>
                <li><span className="gift-progress-dot">4</span><span>Lootjes</span></li>
              </ol>
            </nav>
          </div>
        </section>

        <section className="gift-shell-container gift-onboarding-layout">
          <div>
            {error ? (
              <div role="alert" className="mb-4 rounded-[1.1rem] border border-[#d9a99f] bg-[#fff3ef] p-4 text-sm font-semibold leading-6 text-[#7f2d23]">
                {error}
              </div>
            ) : null}

            <div className="gift-onboarding-card">
              <GiftGroupForm action={createGiftGroupAction} />
            </div>
          </div>

          <aside className="gift-onboarding-aside" aria-label="Over je lootjesgroep">
            <div className="gift-onboarding-aside-card">
              <strong>Wat gebeurt hierna?</strong>
              <ul>
                <li>Je krijgt de beheerpagina.</li>
                <li>Je deelt één uitnodigingslink.</li>
                <li>Iedereen vult zijn eigen wensen in.</li>
                <li>Jij start later de trekking.</li>
              </ul>
            </div>
            <div className="gift-onboarding-aside-card" data-tone="warm">
              <strong>Privé vanaf het begin</strong>
              <p>Deelnemers krijgen hun eigen toegang. Als organisator beheer je de groep, maar na de trekking krijg je geen overzicht van alle geheime koppelingen.</p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

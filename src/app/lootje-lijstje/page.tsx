import type { Metadata } from 'next'
import Link from 'next/link'
import { GiftingInsightBeacon } from '@/components/gifting/gifting-insight-beacon'

export const metadata: Metadata = {
  title: 'Lootje & Lijstje',
  description: 'Maak zonder account een verlanglijstje of cadeaugroep, trek veilig lootjes en vind daarna een passend cadeau via Winkelnu.',
  alternates: { canonical: '/lootje-lijstje' },
  openGraph: {
    title: 'Lootje & Lijstje | Winkelnu.nl',
    description: 'Maak een lijstje, nodig je groep uit, trek lootjes en vind een cadeau zonder account.',
    url: '/lootje-lijstje',
  },
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

const groupSteps = [
  ['01', 'Maak je groep', 'Kies het cadeaumoment, een budget en eventueel een datum.'],
  ['02', 'Nodig iedereen uit', 'Deel één link. Iedereen doet mee zonder account en maakt zijn eigen lijstje.'],
  ['03', 'Trek de lootjes', 'Winkelnu maakt één geldige geheime verdeling en respecteert uitsluitingen.'],
  ['04', 'Regel het cadeau', 'Bekijk alleen jouw getrokken persoon en houd privé bij wat je hebt geregeld.'],
] as const

export default async function GiftLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ verwijderd?: string | string[] }>
}) {
  const query = await searchParams
  const deleted = first(query.verwijderd)
  const deletedMessage = deleted === 'groep'
    ? 'De groep en alle bijbehorende Lootje & Lijstje-gegevens zijn verwijderd.'
    : deleted === 'lijstje'
      ? 'Je lijstje en alle bijbehorende gegevens zijn verwijderd.'
      : undefined

  return (
    <div className="min-h-screen text-[var(--gift-ink)]">
      <GiftingInsightBeacon eventType="gifting_landing_viewed" sourceSurface="landing" />
      <main id="inhoud">
        <section className="gift-landing-hero">
          <div className="gift-shell-container">
            {deletedMessage ? (
              <div role="status" className="mt-6 rounded-[1.1rem] border border-[rgba(18,59,58,0.14)] bg-white/80 px-4 py-3 text-sm font-bold text-[var(--gift-petrol-deep)] shadow-[var(--gift-shadow-sm)]">
                ✓ {deletedMessage}
              </div>
            ) : null}

            <div className="gift-landing-grid">
              <div className="gift-landing-copy">
                <p className="gift-kicker">Lootje &amp; Lijstje</p>
                <h1 className="gift-landing-title">Samen cadeaus regelen. Zonder gedoe.</h1>
                <p className="gift-landing-lead">
                  Maak een verlanglijstje voor jezelf of regel een complete lootjesgroep. Van uitnodiging tot cadeau blijft alles op één rustige plek.
                </p>
                <div className="gift-trust-row" aria-label="Voordelen">
                  <span>Geen account nodig</span>
                  <span>Privé lootjes</span>
                  <span>Deelbaar via WhatsApp</span>
                </div>
              </div>

              <aside className="gift-choice-panel" aria-label="Kies wat je wilt doen">
                <div className="gift-choice-heading">
                  <p className="gift-kicker">Waar wil je mee beginnen?</p>
                  <p>Kies één route. Je kunt later altijd terug naar dit startscherm.</p>
                </div>
                <div className="gift-choice-stack">
                  <Link href="/lootje-lijstje/lijstje/nieuw" className="gift-choice-card" data-tone="list">
                    <span className="gift-choice-icon" aria-hidden="true">♡</span>
                    <span className="gift-choice-copy">
                      <strong>Ik wil een verlanglijstje maken</strong>
                      <span>Verzamel wensen en deel één alleen-lezen link met familie of vrienden.</span>
                    </span>
                    <span className="gift-choice-arrow" aria-hidden="true">→</span>
                  </Link>

                  <Link href="/lootje-lijstje/groep/nieuw" className="gift-choice-card" data-tone="group">
                    <span className="gift-choice-icon" aria-hidden="true">✦</span>
                    <span className="gift-choice-copy">
                      <strong>Ik wil lootjes trekken met een groep</strong>
                      <span>Nodig iedereen uit, laat wensen invullen en trek daarna veilig de lootjes.</span>
                    </span>
                    <span className="gift-choice-arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="gift-shell-container gift-flow-section" aria-labelledby="gift-flow-title">
          <div className="gift-flow-heading">
            <div>
              <p className="gift-kicker">Van groep tot cadeau</p>
              <h2 id="gift-flow-title" className="mt-2 font-[var(--wn-font-display)] text-3xl font-semibold tracking-[-0.04em] text-[var(--gift-petrol-deep)] sm:text-4xl">
                Eén duidelijke flow.
              </h2>
            </div>
            <p>Iedere deelnemer houdt zijn eigen toegang. De organisator regelt de groep, maar ziet nooit de volledige geheime verdeling.</p>
          </div>

          <div className="gift-flow-grid">
            {groupSteps.map(([number, title, text]) => (
              <article key={number} className="gift-flow-step">
                <span className="gift-flow-step-number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="gift-shell-container">
          <div className="gift-confidence-band">
            <div className="gift-confidence-inner">
              <div>
                <p className="gift-kicker">Privé zonder account</p>
                <h2>Jouw geheime toegang blijft van jou.</h2>
                <p>Beheer en deelname zijn gescheiden. Privé pagina’s worden niet geïndexeerd en je kunt je lijstje of groep zelf definitief verwijderen.</p>
              </div>
              <div className="gift-confidence-links">
                <Link href="/privacy">Privacy →</Link>
                <Link href="/cookies">Cookies →</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

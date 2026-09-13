import type { Metadata } from 'next'
import Link from 'next/link'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export const metadata: Metadata = {
  title: 'Lootje & Lijstje',
  description: 'Maak zonder account een verlanglijstje, voeg Winkelnu-producten toe, deel je wensen en regel later ook lootjes met vrienden, familie of collega’s.',
  alternates: { canonical: '/lootje-lijstje' },
  openGraph: {
    title: 'Lootje & Lijstje | Winkelnu.nl',
    description: 'Maak een verlanglijstje zonder account, voeg Winkelnu-producten of eigen wensen toe en deel het eenvoudig.',
    url: '/lootje-lijstje',
  },
}

export default function GiftLandingPage() {
  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <section className="relative overflow-hidden border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
          <div className="absolute inset-0 bg-[image:var(--wn-gradient-glow)]" aria-hidden="true" />
          <div className="wn-container relative py-14 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              <p className="wn-eyebrow">Lootje &amp; Lijstje</p>
              <h1 className="wn-heading mt-4 text-4xl leading-tight sm:text-6xl">Cadeaus regelen zonder gedoe.</h1>
              <p className="wn-body-muted mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
                Maak een verlanglijstje, kies producten uit Winkelnu of voeg je eigen wensen toe en deel alles eenvoudig met familie of vrienden.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/lootje-lijstje/lijstje/nieuw" className="wn-button wn-button-primary">Maak een lijstje →</Link>
                <span className="inline-flex min-h-12 items-center rounded-full border border-[var(--wn-border)] bg-white/70 px-5 text-sm font-bold text-[var(--wn-text-muted)]">
                  Lootjes trekken volgt in een volgende bouwstap
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="wn-container wn-section">
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-6 shadow-[var(--wn-shadow-xs)] sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xl text-[var(--wn-petrol)]" aria-hidden="true">✦</span>
              <p className="wn-eyebrow mt-6">Lijstje</p>
              <h2 className="wn-heading mt-2 text-3xl">Zet je wensen op één plek.</h2>
              <p className="wn-body-muted mt-4 leading-7">Zoek een product in Winkelnu, schrijf zelf een wens op of voeg een externe productlink toe. Geen account, wachtwoord of e-mailadres nodig.</p>
              <Link href="/lootje-lijstje/lijstje/nieuw" className="wn-button wn-button-primary mt-6">Start mijn lijstje</Link>
            </article>

            <article className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-[var(--wn-petrol-soft)] p-6 sm:p-8">
              <span className="inline-flex rounded-full border border-[color:rgba(18,59,58,0.14)] bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--wn-petrol)]">Volgende fase</span>
              <p className="wn-eyebrow mt-6">Lootje</p>
              <h2 className="wn-heading mt-2 text-3xl">Trek straks lootjes met je groep.</h2>
              <p className="wn-body-muted mt-4 leading-7">De technische basis is al voorbereid. Groepen, deelnemers en geheime trekkingen worden in de volgende fases bovenop dezelfde lichte no-login aanpak gebouwd.</p>
            </article>
          </div>
        </section>

        <section className="border-y border-[var(--wn-border)] bg-white/55">
          <div className="wn-container wn-section">
            <p className="wn-eyebrow">Zo werkt Lijstje</p>
            <h2 className="wn-heading mt-3 text-3xl sm:text-4xl">In drie korte stappen klaar.</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                ['01', 'Maak je lijstje', 'Vul je naam, gelegenheid en eventueel een budget of datum in.'],
                ['02', 'Voeg wensen toe', 'Zoek in de Winkelnu-catalogus of voeg zelf een wens of veilige externe productlink toe.'],
                ['03', 'Deel de link', 'Stuur de alleen-lezen lijst via WhatsApp of kopieer de link. Jij behoudt apart de beheer-toegang.'],
              ].map(([number, title, text]) => (
                <article key={number} className="rounded-[var(--wn-radius-lg)] border border-[var(--wn-border)] bg-[var(--wn-cream)] p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--wn-petrol)] text-xs font-bold text-white">{number}</span>
                  <h3 className="wn-ui-heading mt-4 text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--wn-text-muted)]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <WinkelnuFooter />
    </div>
  )
}

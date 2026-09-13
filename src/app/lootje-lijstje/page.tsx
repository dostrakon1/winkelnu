import type { Metadata } from 'next'
import Link from 'next/link'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

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
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <section className="relative overflow-hidden border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
          <div className="absolute inset-0 bg-[image:var(--wn-gradient-glow)]" aria-hidden="true" />
          <div className="wn-container relative py-14 sm:py-20 lg:py-24">
            {deletedMessage ? (
              <div role="status" className="mb-7 max-w-2xl rounded-xl border border-[color:rgba(18,59,58,0.16)] bg-white/80 p-4 text-sm font-semibold leading-6 text-[var(--wn-petrol-deep)]">
                {deletedMessage}
              </div>
            ) : null}
            <div className="max-w-3xl">
              <p className="wn-eyebrow">Lootje &amp; Lijstje</p>
              <h1 className="wn-heading mt-4 text-4xl leading-tight sm:text-6xl">Cadeaus regelen zonder gedoe.</h1>
              <p className="wn-body-muted mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
                Maak een verlanglijstje of start een groep, trek veilig lootjes en ga daarna rechtstreeks door naar de wensen en cadeaus. Geen account nodig.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/lootje-lijstje/lijstje/nieuw" className="wn-button wn-button-primary">Maak een lijstje →</Link>
                <Link href="/lootje-lijstje/groep/nieuw" className="wn-button wn-button-secondary">Trek lootjes →</Link>
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
              <p className="wn-body-muted mt-4 leading-7">Zoek een product in Winkelnu, schrijf zelf een wens op of voeg een externe productlink toe. Deel daarna een alleen-lezen link met wie je wilt.</p>
              <Link href="/lootje-lijstje/lijstje/nieuw" className="wn-button wn-button-primary mt-6">Start mijn lijstje</Link>
            </article>

            <article className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-[var(--wn-petrol-soft)] p-6 sm:p-8">
              <span className="inline-flex rounded-full border border-[color:rgba(18,59,58,0.14)] bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--wn-petrol)]">Lootje</span>
              <p className="wn-eyebrow mt-6">Samen</p>
              <h2 className="wn-heading mt-2 text-3xl">Maak een groep en trek eerlijk lootjes.</h2>
              <p className="wn-body-muted mt-4 leading-7">Deel één uitnodigingslink via WhatsApp. Iedereen vult zijn eigen wensen in. Na de trekking ziet iedere deelnemer uitsluitend zijn eigen getrokken persoon.</p>
              <Link href="/lootje-lijstje/groep/nieuw" className="wn-button wn-button-primary mt-6">Maak een groep</Link>
              <p className="mt-4 text-xs font-semibold leading-5 text-[var(--wn-text-muted)]">Uitsluitingen, geheime herstel-links en privé “geregeld”-markeringen zijn ingebouwd.</p>
            </article>
          </div>
        </section>

        <section className="border-y border-[var(--wn-border)] bg-white/55">
          <div className="wn-container wn-section">
            <p className="wn-eyebrow">Van groep tot cadeau</p>
            <h2 className="wn-heading mt-3 text-3xl sm:text-4xl">Vier korte stappen.</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['01', 'Maak de groep', 'Vul de gelegenheid, het budget en eventueel de datum in.'],
                ['02', 'Deel de uitnodiging', 'Iedereen doet zonder account mee en maakt zijn eigen lijstje compleet.'],
                ['03', 'Trek de lootjes', 'Winkelnu maakt één geldige geheime verdeling en respecteert ingestelde uitsluitingen.'],
                ['04', 'Vind het cadeau', 'Onthul alleen jouw persoon, bekijk diens wensen en markeer voor jezelf wat geregeld is.'],
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

        <section className="wn-container wn-section">
          <div className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-6 shadow-[var(--wn-shadow-xs)] sm:p-8">
            <p className="wn-eyebrow">Privé zonder account</p>
            <h2 className="wn-heading mt-2 text-3xl">Jouw geheime link is je sleutel.</h2>
            <p className="wn-body-muted mt-4 max-w-3xl leading-7">Beheer- en deelnemersrechten worden gescheiden gehouden. Geheime tokens staan niet leesbaar in de database, privé pagina’s worden niet geïndexeerd en Lootje &amp; Lijstje is uitgesloten van onze openbare Web Analytics-meting. Je kunt je eigen lijstje of hele groep ook zelf definitief verwijderen.</p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold">
              <Link href="/privacy" className="text-[var(--wn-petrol)] hover:underline">Privacy →</Link>
              <Link href="/cookies" className="text-[var(--wn-petrol)] hover:underline">Cookies →</Link>
            </div>
          </div>
        </section>
      </main>
      <WinkelnuFooter />
    </div>
  )
}

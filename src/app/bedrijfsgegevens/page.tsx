import type { Metadata } from 'next'
import Link from 'next/link'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'
import { operator } from '@/content/operator'

export const metadata: Metadata = {
  title: 'Bedrijfsgegevens',
  description: 'Bedrijfs- en contactgegevens van de exploitant van Winkelnu.nl.',
  alternates: { canonical: '/bedrijfsgegevens' },
}

const businessRows = [
  ['Handelsnaam', operator.tradeName],
  ['Juridische naam', operator.legalName],
  ['Rechtsvorm', operator.legalForm],
  ['KVK-nummer', operator.chamberOfCommerce],
  ['Btw-id', operator.vatId],
  ['Correspondentieadres', operator.correspondenceAddress],
] as const

export default function BusinessDetailsPage() {
  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="border-b border-[rgba(18,59,58,0.10)] bg-[linear-gradient(135deg,#0b2b2a_0%,#123b3a_58%,#194946_100%)] text-[var(--wn-cream)]">
        <div className="wn-container py-14 sm:py-18 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffb889]">✦ Bedrijfsgegevens</p>
          <h1 className="wn-display mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[#fff7ec] sm:text-5xl lg:text-6xl">
            Duidelijk wie Winkelnu exploiteert.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#f4e7d8]/76 sm:text-lg">
            Hier vind je de formele bedrijfs- en contactgegevens achter Winkelnu.nl. Voor het verhaal, de visie en onze manier van vergelijken kun je terecht op Over Winkelnu.
          </p>
          <Link href="/over-winkelnu" className="mt-7 inline-flex min-h-11 items-center rounded-full border border-white/16 bg-white/[0.07] px-5 text-sm font-bold text-white transition hover:bg-white/[0.12]">
            Over Winkelnu →
          </Link>
        </div>
      </section>

      <section className="wn-container wn-section">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-start">
          <section className="overflow-hidden rounded-[1.7rem] border border-[rgba(18,59,58,0.12)] bg-white shadow-[var(--wn-shadow-sm)]">
            <div className="border-b border-[rgba(18,59,58,0.10)] p-7 sm:p-9">
              <p className="wn-eyebrow">Exploitant</p>
              <h2 className="wn-display mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--wn-petrol-deep)] sm:text-4xl">
                {operator.tradeName}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--wn-text-muted)]">
                Winkelnu is een initiatief van Akflow. Onderstaande gegevens horen bij de onderneming die Winkelnu.nl exploiteert.
              </p>
            </div>

            <dl className="divide-y divide-[rgba(18,59,58,0.10)]">
              {businessRows.map(([label, value]) => (
                <div key={label} className="grid gap-2 px-7 py-5 sm:grid-cols-[12rem_1fr] sm:px-9">
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--wn-text-muted)]">{label}</dt>
                  <dd className="text-sm font-semibold leading-6 text-[var(--wn-petrol-deep)]">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="border-t border-[rgba(18,59,58,0.10)] bg-[var(--wn-petrol-soft)]/45 px-7 py-5 text-sm leading-6 text-[var(--wn-text-muted)] sm:px-9">
              Het genoemde adres is een correspondentieadres en geen bezoekadres.
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-[1.6rem] border border-[rgba(233,120,61,0.20)] bg-[linear-gradient(145deg,#f7e5d7,#fff8ef)] p-7 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b85427]">Contact</p>
              <h2 className="wn-display mt-3 text-2xl font-semibold text-[var(--wn-petrol-deep)]">Een vraag over Winkelnu?</h2>
              <p className="mt-3 text-sm leading-7 text-[rgba(13,46,45,0.72)]">
                Voor vragen over Winkelnu kun je rechtstreeks contact opnemen via e-mail.
              </p>
              <a href={`mailto:${operator.email}?subject=Winkelnu.nl`} className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[var(--wn-petrol-deep)] px-5 text-sm font-bold text-white transition hover:bg-[var(--wn-petrol)]">
                {operator.email}
              </a>
            </section>

            <section className="rounded-[1.6rem] border border-[rgba(18,59,58,0.12)] bg-white p-7 shadow-[var(--wn-shadow-xs)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-petrol)]">Meer over de exploitant</p>
              <p className="mt-3 text-sm leading-7 text-[var(--wn-text-muted)]">
                Meer informatie over Akflow vind je op de eigen website.
              </p>
              <Link href="https://www.akflow.nl/" className="mt-4 inline-flex min-h-10 items-center font-bold text-[var(--wn-petrol)] hover:underline">
                Bezoek Akflow.nl →
              </Link>
            </section>
          </aside>
        </div>
      </section>

      <WinkelnuFooter />
    </main>
  )
}

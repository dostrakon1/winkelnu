import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { resolveGiftCatalogProductViews } from '@/application/gifting/gift-catalog'
import { getSharedGiftList } from '@/application/gifting/standalone-gift-lists'
import { GiftListItemCard } from '@/components/gifting/gift-list-item-card'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export const metadata: Metadata = {
  title: 'Gedeeld verlanglijstje',
  description: 'Bekijk een gedeeld verlanglijstje op Winkelnu.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Gedeeld verlanglijstje | Winkelnu.nl',
    description: 'Iemand heeft een verlanglijstje met je gedeeld via Winkelnu.',
  },
  twitter: {
    card: 'summary',
    title: 'Gedeeld verlanglijstje | Winkelnu.nl',
    description: 'Iemand heeft een verlanglijstje met je gedeeld via Winkelnu.',
  },
}

const occasionLabels = {
  sinterklaas: 'Sinterklaas',
  kerst: 'Kerst / Secret Santa',
  verjaardag: 'Verjaardag',
  anders: 'Cadeaulijstje',
} as const

function money(cents: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

function budgetText(min?: number, max?: number): string | null {
  if (min !== undefined && max !== undefined) return `${money(min)} – ${money(max)}`
  if (max !== undefined) return `tot ${money(max)}`
  if (min !== undefined) return `vanaf ${money(min)}`
  return null
}

export default async function SharedGiftListPage({ params }: { params: Promise<{ shareCode: string }> }) {
  const { shareCode } = await params
  const list = await getSharedGiftList(shareCode)
  if (!list) notFound()

  const productViews = await resolveGiftCatalogProductViews(list.items)
  const budget = budgetText(list.budgetMinCents, list.budgetMaxCents)
  const heading = list.title ?? `${list.displayName}’s lijstje`

  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <section className="border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
          <div className="wn-container py-12 sm:py-16">
            <p className="wn-eyebrow">Lootje &amp; Lijstje</p>
            <h1 className="wn-heading mt-3 max-w-3xl text-4xl sm:text-5xl">{heading}</h1>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-[var(--wn-text-muted)]">
              <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">{occasionLabels[list.occasion]}</span>
              {budget ? <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">Budget {budget}</span> : null}
              {list.eventDate ? <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">{new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${list.eventDate}T00:00:00Z`))}</span> : null}
            </div>
            <p className="wn-body-muted mt-5">{list.items.length === 1 ? '1 wens' : `${list.items.length} wensen`} van {list.displayName}.</p>
          </div>
        </section>

        <section className="wn-container wn-section">
          {list.items.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {list.items.map((item) => (
                <GiftListItemCard key={item.id} item={item} productView={productViews[item.id]} />
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-8 text-center shadow-[var(--wn-shadow-xs)]">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xl text-[var(--wn-petrol)]" aria-hidden="true">✦</span>
              <h2 className="wn-heading mt-4 text-2xl">Nog geen wensen toegevoegd.</h2>
              <p className="wn-body-muted mx-auto mt-3 max-w-xl">Dit lijstje is al gedeeld, maar de eigenaar heeft nog geen wensen ingevuld. Kijk later nog eens.</p>
            </div>
          )}
        </section>
      </main>
      <WinkelnuFooter />
    </div>
  )
}

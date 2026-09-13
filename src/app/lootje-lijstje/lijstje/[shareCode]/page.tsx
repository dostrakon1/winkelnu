import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { resolveGiftCatalogProductViews } from '@/application/gifting/gift-catalog'
import { getSharedGiftList } from '@/application/gifting/standalone-gift-lists'
import { GiftListItemCard } from '@/components/gifting/gift-list-item-card'

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
  const wishCountLabel = list.items.length === 1 ? '1 wens' : `${list.items.length} wensen`

  return (
    <div className="min-h-screen text-[var(--gift-ink)]">
      <main id="inhoud">
        <section className="gift-shared-list-hero">
          <div className="gift-shell-container gift-shared-list-hero-inner">
            <div>
              <span className="gift-wishlist-role">Gedeeld verlanglijstje</span>
              <h1 className="gift-shared-list-title">{heading}</h1>
              <p className="gift-shared-list-lead">Een rustige plek met de wensen van {list.displayName}. Kies iets van de lijst of gebruik Winkelnu om een passend alternatief te vinden.</p>
              <div className="gift-wishlist-meta">
                <span>{occasionLabels[list.occasion]}</span>
                <span>{wishCountLabel}</span>
                {budget ? <span>Budget {budget}</span> : null}
                {list.eventDate ? <span>{new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${list.eventDate}T00:00:00Z`))}</span> : null}
              </div>
            </div>
            <div className="gift-shared-list-note">
              <span aria-hidden="true">♡</span>
              <strong>Tip voor de gever</strong>
              <p>De toelichting bij een wens kan net het verschil maken in kleur, uitvoering of stijl.</p>
            </div>
          </div>
        </section>

        <section className="gift-shell-container gift-shared-list-body">
          <div className="gift-shared-list-heading">
            <div>
              <p className="gift-kicker">Wensen van {list.displayName}</p>
              <h2>Kies iets dat echt past.</h2>
            </div>
            <Link href="/zoeken" className="wn-button wn-button-secondary">Zoek ook op Winkelnu →</Link>
          </div>

          {list.items.length > 0 ? (
            <div className="gift-wish-grid gift-wish-grid-viewer">
              {list.items.map((item) => (
                <GiftListItemCard key={item.id} item={item} productView={productViews[item.id]} />
              ))}
            </div>
          ) : (
            <div className="gift-wishlist-empty">
              <span aria-hidden="true">✦</span>
              <h2>Nog geen wensen toegevoegd.</h2>
              <p>Dit lijstje is al gedeeld, maar de eigenaar heeft nog geen wensen ingevuld. Kijk later nog eens.</p>
            </div>
          )}

          <div className="gift-shared-list-footer-cta">
            <div>
              <p className="gift-kicker">Nog niet gevonden?</p>
              <h2>Ontdek zelf een passend cadeau.</h2>
              <p>Gebruik Winkelnu om producten te bekijken en verschillende opties naast elkaar te zetten.</p>
            </div>
            <Link href="/zoeken" className="wn-button wn-button-primary">Cadeau zoeken →</Link>
          </div>
        </section>
      </main>
    </div>
  )
}

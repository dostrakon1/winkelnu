import Link from 'next/link'
import type { UniversalSearchRanking } from '@/application/search/universal-search-ranking'
import { ProductMedia } from './product-media'

function formatMoney(amount: string): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(Number(amount))
}

function rankLabel(position: number): string {
  return String(position + 1).padStart(2, '0')
}

export function UniversalSearchResults({ ranking }: { ranking: UniversalSearchRanking }) {
  if (ranking.items.length === 0) return null

  return (
    <section className="border-b border-[var(--wn-border)] bg-white/70">
      <div className="wn-container py-10 sm:py-14">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="wn-eyebrow">Winkelnu beste matches</p>
            <h2 className="wn-heading mt-2 text-3xl sm:text-4xl">Eén ranglijst voor alles wat je verder helpt.</h2>
            <p className="wn-body-muted mt-3 max-w-3xl text-sm leading-7 sm:text-base">
              Producten, productgroepen, koopgidsen en collecties worden samen gerangschikt op betekenis. Beschikbare aanbiedingen tellen alleen als kleine tie-breaker mee; relevantie blijft leidend.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold text-[var(--wn-petrol-deep)]">
            {ranking.productCount > 0 ? <span className="rounded-full bg-[var(--wn-petrol-soft)] px-3 py-2">{ranking.productCount} producten</span> : null}
            {ranking.routeCount > 0 ? <span className="rounded-full bg-[var(--wn-petrol-soft)] px-3 py-2">{ranking.routeCount} slimme routes</span> : null}
          </div>
        </div>

        <div className="mt-7 grid gap-3">
          {ranking.items.map((entry, index) => {
            if (entry.type === 'product') {
              const { product, bestOffer, offerCount } = entry.item
              return (
                <article key={`product:${product.id}`} className="group grid gap-4 rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-4 shadow-[var(--wn-shadow-xs)] transition hover:border-[color:rgba(18,59,58,0.26)] hover:shadow-[var(--wn-shadow-md)] sm:grid-cols-[3rem_7rem_minmax(0,1fr)_auto] sm:items-center sm:p-5">
                  <div className="hidden text-center text-sm font-black text-[color:rgba(18,59,58,0.38)] sm:block">{rankLabel(index)}</div>
                  <Link href={`/product/${product.slug}`} className="overflow-hidden rounded-[var(--wn-radius-lg)] bg-[var(--wn-cream)]">
                    <ProductMedia src={product.imageUrl} alt={product.title} visualKind={product.visualKind} />
                  </Link>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.13em] text-[var(--wn-petrol)]">Product</span>
                      <span className="text-xs font-semibold text-[var(--wn-text-muted)]">{entry.reason}</span>
                    </div>
                    <h3 className="mt-1 text-lg font-black tracking-[-0.02em] text-[var(--wn-ink)] sm:text-xl">
                      <Link href={`/product/${product.slug}`} className="hover:underline">{product.title}</Link>
                    </h3>
                    <p className="mt-1 text-sm text-[var(--wn-text-muted)]">
                      {product.brand ?? 'Merk onbekend'}
                      {bestOffer ? ` · ${offerCount} ${offerCount === 1 ? 'aanbieding' : 'aanbiedingen'}` : ' · productinformatie beschikbaar'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                    <div>
                      <p className="text-xs font-semibold text-[var(--wn-text-muted)]">{bestOffer ? 'Beste bekende prijs' : 'Prijs volgt'}</p>
                      <p className="mt-1 text-lg font-black text-[var(--wn-ink)]">{bestOffer ? formatMoney(bestOffer.totalAmount) : '—'}</p>
                    </div>
                    <Link href={`/product/${product.slug}`} className="mt-0 inline-flex min-h-10 items-center font-bold text-[var(--wn-petrol)] hover:underline sm:mt-2">Bekijk →</Link>
                  </div>
                </article>
              )
            }

            return (
              <Link
                key={`route:${entry.href}`}
                href={entry.href}
                className="group grid gap-3 rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-5 shadow-[var(--wn-shadow-xs)] transition hover:-translate-y-0.5 hover:border-[color:rgba(18,59,58,0.26)] hover:shadow-[var(--wn-shadow-md)] sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="hidden text-center text-sm font-black text-[color:rgba(18,59,58,0.38)] sm:block">{rankLabel(index)}</div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.13em] text-[var(--wn-petrol)]">{entry.eyebrow}</span>
                    <span className="text-xs font-semibold text-[var(--wn-text-muted)]">{entry.reason}</span>
                  </div>
                  <h3 className="mt-1 text-lg font-black tracking-[-0.02em] text-[var(--wn-ink)] sm:text-xl">{entry.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--wn-text-muted)]">{entry.description}</p>
                </div>
                <span className="text-xl font-black text-[var(--wn-petrol)] transition group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

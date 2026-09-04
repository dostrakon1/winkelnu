import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ComparisonSignals } from '@/components/storefront/comparison-signals'
import { OfferCard } from '@/components/storefront/offer-card'
import { ProductFacts } from '@/components/storefront/product-facts'
import { ProductMedia } from '@/components/storefront/product-media'
import { WinkelnuBadge } from '@/components/storefront/winkelnu-badge'
import { WinkelnuButton } from '@/components/storefront/winkelnu-button'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'

function formatMoney(amount: string): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(Number(amount))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const catalog = await createStorefrontCatalogService()
  const item = await catalog.getProduct(slug)

  if (!item) return { title: 'Product niet gevonden' }

  return {
    title: item.product.title,
    description: item.product.description,
    alternates: { canonical: `/product/${item.product.slug}` },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const catalog = await createStorefrontCatalogService()
  const item = await catalog.getProduct(slug)

  if (!item) notFound()

  const { product, offers } = item
  const bestOffer = offers[0]
  const bestShippingKnown = Boolean(bestOffer?.offer.shippingCost)
  const bestPriceLabel = bestShippingKnown ? 'Laagste bekende totaalprijs' : 'Laagste bekende productprijs'

  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <div className="border-b border-[color:rgba(18,59,58,0.08)] bg-white/70">
        <div className="wn-container flex min-h-12 items-center gap-2 overflow-x-auto py-2 text-xs text-[var(--wn-text-muted)]">
          <Link href="/" className="shrink-0 font-semibold text-[var(--wn-petrol)] hover:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/zoeken" className="shrink-0 font-semibold text-[var(--wn-petrol)] hover:underline">Producten</Link>
          <span aria-hidden="true">/</span>
          <span className="truncate" aria-current="page">{product.title}</span>
        </div>
      </div>

      <section className="border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-morning)]">
        <div className="wn-container py-8 sm:py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:items-start lg:gap-12">
            <section>
              <ProductMedia
                src={product.imageUrl}
                alt={product.title}
                variant="detail"
                className="rounded-[var(--wn-radius-2xl)] shadow-[var(--wn-shadow-sm)]"
              />
              <p className="mt-3 text-xs text-[var(--wn-text-muted)]">Productbeeld wordt aangeleverd via de aangesloten productfeed.</p>

              <div className="mt-7 flex flex-wrap items-center gap-2">
                <WinkelnuBadge>{product.brand ?? 'Merk onbekend'}</WinkelnuBadge>
                {offers.length > 0 ? (
                  <WinkelnuBadge variant="success">
                    {offers.length} {offers.length === 1 ? 'aanbieding' : 'aanbiedingen'}
                  </WinkelnuBadge>
                ) : (
                  <WinkelnuBadge variant="warning">Geen actieve aanbieding</WinkelnuBadge>
                )}
              </div>

              <h1 className="wn-heading mt-4 max-w-3xl text-3xl sm:text-4xl lg:text-5xl">{product.title}</h1>
              {product.description ? (
                <p className="wn-body-muted mt-5 max-w-3xl text-base leading-7 sm:text-lg sm:leading-8">{product.description}</p>
              ) : null}

              {bestOffer ? (
                <div className="mt-7 rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.12)] bg-white p-4 shadow-[var(--wn-shadow-xs)] sm:p-5 lg:hidden">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--wn-text-muted)]">{bestPriceLabel}</p>
                  <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-3xl font-bold tracking-tight text-[var(--wn-ink)]">{formatMoney(bestOffer.totalAmount)}</p>
                      <p className="mt-1 text-xs text-[var(--wn-text-muted)]">
                        Bij {bestOffer.merchant?.name ?? 'webwinkel'}{bestShippingKnown ? ' · bekende verzending inbegrepen' : ' · verzending nog onbekend'}
                      </p>
                    </div>
                    <WinkelnuButton href="#aanbiedingen" variant="warm">Bekijk winkels ↓</WinkelnuButton>
                  </div>
                </div>
              ) : null}

              <ProductFacts brand={product.brand} gtin={product.gtin} mpn={product.mpn} offerCount={offers.length} />
              <ComparisonSignals className="mt-8" />

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <WinkelnuButton href="#aanbiedingen" variant="warm" className="sm:hidden">Bekijk aanbiedingen</WinkelnuButton>
                <WinkelnuButton href="/zoeken" variant="secondary">Verder zoeken</WinkelnuButton>
              </div>
            </section>

            <aside id="aanbiedingen" className="scroll-mt-4 lg:sticky lg:top-6">
              <div className="rounded-[var(--wn-radius-2xl)] bg-[image:var(--wn-gradient-market)] p-1 shadow-[var(--wn-shadow-lg)]">
                <div className="rounded-[calc(var(--wn-radius-2xl)-4px)] bg-[var(--wn-cream)] p-4 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="wn-eyebrow">Winkelvergelijking</p>
                      <h2 className="wn-heading mt-2 text-2xl">Vergelijk {offers.length} {offers.length === 1 ? 'aanbieding' : 'aanbiedingen'}</h2>
                    </div>
                    {bestOffer ? <WinkelnuBadge variant="success">Gesorteerd op prijs</WinkelnuBadge> : null}
                  </div>

                  <p className="wn-body-muted mt-3 text-sm leading-6">
                    Winkelnu vergelijkt beschikbare feedinformatie. Bekende verzendkosten tellen mee; controleer de definitieve prijs, voorraad en voorwaarden altijd bij de webwinkel.
                  </p>

                  {bestOffer ? (
                    <div className="mt-5 rounded-[var(--wn-radius-lg)] border border-[color:rgba(18,59,58,0.10)] bg-white/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--wn-text-muted)]">{bestPriceLabel}</p>
                      <p className="mt-1 text-3xl font-bold tracking-tight text-[var(--wn-ink)]">{formatMoney(bestOffer.totalAmount)}</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--wn-text-muted)]">
                        {bestShippingKnown ? 'Bekende verzendkosten zijn meegenomen.' : 'Verzendkosten ontbreken in de feed en kunnen de uiteindelijke prijs verhogen.'}
                      </p>
                    </div>
                  ) : null}

                  {offers.length === 0 ? (
                    <div className="wn-surface wn-body-muted mt-5 p-5 text-sm">
                      Voor dit product is momenteel geen actieve aanbieding beschikbaar.
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {offers.map(({ offer, merchant, totalAmount }, index) => {
                        const outboundHref = `/uit/${encodeURIComponent(offer.id)}?from=${encodeURIComponent(`/product/${product.slug}`)}`
                        const shippingKnown = Boolean(offer.shippingCost)
                        const shippingLabel = shippingKnown
                          ? `Verzending: ${formatMoney(offer.shippingCost!.amount)}`
                          : 'Verzendkosten niet bekend in de feed'

                        return (
                          <div key={offer.id}>
                            <p className="mb-2 text-xs font-semibold text-[var(--wn-text-muted)]">
                              {index === 0 ? 'Eerste op basis van bekende prijs' : `Optie ${index + 1}`}
                            </p>
                            <OfferCard
                              merchantName={merchant?.name ?? 'Webwinkel'}
                              itemPrice={formatMoney(offer.price.amount)}
                              totalPrice={formatMoney(totalAmount)}
                              shippingLabel={shippingLabel}
                              shippingKnown={shippingKnown}
                              availability={offer.availability}
                              href={outboundHref}
                              isBest={index === 0}
                            />
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="mt-5 rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] p-4 text-xs leading-5 text-[var(--wn-petrol-deep)]">
                    Winkelnu is geen verkoper. Je koopt bij de gekozen webwinkel; die webwinkel bepaalt de uiteindelijke prijs, betaling, levering, retour en garantie.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <WinkelnuFooter />
    </main>
  )
}

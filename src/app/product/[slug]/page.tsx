import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { OfferCard } from '@/components/storefront/offer-card'
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
  const bestTotal = offers.length > 0
    ? Math.min(...offers.map(({ totalAmount }) => Number(totalAmount)))
    : null

  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-morning)]">
        <div className="wn-container py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <section>
              <div className="flex min-h-80 items-center justify-center rounded-[var(--wn-radius-2xl)] border border-[color:rgba(18,59,58,0.10)] bg-[#f0ebe2] px-6 text-center text-sm font-medium text-[color:rgba(30,36,35,0.48)] sm:min-h-96">
                Productafbeelding volgt uit merchantfeed
              </div>
              <p className="wn-eyebrow mt-8">{product.brand ?? 'Merk onbekend'}</p>
              <h1 className="wn-heading mt-3 text-4xl sm:text-5xl">{product.title}</h1>
              {product.description ? <p className="wn-body-muted mt-6 max-w-3xl text-lg leading-8">{product.description}</p> : null}
              <div className="mt-7">
                <WinkelnuButton href="/zoeken" variant="secondary">Verder zoeken</WinkelnuButton>
              </div>
            </section>

            <aside className="lg:sticky lg:top-6">
              <div className="rounded-[var(--wn-radius-2xl)] bg-[image:var(--wn-gradient-market)] p-1 shadow-[var(--wn-shadow-lg)]">
                <div className="rounded-[calc(var(--wn-radius-2xl)-4px)] bg-[var(--wn-cream)] p-5 sm:p-6">
                  <p className="text-sm font-semibold text-[var(--wn-petrol)]">Vergelijk {offers.length} {offers.length === 1 ? 'aanbieding' : 'aanbiedingen'}</p>
                  <p className="wn-body-muted mt-2 text-sm leading-6">Je kiest hier een winkel; de aankoop en betaling vinden bij die winkel plaats.</p>

                  {offers.length === 0 ? (
                    <div className="wn-surface wn-body-muted mt-5 p-5 text-sm">
                      Voor dit product is momenteel geen actieve aanbieding beschikbaar.
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {offers.map(({ offer, merchant, totalAmount }) => {
                        const outboundHref = `/uit/${encodeURIComponent(offer.id)}?from=${encodeURIComponent(`/product/${product.slug}`)}`
                        const isBest = bestTotal !== null && Number(totalAmount) === bestTotal
                        const shippingLabel = offer.shippingCost
                          ? `Verzending: ${formatMoney(offer.shippingCost.amount)}`
                          : 'Verzendkosten niet apart bekend'

                        return (
                          <OfferCard
                            key={offer.id}
                            merchantName={merchant?.name ?? 'Webwinkel'}
                            itemPrice={formatMoney(offer.price.amount)}
                            totalPrice={formatMoney(totalAmount)}
                            shippingLabel={shippingLabel}
                            availability={offer.availability}
                            href={outboundHref}
                            isBest={isBest}
                          />
                        )
                      })}
                    </div>
                  )}

                  <p className="mt-5 text-xs leading-5 text-[var(--wn-text-muted)]">
                    Winkelnu verkoopt dit product niet zelf. Je gaat voor aankoop door naar de betreffende winkel.
                  </p>
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

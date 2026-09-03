import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-950">
          ← Terug naar Winkelnu
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <div className="flex min-h-96 items-center justify-center rounded-3xl bg-zinc-100 px-6 text-center text-sm font-medium text-zinc-400">
              Productafbeelding volgt uit merchantfeed
            </div>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">{product.brand ?? 'Merk onbekend'}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">{product.title}</h1>
            {product.description ? <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">{product.description}</p> : null}
          </section>

          <aside>
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-zinc-500">Vergelijk {offers.length} {offers.length === 1 ? 'aanbieding' : 'aanbiedingen'}</p>
              <div className="mt-4 space-y-4">
                {offers.map(({ offer, merchant, totalAmount }) => {
                  const outboundHref = `/uit/${encodeURIComponent(offer.id)}?from=${encodeURIComponent(`/product/${product.slug}`)}`

                  return (
                    <div key={offer.id} className="rounded-2xl border border-zinc-200 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-zinc-500">{merchant?.name ?? 'Webwinkel'}</p>
                          <p className="mt-1 text-2xl font-bold text-zinc-950">{formatMoney(offer.price.amount)}</p>
                          {offer.shippingCost ? (
                            <p className="mt-1 text-xs text-zinc-500">Verzending: {formatMoney(offer.shippingCost.amount)}</p>
                          ) : null}
                          <p className="mt-1 text-xs font-medium text-zinc-700">Totaal: {formatMoney(totalAmount)}</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                          {offer.availability === 'in_stock' ? 'Op voorraad' : 'Bekijk status'}
                        </span>
                      </div>
                      <a
                        href={outboundHref}
                        rel="nofollow sponsored"
                        className="mt-5 flex w-full items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
                      >
                        Bekijk aanbieding
                      </a>
                    </div>
                  )
                })}
              </div>
              <p className="mt-5 text-xs leading-5 text-zinc-500">
                Winkelnu verkoopt dit product niet zelf. Je gaat voor aankoop door naar de betreffende winkel.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

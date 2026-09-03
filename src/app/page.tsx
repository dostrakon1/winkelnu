import Link from 'next/link'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'

function formatMoney(amount: string): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(amount))
}

export default async function HomePage() {
  const catalog = await createStorefrontCatalogService()
  const [products, categories] = await Promise.all([
    catalog.listProducts({ limit: 12 }),
    catalog.listCategories(),
  ])

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Winkelnu.nl</p>
          <h1 className="text-5xl font-bold tracking-tight text-zinc-950 sm:text-7xl">
            Slimmer ontdekken en vergelijken.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
            Eén plek om producten en actuele aanbiedingen van verschillende winkels overzichtelijk te vergelijken.
          </p>
        </div>

        {categories.length > 0 ? (
          <section className="mt-12" aria-labelledby="categories-heading">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-zinc-500">Categorieën</p>
                <h2 id="categories-heading" className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">Ontdek wat bij je past</h2>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categorie/${category.slug}`}
                  className="rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-zinc-500">Ontdek producten</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">Aanbiedingen uit meerdere winkels</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map(({ product, bestOffer, offerCount }) => {
              if (!bestOffer) return null

              return (
                <article key={product.id} className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <Link href={`/product/${product.slug}`} className="flex min-h-44 items-center justify-center rounded-2xl bg-zinc-100 px-6 text-center text-sm font-medium text-zinc-400">
                    Productafbeelding volgt uit merchantfeed
                  </Link>
                  <div className="mt-6 flex-1">
                    <p className="text-sm font-medium text-zinc-500">{product.brand ?? 'Merk onbekend'}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">
                      <Link href={`/product/${product.slug}`} className="hover:underline">
                        {product.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">{product.description}</p>
                  </div>
                  <div className="mt-6 border-t border-zinc-100 pt-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">
                          Vanaf {bestOffer.merchant?.name ?? 'webwinkel'} · {offerCount} {offerCount === 1 ? 'aanbieding' : 'aanbiedingen'}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-zinc-950">{formatMoney(bestOffer.totalAmount)}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {bestOffer.offer.availability === 'in_stock' ? 'Op voorraad' : 'Bekijk status'}
                      </span>
                    </div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="mt-5 flex w-full items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                      Vergelijk aanbiedingen
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </section>
    </main>
  )
}

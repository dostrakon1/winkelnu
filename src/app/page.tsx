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
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <div className="bg-[image:var(--wn-gradient-market)] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-bold uppercase tracking-[0.24em]">Winkelnu.nl</Link>
          <p className="hidden text-sm text-white/72 sm:block">Ontdek. Vergelijk. Kies je winkel.</p>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
        <div className="absolute inset-0 bg-[image:var(--wn-gradient-glow)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[var(--wn-warm)]">Slim winkelen begint hier</p>
            <h1 className="text-5xl font-bold tracking-tight text-[var(--wn-ink)] sm:text-7xl">
              Slimmer ontdekken en vergelijken.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:rgba(30,36,35,0.72)] sm:text-xl">
              Eén plek om producten en actuele aanbiedingen van verschillende winkels overzichtelijk te vergelijken.
            </p>
          </div>

          <form
            action="/zoeken"
            method="get"
            className="mt-9 flex max-w-2xl gap-3 rounded-2xl border border-[color:rgba(18,59,58,0.14)] bg-white p-2 shadow-[0_18px_50px_rgba(18,59,58,0.10)]"
          >
            <input
              type="search"
              name="q"
              aria-label="Zoek producten"
              placeholder="Waar ben je naar op zoek?"
              className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-[var(--wn-ink)] outline-none placeholder:text-[color:rgba(30,36,35,0.45)]"
            />
            <button className="rounded-xl bg-[var(--wn-petrol)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--wn-petrol-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-warm)]">
              Zoeken
            </button>
          </form>

          {categories.length > 0 ? (
            <section className="mt-10" aria-labelledby="categories-heading">
              <p className="text-sm font-medium text-[color:rgba(30,36,35,0.62)]">Categorieën</p>
              <h2 id="categories-heading" className="mt-2 text-2xl font-bold tracking-tight text-[var(--wn-ink)]">Ontdek wat bij je past</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categorie/${category.slug}`}
                    className="rounded-full border border-[color:rgba(18,59,58,0.16)] bg-white/75 px-5 py-2.5 text-sm font-semibold text-[var(--wn-petrol)] transition hover:border-[var(--wn-petrol)] hover:bg-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <div className="h-1 bg-[linear-gradient(90deg,var(--wn-petrol)_0%,var(--wn-petrol)_68%,var(--wn-warm)_68%,var(--wn-warm)_100%)]" aria-hidden="true" />

      <section className="bg-[image:var(--wn-gradient-morning)]">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-18">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-[var(--wn-warm)]">Ontdek producten</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--wn-ink)]">Aanbiedingen uit meerdere winkels</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map(({ product, bestOffer, offerCount }) => {
              if (!bestOffer) return null

              return (
                <article
                  key={product.id}
                  className="group flex flex-col rounded-2xl border border-[color:rgba(18,59,58,0.11)] bg-white p-5 shadow-[0_8px_24px_rgba(18,59,58,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[color:rgba(18,59,58,0.22)] hover:shadow-[0_16px_36px_rgba(18,59,58,0.09)]"
                >
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex min-h-40 items-center justify-center rounded-xl bg-[#f0ebe2] px-5 text-center text-sm font-medium text-[color:rgba(30,36,35,0.48)] transition group-hover:bg-[#ebe4d8]"
                  >
                    Productafbeelding volgt uit merchantfeed
                  </Link>
                  <div className="mt-5 flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:rgba(18,59,58,0.64)]">{product.brand ?? 'Merk onbekend'}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--wn-ink)]">
                      <Link href={`/product/${product.slug}`} className="decoration-[var(--wn-warm)] decoration-2 underline-offset-4 hover:underline">
                        {product.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[color:rgba(30,36,35,0.66)]">{product.description}</p>
                  </div>
                  <div className="mt-5 border-t border-[color:rgba(18,59,58,0.09)] pt-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs text-[color:rgba(30,36,35,0.56)]">
                          Vanaf {bestOffer.merchant?.name ?? 'webwinkel'} · {offerCount} {offerCount === 1 ? 'aanbieding' : 'aanbiedingen'}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-[var(--wn-ink)]">{formatMoney(bestOffer.totalAmount)}</p>
                      </div>
                      <span className="rounded-full bg-[#e6f1e9] px-3 py-1 text-xs font-semibold text-[#315f43]">
                        {bestOffer.offer.availability === 'in_stock' ? 'Op voorraad' : 'Bekijk status'}
                      </span>
                    </div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="mt-4 flex w-full items-center justify-center rounded-full bg-[var(--wn-petrol)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--wn-petrol-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-warm)]"
                    >
                      Vergelijk aanbiedingen
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

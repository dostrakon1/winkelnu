import { buildSyntheticCatalog } from '@/infrastructure/catalog/synthetic-catalog'

function formatMoney(amount: string): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(amount))
}

export default async function HomePage() {
  const catalog = await buildSyntheticCatalog()

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

        <div className="mt-10 flex flex-wrap gap-3 text-sm text-zinc-600">
          <span className="rounded-full border border-zinc-200 bg-white px-4 py-2">
            Demo-import: {catalog.importSummary.imported} producten
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-4 py-2">
            Afgewezen: {catalog.importSummary.rejected}
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-4 py-2">
            Merchant: {catalog.merchant.name}
          </span>
        </div>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-zinc-500">Synthetic catalog vertical slice</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">Eerste producten door de volledige keten</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {catalog.products.map(({ product, offers }) => {
              const offer = offers[0]
              if (!offer) return null

              return (
                <article key={product.id} className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="flex min-h-44 items-center justify-center rounded-2xl bg-zinc-100 px-6 text-center text-sm font-medium text-zinc-400">
                    Productafbeelding volgt uit merchantfeed
                  </div>
                  <div className="mt-6 flex-1">
                    <p className="text-sm font-medium text-zinc-500">{product.brand ?? 'Merk onbekend'}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">{product.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">{product.description}</p>
                  </div>
                  <div className="mt-6 border-t border-zinc-100 pt-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">Bij {catalog.merchant.name}</p>
                        <p className="mt-1 text-2xl font-bold text-zinc-950">{formatMoney(offer.price.amount)}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        Op voorraad
                      </span>
                    </div>
                    <a
                      href={offer.affiliateUrl}
                      rel="nofollow sponsored"
                      className="mt-5 flex w-full items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                      Bekijk aanbieding
                    </a>
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

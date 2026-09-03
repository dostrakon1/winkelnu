import type { Metadata } from 'next'
import Link from 'next/link'
import { parseCatalogSearchQuery } from '@/application/catalog/search-query'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'

export const metadata: Metadata = {
  title: 'Zoeken',
  description: 'Zoek en filter producten en aanbiedingen op Winkelnu.',
  alternates: { canonical: '/zoeken' },
  robots: { index: false, follow: true },
}

function formatMoney(amount: string): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(Number(amount))
}

function searchHref(
  raw: Record<string, string | string[] | undefined>,
  overrides: Record<string, string | number | undefined>,
): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(raw)) {
    const first = Array.isArray(value) ? value[0] : value
    if (first) params.set(key, first)
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (value == null || value === '') params.delete(key)
    else params.set(key, String(value))
  }
  const query = params.toString()
  return query ? `/zoeken?${query}` : '/zoeken'
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const raw = await searchParams
  const query = parseCatalogSearchQuery(raw)
  const catalog = await createStorefrontCatalogService()
  const [result, categories] = await Promise.all([
    catalog.searchProducts(query),
    catalog.listCategories(),
  ])

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-950">← Winkelnu</Link>

        <div className="mt-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Zoeken & filteren</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
            Vind de aanbieding die bij je past.
          </h1>
        </div>

        <form action="/zoeken" method="get" className="mt-10 grid gap-4 rounded-3xl border border-zinc-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="sm:col-span-2 lg:col-span-2">
            <span className="text-xs font-medium text-zinc-600">Zoekterm</span>
            <input name="q" defaultValue={query.term} placeholder="Bijv. hoofdtelefoon" className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm" />
          </label>
          <label>
            <span className="text-xs font-medium text-zinc-600">Categorie</span>
            <select name="categorie" defaultValue={query.categorySlug ?? ''} className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm">
              <option value="">Alle categorieën</option>
              {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
            </select>
          </label>
          <label>
            <span className="text-xs font-medium text-zinc-600">Merk</span>
            <input name="merk" defaultValue={query.brand} placeholder="Merk" className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm" />
          </label>
          <label>
            <span className="text-xs font-medium text-zinc-600">Min. totaalprijs</span>
            <input name="min" inputMode="decimal" defaultValue={query.minPrice} placeholder="0" className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm" />
          </label>
          <label>
            <span className="text-xs font-medium text-zinc-600">Max. totaalprijs</span>
            <input name="max" inputMode="decimal" defaultValue={query.maxPrice} placeholder="500" className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm" />
          </label>
          <label>
            <span className="text-xs font-medium text-zinc-600">Sorteren</span>
            <select name="sort" defaultValue={query.sort} className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm">
              <option value="relevance">Relevantie</option>
              <option value="price_asc">Laagste totaalprijs</option>
              <option value="price_desc">Hoogste totaalprijs</option>
              <option value="title_asc">Naam A–Z</option>
            </select>
          </label>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 pb-3 text-sm text-zinc-700">
              <input type="checkbox" name="voorraad" value="1" defaultChecked={query.inStockOnly} />
              Alleen op voorraad
            </label>
          </div>
          <div className="flex gap-3 sm:col-span-2 lg:col-span-4">
            <button className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white">Zoeken</button>
            <Link href="/zoeken" className="rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700">Wis filters</Link>
          </div>
        </form>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500">Pagina {result.page}</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950">
                {query.term ? `Resultaten voor “${query.term}”` : 'Producten'}
              </h2>
            </div>
          </div>

          {result.products.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 text-zinc-600">
              Geen producten gevonden met deze combinatie. Pas je zoekterm of filters aan.
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {result.products.map(({ product, bestOffer, offerCount }) => {
                if (!bestOffer) return null
                return (
                  <article key={product.id} className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <Link href={`/product/${product.slug}`} className="flex min-h-40 items-center justify-center rounded-2xl bg-zinc-100 px-5 text-center text-sm font-medium text-zinc-400">
                      Productafbeelding volgt uit merchantfeed
                    </Link>
                    <div className="mt-5 flex-1">
                      <p className="text-sm text-zinc-500">{product.brand ?? 'Merk onbekend'}</p>
                      <h3 className="mt-2 text-lg font-semibold text-zinc-950"><Link href={`/product/${product.slug}`}>{product.title}</Link></h3>
                    </div>
                    <div className="mt-5 border-t border-zinc-100 pt-4">
                      <p className="text-xs text-zinc-500">Beste bekende totaalprijs · {offerCount} {offerCount === 1 ? 'aanbieding' : 'aanbiedingen'}</p>
                      <p className="mt-1 text-2xl font-bold text-zinc-950">{formatMoney(bestOffer.totalAmount)}</p>
                      <Link href={`/product/${product.slug}`} className="mt-4 flex w-full items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white">Vergelijk aanbiedingen</Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          <nav className="mt-10 flex items-center justify-between" aria-label="Zoekresultaten pagina's">
            {result.hasPrevious ? <Link rel="prev" href={searchHref(raw, { pagina: result.page - 1 })} className="text-sm font-semibold text-zinc-700">← Vorige</Link> : <span />}
            {result.hasNext ? <Link rel="next" href={searchHref(raw, { pagina: result.page + 1 })} className="text-sm font-semibold text-zinc-700">Volgende →</Link> : null}
          </nav>
        </section>
      </div>
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'

function formatMoney(amount: string): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(Number(amount))
}

function pageNumber(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw ?? '1')
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string | string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const query = await searchParams
  const page = pageNumber(query.page)
  const catalog = await createStorefrontCatalogService()
  const category = await catalog.getCategory(slug)

  if (!category) return { title: 'Categorie niet gevonden' }

  const canonical = page === 1 ? `/categorie/${category.slug}` : `/categorie/${category.slug}?page=${page}`
  const title = page === 1 ? `${category.name} vergelijken` : `${category.name} vergelijken — pagina ${page}`

  return {
    title,
    description: `Bekijk en vergelijk producten en actuele aanbiedingen in ${category.name} bij verschillende winkels.`,
    alternates: { canonical },
    robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const { slug } = await params
  const query = await searchParams
  const requestedPage = pageNumber(query.page)
  const catalog = await createStorefrontCatalogService()
  const discovery = await catalog.getCategoryDiscovery({ categorySlug: slug, page: requestedPage, pageSize: 24 })

  if (!discovery) notFound()
  if (requestedPage > 1 && discovery.items.length === 0) notFound()

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-950">
          ← Terug naar Winkelnu
        </Link>

        <header className="mt-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">Categorie</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">{discovery.category.name}</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-600">
            Vergelijk producten en aanbiedingen van verschillende winkels. Winkelnu rangschikt bekende totale prijzen inclusief verzendkosten waar die beschikbaar zijn.
          </p>
        </header>

        {discovery.items.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-zinc-200 bg-white p-8 text-zinc-600">
            Er zijn op dit moment nog geen actieve producten in deze categorie.
          </div>
        ) : (
          <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {discovery.items.map(({ product, bestOffer, offerCount }) => (
              <article key={product.id} className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex min-h-44 items-center justify-center rounded-2xl bg-zinc-100 px-6 text-center text-sm font-medium text-zinc-400">
                  Productafbeelding
                </div>
                <div className="mt-6 flex-1">
                  <p className="text-sm font-medium text-zinc-500">{product.brand ?? 'Merk onbekend'}</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">{product.title}</h2>
                  <p className="mt-3 text-sm text-zinc-500">{offerCount} {offerCount === 1 ? 'aanbieding' : 'aanbiedingen'}</p>
                </div>
                <div className="mt-6 border-t border-zinc-100 pt-5">
                  {bestOffer ? (
                    <>
                      <p className="text-xs text-zinc-500">Beste bekende totaalprijs</p>
                      <p className="mt-1 text-2xl font-bold text-zinc-950">{formatMoney(bestOffer.totalAmount)}</p>
                    </>
                  ) : (
                    <p className="text-sm text-zinc-500">Momenteel geen actieve aanbieding.</p>
                  )}
                  <Link
                    href={`/product/${product.slug}`}
                    className="mt-5 flex w-full items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Bekijk product
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}

        {(discovery.hasPreviousPage || discovery.hasNextPage) && (
          <nav aria-label="Paginering" className="mt-12 flex items-center justify-between gap-4 border-t border-zinc-200 pt-8">
            {discovery.hasPreviousPage ? (
              <Link
                rel="prev"
                href={discovery.page === 2 ? `/categorie/${discovery.category.slug}` : `/categorie/${discovery.category.slug}?page=${discovery.page - 1}`}
                className="rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                ← Vorige
              </Link>
            ) : <span />}
            <span className="text-sm text-zinc-500">Pagina {discovery.page}</span>
            {discovery.hasNextPage ? (
              <Link
                rel="next"
                href={`/categorie/${discovery.category.slug}?page=${discovery.page + 1}`}
                className="rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                Volgende →
              </Link>
            ) : <span />}
          </nav>
        )}
      </div>
    </main>
  )
}

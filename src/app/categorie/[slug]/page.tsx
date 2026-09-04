import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/storefront/product-card'
import { SectionHeader } from '@/components/storefront/section-header'
import { WinkelnuButton } from '@/components/storefront/winkelnu-button'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'
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
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="relative overflow-hidden border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
        <div className="absolute inset-0 bg-[image:var(--wn-gradient-glow)]" aria-hidden="true" />
        <div className="wn-container relative py-12 sm:py-16">
          <SectionHeader
            eyebrow="Categorie"
            title={discovery.category.name}
            description="Vergelijk producten en aanbiedingen van verschillende winkels. Winkelnu rangschikt bekende totaalprijzen inclusief verzendkosten waar die beschikbaar zijn."
          />
          <div className="mt-7 flex flex-wrap gap-3">
            <WinkelnuButton href="/zoeken" variant="secondary">Zoek binnen Winkelnu</WinkelnuButton>
            <WinkelnuButton href="/" variant="secondary">Terug naar home</WinkelnuButton>
          </div>
        </div>
      </section>

      <section className="wn-container wn-section">
        {discovery.items.length === 0 ? (
          <div className="wn-surface wn-body-muted p-8">
            Er zijn op dit moment nog geen actieve producten in deze categorie.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {discovery.items.map(({ product, bestOffer, offerCount }) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                title={product.title}
                brand={product.brand}
                description={product.description}
                price={bestOffer ? formatMoney(bestOffer.totalAmount) : null}
                merchantName={bestOffer?.merchant?.name}
                offerCount={offerCount}
                availability={bestOffer?.offer.availability}
              />
            ))}
          </div>
        )}

        {(discovery.hasPreviousPage || discovery.hasNextPage) && (
          <nav aria-label="Paginering" className="mt-12 flex items-center justify-between gap-4 border-t border-[color:rgba(18,59,58,0.10)] pt-8">
            {discovery.hasPreviousPage ? (
              <Link
                rel="prev"
                href={discovery.page === 2 ? `/categorie/${discovery.category.slug}` : `/categorie/${discovery.category.slug}?page=${discovery.page - 1}`}
                className="text-sm font-semibold text-[var(--wn-petrol)] hover:underline"
              >
                ← Vorige
              </Link>
            ) : <span />}
            <span className="text-sm text-[var(--wn-text-muted)]">Pagina {discovery.page}</span>
            {discovery.hasNextPage ? (
              <Link
                rel="next"
                href={`/categorie/${discovery.category.slug}?page=${discovery.page + 1}`}
                className="text-sm font-semibold text-[var(--wn-petrol)] hover:underline"
              >
                Volgende →
              </Link>
            ) : <span />}
          </nav>
        )}
      </section>

      <WinkelnuFooter />
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ComparisonProductGrid } from '@/components/storefront/comparison-product-grid'
import { SectionHeader } from '@/components/storefront/section-header'
import { StorefrontEmptyState } from '@/components/storefront/storefront-empty-state'
import { WinkelnuButton } from '@/components/storefront/winkelnu-button'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'
import { WinkelnuHero } from '@/components/storefront/winkelnu-hero'
import { getProductComparisonGroup } from '@/domain/catalog/comparison'
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
  const title = page === 1 ? `${category.name} ontdekken` : `${category.name} — pagina ${page}`

  return {
    title,
    description: `Ontdek en vergelijk producten in ${category.name}. Winkelprijzen verschijnen zodra gecontroleerde aanbiedingen beschikbaar zijn.`,
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

  const isElektronica = discovery.category.slug === 'elektronica'

  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      {isElektronica ? (
        <WinkelnuHero imageSrc="/images/heroes/hero-elektronica.webp">
          <p className="wn-eyebrow">Categorie</p>
          <h1 className="wn-heading mt-3 text-4xl sm:text-5xl">{discovery.category.name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--wn-text-muted)]">
            Vind technologie die past bij hoe jij werkt, kijkt en luistert.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--wn-text-muted)]">
            Ontdek producten in deze categorie en vergelijk bekende specificaties wanneer er minimaal twee modellen van hetzelfde producttype beschikbaar zijn. Winkelprijzen, voorraad en aanbiedingen verschijnen alleen wanneer gecontroleerde winkeldata beschikbaar is.
          </p>
          <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
            <WinkelnuButton href="/zoeken" variant="secondary" className="w-full sm:w-auto">Zoek binnen Winkelnu</WinkelnuButton>
            <WinkelnuButton href="/" variant="secondary" className="w-full sm:w-auto">Terug naar home</WinkelnuButton>
          </div>
        </WinkelnuHero>
      ) : (
        <section className="relative overflow-hidden border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
          <div className="absolute inset-0 bg-[image:var(--wn-gradient-glow)]" aria-hidden="true" />
          <div className="wn-container relative py-12 sm:py-16">
            <SectionHeader
              eyebrow="Categorie"
              title={discovery.category.name}
              description="Ontdek producten in deze categorie. Waar minimaal twee modellen van hetzelfde producttype aanwezig zijn, kun je hun bekende specificaties direct naast elkaar vergelijken. Winkelprijzen, voorraad en aanbiedingen verschijnen alleen wanneer gecontroleerde winkeldata beschikbaar is."
            />
            <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
              <WinkelnuButton href="/zoeken" variant="secondary" className="w-full sm:w-auto">Zoek binnen Winkelnu</WinkelnuButton>
              <WinkelnuButton href="/" variant="secondary" className="w-full sm:w-auto">Terug naar home</WinkelnuButton>
            </div>
          </div>
        </section>
      )}

      <section className="wn-container wn-section">
        {discovery.items.length === 0 ? (
          <StorefrontEmptyState
            eyebrow="Categorie nog leeg"
            title="Hier staan op dit moment nog geen producten."
            description="De Winkelnu-catalogus wordt stapsgewijs uitgebreid. Bekijk ondertussen de andere productcategorieën."
            actionHref="/zoeken"
            actionLabel="Bekijk alle producten"
          />
        ) : (
          <ComparisonProductGrid
            items={discovery.items.map(({ product, bestOffer, offerCount }) => ({
              id: product.id,
              slug: product.slug,
              title: product.title,
              brand: product.brand,
              description: product.description,
              imageUrl: product.imageUrl,
              visualKind: product.visualKind,
              comparisonGroup: getProductComparisonGroup(product),
              price: bestOffer ? formatMoney(bestOffer.totalAmount) : null,
              merchantName: bestOffer?.merchant?.name,
              offerCount,
              availability: bestOffer?.offer.availability,
              shippingKnown: Boolean(bestOffer?.offer.shippingCost),
            }))}
          />
        )}

        {(discovery.hasPreviousPage || discovery.hasNextPage) && (
          <nav aria-label="Paginering" className="mt-12 flex items-center justify-between gap-4 border-t border-[color:rgba(18,59,58,0.10)] pt-8">
            {discovery.hasPreviousPage ? (
              <Link
                rel="prev"
                href={discovery.page === 2 ? `/categorie/${discovery.category.slug}` : `/categorie/${discovery.category.slug}?page=${discovery.page - 1}`}
                className="flex min-h-12 items-center text-sm font-semibold text-[var(--wn-petrol)] hover:underline"
              >
                ← Vorige
              </Link>
            ) : <span />}
            <span className="text-sm text-[var(--wn-text-muted)]">Pagina {discovery.page}</span>
            {discovery.hasNextPage ? (
              <Link
                rel="next"
                href={`/categorie/${discovery.category.slug}?page=${discovery.page + 1}`}
                className="flex min-h-12 items-center text-sm font-semibold text-[var(--wn-petrol)] hover:underline"
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

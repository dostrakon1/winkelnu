import type { Metadata } from 'next'
import Link from 'next/link'
import { buildCatalogSearchFacets } from '@/application/catalog/search-facets'
import { parseCatalogSearchQuery } from '@/application/catalog/search-query'
import { ComparisonProductGrid } from '@/components/storefront/comparison-product-grid'
import { SectionHeader } from '@/components/storefront/section-header'
import { StorefrontEmptyState } from '@/components/storefront/storefront-empty-state'
import { WinkelnuButton } from '@/components/storefront/winkelnu-button'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'
import { getProductComparisonGroup, getProductComparisonGroupLabel } from '@/domain/catalog/comparison'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'

export const metadata: Metadata = {
  title: 'Producten zoeken',
  description: 'Zoek producten op Winkelnu en vergelijk winkelprijzen zodra gecontroleerde aanbiedingen beschikbaar zijn.',
  alternates: { canonical: '/zoeken' },
  robots: { index: false, follow: true },
}

const SORT_LABELS = {
  relevance: 'Relevantie',
  price_asc: 'Laagste bekende prijs',
  price_desc: 'Hoogste bekende prijs',
  title_asc: 'Naam A–Z',
} as const

function formatMoney(amount: string): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(Number(amount))
}

function formatFilterPrice(amount: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(amount)
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

function filterHref(
  raw: Record<string, string | string[] | undefined>,
  overrides: Record<string, string | number | undefined>,
): string {
  return searchHref(raw, { ...overrides, pagina: undefined })
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const raw = await searchParams
  const query = parseCatalogSearchQuery(raw)
  const catalog = await createStorefrontCatalogService()
  const [result, categories, facetItems] = await Promise.all([
    catalog.searchProducts(query),
    catalog.listCategories(),
    catalog.listProducts({ categorySlug: query.categorySlug, limit: 240, offset: 0 }),
  ])
  const facets = buildCatalogSearchFacets(facetItems)
  const selectedCategory = query.categorySlug
    ? categories.find((category) => category.slug === query.categorySlug)
    : undefined
  const selectedProductTypeLabel = query.productType
    ? getProductComparisonGroupLabel(query.productType)
    : undefined
  const hasCommercialFilter = query.minPrice != null
    || query.maxPrice != null
    || query.inStockOnly
    || query.sort === 'price_asc'
    || query.sort === 'price_desc'

  const activeFilters = [
    query.term ? { label: `Zoekterm: ${query.term}`, href: filterHref(raw, { q: undefined }) } : null,
    query.categorySlug ? { label: `Categorie: ${selectedCategory?.name ?? query.categorySlug}`, href: filterHref(raw, { categorie: undefined }) } : null,
    query.productType ? { label: `Producttype: ${selectedProductTypeLabel}`, href: filterHref(raw, { type: undefined }) } : null,
    query.brand ? { label: `Merk: ${query.brand}`, href: filterHref(raw, { merk: undefined }) } : null,
    query.minPrice != null ? { label: `Vanaf ${formatFilterPrice(query.minPrice)}`, href: filterHref(raw, { min: undefined }) } : null,
    query.maxPrice != null ? { label: `Tot ${formatFilterPrice(query.maxPrice)}`, href: filterHref(raw, { max: undefined }) } : null,
    query.inStockOnly ? { label: 'Alleen op voorraad', href: filterHref(raw, { voorraad: undefined }) } : null,
    query.sort !== 'relevance' ? { label: `Sortering: ${SORT_LABELS[query.sort]}`, href: filterHref(raw, { sort: undefined }) } : null,
  ].filter((filter): filter is { label: string; href: string } => Boolean(filter))

  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
        <div className="wn-container py-12 sm:py-16">
          <SectionHeader
            eyebrow="Zoeken & ontdekken"
            title="Vind een product dat bij je past."
            description="Zoek op product, categorie, producttype en merk. Prijs- en voorraadfilters worden automatisch bruikbaar zodra daarvoor gecontroleerde winkeldata beschikbaar is."
          />

          <form action="/zoeken" method="get" className="wn-surface mt-8 grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-6">
            <label className="sm:col-span-2 lg:col-span-2">
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Zoekterm</span>
              <input name="q" defaultValue={query.term} placeholder="Bijv. hoofdtelefoon" className="wn-input mt-1 text-base sm:text-sm" />
            </label>

            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Categorie</span>
              <select name="categorie" defaultValue={query.categorySlug ?? ''} className="wn-input mt-1 text-base sm:text-sm">
                <option value="">Alle categorieën</option>
                {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
              </select>
            </label>

            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Producttype</span>
              <select name="type" defaultValue={query.productType ?? ''} className="wn-input mt-1 text-base sm:text-sm">
                <option value="">Alle producttypen</option>
                {query.productType && !facets.productTypes.some((option) => option.value === query.productType) ? (
                  <option value={query.productType}>{selectedProductTypeLabel}</option>
                ) : null}
                {facets.productTypes.map((option) => (
                  <option key={option.value} value={option.value}>{option.label} ({option.count})</option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Merk</span>
              <select name="merk" defaultValue={query.brand ?? ''} className="wn-input mt-1 text-base sm:text-sm">
                <option value="">Alle merken</option>
                {query.brand && !facets.brands.some((option) => option.value.toLocaleLowerCase('nl-NL') === query.brand?.toLocaleLowerCase('nl-NL')) ? (
                  <option value={query.brand}>{query.brand}</option>
                ) : null}
                {facets.brands.map((option) => (
                  <option key={option.value.toLocaleLowerCase('nl-NL')} value={option.value}>{option.label} ({option.count})</option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Per pagina</span>
              <select name="perPagina" defaultValue={String(query.pageSize)} className="wn-input mt-1 text-base sm:text-sm">
                <option value="12">12 producten</option>
                <option value="24">24 producten</option>
                <option value="48">48 producten</option>
              </select>
            </label>

            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Min. bekende prijs</span>
              <input
                name="min"
                inputMode="decimal"
                defaultValue={query.minPrice}
                placeholder="0"
                disabled={!facets.hasCommercialData}
                className="wn-input mt-1 text-base disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              />
            </label>

            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Max. bekende prijs</span>
              <input
                name="max"
                inputMode="decimal"
                defaultValue={query.maxPrice}
                placeholder="500"
                disabled={!facets.hasCommercialData}
                className="wn-input mt-1 text-base disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              />
            </label>

            <label className="lg:col-span-2">
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Sorteren</span>
              <select name="sort" defaultValue={query.sort} className="wn-input mt-1 text-base sm:text-sm">
                <option value="relevance">Relevantie</option>
                <option value="price_asc" disabled={!facets.hasCommercialData}>Laagste bekende prijs</option>
                <option value="price_desc" disabled={!facets.hasCommercialData}>Hoogste bekende prijs</option>
                <option value="title_asc">Naam A–Z</option>
              </select>
            </label>

            <div className="flex items-end lg:col-span-2">
              <label className={`flex min-h-12 items-center gap-3 text-sm font-medium ${facets.hasCommercialData ? 'text-[color:rgba(30,36,35,0.72)]' : 'text-[var(--wn-text-muted)] opacity-60'}`}>
                <input
                  type="checkbox"
                  name="voorraad"
                  value="1"
                  defaultChecked={query.inStockOnly}
                  disabled={!facets.hasCommercialData}
                  className="h-5 w-5 accent-[var(--wn-petrol)] disabled:cursor-not-allowed"
                />
                Alleen op voorraad
              </label>
            </div>

            {!facets.hasCommercialData ? (
              <div className="rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] px-4 py-3 text-sm leading-6 text-[var(--wn-petrol-deep)] sm:col-span-2 lg:col-span-6">
                <span className="font-semibold">Prijs & voorraad volgen.</span> Deze filters worden actief zodra Winkelnu gecontroleerde winkelprijzen en voorraad ontvangt. Zo tonen we nu geen schijnkeuzes zonder onderliggende data.
              </div>
            ) : null}

            {hasCommercialFilter && !facets.hasCommercialData ? (
              <div className="rounded-[var(--wn-radius-lg)] border border-[color:rgba(190,120,64,0.22)] bg-[color:rgba(248,226,200,0.45)] px-4 py-3 text-sm leading-6 text-[var(--wn-text-muted)] sm:col-span-2 lg:col-span-6">
                In deze URL staan nog prijs- of voorraadfilters, maar er is momenteel geen gecontroleerde winkeldata om ze toe te passen. Wis deze filters om de productcatalogus weer te zien.
              </div>
            ) : null}

            <div className="sticky bottom-3 z-10 -mx-1 flex gap-2 rounded-[var(--wn-radius-lg)] border border-[color:rgba(18,59,58,0.10)] bg-white/95 p-2 shadow-[var(--wn-shadow-md)] backdrop-blur sm:static sm:col-span-2 sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none lg:col-span-6">
              <WinkelnuButton type="submit" className="flex-1 sm:flex-none">Toon resultaten</WinkelnuButton>
              <WinkelnuButton href="/zoeken" variant="secondary" className="flex-1 sm:flex-none">Wis filters</WinkelnuButton>
            </div>
          </form>

          {activeFilters.length > 0 ? (
            <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Actieve filters">
              <span className="mr-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--wn-text-muted)]">Actieve filters</span>
              {activeFilters.map((filter) => (
                <Link
                  key={filter.label}
                  href={filter.href}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[color:rgba(18,59,58,0.12)] bg-white/78 px-3 py-2 text-sm font-semibold text-[var(--wn-petrol-deep)] transition hover:border-[color:rgba(18,59,58,0.26)] hover:bg-white"
                >
                  {filter.label}
                  <span aria-hidden="true" className="text-[var(--wn-text-muted)]">×</span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="wn-container wn-section">
        <SectionHeader
          eyebrow={`Pagina ${result.page} · ${result.products.length} getoond`}
          title={query.term ? `Resultaten voor “${query.term}”` : 'Producten'}
          description="Productinformatie is al beschikbaar. Winkelprijzen, voorraad en verzendkosten verschijnen alleen wanneer daarvoor gecontroleerde aanbiedingsdata is gekoppeld. Vergelijkbare modellen kun je hieronder direct naast elkaar zetten."
        />

        {result.products.length === 0 ? (
          <div className="mt-8">
            <StorefrontEmptyState
              eyebrow="Geen resultaten"
              title="We vinden nog geen product met deze combinatie."
              description="Pas je zoekterm of filters aan. Prijs- en voorraadfilters werken alleen wanneer gecontroleerde winkeldata beschikbaar is."
              actionHref="/zoeken"
              actionLabel="Wis alle filters"
            />
          </div>
        ) : (
          <div className="mt-8">
            <ComparisonProductGrid
              items={result.products.map(({ product, bestOffer, offerCount }) => ({
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
          </div>
        )}

        <nav className="mt-10 flex items-center justify-between border-t border-[color:rgba(18,59,58,0.10)] pt-8" aria-label="Zoekresultaten pagina's">
          {result.hasPrevious ? (
            <Link rel="prev" href={searchHref(raw, { pagina: result.page - 1 })} className="flex min-h-12 items-center text-sm font-semibold text-[var(--wn-petrol)] hover:underline">← Vorige</Link>
          ) : <span />}
          {result.hasNext ? (
            <Link rel="next" href={searchHref(raw, { pagina: result.page + 1 })} className="flex min-h-12 items-center text-sm font-semibold text-[var(--wn-petrol)] hover:underline">Volgende →</Link>
          ) : null}
        </nav>
      </section>

      <WinkelnuFooter />
    </main>
  )
}

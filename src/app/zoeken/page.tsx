import type { Metadata } from 'next'
import Link from 'next/link'
import { buildCatalogSearchFacets } from '@/application/catalog/search-facets'
import { parseCatalogSearchQuery, type CatalogSearchQuery } from '@/application/catalog/search-query'
import { analyzePredictiveSearch } from '@/application/search/predictive-search-core'
import { buildPredictiveSearchIndex } from '@/application/search/predictive-search-index'
import { suggestedSearches } from '@/application/search/search-intelligence'
import { ComparisonProductGrid } from '@/components/storefront/comparison-product-grid'
import { PredictiveSearchBox } from '@/components/storefront/predictive-search-box'
import { SectionHeader } from '@/components/storefront/section-header'
import { StorefrontEmptyState } from '@/components/storefront/storefront-empty-state'
import { WinkelnuButton } from '@/components/storefront/winkelnu-button'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'
import { getProductComparisonGroup, getProductComparisonGroupLabel } from '@/domain/catalog/comparison'
import type { Category } from '@/domain/catalog/types'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'

export const metadata: Metadata = {
  title: 'Zoeken met Winkelnu Zoekkompas',
  description: 'Zoek slim door producten, categorieën, subcategorieën en koopgidsen op Winkelnu.',
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

function hasStructuredSearchIntent(query: CatalogSearchQuery): boolean {
  return Boolean(
    query.categorySlug
      || query.productType
      || query.brand
      || query.minPrice != null
      || query.maxPrice != null
      || query.inStockOnly
      || query.sort !== 'relevance',
  )
}

function childrenFor(categories: Category[], parentId: string): Category[] {
  return categories
    .filter((category) => category.parentId === parentId)
    .sort((a, b) => a.name.localeCompare(b.name, 'nl-NL'))
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const raw = await searchParams
  const query = parseCatalogSearchQuery(raw)
  const predictiveIndex = buildPredictiveSearchIndex()
  const prediction = analyzePredictiveSearch(query.term, predictiveIndex, 6)
  const structuredIntent = hasStructuredSearchIntent(query)
  const searchIntent = Boolean(query.term) || structuredIntent
  const effectiveProductTerm = prediction.productTerm ?? (prediction.navigationOnly ? undefined : query.term)
  const effectiveQuery: CatalogSearchQuery = { ...query, term: effectiveProductTerm }
  const shouldSearchProducts = structuredIntent || Boolean(effectiveProductTerm)
  const catalog = await createStorefrontCatalogService()

  const [categories, result, facetItems] = await Promise.all([
    catalog.listCategories(),
    shouldSearchProducts ? catalog.searchProducts(effectiveQuery) : Promise.resolve(null),
    shouldSearchProducts
      ? catalog.listProducts({ categorySlug: query.categorySlug, limit: 240, offset: 0 })
      : Promise.resolve([]),
  ])

  const rootCategories = categories
    .filter((category) => !category.parentId)
    .sort((a, b) => a.name.localeCompare(b.name, 'nl-NL'))
  const childCount = categories.length - rootCategories.length
  const facets = buildCatalogSearchFacets(facetItems)
  const compassMatches = prediction.suggestions
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
  const hasAdvancedFilter = Boolean(query.categorySlug || query.productType || query.brand || hasCommercialFilter)

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

  const interpreted = Boolean(
    query.term
      && (prediction.correctedTerm
        || prediction.intents.length > 0
        || (prediction.productTerm && prediction.productTerm !== prediction.normalizedTerm)),
  )

  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="relative border-b border-white/10 bg-[var(--wn-petrol)] text-white">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-[image:var(--wn-gradient-glow)] opacity-40" />
        </div>
        <div className="wn-container relative z-10 py-14 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/65">Winkelnu Zoekkompas</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl lg:text-7xl">Waar ben je naar op zoek?</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
              Eén zoekveld voor producten, categorieën en keuzehulp. Winkelnu herkent steeds beter wat je bedoelt — ook bij een typo of een vraag als “laptop voor studie”.
            </p>
          </div>

          <PredictiveSearchBox defaultValue={query.term} index={predictiveIndex} />

          <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-white/55">Probeer:</span>
            {suggestedSearches.map((term) => (
              <Link
                key={term}
                href={`/zoeken?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-white/15 bg-white/8 px-3 py-2 font-semibold text-white/85 transition hover:bg-white/15"
              >
                {term}
              </Link>
            ))}
          </div>

          <p className="mt-7 text-center text-xs leading-6 text-white/48 sm:text-sm">
            De live voorspellingen draaien lokaal op {rootCategories.length} hoofdwerelden en {childCount} subcategorieën — zonder AI-model of database-call per toetsaanslag.
          </p>
        </div>
      </section>

      {interpreted ? (
        <section className="border-b border-[var(--wn-border)] bg-[var(--wn-petrol-soft)]">
          <div className="wn-container flex flex-wrap items-center gap-2 py-4 text-sm">
            <span className="mr-1 font-black text-[var(--wn-petrol-deep)]">Zoekkompas leest je vraag als:</span>
            {prediction.correctedTerm ? (
              <Link href={`/zoeken?q=${encodeURIComponent(prediction.correctedTerm)}`} className="rounded-full bg-white px-3 py-2 font-semibold text-[var(--wn-petrol)] shadow-[var(--wn-shadow-xs)]">
                typo → {prediction.correctedTerm}
              </Link>
            ) : null}
            {prediction.productTerm && prediction.productTerm !== prediction.normalizedTerm ? (
              <span className="rounded-full bg-white px-3 py-2 font-semibold text-[var(--wn-petrol-deep)] shadow-[var(--wn-shadow-xs)]">
                product → {prediction.productTerm}
              </span>
            ) : null}
            {prediction.intents.map((intent) => (
              <span key={intent.key} className="rounded-full border border-[color:rgba(18,59,58,0.10)] bg-white/70 px-3 py-2 font-semibold text-[var(--wn-text-muted)]">
                {intent.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {query.term && compassMatches.length > 0 ? (
        <section className="border-b border-[var(--wn-border)] bg-white/55">
          <div className="wn-container py-9 sm:py-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="wn-eyebrow">Zoekkompas denkt mee</p>
                <h2 className="wn-heading mt-2 text-2xl sm:text-3xl">Dit zijn waarschijnlijk de slimste routes.</h2>
                <p className="wn-body-muted mt-2 max-w-2xl text-sm leading-6">Winkelnu combineert je woorden, typo-correctie en herkenbare context met de eigen categorieën, collecties en keuzehulpen.</p>
              </div>
              <span className="rounded-full bg-[var(--wn-petrol-soft)] px-3 py-2 text-xs font-bold text-[var(--wn-petrol)]">{compassMatches.length} slimme routes</span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {compassMatches.map((match) => (
                <Link
                  key={`${match.kind}:${match.href}`}
                  href={match.href}
                  className="group rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-5 shadow-[var(--wn-shadow-xs)] transition hover:-translate-y-0.5 hover:border-[color:rgba(18,59,58,0.28)] hover:shadow-[var(--wn-shadow-md)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.13em] text-[var(--wn-petrol)]">{match.eyebrow}</p>
                        {match.reason === 'fuzzy' ? <span className="text-[0.65rem] font-semibold text-[var(--wn-text-muted)]">typo herkend</span> : null}
                        {match.reason === 'intent' ? <span className="text-[0.65rem] font-semibold text-[var(--wn-text-muted)]">past bij je vraag</span> : null}
                      </div>
                      <h3 className="mt-2 text-lg font-black tracking-[-0.02em] text-[var(--wn-ink)]">{match.title}</h3>
                    </div>
                    <span className="text-lg text-[var(--wn-petrol)] transition group-hover:translate-x-1" aria-hidden="true">→</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--wn-text-muted)]">{match.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="wn-container py-8 sm:py-10">
        <details open={hasAdvancedFilter} className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white/72 shadow-[var(--wn-shadow-xs)]">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <div>
              <span className="font-black text-[var(--wn-ink)]">Verfijn je zoekopdracht</span>
              <span className="ml-2 text-sm text-[var(--wn-text-muted)]">categorie, producttype, merk en prijs</span>
            </div>
            <span className="rounded-full bg-[var(--wn-petrol-soft)] px-3 py-1.5 text-xs font-bold text-[var(--wn-petrol)]">{Math.max(0, activeFilters.length - Number(Boolean(query.term)))} actief</span>
          </summary>

          <form action="/zoeken" method="get" className="grid gap-4 border-t border-[var(--wn-border)] p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-6">
            {query.term ? <input type="hidden" name="q" value={query.term} /> : null}

            <label className="sm:col-span-2 lg:col-span-2">
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Categorie</span>
              <select name="categorie" defaultValue={query.categorySlug ?? ''} className="wn-input mt-1 text-base sm:text-sm">
                <option value="">Alle categorieën</option>
                {rootCategories.map((root) => (
                  <optgroup key={root.id} label={root.name}>
                    <option value={root.slug}>{root.name} — alles</option>
                    {childrenFor(categories, root.id).map((child) => (
                      <option key={child.id} value={child.slug}>↳ {child.name}</option>
                    ))}
                  </optgroup>
                ))}
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
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Sorteren</span>
              <select name="sort" defaultValue={query.sort} className="wn-input mt-1 text-base sm:text-sm">
                <option value="relevance">Relevantie</option>
                <option value="price_asc" disabled={!facets.hasCommercialData}>Laagste bekende prijs</option>
                <option value="price_desc" disabled={!facets.hasCommercialData}>Hoogste bekende prijs</option>
                <option value="title_asc">Naam A–Z</option>
              </select>
            </label>

            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Min. bekende prijs</span>
              <input name="min" inputMode="decimal" defaultValue={query.minPrice} placeholder="0" disabled={!facets.hasCommercialData} className="wn-input mt-1 text-base disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm" />
            </label>

            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Max. bekende prijs</span>
              <input name="max" inputMode="decimal" defaultValue={query.maxPrice} placeholder="500" disabled={!facets.hasCommercialData} className="wn-input mt-1 text-base disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm" />
            </label>

            <div className="flex items-end sm:col-span-2">
              <label className={`flex min-h-12 items-center gap-3 text-sm font-medium ${facets.hasCommercialData ? 'text-[color:rgba(30,36,35,0.72)]' : 'text-[var(--wn-text-muted)] opacity-60'}`}>
                <input type="checkbox" name="voorraad" value="1" defaultChecked={query.inStockOnly} disabled={!facets.hasCommercialData} className="h-5 w-5 accent-[var(--wn-petrol)] disabled:cursor-not-allowed" />
                Alleen op voorraad
              </label>
            </div>

            {!facets.hasCommercialData && searchIntent ? (
              <div className="rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] px-4 py-3 text-sm leading-6 text-[var(--wn-petrol-deep)] sm:col-span-2 lg:col-span-6">
                <span className="font-semibold">Prijs & voorraad volgen.</span> Deze filters worden actief zodra Winkelnu gecontroleerde winkelprijzen en voorraad ontvangt. Zo tonen we geen schijnkeuzes zonder onderliggende data.
              </div>
            ) : null}

            {hasCommercialFilter && !facets.hasCommercialData ? (
              <div className="rounded-[var(--wn-radius-lg)] border border-[color:rgba(190,120,64,0.22)] bg-[color:rgba(248,226,200,0.45)] px-4 py-3 text-sm leading-6 text-[var(--wn-text-muted)] sm:col-span-2 lg:col-span-6">
                In deze URL staan prijs- of voorraadfilters, maar er is momenteel geen gecontroleerde winkeldata om ze betrouwbaar toe te passen.
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-6">
              <WinkelnuButton type="submit">Filters toepassen</WinkelnuButton>
              <WinkelnuButton href={query.term ? `/zoeken?q=${encodeURIComponent(query.term)}` : '/zoeken'} variant="secondary">Filters wissen</WinkelnuButton>
            </div>
          </form>
        </details>

        {activeFilters.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Actieve filters">
            <span className="mr-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--wn-text-muted)]">Actief</span>
            {activeFilters.map((filter) => (
              <Link key={filter.label} href={filter.href} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[color:rgba(18,59,58,0.12)] bg-white/78 px-3 py-2 text-sm font-semibold text-[var(--wn-petrol-deep)] transition hover:border-[color:rgba(18,59,58,0.26)] hover:bg-white">
                {filter.label}<span aria-hidden="true" className="text-[var(--wn-text-muted)]">×</span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      {!searchIntent ? (
        <section className="wn-container pb-16 sm:pb-20">
          <SectionHeader
            eyebrow="Ontdek zonder precies te weten wat je zoekt"
            title="Begin bij een wereld. Verfijn daarna vanzelf."
            description="Iedere hoofdcategorie bevat vijf vaste subcategorieën. Je kunt breed beginnen en steeds gerichter doorklikken zonder opnieuw te hoeven zoeken."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rootCategories.map((root) => (
              <article key={root.id} className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-5 shadow-[var(--wn-shadow-xs)]">
                <div className="flex items-center justify-between gap-4">
                  <Link href={`/categorie/${root.slug}`} className="text-lg font-black tracking-[-0.02em] text-[var(--wn-petrol-deep)] hover:underline">{root.name}</Link>
                  <Link href={`/zoeken?categorie=${encodeURIComponent(root.slug)}`} className="text-xs font-bold text-[var(--wn-petrol)] hover:underline">Zoek hierin →</Link>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {childrenFor(categories, root.id).map((child) => (
                    <Link key={child.id} href={`/categorie/${child.slug}`} className="rounded-full bg-[var(--wn-petrol-soft)] px-3 py-2 text-xs font-semibold text-[var(--wn-petrol-deep)] transition hover:bg-white hover:shadow-[var(--wn-shadow-xs)]">
                      {child.name}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="wn-container pb-16 sm:pb-20">
          <SectionHeader
            eyebrow={`Pagina ${result?.page ?? 1} · ${result?.products.length ?? 0} getoond`}
            title={query.term ? `Resultaten voor “${query.term}”` : selectedCategory ? selectedCategory.name : 'Zoekresultaten'}
            description={effectiveProductTerm && query.term && effectiveProductTerm !== prediction.normalizedTerm
              ? `Voor de productcatalogus zoekt Winkelnu gericht op “${effectiveProductTerm}”, terwijl de oorspronkelijke vraag en context hierboven zichtbaar blijven.`
              : 'Hieronder staan de concrete productresultaten. Gebruik Zoekkompas hierboven als je liever eerst wilt begrijpen welke categorie, subcategorie of keuzehulp het beste bij je vraag past.'}
          />

          {!result || result.products.length === 0 ? (
            <div className="mt-8">
              <StorefrontEmptyState
                eyebrow={compassMatches.length > 0 ? 'Geen exact product, wel slimme routes' : 'Geen resultaten'}
                title={compassMatches.length > 0 ? 'We vinden nog geen exact product, maar Zoekkompas begrijpt wel waar je heen wilt.' : 'We vinden nog geen product met deze combinatie.'}
                description={compassMatches.length > 0 ? 'Bekijk één van de slimme routes hierboven of maak je zoekterm iets breder.' : 'Probeer een kortere zoekterm, kies een bredere categorie of wis enkele filters.'}
                actionHref="/zoeken"
                actionLabel="Nieuwe zoekopdracht"
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

          {result ? (
            <nav className="mt-10 flex items-center justify-between border-t border-[color:rgba(18,59,58,0.10)] pt-8" aria-label="Zoekresultaten pagina's">
              {result.hasPrevious ? <Link rel="prev" href={searchHref(raw, { pagina: result.page - 1 })} className="flex min-h-12 items-center text-sm font-semibold text-[var(--wn-petrol)] hover:underline">← Vorige</Link> : <span />}
              <span className="text-sm text-[var(--wn-text-muted)]">Pagina {result.page}</span>
              {result.hasNext ? <Link rel="next" href={searchHref(raw, { pagina: result.page + 1 })} className="flex min-h-12 items-center text-sm font-semibold text-[var(--wn-petrol)] hover:underline">Volgende →</Link> : <span />}
            </nav>
          ) : null}
        </section>
      )}

      <WinkelnuFooter />
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { parseCatalogSearchQuery } from '@/application/catalog/search-query'
import { ProductCard } from '@/components/storefront/product-card'
import { SectionHeader } from '@/components/storefront/section-header'
import { StorefrontEmptyState } from '@/components/storefront/storefront-empty-state'
import { WinkelnuButton } from '@/components/storefront/winkelnu-button'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'

export const metadata: Metadata = {
  title: 'Producten zoeken',
  description: 'Zoek producten op Winkelnu en vergelijk winkelprijzen zodra gecontroleerde aanbiedingen beschikbaar zijn.',
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
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
        <div className="wn-container py-12 sm:py-16">
          <SectionHeader
            eyebrow="Zoeken & ontdekken"
            title="Vind een product dat bij je past."
            description="Zoek op product, categorie en merk. Zodra gecontroleerde winkelprijzen zijn gekoppeld, kun je hier ook op prijs, verzendkosten en voorraad vergelijken."
          />

          <form action="/zoeken" method="get" className="wn-surface mt-8 grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
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
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Merk</span>
              <input name="merk" defaultValue={query.brand} placeholder="Merk" className="wn-input mt-1 text-base sm:text-sm" />
            </label>
            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Min. bekende prijs</span>
              <input name="min" inputMode="decimal" defaultValue={query.minPrice} placeholder="0" className="wn-input mt-1 text-base sm:text-sm" />
            </label>
            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Max. bekende prijs</span>
              <input name="max" inputMode="decimal" defaultValue={query.maxPrice} placeholder="500" className="wn-input mt-1 text-base sm:text-sm" />
            </label>
            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Sorteren</span>
              <select name="sort" defaultValue={query.sort} className="wn-input mt-1 text-base sm:text-sm">
                <option value="relevance">Relevantie</option>
                <option value="price_asc">Laagste bekende prijs</option>
                <option value="price_desc">Hoogste bekende prijs</option>
                <option value="title_asc">Naam A–Z</option>
              </select>
            </label>
            <div className="flex items-end">
              <label className="flex min-h-12 items-center gap-3 text-sm font-medium text-[color:rgba(30,36,35,0.72)]">
                <input type="checkbox" name="voorraad" value="1" defaultChecked={query.inStockOnly} className="h-5 w-5 accent-[var(--wn-petrol)]" />
                Alleen op voorraad
              </label>
            </div>
            <div className="sticky bottom-3 z-10 -mx-1 flex gap-2 rounded-[var(--wn-radius-lg)] border border-[color:rgba(18,59,58,0.10)] bg-white/95 p-2 shadow-[var(--wn-shadow-md)] backdrop-blur sm:static sm:col-span-2 sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none lg:col-span-4">
              <WinkelnuButton type="submit" className="flex-1 sm:flex-none">Toon resultaten</WinkelnuButton>
              <WinkelnuButton href="/zoeken" variant="secondary" className="flex-1 sm:flex-none">Wis filters</WinkelnuButton>
            </div>
          </form>
        </div>
      </section>

      <section className="wn-container wn-section">
        <SectionHeader
          eyebrow={`Pagina ${result.page}`}
          title={query.term ? `Resultaten voor “${query.term}”` : 'Producten'}
          description="Productinformatie is al beschikbaar. Winkelprijzen, voorraad en verzendkosten verschijnen alleen wanneer daarvoor gecontroleerde aanbiedingsdata is gekoppeld."
        />

        {result.products.length === 0 ? (
          <div className="mt-8">
            <StorefrontEmptyState
              eyebrow="Geen resultaten"
              title="We vinden nog geen product met deze combinatie."
              description="Pas je zoekterm of filters aan. Prijs- en voorraadfilters tonen alleen producten waarvoor al gecontroleerde winkeldata beschikbaar is."
              actionHref="/zoeken"
              actionLabel="Wis alle filters"
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {result.products.map(({ product, bestOffer, offerCount }) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                title={product.title}
                brand={product.brand}
                description={product.description}
                imageUrl={product.imageUrl}
                visualKind={product.visualKind}
                price={bestOffer ? formatMoney(bestOffer.totalAmount) : null}
                merchantName={bestOffer?.merchant?.name}
                offerCount={offerCount}
                availability={bestOffer?.offer.availability}
                shippingKnown={Boolean(bestOffer?.offer.shippingCost)}
              />
            ))}
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

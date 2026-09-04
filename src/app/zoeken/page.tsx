import type { Metadata } from 'next'
import Link from 'next/link'
import { parseCatalogSearchQuery } from '@/application/catalog/search-query'
import { ProductCard } from '@/components/storefront/product-card'
import { SectionHeader } from '@/components/storefront/section-header'
import { WinkelnuButton } from '@/components/storefront/winkelnu-button'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'
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
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
        <div className="wn-container py-12 sm:py-16">
          <SectionHeader
            eyebrow="Zoeken & filteren"
            title="Vind de aanbieding die bij je past."
            description="Vergelijk producten op bekende totaalprijs, beschikbaarheid, categorie en merk."
          />

          <form action="/zoeken" method="get" className="wn-surface mt-8 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <label className="sm:col-span-2 lg:col-span-2">
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Zoekterm</span>
              <input name="q" defaultValue={query.term} placeholder="Bijv. hoofdtelefoon" className="wn-input mt-1" />
            </label>
            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Categorie</span>
              <select name="categorie" defaultValue={query.categorySlug ?? ''} className="wn-input mt-1">
                <option value="">Alle categorieën</option>
                {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
              </select>
            </label>
            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Merk</span>
              <input name="merk" defaultValue={query.brand} placeholder="Merk" className="wn-input mt-1" />
            </label>
            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Min. totaalprijs</span>
              <input name="min" inputMode="decimal" defaultValue={query.minPrice} placeholder="0" className="wn-input mt-1" />
            </label>
            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Max. totaalprijs</span>
              <input name="max" inputMode="decimal" defaultValue={query.maxPrice} placeholder="500" className="wn-input mt-1" />
            </label>
            <label>
              <span className="text-xs font-semibold text-[var(--wn-text-muted)]">Sorteren</span>
              <select name="sort" defaultValue={query.sort} className="wn-input mt-1">
                <option value="relevance">Relevantie</option>
                <option value="price_asc">Laagste totaalprijs</option>
                <option value="price_desc">Hoogste totaalprijs</option>
                <option value="title_asc">Naam A–Z</option>
              </select>
            </label>
            <div className="flex items-end">
              <label className="flex min-h-12 items-center gap-3 text-sm font-medium text-[color:rgba(30,36,35,0.72)]">
                <input type="checkbox" name="voorraad" value="1" defaultChecked={query.inStockOnly} className="h-4 w-4 accent-[var(--wn-petrol)]" />
                Alleen op voorraad
              </label>
            </div>
            <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-4">
              <WinkelnuButton type="submit">Zoeken</WinkelnuButton>
              <WinkelnuButton href="/zoeken" variant="secondary">Wis filters</WinkelnuButton>
            </div>
          </form>
        </div>
      </section>

      <section className="wn-container wn-section">
        <SectionHeader
          eyebrow={`Pagina ${result.page}`}
          title={query.term ? `Resultaten voor “${query.term}”` : 'Producten'}
          description="De getoonde prijs is de beste bekende totaalprijs wanneer verzendkosten bekend zijn."
        />

        {result.products.length === 0 ? (
          <div className="wn-surface wn-body-muted mt-8 p-8">
            Geen producten gevonden met deze combinatie. Pas je zoekterm of filters aan.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {result.products.map(({ product, bestOffer, offerCount }) => {
              if (!bestOffer) return null

              return (
                <ProductCard
                  key={product.id}
                  slug={product.slug}
                  title={product.title}
                  brand={product.brand}
                  description={product.description}
                  imageUrl={product.imageUrl}
                  price={formatMoney(bestOffer.totalAmount)}
                  merchantName={bestOffer.merchant?.name}
                  offerCount={offerCount}
                  availability={bestOffer.offer.availability}
                />
              )
            })}
          </div>
        )}

        <nav className="mt-10 flex items-center justify-between border-t border-[color:rgba(18,59,58,0.10)] pt-8" aria-label="Zoekresultaten pagina's">
          {result.hasPrevious ? (
            <Link rel="prev" href={searchHref(raw, { pagina: result.page - 1 })} className="text-sm font-semibold text-[var(--wn-petrol)] hover:underline">← Vorige</Link>
          ) : <span />}
          {result.hasNext ? (
            <Link rel="next" href={searchHref(raw, { pagina: result.page + 1 })} className="text-sm font-semibold text-[var(--wn-petrol)] hover:underline">Volgende →</Link>
          ) : null}
        </nav>
      </section>

      <WinkelnuFooter />
    </main>
  )
}

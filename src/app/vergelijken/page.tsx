import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MIN_COMPARISON_PRODUCTS,
  buildProductComparisonRows,
  parseComparisonProductSlugs,
  productsAreComparable,
} from '@/domain/catalog/comparison'
import { ProductMedia } from '@/components/storefront/product-media'
import { SectionHeader } from '@/components/storefront/section-header'
import { StorefrontEmptyState } from '@/components/storefront/storefront-empty-state'
import { WinkelnuBadge } from '@/components/storefront/winkelnu-badge'
import { WinkelnuButton } from '@/components/storefront/winkelnu-button'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'

export const metadata: Metadata = {
  title: 'Producten vergelijken',
  description: 'Zet vergelijkbare productspecificaties op Winkelnu naast elkaar en bekijk de belangrijkste verschillen.',
  alternates: { canonical: '/vergelijken' },
  robots: { index: false, follow: true },
}

function formatMoney(amount: string): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(Number(amount))
}

function EmptyComparison({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <section className="wn-container wn-section">
        <StorefrontEmptyState
          eyebrow="Productvergelijker"
          title={title}
          description={description}
          actionHref="/zoeken"
          actionLabel="Bekijk producten"
        />
      </section>
      <WinkelnuFooter />
    </main>
  )
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const raw = await searchParams
  const slugs = parseComparisonProductSlugs(raw.producten)
  const catalog = await createStorefrontCatalogService()
  const resolved = await Promise.all(slugs.map((slug) => catalog.getProduct(slug)))
  const items = resolved.filter((item) => item !== null)

  if (items.length < MIN_COMPARISON_PRODUCTS) {
    return (
      <EmptyComparison
        title="Selecteer minimaal twee producten."
        description="Open een productcategorie en voeg twee tot vier vergelijkbare producten toe. Winkelnu vergelijkt alleen informatie die al bij de producten bekend is."
      />
    )
  }

  const products = items.map((item) => item.product)

  if (!productsAreComparable(products)) {
    return (
      <EmptyComparison
        title="Kies producten van hetzelfde type."
        description="Een laptop en hoofdtelefoon kunnen bijvoorbeeld in dezelfde brede categorie staan, maar zijn inhoudelijk niet zinvol naast elkaar te vergelijken. Kies daarom twee tot vier modellen van hetzelfde producttype."
      />
    )
  }

  const rows = buildProductComparisonRows(products)
  const firstCategoryId = products[0]?.categoryId
  const categories = firstCategoryId ? await catalog.listCategories() : []
  const firstCategory = firstCategoryId
    ? categories.find((category) => category.id === firstCategoryId)
    : undefined
  const gridTemplateColumns = `minmax(9rem, 0.75fr) repeat(${items.length}, minmax(12rem, 1fr))`

  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
        <div className="wn-container py-12 sm:py-16">
          <SectionHeader
            eyebrow="Productvergelijker"
            title={`Vergelijk ${items.length} producten naast elkaar.`}
            description="We zetten alleen modellen van hetzelfde producttype naast elkaar en tonen uitsluitend bekende productspecificaties. Ontbrekende gegevens laten we leeg in plaats van ze in te vullen of te schatten."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {firstCategory ? (
              <WinkelnuButton href={`/categorie/${firstCategory.slug}`} variant="secondary">
                Andere producten kiezen
              </WinkelnuButton>
            ) : (
              <WinkelnuButton href="/zoeken" variant="secondary">Andere producten kiezen</WinkelnuButton>
            )}
          </div>
        </div>
      </section>

      <section className="wn-container wn-section">
        <div className="overflow-x-auto rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white shadow-[var(--wn-shadow-sm)]">
          <div className="min-w-max">
            <div className="grid border-b border-[var(--wn-border)] bg-[var(--wn-petrol-soft)]" style={{ gridTemplateColumns }}>
              <div className="p-4 text-xs font-bold uppercase tracking-[0.09em] text-[var(--wn-text-muted)] sm:p-5">Product</div>
              {items.map(({ product, offers }) => (
                <div key={product.id} className="border-l border-[var(--wn-border)] p-4 sm:p-5">
                  <ProductMedia
                    src={product.imageUrl}
                    alt={product.title}
                    visualKind={product.visualKind}
                    className="max-w-56"
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.brand ? <WinkelnuBadge variant="neutral">{product.brand}</WinkelnuBadge> : null}
                    {offers.length > 0 ? <WinkelnuBadge variant="success">{offers.length} {offers.length === 1 ? 'aanbieding' : 'aanbiedingen'}</WinkelnuBadge> : null}
                  </div>
                  <h2 className="mt-3 max-w-56 text-base font-bold leading-6 text-[var(--wn-ink)]">
                    <Link href={`/product/${product.slug}`} className="hover:underline">{product.title}</Link>
                  </h2>
                </div>
              ))}
            </div>

            <div className="grid border-b border-[var(--wn-border)]" style={{ gridTemplateColumns }}>
              <div className="p-4 text-sm font-bold text-[var(--wn-petrol-deep)] sm:p-5">Winkelprijs</div>
              {items.map(({ product, offers }) => (
                <div key={`${product.id}:price`} className="border-l border-[var(--wn-border)] p-4 text-sm leading-6 sm:p-5">
                  {offers[0]
                    ? <span className="font-bold text-[var(--wn-petrol-deep)]">Vanaf bekende totaalprijs {formatMoney(offers[0].totalAmount)}</span>
                    : <span className="text-[var(--wn-text-muted)]">Nog geen winkelprijzen gekoppeld.</span>}
                </div>
              ))}
            </div>

            {rows.map((row, rowIndex) => (
              <div
                key={row.label}
                className={`grid ${rowIndex < rows.length - 1 ? 'border-b border-[var(--wn-border)]' : ''}`}
                style={{ gridTemplateColumns }}
              >
                <div className="p-4 text-sm font-bold text-[var(--wn-petrol-deep)] sm:p-5">{row.label}</div>
                {row.values.map((value, index) => (
                  <div key={`${row.label}:${products[index]?.id ?? index}`} className="border-l border-[var(--wn-border)] p-4 text-sm leading-6 text-[var(--wn-ink)] sm:p-5">
                    {value ?? <span className="text-[var(--wn-text-muted)]">Niet vermeld</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] p-4 text-sm leading-6 text-[var(--wn-petrol-deep)]">
          Winkelnu vergelijkt hier alleen bekende productgegevens. Specificaties kunnen per uitvoering verschillen; controleer voor aankoop altijd de exacte modelcode en uiteindelijke gegevens bij de webwinkel.
        </div>
      </section>

      <WinkelnuFooter />
    </main>
  )
}

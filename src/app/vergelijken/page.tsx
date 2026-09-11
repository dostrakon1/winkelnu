import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MIN_COMPARISON_PRODUCTS,
  NOT_APPLICABLE_COMPARISON_VALUE,
  parseComparisonProductSlugs,
  productsAreComparable,
} from '@/domain/catalog/comparison'
import { buildSmartComparison } from '@/domain/catalog/comparison-intelligence'
import { ProductMedia } from '@/components/storefront/product-media'
import { StorefrontEmptyState } from '@/components/storefront/storefront-empty-state'
import { WinkelnuBadge } from '@/components/storefront/winkelnu-badge'
import { WinkelnuButton } from '@/components/storefront/winkelnu-button'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'

export const metadata: Metadata = {
  title: 'Vergelijkkompas | Producten slim vergelijken',
  description: 'Vergelijk producten op de eigenschappen die voor dit producttype echt relevant zijn en ontdek de belangrijkste verschillen.',
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
          eyebrow="Winkelnu Vergelijkkompas"
          title={title}
          description={description}
          actionHref="/zoeken"
          actionLabel="Zoek producten"
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
        title="Kies minimaal twee producten."
        description="Zoek of open een categorie en selecteer twee tot vier vergelijkbare modellen. Het Vergelijkkompas zet daarna de relevante verschillen voor je op een rij."
      />
    )
  }

  const products = items.map((item) => item.product)

  if (!productsAreComparable(products)) {
    return (
      <EmptyComparison
        title="Deze producten horen niet in één vergelijking."
        description="Winkelnu vergelijkt alleen modellen die inhoudelijk bij hetzelfde producttype horen. Kies bijvoorbeeld laptops met laptops of airfryers met airfryers."
      />
    )
  }

  const intelligence = buildSmartComparison(products)
  if (!intelligence) {
    return (
      <EmptyComparison
        title="Deze vergelijking kan nog niet slim worden opgebouwd."
        description="De producten zijn gevonden, maar Winkelnu heeft nog onvoldoende producttype-informatie om een betrouwbare vergelijking te maken."
      />
    )
  }

  const firstCategoryId = products[0]?.categoryId
  const categories = firstCategoryId ? await catalog.listCategories() : []
  const firstCategory = firstCategoryId
    ? categories.find((category) => category.id === firstCategoryId)
    : undefined
  const gridTemplateColumns = `minmax(9rem, 0.75fr) repeat(${items.length}, minmax(12rem, 1fr))`

  const knownPrices = items.map(({ offers }) => offers[0] ? Number(offers[0].totalAmount) : null)
  const completePrices = knownPrices.every((price): price is number => price !== null && Number.isFinite(price))
  const priceBestIndexes = completePrices && new Set(knownPrices).size > 1
    ? knownPrices.flatMap((price, index) => price === Math.min(...knownPrices) ? [index] : [])
    : []
  const productHighlights = intelligence.productHighlights.map((highlights, index) => [
    ...(priceBestIndexes.includes(index) ? ['Laagste bekende totaalprijs'] : []),
    ...highlights,
  ].slice(0, 3))

  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
        <div className="wn-container py-12 sm:py-16">
          <p className="wn-eyebrow">Winkelnu Vergelijkkompas</p>
          <h1 className="wn-heading mt-3 max-w-4xl text-4xl sm:text-5xl">
            Zie wat deze {intelligence.groupLabel.toLocaleLowerCase('nl-NL')} echt van elkaar onderscheidt.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--wn-text-muted)] sm:text-lg">
            Geen algemene winnaar en geen verborgen totaalscore. Winkelnu brengt de bekende productspecificaties samen, herkent verschillende benamingen voor dezelfde eigenschap en zet de belangrijkste verschillen voor dit producttype bovenaan.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <span className="mr-1 self-center text-xs font-bold uppercase tracking-[0.08em] text-[var(--wn-text-muted)]">We letten hier vooral op</span>
            {intelligence.focus.map((focus) => (
              <WinkelnuBadge key={focus} variant="neutral">{focus}</WinkelnuBadge>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {firstCategory ? (
              <WinkelnuButton href={`/categorie/${firstCategory.slug}`} variant="secondary">
                Andere producten kiezen
              </WinkelnuButton>
            ) : (
              <WinkelnuButton href="/zoeken" variant="secondary">Andere producten zoeken</WinkelnuButton>
            )}
          </div>
        </div>
      </section>

      <section className="wn-container pt-8 sm:pt-10">
        <div className="rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.14)] bg-white p-5 shadow-[var(--wn-shadow-sm)] sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <div>
              <p className="wn-eyebrow">Grootste verschillen</p>
              <h2 className="wn-heading mt-2 text-2xl sm:text-3xl">Begin bij wat er werkelijk anders is.</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--wn-text-muted)]">
                Vergelijkkompas geeft voorrang aan eigenschappen die bij {intelligence.groupLabel.toLocaleLowerCase('nl-NL')} belangrijk zijn. Alleen bekende gegevens worden gebruikt; ontbrekende informatie wordt nooit als nadeel gerekend.
              </p>
            </div>

            {intelligence.keyDifferences.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {intelligence.keyDifferences.map((row) => {
                  const visibleValues = Array.from(new Set(row.values.filter((value): value is string => Boolean(value))))
                  return (
                    <div key={row.key} className="rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--wn-text-muted)]">{row.label}</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--wn-petrol-deep)]">
                        {visibleValues.slice(0, 3).join(' ↔ ')}
                        {visibleValues.length > 3 ? ` +${visibleValues.length - 3}` : ''}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] p-5 text-sm leading-6 text-[var(--wn-petrol-deep)]">
                Op basis van de bekende kernspecificaties zijn er nog geen duidelijke inhoudelijke verschillen gevonden. De volledige tabel hieronder blijft leidend.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="wn-container wn-section">
        <div className="overflow-x-auto rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white shadow-[var(--wn-shadow-sm)]">
          <div className="min-w-max">
            <div className="grid border-b border-[var(--wn-border)] bg-[var(--wn-petrol-soft)]" style={{ gridTemplateColumns }}>
              <div className="p-4 text-xs font-bold uppercase tracking-[0.09em] text-[var(--wn-text-muted)] sm:p-5">Product</div>
              {items.map(({ product, offers }, index) => (
                <div key={product.id} className="border-l border-[var(--wn-border)] p-4 sm:p-5">
                  <ProductMedia
                    src={product.imageUrl}
                    alt={product.title}
                    visualKind={product.visualKind}
                    className="max-w-56"
                  />
                  <div className="mt-4 flex max-w-56 flex-wrap gap-2">
                    {product.brand ? <WinkelnuBadge variant="neutral">{product.brand}</WinkelnuBadge> : null}
                    {offers.length > 0 ? <WinkelnuBadge variant="success">{offers.length} {offers.length === 1 ? 'aanbieding' : 'aanbiedingen'}</WinkelnuBadge> : null}
                    {productHighlights[index].map((highlight) => (
                      <WinkelnuBadge key={highlight} variant="success">{highlight}</WinkelnuBadge>
                    ))}
                  </div>
                  <h2 className="mt-3 max-w-56 text-base font-bold leading-6 text-[var(--wn-ink)]">
                    <Link href={`/product/${product.slug}`} className="hover:underline">{product.title}</Link>
                  </h2>
                </div>
              ))}
            </div>

            <div className="grid border-b border-[var(--wn-border)]" style={{ gridTemplateColumns }}>
              <div className="p-4 text-sm font-bold text-[var(--wn-petrol-deep)] sm:p-5">Winkelprijs</div>
              {items.map(({ product, offers }, index) => {
                const highlighted = priceBestIndexes.includes(index)
                return (
                  <div
                    key={`${product.id}:price`}
                    className={`border-l border-[var(--wn-border)] p-4 text-sm leading-6 sm:p-5 ${highlighted ? 'bg-[var(--wn-petrol-soft)]' : ''}`}
                  >
                    {offers[0] ? (
                      <div className="space-y-2">
                        <span className="font-bold text-[var(--wn-petrol-deep)]">Vanaf bekende totaalprijs {formatMoney(offers[0].totalAmount)}</span>
                        {highlighted ? <div><WinkelnuBadge variant="success">Laagste bekende totaalprijs</WinkelnuBadge></div> : null}
                      </div>
                    ) : (
                      <span className="text-[var(--wn-text-muted)]">Nog geen winkelprijzen gekoppeld.</span>
                    )}
                  </div>
                )
              })}
            </div>

            {intelligence.rows.map((row, rowIndex) => (
              <div
                key={row.key}
                className={`grid ${rowIndex < intelligence.rows.length - 1 ? 'border-b border-[var(--wn-border)]' : ''}`}
                style={{ gridTemplateColumns }}
              >
                <div className="p-4 text-sm font-bold text-[var(--wn-petrol-deep)] sm:p-5">
                  {row.label}
                  {row.importance === 'primary' ? (
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--wn-text-muted)]">Kernverschil</span>
                  ) : null}
                </div>
                {row.values.map((value, index) => {
                  const notApplicable = value === NOT_APPLICABLE_COMPARISON_VALUE
                  const highlighted = row.bestProductIndexes.includes(index)
                  return (
                    <div
                      key={`${row.key}:${products[index]?.id ?? index}`}
                      className={`border-l border-[var(--wn-border)] p-4 text-sm leading-6 text-[var(--wn-ink)] sm:p-5 ${highlighted ? 'bg-[var(--wn-petrol-soft)]' : ''}`}
                    >
                      {value ? (
                        <div className="space-y-2">
                          <span className={notApplicable ? 'text-[var(--wn-text-muted)]' : undefined}>{value}</span>
                          {highlighted && row.standoutLabel ? (
                            <div><WinkelnuBadge variant="success">{row.standoutLabel}</WinkelnuBadge></div>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-[var(--wn-text-muted)]">Niet vermeld</span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] p-4 text-sm leading-6 text-[var(--wn-petrol-deep)]">
            <strong>Zo leest Vergelijkkompas:</strong> een groen sterk punt verschijnt alleen wanneer de geselecteerde modellen dezelfde meetbare eigenschap bekend hebben en de waarden rechtstreeks vergelijkbaar zijn. Er wordt geen verborgen totaalscore gebruikt.
          </div>
          <div className="rounded-[var(--wn-radius-lg)] border border-[var(--wn-border)] bg-white p-4 text-sm leading-6 text-[var(--wn-text-muted)]">
            Specificaties kunnen per uitvoering verschillen. Controleer voor aankoop altijd de exacte modelcode, actuele prijs en uiteindelijke gegevens bij de webwinkel.
          </div>
        </div>
      </section>

      <WinkelnuFooter />
    </main>
  )
}

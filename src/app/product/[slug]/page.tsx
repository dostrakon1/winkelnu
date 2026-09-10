import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { selectRelatedProducts } from '@/application/catalog/related-products'
import { ComparisonSignals } from '@/components/storefront/comparison-signals'
import { OfferCard } from '@/components/storefront/offer-card'
import { ProductCard } from '@/components/storefront/product-card'
import { ProductFacts } from '@/components/storefront/product-facts'
import { ProductMedia } from '@/components/storefront/product-media'
import { WinkelnuBadge } from '@/components/storefront/winkelnu-badge'
import { WinkelnuButton } from '@/components/storefront/winkelnu-button'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'
import { getProductGuidance } from '@/content/product-guidance'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'
import { buildProductStructuredData, serializeStructuredData } from '@/lib/seo/product-json-ld'

function formatMoney(amount: string): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(Number(amount))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const catalog = await createStorefrontCatalogService()
  const item = await catalog.getProduct(slug)

  if (!item) return { title: 'Product niet gevonden' }

  return {
    title: item.product.title,
    description: item.product.description,
    alternates: { canonical: `/product/${item.product.slug}` },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const catalog = await createStorefrontCatalogService()
  const item = await catalog.getProduct(slug)

  if (!item) notFound()

  const { product, offers } = item
  const categories = product.categoryId ? await catalog.listCategories() : []
  const category = product.categoryId ? categories.find((candidate) => candidate.id === product.categoryId) : undefined
  const guidance = getProductGuidance(product.visualKind)
  const categoryCandidates = category
    ? await catalog.listProducts({ categorySlug: category.slug, limit: 48, offset: 0 })
    : []
  const related = selectRelatedProducts(product, categoryCandidates, 3)
  const showingComparableModels = related.comparable.length > 0
  const relatedItems = showingComparableModels ? related.comparable : related.categoryAlternatives
  const comparisonPeer = related.comparable[0]?.product
  const comparisonHref = comparisonPeer
    ? `/vergelijken?producten=${encodeURIComponent(`${product.slug},${comparisonPeer.slug}`)}`
    : null
  const bestOffer = offers[0]?.offer
  const bestKnownTotal = offers[0]?.totalAmount
  const structuredData = buildProductStructuredData({ product, category })

  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeStructuredData(structuredData) }}
      />
      <WinkelnuHeader />

      <section className="wn-container py-7 sm:py-10 lg:py-12">
        <nav aria-label="Broodkruimel" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--wn-text-muted)]">
          <Link href="/" className="transition hover:text-[var(--wn-petrol)]">Home</Link>
          <span aria-hidden="true">/</span>
          {category ? (
            <>
              <Link href={`/categorie/${category.slug}`} className="transition hover:text-[var(--wn-petrol)]">{category.name}</Link>
              <span aria-hidden="true">/</span>
            </>
          ) : null}
          <span aria-current="page" className="max-w-full truncate font-medium text-[var(--wn-ink)]">{product.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="min-w-0 space-y-8">
            <section className="grid gap-7 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start">
              <ProductMedia src={product.imageUrl} alt={product.title} variant="detail" visualKind={product.visualKind} />

              <div>
                <div className="flex flex-wrap gap-2">
                  {category ? <WinkelnuBadge>{category.name}</WinkelnuBadge> : null}
                  {product.brand ? <WinkelnuBadge variant="neutral">{product.brand}</WinkelnuBadge> : null}
                  {bestOffer ? <WinkelnuBadge variant="success">{bestOffer.availability === 'in_stock' ? 'Op voorraad' : 'Controleer voorraad'}</WinkelnuBadge> : null}
                </div>

                <h1 className="wn-heading mt-4 text-3xl sm:text-4xl lg:text-5xl">{product.title}</h1>
                {product.description ? <p className="wn-body-muted mt-5 max-w-2xl text-base leading-8 sm:text-lg">{product.description}</p> : null}

                {bestOffer && bestKnownTotal ? (
                  <div className="mt-6 rounded-[var(--wn-radius-lg)] border border-[color:rgba(18,59,58,0.10)] bg-white p-5 lg:hidden">
                    <p className="text-xs font-semibold uppercase tracking-[0.09em] text-[var(--wn-text-muted)]">Vanaf bekende prijs</p>
                    <p className="mt-2 text-3xl font-bold text-[var(--wn-petrol-deep)]">{formatMoney(bestKnownTotal)}</p>
                    <WinkelnuButton href="#aanbiedingen" variant="warm" className="mt-4 w-full">Vergelijk winkels</WinkelnuButton>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] p-5 lg:hidden">
                    <p className="font-semibold text-[var(--wn-petrol-deep)]">Nog geen winkelprijzen gekoppeld.</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--wn-text-muted)]">Je kunt de productinformatie alvast bekijken. Gecontroleerde winkelprijzen verschijnen hier zodra ze beschikbaar zijn.</p>
                  </div>
                )}
              </div>
            </section>

            <ProductFacts
              brand={product.brand}
              gtin={product.gtin}
              mpn={product.mpn}
              offerCount={offers.length}
              specifications={product.specifications}
              source={product.source}
            />

            {guidance ? (
              <section className="wn-surface overflow-hidden p-6 sm:p-7">
                <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                  <div>
                    <p className="wn-eyebrow">Keuzehulp</p>
                    <h2 className="wn-heading mt-2 text-2xl sm:text-3xl">{guidance.heading}</h2>
                    <ul className="mt-5 grid gap-3 text-sm leading-6 text-[var(--wn-text-muted)] sm:grid-cols-3">
                      {guidance.points.map((point, index) => (
                        <li key={point} className="rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] p-4">
                          <span className="mb-2 block text-xs font-bold tabular-nums text-[var(--wn-petrol)]">0{index + 1}</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(guidance.guide || comparisonHref) ? (
                    <div className="flex flex-col gap-3 sm:flex-row lg:w-48 lg:flex-col">
                      {guidance.guide ? (
                        <WinkelnuButton href={`/koopgidsen/${guidance.guide.slug}`} variant="secondary" className="w-full">
                          Lees de koopgids
                        </WinkelnuButton>
                      ) : null}
                      {comparisonHref ? (
                        <WinkelnuButton href={comparisonHref} className="w-full">
                          Vergelijk modellen
                        </WinkelnuButton>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            {category && relatedItems.length > 0 ? (
              <section aria-labelledby="related-products-heading">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="wn-eyebrow">{showingComparableModels ? 'Verder vergelijken' : 'Verder ontdekken'}</p>
                    <h2 id="related-products-heading" className="wn-heading mt-2 text-2xl sm:text-3xl">
                      {showingComparableModels ? 'Vergelijkbare modellen' : `Meer uit ${category.name}`}
                    </h2>
                  </div>
                  <p className="wn-body-muted max-w-lg text-sm leading-6">
                    {showingComparableModels
                      ? 'Deze modellen vallen binnen hetzelfde producttype en kunnen op hun bekende specificaties naast elkaar worden gezet. Dit is geen ranglijst.'
                      : 'Andere producten uit dezelfde categorie om verder te oriënteren. Dit is geen ranglijst of persoonlijke aanbeveling.'}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {relatedItems.map(({ product: relatedProduct, bestOffer: relatedBestOffer, offerCount }) => (
                    <ProductCard
                      key={relatedProduct.id}
                      slug={relatedProduct.slug}
                      title={relatedProduct.title}
                      brand={relatedProduct.brand}
                      description={relatedProduct.description}
                      imageUrl={relatedProduct.imageUrl}
                      visualKind={relatedProduct.visualKind}
                      price={relatedBestOffer ? formatMoney(relatedBestOffer.totalAmount) : null}
                      merchantName={relatedBestOffer?.merchant?.name}
                      offerCount={offerCount}
                      availability={relatedBestOffer?.offer.availability}
                      shippingKnown={Boolean(relatedBestOffer?.offer.shippingCost)}
                      secondaryAction={showingComparableModels ? (
                        <WinkelnuButton
                          href={`/vergelijken?producten=${encodeURIComponent(`${product.slug},${relatedProduct.slug}`)}`}
                          variant="secondary"
                          className="w-full"
                        >
                          Vergelijk met dit model
                        </WinkelnuButton>
                      ) : undefined}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section id="aanbiedingen" className="scroll-mt-24">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="wn-eyebrow">Vergelijk winkels</p>
                  <h2 className="wn-heading mt-2 text-2xl sm:text-3xl">Beschikbare aanbiedingen</h2>
                </div>
                <p className="wn-body-muted max-w-md text-sm">Wanneer winkeldata is gekoppeld, tonen we bekende prijsinformatie. Controleer de uiteindelijke prijs en voorwaarden altijd bij de webwinkel.</p>
              </div>

              {offers.length > 0 ? <ComparisonSignals /> : null}

              {offers.length === 0 ? (
                <div className="wn-surface mt-5 p-6">
                  <p className="font-semibold">Nog geen winkelprijzen gekoppeld.</p>
                  <p className="wn-body-muted mt-2 text-sm leading-6">Winkelnu toont dit product alvast in de catalogus. Zodra een gecontroleerde winkel- of affiliatefeed een aanbieding voor dit product levert, verschijnt die hier automatisch.</p>
                  {category ? <WinkelnuButton href={`/categorie/${category.slug}`} variant="secondary" className="mt-5">Bekijk vergelijkbare producten</WinkelnuButton> : null}
                </div>
              ) : (
                <div className="mt-5 space-y-4 lg:hidden">
                  {offers.map(({ offer, merchant, totalAmount }, index) => {
                    const outboundHref = `/uit/${encodeURIComponent(offer.id)}?from=${encodeURIComponent(`/product/${product.slug}`)}`
                    const shippingKnown = Boolean(offer.shippingCost)
                    const shippingLabel = shippingKnown
                      ? `Verzending: ${formatMoney(offer.shippingCost!.amount)}`
                      : 'Verzendkosten niet bekend in de feed'

                    return (
                      <div key={offer.id}>
                        <p className="mb-2 text-xs font-semibold text-[var(--wn-text-muted)]">
                          {index === 0 ? 'Eerste op basis van bekende prijs' : `Optie ${index + 1}`}
                        </p>
                        <OfferCard
                          merchantName={merchant?.name ?? 'Webwinkel'}
                          itemPrice={formatMoney(offer.price.amount)}
                          totalPrice={formatMoney(totalAmount)}
                          shippingLabel={shippingLabel}
                          shippingKnown={shippingKnown}
                          availability={offer.availability ?? 'unknown'}
                          href={outboundHref}
                          isBest={index === 0}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="hidden lg:block lg:sticky lg:top-24">
            <div className="wn-surface p-5">
              <p className="wn-eyebrow">Aanbiedingen</p>
              <h2 className="wn-heading mt-2 text-2xl">{offers.length > 0 ? 'Kies je winkel' : 'Winkelprijzen volgen'}</h2>
              <p className="wn-body-muted mt-3 text-sm leading-6">{offers.length > 0 ? 'Vergelijk de bekende prijsinformatie en ga daarna rechtstreeks naar de webwinkel.' : 'Dit product staat al in de Winkelnu-catalogus. We tonen pas prijzen en winkels zodra daarvoor gecontroleerde aanbiedingsdata beschikbaar is.'}</p>

              <div className="mt-5">
                {offers.length === 0 ? (
                  <div className="rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] p-4 text-sm leading-6 text-[var(--wn-petrol-deep)]">Nog geen winkelprijzen gekoppeld. We verzinnen geen prijzen of voorraadstatus.</div>
                ) : (
                  <div className="mt-5 space-y-4">
                    {offers.map(({ offer, merchant, totalAmount }, index) => {
                      const outboundHref = `/uit/${encodeURIComponent(offer.id)}?from=${encodeURIComponent(`/product/${product.slug}`)}`
                      const shippingKnown = Boolean(offer.shippingCost)
                      const shippingLabel = shippingKnown
                        ? `Verzending: ${formatMoney(offer.shippingCost!.amount)}`
                        : 'Verzendkosten niet bekend in de feed'

                      return (
                        <div key={offer.id}>
                          <p className="mb-2 text-xs font-semibold text-[var(--wn-text-muted)]">
                            {index === 0 ? 'Eerste op basis van bekende prijs' : `Optie ${index + 1}`}
                          </p>
                          <OfferCard
                            merchantName={merchant?.name ?? 'Webwinkel'}
                            itemPrice={formatMoney(offer.price.amount)}
                            totalPrice={formatMoney(totalAmount)}
                            shippingLabel={shippingLabel}
                            shippingKnown={shippingKnown}
                            availability={offer.availability ?? 'unknown'}
                            href={outboundHref}
                            isBest={index === 0}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="mt-5 rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] p-4 text-xs leading-5 text-[var(--wn-petrol-deep)]">
                  Winkelnu is geen verkoper. Als aanbiedingen beschikbaar zijn, koop je bij de gekozen webwinkel; die webwinkel bepaalt de uiteindelijke prijs, betaling, levering, retour en garantie.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <WinkelnuFooter />
    </main>
  )
}

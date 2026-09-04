import Link from 'next/link'
import { ComparisonSignals } from '@/components/storefront/comparison-signals'
import { ProductCard } from '@/components/storefront/product-card'
import { SectionHeader } from '@/components/storefront/section-header'
import { WinkelnuBrand } from '@/components/storefront/winkelnu-brand'
import { WinkelnuButton } from '@/components/storefront/winkelnu-button'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'
import { WinkelnuSearchField } from '@/components/storefront/winkelnu-search-field'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'

function formatMoney(amount: string): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(amount))
}

export default async function HomePage() {
  const catalog = await createStorefrontCatalogService()
  const [products, categories] = await Promise.all([
    catalog.listProducts({ limit: 12 }),
    catalog.listCategories(),
  ])

  const visibleProducts = products.filter(({ bestOffer }) => Boolean(bestOffer))
  const featuredCategories = categories.slice(0, 8)

  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="relative overflow-hidden border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
        <div className="absolute inset-0 bg-[image:var(--wn-gradient-glow)]" aria-hidden="true" />
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full border border-[color:rgba(18,59,58,0.07)]" aria-hidden="true" />
        <div className="absolute -right-6 top-36 h-48 w-48 rounded-full border border-[color:rgba(233,120,61,0.12)]" aria-hidden="true" />

        <div className="wn-container relative py-14 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[color:rgba(18,59,58,0.10)] bg-white/70 px-4 py-2 shadow-[var(--wn-shadow-xs)] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[var(--wn-warm)]" />
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--wn-petrol)]">Ontdek. Vergelijk. Kies je winkel.</span>
              </div>

              <h1 className="wn-heading max-w-3xl text-4xl sm:text-6xl lg:text-[4.6rem] lg:leading-[0.98]">
                Vind sneller wat je zoekt. Vergelijk voordat je kiest.
              </h1>
              <p className="wn-body-muted mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
                Winkelnu brengt producten en actuele aanbiedingen van verschillende webwinkels samen in één rustige vergelijkervaring.
              </p>

              <WinkelnuSearchField className="mt-8 max-w-3xl sm:mt-9" buttonLabel="Vind producten" />

              <div className="mt-5 grid gap-2 text-xs font-medium text-[color:rgba(30,36,35,0.62)] sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 sm:text-sm">
                <span>Bekende verzendkosten tellen mee</span>
                <span>Meerdere winkels naast elkaar</span>
                <span>Je rekent af bij de winkel zelf</span>
              </div>
            </div>

            <aside className="rounded-[var(--wn-radius-2xl)] border border-[color:rgba(18,59,58,0.11)] bg-white/78 p-5 shadow-[var(--wn-shadow-lg)] backdrop-blur sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <WinkelnuBrand href="" />
                <span className="rounded-full bg-[var(--wn-petrol-soft)] px-3 py-1.5 text-xs font-bold text-[var(--wn-petrol)]">Vergelijken</span>
              </div>
              <p className="mt-6 text-sm font-semibold text-[var(--wn-ink)]">Wat Winkelnu voor je op een rij zet</p>
              <div className="mt-4">
                <ComparisonSignals compact />
              </div>
              <div className="mt-5 border-t border-[color:rgba(18,59,58,0.09)] pt-4">
                <p className="text-xs leading-5 text-[var(--wn-text-muted)]">Geen checkout bij Winkelnu. Je kiest hier en koopt daarna rechtstreeks bij de webwinkel.</p>
              </div>
            </aside>
          </div>

          {featuredCategories.length > 0 ? (
            <section id="categorieen" className="mt-12 scroll-mt-6 sm:mt-14" aria-labelledby="categories-heading">
              <div className="flex items-end justify-between gap-5">
                <div>
                  <p className="wn-eyebrow">Snel ontdekken</p>
                  <h2 id="categories-heading" className="wn-heading mt-2 text-2xl sm:text-3xl">Waar wil je beginnen?</h2>
                </div>
                <Link href="/zoeken" className="hidden text-sm font-bold text-[var(--wn-petrol)] hover:underline sm:block">Alle producten →</Link>
              </div>
              <div className="mt-5 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0">
                {featuredCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categorie/${category.slug}`}
                    className="flex min-h-12 shrink-0 items-center rounded-full border border-[color:rgba(18,59,58,0.14)] bg-white/80 px-5 py-2.5 text-sm font-semibold text-[var(--wn-petrol)] shadow-[var(--wn-shadow-xs)] transition hover:-translate-y-0.5 hover:border-[var(--wn-petrol)] hover:bg-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <div className="h-1 bg-[linear-gradient(90deg,var(--wn-petrol)_0%,var(--wn-petrol)_72%,var(--wn-warm)_72%,var(--wn-warm)_100%)]" aria-hidden="true" />

      <section className="bg-[var(--wn-petrol-deep)] text-white">
        <div className="wn-container grid gap-6 py-7 sm:grid-cols-3 sm:gap-8 sm:py-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--wn-warm)]">1 · Ontdek</p>
            <p className="mt-2 text-sm leading-6 text-white/72">Zoek gericht of blader rustig door categorieën en producten.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--wn-warm)]">2 · Vergelijk</p>
            <p className="mt-2 text-sm leading-6 text-white/72">Bekijk bekende prijs, verzending, voorraadstatus en verschillende winkels.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--wn-warm)]">3 · Kies je winkel</p>
            <p className="mt-2 text-sm leading-6 text-white/72">Ga rechtstreeks door naar de webwinkel die bij jouw keuze past.</p>
          </div>
        </div>
      </section>

      <section className="bg-[image:var(--wn-gradient-morning)]">
        <div className="wn-container py-14 sm:py-20">
          <SectionHeader
            eyebrow="Nu op Winkelnu"
            title="Aanbiedingen uit meerdere winkels"
            description="Vergelijk bekende prijzen, verzendkosten waar beschikbaar, voorraadstatus en winkel."
            actionHref="/zoeken"
            actionLabel="Bekijk alle producten"
          />

          {visibleProducts.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              {visibleProducts.map(({ product, bestOffer, offerCount }) => {
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
                    shippingKnown={Boolean(bestOffer.offer.shippingCost)}
                  />
                )
              })}
            </div>
          ) : (
            <div className="wn-surface mt-8 p-7 text-sm leading-6 text-[var(--wn-text-muted)]">
              Het zichtbare aanbod wordt aangevuld zodra productfeeds actieve aanbiedingen bevatten.
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-[color:rgba(18,59,58,0.09)] bg-[var(--wn-cream)]">
        <div className="wn-container py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="wn-eyebrow">Rust boven ruis</p>
              <h2 className="wn-heading mt-3 text-3xl sm:text-4xl">Vergelijken zonder winkelstress.</h2>
              <p className="wn-body-muted mt-5 max-w-xl leading-7">
                Winkelnu is ontworpen om de keuze overzichtelijker te maken. Geen eigen checkout, geen verzonnen scores en geen kunstmatige haast — wel duidelijke product- en winkelinformatie wanneer die beschikbaar is.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <WinkelnuButton href="/zoeken">Start met zoeken</WinkelnuButton>
                <WinkelnuButton href="/#categorieen" variant="secondary">Bekijk categorieën</WinkelnuButton>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="wn-surface p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--wn-radius-md)] bg-[var(--wn-petrol-soft)] text-lg font-black text-[var(--wn-petrol)]">€</span>
                <h3 className="mt-5 text-lg font-bold">Prijs met context</h3>
                <p className="wn-body-muted mt-2 text-sm leading-6">We noemen een prijs alleen totaalprijs als bekende verzendkosten daadwerkelijk meegenomen kunnen worden.</p>
              </article>
              <article className="wn-surface p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--wn-radius-md)] bg-[color:rgba(233,120,61,0.12)] text-lg font-black text-[var(--wn-warm)]">↗</span>
                <h3 className="mt-5 text-lg font-bold">Rechtstreeks naar de winkel</h3>
                <p className="wn-body-muted mt-2 text-sm leading-6">Winkelnu helpt vergelijken; aankoop, betaling, levering, retour en garantie lopen via de gekozen webwinkel.</p>
              </article>
              <article className="wn-surface p-6 sm:col-span-2">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--wn-warm)]">Transparant vergelijken</p>
                    <h3 className="mt-2 text-xl font-bold">Data mag veranderen. De uitleg blijft duidelijk.</h3>
                    <p className="wn-body-muted mt-2 max-w-2xl text-sm leading-6">Prijzen en voorraad komen uit aangesloten productfeeds en kunnen bij de winkel wijzigen. Daarom laat Winkelnu zien wat bekend is en waar je iets nog moet controleren.</p>
                  </div>
                  <WinkelnuBrand href="" compact className="shrink-0" />
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[image:var(--wn-gradient-market)] text-white">
        <div className="absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border border-white/8" aria-hidden="true" />
        <div className="wn-container relative py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Klaar om te ontdekken?</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-5xl">Eén zoekopdracht. Meerdere winkels. Rustiger kiezen.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">Begin met een product, merk of categorie en vergelijk de beschikbare aanbiedingen op Winkelnu.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <WinkelnuButton href="/zoeken" variant="warm">Ontdek producten</WinkelnuButton>
              <WinkelnuButton href="/#categorieen" className="border-white/22 bg-white/10 text-white hover:bg-white/16">Bekijk categorieën</WinkelnuButton>
            </div>
          </div>
        </div>
      </section>

      <WinkelnuFooter />
    </main>
  )
}

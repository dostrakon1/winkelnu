import Link from 'next/link'
import { ComparisonSignals } from '@/components/storefront/comparison-signals'
import { ProductCard } from '@/components/storefront/product-card'
import { SectionHeader } from '@/components/storefront/section-header'
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

  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="relative overflow-hidden border-b border-[color:rgba(18,59,58,0.10)] bg-[image:var(--wn-gradient-welcome)]">
        <div className="absolute inset-0 bg-[image:var(--wn-gradient-glow)]" aria-hidden="true" />
        <div className="wn-container relative py-14 sm:py-24 lg:py-28">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
            <div className="max-w-3xl">
              <p className="wn-eyebrow mb-4">Slim winkelen begint hier</p>
              <h1 className="wn-heading text-4xl sm:text-7xl">Slimmer ontdekken en vergelijken.</h1>
              <p className="wn-body-muted mt-5 max-w-2xl text-lg leading-8 sm:mt-6 sm:text-xl">
                Eén plek om producten en actuele aanbiedingen van verschillende winkels overzichtelijk te vergelijken.
              </p>

              <WinkelnuSearchField className="mt-8 max-w-3xl sm:mt-9" />

              <div className="mt-5 grid gap-2 text-xs font-medium text-[color:rgba(30,36,35,0.62)] sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 sm:text-sm">
                <span>Bekende verzendkosten tellen mee</span>
                <span>Meerdere winkels naast elkaar</span>
                <span>Je rekent af bij de winkel zelf</span>
              </div>
            </div>

            <aside className="hidden lg:block">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-petrol)]">Zo vergelijkt Winkelnu</p>
              <ComparisonSignals compact />
            </aside>
          </div>

          {categories.length > 0 ? (
            <section id="categorieen" className="mt-10 scroll-mt-6" aria-labelledby="categories-heading">
              <p className="text-sm font-medium text-[color:rgba(30,36,35,0.62)]">Categorieën</p>
              <h2 id="categories-heading" className="wn-heading mt-2 text-2xl">Ontdek wat bij je past</h2>
              <div className="mt-5 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categorie/${category.slug}`}
                    className="flex min-h-12 shrink-0 items-center rounded-full border border-[color:rgba(18,59,58,0.16)] bg-white/75 px-5 py-2.5 text-sm font-semibold text-[var(--wn-petrol)] transition hover:border-[var(--wn-petrol)] hover:bg-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <div className="h-1 bg-[linear-gradient(90deg,var(--wn-petrol)_0%,var(--wn-petrol)_68%,var(--wn-warm)_68%,var(--wn-warm)_100%)]" aria-hidden="true" />

      <section className="bg-[image:var(--wn-gradient-morning)]">
        <div className="wn-container py-14 sm:py-18">
          <SectionHeader
            eyebrow="Ontdek producten"
            title="Aanbiedingen uit meerdere winkels"
            description="Vergelijk prijs, bekende verzendkosten, beschikbaarheid en winkel."
            actionHref="/zoeken"
            actionLabel="Bekijk alle producten"
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {products.map(({ product, bestOffer, offerCount }) => {
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
        </div>
      </section>

      <WinkelnuFooter />
    </main>
  )
}

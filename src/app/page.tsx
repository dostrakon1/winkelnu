import Link from 'next/link'
import { ProductCard } from '@/components/storefront/product-card'
import { SectionHeader } from '@/components/storefront/section-header'
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
        <div className="wn-container relative py-16 sm:py-24 lg:py-28">
          <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="max-w-3xl">
              <p className="wn-eyebrow mb-4">Slim winkelen begint hier</p>
              <h1 className="wn-heading text-5xl sm:text-7xl">Slimmer ontdekken en vergelijken.</h1>
              <p className="wn-body-muted mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
                Eén plek om producten en actuele aanbiedingen van verschillende winkels overzichtelijk te vergelijken.
              </p>

              <WinkelnuSearchField className="mt-9 max-w-3xl" />

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-[color:rgba(30,36,35,0.62)] sm:text-sm">
                <span>Prijs + bekende verzending</span>
                <span>Meerdere winkels naast elkaar</span>
                <span>Je rekent af bij de winkel zelf</span>
              </div>
            </div>

            <aside className="hidden rounded-3xl border border-[color:rgba(18,59,58,0.12)] bg-[color:rgba(255,255,255,0.72)] p-5 shadow-[var(--wn-shadow-lg)] backdrop-blur lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-petrol)]">Winkelnu vergelijkt</p>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm text-[color:rgba(30,36,35,0.56)]">Prijs</p>
                  <div className="mt-1 h-2 rounded-full bg-[var(--wn-petrol-soft)]"><div className="h-2 w-[86%] rounded-full bg-[var(--wn-petrol)]" /></div>
                </div>
                <div>
                  <p className="text-sm text-[color:rgba(30,36,35,0.56)]">Verzendkosten</p>
                  <div className="mt-1 h-2 rounded-full bg-[var(--wn-petrol-soft)]"><div className="h-2 w-[62%] rounded-full bg-[var(--wn-warm)]" /></div>
                </div>
                <div>
                  <p className="text-sm text-[color:rgba(30,36,35,0.56)]">Beschikbaarheid</p>
                  <div className="mt-1 h-2 rounded-full bg-[var(--wn-petrol-soft)]"><div className="h-2 w-[74%] rounded-full bg-[#4f7a63]" /></div>
                </div>
              </div>
              <p className="wn-body-muted mt-5 text-sm leading-6">Rustig vergelijken, daarna rechtstreeks door naar de winkel.</p>
            </aside>
          </div>

          {categories.length > 0 ? (
            <section className="mt-10" aria-labelledby="categories-heading">
              <p className="text-sm font-medium text-[color:rgba(30,36,35,0.62)]">Categorieën</p>
              <h2 id="categories-heading" className="wn-heading mt-2 text-2xl">Ontdek wat bij je past</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categorie/${category.slug}`}
                    className="rounded-full border border-[color:rgba(18,59,58,0.16)] bg-white/75 px-5 py-2.5 text-sm font-semibold text-[var(--wn-petrol)] transition hover:border-[var(--wn-petrol)] hover:bg-white"
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
            description="Vergelijk op bekende totaalprijs, beschikbaarheid en winkel."
            actionHref="/zoeken"
            actionLabel="Bekijk alle producten"
          />

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map(({ product, bestOffer, offerCount }) => {
              if (!bestOffer) return null

              return (
                <ProductCard
                  key={product.id}
                  slug={product.slug}
                  title={product.title}
                  brand={product.brand}
                  description={product.description}
                  price={formatMoney(bestOffer.totalAmount)}
                  merchantName={bestOffer.merchant?.name}
                  offerCount={offerCount}
                  availability={bestOffer.offer.availability}
                />
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

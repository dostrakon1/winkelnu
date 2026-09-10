import type { Metadata } from 'next'
import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { CategoryCard } from '@/components/storefront/category-card'
import { ComparisonProductGrid } from '@/components/storefront/comparison-product-grid'
import { EditorialNotice, GuideCard } from '@/components/storefront/editorial-shell'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'
import { WinkelnuHero } from '@/components/storefront/winkelnu-hero'
import { buyingGuides, editorialCategories } from '@/content/koopgidsen-public'
import { getProductComparisonGroup } from '@/domain/catalog/comparison'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'

export const metadata: Metadata = {
  title: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.',
  description: 'Ontdek producten en praktische koopgidsen. Winkelnu helpt je bewuster kiezen en voegt gecontroleerde winkelprijzen toe zodra die beschikbaar zijn.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.', description: 'Producten ontdekken, praktische koopgidsen lezen en later betrouwbare winkelprijzen vergelijken.', url: '/' },
}

const featuredGuideSlugs = new Set([
  'laptop-kopen',
  'wasmachine-kopen',
  'koffiezetapparaat-kopen',
  'accuboormachine-kopen',
  'wandelschoenen-kopen',
  'bordspel-kiezen',
])

export default async function HomePage() {
  const catalogEnabled = isPublicCatalogEnabled()
  const catalog = catalogEnabled ? await createStorefrontCatalogService() : null
  const [catalogProducts, catalogCategories] = catalog
    ? await Promise.all([catalog.listProducts({ limit: 8 }), catalog.listCategories()])
    : [[], []]
  const featuredGuides = buyingGuides.filter((guide) => featuredGuideSlugs.has(guide.slug))

  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <WinkelnuHero
          imageSrc="/images/heroes/hero-home.webp"
          priority
          aside={(
            <aside
              className="wn-surface p-6 sm:p-8"
              style={{ backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)' }}
            >
              <p className="wn-eyebrow">Zo helpt Winkelnu je</p>
              <div className="mt-6 space-y-6">
                {[
                  { number: '01', title: 'Ontdek producten', description: 'Oriënteer je op merken en producttypen die bij je gebruik passen.' },
                  { number: '02', title: 'Vergelijk met kennis', description: 'Leer welke eigenschappen, gebruikskosten en praktische verschillen belangrijk zijn.' },
                  { number: '03', title: 'Kies je winkel', description: 'Zodra aanbiedingen beschikbaar zijn, vergelijk je betrouwbare winkeldata en kies je zelf waar je koopt.' },
                ].map((item) => <div key={item.number} className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xs font-bold text-[var(--wn-petrol)]">{item.number}</span><div><h2 className="font-bold">{item.title}</h2><p className="wn-body-muted mt-1 text-sm leading-6">{item.description}</p></div></div>)}
              </div>
            </aside>
          )}
        >
          <p className="wn-eyebrow">Ontdek. Vergelijk. Kies je winkel.</p>
          <h1 className="wn-heading mt-4 text-4xl sm:text-6xl lg:text-[4.25rem]">Beter kiezen begint met weten waar je op let.</h1>
          <p className="wn-body-muted mt-6 max-w-2xl text-lg leading-8 sm:text-xl">Winkelnu helpt je producten te ontdekken en verschillen beter te begrijpen. Met duidelijke productinformatie en praktische koopgidsen ga je gerichter op zoek naar wat bij jou past.</p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--wn-text-muted)] sm:text-base">We bouwen de prijsvergelijking stap voor stap uit. Winkelprijzen, voorraad en verzendkosten tonen we alleen wanneer daarvoor gecontroleerde winkeldata beschikbaar is.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {catalogEnabled ? <Link href="/zoeken" className="wn-button wn-button-primary">Bekijk producten →</Link> : null}
            <Link href="/koopgidsen" className={catalogEnabled ? 'wn-button wn-button-secondary' : 'wn-button wn-button-primary'}>Ontdek de koopgidsen</Link>
          </div>
        </WinkelnuHero>

        {catalogEnabled && catalogProducts.length > 0 ? (
          <section id="producten" className="wn-container wn-section scroll-mt-6">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="wn-eyebrow">Productcatalogus</p>
                <h2 className="wn-heading mt-3 text-3xl sm:text-4xl">Oriënteer je alvast op producten.</h2>
                <p className="wn-body-muted mt-4 max-w-2xl">Bekijk productinformatie per categorie. Zodra betrouwbare winkelprijzen beschikbaar zijn, verschijnen die automatisch bij dezelfde producten.</p>
              </div>
              <Link href="/zoeken" className="inline-flex min-h-12 items-center font-bold text-[var(--wn-petrol)] hover:underline">Alle producten →</Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {catalogCategories.map((category) => (
                <Link key={category.id} href={`/categorie/${category.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-[var(--wn-border)] bg-white px-4 text-sm font-semibold text-[var(--wn-petrol-deep)] transition hover:border-[var(--wn-petrol)]">
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="mt-8 rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.16)] bg-[var(--wn-petrol-soft)] p-5 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-6">
              <div>
                <p className="wn-eyebrow">Productvergelijker</p>
                <h3 className="wn-heading mt-2 text-2xl">Vergelijk modellen op hun bekende specificaties.</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--wn-text-muted)]">Open een productcategorie en kies minimaal twee modellen van hetzelfde producttype. Winkelnu zet de beschikbare specificaties vervolgens overzichtelijk naast elkaar — ook zolang winkelprijzen nog niet gekoppeld zijn.</p>
              </div>
              <Link href="/categorie/wonen-huishouden" className="wn-button wn-button-primary mt-5 shrink-0 sm:mt-0">Probeer de vergelijker →</Link>
            </div>

            <div className="mt-8">
              <ComparisonProductGrid
                showIntro={false}
                gridClassName="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
                items={catalogProducts.map(({ product, bestOffer, offerCount }) => ({
                  id: product.id,
                  slug: product.slug,
                  title: product.title,
                  brand: product.brand,
                  description: product.description,
                  imageUrl: product.imageUrl,
                  visualKind: product.visualKind,
                  comparisonGroup: getProductComparisonGroup(product),
                  price: bestOffer ? new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(Number(bestOffer.totalAmount)) : null,
                  merchantName: bestOffer?.merchant?.name,
                  offerCount,
                  availability: bestOffer?.offer.availability,
                  shippingKnown: Boolean(bestOffer?.offer.shippingCost),
                }))}
              />
            </div>
          </section>
        ) : null}

        <section id="categorieen" className="border-y border-[var(--wn-border)] bg-white/50">
          <div className="wn-container wn-section scroll-mt-6">
            <p className="wn-eyebrow">Keuzehulp per onderwerp</p>
            <h2 className="wn-heading mt-3 text-3xl sm:text-4xl">Waar wil je meer over weten?</h2>
            <p className="wn-body-muted mt-4 max-w-2xl">Kies een redactionele rubriek voor uitleg en koopgidsen. Wil je concrete modellen naast elkaar zetten, gebruik dan de productcatalogus hierboven.</p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {editorialCategories.map((category) => <CategoryCard key={category.slug} category={category} />)}
            </div>
          </div>
        </section>

        <section className="wn-container wn-section">
          <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="wn-eyebrow">Uitgelichte keuzehulpen</p><h2 className="wn-heading mt-3 text-3xl sm:text-4xl">Begin met een goede voorbereiding.</h2><p className="wn-body-muted mt-4 max-w-2xl">Eén praktische keuzehulp uit iedere hoofdcategorie. Op de koopgidsenpagina vind je alle achttien gidsen.</p></div><Link href="/koopgidsen" className="inline-flex min-h-12 items-center font-bold text-[var(--wn-petrol)] hover:underline">Alle 18 koopgidsen →</Link></div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{featuredGuides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div>
        </section>

        <section className="border-y border-[var(--wn-border)] bg-white/50"><div className="wn-container wn-section"><div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"><div><p className="wn-eyebrow">Vergelijk met kennis</p><h2 className="wn-heading mt-3 text-3xl sm:text-4xl">Ontdek wat bij jou past.</h2><p className="wn-body-muted mt-5 leading-8">Van belangrijke specificaties tot gebruikskosten en onderhoud: onze gidsen helpen je de verschillen te begrijpen. Zo kun je gerichter zoeken en kiezen.</p><Link href="/koopgidsen" className="mt-5 inline-flex min-h-12 items-center font-bold text-[var(--wn-petrol)] hover:underline">Ontdek de koopgidsen →</Link></div><EditorialNotice /></div></div></section>

        <section className="border-t border-[var(--wn-border)] bg-[var(--wn-petrol-soft)]"><div className="wn-container flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="wn-heading text-2xl">Een vraag of een suggestie?</h2><p className="mt-2 text-sm leading-7 text-[var(--wn-text-muted)]">We horen graag welke productcategorie of keuzehulp jij graag op Winkelnu zou zien.</p></div><a href="mailto:info@akflow.nl?subject=Winkelnu.nl%20-%20Vraag%20of%20suggestie" className="wn-button wn-button-primary shrink-0">Contact opnemen →</a></div></section>
      </main>
      <WinkelnuFooter />
    </div>
  )
}

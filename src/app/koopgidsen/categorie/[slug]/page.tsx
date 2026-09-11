import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { Breadcrumbs, EditorialShell, GuideCard } from '@/components/storefront/editorial-shell'
import { WinkelnuSurfaceMotif } from '@/components/storefront/winkelnu-surface-motif'
import { getCategoryImage } from '@/content/category-images'
import { editorialCategories, getEditorialCategory, guidesForCategory } from '@/content/editorial-catalog'
import { getCatalogCategorySlug } from '@/content/guide-catalog-links'
import { buildEditorialCategoryStructuredData } from '@/lib/seo/editorial-json-ld'
import { serializeStructuredData } from '@/lib/seo/product-json-ld'

export const dynamicParams = false
export function generateStaticParams() { return editorialCategories.map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = getEditorialCategory(slug)
  if (!category) return { title: 'Rubriek niet gevonden', robots: { index: false } }
  const image = getCategoryImage(slug, category.title)
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/koopgidsen/categorie/${slug}` },
    openGraph: { title: category.title, description: category.description, ...(image ? { images: [{ url: image.src, alt: image.alt }] } : {}) },
  }
}

export default async function EditorialCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getEditorialCategory(slug)
  if (!category) notFound()
  const guides = guidesForCategory(slug)
  const image = getCategoryImage(slug, category.title)
  const catalogCategorySlug = getCatalogCategorySlug(slug)
  const catalogHref = isPublicCatalogEnabled() && catalogCategorySlug ? `/categorie/${catalogCategorySlug}` : null
  const structuredData = buildEditorialCategoryStructuredData({ category, guides })

  return (
    <EditorialShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(structuredData) }} />
      <div className="wn-container pt-6"><Breadcrumbs items={[{ label: 'Koopgidsen', href: '/koopgidsen' }, { label: category.title }]} /></div>
      <section className="border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
        <div className="wn-container grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12 lg:py-20">
          <div>
            <p className="wn-eyebrow">Redactionele rubriek</p>
            <h1 className="wn-heading mt-4 max-w-4xl text-4xl sm:text-5xl lg:text-6xl">{category.title}</h1>
            <p className="wn-body-muted mt-6 max-w-3xl text-lg leading-8">{category.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {catalogHref ? <Link href={catalogHref} className="wn-button wn-button-primary">Producten bekijken & vergelijken →</Link> : null}
              <Link href="/koopgidsen" className={catalogHref ? 'wn-button wn-button-secondary' : 'wn-button wn-button-primary'}>Alle koopgidsen →</Link>
            </div>
            {catalogHref ? (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--wn-text-muted)]">
                Wil je modellen naast elkaar zetten? Open de productcatalogus van deze categorie en selecteer minimaal twee vergelijkbare producten.
              </p>
            ) : null}
          </div>
          {image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-[var(--wn-petrol-soft)]">
              <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 1023px) 100vw, 45vw" className="object-cover" style={{ objectPosition: image.position }} />
            </div>
          ) : (
            <WinkelnuSurfaceMotif className="aspect-[4/3] rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)]" />
          )}
        </div>
      </section>
      <section className="wn-container wn-section">
        <h2 className="wn-heading text-3xl">Waar let je op?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{category.topics.map((topic, index) => <div key={topic} className="wn-surface p-5"><span className="text-xs font-bold text-[var(--wn-petrol)]">0{index + 1}</span><h3 className="mt-2 font-semibold">{topic}</h3></div>)}</div>
        <h2 className="wn-heading mt-14 text-3xl">Keuzehulpen in deze rubriek</h2>
        {guides.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">{guides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div>
        ) : (
          <div className="wn-surface mt-8 max-w-3xl p-6 sm:p-7">
            <p className="font-semibold text-[var(--wn-petrol-deep)]">De eerste keuzehulpen voor deze rubriek zijn in voorbereiding.</p>
            <p className="wn-body-muted mt-2 text-sm leading-7">De rubriek staat alvast klaar zodat we de komende product- en koopinformatie netjes op één vaste plek kunnen uitbreiden.</p>
          </div>
        )}
      </section>
    </EditorialShell>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs, EditorialIntro, EditorialShell } from '@/components/storefront/editorial-shell'
import { categories, getCategoryContent } from '@/content/categories'
import { editorialCollections, getEditorialCollection } from '@/content/collections'

export function generateStaticParams() {
  return editorialCollections.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const collection = getEditorialCollection(slug)
  if (!collection) return {}

  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/collecties/${collection.slug}` },
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = getEditorialCollection(slug)
  if (!collection) notFound()

  return (
    <EditorialShell>
      <div className="wn-container pt-8">
        <Breadcrumbs items={[{ label: 'Collecties' }, { label: collection.title }]} />
      </div>
      <EditorialIntro eyebrow="Winkelnu collectie" title={collection.title} description={collection.intro} />

      <section className="wn-container wn-section" aria-labelledby="themas">
        <p className="wn-eyebrow">Inspiratie over categorieën heen</p>
        <h2 id="themas" className="wn-heading mt-3 text-3xl sm:text-4xl">Kies een thema</h2>
        <p className="wn-body-muted mt-4 max-w-3xl">Deze thema&apos;s zijn redactionele verzamelingen. Producten houden altijd hun eigen vaste Winkelnu-categorie en kunnen daarnaast in één of meer collecties verschijnen.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {collection.sections.map((section) => (
            <article key={section.slug} id={section.slug} className="wn-surface flex h-full flex-col p-6 sm:p-7">
              <p className="wn-eyebrow">{section.title}</p>
              <p className="wn-body-muted mt-3 flex-1 text-sm leading-7">{section.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {section.categorySlugs.map((categorySlug) => {
                  const category = getCategoryContent(categorySlug)
                  if (!category) return null
                  return (
                    <Link key={category.slug} href={`/koopgidsen/categorie/${category.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-[var(--wn-border)] bg-white px-3 text-xs font-semibold text-[var(--wn-petrol-deep)] hover:border-[var(--wn-petrol)]">
                      {category.title}
                    </Link>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--wn-border)] bg-white/50">
        <div className="wn-container wn-section">
          <h2 className="wn-heading text-3xl">Alle productrubrieken</h2>
          <p className="wn-body-muted mt-3 max-w-2xl">Wil je gericht vergelijken? Ga dan naar de vaste productcategorie waar het product thuishoort.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link key={category.slug} href={`/koopgidsen/categorie/${category.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-[var(--wn-border)] bg-white px-4 text-sm font-semibold text-[var(--wn-petrol-deep)] hover:border-[var(--wn-petrol)]">
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </EditorialShell>
  )
}

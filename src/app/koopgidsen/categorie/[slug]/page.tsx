import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { editorialCategories, getEditorialCategory, guidesForCategory } from '@/content/koopgidsen-public'
import { getCategoryImage } from '@/content/category-images'
import { Breadcrumbs, EditorialShell, GuideCard } from '@/components/storefront/editorial-shell'

export const dynamicParams = false
export function generateStaticParams() { return editorialCategories.map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = getEditorialCategory(slug)
  if (!category) return { title: 'Rubriek niet gevonden', robots: { index: false } }
  const image = getCategoryImage(slug)
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/koopgidsen/categorie/${slug}` },
    openGraph: { title: category.title, description: category.description, ...(image ? { images: [{ url: image.src, alt: image.alt, width: 1200, height: 1200 }] } : {}) },
  }
}

export default async function EditorialCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getEditorialCategory(slug)
  if (!category) notFound()
  const guides = guidesForCategory(slug)
  const image = getCategoryImage(slug)
  return (
    <EditorialShell>
      <div className="wn-container pt-6"><Breadcrumbs items={[{ label: 'Koopgidsen', href: '/koopgidsen' }, { label: category.title }]} /></div>
      <section className="border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
        <div className="wn-container grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12 lg:py-20">
          <div>
            <p className="wn-eyebrow">Redactionele rubriek</p>
            <h1 className="wn-heading mt-4 max-w-4xl text-4xl sm:text-5xl lg:text-6xl">{category.title}</h1>
            <p className="wn-body-muted mt-6 max-w-3xl text-lg leading-8">{category.intro}</p>
            <Link href="/koopgidsen" className="wn-button wn-button-secondary mt-8">Alle koopgidsen →</Link>
          </div>
          {image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-[var(--wn-petrol-soft)]">
              <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 1023px) 100vw, 45vw" className="object-cover" style={{ objectPosition: image.position }} />
            </div>
          ) : null}
        </div>
      </section>
      <section className="wn-container wn-section">
        <h2 className="wn-heading text-3xl">Waar let je op?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{category.topics.map((topic, index) => <div key={topic} className="wn-surface p-5"><span className="text-xs font-bold text-[var(--wn-petrol)]">0{index + 1}</span><h3 className="mt-2 font-semibold">{topic}</h3></div>)}</div>
        <h2 className="wn-heading mt-14 text-3xl">Keuzehulpen in deze rubriek</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">{guides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div>
      </section>
    </EditorialShell>
  )
}

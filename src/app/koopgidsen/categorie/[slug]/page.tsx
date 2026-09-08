import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { editorialCategories, getEditorialCategory, guidesForCategory } from '@/content/koopgidsen'
import { Breadcrumbs, EditorialIntro, EditorialNotice, EditorialShell, GuideCard } from '@/components/storefront/editorial-shell'

export const dynamicParams = false
export function generateStaticParams() { return editorialCategories.map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = getEditorialCategory(slug)
  if (!category) return { title: 'Rubriek niet gevonden', robots: { index: false } }
  return { title: category.title, description: category.description, alternates: { canonical: `/koopgidsen/categorie/${slug}` } }
}

export default async function EditorialCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getEditorialCategory(slug)
  if (!category) notFound()
  const guides = guidesForCategory(slug)
  return (
    <EditorialShell>
      <div className="wn-container pt-6"><Breadcrumbs items={[{ label: 'Koopgidsen', href: '/koopgidsen' }, { label: category.title }]} /></div>
      <EditorialIntro eyebrow="Redactionele rubriek" title={category.title} description={category.intro}>
        <Link href="/koopgidsen" className="wn-button wn-button-secondary">Alle koopgidsen →</Link>
      </EditorialIntro>
      <section className="wn-container wn-section">
        <h2 className="wn-heading text-3xl">Waar let je op?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{category.topics.map((topic, index) => <div key={topic} className="wn-surface p-5"><span className="text-xs font-bold text-[var(--wn-petrol)]">0{index + 1}</span><h3 className="mt-2 font-semibold">{topic}</h3></div>)}</div>
        <h2 className="wn-heading mt-14 text-3xl">Keuzehulpen in deze rubriek</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">{guides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div>
      </section>
      <section className="wn-container pb-16"><EditorialNotice /></section>
    </EditorialShell>
  )
}

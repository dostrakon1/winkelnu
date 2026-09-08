import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buyingGuides, editorialCategories, getBuyingGuide } from '@/content/koopgidsen'
import { Breadcrumbs, EditorialShell, GuideCard } from '@/components/storefront/editorial-shell'

export const dynamicParams = false
export function generateStaticParams() { return buyingGuides.map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = getBuyingGuide(slug)
  if (!guide) return { title: 'Gids niet gevonden', robots: { index: false } }
  return { title: guide.title, description: guide.description, alternates: { canonical: `/koopgidsen/${slug}` }, openGraph: { title: guide.title, description: guide.description, type: 'article' } }
}

export default async function BuyingGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getBuyingGuide(slug)
  if (!guide) notFound()
  const category = editorialCategories.find((item) => item.slug === guide.category)
  const related = buyingGuides.filter((item) => item.slug !== guide.slug && item.category === guide.category)
  return (
    <EditorialShell>
      <div className="wn-container pt-6"><Breadcrumbs items={[{ label: 'Koopgidsen', href: '/koopgidsen' }, { label: category?.title ?? 'Rubriek', href: `/koopgidsen/categorie/${guide.category}` }, { label: guide.title }]} /></div>
      <article>
        <header className="border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
          <div className="wn-container py-10 sm:py-16">
            <p className="wn-eyebrow">Winkelnu keuzehulp</p>
            <h1 className="wn-heading mt-4 max-w-4xl text-4xl sm:text-5xl">{guide.title}</h1>
            <p className="wn-body-muted mt-6 max-w-3xl text-lg leading-8">{guide.intro}</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--wn-text-muted)]"><span>Bijgewerkt: <time dateTime={guide.updated}>{new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${guide.updated}T12:00:00Z`))}</time></span><span>{guide.readingMinutes} min leestijd</span><span>Redactie Winkelnu</span></div>
          </div>
        </header>
        <div className="wn-container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14 lg:py-16">
          <div className="min-w-0">
            <section aria-labelledby="snelle-keuze" className="wn-surface p-6 sm:p-8">
              <h2 id="snelle-keuze" className="wn-heading text-2xl">De keuze in het kort</h2>
              <div className="mt-5 divide-y divide-[var(--wn-border)]">{guide.quickChoice.map((item) => <div key={item.situation} className="py-4 first:pt-0 last:pb-0"><h3 className="font-bold">{item.situation}</h3><p className="wn-body-muted mt-2 text-sm leading-7">{item.advice}</p></div>)}</div>
            </section>
            <div className="mt-12 space-y-12">{guide.sections.map((section, index) => <section key={section.heading} id={`onderdeel-${index + 1}`} className="scroll-mt-8"><h2 className="wn-heading text-2xl sm:text-3xl">{section.heading}</h2><div className="mt-5 space-y-4 text-base leading-8 text-[var(--wn-ink)]">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>{section.bullets ? <ul className="mt-5 list-disc space-y-2 pl-5 leading-7">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}</section>)}</div>
            <section id="checklist" className="mt-12 rounded-[var(--wn-radius-xl)] bg-[var(--wn-petrol-deep)] p-6 text-white sm:p-8"><h2 className="text-2xl font-bold">Checklist voor je aankoop</h2><ul className="mt-6 space-y-4">{guide.checklist.map((item) => <li key={item} className="flex items-start gap-3"><span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--wn-warm)]"/><span className="leading-7 text-white/85">{item}</span></li>)}</ul></section>
            <section id="bronnen" className="mt-12 border-t border-[var(--wn-border)] pt-8"><h2 className="wn-heading text-2xl">Bronnen en werkwijze</h2><p className="wn-body-muted mt-4 text-sm leading-7">Deze gids is redactioneel opgesteld op basis van algemene productkennis en de onderstaande achtergrondbronnen. We hebben de genoemde producten niet zelf getest. Controleer actuele specificaties en voorwaarden bij de fabrikant of webwinkel.</p><ul className="mt-5 space-y-4">{guide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--wn-petrol)] underline underline-offset-4 hover:text-[var(--wn-petrol-deep)]">{source.title} ↗</a><p className="mt-1 text-sm leading-6 text-[var(--wn-text-muted)]">{source.note}</p></li>)}</ul></section>
          </div>
          <aside className="lg:self-start"><div className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-5"><p className="text-sm font-bold">In deze gids</p><nav aria-label="Inhoudsopgave" className="mt-4 flex flex-col gap-1">{guide.sections.map((section, index) => <a key={section.heading} href={`#onderdeel-${index + 1}`} className="rounded-lg px-2 py-2 text-sm text-[var(--wn-petrol)] hover:bg-[var(--wn-petrol-soft)]">{section.heading}</a>)}<a href="#checklist" className="rounded-lg px-2 py-2 text-sm font-semibold text-[var(--wn-petrol)] hover:bg-[var(--wn-petrol-soft)]">Aankoopchecklist</a><a href="#bronnen" className="rounded-lg px-2 py-2 text-sm text-[var(--wn-petrol)] hover:bg-[var(--wn-petrol-soft)]">Bronnen</a></nav></div></aside>
        </div>
      </article>
      {related.length > 0 ? <section className="border-t border-[var(--wn-border)] bg-white/50"><div className="wn-container wn-section"><h2 className="wn-heading text-3xl">Meer keuzehulpen</h2><div className="mt-8 grid gap-5 md:grid-cols-2">{related.map((item) => <GuideCard key={item.slug} guide={item} />)}</div><Link href="/koopgidsen" className="mt-8 inline-flex min-h-12 items-center font-bold text-[var(--wn-petrol)] hover:underline">Bekijk alle koopgidsen →</Link></div></section> : null}
    </EditorialShell>
  )
}

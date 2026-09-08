import type { Metadata } from 'next'
import Link from 'next/link'
import { buyingGuides, editorialCategories, guidesForCategory } from '@/content/koopgidsen'
import { EditorialIntro, EditorialNotice, EditorialShell, GuideCard } from '@/components/storefront/editorial-shell'

export const metadata: Metadata = {
  title: 'Koopgidsen',
  description: 'Praktische keuzehulpen voor elektronica, wonen, huishouden, keuken en koffie. Vergelijk eigenschappen voordat je een product kiest.',
  alternates: { canonical: '/koopgidsen' },
}

export default function BuyingGuidesPage() {
  return (
    <EditorialShell>
      <EditorialIntro eyebrow="Winkelnu koopgidsen" title="Een goede keuze begint met weten wat je nodig hebt." description="Ontdek praktische keuzehulpen over eigenschappen, gebruiksgemak en kosten. Zonder fictieve aanbiedingen of betaalde ranglijsten." />
      <section className="wn-container wn-section" aria-labelledby="rubrieken">
        <h2 id="rubrieken" className="wn-heading text-3xl">Ontdek een rubriek</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {editorialCategories.map((category) => (
            <article key={category.slug} className="wn-surface flex flex-col p-6">
              <p className="wn-eyebrow">Keuzehulp</p>
              <h3 className="mt-3 text-2xl font-bold">{category.title}</h3>
              <p className="wn-body-muted mt-3 flex-1 text-sm leading-7">{category.description}</p>
              <p className="mt-4 text-xs font-medium text-[var(--wn-text-muted)]">{guidesForCategory(category.slug).length} gidsen</p>
              <Link href={`/koopgidsen/categorie/${category.slug}`} className="mt-4 inline-flex min-h-12 items-center font-bold text-[var(--wn-petrol)] hover:underline">Bekijk rubriek →</Link>
            </article>
          ))}
        </div>
      </section>
      <section className="border-t border-[var(--wn-border)] bg-white/50">
        <div className="wn-container wn-section">
          <h2 className="wn-heading text-3xl">Alle koopgidsen</h2>
          <p className="wn-body-muted mt-3 max-w-2xl">Begin bij jouw gebruikssituatie en maak daarna een lijst van eigenschappen die voor jou belangrijk zijn.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{buyingGuides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div>
        </div>
      </section>
      <section className="wn-container pb-16"><EditorialNotice /></section>
    </EditorialShell>
  )
}

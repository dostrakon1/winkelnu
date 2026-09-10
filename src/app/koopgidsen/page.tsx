import type { Metadata } from 'next'
import { CategoryCard } from '@/components/storefront/category-card'
import { EditorialIntro, EditorialShell, GuideCard } from '@/components/storefront/editorial-shell'
import { buyingGuides, editorialCategories } from '@/content/editorial-catalog'

export const metadata: Metadata = {
  title: 'Koopgidsen',
  description: 'Praktische keuzehulpen voor elektronica, wonen, keuken, persoonlijke verzorging, huis en tuin, sport, outdoor, speelgoed en hobby. Vergelijk eigenschappen voordat je kiest.',
  alternates: { canonical: '/koopgidsen' },
}

export default function BuyingGuidesPage() {
  return (
    <EditorialShell>
      <EditorialIntro eyebrow="Winkelnu koopgidsen" title="Een goede keuze begint met weten wat je nodig hebt." description="Ontdek praktische keuzehulpen over eigenschappen, gebruiksgemak en kosten. Vind wat bij jouw wensen past." />
      <section className="wn-container wn-section" aria-labelledby="rubrieken">
        <h2 id="rubrieken" className="wn-heading text-3xl">Ontdek een rubriek</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {editorialCategories.map((category) => <CategoryCard key={category.slug} category={category} />)}
        </div>
      </section>
      <section className="border-t border-[var(--wn-border)] bg-white/50">
        <div className="wn-container wn-section">
          <h2 className="wn-heading text-3xl">Alle koopgidsen</h2>
          <p className="wn-body-muted mt-3 max-w-2xl">Begin bij jouw gebruikssituatie en maak daarna een lijst van eigenschappen die voor jou belangrijk zijn.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{buyingGuides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div>
        </div>
      </section>
    </EditorialShell>
  )
}

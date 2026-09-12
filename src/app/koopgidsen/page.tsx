import type { Metadata } from 'next'
import { CategoryCard } from '@/components/storefront/category-card'
import { getEditorialTone } from '@/components/storefront/editorial-design'
import { EditorialIntro, EditorialShell, GuideCard } from '@/components/storefront/editorial-shell'
import { buyingGuides, editorialCategories } from '@/content/editorial-catalog'

export const metadata: Metadata = {
  title: 'Koopgidsen',
  description: 'Praktische keuzehulpen voor elektronica, wonen, keuken, persoonlijke verzorging, baby en kind, dieren, auto en fiets, huis en tuin, sport, outdoor, speelgoed en hobby. Vergelijk eigenschappen voordat je kiest.',
  alternates: { canonical: '/koopgidsen' },
}

export default function BuyingGuidesPage() {
  return (
    <EditorialShell>
      <EditorialIntro eyebrow="Winkelnu koopgidsen" title="Een goede keuze begint met weten wat je nodig hebt." description="Ontdek praktische keuzehulpen over eigenschappen, gebruiksgemak en kosten. Vind wat bij jouw wensen past." />
      <section className="wn-container wn-section" aria-labelledby="rubrieken">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--wn-warm)]">✦ Vind je vertrekpunt</p>
        <h2 id="rubrieken" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)]">Ontdek een rubriek</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {editorialCategories.map((category) => <CategoryCard key={category.slug} category={category} />)}
        </div>
      </section>
      <section className="wn-bg-brand-warm border-t border-[var(--wn-border)]">
        <div className="wn-container wn-section">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--wn-warm)]">✦ Praktische verdieping</p>
          <h2 className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)]">Alle koopgidsen</h2>
          <p className="wn-body-muted mt-3 max-w-2xl">Begin bij jouw gebruikssituatie en maak daarna een lijst van eigenschappen die voor jou belangrijk zijn.</p>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {buyingGuides.map((guide, index) => <GuideCard key={guide.slug} guide={guide} tone={getEditorialTone(index)} />)}
          </div>
        </div>
      </section>
    </EditorialShell>
  )
}

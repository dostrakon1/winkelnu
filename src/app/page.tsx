import type { Metadata } from 'next'
import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { buyingGuides, editorialCategories, guidesForCategory } from '@/content/koopgidsen'
import { GuideCard } from '@/components/storefront/editorial-shell'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export const metadata: Metadata = {
  title: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.',
  description: 'Praktische koopgidsen voor elektronica, wonen en keuken. Ontdek welke eigenschappen belangrijk zijn en kies bewuster voordat je koopt.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.', description: 'Praktische koopgidsen en keuzehulp voor een bewustere aankoop.', url: '/' },
}

const categoryDetails: Record<string, { number: string; topics: string[] }> = {
  elektronica: { number: '01', topics: ['Laptops', 'Hoofdtelefoons'] },
  'wonen-huishouden': { number: '02', topics: ['Stofzuigers', 'Wasmachines'] },
  'keuken-koffie': { number: '03', topics: ['Koffiezetapparaten', 'Airfryers'] },
}

export default function HomePage() {
  const catalogEnabled = isPublicCatalogEnabled()
  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <section className="relative overflow-hidden border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
          <div className="absolute inset-0 bg-[image:var(--wn-gradient-glow)]" aria-hidden="true" />
          <div className="wn-container relative grid items-center gap-8 py-10 sm:py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12 lg:py-20">
            <div className="max-w-3xl">
              <p className="wn-eyebrow">Ontdek. Vergelijk. Kies je winkel.</p>
              <h1 className="wn-heading mt-4 text-4xl sm:text-6xl lg:text-[4.25rem]">Kies met kennis. Koop met vertrouwen.</h1>
              <p className="wn-body-muted mt-6 max-w-2xl text-lg leading-8 sm:text-xl">Van een laptop voor je studie tot een zuinige wasmachine: ontdek welke eigenschappen ertoe doen en wat bij jouw wensen past.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/koopgidsen" className="wn-button wn-button-primary">Ontdek de koopgidsen →</Link>
                {catalogEnabled ? <Link href="/zoeken" className="wn-button wn-button-secondary">Zoek producten</Link> : <Link href="#categorieen" className="wn-button wn-button-secondary">Bekijk de rubrieken</Link>}
              </div>
              {!catalogEnabled ? <p className="mt-5 max-w-xl text-sm leading-6 text-[var(--wn-text-muted)]">Onze koopgidsen zijn beschikbaar. We werken aan de koppeling met webwinkels voor actuele aanbiedingen.</p> : null}
            </div>
            <aside className="wn-surface overflow-hidden p-5 sm:p-6" aria-label="Zo helpt Winkelnu je kiezen">
              <p className="wn-eyebrow">Van vraag naar keuze</p>
              <h2 className="mt-3 text-xl font-bold tracking-tight">Drie stappen, één duidelijk doel.</h2>
              <ol className="mt-5 space-y-0">
                <li className="flex gap-3 border-b border-[var(--wn-border)] py-4 first:pt-0"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xs font-bold text-[var(--wn-petrol)]">01</span><div><p className="font-bold">Ontdek je behoeften</p><p className="wn-body-muted mt-1 text-sm leading-6">Wat ga je ermee doen en welke eigenschappen zijn belangrijk?</p></div></li>
                <li className="flex gap-3 border-b border-[var(--wn-border)] py-4"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xs font-bold text-[var(--wn-petrol)]">02</span><div><p className="font-bold">Vergelijk de verschillen</p><p className="wn-body-muted mt-1 text-sm leading-6">Leer wat specificaties, gebruikskosten en onderhoud betekenen.</p></div></li>
                <li className="flex gap-3 pt-4"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xs font-bold text-[var(--wn-petrol)]">03</span><div><p className="font-bold">Maak je keuze</p><p className="wn-body-muted mt-1 text-sm leading-6">Gebruik je kennis om gericht naar een passend product te zoeken.</p></div></li>
              </ol>
            </aside>
          </div>
        </section>
        <section id="categorieen" className="wn-container wn-section scroll-mt-6" aria-labelledby="categorieen-titel">
          <p className="wn-eyebrow">Ontdek op onderwerp</p>
          <h2 id="categorieen-titel" className="wn-heading mt-3 text-3xl sm:text-4xl">Waar ben je naar op zoek?</h2>
          <p className="wn-body-muted mt-4 max-w-2xl">Begin bij een onderwerp dat je interesseert. In elke rubriek vind je praktische keuzehulpen.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {editorialCategories.map((category) => {
              const details = categoryDetails[category.slug]
              const count = guidesForCategory(category.slug).length
              return <article key={category.slug} className="wn-surface flex flex-col p-5 sm:p-6">
                <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-[var(--wn-radius-md)] bg-[var(--wn-petrol-soft)] text-sm font-bold text-[var(--wn-petrol)]">{details?.number ?? '•'}</span>
                <h3 className="mt-4 text-2xl font-bold tracking-tight">{category.title}</h3>
                <p className="wn-body-muted mt-3 text-sm leading-7">{category.description}</p>
                {details ? <p className="mt-4 text-xs font-medium leading-6 text-[var(--wn-text-muted)]">{details.topics.join(' · ')}</p> : null}
                <div className="mt-auto pt-4"><Link href={`/koopgidsen/categorie/${category.slug}`} className="inline-flex min-h-11 items-center text-sm font-bold text-[var(--wn-petrol)] hover:underline">Bekijk {count} {count === 1 ? 'koopgids' : 'koopgidsen'} →</Link></div>
              </article>
            })}
          </div>
        </section>
        <section className="border-y border-[var(--wn-border)] bg-white/50" aria-labelledby="koopgidsen-titel">
          <div className="wn-container wn-section">
            <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="wn-eyebrow">Praktische keuzehulpen</p><h2 id="koopgidsen-titel" className="wn-heading mt-3 text-3xl sm:text-4xl">Ontdek onze koopgidsen.</h2><p className="wn-body-muted mt-4 max-w-2xl">Heldere informatie over eigenschappen, gebruiksgemak en kosten, zodat je zelf kunt bepalen wat bij je past.</p></div><Link href="/koopgidsen" className="inline-flex min-h-11 items-center text-sm font-bold text-[var(--wn-petrol)] hover:underline">Alle koopgidsen →</Link></div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{buyingGuides.map((guide) => <GuideCard key={guide.slug} guide={guide} illustrated />)}</div>
          </div>
        </section>
        <section className="wn-container wn-section" aria-labelledby="werkwijze-titel">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div><p className="wn-eyebrow">Onze werkwijze</p><h2 id="werkwijze-titel" className="wn-heading mt-3 text-3xl sm:text-4xl">Duidelijke informatie, zonder verkooppraatjes.</h2><p className="wn-body-muted mt-5 leading-8">Onze gidsen zijn bedoeld om je te helpen zelf een keuze te maken. We leggen eigenschappen en afwegingen uit, zonder te doen alsof we producten zelf hebben getest.</p><Link href="/affiliate-en-vergelijking" className="mt-5 inline-flex min-h-11 items-center text-sm font-bold text-[var(--wn-petrol)] hover:underline">Lees hoe Winkelnu werkt →</Link></div>
            <aside className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-[var(--wn-petrol-soft)] p-6 sm:p-7"><h3 className="text-lg font-bold text-[var(--wn-petrol-deep)]">Wat je van ons kunt verwachten</h3><ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--wn-petrol-deep)]"><li>• Praktische uitleg over eigenschappen en gebruikskosten.</li><li>• Bronnen en werkwijze bij iedere koopgids.</li><li>• Geen verzonnen aanbiedingen of eigen testresultaten.</li></ul><p className="mt-4 text-sm leading-7 text-[var(--wn-petrol-deep)]">Wanneer actuele aanbiedingen beschikbaar zijn, vermelden we duidelijk hoe commerciële links werken.</p><Link href="/over-winkelnu" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-[var(--wn-petrol)] underline underline-offset-4">Meer over Winkelnu →</Link></aside>
          </div>
        </section>
        <section className="border-t border-[var(--wn-border)] bg-[var(--wn-petrol-soft)]"><div className="wn-container flex flex-col gap-5 py-9 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="wn-heading text-2xl">Een vraag of een suggestie?</h2><p className="mt-2 text-sm leading-7 text-[var(--wn-text-muted)]">Welke keuzehulp zou jij graag op Winkelnu zien? Laat het ons weten.</p></div><a href="mailto:info@akflow.nl?subject=Winkelnu.nl%20-%20Vraag%20of%20suggestie" className="wn-button wn-button-primary shrink-0">Contact opnemen →</a></div></section>
      </main>
      <WinkelnuFooter />
    </div>
  )
}

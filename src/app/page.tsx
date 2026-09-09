import type { Metadata } from 'next'
import Link from 'next/link'
import { buyingGuides, editorialCategories } from '@/content/koopgidsen'
import { CategoryCard } from '@/components/storefront/category-card'
import { EditorialNotice, GuideCard } from '@/components/storefront/editorial-shell'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export const metadata: Metadata = {
  title: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.',
  description: 'Ontdek praktische koopgidsen voor elektronica, wonen en keuken. Leer welke eigenschappen belangrijk zijn en kies bewuster voordat je koopt.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.', description: 'Praktische koopgidsen en keuzehulp voor een bewustere aankoop.', url: '/' },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <section className="relative overflow-hidden border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
          <div className="absolute inset-0 bg-[image:var(--wn-gradient-glow)]" aria-hidden="true" />
          <div className="wn-container relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_21rem] lg:py-24">
            <div className="max-w-3xl"><p className="wn-eyebrow">Ontdek. Vergelijk. Kies je winkel.</p><h1 className="wn-heading mt-4 text-4xl sm:text-6xl lg:text-[4.25rem]">Beter kiezen begint met weten waar je op let.</h1><p className="wn-body-muted mt-6 max-w-2xl text-lg leading-8 sm:text-xl">Welke laptop past bij je studie? Hoe kies je een zuinige wasmachine? Winkelnu helpt je met duidelijke keuzehulpen, zodat je met meer kennis op zoek gaat naar het juiste product.</p><p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--wn-text-muted)] sm:text-base">Ontdek onze koopgidsen voor elektronica, wonen en keuken. We werken daarnaast aan de koppeling met webwinkels voor actuele aanbiedingen.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/koopgidsen" className="wn-button wn-button-primary">Ontdek de koopgidsen →</Link><Link href="#categorieen" className="wn-button wn-button-secondary">Bekijk de rubrieken</Link></div></div>
            <aside className="wn-surface p-6 sm:p-8"><p className="wn-eyebrow">Zo helpt Winkelnu je</p><div className="mt-6 space-y-6">{[{ number: '01', title: 'Ontdek wat je nodig hebt', description: 'Begin bij jouw gebruikssituatie en de eigenschappen die voor jou tellen.' }, { number: '02', title: 'Vergelijk met kennis', description: 'Leer hoe je specificaties, gebruikskosten en praktische verschillen beoordeelt.' }, { number: '03', title: 'Kies je winkel', description: 'Bij toekomstige aanbiedingen kies je zelf bij welke webwinkel je koopt.' }].map((item) => <div key={item.number} className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xs font-bold text-[var(--wn-petrol)]">{item.number}</span><div><h2 className="font-bold">{item.title}</h2><p className="wn-body-muted mt-1 text-sm leading-6">{item.description}</p></div></div>)}</div></aside>
          </div>
        </section>
        <section id="categorieen" className="wn-container wn-section scroll-mt-6" aria-labelledby="categorieen-titel">
          <p className="wn-eyebrow">Ontdek op onderwerp</p>
          <h2 id="categorieen-titel" className="wn-heading mt-3 text-3xl sm:text-4xl">Waar ben je naar op zoek?</h2>
          <p className="wn-body-muted mt-4 max-w-2xl">Kies een rubriek en ontdek welke eigenschappen je helpen bij een bewuste aankoop.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{editorialCategories.map((category) => <CategoryCard key={category.slug} category={category} />)}</div>
        </section>
        <section className="border-y border-[var(--wn-border)] bg-white/50"><div className="wn-container wn-section"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="wn-eyebrow">Praktische keuzehulpen</p><h2 className="wn-heading mt-3 text-3xl sm:text-4xl">Begin met een goede voorbereiding.</h2></div><Link href="/koopgidsen" className="inline-flex min-h-12 items-center font-bold text-[var(--wn-petrol)] hover:underline">Alle koopgidsen →</Link></div><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{buyingGuides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div></div></section>
        <section className="wn-container wn-section"><div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"><div><p className="wn-eyebrow">Vergelijk met kennis</p><h2 className="wn-heading mt-3 text-3xl sm:text-4xl">Ontdek wat bij jou past.</h2><p className="wn-body-muted mt-5 leading-8">Van belangrijke specificaties tot gebruikskosten en onderhoud: onze gidsen helpen je de verschillen te begrijpen. Zo kun je gerichter zoeken en kiezen.</p><Link href="/koopgidsen" className="mt-5 inline-flex min-h-12 items-center font-bold text-[var(--wn-petrol)] hover:underline">Ontdek de koopgidsen →</Link></div><EditorialNotice /></div></section>
        <section className="border-t border-[var(--wn-border)] bg-[var(--wn-petrol-soft)]"><div className="wn-container flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="wn-heading text-2xl">Een vraag of een suggestie?</h2><p className="mt-2 text-sm leading-7 text-[var(--wn-text-muted)]">We horen graag welke keuzehulp jij graag op Winkelnu zou zien.</p></div><a href="mailto:info@akflow.nl?subject=Winkelnu.nl%20-%20Vraag%20of%20suggestie" className="wn-button wn-button-primary shrink-0">Contact opnemen →</a></div></section>
      </main>
      <WinkelnuFooter />
    </div>
  )
}

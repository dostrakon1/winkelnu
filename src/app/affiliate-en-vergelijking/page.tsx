import type { Metadata } from 'next'
import Link from 'next/link'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export const metadata: Metadata = {
  title: 'Hoe Winkelnu vergelijkt',
  description: 'Lees hoe Winkelnu vergelijkt, hoe commerciële links werken en waar je uiteindelijk een product koopt.',
  alternates: { canonical: '/affiliate-en-vergelijking' },
}

const transparencyPoints = [
  'Winkelnu verkoopt zelf geen producten.',
  'Winkelnu kan een vergoeding ontvangen via commerciële links.',
  'De hoogte van een vergoeding bepaalt niet de normale volgorde van vergelijkingsresultaten.',
  'Betaalde plaatsingen worden herkenbaar als gesponsord aangeduid.',
]

const flowSteps = [
  {
    number: '01',
    title: 'Ontdek',
    text: 'Verken producten, categorieën en koopgidsen die passen bij wat je zoekt.',
  },
  {
    number: '02',
    title: 'Begrijp',
    text: 'Leer welke eigenschappen, gebruikskosten en praktische verschillen belangrijk zijn.',
  },
  {
    number: '03',
    title: 'Vergelijk',
    text: 'Zet relevante modellen en beschikbare winkelinformatie overzichtelijk naast elkaar.',
  },
  {
    number: '04',
    title: 'Kies zelf',
    text: 'Jij bepaalt welke webwinkel het beste bij je past en rondt daar de aankoop af.',
  },
]

export default function AffiliateComparisonPage() {
  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,#081f1e_0%,#0d2e2d_48%,#174443_100%)] text-[var(--wn-cream)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(233,120,61,0.22)_0%,rgba(233,120,61,0.08)_18%,rgba(233,120,61,0)_42%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full border border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-[38%] h-80 w-80 rounded-full border border-[#ffb889]/10 bg-[#e9783d]/[0.04]" />

        <div className="wn-container relative grid min-h-[620px] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.72fr)] lg:py-24">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-[#ffb889]/25 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ffb889] backdrop-blur-sm">
              ✦ Onze werkwijze
            </p>
            <h1 className="wn-display mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#fff7ec] sm:text-6xl lg:text-[5rem]">
              Hoe Winkelnu vergelijkt.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#f4e7d8]/78 sm:text-xl">
              Eerst begrijpen wat belangrijk is. Daarna pas vergelijken. Zo houden we productinformatie, winkeldata en commerciële relaties zo duidelijk mogelijk van elkaar gescheiden.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/koopgidsen" className="inline-flex min-h-12 items-center rounded-full bg-[var(--wn-warm)] px-5 font-bold text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f1844c] motion-reduce:transform-none">
                Bekijk koopgidsen →
              </Link>
              <Link href="/zoeken" className="inline-flex min-h-12 items-center rounded-full border border-white/18 bg-white/[0.07] px-5 font-bold text-[#fff7ec] backdrop-blur-sm transition hover:bg-white/[0.12]">
                Bekijk producten
              </Link>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[1.75rem] border border-white/14 bg-white/[0.07] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
            <div aria-hidden="true" className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(233,120,61,0.24),rgba(233,120,61,0))]" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffb889]">Transparant in het kort</p>
              <div className="mt-6 space-y-4">
                {transparencyPoints.map((point) => (
                  <div key={point} className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e9783d]/15 text-sm font-bold text-[#ffc39d]">✓</span>
                    <p className="text-sm leading-6 text-[#f4e7d8]/78">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="wn-container wn-section">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <p className="wn-eyebrow">Zo vergelijken we</p>
            <h2 className="wn-display mt-4 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">
              Vergelijken begint vóór de prijs.
            </h2>
            <p className="wn-body-muted mt-5 max-w-xl leading-8">
              Een lage prijs zegt weinig als je niet weet welk model, welke uitvoering of welke eigenschappen bij jouw situatie passen. Daarom bouwen we de vergelijking in lagen op.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <article className="relative overflow-hidden rounded-[1.6rem] border border-[rgba(18,59,58,0.12)] bg-white p-7 shadow-[var(--wn-shadow-sm)] sm:p-8">
              <span aria-hidden="true" className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[rgba(18,59,58,0.06)]" />
              <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-petrol)]">01 · Keuzehulp</p>
              <h3 className="wn-display relative mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--wn-petrol-deep)]">Koopgidsen als basis.</h3>
              <p className="relative mt-4 text-sm leading-7 text-[var(--wn-text-muted)]">
                Onze koopgidsen helpen je bepalen welke eigenschappen voor jou belangrijk zijn. Ze zijn geen eigen laboratoriumtests en we presenteren ze niet als actuele productranglijsten.
              </p>
            </article>

            <article className="relative overflow-hidden rounded-[1.6rem] border border-[rgba(233,120,61,0.20)] bg-[linear-gradient(145deg,#f7e5d7,#fff8ef)] p-7 sm:p-8">
              <span aria-hidden="true" className="absolute -bottom-16 -right-12 h-36 w-36 rounded-full border border-[#e9783d]/10" />
              <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-[#b85427]">02 · Winkeldata</p>
              <h3 className="wn-display relative mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--wn-petrol-deep)]">Aanbiedingen als extra laag.</h3>
              <p className="relative mt-4 text-sm leading-7 text-[rgba(13,46,45,0.72)]">
                Wanneer actuele aanbiedingen beschikbaar zijn, vergelijken we onder meer prijs, bekende verzendkosten, beschikbaarheid en de filters of sortering die je kiest.
              </p>
            </article>

            <article className="sm:col-span-2 rounded-[1.6rem] border border-[rgba(18,59,58,0.12)] bg-[var(--wn-petrol-soft)]/70 p-7 sm:p-8">
              <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-petrol)]">Wat je altijd zelf controleert</p>
                  <h3 className="wn-display mt-3 text-3xl font-semibold text-[var(--wn-petrol-deep)]">De webwinkel blijft de bron voor de definitieve aankoop.</h3>
                </div>
                <p className="text-sm leading-7 text-[var(--wn-text-muted)]">
                  Als verzendkosten onbekend zijn, vermelden we dat. De definitieve prijs, voorraadstatus en voorwaarden controleer je altijd bij de gekozen webwinkel voordat je bestelt.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(233,120,61,0.18)] bg-[linear-gradient(135deg,#f7e5d7_0%,#fff8ef_52%,#f2eee4_100%)]">
        <div className="wn-container wn-section grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b85427]">✦ Hoe Winkelnu geld verdient</p>
            <h2 className="wn-display mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">
              Commercieel waar nodig. Duidelijk waar het telt.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[rgba(13,46,45,0.72)]">
              Winkelnu kan een vergoeding ontvangen wanneer je via een commerciële link doorklikt of een aankoop doet. Daarmee kunnen we het platform onderhouden en verder ontwikkelen.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[rgba(13,46,45,0.72)]">
              Bij commerciële aanbevelingen maken we duidelijk dat er een affiliate-relatie is. De hoogte van de vergoeding bepaalt niet de normale volgorde van onze vergelijkingsresultaten.
            </p>
          </div>

          <div className="rounded-[1.7rem] border border-[rgba(18,59,58,0.12)] bg-white/80 p-7 shadow-[var(--wn-shadow-sm)] backdrop-blur-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-petrol)]">Als we later betaalde plaatsingen tonen</p>
            <h3 className="wn-display mt-4 text-3xl font-semibold text-[var(--wn-petrol-deep)]">Gesponsord blijft herkenbaar gesponsord.</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--wn-text-muted)]">
              Betaalde plaatsingen worden duidelijk als gesponsord aangeduid. Ze worden niet gepresenteerd alsof het onafhankelijke resultaten zijn.
            </p>
            <div className="mt-6 rounded-2xl border border-[rgba(18,59,58,0.10)] bg-[var(--wn-cream)] p-4">
              <p className="text-sm font-bold text-[var(--wn-petrol-deep)]">Onze regel</p>
              <p className="mt-1 text-sm leading-6 text-[var(--wn-text-muted)]">Bezoekers moeten kunnen zien wanneer commercie een rol speelt.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wn-container wn-section">
        <p className="wn-eyebrow">Van zoeken naar kiezen</p>
        <h2 className="wn-display mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">
          Vier stappen. Jij houdt de regie.
        </h2>
        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {flowSteps.map((step) => (
            <article key={step.number} className="group relative overflow-hidden rounded-[1.55rem] border border-[rgba(18,59,58,0.12)] bg-white p-7 shadow-[var(--wn-shadow-xs)] transition hover:-translate-y-1 hover:shadow-[var(--wn-shadow-sm)] motion-reduce:transform-none">
              <span className="text-xs font-bold tracking-[0.18em] text-[var(--wn-warm)]">{step.number}</span>
              <h3 className="wn-display mt-6 text-3xl font-semibold tracking-[-0.03em] text-[var(--wn-petrol-deep)]">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--wn-text-muted)]">{step.text}</p>
              <span aria-hidden="true" className="absolute -right-12 -top-12 h-28 w-28 rounded-full border border-[var(--wn-petrol)] opacity-[0.05] transition-transform duration-300 group-hover:scale-110" />
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#0a2423_0%,#0d2e2d_56%,#133c3a_100%)] text-[var(--wn-cream)]">
        <div className="wn-container wn-section grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffb889]">✦ Je koopt bij de webwinkel</p>
            <h2 className="wn-display mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fff7ec] sm:text-5xl">
              Winkelnu helpt kiezen. De winkel regelt de aankoop.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#f4e7d8]/72">
              Winkelnu is geen verkoper van de producten waarnaar we verwijzen. De koopovereenkomst ontstaat bij de webwinkel die jij kiest.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {['Bestellen & betalen', 'Levering', 'Retour & garantie', 'Klantenservice'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-5 backdrop-blur-sm">
                <span className="text-sm font-bold text-[#ffc39d]">✓</span>
                <p className="mt-2 font-bold text-[#fff7ec]">{item}</p>
                <p className="mt-1 text-sm leading-6 text-[#f4e7d8]/64">Verloopt via de gekozen webwinkel.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wn-bg-brand-warm border-t border-[var(--wn-border)]">
        <div className="wn-container flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Begin met ontdekken</p>
            <h2 className="wn-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--wn-petrol-deep)]">Eerst begrijpen. Dan vergelijken. Dan pas kopen.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/koopgidsen" className="wn-button wn-button-primary">Naar koopgidsen →</Link>
            <Link href="/zoeken" className="wn-button wn-button-secondary">Naar producten</Link>
          </div>
        </div>
      </section>

      <WinkelnuFooter />
    </main>
  )
}

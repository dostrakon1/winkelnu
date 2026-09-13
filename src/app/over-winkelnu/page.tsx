import type { Metadata } from 'next'
import Link from 'next/link'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export const metadata: Metadata = {
  title: 'Over Winkelnu',
  description: 'Ontdek waarom Winkelnu bestaat, hoe we je helpen kiezen en hoe we bouwen aan betrouwbare productvergelijking.',
  alternates: { canonical: '/over-winkelnu' },
}

const pillars = [
  {
    number: '01',
    title: 'Eerst begrijpen',
    text: 'We beginnen niet bij de aanbieding, maar bij de vraag: waar moet je eigenlijk op letten? Koopgidsen en productinformatie helpen je de verschillen te begrijpen.',
  },
  {
    number: '02',
    title: 'Dan vergelijken',
    text: 'Pas wanneer duidelijk is wat voor jou belangrijk is, heeft vergelijken echt waarde. Daarom brengen we relevante eigenschappen overzichtelijk naast elkaar.',
  },
  {
    number: '03',
    title: 'Jij kiest',
    text: 'Winkelnu bepaalt niet waar jij moet kopen. Zodra betrouwbare winkeldata beschikbaar is, krijg je inzicht en kies je zelf welke winkel bij je past.',
  },
]

const principles = [
  'Geen verzonnen kortingen of kunstmatige schaarste.',
  'Geen winkelprijs zonder gecontroleerde winkeldata.',
  'Commerciële relaties maken we herkenbaar.',
  'De uiteindelijke aankoop doe je bij de gekozen webwinkel.',
]

export default function AboutWinkelnuPage() {
  return (
    <main className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />

      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,#081f1e_0%,#0d2e2d_46%,#174443_100%)] text-[var(--wn-cream)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(233,120,61,0.24)_0%,rgba(233,120,61,0.08)_18%,rgba(233,120,61,0)_42%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 left-[42%] h-80 w-80 rounded-full border border-[#ffb889]/10 bg-[#e9783d]/[0.04]" />

        <div className="wn-container relative grid min-h-[620px] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.7fr)] lg:py-24">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-[#ffb889]/25 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ffb889] backdrop-blur-sm">
              ✦ Over Winkelnu
            </p>
            <h1 className="wn-display mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#fff7ec] sm:text-6xl lg:text-[5rem]">
              Goed kiezen begint niet bij korting. Het begint bij begrijpen.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#f4e7d8]/78 sm:text-xl">
              Winkelnu helpt je ontdekken wat bij je past, welke verschillen ertoe doen en waar je op moet letten voordat je koopt.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/koopgidsen" className="inline-flex min-h-12 items-center rounded-full bg-[var(--wn-warm)] px-5 font-bold text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f1844c] motion-reduce:transform-none">
                Ontdek de koopgidsen →
              </Link>
              <Link href="/zoeken" className="inline-flex min-h-12 items-center rounded-full border border-white/18 bg-white/[0.07] px-5 font-bold text-[#fff7ec] backdrop-blur-sm transition hover:bg-white/[0.12]">
                Bekijk producten
              </Link>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[1.75rem] border border-white/14 bg-white/[0.07] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
            <div aria-hidden="true" className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(233,120,61,0.24),rgba(233,120,61,0))]" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffb889]">Winkelnu in drie stappen</p>
              <div className="mt-6 space-y-5">
                {['Ontdekken', 'Begrijpen', 'Vergelijken'].map((label, index) => (
                  <div key={label} className="flex items-center gap-4 border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ffb889]/28 bg-[#e9783d]/[0.10] text-xs font-bold text-[#ffc39d]">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="wn-display text-2xl font-semibold text-[#fff7ec]">{label}</p>
                      <p className="mt-1 text-sm leading-6 text-[#f4e7d8]/62">
                        {index === 0 && 'Vind producten en onderwerpen die aansluiten bij jouw behoefte.'}
                        {index === 1 && 'Leer welke eigenschappen en verschillen echt belangrijk zijn.'}
                        {index === 2 && 'Zet modellen en straks ook betrouwbare winkeldata naast elkaar.'}
                      </p>
                    </div>
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
            <p className="wn-eyebrow">Waarom Winkelnu bestaat</p>
            <h2 className="wn-display mt-4 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">
              Minder ruis. Meer houvast.
            </h2>
            <p className="wn-body-muted mt-5 max-w-xl leading-8">
              Producten vergelijken lijkt eenvoudig, maar een lage prijs zegt weinig als je niet weet welk model, welke uitvoering of welke eigenschappen bij jouw situatie passen.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <article className="relative overflow-hidden rounded-[1.6rem] border border-[rgba(18,59,58,0.12)] bg-white p-7 shadow-[var(--wn-shadow-sm)] sm:col-span-2 sm:p-9">
              <span aria-hidden="true" className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[rgba(233,120,61,0.08)]" />
              <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">✦ Onze gedachte</p>
              <blockquote className="wn-display relative mt-5 max-w-3xl text-3xl font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--wn-petrol-deep)] sm:text-4xl">
                “Een goede vergelijking begint vóór de prijs.”
              </blockquote>
              <p className="relative mt-5 max-w-3xl text-base leading-8 text-[var(--wn-text-muted)]">
                Daarom bouwen we Winkelnu niet als een eindeloze lijst aanbiedingen, maar als een plek waar oriëntatie, uitleg en vergelijken logisch op elkaar aansluiten.
              </p>
            </article>

            <article className="rounded-[1.5rem] border border-[rgba(18,59,58,0.12)] bg-[var(--wn-petrol-soft)] p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-petrol)]">Voor de keuze</p>
              <h3 className="wn-display mt-4 text-2xl font-semibold text-[var(--wn-petrol-deep)]">Begrijp wat ertoe doet.</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--wn-text-muted)]">Specificaties, gebruiksgemak, onderhoud en kosten krijgen context voordat je gaat vergelijken.</p>
            </article>

            <article className="rounded-[1.5rem] border border-[rgba(233,120,61,0.20)] bg-[linear-gradient(145deg,#f7e5d7,#fff7ec)] p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b85427]">Bij de keuze</p>
              <h3 className="wn-display mt-4 text-2xl font-semibold text-[var(--wn-petrol-deep)]">Vergelijk met een reden.</h3>
              <p className="mt-3 text-sm leading-7 text-[rgba(13,46,45,0.72)]">Niet elk verschil is belangrijk voor iedereen. Winkelnu helpt je focussen op wat voor jouw gebruik relevant is.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(18,59,58,0.12)] bg-white/55">
        <div className="wn-container wn-section">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--wn-warm)]">✦ Zo helpt Winkelnu je kiezen</p>
          <h2 className="wn-display mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">Van vraag naar een keuze die bij je past.</h2>
          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <article key={pillar.number} className="group relative overflow-hidden rounded-[1.55rem] border border-[rgba(18,59,58,0.12)] bg-[var(--wn-cream)] p-7 shadow-[var(--wn-shadow-xs)] transition hover:-translate-y-1 hover:shadow-[var(--wn-shadow-sm)] motion-reduce:transform-none">
                <span className="text-xs font-bold tracking-[0.18em] text-[var(--wn-warm)]">{pillar.number}</span>
                <h3 className="wn-display mt-6 text-3xl font-semibold tracking-[-0.03em] text-[var(--wn-petrol-deep)]">{pillar.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--wn-text-muted)]">{pillar.text}</p>
                <span aria-hidden="true" className="absolute -right-12 -top-12 h-28 w-28 rounded-full border border-[var(--wn-petrol)] opacity-[0.05] transition-transform duration-300 group-hover:scale-110" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#0a2423_0%,#0d2e2d_56%,#133c3a_100%)] text-[var(--wn-cream)]">
        <div className="wn-container wn-section grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffb889]">✦ Vertrouwen boven druk</p>
            <h2 className="wn-display mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fff7ec] sm:text-5xl">Wij willen je helpen kiezen, niet je opjagen.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#f4e7d8]/72">
              Een vergelijkingsplatform werkt alleen als je kunt begrijpen wat je ziet. Daarom houden we informatie, commerciële relaties en winkeldata zo duidelijk mogelijk van elkaar te onderscheiden.
            </p>
            <Link href="/affiliate-en-vergelijking" className="mt-6 inline-flex min-h-12 items-center font-bold text-[#ffc39d] hover:text-white hover:underline">
              Lees hoe Winkelnu werkt →
            </Link>
          </div>

          <div className="rounded-[1.6rem] border border-white/12 bg-white/[0.06] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.16)] backdrop-blur-sm sm:p-8">
            <div className="space-y-4">
              {principles.map((principle) => (
                <div key={principle} className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e9783d]/15 text-sm font-bold text-[#ffc39d]">✓</span>
                  <p className="text-sm leading-6 text-[#f4e7d8]/78">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wn-container wn-section">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.6rem] border border-[rgba(18,59,58,0.12)] bg-white p-7 shadow-[var(--wn-shadow-sm)] sm:p-9">
            <p className="wn-eyebrow">Winkelnu groeit stap voor stap</p>
            <h2 className="wn-display mt-4 text-4xl font-semibold tracking-[-0.035em] text-[var(--wn-petrol-deep)]">Eerst een sterke basis. Daarna steeds slimmer vergelijken.</h2>
            <div className="mt-7 space-y-5">
              <div className="border-l-2 border-[var(--wn-warm)] pl-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--wn-warm)]">Nu</p>
                <p className="mt-1 font-bold text-[var(--wn-petrol-deep)]">Productinformatie, koopgidsen en modelvergelijking.</p>
              </div>
              <div className="border-l-2 border-[var(--wn-petrol-soft)] pl-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--wn-petrol)]">Volgende laag</p>
                <p className="mt-1 font-bold text-[var(--wn-petrol-deep)]">Betrouwbare winkelprijzen, beschikbaarheid en verzendinformatie waar die gecontroleerd beschikbaar is.</p>
              </div>
              <div className="border-l-2 border-[rgba(18,59,58,0.12)] pl-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--wn-text-muted)]">Daarna</p>
                <p className="mt-1 font-bold text-[var(--wn-petrol-deep)]">Meer persoonlijke keuzehulp zonder de basis van transparantie en controle los te laten.</p>
              </div>
            </div>
          </div>

          <aside id="exploitant" className="scroll-mt-32 rounded-[1.6rem] border border-[rgba(233,120,61,0.20)] bg-[linear-gradient(145deg,#f7e5d7,#fff8ef)] p-7 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b85427]">✦ Wie zit erachter?</p>
            <h2 className="wn-display mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--wn-petrol-deep)]">Winkelnu is een initiatief van Akflow.</h2>
            <p className="mt-4 text-sm leading-7 text-[rgba(13,46,45,0.72)]">
              We bouwen Winkelnu als een onafhankelijk merk met een duidelijke eigen rol: mensen helpen om producten beter te begrijpen en bewuster te vergelijken.
            </p>
            <p className="mt-5 text-sm leading-7 text-[rgba(13,46,45,0.72)]">
              Formele gegevens van de exploitant houden we bewust apart van deze merkpagina, zodat ze duidelijk en makkelijk terug te vinden zijn zonder het verhaal van Winkelnu te onderbreken.
            </p>
            <Link
              href="/bedrijfsgegevens"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[var(--wn-petrol-deep)] px-5 text-sm font-bold transition hover:bg-[var(--wn-petrol)]"
              style={{ color: '#fff7ec' }}
            >
              Bekijk bedrijfsgegevens →
            </Link>
          </aside>
        </div>
      </section>

      <section className="wn-bg-brand-warm border-t border-[var(--wn-border)]">
        <div className="wn-container flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Begin met ontdekken</p>
            <h2 className="wn-display mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--wn-petrol-deep)]">Weet eerst wat bij je past. Vergelijk daarna pas.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/koopgidsen" className="wn-button wn-button-primary">Bekijk koopgidsen →</Link>
            <Link href="/zoeken" className="wn-button wn-button-secondary">Bekijk producten</Link>
          </div>
        </div>
      </section>

      <WinkelnuFooter />
    </main>
  )
}

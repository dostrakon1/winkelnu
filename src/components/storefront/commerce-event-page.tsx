import Image from 'next/image'
import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { getCategoryImage } from '@/content/category-images'
import { getBlackFridayCycle, type CommerceEventCampaign } from '@/content/commerce-event-campaigns'
import { WinkelnuFooter } from './winkelnu-footer'
import { WinkelnuHeader } from './winkelnu-header'

function formatDate(dateKey: string) {
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Amsterdam' }).format(new Date(`${dateKey}T12:00:00Z`))
}

const categories = [
  { title: 'Elektronica', description: 'Laptops, audio en apparaten waarbij specificaties vaak belangrijker zijn dan de grootste kortingsbadge.', href: '/koopgidsen/categorie/elektronica', query: 'elektronica' },
  { title: 'Wonen & huishouden', description: 'Vergelijk gebruiksgemak, verbruik en praktische eigenschappen voordat je op een deal klikt.', href: '/koopgidsen/categorie/wonen-huishouden', query: 'wonen huishouden' },
  { title: 'Keuken & koffie', description: 'Kijk naar dagelijks gebruik, onderhoud en formaat — niet alleen naar de tijdelijke actieprijs.', href: '/koopgidsen/categorie/keuken-koffie', query: 'keuken koffie' },
  { title: 'Kantoor & studie', description: 'Voor beeldschermen, accessoires en werkapparatuur die ook na het dealweekend moeten blijven passen.', href: '/koopgidsen/categorie/kantoor-studie', query: 'kantoor studie' },
]

export function CommerceEventPage({ campaign }: { campaign: CommerceEventCampaign }) {
  const cycle = getBlackFridayCycle(campaign.year)
  const image = getCategoryImage(campaign.imageSlug, campaign.imageLabel)
  const catalogEnabled = isPublicCatalogEnabled()
  const isCyberMonday = campaign.kind === 'cyber-monday'

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <section className="wn-container pt-6 sm:pt-8" aria-labelledby="commerce-event-title">
          <article className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050706] text-white shadow-[0_30px_90px_rgba(7,20,20,0.22)]">
            <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
              <div className="relative flex min-h-[31rem] flex-col justify-center overflow-hidden px-7 py-12 sm:px-10 lg:min-h-[35rem] lg:px-14" style={{ background: campaign.heroGradient }}>
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <span className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
                  <span className="absolute -bottom-28 right-8 h-80 w-80 rounded-full bg-[#f06f32]/10 blur-3xl" />
                  <span className="absolute right-[16%] top-[14%] h-2 w-2 rounded-full bg-[#ffd0ad] shadow-[0_0_30px_11px_rgba(240,111,50,0.25)]" />
                  <span className="absolute right-[31%] top-[27%] h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_20px_8px_rgba(255,255,255,0.12)]" />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: campaign.accentSoft }}>{campaign.eyebrow}</p>
                  <h1 id="commerce-event-title" className="wn-display mt-4 text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[#fffaf3] sm:text-6xl lg:text-7xl">
                    {campaign.name}
                  </h1>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-white/74">{campaign.description}</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {campaign.chips.map((chip) => (
                      <Link key={chip.href} href={chip.href} className="inline-flex min-h-10 items-center rounded-full border border-white/16 bg-black/20 px-3.5 text-xs font-bold text-white/90 transition hover:border-white/35 hover:bg-white/10">
                        {chip.label}
                      </Link>
                    ))}
                  </div>
                  <a href="#slim-kiezen" className="mt-8 inline-flex min-h-12 items-center rounded-full px-5 font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5 motion-reduce:transform-none" style={{ backgroundColor: campaign.accent }}>
                    {isCyberMonday ? 'Bekijk de Cyber Monday-aanpak ↓' : 'Bereid Black Friday slim voor ↓'}
                  </a>
                </div>
              </div>

              <div className="relative min-h-[25rem] overflow-hidden lg:min-h-[35rem]">
                {image ? (
                  <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 1023px) 100vw, 48vw" className="object-cover brightness-[0.56] saturate-[0.82] contrast-[1.08]" style={{ objectPosition: image.position }} />
                ) : null}
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,6,0.72)_0%,rgba(5,7,6,0.18)_48%,rgba(5,7,6,0.34)_100%)]" />
                <div className="absolute inset-x-6 bottom-6 rounded-[1.25rem] border border-white/15 bg-black/55 p-5 backdrop-blur-md sm:inset-x-8 sm:bottom-8">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: campaign.accentSoft }}>Winkelnu dealmoment</p>
                  <p className="wn-display mt-2 text-2xl font-semibold text-white">{isCyberMonday ? formatDate(cycle.cyberMondayOn) : formatDate(cycle.blackFridayOn)}</p>
                  <p className="mt-2 text-sm leading-6 text-white/64">De datum wordt automatisch uit de kalenderregel berekend en schuift ieder jaar mee.</p>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="wn-container wn-section" aria-labelledby="campaign-calendar-title">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c55422]">✦ Automatische campagnekalender</p>
            <h2 id="campaign-calendar-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">Eén campagnefamilie, vier duidelijke momenten.</h2>
            <p className="wn-body-muted mt-4 max-w-2xl">Winkelnu hoeft de data volgend jaar niet opnieuw in code te zetten. Black Friday wordt berekend vanaf de vierde donderdag van november en Cyber Monday volgt automatisch drie dagen later.</p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Preview', cycle.previewStartsOn, 'Rustige voorbereiding en koopgidsen.'],
              ['Black Friday Week', cycle.blackFridayWeekStartsOn, 'Vanaf maandag wordt de commerciële campagne prominenter.'],
              ['Black Friday', cycle.blackFridayOn, 'De hoofdshoppingdag van de campagne.'],
              ['Cyber Monday', cycle.cyberMondayOn, 'De digitale finale op maandag.'],
            ].map(([label, date, description], index) => (
              <article key={label} className="rounded-[1.4rem] border border-[var(--wn-border)] bg-white p-6 shadow-[var(--wn-shadow-xs)]">
                <span className="text-xs font-extrabold tracking-[0.16em] text-[#c55422]">0{index + 1}</span>
                <h3 className="wn-display mt-4 text-2xl font-semibold text-[var(--wn-petrol-deep)]">{label}</h3>
                <p className="mt-2 text-sm font-bold text-[var(--wn-petrol)]">{formatDate(date)}</p>
                <p className="wn-body-muted mt-3 text-sm leading-6">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="slim-kiezen" className="scroll-mt-28 border-y border-white/8 bg-[linear-gradient(135deg,#050706_0%,#0a1715_58%,#2b140b_100%)] text-white">
          <div className="wn-container wn-section">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f2834d]">✦ Niet zomaar korting najagen</p>
              <h2 className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">Vergelijk eerst wat je werkelijk nodig hebt.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-white/62">Black Friday en Cyber Monday worden pas nuttig wanneer een aanbieding ook bij jouw gebruik past. Daarom blijft Winkelnu keuzehulp vóór korting zetten.</p>
            </div>
            <div className="mt-9 grid gap-4 lg:grid-cols-4">
              {[
                ['01', 'Ken de normale prijs', 'Een hoog kortingspercentage zegt weinig zonder betrouwbare referentieprijs.'],
                ['02', 'Vergelijk specificaties', 'Een goedkoper model is geen betere deal als belangrijke eigenschappen ontbreken.'],
                ['03', 'Tel gebruikskosten mee', 'Denk aan energie, accessoires, abonnementen en onderhoud.'],
                ['04', 'Kies zelf je winkel', 'Winkelnu helpt vergelijken; jij bepaalt uiteindelijk waar je koopt.'],
              ].map(([number, title, description]) => (
                <article key={number} className="rounded-[1.35rem] border border-white/10 bg-white/[0.055] p-6">
                  <span className="text-xs font-extrabold tracking-[0.16em] text-[#f2834d]">{number}</span>
                  <h3 className="wn-display mt-4 text-xl font-semibold text-[#fff8ef]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/56">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="wn-container wn-section" aria-labelledby="deal-categories-title">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c55422]">✦ Populaire dealcategorieën</p>
            <h2 id="deal-categories-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">Begin bij de categorie, niet bij de kortingssticker.</h2>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {categories.map((category) => (
              <article key={category.title} className="rounded-[1.5rem] border border-[var(--wn-border)] bg-white p-7 shadow-[var(--wn-shadow-xs)]">
                <h3 className="wn-display text-3xl font-semibold text-[var(--wn-petrol-deep)]">{category.title}</h3>
                <p className="wn-body-muted mt-3 leading-7">{category.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={category.href} className="wn-button wn-button-secondary">Lees de keuzehulpen →</Link>
                  {catalogEnabled ? <Link href={`/zoeken?q=${encodeURIComponent(category.query)}`} className="wn-button wn-button-primary">Bekijk producten →</Link> : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--wn-border)] bg-[#efe7da]">
          <div className="wn-container wn-section grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c55422]">Control Center ready</p>
              <h2 className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)]">De campagne staat los van dummydeals.</h2>
              <p className="wn-body-muted mt-4 max-w-2xl leading-7">Zodra echte partnerfeeds beschikbaar zijn kunnen aanbiedingen, merchants, klikdata en campagneprestaties aan deze bestaande pagina worden gekoppeld. Tot die tijd publiceren we alleen betrouwbare keuzehulp.</p>
            </div>
            <Link href="/koopgidsen" className="wn-button wn-button-primary">Bekijk koopgidsen →</Link>
          </div>
        </section>
      </main>
      <WinkelnuFooter />
    </div>
  )
}

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

function formatShortDate(dateKey: string) {
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', timeZone: 'Europe/Amsterdam' })
    .format(new Date(`${dateKey}T12:00:00Z`))
    .replace('.', '')
    .toUpperCase()
}

const categories = [
  { title: 'Elektronica', description: 'Laptops, audio en apparaten waarbij specificaties vaak belangrijker zijn dan de grootste kortingsbadge.', href: '/koopgidsen/categorie/elektronica', query: 'elektronica' },
  { title: 'Wonen & huishouden', description: 'Vergelijk gebruiksgemak, verbruik en praktische eigenschappen voordat je op een deal klikt.', href: '/koopgidsen/categorie/wonen-huishouden', query: 'wonen huishouden' },
  { title: 'Keuken & koffie', description: 'Kijk naar dagelijks gebruik, onderhoud en formaat — niet alleen naar de tijdelijke actieprijs.', href: '/koopgidsen/categorie/keuken-koffie', query: 'keuken koffie' },
  { title: 'Persoonlijke verzorging', description: 'Vergelijk functies, accessoires en gebruiksgemak voordat een tijdelijke korting de keuze bepaalt.', href: '/koopgidsen/categorie/persoonlijke-verzorging', query: 'persoonlijke verzorging' },
  { title: 'Speelgoed & hobby', description: 'Kies op leeftijd, interesse en gebruiksmoment en kijk daarna pas of de aanbieding echt voordeel geeft.', href: '/koopgidsen/categorie/speelgoed-hobby', query: 'speelgoed hobby' },
  { title: 'Mode & accessoires', description: 'Let op materiaal, maat, pasvorm en retourvoorwaarden zodat de deal ook na Black Friday goed voelt.', href: '/koopgidsen/categorie/mode-accessoires', query: 'mode accessoires' },
]

const blackFridaySteps = [
  {
    number: '01',
    eyebrow: 'Oriënteren',
    title: 'Bepaal wat je zoekt',
    description: 'Begin bij het product of probleem dat je wilt oplossen, niet bij de grootste korting op de pagina.',
  },
  {
    number: '02',
    eyebrow: 'Favorieten',
    title: 'Kies vooraf je favorieten',
    description: 'Maak een korte selectie voordat de aanbiedingen beginnen, zodat je tijdens Black Friday gericht kunt vergelijken.',
  },
  {
    number: '03',
    eyebrow: 'Vergelijken',
    title: 'Controleer prijs en kwaliteit',
    description: 'Vergelijk specificaties, uitvoering, winkels en voorwaarden voordat je naar het kortingspercentage kijkt.',
  },
  {
    number: '04',
    eyebrow: 'Dealcheck',
    title: 'Beoordeel de aanbieding',
    description: 'Pas daarna bepaal je of de Black Friday-deal werkelijk interessant is voor wat jij nodig hebt.',
  },
] as const

const dealChecks = [
  ['01', 'Vergelijk de prijs met andere winkels', 'Een kortingsbadge is pas nuttig wanneer je weet hoe de prijs zich elders verhoudt.'],
  ['02', 'Controleer uitvoering en modelnummer', 'Een bijna gelijk product kan andere specificaties, accessoires of voorwaarden hebben.'],
  ['03', 'Kijk naar verzendkosten en voorwaarden', 'Retour, garantie en bezorgkosten horen bij de totale waarde van een deal.'],
  ['04', 'Koop alleen wat je toch al wilde hebben', 'De beste Black Friday-keuze blijft een product dat echt bij jouw gebruik past.'],
] as const

const blackFridayTicker = ['BLACK FRIDAY', 'VERGELIJK EERST', '27 NOVEMBER', 'SLIMMER KOPEN', 'DEALCHECK'] as const

export function CommerceEventPage({ campaign }: { campaign: CommerceEventCampaign }) {
  const cycle = getBlackFridayCycle(campaign.year)
  const image = getCategoryImage(campaign.imageSlug, campaign.imageLabel)
  const catalogEnabled = isPublicCatalogEnabled()
  const isCyberMonday = campaign.kind === 'cyber-monday'

  return (
    <div className={`min-h-screen text-[var(--wn-ink)] ${isCyberMonday ? 'bg-[#f6f1e8]' : 'bg-[#f4efe7]'}`}>
      <WinkelnuHeader theme={isCyberMonday ? 'default' : 'black-friday'} />
      <main id="inhoud">
        <section className="wn-container pt-6 sm:pt-8" aria-labelledby="commerce-event-title">
          <article className={`relative overflow-hidden rounded-[2rem] text-white shadow-[0_30px_90px_rgba(0,0,0,0.28)] ${isCyberMonday ? 'border border-white/10 bg-[#050706]' : 'border border-[#ef4d35]/25 bg-[#020202]'}`}>
            <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
              <div
                className="relative flex min-h-[31rem] flex-col justify-center overflow-hidden px-7 py-12 sm:px-10 lg:min-h-[35rem] lg:px-14"
                style={{ background: isCyberMonday ? campaign.heroGradient : 'linear-gradient(135deg,#020202 0%,#070908 44%,#171210 68%,#4a160f 100%)' }}
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <span className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-white/8" />
                  <span className={`absolute -bottom-28 right-8 h-80 w-80 rounded-full blur-3xl ${isCyberMonday ? 'bg-[#f06f32]/10' : 'bg-[#ef4d35]/14'}`} />
                  <span className="absolute right-[16%] top-[14%] h-2 w-2 rounded-full bg-[#ffb188] shadow-[0_0_30px_11px_rgba(239,77,53,0.25)]" />
                  <span className="absolute right-[31%] top-[27%] h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_20px_8px_rgba(255,255,255,0.12)]" />
                  {!isCyberMonday ? (
                    <>
                      <span className="absolute -right-20 top-16 h-16 w-72 rotate-[-11deg] border-y border-[#ef4d35]/30 bg-[#ef4d35]/8" />
                      <span className="absolute -right-24 top-28 h-px w-80 rotate-[-11deg] bg-[#ef4d35]/60" />
                      <span className="absolute bottom-[15%] left-[7%] h-1.5 w-1.5 rounded-full bg-[#f3a47f] shadow-[0_0_22px_8px_rgba(243,164,127,0.20)]" />
                      <span className="absolute right-[9%] top-[58%] h-1 w-1 rounded-full bg-[#ffd8c4] shadow-[0_0_18px_6px_rgba(239,77,53,0.18)]" />
                    </>
                  ) : null}
                </div>

                <div className="relative z-10 max-w-2xl">
                  {isCyberMonday ? (
                    <>
                      <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: campaign.accentSoft }}>{campaign.eyebrow}</p>
                      <h1 id="commerce-event-title" className="wn-display mt-4 text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[#fffaf3] sm:text-6xl lg:text-7xl">
                        {campaign.name}
                      </h1>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex min-h-8 items-center border border-[#ef4d35]/55 bg-[#ef4d35]/12 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#ffad8d]">
                          Winkelnu Deal Event
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/45">Edition {campaign.year}</span>
                      </div>
                      <h1 id="commerce-event-title" className="mt-5 max-w-[9ch] font-black uppercase leading-[0.78] tracking-[-0.085em] text-white text-[clamp(4.6rem,10vw,8.6rem)]">
                        <span className="block">Black</span>
                        <span className="block text-[#ef4d35]">Friday</span>
                      </h1>
                      <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-[#ffc1a8]">Eerst vergelijken. Dan pas toeslaan.</p>
                    </>
                  )}

                  <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">{campaign.description}</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {campaign.chips.map((chip) => (
                      <Link
                        key={chip.href}
                        href={chip.href}
                        className={`inline-flex min-h-10 items-center px-3.5 text-xs font-bold text-white/90 transition ${isCyberMonday ? 'rounded-full border border-white/16 bg-black/20 hover:border-white/35 hover:bg-white/10' : 'rounded-lg border border-white/12 bg-white/[0.045] uppercase tracking-[0.06em] hover:border-[#ef4d35]/55 hover:bg-[#ef4d35]/12'}`}
                      >
                        {chip.label}
                      </Link>
                    ))}
                  </div>
                  <a
                    href="#slim-kiezen"
                    className={`mt-8 inline-flex min-h-12 items-center px-5 font-extrabold text-white transition hover:-translate-y-0.5 motion-reduce:transform-none ${
                      isCyberMonday
                        ? 'rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.24)]'
                        : 'rounded-lg border border-[#ffb38e]/40 bg-[#ef4d35] uppercase tracking-[0.05em] shadow-[0_12px_32px_rgba(239,77,53,0.30)] hover:bg-[#f45d45]'
                    }`}
                    style={{ backgroundColor: isCyberMonday ? campaign.accent : undefined }}
                  >
                    {isCyberMonday ? 'Bekijk de Cyber Monday-aanpak ↓' : 'Bereid Black Friday slim voor ↓'}
                  </a>
                </div>
              </div>

              <div className="relative min-h-[25rem] overflow-hidden lg:min-h-[35rem]">
                {image ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 48vw"
                    className={`object-cover ${isCyberMonday ? 'brightness-[0.56] saturate-[0.82] contrast-[1.08]' : 'brightness-[0.42] saturate-[0.72] contrast-[1.18]'}`}
                    style={{ objectPosition: image.position }}
                  />
                ) : null}
                <span aria-hidden="true" className={`absolute inset-0 ${isCyberMonday ? 'bg-[linear-gradient(90deg,rgba(5,7,6,0.72)_0%,rgba(5,7,6,0.18)_48%,rgba(5,7,6,0.34)_100%)]' : 'bg-[linear-gradient(90deg,rgba(2,2,2,0.82)_0%,rgba(2,2,2,0.12)_52%,rgba(48,10,6,0.42)_100%)]'}`} />
                {!isCyberMonday ? (
                  <>
                    <span aria-hidden="true" className="absolute -right-16 top-10 h-52 w-52 rounded-full bg-[#ef4d35]/16 blur-3xl" />
                    <div className="absolute right-5 top-5 rotate-[5deg] border border-[#ffb08e]/35 bg-[#ef4d35] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.24)] sm:right-8 sm:top-8">
                      Black Friday
                    </div>
                  </>
                ) : null}
                <div className={`absolute inset-x-6 bottom-6 border p-5 backdrop-blur-md sm:inset-x-8 sm:bottom-8 ${isCyberMonday ? 'rounded-[1.25rem] border-white/15 bg-black/55' : 'rounded-[1.15rem] border-[#ef4d35]/30 bg-[rgba(3,3,3,0.82)] shadow-[0_16px_44px_rgba(0,0,0,0.34)]'}`}>
                  {isCyberMonday ? (
                    <>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: campaign.accentSoft }}>Winkelnu dealmoment</p>
                      <p className="wn-display mt-2 text-2xl font-semibold text-white">{formatDate(cycle.cyberMondayOn)}</p>
                      <p className="mt-2 text-sm leading-6 text-white/64">De datum wordt automatisch uit de kalenderregel berekend en schuift ieder jaar mee.</p>
                    </>
                  ) : (
                    <div className="grid grid-cols-[auto_1fr] items-end gap-5">
                      <div className="border-r border-[#ef4d35]/45 pr-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffad8d]">Deal day</p>
                        <p className="mt-1 text-5xl font-black leading-none tracking-[-0.08em] text-white">27</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black uppercase tracking-[-0.04em] text-white">November</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/48">{campaign.year} · Black Friday</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        </section>

        {!isCyberMonday ? (
          <section className="mt-6 overflow-hidden border-y border-[#ef4d35]/25 bg-[#050505] text-white" aria-label="Black Friday campagneband">
            <div className="wn-container flex min-h-14 items-center overflow-hidden py-3">
              <div className="flex min-w-max items-center gap-5 text-[11px] font-black uppercase tracking-[0.19em] text-white/78 sm:gap-7 sm:text-xs">
                {[...blackFridayTicker, ...blackFridayTicker].map((item, index) => (
                  <span key={`${item}-${index}`} className="inline-flex items-center gap-5 sm:gap-7">
                    <span className={item === 'BLACK FRIDAY' ? 'text-[#ff674f]' : ''}>{item}</span>
                    <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[#ef4d35]" />
                  </span>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {isCyberMonday ? (
          <>
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
                  {dealChecks.map(([number, title, description]) => (
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
                {categories.slice(0, 4).map((category) => (
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
          </>
        ) : (
          <>
            <section id="slim-kiezen" className="wn-container scroll-mt-28 wn-section" aria-labelledby="black-friday-smart-title">
              <div className="relative overflow-hidden border border-[#d7c7ba] bg-[#fffaf4] px-6 py-10 shadow-[0_22px_70px_rgba(35,20,14,0.08)] sm:px-9 sm:py-12 lg:px-12">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                  <span className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ef4d35]/7 blur-3xl" />
                  <span className="absolute left-0 top-0 h-2 w-40 bg-[#ef4d35]" />
                  <span className="absolute right-8 top-8 h-16 w-16 rotate-12 border border-[#ef4d35]/12" />
                </div>

                <div className="relative grid gap-7 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-end">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#d83e2a]">Black Friday Playbook</p>
                    <h2 id="black-friday-smart-title" className="mt-3 max-w-[12ch] text-4xl font-black uppercase leading-[0.94] tracking-[-0.055em] text-[#111] sm:text-5xl lg:text-6xl">
                      Niet wachten op korting.
                    </h2>
                  </div>
                  <p className="max-w-2xl text-lg leading-8 text-[#5f5752]">
                    Bepaal vooraf wat je nodig hebt, kies favorieten en vergelijk pas daarna de aanbieding. Zo blijft de deal ondergeschikt aan de juiste keuze.
                  </p>
                </div>

                <div className="relative mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {blackFridaySteps.map((step, index) => (
                    <article key={step.number} className={`group relative min-h-[17rem] overflow-hidden border p-6 transition hover:-translate-y-1 motion-reduce:transform-none ${index === 3 ? 'border-[#ef4d35] bg-[#111] text-white shadow-[0_18px_42px_rgba(17,17,17,0.16)]' : 'border-[#d8ccc2] bg-white shadow-[0_10px_30px_rgba(38,26,20,0.05)] hover:shadow-[0_18px_42px_rgba(38,26,20,0.09)]'}`}>
                      <div className="flex items-center justify-between gap-4">
                        <span className={`text-4xl font-black tracking-[-0.06em] ${index === 3 ? 'text-[#ff6b52]' : 'text-[#111]'}`}>{step.number}</span>
                        <span className="h-1 w-10 bg-[#ef4d35]" />
                      </div>
                      <p className={`mt-5 text-[10px] font-black uppercase tracking-[0.18em] ${index === 3 ? 'text-[#ff9a7f]' : 'text-[#d83e2a]'}`}>{step.eyebrow}</p>
                      <h3 className={`mt-2 text-2xl font-extrabold leading-tight tracking-[-0.035em] ${index === 3 ? 'text-white' : 'text-[#111]'}`}>{step.title}</h3>
                      <p className={`mt-3 text-sm leading-6 ${index === 3 ? 'text-white/58' : 'text-[#6b625d]'}`}>{step.description}</p>
                      <span aria-hidden="true" className={`absolute bottom-5 right-5 inline-flex h-10 w-10 items-center justify-center text-lg ${index === 3 ? 'bg-[#ef4d35] text-white' : 'bg-[#111] text-white'}`}>→</span>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="relative overflow-hidden border-y border-white/8 bg-[#070707] text-white" aria-labelledby="black-friday-timeline-title">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <span className="absolute -right-32 -top-20 h-80 w-80 rounded-full bg-[#ef4d35]/12 blur-3xl" />
                <span className="absolute -left-24 bottom-0 h-48 w-80 rotate-[-10deg] border border-white/5" />
              </div>
              <div className="wn-container relative wn-section">
                <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff7059]">Deal timeline</p>
                    <h2 id="black-friday-timeline-title" className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-[-0.055em] text-white sm:text-5xl">Van preview tot finale.</h2>
                  </div>
                  <p className="max-w-2xl text-base leading-7 text-white/54">Gebruik de dagen vóór Black Friday om te oriënteren. Richt je op de hoofddeal op vrijdag en sluit het weekend af met Cyber Monday.</p>
                </div>

                <div className="relative mt-10 grid gap-3 lg:grid-cols-4">
                  <span aria-hidden="true" className="absolute left-[7%] right-[7%] top-[3.15rem] hidden h-[2px] bg-[linear-gradient(90deg,rgba(239,77,53,0.15),#ef4d35,rgba(239,77,53,0.15))] lg:block" />
                  {[
                    ['Preview', cycle.previewStartsOn, 'Oriënteer en maak je shortlist.'],
                    ['Black Friday Week', cycle.blackFridayWeekStartsOn, 'Aanbiedingen nemen toe.'],
                    ['Black Friday', cycle.blackFridayOn, 'Het belangrijkste dealmoment.'],
                    ['Cyber Monday', cycle.cyberMondayOn, 'De digitale finale van het weekend.'],
                  ].map(([label, date, description], index) => (
                    <article key={label} className={`relative border p-6 ${index === 2 ? 'border-[#ef4d35]/65 bg-[#ef4d35]/10 shadow-[0_0_45px_rgba(239,77,53,0.10)]' : 'border-white/10 bg-white/[0.035]'}`}>
                      <div className="relative z-10 flex items-center justify-between gap-3">
                        <time dateTime={date} className={`inline-flex min-h-10 items-center px-4 text-xs font-black uppercase tracking-[0.12em] ${index === 2 ? 'bg-[#ef4d35] text-white' : 'border border-white/12 bg-[#101010] text-[#fff7f1]'}`}>{formatShortDate(date)}</time>
                        <span className="text-xs font-black text-[#ff745d]">0{index + 1}</span>
                      </div>
                      <h3 className="mt-5 text-xl font-extrabold uppercase tracking-[-0.03em] text-white">{label}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/48">{description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="wn-container wn-section" aria-labelledby="deal-categories-title">
              <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#d83e2a]">Shop slimmer</p>
                  <h2 id="deal-categories-title" className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-[-0.055em] text-[#111] sm:text-5xl">Begin bij je categorie.</h2>
                </div>
                <p className="max-w-2xl text-base leading-7 text-[#6b625d]">De beste Black Friday-route begint niet bij een kortingssticker, maar bij het soort product dat je werkelijk nodig hebt.</p>
              </div>

              <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {categories.map((category, index) => (
                  <article key={category.title} className={`group relative overflow-hidden border p-7 transition hover:-translate-y-1 motion-reduce:transform-none ${index % 3 === 0 ? 'border-[#111] bg-[#111] text-white shadow-[0_15px_36px_rgba(17,17,17,0.12)]' : 'border-[#d6cbc1] bg-[#fffaf4] shadow-[0_10px_28px_rgba(38,26,20,0.05)]'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${index % 3 === 0 ? 'text-[#ff7259]' : 'text-[#d83e2a]'}`}>Deal categorie 0{index + 1}</span>
                      <span className="h-2 w-2 rotate-45 bg-[#ef4d35]" />
                    </div>
                    <h3 className={`mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] ${index % 3 === 0 ? 'text-white' : 'text-[#111]'}`}>{category.title}</h3>
                    <p className={`mt-4 leading-7 ${index % 3 === 0 ? 'text-white/54' : 'text-[#6b625d]'}`}>{category.description}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href={category.href} className={index % 3 === 0 ? 'inline-flex min-h-11 items-center border border-white/16 px-4 text-sm font-bold text-white transition hover:border-[#ef4d35]/60 hover:bg-[#ef4d35]/12' : 'wn-button wn-button-secondary'}>Lees de keuzehulpen →</Link>
                      {catalogEnabled ? <Link href={`/zoeken?q=${encodeURIComponent(category.query)}`} className={index % 3 === 0 ? 'inline-flex min-h-11 items-center bg-[#ef4d35] px-4 text-sm font-bold text-white transition hover:bg-[#f45d45]' : 'wn-button wn-button-primary'}>Bekijk producten →</Link> : null}
                    </div>
                    <span aria-hidden="true" className="absolute -bottom-16 -right-16 h-40 w-40 rotate-12 border border-[#ef4d35]/12 transition group-hover:scale-110" />
                  </article>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden border-y border-white/8 bg-[linear-gradient(135deg,#030303_0%,#0b0b0b_55%,#32100b_100%)] text-white" aria-labelledby="good-deal-title">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <span className="absolute -right-28 top-0 h-80 w-80 rounded-full bg-[#ef4d35]/14 blur-3xl" />
                <span className="absolute left-[11%] top-[14%] h-2 w-2 rotate-45 bg-[#ef4d35] shadow-[0_0_26px_8px_rgba(239,77,53,0.18)]" />
                <span className="absolute bottom-[11%] right-[27%] h-1.5 w-1.5 rounded-full bg-[#ffb38e] shadow-[0_0_20px_7px_rgba(255,179,142,0.14)]" />
              </div>
              <div className="wn-container relative wn-section">
                <div className="max-w-3xl">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff745d]">Dealcheck</p>
                  <h2 id="good-deal-title" className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-[-0.055em] text-white sm:text-5xl">Een goede deal is meer dan een rood prijskaartje.</h2>
                  <p className="mt-4 max-w-2xl leading-7 text-white/56">Gebruik korting als laatste controle, niet als vertrekpunt. Deze vier checks houden snelheid en voordeel in balans.</p>
                </div>
                <div className="mt-9 grid gap-3 lg:grid-cols-4">
                  {dealChecks.map(([number, title, description]) => (
                    <article key={number} className="border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-3xl font-black tracking-[-0.06em] text-[#ef4d35]">{number}</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/30">Check</span>
                      </div>
                      <h3 className="mt-5 text-xl font-extrabold leading-tight tracking-[-0.03em] text-white">{title}</h3>
                      <p className="mt-3 text-sm leading-6 text-white/48">{description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="wn-container wn-section">
              <div className="relative overflow-hidden border border-[#ef4d35]/35 bg-[#111] px-7 py-11 text-white shadow-[0_28px_80px_rgba(17,17,17,0.18)] sm:px-10 lg:px-12 lg:py-14">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <span className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ef4d35]/18 blur-3xl" />
                  <span className="absolute -bottom-10 left-[28%] h-32 w-72 rotate-[-10deg] border border-white/5" />
                </div>
                <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div className="max-w-3xl">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff745d]">Black Friday bij Winkelnu</p>
                    <h2 className="mt-3 max-w-[14ch] text-4xl font-black uppercase leading-[0.94] tracking-[-0.055em] text-white sm:text-5xl">Slim kiezen vóór de korting begint.</h2>
                    <p className="mt-4 max-w-2xl leading-7 text-white/54">Gebruik Winkelnu om eerst te ontdekken en vergelijken. Zodra gecontroleerde aanbiedingen beschikbaar zijn, voegen we die hier toe zonder de keuzehulp uit het oog te verliezen.</p>
                  </div>
                  <div className="flex flex-wrap gap-3 lg:justify-end">
                    <Link href={catalogEnabled ? '/zoeken' : '/koopgidsen'} className="inline-flex min-h-12 items-center bg-[#ef4d35] px-5 text-sm font-black uppercase tracking-[0.06em] text-white transition hover:bg-[#f45d45]">{catalogEnabled ? 'Ontdek producten →' : 'Bekijk koopgidsen →'}</Link>
                    <Link href="/collecties/cyber-monday" className="inline-flex min-h-12 items-center border border-white/18 px-5 text-sm font-bold text-white transition hover:border-[#ef4d35]/60 hover:bg-[#ef4d35]/10">Bekijk Cyber Monday →</Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <WinkelnuFooter />
    </div>
  )
}
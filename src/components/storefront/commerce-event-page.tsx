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

export function CommerceEventPage({ campaign }: { campaign: CommerceEventCampaign }) {
  const cycle = getBlackFridayCycle(campaign.year)
  const image = getCategoryImage(campaign.imageSlug, campaign.imageLabel)
  const catalogEnabled = isPublicCatalogEnabled()
  const isCyberMonday = campaign.kind === 'cyber-monday'

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-[var(--wn-ink)]">
      <WinkelnuHeader theme={isCyberMonday ? 'default' : 'black-friday'} />
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
                  {!isCyberMonday ? (
                    <>
                      <span className="absolute bottom-[15%] left-[7%] h-1.5 w-1.5 rounded-full bg-[#f4bd85] shadow-[0_0_22px_8px_rgba(244,189,133,0.22)]" />
                      <span className="absolute right-[9%] top-[58%] h-1 w-1 rounded-full bg-[#ffd8b8] shadow-[0_0_18px_6px_rgba(239,115,56,0.18)]" />
                    </>
                  ) : null}
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
                  <a
                    href="#slim-kiezen"
                    className={`mt-8 inline-flex min-h-12 items-center rounded-full px-5 font-extrabold text-white transition hover:-translate-y-0.5 motion-reduce:transform-none ${
                      isCyberMonday
                        ? 'shadow-[0_10px_30px_rgba(0,0,0,0.24)]'
                        : 'border border-[#ffd0ad]/55 shadow-[0_10px_30px_rgba(239,115,56,0.28)]'
                    }`}
                    style={{ backgroundColor: isCyberMonday ? campaign.accent : '#ef7338' }}
                  >
                    {isCyberMonday ? 'Bekijk de Cyber Monday-aanpak ↓' : 'Bereid Black Friday slim voor ↓'}
                  </a>
                </div>
              </div>

              <div className="relative min-h-[25rem] overflow-hidden lg:min-h-[35rem]">
                {image ? (
                  <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 1023px) 100vw, 48vw" className="object-cover brightness-[0.56] saturate-[0.82] contrast-[1.08]" style={{ objectPosition: image.position }} />
                ) : null}
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,6,0.72)_0%,rgba(5,7,6,0.18)_48%,rgba(5,7,6,0.34)_100%)]" />
                <div className={`absolute inset-x-6 bottom-6 rounded-[1.25rem] border p-5 backdrop-blur-md sm:inset-x-8 sm:bottom-8 ${isCyberMonday ? 'border-white/15 bg-black/55' : 'border-[#f1a56f]/20 bg-[rgba(5,9,8,0.72)] shadow-[0_14px_40px_rgba(0,0,0,0.28)]'}`}>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: campaign.accentSoft }}>Winkelnu dealmoment</p>
                  <p className="wn-display mt-2 text-2xl font-semibold text-white">{isCyberMonday ? formatDate(cycle.cyberMondayOn) : formatDate(cycle.blackFridayOn)}</p>
                  <p className="mt-2 text-sm leading-6 text-white/64">
                    {isCyberMonday
                      ? 'De datum wordt automatisch uit de kalenderregel berekend en schuift ieder jaar mee.'
                      : 'Black Friday verschuift ieder jaar. Winkelnu houdt het juiste moment automatisch voor je bij.'}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>

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
              <div className="relative overflow-hidden rounded-[2rem] border border-[#dca77a]/25 bg-[#fbf6ee] px-6 py-9 shadow-[0_22px_70px_rgba(63,36,22,0.08)] sm:px-9 sm:py-11 lg:px-12">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                  <span className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#ef7338]/7 blur-3xl" />
                  <span className="absolute right-[8%] top-[14%] h-1.5 w-1.5 rounded-full bg-[#d99b63] shadow-[0_0_18px_6px_rgba(217,155,99,0.16)]" />
                  <span className="absolute left-[4%] bottom-[12%] h-1 w-1 rounded-full bg-[#ef7338] shadow-[0_0_16px_6px_rgba(239,115,56,0.14)]" />
                </div>

                <div className="relative max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c55422]">✦ Black Friday slim aanpakken</p>
                  <h2 id="black-friday-smart-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">
                    Niet wachten op korting. Eerst weten wat je zoekt.
                  </h2>
                  <p className="wn-body-muted mt-4 max-w-2xl leading-7">
                    Black Friday wordt overzichtelijker als je vooraf bepaalt wat je nodig hebt, producten vergelijkt en pas daarna naar de aanbieding kijkt. Zo voorkom je dat een hoog kortingspercentage belangrijker wordt dan de juiste keuze.
                  </p>
                </div>

                <div className="relative mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {blackFridaySteps.map((step) => (
                    <article key={step.number} className="group relative min-h-[17rem] overflow-hidden rounded-[1.45rem] border border-[#d7b99f]/45 bg-[linear-gradient(155deg,#fffdf9_0%,#fff8ef_62%,#faeadf_100%)] p-6 shadow-[0_10px_30px_rgba(80,48,29,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(80,48,29,0.10)] motion-reduce:transform-none">
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e4b08a]/60 bg-[#fff4e9] text-xs font-extrabold text-[#a9431c]">{step.number}</span>
                        <span className="h-px w-10 bg-[#d99b63]/55" />
                      </div>
                      <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b44b22]">{step.eyebrow}</p>
                      <h3 className="wn-display mt-2 text-2xl font-semibold leading-tight text-[var(--wn-petrol-deep)]">{step.title}</h3>
                      <p className="wn-body-muted mt-3 text-sm leading-6">{step.description}</p>
                      <span aria-hidden="true" className="absolute bottom-5 right-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#9f3f1b] text-lg text-white shadow-[0_8px_18px_rgba(159,63,27,0.18)]">→</span>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="border-y border-[#decab7]/50 bg-[#efe6d9]" aria-labelledby="black-friday-timeline-title">
              <div className="wn-container wn-section">
                <div className="max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b64a20]">✦ Van preview tot Cyber Monday</p>
                  <h2 id="black-friday-timeline-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">Dit zijn de belangrijke dealmomenten.</h2>
                  <p className="wn-body-muted mt-4 max-w-2xl leading-7">Gebruik de dagen vóór Black Friday om te oriënteren. Hoe dichter het dealweekend komt, hoe meer de focus verschuift van ontdekken naar controleren en vergelijken.</p>
                </div>

                <div className="relative mt-10 grid gap-4 lg:grid-cols-4">
                  <span aria-hidden="true" className="absolute left-[7%] right-[7%] top-[2.4rem] hidden h-px bg-[linear-gradient(90deg,rgba(197,84,34,0.15),rgba(197,84,34,0.65),rgba(197,84,34,0.15))] lg:block" />
                  {[
                    ['Preview', cycle.previewStartsOn, 'Oriënteer en maak je shortlist.'],
                    ['Black Friday Week', cycle.blackFridayWeekStartsOn, 'Aanbiedingen nemen toe.'],
                    ['Black Friday', cycle.blackFridayOn, 'Het belangrijkste dealmoment.'],
                    ['Cyber Monday', cycle.cyberMondayOn, 'De digitale finale van het weekend.'],
                  ].map(([label, date, description], index) => (
                    <article key={label} className="relative rounded-[1.35rem] border border-[#d9c2ac]/60 bg-[#fffaf3] p-6 shadow-[0_10px_26px_rgba(74,46,27,0.055)]">
                      <div className="relative z-10 flex items-center justify-between gap-3">
                        <time dateTime={date} className="inline-flex min-h-10 items-center rounded-full bg-[#142e2b] px-4 text-xs font-extrabold tracking-[0.12em] text-[#fff7ed]">{formatShortDate(date)}</time>
                        <span className="text-xs font-extrabold text-[#bd4e22]">0{index + 1}</span>
                      </div>
                      <h3 className="wn-display mt-5 text-2xl font-semibold text-[var(--wn-petrol-deep)]">{label}</h3>
                      <p className="wn-body-muted mt-2 text-sm leading-6">{description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="wn-container wn-section" aria-labelledby="deal-categories-title">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c55422]">✦ Begin bij een categorie</p>
                <h2 id="deal-categories-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">Waar wil je Black Friday voor gebruiken?</h2>
                <p className="wn-body-muted mt-4 max-w-2xl leading-7">Kies eerst het soort product waar je naar zoekt. Daarna kun je veel gerichter beoordelen of een tijdelijke aanbieding werkelijk bij je past.</p>
              </div>
              <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {categories.map((category, index) => (
                  <article key={category.title} className={`group relative overflow-hidden rounded-[1.5rem] border p-7 shadow-[var(--wn-shadow-xs)] transition hover:-translate-y-1 hover:shadow-[var(--wn-shadow-sm)] motion-reduce:transform-none ${index % 3 === 1 ? 'border-[#b7cbc4]/60 bg-[#f1f5f0]' : index % 3 === 2 ? 'border-[#e0c1a7]/60 bg-[#fff7ed]' : 'border-[var(--wn-border)] bg-white'}`}>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#bd4e22]">Categorie 0{index + 1}</span>
                    <h3 className="wn-display mt-3 text-3xl font-semibold text-[var(--wn-petrol-deep)]">{category.title}</h3>
                    <p className="wn-body-muted mt-3 leading-7">{category.description}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href={category.href} className="wn-button wn-button-secondary">Lees de keuzehulpen →</Link>
                      {catalogEnabled ? <Link href={`/zoeken?q=${encodeURIComponent(category.query)}`} className="wn-button wn-button-primary">Bekijk producten →</Link> : null}
                    </div>
                    <span aria-hidden="true" className="absolute -bottom-14 -right-14 h-36 w-36 rounded-full border border-[#c96b3d]/10 transition group-hover:scale-110" />
                  </article>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden border-y border-white/8 bg-[linear-gradient(135deg,#07100f_0%,#102725_52%,#3d2114_100%)] text-white" aria-labelledby="good-deal-title">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <span className="absolute -right-28 top-0 h-80 w-80 rounded-full bg-[#ef7338]/10 blur-3xl" />
                <span className="absolute left-[12%] top-[16%] h-2 w-2 rounded-full bg-[#f2b37f] shadow-[0_0_28px_9px_rgba(242,179,127,0.18)]" />
                <span className="absolute bottom-[12%] right-[28%] h-1.5 w-1.5 rounded-full bg-[#ffd3af] shadow-[0_0_20px_7px_rgba(255,211,175,0.14)]" />
              </div>
              <div className="wn-container relative wn-section">
                <div className="max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f39a63]">✦ Zo herken je een goede deal</p>
                  <h2 id="good-deal-title" className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#fff8ef] sm:text-5xl">Een goede deal is meer dan een rood prijskaartje.</h2>
                  <p className="mt-4 max-w-2xl leading-7 text-white/62">Gebruik korting als laatste controle, niet als vertrekpunt. Deze vier checks helpen om snelheid en voordeel in balans te houden.</p>
                </div>
                <div className="mt-9 grid gap-4 lg:grid-cols-4">
                  {dealChecks.map(([number, title, description]) => (
                    <article key={number} className="rounded-[1.35rem] border border-[#ffb47e]/15 bg-white/[0.055] p-6 shadow-[0_16px_34px_rgba(0,0,0,0.12)] backdrop-blur-sm">
                      <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-[#f2a16c]/24 bg-[#ef7338]/10 px-2 text-xs font-extrabold tracking-[0.12em] text-[#f6aa77]">{number}</span>
                      <h3 className="wn-display mt-4 text-xl font-semibold text-[#fff8ef]">{title}</h3>
                      <p className="mt-3 text-sm leading-6 text-white/56">{description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="wn-container wn-section">
              <div className="relative overflow-hidden rounded-[2rem] border border-[#d89a6d]/28 bg-[linear-gradient(120deg,#fff9f1_0%,#f8eadc_58%,#eed5c2_100%)] px-7 py-10 shadow-[0_24px_70px_rgba(75,43,25,0.09)] sm:px-10 lg:px-12 lg:py-12">
                <span aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ef7338]/9 blur-3xl" />
                <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div className="max-w-3xl">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8481f]">Black Friday bij Winkelnu</p>
                    <h2 className="wn-display mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--wn-petrol-deep)] sm:text-5xl">Slim kiezen vóór de korting begint.</h2>
                    <p className="wn-body-muted mt-4 max-w-2xl leading-7">Gebruik Winkelnu om eerst te ontdekken en vergelijken. Zodra gecontroleerde aanbiedingen beschikbaar zijn, voegen we die hier toe zonder de keuzehulp uit het oog te verliezen.</p>
                  </div>
                  <div className="flex flex-wrap gap-3 lg:justify-end">
                    <Link href={catalogEnabled ? '/zoeken' : '/koopgidsen'} className="wn-button wn-button-primary">{catalogEnabled ? 'Ontdek producten →' : 'Bekijk koopgidsen →'}</Link>
                    <Link href="/collecties/cyber-monday" className="wn-button wn-button-secondary">Bekijk Cyber Monday →</Link>
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

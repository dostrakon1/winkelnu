import Image from 'next/image'
import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { getCategoryImage } from '@/content/category-images'
import { getBlackFridayCycle, type CommerceEventCampaign } from '@/content/commerce-event-campaigns'
import { WinkelnuFooter } from './winkelnu-footer'
import { WinkelnuHeader } from './winkelnu-header'

function formatShortDate(dateKey: string) {
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', timeZone: 'Europe/Amsterdam' })
    .format(new Date(`${dateKey}T12:00:00Z`))
    .replace('.', '')
    .toUpperCase()
}

const protocolSteps = [
  {
    number: '01',
    eyebrow: 'Shortlist',
    title: 'Begin bij wat je al wilde',
    description: 'Gebruik Cyber Monday niet om méér te zoeken, maar om je bestaande shortlist slimmer af te ronden.',
  },
  {
    number: '02',
    eyebrow: 'Specificaties',
    title: 'Controleer het exacte model',
    description: 'Vergelijk uitvoering, modelnummer, accessoires en functies voordat je naar de tijdelijke prijs kijkt.',
  },
  {
    number: '03',
    eyebrow: 'Winkelcheck',
    title: 'Vergelijk de totale deal',
    description: 'Prijs, verzending, retour en garantie bepalen samen of een aanbieding werkelijk interessant is.',
  },
  {
    number: '04',
    eyebrow: 'Finale',
    title: 'Kies alleen als het klopt',
    description: 'Cyber Monday is de finale, niet de deadline om iets te kopen dat niet goed bij je past.',
  },
] as const

const focusCategories = [
  {
    title: 'Elektronica',
    description: 'Laptops, audio, schermen en slimme apparaten waarbij het exacte model het verschil maakt.',
    href: '/koopgidsen/categorie/elektronica',
    query: 'elektronica',
  },
  {
    title: 'Kantoor & studie',
    description: 'Werkplekapparatuur en accessoires die je op gebruik, formaat en compatibiliteit wilt vergelijken.',
    href: '/koopgidsen/categorie/kantoor-studie',
    query: 'kantoor studie',
  },
  {
    title: 'Wonen & huishouden',
    description: 'Slimme apparaten en huishoudelijke producten waarbij verbruik en gebruiksgemak meewegen.',
    href: '/koopgidsen/categorie/wonen-huishouden',
    query: 'wonen huishouden',
  },
  {
    title: 'Keuken & koffie',
    description: 'Apparaten voor dagelijks gebruik: controleer capaciteit, onderhoud en praktische functies.',
    href: '/koopgidsen/categorie/keuken-koffie',
    query: 'keuken koffie',
  },
  {
    title: 'Persoonlijke verzorging',
    description: 'Vergelijk functies, accessoires en garantie in plaats van alleen de digitale kortingsbadge.',
    href: '/koopgidsen/categorie/persoonlijke-verzorging',
    query: 'persoonlijke verzorging',
  },
  {
    title: 'Reizen & bagage',
    description: 'Technische reisaccessoires en bagage waarbij formaat, gewicht en duurzaamheid centraal staan.',
    href: '/koopgidsen/categorie/reizen-bagage',
    query: 'reizen bagage',
  },
] as const

const dealChecks = [
  ['01', 'Is dit exact hetzelfde model?', 'Een vergelijkbare naam kan toch een andere uitvoering, generatie of bundel betekenen.'],
  ['02', 'Is de totaalprijs echt lager?', 'Neem verzendkosten en eventuele extra kosten mee in de vergelijking.'],
  ['03', 'Zijn retour en garantie duidelijk?', 'Een digitale deal blijft alleen goed als de voorwaarden ook na aankoop kloppen.'],
  ['04', 'Wilde je dit vóór vandaag al?', 'De beste Cyber Monday-aankoop is iets dat al op je lijst stond en nu aantoonbaar beter uitkomt.'],
] as const

const ticker = ['CYBER MONDAY', 'ONLINE FINALE', '30 NOVEMBER', 'VERGELIJK SLIM', 'CHECK DE DEAL'] as const

export function CyberMondayPage({ campaign }: { campaign: CommerceEventCampaign }) {
  const cycle = getBlackFridayCycle(campaign.year)
  const image = getCategoryImage(campaign.imageSlug, campaign.imageLabel)
  const catalogEnabled = isPublicCatalogEnabled()

  return (
    <div className="min-h-screen bg-[#f1f3f4] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <section className="wn-container pt-6 sm:pt-8" aria-labelledby="cyber-monday-title">
          <article className="relative overflow-hidden rounded-[2rem] border border-[#35d8e8]/24 bg-[#05070d] text-white shadow-[0_30px_90px_rgba(3,9,18,0.30)]">
            <div className="grid lg:grid-cols-[1.03fr_0.97fr]">
              <div className="relative flex min-h-[31rem] flex-col justify-center overflow-hidden px-7 py-12 sm:px-10 lg:min-h-[35rem] lg:px-14">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#03050a_0%,#08111c_45%,#0b2f37_72%,#115b65_100%)]" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-45" style={{ backgroundImage: 'linear-gradient(rgba(85,218,230,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(85,218,230,0.09) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <span className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-[#5ce7f2]/10" />
                  <span className="absolute -bottom-28 right-2 h-80 w-80 rounded-full bg-[#25cddd]/16 blur-3xl" />
                  <span className="absolute right-[14%] top-[15%] h-2 w-2 rounded-full bg-[#aef7ff] shadow-[0_0_30px_11px_rgba(53,216,232,0.30)]" />
                  <span className="absolute right-[31%] top-[29%] h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_20px_8px_rgba(255,255,255,0.12)]" />
                  <span className="absolute -right-20 top-16 h-px w-80 rotate-[-9deg] bg-[#35d8e8]/55" />
                  <span className="absolute -right-16 top-24 h-14 w-72 rotate-[-9deg] border-y border-[#35d8e8]/18 bg-[#35d8e8]/5" />
                </div>

                <div className="relative z-10 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex min-h-8 items-center border border-[#35d8e8]/45 bg-[#35d8e8]/10 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#baf8ff]">
                      Winkelnu Digital Deal Event
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/42">Edition {campaign.year}</span>
                  </div>

                  <h1 id="cyber-monday-title" className="mt-5 max-w-[10ch] font-black uppercase leading-[0.78] tracking-[-0.085em] text-white text-[clamp(4.2rem,9.5vw,8rem)]">
                    <span className="block">Cyber</span>
                    <span className="block text-[#35d8e8]">Monday</span>
                  </h1>
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-[#baf8ff]">De digitale finale. Zonder digitale haast.</p>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-white/68">{campaign.description}</p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {campaign.chips.map((chip) => (
                      <Link key={chip.href} href={chip.href} className="inline-flex min-h-10 items-center border border-white/12 bg-white/[0.035] px-3.5 text-xs font-bold uppercase tracking-[0.06em] text-white/90 transition hover:border-[#35d8e8]/60 hover:bg-[#35d8e8]/10">
                        {chip.label}
                      </Link>
                    ))}
                  </div>

                  <a href="#cyber-protocol" className="mt-8 inline-flex min-h-12 items-center border border-[#8aeff7]/35 bg-[#22bdcc] px-5 text-sm font-black uppercase tracking-[0.06em] text-[#031014] shadow-[0_12px_34px_rgba(34,189,204,0.28)] transition hover:-translate-y-0.5 hover:bg-[#35d8e8] motion-reduce:transform-none">
                    Start de Cyber Monday-check ↓
                  </a>
                </div>
              </div>

              <div className="relative min-h-[25rem] overflow-hidden lg:min-h-[35rem]">
                {image ? (
                  <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 1023px) 100vw, 48vw" className="object-cover brightness-[0.36] saturate-[0.62] contrast-[1.18]" style={{ objectPosition: image.position }} />
                ) : null}
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,8,14,0.80)_0%,rgba(4,8,14,0.18)_52%,rgba(0,66,76,0.42)_100%)]" />
                <span aria-hidden="true" className="absolute -right-16 top-8 h-52 w-52 rounded-full bg-[#35d8e8]/16 blur-3xl" />
                <div className="absolute right-5 top-5 border border-[#8aeff7]/35 bg-[#08131c]/82 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#baf8ff] backdrop-blur-md sm:right-8 sm:top-8">Digital finale</div>

                <div className="absolute inset-x-6 bottom-6 border border-[#35d8e8]/28 bg-[rgba(4,10,16,0.84)] p-5 shadow-[0_16px_44px_rgba(0,0,0,0.34)] backdrop-blur-md sm:inset-x-8 sm:bottom-8">
                  <div className="grid grid-cols-[auto_1fr] items-end gap-5">
                    <div className="border-r border-[#35d8e8]/42 pr-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#aef7ff]">Online finale</p>
                      <p className="mt-1 text-5xl font-black leading-none tracking-[-0.08em] text-white">30</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black uppercase tracking-[-0.04em] text-white">November</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/45">{campaign.year} · Cyber Monday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-6 overflow-hidden border-y border-[#35d8e8]/22 bg-[#050811] text-white" aria-label="Cyber Monday campagneband">
          <div className="wn-container flex min-h-14 items-center overflow-hidden py-3">
            <div className="flex min-w-max items-center gap-5 text-[11px] font-black uppercase tracking-[0.19em] text-white/72 sm:gap-7 sm:text-xs">
              {[...ticker, ...ticker].map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center gap-5 sm:gap-7">
                  <span className={item === 'CYBER MONDAY' ? 'text-[#4be6f2]' : ''}>{item}</span>
                  <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[#35d8e8]" />
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="cyber-protocol" className="wn-container scroll-mt-28 wn-section" aria-labelledby="cyber-protocol-title">
          <div className="relative overflow-hidden border border-[#c6dadd] bg-white px-6 py-10 shadow-[0_22px_70px_rgba(21,42,48,0.08)] sm:px-9 sm:py-12 lg:px-12">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#35d8e8]/8 blur-3xl" />
              <span className="absolute left-0 top-0 h-2 w-40 bg-[#22bdcc]" />
              <span className="absolute right-8 top-8 h-16 w-16 rotate-12 border border-[#35d8e8]/15" />
            </div>

            <div className="relative grid gap-7 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-end">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#087e89]">Cyber Monday Protocol</p>
                <h2 id="cyber-protocol-title" className="mt-3 max-w-[12ch] text-4xl font-black uppercase leading-[0.94] tracking-[-0.055em] text-[#0a1117] sm:text-5xl lg:text-6xl">De finale vraagt focus.</h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-[#536268]">Cyber Monday is het laatste grote dealmoment van het weekend. Gebruik die druk niet om sneller te kopen, maar om je shortlist scherper af te ronden.</p>
            </div>

            <div className="relative mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {protocolSteps.map((step, index) => (
                <article key={step.number} className={`group relative min-h-[17rem] overflow-hidden border p-6 transition hover:-translate-y-1 motion-reduce:transform-none ${index === 3 ? 'border-[#35d8e8] bg-[#07121a] text-white shadow-[0_18px_42px_rgba(7,18,26,0.16)]' : 'border-[#d4e2e4] bg-[#fbfdfd] shadow-[0_10px_30px_rgba(16,42,47,0.05)] hover:shadow-[0_18px_42px_rgba(16,42,47,0.09)]'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className={`text-4xl font-black tracking-[-0.06em] ${index === 3 ? 'text-[#4be6f2]' : 'text-[#0a1117]'}`}>{step.number}</span>
                    <span className="h-1 w-10 bg-[#22bdcc]" />
                  </div>
                  <p className={`mt-5 text-[10px] font-black uppercase tracking-[0.18em] ${index === 3 ? 'text-[#aef7ff]' : 'text-[#087e89]'}`}>{step.eyebrow}</p>
                  <h3 className={`mt-2 text-2xl font-extrabold leading-tight tracking-[-0.035em] ${index === 3 ? 'text-white' : 'text-[#0a1117]'}`}>{step.title}</h3>
                  <p className={`mt-3 text-sm leading-6 ${index === 3 ? 'text-white/58' : 'text-[#607076]'}`}>{step.description}</p>
                  <span aria-hidden="true" className={`absolute bottom-5 right-5 inline-flex h-10 w-10 items-center justify-center text-lg ${index === 3 ? 'bg-[#22bdcc] text-[#031014]' : 'bg-[#0a1117] text-white'}`}>→</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-white/8 bg-[#060a12] text-white" aria-labelledby="cyber-timeline-title">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute -right-32 -top-20 h-80 w-80 rounded-full bg-[#35d8e8]/12 blur-3xl" />
            <span className="absolute -left-24 bottom-0 h-48 w-80 rotate-[-10deg] border border-white/5" />
          </div>
          <div className="wn-container relative wn-section">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#4be6f2]">Deal weekend finale</p>
                <h2 id="cyber-timeline-title" className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-[-0.055em] text-white sm:text-5xl">Van dealweek naar maandag.</h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-white/52">Cyber Monday staat niet los van Black Friday. Zie het als het laatste controlemoment na het weekend, niet als een nieuwe reden om opnieuw te beginnen.</p>
            </div>

            <div className="relative mt-10 grid gap-3 lg:grid-cols-4">
              <span aria-hidden="true" className="absolute left-[7%] right-[7%] top-[3.15rem] hidden h-[2px] bg-[linear-gradient(90deg,rgba(53,216,232,0.15),#35d8e8,rgba(53,216,232,0.15))] lg:block" />
              {[
                ['Black Friday Week', cycle.blackFridayWeekStartsOn, 'Maak je shortlist definitief.'],
                ['Black Friday', cycle.blackFridayOn, 'Start van het belangrijkste dealweekend.'],
                ['Weekendcheck', cycle.blackFridayWeekendEndsOn, 'Vergelijk voorwaarden en totaalprijs.'],
                ['Cyber Monday', cycle.cyberMondayOn, 'De digitale finale van het weekend.'],
              ].map(([label, date, description], index) => (
                <article key={`${label}-${index}`} className={`relative border p-6 ${index === 3 ? 'border-[#35d8e8]/70 bg-[#35d8e8]/10 shadow-[0_0_45px_rgba(53,216,232,0.10)]' : 'border-white/10 bg-white/[0.035]'}`}>
                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <time dateTime={date} className={`inline-flex min-h-10 items-center px-4 text-xs font-black uppercase tracking-[0.12em] ${index === 3 ? 'bg-[#22bdcc] text-[#031014]' : 'border border-white/12 bg-[#0c1118] text-[#f7fbfc]'}`}>{formatShortDate(date)}</time>
                    <span className="text-xs font-black text-[#4be6f2]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold uppercase tracking-[-0.03em] text-white">{label}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/46">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="wn-container wn-section" aria-labelledby="cyber-categories-title">
          <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#087e89]">Digital focus</p>
              <h2 id="cyber-categories-title" className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-[-0.055em] text-[#0a1117] sm:text-5xl">Begin bij het product, niet bij de badge.</h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[#5d6d73]">Cyber Monday is vooral sterk in online categorieën. De logica blijft hetzelfde: eerst bepalen wat past, daarna pas beoordelen of de aanbieding voordeel geeft.</p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {focusCategories.map((category, index) => (
              <article key={category.title} className={`group relative overflow-hidden border p-7 transition hover:-translate-y-1 motion-reduce:transform-none ${index % 3 === 0 ? 'border-[#07121a] bg-[#07121a] text-white shadow-[0_15px_36px_rgba(7,18,26,0.13)]' : 'border-[#d1dee1] bg-white shadow-[0_10px_28px_rgba(24,48,54,0.05)]'}`}>
                <div className="flex items-center justify-between gap-4">
                  <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${index % 3 === 0 ? 'text-[#4be6f2]' : 'text-[#087e89]'}`}>Digital category 0{index + 1}</span>
                  <span className="h-2 w-2 rotate-45 bg-[#22bdcc]" />
                </div>
                <h3 className={`mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] ${index % 3 === 0 ? 'text-white' : 'text-[#0a1117]'}`}>{category.title}</h3>
                <p className={`mt-4 leading-7 ${index % 3 === 0 ? 'text-white/52' : 'text-[#607076]'}`}>{category.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={category.href} className={index % 3 === 0 ? 'inline-flex min-h-11 items-center border border-white/16 px-4 text-sm font-bold text-white transition hover:border-[#35d8e8]/60 hover:bg-[#35d8e8]/10' : 'wn-button wn-button-secondary'}>Lees de keuzehulpen →</Link>
                  {catalogEnabled ? <Link href={`/zoeken?q=${encodeURIComponent(category.query)}`} className={index % 3 === 0 ? 'inline-flex min-h-11 items-center bg-[#22bdcc] px-4 text-sm font-bold text-[#031014] transition hover:bg-[#35d8e8]' : 'wn-button wn-button-primary'}>Bekijk producten →</Link> : null}
                </div>
                <span aria-hidden="true" className="absolute -bottom-16 -right-16 h-40 w-40 rotate-12 border border-[#35d8e8]/12 transition group-hover:scale-110" />
              </article>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-white/8 bg-[linear-gradient(135deg,#04070d_0%,#081019_52%,#0a333a_100%)] text-white" aria-labelledby="cyber-dealcheck-title">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute -right-28 top-0 h-80 w-80 rounded-full bg-[#35d8e8]/14 blur-3xl" />
            <span className="absolute left-[11%] top-[14%] h-2 w-2 rotate-45 bg-[#35d8e8] shadow-[0_0_26px_8px_rgba(53,216,232,0.18)]" />
          </div>
          <div className="wn-container relative wn-section">
            <div className="max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#4be6f2]">Final dealcheck</p>
              <h2 id="cyber-dealcheck-title" className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-[-0.055em] text-white sm:text-5xl">Online voordeel moet ook offline logisch blijven.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-white/54">Een digitale deal is pas sterk wanneer product, prijs en voorwaarden samen kloppen. Gebruik deze vier checks voordat je afrondt.</p>
            </div>

            <div className="mt-9 grid gap-3 lg:grid-cols-4">
              {dealChecks.map(([number, title, description]) => (
                <article key={number} className="border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-3xl font-black tracking-[-0.06em] text-[#35d8e8]">{number}</span>
                    <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/28">Check</span>
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold leading-tight tracking-[-0.03em] text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/46">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="wn-container wn-section">
          <div className="relative overflow-hidden border border-[#35d8e8]/32 bg-[#07121a] px-7 py-11 text-white shadow-[0_28px_80px_rgba(7,18,26,0.18)] sm:px-10 lg:px-12 lg:py-14">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <span className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#35d8e8]/18 blur-3xl" />
              <span className="absolute -bottom-10 left-[28%] h-32 w-72 rotate-[-10deg] border border-white/5" />
            </div>
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#4be6f2]">Cyber Monday bij Winkelnu</p>
                <h2 className="mt-3 max-w-[15ch] text-4xl font-black uppercase leading-[0.94] tracking-[-0.055em] text-white sm:text-5xl">Rond je shortlist af. Niet je winkelmand.</h2>
                <p className="mt-4 max-w-2xl leading-7 text-white/54">Gebruik Winkelnu om gericht te ontdekken en vergelijken. Zodra gecontroleerde partneraanbiedingen beschikbaar zijn, kunnen die aan deze pagina worden gekoppeld zonder nepdeals of verzonnen kortingsclaims.</p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                {catalogEnabled ? <Link className="inline-flex min-h-12 items-center bg-[#22bdcc] px-5 text-sm font-black uppercase tracking-[0.06em] text-[#031014] transition hover:bg-[#35d8e8]" href="/zoeken">Ontdek producten →</Link> : <Link className="inline-flex min-h-12 items-center bg-[#22bdcc] px-5 text-sm font-black uppercase tracking-[0.06em] text-[#031014] transition hover:bg-[#35d8e8]" href="/koopgidsen">Bekijk koopgidsen →</Link>}
                <Link className="inline-flex min-h-12 items-center border border-white/18 px-5 text-sm font-bold text-white transition hover:border-[#35d8e8]/60 hover:bg-[#35d8e8]/10" href="/collecties/black-friday">Terug naar Black Friday →</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <WinkelnuFooter />
    </div>
  )
}

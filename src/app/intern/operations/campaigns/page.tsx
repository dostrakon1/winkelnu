import type { Metadata } from 'next'
import Link from 'next/link'
import { getBlackFridayCycle, getCommerceEventCampaigns, getCommerceEventPhase } from '@/content/commerce-event-campaigns'
import { getAmsterdamDateKey, seasonalCampaigns } from '@/content/seasonal-campaigns'
import { requireOperatorSession } from '@/infrastructure/operations/operator-session'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Campaign Control Center',
  robots: { index: false, follow: false, nocache: true },
}

type SearchParams = Record<string, string | string[] | undefined>

function readYear(params: SearchParams) {
  const raw = params.year
  const value = Array.isArray(raw) ? raw[0] : raw
  const parsed = Number(value)
  if (Number.isInteger(parsed) && parsed >= 2026 && parsed <= 2100) return parsed
  return Number(getAmsterdamDateKey().slice(0, 4))
}

function formatDate(dateKey: string) {
  return new Intl.DateTimeFormat('nl-NL', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Amsterdam' }).format(new Date(`${dateKey}T12:00:00Z`))
}

const phaseLabels = {
  scheduled: 'Gepland',
  preview: 'Preview actief',
  'black-friday-week': 'Black Friday Week',
  'black-friday': 'Black Friday',
  'black-friday-weekend': 'Black Friday Weekend',
  'cyber-monday': 'Cyber Monday',
  ended: 'Afgelopen',
} as const

export default async function CampaignOperationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const operator = await requireOperatorSession()
  const year = readYear(await searchParams)
  const cycle = getBlackFridayCycle(year)
  const commerceCampaigns = getCommerceEventCampaigns(year)
  const currentYear = Number(getAmsterdamDateKey().slice(0, 4))
  const phase = year === currentYear ? getCommerceEventPhase(new Date(), year) : 'scheduled'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 bg-slate-950 pt-6">
        <nav className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 pb-5 text-sm font-semibold sm:px-8 lg:px-10" aria-label="Interne operations navigatie">
          <Link href="/intern/operations" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:border-slate-500 hover:text-white">Partner operations</Link>
          <Link href="/intern/operations/search" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:border-slate-500 hover:text-white">Search learning</Link>
          <Link href="/intern/operations/campaigns" aria-current="page" className="rounded-lg border border-orange-700 bg-orange-950/35 px-3 py-2 text-orange-200">Campagnes</Link>
        </nav>
      </div>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Winkelnu Control Center</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Campagneplanning</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Automatische datums, actieve fase en publieke landingspagina’s voor commerciële en seizoenscampagnes. Ingelogd als {operator.email}.</p>
          </div>
          <form method="get" className="flex items-end gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Jaar
              <input name="year" type="number" min="2026" max="2100" defaultValue={year} className="mt-2 block h-10 w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-white outline-none focus:border-orange-500" />
            </label>
            <button type="submit" className="h-10 rounded-lg bg-orange-600 px-4 text-sm font-bold text-white hover:bg-orange-500">Bereken</button>
          </form>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Black Friday kalender">
          {[
            ['Preview start', cycle.previewStartsOn],
            ['Black Friday Week', cycle.blackFridayWeekStartsOn],
            ['Black Friday', cycle.blackFridayOn],
            ['Cyber Monday', cycle.cyberMondayOn],
          ].map(([label, date]) => (
            <article key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
              <p className="mt-3 text-lg font-bold text-white">{formatDate(date)}</p>
              <p className="mt-2 font-mono text-xs text-slate-500">{date}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-orange-800/50 bg-[linear-gradient(135deg,rgba(124,45,18,0.26),rgba(15,23,42,0.72))] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">Huidige fase</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{phaseLabels[phase]}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Black Friday wordt automatisch berekend als de vrijdag na de vierde donderdag van november. Cyber Monday volgt drie dagen later. Hierdoor schuift de campagne ieder jaar vanzelf mee.</p>
            </div>
            <span className="inline-flex self-start rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-orange-200">Automatische datumregel</span>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Black Friday & Cyber Monday</h2>
              <p className="mt-2 text-sm text-slate-400">Eén campagnefamilie met twee publieke zoekintenties en een gedeelde kalender.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {commerceCampaigns.map((campaign) => (
              <article key={campaign.slug} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-black/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-400">{campaign.kind === 'black-friday' ? 'Hoofdcampagne' : 'Finalefase'}</p>
                    <h3 className="mt-2 text-2xl font-bold text-white">{campaign.name} {year}</h3>
                  </div>
                  <span className="rounded-full border border-emerald-700/50 bg-emerald-950/50 px-3 py-1 text-xs font-bold text-emerald-300">Ingeschakeld</span>
                </div>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-950/70 p-4"><dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Actief vanaf</dt><dd className="mt-2 text-sm font-semibold text-slate-200">{formatDate(campaign.startsOn)}</dd></div>
                  <div className="rounded-xl bg-slate-950/70 p-4"><dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Actief t/m</dt><dd className="mt-2 text-sm font-semibold text-slate-200">{formatDate(campaign.endsOn)}</dd></div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={campaign.href} target="_blank" className="rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-500">Open publieke pagina ↗</Link>
                  <span className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-400">{campaign.href}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold text-white">Bestaande seizoenscampagnes</h2>
          <p className="mt-2 text-sm text-slate-400">Ter controle: deze blijven naast de nieuwe commerce-eventlaag bestaan. Tijdens 16–30 november krijgt Black Friday/Cyber Monday voorrang in de campagnebalk en homepage-spotlight.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {seasonalCampaigns.map((campaign) => (
              <article key={campaign.slug} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between gap-3"><h3 className="font-bold text-white">{campaign.name}</h3><span className="text-xs font-semibold text-slate-500">{campaign.enabled ? 'Aan' : 'Uit'}</span></div>
                <p className="mt-3 text-xs leading-5 text-slate-400">{campaign.startsOn} → {campaign.endsOn}</p>
                <Link href={campaign.href} target="_blank" className="mt-4 inline-flex text-sm font-bold text-cyan-300 hover:text-cyan-200">Open pagina ↗</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Volgende Control Center-laag</p>
          <h2 className="mt-2 text-xl font-bold text-white">Handmatige overrides en campagneprestaties</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">De kalender is nu automatisch en centraal zichtbaar. De volgende persistence-laag kan start/einddatum-overrides, campagne aan/uit, contentvarianten en later klik/commissie-KPI’s opslaan zonder de datumregel of publieke pagina’s opnieuw te bouwen.</p>
        </section>
      </main>
    </div>
  )
}

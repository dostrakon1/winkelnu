import type { Metadata } from 'next'
import Link from 'next/link'

import { GiftingInsightsReadService, type GiftingInsightsRange } from '@/application/gifting/gifting-insights'
import { SupabaseGiftingInsightsRepository } from '@/infrastructure/gifting/supabase-gifting-insights-repository'
import { requireOperatorPermission } from '@/infrastructure/operations/operator-session'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Lootje & Lijstje Insights',
  robots: { index: false, follow: false, nocache: true },
}

type SearchParams = Record<string, string | string[] | undefined>
type RangePreset = '7' | '30' | '90'

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function isDateKey(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)))
}

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function buildRange(params: SearchParams): { range: GiftingInsightsRange; label: string; preset?: RangePreset } {
  const requestedFrom = firstValue(params.from)
  const requestedTo = firstValue(params.to)

  if (isDateKey(requestedFrom) && isDateKey(requestedTo) && requestedFrom <= requestedTo) {
    const start = new Date(`${requestedFrom}T00:00:00Z`)
    const last = new Date(`${requestedTo}T00:00:00Z`)
    const endExclusive = addUtcDays(last, 1)
    return {
      range: {
        from: start.toISOString(),
        to: endExclusive.toISOString(),
        fromDate: requestedFrom,
        toDate: requestedTo,
      },
      label: `${requestedFrom} t/m ${requestedTo}`,
    }
  }

  const rawPreset = firstValue(params.range)
  const preset: RangePreset = rawPreset === '7' || rawPreset === '90' ? rawPreset : '30'
  const days = Number(preset)
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const start = addUtcDays(today, -(days - 1))
  const endExclusive = addUtcDays(today, 1)

  return {
    range: {
      from: start.toISOString(),
      to: endExclusive.toISOString(),
      fromDate: dateKey(start),
      toDate: dateKey(today),
    },
    label: `Laatste ${days} dagen`,
    preset,
  }
}

function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat('nl-NL', { maximumFractionDigits }).format(value)
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'percent', maximumFractionDigits: 1 }).format(value)
}

function formatMoneyFromCents(value: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value / 100)
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam',
  }).format(new Date(value))
}

const occasionLabel = {
  sinterklaas: 'Sinterklaas',
  kerst: 'Kerst',
  verjaardag: 'Verjaardag',
  anders: 'Anders',
} as const

const statusLabel = { draft: 'Open', drawn: 'Getrokken', closed: 'Gesloten' } as const

function MetricCard({ label, value, detail, accent = false }: { label: string; value: string; detail?: string; accent?: boolean }) {
  return (
    <article className={`rounded-2xl border p-5 ${accent ? 'border-violet-800/70 bg-violet-950/25' : 'border-slate-800 bg-slate-900/70'}`}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold tabular-nums text-white">{value}</p>
      {detail ? <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p> : null}
    </article>
  )
}

export default async function GiftingInsightsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const operator = await requireOperatorPermission('read_gifting_insights')
  if (process.env.CATALOG_PERSISTENCE !== 'supabase') throw new Error('Lootje & Lijstje insights requires CATALOG_PERSISTENCE=supabase.')

  const { range, label, preset } = buildRange(await searchParams)
  const snapshot = await new GiftingInsightsReadService(new SupabaseGiftingInsightsRepository()).read(range)
  const { overview } = snapshot
  const eventDateShare = overview.groupsCreated > 0 ? overview.groupsWithEventDate / overview.groupsCreated : 0
  const winkelnuWishShare = overview.giftItemsPresentFromPeriod > 0 ? overview.winkelnuProductsPresentFromPeriod / overview.giftItemsPresentFromPeriod : 0
  const trendMax = Math.max(1, ...snapshot.dailyActivity.map((row) => Math.max(row.groupsCreated, row.participantsJoined)))

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 bg-slate-950 pt-6">
        <nav className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 pb-5 text-sm font-semibold sm:px-8 lg:px-10" aria-label="Interne operations navigatie">
          <Link href="/intern/operations" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:border-slate-500 hover:text-white">Partner operations</Link>
          <Link href="/intern/operations/search" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:border-slate-500 hover:text-white">Search learning</Link>
          <Link href="/intern/operations/campaigns" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:border-slate-500 hover:text-white">Campagnes</Link>
          <Link href="/intern/operations/gifting" aria-current="page" className="rounded-lg border border-violet-700 bg-violet-950/35 px-3 py-2 text-violet-200">Lootje & Lijstje</Link>
        </nav>
      </div>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">Winkelnu Insights · GI2</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Lootje & Lijstje</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Privacy-veilige lifecycle- en operationele inzichten. Dagtotalen blijven behouden wanneer tijdelijke consumentendata volgens de bewaartermijn wordt verwijderd.</p>
            <p className="mt-2 text-xs text-slate-600">Snapshot {formatDateTime(snapshot.generatedAt)} · ingelogd als {operator.email}</p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap gap-2" aria-label="Periode kiezen">
              {(['7', '30', '90'] as const).map((days) => (
                <Link key={days} href={`/intern/operations/gifting?range=${days}`} className={`rounded-lg border px-3 py-2 text-sm font-semibold ${preset === days ? 'border-violet-700 bg-violet-950/40 text-violet-200' : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}`}>{days} dagen</Link>
              ))}
            </div>
            <form method="get" className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Van<input name="from" type="date" defaultValue={range.fromDate} className="mt-1 block rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs text-slate-200" /></label>
              <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Tot<input name="to" type="date" defaultValue={range.toDate} className="mt-1 block rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs text-slate-200" /></label>
              <button type="submit" className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white hover:bg-violet-500">Toepassen</button>
            </form>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/45 px-4 py-3 text-xs text-slate-500">
          <span>Periode: <strong className="text-slate-300">{label}</strong></span>
          <span>Historische tellingen komen uit anonieme dagelijkse rollups; actuele statuskaarten gebruiken live brondata.</span>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" aria-label="Kerncijfers">
          <MetricCard label="Groepen aangemaakt" value={formatNumber(overview.groupsCreated)} accent />
          <MetricCard label="Eerste trekkingen" value={formatNumber(overview.groupsDrawnCohort)} detail="voltooid binnen de gekozen periode" />
          <MetricCard label="Deelnemers toegevoegd" value={formatNumber(overview.participantsJoined)} detail="inclusief organisator" />
          <MetricCard label="3 deelnemers bereikt" value={formatNumber(overview.groupsWithThreePlusParticipants)} detail="eerste keer dat een groep deze mijlpaal bereikt" />
          <MetricCard label="Losse lijstjes" value={formatNumber(overview.standaloneListsCreated)} />
          <MetricCard label="Wensen toegevoegd" value={formatNumber(overview.giftItemsPresentFromPeriod)} detail="blijft historisch bewaard na verwijdering van het lijstje" />
          <MetricCard label="Winkelnu-producten toegevoegd" value={formatNumber(overview.winkelnuProductsPresentFromPeriod)} />
          <MetricCard label="Actieve groepen nu" value={formatNumber(overview.activeGroupsNow)} detail="huidige stand" />
          <MetricCard label="Actieve reserveringen nu" value={formatNumber(overview.activeReservationsNow)} detail="huidige stand" />
          <MetricCard label="Opnieuw getrokken" value={formatNumber(overview.redrawGroupsCohort)} detail="groepen die voor het eerst een redraw bereikten" />
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/65 p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><h2 className="text-lg font-bold text-white">Activiteit per dag</h2><p className="mt-1 text-xs text-slate-500">Duurzame dagtotalen; deze trend blijft bestaan nadat bronrecords zijn opgeschoond.</p></div>
              <span className="text-xs text-slate-600">paars = groepen · grijs = deelnemers</span>
            </div>
            <div className="mt-5 space-y-3">
              {snapshot.dailyActivity.slice(-21).map((row) => (
                <div key={row.date} className="grid grid-cols-[86px_1fr_42px_42px] items-center gap-3 text-xs">
                  <span className="font-mono text-slate-500">{row.date.slice(5)}</span>
                  <div className="space-y-1">
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.max(row.groupsCreated > 0 ? 3 : 0, (row.groupsCreated / trendMax) * 100)}%` }} /></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-slate-500" style={{ width: `${Math.max(row.participantsJoined > 0 ? 3 : 0, (row.participantsJoined / trendMax) * 100)}%` }} /></div>
                  </div>
                  <span className="text-right tabular-nums text-violet-300">{row.groupsCreated}</span>
                  <span className="text-right tabular-nums text-slate-400">{row.participantsJoined}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/65 p-5">
            <h2 className="text-lg font-bold text-white">Gebruikssignalen</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3"><dt className="text-slate-500">Gem. ingesteld groepsbudget</dt><dd className="font-semibold tabular-nums text-white">{overview.averageGroupBudgetCents > 0 ? formatMoneyFromCents(overview.averageGroupBudgetCents) : '—'}</dd></div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3"><dt className="text-slate-500">Nieuwe groepen met datum</dt><dd className="font-semibold tabular-nums text-white">{formatPercent(eventDateShare)}</dd></div>
              <div className="flex items-center justify-between gap-4"><dt className="text-slate-500">Winkelnu-aandeel wensen</dt><dd className="font-semibold tabular-nums text-white">{overview.giftItemsPresentFromPeriod > 0 ? formatPercent(winkelnuWishShare) : '—'}</dd></div>
            </dl>
          </article>
        </section>

        <section className="mt-8">
          <div className="mb-4"><h2 className="text-xl font-bold text-white">Recente groepen — geredigeerd</h2><p className="mt-1 text-sm text-slate-500">Alleen operationele metadata. Namen, wensen, codes en trekkingparen blijven buiten dit read model.</p></div>
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/65">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                <thead className="bg-slate-950/50 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Ref</th><th className="px-4 py-3">Aangemaakt</th><th className="px-4 py-3">Gelegenheid</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Deeln.</th><th className="px-4 py-3 text-right">Wensen</th><th className="px-4 py-3">Budget</th><th className="px-4 py-3">Trekking</th><th className="px-4 py-3">Gezondheid</th></tr></thead>
                <tbody className="divide-y divide-slate-800/80">
                  {snapshot.recentGroups.map((group) => (
                    <tr key={group.internalRef} className="hover:bg-slate-800/20">
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">#{group.internalRef}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{formatDateTime(group.createdAt)}</td>
                      <td className="px-4 py-3 text-slate-300">{occasionLabel[group.occasion]}</td>
                      <td className="px-4 py-3 text-slate-300">{statusLabel[group.status]}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-300">{group.participantCount}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-300">{group.wishCount}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-400">{group.budgetBucket}</td>
                      <td className="px-4 py-3 text-slate-400">{group.drawVersion > 0 ? `v${group.drawVersion}` : 'Niet getrokken'}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${group.healthStatus === 'ok' ? 'bg-emerald-950/60 text-emerald-300' : 'bg-amber-950/60 text-amber-300'}`}>{group.healthStatus === 'ok' ? 'OK' : group.healthStatus === 'stale' ? 'Verlopen actief' : 'Trekking mismatch'}</span></td>
                    </tr>
                  ))}
                  {snapshot.recentGroups.length === 0 ? <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-500">Nog geen groepen beschikbaar.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-violet-900/60 bg-violet-950/15 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-400">GI2 actief</p>
          <h2 className="mt-2 text-lg font-bold text-white">Lifecycle-meting + historische rollups</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">Nieuwe groepen, deelnemers, trekkingen, losse lijstjes, wensen, Winkelnu-producten en reserveringen worden server-authoritative en idempotent gemeten. Ruwe insight-events worden na 90 dagen verwijderd; anonieme dagtotalen blijven behouden. GI3 voegt privacy-veilige weergave- en deelinteracties toe voor de volledige funnel.</p>
        </section>
      </main>
    </div>
  )
}

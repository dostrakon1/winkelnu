import type { Metadata } from 'next'
import Link from 'next/link'

import type { GiftingInsightsRange } from '@/application/gifting/gifting-insights'
import { GiftingHealthInsightsReadService } from '@/application/gifting/gifting-health-insights'
import { SupabaseGiftingHealthInsightsRepository } from '@/infrastructure/gifting/supabase-gifting-health-insights-repository'
import { requireOperatorPermission } from '@/infrastructure/operations/operator-session'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Lootje & Lijstje Health',
  robots: { index: false, follow: false, nocache: true },
}

type SearchParams = Record<string, string | string[] | undefined>
type RangePreset = '7' | '30' | '90'

type HealthCardProps = {
  label: string
  value: number
  detail: string
  expectedZero?: boolean
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function isDateKey(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)))
}

function buildRange(params: SearchParams): { range: GiftingInsightsRange; label: string; preset?: RangePreset } {
  const requestedFrom = firstValue(params.from)
  const requestedTo = firstValue(params.to)

  if (isDateKey(requestedFrom) && isDateKey(requestedTo) && requestedFrom <= requestedTo) {
    const start = new Date(`${requestedFrom}T00:00:00Z`)
    const last = new Date(`${requestedTo}T00:00:00Z`)
    return {
      range: {
        from: start.toISOString(),
        to: addUtcDays(last, 1).toISOString(),
        fromDate: requestedFrom,
        toDate: requestedTo,
      },
      label: `${requestedFrom} t/m ${requestedTo}`,
    }
  }

  const rawPreset = firstValue(params.range)
  const preset: RangePreset = rawPreset === '7' || rawPreset === '90' ? rawPreset : '30'
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const start = addUtcDays(today, -(Number(preset) - 1))

  return {
    range: {
      from: start.toISOString(),
      to: addUtcDays(today, 1).toISOString(),
      fromDate: dateKey(start),
      toDate: dateKey(today),
    },
    label: `Laatste ${preset} dagen`,
    preset,
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('nl-NL').format(value)
}

function formatDateTime(value?: string): string {
  if (!value) return 'Nog niet bekend'
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Amsterdam',
  }).format(new Date(value))
}

function HealthCard({ label, value, detail, expectedZero = true }: HealthCardProps) {
  const healthy = expectedZero ? value === 0 : true
  return (
    <article className={`rounded-2xl border p-5 ${healthy ? 'border-slate-800 bg-slate-900/70' : 'border-amber-800/70 bg-amber-950/20'}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
        {expectedZero ? (
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${healthy ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
            {healthy ? 'OK' : 'Controleren'}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums text-white">{formatNumber(value)}</p>
      <p className="mt-3 text-xs leading-5 text-slate-500">{detail}</p>
    </article>
  )
}

export default async function GiftingHealthPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const operator = await requireOperatorPermission('read_gifting_insights')
  if (process.env.CATALOG_PERSISTENCE !== 'supabase') {
    throw new Error('Lootje & Lijstje health insights requires CATALOG_PERSISTENCE=supabase.')
  }

  const { range, label, preset } = buildRange(await searchParams)
  const snapshot = await new GiftingHealthInsightsReadService(new SupabaseGiftingHealthInsightsRepository()).read(range)
  const { overview, cleanup } = snapshot

  const integrityIssues =
    overview.staleActiveGroups +
    overview.staleStandaloneLists +
    overview.orphanedGroupLists +
    overview.expiryMismatches +
    overview.drawnAssignmentMismatches +
    overview.groupsOverParticipantLimit +
    overview.rawEventRetentionViolations +
    overview.productMetricRetentionViolations

  const cleanupHealthy = cleanup.configured && cleanup.active && cleanup.lastStatus !== 'failed'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">Winkelnu Insights · GI5</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Health, retention &amp; control</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Controle op dataconsistentie, verlopen records, bewaartermijnen, rate limiting en de dagelijkse cleanup. Alleen geaggregeerde operationele signalen worden getoond.
            </p>
            <p className="mt-2 text-xs text-slate-600">Snapshot {formatDateTime(snapshot.generatedAt)} · ingelogd als {operator.email}</p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap gap-2" aria-label="Periode kiezen">
              {(['7', '30', '90'] as const).map((days) => (
                <Link
                  key={days}
                  href={`/intern/operations/gifting/health?range=${days}`}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${preset === days ? 'border-violet-700 bg-violet-950/40 text-violet-200' : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}`}
                >
                  {days} dagen
                </Link>
              ))}
            </div>
            <form method="get" className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Van<input name="from" type="date" defaultValue={range.fromDate} className="mt-1 block rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs text-slate-200" /></label>
              <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Tot<input name="to" type="date" defaultValue={range.toDate} className="mt-1 block rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs text-slate-200" /></label>
              <button type="submit" className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white hover:bg-violet-500">Toepassen</button>
            </form>
          </div>
        </header>

        <section className={`mt-8 rounded-2xl border p-5 ${integrityIssues === 0 && cleanupHealthy ? 'border-emerald-900/60 bg-emerald-950/15' : 'border-amber-900/60 bg-amber-950/15'}`} aria-label="Algemene health status">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Algemene status</p>
              <p className="mt-1 text-xl font-bold text-white">{integrityIssues === 0 && cleanupHealthy ? 'Meetketen gezond' : 'Aandacht vereist'}</p>
            </div>
            <p className="text-sm text-slate-400">Periode: <strong className="text-slate-200">{label}</strong></p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Health controles">
          <HealthCard label="Verlopen actieve groepen" value={overview.staleActiveGroups} detail="Draft/drawn groepen waarvan expires_at al verstreken is. Verwacht: 0 na cleanup." />
          <HealthCard label="Verlopen losse lijstjes" value={overview.staleStandaloneLists} detail="Actieve standalone lijstjes voorbij de bewaartermijn. Verwacht: 0 na cleanup." />
          <HealthCard label="Orphaned groepslijstjes" value={overview.orphanedGroupLists} detail="Groepslijstjes zonder gekoppelde deelnemer. Verwacht: 0." />
          <HealthCard label="Expiry mismatches" value={overview.expiryMismatches} detail="Deelnemerslijstjes waarvan de vervaldatum niet gelijkloopt met de groep. Verwacht: 0." />
          <HealthCard label="Draw mismatches" value={overview.drawnAssignmentMismatches} detail="Getrokken groepen waarbij het aantal huidige assignments niet overeenkomt met deelnemers. Verwacht: 0." />
          <HealthCard label="Boven deelnemerslimiet" value={overview.groupsOverParticipantLimit} detail="Groepen met meer dan de structurele limiet van 50 deelnemers. Verwacht: 0." />
          <HealthCard label="Raw events te oud" value={overview.rawEventRetentionViolations} detail="Raw insight-events ouder dan 90 dagen. Verwacht: 0 na cleanup." />
          <HealthCard label="Productdetail te oud" value={overview.productMetricRetentionViolations} detail="Product-key dagaggregaten ouder dan 25 maanden. Verwacht: 0 na cleanup." />
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-400">Retention job</p>
            <h2 className="mt-1 text-xl font-bold text-white">Dagelijkse cleanup</h2>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="text-slate-500">Geconfigureerd</dt><dd className="mt-1 font-semibold text-white">{cleanup.configured ? 'Ja' : 'Nee'}</dd></div>
              <div><dt className="text-slate-500">Actief</dt><dd className="mt-1 font-semibold text-white">{cleanup.active ? 'Ja' : 'Nee'}</dd></div>
              <div><dt className="text-slate-500">Schema</dt><dd className="mt-1 font-mono text-xs text-slate-300">{cleanup.schedule ?? 'Niet beschikbaar'}</dd></div>
              <div><dt className="text-slate-500">Laatste status</dt><dd className="mt-1 font-semibold text-white">{cleanup.lastStatus ?? 'Nog geen run-info'}</dd></div>
              <div><dt className="text-slate-500">Laatste start</dt><dd className="mt-1 text-slate-300">{formatDateTime(cleanup.lastStartedAt)}</dd></div>
              <div><dt className="text-slate-500">Laatste succesvolle run</dt><dd className="mt-1 text-slate-300">{formatDateTime(cleanup.lastSuccessAt)}</dd></div>
            </dl>
            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs leading-5 text-slate-500">
              Consumerdata blijft onder de bestaande vervalregels vallen. GI5 bewaart raw insight-events maximaal 90 dagen en product-specifieke dagdetails maximaal 25 maanden; geanonimiseerde business-totalen kunnen langer blijven bestaan.
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="border-b border-slate-800 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-400">Abuse protection</p>
              <h2 className="mt-1 text-xl font-bold text-white">Rate-limit afwijzingen</h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">{formatNumber(overview.rateLimitRejections)} afwijzingen in {label.toLowerCase()}. Alleen actie + dagtotaal; geen IP, bucket hash of bezoeker-ID.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                <thead className="bg-slate-950/45 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Actie</th><th className="px-5 py-3 text-right">Afgewezen</th></tr></thead>
                <tbody className="divide-y divide-slate-800/80">
                  {snapshot.rateLimitRejections.map((row) => (
                    <tr key={row.action}><td className="px-5 py-3 font-mono text-xs text-slate-300">{row.action}</td><td className="px-5 py-3 text-right font-bold tabular-nums text-white">{formatNumber(row.rejectionCount)}</td></tr>
                  ))}
                  {snapshot.rateLimitRejections.length === 0 ? <tr><td colSpan={2} className="px-5 py-10 text-center text-slate-500">Geen rate-limit afwijzingen in deze periode.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-400">Vooruitblik</p>
            <h2 className="mt-1 text-xl font-bold text-white">Groepen die bijna verlopen</h2>
            <p className="mt-4 text-4xl font-bold tabular-nums text-white">{formatNumber(overview.activeGroupsNearingExpiry)}</p>
            <p className="mt-3 text-sm leading-6 text-slate-500">Actieve draft/drawn groepen die binnen 14 dagen verlopen. Dit is een planning-signaal en op zichzelf geen fout.</p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-400">Privacy boundary</p>
            <h2 className="mt-1 text-xl font-bold text-white">Health zonder persoonsmonitoring</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
              <p>Deze pagina toont alleen aantallen en systeemstatus. Geen groepsnaam, deelnemer, sharecode, token, e-mailadres, wensinhoud of individuele draw-relatie wordt uitgelezen.</p>
              <p>Rate-limit signalen worden uitsluitend als dagtotaal per actie opgeslagen. De gehashte request-bucket blijft alleen in de tijdelijke rate-limit tabel en wordt na maximaal twee dagen opgeruimd.</p>
              <p>De cleanup blijft database-lokaal draaien; er is geen extra Vercel cron of afzonderlijke monitoringdienst toegevoegd.</p>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

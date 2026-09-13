import type { Metadata } from 'next'
import Link from 'next/link'

import {
  GiftingFunnelInsightsReadService,
  type GiftingFunnelMetrics,
} from '@/application/gifting/gifting-funnel-insights'
import type { GiftingInsightsRange } from '@/application/gifting/gifting-insights'
import { SupabaseGiftingFunnelInsightsRepository } from '@/infrastructure/gifting/supabase-gifting-funnel-insights-repository'
import { requireOperatorPermission } from '@/infrastructure/operations/operator-session'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Lootje & Lijstje Funnel Insights',
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

function formatNumber(value: number): string {
  return new Intl.NumberFormat('nl-NL').format(value)
}

function formatPercent(numerator: number, denominator: number): string {
  if (denominator <= 0) return '—'
  return new Intl.NumberFormat('nl-NL', { style: 'percent', maximumFractionDigits: 1 }).format(numerator / denominator)
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Amsterdam',
  }).format(new Date(value))
}

function FunnelStep({
  label,
  value,
  previous,
  detail,
}: {
  label: string
  value: number
  previous?: number
  detail?: string
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tabular-nums text-white">{formatNumber(value)}</p>
        </div>
        {previous !== undefined ? (
          <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-bold tabular-nums text-slate-300">
            {formatPercent(value, previous)}
          </span>
        ) : null}
      </div>
      {detail ? <p className="mt-3 text-xs leading-5 text-slate-500">{detail}</p> : null}
    </article>
  )
}

const interactionLabels: Record<string, string> = {
  gifting_landing_viewed: 'Landing bekeken',
  group_create_form_viewed: 'Groepsformulier bekeken',
  list_create_form_viewed: 'Lijstformulier bekeken',
  group_invite_viewed: 'Uitnodiging bekeken',
  shared_list_viewed: 'Gedeeld lijstje bekeken',
  share_link_copied: 'Link gekopieerd',
  whatsapp_share_clicked: 'WhatsApp delen',
  native_share_invoked: 'Native delen',
}

const surfaceLabels: Record<string, string> = {
  landing: 'Startpagina',
  group_create: 'Groep maken',
  list_create: 'Lijstje maken',
  group_invite: 'Groepsuitnodiging',
  shared_list: 'Gedeeld lijstje',
  group_management: 'Groepsbeheer',
  standalone_list_editor: 'Lijstbeheer',
}

function groupShareTotal(funnel: GiftingFunnelMetrics): number {
  return funnel.shareLinksCopied + funnel.whatsappSharesClicked + funnel.nativeSharesInvoked
}

export default async function GiftingFunnelInsightsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const operator = await requireOperatorPermission('read_gifting_insights')
  if (process.env.CATALOG_PERSISTENCE !== 'supabase') {
    throw new Error('Lootje & Lijstje funnel insights requires CATALOG_PERSISTENCE=supabase.')
  }

  const { range, label, preset } = buildRange(await searchParams)
  const snapshot = await new GiftingFunnelInsightsReadService(new SupabaseGiftingFunnelInsightsRepository()).read(range)
  const { funnel } = snapshot
  const shareTotal = groupShareTotal(funnel)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">Winkelnu Insights · GI3</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Funnel &amp; interacties</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Privacy-veilige eventtotalen voor ontdekking, groepsgroei, lijstjes en delen. Er wordt geen bezoeker-ID, cookie, naam, code of trekkingrelatie aan deze funnel gekoppeld.
            </p>
            <p className="mt-2 text-xs text-slate-600">Snapshot {formatDateTime(snapshot.generatedAt)} · ingelogd als {operator.email}</p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap gap-2" aria-label="Periode kiezen">
              {(['7', '30', '90'] as const).map((days) => (
                <Link
                  key={days}
                  href={`/intern/operations/gifting/funnel?range=${days}`}
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

        <div className="mt-6 rounded-xl border border-amber-900/50 bg-amber-950/15 px-4 py-3 text-xs leading-5 text-amber-200/75">
          Periode: <strong className="text-amber-100">{label}</strong>. Percentages hieronder zijn eventverhoudingen binnen dezelfde periode, geen persoons- of cohortconversies. Eén bezoeker kan meerdere events veroorzaken.
        </div>

        <section className="mt-8" aria-labelledby="group-funnel-title">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-400">Groepsfunnel</p>
            <h2 id="group-funnel-title" className="mt-1 text-xl font-bold text-white">Van ontdekken naar lootjes trekken</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FunnelStep label="Landing bekeken" value={funnel.giftingLandingViews} />
            <FunnelStep label="Groepsformulier" value={funnel.groupCreateFormViews} previous={funnel.giftingLandingViews} />
            <FunnelStep label="Groep aangemaakt" value={funnel.groupsCreated} previous={funnel.groupCreateFormViews} detail="Server-authoritative lifecycle-event." />
            <FunnelStep label="Uitnodiging bekeken" value={funnel.groupInviteViews} previous={funnel.groupsCreated} />
            <FunnelStep label="Deelnemers toegevoegd" value={funnel.participantsJoined} detail="Eventvolume; inclusief organisator bij groepscreatie." />
            <FunnelStep label="3 deelnemers bereikt" value={funnel.groupsThreeParticipantsReached} previous={funnel.groupsCreated} detail="Eerste mijlpaal per groep." />
            <FunnelStep label="Eerste trekking" value={funnel.drawsCompleted} previous={funnel.groupsCreated} detail="Server-authoritative lifecycle-event." />
          </div>
        </section>

        <section className="mt-10" aria-labelledby="list-funnel-title">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-400">Lijstjesfunnel</p>
            <h2 id="list-funnel-title" className="mt-1 text-xl font-bold text-white">Van maken naar bekeken worden</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FunnelStep label="Landing bekeken" value={funnel.giftingLandingViews} />
            <FunnelStep label="Lijstformulier" value={funnel.listCreateFormViews} previous={funnel.giftingLandingViews} />
            <FunnelStep label="Lijstje aangemaakt" value={funnel.standaloneListsCreated} previous={funnel.listCreateFormViews} detail="Server-authoritative lifecycle-event." />
            <FunnelStep label="Gedeeld lijstje bekeken" value={funnel.sharedListViews} previous={funnel.standaloneListsCreated} />
          </div>
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-400">Deelacties</p>
            <h2 className="mt-1 text-xl font-bold text-white">Hoe worden links gedeeld?</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3"><dt className="text-slate-400">WhatsApp</dt><dd className="font-bold tabular-nums text-white">{formatNumber(funnel.whatsappSharesClicked)}</dd></div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3"><dt className="text-slate-400">Link gekopieerd</dt><dd className="font-bold tabular-nums text-white">{formatNumber(funnel.shareLinksCopied)}</dd></div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3"><dt className="text-slate-400">Native delen voltooid</dt><dd className="font-bold tabular-nums text-white">{formatNumber(funnel.nativeSharesInvoked)}</dd></div>
              <div className="flex items-center justify-between gap-4"><dt className="font-semibold text-slate-300">Totaal deelacties</dt><dd className="font-bold tabular-nums text-violet-200">{formatNumber(shareTotal)}</dd></div>
            </dl>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="border-b border-slate-800 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-400">Per oppervlak</p>
              <h2 className="mt-1 text-xl font-bold text-white">Waar ontstaan interacties?</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                <thead className="bg-slate-950/45 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Interactie</th><th className="px-5 py-3">Oppervlak</th><th className="px-5 py-3 text-right">Aantal</th></tr></thead>
                <tbody className="divide-y divide-slate-800/80">
                  {snapshot.interactionsBySurface.map((row) => (
                    <tr key={`${row.eventType}:${row.sourceSurface}`}>
                      <td className="px-5 py-3 text-slate-300">{interactionLabels[row.eventType] ?? row.eventType}</td>
                      <td className="px-5 py-3 text-slate-500">{surfaceLabels[row.sourceSurface] ?? row.sourceSurface}</td>
                      <td className="px-5 py-3 text-right font-bold tabular-nums text-white">{formatNumber(row.eventCount)}</td>
                    </tr>
                  ))}
                  {snapshot.interactionsBySurface.length === 0 ? <tr><td colSpan={3} className="px-5 py-10 text-center text-slate-500">Nog geen GI3-interacties in deze periode.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

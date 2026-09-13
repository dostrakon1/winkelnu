import type { Metadata } from 'next'
import Link from 'next/link'

import type { GiftingInsightsRange } from '@/application/gifting/gifting-insights'
import { GiftingProductInsightsReadService } from '@/application/gifting/gifting-product-insights'
import { SupabaseGiftingProductInsightsRepository } from '@/infrastructure/gifting/supabase-gifting-product-insights-repository'
import { requireOperatorPermission } from '@/infrastructure/operations/operator-session'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Lootje & Lijstje Product Insights',
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
  const days = Number(preset)
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const start = addUtcDays(today, -(days - 1))

  return {
    range: {
      from: start.toISOString(),
      to: addUtcDays(today, 1).toISOString(),
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

function formatMoneyCents(value: number): string {
  if (value <= 0) return '—'
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(value / 100)
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

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold tabular-nums text-white">{value}</p>
      <p className="mt-3 text-xs leading-5 text-slate-500">{detail}</p>
    </article>
  )
}

const occasionLabels: Record<string, string> = {
  sinterklaas: 'Sinterklaas',
  kerst: 'Kerst',
  verjaardag: 'Verjaardag',
  anders: 'Anders',
}

export default async function GiftingProductInsightsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const operator = await requireOperatorPermission('read_gifting_insights')
  if (process.env.CATALOG_PERSISTENCE !== 'supabase') {
    throw new Error('Lootje & Lijstje product insights requires CATALOG_PERSISTENCE=supabase.')
  }

  const { range, label, preset } = buildRange(await searchParams)
  const snapshot = await new GiftingProductInsightsReadService(new SupabaseGiftingProductInsightsRepository()).read(range)
  const { overview } = snapshot
  const totalWishes = overview.nativeProductSaves + overview.externalLinkWishes + overview.textWishes

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">Winkelnu Insights · GI4</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Product &amp; commercie</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Welke Winkelnu-producten worden op lijstjes gezet en welke gifting-CTA&apos;s leiden naar een webwinkel? De tellingen blijven anoniem en gebruiken geen bezoeker- of deelnemersprofiel.
            </p>
            <p className="mt-2 text-xs text-slate-600">Snapshot {formatDateTime(snapshot.generatedAt)} · ingelogd als {operator.email}</p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap gap-2" aria-label="Periode kiezen">
              {(['7', '30', '90'] as const).map((days) => (
                <Link
                  key={days}
                  href={`/intern/operations/gifting/products?range=${days}`}
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
          Periode: <strong className="text-amber-100">{label}</strong>. Saves en clicks zijn eventtotalen, geen unieke personen en geen persoonsgebonden saved→clicked-conversie. Actieve reserveringen zijn bewust een actuele stand en niet periodegebonden.
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Product KPI's">
          <StatCard label="Winkelnu-product opgeslagen" value={formatNumber(overview.nativeProductSaves)} detail="Native catalogusproducten die aan een verlanglijst zijn toegevoegd." />
          <StatCard label="Externe productlinks" value={formatNumber(overview.externalLinkWishes)} detail="Wensen met een handmatig toegevoegde externe productlink." />
          <StatCard label="Eigen tekstwensen" value={formatNumber(overview.textWishes)} detail="Vrije wensen zonder gekoppeld Winkelnu-product." />
          <StatCard label="Affiliate clicks vanuit gifting" value={formatNumber(overview.giftingAffiliateClicks)} detail="Alleen clicks op de gifting-aanbieding CTA via de bestaande /uit-route." />
          <StatCard label="Actieve reserveringen" value={formatNumber(overview.activeReservations)} detail="Huidige gereserveerde Winkelnu-wensen; dit is geen historische periodetelling." />
          <StatCard label="Gem. bekende save-prijs" value={formatMoneyCents(overview.averageNativePriceCents)} detail="Gemiddelde prijs-snapshot bij toevoegen, alleen waar een gecontroleerde prijs bekend was." />
        </section>

        <section className="mt-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70" aria-labelledby="product-ranking-title">
          <div className="border-b border-slate-800 p-5 sm:flex sm:items-end sm:justify-between sm:gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-400">Productranking</p>
              <h2 id="product-ranking-title" className="mt-1 text-xl font-bold text-white">Meest opgeslagen en aangeklikte producten</h2>
            </div>
            <p className="mt-2 text-xs text-slate-500 sm:mt-0">Maximaal 50 producten · geen aanbevelingsscore</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
              <thead className="bg-slate-950/45 text-[11px] uppercase tracking-wider text-slate-500">
                <tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Categorie</th><th className="px-5 py-3 text-right">Opgeslagen</th><th className="px-5 py-3 text-right">Clicks</th><th className="px-5 py-3 text-right">Actief gereserveerd</th><th className="px-5 py-3 text-right">Gem. save-prijs</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {snapshot.rankings.map((row) => (
                  <tr key={row.productExternalKey}>
                    <td className="px-5 py-3"><Link href={`/product/${encodeURIComponent(row.productSlug)}`} className="font-semibold text-slate-200 hover:text-violet-200">{row.productTitle}</Link></td>
                    <td className="px-5 py-3 text-slate-500">{row.categoryName ?? '—'}</td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums text-white">{formatNumber(row.savedCount)}</td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums text-white">{formatNumber(row.giftingClickCount)}</td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums text-white">{formatNumber(row.activeReservationCount)}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-slate-300">{formatMoneyCents(row.averageSavedPriceCents)}</td>
                  </tr>
                ))}
                {snapshot.rankings.length === 0 ? <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-500">Nog geen productactiviteit in deze periode.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="border-b border-slate-800 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-400">Per gelegenheid</p>
              <h2 className="mt-1 text-xl font-bold text-white">Waarvoor worden wensen opgeslagen?</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                <thead className="bg-slate-950/45 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Gelegenheid</th><th className="px-5 py-3 text-right">Alle wensen</th><th className="px-5 py-3 text-right">Winkelnu-producten</th></tr></thead>
                <tbody className="divide-y divide-slate-800/80">
                  {snapshot.byOccasion.map((row) => (
                    <tr key={row.occasion}><td className="px-5 py-3 font-semibold text-slate-300">{occasionLabels[row.occasion] ?? row.occasion}</td><td className="px-5 py-3 text-right font-bold tabular-nums text-white">{formatNumber(row.itemsAdded)}</td><td className="px-5 py-3 text-right font-bold tabular-nums text-white">{formatNumber(row.nativeProductSaves)}</td></tr>
                  ))}
                  {snapshot.byOccasion.length === 0 ? <tr><td colSpan={3} className="px-5 py-10 text-center text-slate-500">Nog geen gelegenheid-data in deze periode.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-400">Interpretatie</p>
            <h2 className="mt-1 text-xl font-bold text-white">Commercieel signaal zonder persoonsprofilering</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-400">
              <p>GI4 gebruikt voor affiliate clicks uitsluitend de bestaande <code className="rounded bg-slate-950 px-1.5 py-0.5 text-xs text-slate-300">affiliate_click_events</code>-registratie. Er is dus geen tweede clicktracker.</p>
              <p>De gifting-CTA geeft alleen de vaste bron <code className="rounded bg-slate-950 px-1.5 py-0.5 text-xs text-slate-300">/lootje-lijstje</code> mee. Groepscodes, sharecodes, namen en andere privégegevens gaan niet mee in de attributie.</p>
              <p>Omdat Winkelnu geen bezoeker-ID aan saves koppelt, tonen we bewust geen claims als “32% van de opslaanders klikte door”. Wel kun je productinteresse en outbound clickvolume naast elkaar beoordelen.</p>
              <p className="font-semibold text-slate-300">Totaal opgeslagen wensen in deze periode: {formatNumber(totalWishes)}.</p>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

import Link from 'next/link'

import type { OperatorRole } from '@/application/auth/operator-authorization'
import type {
  SearchLearningInsights,
  SearchLearningQuerySummary,
} from '@/application/search/search-learning-insights'

const roleLabel: Record<OperatorRole, string> = {
  owner: 'Owner',
  operator: 'Operator',
  read_only: 'Read-only',
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'percent', maximumFractionDigits: 1 }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('nl-NL').format(value)
}

function formatDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Onbekend' : date.toLocaleString('nl-NL')
}

function usefulClicks(row: SearchLearningQuerySummary): number {
  return row.predictiveClicks + row.bestMatchClicks + row.productClicks
}

function EmptyPanel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm leading-6 text-slate-400">{children}</div>
}

function Metric({ label, value, detail, emphasize = false }: {
  label: string
  value: string | number
  detail?: string
  emphasize?: boolean
}) {
  return (
    <div className={`rounded-2xl border p-5 ${emphasize ? 'border-cyan-900/70 bg-cyan-950/25' : 'border-slate-800 bg-slate-900/70'}`}>
      <div className="text-2xl font-semibold tabular-nums text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">{label}</div>
      {detail ? <div className="mt-2 text-xs leading-5 text-slate-500">{detail}</div> : null}
    </div>
  )
}

function QueryTable({ rows, mode }: {
  rows: SearchLearningQuerySummary[]
  mode: 'opportunity' | 'zero' | 'success' | 'recent'
}) {
  if (rows.length === 0) {
    return <EmptyPanel>Nog geen zoekdata voor deze weergave.</EmptyPanel>
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-950/55 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Zoekvraag</th>
              <th className="px-4 py-3 text-right font-semibold">Zoeken</th>
              <th className="px-4 py-3 text-right font-semibold">0 resultaat</th>
              <th className="px-4 py-3 text-right font-semibold">Kliks</th>
              <th className="px-4 py-3 text-right font-semibold">Herzocht</th>
              <th className="px-4 py-3 text-right font-semibold">Score</th>
              <th className="px-4 py-3 font-semibold">Laatst gezien</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {rows.map((row) => (
              <tr key={`${mode}:${row.query}`} className="align-top hover:bg-slate-800/25">
                <td className="max-w-md px-4 py-3 font-medium text-slate-100">{row.query}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-300">{formatNumber(row.searches)}</td>
                <td className={`px-4 py-3 text-right tabular-nums ${row.zeroResultSearches > 0 ? 'text-amber-300' : 'text-slate-500'}`}>{formatNumber(row.zeroResultSearches)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-emerald-300">{formatNumber(usefulClicks(row))}</td>
                <td className={`px-4 py-3 text-right tabular-nums ${row.refinements > 0 ? 'text-sky-300' : 'text-slate-500'}`}>{formatNumber(row.refinements)}</td>
                <td className={`px-4 py-3 text-right font-semibold tabular-nums ${row.opportunityScore > 0 ? 'text-cyan-300' : 'text-slate-500'}`}>{formatNumber(row.opportunityScore)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{formatDate(row.lastSeenAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function SearchLearningInsightsDashboard({
  insights,
  operatorEmail,
  operatorRole,
  filterQuery,
  signOutAction,
}: {
  insights: SearchLearningInsights
  operatorEmail: string
  operatorRole: OperatorRole
  filterQuery?: string
  signOutAction: () => Promise<void>
}) {
  const { totals } = insights

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <header className="border-b border-slate-800 pb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Winkelnu internal operations</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Search learning</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Geaggregeerde 90-dageninzichten uit Zoekkompas. Dit scherm helpt bepalen waar taxonomy, aliases, content, productfeeds of rankingtests verbeterd moeten worden; het verandert rankings nooit automatisch.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 text-xs text-slate-500 lg:items-end">
              <span>Snapshot: {new Date(insights.generatedAt).toLocaleString('nl-NL')}</span>
              <span>Ingelogd als {operatorEmail}</span>
              <span className="rounded-full border border-slate-700 px-2.5 py-1 font-semibold text-slate-300">Rol: {roleLabel[operatorRole]}</span>
              <form action={signOutAction}><button type="submit" className="rounded-lg border border-slate-700 px-3 py-2 font-semibold text-slate-300 hover:border-slate-500">Uitloggen</button></form>
            </div>
          </div>

          <nav className="mt-6 flex flex-wrap gap-2 text-sm font-semibold" aria-label="Interne operations navigatie">
            <Link href="/intern/operations" className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:border-slate-500 hover:text-white">Partner operations</Link>
            <Link href="/intern/operations/search" aria-current="page" className="rounded-lg border border-cyan-800 bg-cyan-950/35 px-3 py-2 text-cyan-200">Search learning</Link>
          </nav>
        </header>

        <section className="grid gap-3 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Metric label="Unieke zoekvragen" value={formatNumber(totals.uniqueQueries)} detail="in de rolling 90-dagenwindow" />
          <Metric label="Zoekopdrachten" value={formatNumber(totals.searches)} />
          <Metric label="0-resultaatratio" value={formatPercent(totals.zeroResultRate)} detail={`${formatNumber(totals.zeroResultSearches)} zoekopdrachten`} emphasize={totals.zeroResultSearches > 0} />
          <Metric label="Nuttige kliks" value={formatNumber(totals.usefulClicks)} detail={`${formatNumber(totals.productClicks)} product · ${formatNumber(totals.bestMatchClicks)} beste match`} />
          <Metric label="Herformuleringen" value={formatNumber(totals.refinements)} detail="bezoeker zocht opnieuw met andere woorden" emphasize={totals.refinements > 0} />
          <Metric label="Live suggestiekliks" value={formatNumber(totals.predictiveClicks)} />
        </section>

        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Zoek in learning data</h2>
              <p className="mt-1 text-sm text-slate-500">Filter de geaggregeerde queryregels op tekst. Er worden geen bezoekers of sessies gevolgd.</p>
            </div>
            <form method="get" className="flex w-full max-w-xl gap-2">
              <input name="q" defaultValue={filterQuery ?? ''} placeholder="bijv. laptop, cadeau, koffer…" className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600" />
              <button className="rounded-lg border border-cyan-800 px-4 py-2 text-sm font-semibold text-cyan-200">Filter</button>
              {filterQuery ? <Link href="/intern/operations/search" className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300">Wissen</Link> : null}
            </form>
          </div>
        </section>

        {totals.uniqueQueries === 0 ? (
          <EmptyPanel>
            Nog geen search-learningdata beschikbaar. De opslaglaag staat klaar; zodra M0.48 op de website actief is en bezoekers Zoekkompas gebruiken, vult dit scherm zichzelf automatisch met geaggregeerde signalen.
          </EmptyPanel>
        ) : (
          <div className="space-y-10">
            <section>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div><h2 className="text-lg font-semibold">Verbeterprioriteit</h2><p className="mt-1 text-sm text-slate-500">Hoogste opportunity-score eerst. Dit is een werklijst, geen automatische rankingregel.</p></div>
                <span className="text-xs text-slate-600">score = 0-resultaten × 6 + herzoekacties × 3 + zoekopdrachten − nuttige kliks</span>
              </div>
              <QueryTable rows={insights.opportunities} mode="opportunity" />
            </section>

            <div className="grid gap-8 xl:grid-cols-2">
              <section>
                <div className="mb-4"><h2 className="text-lg font-semibold">0-resultaatvragen</h2><p className="mt-1 text-sm text-slate-500">Waar Winkelnu inhoud, feeddata, aliases of taxonomy mist.</p></div>
                <QueryTable rows={insights.zeroResultQueries} mode="zero" />
              </section>
              <section>
                <div className="mb-4"><h2 className="text-lg font-semibold">Sterke zoekroutes</h2><p className="mt-1 text-sm text-slate-500">Queries waarop bezoekers daadwerkelijk een suggestie, beste match of product openen.</p></div>
                <QueryTable rows={insights.successfulQueries} mode="success" />
              </section>
            </div>

            <section>
              <div className="mb-4"><h2 className="text-lg font-semibold">Recent gezien</h2><p className="mt-1 text-sm text-slate-500">Laatste zoekvragen binnen de rolling 90-dagenwindow.</p></div>
              <QueryTable rows={insights.recentQueries} mode="recent" />
            </section>
          </div>
        )}
      </div>
    </main>
  )
}

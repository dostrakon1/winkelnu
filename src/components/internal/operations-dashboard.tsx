import type { RecoveryActionState } from '@/app/intern/operations/recovery-actions'
import type { OperationsDashboard, OperationsIncidentSeverity } from '@/application/affiliate/operations-dashboard'
import { operatorCan, type OperatorRole } from '@/application/auth/operator-authorization'
import type { OperatorActionHistoryItem } from '@/application/operations/operator-action-history'
import { RecoveryActionForm } from '@/components/internal/recovery-action-form'

const severityLabel: Record<OperationsIncidentSeverity, string> = {
  critical: 'Kritiek',
  high: 'Hoog',
  medium: 'Middel',
  low: 'Laag',
}

const severityClass: Record<OperationsIncidentSeverity, string> = {
  critical: 'border-red-200 bg-red-50 text-red-800',
  high: 'border-orange-200 bg-orange-50 text-orange-800',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  low: 'border-slate-200 bg-slate-50 text-slate-700',
}

const roleLabel: Record<OperatorRole, string> = {
  owner: 'Owner',
  operator: 'Operator',
  read_only: 'Read-only',
}

const actionLabel: Record<string, string> = {
  'feed.retry': 'Retry feed',
  'feed.pause': 'Pauzeer feed',
  'feed.resume': 'Hervat feed',
}

type RecoveryAction = (previous: RecoveryActionState, formData: FormData) => Promise<RecoveryActionState>

export function InternalOperationsDashboard({
  dashboard,
  actionHistory,
  operatorEmail,
  operatorRole,
  signOutAction,
  retryFeedAction,
  pauseFeedAction,
  resumeFeedAction,
}: {
  dashboard: OperationsDashboard
  actionHistory: OperatorActionHistoryItem[]
  operatorEmail: string
  operatorRole: OperatorRole
  signOutAction: () => Promise<void>
  retryFeedAction: RecoveryAction
  pauseFeedAction: RecoveryAction
  resumeFeedAction: RecoveryAction
}) {
  const canRetry = operatorCan(operatorRole, 'retry_feed')
  const canPause = operatorCan(operatorRole, 'pause_feed')
  const canResume = operatorCan(operatorRole, 'resume_feed')

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Winkelnu internal operations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Partner operations</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Incidenten, veilige recovery en recente menselijke operatorhistorie in één operationeel overzicht.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 text-xs text-slate-500 sm:items-end">
            <span>Snapshot: {new Date(dashboard.generatedAt).toLocaleString('nl-NL')}</span>
            <span>Ingelogd als {operatorEmail}</span>
            <span className="rounded-full border border-slate-700 px-2.5 py-1 font-semibold text-slate-300">Rol: {roleLabel[operatorRole]}</span>
            <form action={signOutAction}>
              <button type="submit" className="rounded-lg border border-slate-700 px-3 py-2 font-semibold text-slate-300 hover:border-slate-500 hover:text-white">
                Uitloggen
              </button>
            </form>
          </div>
        </header>

        <section className="grid gap-3 py-8 sm:grid-cols-2 lg:grid-cols-5" aria-label="Operations samenvatting">
          <Metric label="Integraties" value={dashboard.totals.integrations} />
          <Metric label="Actief" value={dashboard.totals.activeIntegrations} />
          <Metric label="Feeds" value={dashboard.totals.feeds} />
          <Metric label="Incidenten" value={dashboard.totals.incidents} />
          <Metric label="Kritiek + hoog" value={dashboard.totals.critical + dashboard.totals.high} emphasize />
        </section>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Aandachtspunten</h2>
              <p className="mt-1 text-sm text-slate-500">Gesorteerd op operationele urgentie. Dubbele recovery-submits worden server-side onderdrukt.</p>
            </div>

            {dashboard.incidents.length === 0 ? (
              <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/30 p-6 text-sm text-emerald-200">
                Geen operationele incidenten in deze snapshot.
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.incidents.map((incident) => (
                  <article key={incident.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${severityClass[incident.severity]}`}>
                            {severityLabel[incident.severity]}
                          </span>
                          <span className="text-xs text-slate-500">{incident.kind}</span>
                          {incident.sourceKey ? <span className="text-xs text-slate-500">Feed: {incident.sourceKey}</span> : null}
                        </div>
                        <h3 className="mt-3 text-base font-semibold text-white">{incident.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{incident.detail}</p>
                        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                          <div><dt className="inline">Merchant: </dt><dd className="inline text-slate-300">{incident.merchantName}</dd></div>
                          <div><dt className="inline">Integration: </dt><dd className="inline text-slate-300">{incident.integrationId}</dd></div>
                        </dl>
                      </div>
                      <div className="w-full shrink-0 rounded-xl border border-slate-800 bg-slate-950/60 p-4 lg:w-80">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Eerstvolgende actie</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{incident.operatorAction}</p>
                        {incident.sourceKey ? (
                          <div className="mt-4 flex flex-wrap gap-3">
                            {incident.kind === 'feed_paused' && canResume ? (
                              <RecoveryActionForm action={resumeFeedAction} merchantId={incident.merchantId} sourceKey={incident.sourceKey} requestKey={`${dashboard.generatedAt}:${incident.id}:resume`} label="Hervatten" />
                            ) : null}
                            {incident.kind !== 'feed_paused' && canRetry ? (
                              <RecoveryActionForm action={retryFeedAction} merchantId={incident.merchantId} sourceKey={incident.sourceKey} requestKey={`${dashboard.generatedAt}:${incident.id}:retry`} label="Retry nu" />
                            ) : null}
                            {incident.kind !== 'feed_paused' && canPause ? (
                              <RecoveryActionForm action={pauseFeedAction} merchantId={incident.merchantId} sourceKey={incident.sourceKey} requestKey={`${dashboard.generatedAt}:${incident.id}:pause`} label="Pauzeren" subtle confirmMessage={`Weet je zeker dat je feed ${incident.sourceKey} wilt pauzeren? Automatische imports stoppen totdat je de feed hervat.`} />
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section aria-label="Recente operatoracties">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Recente acties</h2>
              <p className="mt-1 text-sm text-slate-500">Laatste menselijke recovery-outcomes, nieuwste eerst.</p>
            </div>
            {actionHistory.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-400">Nog geen voltooide operatoracties.</div>
            ) : (
              <div className="space-y-3">
                {actionHistory.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{actionLabel[item.action] ?? item.action}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.actorEmail} · {roleLabel[item.actorRole]}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${item.outcome === 'succeeded' ? 'border-emerald-900 bg-emerald-950/40 text-emerald-300' : 'border-red-900 bg-red-950/40 text-red-300'}`}>
                        {item.outcome === 'succeeded' ? 'Geslaagd' : 'Mislukt'}
                      </span>
                    </div>
                    <dl className="mt-3 space-y-1 text-xs text-slate-500">
                      {item.merchantId ? <div><dt className="inline">Merchant: </dt><dd className="inline text-slate-300">{item.merchantId}</dd></div> : null}
                      {item.sourceKey ? <div><dt className="inline">Feed: </dt><dd className="inline text-slate-300">{item.sourceKey}</dd></div> : null}
                      <div><dt className="inline">Tijd: </dt><dd className="inline text-slate-300">{new Date(item.occurredAt).toLocaleString('nl-NL')}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function Metric({ label, value, emphasize = false }: { label: string; value: number; emphasize?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${emphasize ? 'border-orange-900/70 bg-orange-950/30' : 'border-slate-800 bg-slate-900/70'}`}>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  )
}

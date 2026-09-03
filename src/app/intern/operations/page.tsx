import type { Metadata } from 'next'

import { signOutOperator } from '@/app/intern/login/actions'
import { pauseFeed, resumeFeed, retryFeed } from '@/app/intern/operations/recovery-actions'
import { buildOperationsDashboard } from '@/application/affiliate/operations-dashboard'
import { PartnerOperationsReadService } from '@/application/affiliate/partner-operations-read-model'
import { filterOperatorActionHistory, type OperatorActionHistoryFilters } from '@/application/operations/operator-action-context'
import { OperatorActionHistoryService, type OperatorActionOutcome } from '@/application/operations/operator-action-history'
import { buildFeedOperationalTimelines } from '@/application/operations/feed-operational-timeline'
import { ImportRunEvidenceService } from '@/application/operations/import-run-evidence'
import { InternalOperationsDashboard } from '@/components/internal/operations-dashboard'
import { SupabasePartnerOperationsReadRepository } from '@/infrastructure/affiliate/supabase-partner-operations-read-repository'
import { SupabaseOperatorActionHistoryRepository } from '@/infrastructure/operations/supabase-operator-action-history-repository'
import { SupabaseImportRunEvidenceRepository } from '@/infrastructure/operations/supabase-import-run-evidence-repository'
import { requireOperatorSession } from '@/infrastructure/operations/operator-session'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Internal Operations',
  robots: { index: false, follow: false, nocache: true },
}

type SearchParams = Record<string, string | string[] | undefined>

function readString(params: SearchParams, key: string): string | undefined {
  const value = params[key]
  const text = Array.isArray(value) ? value[0] : value
  const normalized = text?.trim()
  return normalized ? normalized.slice(0, 120) : undefined
}

function readFilters(params: SearchParams): OperatorActionHistoryFilters {
  const outcome = readString(params, 'outcome')
  return {
    actor: readString(params, 'actor'),
    action: readString(params, 'action'),
    outcome: outcome === 'succeeded' || outcome === 'failed' ? outcome as OperatorActionOutcome : undefined,
    merchantId: readString(params, 'merchant'),
    sourceKey: readString(params, 'feed'),
  }
}

export default async function InternalOperationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const operator = await requireOperatorSession()
  if (process.env.CATALOG_PERSISTENCE !== 'supabase') throw new Error('Internal operations requires CATALOG_PERSISTENCE=supabase.')

  const filters = readFilters(await searchParams)
  const operationsService = new PartnerOperationsReadService(new SupabasePartnerOperationsReadRepository())
  const historyService = new OperatorActionHistoryService(new SupabaseOperatorActionHistoryRepository())
  const importRunService = new ImportRunEvidenceService(new SupabaseImportRunEvidenceRepository())
  const [model, fullActionHistory, importRuns] = await Promise.all([
    operationsService.read(),
    historyService.listRecent(50),
    importRunService.listRecent(100),
  ])
  const dashboard = buildOperationsDashboard(model)
  const actionHistory = filterOperatorActionHistory(fullActionHistory, filters)
  const feedTimelines = buildFeedOperationalTimelines(model, fullActionHistory, importRuns)

  return (
    <InternalOperationsDashboard
      dashboard={dashboard}
      actionHistory={actionHistory}
      fullActionHistory={fullActionHistory}
      feedTimelines={feedTimelines}
      historyFilters={filters}
      operatorEmail={operator.email}
      operatorRole={operator.role}
      signOutAction={signOutOperator}
      retryFeedAction={retryFeed}
      pauseFeedAction={pauseFeed}
      resumeFeedAction={resumeFeed}
    />
  )
}

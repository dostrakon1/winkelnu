import type { Metadata } from 'next'

import { signOutOperator } from '@/app/intern/login/actions'
import { pauseFeed, resumeFeed, retryFeed } from '@/app/intern/operations/recovery-actions'
import { buildOperationsDashboard } from '@/application/affiliate/operations-dashboard'
import { PartnerOperationsReadService } from '@/application/affiliate/partner-operations-read-model'
import { OperatorActionHistoryService } from '@/application/operations/operator-action-history'
import { InternalOperationsDashboard } from '@/components/internal/operations-dashboard'
import { SupabasePartnerOperationsReadRepository } from '@/infrastructure/affiliate/supabase-partner-operations-read-repository'
import { SupabaseOperatorActionHistoryRepository } from '@/infrastructure/operations/supabase-operator-action-history-repository'
import { requireOperatorSession } from '@/infrastructure/operations/operator-session'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Internal Operations',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default async function InternalOperationsPage() {
  const operator = await requireOperatorSession()

  if (process.env.CATALOG_PERSISTENCE !== 'supabase') {
    throw new Error('Internal operations requires CATALOG_PERSISTENCE=supabase.')
  }

  const operationsService = new PartnerOperationsReadService(new SupabasePartnerOperationsReadRepository())
  const historyService = new OperatorActionHistoryService(new SupabaseOperatorActionHistoryRepository())
  const [model, actionHistory] = await Promise.all([
    operationsService.read(),
    historyService.listRecent(20),
  ])
  const dashboard = buildOperationsDashboard(model)

  return (
    <InternalOperationsDashboard
      dashboard={dashboard}
      actionHistory={actionHistory}
      operatorEmail={operator.email}
      operatorRole={operator.role}
      signOutAction={signOutOperator}
      retryFeedAction={retryFeed}
      pauseFeedAction={pauseFeed}
      resumeFeedAction={resumeFeed}
    />
  )
}

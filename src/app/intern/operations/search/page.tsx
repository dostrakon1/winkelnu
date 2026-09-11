import type { Metadata } from 'next'

import { signOutOperator } from '@/app/intern/login/actions'
import { SearchLearningInsightsService } from '@/application/search/search-learning-insights'
import { SearchLearningInsightsDashboard } from '@/components/internal/search-learning-insights-dashboard'
import { SupabaseSearchLearningInsightsRepository } from '@/infrastructure/search/supabase-search-learning-insights-repository'
import { requireOperatorSession } from '@/infrastructure/operations/operator-session'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Internal Search Learning',
  robots: { index: false, follow: false, nocache: true },
}

type SearchParams = Record<string, string | string[] | undefined>

function readQuery(params: SearchParams): string | undefined {
  const value = params.q
  const text = Array.isArray(value) ? value[0] : value
  const normalized = text?.trim()
  return normalized ? normalized.slice(0, 120) : undefined
}

export default async function InternalSearchLearningPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const operator = await requireOperatorSession()
  if (process.env.CATALOG_PERSISTENCE !== 'supabase') {
    throw new Error('Internal search learning requires CATALOG_PERSISTENCE=supabase.')
  }

  const filterQuery = readQuery(await searchParams)
  const service = new SearchLearningInsightsService(new SupabaseSearchLearningInsightsRepository())
  const insights = await service.read(filterQuery)

  return (
    <SearchLearningInsightsDashboard
      insights={insights}
      operatorEmail={operator.email}
      operatorRole={operator.role}
      filterQuery={filterQuery}
      signOutAction={signOutOperator}
    />
  )
}

import 'server-only'

import type {
  SearchLearningInsightsRepository,
  SearchLearningQuerySummary,
} from '@/application/search/search-learning-insights'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

type SummaryRow = {
  query_normalized: string
  searches: number | string
  zero_result_searches: number | string
  predictive_clicks: number | string
  best_match_clicks: number | string
  product_clicks: number | string
  refinements: number | string
  last_seen_at: string
  opportunity_score: number | string
}

const PAGE_SIZE = 1000

function number(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function mapRow(row: SummaryRow): SearchLearningQuerySummary {
  return {
    query: row.query_normalized,
    searches: number(row.searches),
    zeroResultSearches: number(row.zero_result_searches),
    predictiveClicks: number(row.predictive_clicks),
    bestMatchClicks: number(row.best_match_clicks),
    productClicks: number(row.product_clicks),
    refinements: number(row.refinements),
    lastSeenAt: row.last_seen_at,
    opportunityScore: number(row.opportunity_score),
  }
}

export class SupabaseSearchLearningInsightsRepository implements SearchLearningInsightsRepository {
  private readonly db = createSupabaseServerClient()

  async listQuerySummaries(): Promise<SearchLearningQuerySummary[]> {
    const rows: SearchLearningQuerySummary[] = []

    for (let offset = 0; ; offset += PAGE_SIZE) {
      const { data, error } = await this.db
        .from('search_feedback_query_summary')
        .select('query_normalized,searches,zero_result_searches,predictive_clicks,best_match_clicks,product_clicks,refinements,last_seen_at,opportunity_score')
        .order('opportunity_score', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1)

      if (error) throw new Error(`Read search learning insights: ${error.message}`)

      const page = (data ?? []) as SummaryRow[]
      rows.push(...page.map(mapRow))
      if (page.length < PAGE_SIZE) break
    }

    return rows
  }
}

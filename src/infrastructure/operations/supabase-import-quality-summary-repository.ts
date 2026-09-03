import 'server-only'

import type { ImportQualitySummary, ImportQualitySummaryRepository } from '@/application/operations/import-quality-summary'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

type ReviewRow = { status: 'pending' | 'approved' | 'rejected'; confidence: 'certain' | 'high' | 'review' | 'none'; created_at: string }
type RunRow = {
  started_at: string
  feed_sources: { source_key: string; merchants: { external_key: string } | { external_key: string }[] | null } | { source_key: string; merchants: { external_key: string } | { external_key: string }[] | null }[] | null
  import_rejects: { id: string; rejected_at: string }[] | null
  product_match_reviews: ReviewRow[] | null
}

function first<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null
}

export class SupabaseImportQualitySummaryRepository implements ImportQualitySummaryRepository {
  private readonly db = createSupabaseServerClient()

  async listRecent(limit: number): Promise<ImportQualitySummary[]> {
    const { data, error } = await this.db
      .from('import_runs')
      .select('started_at, feed_sources(source_key, merchants(external_key)), import_rejects(id,rejected_at), product_match_reviews(status,confidence,created_at)')
      .order('started_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(`Read import quality summary: ${error.message}`)

    const summaries = new Map<string, ImportQualitySummary>()
    for (const row of (data ?? []) as RunRow[]) {
      const feed = first(row.feed_sources)
      const merchant = first(feed?.merchants)
      if (!feed?.source_key || !merchant?.external_key) continue

      const key = `${merchant.external_key}:${feed.source_key}`
      const current = summaries.get(key) ?? {
        merchantId: merchant.external_key,
        sourceKey: feed.source_key,
        runsObserved: 0,
        rejectsObserved: 0,
        reviewsPending: 0,
        reviewsApproved: 0,
        reviewsRejected: 0,
        reviewConfidence: 0,
        noMatchConfidence: 0,
        latestEvidenceAt: undefined,
      }

      current.runsObserved += 1
      current.rejectsObserved += row.import_rejects?.length ?? 0
      for (const review of row.product_match_reviews ?? []) {
        if (review.status === 'pending') current.reviewsPending += 1
        else if (review.status === 'approved') current.reviewsApproved += 1
        else current.reviewsRejected += 1
        if (review.confidence === 'review') current.reviewConfidence += 1
        if (review.confidence === 'none') current.noMatchConfidence += 1
      }

      const evidenceTimes = [row.started_at, ...(row.import_rejects ?? []).map((item) => item.rejected_at), ...(row.product_match_reviews ?? []).map((item) => item.created_at)]
      const latest = evidenceTimes.sort((a, b) => Date.parse(b) - Date.parse(a))[0]
      if (!current.latestEvidenceAt || Date.parse(latest) > Date.parse(current.latestEvidenceAt)) current.latestEvidenceAt = latest
      summaries.set(key, current)
    }

    return [...summaries.values()]
  }
}

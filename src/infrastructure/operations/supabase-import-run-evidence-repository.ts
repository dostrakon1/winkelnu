import 'server-only'

import type { ImportRunEvidence, ImportRunEvidenceRepository, ImportRunEvidenceStatus } from '@/application/operations/import-run-evidence'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

type ImportRunRow = {
  external_key: string | null
  status: ImportRunEvidenceStatus
  started_at: string
  finished_at: string | null
  records_seen: number
  records_accepted: number
  records_rejected: number
  offers_deactivated: number
  review_required: number
  correlation_id: string | null
  feed_sources: { source_key: string; merchants: { external_key: string | null } | { external_key: string | null }[] | null } | { source_key: string; merchants: { external_key: string | null } | { external_key: string | null }[] | null }[] | null
}

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null
}

export class SupabaseImportRunEvidenceRepository implements ImportRunEvidenceRepository {
  private readonly db = createSupabaseServerClient()

  async listRecent(limit: number): Promise<ImportRunEvidence[]> {
    const { data, error } = await this.db
      .from('import_runs')
      .select('external_key,status,started_at,finished_at,records_seen,records_accepted,records_rejected,offers_deactivated,review_required,correlation_id,feed_sources(source_key,merchants(external_key))')
      .order('started_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(`Read import run evidence: ${error.message}`)

    return ((data ?? []) as ImportRunRow[]).flatMap((row) => {
      const feed = firstRelation(row.feed_sources)
      const merchant = firstRelation(feed?.merchants)
      const merchantId = merchant?.external_key ?? undefined
      if (!feed || !merchantId) return []
      return [{
        runId: row.external_key ?? `db:${row.started_at}:${feed.source_key}`,
        merchantId,
        sourceKey: feed.source_key,
        status: row.status,
        startedAt: row.started_at,
        finishedAt: row.finished_at ?? undefined,
        recordsSeen: row.records_seen,
        recordsAccepted: row.records_accepted,
        recordsRejected: row.records_rejected,
        offersDeactivated: row.offers_deactivated,
        reviewRequired: row.review_required,
        correlationId: row.correlation_id ?? undefined,
      }]
    })
  }
}

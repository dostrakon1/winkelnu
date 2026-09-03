import 'server-only'

import type { ImportRun } from '@/domain/catalog/import-observability'
import { SupabaseCatalogRepository } from '@/infrastructure/catalog/supabase-catalog-repository'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

function fail(error: { message: string } | null, context: string): void {
  if (error) throw new Error(`${context}: ${error.message}`)
}

export class SupabaseProductionCatalogRepository extends SupabaseCatalogRepository {
  private readonly productionDb = createSupabaseServerClient()

  override async createImportRun(importRun: ImportRun): Promise<void> {
    const { data: merchant, error: merchantError } = await this.productionDb
      .from('merchants')
      .select('id')
      .eq('external_key', importRun.merchantId)
      .single()
    fail(merchantError, `Resolve merchant ${importRun.merchantId}`)
    if (!merchant) throw new Error(`Resolve merchant ${importRun.merchantId}: expected row.`)

    const { data: source, error: sourceError } = await this.productionDb
      .from('feed_sources')
      .upsert({ merchant_id: merchant.id, source_key: importRun.sourceKey, source_type: 'manual', is_active: true }, { onConflict: 'merchant_id,source_key' })
      .select('id')
      .single()
    fail(sourceError, `Ensure feed source ${importRun.sourceKey}`)
    if (!source) throw new Error(`Ensure feed source ${importRun.sourceKey}: expected row.`)

    const { error } = await this.productionDb.from('import_runs').insert({
      external_key: importRun.id,
      correlation_id: importRun.correlationId ?? null,
      feed_source_id: source.id,
      status: importRun.status,
      started_at: importRun.startedAt,
      finished_at: importRun.finishedAt ?? null,
      records_seen: importRun.recordsSeen,
      records_accepted: importRun.recordsAccepted,
      records_rejected: importRun.recordsRejected,
      offers_deactivated: importRun.offersDeactivated,
      review_required: importRun.reviewRequired,
      error_summary: importRun.errorSummary,
    })
    fail(error, `Create correlated import run ${importRun.id}`)
  }
}

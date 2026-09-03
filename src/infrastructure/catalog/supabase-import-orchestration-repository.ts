import 'server-only'

import type { ImportOrchestrationRepository } from '@/application/catalog/import-orchestration-ports'
import type { FeedImportLease, FeedImportOrchestrationState } from '@/domain/catalog/import-orchestration'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

function fail(error: { message: string } | null, context: string): void {
  if (error) throw new Error(`${context}: ${error.message}`)
}

export class SupabaseImportOrchestrationRepository implements ImportOrchestrationRepository {
  private readonly db = createSupabaseServerClient()

  private async feedSourceUuid(merchantId: string, sourceKey: string): Promise<string | null> {
    const { data: merchant, error: merchantError } = await this.db.from('merchants').select('id').eq('external_key', merchantId).maybeSingle()
    fail(merchantError, `Resolve merchant ${merchantId}`)
    if (!merchant) return null
    const { data: source, error: sourceError } = await this.db.from('feed_sources').select('id').eq('merchant_id', merchant.id).eq('source_key', sourceKey).maybeSingle()
    fail(sourceError, `Resolve feed source ${sourceKey}`)
    return source?.id ?? null
  }

  async getState(input: { merchantId: string; sourceKey: string }): Promise<FeedImportOrchestrationState | null> {
    const feedSourceId = await this.feedSourceUuid(input.merchantId, input.sourceKey)
    if (!feedSourceId) return null
    const { data, error } = await this.db.from('feed_import_orchestration').select('*').eq('feed_source_id', feedSourceId).maybeSingle()
    fail(error, `Get import orchestration state ${input.sourceKey}`)
    if (!data) return null
    return { merchantId: input.merchantId, sourceKey: input.sourceKey, nextRunAt: data.next_run_at ?? undefined, failureCount: data.failure_count, lastError: data.last_error ?? undefined, lastStartedAt: data.last_started_at ?? undefined, lastSucceededAt: data.last_succeeded_at ?? undefined, leaseOwner: data.lease_owner ?? undefined, leaseToken: data.lease_token ?? undefined, leaseExpiresAt: data.lease_expires_at ?? undefined }
  }

  async acquireLease(input: { merchantId: string; sourceKey: string; owner: string; token: string; acquiredAt: string; expiresAt: string }): Promise<FeedImportLease | null> {
    const { data, error } = await this.db.rpc('try_acquire_feed_import_lease', { p_merchant_external_key: input.merchantId, p_source_key: input.sourceKey, p_owner: input.owner, p_token: input.token, p_acquired_at: input.acquiredAt, p_expires_at: input.expiresAt })
    fail(error, `Acquire import lease ${input.sourceKey}`)
    const row = Array.isArray(data) ? data[0] : data
    if (!row) return null
    return { merchantId: row.merchant_external_key, sourceKey: row.source_key, nextRunAt: row.next_run_at ?? undefined, failureCount: row.failure_count, lastError: row.last_error ?? undefined, lastStartedAt: row.last_started_at ?? undefined, lastSucceededAt: row.last_succeeded_at ?? undefined, leaseOwner: row.lease_owner, leaseToken: row.lease_token, leaseExpiresAt: row.lease_expires_at }
  }

  async renewLease(input: { merchantId: string; sourceKey: string; token: string; renewedAt: string; expiresAt: string }): Promise<void> {
    const { data, error } = await this.db.rpc('renew_feed_import_lease', { p_merchant_external_key: input.merchantId, p_source_key: input.sourceKey, p_token: input.token, p_renewed_at: input.renewedAt, p_expires_at: input.expiresAt })
    fail(error, `Renew import lease ${input.sourceKey}`)
    if (data !== true) throw new Error(`Renew import lease ${input.sourceKey}: lease is expired or no longer owned.`)
  }

  async completeSuccess(input: { merchantId: string; sourceKey: string; token: string; finishedAt: string; nextRunAt: string }): Promise<void> {
    const { data, error } = await this.db.rpc('complete_feed_import_success', { p_merchant_external_key: input.merchantId, p_source_key: input.sourceKey, p_token: input.token, p_finished_at: input.finishedAt, p_next_run_at: input.nextRunAt })
    fail(error, `Complete import success ${input.sourceKey}`)
    if (data !== true) throw new Error(`Complete import success ${input.sourceKey}: lease token no longer owns source.`)
  }

  async completeFailure(input: { merchantId: string; sourceKey: string; token: string; finishedAt: string; nextRunAt: string; error: string }): Promise<void> {
    const { data, error } = await this.db.rpc('complete_feed_import_failure', { p_merchant_external_key: input.merchantId, p_source_key: input.sourceKey, p_token: input.token, p_finished_at: input.finishedAt, p_next_run_at: input.nextRunAt, p_error: input.error })
    fail(error, `Complete import failure ${input.sourceKey}`)
    if (data !== true) throw new Error(`Complete import failure ${input.sourceKey}: lease token no longer owns source.`)
  }
}

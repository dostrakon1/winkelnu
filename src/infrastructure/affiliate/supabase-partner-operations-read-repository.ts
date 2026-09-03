import 'server-only'

import type {
  PartnerOperationsIntegration,
  PartnerOperationsReadModel,
  PartnerOperationsReadRepository,
} from '@/application/affiliate/partner-operations-read-model'
import { classifyFeedHealth } from '@/domain/catalog/import-worker'
import type { FeedImportOrchestrationState } from '@/domain/catalog/import-orchestration'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

function fail(error: { message: string } | null, context: string): void {
  if (error) throw new Error(`${context}: ${error.message}`)
}

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

export class SupabasePartnerOperationsReadRepository implements PartnerOperationsReadRepository {
  private readonly db = createSupabaseServerClient()

  async readPartnerOperations(now: string): Promise<PartnerOperationsReadModel> {
    const { data, error } = await this.db
      .from('merchant_affiliate_integrations')
      .select('external_key, kind, status, program_identifier, secret_ref, merchants(external_key,name), affiliate_networks(name), feed_sources(source_key,source_type,is_active,feed_import_orchestration(*))')
      .order('created_at')
    fail(error, 'Read partner operations')

    const integrations = (data ?? []).map((row): PartnerOperationsIntegration => {
      const merchant = firstRelation(row.merchants)
      const network = firstRelation(row.affiliate_networks)
      return {
        integrationId: row.external_key,
        merchantId: merchant?.external_key ?? '',
        merchantName: merchant?.name ?? merchant?.external_key ?? 'Unknown merchant',
        integrationKind: row.kind,
        integrationStatus: row.status,
        networkName: network?.name ?? undefined,
        programIdentifier: row.program_identifier ?? undefined,
        hasSecretReference: Boolean(row.secret_ref),
        feeds: (row.feed_sources ?? []).map((feed) => {
          const state = firstRelation(feed.feed_import_orchestration)
          const orchestration: FeedImportOrchestrationState | undefined = state ? {
            merchantId: merchant?.external_key ?? '',
            sourceKey: feed.source_key,
            nextRunAt: state.next_run_at ?? undefined,
            failureCount: state.failure_count,
            lastError: state.last_error ?? undefined,
            lastStartedAt: state.last_started_at ?? undefined,
            lastSucceededAt: state.last_succeeded_at ?? undefined,
            leaseOwner: state.lease_owner ?? undefined,
            leaseToken: state.lease_token ?? undefined,
            leaseExpiresAt: state.lease_expires_at ?? undefined,
          } : undefined
          const leaseActive = Boolean(orchestration?.leaseExpiresAt && Date.parse(orchestration.leaseExpiresAt) > Date.parse(now))
          return {
            sourceKey: feed.source_key,
            sourceType: feed.source_type,
            isActive: feed.is_active,
            health: orchestration ? classifyFeedHealth(orchestration, now) : undefined,
            orchestration: orchestration ? {
              failureCount: orchestration.failureCount,
              lastStartedAt: orchestration.lastStartedAt,
              lastSucceededAt: orchestration.lastSucceededAt,
              nextRunAt: orchestration.nextRunAt,
              leaseActive,
              leaseExpiresAt: orchestration.leaseExpiresAt,
            } : undefined,
          }
        }),
      }
    })

    return { generatedAt: now, integrations }
  }
}

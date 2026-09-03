import 'server-only'

import type { DueFeedDiscoveryRepository } from '@/application/catalog/import-worker-ports'
import type { DueFeedSource } from '@/domain/catalog/import-worker'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

export class SupabaseDueFeedDiscoveryRepository implements DueFeedDiscoveryRepository {
  private readonly db = createSupabaseServerClient()

  async listDue(input: { now: string; limit: number }): Promise<DueFeedSource[]> {
    const { data, error } = await this.db
      .from('feed_import_orchestration')
      .select('next_run_at, lease_token, lease_expires_at, feed_sources!inner(source_key, is_active, merchants!inner(external_key, is_active))')
      .or(`next_run_at.is.null,next_run_at.lte.${input.now}`)
      .order('next_run_at', { ascending: true, nullsFirst: true })
      .limit(input.limit)

    if (error) throw new Error(`Discover due feed imports: ${error.message}`)

    const due: DueFeedSource[] = []
    for (const row of data ?? []) {
      if (row.lease_token && row.lease_expires_at && Date.parse(row.lease_expires_at) > Date.parse(input.now)) continue
      const source = firstRelation(row.feed_sources)
      const merchant = firstRelation(source?.merchants)
      if (!source?.is_active || !merchant?.is_active) continue
      due.push({ merchantId: merchant.external_key, sourceKey: source.source_key, nextRunAt: row.next_run_at ?? undefined })
    }
    return due
  }
}

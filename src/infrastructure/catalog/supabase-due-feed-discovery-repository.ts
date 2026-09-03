import 'server-only'

import type { DueFeedDiscoveryRepository } from '@/application/catalog/import-worker-ports'
import type { DueFeedSource } from '@/domain/catalog/import-worker'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

export class SupabaseDueFeedDiscoveryRepository implements DueFeedDiscoveryRepository {
  private readonly db = createSupabaseServerClient()

  async listDue(input: { now: string; limit: number }): Promise<DueFeedSource[]> {
    const { data, error } = await this.db.rpc('list_due_feed_imports', {
      p_now: input.now,
      p_limit: input.limit,
    })

    if (error) throw new Error(`Discover due feed imports: ${error.message}`)

    return (data ?? []).map((row) => ({
      merchantId: row.merchant_external_key,
      sourceKey: row.source_key,
      nextRunAt: row.next_run_at ?? undefined,
    }))
  }
}

import 'server-only'

import type { FeedRecoveryRepository, FeedRecoveryTarget } from '@/application/operations/feed-recovery'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

export class SupabaseFeedRecoveryRepository implements FeedRecoveryRepository {
  private readonly db = createSupabaseServerClient()

  async retryNow(target: FeedRecoveryTarget, now: string): Promise<void> {
    const { error } = await this.db.rpc('operator_retry_feed', {
      p_merchant_external_key: target.merchantId,
      p_source_key: target.sourceKey,
      p_now: now,
    })
    if (error) throw new Error(`Retry feed: ${error.message}`)
  }

  async pause(target: FeedRecoveryTarget): Promise<void> {
    const { error } = await this.db.rpc('operator_pause_feed', {
      p_merchant_external_key: target.merchantId,
      p_source_key: target.sourceKey,
    })
    if (error) throw new Error(`Pause feed: ${error.message}`)
  }

  async resume(target: FeedRecoveryTarget, now: string): Promise<void> {
    const { error } = await this.db.rpc('operator_resume_feed', {
      p_merchant_external_key: target.merchantId,
      p_source_key: target.sourceKey,
      p_now: now,
    })
    if (error) throw new Error(`Resume feed: ${error.message}`)
  }
}

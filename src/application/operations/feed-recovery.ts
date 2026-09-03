import type { OperatorRole } from '@/application/auth/operator-authorization'
import { IdempotentOperatorActionService } from '@/application/operations/operator-idempotency'

export type FeedRecoveryActor = {
  id: string
  email: string
  role: OperatorRole
}

export type FeedRecoveryTarget = {
  merchantId: string
  sourceKey: string
}

export interface FeedRecoveryRepository {
  retryNow(target: FeedRecoveryTarget, now: string): Promise<void>
  pause(target: FeedRecoveryTarget): Promise<void>
  resume(target: FeedRecoveryTarget, now: string): Promise<void>
}

export type FeedRecoveryResult = { executed: boolean }

export class FeedRecoveryService {
  constructor(
    private readonly recovery: FeedRecoveryRepository,
    private readonly idempotent: IdempotentOperatorActionService,
    private readonly clock: () => string = () => new Date().toISOString(),
  ) {}

  async retry(actor: FeedRecoveryActor, target: FeedRecoveryTarget, requestKey: string): Promise<FeedRecoveryResult> {
    const result = await this.idempotent.run(requestKey, {
      actor,
      permission: 'retry_feed',
      action: 'feed.retry',
      targetType: 'feed_source',
      targetId: `${target.merchantId}:${target.sourceKey}`,
      metadata: target,
      execute: () => this.recovery.retryNow(target, this.clock()),
    })
    return { executed: result.executed }
  }

  async pause(actor: FeedRecoveryActor, target: FeedRecoveryTarget, requestKey: string): Promise<FeedRecoveryResult> {
    const result = await this.idempotent.run(requestKey, {
      actor,
      permission: 'pause_feed',
      action: 'feed.pause',
      targetType: 'feed_source',
      targetId: `${target.merchantId}:${target.sourceKey}`,
      metadata: target,
      execute: () => this.recovery.pause(target),
    })
    return { executed: result.executed }
  }

  async resume(actor: FeedRecoveryActor, target: FeedRecoveryTarget, requestKey: string): Promise<FeedRecoveryResult> {
    const result = await this.idempotent.run(requestKey, {
      actor,
      permission: 'resume_feed',
      action: 'feed.resume',
      targetType: 'feed_source',
      targetId: `${target.merchantId}:${target.sourceKey}`,
      metadata: target,
      execute: () => this.recovery.resume(target, this.clock()),
    })
    return { executed: result.executed }
  }
}

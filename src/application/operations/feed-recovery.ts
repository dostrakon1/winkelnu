import type { OperatorIdentity } from '@/infrastructure/operations/operator-session'
import { AuditedOperatorActionService } from '@/application/operations/operator-audit'

export type FeedRecoveryTarget = {
  merchantId: string
  sourceKey: string
}

export interface FeedRecoveryRepository {
  retryNow(target: FeedRecoveryTarget, now: string): Promise<void>
  pause(target: FeedRecoveryTarget): Promise<void>
  resume(target: FeedRecoveryTarget, now: string): Promise<void>
}

export class FeedRecoveryService {
  constructor(
    private readonly recovery: FeedRecoveryRepository,
    private readonly audited: AuditedOperatorActionService,
    private readonly clock: () => string = () => new Date().toISOString(),
  ) {}

  retry(actor: OperatorIdentity, target: FeedRecoveryTarget): Promise<void> {
    return this.audited.run({
      actor,
      permission: 'retry_feed',
      action: 'feed.retry',
      targetType: 'feed_source',
      targetId: `${target.merchantId}:${target.sourceKey}`,
      metadata: target,
      execute: () => this.recovery.retryNow(target, this.clock()),
    })
  }

  pause(actor: OperatorIdentity, target: FeedRecoveryTarget): Promise<void> {
    return this.audited.run({
      actor,
      permission: 'pause_feed',
      action: 'feed.pause',
      targetType: 'feed_source',
      targetId: `${target.merchantId}:${target.sourceKey}`,
      metadata: target,
      execute: () => this.recovery.pause(target),
    })
  }

  resume(actor: OperatorIdentity, target: FeedRecoveryTarget): Promise<void> {
    return this.audited.run({
      actor,
      permission: 'resume_feed',
      action: 'feed.resume',
      targetType: 'feed_source',
      targetId: `${target.merchantId}:${target.sourceKey}`,
      metadata: target,
      execute: () => this.recovery.resume(target, this.clock()),
    })
  }
}

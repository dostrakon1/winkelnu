import { describe, expect, it } from 'vitest'

import type { FeedRecoveryRepository, FeedRecoveryTarget } from '@/application/operations/feed-recovery'
import { FeedRecoveryService } from '@/application/operations/feed-recovery'
import type { OperatorAuditEvent, OperatorAuditRepository } from '@/application/operations/operator-audit'
import { AuditedOperatorActionService } from '@/application/operations/operator-audit'

class MemoryAudit implements OperatorAuditRepository {
  events: OperatorAuditEvent[] = []
  async append(event: OperatorAuditEvent) { this.events.push(event) }
}

class MemoryRecovery implements FeedRecoveryRepository {
  calls: string[] = []
  async retryNow(target: FeedRecoveryTarget, now: string) { this.calls.push(`retry:${target.merchantId}:${target.sourceKey}:${now}`) }
  async pause(target: FeedRecoveryTarget) { this.calls.push(`pause:${target.merchantId}:${target.sourceKey}`) }
  async resume(target: FeedRecoveryTarget, now: string) { this.calls.push(`resume:${target.merchantId}:${target.sourceKey}:${now}`) }
}

const target = { merchantId: 'merchant:example', sourceKey: 'feed:main' }
const operator = { id: 'user-1', email: 'ops@example.com', role: 'operator' as const }

describe('FeedRecoveryService', () => {
  it('audits retry before and after the recovery mutation', async () => {
    const audit = new MemoryAudit()
    const recovery = new MemoryRecovery()
    const audited = new AuditedOperatorActionService(audit, () => '2026-09-03T10:00:00.000Z', () => 'corr-1')
    const service = new FeedRecoveryService(recovery, audited, () => '2026-09-03T10:00:00.000Z')

    await service.retry(operator, target)

    expect(recovery.calls).toEqual(['retry:merchant:example:feed:main:2026-09-03T10:00:00.000Z'])
    expect(audit.events.map((event) => event.status)).toEqual(['attempted', 'succeeded'])
    expect(audit.events[0].action).toBe('feed.retry')
  })

  it('supports audited pause and resume for operators', async () => {
    const audit = new MemoryAudit()
    const recovery = new MemoryRecovery()
    const audited = new AuditedOperatorActionService(audit, () => '2026-09-03T10:00:00.000Z', () => 'corr-2')
    const service = new FeedRecoveryService(recovery, audited, () => '2026-09-03T10:00:00.000Z')

    await service.pause(operator, target)
    await service.resume(operator, target)

    expect(recovery.calls).toEqual([
      'pause:merchant:example:feed:main',
      'resume:merchant:example:feed:main:2026-09-03T10:00:00.000Z',
    ])
    expect(audit.events.filter((event) => event.status === 'succeeded')).toHaveLength(2)
  })

  it('denies recovery for read-only operators before any mutation or audit append', async () => {
    const audit = new MemoryAudit()
    const recovery = new MemoryRecovery()
    const audited = new AuditedOperatorActionService(audit)
    const service = new FeedRecoveryService(recovery, audited)

    await expect(service.retry({ ...operator, role: 'read_only' }, target)).rejects.toThrow('not allowed')
    expect(recovery.calls).toEqual([])
    expect(audit.events).toEqual([])
  })
})

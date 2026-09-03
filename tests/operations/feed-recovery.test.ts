import { describe, expect, it } from 'vitest'

import type { FeedRecoveryRepository, FeedRecoveryTarget } from '@/application/operations/feed-recovery'
import { FeedRecoveryService } from '@/application/operations/feed-recovery'
import type { OperatorAuditEvent, OperatorAuditRepository } from '@/application/operations/operator-audit'
import { AuditedOperatorActionService } from '@/application/operations/operator-audit'
import type { OperatorActionIdempotencyRepository, OperatorActionOutcome } from '@/application/operations/operator-idempotency'
import { IdempotentOperatorActionService } from '@/application/operations/operator-idempotency'

class MemoryAudit implements OperatorAuditRepository {
  events: OperatorAuditEvent[] = []
  async append(event: OperatorAuditEvent) { this.events.push(event) }
}

class MemoryRequests implements OperatorActionIdempotencyRepository {
  keys = new Set<string>()
  outcomes = new Map<string, OperatorActionOutcome>()

  async tryClaim(input: { requestKey: string }) {
    if (this.keys.has(input.requestKey)) return false
    this.keys.add(input.requestKey)
    return true
  }

  async complete(requestKey: string, outcome: OperatorActionOutcome) {
    this.outcomes.set(requestKey, outcome)
  }
}

class MemoryRecovery implements FeedRecoveryRepository {
  calls: string[] = []
  async retryNow(target: FeedRecoveryTarget, now: string) { this.calls.push(`retry:${target.merchantId}:${target.sourceKey}:${now}`) }
  async pause(target: FeedRecoveryTarget) { this.calls.push(`pause:${target.merchantId}:${target.sourceKey}`) }
  async resume(target: FeedRecoveryTarget, now: string) { this.calls.push(`resume:${target.merchantId}:${target.sourceKey}:${now}`) }
}

const target = { merchantId: 'merchant:example', sourceKey: 'feed:main' }
const operator = { id: 'user-1', email: 'ops@example.com', role: 'operator' as const }

function setup() {
  const audit = new MemoryAudit()
  const requests = new MemoryRequests()
  const recovery = new MemoryRecovery()
  const audited = new AuditedOperatorActionService(audit, () => '2026-09-03T10:00:00.000Z', () => 'corr-1')
  const idempotent = new IdempotentOperatorActionService(requests, audited)
  const service = new FeedRecoveryService(recovery, idempotent, () => '2026-09-03T10:00:00.000Z')
  return { audit, requests, recovery, service }
}

describe('FeedRecoveryService', () => {
  it('audits retry before and after the recovery mutation', async () => {
    const { audit, recovery, service } = setup()

    const result = await service.retry(operator, target, 'request-1')

    expect(result.executed).toBe(true)
    expect(recovery.calls).toEqual(['retry:merchant:example:feed:main:2026-09-03T10:00:00.000Z'])
    expect(audit.events.map((event) => event.status)).toEqual(['attempted', 'succeeded'])
    expect(audit.events[0].action).toBe('feed.retry')
  })

  it('suppresses a duplicate request before mutation and duplicate audit events', async () => {
    const { audit, recovery, service } = setup()

    const first = await service.retry(operator, target, 'same-request')
    const second = await service.retry(operator, target, 'same-request')

    expect(first.executed).toBe(true)
    expect(second.executed).toBe(false)
    expect(recovery.calls).toHaveLength(1)
    expect(audit.events.map((event) => event.status)).toEqual(['attempted', 'succeeded'])
  })

  it('supports audited pause and resume for operators', async () => {
    const { audit, recovery, service } = setup()

    await service.pause(operator, target, 'pause-request')
    await service.resume(operator, target, 'resume-request')

    expect(recovery.calls).toEqual([
      'pause:merchant:example:feed:main',
      'resume:merchant:example:feed:main:2026-09-03T10:00:00.000Z',
    ])
    expect(audit.events.filter((event) => event.status === 'succeeded')).toHaveLength(2)
  })

  it('denies recovery before claiming idempotency or performing any mutation', async () => {
    const { audit, requests, recovery, service } = setup()

    await expect(service.retry({ ...operator, role: 'read_only' }, target, 'denied-request')).rejects.toThrow('not allowed')
    expect(recovery.calls).toEqual([])
    expect(audit.events).toEqual([])
    expect(requests.keys.size).toBe(0)
    expect(requests.outcomes.size).toBe(0)
  })
})

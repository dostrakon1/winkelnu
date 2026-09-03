import { describe, expect, it } from 'vitest'

import { AuditedOperatorActionService, type OperatorAuditEvent, type OperatorAuditRepository } from '@/application/operations/operator-audit'

describe('AuditedOperatorActionService', () => {
  it('records attempted and succeeded before returning', async () => {
    const events: OperatorAuditEvent[] = []
    const repository: OperatorAuditRepository = { append: async (event) => { events.push(event) } }
    const service = new AuditedOperatorActionService(repository, () => '2026-09-03T10:00:00.000Z', () => 'abc')

    const result = await service.run({
      actor: { id: 'user-1', email: 'owner@example.com', role: 'owner' },
      permission: 'retry_feed',
      action: 'feed.retry',
      targetType: 'feed',
      targetId: 'feed-1',
      execute: async () => 'ok',
    })

    expect(result).toBe('ok')
    expect(events.map((event) => event.status)).toEqual(['attempted', 'succeeded'])
    expect(events[0].correlationId).toBe('operator:abc')
  })

  it('does not execute when the attempted audit event cannot be written', async () => {
    let executed = false
    const repository: OperatorAuditRepository = { append: async () => { throw new Error('audit unavailable') } }
    const service = new AuditedOperatorActionService(repository)

    await expect(service.run({
      actor: { id: 'user-1', email: 'ops@example.com', role: 'operator' },
      permission: 'retry_feed',
      action: 'feed.retry',
      targetType: 'feed',
      execute: async () => { executed = true },
    })).rejects.toThrow('audit unavailable')

    expect(executed).toBe(false)
  })

  it('rejects insufficient roles before auditing or executing', async () => {
    let writes = 0
    let executed = false
    const repository: OperatorAuditRepository = { append: async () => { writes += 1 } }
    const service = new AuditedOperatorActionService(repository)

    await expect(service.run({
      actor: { id: 'user-1', email: 'reader@example.com', role: 'read_only' },
      permission: 'pause_feed',
      action: 'feed.pause',
      targetType: 'feed',
      execute: async () => { executed = true },
    })).rejects.toThrow(/not allowed/)

    expect(writes).toBe(0)
    expect(executed).toBe(false)
  })
})

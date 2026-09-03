import { describe, expect, it } from 'vitest'

import type {
  OperatorActionHistoryItem,
  OperatorActionHistoryRepository,
} from '@/application/operations/operator-action-history'
import { OperatorActionHistoryService } from '@/application/operations/operator-action-history'

class MemoryHistoryRepository implements OperatorActionHistoryRepository {
  lastLimit = 0
  constructor(private readonly items: OperatorActionHistoryItem[]) {}
  async listRecent(limit: number) {
    this.lastLimit = limit
    return this.items.slice(0, limit)
  }
}

const item: OperatorActionHistoryItem = {
  id: 'audit-1',
  actorEmail: 'ops@example.com',
  actorRole: 'operator',
  action: 'feed.retry',
  targetType: 'feed_source',
  targetId: 'merchant:example:feed:main',
  merchantId: 'merchant:example',
  sourceKey: 'feed:main',
  outcome: 'succeeded',
  occurredAt: '2026-09-03T10:00:00.000Z',
}

describe('OperatorActionHistoryService', () => {
  it('returns recent terminal operator actions', async () => {
    const repository = new MemoryHistoryRepository([item])
    const service = new OperatorActionHistoryService(repository)

    await expect(service.listRecent(10)).resolves.toEqual([item])
    expect(repository.lastLimit).toBe(10)
  })

  it('bounds requested history length to a safe range', async () => {
    const repository = new MemoryHistoryRepository([item])
    const service = new OperatorActionHistoryService(repository)

    await service.listRecent(500)
    expect(repository.lastLimit).toBe(50)

    await service.listRecent(0)
    expect(repository.lastLimit).toBe(1)
  })
})

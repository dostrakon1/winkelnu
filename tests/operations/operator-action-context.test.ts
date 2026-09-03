import { describe, expect, it } from 'vitest'

import { filterOperatorActionHistory, relevantActionsForIncident } from '@/application/operations/operator-action-context'
import type { OperatorActionHistoryItem } from '@/application/operations/operator-action-history'

const history: OperatorActionHistoryItem[] = [
  {
    id: '1',
    actorEmail: 'owner@example.com',
    actorRole: 'owner',
    action: 'feed.retry',
    targetType: 'feed_source',
    merchantId: 'merchant:bol',
    sourceKey: 'bol-products',
    outcome: 'succeeded',
    occurredAt: '2026-09-03T10:00:00.000Z',
  },
  {
    id: '2',
    actorEmail: 'ops@example.com',
    actorRole: 'operator',
    action: 'feed.pause',
    targetType: 'feed_source',
    merchantId: 'merchant:bol',
    sourceKey: 'bol-products',
    outcome: 'failed',
    occurredAt: '2026-09-03T09:00:00.000Z',
  },
  {
    id: '3',
    actorEmail: 'ops@example.com',
    actorRole: 'operator',
    action: 'feed.resume',
    targetType: 'feed_source',
    merchantId: 'merchant:daisycon',
    sourceKey: 'daisycon-products',
    outcome: 'succeeded',
    occurredAt: '2026-09-03T08:00:00.000Z',
  },
]

describe('operator action context', () => {
  it('filters history across actor, action, outcome and feed fields', () => {
    expect(filterOperatorActionHistory(history, { actor: 'OWNER', action: 'retry', outcome: 'succeeded', sourceKey: 'bol' })).toEqual([history[0]])
    expect(filterOperatorActionHistory(history, { merchantId: 'daisy' })).toEqual([history[2]])
  })

  it('returns only actions for the exact incident merchant and feed', () => {
    const related = relevantActionsForIncident(history, { merchantId: 'merchant:bol', sourceKey: 'bol-products' }, 3)
    expect(related.map((item) => item.id)).toEqual(['1', '2'])
  })

  it('returns no context for incidents without a feed source', () => {
    expect(relevantActionsForIncident(history, { merchantId: 'merchant:bol' }, 3)).toEqual([])
  })

  it('bounds incident context to ten items', () => {
    const repeated = Array.from({ length: 15 }, (_, index) => ({ ...history[0], id: String(index) }))
    expect(relevantActionsForIncident(repeated, { merchantId: 'merchant:bol', sourceKey: 'bol-products' }, 99)).toHaveLength(10)
  })
})

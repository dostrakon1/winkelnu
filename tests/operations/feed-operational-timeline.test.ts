import { describe, expect, it } from 'vitest'
import { buildFeedOperationalTimelines } from '@/application/operations/feed-operational-timeline'

describe('feed operational timeline', () => {
  it('combines safe orchestration signals and matching operator actions chronologically', () => {
    const timelines = buildFeedOperationalTimelines({
      generatedAt: '2026-09-03T10:00:00Z',
      integrations: [{
        integrationId: 'int-1', merchantId: 'merchant-1', merchantName: 'Merchant 1', integrationKind: 'direct', integrationStatus: 'active', hasSecretReference: true,
        feeds: [{
          sourceKey: 'feed-1', sourceType: 'csv', isActive: true,
          health: { merchantId: 'merchant-1', sourceKey: 'feed-1', status: 'healthy', failureCount: 0, lastSucceededAt: '2026-09-03T09:00:00Z', nextRunAt: '2026-09-03T11:00:00Z' },
          orchestration: { failureCount: 0, lastStartedAt: '2026-09-03T08:55:00Z', lastSucceededAt: '2026-09-03T09:00:00Z', nextRunAt: '2026-09-03T11:00:00Z', leaseActive: false },
        }],
      }],
    }, [{ id: 'a1', actorEmail: 'ops@example.com', actorRole: 'operator', action: 'feed.retry', targetType: 'feed', merchantId: 'merchant-1', sourceKey: 'feed-1', outcome: 'succeeded', occurredAt: '2026-09-03T09:30:00Z' }])

    expect(timelines).toHaveLength(1)
    expect(timelines[0].events.map((event) => event.label)).toEqual(['Volgende import gepland', 'Feed actief', 'Retry aangevraagd', 'Import geslaagd', 'Import gestart'])
    expect(timelines[0].events.find((event) => event.kind === 'operator_action')?.detail).toContain('ops@example.com')
  })

  it('does not correlate actions from another feed', () => {
    const timelines = buildFeedOperationalTimelines({ generatedAt: '2026-09-03T10:00:00Z', integrations: [{ integrationId: 'i', merchantId: 'm', merchantName: 'M', integrationKind: 'direct', integrationStatus: 'active', hasSecretReference: true, feeds: [{ sourceKey: 'one', sourceType: 'csv', isActive: false }] }] }, [{ id: 'x', actorEmail: 'x@example.com', actorRole: 'owner', action: 'feed.pause', targetType: 'feed', merchantId: 'm', sourceKey: 'two', outcome: 'succeeded', occurredAt: '2026-09-03T09:00:00Z' }])
    expect(timelines[0].events.some((event) => event.kind === 'operator_action')).toBe(false)
  })
})

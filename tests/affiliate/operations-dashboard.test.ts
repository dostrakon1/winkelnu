import { describe, expect, it } from 'vitest'

import { buildOperationsDashboard } from '@/application/affiliate/operations-dashboard'

describe('buildOperationsDashboard', () => {
  it('prioritizes critical partner incidents before lower severity issues', () => {
    const dashboard = buildOperationsDashboard({
      generatedAt: '2026-09-03T10:00:00.000Z',
      integrations: [
        {
          integrationId: 'integration:bol',
          merchantId: 'merchant:bol',
          merchantName: 'bol',
          integrationKind: 'marketplace',
          integrationStatus: 'active',
          hasSecretReference: false,
          feeds: [{
            sourceKey: 'bol-products',
            sourceType: 'csv',
            isActive: true,
            health: {
              merchantId: 'merchant:bol',
              sourceKey: 'bol-products',
              status: 'delayed',
              failureCount: 0,
              nextRunAt: '2026-09-03T08:00:00.000Z',
            },
          }],
        },
        {
          integrationId: 'integration:daisycon',
          merchantId: 'merchant:daisycon',
          merchantName: 'Daisycon',
          integrationKind: 'network',
          integrationStatus: 'active',
          hasSecretReference: true,
          feeds: [{
            sourceKey: 'daisycon-products',
            sourceType: 'json',
            isActive: true,
            health: {
              merchantId: 'merchant:daisycon',
              sourceKey: 'daisycon-products',
              status: 'attention_required',
              failureCount: 3,
              lastError: 'Rate limit failures',
            },
          }],
        },
      ],
    })

    expect(dashboard.totals.critical).toBe(2)
    expect(dashboard.incidents[0].severity).toBe('critical')
    expect(dashboard.incidents[0].merchantName).toBe('bol')
    expect(dashboard.incidents[1].severity).toBe('critical')
    expect(dashboard.incidents.at(-1)?.severity).toBe('medium')
  })

  it('treats active feeds without observed health as high priority', () => {
    const dashboard = buildOperationsDashboard({
      generatedAt: '2026-09-03T10:00:00.000Z',
      integrations: [{
        integrationId: 'integration:new',
        merchantId: 'merchant:new',
        merchantName: 'New Partner',
        integrationKind: 'network',
        integrationStatus: 'active',
        hasSecretReference: true,
        feeds: [{ sourceKey: 'new-feed', sourceType: 'xml', isActive: true }],
      }],
    })

    expect(dashboard.incidents[0].kind).toBe('feed_not_running')
    expect(dashboard.incidents[0].severity).toBe('high')
  })

  it('keeps paused feeds visible so operators can resume them deliberately', () => {
    const dashboard = buildOperationsDashboard({
      generatedAt: '2026-09-03T10:00:00.000Z',
      integrations: [{
        integrationId: 'integration:paused',
        merchantId: 'merchant:paused',
        merchantName: 'Paused Partner',
        integrationKind: 'network',
        integrationStatus: 'active',
        hasSecretReference: true,
        feeds: [{ sourceKey: 'paused-feed', sourceType: 'csv', isActive: false }],
      }],
    })

    expect(dashboard.incidents).toHaveLength(1)
    expect(dashboard.incidents[0].kind).toBe('feed_paused')
    expect(dashboard.incidents[0].severity).toBe('low')
  })
})

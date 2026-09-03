import { describe, expect, it } from 'vitest'
import { buildPartnerPortfolio } from '@/application/affiliate/partner-portfolio'

describe('buildPartnerPortfolio', () => {
  it('summarizes Daisycon and bol blockers without overstating production readiness', () => {
    const result = buildPartnerPortfolio([
      {
        partnerKey: 'daisycon',
        displayName: 'Daisycon',
        integrationKind: 'network',
        activationStatus: 'repository_ready',
        evidence: [
          { key: 'mapping', label: 'Real Daisycon feed sample is still missing.', verified: false, requiredForProduction: true },
          { key: 'tests', label: 'Repository adapter tests pass.', verified: true, requiredForProduction: true },
        ],
      },
      {
        partnerKey: 'bol',
        displayName: 'bol',
        integrationKind: 'marketplace',
        activationStatus: 'repository_ready',
        evidence: [
          { key: 'site_id', label: 'Winkelnu bol Site_ID is configured.', verified: true, requiredForProduction: true },
          { key: 'real_feed', label: 'Real bol feed access/header validation is still missing.', verified: false, requiredForProduction: true },
        ],
      },
    ])

    expect(result.totalPartners).toBe(2)
    expect(result.productionApproved).toBe(0)
    expect(result.repositoryReady).toBe(2)
    expect(result.partners[0]?.readyForProduction).toBe(false)
    expect(result.partners[0]?.nextAction).toBe('Real bol feed access/header validation is still missing.')
    expect(result.partners[1]?.nextAction).toBe('Real Daisycon feed sample is still missing.')
  })

  it('requires healthy live feed health even after production approval', () => {
    const result = buildPartnerPortfolio([
      {
        partnerKey: 'partner-a',
        displayName: 'Partner A',
        integrationKind: 'direct',
        activationStatus: 'production_approved',
        feedHealth: {
          merchantId: 'merchant:a',
          sourceKey: 'feed:a',
          status: 'failing',
          failureCount: 1,
          lastError: 'Feed endpoint unavailable.',
        },
        evidence: [
          { key: 'live', label: 'Live proof', verified: true, requiredForProduction: true },
        ],
      },
    ])

    expect(result.productionApproved).toBe(1)
    expect(result.attentionRequired).toBe(1)
    expect(result.partners[0]?.readyForProduction).toBe(false)
    expect(result.partners[0]?.blockers).toContain('Feed endpoint unavailable.')
  })

  it('marks a production-approved partner operationally ready only with complete evidence and healthy feed', () => {
    const result = buildPartnerPortfolio([
      {
        partnerKey: 'partner-a',
        displayName: 'Partner A',
        integrationKind: 'network',
        activationStatus: 'production_approved',
        feedHealth: {
          merchantId: 'merchant:a',
          sourceKey: 'feed:a',
          status: 'healthy',
          failureCount: 0,
          lastSucceededAt: '2026-09-03T08:00:00.000Z',
        },
        evidence: [
          { key: 'mapping', label: 'Mapping verified', verified: true, requiredForProduction: true },
          { key: 'preview', label: 'Live preview verified', verified: true, requiredForProduction: true },
        ],
      },
    ])

    expect(result.partners[0]?.readyForProduction).toBe(true)
    expect(result.partners[0]?.blockers).toEqual([])
    expect(result.partners[0]?.nextAction).toBeUndefined()
  })
})

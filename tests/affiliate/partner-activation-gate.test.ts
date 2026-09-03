import { describe, expect, it } from 'vitest'
import { assessPartnerProductionActivation, type PartnerAcceptanceEvidence } from '@/application/affiliate/partner-activation-gate'

function evidence(overrides: Partial<PartnerAcceptanceEvidence> = {}): PartnerAcceptanceEvidence {
  return {
    partnerKey: 'daisycon',
    sourceKey: 'daisycon:test-store',
    mapping: { verified: true, sampleOrigin: 'synthetic' },
    preview: { passed: true, acceptanceRate: 1, recordsSeen: 3, reviewRequired: 0 },
    catalog: { productVisible: true, bestOfferVerified: true, freshnessVerified: true },
    affiliate: { destination: 'https://merchant.example/affiliate/product', redirectVerified: true },
    live: { supabaseReadinessVerified: false, partnerCredentialVerified: false, livePreviewVerified: false },
    ...overrides,
  }
}

describe('assessPartnerProductionActivation', () => {
  it('marks a fully proven repository path as repository_ready while live gates remain pending', () => {
    const result = assessPartnerProductionActivation(evidence())

    expect(result.status).toBe('repository_ready')
    expect(result.canActivateProduction).toBe(false)
    expect(result.reasons).toEqual(expect.arrayContaining([
      'Mapping has been verified against a sanitized real partner feed sample.',
      'Live Supabase production-readiness gate has passed.',
      'Real partner credential/feed access has been verified.',
      'A preview using the real partner feed has passed in the live/preview environment.',
    ]))
  })

  it('requires all repository and live evidence before production approval', () => {
    const result = assessPartnerProductionActivation(evidence({
      mapping: { verified: true, sampleOrigin: 'sanitized_partner_feed' },
      live: { supabaseReadinessVerified: true, partnerCredentialVerified: true, livePreviewVerified: true },
    }))

    expect(result.status).toBe('production_approved')
    expect(result.canActivateProduction).toBe(true)
    expect(result.reasons).toEqual([])
  })

  it('blocks activation when preview quality falls below the acceptance threshold', () => {
    const result = assessPartnerProductionActivation(evidence({
      preview: { passed: false, acceptanceRate: 0.9, recordsSeen: 100, reviewRequired: 2 },
    }))

    expect(result.status).toBe('blocked')
    expect(result.canActivateProduction).toBe(false)
    expect(result.checks.find((check) => check.key === 'preview_quality')?.passed).toBe(false)
  })

  it('blocks unsafe affiliate destinations independently from redirect evidence', () => {
    const result = assessPartnerProductionActivation(evidence({
      affiliate: { destination: 'http://merchant.example/product', redirectVerified: true },
    }))

    expect(result.status).toBe('blocked')
    expect(result.checks.find((check) => check.key === 'affiliate_destination')?.passed).toBe(false)
  })
})

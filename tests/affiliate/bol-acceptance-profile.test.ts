import { describe, expect, it } from 'vitest'
import { assessBolAffiliateReadiness } from '@/application/affiliate/bol-acceptance-profile'
import { buildBolAffiliateTrackingUrl, isBolAffiliateTrackingUrl } from '@/infrastructure/feeds/bol/bol-affiliate-tracking'

const tracking = buildBolAffiliateTrackingUrl({
  siteId: '12345',
  productUrl: 'https://www.bol.com/nl/nl/p/test-product/9300000000000000/',
  name: 'Winkelnu product',
  subId: 'product-page',
})

const baseEvidence = {
  partnerKey: 'bol',
  sourceKey: 'bol-affiliate-feed',
  mapping: { verified: true, sampleOrigin: 'synthetic' as const },
  preview: { passed: true, acceptanceRate: 1, recordsSeen: 10, reviewRequired: 0 },
  catalog: { productVisible: true, bestOfferVerified: true, freshnessVerified: true },
  affiliate: { destination: tracking, redirectVerified: true },
  live: { supabaseReadinessVerified: false, partnerCredentialVerified: false, livePreviewVerified: false },
  bol: {
    siteId: '12345',
    trackingUrl: tracking,
    sourceAttributionVisible: true,
    dutchExperienceAvailable: true,
    freshnessPolicyEnforced: true,
    terminationCleanupDefined: true,
    realFeedAccessVerified: false,
  },
}

describe('bol affiliate tracking', () => {
  it('builds a valid tracking URL for the expected Site_ID', () => {
    expect(isBolAffiliateTrackingUrl(tracking, '12345')).toBe(true)
    expect(isBolAffiliateTrackingUrl(tracking, '99999')).toBe(false)
  })

  it('rejects non-bol product destinations', () => {
    expect(() => buildBolAffiliateTrackingUrl({
      siteId: '12345',
      productUrl: 'https://example.com/product',
      name: 'Bad destination',
    })).toThrow('bol product URL must target bol.com.')
  })
})

describe('bol affiliate acceptance profile', () => {
  it('is repository ready but not production approved before real feed/live evidence', () => {
    const result = assessBolAffiliateReadiness(baseEvidence)
    expect(result.status).toBe('repository_ready')
    expect(result.canActivateProduction).toBe(false)
    expect(result.bolChecks.find((check) => check.key === 'bol_real_feed_access')?.passed).toBe(false)
  })

  it('blocks a tracking URL that belongs to another Site_ID', () => {
    const result = assessBolAffiliateReadiness({
      ...baseEvidence,
      bol: { ...baseEvidence.bol, siteId: '99999' },
    })
    expect(result.status).toBe('blocked')
    expect(result.bolChecks.find((check) => check.key === 'bol_tracking')?.passed).toBe(false)
  })

  it('can approve production only after generic and bol live evidence are complete', () => {
    const result = assessBolAffiliateReadiness({
      ...baseEvidence,
      mapping: { verified: true, sampleOrigin: 'sanitized_partner_feed' },
      live: { supabaseReadinessVerified: true, partnerCredentialVerified: true, livePreviewVerified: true },
      bol: { ...baseEvidence.bol, realFeedAccessVerified: true },
    })
    expect(result.status).toBe('production_approved')
    expect(result.canActivateProduction).toBe(true)
  })
})

import { validateAffiliateDestination } from './affiliate-redirect-service'

export type PartnerAcceptanceEvidence = {
  partnerKey: string
  sourceKey: string
  mapping: {
    verified: boolean
    sampleOrigin: 'synthetic' | 'sanitized_partner_feed'
  }
  preview: {
    passed: boolean
    acceptanceRate: number
    recordsSeen: number
    reviewRequired: number
  }
  catalog: {
    productVisible: boolean
    bestOfferVerified: boolean
    freshnessVerified: boolean
  }
  affiliate: {
    destination?: string
    redirectVerified: boolean
  }
  live: {
    supabaseReadinessVerified: boolean
    partnerCredentialVerified: boolean
    livePreviewVerified: boolean
  }
}

export type PartnerActivationGateStatus = 'blocked' | 'repository_ready' | 'production_approved'

export type PartnerActivationGateResult = {
  status: PartnerActivationGateStatus
  canActivateProduction: boolean
  checks: Array<{ key: string; passed: boolean; blocking: boolean; message: string }>
  reasons: string[]
}

export function assessPartnerProductionActivation(
  evidence: PartnerAcceptanceEvidence,
): PartnerActivationGateResult {
  const checks = [
    {
      key: 'mapping_verified',
      passed: evidence.mapping.verified,
      blocking: true,
      message: 'Partner feed mapping contract is verified.',
    },
    {
      key: 'partner_sample_verified',
      passed: evidence.mapping.sampleOrigin === 'sanitized_partner_feed',
      blocking: false,
      message: 'Mapping has been verified against a sanitized real partner feed sample.',
    },
    {
      key: 'preview_passed',
      passed: evidence.preview.passed && evidence.preview.recordsSeen > 0,
      blocking: true,
      message: 'Preview import passed with records.',
    },
    {
      key: 'preview_quality',
      passed: evidence.preview.acceptanceRate >= 0.95 && evidence.preview.reviewRequired === 0,
      blocking: true,
      message: 'Preview acceptance is at least 95% and requires no manual product-match review.',
    },
    {
      key: 'catalog_visibility',
      passed: evidence.catalog.productVisible,
      blocking: true,
      message: 'Imported products are visible through the catalog read path.',
    },
    {
      key: 'ranking_verified',
      passed: evidence.catalog.bestOfferVerified && evidence.catalog.freshnessVerified,
      blocking: true,
      message: 'Best-offer ranking and freshness behavior are verified.',
    },
    {
      key: 'affiliate_destination',
      passed: Boolean(evidence.affiliate.destination && validateAffiliateDestination(evidence.affiliate.destination)),
      blocking: true,
      message: 'Affiliate destination is a valid public HTTPS URL.',
    },
    {
      key: 'redirect_verified',
      passed: evidence.affiliate.redirectVerified,
      blocking: true,
      message: 'Affiliate redirect behavior has been verified.',
    },
    {
      key: 'live_supabase',
      passed: evidence.live.supabaseReadinessVerified,
      blocking: false,
      message: 'Live Supabase production-readiness gate has passed.',
    },
    {
      key: 'live_partner_credentials',
      passed: evidence.live.partnerCredentialVerified,
      blocking: false,
      message: 'Real partner credential/feed access has been verified.',
    },
    {
      key: 'live_partner_preview',
      passed: evidence.live.livePreviewVerified,
      blocking: false,
      message: 'A preview using the real partner feed has passed in the live/preview environment.',
    },
  ]

  const repositoryBlockers = checks.filter((check) => check.blocking && !check.passed)
  const liveChecks = checks.filter((check) => check.key.startsWith('live_') || check.key === 'partner_sample_verified')
  const productionApproved = repositoryBlockers.length === 0 && liveChecks.every((check) => check.passed)
  const status: PartnerActivationGateStatus = repositoryBlockers.length > 0
    ? 'blocked'
    : productionApproved
      ? 'production_approved'
      : 'repository_ready'

  return {
    status,
    canActivateProduction: productionApproved,
    checks,
    reasons: checks.filter((check) => !check.passed).map((check) => check.message),
  }
}

import { assessPartnerProductionActivation, type PartnerAcceptanceEvidence, type PartnerActivationGateResult } from './partner-activation-gate'
import { isBolAffiliateTrackingUrl } from '@/infrastructure/feeds/bol/bol-affiliate-tracking'

export type BolAffiliateAcceptanceEvidence = PartnerAcceptanceEvidence & {
  bol: {
    siteId?: string
    trackingUrl?: string
    sourceAttributionVisible: boolean
    dutchExperienceAvailable: boolean
    freshnessPolicyEnforced: boolean
    terminationCleanupDefined: boolean
    realFeedAccessVerified: boolean
    affiliateApiAccessVerified?: boolean
  }
}

export type BolAffiliateAcceptanceResult = PartnerActivationGateResult & {
  bolChecks: Array<{ key: string; passed: boolean; message: string }>
}

export function assessBolAffiliateReadiness(evidence: BolAffiliateAcceptanceEvidence): BolAffiliateAcceptanceResult {
  const generic = assessPartnerProductionActivation(evidence)
  const siteId = evidence.bol.siteId?.trim()
  const bolChecks = [
    { key: 'bol_site_id', passed: Boolean(siteId && /^\d+$/.test(siteId)), message: 'A unique numeric bol Affiliate Site_ID is configured for Winkelnu.' },
    { key: 'bol_tracking', passed: Boolean(siteId && evidence.bol.trackingUrl && isBolAffiliateTrackingUrl(evidence.bol.trackingUrl, siteId)), message: 'Product URLs are transformed into valid bol affiliate tracking URLs for the expected Winkelnu Site_ID.' },
    { key: 'bol_attribution', passed: evidence.bol.sourceAttributionVisible, message: 'The storefront clearly identifies bol as the source/merchant and does not present Winkelnu as bol.' },
    { key: 'bol_language', passed: evidence.bol.dutchExperienceAvailable, message: 'A Dutch consumer experience is available for bol content.' },
    { key: 'bol_freshness', passed: evidence.bol.freshnessPolicyEnforced, message: 'Price, availability and delivery freshness are actively enforced.' },
    { key: 'bol_termination_cleanup', passed: evidence.bol.terminationCleanupDefined, message: 'A cleanup procedure removes bol content when API/affiliate access ends.' },
    { key: 'bol_real_feed_access', passed: evidence.bol.realFeedAccessVerified, message: 'Real bol affiliate product-feed access has been verified.' },
  ]

  const repositoryBolChecks = bolChecks.filter((check) => check.key !== 'bol_real_feed_access')
  const repositoryBlocked = generic.status === 'blocked' || repositoryBolChecks.some((check) => !check.passed)
  const productionApproved = !repositoryBlocked && generic.canActivateProduction && bolChecks.every((check) => check.passed)

  return {
    ...generic,
    status: repositoryBlocked ? 'blocked' : productionApproved ? 'production_approved' : 'repository_ready',
    canActivateProduction: productionApproved,
    bolChecks,
    reasons: [
      ...generic.reasons,
      ...bolChecks.filter((check) => !check.passed).map((check) => check.message),
    ],
  }
}

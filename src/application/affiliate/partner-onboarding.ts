import type { AffiliateIntegrationRegistryRepository } from './integration-registry-ports'
import type { CatalogWriteRepository } from '@/application/catalog/ports'
import { importFeed, type ImportFeedResult } from '@/application/catalog/import-feed'
import type { Merchant } from '@/domain/catalog/types'
import type { FeedAdapter } from '@/infrastructure/feeds/adapter'

export type PartnerOnboardingStage =
  | 'registered'
  | 'preview_ready'
  | 'preview_passed'
  | 'approved'
  | 'active'
  | 'paused'
  | 'rejected'

export type PartnerOnboardingAssessment = {
  stage: PartnerOnboardingStage
  canPreview: boolean
  canActivate: boolean
  reasons: string[]
}

export type PreviewImportReport = {
  importResult: ImportFeedResult
  acceptanceRate: number
  passed: boolean
  reasons: string[]
}

export class PartnerOnboardingService {
  constructor(private readonly registry: AffiliateIntegrationRegistryRepository) {}

  async assess(input: { merchantId: string; sourceKey: string }): Promise<PartnerOnboardingAssessment> {
    const source = await this.registry.getFeedSource(input.sourceKey, input.merchantId)
    if (!source) return { stage: 'registered', canPreview: false, canActivate: false, reasons: ['Feed source is not registered.'] }
    if (!source.integrationId) return { stage: 'registered', canPreview: false, canActivate: false, reasons: ['Feed source is not linked to an affiliate integration.'] }

    const integration = await this.registry.getIntegration(source.integrationId)
    if (!integration || integration.merchantId !== input.merchantId) {
      return { stage: 'registered', canPreview: false, canActivate: false, reasons: ['Affiliate integration is missing or belongs to another merchant.'] }
    }

    if (integration.status === 'ended') return { stage: 'rejected', canPreview: false, canActivate: false, reasons: ['Affiliate integration has ended.'] }
    if (integration.status === 'paused') return { stage: 'paused', canPreview: false, canActivate: false, reasons: ['Affiliate integration is paused.'] }
    if (integration.status === 'pending') return { stage: 'preview_ready', canPreview: true, canActivate: false, reasons: [] }
    if (!source.isActive) return { stage: 'approved', canPreview: true, canActivate: true, reasons: ['Feed source is approved but not active.'] }

    return { stage: 'active', canPreview: true, canActivate: true, reasons: [] }
  }

  async runPreview(input: {
    adapter: FeedAdapter
    repository: CatalogWriteRepository
    merchant: Merchant
    categoryIdBySourceCategory?: Record<string, string>
    now?: () => string
    minimumAcceptanceRate?: number
  }): Promise<PreviewImportReport> {
    const result = await importFeed({
      adapter: input.adapter,
      repository: input.repository,
      merchant: input.merchant,
      categoryIdBySourceCategory: input.categoryIdBySourceCategory,
      now: input.now,
      deactivateMissingOffers: false,
    })

    const acceptanceRate = result.importRun.recordsSeen === 0 ? 0 : result.imported / result.importRun.recordsSeen
    const minimum = input.minimumAcceptanceRate ?? 0.95
    const reasons: string[] = []
    if (result.importRun.recordsSeen === 0) reasons.push('Preview returned no records.')
    if (acceptanceRate < minimum) reasons.push(`Acceptance rate ${acceptanceRate.toFixed(3)} is below required ${minimum.toFixed(3)}.`)
    if (result.reviewRequired > 0) reasons.push(`${result.reviewRequired} product matches require manual review.`)

    return {
      importResult: result,
      acceptanceRate,
      passed: reasons.length === 0,
      reasons,
    }
  }
}

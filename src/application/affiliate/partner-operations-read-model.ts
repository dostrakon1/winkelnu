import type { FeedHealth } from '@/domain/catalog/import-worker'
import type { AffiliateIntegrationKind, AffiliateIntegrationStatus, AffiliateFeedSourceType } from '@/domain/affiliate/integration-registry'

export type PartnerOperationsFeedOrchestration = {
  failureCount: number
  lastStartedAt?: string
  lastSucceededAt?: string
  nextRunAt?: string
  leaseActive: boolean
  leaseExpiresAt?: string
}

export type PartnerOperationsFeed = {
  sourceKey: string
  sourceType: AffiliateFeedSourceType
  isActive: boolean
  health?: FeedHealth
  orchestration?: PartnerOperationsFeedOrchestration
}

export type PartnerOperationsIntegration = {
  integrationId: string
  merchantId: string
  merchantName: string
  integrationKind: AffiliateIntegrationKind
  integrationStatus: AffiliateIntegrationStatus
  networkName?: string
  programIdentifier?: string
  hasSecretReference: boolean
  feeds: PartnerOperationsFeed[]
}

export type PartnerOperationsReadModel = {
  generatedAt: string
  integrations: PartnerOperationsIntegration[]
}

export interface PartnerOperationsReadRepository {
  readPartnerOperations(now: string): Promise<PartnerOperationsReadModel>
}

export class PartnerOperationsReadService {
  constructor(
    private readonly repository: PartnerOperationsReadRepository,
    private readonly clock: () => string = () => new Date().toISOString(),
  ) {}

  async read(): Promise<PartnerOperationsReadModel> {
    return this.repository.readPartnerOperations(this.clock())
  }
}

import type { FeedHealth } from '@/domain/catalog/import-worker'
import type { AffiliateIntegrationKind, AffiliateIntegrationStatus, AffiliateFeedSourceType } from '@/domain/affiliate/integration-registry'

export type PartnerOperationsFeed = {
  sourceKey: string
  sourceType: AffiliateFeedSourceType
  isActive: boolean
  health?: FeedHealth
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

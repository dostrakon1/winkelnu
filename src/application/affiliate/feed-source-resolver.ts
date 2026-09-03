import type { AffiliateIntegrationRegistryRepository } from './integration-registry-ports'
import type {
  AffiliateFeedSourceRegistration,
  AffiliateNetwork,
  MerchantAffiliateIntegration,
} from '@/domain/affiliate/integration-registry'

export type ResolvedPartnerFeedSource = {
  source: AffiliateFeedSourceRegistration
  integration?: MerchantAffiliateIntegration
  network?: AffiliateNetwork
}

export class PartnerFeedSourceResolver {
  constructor(private readonly repository: AffiliateIntegrationRegistryRepository) {}

  async resolve(input: { sourceKey: string; merchantId: string }): Promise<ResolvedPartnerFeedSource | null> {
    const source = await this.repository.getFeedSource(input.sourceKey, input.merchantId)
    if (!source || !source.isActive) return null

    if (!source.integrationId) return { source }

    const integration = await this.repository.getIntegration(source.integrationId)
    if (!integration || integration.status !== 'active') return null
    if (integration.merchantId !== source.merchantId) return null

    if (!integration.networkId) {
      return integration.kind === 'direct' ? { source, integration } : null
    }

    const network = await this.repository.getNetwork(integration.networkId)
    if (!network || !network.isActive) return null
    if (integration.kind !== network.kind) return null

    return { source, integration, network }
  }
}

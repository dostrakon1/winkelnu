import type { AffiliateIntegrationRegistryRepository } from '@/application/affiliate/integration-registry-ports'
import type {
  AffiliateFeedSourceRegistration,
  AffiliateNetwork,
  MerchantAffiliateIntegration,
} from '@/domain/affiliate/integration-registry'

export class InMemoryAffiliateIntegrationRegistryRepository implements AffiliateIntegrationRegistryRepository {
  private readonly networks = new Map<string, AffiliateNetwork>()
  private readonly integrations = new Map<string, MerchantAffiliateIntegration>()
  private readonly feedSources = new Map<string, AffiliateFeedSourceRegistration>()

  async listNetworks(): Promise<AffiliateNetwork[]> {
    return [...this.networks.values()]
  }

  async getNetwork(networkId: string): Promise<AffiliateNetwork | null> {
    return this.networks.get(networkId) ?? null
  }

  async listMerchantIntegrations(merchantId: string): Promise<MerchantAffiliateIntegration[]> {
    return [...this.integrations.values()].filter((integration) => integration.merchantId === merchantId)
  }

  async getIntegration(integrationId: string): Promise<MerchantAffiliateIntegration | null> {
    return this.integrations.get(integrationId) ?? null
  }

  async getFeedSource(sourceKey: string, merchantId: string): Promise<AffiliateFeedSourceRegistration | null> {
    return this.feedSources.get(`${merchantId}:${sourceKey}`) ?? null
  }

  async upsertNetwork(network: AffiliateNetwork): Promise<void> {
    this.networks.set(network.id, network)
  }

  async upsertIntegration(integration: MerchantAffiliateIntegration): Promise<void> {
    this.integrations.set(integration.id, integration)
  }

  async linkFeedSource(registration: AffiliateFeedSourceRegistration): Promise<void> {
    this.feedSources.set(`${registration.merchantId}:${registration.sourceKey}`, registration)
  }
}

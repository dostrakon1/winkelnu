import type {
  AffiliateFeedSourceRegistration,
  AffiliateNetwork,
  MerchantAffiliateIntegration,
} from '@/domain/affiliate/integration-registry'

export interface AffiliateIntegrationRegistryRepository {
  listNetworks(): Promise<AffiliateNetwork[]>
  getNetwork(networkId: string): Promise<AffiliateNetwork | null>
  listMerchantIntegrations(merchantId: string): Promise<MerchantAffiliateIntegration[]>
  getIntegration(integrationId: string): Promise<MerchantAffiliateIntegration | null>
  getFeedSource(sourceKey: string, merchantId: string): Promise<AffiliateFeedSourceRegistration | null>
  upsertNetwork(network: AffiliateNetwork): Promise<void>
  upsertIntegration(integration: MerchantAffiliateIntegration): Promise<void>
  linkFeedSource(registration: AffiliateFeedSourceRegistration): Promise<void>
}

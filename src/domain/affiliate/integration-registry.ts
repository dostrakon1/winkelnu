export type AffiliateNetworkKind = 'network' | 'marketplace'
export type AffiliateIntegrationKind = AffiliateNetworkKind | 'direct'
export type AffiliateIntegrationStatus = 'pending' | 'active' | 'paused' | 'ended'
export type AffiliateFeedSourceType = 'api' | 'xml' | 'csv' | 'json' | 'manual'

export type AffiliateNetwork = {
  id: string
  slug: string
  name: string
  kind: AffiliateNetworkKind
  websiteUrl?: string
  isActive: boolean
}

export type MerchantAffiliateIntegration = {
  id: string
  merchantId: string
  kind: AffiliateIntegrationKind
  networkId?: string
  programIdentifier?: string
  status: AffiliateIntegrationStatus
  secretRef?: string
  trackingConfig: Record<string, string>
}

export type AffiliateFeedSourceRegistration = {
  sourceKey: string
  merchantId: string
  sourceType: AffiliateFeedSourceType
  integrationId?: string
  isActive: boolean
}

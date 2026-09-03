import type { AffiliateIntegrationRegistryRepository } from './integration-registry-ports'
import type {
  AffiliateFeedSourceRegistration,
  AffiliateNetwork,
  MerchantAffiliateIntegration,
} from '@/domain/affiliate/integration-registry'

function validateSecretRef(secretRef?: string): void {
  if (!secretRef) return
  if (!/^env:[A-Z][A-Z0-9_]{2,120}$/.test(secretRef)) {
    throw new Error('Affiliate secretRef must reference a server environment variable as env:UPPERCASE_NAME.')
  }
}

function validateIntegration(integration: MerchantAffiliateIntegration): void {
  validateSecretRef(integration.secretRef)

  if (integration.kind === 'direct' && integration.networkId) {
    throw new Error('Direct affiliate integrations must not reference an affiliate network.')
  }

  if (integration.kind !== 'direct' && !integration.networkId) {
    throw new Error('Network and marketplace integrations must reference an affiliate network.')
  }
}

export class AffiliateIntegrationRegistryService {
  constructor(private readonly repository: AffiliateIntegrationRegistryRepository) {}

  async registerNetwork(network: AffiliateNetwork): Promise<void> {
    if (!network.id.trim() || !network.slug.trim() || !network.name.trim()) {
      throw new Error('Affiliate network id, slug and name are required.')
    }
    await this.repository.upsertNetwork(network)
  }

  async registerIntegration(integration: MerchantAffiliateIntegration): Promise<void> {
    validateIntegration(integration)

    if (integration.networkId) {
      const network = await this.repository.getNetwork(integration.networkId)
      if (!network || !network.isActive) {
        throw new Error(`Affiliate network ${integration.networkId} is unavailable.`)
      }
      if (network.kind !== integration.kind) {
        throw new Error(`Integration kind ${integration.kind} does not match network kind ${network.kind}.`)
      }
    }

    await this.repository.upsertIntegration(integration)
  }

  async registerFeedSource(registration: AffiliateFeedSourceRegistration): Promise<void> {
    if (registration.integrationId) {
      const integration = await this.repository.getIntegration(registration.integrationId)
      if (!integration) throw new Error(`Affiliate integration ${registration.integrationId} does not exist.`)
      if (integration.merchantId !== registration.merchantId) {
        throw new Error('Feed source merchant must match the affiliate integration merchant.')
      }
    }

    await this.repository.linkFeedSource(registration)
  }

  async getMerchantRegistry(merchantId: string): Promise<{
    integrations: MerchantAffiliateIntegration[]
    networks: AffiliateNetwork[]
  }> {
    const integrations = await this.repository.listMerchantIntegrations(merchantId)
    const networkIds = [...new Set(integrations.map((item) => item.networkId).filter((value): value is string => Boolean(value)))]
    const networks = (await Promise.all(networkIds.map((id) => this.repository.getNetwork(id)))).filter(
      (network): network is AffiliateNetwork => network !== null,
    )
    return { integrations, networks }
  }
}

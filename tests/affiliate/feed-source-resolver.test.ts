import { describe, expect, it } from 'vitest'
import { PartnerFeedSourceResolver } from '@/application/affiliate/feed-source-resolver'
import { AffiliateIntegrationRegistryService } from '@/application/affiliate/affiliate-integration-registry-service'
import { InMemoryAffiliateIntegrationRegistryRepository } from '@/infrastructure/affiliate/in-memory-affiliate-integration-registry-repository'

async function setup() {
  const repository = new InMemoryAffiliateIntegrationRegistryRepository()
  const registry = new AffiliateIntegrationRegistryService(repository)
  const resolver = new PartnerFeedSourceResolver(repository)
  return { repository, registry, resolver }
}

describe('PartnerFeedSourceResolver', () => {
  it('resolves active source, integration and network context', async () => {
    const { registry, resolver } = await setup()
    await registry.registerNetwork({ id: 'network:demo', slug: 'demo', name: 'Demo', kind: 'network', isActive: true })
    await registry.registerIntegration({ id: 'integration:demo', merchantId: 'merchant:a', kind: 'network', networkId: 'network:demo', status: 'active', trackingConfig: {} })
    await registry.registerFeedSource({ sourceKey: 'feed-a', merchantId: 'merchant:a', sourceType: 'api', integrationId: 'integration:demo', isActive: true })

    await expect(resolver.resolve({ sourceKey: 'feed-a', merchantId: 'merchant:a' })).resolves.toMatchObject({
      source: { sourceKey: 'feed-a' },
      integration: { id: 'integration:demo' },
      network: { id: 'network:demo' },
    })
  })

  it('fails closed for inactive sources and paused integrations', async () => {
    const { registry, resolver } = await setup()
    await registry.registerIntegration({ id: 'integration:direct', merchantId: 'merchant:a', kind: 'direct', status: 'paused', trackingConfig: {} })
    await registry.registerFeedSource({ sourceKey: 'feed-a', merchantId: 'merchant:a', sourceType: 'json', integrationId: 'integration:direct', isActive: true })
    await expect(resolver.resolve({ sourceKey: 'feed-a', merchantId: 'merchant:a' })).resolves.toBeNull()
  })
})

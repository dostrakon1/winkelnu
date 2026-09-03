import { describe, expect, it } from 'vitest'
import { AffiliateIntegrationRegistryService } from '@/application/affiliate/affiliate-integration-registry-service'
import { InMemoryAffiliateIntegrationRegistryRepository } from '@/infrastructure/affiliate/in-memory-affiliate-integration-registry-repository'

function service() {
  const repository = new InMemoryAffiliateIntegrationRegistryRepository()
  return { repository, service: new AffiliateIntegrationRegistryService(repository) }
}

describe('AffiliateIntegrationRegistryService', () => {
  it('registers a network integration and links a matching feed source', async () => {
    const { repository, service } = service()

    await service.registerNetwork({
      id: 'network:demo',
      slug: 'demo-network',
      name: 'Demo Network',
      kind: 'network',
      isActive: true,
    })

    await service.registerIntegration({
      id: 'integration:merchant-a:demo',
      merchantId: 'merchant:a',
      kind: 'network',
      networkId: 'network:demo',
      programIdentifier: 'program-123',
      status: 'active',
      secretRef: 'env:AFFILIATE_DEMO_API_TOKEN',
      trackingConfig: { subIdParameter: 'subid' },
    })

    await service.registerFeedSource({
      sourceKey: 'merchant-a-products',
      merchantId: 'merchant:a',
      sourceType: 'api',
      integrationId: 'integration:merchant-a:demo',
      isActive: true,
    })

    expect(await repository.getFeedSource('merchant-a-products', 'merchant:a')).toMatchObject({
      integrationId: 'integration:merchant-a:demo',
      sourceType: 'api',
    })
  })

  it('allows direct programs without a network', async () => {
    const { repository, service } = service()

    await service.registerIntegration({
      id: 'integration:merchant-direct',
      merchantId: 'merchant:direct',
      kind: 'direct',
      status: 'active',
      secretRef: 'env:DIRECT_PARTNER_TOKEN',
      trackingConfig: {},
    })

    expect(await repository.getIntegration('integration:merchant-direct')).toMatchObject({
      kind: 'direct',
      networkId: undefined,
    })
  })

  it('rejects network integrations without a registered network', async () => {
    const { service } = service()

    await expect(service.registerIntegration({
      id: 'integration:invalid',
      merchantId: 'merchant:a',
      kind: 'network',
      status: 'active',
      trackingConfig: {},
    })).rejects.toThrow('must reference an affiliate network')
  })

  it('rejects secret values instead of secret references', async () => {
    const { service } = service()

    await expect(service.registerIntegration({
      id: 'integration:secret-leak',
      merchantId: 'merchant:a',
      kind: 'direct',
      status: 'active',
      secretRef: 'actual-secret-value',
      trackingConfig: {},
    })).rejects.toThrow('secretRef must reference a server environment variable')
  })

  it('rejects linking a feed source to an integration owned by another merchant', async () => {
    const { service } = service()

    await service.registerIntegration({
      id: 'integration:merchant-a:direct',
      merchantId: 'merchant:a',
      kind: 'direct',
      status: 'active',
      trackingConfig: {},
    })

    await expect(service.registerFeedSource({
      sourceKey: 'wrong-merchant-feed',
      merchantId: 'merchant:b',
      sourceType: 'json',
      integrationId: 'integration:merchant-a:direct',
      isActive: true,
    })).rejects.toThrow('Feed source merchant must match')
  })
})

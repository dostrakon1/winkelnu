import { describe, expect, it } from 'vitest'
import { ProductionImportCompositionService } from '@/application/catalog/production-import-composition'
import { InMemoryAffiliateIntegrationRegistryRepository } from '@/infrastructure/affiliate/in-memory-affiliate-integration-registry-repository'
import { InMemoryCatalogRepository } from '@/infrastructure/catalog/in-memory-catalog-repository'
import { PartnerFeedAdapterRegistry } from '@/infrastructure/feeds/partner-adapter-registry'
import type { FeedAdapter } from '@/infrastructure/feeds/adapter'

function adapter(sourceKey: string): FeedAdapter {
  return {
    sourceKey,
    async fetchPage() {
      return {
        items: [{
          sourceKey,
          merchantProductId: 'SKU-1',
          title: 'Test product',
          gtin: '8712345678901',
          imageUrls: [],
          price: { amount: '19.95', currency: 'EUR' },
          availability: 'in_stock',
          productUrl: 'https://shop.example/product',
          affiliateUrl: 'https://track.example/click',
          importedAt: '2026-09-03T06:45:00.000Z',
        }],
      }
    },
  }
}

describe('ProductionImportCompositionService', () => {
  it('resolves registry context to an adapter and imports into the catalog', async () => {
    const affiliates = new InMemoryAffiliateIntegrationRegistryRepository()
    await affiliates.upsertNetwork({ id: 'network:test', slug: 'test-network', name: 'Test Network', kind: 'network', isActive: true })
    await affiliates.upsertIntegration({ id: 'integration:test', merchantId: 'merchant:test', kind: 'network', networkId: 'network:test', status: 'active', trackingConfig: {} })
    await affiliates.linkFeedSource({ sourceKey: 'test-feed', merchantId: 'merchant:test', sourceType: 'json', integrationId: 'integration:test', isActive: true })

    const catalog = new InMemoryCatalogRepository()
    await catalog.upsertMerchant({ id: 'merchant:test', slug: 'test', name: 'Test Shop', websiteUrl: 'https://shop.example', isActive: true })

    const adapters = new PartnerFeedAdapterRegistry()
    adapters.register('test-network:json', ({ resolved }) => adapter(resolved.source.sourceKey))

    const service = new ProductionImportCompositionService(affiliates, adapters, catalog)
    const result = await service.execute({ merchantId: 'merchant:test', sourceKey: 'test-feed' }, { now: () => '2026-09-03T06:45:00.000Z' })

    expect(result.imported).toBe(1)
    expect(result.rejected).toBe(0)
    expect(await catalog.listProducts()).toHaveLength(1)
  })

  it('fails closed when partner context cannot resolve an active adapter', async () => {
    const catalog = new InMemoryCatalogRepository()
    await catalog.upsertMerchant({ id: 'merchant:test', slug: 'test', name: 'Test Shop', websiteUrl: 'https://shop.example', isActive: true })
    const service = new ProductionImportCompositionService(new InMemoryAffiliateIntegrationRegistryRepository(), new PartnerFeedAdapterRegistry(), catalog)

    await expect(service.execute({ merchantId: 'merchant:test', sourceKey: 'missing' })).rejects.toThrow('No active partner feed adapter context')
  })
})

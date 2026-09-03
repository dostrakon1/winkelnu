import { describe, expect, it } from 'vitest'
import { AffiliateIntegrationRegistryService } from '@/application/affiliate/affiliate-integration-registry-service'
import { PartnerFeedSourceResolver } from '@/application/affiliate/feed-source-resolver'
import { importFeed } from '@/application/catalog/import-feed'
import { InMemoryAffiliateIntegrationRegistryRepository } from '@/infrastructure/affiliate/in-memory-affiliate-integration-registry-repository'
import { InMemoryCatalogRepository } from '@/infrastructure/catalog/in-memory-catalog-repository'
import { PartnerFeedAdapterRegistry } from '@/infrastructure/feeds/partner-adapter-registry'
import { RealisticPartnerFixtureAdapter } from '@/infrastructure/feeds/fixtures/realistic-partner-feed-adapter'

const merchant = {
  id: 'merchant:fixture-shop',
  slug: 'fixture-shop',
  name: 'Fixture Shop',
  websiteUrl: 'https://merchant.example.invalid',
  isActive: true,
} as const

async function createResolvedAdapter() {
  const registryRepository = new InMemoryAffiliateIntegrationRegistryRepository()
  const registryService = new AffiliateIntegrationRegistryService(registryRepository)

  await registryService.registerNetwork({
    id: 'network:fixture',
    slug: 'fixture-network',
    name: 'Fixture Network',
    kind: 'network',
    isActive: true,
  })
  await registryService.registerIntegration({
    id: 'integration:fixture-shop',
    merchantId: merchant.id,
    kind: 'network',
    networkId: 'network:fixture',
    status: 'active',
    trackingConfig: {},
  })
  await registryService.registerFeedSource({
    sourceKey: 'fixture-products',
    merchantId: merchant.id,
    sourceType: 'json',
    integrationId: 'integration:fixture-shop',
    isActive: true,
  })

  const resolved = await new PartnerFeedSourceResolver(registryRepository).resolve({
    sourceKey: 'fixture-products',
    merchantId: merchant.id,
  })
  if (!resolved) throw new Error('Expected fixture feed source to resolve.')

  const adapterRegistry = new PartnerFeedAdapterRegistry()
  adapterRegistry.register('fixture-network:json', ({ resolved: context }) => new RealisticPartnerFixtureAdapter(context.source.sourceKey))

  return adapterRegistry.create(resolved)
}

describe('RealisticPartnerFixtureAdapter', () => {
  it('maps provider fields and follows cursor pagination', async () => {
    const adapter = await createResolvedAdapter()
    const first = await adapter.fetchPage()
    const second = await adapter.fetchPage({ cursor: first.nextCursor })

    expect(first.nextCursor).toBe('page-2')
    expect(first.items[0]).toMatchObject({
      merchantProductId: 'FX-1001',
      title: 'Noise cancelling koptelefoon X2',
      brand: 'Northstar',
      availability: 'in_stock',
      price: { amount: '119.95', currency: 'EUR' },
      shippingCost: { amount: '0.00', currency: 'EUR' },
    })
    expect(second.items.map((item) => item.merchantProductId)).toEqual(['FX-1003', 'FX-BROKEN'])
  })

  it('rejects malformed provider records while importing valid pages', async () => {
    const adapter = await createResolvedAdapter()
    const repository = new InMemoryCatalogRepository()

    const result = await importFeed({
      adapter,
      repository,
      merchant,
      now: () => '2026-09-03T05:15:00.000Z',
    })

    expect(result.imported).toBe(3)
    expect(result.rejected).toBe(1)
    expect(result.importRun.status).toBe('completed_with_errors')
    expect(result.issues[0]?.merchantProductId).toBe('FX-BROKEN')

    const products = await repository.listProducts({ limit: 10 })
    expect(products).toHaveLength(3)
  })

  it('fails closed for unknown provider cursors', async () => {
    const adapter = await createResolvedAdapter()
    await expect(adapter.fetchPage({ cursor: 'missing-page' })).rejects.toThrow('unknown cursor')
  })
})

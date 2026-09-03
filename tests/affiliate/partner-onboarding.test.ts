import { describe, expect, it } from 'vitest'
import { PartnerOnboardingService } from '@/application/affiliate/partner-onboarding'
import { InMemoryAffiliateIntegrationRegistryRepository } from '@/infrastructure/affiliate/in-memory-affiliate-integration-registry-repository'
import { InMemoryCatalogRepository } from '@/infrastructure/catalog/in-memory-catalog-repository'
import type { FeedAdapter } from '@/infrastructure/feeds/adapter'

async function registry(status: 'pending' | 'active' = 'pending', sourceActive = false) {
  const repo = new InMemoryAffiliateIntegrationRegistryRepository()
  await repo.upsertNetwork({ id: 'network:daisycon', slug: 'daisycon', name: 'Daisycon', kind: 'network', isActive: true })
  await repo.upsertIntegration({ id: 'integration:shop', merchantId: 'merchant:shop', kind: 'network', networkId: 'network:daisycon', status, trackingConfig: {} })
  await repo.linkFeedSource({ sourceKey: 'daisycon:shop', merchantId: 'merchant:shop', sourceType: 'json', integrationId: 'integration:shop', isActive: sourceActive })
  return repo
}

const merchant = { id: 'merchant:shop', slug: 'shop', name: 'Shop', websiteUrl: 'https://shop.example', isActive: true }

function adapter(items: Parameters<FeedAdapter['fetchPage']>[0] extends never ? never : any[]): FeedAdapter {
  return { sourceKey: 'daisycon:shop', async fetchPage() { return { items, nextCursor: undefined } } }
}

const valid = (id: string) => ({ sourceKey: 'daisycon:shop', merchantProductId: id, title: `Product ${id}`, gtin: `87123456789${id}`, imageUrls: [], price: { amount: '10.00', currency: 'EUR' as const }, availability: 'in_stock', productUrl: `https://shop.example/p/${id}`, affiliateUrl: `https://track.example/${id}`, importedAt: '2026-09-03T06:00:00.000Z' })

describe('PartnerOnboardingService', () => {
  it('allows preview for a pending integration but blocks activation', async () => {
    const service = new PartnerOnboardingService(await registry())
    await expect(service.assess({ merchantId: 'merchant:shop', sourceKey: 'daisycon:shop' })).resolves.toMatchObject({ stage: 'preview_ready', canPreview: true, canActivate: false })
  })

  it('marks an approved inactive source as activatable', async () => {
    const service = new PartnerOnboardingService(await registry('active', false))
    await expect(service.assess({ merchantId: 'merchant:shop', sourceKey: 'daisycon:shop' })).resolves.toMatchObject({ stage: 'approved', canActivate: true })
  })

  it('passes a clean preview and never performs stale-offer cleanup', async () => {
    class SpyRepository extends InMemoryCatalogRepository { deactivationCalls = 0; override async deactivateMissingOffers(input: { merchantId: string; seenBefore: string }) { this.deactivationCalls += 1; return super.deactivateMissingOffers(input) } }
    const catalog = new SpyRepository()
    const service = new PartnerOnboardingService(await registry())
    const report = await service.runPreview({ adapter: adapter([valid('01'), valid('02')]), repository: catalog, merchant, now: () => '2026-09-03T06:00:00.000Z' })
    expect(report.passed).toBe(true)
    expect(report.acceptanceRate).toBe(1)
    expect(catalog.deactivationCalls).toBe(0)
  })

  it('fails preview quality when rejects exceed the acceptance threshold', async () => {
    const broken = { ...valid('02'), title: '', price: { amount: '-1.00', currency: 'EUR' as const } }
    const service = new PartnerOnboardingService(await registry())
    const report = await service.runPreview({ adapter: adapter([valid('01'), broken]), repository: new InMemoryCatalogRepository(), merchant, now: () => '2026-09-03T06:00:00.000Z' })
    expect(report.passed).toBe(false)
    expect(report.acceptanceRate).toBe(0.5)
    expect(report.reasons[0]).toContain('below required')
  })
})

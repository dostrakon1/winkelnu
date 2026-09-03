import { describe, expect, it } from 'vitest'
import { importFeed } from '@/application/catalog/import-feed'
import { ImportOrchestrationService } from '@/application/catalog/import-orchestration-service'
import { InMemoryCatalogRepository } from '@/infrastructure/catalog/in-memory-catalog-repository'
import { InMemoryImportOrchestrationRepository } from '@/infrastructure/catalog/in-memory-import-orchestration-repository'
import type { FeedAdapter } from '@/infrastructure/feeds/adapter'

const merchant = { id: 'merchant:shop', slug: 'shop', name: 'Shop', websiteUrl: 'https://shop.example', isActive: true }

function candidate(id: string) {
  return {
    sourceKey: 'feed:shop',
    merchantProductId: id,
    title: `Product ${id}`,
    gtin: `87123456789${id}`,
    imageUrls: [],
    price: { amount: '10.00', currency: 'EUR' as const },
    productUrl: `https://shop.example/${id}`,
    affiliateUrl: `https://track.example/${id}`,
    importedAt: '2026-09-03T07:00:00.000Z',
  }
}

describe('import heartbeat and correlation', () => {
  it('calls progress heartbeat after every fetched page and retains correlation on the import result', async () => {
    let page = 0
    let heartbeats = 0
    const adapter: FeedAdapter = {
      sourceKey: 'feed:shop',
      async fetchPage() {
        page += 1
        return page === 1 ? { items: [candidate('01')], nextCursor: 'page-2' } : { items: [candidate('02')] }
      },
    }

    const result = await importFeed({
      adapter,
      repository: new InMemoryCatalogRepository(),
      merchant,
      correlationId: 'catalog-import:test-correlation',
      onPageFetched: async () => { heartbeats += 1 },
      now: () => '2026-09-03T07:00:00.000Z',
    })

    expect(heartbeats).toBe(2)
    expect(result.importRun.correlationId).toBe('catalog-import:test-correlation')
    expect(result.imported).toBe(2)
  })

  it('renews a long-running lease only after the heartbeat interval', async () => {
    const repository = new InMemoryImportOrchestrationRepository()
    const service = new ImportOrchestrationService(repository)
    const times = [
      '2026-09-03T07:00:00.000Z',
      '2026-09-03T07:01:00.000Z',
      '2026-09-03T07:06:00.000Z',
      '2026-09-03T07:06:01.000Z',
    ]
    let index = 0

    const result = await service.runExclusive({
      merchantId: 'merchant:shop',
      sourceKey: 'feed:shop',
      owner: 'worker-a',
      token: () => 'token-a',
      now: () => times[Math.min(index++, times.length - 1)],
      execute: async ({ heartbeat }) => {
        await heartbeat()
        expect((await repository.getState({ merchantId: 'merchant:shop', sourceKey: 'feed:shop' }))?.leaseExpiresAt).toBe('2026-09-03T07:15:00.000Z')
        await heartbeat()
        expect((await repository.getState({ merchantId: 'merchant:shop', sourceKey: 'feed:shop' }))?.leaseExpiresAt).toBe('2026-09-03T07:21:00.000Z')
        return 'ok'
      },
    })

    expect(result).toEqual({ status: 'completed', value: 'ok' })
  })
})

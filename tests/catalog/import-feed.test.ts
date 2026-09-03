import { describe, expect, it } from 'vitest'
import { importFeed } from '@/application/catalog/import-feed'
import type { FeedCandidate } from '@/domain/catalog/feed'
import type { Merchant } from '@/domain/catalog/types'
import { InMemoryCatalogRepository } from '@/infrastructure/catalog/in-memory-catalog-repository'
import type { FeedAdapter, FeedPage } from '@/infrastructure/feeds/adapter'

const merchant: Merchant = {
  id: 'merchant:test-store',
  slug: 'test-store',
  name: 'Test Store',
  websiteUrl: 'https://merchant.example',
  isActive: true,
}

function candidate(overrides: Partial<FeedCandidate> = {}): FeedCandidate {
  return {
    sourceKey: 'test-feed',
    merchantProductId: 'SKU-1',
    title: 'Test product',
    brand: 'TestBrand',
    gtin: '8712345678901',
    imageUrls: [],
    price: { amount: '10.00', currency: 'EUR' },
    availability: 'in_stock',
    productUrl: 'https://merchant.example/product',
    affiliateUrl: 'https://affiliate.example/click',
    importedAt: '2026-09-03T04:00:00.000Z',
    ...overrides,
  }
}

class StaticFeedAdapter implements FeedAdapter {
  readonly sourceKey = 'test-feed'
  constructor(private readonly items: FeedCandidate[]) {}

  async fetchPage(): Promise<FeedPage> {
    return { items: this.items }
  }
}

describe('importFeed', () => {
  it('imports valid records and completes cleanly', async () => {
    const repository = new InMemoryCatalogRepository()
    const result = await importFeed({
      adapter: new StaticFeedAdapter([candidate()]),
      repository,
      merchant,
      now: () => '2026-09-03T05:00:00.000Z',
    })

    expect(result.imported).toBe(1)
    expect(result.rejected).toBe(0)
    expect(result.importRun.status).toBe('completed')
    expect((await repository.listProducts()).length).toBe(1)
  })

  it('rejects duplicate merchant product IDs in the same run', async () => {
    const repository = new InMemoryCatalogRepository()
    const result = await importFeed({
      adapter: new StaticFeedAdapter([
        candidate(),
        candidate({ title: 'Duplicate row with same merchant identity' }),
      ]),
      repository,
      merchant,
      now: () => '2026-09-03T05:01:00.000Z',
    })

    expect(result.imported).toBe(1)
    expect(result.rejected).toBe(1)
    expect(result.importRun.status).toBe('completed_with_errors')
    expect(await repository.listImportRejects(result.importRun.id)).toHaveLength(1)
  })

  it('keeps invalid feed records out of the catalog while retaining diagnostics', async () => {
    const repository = new InMemoryCatalogRepository()
    const result = await importFeed({
      adapter: new StaticFeedAdapter([
        candidate({ title: '', affiliateUrl: 'http://unsafe.example/click' }),
      ]),
      repository,
      merchant,
      now: () => '2026-09-03T05:02:00.000Z',
    })

    expect(result.imported).toBe(0)
    expect(result.rejected).toBe(1)
    expect(await repository.listProducts()).toHaveLength(0)
    const rejects = await repository.listImportRejects(result.importRun.id)
    expect(rejects[0]?.reasons).toEqual(expect.arrayContaining(['Title is required.', 'Affiliate URL must use HTTPS.']))
  })

  it('queues weak source-identity matching for review', async () => {
    const repository = new InMemoryCatalogRepository()
    const result = await importFeed({
      adapter: new StaticFeedAdapter([
        candidate({ gtin: undefined, brand: undefined, mpn: undefined }),
      ]),
      repository,
      merchant,
      now: () => '2026-09-03T05:03:00.000Z',
    })

    expect(result.imported).toBe(1)
    expect(result.reviewRequired).toBe(1)
    expect(result.importRun.status).toBe('completed_with_errors')
    expect(await repository.listPendingMatchReviews()).toHaveLength(1)
  })

  it('deactivates offers that disappear only after a later successful feed run', async () => {
    const repository = new InMemoryCatalogRepository()

    await importFeed({
      adapter: new StaticFeedAdapter([
        candidate(),
        candidate({
          merchantProductId: 'SKU-2',
          title: 'Second product',
          gtin: '8712345678902',
          productUrl: 'https://merchant.example/product-2',
          affiliateUrl: 'https://affiliate.example/click-2',
        }),
      ]),
      repository,
      merchant,
      now: () => '2026-09-03T05:04:00.000Z',
    })

    const secondProductBefore = (await repository.listProducts()).find((product) => product.gtin === '8712345678902')
    expect(secondProductBefore).toBeDefined()
    expect((await repository.getProductBySlug(secondProductBefore!.slug))?.offers).toHaveLength(1)

    const secondRun = await importFeed({
      adapter: new StaticFeedAdapter([candidate()]),
      repository,
      merchant,
      now: () => '2026-09-03T05:05:00.000Z',
    })

    expect(secondRun.offersDeactivated).toBe(1)
    expect((await repository.getProductBySlug(secondProductBefore!.slug))?.offers).toHaveLength(0)
  })
})

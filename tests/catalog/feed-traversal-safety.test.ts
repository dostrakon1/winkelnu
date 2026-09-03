import { describe, expect, it } from 'vitest'
import { importFeed } from '@/application/catalog/import-feed'
import { FeedTraversalSafetyError } from '@/application/catalog/feed-traversal-guard'
import type { Merchant } from '@/domain/catalog/types'
import { InMemoryCatalogRepository } from '@/infrastructure/catalog/in-memory-catalog-repository'
import type { FeedAdapter } from '@/infrastructure/feeds/adapter'

const merchant: Merchant = {
  id: 'merchant:safety',
  slug: 'safety',
  name: 'Safety Store',
  websiteUrl: 'https://safety.example',
  isActive: true,
}

function emptyAdapter(next: (cursor?: string) => string | undefined): FeedAdapter {
  return {
    sourceKey: 'safety-feed',
    async fetchPage({ cursor } = {}) {
      return { items: [], nextCursor: next(cursor) }
    },
  }
}

describe('feed traversal safety', () => {
  it('fails closed when a provider repeats a pagination cursor', async () => {
    const repository = new InMemoryCatalogRepository()
    const adapter = emptyAdapter(() => 'same-cursor')

    await expect(importFeed({
      adapter,
      repository,
      merchant,
      now: () => '2026-09-03T08:00:00.000Z',
    })).rejects.toBeInstanceOf(FeedTraversalSafetyError)

    const runs = await repository.listImportRuns()
    expect(runs[0]?.status).toBe('failed')
    expect(runs[0]?.errorSummary[0]).toContain('repeated cursor')
  })

  it('stops before fetching beyond the configured page budget', async () => {
    const repository = new InMemoryCatalogRepository()
    let page = 0
    const adapter = emptyAdapter(() => `page-${++page}`)

    await expect(importFeed({
      adapter,
      repository,
      merchant,
      now: () => '2026-09-03T08:01:00.000Z',
      traversalLimits: { maxPages: 2 },
    })).rejects.toThrow('maximum of 2 pages')
  })

  it('stops when the wall-clock runtime budget is exhausted', async () => {
    const repository = new InMemoryCatalogRepository()
    const times = [0, 0, 1_500]
    let index = 0

    await expect(importFeed({
      adapter: emptyAdapter((cursor) => cursor ? 'page-2' : 'page-1'),
      repository,
      merchant,
      now: () => '2026-09-03T08:02:00.000Z',
      traversalLimits: {
        maxRuntimeMs: 1_000,
        monotonicNow: () => times[Math.min(index++, times.length - 1)]!,
      },
    })).rejects.toThrow('runtime budget')
  })
})

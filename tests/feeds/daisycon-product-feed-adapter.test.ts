import { describe, expect, it, vi } from 'vitest'
import { DaisyconProductFeedAdapter } from '@/infrastructure/feeds/daisycon/daisycon-product-feed-adapter'
import { mapDaisyconStandardProductRecord } from '@/infrastructure/feeds/daisycon/register-daisycon-adapter'

function jsonResponse(payload: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(payload), {
    status: init?.status ?? 200,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  })
}

describe('DaisyconProductFeedAdapter', () => {
  it('maps JSON records and follows X-Next-Url on the same origin', async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(jsonResponse([{ id: '1', name: 'Product A', price: '9.95', product_url: 'https://shop.example/a', deeplink: 'https://track.example/a' }], {
        headers: { 'x-next-url': 'https://feeds.example.test/feed?page=2' },
      }))
      .mockResolvedValueOnce(jsonResponse([{ id: '2', name: 'Product B', price: '19.95', product_url: 'https://shop.example/b', deeplink: 'https://track.example/b' }]))

    const adapter = new DaisyconProductFeedAdapter({
      sourceKey: 'daisycon-demo',
      feedUrl: 'https://feeds.example.test/feed?records=100',
      fetchImpl,
      mapRecord: mapDaisyconStandardProductRecord,
      now: () => '2026-09-03T05:00:00.000Z',
    })

    const first = await adapter.fetchPage()
    const second = await adapter.fetchPage({ cursor: first.nextCursor })

    expect(first.items[0]?.merchantProductId).toBe('1')
    expect(first.nextCursor).toBe('https://feeds.example.test/feed?page=2')
    expect(second.items[0]?.title).toBe('Product B')
  })

  it('retries 429 responses and respects Retry-After without exceeding the configured cap', async () => {
    const sleep = vi.fn().mockResolvedValue(undefined)
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(jsonResponse({}, { status: 429, headers: { 'retry-after': '30' } }))
      .mockResolvedValueOnce(jsonResponse([]))

    const adapter = new DaisyconProductFeedAdapter({
      sourceKey: 'daisycon-demo',
      feedUrl: 'https://feeds.example.test/feed',
      fetchImpl,
      sleep,
      mapRecord: mapDaisyconStandardProductRecord,
      maxRetries: 2,
      maxRetryAfterMs: 5000,
    })

    await expect(adapter.fetchPage()).resolves.toMatchObject({ items: [] })
    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(sleep).toHaveBeenCalledWith(5000)
  })

  it('rejects pagination redirects to another origin', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse([], {
      headers: { 'x-next-url': 'https://evil.example/steal' },
    }))

    const adapter = new DaisyconProductFeedAdapter({
      sourceKey: 'daisycon-demo',
      feedUrl: 'https://feeds.example.test/feed',
      fetchImpl,
      mapRecord: mapDaisyconStandardProductRecord,
    })

    await expect(adapter.fetchPage()).rejects.toThrow('changed origin')
  })

  it('fails closed for unsupported response shapes and non-retryable errors', async () => {
    const badShape = new DaisyconProductFeedAdapter({
      sourceKey: 'daisycon-demo',
      feedUrl: 'https://feeds.example.test/feed',
      fetchImpl: async () => jsonResponse({ unexpected: true }),
      mapRecord: mapDaisyconStandardProductRecord,
    })
    await expect(badShape.fetchPage()).rejects.toThrow('Unsupported Daisycon JSON product-feed response shape')

    const unauthorized = new DaisyconProductFeedAdapter({
      sourceKey: 'daisycon-demo',
      feedUrl: 'https://feeds.example.test/feed',
      fetchImpl: async () => jsonResponse({}, { status: 401 }),
      mapRecord: mapDaisyconStandardProductRecord,
    })
    await expect(unauthorized.fetchPage()).rejects.toThrow('HTTP 401')
  })
})

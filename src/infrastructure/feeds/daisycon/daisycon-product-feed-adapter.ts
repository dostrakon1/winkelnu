import type { FeedCandidate } from '@/domain/catalog/feed'
import type { FeedAdapter, FeedPage } from '@/infrastructure/feeds/adapter'

export type DaisyconRecordMapper = (record: unknown, context: { sourceKey: string; importedAt: string }) => FeedCandidate
export type DaisyconRecordExtractor = (payload: unknown) => unknown[]
export type DaisyconFetch = (input: string, init?: RequestInit) => Promise<Response>
export type DaisyconSleep = (milliseconds: number) => Promise<void>

export type DaisyconProductFeedAdapterOptions = {
  sourceKey: string
  feedUrl: string
  mapRecord: DaisyconRecordMapper
  extractRecords?: DaisyconRecordExtractor
  fetchImpl?: DaisyconFetch
  sleep?: DaisyconSleep
  now?: () => string
  maxRetries?: number
  maxRetryAfterMs?: number
}

function defaultExtractRecords(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object') {
    const value = payload as Record<string, unknown>
    if (Array.isArray(value.products)) return value.products
    if (Array.isArray(value.items)) return value.items
  }
  throw new Error('Unsupported Daisycon JSON product-feed response shape.')
}

function requireHttpsUrl(value: string, context: string): URL {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${context} must be a valid URL.`)
  }
  if (url.protocol !== 'https:') throw new Error(`${context} must use HTTPS.`)
  return url
}

function retryAfterMilliseconds(response: Response, maximum: number): number {
  const raw = response.headers.get('retry-after')
  if (!raw) return Math.min(1000, maximum)
  const seconds = Number(raw)
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, maximum)

  const date = Date.parse(raw)
  if (Number.isFinite(date)) return Math.min(Math.max(0, date - Date.now()), maximum)
  return Math.min(1000, maximum)
}

export class DaisyconProductFeedAdapter implements FeedAdapter {
  readonly sourceKey: string
  private readonly initialUrl: URL
  private readonly mapRecord: DaisyconRecordMapper
  private readonly extractRecords: DaisyconRecordExtractor
  private readonly fetchImpl: DaisyconFetch
  private readonly sleep: DaisyconSleep
  private readonly now: () => string
  private readonly maxRetries: number
  private readonly maxRetryAfterMs: number

  constructor(options: DaisyconProductFeedAdapterOptions) {
    if (!options.sourceKey.trim()) throw new Error('Daisycon sourceKey is required.')
    this.sourceKey = options.sourceKey
    this.initialUrl = requireHttpsUrl(options.feedUrl, 'Daisycon feedUrl')
    this.mapRecord = options.mapRecord
    this.extractRecords = options.extractRecords ?? defaultExtractRecords
    this.fetchImpl = options.fetchImpl ?? fetch
    this.sleep = options.sleep ?? ((milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)))
    this.now = options.now ?? (() => new Date().toISOString())
    this.maxRetries = Math.max(0, Math.min(5, Math.trunc(options.maxRetries ?? 2)))
    this.maxRetryAfterMs = Math.max(0, Math.min(60_000, Math.trunc(options.maxRetryAfterMs ?? 15_000)))
  }

  private pageUrl(cursor?: string): URL {
    if (!cursor) return this.initialUrl
    const next = requireHttpsUrl(cursor, 'Daisycon pagination URL')
    if (next.origin !== this.initialUrl.origin) {
      throw new Error('Daisycon pagination URL changed origin and was rejected.')
    }
    return next
  }

  private async request(url: URL): Promise<Response> {
    let attempt = 0
    while (true) {
      const response = await this.fetchImpl(url.toString(), {
        method: 'GET',
        headers: { accept: 'application/json' },
        redirect: 'error',
      })

      if (response.ok) return response

      const retryable = response.status === 429 || response.status >= 500
      if (!retryable || attempt >= this.maxRetries) {
        throw new Error(`Daisycon product feed request failed with HTTP ${response.status}.`)
      }

      attempt += 1
      await this.sleep(retryAfterMilliseconds(response, this.maxRetryAfterMs))
    }
  }

  async fetchPage(input?: { cursor?: string }): Promise<FeedPage> {
    const url = this.pageUrl(input?.cursor)
    const response = await this.request(url)
    const payload: unknown = await response.json()
    const importedAt = this.now()
    const items = this.extractRecords(payload).map((record) => this.mapRecord(record, {
      sourceKey: this.sourceKey,
      importedAt,
    }))

    const nextHeader = response.headers.get('x-next-url')?.trim()
    let nextCursor: string | undefined
    if (nextHeader) {
      nextCursor = this.pageUrl(nextHeader).toString()
    }

    return { items, nextCursor }
  }
}

export type FeedTraversalLimits = {
  maxPages?: number
  maxRuntimeMs?: number
  monotonicNow?: () => number
}

export class FeedTraversalSafetyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FeedTraversalSafetyError'
  }
}

export class FeedTraversalGuard {
  private readonly maxPages: number
  private readonly maxRuntimeMs: number
  private readonly monotonicNow: () => number
  private readonly startedAt: number
  private readonly seenCursors = new Set<string>()
  private pagesFetched = 0

  constructor(limits: FeedTraversalLimits = {}) {
    this.maxPages = Math.min(Math.max(Math.floor(limits.maxPages ?? 10_000), 1), 100_000)
    this.maxRuntimeMs = Math.min(Math.max(Math.floor(limits.maxRuntimeMs ?? 30 * 60_000), 1_000), 6 * 60 * 60_000)
    this.monotonicNow = limits.monotonicNow ?? (() => Date.now())
    this.startedAt = this.monotonicNow()
  }

  beforeFetch(): void {
    if (this.pagesFetched >= this.maxPages) {
      throw new FeedTraversalSafetyError(`Feed traversal exceeded the maximum of ${this.maxPages} pages.`)
    }
    if (this.monotonicNow() - this.startedAt >= this.maxRuntimeMs) {
      throw new FeedTraversalSafetyError(`Feed traversal exceeded the runtime budget of ${this.maxRuntimeMs}ms.`)
    }
  }

  afterFetch(nextCursor?: string): void {
    this.pagesFetched += 1
    if (!nextCursor) return
    if (this.seenCursors.has(nextCursor)) {
      throw new FeedTraversalSafetyError(`Feed traversal repeated cursor: ${nextCursor}`)
    }
    this.seenCursors.add(nextCursor)
  }
}

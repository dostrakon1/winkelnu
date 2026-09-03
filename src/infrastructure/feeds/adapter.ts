import type { FeedCandidate } from '@/domain/catalog/feed'

export type FeedPage = {
  items: FeedCandidate[]
  nextCursor?: string
}

export interface FeedAdapter {
  readonly sourceKey: string
  fetchPage(input?: { cursor?: string }): Promise<FeedPage>
}

export type FeedAdapterFactory = () => FeedAdapter

import type {
  FeedAdapter,
  FeedPage,
} from '@/infrastructure/feeds/adapter'

import type { BolProductFeedTransport } from './bol-product-feed-contract'
import { BolProductFeedAdapter } from './bol-product-feed-adapter'
import { stageBolProductFeedFile } from './bol-product-feed-stager'

export type BolStagedProductFeedAdapterOptions = {
  sourceKey: string
  siteId: string
  fileName: string
  stagingDirectory: string
  transport: BolProductFeedTransport
  pageSize?: number
  now?: () => string
}

export class BolStagedProductFeedAdapter
  implements FeedAdapter
{
  readonly sourceKey: string

  private delegate?: BolProductFeedAdapter
  private preparing?: Promise<BolProductFeedAdapter>

  constructor(
    private readonly options:
      BolStagedProductFeedAdapterOptions,
  ) {
    if (!options.sourceKey.trim()) {
      throw new Error(
        'Bol sourceKey is required.',
      )
    }

    if (!options.siteId.trim()) {
      throw new Error(
        'Bol Site_ID is required.',
      )
    }

    if (!options.fileName.trim()) {
      throw new Error(
        'Bol feed file name is required.',
      )
    }

    if (!options.stagingDirectory.trim()) {
      throw new Error(
        'Bol staging directory is required.',
      )
    }

    this.sourceKey = options.sourceKey
  }

  private async prepare(): Promise<BolProductFeedAdapter> {
    const filePath = await stageBolProductFeedFile(
      this.options.transport,
      {
        fileName: this.options.fileName,
        directory: this.options.stagingDirectory,
      },
    )

    return new BolProductFeedAdapter({
      sourceKey: this.sourceKey,
      filePath,
      siteId: this.options.siteId,
      pageSize: this.options.pageSize,
      now: this.options.now,
    })
  }

  private async getDelegate(): Promise<BolProductFeedAdapter> {
    if (this.delegate) {
      return this.delegate
    }

    this.preparing ??= this.prepare()

    try {
      this.delegate = await this.preparing
      return this.delegate
    } finally {
      this.preparing = undefined
    }
  }

  async fetchPage(
    input?: { cursor?: string },
  ): Promise<FeedPage> {
    const delegate = await this.getDelegate()
    return delegate.fetchPage(input)
  }
}

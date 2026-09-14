import { createReadStream } from 'node:fs'
import { createGunzip } from 'node:zlib'
import { parse } from 'csv-parse'

import type {
  FeedAdapter,
  FeedPage,
} from '@/infrastructure/feeds/adapter'

import {
  mapBolProductRecord,
  type BolProductFeedRecord,
} from './map-bol-product-record'

export type BolProductFeedAdapterOptions = {
  sourceKey: string
  filePath: string
  siteId: string
  pageSize?: number
  now?: () => string
}

export class BolProductFeedAdapter implements FeedAdapter {
  readonly sourceKey: string

  private readonly pageSize: number
  private readonly now: () => string

  private iterator?: AsyncIterator<BolProductFeedRecord>
  private nextPageNumber = 0
  private finished = false

  constructor(
    private readonly options: BolProductFeedAdapterOptions,
  ) {
    if (!options.sourceKey.trim()) {
      throw new Error('Bol sourceKey is required.')
    }

    if (!options.filePath.trim()) {
      throw new Error('Bol filePath is required.')
    }

    if (!options.siteId.trim()) {
      throw new Error('Bol siteId is required.')
    }

    this.sourceKey = options.sourceKey

    this.pageSize = Math.max(
      1,
      Math.min(5000, Math.trunc(options.pageSize ?? 500)),
    )

    this.now = options.now ?? (() => new Date().toISOString())
  }

  private createIterator(): AsyncIterator<BolProductFeedRecord> {
    const source = createReadStream(this.options.filePath)

    const input = this.options.filePath.endsWith('.gz')
      ? source.pipe(createGunzip())
      : source

    const parser = input.pipe(
      parse({
        columns: true,
        delimiter: '|',
        quote: '"',
        bom: true,
        skip_empty_lines: true,
      }),
    )

    return parser[Symbol.asyncIterator]() as AsyncIterator<BolProductFeedRecord>
  }

  async fetchPage(
    input?: { cursor?: string },
  ): Promise<FeedPage> {
    if (this.finished) {
      return { items: [] }
    }

    const expectedCursor =
      this.nextPageNumber === 0
        ? undefined
        : String(this.nextPageNumber)

    if (input?.cursor !== expectedCursor) {
      throw new Error(
        `Unexpected Bol feed cursor: expected ${
          expectedCursor ?? 'start'
        }, received ${input?.cursor ?? 'start'}.`,
      )
    }

    this.iterator ??= this.createIterator()

    const importedAt = this.now()
    const items = []

    while (items.length < this.pageSize) {
      const result = await this.iterator.next()

      if (result.done) {
        this.finished = true
        break
      }

      const record = result.value

      if (!record['OfferNL.sellingPrice']?.trim()) {
        continue
      }

      items.push(
        mapBolProductRecord(record, {
          sourceKey: this.sourceKey,
          siteId: this.options.siteId,
          importedAt,
        }),
      )
    }

    if (this.finished) {
      return { items }
    }

    this.nextPageNumber += 1

    return {
      items,
      nextCursor: String(this.nextPageNumber),
    }
  }
}

import { writeFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'

import type {
  BolProductFeedFile,
  BolProductFeedTransport,
} from './bol-product-feed-contract'
import { BolStagedProductFeedAdapter } from './bol-staged-product-feed-adapter'

function makeFeed(): Buffer {
  const headers = [
    'productId',
    'title',
    'productPageUrlNL',
    'OfferNL.sellingPrice',
    'OfferNL.isDeliverable',
  ]

  const rows = [1, 2, 3].map((index) => [
    `930000000000000${index}`,
    `Staged product ${index}`,
    `https://www.bol.com/nl/nl/p/staged-product-${index}/930000000000000${index}/`,
    `${10 + index}.00`,
    'Y',
  ])

  const csv = [
    headers.map((value) => `"${value}"`).join('|'),
    ...rows.map((row) =>
      row.map((value) => `"${value}"`).join('|'),
    ),
    '',
  ].join('\n')

  return gzipSync(csv)
}

class FakeBolTransport
  implements BolProductFeedTransport
{
  listCount = 0
  downloadCount = 0

  async listFiles(): Promise<BolProductFeedFile[]> {
    this.listCount += 1

    return [
      {
        fileName:
          'product-feed_gift-cards-v2.csv.gz',
        format: 'csv',
        compression: 'gzip',
      },
    ]
  }

  async downloadFile(
    fileName: string,
    destinationPath: string,
  ): Promise<void> {
    this.downloadCount += 1

    expect(fileName).toBe(
      'product-feed_gift-cards-v2.csv.gz',
    )

    await writeFile(
      destinationPath,
      makeFeed(),
    )
  }
}

describe('BolStagedProductFeedAdapter', () => {
  it('stages once and reuses the feed across pages', async () => {
    const directory = await mkdtemp(
      join(tmpdir(), 'winkelnu-bol-staged-adapter-'),
    )

    try {
      const transport = new FakeBolTransport()

      const adapter =
        new BolStagedProductFeedAdapter({
          sourceKey: 'bol:product-feed:nl',
          siteId: '1542789',
          fileName:
            'product-feed_gift-cards-v2.csv.gz',
          stagingDirectory: directory,
          transport,
          pageSize: 2,
          now: () =>
            '2026-09-14T21:00:00.000Z',
        })

      const page1 = await adapter.fetchPage()

      expect(page1.items).toHaveLength(2)
      expect(page1.nextCursor).toBe('1')

      const page2 = await adapter.fetchPage({
        cursor: page1.nextCursor,
      })

      expect(page2.items).toHaveLength(1)
      expect(page2.nextCursor).toBeUndefined()

      expect(transport.listCount).toBe(1)
      expect(transport.downloadCount).toBe(1)

      const items = [
        ...page1.items,
        ...page2.items,
      ]

      expect(items).toHaveLength(3)
      expect(items[0]?.price.amount).toBe('11.00')
      expect(items[2]?.price.amount).toBe('13.00')

      for (const item of items) {
        expect(
          new URL(item.affiliateUrl).hostname,
        ).toBe('partner.bol.com')
      }
    } finally {
      await rm(directory, {
        recursive: true,
        force: true,
      })
    }
  })
})

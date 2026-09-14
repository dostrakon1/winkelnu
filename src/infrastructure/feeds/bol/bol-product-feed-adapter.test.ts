import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'

import { BolProductFeedAdapter } from './bol-product-feed-adapter'

function csvField(value: string): string {
  return `"${value.replaceAll('"', '""')}"`
}

function makeRow(index: number): string {
  const productId = `930000000000000${index}`
  const ean = `871000000000${index}`

  const title =
    index === 3
      ? 'Test | product "3"'
      : `Test product ${index}`

  return [
    productId,
    ean,
    title,
    `https://www.bol.com/nl/nl/p/test-product-${index}/${productId}/`,
    `https://media.s-bol.com/test-${index}.jpg`,
    'Testmerk',
    `${10 + index}.00`,
    '0.00',
    'Y',
    'Test Category',
    `<p>Beschrijving ${index}</p>`,
  ]
    .map(csvField)
    .join('|')
}

function makeFeed(): string {
  const headers = [
    'productId',
    'ean',
    'title',
    'productPageUrlNL',
    'imageUrl',
    'brand',
    'OfferNL.sellingPrice',
    'OfferNL.shippingCost',
    'OfferNL.isDeliverable',
    'Category.productgroup',
    'description',
  ]

  const rows = Array.from(
    { length: 7 },
    (_, index) => makeRow(index + 1),
  )

  return [
    headers.map(csvField).join('|'),
    ...rows,
    '',
  ].join('\n')
}

describe('BolProductFeedAdapter', () => {
  it('streams a gzip feed in consecutive pages', async () => {
    const directory = await mkdtemp(
      join(tmpdir(), 'winkelnu-bol-feed-'),
    )

    try {
      const filePath = join(directory, 'product-feed_test-v2.csv.gz')

      await writeFile(
        filePath,
        gzipSync(makeFeed()),
      )

      const adapter = new BolProductFeedAdapter({
        sourceKey: 'bol:product-feed:nl',
        filePath,
        siteId: '1542789',
        pageSize: 3,
        now: () => '2026-09-14T20:00:00.000Z',
      })

      const page1 = await adapter.fetchPage()
      const page2 = await adapter.fetchPage({
        cursor: page1.nextCursor,
      })
      const page3 = await adapter.fetchPage({
        cursor: page2.nextCursor,
      })

      expect(page1.items).toHaveLength(3)
      expect(page2.items).toHaveLength(3)
      expect(page3.items).toHaveLength(1)

      expect(page1.nextCursor).toBe('1')
      expect(page2.nextCursor).toBe('2')
      expect(page3.nextCursor).toBeUndefined()

      const items = [
        ...page1.items,
        ...page2.items,
        ...page3.items,
      ]

      expect(items).toHaveLength(7)
      expect(
        new Set(items.map((item) => item.merchantProductId)).size,
      ).toBe(7)

      expect(items[2]?.title).toBe('Test | product "3"')
      expect(items[0]?.price.amount).toBe('11.00')
      expect(items[0]?.availability).toBe('available')

      const affiliateUrl = new URL(items[0]!.affiliateUrl)

      expect(affiliateUrl.hostname).toBe('partner.bol.com')
      expect(affiliateUrl.searchParams.get('s')).toBe('1542789')
      expect(affiliateUrl.searchParams.get('f')).toBe('PF')
    } finally {
      await rm(directory, {
        recursive: true,
        force: true,
      })
    }
  })
})

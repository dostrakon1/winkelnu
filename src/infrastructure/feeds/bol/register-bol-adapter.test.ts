import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'

import { PartnerFeedAdapterRegistry } from '@/infrastructure/feeds/partner-adapter-registry'

import type {
  BolProductFeedFile,
  BolProductFeedTransport,
} from './bol-product-feed-contract'
import {
  registerBolCsvAdapter,
  resolveBolFeedFileName,
} from './register-bol-adapter'

function makeFeed(): Buffer {
  const csv = [
    [
      'productId',
      'title',
      'productPageUrlNL',
      'OfferNL.sellingPrice',
      'OfferNL.isDeliverable',
    ]
      .map((value) => `"${value}"`)
      .join('|'),
    [
      '9300000116791172',
      'Registry test product',
      'https://www.bol.com/nl/nl/p/registry-test/9300000116791172/',
      '25.00',
      'Y',
    ]
      .map((value) => `"${value}"`)
      .join('|'),
    '',
  ].join('\n')

  return gzipSync(csv)
}

class FakeBolTransport
  implements BolProductFeedTransport
{
  listCount = 0
  downloadCount = 0
  downloadedFileName?: string

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
    this.downloadedFileName = fileName

    await writeFile(
      destinationPath,
      makeFeed(),
    )
  }
}

function resolvedBolSource() {
  return {
    source: {
      sourceKey: 'bol:gift-cards:nl',
      merchantId: 'merchant:bol',
      sourceType: 'csv' as const,
      integrationId: 'integration:bol',
      isActive: true,
    },
    integration: {
      id: 'integration:bol',
      merchantId: 'merchant:bol',
      kind: 'marketplace' as const,
      networkId: 'network:bol',
      status: 'active' as const,
      trackingConfig: {
        siteId: '1542789',
      },
    },
    network: {
      id: 'network:bol',
      slug: 'bol',
      name: 'bol',
      kind: 'marketplace' as const,
      websiteUrl: 'https://partner.bol.com/',
      isActive: true,
    },
  }
}

describe('registerBolCsvAdapter', () => {
  it('resolves the Bol source key to the real feed filename', () => {
    expect(
      resolveBolFeedFileName(
        'bol:gift-cards:nl',
      ),
    ).toBe(
      'product-feed_gift-cards-v2.csv.gz',
    )
  })

  it('stages and creates the Bol adapter through the registry', async () => {
    const directory = await mkdtemp(
      join(tmpdir(), 'winkelnu-bol-registry-'),
    )

    try {
      const transport = new FakeBolTransport()

      const registry =
        new PartnerFeedAdapterRegistry()

      registerBolCsvAdapter(registry, {
        stagingDirectory: directory,
        createTransport: ({ resolved }) => {
          expect(
            resolved.source.sourceKey,
          ).toBe('bol:gift-cards:nl')

          return transport
        },
      })

      const adapter = registry.create(
        resolvedBolSource(),
      )

      expect(adapter.sourceKey).toBe(
        'bol:gift-cards:nl',
      )

      const page = await adapter.fetchPage()

      expect(page.items).toHaveLength(1)
      expect(page.nextCursor).toBeUndefined()

      expect(transport.listCount).toBe(1)
      expect(transport.downloadCount).toBe(1)
      expect(
        transport.downloadedFileName,
      ).toBe(
        'product-feed_gift-cards-v2.csv.gz',
      )

      expect(
        page.items[0]?.merchantProductId,
      ).toBe('9300000116791172')

      expect(
        page.items[0]?.price.amount,
      ).toBe('25.00')

      const affiliateUrl = new URL(
        page.items[0]!.affiliateUrl,
      )

      expect(
        affiliateUrl.searchParams.get('s'),
      ).toBe('1542789')
    } finally {
      await rm(directory, {
        recursive: true,
        force: true,
      })
    }
  })
})

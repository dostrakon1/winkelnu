import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'

import { PartnerFeedAdapterRegistry } from '@/infrastructure/feeds/partner-adapter-registry'

import { registerBolCsvAdapter } from './register-bol-adapter'

function makeFeed(): string {
  return [
    [
      'productId',
      'title',
      'productPageUrlNL',
      'OfferNL.sellingPrice',
      'OfferNL.isDeliverable',
    ].map((value) => `"${value}"`).join('|'),
    [
      '9300000116791172',
      'Registry test product',
      'https://www.bol.com/nl/nl/p/registry-test/9300000116791172/',
      '25.00',
      'Y',
    ].map((value) => `"${value}"`).join('|'),
    '',
  ].join('\n')
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
  it('creates a Bol CSV adapter through the partner registry', async () => {
    const directory = await mkdtemp(
      join(tmpdir(), 'winkelnu-bol-registry-'),
    )

    try {
      const filePath = join(
        directory,
        'product-feed_test-v2.csv.gz',
      )

      await writeFile(
        filePath,
        gzipSync(makeFeed()),
      )

      const registry = new PartnerFeedAdapterRegistry()

      registerBolCsvAdapter(registry, {
        resolveFilePath: (sourceKey) => {
          expect(sourceKey).toBe('bol:gift-cards:nl')
          return filePath
        },
      })

      const adapter = registry.create(
        resolvedBolSource(),
      )

      expect(adapter.sourceKey).toBe('bol:gift-cards:nl')

      const page = await adapter.fetchPage()

      expect(page.items).toHaveLength(1)
      expect(page.nextCursor).toBeUndefined()
      expect(page.items[0]?.merchantProductId).toBe(
        '9300000116791172',
      )
      expect(page.items[0]?.price.amount).toBe('25.00')

      const affiliateUrl = new URL(
        page.items[0]!.affiliateUrl,
      )

      expect(affiliateUrl.searchParams.get('s')).toBe(
        '1542789',
      )
    } finally {
      await rm(directory, {
        recursive: true,
        force: true,
      })
    }
  })
})

import { describe, expect, it } from 'vitest'

import { PartnerFeedAdapterRegistry } from '@/infrastructure/feeds/partner-adapter-registry'

import { registerProductionBolAdapter } from './register-production-bol-adapter'

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
      websiteUrl:
        'https://partner.bol.com/',
      isActive: true,
    },
  }
}

describe(
  'registerProductionBolAdapter',
  () => {
    it('keeps Bol disabled by default', () => {
      const registry =
        new PartnerFeedAdapterRegistry()

      expect(
        registerProductionBolAdapter(
          registry,
          {},
        ),
      ).toBe(false)

      expect(() =>
        registry.create(
          resolvedBolSource(),
        ),
      ).toThrow(
        'No feed adapter registered for bol:csv',
      )
    })

    it('requires a staging directory when enabled', () => {
      const registry =
        new PartnerFeedAdapterRegistry()

      expect(() =>
        registerProductionBolAdapter(
          registry,
          {
            BOL_PRODUCT_FEED_IMPORT_ENABLED:
              'true',
          },
        ),
      ).toThrow(
        'BOL_PRODUCT_FEED_STAGING_DIR is missing',
      )
    })

    it('registers Bol but still fails closed without credentials', () => {
      const registry =
        new PartnerFeedAdapterRegistry()

      expect(
        registerProductionBolAdapter(
          registry,
          {
            BOL_PRODUCT_FEED_IMPORT_ENABLED:
              'true',
            BOL_PRODUCT_FEED_STAGING_DIR:
              '/tmp/winkelnu-bol-test',
          },
        ),
      ).toBe(true)

      expect(() =>
        registry.create(
          resolvedBolSource(),
        ),
      ).toThrow(
        'Bol product feed credentials are missing.',
      )
    })
  },
)

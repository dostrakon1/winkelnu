import type { PartnerFeedAdapterRegistry } from '@/infrastructure/feeds/partner-adapter-registry'

import { BolProductFeedAdapter } from './bol-product-feed-adapter'

export type BolAdapterRegistration = {
  resolveFilePath: (sourceKey: string) => string
  pageSize?: number
}

export function registerBolCsvAdapter(
  registry: PartnerFeedAdapterRegistry,
  registration: BolAdapterRegistration,
): void {
  registry.register('bol:csv', ({ resolved }) => {
    const siteId =
      resolved.integration?.trackingConfig.siteId?.trim()

    if (!siteId) {
      throw new Error(
        'Bol Site_ID tracking configuration is missing.',
      )
    }

    const filePath = registration
      .resolveFilePath(resolved.source.sourceKey)
      .trim()

    if (!filePath) {
      throw new Error(
        `Bol product feed file is missing for ${resolved.source.sourceKey}.`,
      )
    }

    return new BolProductFeedAdapter({
      sourceKey: resolved.source.sourceKey,
      filePath,
      siteId,
      pageSize: registration.pageSize,
    })
  })
}

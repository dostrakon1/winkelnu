import type { ResolvedPartnerFeedSource } from '@/application/affiliate/feed-source-resolver'
import type { PartnerFeedAdapterRegistry } from '@/infrastructure/feeds/partner-adapter-registry'

import type { BolProductFeedTransport } from './bol-product-feed-contract'
import { BolStagedProductFeedAdapter } from './bol-staged-product-feed-adapter'

export type BolTransportFactoryContext = {
  resolved: ResolvedPartnerFeedSource
  credential?: string
}

export type BolAdapterRegistration = {
  stagingDirectory: string
  createTransport: (
    context: BolTransportFactoryContext,
  ) => BolProductFeedTransport
  pageSize?: number
}

export function resolveBolFeedFileName(
  sourceKey: string,
): string {
  const match =
    /^bol:([a-z0-9-]+):nl$/i.exec(
      sourceKey.trim(),
    )

  if (!match?.[1]) {
    throw new Error(
      `Invalid Bol feed source key: ${sourceKey}`,
    )
  }

  return `product-feed_${match[1]}-v2.csv.gz`
}

export function registerBolCsvAdapter(
  registry: PartnerFeedAdapterRegistry,
  registration: BolAdapterRegistration,
): void {
  const stagingDirectory =
    registration.stagingDirectory.trim()

  if (!stagingDirectory) {
    throw new Error(
      'Bol staging directory is required.',
    )
  }

  registry.register(
    'bol:csv',
    ({ resolved, credential }) => {
      const siteId =
        resolved.integration
          ?.trackingConfig.siteId
          ?.trim()

      if (!siteId) {
        throw new Error(
          'Bol Site_ID tracking configuration is missing.',
        )
      }

      const fileName =
        resolveBolFeedFileName(
          resolved.source.sourceKey,
        )

      const transport =
        registration.createTransport({
          resolved,
          credential,
        })

      return new BolStagedProductFeedAdapter({
        sourceKey: resolved.source.sourceKey,
        siteId,
        fileName,
        stagingDirectory,
        transport,
        pageSize: registration.pageSize,
      })
    },
  )
}

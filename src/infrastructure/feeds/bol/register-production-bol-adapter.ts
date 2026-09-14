import type { PartnerFeedAdapterRegistry } from '@/infrastructure/feeds/partner-adapter-registry'

import { createBolFtpsProductFeedTransport } from './create-bol-ftps-product-feed-transport'
import { registerBolCsvAdapter } from './register-bol-adapter'

type Environment = Record<
  string,
  string | undefined
>

export function registerProductionBolAdapter(
  registry: PartnerFeedAdapterRegistry,
  env: Environment = process.env,
): boolean {
  if (
    env.BOL_PRODUCT_FEED_IMPORT_ENABLED !==
    'true'
  ) {
    return false
  }

  const stagingDirectory =
    env.BOL_PRODUCT_FEED_STAGING_DIR?.trim()

  if (!stagingDirectory) {
    throw new Error(
      'Bol product feed import is enabled but BOL_PRODUCT_FEED_STAGING_DIR is missing.',
    )
  }

  registerBolCsvAdapter(registry, {
    stagingDirectory,
    createTransport: ({ credential }) =>
      createBolFtpsProductFeedTransport(
        credential,
      ),
  })

  return true
}

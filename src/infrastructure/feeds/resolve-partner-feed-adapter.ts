import { PartnerFeedSourceResolver } from '@/application/affiliate/feed-source-resolver'
import type { AffiliateIntegrationRegistryRepository } from '@/application/affiliate/integration-registry-ports'
import type { FeedAdapter } from './adapter'
import { PartnerFeedAdapterRegistry } from './partner-adapter-registry'

export async function resolvePartnerFeedAdapter(input: {
  sourceKey: string
  merchantId: string
  repository: AffiliateIntegrationRegistryRepository
  adapters: PartnerFeedAdapterRegistry
}): Promise<FeedAdapter | null> {
  const resolver = new PartnerFeedSourceResolver(input.repository)
  const resolved = await resolver.resolve({ sourceKey: input.sourceKey, merchantId: input.merchantId })
  if (!resolved) return null
  return input.adapters.create(resolved)
}

import { AffiliateRedirectService } from '@/application/affiliate/affiliate-redirect-service'
import { assertPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { InMemoryAffiliateAttributionRepository } from '@/infrastructure/affiliate/in-memory-affiliate-attribution-repository'
import { SupabaseAffiliateAttributionRepository } from '@/infrastructure/affiliate/supabase-affiliate-attribution-repository'
import { createSyntheticCatalogRepository } from '@/infrastructure/catalog/synthetic-catalog'

export async function createAffiliateRedirectService(): Promise<AffiliateRedirectService> {
  // No destination resolution or click attribution before public release.
  assertPublicCatalogEnabled()
  const mode = process.env.CATALOG_PERSISTENCE ?? 'memory'

  if (mode === 'memory') {
    const catalog = await createSyntheticCatalogRepository()
    return new AffiliateRedirectService(new InMemoryAffiliateAttributionRepository(catalog))
  }

  if (mode === 'supabase') {
    return new AffiliateRedirectService(new SupabaseAffiliateAttributionRepository())
  }

  throw new Error(`Unsupported CATALOG_PERSISTENCE value: ${mode}`)
}

import { AffiliateRedirectService } from '@/application/affiliate/affiliate-redirect-service'
import { InMemoryAffiliateAttributionRepository } from '@/infrastructure/affiliate/in-memory-affiliate-attribution-repository'
import { SupabaseAffiliateAttributionRepository } from '@/infrastructure/affiliate/supabase-affiliate-attribution-repository'
import { createSyntheticCatalogRepository } from '@/infrastructure/catalog/synthetic-catalog'

export async function createAffiliateRedirectService(): Promise<AffiliateRedirectService> {
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

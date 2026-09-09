import { AffiliateRedirectService } from '@/application/affiliate/affiliate-redirect-service'
import { assertPublicCatalogEnabled, getPublicCatalogMode } from '@/application/catalog/public-catalog-release'
import { InMemoryAffiliateAttributionRepository } from '@/infrastructure/affiliate/in-memory-affiliate-attribution-repository'
import { SupabaseAffiliateAttributionRepository } from '@/infrastructure/affiliate/supabase-affiliate-attribution-repository'
import { createCuratedCatalogRepository } from '@/infrastructure/catalog/curated-catalog'

export async function createAffiliateRedirectService(): Promise<AffiliateRedirectService> {
  assertPublicCatalogEnabled()
  const mode = getPublicCatalogMode()

  // Curated products intentionally have no offers or outbound destinations. The
  // existing redirect service therefore fails closed with offer_not_found.
  if (mode === 'curated') {
    const catalog = await createCuratedCatalogRepository()
    return new AffiliateRedirectService(new InMemoryAffiliateAttributionRepository(catalog))
  }

  if (mode === 'supabase') {
    return new AffiliateRedirectService(new SupabaseAffiliateAttributionRepository())
  }

  throw new Error('No public affiliate redirect mode is available.')
}

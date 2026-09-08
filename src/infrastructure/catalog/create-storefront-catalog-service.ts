import { CatalogService } from '@/application/catalog/catalog-service'
import { ScalableCatalogService } from '@/application/catalog/supabase-scalable-catalog-service'
import { assertPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { createCatalogRepository } from '@/infrastructure/catalog/create-catalog-repository'
import { SupabaseCatalogRankingReadModel } from '@/infrastructure/catalog/supabase-catalog-ranking-read-model'
import { createSyntheticCatalogRepository } from '@/infrastructure/catalog/synthetic-catalog'

export async function createStorefrontCatalogService(): Promise<CatalogService> {
  // Never instantiate a public catalog repository while the release is closed.
  // Internal operator/import services use their own factories and are unaffected.
  assertPublicCatalogEnabled()
  const mode = process.env.CATALOG_PERSISTENCE ?? 'memory'

  if (mode === 'memory') {
    return new CatalogService(await createSyntheticCatalogRepository())
  }

  const repository = createCatalogRepository()
  return new ScalableCatalogService(repository, new SupabaseCatalogRankingReadModel())
}

import { CatalogService } from '@/application/catalog/catalog-service'
import { ScalableCatalogService } from '@/application/catalog/supabase-scalable-catalog-service'
import { createCatalogRepository } from '@/infrastructure/catalog/create-catalog-repository'
import { SupabaseCatalogRankingReadModel } from '@/infrastructure/catalog/supabase-catalog-ranking-read-model'
import { createSyntheticCatalogRepository } from '@/infrastructure/catalog/synthetic-catalog'

export async function createStorefrontCatalogService(): Promise<CatalogService> {
  const mode = process.env.CATALOG_PERSISTENCE ?? 'memory'

  if (mode === 'memory') {
    return new CatalogService(await createSyntheticCatalogRepository())
  }

  const repository = createCatalogRepository()
  return new ScalableCatalogService(repository, new SupabaseCatalogRankingReadModel())
}

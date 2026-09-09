import { CatalogService } from '@/application/catalog/catalog-service'
import { ScalableCatalogService } from '@/application/catalog/supabase-scalable-catalog-service'
import { assertPublicCatalogEnabled, getPublicCatalogMode } from '@/application/catalog/public-catalog-release'
import { createCatalogRepository } from '@/infrastructure/catalog/create-catalog-repository'
import { createCuratedCatalogRepository } from '@/infrastructure/catalog/curated-catalog'
import { SupabaseCatalogRankingReadModel } from '@/infrastructure/catalog/supabase-catalog-ranking-read-model'

export async function createStorefrontCatalogService(): Promise<CatalogService> {
  assertPublicCatalogEnabled()
  const mode = getPublicCatalogMode()

  if (mode === 'curated') {
    return new CatalogService(await createCuratedCatalogRepository())
  }

  if (mode === 'supabase') {
    const repository = createCatalogRepository()
    return new ScalableCatalogService(repository, new SupabaseCatalogRankingReadModel())
  }

  throw new Error('No public catalog mode is available.')
}

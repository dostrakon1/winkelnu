import { CatalogService } from '@/application/catalog/catalog-service'
import { createCatalogRepository } from '@/infrastructure/catalog/create-catalog-repository'
import { createSyntheticCatalogRepository } from '@/infrastructure/catalog/synthetic-catalog'

export async function createStorefrontCatalogService(): Promise<CatalogService> {
  const mode = process.env.CATALOG_PERSISTENCE ?? 'memory'

  if (mode === 'memory') {
    return new CatalogService(await createSyntheticCatalogRepository())
  }

  return new CatalogService(createCatalogRepository())
}

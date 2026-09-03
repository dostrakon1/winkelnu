import type { CatalogReadRepository, CatalogWriteRepository } from '@/application/catalog/ports'
import type { Category } from '@/domain/catalog/types'
import { InMemoryCatalogRepository } from '@/infrastructure/catalog/in-memory-catalog-repository'
import { SupabaseCatalogRepository } from '@/infrastructure/catalog/supabase-catalog-repository'

export type CatalogRepository = CatalogReadRepository & CatalogWriteRepository

export function createCatalogRepository(options?: { memoryCategories?: Category[] }): CatalogRepository {
  const mode = process.env.CATALOG_PERSISTENCE ?? 'memory'

  if (mode === 'supabase') return new SupabaseCatalogRepository()
  if (mode === 'memory') return new InMemoryCatalogRepository({ categories: options?.memoryCategories })

  throw new Error(`Unsupported CATALOG_PERSISTENCE value: ${mode}`)
}

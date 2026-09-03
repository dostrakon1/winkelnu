import { importFeed } from '@/application/catalog/import-feed'
import type { ProductWithOffers } from '@/application/catalog/ports'
import type { Category, Merchant } from '@/domain/catalog/types'
import { InMemoryCatalogRepository } from '@/infrastructure/catalog/in-memory-catalog-repository'
import { SyntheticFeedAdapter } from '@/infrastructure/feeds/synthetic/synthetic-feed-adapter'

const categories: Category[] = [
  { id: 'category:audio', slug: 'audio', name: 'Audio' },
  { id: 'category:smart-home', slug: 'smart-home', name: 'Smart home' },
  { id: 'category:outdoor', slug: 'outdoor', name: 'Sport & Outdoor' },
]

const merchant: Merchant = {
  id: 'merchant:synthetic-demo-store',
  slug: 'synthetic-demo-store',
  name: 'Demo Winkel',
  websiteUrl: 'https://example.invalid',
  isActive: true,
}

export type SyntheticCatalogSnapshot = {
  products: ProductWithOffers[]
  merchant: Merchant
  categories: Category[]
  importSummary: {
    imported: number
    rejected: number
  }
}

export async function createSyntheticCatalogRepository(): Promise<InMemoryCatalogRepository> {
  const repository = new InMemoryCatalogRepository({ categories })
  const adapter = new SyntheticFeedAdapter()

  await importFeed({
    adapter,
    repository,
    merchant,
    categoryIdBySourceCategory: {
      'Elektronica > Audio > Hoofdtelefoons': 'category:audio',
      'Wonen > Smart home': 'category:smart-home',
      'Sport & Outdoor > Drinkflessen': 'category:outdoor',
    },
  })

  return repository
}

export async function buildSyntheticCatalog(): Promise<SyntheticCatalogSnapshot> {
  const repository = await createSyntheticCatalogRepository()
  const products = await repository.listProducts({ limit: 12 })
  const productsWithOffers = await Promise.all(
    products.map(async (product) => (await repository.getProductBySlug(product.slug))!),
  )
  const runs = await repository.listImportRuns({ limit: 1 })
  const latestRun = runs[0]

  return {
    products: productsWithOffers,
    merchant,
    categories: await repository.listCategories(),
    importSummary: {
      imported: latestRun?.recordsAccepted ?? 0,
      rejected: latestRun?.recordsRejected ?? 0,
    },
  }
}

import type { MetadataRoute } from 'next'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { resolveSiteOrigin } from '@/config/sites'
import { editorialCollections } from '@/content/collections'
import { buyingGuides, editorialCategories } from '@/content/editorial-catalog'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'

// Live commerce product URLs remain runtime-generated and are excluded until release.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL)
  const informationRoutes = ['/over-winkelnu', '/affiliate-en-vergelijking', '/privacy', '/cookies', '/disclaimer']
  const promotionalRoutes = ['/collecties/black-friday', '/collecties/cyber-monday']
  const editorialRoutes = [
    '/koopgidsen',
    ...editorialCategories.map((category) => `/koopgidsen/categorie/${category.slug}`),
    ...buyingGuides.map((guide) => `/koopgidsen/${guide.slug}`),
    ...editorialCollections.map((collection) => `/collecties/${collection.slug}`),
  ]
  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'monthly', priority: 1 },
    ...informationRoutes.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: 'monthly' as const, priority: 0.4 })),
    ...promotionalRoutes.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...editorialRoutes.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
  if (!isPublicCatalogEnabled()) return entries

  const catalog = await createStorefrontCatalogService()
  const [categories, products] = await Promise.all([
    catalog.listCategories(),
    catalog.listProducts({ limit: 500 }),
  ])
  return [
    ...entries,
    ...categories.map((category) => ({ url: `${baseUrl}/categorie/${category.slug}`, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...products.map(({ product }) => ({ url: `${baseUrl}/product/${product.slug}`, changeFrequency: 'daily' as const, priority: 0.7 })),
  ]
}

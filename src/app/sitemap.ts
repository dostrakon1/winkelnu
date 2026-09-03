import type { MetadataRoute } from 'next'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://winkelnu.nl').replace(/\/$/, '')
  const catalog = await createStorefrontCatalogService()
  const [categories, products] = await Promise.all([
    catalog.listCategories(),
    catalog.listProducts({ limit: 500 }),
  ])

  return [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categories.map((category) => ({
      url: `${baseUrl}/categorie/${category.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...products.map(({ product }) => ({
      url: `${baseUrl}/product/${product.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  ]
}

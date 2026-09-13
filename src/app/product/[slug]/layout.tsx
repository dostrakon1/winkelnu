import type { Metadata } from 'next'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'
import { createPageSocialMetadata } from '@/lib/seo/page-social-metadata'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const catalog = await createStorefrontCatalogService()
  const item = await catalog.getProduct(slug)

  if (!item) return {}

  return createPageSocialMetadata({
    title: item.product.title,
    description: item.product.description,
    url: `/product/${item.product.slug}`,
  })
}

export default function ProductLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}

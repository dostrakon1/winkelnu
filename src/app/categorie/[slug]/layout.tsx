import type { Metadata } from 'next'
import { createStorefrontCatalogService } from '@/infrastructure/catalog/create-storefront-catalog-service'
import { createPageSocialMetadata } from '@/lib/seo/page-social-metadata'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const catalog = await createStorefrontCatalogService()
  const category = await catalog.getCategory(slug)

  if (!category) return {}

  return createPageSocialMetadata({
    title: `${category.name} ontdekken`,
    description: `Ontdek en vergelijk producten in ${category.name}. Winkelprijzen verschijnen zodra gecontroleerde aanbiedingen beschikbaar zijn.`,
    url: `/categorie/${category.slug}`,
  })
}

export default function CategoryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}

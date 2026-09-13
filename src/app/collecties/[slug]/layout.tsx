import type { Metadata } from 'next'
import { getEditorialCollection } from '@/content/collections'
import { createPageSocialMetadata } from '@/lib/seo/page-social-metadata'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const collection = getEditorialCollection(slug)

  if (!collection) return {}

  return createPageSocialMetadata({
    title: collection.title,
    description: collection.description,
    url: `/collecties/${collection.slug}`,
  })
}

export default function CollectionLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}

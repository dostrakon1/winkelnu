import type { Metadata } from 'next'
import { getBuyingGuide } from '@/content/editorial-catalog'
import { createPageSocialMetadata } from '@/lib/seo/page-social-metadata'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = getBuyingGuide(slug)

  if (!guide) return {}

  return createPageSocialMetadata({
    title: guide.title,
    description: guide.description,
    url: `/koopgidsen/${guide.slug}`,
    type: 'article',
  })
}

export default function BuyingGuideLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}

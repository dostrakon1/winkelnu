import type { Metadata } from 'next'
import { getBuyingGuide } from '@/content/editorial-catalog'
import { createPageSocialMetadata } from '@/lib/seo/page-social-metadata'

const siteUrl = 'https://winkelnu.nl'
const socialImageUrl = `${siteUrl}/opengraph-image`

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

export default async function BuyingGuideLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ slug: string }>
}>) {
  const { slug } = await params
  const guide = getBuyingGuide(slug)

  if (!guide) return children

  return (
    <>
      <meta property="og:url" content={`${siteUrl}/koopgidsen/${guide.slug}`} />
      <meta property="og:site_name" content="Winkelnu.nl" />
      <meta property="og:locale" content="nl_NL" />
      <meta property="og:image" content={socialImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel." />
      {children}
    </>
  )
}

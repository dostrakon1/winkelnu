import type { Metadata } from 'next'
import { activeSite } from '@/config/sites'

const defaultSocialImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.',
} as const

type PageSocialMetadataInput = {
  title: string
  description: string
  url: string
  type?: 'website' | 'article'
}

export function createPageSocialMetadata({
  title,
  description,
  url,
  type = 'website',
}: PageSocialMetadataInput): Metadata {
  return {
    openGraph: {
      type,
      locale: activeSite.openGraphLocale,
      siteName: activeSite.siteName,
      title,
      description,
      url,
      images: [defaultSocialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [defaultSocialImage.url],
    },
  }
}

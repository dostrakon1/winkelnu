import { describe, expect, it } from 'vitest'
import { createPageSocialMetadata } from '../../src/lib/seo/page-social-metadata'

describe('createPageSocialMetadata', () => {
  it('creates page-specific Open Graph and Twitter metadata', () => {
    const metadata = createPageSocialMetadata({
      title: 'Koffiezetapparaten vergelijken',
      description: 'Ontdek modellen en vergelijk relevante eigenschappen.',
      url: '/categorie/koffiezetapparaten',
    })

    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      locale: 'nl_NL',
      siteName: 'Winkelnu.nl',
      title: 'Koffiezetapparaten vergelijken',
      description: 'Ontdek modellen en vergelijk relevante eigenschappen.',
      url: '/categorie/koffiezetapparaten',
      images: [
        expect.objectContaining({
          url: '/opengraph-image',
          width: 1200,
          height: 630,
        }),
      ],
    })

    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Koffiezetapparaten vergelijken',
      description: 'Ontdek modellen en vergelijk relevante eigenschappen.',
      images: ['/opengraph-image'],
    })
  })

  it('supports article metadata for editorial guides', () => {
    const metadata = createPageSocialMetadata({
      title: 'Laptop kopen: waar let je op?',
      description: 'Praktische keuzehulp voor het kiezen van een laptop.',
      url: '/koopgidsen/laptop-kopen',
      type: 'article',
    })

    expect(metadata.openGraph).toMatchObject({ type: 'article' })
  })
})

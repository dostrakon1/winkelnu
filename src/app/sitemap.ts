import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://winkelnu.nl'

  return [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}

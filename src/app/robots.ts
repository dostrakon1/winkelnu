import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://winkelnu.nl').replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/intern/',
        '/api/',
        '/uit/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

import type { MetadataRoute } from 'next'
import { resolveSiteOrigin } from '@/config/sites'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL)

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

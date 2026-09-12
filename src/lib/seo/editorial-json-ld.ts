import { activeSite } from '@/config/sites'
import type { BuyingGuide } from '@/content/koopgidsen'

const SITE_URL = activeSite.canonicalOrigin

type EditorialCategory = {
  slug: string
  title: string
  description: string
}

export function buildBuyingGuideStructuredData(input: {
  guide: BuyingGuide
  category?: EditorialCategory
}) {
  const { guide, category } = input
  const guideUrl = `${SITE_URL}/koopgidsen/${guide.slug}`
  const breadcrumbs = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Koopgidsen', item: `${SITE_URL}/koopgidsen` },
  ]

  if (category) {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: breadcrumbs.length + 1,
      name: category.title,
      item: `${SITE_URL}/koopgidsen/categorie/${category.slug}`,
    })
  }

  breadcrumbs.push({
    '@type': 'ListItem',
    position: breadcrumbs.length + 1,
    name: guide.title,
    item: guideUrl,
  })

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${guideUrl}#article`,
        url: guideUrl,
        headline: guide.title,
        description: guide.description,
        dateModified: guide.updated,
        author: { '@type': 'Organization', name: activeSite.editorial.authorName, url: SITE_URL },
        publisher: { '@type': 'Organization', name: activeSite.editorial.publisherName, url: SITE_URL },
        mainEntityOfPage: { '@type': 'WebPage', '@id': guideUrl },
        ...(category ? { articleSection: category.title } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs,
      },
    ],
  }
}

export function buildEditorialCategoryStructuredData(input: {
  category: EditorialCategory
  guides: BuyingGuide[]
}) {
  const { category, guides } = input
  const categoryUrl = `${SITE_URL}/koopgidsen/categorie/${category.slug}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${categoryUrl}#collection`,
        url: categoryUrl,
        name: category.title,
        description: category.description,
        isPartOf: { '@type': 'WebSite', name: activeSite.brandName, url: SITE_URL },
      },
      {
        '@type': 'ItemList',
        '@id': `${categoryUrl}#guides`,
        numberOfItems: guides.length,
        itemListElement: guides.map((guide, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: guide.title,
          url: `${SITE_URL}/koopgidsen/${guide.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Koopgidsen', item: `${SITE_URL}/koopgidsen` },
          { '@type': 'ListItem', position: 3, name: category.title, item: categoryUrl },
        ],
      },
    ],
  }
}

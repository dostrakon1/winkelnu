import { activeSite } from '@/config/sites'
import type { Category, Product } from '@/domain/catalog/types'

const SITE_URL = activeSite.canonicalOrigin

type ProductStructuredDataInput = {
  product: Product
  category?: Category
}

export function buildProductStructuredData({ product, category }: ProductStructuredDataInput) {
  const productUrl = `${SITE_URL}/product/${product.slug}`
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
  ]

  if (category) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: breadcrumbItems.length + 1,
      name: category.name,
      item: `${SITE_URL}/categorie/${category.slug}`,
    })
  }

  breadcrumbItems.push({
    '@type': 'ListItem',
    position: breadcrumbItems.length + 1,
    name: product.title,
    item: productUrl,
  })

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        url: productUrl,
        name: product.title,
        ...(product.description ? { description: product.description } : {}),
        ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand } } : {}),
        ...(product.gtin ? { gtin: product.gtin } : {}),
        ...(product.mpn ? { mpn: product.mpn } : {}),
        ...(category ? { category: category.name } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      },
    ],
  }
}

export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

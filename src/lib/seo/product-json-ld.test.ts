import { describe, expect, it } from 'vitest'
import type { Category, Product } from '@/domain/catalog/types'
import { buildProductStructuredData, serializeStructuredData } from './product-json-ld'

describe('buildProductStructuredData', () => {
  const category: Category = {
    id: 'cat-wonen',
    slug: 'wonen-huishouden',
    name: 'Wonen & huishouden',
  }

  const product: Product = {
    id: 'product-dyson',
    slug: 'dyson-v12-detect-slim',
    title: 'Dyson V12 Detect Slim Absolute',
    description: 'Steelstofzuiger voor dagelijks gebruik.',
    brand: 'Dyson',
    gtin: '1234567890123',
    mpn: 'V12-TEST',
    visualKind: 'stick-vacuum',
  }

  it('emits grounded product and breadcrumb data without commercial claims', () => {
    const data = buildProductStructuredData({ product, category })
    const [productNode, breadcrumbNode] = data['@graph']

    expect(productNode).toMatchObject({
      '@type': 'Product',
      name: product.title,
      brand: { '@type': 'Brand', name: 'Dyson' },
      gtin: product.gtin,
      mpn: product.mpn,
      category: category.name,
    })
    expect(productNode).not.toHaveProperty('offers')
    expect(productNode).not.toHaveProperty('aggregateRating')
    expect(productNode).not.toHaveProperty('review')

    expect(breadcrumbNode).toMatchObject({ '@type': 'BreadcrumbList' })
    expect(breadcrumbNode.itemListElement.map((item) => item.name)).toEqual([
      'Home',
      category.name,
      product.title,
    ])
  })

  it('escapes markup-sensitive characters before embedding JSON-LD in HTML', () => {
    const serialized = serializeStructuredData({ value: '</script><script>alert(1)</script>' })

    expect(serialized).not.toContain('</script>')
    expect(serialized).toContain('\\u003c/script>')
  })
})

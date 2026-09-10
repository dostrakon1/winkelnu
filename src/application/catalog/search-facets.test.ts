import { describe, expect, it } from 'vitest'
import type { CatalogProductListItem } from './catalog-service'
import { buildCatalogSearchFacets } from './search-facets'

function item(input: {
  id: string
  title: string
  brand?: string
  visualKind?: CatalogProductListItem['product']['visualKind']
  withOffer?: boolean
}): CatalogProductListItem {
  return {
    product: {
      id: input.id,
      slug: input.id,
      title: input.title,
      brand: input.brand,
      visualKind: input.visualKind,
    },
    bestOffer: input.withOffer ? {
      offer: {
        id: `offer-${input.id}`,
        productId: input.id,
        merchantId: 'merchant',
        merchantProductId: input.id,
        price: { amount: '99.00', currency: 'EUR' },
        availability: 'in_stock',
        productUrl: 'https://example.com/product',
        affiliateUrl: 'https://example.com/affiliate',
        importedAt: '2026-09-11T00:00:00.000Z',
        lastSeenAt: '2026-09-11T00:00:00.000Z',
        isActive: true,
      },
      totalAmount: '99.00',
      freshness: 'fresh',
    } : undefined,
    offerCount: input.withOffer ? 1 : 0,
  }
}

describe('buildCatalogSearchFacets', () => {
  it('builds deduplicated brand and product type options with counts', () => {
    const facets = buildCatalogSearchFacets([
      item({ id: 'dyson', title: 'Dyson', brand: 'Dyson', visualKind: 'stick-vacuum' }),
      item({ id: 'miele', title: 'Miele', brand: 'Miele', visualKind: 'canister-vacuum' }),
      item({ id: 'dyson-2', title: 'Dyson 2', brand: 'dyson', visualKind: 'stick-vacuum' }),
    ])

    expect(facets.brands).toEqual([
      { value: 'Dyson', label: 'Dyson', count: 2 },
      { value: 'Miele', label: 'Miele', count: 1 },
    ])
    expect(facets.productTypes).toEqual([
      { value: 'vacuum-cleaners', label: 'Stofzuigers', count: 3 },
    ])
    expect(facets.hasCommercialData).toBe(false)
  })

  it('only enables commercial filtering when a real ranked offer exists', () => {
    const facets = buildCatalogSearchFacets([
      item({ id: 'one', title: 'One', withOffer: true }),
    ])

    expect(facets.hasCommercialData).toBe(true)
  })
})

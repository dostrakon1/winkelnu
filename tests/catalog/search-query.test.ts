import { describe, expect, it } from 'vitest'
import { parseCatalogSearchQuery } from '@/application/catalog/search-query'

describe('parseCatalogSearchQuery', () => {
  it('normalizes and bounds public search input', () => {
    const query = parseCatalogSearchQuery({
      q: '  draadloze   koptelefoon  ',
      categorie: 'AUDIO',
      merk: ' DemoSound ',
      min: '200,00',
      max: '100.00',
      voorraad: '1',
      sort: 'price_asc',
      pagina: '9999',
      perPagina: '999',
    })

    expect(query).toMatchObject({
      term: 'draadloze koptelefoon',
      categorySlug: 'audio',
      brand: 'DemoSound',
      minPrice: 100,
      maxPrice: 200,
      inStockOnly: true,
      sort: 'price_asc',
      page: 100,
      pageSize: 48,
    })
  })

  it('falls back safely for malformed values', () => {
    const query = parseCatalogSearchQuery({
      min: '-10',
      max: 'geen-prijs',
      sort: 'unknown',
      pagina: '0',
      perPagina: '-1',
    })

    expect(query.minPrice).toBeUndefined()
    expect(query.maxPrice).toBeUndefined()
    expect(query.sort).toBe('relevance')
    expect(query.page).toBe(1)
    expect(query.pageSize).toBe(24)
  })
})

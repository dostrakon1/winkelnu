import { describe, expect, it } from 'vitest'
import { parseCatalogSearchQuery } from './search-query'

describe('parseCatalogSearchQuery', () => {
  it('parses a known product type and page size', () => {
    const query = parseCatalogSearchQuery({
      type: 'vacuum-cleaners',
      perPagina: '48',
    })

    expect(query.productType).toBe('vacuum-cleaners')
    expect(query.pageSize).toBe(48)
  })

  it('ignores unknown product type values instead of accepting arbitrary input', () => {
    const query = parseCatalogSearchQuery({ type: 'does-not-exist' })

    expect(query.productType).toBeUndefined()
  })

  it('normalizes an inverted price range', () => {
    const query = parseCatalogSearchQuery({ min: '500', max: '100' })

    expect(query.minPrice).toBe(100)
    expect(query.maxPrice).toBe(500)
  })

  it('keeps the original natural-language query as internal ranking context', () => {
    const query = parseCatalogSearchQuery({ q: '  lichte laptop met minimaal 16 GB RAM  ' })

    expect(query.term).toBe('lichte laptop met minimaal 16 GB RAM')
    expect(query.contextTerm).toBe('lichte laptop met minimaal 16 GB RAM')
  })
})

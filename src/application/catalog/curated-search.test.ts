import { describe, expect, it } from 'vitest'
import { CatalogService } from './catalog-service'
import type { CatalogSearchQuery } from './search-query'
import { getProductComparisonGroup } from '@/domain/catalog/comparison'
import { createCuratedCatalogRepository } from '@/infrastructure/catalog/curated-catalog'

function query(overrides: Partial<CatalogSearchQuery> = {}): CatalogSearchQuery {
  return {
    inStockOnly: false,
    sort: 'relevance',
    page: 1,
    pageSize: 24,
    ...overrides,
  }
}

describe('curated product-only search', () => {
  it('returns products without requiring a merchant offer', async () => {
    const service = new CatalogService(await createCuratedCatalogRepository())
    const result = await service.searchProducts(query({ term: 'Bosch' }))

    expect(result.products.length).toBeGreaterThan(0)
    expect(result.products.every((item) => item.offerCount === 0)).toBe(true)
    expect(result.products.some((item) => item.product.brand === 'Bosch')).toBe(true)
  })

  it('keeps price and stock filters honest by requiring actual offer data', async () => {
    const service = new CatalogService(await createCuratedCatalogRepository())

    expect((await service.searchProducts(query({ minPrice: 1 }))).products).toEqual([])
    expect((await service.searchProducts(query({ inStockOnly: true }))).products).toEqual([])
    expect((await service.searchProducts(query({ sort: 'price_asc' }))).products).toEqual([])
  })

  it('still supports category and title sorting for product-only discovery', async () => {
    const service = new CatalogService(await createCuratedCatalogRepository())
    const result = await service.searchProducts(query({ categorySlug: 'tuin-klussen', sort: 'title_asc' }))

    expect(result.products).toHaveLength(4)
    expect(result.products.map((item) => item.product.title)).toEqual(
      [...result.products.map((item) => item.product.title)].sort((a, b) => a.localeCompare(b, 'nl-NL')),
    )
  })

  it('filters by the normalized comparison product type', async () => {
    const service = new CatalogService(await createCuratedCatalogRepository())
    const result = await service.searchProducts(query({ productType: 'vacuum-cleaners' }))

    expect(result.products.length).toBeGreaterThan(1)
    expect(result.products.every((item) => getProductComparisonGroup(item.product) === 'vacuum-cleaners')).toBe(true)
  })
})

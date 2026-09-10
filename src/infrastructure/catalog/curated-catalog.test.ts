import { describe, expect, it } from 'vitest'
import { createCuratedCatalogRepository, curatedCategories, curatedProducts } from './curated-catalog'

describe('curated pre-affiliate catalog', () => {
  it('contains a useful spread of products across six categories', async () => {
    const repository = await createCuratedCatalogRepository()
    const categories = await repository.listCategories()
    const products = await repository.listProducts()

    expect(categories).toHaveLength(6)
    expect(products).toHaveLength(24)
    expect(categories).toEqual(curatedCategories)
    expect(products).toEqual(curatedProducts)

    for (const category of categories) {
      const categoryProducts = await repository.listProducts({ categorySlug: category.slug })
      expect(categoryProducts).toHaveLength(4)
    }
  })

  it('requires useful sourced specifications and rights-safe curated visuals', async () => {
    const repository = await createCuratedCatalogRepository()
    const products = await repository.listProducts()

    for (const product of products) {
      expect(product.visualKind).toBeTruthy()
      expect(product.imageUrl).toBeUndefined()
      expect(product.specifications?.length ?? 0).toBeGreaterThanOrEqual(4)
      expect(product.source?.label).toBeTruthy()
      expect(product.source?.url.startsWith('https://')).toBe(true)
      expect(product.source?.checkedAt).toBe('2026-09-10')
    }
  })

  it('publishes no merchant, price, availability or outbound offer data', async () => {
    const repository = await createCuratedCatalogRepository()
    const products = await repository.listProducts()

    expect(await repository.listActiveMerchants()).toEqual([])

    for (const product of products) {
      expect(product.categoryId).toBeTruthy()
      expect(product.title.length).toBeGreaterThan(3)
      expect(product.description?.length ?? 0).toBeGreaterThan(40)

      const detail = await repository.getProductBySlug(product.slug)
      expect(detail?.offers).toEqual([])
    }
  })
})

import { describe, expect, it } from 'vitest'
import { categories } from '@/content/categories'
import { editorialCollections, getEditorialCollection } from './index'

describe('editorial collections', () => {
  it('keeps collections separate from the product taxonomy', () => {
    const productSlugs = new Set(categories.map(({ slug }) => slug))
    for (const collection of editorialCollections) expect(productSlugs.has(collection.slug as never)).toBe(false)
  })

  it('only references existing product categories', () => {
    const productSlugs = new Set<string>(categories.map(({ slug }) => slug))
    for (const collection of editorialCollections) {
      for (const section of collection.sections) {
        for (const categorySlug of section.categorySlugs) expect(productSlugs.has(categorySlug), `${collection.slug}/${section.slug}/${categorySlug}`).toBe(true)
      }
    }
  })

  it('resolves the gifts and celebrations hub', () => {
    const collection = getEditorialCollection('cadeaus-feest')
    expect(collection?.title).toBe('Cadeaus & feest')
    expect(collection?.sections.length).toBeGreaterThanOrEqual(8)
  })
})

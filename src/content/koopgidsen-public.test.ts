import { describe, expect, it } from 'vitest'
import { getCategoryImage } from './category-images'
import { buyingGuides, editorialCategories, guidesForCategory } from './editorial-catalog'

describe('public editorial catalog', () => {
  it('publishes ten categories and thirty guides', () => {
    expect(editorialCategories).toHaveLength(10)
    expect(buyingGuides).toHaveLength(30)
  })

  it('publishes three reviewed guides per category', () => {
    for (const category of editorialCategories) {
      expect(guidesForCategory(category.slug), category.slug).toHaveLength(3)
    }
  })

  it('keeps category and guide slugs unique', () => {
    expect(new Set(editorialCategories.map(({ slug }) => slug)).size).toBe(editorialCategories.length)
    expect(new Set(buyingGuides.map(({ slug }) => slug)).size).toBe(buyingGuides.length)
  })

  it('links every guide to a published category and keeps approved imagery explicit', () => {
    const categorySlugs = new Set<string>(editorialCategories.map(({ slug }) => slug))
    for (const guide of buyingGuides) expect(categorySlugs.has(guide.category), guide.slug).toBe(true)

    const imageBackedCategories = editorialCategories.filter((category) => getCategoryImage(category.slug))
    expect(imageBackedCategories).toHaveLength(10)
    expect(getCategoryImage('persoonlijke-verzorging')?.src).toBe(
      '/images/categories/persoonlijke-verzorging-hero.webp',
    )
    expect(getCategoryImage('baby-kind')?.src).toBe('/images/categories/baby-kind-hero.webp')
    expect(getCategoryImage('dieren')?.src).toBe('/images/categories/dieren-hero.webp')
    expect(getCategoryImage('auto-fiets')?.src).toBe('/images/categories/auto-fiets-hero.webp')
  })

  it('keeps every guide useful and source-backed', () => {
    for (const guide of buyingGuides) {
      expect(guide.title.length, guide.slug).toBeGreaterThan(12)
      expect(guide.description.length, guide.slug).toBeGreaterThan(30)
      expect(guide.quickChoice.length, guide.slug).toBeGreaterThanOrEqual(3)
      expect(guide.sections.length, guide.slug).toBeGreaterThanOrEqual(4)
      expect(guide.checklist.length, guide.slug).toBeGreaterThanOrEqual(5)
      expect(guide.sources.length, guide.slug).toBeGreaterThanOrEqual(2)
      for (const source of guide.sources) expect(source.url.startsWith('https://'), `${guide.slug}: ${source.url}`).toBe(true)
    }
  })
})

import { describe, expect, it } from 'vitest'
import { categories, getCategoryContent } from './index'

const expectedSlugs = [
  'elektronica',
  'wonen-huishouden',
  'keuken-koffie',
  'persoonlijke-verzorging',
  'huis-tuin-klussen',
  'sport-outdoor',
  'speelgoed-hobby',
  'baby-kind',
  'dieren',
  'auto-fiets',
]

describe('category content layer', () => {
  it('keeps one canonical definition for all ten categories', () => {
    expect(categories.map(({ slug }) => slug)).toEqual(expectedSlugs)
    expect(new Set(categories.map(({ slug }) => slug)).size).toBe(categories.length)
  })

  it('ships enough editorial content for every category page', () => {
    for (const category of categories) {
      expect(category.description.length, category.slug).toBeGreaterThan(40)
      expect(category.intro.length, category.slug).toBeGreaterThan(100)
      expect(category.topics, category.slug).toHaveLength(4)
      expect(category.subcategories.length, category.slug).toBeGreaterThanOrEqual(5)
      expect(category.buyingTips.length, category.slug).toBeGreaterThanOrEqual(3)
      expect(category.popularProductTypes.length, category.slug).toBeGreaterThanOrEqual(6)
      expect(category.faq.length, category.slug).toBeGreaterThanOrEqual(3)
    }
  })

  it('resolves a category by slug and returns undefined for unknown slugs', () => {
    expect(getCategoryContent('baby-kind')?.title).toBe('Baby & kind')
    expect(getCategoryContent('bestaat-niet')).toBeUndefined()
  })
})

import { describe, expect, it } from 'vitest'
import { buyingGuides, editorialCategories, getBuyingGuide, getEditorialCategory, guidesForCategory } from './koopgidsen'

describe('editorial content contract', () => {
  it('has three unique categories and six unique guides', () => {
    expect(editorialCategories).toHaveLength(3)
    expect(buyingGuides).toHaveLength(6)
    expect(new Set(editorialCategories.map((item) => item.slug)).size).toBe(editorialCategories.length)
    expect(new Set(buyingGuides.map((item) => item.slug)).size).toBe(buyingGuides.length)
  })
  it('resolves all editorial routes and rejects unknown slugs', () => {
    for (const category of editorialCategories) {
      expect(getEditorialCategory(category.slug)).toBe(category)
      expect(guidesForCategory(category.slug).length).toBeGreaterThan(0)
    }
    for (const guide of buyingGuides) {
      expect(getBuyingGuide(guide.slug)).toBe(guide)
      expect(getEditorialCategory(guide.category)).toBeDefined()
      expect(guide.sections.length).toBeGreaterThanOrEqual(4)
      expect(guide.checklist.length).toBeGreaterThanOrEqual(4)
      expect(guide.sources.length).toBeGreaterThan(0)
      expect(guide.sections.every((section) => section.paragraphs.length > 0)).toBe(true)
      expect(guide.sources.every((source) => new URL(source.url).protocol === 'https:')).toBe(true)
    }
    expect(getBuyingGuide('bestaat-niet')).toBeUndefined()
    expect(getEditorialCategory('bestaat-niet')).toBeUndefined()
  })
})

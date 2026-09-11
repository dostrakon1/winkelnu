import { describe, expect, it } from 'vitest'
import {
  createTaxonomyCategoryIdResolver,
  listFeedCategoryAliasConflicts,
  resolveFeedCategory,
} from './feed-category-resolver'

describe('feed category resolver', () => {
  it('keeps the taxonomy alias map conflict-free', () => {
    expect(listFeedCategoryAliasConflicts()).toEqual([])
  })

  it.each([
    ['Electronics > Laptops', 'elektronica', 'laptops-computers'],
    ['Home & Household > Vacuum Cleaners', 'wonen-huishouden', 'schoonmaken'],
    ['Kitchen > Coffee Machines', 'keuken-koffie', 'koffie-espresso'],
    ['Personal Care > Electric Toothbrushes', 'persoonlijke-verzorging', 'mondverzorging'],
    ['Home Improvement > Power Tools', 'huis-tuin-klussen', 'elektrisch-gereedschap'],
    ['Sports & Outdoors > Hiking', 'sport-outdoor', 'wandelen'],
    ['Toys > Board Games', 'speelgoed-hobby', 'spellen-puzzels'],
    ['Baby > Car Seats', 'baby-kind', 'veilig-in-de-auto'],
    ['Pet Supplies > Dog Beds', 'dieren', 'hond'],
    ['Automotive > Car Chargers', 'auto-fiets', 'laden-elektronica'],
    ['Fashion > Shoes', 'mode-accessoires', 'schoenen'],
    ['Office Supplies > Printers & Accessories', 'kantoor-studie', 'printers-accessoires'],
    ['Travel & Luggage > Suitcases', 'reizen-bagage', 'koffers'],
  ])('maps %s to %s/%s', (sourceCategory, categorySlug, subcategorySlug) => {
    expect(resolveFeedCategory(sourceCategory)).toMatchObject({ categorySlug, subcategorySlug })
  })

  it('uses the most specific path segment when the full path is not an alias', () => {
    expect(resolveFeedCategory('Electronics > Laptops')).toMatchObject({
      categorySlug: 'elektronica',
      subcategorySlug: 'laptops-computers',
      matchedBy: 'path-segment',
    })
  })

  it('can resolve a main category without forcing a subcategory', () => {
    expect(resolveFeedCategory('Consumer Electronics')).toMatchObject({
      categorySlug: 'elektronica',
      matchedBy: 'exact-alias',
    })
    expect(resolveFeedCategory('Consumer Electronics')?.subcategorySlug).toBeUndefined()
  })

  it('does not treat editorial collections as feed categories', () => {
    expect(resolveFeedCategory('Cadeaus & feest')).toBeUndefined()
    expect(resolveFeedCategory('Gifts')).toBeUndefined()
  })

  it('does not guess unknown categories', () => {
    expect(resolveFeedCategory('Completely Unknown Feed Bucket')).toBeUndefined()
  })

  it('prefers a mapped subcategory id and falls back to the parent category id', () => {
    const resolveWithSubcategory = createTaxonomyCategoryIdResolver({
      elektronica: 'category-electronics',
      'laptops-computers': 'subcategory-laptops',
    })
    expect(resolveWithSubcategory({ sourceCategory: 'Electronics > Laptops' })).toBe('subcategory-laptops')

    const resolveWithParentOnly = createTaxonomyCategoryIdResolver({ elektronica: 'category-electronics' })
    expect(resolveWithParentOnly({ sourceCategory: 'Electronics > Laptops' })).toBe('category-electronics')
    expect(resolveWithParentOnly({ sourceCategory: 'Unknown' })).toBeUndefined()
  })
})

import { describe, expect, it } from 'vitest'
import { getCatalogCategorySlug, getGuideCatalogTarget } from './guide-catalog-links'

describe('editorial to catalog links', () => {
  it('maps editorial category slugs to real storefront category slugs', () => {
    expect(getCatalogCategorySlug('elektronica')).toBe('elektronica')
    expect(getCatalogCategorySlug('persoonlijke-verzorging')).toBe('persoonlijke-verzorging')
    expect(getCatalogCategorySlug('huis-tuin-klussen')).toBe('tuin-klussen')
    expect(getCatalogCategorySlug('speelgoed-hobby')).toBeNull()
    expect(getCatalogCategorySlug('baby-kind')).toBeNull()
  })

  it('links source-backed guides only to known product type facets', () => {
    expect(getGuideCatalogTarget('stofzuiger-kopen')).toMatchObject({
      productType: 'vacuum-cleaners',
      href: '/zoeken?type=vacuum-cleaners',
    })
    expect(getGuideCatalogTarget('elektrische-tandenborstel-kopen')).toMatchObject({
      productType: 'electric-toothbrushes',
      href: '/zoeken?type=electric-toothbrushes',
    })
    expect(getGuideCatalogTarget('monitor-kopen')).toBeNull()
    expect(getGuideCatalogTarget('kinderwagen-kopen')).toBeNull()
  })
})

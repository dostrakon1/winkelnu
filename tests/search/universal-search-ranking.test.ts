import { describe, expect, it } from 'vitest'
import type { CatalogProductListItem } from '@/application/catalog/catalog-service'
import { analyzePredictiveSearch } from '@/application/search/predictive-search-core'
import { buildPredictiveSearchIndex } from '@/application/search/predictive-search-index'
import { buildUniversalSearchRanking } from '@/application/search/universal-search-ranking'

const index = buildPredictiveSearchIndex()

function product(id: string, title: string, description?: string): CatalogProductListItem {
  return {
    product: {
      id,
      slug: id,
      title,
      description,
      brand: 'Testmerk',
    },
    offerCount: 0,
  }
}

describe('universal search ranking', () => {
  it('puts the specific laptop route ahead of generic laptop products for a study intent', () => {
    const analysis = analyzePredictiveSearch('laptop voor studie', index)
    const ranking = buildUniversalSearchRanking({
      analysis,
      products: [
        product('student-laptop-14', 'Student Laptop 14', 'Een laptop voor dagelijks gebruik.'),
        product('laptop-pro-15', 'Laptop Pro 15'),
      ],
    })

    expect(ranking.primary?.type).toBe('route')
    expect(ranking.primary?.type === 'route' ? ranking.primary.href : '').toBe('/categorie/laptops-computers')
    expect(ranking.items.some((item) => item.type === 'product')).toBe(true)
    expect(ranking.items.some((item) => item.type === 'route' && item.href === '/koopgidsen/laptop-kopen')).toBe(true)
  })

  it('lets an exact named product become the best match', () => {
    const analysis = analyzePredictiveSearch('Lenovo IdeaPad Slim 5', index)
    const ranking = buildUniversalSearchRanking({
      analysis,
      products: [
        product('lenovo-ideapad-slim-5', 'Lenovo IdeaPad Slim 5'),
        product('lenovo-ideapad-pro', 'Lenovo IdeaPad Pro'),
      ],
    })

    expect(ranking.primary?.type).toBe('product')
    expect(ranking.primary?.type === 'product' ? ranking.primary.item.product.slug : '').toBe('lenovo-ideapad-slim-5')
  })

  it('keeps the universal answer mixed instead of becoming another product grid', () => {
    const analysis = analyzePredictiveSearch('laptop', index)
    const ranking = buildUniversalSearchRanking({
      analysis,
      products: Array.from({ length: 8 }, (_, indexValue) => product(`laptop-${indexValue}`, `Laptop ${indexValue}`)),
      limit: 7,
    })

    expect(ranking.productCount).toBeLessThanOrEqual(3)
    expect(ranking.routeCount).toBeGreaterThan(0)
  })

  it('shows only navigational routes for pure gift intent', () => {
    const analysis = analyzePredictiveSearch('cadeau voor vader', index)
    const ranking = buildUniversalSearchRanking({
      analysis,
      products: [product('cadeau-box', 'Cadeau Box Vader')],
    })

    expect(analysis.navigationOnly).toBe(true)
    expect(ranking.items.every((item) => item.type === 'route')).toBe(true)
    expect(ranking.items.some((item) => item.type === 'route' && item.href.includes('cadeaus-voor-hem'))).toBe(true)
  })

  it('returns an empty ranking when neither products nor routes match', () => {
    const analysis = analyzePredictiveSearch('xy', index)
    const ranking = buildUniversalSearchRanking({ analysis, products: [] })

    expect(ranking.primary).toBeUndefined()
    expect(ranking.items).toEqual([])
  })
})

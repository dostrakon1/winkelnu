import { describe, expect, it } from 'vitest'
import { analyzePredictiveSearch } from '@/application/search/predictive-search-core'
import { buildPredictiveSearchIndex } from '@/application/search/predictive-search-index'

const index = buildPredictiveSearchIndex()

describe('predictive search intent engine', () => {
  it('builds a compact index across taxonomy, guides and collections', () => {
    expect(index.some((item) => item.href === '/categorie/laptops-computers')).toBe(true)
    expect(index.some((item) => item.href === '/koopgidsen/laptop-kopen')).toBe(true)
    expect(index.some((item) => item.href === '/collecties/cadeaus-feest#cadeaus-voor-hem')).toBe(true)
  })

  it('corrects a transposed laptop typo without an AI model', () => {
    const result = analyzePredictiveSearch('laptpo', index)

    expect(result.correctedTerm).toBe('laptop')
    expect(result.productTerm).toBe('laptop')
    expect(result.suggestions.some((item) => item.href === '/categorie/laptops-computers')).toBe(true)
  })

  it('extracts study context while keeping laptop as the product term', () => {
    const result = analyzePredictiveSearch('laptop voor studie', index)

    expect(result.productTerm).toBe('laptop')
    expect(result.intents.some((intent) => intent.key === 'study')).toBe(true)
    expect(result.suggestions.some((item) => item.href === '/categorie/laptops-computers')).toBe(true)
    expect(result.suggestions.some((item) => item.href === '/koopgidsen/laptop-kopen')).toBe(true)
  })

  it('understands handbagage as travel context instead of part of the product name', () => {
    const result = analyzePredictiveSearch('koffer handbagage', index)

    expect(result.productTerm).toMatch(/^koffer/)
    expect(result.intents.some((intent) => intent.key === 'hand-luggage')).toBe(true)
    expect(result.suggestions.some((item) => item.href === '/categorie/koffers')).toBe(true)
  })

  it('treats a gift-for-father query as navigational intent', () => {
    const result = analyzePredictiveSearch('cadeau voor vader', index)

    expect(result.navigationOnly).toBe(true)
    expect(result.productTerm).toBeUndefined()
    expect(result.intents.some((intent) => intent.key === 'gift-father')).toBe(true)
    expect(result.suggestions.some((item) => item.href === '/collecties/cadeaus-feest#cadeaus-voor-hem')).toBe(true)
  })

  it('extracts a budget without polluting the product search term', () => {
    const result = analyzePredictiveSearch('beste laptop onder 800 euro', index)

    expect(result.productTerm).toBe('laptop')
    expect(result.budgetMax).toBe(800)
    expect(result.intents.some((intent) => intent.key === 'budget')).toBe(true)
  })

  it('does not invent a route for a short unknown term', () => {
    const result = analyzePredictiveSearch('xy', index)

    expect(result.suggestions).toEqual([])
    expect(result.correctedTerm).toBeUndefined()
  })
})

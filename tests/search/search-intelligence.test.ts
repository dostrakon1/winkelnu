import { describe, expect, it } from 'vitest'
import { buildSearchCompass, suggestedSearches } from '@/application/search/search-intelligence'

describe('Winkelnu Search Compass', () => {
  it('connects a product intent to both taxonomy and editorial guidance', () => {
    const matches = buildSearchCompass('laptop')

    expect(matches.some((match) => match.href === '/categorie/laptops-computers')).toBe(true)
    expect(matches.some((match) => match.href === '/koopgidsen/laptop-kopen')).toBe(true)
  })

  it('understands common external feed wording', () => {
    const matches = buildSearchCompass('suitcase')

    expect(matches[0]?.href).toBe('/categorie/koffers')
  })

  it('routes gift intent to the cross-category collection instead of the product taxonomy', () => {
    const matches = buildSearchCompass('cadeau')

    expect(matches.some((match) => match.href === '/collecties/cadeaus-feest')).toBe(true)
  })

  it('returns no compass routes for unrelated nonsense', () => {
    expect(buildSearchCompass('zzzxxyyqq')).toEqual([])
  })

  it('offers a compact set of useful search starts', () => {
    expect(suggestedSearches.length).toBeGreaterThanOrEqual(6)
    expect(new Set(suggestedSearches).size).toBe(suggestedSearches.length)
  })
})

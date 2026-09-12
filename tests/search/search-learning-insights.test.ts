import { describe, expect, it } from 'vitest'

import {
  buildSearchLearningInsights,
  filterSearchLearningRows,
  type SearchLearningQuerySummary,
} from '@/application/search/search-learning-insights'

function row(overrides: Partial<SearchLearningQuerySummary> = {}): SearchLearningQuerySummary {
  return {
    query: 'laptop',
    searches: 10,
    zeroResultSearches: 2,
    predictiveClicks: 1,
    bestMatchClicks: 2,
    productClicks: 3,
    refinements: 1,
    lastSeenAt: '2026-09-11T20:00:00.000Z',
    opportunityScore: 17,
    ...overrides,
  }
}

describe('search learning insights', () => {
  it('aggregates 90-day query summaries into dashboard totals', () => {
    const insights = buildSearchLearningInsights([
      row(),
      row({ query: 'koffer', searches: 5, zeroResultSearches: 0, predictiveClicks: 0, bestMatchClicks: 1, productClicks: 1, refinements: 0, opportunityScore: 3 }),
    ], new Date('2026-09-12T00:00:00.000Z'))

    expect(insights.windowDays).toBe(90)
    expect(insights.generatedAt).toBe('2026-09-12T00:00:00.000Z')
    expect(insights.totals.uniqueQueries).toBe(2)
    expect(insights.totals.searches).toBe(15)
    expect(insights.totals.zeroResultSearches).toBe(2)
    expect(insights.totals.zeroResultRate).toBeCloseTo(2 / 15)
    expect(insights.totals.usefulClicks).toBe(8)
    expect(insights.totals.refinements).toBe(1)
  })

  it('prioritizes opportunity score before lower-level signals', () => {
    const insights = buildSearchLearningInsights([
      row({ query: 'lage score', opportunityScore: 4, zeroResultSearches: 4 }),
      row({ query: 'hoogste score', opportunityScore: 40, zeroResultSearches: 1 }),
      row({ query: 'middel', opportunityScore: 18, zeroResultSearches: 2 }),
    ])

    expect(insights.opportunities.map((item) => item.query)).toEqual([
      'hoogste score',
      'middel',
      'lage score',
    ])
  })

  it('separates zero-result queries from queries with useful click behaviour', () => {
    const insights = buildSearchLearningInsights([
      row({ query: 'geen resultaat', zeroResultSearches: 6, predictiveClicks: 0, bestMatchClicks: 0, productClicks: 0 }),
      row({ query: 'sterke route', zeroResultSearches: 0, predictiveClicks: 4, bestMatchClicks: 3, productClicks: 5, opportunityScore: -2 }),
    ])

    expect(insights.zeroResultQueries.map((item) => item.query)).toEqual(['geen resultaat'])
    expect(insights.successfulQueries.map((item) => item.query)).toEqual(['sterke route'])
  })

  it('filters aggregated queries case-insensitively without visitor-level data', () => {
    const rows = [
      row({ query: 'Laptop voor studie' }),
      row({ query: 'Koffer handbagage' }),
    ]

    expect(filterSearchLearningRows(rows, 'LAPTOP').map((item) => item.query)).toEqual(['Laptop voor studie'])
    expect(filterSearchLearningRows(rows, '   ')).toHaveLength(2)
  })
})

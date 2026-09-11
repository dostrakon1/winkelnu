export type SearchLearningQuerySummary = {
  query: string
  searches: number
  zeroResultSearches: number
  predictiveClicks: number
  bestMatchClicks: number
  productClicks: number
  refinements: number
  lastSeenAt: string
  opportunityScore: number
}

export interface SearchLearningInsightsRepository {
  listQuerySummaries(): Promise<SearchLearningQuerySummary[]>
}

export type SearchLearningTotals = {
  uniqueQueries: number
  searches: number
  zeroResultSearches: number
  zeroResultRate: number
  predictiveClicks: number
  bestMatchClicks: number
  productClicks: number
  usefulClicks: number
  refinements: number
}

export type SearchLearningInsights = {
  generatedAt: string
  windowDays: 90
  totals: SearchLearningTotals
  opportunities: SearchLearningQuerySummary[]
  zeroResultQueries: SearchLearningQuerySummary[]
  successfulQueries: SearchLearningQuerySummary[]
  recentQueries: SearchLearningQuerySummary[]
}

function clicks(row: SearchLearningQuerySummary): number {
  return row.predictiveClicks + row.bestMatchClicks + row.productClicks
}

function safeRate(part: number, total: number): number {
  return total > 0 ? part / total : 0
}

export function buildSearchLearningInsights(
  rows: readonly SearchLearningQuerySummary[],
  now = new Date(),
): SearchLearningInsights {
  const normalized = rows
    .filter((row) => row.query.trim().length > 0)
    .map((row) => ({ ...row, query: row.query.trim() }))

  const totals = normalized.reduce<SearchLearningTotals>((acc, row) => {
    acc.searches += row.searches
    acc.zeroResultSearches += row.zeroResultSearches
    acc.predictiveClicks += row.predictiveClicks
    acc.bestMatchClicks += row.bestMatchClicks
    acc.productClicks += row.productClicks
    acc.usefulClicks += clicks(row)
    acc.refinements += row.refinements
    return acc
  }, {
    uniqueQueries: normalized.length,
    searches: 0,
    zeroResultSearches: 0,
    zeroResultRate: 0,
    predictiveClicks: 0,
    bestMatchClicks: 0,
    productClicks: 0,
    usefulClicks: 0,
    refinements: 0,
  })
  totals.zeroResultRate = safeRate(totals.zeroResultSearches, totals.searches)

  const opportunities = [...normalized]
    .filter((row) => row.opportunityScore > 0)
    .sort((a, b) => b.opportunityScore - a.opportunityScore
      || b.zeroResultSearches - a.zeroResultSearches
      || b.refinements - a.refinements
      || b.searches - a.searches
      || a.query.localeCompare(b.query, 'nl-NL'))
    .slice(0, 30)

  const zeroResultQueries = [...normalized]
    .filter((row) => row.zeroResultSearches > 0)
    .sort((a, b) => b.zeroResultSearches - a.zeroResultSearches
      || b.searches - a.searches
      || b.opportunityScore - a.opportunityScore
      || a.query.localeCompare(b.query, 'nl-NL'))
    .slice(0, 20)

  const successfulQueries = [...normalized]
    .filter((row) => clicks(row) > 0)
    .sort((a, b) => clicks(b) - clicks(a)
      || b.searches - a.searches
      || a.zeroResultSearches - b.zeroResultSearches
      || a.query.localeCompare(b.query, 'nl-NL'))
    .slice(0, 20)

  const recentQueries = [...normalized]
    .sort((a, b) => Date.parse(b.lastSeenAt) - Date.parse(a.lastSeenAt)
      || a.query.localeCompare(b.query, 'nl-NL'))
    .slice(0, 20)

  return {
    generatedAt: now.toISOString(),
    windowDays: 90,
    totals,
    opportunities,
    zeroResultQueries,
    successfulQueries,
    recentQueries,
  }
}

export function filterSearchLearningRows(
  rows: readonly SearchLearningQuerySummary[],
  query?: string,
): SearchLearningQuerySummary[] {
  const needle = query?.trim().toLocaleLowerCase('nl-NL')
  if (!needle) return [...rows]
  return rows.filter((row) => row.query.toLocaleLowerCase('nl-NL').includes(needle))
}

export class SearchLearningInsightsService {
  constructor(private readonly repository: SearchLearningInsightsRepository) {}

  async read(query?: string): Promise<SearchLearningInsights> {
    const rows = await this.repository.listQuerySummaries()
    return buildSearchLearningInsights(filterSearchLearningRows(rows, query))
  }
}

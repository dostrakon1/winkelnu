import { describe, expect, it } from 'vitest'
import {
  buildSearchFeedbackRow,
  normalizeFeedbackQuery,
  parseSearchFeedbackInput,
  SEARCH_FEEDBACK_RETENTION_DAYS,
} from '@/application/search/search-feedback'

describe('search feedback learning signals', () => {
  it('normalizes queries and redacts likely direct identifiers', () => {
    expect(normalizeFeedbackQuery('  LÁPTOP voor STUDIE  ')).toBe('laptop voor studie')
    expect(normalizeFeedbackQuery('mail mij op dogan@example.com over laptop')).toBe('mail mij op redacted over laptop')
    expect(normalizeFeedbackQuery('bel 0612345678 voor koffer')).toBe('bel redacted voor koffer')
    expect(normalizeFeedbackQuery('https://example.com laptop')).toBe('redacted laptop')
  })

  it('enriches a search event with deterministic query understanding', () => {
    const input = parseSearchFeedbackInput({
      eventType: 'search_performed',
      query: 'laptpo voor studie',
      zeroResults: false,
      bestMatchCount: 5,
    })

    expect(input).toBeDefined()
    const row = buildSearchFeedbackRow(input!)
    expect(row.query_normalized).toBe('laptpo voor studie')
    expect(row.corrected_query).toBe('laptop voor studie')
    expect(row.product_term).toBe('laptop')
    expect(row.intent_keys).toContain('study')
    expect(row.zero_results).toBe(false)
  })

  it('accepts only internal stable targets for click feedback', () => {
    expect(parseSearchFeedbackInput({
      eventType: 'best_match_clicked',
      query: 'koffer handbagage',
      targetKind: 'subcategory',
      targetKey: '/categorie/koffers',
      targetPosition: 1,
    })).toBeDefined()

    expect(parseSearchFeedbackInput({
      eventType: 'best_match_clicked',
      query: 'koffer handbagage',
      targetKind: 'subcategory',
      targetKey: 'https://example.com/track-me',
      targetPosition: 1,
    })).toBeUndefined()
  })

  it('requires a genuinely different previous query for refinement feedback', () => {
    expect(parseSearchFeedbackInput({
      eventType: 'search_refined',
      query: 'laptop voor studie',
      previousQuery: 'laptop',
    })).toBeDefined()

    expect(parseSearchFeedbackInput({
      eventType: 'search_refined',
      query: 'Laptop',
      previousQuery: 'laptop',
    })).toBeUndefined()
  })

  it('does not accept product clicks without a product slug and position', () => {
    expect(parseSearchFeedbackInput({
      eventType: 'product_clicked',
      query: 'laptop',
      targetKind: 'product',
      targetKey: 'lenovo-ideapad-5',
      targetPosition: 2,
    })).toBeDefined()

    expect(parseSearchFeedbackInput({
      eventType: 'product_clicked',
      query: 'laptop',
      targetKind: 'guide',
      targetKey: '/koopgidsen/laptop-kopen',
      targetPosition: 2,
    })).toBeUndefined()
  })

  it('keeps raw learning events on a 90-day retention boundary', () => {
    expect(SEARCH_FEEDBACK_RETENTION_DAYS).toBe(90)
  })
})

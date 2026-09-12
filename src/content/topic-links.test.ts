import { describe, expect, it } from 'vitest'
import { buildTopicSearchHref } from './topic-links'

describe('buildTopicSearchHref', () => {
  it('builds a search link for a topic label', () => {
    expect(buildTopicSearchHref('Laptops')).toBe('/zoeken?q=Laptops')
  })

  it('normalizes whitespace and encodes special characters', () => {
    expect(buildTopicSearchHref('  Laptops   & computers  ')).toBe('/zoeken?q=Laptops%20%26%20computers')
  })

  it('falls back to the search overview for an empty label', () => {
    expect(buildTopicSearchHref('   ')).toBe('/zoeken')
  })
})

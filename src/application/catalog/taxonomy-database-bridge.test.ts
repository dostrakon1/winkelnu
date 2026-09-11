import { describe, expect, it } from 'vitest'
import {
  createTaxonomyExternalKeyResolver,
  taxonomyCategoryExternalKey,
  taxonomyDatabaseNodes,
} from './taxonomy-database-bridge'

describe('taxonomy database bridge', () => {
  it('projects the canonical taxonomy to thirteen roots and sixty-five children', () => {
    const roots = taxonomyDatabaseNodes.filter((node) => !node.parentSlug)
    const children = taxonomyDatabaseNodes.filter((node) => node.parentSlug)

    expect(roots).toHaveLength(13)
    expect(children).toHaveLength(65)
    expect(taxonomyDatabaseNodes).toHaveLength(78)
  })

  it('keeps database slugs and external keys globally unique', () => {
    expect(new Set(taxonomyDatabaseNodes.map((node) => node.slug)).size).toBe(taxonomyDatabaseNodes.length)
    expect(new Set(taxonomyDatabaseNodes.map((node) => node.externalKey)).size).toBe(taxonomyDatabaseNodes.length)

    for (const node of taxonomyDatabaseNodes) {
      expect(node.externalKey).toBe(taxonomyCategoryExternalKey(node.slug))
    }
  })

  it('only points child nodes to canonical parent slugs', () => {
    const roots = new Set(taxonomyDatabaseNodes.filter((node) => !node.parentSlug).map((node) => node.slug))

    for (const node of taxonomyDatabaseNodes.filter((item) => item.parentSlug)) {
      expect(roots.has(node.parentSlug!), `${node.slug} -> ${node.parentSlug}`).toBe(true)
    }
  })

  it.each([
    ['Fashion > Shoes', 'category:schoenen'],
    ['Office Supplies > Printers & Accessories', 'category:printers-accessoires'],
    ['Travel & Luggage > Suitcases', 'category:koffers'],
    ['Consumer Electronics', 'category:elektronica'],
  ])('maps %s to stable database identity %s', (sourceCategory, externalKey) => {
    expect(createTaxonomyExternalKeyResolver()({ sourceKey: 'test', sourceCategory, title: 'Test' })).toBe(externalKey)
  })

  it('keeps editorial collections outside the product taxonomy bridge', () => {
    expect(createTaxonomyExternalKeyResolver()({ sourceKey: 'test', sourceCategory: 'Gifts', title: 'Gift' })).toBeUndefined()
  })
})

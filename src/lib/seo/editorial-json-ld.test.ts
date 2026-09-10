import { describe, expect, it } from 'vitest'
import type { BuyingGuide } from '@/content/koopgidsen'
import {
  buildBuyingGuideStructuredData,
  buildEditorialCategoryStructuredData,
} from './editorial-json-ld'

const category = {
  slug: 'persoonlijke-verzorging',
  title: 'Persoonlijke verzorging',
  description: 'Praktische keuzehulp voor verzorgingsapparaten.',
}

const guide: BuyingGuide = {
  slug: 'scheerapparaat-kopen',
  category: category.slug,
  title: 'Scheerapparaat kopen: systeem, comfort en onderhoud',
  description: 'Praktische keuzehulp voor een elektrisch scheerapparaat.',
  intro: 'Introductie.',
  updated: '2026-09-11',
  readingMinutes: 5,
  quickChoice: [
    { situation: 'A', advice: 'A' },
    { situation: 'B', advice: 'B' },
    { situation: 'C', advice: 'C' },
  ],
  sections: [],
  checklist: [],
  sources: [],
}

describe('editorial structured data', () => {
  it('emits grounded Article and breadcrumb data for a guide', () => {
    const data = buildBuyingGuideStructuredData({ guide, category })
    const article = data['@graph'][0]
    const breadcrumbs = data['@graph'][1]

    expect(article).toMatchObject({
      '@type': 'Article',
      headline: guide.title,
      description: guide.description,
      dateModified: guide.updated,
      articleSection: category.title,
    })
    expect(article).not.toHaveProperty('datePublished')
    expect(article).not.toHaveProperty('review')
    expect(article).not.toHaveProperty('aggregateRating')
    expect(breadcrumbs).toMatchObject({ '@type': 'BreadcrumbList' })
  })

  it('lists only actual guides on an editorial category page', () => {
    const data = buildEditorialCategoryStructuredData({ category, guides: [guide] })
    const collection = data['@graph'][0]
    const itemList = data['@graph'][1]

    expect(collection).toMatchObject({ '@type': 'CollectionPage', name: category.title })
    expect(itemList).toMatchObject({ '@type': 'ItemList', numberOfItems: 1 })
    expect(JSON.stringify(itemList)).toContain(guide.title)
  })
})

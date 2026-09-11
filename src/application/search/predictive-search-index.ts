import type { PredictiveSearchIndexItem } from './predictive-search-core'
import { categories } from '@/content/categories'
import { buyingGuides } from '@/content/editorial-catalog'
import { editorialCollections } from '@/content/collections'

export function buildPredictiveSearchIndex(): PredictiveSearchIndexItem[] {
  const items: PredictiveSearchIndexItem[] = []

  for (const category of categories) {
    items.push({
      id: `category:${category.slug}`,
      kind: 'category',
      eyebrow: 'Hoofdcategorie',
      title: category.title,
      description: category.description,
      href: `/categorie/${category.slug}`,
      terms: [
        category.title,
        category.slug,
        ...category.feedAliases,
        ...category.topics,
        ...category.popularProductTypes,
      ],
      boost: 6,
    })

    for (const subcategory of category.subcategories) {
      items.push({
        id: `subcategory:${subcategory.slug}`,
        kind: 'subcategory',
        eyebrow: category.title,
        title: subcategory.title,
        description: subcategory.description,
        href: `/categorie/${subcategory.slug}`,
        terms: [
          subcategory.title,
          subcategory.slug,
          subcategory.description,
          ...subcategory.feedAliases,
        ],
        boost: 12,
      })
    }
  }

  for (const guide of buyingGuides) {
    items.push({
      id: `guide:${guide.slug}`,
      kind: 'guide',
      eyebrow: 'Koopgids',
      title: guide.title,
      description: guide.description,
      href: `/koopgidsen/${guide.slug}`,
      terms: [
        guide.title,
        guide.description,
        guide.slug,
        guide.category,
        ...guide.quickChoice.flatMap((item) => [item.situation, item.advice]),
      ],
      boost: 4,
    })
  }

  for (const collection of editorialCollections) {
    items.push({
      id: `collection:${collection.slug}`,
      kind: 'collection',
      eyebrow: 'Collectie',
      title: collection.title,
      description: collection.description,
      href: `/collecties/${collection.slug}`,
      terms: [
        collection.title,
        collection.slug,
        collection.description,
        ...collection.sections.flatMap((section) => [section.title, section.description]),
      ],
      boost: 8,
    })

    for (const section of collection.sections) {
      items.push({
        id: `collection-section:${collection.slug}:${section.slug}`,
        kind: 'collection-section',
        eyebrow: collection.title,
        title: section.title,
        description: section.description,
        href: `/collecties/${collection.slug}#${section.slug}`,
        terms: [section.title, section.slug, section.description],
        boost: 10,
      })
    }
  }

  return items
}

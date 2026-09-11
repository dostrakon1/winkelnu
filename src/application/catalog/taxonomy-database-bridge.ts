import { resolveFeedCategory, type FeedCategoryIdResolver } from './feed-category-resolver'
import { categories } from '@/content/categories'

export const TAXONOMY_CATEGORY_EXTERNAL_KEY_PREFIX = 'category:'

export function taxonomyCategoryExternalKey(slug: string): string {
  return `${TAXONOMY_CATEGORY_EXTERNAL_KEY_PREFIX}${slug}`
}

export type TaxonomyDatabaseNode = {
  externalKey: string
  slug: string
  name: string
  parentSlug?: string
}

export const taxonomyDatabaseNodes: readonly TaxonomyDatabaseNode[] = categories.flatMap((category) => [
  {
    externalKey: taxonomyCategoryExternalKey(category.slug),
    slug: category.slug,
    name: category.title,
  },
  ...category.subcategories.map((subcategory) => ({
    externalKey: taxonomyCategoryExternalKey(subcategory.slug),
    slug: subcategory.slug,
    name: subcategory.title,
    parentSlug: category.slug,
  })),
])

export type TaxonomyDatabaseSnapshot = {
  uuidBySlug: Readonly<Record<string, string>>
  externalKeyBySlug: Readonly<Record<string, string>>
}

export interface TaxonomyDatabaseBridge {
  ensureSynced(): Promise<TaxonomyDatabaseSnapshot>
}

export function createTaxonomyExternalKeyResolver(): FeedCategoryIdResolver {
  return ({ sourceCategory }) => {
    const match = resolveFeedCategory(sourceCategory)
    if (!match) return undefined
    return taxonomyCategoryExternalKey(match.subcategorySlug ?? match.categorySlug)
  }
}

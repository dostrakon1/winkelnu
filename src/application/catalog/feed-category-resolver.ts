import { categories, type CategorySlug, type SubcategorySlug } from '@/content/categories'

export type FeedCategoryResolution = {
  categorySlug: CategorySlug
  subcategorySlug?: SubcategorySlug
  matchedBy: 'exact-alias' | 'path-segment'
  matchedAlias: string
  sourceCategory: string
}

type FeedCategoryTarget = {
  categorySlug: CategorySlug
  subcategorySlug?: SubcategorySlug
  aliases: readonly string[]
}

function normalizeFeedCategory(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function targetKey(target: FeedCategoryTarget): string {
  return `${target.categorySlug}/${target.subcategorySlug ?? ''}`
}

const feedCategoryTargets: FeedCategoryTarget[] = categories.flatMap((category) => [
  {
    categorySlug: category.slug,
    aliases: [category.slug, ...category.feedAliases],
  },
  ...category.subcategories.map((subcategory) => ({
    categorySlug: category.slug,
    subcategorySlug: subcategory.slug,
    aliases: [subcategory.slug, ...subcategory.feedAliases],
  })),
])

const aliasIndex = new Map<string, FeedCategoryTarget[]>()

for (const target of feedCategoryTargets) {
  for (const rawAlias of new Set(target.aliases)) {
    const alias = normalizeFeedCategory(rawAlias)
    if (!alias) continue
    const existing = aliasIndex.get(alias) ?? []
    if (!existing.some((entry) => targetKey(entry) === targetKey(target))) existing.push(target)
    aliasIndex.set(alias, existing)
  }
}

function resolveUniqueAlias(rawValue: string) {
  const alias = normalizeFeedCategory(rawValue)
  const matches = aliasIndex.get(alias)
  if (!matches || matches.length !== 1) return undefined
  return { target: matches[0], alias }
}

export function resolveFeedCategory(sourceCategory: string): FeedCategoryResolution | undefined {
  const exact = resolveUniqueAlias(sourceCategory)
  if (exact) {
    return {
      categorySlug: exact.target.categorySlug,
      subcategorySlug: exact.target.subcategorySlug,
      matchedBy: 'exact-alias',
      matchedAlias: exact.alias,
      sourceCategory,
    }
  }

  const segments = sourceCategory
    .split(/\s*(?:>|\/|\\|\||»|›)\s*/)
    .map((segment) => segment.trim())
    .filter(Boolean)

  for (const segment of segments.reverse()) {
    const match = resolveUniqueAlias(segment)
    if (!match) continue
    return {
      categorySlug: match.target.categorySlug,
      subcategorySlug: match.target.subcategorySlug,
      matchedBy: 'path-segment',
      matchedAlias: match.alias,
      sourceCategory,
    }
  }

  return undefined
}

export function listFeedCategoryAliasConflicts() {
  return [...aliasIndex.entries()]
    .filter(([, targets]) => targets.length > 1)
    .map(([alias, targets]) => ({ alias, targets: targets.map(targetKey) }))
}

export function createTaxonomyCategoryIdResolver(categoryIdBySlug: Readonly<Record<string, string>>) {
  return (input: { sourceCategory: string }) => {
    const match = resolveFeedCategory(input.sourceCategory)
    if (!match) return undefined

    if (match.subcategorySlug) {
      const subcategoryId = categoryIdBySlug[match.subcategorySlug]
      if (subcategoryId) return subcategoryId
    }

    return categoryIdBySlug[match.categorySlug]
  }
}

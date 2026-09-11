import { buyingGuides } from '@/content/editorial-catalog'
import { categories } from '@/content/categories'
import { editorialCollections } from '@/content/collections'

export type SearchCompassMatch = {
  kind: 'category' | 'subcategory' | 'guide' | 'collection'
  eyebrow: string
  title: string
  description: string
  href: string
  score: number
}

export const suggestedSearches = [
  'laptop',
  'hoofdtelefoon',
  'koffiezetapparaat',
  'kinderwagen',
  'wandelschoenen',
  'koffer',
] as const

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('nl-NL')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function phraseScore(needle: string, values: readonly string[]): number {
  if (!needle) return 0
  const tokens = needle.split(' ').filter(Boolean)
  let best = 0

  for (const raw of values) {
    const value = normalize(raw)
    if (!value) continue
    if (value === needle) best = Math.max(best, 120)
    else if (value.startsWith(needle) || needle.startsWith(value)) best = Math.max(best, 95)
    else if (value.includes(needle) || needle.includes(value)) best = Math.max(best, 78)
    else if (tokens.every((token) => value.includes(token))) best = Math.max(best, 62)
    else if (tokens.some((token) => token.length >= 3 && value.includes(token))) best = Math.max(best, 36)
  }

  return best
}

export function buildSearchCompass(term?: string, limit = 6): SearchCompassMatch[] {
  const needle = normalize(term ?? '')
  if (!needle) return []

  const matches: SearchCompassMatch[] = []

  for (const category of categories) {
    const categoryScore = phraseScore(needle, [
      category.title,
      category.slug,
      ...category.feedAliases,
      ...category.topics,
      ...category.popularProductTypes,
    ])
    if (categoryScore > 0) {
      matches.push({
        kind: 'category',
        eyebrow: 'Hoofdcategorie',
        title: category.title,
        description: category.description,
        href: `/categorie/${category.slug}`,
        score: categoryScore + 8,
      })
    }

    for (const subcategory of category.subcategories) {
      const score = phraseScore(needle, [
        subcategory.title,
        subcategory.slug,
        subcategory.description,
        ...subcategory.feedAliases,
        category.title,
      ])
      if (score > 0) {
        matches.push({
          kind: 'subcategory',
          eyebrow: category.title,
          title: subcategory.title,
          description: subcategory.description,
          href: `/categorie/${subcategory.slug}`,
          score: score + 12,
        })
      }
    }
  }

  for (const guide of buyingGuides) {
    const score = phraseScore(needle, [
      guide.title,
      guide.description,
      guide.slug,
      ...guide.quickChoice.flatMap((item) => [item.situation, item.advice]),
    ])
    if (score > 0) {
      matches.push({
        kind: 'guide',
        eyebrow: 'Koopgids',
        title: guide.title,
        description: guide.description,
        href: `/koopgidsen/${guide.slug}`,
        score: score + 4,
      })
    }
  }

  for (const collection of editorialCollections) {
    const score = phraseScore(needle, [
      collection.title,
      collection.description,
      collection.slug,
      ...collection.sections.flatMap((section) => [section.title, section.description]),
    ])
    if (score > 0) {
      matches.push({
        kind: 'collection',
        eyebrow: 'Collectie',
        title: collection.title,
        description: collection.description,
        href: `/collecties/${collection.slug}`,
        score: score + 6,
      })
    }
  }

  return matches
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'nl-NL'))
    .filter((match, index, all) => all.findIndex((candidate) => candidate.href === match.href) === index)
    .slice(0, Math.max(1, limit))
}

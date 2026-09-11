import { cadeausFeestCollection } from './cadeaus-feest'

export const editorialCollections = [cadeausFeestCollection] as const

export type EditorialCollectionSlug = (typeof editorialCollections)[number]['slug']

export function getEditorialCollection(slug: string) {
  return editorialCollections.find((collection) => collection.slug === slug)
}

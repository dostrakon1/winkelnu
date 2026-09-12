import { cadeausFeestCollection } from './cadeaus-feest'
import { halloweenCollection } from './halloween'
import { kerstCollection } from './kerst'
import { sinterklaasCollection } from './sinterklaas'

export const editorialCollections = [
  cadeausFeestCollection,
  halloweenCollection,
  sinterklaasCollection,
  kerstCollection,
] as const

export type EditorialCollectionSlug = (typeof editorialCollections)[number]['slug']

export function getEditorialCollection(slug: string) {
  return editorialCollections.find((collection) => collection.slug === slug)
}

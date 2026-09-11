export type CollectionSection = {
  slug: string
  title: string
  description: string
  categorySlugs: readonly string[]
}

export type EditorialCollection = {
  slug: string
  title: string
  description: string
  intro: string
  sections: readonly CollectionSection[]
}

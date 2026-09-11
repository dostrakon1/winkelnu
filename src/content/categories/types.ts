export type CategorySubcategory = {
  title: string
  description: string
}

export type CategoryBuyingTip = {
  title: string
  description: string
}

export type CategoryFaq = {
  question: string
  answer: string
}

export type CategoryContent = {
  slug: string
  title: string
  description: string
  intro: string
  topics: readonly string[]
  subcategories: readonly CategorySubcategory[]
  buyingTips: readonly CategoryBuyingTip[]
  popularProductTypes: readonly string[]
  faq: readonly CategoryFaq[]
  featuredGuideSlugs: readonly string[]
}

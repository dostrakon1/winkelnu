export type Money = {
  amount: string
  currency: 'EUR'
}

export type Merchant = {
  id: string
  slug: string
  name: string
  websiteUrl: string
  isActive: boolean
}

export type ProductSpecification = {
  label: string
  value: string
}

export type ProductSource = {
  label: string
  url: string
  checkedAt?: string
}

export type ProductVisualKind =
  | 'laptop'
  | 'headphones'
  | 'tablet'
  | 'mouse'
  | 'stick-vacuum'
  | 'canister-vacuum'
  | 'smart-lighting'
  | 'washing-machine'
  | 'airfryer'
  | 'coffee-machine'
  | 'dual-airfryer'
  | 'stand-mixer'
  | 'toothbrush'
  | 'shaver'
  | 'epilator'
  | 'watch'
  | 'fitness-band'
  | 'bottle'
  | 'tent'
  | 'mower'
  | 'pressure-washer'
  | 'drill'
  | 'robot-mower'

export type Product = {
  id: string
  slug: string
  title: string
  description?: string
  brand?: string
  gtin?: string
  mpn?: string
  imageUrl?: string
  categoryId?: string
  specifications?: ProductSpecification[]
  source?: ProductSource
  visualKind?: ProductVisualKind
}

export type Offer = {
  id: string
  productId: string
  merchantId: string
  merchantProductId: string
  price: Money
  shippingCost?: Money
  availability?: string
  productUrl: string
  affiliateUrl: string
  sourceUpdatedAt?: string
  importedAt: string
  lastSeenAt: string
  isActive: boolean
}

export type Category = {
  id: string
  slug: string
  name: string
  parentId?: string
}

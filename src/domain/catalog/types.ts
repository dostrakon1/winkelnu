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

export type Category = {
  id: string
  name: string
  slug: string
  parentId?: string
}

export type Merchant = {
  id: string
  name: string
  slug: string
  networkId?: string
}

export type OfferAvailability = 'in_stock' | 'out_of_stock' | 'preorder' | 'unknown'

export type Offer = {
  id: string
  productId: string
  merchantId: string
  price: string
  currency: 'EUR'
  shippingCost?: string
  availability: OfferAvailability
  affiliateUrl: string
  lastSeenAt: string
}

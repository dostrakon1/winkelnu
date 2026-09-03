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

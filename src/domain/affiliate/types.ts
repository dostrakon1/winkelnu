export type AffiliateRedirectTarget = {
  offerId: string
  productId: string
  merchantId: string
  affiliateUrl: string
  isActive: boolean
}

export type AffiliateClickEvent = {
  id: string
  offerId: string
  productId: string
  merchantId: string
  sourcePath?: string
  occurredAt: string
}

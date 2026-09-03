import type { CatalogReadRepository } from './ports'
import type { Category, Merchant, Offer, Product } from '@/domain/catalog/types'

export type RankedOffer = {
  offer: Offer
  merchant?: Merchant
  totalAmount: string
}

export type CatalogProductListItem = {
  product: Product
  bestOffer?: RankedOffer
  offerCount: number
}

export type CatalogProductDetail = {
  product: Product
  offers: RankedOffer[]
}

function cents(amount: string): number {
  const [euros = '0', decimals = '00'] = amount.split('.')
  return Number(euros) * 100 + Number(decimals.padEnd(2, '0').slice(0, 2))
}

function amountFromCents(value: number): string {
  return `${Math.floor(value / 100)}.${String(value % 100).padStart(2, '0')}`
}

function totalOfferAmount(offer: Offer): string {
  const shipping = offer.shippingCost ? cents(offer.shippingCost.amount) : 0
  return amountFromCents(cents(offer.price.amount) + shipping)
}

export class CatalogService {
  constructor(private readonly repository: CatalogReadRepository) {}

  async listProducts(input?: {
    categorySlug?: string
    limit?: number
    offset?: number
  }): Promise<CatalogProductListItem[]> {
    const [products, merchants] = await Promise.all([
      this.repository.listProducts(input),
      this.repository.listActiveMerchants(),
    ])
    const merchantById = new Map(merchants.map((merchant) => [merchant.id, merchant]))

    return Promise.all(
      products.map(async (product) => {
        const detail = await this.repository.getProductBySlug(product.slug)
        const ranked = (detail?.offers ?? [])
          .filter((offer) => offer.isActive)
          .map((offer) => ({
            offer,
            merchant: merchantById.get(offer.merchantId),
            totalAmount: totalOfferAmount(offer),
          }))
          .sort((a, b) => cents(a.totalAmount) - cents(b.totalAmount))

        return {
          product,
          bestOffer: ranked[0],
          offerCount: ranked.length,
        }
      }),
    )
  }

  async getProduct(slug: string): Promise<CatalogProductDetail | null> {
    const [detail, merchants] = await Promise.all([
      this.repository.getProductBySlug(slug),
      this.repository.listActiveMerchants(),
    ])
    if (!detail) return null

    const merchantById = new Map(merchants.map((merchant) => [merchant.id, merchant]))
    const offers = detail.offers
      .filter((offer) => offer.isActive)
      .map((offer) => ({
        offer,
        merchant: merchantById.get(offer.merchantId),
        totalAmount: totalOfferAmount(offer),
      }))
      .sort((a, b) => cents(a.totalAmount) - cents(b.totalAmount))

    return { product: detail.product, offers }
  }

  async listCategories(): Promise<Category[]> {
    return this.repository.listCategories()
  }
}

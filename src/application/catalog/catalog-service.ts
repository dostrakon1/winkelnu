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

export type CategoryDiscoveryPage = {
  category: Category
  items: CatalogProductListItem[]
  page: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
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

  private async decorateProducts(products: Product[]): Promise<CatalogProductListItem[]> {
    const merchants = await this.repository.listActiveMerchants()
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

  async listProducts(input?: {
    categorySlug?: string
    limit?: number
    offset?: number
  }): Promise<CatalogProductListItem[]> {
    const products = await this.repository.listProducts(input)
    return this.decorateProducts(products)
  }

  async getCategory(slug: string): Promise<Category | null> {
    const categories = await this.repository.listCategories()
    return categories.find((category) => category.slug === slug) ?? null
  }

  async getCategoryDiscovery(input: {
    categorySlug: string
    page?: number
    pageSize?: number
  }): Promise<CategoryDiscoveryPage | null> {
    const page = Math.max(1, Math.trunc(input.page ?? 1))
    const pageSize = Math.min(48, Math.max(1, Math.trunc(input.pageSize ?? 24)))
    const category = await this.getCategory(input.categorySlug)
    if (!category) return null

    const offset = (page - 1) * pageSize
    const products = await this.repository.listProducts({
      categorySlug: category.slug,
      limit: pageSize + 1,
      offset,
    })
    const hasNextPage = products.length > pageSize
    const visibleProducts = products.slice(0, pageSize)
    const items = await this.decorateProducts(visibleProducts)

    items.sort((a, b) => {
      if (a.bestOffer && b.bestOffer) return cents(a.bestOffer.totalAmount) - cents(b.bestOffer.totalAmount)
      if (a.bestOffer) return -1
      if (b.bestOffer) return 1
      return a.product.title.localeCompare(b.product.title, 'nl-NL')
    })

    return {
      category,
      items,
      page,
      pageSize,
      hasPreviousPage: page > 1,
      hasNextPage,
    }
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

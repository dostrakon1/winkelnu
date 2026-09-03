import type { CatalogReadRepository, CatalogWriteRepository, ProductWithOffers } from '@/application/catalog/ports'
import type { Category, Merchant, Offer, Product } from '@/domain/catalog/types'

export class InMemoryCatalogRepository implements CatalogReadRepository, CatalogWriteRepository {
  private readonly merchants = new Map<string, Merchant>()
  private readonly products = new Map<string, Product>()
  private readonly offers = new Map<string, Offer>()
  private readonly categories = new Map<string, Category>()

  constructor(seed?: { categories?: Category[] }) {
    for (const category of seed?.categories ?? []) this.categories.set(category.id, category)
  }

  async getProductBySlug(slug: string): Promise<ProductWithOffers | null> {
    const product = [...this.products.values()].find((item) => item.slug === slug)
    if (!product) return null

    return {
      product,
      offers: [...this.offers.values()].filter((offer) => offer.productId === product.id && offer.isActive),
    }
  }

  async listProducts(input?: { categorySlug?: string; limit?: number; offset?: number }): Promise<Product[]> {
    let products = [...this.products.values()]

    if (input?.categorySlug) {
      const category = [...this.categories.values()].find((item) => item.slug === input.categorySlug)
      products = category ? products.filter((product) => product.categoryId === category.id) : []
    }

    const offset = input?.offset ?? 0
    const limit = input?.limit ?? products.length
    return products.slice(offset, offset + limit)
  }

  async listCategories(): Promise<Category[]> {
    return [...this.categories.values()]
  }

  async listActiveMerchants(): Promise<Merchant[]> {
    return [...this.merchants.values()].filter((merchant) => merchant.isActive)
  }

  async upsertMerchant(merchant: Merchant): Promise<void> {
    this.merchants.set(merchant.id, merchant)
  }

  async upsertProduct(product: Product): Promise<void> {
    this.products.set(product.id, product)
  }

  async upsertOffer(offer: Offer): Promise<void> {
    this.offers.set(offer.id, offer)
  }

  async deactivateMissingOffers(input: { merchantId: string; seenBefore: string }): Promise<number> {
    let count = 0
    for (const [id, offer] of this.offers) {
      if (offer.merchantId === input.merchantId && offer.lastSeenAt < input.seenBefore && offer.isActive) {
        this.offers.set(id, { ...offer, isActive: false })
        count += 1
      }
    }
    return count
  }
}

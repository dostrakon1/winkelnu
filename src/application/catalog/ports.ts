import type { Category, Merchant, Offer, Product } from '@/domain/catalog/types'

export type ProductWithOffers = {
  product: Product
  offers: Offer[]
}

export interface CatalogReadRepository {
  getProductBySlug(slug: string): Promise<ProductWithOffers | null>
  listProducts(input?: { categorySlug?: string; limit?: number; offset?: number }): Promise<Product[]>
  listCategories(): Promise<Category[]>
  listActiveMerchants(): Promise<Merchant[]>
}

export interface CatalogWriteRepository {
  upsertMerchant(merchant: Merchant): Promise<void>
  upsertProduct(product: Product): Promise<void>
  upsertOffer(offer: Offer): Promise<void>
  deactivateMissingOffers(input: { merchantId: string; seenBefore: string }): Promise<number>
}

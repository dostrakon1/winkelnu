import type { Category, Merchant, Offer, Product } from '@/domain/catalog/types'
import type { ImportReject, ImportRun, MatchReviewItem } from '@/domain/catalog/import-observability'

export type ProductWithOffers = {
  product: Product
  offers: Offer[]
}

export interface CatalogReadRepository {
  getProductBySlug(slug: string): Promise<ProductWithOffers | null>
  listProducts(input?: { categorySlug?: string; limit?: number; offset?: number }): Promise<Product[]>
  listCategories(): Promise<Category[]>
  listActiveMerchants(): Promise<Merchant[]>
  listImportRuns(input?: { limit?: number }): Promise<ImportRun[]>
  listImportRejects(importRunId: string): Promise<ImportReject[]>
  listPendingMatchReviews(input?: { limit?: number }): Promise<MatchReviewItem[]>
}

export interface CatalogWriteRepository {
  upsertMerchant(merchant: Merchant): Promise<void>
  upsertProduct(product: Product): Promise<void>
  upsertOffer(offer: Offer): Promise<void>
  deactivateMissingOffers(input: { merchantId: string; seenBefore: string }): Promise<number>
  createImportRun(importRun: ImportRun): Promise<void>
  updateImportRun(importRun: ImportRun): Promise<void>
  addImportReject(reject: ImportReject): Promise<void>
  addMatchReview(item: MatchReviewItem): Promise<void>
}

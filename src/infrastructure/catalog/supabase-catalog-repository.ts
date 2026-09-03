import 'server-only'

import type { CatalogReadRepository, CatalogWriteRepository, ProductWithOffers } from '@/application/catalog/ports'
import type { ImportReject, ImportRun, MatchReviewItem } from '@/domain/catalog/import-observability'
import type { Category, Merchant, Offer, Product } from '@/domain/catalog/types'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

function money(amount: unknown): { amount: string; currency: 'EUR' } {
  return { amount: String(amount ?? '0.00'), currency: 'EUR' }
}

function fail(error: { message: string } | null, context: string): void {
  if (error) throw new Error(`${context}: ${error.message}`)
}

export class SupabaseCatalogRepository implements CatalogReadRepository, CatalogWriteRepository {
  private readonly db = createSupabaseServerClient()

  private async merchantUuid(externalKey: string): Promise<string> {
    const { data, error } = await this.db.from('merchants').select('id').eq('external_key', externalKey).single()
    fail(error, `Resolve merchant ${externalKey}`)
    return data.id
  }

  private async productUuid(externalKey: string): Promise<string> {
    const { data, error } = await this.db.from('products').select('id').eq('external_key', externalKey).single()
    fail(error, `Resolve product ${externalKey}`)
    return data.id
  }

  private async categoryUuid(externalKey?: string): Promise<string | null> {
    if (!externalKey) return null
    const { data, error } = await this.db.from('categories').select('id').eq('external_key', externalKey).maybeSingle()
    fail(error, `Resolve category ${externalKey}`)
    return data?.id ?? null
  }

  private async importRunUuid(externalKey: string): Promise<string> {
    const { data, error } = await this.db.from('import_runs').select('id').eq('external_key', externalKey).single()
    fail(error, `Resolve import run ${externalKey}`)
    return data.id
  }

  async getProductBySlug(slug: string): Promise<ProductWithOffers | null> {
    const { data: row, error } = await this.db.from('products').select('*').eq('slug', slug).maybeSingle()
    fail(error, `Read product ${slug}`)
    if (!row) return null

    const product: Product = {
      id: row.external_key,
      slug: row.slug,
      title: row.title,
      description: row.description ?? undefined,
      brand: row.brand ?? undefined,
      gtin: row.primary_gtin ?? undefined,
      mpn: row.mpn ?? undefined,
      imageUrl: row.primary_image_url ?? undefined,
      categoryId: undefined,
    }

    const { data: offerRows, error: offersError } = await this.db
      .from('offers')
      .select('*')
      .eq('product_id', row.id)
      .eq('is_active', true)
      .order('price', { ascending: true })
    fail(offersError, `Read offers for ${slug}`)

    const offers: Offer[] = (offerRows ?? []).map((offer) => ({
      id: offer.external_key,
      productId: product.id,
      merchantId: '',
      merchantProductId: offer.merchant_product_id,
      price: money(offer.price),
      shippingCost: offer.shipping_cost == null ? undefined : money(offer.shipping_cost),
      availability: offer.availability ?? undefined,
      productUrl: offer.product_url,
      affiliateUrl: offer.affiliate_url,
      sourceUpdatedAt: offer.source_updated_at ?? undefined,
      importedAt: offer.imported_at,
      lastSeenAt: offer.last_seen_at,
      isActive: offer.is_active,
    }))

    return { product, offers }
  }

  async listProducts(input?: { categorySlug?: string; limit?: number; offset?: number }): Promise<Product[]> {
    let query = this.db.from('products').select('*').eq('status', 'published').order('updated_at', { ascending: false })
    if (input?.categorySlug) {
      const { data: category, error } = await this.db.from('categories').select('id').eq('slug', input.categorySlug).maybeSingle()
      fail(error, `Resolve category slug ${input.categorySlug}`)
      if (!category) return []
      query = query.eq('category_id', category.id)
    }
    const offset = input?.offset ?? 0
    const limit = input?.limit ?? 24
    const { data, error } = await query.range(offset, offset + limit - 1)
    fail(error, 'List products')
    return (data ?? []).map((row) => ({
      id: row.external_key,
      slug: row.slug,
      title: row.title,
      description: row.description ?? undefined,
      brand: row.brand ?? undefined,
      gtin: row.primary_gtin ?? undefined,
      mpn: row.mpn ?? undefined,
      imageUrl: row.primary_image_url ?? undefined,
      categoryId: undefined,
    }))
  }

  async listCategories(): Promise<Category[]> {
    const { data, error } = await this.db.from('categories').select('*').eq('is_active', true).order('name')
    fail(error, 'List categories')
    return (data ?? []).map((row) => ({ id: row.external_key, slug: row.slug, name: row.name, parentId: undefined }))
  }

  async listActiveMerchants(): Promise<Merchant[]> {
    const { data, error } = await this.db.from('merchants').select('*').eq('is_active', true).order('name')
    fail(error, 'List merchants')
    return (data ?? []).map((row) => ({
      id: row.external_key,
      slug: row.slug,
      name: row.name,
      websiteUrl: row.website_url,
      isActive: row.is_active,
    }))
  }

  async upsertMerchant(merchant: Merchant): Promise<void> {
    const { error } = await this.db.from('merchants').upsert({
      external_key: merchant.id,
      slug: merchant.slug,
      name: merchant.name,
      website_url: merchant.websiteUrl,
      is_active: merchant.isActive,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'external_key' })
    fail(error, `Upsert merchant ${merchant.id}`)
  }

  async upsertProduct(product: Product): Promise<void> {
    const categoryId = await this.categoryUuid(product.categoryId)
    const { error } = await this.db.from('products').upsert({
      external_key: product.id,
      category_id: categoryId,
      slug: product.slug,
      title: product.title,
      description: product.description ?? null,
      brand: product.brand ?? null,
      mpn: product.mpn ?? null,
      primary_gtin: product.gtin ?? null,
      primary_image_url: product.imageUrl ?? null,
      status: 'published',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'external_key' })
    fail(error, `Upsert product ${product.id}`)
  }

  async upsertOffer(offer: Offer): Promise<void> {
    const [productId, merchantId] = await Promise.all([
      this.productUuid(offer.productId),
      this.merchantUuid(offer.merchantId),
    ])
    const { error } = await this.db.from('offers').upsert({
      external_key: offer.id,
      product_id: productId,
      merchant_id: merchantId,
      merchant_product_id: offer.merchantProductId,
      price: offer.price.amount,
      currency: offer.price.currency,
      shipping_cost: offer.shippingCost?.amount ?? null,
      availability: offer.availability ?? null,
      product_url: offer.productUrl,
      affiliate_url: offer.affiliateUrl,
      source_updated_at: offer.sourceUpdatedAt ?? null,
      imported_at: offer.importedAt,
      last_seen_at: offer.lastSeenAt,
      is_active: offer.isActive,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'external_key' })
    fail(error, `Upsert offer ${offer.id}`)
  }

  async deactivateMissingOffers(input: { merchantId: string; seenBefore: string }): Promise<number> {
    const merchantId = await this.merchantUuid(input.merchantId)
    const { data, error } = await this.db
      .from('offers')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('merchant_id', merchantId)
      .eq('is_active', true)
      .lt('last_seen_at', input.seenBefore)
      .select('id')
    fail(error, `Deactivate stale offers for ${input.merchantId}`)
    return data?.length ?? 0
  }

  async createImportRun(importRun: ImportRun): Promise<void> {
    const merchantId = await this.merchantUuid(importRun.merchantId)
    const { data: source, error: sourceError } = await this.db.from('feed_sources').upsert({
      merchant_id: merchantId,
      source_key: importRun.sourceKey,
      source_type: 'manual',
      is_active: true,
    }, { onConflict: 'merchant_id,source_key' }).select('id').single()
    fail(sourceError, `Ensure feed source ${importRun.sourceKey}`)

    const { error } = await this.db.from('import_runs').insert({
      external_key: importRun.id,
      feed_source_id: source.id,
      status: importRun.status,
      started_at: importRun.startedAt,
      finished_at: importRun.finishedAt ?? null,
      records_seen: importRun.recordsSeen,
      records_accepted: importRun.recordsAccepted,
      records_rejected: importRun.recordsRejected,
      offers_deactivated: importRun.offersDeactivated,
      review_required: importRun.reviewRequired,
      error_summary: importRun.errorSummary,
    })
    fail(error, `Create import run ${importRun.id}`)
  }

  async updateImportRun(importRun: ImportRun): Promise<void> {
    const { error } = await this.db.from('import_runs').update({
      status: importRun.status,
      finished_at: importRun.finishedAt ?? null,
      records_seen: importRun.recordsSeen,
      records_accepted: importRun.recordsAccepted,
      records_rejected: importRun.recordsRejected,
      offers_deactivated: importRun.offersDeactivated,
      review_required: importRun.reviewRequired,
      error_summary: importRun.errorSummary,
    }).eq('external_key', importRun.id)
    fail(error, `Update import run ${importRun.id}`)
  }

  async addImportReject(reject: ImportReject): Promise<void> {
    const importRunId = await this.importRunUuid(reject.importRunId)
    const { error } = await this.db.from('import_rejects').insert({
      import_run_id: importRunId,
      source_key: reject.sourceKey,
      merchant_product_id: reject.merchantProductId,
      reasons: reject.reasons,
      rejected_at: reject.rejectedAt,
    })
    fail(error, `Add import reject ${reject.id}`)
  }

  async addMatchReview(item: MatchReviewItem): Promise<void> {
    const [importRunId, merchantId] = await Promise.all([
      this.importRunUuid(item.importRunId),
      this.merchantUuid(item.merchantId),
    ])
    const canonicalProductId = item.decision.canonicalProductId
      ? await this.productUuid(item.decision.canonicalProductId).catch(() => null)
      : null
    const { error } = await this.db.from('product_match_reviews').upsert({
      import_run_id: importRunId,
      merchant_id: merchantId,
      source_key: item.sourceKey,
      merchant_product_id: item.decision.merchantProductId,
      canonical_product_id: canonicalProductId,
      match_method: item.decision.method,
      confidence: item.decision.confidence,
      reasons: item.decision.reasons,
      status: item.status,
      created_at: item.createdAt,
      resolved_at: item.resolvedAt ?? null,
    }, { onConflict: 'import_run_id,merchant_product_id' })
    fail(error, `Add match review ${item.id}`)
  }

  async listImportRuns(input?: { limit?: number }): Promise<ImportRun[]> {
    const { data, error } = await this.db.from('import_runs').select('*, feed_sources(source_key, merchants(external_key))').order('started_at', { ascending: false }).limit(input?.limit ?? 25)
    fail(error, 'List import runs')
    return (data ?? []).map((row) => ({
      id: row.external_key,
      sourceKey: row.feed_sources?.source_key ?? '',
      merchantId: row.feed_sources?.merchants?.external_key ?? '',
      status: row.status,
      startedAt: row.started_at,
      finishedAt: row.finished_at ?? undefined,
      recordsSeen: row.records_seen,
      recordsAccepted: row.records_accepted,
      recordsRejected: row.records_rejected,
      offersDeactivated: row.offers_deactivated,
      reviewRequired: row.review_required,
      errorSummary: Array.isArray(row.error_summary) ? row.error_summary.map(String) : [],
    }))
  }

  async listImportRejects(importRunId: string): Promise<ImportReject[]> {
    const runId = await this.importRunUuid(importRunId)
    const { data, error } = await this.db.from('import_rejects').select('*').eq('import_run_id', runId).order('rejected_at')
    fail(error, `List rejects for ${importRunId}`)
    return (data ?? []).map((row) => ({
      id: row.id,
      importRunId,
      sourceKey: row.source_key,
      merchantProductId: row.merchant_product_id,
      reasons: Array.isArray(row.reasons) ? row.reasons.map(String) : [],
      rejectedAt: row.rejected_at,
    }))
  }

  async listPendingMatchReviews(input?: { limit?: number }): Promise<MatchReviewItem[]> {
    const { data, error } = await this.db.from('product_match_reviews').select('*, import_runs(external_key), merchants(external_key), products(external_key)').eq('status', 'pending').order('created_at').limit(input?.limit ?? 50)
    fail(error, 'List pending match reviews')
    return (data ?? []).map((row) => ({
      id: row.id,
      importRunId: row.import_runs?.external_key ?? '',
      merchantId: row.merchants?.external_key ?? '',
      sourceKey: row.source_key,
      decision: {
        merchantProductId: row.merchant_product_id,
        canonicalProductId: row.products?.external_key ?? undefined,
        method: row.match_method,
        confidence: row.confidence,
        reasons: Array.isArray(row.reasons) ? row.reasons.map(String) : [],
        decidedAt: row.created_at,
        requiresReview: true,
      },
      status: row.status,
      createdAt: row.created_at,
      resolvedAt: row.resolved_at ?? undefined,
    }))
  }
}

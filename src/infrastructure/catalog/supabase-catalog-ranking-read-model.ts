import 'server-only'

import type { CatalogProductListItem } from '@/application/catalog/catalog-service'
import type { CatalogRankingReadModel } from '@/application/catalog/read-model-ports'
import type { CatalogSearchQuery } from '@/application/catalog/search-query'
import type { OfferFreshnessStatus } from '@/domain/catalog/offer-freshness'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

type RankedRow = {
  product_external_key: string
  product_slug: string
  product_title: string
  product_description: string | null
  product_brand: string | null
  product_gtin: string | null
  product_mpn: string | null
  product_image_url: string | null
  category_external_key: string | null
  offer_external_key: string
  merchant_external_key: string
  merchant_slug: string
  merchant_name: string
  merchant_website_url: string
  merchant_product_id: string
  price: string | number
  shipping_cost: string | number | null
  total_amount: string | number
  availability: string | null
  product_url: string
  affiliate_url: string
  source_updated_at: string | null
  imported_at: string
  last_seen_at: string
  freshness: string
  offer_count: string | number
}

function freshness(value: string): OfferFreshnessStatus {
  return value === 'stale' ? 'stale' : 'fresh'
}

function mapRow(row: RankedRow): CatalogProductListItem {
  return {
    product: {
      id: row.product_external_key,
      slug: row.product_slug,
      title: row.product_title,
      description: row.product_description ?? undefined,
      brand: row.product_brand ?? undefined,
      gtin: row.product_gtin ?? undefined,
      mpn: row.product_mpn ?? undefined,
      imageUrl: row.product_image_url ?? undefined,
      categoryId: row.category_external_key ?? undefined,
    },
    bestOffer: {
      offer: {
        id: row.offer_external_key,
        productId: row.product_external_key,
        merchantId: row.merchant_external_key,
        merchantProductId: row.merchant_product_id,
        price: { amount: String(row.price), currency: 'EUR' },
        shippingCost: row.shipping_cost == null ? undefined : { amount: String(row.shipping_cost), currency: 'EUR' },
        availability: row.availability ?? undefined,
        productUrl: row.product_url,
        affiliateUrl: row.affiliate_url,
        sourceUpdatedAt: row.source_updated_at ?? undefined,
        importedAt: row.imported_at,
        lastSeenAt: row.last_seen_at,
        isActive: true,
      },
      merchant: {
        id: row.merchant_external_key,
        slug: row.merchant_slug,
        name: row.merchant_name,
        websiteUrl: row.merchant_website_url,
        isActive: true,
      },
      totalAmount: String(row.total_amount),
      freshness: freshness(row.freshness),
    },
    offerCount: Number(row.offer_count),
  }
}

export class SupabaseCatalogRankingReadModel implements CatalogRankingReadModel {
  private readonly db = createSupabaseServerClient()

  private async query(input: {
    now: string
    categorySlug?: string
    term?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    inStockOnly?: boolean
    sort: CatalogSearchQuery['sort'] | 'price_asc'
    limit: number
    offset: number
  }): Promise<CatalogProductListItem[]> {
    const { data, error } = await this.db.rpc('catalog_ranked_products', {
      p_now: input.now,
      p_category_slug: input.categorySlug ?? null,
      p_term: input.term ?? null,
      p_brand: input.brand ?? null,
      p_min_total: input.minPrice ?? null,
      p_max_total: input.maxPrice ?? null,
      p_in_stock_only: input.inStockOnly ?? false,
      p_sort: input.sort,
      p_limit: Math.min(Math.max(input.limit, 1), 49),
      p_offset: Math.max(input.offset, 0),
    })

    if (error) throw new Error(`Read ranked catalog products: ${error.message}`)
    return ((data ?? []) as RankedRow[]).map(mapRow)
  }

  listRankedProducts(input: { categorySlug?: string; limit: number; offset: number; now: string }): Promise<CatalogProductListItem[]> {
    return this.query({ ...input, sort: 'price_asc' })
  }

  async searchRankedProducts(input: { query: CatalogSearchQuery; now: string }): Promise<{ items: CatalogProductListItem[]; hasNext: boolean }> {
    const offset = (input.query.page - 1) * input.query.pageSize
    const rows = await this.query({
      now: input.now,
      categorySlug: input.query.categorySlug,
      term: input.query.term,
      brand: input.query.brand,
      minPrice: input.query.minPrice,
      maxPrice: input.query.maxPrice,
      inStockOnly: input.query.inStockOnly,
      sort: input.query.sort,
      limit: input.query.pageSize + 1,
      offset,
    })
    return { items: rows.slice(0, input.query.pageSize), hasNext: rows.length > input.query.pageSize }
  }
}

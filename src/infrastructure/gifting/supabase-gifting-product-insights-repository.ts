import 'server-only'

import type { GiftingInsightsRange } from '@/application/gifting/gifting-insights'
import type {
  GiftingProductInsightsRepository,
  GiftingProductOccasion,
  GiftingProductOverview,
  GiftingProductRanking,
} from '@/application/gifting/gifting-product-insights'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

type OverviewRow = {
  native_product_saves: unknown
  external_link_wishes: unknown
  text_wishes: unknown
  gifting_affiliate_clicks: unknown
  active_reservations: unknown
  average_native_price_cents: unknown
}

type RankingRow = {
  product_external_key: string
  product_title: string
  product_slug: string
  category_name: string | null
  saved_count: unknown
  gifting_click_count: unknown
  active_reservation_count: unknown
  average_saved_price_cents: unknown
}

type OccasionRow = {
  occasion: GiftingProductOccasion['occasion']
  items_added: unknown
  native_product_saves: unknown
}

function number(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

const emptyOverview: GiftingProductOverview = {
  nativeProductSaves: 0,
  externalLinkWishes: 0,
  textWishes: 0,
  giftingAffiliateClicks: 0,
  activeReservations: 0,
  averageNativePriceCents: 0,
}

export class SupabaseGiftingProductInsightsRepository implements GiftingProductInsightsRepository {
  private readonly db = createSupabaseServerClient()

  async readOverview(range: GiftingInsightsRange): Promise<GiftingProductOverview> {
    const { data, error } = await this.db.rpc('gifting_insights_product_overview', {
      p_from: range.fromDate,
      p_to: range.toDate,
    })

    if (error) throw new Error(`Read gifting product overview: ${error.message}`)
    const row = ((data ?? []) as OverviewRow[])[0]
    if (!row) return emptyOverview

    return {
      nativeProductSaves: number(row.native_product_saves),
      externalLinkWishes: number(row.external_link_wishes),
      textWishes: number(row.text_wishes),
      giftingAffiliateClicks: number(row.gifting_affiliate_clicks),
      activeReservations: number(row.active_reservations),
      averageNativePriceCents: number(row.average_native_price_cents),
    }
  }

  async readRankings(range: GiftingInsightsRange): Promise<GiftingProductRanking[]> {
    const { data, error } = await this.db.rpc('gifting_insights_product_rankings', {
      p_from: range.fromDate,
      p_to: range.toDate,
    })

    if (error) throw new Error(`Read gifting product rankings: ${error.message}`)

    return ((data ?? []) as RankingRow[]).map((row) => ({
      productExternalKey: row.product_external_key,
      productTitle: row.product_title,
      productSlug: row.product_slug,
      categoryName: row.category_name ?? undefined,
      savedCount: number(row.saved_count),
      giftingClickCount: number(row.gifting_click_count),
      activeReservationCount: number(row.active_reservation_count),
      averageSavedPriceCents: number(row.average_saved_price_cents),
    }))
  }

  async readByOccasion(range: GiftingInsightsRange): Promise<GiftingProductOccasion[]> {
    const { data, error } = await this.db.rpc('gifting_insights_products_by_occasion', {
      p_from: range.fromDate,
      p_to: range.toDate,
    })

    if (error) throw new Error(`Read gifting product occasions: ${error.message}`)

    return ((data ?? []) as OccasionRow[]).map((row) => ({
      occasion: row.occasion,
      itemsAdded: number(row.items_added),
      nativeProductSaves: number(row.native_product_saves),
    }))
  }
}

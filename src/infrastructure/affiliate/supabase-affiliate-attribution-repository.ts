import 'server-only'

import type { AffiliateAttributionRepository } from '@/application/affiliate/ports'
import type { AffiliateClickEvent, AffiliateRedirectTarget } from '@/domain/affiliate/types'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

function fail(error: { message: string } | null, context: string): void {
  if (error) throw new Error(`${context}: ${error.message}`)
}

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

export class SupabaseAffiliateAttributionRepository implements AffiliateAttributionRepository {
  private readonly db = createSupabaseServerClient()

  async getRedirectTarget(offerId: string): Promise<AffiliateRedirectTarget | null> {
    const { data, error } = await this.db
      .from('offers')
      .select('external_key, affiliate_url, is_active, products(external_key), merchants(external_key)')
      .eq('external_key', offerId)
      .maybeSingle()

    fail(error, `Resolve affiliate offer ${offerId}`)
    if (!data) return null

    const product = firstRelation(data.products)
    const merchant = firstRelation(data.merchants)

    return {
      offerId: data.external_key,
      productId: product?.external_key ?? '',
      merchantId: merchant?.external_key ?? '',
      affiliateUrl: data.affiliate_url,
      isActive: data.is_active,
    }
  }

  async recordClick(event: AffiliateClickEvent): Promise<void> {
    const { data: offer, error: offerError } = await this.db
      .from('offers')
      .select('id, product_id, merchant_id')
      .eq('external_key', event.offerId)
      .maybeSingle()
    fail(offerError, `Resolve click offer ${event.offerId}`)
    if (!offer) throw new Error(`Resolve click offer ${event.offerId}: expected an offer row.`)

    const { error } = await this.db.from('affiliate_click_events').insert({
      external_key: event.id,
      offer_id: offer.id,
      product_id: offer.product_id,
      merchant_id: offer.merchant_id,
      source_path: event.sourcePath ?? null,
      occurred_at: event.occurredAt,
    })
    fail(error, `Record affiliate click ${event.id}`)
  }
}

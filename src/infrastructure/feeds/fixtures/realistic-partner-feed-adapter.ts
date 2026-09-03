import type { FeedAdapter, FeedPage } from '@/infrastructure/feeds/adapter'
import {
  realisticPartnerFixturePages,
  type RealisticPartnerRawItem,
  type RealisticPartnerRawPage,
} from './realistic-partner-fixture'

function mapAvailability(value?: RealisticPartnerRawItem['stock_state']): string | undefined {
  if (value === 'available' || value === 'limited') return 'in_stock'
  if (value === 'unavailable') return 'out_of_stock'
  return undefined
}

export class RealisticPartnerFixtureAdapter implements FeedAdapter {
  readonly sourceKey: string

  constructor(
    sourceKey: string,
    private readonly pages: Record<string, RealisticPartnerRawPage> = realisticPartnerFixturePages,
  ) {
    this.sourceKey = sourceKey
  }

  async fetchPage(input?: { cursor?: string }): Promise<FeedPage> {
    const cursor = input?.cursor ?? 'first'
    const rawPage = this.pages[cursor]
    if (!rawPage) throw new Error(`Fixture transport returned an unknown cursor: ${cursor}`)

    return {
      items: rawPage.records.map((record) => ({
        sourceKey: this.sourceKey,
        merchantProductId: record.offer_id,
        title: record.product_name ?? '',
        description: record.product_description,
        brand: record.brand_name,
        gtin: record.ean,
        mpn: record.manufacturer_part_number,
        merchantSku: record.merchant_sku,
        sourceCategory: record.category_path,
        imageUrls: record.image_url ? [record.image_url] : [],
        price: { amount: record.sale_price, currency: 'EUR' },
        previousPrice: record.old_price ? { amount: record.old_price, currency: 'EUR' } : undefined,
        shippingCost: record.delivery_cost ? { amount: record.delivery_cost, currency: 'EUR' } : undefined,
        availability: mapAvailability(record.stock_state),
        productUrl: record.landing_url,
        affiliateUrl: record.tracking_url,
        sourceUpdatedAt: record.changed_at,
        importedAt: '2026-09-03T05:00:00.000Z',
      })),
      nextCursor: rawPage.next_cursor,
    }
  }
}

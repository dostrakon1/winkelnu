import type { FeedCandidate } from '@/domain/catalog/feed'
import type { PartnerFeedAdapterRegistry } from '@/infrastructure/feeds/partner-adapter-registry'
import { DaisyconProductFeedAdapter, type DaisyconRecordExtractor, type DaisyconRecordMapper } from './daisycon-product-feed-adapter'

export type DaisyconAdapterRegistration = {
  mapRecord: DaisyconRecordMapper
  extractRecords?: DaisyconRecordExtractor
}

export function registerDaisyconJsonAdapter(
  registry: PartnerFeedAdapterRegistry,
  registration: DaisyconAdapterRegistration,
): void {
  registry.register('daisycon:json', ({ resolved, credential }) => {
    if (!credential) throw new Error('Daisycon product feed URL secret is missing.')

    return new DaisyconProductFeedAdapter({
      sourceKey: resolved.source.sourceKey,
      feedUrl: credential,
      mapRecord: registration.mapRecord,
      extractRecords: registration.extractRecords,
    })
  })
}

export type DaisyconStandardProductRecord = {
  id?: string | number
  name?: string
  description?: string
  brand?: string
  gtin?: string
  ean?: string
  mpn?: string
  category?: string
  image?: string
  price?: string | number
  shipping?: string | number
  availability?: string
  product_url?: string
  deeplink?: string
  updated_at?: string
}

function normalizeEuroAmount(value: string | number | undefined): string {
  const raw = String(value ?? '').trim()
  if (!raw) return ''

  const decimal = raw.replace(',', '.')
  if (!/^\d+(?:\.\d{1,2})?$/.test(decimal)) return raw

  const numeric = Number(decimal)
  return Number.isFinite(numeric) ? numeric.toFixed(2) : raw
}

export function mapDaisyconStandardProductRecord(
  record: unknown,
  context: { sourceKey: string; importedAt: string },
): FeedCandidate {
  if (!record || typeof record !== 'object') throw new Error('Daisycon product record must be an object.')
  const value = record as DaisyconStandardProductRecord
  const merchantProductId = String(value.id ?? '').trim()
  const title = value.name?.trim() ?? ''
  const gtin = value.gtin?.trim() || value.ean?.trim()
  const amount = normalizeEuroAmount(value.price)
  const shipping = value.shipping == null ? undefined : normalizeEuroAmount(value.shipping)
  const productUrl = value.product_url?.trim() ?? ''
  const affiliateUrl = value.deeplink?.trim() ?? ''

  return {
    sourceKey: context.sourceKey,
    merchantProductId,
    title,
    description: value.description?.trim(),
    brand: value.brand?.trim(),
    gtin,
    mpn: value.mpn?.trim(),
    sourceCategory: value.category?.trim(),
    imageUrls: value.image ? [value.image] : [],
    price: { amount, currency: 'EUR' },
    shippingCost: shipping === undefined ? undefined : { amount: shipping, currency: 'EUR' },
    availability: value.availability?.trim(),
    productUrl,
    affiliateUrl,
    sourceUpdatedAt: value.updated_at?.trim(),
    importedAt: context.importedAt,
  }
}

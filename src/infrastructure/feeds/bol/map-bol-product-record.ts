import type { FeedCandidate } from '@/domain/catalog/feed'
import { buildBolAffiliateTrackingUrl } from './bol-affiliate-tracking'

export type BolProductFeedRecord = Record<string, string | undefined>

export type BolProductRecordContext = {
  sourceKey: string
  siteId: string
  importedAt: string
}

function optionalText(value: string | undefined): string | undefined {
  const cleaned = value?.trim()
  return cleaned ? cleaned : undefined
}

function normalizeEuroAmount(value: string | undefined): string {
  const cleaned = value?.trim().replace(',', '.') ?? ''
  if (!cleaned) return ''

  const numeric = Number(cleaned)
  return Number.isFinite(numeric) ? numeric.toFixed(2) : cleaned
}

function normalizeAvailability(value: string | undefined): string | undefined {
  const normalized = value?.trim().toUpperCase()

  if (normalized === 'Y') return 'available'
  if (normalized === 'N') return 'unavailable'

  return optionalText(value)
}

function cleanDescription(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined

  const cleaned = value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return cleaned || undefined
}

function sourceCategory(record: BolProductFeedRecord): string | undefined {
  const candidates = [
    record['Category.subssubgroup'],
    record['Category.subgroup'],
    record['Category.productgroup'],
    record['Category.category'],
    record['Category.unit'],
    record['Gpc.brickName'],
    record['Gpc.className'],
    record['Gpc.familyName'],
    record['Gpc.segmentName'],
  ]

  for (const candidate of candidates) {
    const value = optionalText(candidate)
    if (!value) continue
    if (/^onbekend\b/i.test(value)) continue
    return value
  }

  return undefined
}

export function buildBolAffiliateUrl(input: {
  productUrl: string
  siteId: string
  subId?: string
}): string {
  return buildBolAffiliateTrackingUrl({
    siteId: input.siteId,
    productUrl: input.productUrl,
    name: 'winkelnu',
    subId: input.subId,
    format: 'PF',
  })
}

export function mapBolProductRecord(
  record: BolProductFeedRecord,
  context: BolProductRecordContext,
): FeedCandidate {
  const merchantProductId = record.productId?.trim() ?? ''
  const productUrl = record.productPageUrlNL?.trim() ?? ''
  const imageUrl = optionalText(record.imageUrl)

  const sellingPrice = normalizeEuroAmount(
    record['OfferNL.sellingPrice'],
  )

  const listPrice = normalizeEuroAmount(
    record['OfferNL.listPrice'],
  )

  const shippingCost = optionalText(
    record['OfferNL.shippingCost'],
  )

  return {
    sourceKey: context.sourceKey,
    merchantProductId,
    title: record.title?.trim() ?? '',
    description: cleanDescription(record.description),
    brand: optionalText(record.brand),
    gtin: optionalText(record.ean),
    mpn: optionalText(record.mpn),
    sourceCategory: sourceCategory(record),
    imageUrls: imageUrl ? [imageUrl] : [],

    price: {
      amount: sellingPrice,
      currency: 'EUR',
    },

    previousPrice:
      listPrice && listPrice !== sellingPrice
        ? {
            amount: listPrice,
            currency: 'EUR',
          }
        : undefined,

    shippingCost: shippingCost
      ? {
          amount: normalizeEuroAmount(shippingCost),
          currency: 'EUR',
        }
      : undefined,

    availability: normalizeAvailability(
      record['OfferNL.isDeliverable'],
    ),

    productUrl,

    affiliateUrl: buildBolAffiliateUrl({
      productUrl,
      siteId: context.siteId,
      subId: merchantProductId,
    }),

    importedAt: context.importedAt,
  }
}

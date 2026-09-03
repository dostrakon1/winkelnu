import type { FeedCandidate } from '@/domain/catalog/feed'
import { buildBolAffiliateTrackingUrl } from './bol-affiliate-tracking'

export type BolProductFeedFile = {
  fileName: string
  format: 'csv'
  compression: 'gzip'
}

export interface BolProductFeedTransport {
  listFiles(): Promise<BolProductFeedFile[]>
  openLines(fileName: string): Promise<AsyncIterable<string>>
}

export type BolProductFeedMappingProfile = {
  merchantProductId: string
  title: string
  productUrl: string
  price: string
  gtin?: string
  brand?: string
  description?: string
  category?: string
  imageUrl?: string
  availability?: string
  shippingCost?: string
  sourceUpdatedAt?: string
}

export type BolProductFeedSchemaReport = {
  delimiter: '|'
  headers: string[]
  duplicateHeaders: string[]
  missingBindings: string[]
  valid: boolean
}

export function isBolProductFeedFileName(fileName: string): boolean {
  return /^product-feed_[a-z0-9-]+-v2\.csv\.gz$/i.test(fileName)
}

export function parseBolProductFeedHeader(line: string): string[] {
  return line.replace(/^\uFEFF/, '').split('|').map((value) => value.trim())
}

export function inspectBolProductFeedSchema(
  headerLine: string,
  profile: BolProductFeedMappingProfile,
): BolProductFeedSchemaReport {
  const headers = parseBolProductFeedHeader(headerLine)
  const counts = new Map<string, number>()
  for (const header of headers) counts.set(header, (counts.get(header) ?? 0) + 1)
  const duplicateHeaders = [...counts.entries()].filter(([, count]) => count > 1).map(([header]) => header)
  const bindings = Object.values(profile).filter((value): value is string => Boolean(value))
  const missingBindings = bindings.filter((binding) => !counts.has(binding))

  return {
    delimiter: '|',
    headers,
    duplicateHeaders,
    missingBindings,
    valid: headers.length > 1 && duplicateHeaders.length === 0 && missingBindings.length === 0,
  }
}

export function parseBolProductFeedRow(headers: string[], line: string): Record<string, string> {
  const values = line.split('|')
  if (values.length !== headers.length) {
    throw new Error(`bol product feed row has ${values.length} values but header has ${headers.length}.`)
  }
  return Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? '']))
}

export function mapBolProductFeedRecord(input: {
  record: Record<string, string>
  profile: BolProductFeedMappingProfile
  sourceKey: string
  siteId: string
  importedAt: string
}): FeedCandidate {
  const value = (binding?: string) => binding ? input.record[binding]?.trim() || undefined : undefined
  const merchantProductId = value(input.profile.merchantProductId) ?? ''
  const title = value(input.profile.title) ?? ''
  const productUrl = value(input.profile.productUrl) ?? ''
  const price = value(input.profile.price) ?? ''

  return {
    sourceKey: input.sourceKey,
    merchantProductId,
    title,
    description: value(input.profile.description),
    brand: value(input.profile.brand),
    gtin: value(input.profile.gtin),
    sourceCategory: value(input.profile.category),
    imageUrls: value(input.profile.imageUrl) ? [value(input.profile.imageUrl)!] : [],
    price: { amount: price, currency: 'EUR' },
    shippingCost: value(input.profile.shippingCost)
      ? { amount: value(input.profile.shippingCost)!, currency: 'EUR' }
      : undefined,
    availability: value(input.profile.availability),
    productUrl,
    affiliateUrl: productUrl
      ? buildBolAffiliateTrackingUrl({ siteId: input.siteId, productUrl, name: 'winkelnu-feed', subId: merchantProductId })
      : '',
    sourceUpdatedAt: value(input.profile.sourceUpdatedAt),
    importedAt: input.importedAt,
  }
}

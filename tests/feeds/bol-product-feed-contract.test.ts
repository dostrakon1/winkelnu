import { describe, expect, it } from 'vitest'
import { validateBolProductFeedSample } from '@/application/affiliate/bol-feed-sample-validator'
import {
  inspectBolProductFeedSchema,
  isBolProductFeedFileName,
  mapBolProductFeedRecord,
  parseBolProductFeedHeader,
  parseBolProductFeedRow,
  type BolProductFeedMappingProfile,
} from '@/infrastructure/feeds/bol/bol-product-feed-contract'

const profile: BolProductFeedMappingProfile = {
  merchantProductId: 'ProductId',
  title: 'Title',
  productUrl: 'Url',
  price: 'OfferNL.price',
  gtin: 'EAN',
  brand: 'Brand',
  availability: 'OfferNL.availability',
}

const header = 'ProductId|Title|Url|OfferNL.price|EAN|Brand|OfferNL.availability'
const validRow = '920000001|Test Product|https://www.bol.com/nl/nl/p/test-product/920000001/|19.95|8712345678901|Testmerk|in_stock'

describe('bol product feed contract', () => {
  it('recognizes documented gzip csv feed filenames', () => {
    expect(isBolProductFeedFileName('product-feed_computer-v2.csv.gz')).toBe(true)
    expect(isBolProductFeedFileName('product-feed_home-interior-v2.csv.gz')).toBe(true)
    expect(isBolProductFeedFileName('product-feed_computer.csv')).toBe(false)
  })

  it('inspects the pipe-delimited header against an explicit mapping profile', () => {
    expect(inspectBolProductFeedSchema(header, profile)).toMatchObject({
      valid: true,
      missingBindings: [],
      duplicateHeaders: [],
    })

    expect(inspectBolProductFeedSchema('ProductId|Title|Url', profile).valid).toBe(false)
  })

  it('maps a validated row and adds bol affiliate tracking', () => {
    const headers = parseBolProductFeedHeader(header)
    const record = parseBolProductFeedRow(headers, validRow)
    const candidate = mapBolProductFeedRecord({
      record,
      profile,
      sourceKey: 'bol:computer',
      siteId: '12345',
      importedAt: '2026-09-03T08:00:00.000Z',
    })

    expect(candidate.merchantProductId).toBe('920000001')
    expect(candidate.price.amount).toBe('19.95')
    expect(candidate.affiliateUrl).toContain('partner.bol.com/click/click')
    expect(candidate.affiliateUrl).toContain('s=12345')
    expect(candidate.affiliateUrl).toContain('f=PF')
  })
})

describe('validateBolProductFeedSample', () => {
  it('passes a real-shape sample only when schema and candidate quality pass', () => {
    const report = validateBolProductFeedSample({
      lines: [header, validRow],
      profile,
      sourceKey: 'bol:computer',
      siteId: '12345',
      importedAt: '2026-09-03T08:00:00.000Z',
    })

    expect(report).toMatchObject({ schemaValid: true, rowsChecked: 1, rowsAccepted: 1, acceptanceRate: 1, passed: true })
  })

  it('fails closed when a required mapping binding is absent', () => {
    const report = validateBolProductFeedSample({
      lines: ['ProductId|Title|Url', '1|Product|https://www.bol.com/nl/nl/p/test/1/'],
      profile,
      sourceKey: 'bol:test',
      siteId: '12345',
      importedAt: '2026-09-03T08:00:00.000Z',
    })

    expect(report.passed).toBe(false)
    expect(report.schemaValid).toBe(false)
    expect(report.missingBindings).toContain('OfferNL.price')
  })
})

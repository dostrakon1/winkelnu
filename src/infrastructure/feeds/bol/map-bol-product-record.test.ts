import { describe, expect, it } from 'vitest'
import {
  buildBolAffiliateUrl,
  mapBolProductRecord,
  type BolProductFeedRecord,
} from './map-bol-product-record'

describe('Bol product-feed mapping', () => {
  it('maps a Bol NL product into a Winkelnu FeedCandidate', () => {
    const record: BolProductFeedRecord = {
      productId: '9300000116791172',
      ean: '8717662852626',
      title: 'Babycadeaubon blauw - Cadeaukaart 25 euro',
      productPageUrlNL:
        'https://www.bol.com/nl/nl/p/babycadeaubon-blauw-cadeaukaart-25-euro/9300000116791172/',
      imageUrl: 'https://media.s-bol.com/example.jpg',
      brand: 'Babycadeaubon',
      description:
        '<p><strong>Geef altijd het ideale kraamcadeau</strong><br />Een mooi cadeau.</p>',
      'OfferNL.sellingPrice': '25.00',
      'OfferNL.shippingCost': '0.00',
      'OfferNL.isDeliverable': 'Y',
      'Category.unit': 'Business Purchases and Giftcards',
      'Category.category': 'Gift Cards',
      'Category.productgroup': 'Gift Cards Physical',
      'Category.subgroup': 'Onbekend Giftcertificate',
      'Category.subssubgroup': 'Onbekend Giftcertificate',
    }

    const candidate = mapBolProductRecord(record, {
      sourceKey: 'bol:product-feed:nl',
      siteId: '1542789',
      importedAt: '2026-09-14T15:00:00.000Z',
    })

    expect(candidate.merchantProductId).toBe('9300000116791172')
    expect(candidate.gtin).toBe('8717662852626')
    expect(candidate.price.amount).toBe('25.00')
    expect(candidate.shippingCost?.amount).toBe('0.00')
    expect(candidate.availability).toBe('available')
    expect(candidate.sourceCategory).toBe('Gift Cards Physical')
    expect(candidate.description).not.toContain('<p>')
  })

  it('normalizes Bol prices with thousands separators', () => {
    const candidate = mapBolProductRecord(
      {
        productId: '9300000172637440',
        title: 'Bongo test',
        productPageUrlNL:
          'https://www.bol.com/nl/nl/p/bongo-test/9300000172637440/',
        'OfferNL.sellingPrice': '5,399.90',
        'OfferNL.isDeliverable': 'Y',
      },
      {
        sourceKey: 'bol:product-feed:nl',
        siteId: '1542789',
        importedAt: '2026-09-14T20:30:00.000Z',
      },
    )

    expect(candidate.price.amount).toBe('5399.90')
  })

  it('builds a Bol product-feed affiliate URL', () => {
    const productUrl =
      'https://www.bol.com/nl/nl/p/test-product/9300000116791172/'

    const affiliateUrl = buildBolAffiliateUrl({
      productUrl,
      siteId: '1542789',
      subId: '9300000116791172',
    })

    const parsed = new URL(affiliateUrl)

    expect(parsed.origin).toBe('https://partner.bol.com')
    expect(parsed.pathname).toBe('/click/click')
    expect(parsed.searchParams.get('p')).toBe('1')
    expect(parsed.searchParams.get('t')).toBe('url')
    expect(parsed.searchParams.get('s')).toBe('1542789')
    expect(parsed.searchParams.get('url')).toBe(productUrl)
    expect(parsed.searchParams.get('f')).toBe('PF')
    expect(parsed.searchParams.get('subid')).toBe(
      '9300000116791172',
    )
    expect(parsed.searchParams.get('name')).toBe('winkelnu')
  })
})

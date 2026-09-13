import { describe, expect, it } from 'vitest'
import { GiftValidationError, parseOptionalEuroAmount, validateGiftListInput, validateGiftListItemInput } from './validation'

describe('gifting validation', () => {
  it('normalizes a valid standalone list', () => {
    expect(validateGiftListInput({
      displayName: '  Dogan   Akgun ',
      title: ' Mijn   lijstje ',
      occasion: 'sinterklaas',
      budgetMin: '10,50',
      budgetMax: '50',
      eventDate: '2026-12-05',
    })).toEqual({
      displayName: 'Dogan Akgun',
      title: 'Mijn lijstje',
      occasion: 'sinterklaas',
      budgetMinCents: 1050,
      budgetMaxCents: 5000,
      eventDate: '2026-12-05',
    })
  })

  it('rejects an inverted budget range', () => {
    expect(() => validateGiftListInput({
      displayName: 'Dogan',
      occasion: 'kerst',
      budgetMin: '60',
      budgetMax: '25',
    })).toThrow(GiftValidationError)
  })

  it('parses euro amounts without floating-point drift', () => {
    expect(parseOptionalEuroAmount('19,95')).toBe(1995)
    expect(parseOptionalEuroAmount('')).toBeUndefined()
  })

  it('accepts text wishes and https product links', () => {
    expect(validateGiftListItemInput({ itemType: 'text', title: 'Een goed kookboek' })).toMatchObject({
      itemType: 'text',
      title: 'Een goed kookboek',
    })

    expect(validateGiftListItemInput({
      itemType: 'external_link',
      title: 'Deze rugzak',
      externalUrl: 'https://example.com/rugzak',
      note: 'Liefst zwart',
    })).toMatchObject({
      itemType: 'external_link',
      externalUrl: 'https://example.com/rugzak',
    })
  })

  it('rejects non-https external links and premature Winkelnu-product items', () => {
    expect(() => validateGiftListItemInput({
      itemType: 'external_link',
      title: 'Onveilige link',
      externalUrl: 'http://example.com',
    })).toThrow(GiftValidationError)

    expect(() => validateGiftListItemInput({
      itemType: 'winkelnu_product',
      title: 'Komt in L2',
    })).toThrow(GiftValidationError)
  })
})

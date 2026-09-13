import { describe, expect, it } from 'vitest'
import {
  GiftValidationError,
  normalizeGiftDisplayName,
  parseOptionalEuroAmount,
  validateGiftGroupInput,
  validateGiftGroupJoinInput,
  validateGiftListInput,
  validateGiftListItemInput,
  validateGiftNote,
} from './validation'

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

  it('validates and normalizes L3 groups and participant names', () => {
    expect(validateGiftGroupInput({
      name: '  Familie   Akgun ',
      organizerDisplayName: '  Dogan ',
      occasion: 'kerst',
      budget: '25,50',
      eventDate: '2026-12-24',
    })).toEqual({
      name: 'Familie Akgun',
      organizerDisplayName: 'Dogan',
      occasion: 'kerst',
      budgetCents: 2550,
      eventDate: '2026-12-24',
    })

    expect(validateGiftGroupJoinInput({ displayName: '  Dogan   A. ' })).toEqual({ displayName: 'Dogan A.' })
    expect(normalizeGiftDisplayName('  DOGAN   A. ')).toBe('dogan a.')
  })

  it('rejects invalid group and participant names', () => {
    expect(() => validateGiftGroupInput({
      name: 'x',
      organizerDisplayName: 'Dogan',
      occasion: 'sinterklaas',
    })).toThrow(GiftValidationError)
    expect(() => validateGiftGroupJoinInput({ displayName: 'x' })).toThrow(GiftValidationError)
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

  it('normalizes optional product notes and limits their length', () => {
    expect(validateGiftNote('  Liefst   zwart  ')).toBe('Liefst zwart')
    expect(validateGiftNote('   ')).toBeUndefined()
    expect(() => validateGiftNote('x'.repeat(301))).toThrow(GiftValidationError)
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
      note: 'Liefst zwart',
    })
  })

  it('keeps Winkelnu-product identity out of the manual-item validator', () => {
    expect(() => validateGiftListItemInput({
      itemType: 'external_link',
      title: 'Onveilige link',
      externalUrl: 'http://example.com',
    })).toThrow(GiftValidationError)

    expect(() => validateGiftListItemInput({
      itemType: 'winkelnu_product',
      title: 'Wordt server-side uit de catalogus gekozen',
    })).toThrow(GiftValidationError)
  })
})

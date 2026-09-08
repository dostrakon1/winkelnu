import { describe, expect, it } from 'vitest'
import { operator } from './operator'

describe('public operator details', () => {
  it('keeps the approved business identity complete and consistent', () => {
    expect(operator.tradeName).toBe('Akflow')
    expect(operator.legalName).toBe('Dogan Akgun')
    expect(operator.legalForm).toBe('Eenmanszaak')
    expect(operator.chamberOfCommerce).toMatch(/^\d{8}$/)
    expect(operator.vatId).toMatch(/^NL\d{9}B\d{2}$/)
    expect(operator.email).toBe('info@akflow.nl')
    expect(operator.correspondenceAddress).toContain('8331 JS Steenwijk')
  })
})

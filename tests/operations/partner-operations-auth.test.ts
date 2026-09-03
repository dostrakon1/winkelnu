import { describe, expect, it } from 'vitest'

import { isAuthorizedPartnerOperationsRead } from '@/infrastructure/operations/partner-operations-auth'

describe('partner operations auth', () => {
  it('accepts only the exact bearer secret', () => {
    expect(isAuthorizedPartnerOperationsRead('Bearer secret-value', 'secret-value')).toBe(true)
    expect(isAuthorizedPartnerOperationsRead('Bearer wrong-value', 'secret-value')).toBe(false)
    expect(isAuthorizedPartnerOperationsRead(null, 'secret-value')).toBe(false)
    expect(isAuthorizedPartnerOperationsRead('Basic secret-value', 'secret-value')).toBe(false)
  })
})

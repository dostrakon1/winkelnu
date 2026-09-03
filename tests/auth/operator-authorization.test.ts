import { describe, expect, it } from 'vitest'

import { operatorCan, parseOperatorRoles, resolveOperatorRole } from '@/application/auth/operator-authorization'

describe('operator authorization', () => {
  it('parses role assignments case-insensitively', () => {
    const assignments = parseOperatorRoles('OWNER@example.com:owner, ops@example.com:operator')
    expect(resolveOperatorRole('owner@example.com', assignments)).toBe('owner')
    expect(resolveOperatorRole('OPS@example.com', assignments)).toBe('operator')
  })

  it('keeps read-only users unable to mutate', () => {
    expect(operatorCan('read_only', 'read_operations')).toBe(true)
    expect(operatorCan('read_only', 'retry_feed')).toBe(false)
    expect(operatorCan('operator', 'retry_feed')).toBe(true)
    expect(operatorCan('operator', 'activate_partner')).toBe(false)
    expect(operatorCan('owner', 'manage_operators')).toBe(true)
  })

  it('rejects invalid role assignments', () => {
    expect(() => parseOperatorRoles('person@example.com:admin')).toThrow(/Invalid operator role/)
  })
})

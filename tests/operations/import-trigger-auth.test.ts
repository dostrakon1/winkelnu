import { describe, expect, it } from 'vitest'
import { isAuthorizedImportTrigger } from '@/infrastructure/operations/import-trigger-auth'

describe('isAuthorizedImportTrigger', () => {
  it('accepts only the exact bearer secret', () => {
    expect(isAuthorizedImportTrigger('Bearer super-secret', 'super-secret')).toBe(true)
    expect(isAuthorizedImportTrigger('Bearer wrong-secret', 'super-secret')).toBe(false)
    expect(isAuthorizedImportTrigger('Basic super-secret', 'super-secret')).toBe(false)
    expect(isAuthorizedImportTrigger(null, 'super-secret')).toBe(false)
  })
})

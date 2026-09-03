import { describe, expect, it } from 'vitest'

import { isOperatorEmailAllowed, parseOperatorEmails } from '@/application/auth/operator-access'

describe('operator access policy', () => {
  it('normalizes a comma-separated allowlist', () => {
    expect(parseOperatorEmails(' Owner@Winkelnu.nl,ops@example.com , ')).toEqual([
      'owner@winkelnu.nl',
      'ops@example.com',
    ])
  })

  it('allows only normalized exact email matches', () => {
    const allowlist = ['owner@winkelnu.nl']
    expect(isOperatorEmailAllowed('OWNER@winkelnu.nl', allowlist)).toBe(true)
    expect(isOperatorEmailAllowed('other@winkelnu.nl', allowlist)).toBe(false)
    expect(isOperatorEmailAllowed(undefined, allowlist)).toBe(false)
  })

  it('fails closed when no allowlist is configured', () => {
    expect(parseOperatorEmails(undefined)).toEqual([])
    expect(isOperatorEmailAllowed('owner@winkelnu.nl', [])).toBe(false)
  })
})

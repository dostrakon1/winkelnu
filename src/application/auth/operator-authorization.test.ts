import { describe, expect, it } from 'vitest'

import { operatorCan } from './operator-authorization'

describe('operator gifting insights authorization', () => {
  it('allows owners and operators to read gifting insights', () => {
    expect(operatorCan('owner', 'read_gifting_insights')).toBe(true)
    expect(operatorCan('operator', 'read_gifting_insights')).toBe(true)
  })

  it('keeps read-only operators outside gifting insights by default', () => {
    expect(operatorCan('read_only', 'read_gifting_insights')).toBe(false)
  })
})

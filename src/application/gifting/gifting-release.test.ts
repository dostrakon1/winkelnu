import { afterEach, describe, expect, it } from 'vitest'
import { isGiftingEnabled, requireGiftingEnabled } from './gifting-release'

const original = process.env.WINKELNU_GIFTING_ENABLED

afterEach(() => {
  if (original === undefined) delete process.env.WINKELNU_GIFTING_ENABLED
  else process.env.WINKELNU_GIFTING_ENABLED = original
})

describe('gifting release gate', () => {
  it('stays disabled unless explicitly enabled', () => {
    delete process.env.WINKELNU_GIFTING_ENABLED
    expect(isGiftingEnabled()).toBe(false)

    process.env.WINKELNU_GIFTING_ENABLED = 'false'
    expect(isGiftingEnabled()).toBe(false)

    process.env.WINKELNU_GIFTING_ENABLED = 'TRUE'
    expect(isGiftingEnabled()).toBe(false)
  })

  it('enables only on exact true and enforces the gate', () => {
    process.env.WINKELNU_GIFTING_ENABLED = 'true'
    expect(isGiftingEnabled()).toBe(true)
    expect(() => requireGiftingEnabled()).not.toThrow()

    process.env.WINKELNU_GIFTING_ENABLED = 'false'
    expect(() => requireGiftingEnabled()).toThrow('GIFTING_NOT_RELEASED')
  })
})

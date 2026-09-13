import { afterEach, describe, expect, it } from 'vitest'
import { giftSessionSecret, isGiftingEnabled, requireGiftingEnabled } from './gifting-release'

const originalFlag = process.env.WINKELNU_GIFTING_ENABLED
const originalSecret = process.env.WINKELNU_GIFT_SESSION_SECRET

afterEach(() => {
  if (originalFlag === undefined) delete process.env.WINKELNU_GIFTING_ENABLED
  else process.env.WINKELNU_GIFTING_ENABLED = originalFlag

  if (originalSecret === undefined) delete process.env.WINKELNU_GIFT_SESSION_SECRET
  else process.env.WINKELNU_GIFT_SESSION_SECRET = originalSecret
})

describe('Lootje & Lijstje release gate', () => {
  it('stays disabled when the feature flag is off', () => {
    process.env.WINKELNU_GIFTING_ENABLED = 'false'
    process.env.WINKELNU_GIFT_SESSION_SECRET = 'x'.repeat(64)
    expect(isGiftingEnabled()).toBe(false)
    expect(() => requireGiftingEnabled()).toThrow('GIFTING_NOT_RELEASED')
  })

  it('fails closed when the flag is on but the secret is missing or short', () => {
    process.env.WINKELNU_GIFTING_ENABLED = 'true'
    delete process.env.WINKELNU_GIFT_SESSION_SECRET
    expect(isGiftingEnabled()).toBe(false)
    expect(() => requireGiftingEnabled()).toThrow('GIFTING_RELEASE_MISCONFIGURED')

    process.env.WINKELNU_GIFT_SESSION_SECRET = 'too-short'
    expect(isGiftingEnabled()).toBe(false)
    expect(() => giftSessionSecret()).toThrow('GIFTING_RELEASE_MISCONFIGURED')
  })

  it('enables only with an explicit flag and a 32+ byte secret', () => {
    process.env.WINKELNU_GIFTING_ENABLED = 'true'
    process.env.WINKELNU_GIFT_SESSION_SECRET = 's'.repeat(32)
    expect(isGiftingEnabled()).toBe(true)
    expect(giftSessionSecret()).toBe('s'.repeat(32))
    expect(() => requireGiftingEnabled()).not.toThrow()
  })
})

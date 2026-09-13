const MIN_GIFT_SESSION_SECRET_BYTES = 32

export function giftSessionSecret(): string {
  const secret = process.env.WINKELNU_GIFT_SESSION_SECRET?.trim()
  if (!secret || Buffer.byteLength(secret, 'utf8') < MIN_GIFT_SESSION_SECRET_BYTES) {
    throw new Error('GIFTING_RELEASE_MISCONFIGURED')
  }
  return secret
}

export function hasValidGiftSessionSecret(): boolean {
  try {
    giftSessionSecret()
    return true
  } catch {
    return false
  }
}

export function isGiftingEnabled(): boolean {
  return process.env.WINKELNU_GIFTING_ENABLED === 'true' && hasValidGiftSessionSecret()
}

export function requireGiftingEnabled(): void {
  if (process.env.WINKELNU_GIFTING_ENABLED !== 'true') throw new Error('GIFTING_NOT_RELEASED')
  giftSessionSecret()
}

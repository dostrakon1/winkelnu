export function isGiftingEnabled(): boolean {
  return process.env.WINKELNU_GIFTING_ENABLED === 'true'
}

export function requireGiftingEnabled(): void {
  if (!isGiftingEnabled()) throw new Error('GIFTING_NOT_RELEASED')
}

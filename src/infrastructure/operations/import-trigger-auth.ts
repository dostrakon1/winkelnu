import { timingSafeEqual } from 'node:crypto'

export function isAuthorizedImportTrigger(authorizationHeader: string | null, secret: string): boolean {
  if (!authorizationHeader.startsWith('Bearer ')) return false
  const provided = authorizationHeader.slice('Bearer '.length)
  const expectedBuffer = Buffer.from(secret)
  const providedBuffer = Buffer.from(provided)
  if (providedBuffer.length !== expectedBuffer.length) return false
  return timingSafeEqual(providedBuffer, expectedBuffer)
}

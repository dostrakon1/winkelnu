import 'server-only'

import { timingSafeEqual } from 'node:crypto'

export function isAuthorizedPartnerOperationsRead(authorization: string | null, secret: string): boolean {
  if (!authorization?.startsWith('Bearer ')) return false
  const supplied = authorization.slice('Bearer '.length)
  const suppliedBuffer = Buffer.from(supplied)
  const expectedBuffer = Buffer.from(secret)
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer)
}

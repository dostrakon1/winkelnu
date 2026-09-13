import 'server-only'

import { createHash, randomBytes, randomUUID } from 'node:crypto'

export function createGiftExternalKey(kind: 'list' | 'group' | 'participant'): string {
  return `gift-${kind}:${randomUUID()}`
}

export function createGiftShareCode(): string {
  return randomBytes(18).toString('base64url')
}

export function createGiftRecoveryToken(): string {
  return randomBytes(32).toString('base64url')
}

export function hashGiftCapability(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex')
}

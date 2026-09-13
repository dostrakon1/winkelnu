import 'server-only'

import { createHmac } from 'node:crypto'
import { headers } from 'next/headers'
import { giftSessionSecret } from '@/application/gifting/gifting-release'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

export type GiftingRateLimitAction = 'create-list' | 'create-group' | 'join-group'

const LIMITS: Record<GiftingRateLimitAction, { limit: number; windowSeconds: number }> = {
  'create-list': { limit: 12, windowSeconds: 60 * 60 },
  'create-group': { limit: 8, windowSeconds: 60 * 60 },
  'join-group': { limit: 60, windowSeconds: 60 * 60 },
}

export class GiftingRateLimitError extends Error {
  constructor(message = 'Te veel verzoeken vanaf deze verbinding. Probeer het later opnieuw.') {
    super(message)
    this.name = 'GiftingRateLimitError'
  }
}

export function createGiftingRateLimitBucketKey(clientAddress: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(`winkelnu:gifting-rate-limit:${clientAddress.trim() || 'unknown'}`, 'utf8')
    .digest('hex')
}

async function clientAddress(): Promise<string> {
  const requestHeaders = await headers()
  const forwardedFor = requestHeaders.get('x-forwarded-for')
  const firstForwarded = forwardedFor?.split(',')[0]?.trim()
  return firstForwarded || requestHeaders.get('x-real-ip')?.trim() || 'unknown'
}

export async function enforceGiftingRateLimit(action: GiftingRateLimitAction): Promise<void> {
  const config = LIMITS[action]
  const bucketKey = createGiftingRateLimitBucketKey(await clientAddress(), giftSessionSecret())
  const db = createSupabaseServerClient()
  const { data, error } = await db.rpc('consume_gifting_rate_limit', {
    p_bucket_key: bucketKey,
    p_action: action,
    p_limit: config.limit,
    p_window_seconds: config.windowSeconds,
  })

  if (error) {
    throw new GiftingRateLimitError('Deze actie is tijdelijk niet beschikbaar. Probeer het over een paar minuten opnieuw.')
  }
  if (data !== true) throw new GiftingRateLimitError()
}

import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'wn_gift_access'
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180
const MAX_GRANTS = 20

export type GiftGrantKind = 'list-owner' | 'group-organizer' | 'group-participant'

export type GiftAccessGrant = {
  kind: GiftGrantKind
  entityId: string
  expiresAt: number
}

type GiftAccessPayload = {
  version: 1
  grants: GiftAccessGrant[]
}

function sessionSecret(): string {
  const secret = process.env.WINKELNU_GIFT_SESSION_SECRET?.trim()
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('WINKELNU_GIFT_SESSION_SECRET must contain at least 32 bytes of server-only entropy.')
  }
  return secret
}

function signature(payload: string): Buffer {
  return createHmac('sha256', sessionSecret()).update(payload, 'utf8').digest()
}

function encodePayload(payload: GiftAccessPayload): string {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  return `${body}.${signature(body).toString('base64url')}`
}

function decodePayload(value: string | undefined): GiftAccessPayload {
  if (!value) return { version: 1, grants: [] }

  const [body, encodedSignature, extra] = value.split('.')
  if (!body || !encodedSignature || extra) return { version: 1, grants: [] }

  let supplied: Buffer
  try {
    supplied = Buffer.from(encodedSignature, 'base64url')
  } catch {
    return { version: 1, grants: [] }
  }

  const expected = signature(body)
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return { version: 1, grants: [] }
  }

  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Partial<GiftAccessPayload>
    if (parsed.version !== 1 || !Array.isArray(parsed.grants)) return { version: 1, grants: [] }

    const now = Math.floor(Date.now() / 1000)
    const grants = parsed.grants.filter((grant): grant is GiftAccessGrant => {
      return Boolean(
        grant
        && typeof grant === 'object'
        && (grant.kind === 'list-owner' || grant.kind === 'group-organizer' || grant.kind === 'group-participant')
        && typeof grant.entityId === 'string'
        && grant.entityId.length > 0
        && typeof grant.expiresAt === 'number'
        && Number.isFinite(grant.expiresAt)
        && grant.expiresAt > now,
      )
    })

    return { version: 1, grants: grants.slice(-MAX_GRANTS) }
  } catch {
    return { version: 1, grants: [] }
  }
}

async function currentPayload(): Promise<GiftAccessPayload> {
  const store = await cookies()
  return decodePayload(store.get(COOKIE_NAME)?.value)
}

export async function hasGiftAccessGrant(kind: GiftGrantKind, entityId: string): Promise<boolean> {
  const payload = await currentPayload()
  return payload.grants.some((grant) => grant.kind === kind && grant.entityId === entityId)
}

export async function giftAccessGrantEntityIds(kind: GiftGrantKind): Promise<string[]> {
  const payload = await currentPayload()
  return payload.grants.filter((grant) => grant.kind === kind).map((grant) => grant.entityId)
}

export async function addGiftAccessGrant(grant: GiftAccessGrant): Promise<void> {
  const store = await cookies()
  const payload = decodePayload(store.get(COOKIE_NAME)?.value)
  const withoutDuplicate = payload.grants.filter((existing) => !(existing.kind === grant.kind && existing.entityId === grant.entityId))
  const grants = [...withoutDuplicate, grant].slice(-MAX_GRANTS)

  store.set(COOKIE_NAME, encodePayload({ version: 1, grants }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/lootje-lijstje',
    maxAge: COOKIE_MAX_AGE_SECONDS,
  })
}

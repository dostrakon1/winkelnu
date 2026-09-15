import { NextRequest, NextResponse } from 'next/server'
import {
  buildMeasurementEventRecord,
  parseMeasurementClientEvent,
} from '@/application/measurement/measurement-core'
import { activeSite, isProductionHostForSite } from '@/config/sites'
import { SupabaseMeasurementRecorder } from '@/infrastructure/measurement/supabase-measurement-recorder'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MAX_BODY_LENGTH = 4096
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_EVENTS = 240

let rateLimitWindowStartedAt = 0
let rateLimitCount = 0

function hasGlobalCapacity(now: number = Date.now()): boolean {
  if (now - rateLimitWindowStartedAt >= RATE_LIMIT_WINDOW_MS) {
    rateLimitWindowStartedAt = now
    rateLimitCount = 0
  }

  if (rateLimitCount >= RATE_LIMIT_MAX_EVENTS) return false
  rateLimitCount += 1
  return true
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true

  try {
    return new URL(origin).host === request.nextUrl.host
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  if (!isProductionHostForSite(request.nextUrl.hostname, activeSite)) {
    return new NextResponse(null, { status: 204, headers: { 'cache-control': 'no-store' } })
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Cross-origin measurement is not allowed.' }, { status: 403 })
  }

  if (!hasGlobalCapacity()) {
    return new NextResponse(null, {
      status: 429,
      headers: {
        'cache-control': 'no-store',
        'retry-after': '60',
      },
    })
  }

  const contentType = request.headers.get('content-type')?.toLowerCase() ?? ''
  if (!contentType.startsWith('application/json')) {
    return NextResponse.json({ error: 'Unsupported content type.' }, { status: 415 })
  }

  const declaredLength = Number(request.headers.get('content-length') ?? '0')
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_LENGTH) {
    return NextResponse.json({ error: 'Measurement payload is too large.' }, { status: 413 })
  }

  const raw = await request.text()
  if (!raw || raw.length > MAX_BODY_LENGTH) {
    return NextResponse.json(
      { error: 'Invalid measurement payload.' },
      { status: raw.length > MAX_BODY_LENGTH ? 413 : 400 },
    )
  }

  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const input = parseMeasurementClientEvent(parsedJson)
  if (!input) return NextResponse.json({ error: 'Invalid measurement event.' }, { status: 400 })

  try {
    const recorder = new SupabaseMeasurementRecorder()
    await recorder.record(buildMeasurementEventRecord(input))
  } catch (error) {
    console.error('Failed to record Measurement Core event', {
      error: error instanceof Error ? error.name : 'UnknownError',
    })
    return new NextResponse(null, { status: 503, headers: { 'cache-control': 'no-store' } })
  }

  return new NextResponse(null, { status: 204, headers: { 'cache-control': 'no-store' } })
}

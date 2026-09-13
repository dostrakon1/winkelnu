import { NextResponse } from 'next/server'

import {
  enforceGiftingRateLimit,
  GiftingRateLimitError,
} from '@/application/gifting/gifting-rate-limit'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

const EVENT_SURFACES = {
  gifting_landing_viewed: ['landing'],
  group_create_form_viewed: ['group_create'],
  list_create_form_viewed: ['list_create'],
  group_invite_viewed: ['group_invite'],
  shared_list_viewed: ['shared_list'],
  share_link_copied: ['group_management', 'standalone_list_editor'],
  whatsapp_share_clicked: ['group_management', 'standalone_list_editor'],
  native_share_invoked: ['group_management', 'standalone_list_editor'],
} as const

type InteractionEvent = keyof typeof EVENT_SURFACES

type RequestBody = {
  eventType?: unknown
  sourceSurface?: unknown
  eventId?: unknown
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function validInteraction(body: RequestBody): body is {
  eventType: InteractionEvent
  sourceSurface: string
  eventId: string
} {
  if (typeof body.eventType !== 'string' || !(body.eventType in EVENT_SURFACES)) return false
  if (typeof body.sourceSurface !== 'string') return false
  if (typeof body.eventId !== 'string' || !UUID_PATTERN.test(body.eventId)) return false

  const allowed = EVENT_SURFACES[body.eventType as InteractionEvent] as readonly string[]
  return allowed.includes(body.sourceSurface)
}

export async function POST(request: Request) {
  let body: RequestBody
  try {
    body = await request.json() as RequestBody
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  if (!validInteraction(body)) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  try {
    await enforceGiftingRateLimit('record-insight')
  } catch (error) {
    if (error instanceof GiftingRateLimitError) {
      return new NextResponse(null, { status: 429 })
    }
    return new NextResponse(null, { status: 204 })
  }

  try {
    const db = createSupabaseServerClient()
    const { error } = await db.rpc('record_gifting_insight_event', {
      p_event_key: `interaction:${body.eventType}:${body.eventId}`,
      p_event_type: body.eventType,
      p_source_surface: body.sourceSurface,
      p_group_id: null,
      p_list_id: null,
      p_product_external_key: null,
      p_item_type: null,
      p_occasion: null,
      p_value_int: null,
    })

    if (error) return new NextResponse(null, { status: 204 })
  } catch {
    return new NextResponse(null, { status: 204 })
  }

  return new NextResponse(null, { status: 204 })
}

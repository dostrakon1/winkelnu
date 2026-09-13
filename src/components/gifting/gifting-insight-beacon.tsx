'use client'

import { useEffect, useRef } from 'react'

export type GiftingInteractionEvent =
  | 'gifting_landing_viewed'
  | 'group_create_form_viewed'
  | 'list_create_form_viewed'
  | 'group_invite_viewed'
  | 'shared_list_viewed'
  | 'share_link_copied'
  | 'whatsapp_share_clicked'
  | 'native_share_invoked'

export type GiftingInsightSurface =
  | 'landing'
  | 'group_create'
  | 'list_create'
  | 'group_invite'
  | 'shared_list'
  | 'group_management'
  | 'standalone_list_editor'

export function recordGiftingInteraction(
  eventType: GiftingInteractionEvent,
  sourceSurface: GiftingInsightSurface,
): void {
  if (typeof window === 'undefined' || typeof crypto?.randomUUID !== 'function') return

  const eventId = crypto.randomUUID()
  void fetch('/api/gifting/insights', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'same-origin',
    keepalive: true,
    body: JSON.stringify({ eventType, sourceSurface, eventId }),
  }).catch(() => undefined)
}

export function GiftingInsightBeacon({
  eventType,
  sourceSurface,
}: {
  eventType: GiftingInteractionEvent
  sourceSurface: GiftingInsightSurface
}) {
  const sent = useRef(false)

  useEffect(() => {
    if (sent.current) return
    sent.current = true
    recordGiftingInteraction(eventType, sourceSurface)
  }, [eventType, sourceSurface])

  return null
}

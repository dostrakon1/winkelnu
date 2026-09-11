'use client'

import type { SearchFeedbackEventType, SearchFeedbackTargetKind } from '@/application/search/search-feedback'

export type SearchFeedbackClientPayload = {
  eventType: SearchFeedbackEventType
  query: string
  previousQuery?: string
  zeroResults?: boolean
  bestMatchCount?: number
  targetKind?: SearchFeedbackTargetKind
  targetKey?: string
  targetPosition?: number
  categorySlug?: string
}

export function currentSearchQuery(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const query = new URLSearchParams(window.location.search).get('q')?.trim()
  return query || undefined
}

export function sendSearchFeedback(payload: SearchFeedbackClientPayload): void {
  if (typeof window === 'undefined') return
  if (!payload.query.trim()) return

  const body = JSON.stringify(payload)
  const url = '/api/search/feedback'

  if (typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' })
    if (navigator.sendBeacon(url, blob)) return
  }

  void fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
    cache: 'no-store',
    credentials: 'same-origin',
  }).catch(() => {
    // Search feedback is deliberately best-effort and must never block navigation.
  })
}

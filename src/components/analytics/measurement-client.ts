'use client'

import type { MeasurementClientEventInput } from '@/application/measurement/measurement-core'
import { sanitizeMeasurementSourcePath } from '@/application/measurement/measurement-core'
import { activeSite, isProductionHostForSite } from '@/config/sites'

export type MeasurementClientEvent = Omit<MeasurementClientEventInput, 'eventId' | 'sourcePath' | 'properties'> & {
  properties?: Record<string, never>
}

function createEventId(): string {
  const cryptoApi = window.crypto
  if (typeof cryptoApi.randomUUID === 'function') return cryptoApi.randomUUID()

  const bytes = new Uint8Array(16)
  cryptoApi.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export function sendMeasurementEvent(event: MeasurementClientEvent): void {
  if (typeof window === 'undefined') return
  if (!isProductionHostForSite(window.location.hostname, activeSite)) return

  const sourcePath = sanitizeMeasurementSourcePath(window.location.pathname)
  if (!sourcePath) return

  const payload: MeasurementClientEventInput = {
    ...event,
    eventId: createEventId(),
    sourcePath,
    properties: event.properties ?? {},
  }

  const body = JSON.stringify(payload)
  const url = '/api/measurement/events'

  try {
    if (typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' })
      if (navigator.sendBeacon(url, blob)) return
    }
  } catch {
    // Fall through to navigation-safe fetch when beacon delivery is unavailable.
  }

  void fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
    cache: 'no-store',
    credentials: 'same-origin',
  }).catch(() => {
    // Measurement is deliberately best-effort and must never block navigation.
  })
}

import { describe, expect, it } from 'vitest'
import {
  buildMeasurementEventRecord,
  parseMeasurementClientEvent,
  sanitizeMeasurementSourcePath,
} from './measurement-core'

const validEvent = {
  eventId: '550e8400-e29b-41d4-a716-446655440000',
  eventName: 'outbound.click',
  eventVersion: 1,
  sourcePath: '/koopgidsen/robotstofzuiger?sort=prijs#resultaten',
  targetType: 'brand',
  targetKey: 'akflow',
  placement: 'footer',
  properties: {},
} as const

describe('Measurement Core v1 contract', () => {
  it('accepts the Akflow footer event and strips query strings and fragments', () => {
    expect(parseMeasurementClientEvent(validEvent)).toEqual({
      ...validEvent,
      sourcePath: '/koopgidsen/robotstofzuiger',
    })
  })

  it('rejects unknown contracts, dimensions, properties and top-level fields', () => {
    expect(parseMeasurementClientEvent({ ...validEvent, eventName: 'footer.akflow' })).toBeUndefined()
    expect(parseMeasurementClientEvent({ ...validEvent, targetKey: 'other-brand' })).toBeUndefined()
    expect(parseMeasurementClientEvent({ ...validEvent, placement: 'hero' })).toBeUndefined()
    expect(parseMeasurementClientEvent({ ...validEvent, properties: { email: 'nope@example.com' } })).toBeUndefined()
    expect(parseMeasurementClientEvent({ ...validEvent, visitorId: 'persistent-person-id' })).toBeUndefined()
  })

  it('only accepts safe public relative source paths', () => {
    expect(sanitizeMeasurementSourcePath('/')).toBe('/')
    expect(sanitizeMeasurementSourcePath('/zoeken?q=laptop#resultaten')).toBe('/zoeken')
    expect(sanitizeMeasurementSourcePath('https://winkelnu.nl/zoeken')).toBeUndefined()
    expect(sanitizeMeasurementSourcePath('//evil.example/path')).toBeUndefined()
    expect(sanitizeMeasurementSourcePath('/api/health')).toBeUndefined()
    expect(sanitizeMeasurementSourcePath('/intern/operations')).toBeUndefined()
    expect(sanitizeMeasurementSourcePath('/uit/offer-1')).toBeUndefined()
    expect(sanitizeMeasurementSourcePath('/lootje-lijstje/toegang/geheime-code')).toBeUndefined()
  })

  it('derives server-controlled fields instead of trusting the client', () => {
    const input = parseMeasurementClientEvent(validEvent)
    expect(input).toBeDefined()

    const event = buildMeasurementEventRecord(input!, new Date('2026-09-16T10:00:00.000Z'))
    expect(event.eventGroup).toBe('navigation')
    expect(event.ingestionSource).toBe('client')
    expect(event.occurredAt).toBe('2026-09-16T10:00:00.000Z')
  })

  it('requires a UUID-shaped per-event idempotency key', () => {
    expect(parseMeasurementClientEvent({ ...validEvent, eventId: 'visitor-123' })).toBeUndefined()
  })
})

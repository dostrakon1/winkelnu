export const MEASUREMENT_RAW_RETENTION_DAYS = 180

export const measurementEventRegistryV1 = {
  'outbound.click:1': {
    eventName: 'outbound.click',
    eventVersion: 1,
    eventGroup: 'navigation',
    targetType: 'brand',
    targetKey: 'akflow',
    placement: 'footer',
    propertyKeys: [] as const,
  },
} as const

const ACTIVE_OUTBOUND_CONTRACT = measurementEventRegistryV1['outbound.click:1']
const BLOCKED_SOURCE_PREFIXES = ['/api', '/intern', '/uit', '/lootje-lijstje'] as const
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const TOP_LEVEL_KEYS = new Set([
  'eventId',
  'eventName',
  'eventVersion',
  'sourcePath',
  'targetType',
  'targetKey',
  'placement',
  'properties',
])

export type MeasurementClientEventInput = {
  eventId: string
  eventName: 'outbound.click'
  eventVersion: 1
  sourcePath: string
  targetType: 'brand'
  targetKey: 'akflow'
  placement: 'footer'
  properties: Record<string, never>
}

export type MeasurementEventRecord = MeasurementClientEventInput & {
  eventGroup: 'navigation'
  ingestionSource: 'client'
  occurredAt: string
}

export function sanitizeMeasurementSourcePath(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  if (!trimmed || trimmed.length > 600) return undefined
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return undefined
  if (trimmed.includes('://') || trimmed.includes('\\') || /[\u0000-\u001f\u007f]/.test(trimmed)) return undefined

  const cleanPath = trimmed.split(/[?#]/, 1)[0]
  if (!cleanPath || cleanPath.length > 300) return undefined

  const blocked = BLOCKED_SOURCE_PREFIXES.some(
    (prefix) => cleanPath === prefix || cleanPath.startsWith(`${prefix}/`),
  )
  if (blocked) return undefined

  return cleanPath
}

export function parseMeasurementClientEvent(value: unknown): MeasurementClientEventInput | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const candidate = value as Record<string, unknown>

  if (Object.keys(candidate).some((key) => !TOP_LEVEL_KEYS.has(key))) return undefined
  if (typeof candidate.eventId !== 'string' || !UUID_PATTERN.test(candidate.eventId)) return undefined
  if (candidate.eventName !== ACTIVE_OUTBOUND_CONTRACT.eventName) return undefined
  if (candidate.eventVersion !== ACTIVE_OUTBOUND_CONTRACT.eventVersion) return undefined
  if (candidate.targetType !== ACTIVE_OUTBOUND_CONTRACT.targetType) return undefined
  if (candidate.targetKey !== ACTIVE_OUTBOUND_CONTRACT.targetKey) return undefined
  if (candidate.placement !== ACTIVE_OUTBOUND_CONTRACT.placement) return undefined

  const sourcePath = sanitizeMeasurementSourcePath(candidate.sourcePath)
  if (!sourcePath) return undefined

  const properties = candidate.properties ?? {}
  if (!properties || typeof properties !== 'object' || Array.isArray(properties)) return undefined
  if (Object.keys(properties as Record<string, unknown>).length > 0) return undefined

  return {
    eventId: candidate.eventId,
    eventName: ACTIVE_OUTBOUND_CONTRACT.eventName,
    eventVersion: ACTIVE_OUTBOUND_CONTRACT.eventVersion,
    sourcePath,
    targetType: ACTIVE_OUTBOUND_CONTRACT.targetType,
    targetKey: ACTIVE_OUTBOUND_CONTRACT.targetKey,
    placement: ACTIVE_OUTBOUND_CONTRACT.placement,
    properties: {},
  }
}

export function buildMeasurementEventRecord(
  input: MeasurementClientEventInput,
  occurredAt: Date = new Date(),
): MeasurementEventRecord {
  return {
    ...input,
    eventGroup: ACTIVE_OUTBOUND_CONTRACT.eventGroup,
    ingestionSource: 'client',
    occurredAt: occurredAt.toISOString(),
  }
}

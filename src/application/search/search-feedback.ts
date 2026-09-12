import { analyzePredictiveSearch } from './predictive-search-core'
import { buildPredictiveSearchIndex } from './predictive-search-index'

export const SEARCH_FEEDBACK_RETENTION_DAYS = 90

export const searchFeedbackEventTypes = [
  'search_performed',
  'predictive_clicked',
  'best_match_clicked',
  'product_clicked',
  'search_refined',
] as const

export type SearchFeedbackEventType = (typeof searchFeedbackEventTypes)[number]

export const searchFeedbackTargetKinds = [
  'product',
  'category',
  'subcategory',
  'guide',
  'collection',
  'collection-section',
] as const

export type SearchFeedbackTargetKind = (typeof searchFeedbackTargetKinds)[number]

export type SearchFeedbackInput = {
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

export type SearchFeedbackRow = {
  event_type: SearchFeedbackEventType
  query_normalized: string
  previous_query_normalized: string | null
  corrected_query: string | null
  product_term: string | null
  intent_keys: string[]
  zero_results: boolean
  best_match_count: number | null
  target_kind: SearchFeedbackTargetKind | null
  target_key: string | null
  target_position: number | null
  category_slug: string | null
}

const EVENT_TYPE_SET = new Set<string>(searchFeedbackEventTypes)
const TARGET_KIND_SET = new Set<string>(searchFeedbackTargetKinds)
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function redactPotentialIdentifiers(value: string): string {
  let redacted = value
    .replace(/\bhttps?:\/\/\S+|\bwww\.\S+/gi, ' redacted ')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, ' redacted ')

  redacted = redacted.replace(/(?:\+?\d[\d\s().-]{6,}\d)/g, (candidate) => {
    const digitCount = candidate.replace(/\D/g, '').length
    return digitCount >= 7 ? ' redacted ' : candidate
  })

  return redacted
}

export function normalizeFeedbackQuery(value: string): string | undefined {
  const normalized = redactPotentialIdentifiers(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('nl-NL')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)

  return normalized || undefined
}

function optionalInteger(value: unknown, min: number, max: number): number | undefined {
  if (value == null) return undefined
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) return undefined
  return value
}

function optionalString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > maxLength) return undefined
  return trimmed
}

function sanitizeTargetKey(kind: SearchFeedbackTargetKind | undefined, value: unknown): string | undefined {
  const target = optionalString(value, 200)
  if (!kind || !target) return undefined

  if (kind === 'product') return SLUG_PATTERN.test(target) ? target : undefined

  if (!target.startsWith('/') || target.startsWith('//') || target.includes('://')) return undefined
  return /^[\/#?&=.%a-zA-Z0-9_-]+$/.test(target) ? target : undefined
}

export function parseSearchFeedbackInput(value: unknown): SearchFeedbackInput | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const candidate = value as Record<string, unknown>

  const eventType = typeof candidate.eventType === 'string' && EVENT_TYPE_SET.has(candidate.eventType)
    ? candidate.eventType as SearchFeedbackEventType
    : undefined
  const query = optionalString(candidate.query, 220)
  if (!eventType || !query || !normalizeFeedbackQuery(query)) return undefined

  const targetKind = typeof candidate.targetKind === 'string' && TARGET_KIND_SET.has(candidate.targetKind)
    ? candidate.targetKind as SearchFeedbackTargetKind
    : undefined
  const targetKey = sanitizeTargetKey(targetKind, candidate.targetKey)
  const targetPosition = optionalInteger(candidate.targetPosition, 1, 100)
  const bestMatchCount = optionalInteger(candidate.bestMatchCount, 0, 20)
  const previousQuery = optionalString(candidate.previousQuery, 220)
  const categorySlug = optionalString(candidate.categorySlug, 100)

  if (categorySlug && !SLUG_PATTERN.test(categorySlug)) return undefined

  const clickEvent = eventType === 'predictive_clicked'
    || eventType === 'best_match_clicked'
    || eventType === 'product_clicked'
  if (clickEvent && (!targetKind || !targetKey || !targetPosition)) return undefined
  if (eventType === 'product_clicked' && targetKind !== 'product') return undefined
  if (eventType === 'search_refined' && (!previousQuery || normalizeFeedbackQuery(previousQuery) === normalizeFeedbackQuery(query))) return undefined

  return {
    eventType,
    query,
    previousQuery,
    zeroResults: eventType === 'search_performed' ? candidate.zeroResults === true : false,
    bestMatchCount,
    targetKind,
    targetKey,
    targetPosition,
    categorySlug,
  }
}

export function buildSearchFeedbackRow(input: SearchFeedbackInput): SearchFeedbackRow {
  const queryNormalized = normalizeFeedbackQuery(input.query)
  if (!queryNormalized) throw new Error('Search feedback query is empty after normalization')

  const previousQueryNormalized = input.previousQuery
    ? normalizeFeedbackQuery(input.previousQuery) ?? null
    : null
  const analysis = analyzePredictiveSearch(queryNormalized, buildPredictiveSearchIndex(), 8)

  return {
    event_type: input.eventType,
    query_normalized: queryNormalized,
    previous_query_normalized: previousQueryNormalized,
    corrected_query: analysis.correctedTerm?.slice(0, 160) ?? null,
    product_term: analysis.productTerm?.slice(0, 120) ?? null,
    intent_keys: analysis.intents.map((intent) => intent.key),
    zero_results: input.eventType === 'search_performed' && input.zeroResults === true,
    best_match_count: input.bestMatchCount ?? null,
    target_kind: input.targetKind ?? null,
    target_key: input.targetKey ?? null,
    target_position: input.targetPosition ?? null,
    category_slug: input.categorySlug ?? null,
  }
}

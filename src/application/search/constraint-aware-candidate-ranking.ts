import type { CatalogProductListItem } from '@/application/catalog/catalog-service'
import type { ProductSpecification } from '@/domain/catalog/types'
import {
  evaluatePreferenceConstraintValue,
  extractPreferenceConstraints,
  type ExtractedPreferenceConstraint,
  type PreferenceConstraintEvaluation,
} from './preference-constraint-extraction'

export type CandidateEvidence = {
  label: string
  status: 'match' | 'miss' | 'unknown' | 'preference'
}

export type ConstraintAwareCandidate = {
  item: CatalogProductListItem
  score: number
  originalPosition: number
  evidence: CandidateEvidence[]
  matchedCount: number
  missedCount: number
  unknownCount: number
  preferenceBoost: number
}

const METRIC_ALIASES: Record<string, readonly string[]> = {
  weight: ['gewicht'],
  'battery-life': ['accuduur', 'batterijduur', 'gebruiksduur'],
  dimensions: ['afmetingen', 'formaat', 'pakmaat'],
  noise: ['geluidsniveau', 'geluid', 'noise', 'geluidsproductie'],
  'noise-cancelling': ['ruisonderdrukking', 'noise cancelling', 'noise canceling', 'anc'],
  capacity: ['capaciteit', 'totale capaciteit', 'inhoud', 'kominhoud', 'waterreservoir', 'stofreservoir'],
  functions: ['functies', 'kookfuncties', 'drankfuncties', 'programmas', "programma's", 'standen'],
  memory: ['geheugen', 'werkgeheugen', 'ram', 'basisgeheugen'],
  storage: ['opslag', 'basisopslag', 'ssd', 'opslagcapaciteit'],
  zones: ['lades', 'zones', 'kookzones'],
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('nl-NL')
    .replace(/&/g, ' en ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function metricValue(specifications: readonly ProductSpecification[] | undefined, metricKey: string): string | undefined {
  const aliases = METRIC_ALIASES[metricKey]
  if (!aliases || !specifications) return undefined

  for (const specification of specifications) {
    const label = normalize(specification.label)
    if (!label) continue
    if (aliases.some((alias) => {
      const normalizedAlias = normalize(alias)
      return label === normalizedAlias || label.startsWith(`${normalizedAlias} `)
    })) {
      const value = specification.value.trim()
      if (value) return value
    }
  }

  return undefined
}

function firstNumber(value: string): number | undefined {
  const match = value.replace(/\s/g, '').match(/\d+(?:[.,]\d+)?/)
  if (!match) return undefined
  const parsed = Number(match[0].replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : undefined
}

function scalarValue(metricKey: string, rawValue: string): number | undefined {
  const value = rawValue.toLocaleLowerCase('nl-NL')
  const number = firstNumber(rawValue)
  if (number == null) return undefined

  switch (metricKey) {
    case 'weight':
      if (/\bkg\b/.test(value)) return number
      if (/\b(?:g|gram)\b/.test(value)) return number / 1000
      return undefined
    case 'battery-life':
      if (/\b(?:dag|dagen)\b/.test(value)) return number * 24
      if (/\b(?:uur|uren|hour|hours|h)\b/.test(value)) return number
      if (/\b(?:min|minuut|minuten|minutes)\b/.test(value)) return number / 60
      return undefined
    case 'noise':
      return /\b(?:db|decibel)\b/.test(value) ? number : undefined
    case 'capacity':
      if (/\bml\b/.test(value)) return number / 1000
      if (/\b(?:l|liter|liters)\b/.test(value)) return number
      return undefined
    case 'memory':
    case 'storage':
      if (/\btb\b/.test(value)) return number * 1024
      if (/\bgb\b/.test(value)) return number
      return undefined
    case 'functions':
    case 'zones':
      return number
    case 'dimensions': {
      const normalized = value.replace(/,/g, '.')
      const numbers = [...normalized.matchAll(/\d+(?:\.\d+)?/g)].map((match) => Number(match[0])).filter(Number.isFinite)
      if (numbers.length < 2) return undefined
      const unitMultiplier = /\bmm\b/.test(value) ? 0.1 : /\bm\b/.test(value) && !/\bcm\b/.test(value) ? 100 : 1
      return numbers.slice(0, 3).reduce((product, candidate) => product * candidate * unitMultiplier, 1)
    }
    default:
      return undefined
  }
}

function hardEvidence(
  constraint: ExtractedPreferenceConstraint,
  value: string | undefined,
): { evaluation: PreferenceConstraintEvaluation; score: number } {
  const evaluation = evaluatePreferenceConstraintValue(constraint, value)
  if (evaluation === 'match') return { evaluation, score: 32 }
  if (evaluation === 'miss') return { evaluation, score: -16 }
  return { evaluation, score: 0 }
}

function preferenceBoosts(
  items: readonly CatalogProductListItem[],
  preferences: readonly ExtractedPreferenceConstraint[],
): Map<string, { score: number; labels: string[] }> {
  const result = new Map<string, { score: number; labels: string[] }>()

  for (const preference of preferences) {
    if (preference.kind !== 'preference' || !preference.direction || preference.direction === 'present') continue

    const known = items.flatMap((item, index) => {
      const raw = metricValue(item.product.specifications, preference.metricKey)
      if (!raw) return []
      const value = scalarValue(preference.metricKey, raw)
      return value == null ? [] : [{ item, index, value }]
    })

    if (known.length < 2) continue
    const values = known.map((candidate) => candidate.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) continue

    for (const candidate of known) {
      const normalized = preference.direction === 'higher'
        ? (candidate.value - min) / (max - min)
        : (max - candidate.value) / (max - min)
      const boost = Math.round(Math.max(0, Math.min(1, normalized)) * 14)
      if (boost <= 0) continue
      const current = result.get(candidate.item.product.id) ?? { score: 0, labels: [] }
      current.score += boost
      if (normalized >= 0.67 && !current.labels.includes(preference.label)) current.labels.push(preference.label)
      result.set(candidate.item.product.id, current)
    }
  }

  return result
}

export function rankConstraintAwareCandidates(
  items: readonly CatalogProductListItem[],
  originalQuery?: string,
): ConstraintAwareCandidate[] {
  const constraints = extractPreferenceConstraints(originalQuery)
  if (constraints.length === 0) {
    return items.map((item, originalPosition) => ({
      item,
      score: Math.max(0, 120 - originalPosition),
      originalPosition,
      evidence: [],
      matchedCount: 0,
      missedCount: 0,
      unknownCount: 0,
      preferenceBoost: 0,
    }))
  }

  const preferences = constraints.filter((constraint) => constraint.kind === 'preference')
  const hardConstraints = constraints.filter((constraint) => constraint.kind !== 'preference')
  const softBoostByProduct = preferenceBoosts(items, preferences)

  return items
    .map((item, originalPosition) => {
      const evidence: CandidateEvidence[] = []
      let hardScore = 0
      let matchedCount = 0
      let missedCount = 0
      let unknownCount = 0

      for (const constraint of hardConstraints) {
        const value = metricValue(item.product.specifications, constraint.metricKey)
        const outcome = hardEvidence(constraint, value)
        hardScore += outcome.score
        if (outcome.evaluation === 'match') matchedCount += 1
        else if (outcome.evaluation === 'miss') missedCount += 1
        else unknownCount += 1
        evidence.push({ label: constraint.label, status: outcome.evaluation })
      }

      const soft = softBoostByProduct.get(item.product.id) ?? { score: 0, labels: [] }
      for (const label of soft.labels) evidence.push({ label, status: 'preference' })

      // Existing catalog relevance stays the base. Explicit evidence can move a candidate,
      // but unknown attributes never receive a negative score.
      const baseScore = Math.max(0, 120 - originalPosition)
      return {
        item,
        score: baseScore + hardScore + soft.score,
        originalPosition,
        evidence,
        matchedCount,
        missedCount,
        unknownCount,
        preferenceBoost: soft.score,
      }
    })
    .sort((left, right) =>
      right.score - left.score
      || right.matchedCount - left.matchedCount
      || left.missedCount - right.missedCount
      || left.originalPosition - right.originalPosition
      || left.item.product.title.localeCompare(right.item.product.title, 'nl-NL'),
    )
}

export function candidateContextHighlights(candidate: ConstraintAwareCandidate, limit = 2): string[] {
  return candidate.evidence
    .filter((evidence) => evidence.status === 'match' || evidence.status === 'preference')
    .map((evidence) => evidence.label)
    .filter((label, index, all) => all.indexOf(label) === index)
    .slice(0, Math.max(0, limit))
}

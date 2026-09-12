import {
  normalizeSearchText,
  type PredictiveSearchAnalysis,
  type SearchIntentKey,
} from '@/application/search/predictive-search-core'
import {
  evaluatePreferenceConstraintValue,
  extractPreferenceConstraints,
  type ExtractedPreferenceConstraint,
} from '@/application/search/preference-constraint-extraction'
import type { ProductComparisonGroup } from '@/domain/catalog/comparison'
import type { SmartComparisonResult } from '@/domain/catalog/comparison-intelligence'

export type IntentAwareComparisonContext = {
  originalQuery?: string
  correctedQuery?: string
  productTerm?: string
  budgetMax?: number
  recognizedIntentLabels: string[]
  appliedIntentLabels: string[]
  preferenceConstraints: ExtractedPreferenceConstraint[]
  appliedPreferenceLabels: string[]
  unappliedPreferenceLabels: string[]
  priorityMetricKeys: string[]
}

export type ProductConstraintSummary = {
  matches: string[]
  misses: string[]
  unknown: string[]
}

const PRIORITIES: Partial<
  Record<ProductComparisonGroup, Partial<Record<SearchIntentKey, readonly string[]>>>
> = {
  laptops: {
    study: ['weight', 'battery-life', 'memory', 'storage', 'display'],
    work: ['memory', 'battery-life', 'ports', 'display', 'weight'],
  },
  headphones: {
    study: ['noise-cancelling', 'battery-life', 'weight', 'quick-charge'],
    work: ['noise-cancelling', 'battery-life', 'weight', 'bluetooth'],
  },
  tablets: {
    study: ['weight', 'storage', 'battery', 'display'],
    work: ['storage', 'battery', 'display', 'weight'],
  },
  'computer-mice': {
    work: ['devices', 'connection', 'charging', 'sensor'],
  },
  'fitness-wearables': {
    work: ['battery-life', 'weight'],
  },
}

const FALLBACK_ROW_LABELS: Record<string, readonly string[]> = {
  noise: ['geluid', 'geluidsniveau', 'geluidsproductie', 'noise', 'noise level', 'decibel'],
  dimensions: ['afmetingen', 'formaat', 'dimensions'],
  'noise-cancelling': ['ruisonderdrukking', 'noise cancelling', 'noise canceling', 'anc'],
}

function resolvePreferenceMetricKey(
  constraint: ExtractedPreferenceConstraint,
  comparison?: Pick<SmartComparisonResult, 'rows'>,
): string | undefined {
  if (!comparison) return constraint.metricKey
  if (comparison.rows.some((row) => row.key === constraint.metricKey)) return constraint.metricKey

  const aliases = FALLBACK_ROW_LABELS[constraint.metricKey] ?? []
  if (aliases.length === 0) return undefined
  const aliasSet = aliases.map(normalizeSearchText)
  const row = comparison.rows.find((candidate) => {
    const label = normalizeSearchText(candidate.label)
    return aliasSet.some((alias) => label === alias || label.includes(alias) || alias.includes(label))
  })
  return row?.key
}

export function buildIntentAwareComparisonContext(
  analysis: PredictiveSearchAnalysis,
  groupOrComparison: ProductComparisonGroup | Pick<SmartComparisonResult, 'group' | 'rows'>,
): IntentAwareComparisonContext {
  const group = typeof groupOrComparison === 'string' ? groupOrComparison : groupOrComparison.group
  const comparison = typeof groupOrComparison === 'string' ? undefined : groupOrComparison
  const explicitPreferences = extractPreferenceConstraints(analysis.originalTerm)
  const priorityMetricKeys: string[] = []
  const appliedPreferenceLabels: string[] = []
  const unappliedPreferenceLabels: string[] = []

  for (const preference of explicitPreferences) {
    const resolvedKey = resolvePreferenceMetricKey(preference, comparison)
    if (!resolvedKey) {
      unappliedPreferenceLabels.push(preference.label)
      continue
    }
    appliedPreferenceLabels.push(preference.label)
    if (!priorityMetricKeys.includes(resolvedKey)) priorityMetricKeys.push(resolvedKey)
  }

  const appliedIntentLabels: string[] = []
  const groupPriorities = PRIORITIES[group] ?? {}

  for (const intent of analysis.intents) {
    const priorities = groupPriorities[intent.key]
    if (!priorities || priorities.length === 0) continue
    appliedIntentLabels.push(intent.label)
    for (const key of priorities) {
      if (!priorityMetricKeys.includes(key)) priorityMetricKeys.push(key)
    }
  }

  return {
    originalQuery: analysis.originalTerm,
    correctedQuery: analysis.correctedTerm,
    productTerm: analysis.productTerm,
    budgetMax: analysis.budgetMax,
    recognizedIntentLabels: analysis.intents.map((intent) => intent.label),
    appliedIntentLabels,
    preferenceConstraints: explicitPreferences,
    appliedPreferenceLabels,
    unappliedPreferenceLabels,
    priorityMetricKeys,
  }
}

export function applyIntentAwareComparisonContext(
  comparison: SmartComparisonResult,
  context: IntentAwareComparisonContext,
): SmartComparisonResult {
  if (context.priorityMetricKeys.length === 0) return comparison

  const priorityOrder = new Map(context.priorityMetricKeys.map((key, index) => [key, index]))
  const originalOrder = new Map(comparison.rows.map((row, index) => [row.key, index]))
  const rows = [...comparison.rows].sort((left, right) => {
    const leftPriority = priorityOrder.get(left.key)
    const rightPriority = priorityOrder.get(right.key)
    if (leftPriority != null || rightPriority != null) {
      if (leftPriority == null) return 1
      if (rightPriority == null) return -1
      if (leftPriority !== rightPriority) return leftPriority - rightPriority
    }
    return (originalOrder.get(left.key) ?? 0) - (originalOrder.get(right.key) ?? 0)
  })

  const priorityLabels = context.priorityMetricKeys
    .map((key) => rows.find((row) => row.key === key)?.label)
    .filter((label): label is string => Boolean(label))
  const focus = [...priorityLabels, ...comparison.focus]
    .filter((label, index, all) => all.indexOf(label) === index)
    .slice(0, 6)

  const keyDifferences = [
    ...rows.filter((row) => priorityOrder.has(row.key) && row.isDifferent),
    ...comparison.keyDifferences,
  ]
    .filter((row, index, all) => all.findIndex((candidate) => candidate.key === row.key) === index)
    .slice(0, 4)

  const contextualHighlights = comparison.productHighlights.map((existing, productIndex) => {
    const priorityHighlights = rows
      .filter((row) => priorityOrder.has(row.key) && row.bestProductIndexes.includes(productIndex) && row.standoutLabel)
      .map((row) => row.standoutLabel as string)
    return [...priorityHighlights, ...existing]
      .filter((label, index, all) => all.indexOf(label) === index)
      .slice(0, 3)
  })

  return {
    ...comparison,
    focus,
    rows,
    keyDifferences,
    productHighlights: contextualHighlights,
  }
}

export function evaluateComparisonConstraints(
  comparison: SmartComparisonResult,
  context: IntentAwareComparisonContext,
): ProductConstraintSummary[] {
  const productCount = comparison.rows[0]?.values.length ?? 0
  const summaries = Array.from({ length: productCount }, () => ({
    matches: [] as string[],
    misses: [] as string[],
    unknown: [] as string[],
  }))

  for (const constraint of context.preferenceConstraints) {
    if (constraint.kind === 'preference') continue
    const resolvedKey = resolvePreferenceMetricKey(constraint, comparison)
    const row = resolvedKey ? comparison.rows.find((candidate) => candidate.key === resolvedKey) : undefined

    for (let index = 0; index < productCount; index += 1) {
      const evaluation = evaluatePreferenceConstraintValue(constraint, row?.values[index])
      if (evaluation === 'match') summaries[index].matches.push(constraint.label)
      else if (evaluation === 'miss') summaries[index].misses.push(constraint.label)
      else summaries[index].unknown.push(constraint.label)
    }
  }

  return summaries
}

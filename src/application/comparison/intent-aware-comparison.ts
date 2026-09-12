import type { PredictiveSearchAnalysis, SearchIntentKey } from '@/application/search/predictive-search-core'
import type { ProductComparisonGroup } from '@/domain/catalog/comparison'
import type { SmartComparisonResult } from '@/domain/catalog/comparison-intelligence'

export type IntentAwareComparisonContext = {
  originalQuery?: string
  correctedQuery?: string
  productTerm?: string
  budgetMax?: number
  recognizedIntentLabels: string[]
  appliedIntentLabels: string[]
  priorityMetricKeys: string[]
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

export function buildIntentAwareComparisonContext(
  analysis: PredictiveSearchAnalysis,
  group: ProductComparisonGroup,
): IntentAwareComparisonContext {
  const priorityMetricKeys: string[] = []
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

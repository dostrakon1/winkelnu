import type { PredictiveSearchAnalysis, SearchIntentKey } from '@/application/search/predictive-search-core'
import type { ProductComparisonGroup } from '@/domain/catalog/comparison'

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

import { describe, expect, it } from 'vitest'
import type { PredictiveSearchAnalysis } from '@/application/search/predictive-search-core'
import type { SmartComparisonResult } from '@/domain/catalog/comparison-intelligence'
import {
  applyIntentAwareComparisonContext,
  buildIntentAwareComparisonContext,
} from './intent-aware-comparison'

function analysis(overrides: Partial<PredictiveSearchAnalysis> = {}): PredictiveSearchAnalysis {
  return {
    originalTerm: 'lichte laptop voor studie onder 800 euro',
    normalizedTerm: 'lichte laptop voor studie onder 800 euro',
    productTerm: 'lichte laptop',
    budgetMax: 800,
    navigationOnly: false,
    intents: [
      { key: 'study', label: 'Voor studie', description: 'Studiecontext' },
      { key: 'budget', label: 'Budget tot €800', description: 'Budgetcontext' },
    ],
    suggestions: [],
    ...overrides,
  }
}

function comparison(): SmartComparisonResult {
  return {
    group: 'laptops',
    groupLabel: 'Laptops',
    focus: ['Geheugen', 'Opslag', 'Scherm', 'Gewicht', 'Accuduur'],
    rows: [
      {
        key: 'memory',
        label: 'Geheugen',
        values: ['16 GB', '32 GB'],
        importance: 'primary',
        isDifferent: true,
        bestProductIndexes: [1],
        standoutLabel: 'Meer geheugen',
      },
      {
        key: 'storage',
        label: 'Opslag',
        values: ['512 GB', '1 TB'],
        importance: 'primary',
        isDifferent: true,
        bestProductIndexes: [1],
        standoutLabel: 'Meer opslag',
      },
      {
        key: 'weight',
        label: 'Gewicht',
        values: ['1,2 kg', '1,5 kg'],
        importance: 'primary',
        isDifferent: true,
        bestProductIndexes: [0],
        standoutLabel: 'Lichtste',
      },
      {
        key: 'battery-life',
        label: 'Accuduur',
        values: ['15 uur', '10 uur'],
        importance: 'primary',
        isDifferent: true,
        bestProductIndexes: [0],
        standoutLabel: 'Langste accuduur',
      },
    ],
    keyDifferences: [],
    productHighlights: [[], []],
  }
}

describe('buildIntentAwareComparisonContext', () => {
  it('maps study intent to laptop-specific priorities while keeping budget separate', () => {
    const context = buildIntentAwareComparisonContext(analysis(), 'laptops')

    expect(context.priorityMetricKeys.slice(0, 5)).toEqual([
      'weight',
      'battery-life',
      'memory',
      'storage',
      'display',
    ])
    expect(context.appliedIntentLabels).toEqual(['Voor studie'])
    expect(context.recognizedIntentLabels).toEqual(['Voor studie', 'Budget tot €800'])
    expect(context.budgetMax).toBe(800)
  })

  it('does not invent product priorities for gift intent without an explicit group rule', () => {
    const context = buildIntentAwareComparisonContext(analysis({
      intents: [{ key: 'gift', label: 'Cadeau-inspiratie', description: 'Cadeau' }],
      budgetMax: undefined,
    }), 'laptops')

    expect(context.priorityMetricKeys).toEqual([])
    expect(context.appliedIntentLabels).toEqual([])
    expect(context.recognizedIntentLabels).toEqual(['Cadeau-inspiratie'])
  })
})

describe('applyIntentAwareComparisonContext', () => {
  it('moves context-relevant rows and differences forward without creating a total score', () => {
    const context = buildIntentAwareComparisonContext(analysis(), 'laptops')
    const result = applyIntentAwareComparisonContext(comparison(), context)

    expect(result.rows.map((row) => row.key).slice(0, 4)).toEqual([
      'weight',
      'battery-life',
      'memory',
      'storage',
    ])
    expect(result.keyDifferences.map((row) => row.key).slice(0, 4)).toEqual([
      'weight',
      'battery-life',
      'memory',
      'storage',
    ])
    expect(result.productHighlights[0]).toEqual(['Lichtste', 'Langste accuduur'])
    expect(result.productHighlights[1]).toEqual(['Meer geheugen', 'Meer opslag'])
  })
})

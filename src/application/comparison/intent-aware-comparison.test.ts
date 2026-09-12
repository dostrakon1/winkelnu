import { describe, expect, it } from 'vitest'
import type { PredictiveSearchAnalysis } from '@/application/search/predictive-search-core'
import type { SmartComparisonResult } from '@/domain/catalog/comparison-intelligence'
import {
  applyIntentAwareComparisonContext,
  buildIntentAwareComparisonContext,
  evaluateComparisonConstraints,
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
        values: ['16 GB', '8 GB'],
        importance: 'primary',
        isDifferent: true,
        bestProductIndexes: [0],
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
  it('puts explicit lightweight preference before broader study priorities while keeping budget separate', () => {
    const context = buildIntentAwareComparisonContext(analysis(), comparison())

    expect(context.priorityMetricKeys.slice(0, 5)).toEqual([
      'weight',
      'battery-life',
      'memory',
      'storage',
      'display',
    ])
    expect(context.appliedPreferenceLabels).toEqual(['Lichtgewicht'])
    expect(context.appliedIntentLabels).toEqual(['Voor studie'])
    expect(context.recognizedIntentLabels).toEqual(['Voor studie', 'Budget tot €800'])
    expect(context.budgetMax).toBe(800)
  })

  it('does not invent product priorities for gift intent without explicit preferences or group rules', () => {
    const context = buildIntentAwareComparisonContext(analysis({
      originalTerm: 'cadeau voor vader laptop',
      normalizedTerm: 'cadeau voor vader laptop',
      productTerm: 'laptop',
      intents: [{ key: 'gift', label: 'Cadeau-inspiratie', description: 'Cadeau' }],
      budgetMax: undefined,
    }), comparison())

    expect(context.priorityMetricKeys).toEqual([])
    expect(context.appliedPreferenceLabels).toEqual([])
    expect(context.appliedIntentLabels).toEqual([])
    expect(context.recognizedIntentLabels).toEqual(['Cadeau-inspiratie'])
  })

  it('keeps a recognized preference visible when the comparison has no matching metric', () => {
    const context = buildIntentAwareComparisonContext(analysis({
      originalTerm: 'stille laptop',
      normalizedTerm: 'stille laptop',
      productTerm: 'stille laptop',
      intents: [],
      budgetMax: undefined,
    }), comparison())

    expect(context.appliedPreferenceLabels).toEqual([])
    expect(context.unappliedPreferenceLabels).toEqual(['Stil gebruik'])
    expect(context.priorityMetricKeys).toEqual([])
  })
})

describe('applyIntentAwareComparisonContext', () => {
  it('moves explicit and context-relevant rows forward without creating a total score', () => {
    const context = buildIntentAwareComparisonContext(analysis(), comparison())
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
    expect(result.productHighlights[0]).toEqual(['Lichtste', 'Langste accuduur', 'Meer geheugen'])
    expect(result.productHighlights[1]).toEqual(['Meer opslag'])
  })
})

describe('evaluateComparisonConstraints', () => {
  it('separates matches, misses and unknowns per product using only known specifications', () => {
    const explicit = analysis({
      originalTerm: 'laptop maximaal 1,3 kg met minimaal 16 GB RAM en minstens 12 uur accuduur',
      normalizedTerm: 'laptop maximaal 1 3 kg met minimaal 16 gb ram en minstens 12 uur accuduur',
      productTerm: 'laptop',
      budgetMax: undefined,
      intents: [],
    })
    const context = buildIntentAwareComparisonContext(explicit, comparison())
    const summaries = evaluateComparisonConstraints(comparison(), context)

    expect(summaries[0].matches).toEqual(expect.arrayContaining([
      'Maximaal 1,3 kg',
      'Minimaal 16 GB geheugen',
      'Minimaal 12 uur accuduur',
    ]))
    expect(summaries[1].misses).toEqual(expect.arrayContaining([
      'Maximaal 1,3 kg',
      'Minimaal 16 GB geheugen',
      'Minimaal 12 uur accuduur',
    ]))
  })
})

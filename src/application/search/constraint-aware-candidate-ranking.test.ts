import { describe, expect, it } from 'vitest'
import type { CatalogProductListItem } from '@/application/catalog/catalog-service'
import { candidateContextHighlights, rankConstraintAwareCandidates } from './constraint-aware-candidate-ranking'

function item(
  id: string,
  title: string,
  specifications: Array<{ label: string; value: string }>,
): CatalogProductListItem {
  return {
    product: {
      id,
      slug: id,
      title,
      specifications,
    },
    offerCount: 0,
  }
}

describe('rankConstraintAwareCandidates', () => {
  it('promotes a known hard-constraint match over the original catalog order', () => {
    const original = [
      item('laptop-a', 'Laptop A', [
        { label: 'Werkgeheugen', value: '8 GB' },
        { label: 'Gewicht', value: '1,2 kg' },
      ]),
      item('laptop-b', 'Laptop B', [
        { label: 'RAM', value: '16 GB' },
        { label: 'Gewicht', value: '1,4 kg' },
      ]),
    ]

    const ranked = rankConstraintAwareCandidates(original, 'lichte laptop met minimaal 16 GB RAM')

    expect(ranked[0].item.product.id).toBe('laptop-b')
    expect(ranked[0].matchedCount).toBe(1)
    expect(ranked[1].missedCount).toBe(1)
  })

  it('keeps unknown attribute evidence neutral instead of treating it as a miss', () => {
    const original = [
      item('unknown', 'Laptop zonder bekende RAM', []),
      item('miss', 'Laptop met 8 GB RAM', [{ label: 'Geheugen', value: '8 GB' }]),
    ]

    const ranked = rankConstraintAwareCandidates(original, 'laptop met minimaal 16 GB RAM')
    const unknown = ranked.find((candidate) => candidate.item.product.id === 'unknown')!
    const miss = ranked.find((candidate) => candidate.item.product.id === 'miss')!

    expect(unknown.unknownCount).toBe(1)
    expect(unknown.missedCount).toBe(0)
    expect(miss.missedCount).toBe(1)
    expect(unknown.score).toBeGreaterThan(miss.score)
  })

  it('uses measurable soft preferences as a moderate boost among known candidates', () => {
    const original = [
      item('heavy', 'Zwaardere laptop', [{ label: 'Gewicht', value: '1,8 kg' }]),
      item('light', 'Lichte laptop', [{ label: 'Gewicht', value: '1,1 kg' }]),
      item('unknown', 'Laptop onbekend gewicht', []),
    ]

    const ranked = rankConstraintAwareCandidates(original, 'lichte laptop')

    expect(ranked[0].item.product.id).toBe('light')
    expect(ranked.find((candidate) => candidate.item.product.id === 'unknown')?.preferenceBoost).toBe(0)
    expect(candidateContextHighlights(ranked[0])).toContain('Lichtgewicht')
  })

  it('understands equivalent feed labels and units', () => {
    const original = [
      item('a', 'Laptop A', [
        { label: 'Basisopslag', value: '512 GB' },
        { label: 'Batterijduur', value: '9 uur' },
      ]),
      item('b', 'Laptop B', [
        { label: 'SSD', value: '1 TB' },
        { label: 'Accuduur', value: '12 uur' },
      ]),
    ]

    const ranked = rankConstraintAwareCandidates(original, 'laptop met minimaal 1 TB opslag en minstens 10 uur accuduur')

    expect(ranked[0].item.product.id).toBe('b')
    expect(ranked[0].matchedCount).toBe(2)
    expect(ranked[1].missedCount).toBe(2)
  })

  it('does not alter ranking when no preference or constraint is recognized', () => {
    const original = [item('a', 'Laptop A', []), item('b', 'Laptop B', [])]
    const ranked = rankConstraintAwareCandidates(original, 'laptop')

    expect(ranked.map((candidate) => candidate.item.product.id)).toEqual(['a', 'b'])
  })
})

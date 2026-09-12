import { describe, expect, it } from 'vitest'
import { NOT_APPLICABLE_COMPARISON_VALUE } from './comparison'
import { buildSmartComparison } from './comparison-intelligence'
import type { Product } from './types'

function product(input: Partial<Product> & Pick<Product, 'id' | 'slug' | 'title' | 'visualKind'>): Product {
  return input
}

describe('buildSmartComparison', () => {
  it('merges feed-style aliases into canonical laptop comparison rows', () => {
    const result = buildSmartComparison([
      product({
        id: 'a',
        slug: 'a',
        title: 'Laptop A',
        visualKind: 'laptop',
        specifications: [
          { label: 'Basisgeheugen', value: '16 GB centraal geheugen' },
          { label: 'Basisopslag', value: '512 GB SSD' },
          { label: 'Gewicht', value: '1,24 kg' },
        ],
      }),
      product({
        id: 'b',
        slug: 'b',
        title: 'Laptop B',
        visualKind: 'laptop',
        specifications: [
          { label: 'RAM', value: '32 GB' },
          { label: 'SSD', value: '1 TB' },
          { label: 'Gewicht', value: '1450 g' },
        ],
      }),
    ])

    expect(result?.group).toBe('laptops')
    expect(result?.rows.find((row) => row.key === 'memory')).toMatchObject({
      label: 'Geheugen',
      values: ['16 GB centraal geheugen', '32 GB'],
      bestProductIndexes: [1],
      standoutLabel: 'Meer geheugen',
    })
    expect(result?.rows.find((row) => row.key === 'storage')).toMatchObject({
      values: ['512 GB SSD', '1 TB'],
      bestProductIndexes: [1],
    })
    expect(result?.rows.find((row) => row.key === 'weight')).toMatchObject({
      values: ['1,24 kg', '1450 g'],
      bestProductIndexes: [0],
      standoutLabel: 'Lichtste',
    })
    expect(result?.productHighlights[0]).toContain('Lichtste')
    expect(result?.productHighlights[1]).toEqual(expect.arrayContaining(['Meer geheugen', 'Meer opslag']))
  })

  it('understands prefixed aliases and ranks only directly comparable airfryer measurements', () => {
    const result = buildSmartComparison([
      product({
        id: 'philips',
        slug: 'philips',
        title: 'Philips',
        visualKind: 'airfryer',
        specifications: [
          { label: 'Capaciteit', value: '7,2 l' },
          { label: 'Kookfuncties', value: '16 functies' },
          { label: 'Vermogen', value: '2000 W' },
        ],
      }),
      product({
        id: 'ninja',
        slug: 'ninja',
        title: 'Ninja',
        visualKind: 'dual-airfryer',
        specifications: [
          { label: 'Totale capaciteit', value: '9,5 l' },
          { label: 'Functies', value: '6' },
          { label: 'Vermogen AF400UK', value: '2470 W' },
        ],
      }),
    ])

    expect(result?.rows.find((row) => row.key === 'capacity')?.bestProductIndexes).toEqual([1])
    expect(result?.rows.find((row) => row.key === 'functions')?.bestProductIndexes).toEqual([0])
    expect(result?.rows.find((row) => row.key === 'power')).toMatchObject({
      values: ['2000 W', '2470 W'],
      bestProductIndexes: [],
    })
    expect(result?.keyDifferences.map((row) => row.key)).toEqual(expect.arrayContaining(['capacity', 'functions', 'power']))
  })

  it('does not declare a measurable strong point when one selected product is missing that value', () => {
    const result = buildSmartComparison([
      product({
        id: 'a',
        slug: 'a',
        title: 'Headphone A',
        visualKind: 'headphones',
        specifications: [{ label: 'Gewicht', value: '250 g' }],
      }),
      product({
        id: 'b',
        slug: 'b',
        title: 'Headphone B',
        visualKind: 'headphones',
        specifications: [{ label: 'Bluetooth', value: 'Bluetooth 5.3' }],
      }),
    ])

    expect(result?.rows.find((row) => row.key === 'weight')?.bestProductIndexes).toEqual([])
    expect(result?.productHighlights.flat()).not.toContain('Lichtste')
  })

  it('keeps not-applicable vacuum properties distinct from unknown data', () => {
    const result = buildSmartComparison([
      product({
        id: 'stick',
        slug: 'stick',
        title: 'Steelstofzuiger',
        visualKind: 'stick-vacuum',
        specifications: [
          { label: 'Gebruiksduur', value: '60 minuten' },
          { label: 'Stofreservoir', value: '0,35 l' },
        ],
      }),
      product({
        id: 'canister',
        slug: 'canister',
        title: 'Sledestofzuiger',
        visualKind: 'canister-vacuum',
        specifications: [
          { label: 'Stofzak', value: '4,5 l' },
          { label: 'Actieradius', value: '12 m' },
        ],
      }),
    ])

    expect(result?.rows.find((row) => row.key === 'runtime')?.values).toEqual([
      '60 minuten',
      NOT_APPLICABLE_COMPARISON_VALUE,
    ])
    expect(result?.rows.find((row) => row.key === 'bag')?.values).toEqual([
      NOT_APPLICABLE_COMPARISON_VALUE,
      '4,5 l',
    ])
  })

  it('keeps unknown specifications visible after the product-type priorities', () => {
    const result = buildSmartComparison([
      product({
        id: 'a',
        slug: 'a',
        title: 'A',
        visualKind: 'tablet',
        specifications: [{ label: 'Speciale stylusfunctie', value: 'Ja' }],
      }),
      product({
        id: 'b',
        slug: 'b',
        title: 'B',
        visualKind: 'tablet',
        specifications: [{ label: 'Speciale stylusfunctie', value: 'Nee' }],
      }),
    ])

    const row = result?.rows.find((candidate) => candidate.key === 'raw:speciale stylusfunctie')
    expect(row).toMatchObject({
      label: 'Speciale stylusfunctie',
      values: ['Ja', 'Nee'],
      importance: 'other',
      isDifferent: true,
      bestProductIndexes: [],
    })
    expect(result?.rows.at(-1)?.key).toBe('raw:speciale stylusfunctie')
  })
})

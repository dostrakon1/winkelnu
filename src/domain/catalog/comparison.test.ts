import { describe, expect, it } from 'vitest'
import {
  MAX_COMPARISON_PRODUCTS,
  buildProductComparisonRows,
  parseComparisonProductSlugs,
} from './comparison'
import type { Product } from './types'

describe('parseComparisonProductSlugs', () => {
  it('accepts comma-separated and repeated values, removes duplicates and caps the selection', () => {
    const result = parseComparisonProductSlugs([
      'alpha,beta,alpha',
      'gamma,delta,epsilon',
    ])

    expect(result).toEqual(['alpha', 'beta', 'gamma', 'delta'])
    expect(result).toHaveLength(MAX_COMPARISON_PRODUCTS)
  })

  it('drops empty and unsafe slug values', () => {
    expect(parseComparisonProductSlugs('goed-product,../fout,,ook-goed')).toEqual([
      'goed-product',
      'ook-goed',
    ])
  })
})

describe('buildProductComparisonRows', () => {
  it('aligns shared and missing specifications across products', () => {
    const products: Product[] = [
      {
        id: '1',
        slug: 'eerste',
        title: 'Eerste',
        brand: 'Merk A',
        specifications: [
          { label: 'Gewicht', value: '1,2 kg' },
          { label: 'Accuduur', value: '10 uur' },
        ],
      },
      {
        id: '2',
        slug: 'tweede',
        title: 'Tweede',
        brand: 'Merk B',
        specifications: [
          { label: 'gewicht', value: '1,4 kg' },
          { label: 'Scherm', value: '14 inch' },
        ],
      },
    ]

    expect(buildProductComparisonRows(products)).toEqual([
      { label: 'Merk', values: ['Merk A', 'Merk B'] },
      { label: 'Gewicht', values: ['1,2 kg', '1,4 kg'] },
      { label: 'Accuduur', values: ['10 uur', null] },
      { label: 'Scherm', values: [null, '14 inch'] },
    ])
  })
})

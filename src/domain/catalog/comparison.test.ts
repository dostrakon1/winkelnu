import { describe, expect, it } from 'vitest'
import {
  MAX_COMPARISON_PRODUCTS,
  NOT_APPLICABLE_COMPARISON_VALUE,
  buildProductComparisonRows,
  getProductComparisonGroup,
  parseComparisonProductSlugs,
  productsAreComparable,
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

describe('product comparison groups', () => {
  const product = (id: string, visualKind: Product['visualKind']): Product => ({
    id,
    slug: id,
    title: id,
    visualKind,
  })

  it('groups product variants that make sense to compare', () => {
    expect(getProductComparisonGroup(product('steelstofzuiger', 'stick-vacuum'))).toBe('vacuum-cleaners')
    expect(getProductComparisonGroup(product('sledestofzuiger', 'canister-vacuum'))).toBe('vacuum-cleaners')
    expect(getProductComparisonGroup(product('airfryer', 'airfryer'))).toBe('airfryers')
    expect(getProductComparisonGroup(product('dual-airfryer', 'dual-airfryer'))).toBe('airfryers')
    expect(getProductComparisonGroup(product('horloge', 'watch'))).toBe('fitness-wearables')
    expect(getProductComparisonGroup(product('band', 'fitness-band'))).toBe('fitness-wearables')
    expect(getProductComparisonGroup(product('maaier', 'mower'))).toBe('lawn-mowers')
    expect(getProductComparisonGroup(product('robotmaaier', 'robot-mower'))).toBe('lawn-mowers')
  })

  it('rejects unrelated product types even when they can share a broad category', () => {
    expect(productsAreComparable([
      product('laptop', 'laptop'),
      product('hoofdtelefoon', 'headphones'),
    ])).toBe(false)
  })

  it('allows two to four products from one comparison group', () => {
    expect(productsAreComparable([
      product('a', 'toothbrush'),
      product('b', 'toothbrush'),
    ])).toBe(true)
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

  it('shows product types and distinguishes not applicable from unknown vacuum specs', () => {
    const products: Product[] = [
      {
        id: 'dyson',
        slug: 'dyson',
        title: 'Dyson',
        brand: 'Dyson',
        visualKind: 'stick-vacuum',
        specifications: [
          { label: 'Gebruiksduur', value: 'tot 60 minuten' },
          { label: 'Stofreservoir', value: '0,35 l' },
          { label: 'Zuigkracht', value: 'tot 150 Air Watt' },
        ],
      },
      {
        id: 'miele',
        slug: 'miele',
        title: 'Miele',
        brand: 'Miele',
        visualKind: 'canister-vacuum',
        specifications: [
          { label: 'Stofzak', value: '4,5 l' },
          { label: 'Actieradius', value: '12 m' },
          { label: 'Vermogen', value: '890 W' },
        ],
      },
    ]

    expect(buildProductComparisonRows(products)).toEqual([
      { label: 'Producttype', values: ['Steelstofzuiger', 'Sledestofzuiger'] },
      { label: 'Merk', values: ['Dyson', 'Miele'] },
      { label: 'Gebruiksduur', values: ['tot 60 minuten', NOT_APPLICABLE_COMPARISON_VALUE] },
      { label: 'Stofreservoir', values: ['0,35 l', NOT_APPLICABLE_COMPARISON_VALUE] },
      { label: 'Zuigkracht', values: ['tot 150 Air Watt', null] },
      { label: 'Stofzak', values: [NOT_APPLICABLE_COMPARISON_VALUE, '4,5 l'] },
      { label: 'Actieradius', values: [NOT_APPLICABLE_COMPARISON_VALUE, '12 m'] },
      { label: 'Vermogen', values: [null, '890 W'] },
    ])
  })
})

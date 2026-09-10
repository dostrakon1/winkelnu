import { describe, expect, it } from 'vitest'
import type { Product } from '@/domain/catalog/types'
import { selectRelatedProducts } from './related-products'

function item(product: Product) {
  return { product }
}

describe('selectRelatedProducts', () => {
  it('excludes the current product and duplicate slugs', () => {
    const current: Product = { id: '1', slug: 'dyson', title: 'Dyson', visualKind: 'stick-vacuum' }
    const miele: Product = { id: '2', slug: 'miele', title: 'Miele', visualKind: 'canister-vacuum' }

    const result = selectRelatedProducts(current, [item(current), item(miele), item(miele)])

    expect(result.comparable.map(({ product }) => product.slug)).toEqual(['miele'])
    expect(result.categoryAlternatives).toEqual([])
  })

  it('keeps true comparison-group peers separate from broader category alternatives', () => {
    const current: Product = { id: '1', slug: 'dyson', title: 'Dyson V12', visualKind: 'stick-vacuum' }
    const sameKind: Product = { id: '2', slug: 'other-stick', title: 'Andere steelstofzuiger', visualKind: 'stick-vacuum' }
    const sameGroup: Product = { id: '3', slug: 'miele', title: 'Miele Complete C3', visualKind: 'canister-vacuum' }
    const washingMachine: Product = { id: '4', slug: 'washer', title: 'Wasmachine', visualKind: 'washing-machine' }

    const result = selectRelatedProducts(current, [
      item(washingMachine),
      item(sameGroup),
      item(sameKind),
    ])

    expect(result.comparable.map(({ product }) => product.slug)).toEqual(['other-stick', 'miele'])
    expect(result.categoryAlternatives.map(({ product }) => product.slug)).toEqual(['washer'])
  })

  it('returns category alternatives when no comparable peer exists', () => {
    const current: Product = { id: '1', slug: 'laptop', title: 'Laptop', visualKind: 'laptop' }
    const headphones: Product = { id: '2', slug: 'headphones', title: 'Hoofdtelefoon', visualKind: 'headphones' }
    const tablet: Product = { id: '3', slug: 'tablet', title: 'Tablet', visualKind: 'tablet' }

    const result = selectRelatedProducts(current, [item(tablet), item(headphones)])

    expect(result.comparable).toEqual([])
    expect(result.categoryAlternatives.map(({ product }) => product.slug)).toEqual(['headphones', 'tablet'])
  })

  it('respects the requested maximum per bucket', () => {
    const current: Product = { id: '1', slug: 'watch', title: 'Sporthorloge', visualKind: 'watch' }
    const candidates = [
      item({ id: '2', slug: 'band-a', title: 'Band A', visualKind: 'fitness-band' } satisfies Product),
      item({ id: '3', slug: 'band-b', title: 'Band B', visualKind: 'fitness-band' } satisfies Product),
      item({ id: '4', slug: 'watch-b', title: 'Watch B', visualKind: 'watch' } satisfies Product),
    ]

    const result = selectRelatedProducts(current, candidates, 2)

    expect(result.comparable).toHaveLength(2)
    expect(result.comparable[0].product.slug).toBe('watch-b')
  })
})

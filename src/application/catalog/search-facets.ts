import type { CatalogProductListItem } from './catalog-service'
import { getProductComparisonGroup, getProductComparisonGroupLabel, type ProductComparisonGroup } from '@/domain/catalog/comparison'

export type SearchFacetOption = {
  value: string
  label: string
  count: number
}

export type CatalogSearchFacets = {
  brands: SearchFacetOption[]
  productTypes: Array<SearchFacetOption & { value: ProductComparisonGroup }>
  hasCommercialData: boolean
}

export function buildCatalogSearchFacets(items: CatalogProductListItem[]): CatalogSearchFacets {
  const brands = new Map<string, SearchFacetOption>()
  const productTypes = new Map<ProductComparisonGroup, SearchFacetOption & { value: ProductComparisonGroup }>()

  for (const item of items) {
    const brand = item.product.brand?.trim()
    if (brand) {
      const key = brand.toLocaleLowerCase('nl-NL')
      const existing = brands.get(key)
      if (existing) existing.count += 1
      else brands.set(key, { value: brand, label: brand, count: 1 })
    }

    const productType = getProductComparisonGroup(item.product)
    if (productType) {
      const existing = productTypes.get(productType)
      if (existing) existing.count += 1
      else productTypes.set(productType, {
        value: productType,
        label: getProductComparisonGroupLabel(productType),
        count: 1,
      })
    }
  }

  return {
    brands: [...brands.values()].sort((a, b) => a.label.localeCompare(b.label, 'nl-NL')),
    productTypes: [...productTypes.values()].sort((a, b) => a.label.localeCompare(b.label, 'nl-NL')),
    hasCommercialData: items.some((item) => Boolean(item.bestOffer)),
  }
}

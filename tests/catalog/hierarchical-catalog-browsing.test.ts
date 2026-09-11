import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { CatalogService } from '@/application/catalog/catalog-service'
import type { Category, Product } from '@/domain/catalog/types'
import { InMemoryCatalogRepository } from '@/infrastructure/catalog/in-memory-catalog-repository'

const electronics: Category = { id: 'category:elektronica', slug: 'elektronica', name: 'Elektronica' }
const laptops: Category = { id: 'category:laptops-computers', slug: 'laptops-computers', name: 'Laptops & computers', parentId: electronics.id }
const audio: Category = { id: 'category:audio', slug: 'audio', name: 'Audio', parentId: electronics.id }
const home: Category = { id: 'category:wonen-huishouden', slug: 'wonen-huishouden', name: 'Wonen & huishouden' }

const rootProduct: Product = {
  id: 'product:root',
  slug: 'root-product',
  title: 'Root product',
  categoryId: electronics.id,
}

const laptopProduct: Product = {
  id: 'product:laptop',
  slug: 'laptop-product',
  title: 'Laptop product',
  categoryId: laptops.id,
}

const audioProduct: Product = {
  id: 'product:audio',
  slug: 'audio-product',
  title: 'Audio product',
  categoryId: audio.id,
}

const homeProduct: Product = {
  id: 'product:home',
  slug: 'home-product',
  title: 'Home product',
  categoryId: home.id,
}

async function repository() {
  const repo = new InMemoryCatalogRepository({ categories: [electronics, laptops, audio, home] })
  for (const product of [rootProduct, laptopProduct, audioProduct, homeProduct]) await repo.upsertProduct(product)
  return repo
}

describe('hierarchical catalog browsing', () => {
  it('includes direct child products when browsing a root category', async () => {
    const repo = await repository()
    const products = await repo.listProducts({ categorySlug: electronics.slug })

    expect(products.map((product) => product.id)).toEqual([
      rootProduct.id,
      laptopProduct.id,
      audioProduct.id,
    ])
  })

  it('keeps a subcategory filter exact', async () => {
    const repo = await repository()
    const products = await repo.listProducts({ categorySlug: laptops.slug })

    expect(products.map((product) => product.id)).toEqual([laptopProduct.id])
  })

  it('exposes roots, parent context and sorted child navigation through the catalog service', async () => {
    const repo = await repository()
    const service = new CatalogService(repo)

    await expect(service.listRootCategories()).resolves.toEqual([electronics, home])

    const rootDiscovery = await service.getCategoryDiscovery({ categorySlug: electronics.slug })
    expect(rootDiscovery?.parentCategory).toBeUndefined()
    expect(rootDiscovery?.subcategories.map((category) => category.slug)).toEqual(['audio', 'laptops-computers'])
    expect(rootDiscovery?.items.map((item) => item.product.id)).toEqual([
      rootProduct.id,
      laptopProduct.id,
      audioProduct.id,
    ])

    const childDiscovery = await service.getCategoryDiscovery({ categorySlug: laptops.slug })
    expect(childDiscovery?.parentCategory?.id).toBe(electronics.id)
    expect(childDiscovery?.subcategories).toEqual([])
    expect(childDiscovery?.items.map((item) => item.product.id)).toEqual([laptopProduct.id])
  })

  it('pushes root-or-direct-child filtering into the scalable Supabase ranking function', () => {
    const sql = readFileSync('supabase/migrations/0020_hierarchical_catalog_browsing.sql', 'utf8')

    expect(sql).toContain('left join categories parent_category on parent_category.id = c.parent_id')
    expect(sql).toContain('or c.slug = p_category_slug')
    expect(sql).toContain('or parent_category.slug = p_category_slug')
  })
})

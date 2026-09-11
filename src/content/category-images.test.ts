import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { categoryImageSlugs } from '../generated/category-image-manifest'
import { editorialCategories } from './editorial-catalog'
import { getCategoryImage } from './category-images'

const discoveredImages = categoryImageSlugs.map((slug) => {
  const category = editorialCategories.find((item) => item.slug === slug)
  return {
    slug,
    category,
    image: getCategoryImage(slug, category?.title),
  }
})

describe('editorial category imagery', () => {
  it('derives unique local image paths from discovered category slugs', () => {
    expect(discoveredImages.length).toBeGreaterThan(0)

    const paths = discoveredImages.map(({ image }) => image?.src)
    expect(new Set(paths).size).toBe(paths.length)

    for (const { slug, image } of discoveredImages) {
      expect(image).toBeDefined()
      expect(image?.src).toBe(`/images/categories/${slug}-hero.webp`)
      expect(image?.alt.length ?? 0).toBeGreaterThan(10)
    }
  })

  it('keeps discovered images linked to published categories', () => {
    for (const { slug, category, image } of discoveredImages) {
      expect(category, slug).toBeDefined()
      expect(image, slug).toBeDefined()
    }

    expect(getCategoryImage('dieren', 'Dieren')?.src).toBe('/images/categories/dieren-hero.webp')
    expect(getCategoryImage('auto-fiets', 'Auto & fiets')?.src).toBe('/images/categories/auto-fiets-hero.webp')
    expect(getCategoryImage('bestaat-niet')).toBeUndefined()
    expect(getCategoryImage('toString')).toBeUndefined()
  })

  it('keeps every discovered image in the repository and in WebP format', () => {
    for (const { image } of discoveredImages) {
      expect(image).toBeDefined()
      if (!image) continue

      const bytes = readFileSync(join(process.cwd(), 'public', image.src.slice(1)))
      expect(bytes.subarray(0, 4).toString('ascii')).toBe('RIFF')
      expect(bytes.subarray(8, 12).toString('ascii')).toBe('WEBP')
    }
  })
})

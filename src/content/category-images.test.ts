import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { editorialCategories } from './editorial-catalog'
import { categoryImages, getCategoryImage } from './category-images'

const images = Object.values(categoryImages)

describe('editorial category imagery', () => {
  it('has ten unique, owner-approved local image paths with meaningful alt text', () => {
    expect(images).toHaveLength(10)
    expect(new Set(images.map((image) => image.src)).size).toBe(images.length)
    for (const image of images) {
      expect(image.src).toMatch(/^\/images\/categories\/[a-z0-9-]+-hero\.webp$/)
      expect(image.alt.length).toBeGreaterThan(20)
    }
  })

  it('keeps approved images linked to published categories', () => {
    for (const slug of Object.keys(categoryImages)) {
      expect(editorialCategories.some((category) => category.slug === slug), slug).toBe(true)
      expect(getCategoryImage(slug)).toBeDefined()
    }
    expect(editorialCategories.some((category) => category.slug === 'dieren')).toBe(true)
    expect(getCategoryImage('dieren')?.src).toBe('/images/categories/dieren-hero.webp')
    expect(getCategoryImage('auto-fiets')?.src).toBe('/images/categories/auto-fiets-hero.webp')
    expect(getCategoryImage('bestaat-niet')).toBeUndefined()
    expect(getCategoryImage('toString')).toBeUndefined()
  })

  it('keeps every approved image in the repository and in WebP format', () => {
    for (const image of images) {
      const bytes = readFileSync(join(process.cwd(), 'public', image.src.slice(1)))
      expect(bytes.subarray(0, 4).toString('ascii')).toBe('RIFF')
      expect(bytes.subarray(8, 12).toString('ascii')).toBe('WEBP')
    }
  })
})

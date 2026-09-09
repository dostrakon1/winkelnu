import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { editorialCategories } from './koopgidsen'
import { categoryImages, getCategoryImage } from './category-images'

const images = Object.values(categoryImages)

describe('editorial category imagery', () => {
  it('has six unique, local image paths with meaningful alt text', () => {
    expect(images).toHaveLength(6)
    expect(new Set(images.map((image) => image.src)).size).toBe(images.length)
    for (const image of images) {
      expect(image.src).toMatch(/^\/images\/categories\/[a-z0-9-]+-hero\.webp$/)
      expect(image.alt.length).toBeGreaterThan(20)
    }
  })

  it('provides imagery for every published editorial category', () => {
    for (const category of editorialCategories) {
      expect(getCategoryImage(category.slug)).toBeDefined()
    }
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

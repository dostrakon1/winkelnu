import { describe, expect, it } from 'vitest'
import { getBuyingGuide } from './koopgidsen-public'
import { productGuidanceByVisualKind } from './product-guidance'

describe('product guidance', () => {
  it('keeps every supported product type useful and concise', () => {
    for (const [visualKind, guidance] of Object.entries(productGuidanceByVisualKind)) {
      expect(guidance.heading.length, visualKind).toBeGreaterThan(16)
      expect(guidance.points, visualKind).toHaveLength(3)
      for (const point of guidance.points) expect(point.length, `${visualKind}: ${point}`).toBeGreaterThan(30)
    }
  })

  it('only links to published buying guides', () => {
    for (const [visualKind, guidance] of Object.entries(productGuidanceByVisualKind)) {
      if (!('guideSlug' in guidance) || !guidance.guideSlug) continue
      expect(getBuyingGuide(guidance.guideSlug), `${visualKind}: ${guidance.guideSlug}`).toBeDefined()
    }
  })
})

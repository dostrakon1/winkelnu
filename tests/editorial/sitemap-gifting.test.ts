import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('public sitemap gifting contract', () => {
  it('keeps the public Lootje & Lijstje landing page independent from the gifting mutation release gate', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/app/sitemap.ts'), 'utf8')

    expect(source).toContain("{ url: `${baseUrl}/lootje-lijstje`, changeFrequency: 'monthly', priority: 0.8 }")
    expect(source).not.toContain('isGiftingEnabled')
  })
})

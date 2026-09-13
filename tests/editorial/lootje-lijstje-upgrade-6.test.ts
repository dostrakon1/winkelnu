import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('Lootje & Lijstje Upgrade 6 share and growth loop', () => {
  it('prioritizes WhatsApp while supporting native share and copy fallback', () => {
    const source = read('src/components/gifting/gift-share-actions.tsx')

    expect(source).toContain('https://wa.me/?text=')
    expect(source).toContain('navigator.share')
    expect(source).toContain('navigator.clipboard?.writeText')
    expect(source).toContain('aria-live="polite"')
    expect(source).toContain('w-full justify-center sm:w-auto')
  })

  it('keeps sharing limited to the supplied public share path', () => {
    const source = read('src/components/gifting/gift-share-actions.tsx')

    expect(source).toContain('absoluteUrl(sharePath)')
    expect(source).not.toContain('recovery')
    expect(source).not.toContain('token')
  })

  it('turns a received wishlist into a natural create-your-own loop', () => {
    const source = read('src/app/lootje-lijstje/lijstje/[shareCode]/page.tsx')

    expect(source).toContain('Ook iets te vieren?')
    expect(source).toContain('href="/lootje-lijstje/lijstje/nieuw"')
    expect(source).toContain('href="/lootje-lijstje/groep/nieuw"')
    expect(source).toContain('Geen account nodig')
  })

  it('gives a closed invitation a useful next action instead of a dead end', () => {
    const source = read('src/app/lootje-lijstje/groep/[groupCode]/page.tsx')

    expect(source).toContain('Start mijn eigen groep')
    expect(source).toContain('href="/lootje-lijstje/groep/nieuw"')
    expect(source).toContain('Naar Lootje &amp; Lijstje')
  })
})

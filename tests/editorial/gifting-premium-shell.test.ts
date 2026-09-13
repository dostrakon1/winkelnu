import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

describe('Lootje & Lijstje premium shell contract', () => {
  it('installs one route-level gifting shell without the temporary release diagnostic', () => {
    const layout = source('src/app/lootje-lijstje/layout.tsx')

    expect(layout).toContain('GiftExperienceHeader')
    expect(layout).toContain('GiftExperienceFooter')
    expect(layout).toContain("import './gift-experience.css'")
    expect(layout).toContain("export const dynamic = 'force-dynamic'")
    expect(layout).not.toContain('gifting-release-diagnostic')
  })

  it('keeps legacy page shells visually suppressed inside the premium route shell', () => {
    const styles = source('src/app/lootje-lijstje/gift-experience.css')

    expect(styles).toContain('.gift-experience-content > div > header:first-child')
    expect(styles).toContain('.gift-experience-content > div > footer:last-child')
    expect(styles).toContain('.gift-shell-header')
    expect(styles).toContain('.gift-progress')
  })

  it('keeps clear gifting and Winkelnu navigation in the compact header', () => {
    const header = source('src/components/gifting/gift-experience-header.tsx')

    expect(header).toContain('Lootje &amp; Lijstje')
    expect(header).toContain('Naar Winkelnu')
    expect(header).toContain('/lootje-lijstje/lijstje/nieuw')
    expect(header).toContain('/lootje-lijstje/groep/nieuw')
  })
})

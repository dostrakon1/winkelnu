import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

describe('Lootje & Lijstje group UX contract', () => {
  it('loads the premium dashboard layer for the gifting namespace', () => {
    const layout = source('src/app/lootje-lijstje/layout.tsx')
    expect(layout).toContain("import './premium-group-dashboard.css'")
  })

  it('keeps organizer, participant and reveal pages inside the gifting shell', () => {
    const pages = [
      'src/app/lootje-lijstje/groep/[groupCode]/beheer/page.tsx',
      'src/app/lootje-lijstje/groep/[groupCode]/mijn/page.tsx',
      'src/app/lootje-lijstje/groep/[groupCode]/mijn/lootje/page.tsx',
    ]

    for (const page of pages) {
      const content = source(page)
      expect(content).toContain('gift-dashboard-journey')
      expect(content).not.toContain('WinkelnuHeader')
      expect(content).not.toContain('WinkelnuFooter')
    }
  })

  it('does not expose internal release-phase language in the draw UI', () => {
    const draw = source('src/components/gifting/gift-draw-confirmation.tsx')
    expect(draw).not.toContain('L6')
    expect(draw).toContain('eigen groepspagina')
  })
})

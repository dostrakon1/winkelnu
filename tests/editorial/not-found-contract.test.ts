import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

describe('editorial recovery and source contracts', () => {
  it('does not send visitors from the global 404 to the closed catalog', () => {
    const page = source('src/app/not-found.tsx')
    expect(page).toContain('actionHref="/koopgidsen"')
    expect(page).toContain('actionLabel="Bekijk koopgidsen"')
    expect(page).not.toContain('actionHref="/zoeken"')
  })

  it('provides a dedicated editorial recovery destination', () => {
    const page = source('src/app/koopgidsen/not-found.tsx')
    expect(page).toContain('EditorialShell')
    expect(page).toContain('actionHref="/koopgidsen"')
    expect(page).toContain('headingLevel="h1"')
  })

  it('keeps the corrected coffee source in the editorial content', () => {
    const content = source('src/content/koopgidsen.ts')
    expect(content).toContain('https://www.milieucentraal.nl/energie-besparen/apparaten-in-huis/water-koken-en-koffiezetten/')
    expect(content).not.toContain('https://www.milieucentraal.nl/energie-besparen/apparaten-in-huis/koffiezetapparaat/')
  })
})

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

const about = 'src/app/over-winkelnu/page.tsx'
const privacy = 'src/app/privacy/page.tsx'
const methodology = 'src/app/affiliate-en-vergelijking/page.tsx'

describe('minimal legal disclosure contracts', () => {
  it('keeps the full operator identity in one central record', () => {
    const details = source('src/components/storefront/operator-details.tsx')
    const operator = source('src/content/operator.ts')
    expect(details).toContain('operator.legalName')
    expect(details).toContain('operator.vatId')
    expect(details).toContain('operator.correspondenceAddress')
    expect(details).toContain('<details')
    expect(details).toContain('<summary')
    expect(details).toContain('geen bezoekadres')
    expect(details).toContain('https://www.akflow.nl/')
    expect(operator).toContain('chamberOfCommerce')
    expect(operator).toContain('email:')
    expect(source(about)).toContain('<OperatorDetails />')
    expect(source(about)).toContain('id="exploitant"')
  })

  it('links to the business details instead of repeating the identity table', () => {
    const text = source(privacy)
    expect(text).toContain('/over-winkelnu#exploitant')
    expect(text).toContain('operator.email')
    expect(text).not.toContain('<OperatorDetails')
    expect(text).not.toContain('operator.correspondenceAddress')
    expect(text).not.toContain('operator.vatId')
  })

  it('retains the essential affiliate, ranking and seller explanations', () => {
    const text = source(methodology)
    expect(text).toContain('vergoeding')
    expect(text).toContain('affiliate-relatie')
    expect(text).toContain('De hoogte van de vergoeding bepaalt niet')
    expect(text).toContain('gesponsord')
    expect(text).toContain('verzendkosten onbekend')
    expect(text).toContain('geen verkoper')
    expect(text).toContain('gekozen webwinkel')
  })

  it('provides a short site-wide disclosure and keeps legal navigation accessible', () => {
    const footer = source('src/components/storefront/winkelnu-footer.tsx')
    for (const route of ['/privacy', '/cookies', '/affiliate-en-vergelijking', '/over-winkelnu#exploitant']) {
      expect(footer).toContain(route)
    }
    expect(footer).toContain('vergoeding ontvangen via uitgaande links')
    expect(footer).toContain('operator.chamberOfCommerce')
    expect(footer).not.toContain('operator.legalName')
    expect(footer).not.toContain('operator.correspondenceAddress')
  })

  it('removes repetitive compliance notices without losing source transparency', () => {
    const shell = source('src/components/storefront/editorial-shell.tsx')
    expect(shell).toContain('Bronnen en werkwijze')
    expect(shell).not.toContain('Sommige toekomstige links')
    const guide = source('src/app/koopgidsen/[slug]/page.tsx')
    expect(guide).toContain('id="bronnen"')
    expect(guide).toContain('niet zelf getest')
    expect(guide).not.toContain('<EditorialNotice />')
    expect(source('src/app/koopgidsen/page.tsx')).not.toContain('<EditorialNotice />')
  })

  it('preserves the actual affiliate-link and public-catalog safety boundaries', () => {
    const offer = source('src/components/storefront/offer-card.tsx')
    expect(offer).toContain('rel="nofollow sponsored"')
    expect(offer).toContain('Bekijk aanbieding')
    const gate = source('src/application/catalog/public-catalog-release.ts')
    expect(gate).toContain('WINKELNU_PUBLIC_CATALOG_ENABLED')
    expect(gate).toContain('CATALOG_PERSISTENCE')
    const proxy = source('src/proxy.ts')
    expect(proxy).toContain('503')
    expect(proxy).toContain('no-store')
  })
})

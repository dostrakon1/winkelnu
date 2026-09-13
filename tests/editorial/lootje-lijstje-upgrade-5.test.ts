import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('Lootje & Lijstje Upgrade 5 discoverability', () => {
  it('surfaces the permanent gifting spotlight from the homepage discovery layer', () => {
    const source = read('src/components/storefront/seasonal-campaign-layer.tsx')

    expect(source).toContain("import { GiftDiscoverySpotlight } from './gift-discovery-spotlight'")
    expect(source).toContain('<GiftDiscoverySpotlight />')
    expect(source).toContain('href="/lootje-lijstje"')
    expect(source).toContain('Lootje &amp; Lijstje')
  })

  it('keeps Lootje & Lijstje discoverable in the category menu with or without a seasonal campaign', () => {
    const source = read('src/components/storefront/seasonal-campaign-layer.tsx')

    expect(source).toContain('function GiftDiscoveryMenuTile')
    expect(source).toContain('<GiftDiscoveryMenuTile mobile onNavigate={onNavigate} />')
    expect(source).toContain('<GiftDiscoveryMenuTile onNavigate={onNavigate} />')
  })

  it('integrates the tool with Cadeaus & feest and the global footer', () => {
    const footer = read('src/components/storefront/winkelnu-footer.tsx')
    const bridge = read('src/components/storefront/gift-collection-discovery-bridge.tsx')

    expect(footer).toContain('<GiftCollectionDiscoveryBridge />')
    expect(footer).toContain('href="/lootje-lijstje"')
    expect(bridge).toContain("pathname !== '/collecties/cadeaus-feest'")
    expect(bridge).toContain('<GiftDiscoverySpotlight placement="collection" />')
  })

  it('offers direct routes into the tool without weakening privacy positioning', () => {
    const spotlight = read('src/components/storefront/gift-discovery-spotlight.tsx')

    expect(spotlight).toContain('href="/lootje-lijstje"')
    expect(spotlight).toContain('href="/lootje-lijstje/groep/nieuw"')
    expect(spotlight).toContain('Geen account nodig')
    expect(spotlight).toContain('Privé trekking')
    expect(spotlight).toContain('Wensen direct bij de hand')
  })

  it('keeps the collection placement context-aware and mobile friendly', () => {
    const spotlight = read('src/components/storefront/gift-discovery-spotlight.tsx')

    expect(spotlight).toContain("className={isCollection ? 'wn-container py-8 sm:py-10'")
    expect(spotlight).toContain('{!isCollection ? (')
    expect(spotlight).toContain('Bekijk ook Cadeaus &amp; feest →')
    expect(spotlight).toContain('w-full justify-center sm:w-auto')
  })
})

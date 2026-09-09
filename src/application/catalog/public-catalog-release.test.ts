import { describe, expect, it } from 'vitest'
import { assertPublicCatalogEnabled, getPublicCatalogMode, isPublicCatalogEnabled, isPublicCatalogPath, PublicCatalogUnavailableError } from './public-catalog-release'

describe('public catalog release gate', () => {
  it('publishes the safe curated catalog by default', () => {
    expect(getPublicCatalogMode({})).toBe('curated')
    expect(isPublicCatalogEnabled({})).toBe(true)
    expect(getPublicCatalogMode({ CATALOG_PERSISTENCE: 'curated' })).toBe('curated')
  })

  it('never exposes synthetic memory data publicly', () => {
    expect(getPublicCatalogMode({ CATALOG_PERSISTENCE: 'memory' })).toBeNull()
    expect(isPublicCatalogEnabled({ WINKELNU_PUBLIC_CATALOG_ENABLED: 'true', CATALOG_PERSISTENCE: 'memory' })).toBe(false)
    expect(() => assertPublicCatalogEnabled({ CATALOG_PERSISTENCE: 'memory' })).toThrow(PublicCatalogUnavailableError)
  })

  it('uses curated fallback until persistent commerce is explicitly released', () => {
    expect(getPublicCatalogMode({ CATALOG_PERSISTENCE: 'supabase' })).toBe('curated')
    expect(getPublicCatalogMode({ WINKELNU_PUBLIC_CATALOG_ENABLED: 'false', CATALOG_PERSISTENCE: 'supabase' })).toBe('curated')
    expect(getPublicCatalogMode({ WINKELNU_PUBLIC_CATALOG_ENABLED: 'TRUE', CATALOG_PERSISTENCE: 'supabase' })).toBe('curated')
  })

  it('switches to Supabase only with the exact explicit commerce release flag', () => {
    expect(getPublicCatalogMode({ WINKELNU_PUBLIC_CATALOG_ENABLED: 'true', CATALOG_PERSISTENCE: 'supabase' })).toBe('supabase')
    expect(() => assertPublicCatalogEnabled({ WINKELNU_PUBLIC_CATALOG_ENABLED: 'true', CATALOG_PERSISTENCE: 'supabase' })).not.toThrow()
  })

  it('supports an emergency kill switch for the curated fallback', () => {
    expect(getPublicCatalogMode({ WINKELNU_CURATED_CATALOG_ENABLED: 'false', CATALOG_PERSISTENCE: 'curated' })).toBeNull()
    expect(getPublicCatalogMode({ WINKELNU_CURATED_CATALOG_ENABLED: 'false', CATALOG_PERSISTENCE: 'supabase' })).toBeNull()
    expect(getPublicCatalogMode({ WINKELNU_PUBLIC_CATALOG_ENABLED: 'true', WINKELNU_CURATED_CATALOG_ENABLED: 'false', CATALOG_PERSISTENCE: 'supabase' })).toBe('supabase')
  })

  it('rejects unknown persistence modes', () => {
    expect(getPublicCatalogMode({ CATALOG_PERSISTENCE: 'unknown' })).toBeNull()
  })

  it('covers public commerce routes without blocking editorial or operator routes', () => {
    for (const path of ['/zoeken', '/zoeken/', '/categorie/test', '/product/test', '/uit/123']) expect(isPublicCatalogPath(path)).toBe(true)
    for (const path of ['/', '/koopgidsen', '/koopgidsen/categorie/elektronica', '/intern/operations', '/api/ops/dashboard', '/aanbieding-niet-beschikbaar', '/productinformatie']) expect(isPublicCatalogPath(path)).toBe(false)
  })
})

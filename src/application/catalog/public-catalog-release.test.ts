import { describe, expect, it } from 'vitest'
import { assertPublicCatalogEnabled, isPublicCatalogEnabled, isPublicCatalogPath, PublicCatalogUnavailableError } from './public-catalog-release'

describe('public catalog release gate', () => {
  it('is closed by default and for synthetic persistence', () => {
    expect(isPublicCatalogEnabled({})).toBe(false)
    expect(isPublicCatalogEnabled({ WINKELNU_PUBLIC_CATALOG_ENABLED: 'true', CATALOG_PERSISTENCE: 'memory' })).toBe(false)
    expect(isPublicCatalogEnabled({ WINKELNU_PUBLIC_CATALOG_ENABLED: 'false', CATALOG_PERSISTENCE: 'supabase' })).toBe(false)
    expect(isPublicCatalogEnabled({ WINKELNU_PUBLIC_CATALOG_ENABLED: 'TRUE', CATALOG_PERSISTENCE: 'supabase' })).toBe(false)
    expect(isPublicCatalogEnabled({ WINKELNU_PUBLIC_CATALOG_ENABLED: 'true', CATALOG_PERSISTENCE: 'unknown' })).toBe(false)
  })
  it('requires explicit release and persistent data', () => {
    expect(isPublicCatalogEnabled({ WINKELNU_PUBLIC_CATALOG_ENABLED: 'true', CATALOG_PERSISTENCE: 'supabase' })).toBe(true)
  })
  it('rejects direct service access before release', () => {
    expect(() => assertPublicCatalogEnabled({})).toThrow(PublicCatalogUnavailableError)
    expect(() => assertPublicCatalogEnabled({ WINKELNU_PUBLIC_CATALOG_ENABLED: 'true', CATALOG_PERSISTENCE: 'memory' })).toThrow(PublicCatalogUnavailableError)
    expect(() => assertPublicCatalogEnabled({ WINKELNU_PUBLIC_CATALOG_ENABLED: 'true', CATALOG_PERSISTENCE: 'supabase' })).not.toThrow()
  })
  it('covers public commerce routes without blocking editorial or operator routes', () => {
    for (const path of ['/zoeken', '/zoeken/', '/categorie/test', '/product/test', '/uit/123']) expect(isPublicCatalogPath(path)).toBe(true)
    for (const path of ['/', '/koopgidsen', '/koopgidsen/categorie/elektronica', '/intern/operations', '/api/ops/dashboard', '/aanbieding-niet-beschikbaar', '/productinformatie']) expect(isPublicCatalogPath(path)).toBe(false)
  })
})

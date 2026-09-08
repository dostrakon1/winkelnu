import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PublicCatalogUnavailableError } from '@/application/catalog/public-catalog-release'

const mocks = vi.hoisted(() => ({
  catalogRepository: vi.fn(), syntheticCatalog: vi.fn(), ranking: vi.fn(), scalable: vi.fn(), catalog: vi.fn(),
  redirect: vi.fn(), inMemoryAttribution: vi.fn(), supabaseAttribution: vi.fn(),
}))

vi.mock('@/application/catalog/catalog-service', () => ({ CatalogService: class { constructor(...args: unknown[]) { mocks.catalog(...args) } } }))
vi.mock('@/application/catalog/supabase-scalable-catalog-service', () => ({ ScalableCatalogService: class { constructor(...args: unknown[]) { mocks.scalable(...args) } } }))
vi.mock('@/infrastructure/catalog/create-catalog-repository', () => ({ createCatalogRepository: mocks.catalogRepository }))
vi.mock('@/infrastructure/catalog/supabase-catalog-ranking-read-model', () => ({ SupabaseCatalogRankingReadModel: class { constructor(...args: unknown[]) { mocks.ranking(...args) } } }))
vi.mock('@/infrastructure/catalog/synthetic-catalog', () => ({ createSyntheticCatalogRepository: mocks.syntheticCatalog }))
vi.mock('@/application/affiliate/affiliate-redirect-service', () => ({ AffiliateRedirectService: class { constructor(...args: unknown[]) { mocks.redirect(...args) } } }))
vi.mock('@/infrastructure/affiliate/in-memory-affiliate-attribution-repository', () => ({ InMemoryAffiliateAttributionRepository: class { constructor(...args: unknown[]) { mocks.inMemoryAttribution(...args) } } }))
vi.mock('@/infrastructure/affiliate/supabase-affiliate-attribution-repository', () => ({ SupabaseAffiliateAttributionRepository: class { constructor(...args: unknown[]) { mocks.supabaseAttribution(...args) } } }))

import { createStorefrontCatalogService } from './create-storefront-catalog-service'
import { createAffiliateRedirectService } from '@/infrastructure/affiliate/create-affiliate-redirect-service'

beforeEach(() => {
  vi.stubEnv('WINKELNU_PUBLIC_CATALOG_ENABLED', undefined)
  vi.stubEnv('CATALOG_PERSISTENCE', 'supabase')
  vi.clearAllMocks()
})
afterEach(() => vi.unstubAllEnvs())

describe('public service factories', () => {
  it.each([
    { release: undefined, persistence: 'supabase' },
    { release: 'false', persistence: 'supabase' },
    { release: 'true', persistence: 'memory' },
  ])('prevents catalog reads and outbound attribution when release=$release persistence=$persistence', async ({ release, persistence }) => {
    vi.stubEnv('WINKELNU_PUBLIC_CATALOG_ENABLED', release)
    vi.stubEnv('CATALOG_PERSISTENCE', persistence)
    await expect(createStorefrontCatalogService()).rejects.toBeInstanceOf(PublicCatalogUnavailableError)
    await expect(createAffiliateRedirectService()).rejects.toBeInstanceOf(PublicCatalogUnavailableError)
    for (const dependency of Object.values(mocks)) expect(dependency).not.toHaveBeenCalled()
  })

  it('uses persistent implementations only after explicit release', async () => {
    vi.stubEnv('WINKELNU_PUBLIC_CATALOG_ENABLED', 'true')
    mocks.catalogRepository.mockReturnValue({})
    await createStorefrontCatalogService()
    await createAffiliateRedirectService()
    expect(mocks.catalogRepository).toHaveBeenCalledOnce()
    expect(mocks.scalable).toHaveBeenCalledOnce()
    expect(mocks.supabaseAttribution).toHaveBeenCalledOnce()
    expect(mocks.redirect).toHaveBeenCalledOnce()
    expect(mocks.syntheticCatalog).not.toHaveBeenCalled()
    expect(mocks.inMemoryAttribution).not.toHaveBeenCalled()
  })
})

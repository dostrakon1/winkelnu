import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PublicCatalogUnavailableError } from '@/application/catalog/public-catalog-release'

const mocks = vi.hoisted(() => ({
  catalogRepository: vi.fn(),
  curatedCatalog: vi.fn(),
  syntheticCatalog: vi.fn(),
  ranking: vi.fn(),
  scalable: vi.fn(),
  catalog: vi.fn(),
  redirect: vi.fn(),
  inMemoryAttribution: vi.fn(),
  supabaseAttribution: vi.fn(),
}))

vi.mock('@/application/catalog/catalog-service', () => ({
  CatalogService: class {
    constructor(...args: unknown[]) { mocks.catalog(...args) }
  },
}))
vi.mock('@/application/catalog/supabase-scalable-catalog-service', () => ({
  ScalableCatalogService: class {
    constructor(...args: unknown[]) { mocks.scalable(...args) }
  },
}))
vi.mock('@/infrastructure/catalog/create-catalog-repository', () => ({ createCatalogRepository: mocks.catalogRepository }))
vi.mock('@/infrastructure/catalog/curated-catalog', () => ({ createCuratedCatalogRepository: mocks.curatedCatalog }))
vi.mock('@/infrastructure/catalog/supabase-catalog-ranking-read-model', () => ({
  SupabaseCatalogRankingReadModel: class {
    constructor(...args: unknown[]) { mocks.ranking(...args) }
  },
}))
vi.mock('@/infrastructure/catalog/synthetic-catalog', () => ({ createSyntheticCatalogRepository: mocks.syntheticCatalog }))
vi.mock('@/application/affiliate/affiliate-redirect-service', () => ({
  AffiliateRedirectService: class {
    constructor(...args: unknown[]) { mocks.redirect(...args) }
  },
}))
vi.mock('@/infrastructure/affiliate/in-memory-affiliate-attribution-repository', () => ({
  InMemoryAffiliateAttributionRepository: class {
    constructor(...args: unknown[]) { mocks.inMemoryAttribution(...args) }
  },
}))
vi.mock('@/infrastructure/affiliate/supabase-affiliate-attribution-repository', () => ({
  SupabaseAffiliateAttributionRepository: class {
    constructor(...args: unknown[]) { mocks.supabaseAttribution(...args) }
  },
}))

import { createStorefrontCatalogService } from './create-storefront-catalog-service'
import { createAffiliateRedirectService } from '@/infrastructure/affiliate/create-affiliate-redirect-service'

beforeEach(() => {
  vi.stubEnv('WINKELNU_PUBLIC_CATALOG_ENABLED', undefined)
  vi.stubEnv('WINKELNU_CURATED_CATALOG_ENABLED', undefined)
  vi.stubEnv('CATALOG_PERSISTENCE', 'supabase')
  vi.clearAllMocks()
  mocks.curatedCatalog.mockResolvedValue({ kind: 'curated' })
})
afterEach(() => vi.unstubAllEnvs())

describe('public service factories', () => {
  it.each([undefined, 'false'])(
    'falls back to curated product-only services when Supabase release=%s',
    async (release) => {
      vi.stubEnv('WINKELNU_PUBLIC_CATALOG_ENABLED', release)

      await createStorefrontCatalogService()
      await createAffiliateRedirectService()

      expect(mocks.curatedCatalog).toHaveBeenCalledTimes(2)
      expect(mocks.catalog).toHaveBeenCalledOnce()
      expect(mocks.inMemoryAttribution).toHaveBeenCalledOnce()
      expect(mocks.redirect).toHaveBeenCalledOnce()
      expect(mocks.catalogRepository).not.toHaveBeenCalled()
      expect(mocks.ranking).not.toHaveBeenCalled()
      expect(mocks.scalable).not.toHaveBeenCalled()
      expect(mocks.supabaseAttribution).not.toHaveBeenCalled()
      expect(mocks.syntheticCatalog).not.toHaveBeenCalled()
    },
  )

  it('keeps synthetic memory persistence closed even when the release flag is true', async () => {
    vi.stubEnv('WINKELNU_PUBLIC_CATALOG_ENABLED', 'true')
    vi.stubEnv('CATALOG_PERSISTENCE', 'memory')

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
    expect(mocks.ranking).toHaveBeenCalledOnce()
    expect(mocks.scalable).toHaveBeenCalledOnce()
    expect(mocks.supabaseAttribution).toHaveBeenCalledOnce()
    expect(mocks.redirect).toHaveBeenCalledOnce()
    expect(mocks.curatedCatalog).not.toHaveBeenCalled()
    expect(mocks.syntheticCatalog).not.toHaveBeenCalled()
    expect(mocks.inMemoryAttribution).not.toHaveBeenCalled()
  })
})

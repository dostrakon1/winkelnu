// Real merchant/affiliate data stays opt-in. A curated product-only catalog can be
// published before affiliate approval without exposing test offers or Supabase data.
// This module is intentionally dependency-free so it can also be used by src/proxy.ts.
export type PublicCatalogMode = 'curated' | 'supabase'

export type PublicCatalogEnvironment = {
  WINKELNU_PUBLIC_CATALOG_ENABLED?: string
  WINKELNU_CURATED_CATALOG_ENABLED?: string
  CATALOG_PERSISTENCE?: string
}

function runtimeEnvironment(): PublicCatalogEnvironment {
  return {
    WINKELNU_PUBLIC_CATALOG_ENABLED: process.env.WINKELNU_PUBLIC_CATALOG_ENABLED,
    WINKELNU_CURATED_CATALOG_ENABLED: process.env.WINKELNU_CURATED_CATALOG_ENABLED,
    CATALOG_PERSISTENCE: process.env.CATALOG_PERSISTENCE,
  }
}

export function getPublicCatalogMode(
  env: PublicCatalogEnvironment = runtimeEnvironment(),
): PublicCatalogMode | null {
  const persistence = env.CATALOG_PERSISTENCE ?? 'curated'

  // Synthetic in-memory data remains test/development-only and is never public.
  if (persistence === 'memory') return null

  // Real persistent commerce data still requires the existing explicit release gate.
  if (persistence === 'supabase' && env.WINKELNU_PUBLIC_CATALOG_ENABLED === 'true') {
    return 'supabase'
  }

  // Emergency kill switch for the pre-affiliate catalog.
  if (env.WINKELNU_CURATED_CATALOG_ENABLED === 'false') return null

  // While Supabase commerce has not been released, fail safely to the curated
  // product-only catalog instead of exposing persistent/test merchant data.
  if (persistence === 'curated' || persistence === 'supabase') return 'curated'

  return null
}

export function isPublicCatalogEnabled(env: PublicCatalogEnvironment = runtimeEnvironment()): boolean {
  return getPublicCatalogMode(env) !== null
}

export class PublicCatalogUnavailableError extends Error {
  constructor() {
    super('The public catalog is not enabled.')
    this.name = 'PublicCatalogUnavailableError'
  }
}

export function assertPublicCatalogEnabled(env?: PublicCatalogEnvironment): void {
  if (!isPublicCatalogEnabled(env)) throw new PublicCatalogUnavailableError()
}

export function isPublicCatalogPath(pathname: string): boolean {
  return /^\/(?:zoeken|categorie|product|vergelijken|uit)(?:\/|$)/.test(pathname)
}

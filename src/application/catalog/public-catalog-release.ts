// Public commerce is opt-in. Editorial publishing never activates test data.
// This module is intentionally dependency-free so it can also be used by proxy.ts.
export type PublicCatalogEnvironment = {
  WINKELNU_PUBLIC_CATALOG_ENABLED?: string
  CATALOG_PERSISTENCE?: string
}

export function isPublicCatalogEnabled(env: PublicCatalogEnvironment = process.env): boolean {
  return env.WINKELNU_PUBLIC_CATALOG_ENABLED === 'true' && env.CATALOG_PERSISTENCE === 'supabase'
}

export function isPublicCatalogPath(pathname: string): boolean {
  return /^\/(?:zoeken|categorie|product|uit)(?:\/|$)/.test(pathname)
}

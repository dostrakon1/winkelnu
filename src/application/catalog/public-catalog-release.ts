// Public commerce is opt-in. Editorial publishing never activates test data.
// This module is intentionally dependency-free so it can also be used by src/proxy.ts.
export type PublicCatalogEnvironment = {
  WINKELNU_PUBLIC_CATALOG_ENABLED?: string
  CATALOG_PERSISTENCE?: string
}

export function isPublicCatalogEnabled(
  env: PublicCatalogEnvironment = {
    WINKELNU_PUBLIC_CATALOG_ENABLED: process.env.WINKELNU_PUBLIC_CATALOG_ENABLED,
    CATALOG_PERSISTENCE: process.env.CATALOG_PERSISTENCE,
  },
): boolean {
  return env.WINKELNU_PUBLIC_CATALOG_ENABLED === 'true' && env.CATALOG_PERSISTENCE === 'supabase'
}

export class PublicCatalogUnavailableError extends Error {
  constructor() {
    super('The public catalog is not enabled.')
    this.name = 'PublicCatalogUnavailableError'
  }
}

// A second boundary prevents accidental direct service use from exposing data
// if a request does not pass through the Next.js proxy.
export function assertPublicCatalogEnabled(env?: PublicCatalogEnvironment): void {
  if (!isPublicCatalogEnabled(env)) throw new PublicCatalogUnavailableError()
}

export function isPublicCatalogPath(pathname: string): boolean {
  return /^\/(?:zoeken|categorie|product|uit)(?:\/|$)/.test(pathname)
}

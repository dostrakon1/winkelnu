'use server'

import { redirect } from 'next/navigation'

import { importFeed } from '@/application/catalog/import-feed'
import { operatorCan } from '@/application/auth/operator-authorization'
import { SupabaseAffiliateIntegrationRegistryRepository } from '@/infrastructure/affiliate/supabase-affiliate-integration-registry-repository'
import { SupabaseProductionCatalogRepository } from '@/infrastructure/catalog/supabase-production-catalog-repository'
import { RealisticPartnerFixtureAdapter } from '@/infrastructure/feeds/fixtures/realistic-partner-feed-adapter'
import { requireOperatorSession } from '@/infrastructure/operations/operator-session'

const merchant = {
  id: 'merchant:preview-fixture-shop',
  slug: 'preview-fixture-shop',
  name: 'Preview Fixture Shop',
  websiteUrl: 'https://merchant.example.invalid',
  isActive: true,
} as const

const sourceKey = 'preview-fixture-products'
const networkId = 'network:preview-fixture'
const integrationId = 'integration:preview-fixture-shop'

export async function runBoundedPreviewFixtureImport() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Bounded preview fixture import is only available in development mode.')
  }
  if (process.env.CATALOG_PERSISTENCE !== 'supabase') {
    throw new Error('Bounded preview fixture import requires CATALOG_PERSISTENCE=supabase.')
  }

  const operator = await requireOperatorSession()
  if (!operatorCan(operator.role, 'activate_partner')) {
    throw new Error('Owner permission is required for the bounded preview fixture import.')
  }

  const catalog = new SupabaseProductionCatalogRepository()
  const integrations = new SupabaseAffiliateIntegrationRegistryRepository()

  await catalog.upsertMerchant(merchant)
  await integrations.upsertNetwork({
    id: networkId,
    slug: 'preview-fixture-network',
    name: 'Preview Fixture Network',
    kind: 'network',
    isActive: true,
  })
  await integrations.upsertIntegration({
    id: integrationId,
    merchantId: merchant.id,
    kind: 'network',
    networkId,
    status: 'active',
    trackingConfig: {},
  })
  await integrations.linkFeedSource({
    sourceKey,
    merchantId: merchant.id,
    sourceType: 'json',
    integrationId,
    isActive: true,
  })

  const result = await importFeed({
    adapter: new RealisticPartnerFixtureAdapter(sourceKey),
    repository: catalog,
    merchant,
    correlationId: `preview-fixture:${globalThis.crypto.randomUUID()}`,
    traversalLimits: { maxPages: 2, maxRecords: 4 },
  })

  const params = new URLSearchParams({
    ok: '1',
    imported: String(result.imported),
    rejected: String(result.rejected),
    reviews: String(result.reviewRequired),
    status: result.importRun.status,
  })
  redirect(`/intern/operations/preview-import?${params.toString()}`)
}

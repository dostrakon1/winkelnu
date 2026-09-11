import 'server-only'

import { ImportOrchestrationService } from '@/application/catalog/import-orchestration-service'
import { ImportWorkerService } from '@/application/catalog/import-worker-service'
import { ProductionImportCompositionService } from '@/application/catalog/production-import-composition'
import { SupabaseAffiliateIntegrationRegistryRepository } from '@/infrastructure/affiliate/supabase-affiliate-integration-registry-repository'
import { SupabaseDueFeedDiscoveryRepository } from '@/infrastructure/catalog/supabase-due-feed-discovery-repository'
import { SupabaseImportOrchestrationRepository } from '@/infrastructure/catalog/supabase-import-orchestration-repository'
import { SupabaseProductionCatalogRepository } from '@/infrastructure/catalog/supabase-production-catalog-repository'
import { SupabaseTaxonomyDatabaseBridge } from '@/infrastructure/catalog/supabase-taxonomy-database-bridge'
import { registerDaisyconJsonAdapter, mapDaisyconStandardProductRecord } from '@/infrastructure/feeds/daisycon/register-daisycon-adapter'
import { PartnerFeedAdapterRegistry } from '@/infrastructure/feeds/partner-adapter-registry'

export function createProductionImportWorker() {
  if (process.env.CATALOG_PERSISTENCE !== 'supabase') throw new Error('Production import worker requires CATALOG_PERSISTENCE=supabase.')

  const catalog = new SupabaseProductionCatalogRepository()
  const taxonomyBridge = new SupabaseTaxonomyDatabaseBridge()
  const affiliateRegistry = new SupabaseAffiliateIntegrationRegistryRepository()
  const orchestrationRepository = new SupabaseImportOrchestrationRepository()
  const discovery = new SupabaseDueFeedDiscoveryRepository()
  const adapters = new PartnerFeedAdapterRegistry()
  registerDaisyconJsonAdapter(adapters, { mapRecord: mapDaisyconStandardProductRecord })

  const composition = new ProductionImportCompositionService(affiliateRegistry, adapters, catalog, taxonomyBridge)
  const orchestration = new ImportOrchestrationService(orchestrationRepository)
  const worker = new ImportWorkerService(discovery, orchestration)

  return {
    runBatch(input: { owner: string; correlationId: string; limit?: number; now?: () => string; successDelayMs?: number }) {
      return worker.runBatch({
        owner: input.owner,
        limit: input.limit,
        now: input.now,
        successDelayMs: input.successDelayMs,
        execute: (source, control) => composition.execute(source, { now: input.now, correlationId: input.correlationId, control }),
      })
    },
  }
}

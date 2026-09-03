import 'server-only'

import { ImportOrchestrationService } from '@/application/catalog/import-orchestration-service'
import { ImportWorkerService } from '@/application/catalog/import-worker-service'
import { ProductionImportCompositionService } from '@/application/catalog/production-import-composition'
import { SupabaseAffiliateIntegrationRegistryRepository } from '@/infrastructure/affiliate/supabase-affiliate-integration-registry-repository'
import { SupabaseCatalogRepository } from '@/infrastructure/catalog/supabase-catalog-repository'
import { SupabaseDueFeedDiscoveryRepository } from '@/infrastructure/catalog/supabase-due-feed-discovery-repository'
import { SupabaseImportOrchestrationRepository } from '@/infrastructure/catalog/supabase-import-orchestration-repository'
import { registerDaisyconJsonAdapter, mapDaisyconStandardProductRecord } from '@/infrastructure/feeds/daisycon/register-daisycon-adapter'
import { PartnerFeedAdapterRegistry } from '@/infrastructure/feeds/partner-adapter-registry'

export function createProductionImportWorker() {
  if (process.env.CATALOG_PERSISTENCE !== 'supabase') {
    throw new Error('Production import worker requires CATALOG_PERSISTENCE=supabase.')
  }

  const catalog = new SupabaseCatalogRepository()
  const affiliateRegistry = new SupabaseAffiliateIntegrationRegistryRepository()
  const orchestrationRepository = new SupabaseImportOrchestrationRepository()
  const discovery = new SupabaseDueFeedDiscoveryRepository()
  const adapters = new PartnerFeedAdapterRegistry()

  registerDaisyconJsonAdapter(adapters, { mapRecord: mapDaisyconStandardProductRecord })

  const composition = new ProductionImportCompositionService(affiliateRegistry, adapters, catalog)
  const orchestration = new ImportOrchestrationService(orchestrationRepository)
  const worker = new ImportWorkerService(discovery, orchestration)

  return {
    runBatch(input: { owner: string; limit?: number; now?: () => string; successDelayMs?: number }) {
      return worker.runBatch({
        owner: input.owner,
        limit: input.limit,
        now: input.now,
        successDelayMs: input.successDelayMs,
        execute: (source) => composition.execute(source, { now: input.now }),
      })
    },
  }
}

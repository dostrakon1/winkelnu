import type { AffiliateIntegrationRegistryRepository } from '@/application/affiliate/integration-registry-ports'
import { importFeed, type ImportFeedResult } from '@/application/catalog/import-feed'
import type { ImportLeaseControl } from '@/application/catalog/import-orchestration-service'
import type { CatalogReadRepository, CatalogWriteRepository } from '@/application/catalog/ports'
import {
  createTaxonomyExternalKeyResolver,
  type TaxonomyDatabaseBridge,
} from '@/application/catalog/taxonomy-database-bridge'
import type { DueFeedSource } from '@/domain/catalog/import-worker'
import type { PartnerFeedAdapterRegistry } from '@/infrastructure/feeds/partner-adapter-registry'
import { resolvePartnerFeedAdapter } from '@/infrastructure/feeds/resolve-partner-feed-adapter'

export class ProductionImportCompositionService {
  constructor(
    private readonly affiliateRegistry: AffiliateIntegrationRegistryRepository,
    private readonly adapters: PartnerFeedAdapterRegistry,
    private readonly catalog: CatalogReadRepository & CatalogWriteRepository,
    private readonly taxonomyBridge?: TaxonomyDatabaseBridge,
  ) {}

  async execute(source: DueFeedSource, input?: { now?: () => string; correlationId?: string; control?: ImportLeaseControl }): Promise<ImportFeedResult> {
    const merchant = (await this.catalog.listActiveMerchants()).find((item) => item.id === source.merchantId)
    if (!merchant) throw new Error(`Active merchant not found for import source: ${source.merchantId}`)

    const adapter = await resolvePartnerFeedAdapter({ sourceKey: source.sourceKey, merchantId: source.merchantId, repository: this.affiliateRegistry, adapters: this.adapters })
    if (!adapter) throw new Error(`No active partner feed adapter context for ${source.merchantId}/${source.sourceKey}`)

    await this.taxonomyBridge?.ensureSynced()

    return importFeed({
      adapter,
      repository: this.catalog,
      merchant,
      categoryIdResolver: createTaxonomyExternalKeyResolver(),
      now: input?.now,
      correlationId: input?.correlationId,
      onPageFetched: input?.control?.heartbeat,
    })
  }
}

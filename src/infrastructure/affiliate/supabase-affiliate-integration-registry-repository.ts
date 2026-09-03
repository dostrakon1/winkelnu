import 'server-only'

import type { AffiliateIntegrationRegistryRepository } from '@/application/affiliate/integration-registry-ports'
import type {
  AffiliateFeedSourceRegistration,
  AffiliateNetwork,
  MerchantAffiliateIntegration,
} from '@/domain/affiliate/integration-registry'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

function fail(error: { message: string } | null, context: string): void {
  if (error) throw new Error(`${context}: ${error.message}`)
}

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

function trackingConfig(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  )
}

export class SupabaseAffiliateIntegrationRegistryRepository implements AffiliateIntegrationRegistryRepository {
  private readonly db = createSupabaseServerClient()

  private async merchantUuid(externalKey: string): Promise<string> {
    const { data, error } = await this.db.from('merchants').select('id').eq('external_key', externalKey).maybeSingle()
    fail(error, `Resolve merchant ${externalKey}`)
    if (!data) throw new Error(`Resolve merchant ${externalKey}: merchant does not exist.`)
    return data.id
  }

  private async networkUuid(externalKey: string): Promise<string> {
    const { data, error } = await this.db.from('affiliate_networks').select('id').eq('external_key', externalKey).maybeSingle()
    fail(error, `Resolve affiliate network ${externalKey}`)
    if (!data) throw new Error(`Resolve affiliate network ${externalKey}: network does not exist.`)
    return data.id
  }

  private async integrationUuid(externalKey: string): Promise<string> {
    const { data, error } = await this.db.from('merchant_affiliate_integrations').select('id').eq('external_key', externalKey).maybeSingle()
    fail(error, `Resolve affiliate integration ${externalKey}`)
    if (!data) throw new Error(`Resolve affiliate integration ${externalKey}: integration does not exist.`)
    return data.id
  }

  async listNetworks(): Promise<AffiliateNetwork[]> {
    const { data, error } = await this.db.from('affiliate_networks').select('*').order('name')
    fail(error, 'List affiliate networks')
    return (data ?? []).map((row) => ({
      id: row.external_key,
      slug: row.slug,
      name: row.name,
      kind: row.kind,
      websiteUrl: row.website_url ?? undefined,
      isActive: row.is_active,
    }))
  }

  async getNetwork(networkId: string): Promise<AffiliateNetwork | null> {
    const { data, error } = await this.db.from('affiliate_networks').select('*').eq('external_key', networkId).maybeSingle()
    fail(error, `Get affiliate network ${networkId}`)
    if (!data) return null
    return {
      id: data.external_key,
      slug: data.slug,
      name: data.name,
      kind: data.kind,
      websiteUrl: data.website_url ?? undefined,
      isActive: data.is_active,
    }
  }

  async listMerchantIntegrations(merchantId: string): Promise<MerchantAffiliateIntegration[]> {
    const merchantUuid = await this.merchantUuid(merchantId)
    const { data, error } = await this.db
      .from('merchant_affiliate_integrations')
      .select('*, affiliate_networks(external_key)')
      .eq('merchant_id', merchantUuid)
      .order('created_at')
    fail(error, `List affiliate integrations for ${merchantId}`)

    return (data ?? []).map((row) => ({
      id: row.external_key,
      merchantId,
      kind: row.kind,
      networkId: firstRelation(row.affiliate_networks)?.external_key ?? undefined,
      programIdentifier: row.program_identifier ?? undefined,
      status: row.status,
      secretRef: row.secret_ref ?? undefined,
      trackingConfig: trackingConfig(row.tracking_config),
    }))
  }

  async getIntegration(integrationId: string): Promise<MerchantAffiliateIntegration | null> {
    const { data, error } = await this.db
      .from('merchant_affiliate_integrations')
      .select('*, merchants(external_key), affiliate_networks(external_key)')
      .eq('external_key', integrationId)
      .maybeSingle()
    fail(error, `Get affiliate integration ${integrationId}`)
    if (!data) return null

    return {
      id: data.external_key,
      merchantId: firstRelation(data.merchants)?.external_key ?? '',
      kind: data.kind,
      networkId: firstRelation(data.affiliate_networks)?.external_key ?? undefined,
      programIdentifier: data.program_identifier ?? undefined,
      status: data.status,
      secretRef: data.secret_ref ?? undefined,
      trackingConfig: trackingConfig(data.tracking_config),
    }
  }

  async getFeedSource(sourceKey: string, merchantId: string): Promise<AffiliateFeedSourceRegistration | null> {
    const merchantUuid = await this.merchantUuid(merchantId)
    const { data, error } = await this.db
      .from('feed_sources')
      .select('source_key, source_type, is_active, merchant_affiliate_integrations(external_key)')
      .eq('merchant_id', merchantUuid)
      .eq('source_key', sourceKey)
      .maybeSingle()
    fail(error, `Get feed source ${merchantId}/${sourceKey}`)
    if (!data) return null

    return {
      sourceKey: data.source_key,
      merchantId,
      sourceType: data.source_type,
      integrationId: firstRelation(data.merchant_affiliate_integrations)?.external_key ?? undefined,
      isActive: data.is_active,
    }
  }

  async upsertNetwork(network: AffiliateNetwork): Promise<void> {
    const { error } = await this.db.from('affiliate_networks').upsert({
      external_key: network.id,
      slug: network.slug,
      name: network.name,
      kind: network.kind,
      website_url: network.websiteUrl ?? null,
      is_active: network.isActive,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'external_key' })
    fail(error, `Upsert affiliate network ${network.id}`)
  }

  async upsertIntegration(integration: MerchantAffiliateIntegration): Promise<void> {
    const [merchantId, affiliateNetworkId] = await Promise.all([
      this.merchantUuid(integration.merchantId),
      integration.networkId ? this.networkUuid(integration.networkId) : Promise.resolve(null),
    ])

    const { error } = await this.db.from('merchant_affiliate_integrations').upsert({
      external_key: integration.id,
      merchant_id: merchantId,
      affiliate_network_id: affiliateNetworkId,
      kind: integration.kind,
      program_identifier: integration.programIdentifier ?? null,
      status: integration.status,
      secret_ref: integration.secretRef ?? null,
      tracking_config: integration.trackingConfig,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'external_key' })
    fail(error, `Upsert affiliate integration ${integration.id}`)
  }

  async linkFeedSource(registration: AffiliateFeedSourceRegistration): Promise<void> {
    const [merchantId, integrationId] = await Promise.all([
      this.merchantUuid(registration.merchantId),
      registration.integrationId ? this.integrationUuid(registration.integrationId) : Promise.resolve(null),
    ])

    const { error } = await this.db.from('feed_sources').upsert({
      merchant_id: merchantId,
      source_key: registration.sourceKey,
      source_type: registration.sourceType,
      affiliate_integration_id: integrationId,
      is_active: registration.isActive,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'merchant_id,source_key' })
    fail(error, `Link feed source ${registration.merchantId}/${registration.sourceKey}`)
  }
}

import { describe, expect, it } from 'vitest'
import { PartnerFeedAdapterRegistry, getPartnerFeedAdapterKey } from '@/infrastructure/feeds/partner-adapter-registry'
import { SyntheticFeedAdapter } from '@/infrastructure/feeds/synthetic/synthetic-feed-adapter'

const resolved = {
  source: { sourceKey: 'feed-a', merchantId: 'merchant:a', sourceType: 'api' as const, integrationId: 'integration:a', isActive: true },
  integration: { id: 'integration:a', merchantId: 'merchant:a', kind: 'network' as const, networkId: 'network:demo', status: 'active' as const, trackingConfig: {}, secretRef: 'env:PARTNER_TOKEN' },
  network: { id: 'network:demo', slug: 'demo-network', name: 'Demo Network', kind: 'network' as const, isActive: true },
}

describe('PartnerFeedAdapterRegistry', () => {
  it('uses network slug and source type as the adapter key', () => {
    expect(getPartnerFeedAdapterKey(resolved)).toBe('demo-network:api')
  })

  it('creates the registered adapter and resolves the credential only in infrastructure', () => {
    process.env.PARTNER_TOKEN = 'test-token'
    const registry = new PartnerFeedAdapterRegistry()
    let receivedCredential: string | undefined
    registry.register('demo-network:api', ({ credential }) => {
      receivedCredential = credential
      return new SyntheticFeedAdapter()
    })

    const adapter = registry.create(resolved)
    expect(adapter).toBeInstanceOf(SyntheticFeedAdapter)
    expect(receivedCredential).toBe('test-token')
    delete process.env.PARTNER_TOKEN
  })

  it('fails when no matching adapter has been registered', () => {
    const registry = new PartnerFeedAdapterRegistry()
    expect(() => registry.create(resolved)).toThrow('No feed adapter registered')
  })
})

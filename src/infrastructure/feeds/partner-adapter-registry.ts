import type { ResolvedPartnerFeedSource } from '@/application/affiliate/feed-source-resolver'
import type { FeedAdapter } from './adapter'

export type PartnerFeedAdapterFactory = (context: {
  resolved: ResolvedPartnerFeedSource
  credential?: string
}) => FeedAdapter

function adapterKey(resolved: ResolvedPartnerFeedSource): string {
  const sourceType = resolved.source.sourceType
  if (resolved.network) return `${resolved.network.slug}:${sourceType}`
  if (resolved.integration?.kind === 'direct') return `direct:${sourceType}`
  return `generic:${sourceType}`
}

function resolveCredential(secretRef?: string): string | undefined {
  if (!secretRef) return undefined
  const prefix = 'env:'
  if (!secretRef.startsWith(prefix)) throw new Error('Unsupported secret reference format.')
  const envName = secretRef.slice(prefix.length)
  const value = process.env[envName]
  if (!value) throw new Error(`Missing required partner credential: ${envName}`)
  return value
}

export class PartnerFeedAdapterRegistry {
  private readonly factories = new Map<string, PartnerFeedAdapterFactory>()

  register(key: string, factory: PartnerFeedAdapterFactory): void {
    if (!key.trim()) throw new Error('Adapter key is required.')
    if (this.factories.has(key)) throw new Error(`Adapter already registered: ${key}`)
    this.factories.set(key, factory)
  }

  create(resolved: ResolvedPartnerFeedSource): FeedAdapter {
    const key = adapterKey(resolved)
    const factory = this.factories.get(key)
    if (!factory) throw new Error(`No feed adapter registered for ${key}`)

    return factory({
      resolved,
      credential: resolveCredential(resolved.integration?.secretRef),
    })
  }
}

export function getPartnerFeedAdapterKey(resolved: ResolvedPartnerFeedSource): string {
  return adapterKey(resolved)
}

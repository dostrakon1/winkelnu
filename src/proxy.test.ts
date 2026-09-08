import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

const auth = vi.hoisted(() => vi.fn())
vi.mock('@/infrastructure/supabase/auth-proxy', () => ({ updateSupabaseAuthSession: auth }))

import { config, proxy } from './proxy'

beforeEach(() => {
  vi.stubEnv('WINKELNU_PUBLIC_CATALOG_ENABLED', undefined)
  vi.stubEnv('CATALOG_PERSISTENCE', 'supabase')
  vi.clearAllMocks()
  auth.mockResolvedValue(NextResponse.next())
})

afterEach(() => vi.unstubAllEnvs())

const request = (path: string, method = 'GET') => new NextRequest(`https://winkelnu.nl${path}`, { method })

describe('public request boundary', () => {
  it('is discoverable beside src/app with no duplicate root proxy', () => {
    expect(existsSync(resolve(process.cwd(), 'src/proxy.ts'))).toBe(true)
    expect(existsSync(resolve(process.cwd(), 'proxy.ts'))).toBe(false)
    expect(config.matcher).toContain('/intern/:path*')
    for (const route of ['zoeken', 'categorie', 'product', 'uit']) expect(config.matcher).toContain(`/${route}/:path*`)
  })

  it.each(['/zoeken', '/zoeken/', '/categorie/test', '/product/test', '/uit/test'])('blocks %s before public release', async (path) => {
    const response = await proxy(request(path))
    expect(response.status).toBe(503)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow')
    expect(response.headers.get('x-middleware-rewrite')).toBe('https://winkelnu.nl/aanbieding-niet-beschikbaar')
    expect(auth).not.toHaveBeenCalled()
  })

  it('blocks non-GET requests without passing them to a page or repository', async () => {
    const response = await proxy(request('/uit/test', 'POST'))
    expect(response.status).toBe(503)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow')
    expect(await response.text()).toContain('niet beschikbaar')
  })

  it('keeps editorial routes open and delegates internal authentication', async () => {
    const editorial = await proxy(request('/koopgidsen'))
    expect(editorial.headers.get('x-middleware-next')).toBe('1')
    await proxy(request('/intern/operations'))
    expect(auth).toHaveBeenCalledOnce()
  })

  it('opens only with both explicit release settings', async () => {
    vi.stubEnv('WINKELNU_PUBLIC_CATALOG_ENABLED', 'true')
    const response = await proxy(request('/zoeken'))
    expect(response.headers.get('x-middleware-next')).toBe('1')
  })
})

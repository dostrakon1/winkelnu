import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { isPublicCatalogEnabled, isPublicCatalogPath } from '@/application/catalog/public-catalog-release'
import { updateSupabaseAuthSession } from '@/infrastructure/supabase/auth-proxy'

// This file must live beside src/app so Next.js discovers the request boundary.
export async function proxy(request: NextRequest) {
  if (isPublicCatalogPath(request.nextUrl.pathname) && !isPublicCatalogEnabled()) {
    const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new NextResponse('De productcatalogus is nog niet beschikbaar.', { status: 503, headers })
    }
    return NextResponse.rewrite(new URL('/aanbieding-niet-beschikbaar', request.url), { status: 503, headers })
  }
  if (request.nextUrl.pathname === '/intern' || request.nextUrl.pathname.startsWith('/intern/')) {
    return updateSupabaseAuthSession(request)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/intern/:path*',
    '/zoeken/:path*',
    '/categorie/:path*',
    '/product/:path*',
    '/uit/:path*',
  ],
}

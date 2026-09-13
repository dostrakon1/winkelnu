import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { recoverGiftListOwnerAccess } from '@/application/gifting/standalone-gift-lists'

function privateRedirect(url: URL): NextResponse {
  const response = NextResponse.redirect(url, 303)
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Referrer-Policy', 'no-referrer')
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  return response
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const shareCode = request.nextUrl.searchParams.get('lijst') ?? ''

  try {
    const list = await recoverGiftListOwnerAccess(token, shareCode)
    if (!list) {
      return privateRedirect(new URL('/lootje-lijstje?toegang=ongeldig', request.url))
    }

    return privateRedirect(
      new URL(`/lootje-lijstje/lijstje/${encodeURIComponent(shareCode)}/bewerken?toegang=hersteld`, request.url),
    )
  } catch {
    return privateRedirect(new URL('/lootje-lijstje?toegang=ongeldig', request.url))
  }
}

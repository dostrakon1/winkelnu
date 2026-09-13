import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { recoverGiftGroupAccess } from '@/application/gifting/gift-group-recovery'
import { isGiftingEnabled } from '@/application/gifting/gifting-release'
import { recoverGiftListOwnerAccess } from '@/application/gifting/standalone-gift-lists'

function privateHeaders(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Referrer-Policy', 'no-referrer')
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  return response
}

function privateRedirect(url: URL): NextResponse {
  return privateHeaders(NextResponse.redirect(url, 303))
}

function invalidRedirect(request: NextRequest): NextResponse {
  return privateRedirect(new URL('/lootje-lijstje?toegang=ongeldig', request.url))
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  if (!isGiftingEnabled()) {
    return privateHeaders(new NextResponse('Not found', { status: 404 }))
  }

  const { token } = await params
  const shareCode = request.nextUrl.searchParams.get('lijst') ?? ''
  const groupCode = request.nextUrl.searchParams.get('groep') ?? ''

  if (Boolean(shareCode) === Boolean(groupCode)) return invalidRedirect(request)

  try {
    if (shareCode) {
      const list = await recoverGiftListOwnerAccess(token, shareCode)
      if (!list) return invalidRedirect(request)
      return privateRedirect(
        new URL(`/lootje-lijstje/lijstje/${encodeURIComponent(shareCode)}/bewerken?toegang=hersteld`, request.url),
      )
    }

    const recovered = await recoverGiftGroupAccess(token, groupCode)
    if (!recovered) return invalidRedirect(request)

    const suffix = recovered === 'organizer' ? 'beheer' : 'mijn'
    return privateRedirect(
      new URL(`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/${suffix}?toegang=hersteld`, request.url),
    )
  } catch {
    return invalidRedirect(request)
  }
}

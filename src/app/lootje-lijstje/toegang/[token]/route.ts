import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { recoverGiftListOwnerAccess } from '@/application/gifting/standalone-gift-lists'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const shareCode = request.nextUrl.searchParams.get('lijst') ?? ''

  try {
    const list = await recoverGiftListOwnerAccess(token, shareCode)
    if (!list) {
      return NextResponse.redirect(new URL('/lootje-lijstje?toegang=ongeldig', request.url), 303)
    }

    return NextResponse.redirect(
      new URL(`/lootje-lijstje/lijstje/${encodeURIComponent(shareCode)}/bewerken?toegang=hersteld`, request.url),
      303,
    )
  } catch {
    return NextResponse.redirect(new URL('/lootje-lijstje?toegang=ongeldig', request.url), 303)
  }
}

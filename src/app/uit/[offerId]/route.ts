import { NextRequest, NextResponse } from 'next/server'
import { createAffiliateRedirectService } from '@/infrastructure/affiliate/create-affiliate-redirect-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> },
) {
  const { offerId } = await params
  const service = await createAffiliateRedirectService()
  const sourcePath = request.nextUrl.searchParams.get('from') ?? undefined
  const decision = await service.resolve({ offerId, sourcePath })

  if (!decision.ok) {
    return NextResponse.redirect(new URL('/aanbieding-niet-beschikbaar', request.url), 302)
  }

  return NextResponse.redirect(decision.destination, 302)
}

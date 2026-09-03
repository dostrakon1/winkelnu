import { PartnerOperationsReadService } from '@/application/affiliate/partner-operations-read-model'
import { SupabasePartnerOperationsReadRepository } from '@/infrastructure/affiliate/supabase-partner-operations-read-repository'
import { isAuthorizedPartnerOperationsRead } from '@/infrastructure/operations/partner-operations-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function requireSecret(): string {
  const value = process.env.WINKELNU_OPS_READ_SECRET ?? process.env.CRON_SECRET
  if (!value) throw new Error('Missing WINKELNU_OPS_READ_SECRET or CRON_SECRET.')
  return value
}

export async function GET(request: Request) {
  const secret = requireSecret()
  if (!isAuthorizedPartnerOperationsRead(request.headers.get('authorization'), secret)) {
    return Response.json({ ok: false, error: 'Unauthorized' }, {
      status: 401,
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  if (process.env.CATALOG_PERSISTENCE !== 'supabase') {
    return Response.json({ ok: false, error: 'Partner operations requires CATALOG_PERSISTENCE=supabase.' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  const service = new PartnerOperationsReadService(new SupabasePartnerOperationsReadRepository())
  const portfolio = await service.read()
  return Response.json({ ok: true, portfolio }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}

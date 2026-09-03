import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { buildOperationsDashboard } from '@/application/affiliate/operations-dashboard'
import { PartnerOperationsReadService } from '@/application/affiliate/partner-operations-read-model'
import { InternalOperationsDashboard } from '@/components/internal/operations-dashboard'
import { SupabasePartnerOperationsReadRepository } from '@/infrastructure/affiliate/supabase-partner-operations-read-repository'
import { isAuthorizedPartnerOperationsRead } from '@/infrastructure/operations/partner-operations-auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Internal Operations',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

function requireSecret(): string {
  const value = process.env.WINKELNU_OPS_READ_SECRET ?? process.env.CRON_SECRET
  if (!value) throw new Error('Missing WINKELNU_OPS_READ_SECRET or CRON_SECRET.')
  return value
}

export default async function InternalOperationsPage() {
  const requestHeaders = await headers()
  const secret = requireSecret()

  if (!isAuthorizedPartnerOperationsRead(requestHeaders.get('authorization'), secret)) {
    notFound()
  }

  if (process.env.CATALOG_PERSISTENCE !== 'supabase') {
    throw new Error('Internal operations requires CATALOG_PERSISTENCE=supabase.')
  }

  const service = new PartnerOperationsReadService(new SupabasePartnerOperationsReadRepository())
  const model = await service.read()
  const dashboard = buildOperationsDashboard(model)

  return <InternalOperationsDashboard dashboard={dashboard} />
}

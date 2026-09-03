import type { Metadata } from 'next'

import { buildOperationsDashboard } from '@/application/affiliate/operations-dashboard'
import { PartnerOperationsReadService } from '@/application/affiliate/partner-operations-read-model'
import { InternalOperationsDashboard } from '@/components/internal/operations-dashboard'
import { SupabasePartnerOperationsReadRepository } from '@/infrastructure/affiliate/supabase-partner-operations-read-repository'
import { requireOperatorSession } from '@/infrastructure/operations/operator-session'
import { signOutOperator } from '@/app/intern/login/actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Internal Operations',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default async function InternalOperationsPage() {
  const operator = await requireOperatorSession()

  if (process.env.CATALOG_PERSISTENCE !== 'supabase') {
    throw new Error('Internal operations requires CATALOG_PERSISTENCE=supabase.')
  }

  const service = new PartnerOperationsReadService(new SupabasePartnerOperationsReadRepository())
  const model = await service.read()
  const dashboard = buildOperationsDashboard(model)

  return (
    <InternalOperationsDashboard
      dashboard={dashboard}
      operatorEmail={operator.email}
      signOutAction={signOutOperator}
    />
  )
}

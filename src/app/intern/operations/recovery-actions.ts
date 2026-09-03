'use server'

import { revalidatePath } from 'next/cache'

import { FeedRecoveryService } from '@/application/operations/feed-recovery'
import { AuditedOperatorActionService } from '@/application/operations/operator-audit'
import { requireOperatorSession } from '@/infrastructure/operations/operator-session'
import { SupabaseFeedRecoveryRepository } from '@/infrastructure/operations/supabase-feed-recovery-repository'
import { SupabaseOperatorAuditRepository } from '@/infrastructure/operations/supabase-operator-audit-repository'

function readTarget(formData: FormData) {
  const merchantId = String(formData.get('merchantId') ?? '').trim()
  const sourceKey = String(formData.get('sourceKey') ?? '').trim()
  if (!merchantId || !sourceKey) throw new Error('Missing feed recovery target.')
  return { merchantId, sourceKey }
}

function service() {
  return new FeedRecoveryService(
    new SupabaseFeedRecoveryRepository(),
    new AuditedOperatorActionService(new SupabaseOperatorAuditRepository()),
  )
}

export async function retryFeed(formData: FormData): Promise<void> {
  const actor = await requireOperatorSession()
  await service().retry(actor, readTarget(formData))
  revalidatePath('/intern/operations')
}

export async function pauseFeed(formData: FormData): Promise<void> {
  const actor = await requireOperatorSession()
  await service().pause(actor, readTarget(formData))
  revalidatePath('/intern/operations')
}

export async function resumeFeed(formData: FormData): Promise<void> {
  const actor = await requireOperatorSession()
  await service().resume(actor, readTarget(formData))
  revalidatePath('/intern/operations')
}

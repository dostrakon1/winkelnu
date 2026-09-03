'use server'

import { revalidatePath } from 'next/cache'

import { FeedRecoveryService } from '@/application/operations/feed-recovery'
import { AuditedOperatorActionService } from '@/application/operations/operator-audit'
import { operatorRecoveryErrorMessage } from '@/application/operations/operator-facing-error'
import { IdempotentOperatorActionService } from '@/application/operations/operator-idempotency'
import { requireOperatorSession } from '@/infrastructure/operations/operator-session'
import { SupabaseFeedRecoveryRepository } from '@/infrastructure/operations/supabase-feed-recovery-repository'
import { SupabaseOperatorActionIdempotencyRepository } from '@/infrastructure/operations/supabase-operator-action-idempotency-repository'
import { SupabaseOperatorAuditRepository } from '@/infrastructure/operations/supabase-operator-audit-repository'

export type RecoveryActionState = {
  status: 'idle' | 'success' | 'duplicate' | 'error'
  message?: string
}

function readInput(formData: FormData) {
  const merchantId = String(formData.get('merchantId') ?? '').trim()
  const sourceKey = String(formData.get('sourceKey') ?? '').trim()
  const requestKey = String(formData.get('requestKey') ?? '').trim()
  if (!merchantId || !sourceKey || !requestKey) throw new Error('Missing feed recovery input.')
  return { target: { merchantId, sourceKey }, requestKey }
}

function service() {
  const audited = new AuditedOperatorActionService(new SupabaseOperatorAuditRepository())
  const idempotent = new IdempotentOperatorActionService(
    new SupabaseOperatorActionIdempotencyRepository(),
    audited,
  )
  return new FeedRecoveryService(new SupabaseFeedRecoveryRepository(), idempotent)
}

async function run(
  operation: 'retry' | 'pause' | 'resume',
  formData: FormData,
): Promise<RecoveryActionState> {
  try {
    const actor = await requireOperatorSession()
    const { target, requestKey } = readInput(formData)
    const recovery = service()
    const result = await recovery[operation](actor, target, requestKey)

    if (!result.executed) {
      return { status: 'duplicate', message: 'Deze actie is al verwerkt. Er is geen tweede wijziging uitgevoerd.' }
    }

    revalidatePath('/intern/operations')
    const label = operation === 'retry' ? 'Retry ingepland.' : operation === 'pause' ? 'Feed gepauzeerd.' : 'Feed hervat.'
    return { status: 'success', message: label }
  } catch (error) {
    return {
      status: 'error',
      message: operatorRecoveryErrorMessage(error),
    }
  }
}

export async function retryFeed(_previous: RecoveryActionState, formData: FormData): Promise<RecoveryActionState> {
  return run('retry', formData)
}

export async function pauseFeed(_previous: RecoveryActionState, formData: FormData): Promise<RecoveryActionState> {
  return run('pause', formData)
}

export async function resumeFeed(_previous: RecoveryActionState, formData: FormData): Promise<RecoveryActionState> {
  return run('resume', formData)
}

import 'server-only'

import type { OperatorActionIdempotencyRepository, OperatorActionOutcome } from '@/application/operations/operator-idempotency'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

export class SupabaseOperatorActionIdempotencyRepository implements OperatorActionIdempotencyRepository {
  private readonly db = createSupabaseServerClient()

  async tryClaim(input: {
    requestKey: string
    actorUserId: string
    action: string
    targetType: string
    targetId?: string
  }): Promise<boolean> {
    const { error } = await this.db.from('operator_action_requests').insert({
      request_key: input.requestKey,
      actor_user_id: input.actorUserId,
      action: input.action,
      target_type: input.targetType,
      target_id: input.targetId ?? null,
      status: 'in_progress',
    })

    if (!error) return true
    if (error.code === '23505') return false
    throw new Error(`Claim operator action request: ${error.message}`)
  }

  async complete(requestKey: string, outcome: OperatorActionOutcome, errorMessage?: string): Promise<void> {
    const { error } = await this.db
      .from('operator_action_requests')
      .update({
        status: outcome,
        error_message: errorMessage ?? null,
        completed_at: new Date().toISOString(),
      })
      .eq('request_key', requestKey)

    if (error) throw new Error(`Complete operator action request: ${error.message}`)
  }
}

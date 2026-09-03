import 'server-only'

import type { OperatorAuditEvent, OperatorAuditRepository } from '@/application/operations/operator-audit'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

export class SupabaseOperatorAuditRepository implements OperatorAuditRepository {
  private readonly db = createSupabaseServerClient()

  async append(event: OperatorAuditEvent): Promise<void> {
    const { error } = await this.db.from('operator_audit_events').insert({
      actor_user_id: event.actorUserId,
      actor_email: event.actorEmail,
      actor_role: event.actorRole,
      action: event.action,
      target_type: event.targetType,
      target_id: event.targetId ?? null,
      status: event.status,
      correlation_id: event.correlationId,
      metadata: event.metadata ?? {},
      error_message: event.errorMessage ?? null,
      occurred_at: event.occurredAt,
    })

    if (error) throw new Error(`Append operator audit event: ${error.message}`)
  }
}

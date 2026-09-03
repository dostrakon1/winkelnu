import 'server-only'

import type {
  OperatorActionHistoryItem,
  OperatorActionHistoryRepository,
  OperatorActionOutcome,
} from '@/application/operations/operator-action-history'
import type { OperatorRole } from '@/application/auth/operator-authorization'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

type AuditRow = {
  id: string
  actor_email: string
  actor_role: OperatorRole
  action: string
  target_type: string
  target_id: string | null
  status: OperatorActionOutcome
  metadata: Record<string, unknown> | null
  occurred_at: string
}

function readMetadataString(metadata: Record<string, unknown> | null, key: string): string | undefined {
  const value = metadata?.[key]
  return typeof value === 'string' && value.trim() ? value : undefined
}

export class SupabaseOperatorActionHistoryRepository implements OperatorActionHistoryRepository {
  private readonly db = createSupabaseServerClient()

  async listRecent(limit: number): Promise<OperatorActionHistoryItem[]> {
    const { data, error } = await this.db
      .from('operator_audit_events')
      .select('id, actor_email, actor_role, action, target_type, target_id, status, metadata, occurred_at')
      .in('status', ['succeeded', 'failed'])
      .order('occurred_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(`Read operator action history: ${error.message}`)

    return ((data ?? []) as AuditRow[]).map((row) => ({
      id: row.id,
      actorEmail: row.actor_email,
      actorRole: row.actor_role,
      action: row.action,
      targetType: row.target_type,
      targetId: row.target_id ?? undefined,
      merchantId: readMetadataString(row.metadata, 'merchantId'),
      sourceKey: readMetadataString(row.metadata, 'sourceKey'),
      outcome: row.status,
      occurredAt: row.occurred_at,
    }))
  }
}

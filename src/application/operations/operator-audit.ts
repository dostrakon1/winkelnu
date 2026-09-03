import type { OperatorPermission, OperatorRole } from '@/application/auth/operator-authorization'
import { operatorCan } from '@/application/auth/operator-authorization'

export type OperatorAuditStatus = 'attempted' | 'succeeded' | 'failed'

export type OperatorAuditEvent = {
  actorUserId: string
  actorEmail: string
  actorRole: OperatorRole
  action: string
  targetType: string
  targetId?: string
  status: OperatorAuditStatus
  correlationId: string
  metadata?: Record<string, unknown>
  errorMessage?: string
  occurredAt: string
}

export interface OperatorAuditRepository {
  append(event: OperatorAuditEvent): Promise<void>
}

export type AuditedOperatorActionInput<T> = {
  actor: { id: string; email: string; role: OperatorRole }
  permission: OperatorPermission
  action: string
  targetType: string
  targetId?: string
  metadata?: Record<string, unknown>
  execute: () => Promise<T>
}

export class AuditedOperatorActionService {
  constructor(
    private readonly audit: OperatorAuditRepository,
    private readonly clock: () => string = () => new Date().toISOString(),
    private readonly id: () => string = () => globalThis.crypto.randomUUID(),
  ) {}

  async run<T>(input: AuditedOperatorActionInput<T>): Promise<T> {
    if (!operatorCan(input.actor.role, input.permission)) {
      throw new Error(`Operator role ${input.actor.role} is not allowed to ${input.permission}.`)
    }

    const correlationId = `operator:${this.id()}`
    const base = {
      actorUserId: input.actor.id,
      actorEmail: input.actor.email,
      actorRole: input.actor.role,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      correlationId,
      metadata: input.metadata,
    }

    await this.audit.append({ ...base, status: 'attempted', occurredAt: this.clock() })

    try {
      const result = await input.execute()
      await this.audit.append({ ...base, status: 'succeeded', occurredAt: this.clock() })
      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown operator action failure.'
      await this.audit.append({ ...base, status: 'failed', errorMessage: message, occurredAt: this.clock() })
      throw error
    }
  }
}

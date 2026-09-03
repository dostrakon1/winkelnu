import { operatorCan } from '@/application/auth/operator-authorization'
import type { AuditedOperatorActionInput } from '@/application/operations/operator-audit'
import { AuditedOperatorActionService } from '@/application/operations/operator-audit'

export type OperatorActionOutcome = 'succeeded' | 'failed'

export interface OperatorActionIdempotencyRepository {
  tryClaim(input: {
    requestKey: string
    actorUserId: string
    action: string
    targetType: string
    targetId?: string
  }): Promise<boolean>
  complete(requestKey: string, outcome: OperatorActionOutcome, errorMessage?: string): Promise<void>
}

export type IdempotentOperatorActionResult<T> =
  | { executed: true; value: T }
  | { executed: false }

export class IdempotentOperatorActionService {
  constructor(
    private readonly requests: OperatorActionIdempotencyRepository,
    private readonly audited: AuditedOperatorActionService,
  ) {}

  async run<T>(requestKey: string, input: AuditedOperatorActionInput<T>): Promise<IdempotentOperatorActionResult<T>> {
    const normalizedKey = requestKey.trim()
    if (!normalizedKey) throw new Error('Missing operator action request key.')

    // Authorization must happen before the idempotency ledger is touched.
    // AuditedOperatorActionService repeats the same check as defense in depth.
    if (!operatorCan(input.actor.role, input.permission)) {
      throw new Error(`Operator role ${input.actor.role} is not allowed to ${input.permission}.`)
    }

    const claimed = await this.requests.tryClaim({
      requestKey: normalizedKey,
      actorUserId: input.actor.id,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
    })

    if (!claimed) return { executed: false }

    try {
      const value = await this.audited.run(input)
      await this.requests.complete(normalizedKey, 'succeeded')
      return { executed: true, value }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown operator action failure.'
      await this.requests.complete(normalizedKey, 'failed', message)
      throw error
    }
  }
}

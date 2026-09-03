import { describe, expect, it } from 'vitest'

import { operatorRecoveryErrorMessage } from '@/application/operations/operator-facing-error'

describe('operator recovery error boundary', () => {
  it('never echoes raw internal error details', () => {
    const raw = 'Supabase RPC operator_retry_feed failed: permission denied for relation feed_sources'
    const message = operatorRecoveryErrorMessage(new Error(raw))

    expect(message).toBe('De recoveryactie kon niet worden uitgevoerd. Controleer de feedstatus en probeer het opnieuw.')
    expect(message).not.toContain('Supabase')
    expect(message).not.toContain('permission denied')
    expect(message).not.toContain('feed_sources')
  })
})

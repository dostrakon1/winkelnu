import { describe, expect, it, vi } from 'vitest'
import { retryTransientGiftingRead } from '@/infrastructure/gifting/transient-read'

describe('retryTransientGiftingRead', () => {
  it('retries a transient gateway timeout once', async () => {
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('Unable to read gift list: Gateway Timeout'))
      .mockResolvedValueOnce('ok')

    await expect(retryTransientGiftingRead(operation)).resolves.toBe('ok')
    expect(operation).toHaveBeenCalledTimes(2)
  })

  it('does not retry non-transient failures', async () => {
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValue(new Error('permission denied'))

    await expect(retryTransientGiftingRead(operation)).rejects.toThrow('permission denied')
    expect(operation).toHaveBeenCalledTimes(1)
  })
})

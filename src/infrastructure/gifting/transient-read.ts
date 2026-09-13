const TRANSIENT_READ_PATTERNS = [
  'gateway timeout',
  'bad gateway',
  'service unavailable',
  'fetch failed',
  'econnreset',
  'etimedout',
  'network error',
]

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message.toLowerCase()
  return String(error).toLowerCase()
}

export function isTransientGiftingReadError(error: unknown): boolean {
  const message = errorMessage(error)
  return TRANSIENT_READ_PATTERNS.some((pattern) => message.includes(pattern))
}

export async function retryTransientGiftingRead<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (!isTransientGiftingReadError(error)) throw error
    await new Promise((resolve) => setTimeout(resolve, 120))
    return operation()
  }
}

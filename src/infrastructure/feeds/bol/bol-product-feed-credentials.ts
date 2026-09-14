export type BolProductFeedCredentials = {
  username: string
  password: string
}

export function parseBolProductFeedCredentials(
  credential: string | undefined,
): BolProductFeedCredentials {
  if (!credential?.trim()) {
    throw new Error(
      'Bol product feed credentials are missing.',
    )
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(credential)
  } catch {
    throw new Error(
      'Bol product feed credentials must be valid JSON.',
    )
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    Array.isArray(parsed)
  ) {
    throw new Error(
      'Bol product feed credentials must be a JSON object.',
    )
  }

  const record =
    parsed as Record<string, unknown>

  const username =
    typeof record.username === 'string'
      ? record.username.trim()
      : ''

  const password =
    typeof record.password === 'string'
      ? record.password
      : ''

  if (!username) {
    throw new Error(
      'Bol product feed username is missing.',
    )
  }

  if (!password) {
    throw new Error(
      'Bol product feed password is missing.',
    )
  }

  return {
    username,
    password,
  }
}

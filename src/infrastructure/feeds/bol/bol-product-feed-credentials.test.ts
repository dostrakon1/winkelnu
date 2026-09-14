import { describe, expect, it } from 'vitest'

import { parseBolProductFeedCredentials } from './bol-product-feed-credentials'

describe('parseBolProductFeedCredentials', () => {
  it('parses the server-side credential bundle', () => {
    expect(
      parseBolProductFeedCredentials(
        JSON.stringify({
          username: ' bol-feed-user ',
          password: 'super-secret-password',
        }),
      ),
    ).toEqual({
      username: 'bol-feed-user',
      password: 'super-secret-password',
    })
  })

  it('rejects missing credentials', () => {
    expect(() =>
      parseBolProductFeedCredentials(undefined),
    ).toThrow(
      'Bol product feed credentials are missing.',
    )
  })

  it('rejects invalid JSON', () => {
    expect(() =>
      parseBolProductFeedCredentials(
        'not-json',
      ),
    ).toThrow(
      'Bol product feed credentials must be valid JSON.',
    )
  })

  it('rejects an empty username', () => {
    expect(() =>
      parseBolProductFeedCredentials(
        JSON.stringify({
          username: '',
          password: 'secret',
        }),
      ),
    ).toThrow(
      'Bol product feed username is missing.',
    )
  })

  it('rejects an empty password', () => {
    expect(() =>
      parseBolProductFeedCredentials(
        JSON.stringify({
          username: 'feed-user',
          password: '',
        }),
      ),
    ).toThrow(
      'Bol product feed password is missing.',
    )
  })
})

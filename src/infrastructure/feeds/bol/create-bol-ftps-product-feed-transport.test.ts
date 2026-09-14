import { describe, expect, it } from 'vitest'

import { BolFtpsProductFeedTransport } from './bol-ftps-product-feed-transport'
import { createBolFtpsProductFeedTransport } from './create-bol-ftps-product-feed-transport'

describe('createBolFtpsProductFeedTransport', () => {
  it('creates the FTPS transport from the server credential bundle', () => {
    const transport =
      createBolFtpsProductFeedTransport(
        JSON.stringify({
          username: 'bol-feed-user',
          password: 'secret-password',
        }),
      )

    expect(
      transport,
    ).toBeInstanceOf(
      BolFtpsProductFeedTransport,
    )
  })

  it('fails closed when the credential bundle is missing', () => {
    expect(() =>
      createBolFtpsProductFeedTransport(
        undefined,
      ),
    ).toThrow(
      'Bol product feed credentials are missing.',
    )
  })

  it('fails closed when the credential bundle is invalid', () => {
    expect(() =>
      createBolFtpsProductFeedTransport(
        '{"username":"user"}',
      ),
    ).toThrow(
      'Bol product feed password is missing.',
    )
  })
})

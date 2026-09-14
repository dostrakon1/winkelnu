import { BolFtpsProductFeedTransport } from './bol-ftps-product-feed-transport'
import { parseBolProductFeedCredentials } from './bol-product-feed-credentials'

export function createBolFtpsProductFeedTransport(
  credential: string | undefined,
): BolFtpsProductFeedTransport {
  const credentials =
    parseBolProductFeedCredentials(
      credential,
    )

  return new BolFtpsProductFeedTransport({
    username: credentials.username,
    password: credentials.password,
  })
}

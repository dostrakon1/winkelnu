import { describe, expect, it } from 'vitest'

import { BolFtpsProductFeedTransport } from './bol-ftps-product-feed-transport'

type FakeClient = {
  accessCalls: Array<Record<string, unknown>>
  listCalls: string[]
  downloadCalls: Array<{
    destinationPath: string
    remotePath: string
  }>
  closeCount: number
  access: (options: Record<string, unknown>) => Promise<void>
  list: (path?: string) => Promise<
    Array<{
      name: string
      isFile: boolean
    }>
  >
  downloadTo: (
    destinationPath: string,
    remotePath: string,
  ) => Promise<void>
  close: () => void
}

function createFakeClient(): FakeClient {
  const client: FakeClient = {
    accessCalls: [],
    listCalls: [],
    downloadCalls: [],
    closeCount: 0,

    async access(options) {
      client.accessCalls.push(options)
    },

    async list(path = '') {
      client.listCalls.push(path)

      return [
        {
          name: 'product-feed_gift-cards-v2.csv.gz',
          isFile: true,
        },
        {
          name: 'product-feed_books-v2.csv.gz',
          isFile: true,
        },
        {
          name: 'product-feed_old.xml.gz',
          isFile: true,
        },
        {
          name: 'archive',
          isFile: false,
        },
      ]
    },

    async downloadTo(
      destinationPath,
      remotePath,
    ) {
      client.downloadCalls.push({
        destinationPath,
        remotePath,
      })
    },

    close() {
      client.closeCount += 1
    },
  }

  return client
}

describe('BolFtpsProductFeedTransport', () => {
  it('lists Bol CSV gzip feeds over secure FTPS', async () => {
    const client = createFakeClient()

    const transport =
      new BolFtpsProductFeedTransport({
        username: 'test-user',
        password: 'test-password',
        remoteDirectory: 'feeds',
        clientFactory: () => client as never,
      })

    const files = await transport.listFiles()

    expect(files).toEqual([
      {
        fileName:
          'product-feed_books-v2.csv.gz',
        format: 'csv',
        compression: 'gzip',
      },
      {
        fileName:
          'product-feed_gift-cards-v2.csv.gz',
        format: 'csv',
        compression: 'gzip',
      },
    ])

    expect(client.accessCalls).toHaveLength(1)

    expect(client.accessCalls[0]).toMatchObject({
      host: 'apm-feed.unftp.bol.com',
      port: 21,
      user: 'test-user',
      password: 'test-password',
      secure: true,
      secureOptions: {
        rejectUnauthorized: true,
      },
    })

    expect(client.listCalls).toEqual([
      'feeds',
    ])

    expect(client.closeCount).toBe(1)
  })

  it('downloads a requested Bol feed from the remote directory', async () => {
    const client = createFakeClient()

    const transport =
      new BolFtpsProductFeedTransport({
        username: 'test-user',
        password: 'test-password',
        remoteDirectory: 'feeds',
        clientFactory: () => client as never,
      })

    await transport.downloadFile(
      'product-feed_gift-cards-v2.csv.gz',
      '/tmp/bol-gift-cards.csv.gz',
    )

    expect(client.downloadCalls).toEqual([
      {
        destinationPath:
          '/tmp/bol-gift-cards.csv.gz',
        remotePath:
          'feeds/product-feed_gift-cards-v2.csv.gz',
      },
    ])

    expect(client.closeCount).toBe(1)
  })

  it('rejects unsafe remote file names before connecting', async () => {
    const client = createFakeClient()

    const transport =
      new BolFtpsProductFeedTransport({
        username: 'test-user',
        password: 'test-password',
        clientFactory: () => client as never,
      })

    await expect(
      transport.downloadFile(
        '../product-feed_gift-cards-v2.csv.gz',
        '/tmp/feed.csv.gz',
      ),
    ).rejects.toThrow(
      'Invalid Bol product feed file name',
    )

    expect(client.accessCalls).toHaveLength(0)
    expect(client.downloadCalls).toHaveLength(0)
  })
})

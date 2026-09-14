import { posix } from 'node:path'

import { Client } from 'basic-ftp'

import {
  isBolProductFeedFileName,
  type BolProductFeedFile,
  type BolProductFeedTransport,
} from './bol-product-feed-contract'

type BolFtpsClient = Pick<
  Client,
  'access' | 'list' | 'downloadTo' | 'close'
>

type BolFtpsClientFactory = () => BolFtpsClient

export type BolFtpsProductFeedTransportOptions = {
  username: string
  password: string
  host?: string
  port?: number
  remoteDirectory?: string
  timeoutMs?: number
  clientFactory?: BolFtpsClientFactory
}

export class BolFtpsProductFeedTransport
  implements BolProductFeedTransport
{
  private readonly host: string
  private readonly port: number
  private readonly username: string
  private readonly password: string
  private readonly remoteDirectory: string
  private readonly clientFactory: BolFtpsClientFactory

  constructor(
    options: BolFtpsProductFeedTransportOptions,
  ) {
    const username = options.username.trim()
    const password = options.password

    if (!username) {
      throw new Error(
        'Bol FTPS username is required.',
      )
    }

    if (!password) {
      throw new Error(
        'Bol FTPS password is required.',
      )
    }

    this.host =
      options.host?.trim() ||
      'apm-feed.unftp.bol.com'

    this.port = options.port ?? 21
    this.username = username
    this.password = password

    this.remoteDirectory =
      options.remoteDirectory
        ?.trim()
        .replace(/^\/+|\/+$/g, '') ?? ''

    const timeoutMs =
      options.timeoutMs ?? 30_000

    this.clientFactory =
      options.clientFactory ??
      (() => new Client(timeoutMs))
  }

  private async connect(): Promise<BolFtpsClient> {
    const client = this.clientFactory()

    try {
      await client.access({
        host: this.host,
        port: this.port,
        user: this.username,
        password: this.password,
        secure: true,
        secureOptions: {
          rejectUnauthorized: true,
        },
      })

      return client
    } catch (error) {
      client.close()
      throw error
    }
  }

  private remotePath(fileName: string): string {
    return this.remoteDirectory
      ? posix.join(
          this.remoteDirectory,
          fileName,
        )
      : fileName
  }

  async listFiles(): Promise<BolProductFeedFile[]> {
    const client = await this.connect()

    try {
      const entries = await client.list(
        this.remoteDirectory,
      )

      return entries
        .filter(
          (entry) =>
            entry.isFile &&
            isBolProductFeedFileName(entry.name),
        )
        .map((entry) => ({
          fileName: entry.name,
          format: 'csv' as const,
          compression: 'gzip' as const,
        }))
        .sort((a, b) =>
          a.fileName.localeCompare(b.fileName),
        )
    } finally {
      client.close()
    }
  }

  async downloadFile(
    fileName: string,
    destinationPath: string,
  ): Promise<void> {
    const normalizedFileName = fileName.trim()

    if (
      !isBolProductFeedFileName(
        normalizedFileName,
      ) ||
      posix.basename(normalizedFileName) !==
        normalizedFileName
    ) {
      throw new Error(
        `Invalid Bol product feed file name: ${fileName}`,
      )
    }

    if (!destinationPath.trim()) {
      throw new Error(
        'Bol feed destination path is required.',
      )
    }

    const client = await this.connect()

    try {
      await client.downloadTo(
        destinationPath,
        this.remotePath(
          normalizedFileName,
        ),
      )
    } finally {
      client.close()
    }
  }
}

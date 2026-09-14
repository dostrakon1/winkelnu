import {
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import type {
  BolProductFeedFile,
  BolProductFeedTransport,
} from './bol-product-feed-contract'
import { stageBolProductFeedFile } from './bol-product-feed-stager'

class FakeBolProductFeedTransport
  implements BolProductFeedTransport
{
  readonly downloads: Array<{
    fileName: string
    destinationPath: string
  }> = []

  async listFiles(): Promise<BolProductFeedFile[]> {
    return [
      {
        fileName: 'product-feed_gift-cards-v2.csv.gz',
        format: 'csv',
        compression: 'gzip',
      },
    ]
  }

  async downloadFile(
    fileName: string,
    destinationPath: string,
  ): Promise<void> {
    this.downloads.push({
      fileName,
      destinationPath,
    })

    await writeFile(
      destinationPath,
      Buffer.from('fake-gzip-content'),
    )
  }
}

describe('stageBolProductFeedFile', () => {
  it('stages an available Bol feed atomically', async () => {
    const directory = await mkdtemp(
      join(tmpdir(), 'winkelnu-bol-stage-'),
    )

    try {
      const transport =
        new FakeBolProductFeedTransport()

      const stagedPath =
        await stageBolProductFeedFile(
          transport,
          {
            fileName:
              'product-feed_gift-cards-v2.csv.gz',
            directory,
          },
        )

      expect(stagedPath).toBe(
        join(
          directory,
          'product-feed_gift-cards-v2.csv.gz',
        ),
      )

      expect(transport.downloads).toHaveLength(1)

      expect(
        transport.downloads[0]?.fileName,
      ).toBe(
        'product-feed_gift-cards-v2.csv.gz',
      )

      expect(
        transport.downloads[0]?.destinationPath,
      ).toContain('.part-')

      const content = await readFile(
        stagedPath,
        'utf8',
      )

      expect(content).toBe('fake-gzip-content')

      const files = await readdir(directory)

      expect(files).toEqual([
        'product-feed_gift-cards-v2.csv.gz',
      ])
    } finally {
      await rm(directory, {
        recursive: true,
        force: true,
      })
    }
  })

  it('refuses a feed that is not available remotely', async () => {
    const directory = await mkdtemp(
      join(tmpdir(), 'winkelnu-bol-stage-'),
    )

    try {
      const transport =
        new FakeBolProductFeedTransport()

      await expect(
        stageBolProductFeedFile(
          transport,
          {
            fileName:
              'product-feed_missing-v2.csv.gz',
            directory,
          },
        ),
      ).rejects.toThrow(
        'Bol product feed file is not available',
      )

      expect(transport.downloads).toHaveLength(0)
    } finally {
      await rm(directory, {
        recursive: true,
        force: true,
      })
    }
  })
})

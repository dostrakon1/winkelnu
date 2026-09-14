import {
  mkdir,
  rename,
  rm,
} from 'node:fs/promises'
import { basename, join } from 'node:path'

import {
  isBolProductFeedFileName,
  type BolProductFeedTransport,
} from './bol-product-feed-contract'

export type StageBolProductFeedInput = {
  fileName: string
  directory: string
}

export async function stageBolProductFeedFile(
  transport: BolProductFeedTransport,
  input: StageBolProductFeedInput,
): Promise<string> {
  const fileName = input.fileName.trim()

  if (!isBolProductFeedFileName(fileName)) {
    throw new Error(
      `Invalid Bol product feed file name: ${fileName}`,
    )
  }

  if (basename(fileName) !== fileName) {
    throw new Error(
      'Bol product feed file name may not contain a path.',
    )
  }

  const availableFiles = await transport.listFiles()

  if (
    !availableFiles.some(
      (file) => file.fileName === fileName,
    )
  ) {
    throw new Error(
      `Bol product feed file is not available: ${fileName}`,
    )
  }

  await mkdir(input.directory, {
    recursive: true,
  })

  const destinationPath = join(
    input.directory,
    fileName,
  )

  const temporaryPath =
    `${destinationPath}.part-${process.pid}-${Date.now()}`

  try {
    await transport.downloadFile(
      fileName,
      temporaryPath,
    )

    await rename(
      temporaryPath,
      destinationPath,
    )

    return destinationPath
  } catch (error) {
    await rm(temporaryPath, {
      force: true,
    })

    throw error
  }
}

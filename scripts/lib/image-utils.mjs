import { readFileSync } from 'node:fs'

export function inspectWebp(filePath) {
  const bytes = readFileSync(filePath)

  if (bytes.length < 20) {
    throw new Error(`Bestand is te klein om een geldige WebP te zijn: ${bytes.length} bytes`)
  }

  if (bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
    throw new Error('Bestand heeft geen geldige RIFF/WEBP-header')
  }

  let offset = 12
  while (offset + 8 <= bytes.length) {
    const chunk = bytes.subarray(offset, offset + 4).toString('ascii')
    const size = bytes.readUInt32LE(offset + 4)
    const dataOffset = offset + 8

    if (dataOffset + size > bytes.length) {
      throw new Error(`WebP-chunk ${chunk} loopt buiten het bestand; bestand is mogelijk beschadigd`)
    }

    if (chunk === 'VP8X' && size >= 10) {
      const width = 1 + bytes.readUIntLE(dataOffset + 4, 3)
      const height = 1 + bytes.readUIntLE(dataOffset + 7, 3)
      return { bytes: bytes.length, width, height, codec: 'VP8X' }
    }

    if (chunk === 'VP8 ' && size >= 10) {
      const signature = bytes.subarray(dataOffset + 3, dataOffset + 6)
      if (signature[0] === 0x9d && signature[1] === 0x01 && signature[2] === 0x2a) {
        const width = bytes.readUInt16LE(dataOffset + 6) & 0x3fff
        const height = bytes.readUInt16LE(dataOffset + 8) & 0x3fff
        return { bytes: bytes.length, width, height, codec: 'VP8' }
      }
    }

    if (chunk === 'VP8L' && size >= 5 && bytes[dataOffset] === 0x2f) {
      const b1 = bytes[dataOffset + 1]
      const b2 = bytes[dataOffset + 2]
      const b3 = bytes[dataOffset + 3]
      const b4 = bytes[dataOffset + 4]
      const width = 1 + (((b2 & 0x3f) << 8) | b1)
      const height = 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6))
      return { bytes: bytes.length, width, height, codec: 'VP8L' }
    }

    offset = dataOffset + size + (size % 2)
  }

  throw new Error('WebP-header gevonden, maar afbeeldingsafmetingen konden niet worden gelezen')
}

export function assertImageLooksUsable(filePath, { minWidth = 500, minHeight = 300, minBytes = 5_000 } = {}) {
  const info = inspectWebp(filePath)

  if (info.bytes < minBytes) {
    throw new Error(`WebP is verdacht klein: ${info.bytes} bytes (minimum ${minBytes})`)
  }
  if (info.width < minWidth || info.height < minHeight) {
    throw new Error(`WebP-resolutie is te klein: ${info.width}x${info.height} (minimum ${minWidth}x${minHeight})`)
  }

  return info
}

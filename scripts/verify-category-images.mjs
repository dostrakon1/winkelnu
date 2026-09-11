#!/usr/bin/env node

import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { assertImageLooksUsable } from './lib/image-utils.mjs'

const imageDirectory = join(process.cwd(), 'public', 'images', 'categories')
const filePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*-hero\.webp$/
const categoryImages = readdirSync(imageDirectory, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.webp'))
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right, 'nl'))

if (categoryImages.length === 0) {
  throw new Error('Geen categorie-afbeeldingen gevonden in public/images/categories')
}

for (const fileName of categoryImages) {
  if (!filePattern.test(fileName)) {
    throw new Error(`Ongeldige categorie-afbeeldingsnaam: ${fileName}. Gebruik <categorie-slug>-hero.webp`)
  }

  const filePath = join(imageDirectory, fileName)
  const info = assertImageLooksUsable(filePath)
  const ratio = info.width / info.height

  if (Math.abs(ratio - (4 / 3)) > 0.01) {
    throw new Error(`Categorie-afbeelding ${fileName} is geen 4:3: ${info.width}x${info.height}`)
  }

  const qualityNote = info.width >= 1200 && info.height >= 900 ? '' : ' — bestaande lage resolutie; 1600x1200 aanbevolen bij vervanging'
  console.log(`✓ images/categories/${fileName}: ${info.width}x${info.height}, ${Math.round(info.bytes / 1024)} KB${qualityNote}`)
}

console.log(`✓ ${categoryImages.length} categorie-afbeeldingen technisch gecontroleerd`)
console.log('✓ Naamconventie en 4:3-verhouding gecontroleerd; manifest wordt uit dezelfde map gegenereerd')
console.log('Let op: technische validatie vervangt de visuele controle niet.')

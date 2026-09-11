#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { assertImageLooksUsable } from './lib/image-utils.mjs'

const registryPath = join(process.cwd(), 'src', 'content', 'category-images.ts')
const registry = readFileSync(registryPath, 'utf8')
const paths = [...registry.matchAll(/src:\s*'\/(images\/categories\/[a-z0-9-]+-hero\.webp)'/g)].map((match) => match[1])

if (paths.length === 0) {
  throw new Error('Geen categorie-afbeeldingen gevonden in src/content/category-images.ts')
}
if (new Set(paths).size !== paths.length) {
  throw new Error('Dubbele categorie-afbeeldingspaden gevonden in src/content/category-images.ts')
}

for (const relativePath of paths) {
  const filePath = join(process.cwd(), 'public', relativePath)
  if (!existsSync(filePath)) {
    throw new Error(`Ontbrekende categorie-afbeelding: public/${relativePath}`)
  }
  const info = assertImageLooksUsable(filePath)
  console.log(`✓ ${relativePath}: ${info.width}x${info.height}, ${Math.round(info.bytes / 1024)} KB`)
}

console.log(`✓ ${paths.length} categorie-afbeeldingen technisch gecontroleerd`)
console.log('Let op: technische validatie vervangt de visuele controle niet.')

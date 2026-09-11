#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { assertImageLooksUsable } from './lib/image-utils.mjs'

const args = new Map()
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index]
  const value = process.argv[index + 1]
  if (!key?.startsWith('--') || !value) {
    fail('Gebruik argumenten als --input bestand.png --type category --name baby-kind')
  }
  args.set(key.slice(2), value)
}

const inputArg = args.get('input')
const type = args.get('type') ?? 'category'
const name = args.get('name')
const quality = Number(args.get('quality') ?? 84)
const maxWidth = Number(args.get('max-width') ?? 1600)

if (!inputArg || !name) {
  fail('Verplicht: --input <bestand> en --name <naam>. Voorbeeld: npm run image:prepare -- --input ~/Downloads/baby.png --type category --name baby-kind')
}
if (!['category', 'hero', 'section'].includes(type)) {
  fail('--type moet category, hero of section zijn')
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
  fail('--name mag alleen kleine letters, cijfers en koppeltekens bevatten')
}
if (!Number.isInteger(quality) || quality < 40 || quality > 95) {
  fail('--quality moet een geheel getal tussen 40 en 95 zijn')
}
if (!Number.isInteger(maxWidth) || maxWidth < 600 || maxWidth > 3000) {
  fail('--max-width moet tussen 600 en 3000 pixels liggen')
}

const input = resolve(inputArg)
if (!existsSync(input) || !statSync(input).isFile()) {
  fail(`Inputbestand bestaat niet: ${input}`)
}

const output = resolveOutput(type, name)
mkdirSync(dirname(output), { recursive: true })
optimizeToWebp(input, output, quality, maxWidth)

const info = assertImageLooksUsable(output)
if (type === 'category') {
  assertFourByThree(info)
  if (info.width < 1200 || info.height < 900) {
    console.warn(`⚠ Categoriebeeld is ${info.width}x${info.height}. Voor een nieuwe master is 1600x1200 aanbevolen; bestaande kleinere goedgekeurde beelden blijven toegestaan.`)
  }
}

console.log(`✓ Afbeelding voorbereid: ${output}`)
console.log(`  bron: ${basename(input)}`)
console.log(`  WebP: ${info.width}x${info.height}, ${Math.round(info.bytes / 1024)} KB, ${info.codec}`)
console.log('  volgende controle: open het bestand visueel vóór commit/push')

function resolveOutput(imageType, slug) {
  if (imageType === 'category') return join(process.cwd(), 'public', 'images', 'categories', `${slug}-hero.webp`)
  if (imageType === 'hero') return join(process.cwd(), 'public', 'images', 'heroes', `${slug}-hero.webp`)
  return join(process.cwd(), 'public', 'images', 'sections', `${slug}.webp`)
}

function optimizeToWebp(inputPath, outputPath, webpQuality, width) {
  const command = commandExists('magick') ? 'magick' : commandExists('convert') ? 'convert' : null

  if (command) {
    run(command, [
      inputPath,
      '-auto-orient',
      '-resize', `${width}x${width}>`,
      '-strip',
      '-quality', String(webpQuality),
      '-define', 'webp:method=6',
      outputPath,
    ])
    return
  }

  if (extname(inputPath).toLowerCase() === '.webp') {
    if (resolve(inputPath) !== resolve(outputPath)) copyFileSync(inputPath, outputPath)
    console.warn('⚠ ImageMagick niet gevonden; bestaande WebP is zonder hercompressie overgenomen.')
    return
  }

  fail([
    'PNG/JPG-conversie vereist ImageMagick.',
    'Op Pop!_OS/Ubuntu installeer je dit eenmalig met: sudo apt install imagemagick',
    'Een WebP-bestand kan zonder ImageMagick direct worden overgenomen, maar wordt dan niet opnieuw geoptimaliseerd.',
  ].join('\n'))
}

function assertFourByThree(info) {
  const targetRatio = 4 / 3
  const actualRatio = info.width / info.height
  if (Math.abs(actualRatio - targetRatio) > 0.01) {
    fail(`Categoriebeeld moet 4:3 zijn; ontvangen ${info.width}x${info.height}. Snijd de bron eerst inhoudelijk goed bij voordat je hem publiceert.`)
  }
}

function commandExists(command) {
  return spawnSync('sh', ['-c', `command -v ${command}`], { stdio: 'ignore' }).status === 0
}

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, { stdio: 'inherit' })
  if (result.status !== 0) {
    fail(`${command} kon de afbeelding niet verwerken`)
  }
}

function fail(message) {
  console.error(`✗ ${message}`)
  process.exit(1)
}

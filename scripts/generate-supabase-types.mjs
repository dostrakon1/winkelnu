import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const projectId = process.env.SUPABASE_PROJECT_ID

if (!projectId) {
  console.error('Missing SUPABASE_PROJECT_ID.')
  process.exit(1)
}

const target = resolve('src/infrastructure/supabase/database.types.ts')
await mkdir(dirname(target), { recursive: true })

const child = spawn(
  'npx',
  ['--yes', 'supabase', 'gen', 'types', 'typescript', '--project-id', projectId, '--schema', 'public'],
  { stdio: ['ignore', 'pipe', 'inherit'] },
)

let output = ''
child.stdout.setEncoding('utf8')
child.stdout.on('data', (chunk) => {
  output += chunk
})

const exitCode = await new Promise((resolveExit) => child.on('close', resolveExit))

if (exitCode !== 0 || output.trim().length === 0) {
  console.error(`Supabase type generation failed with exit code ${exitCode}.`)
  process.exit(typeof exitCode === 'number' ? exitCode : 1)
}

await writeFile(
  target,
  `/* Generated from the live Winkelnu Supabase public schema. Do not edit manually. */\n${output}`,
  'utf8',
)

console.log(`Generated ${target}`)

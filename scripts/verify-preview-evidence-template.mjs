import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const path = resolve('docs/operations/PREVIEW_ACTIVATION_EVIDENCE_PACK.md')
const content = await readFile(path, 'utf8')

const requiredSections = [
  '## Activation identity',
  '## 1. Repository gates',
  '## 2. Environment preflight',
  '## 3. Migration state',
  '## 4. Live connection and security readiness',
  '## 5. Project-derived database types',
  '## 6. Catalog/bootstrap evidence',
  '## 7. Storefront and attribution acceptance',
  '## 8. Human operator acceptance',
  '## 9. Persistence switch acceptance',
  '## 10. Stop / rollback evidence',
  '## Final handoff decision',
]

const requiredPendingMarkers = [
  '- Repository commit SHA: `PENDING`',
  '- Preview project ref: `PENDING`',
  '- `npm run verify:activation-env`: `PENDING`',
  '- `npm run verify:production-readiness`: `PENDING`',
  '- Preview import correlation ID: `PENDING`',
  '- Preview activation result: `pending`',
]

const forbiddenSecretAssignments = [
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^.\s`<][^\s`]*/i,
  /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY\s*=\s*[^.\s`<][^\s`]*/i,
  /CRON_SECRET\s*=\s*[^.\s`<][^\s`]*/i,
  /WINKELNU_IMPORT_TRIGGER_SECRET\s*=\s*[^.\s`<][^\s`]*/i,
]

const failures = []
for (const section of requiredSections) {
  if (!content.includes(section)) failures.push(`Missing evidence section: ${section}`)
}
for (const marker of requiredPendingMarkers) {
  if (!content.includes(marker)) failures.push(`Missing safe pending marker: ${marker}`)
}
for (const pattern of forbiddenSecretAssignments) {
  if (pattern.test(content)) failures.push(`Evidence template appears to contain a secret assignment matching ${pattern}`)
}

if (!content.includes('Status: template-ready; live preview evidence is not yet available.')) {
  failures.push('Evidence template must explicitly state that live preview evidence is not yet available.')
}

if (failures.length > 0) {
  console.error('Preview evidence template verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Preview evidence template OK: ${requiredSections.length} sections and safe pending markers verified.`)

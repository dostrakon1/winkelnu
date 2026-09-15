import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const migration = await readFile(resolve('supabase/migrations/0036_measurement_core_v1.sql'), 'utf8')
const contract = await readFile(resolve('src/application/measurement/measurement-core.ts'), 'utf8')
const route = await readFile(resolve('src/app/api/measurement/events/route.ts'), 'utf8')
const footer = await readFile(resolve('src/components/storefront/winkelnu-footer.tsx'), 'utf8')

const failures = []
const checks = [
  ['measurement table', migration, /create\s+table\s+measurement_events\b/i],
  ['event idempotency UUID', migration, /external_key\s+uuid\s+not\s+null\s+unique/i],
  ['measurement RLS', migration, /alter\s+table\s+measurement_events\s+enable\s+row\s+level\s+security/i],
  ['untrusted access revoke', migration, /revoke\s+all\s+on\s+table\s+measurement_events\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['service-role least privilege', migration, /grant\s+select\s*,\s*insert\s*,\s*delete\s+on\s+table\s+measurement_events\s+to\s+service_role/i],
  ['query string database guard', migration, /position\('\?'\s+in\s+source_path\)\s*=\s*0/i],
  ['fragment database guard', migration, /position\('#'\s+in\s+source_path\)\s*=\s*0/i],
  ['versioned outbound contract', contract, /'outbound\.click:1'/],
  ['Akflow target key', contract, /targetKey:\s*'akflow'/],
  ['footer placement', contract, /placement:\s*'footer'/],
  ['sensitive gifting path block', contract, /'\/lootje-lijstje'/],
  ['4 KB ingestion cap', route, /MAX_BODY_LENGTH\s*=\s*4096/],
  ['same-origin check', route, /isSameOrigin/],
  ['production-host gate', route, /isProductionHostForSite/],
  ['bounded abuse limit', route, /RATE_LIMIT_MAX_EVENTS/],
  ['measured footer link', footer, /MeasuredExternalLink/],
  ['Akflow destination', footer, /https:\/\/www\.akflow\.nl\//],
]

for (const [label, source, pattern] of checks) {
  if (!pattern.test(source)) failures.push(`Missing Measurement Core contract: ${label}`)
}

const prohibitedPersistenceTokens = [
  'raw_ip_address',
  'user_agent_fingerprint',
  'visitor_id',
  'advertising_id',
  'device_id',
  'full_external_referrer',
]
for (const token of prohibitedPersistenceTokens) {
  const columnPattern = new RegExp(`\\b${token}\\s+(?:text|uuid|jsonb|varchar|inet)\\b`, 'i')
  if (columnPattern.test(migration)) failures.push(`Prohibited Measurement Core persistence column: ${token}`)
}

if (failures.length > 0) {
  console.error('Measurement Core contract verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Measurement Core contract OK: storage, privacy, ingestion and footer activation boundaries are present.')

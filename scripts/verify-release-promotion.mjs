function required(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function expect(condition, message) {
  if (!condition) throw new Error(message)
}

function normalizedOrigin(value, name) {
  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${name} must be a valid absolute URL.`)
  }

  expect(url.protocol === 'https:', `${name} must use HTTPS.`)
  expect(url.pathname === '/' && !url.search && !url.hash, `${name} must be an origin without path, query or hash.`)
  return url.origin
}

const releaseSha = required('WINKELNU_RELEASE_SHA').toLowerCase()
expect(/^[0-9a-f]{40}$/.test(releaseSha), 'WINKELNU_RELEASE_SHA must be an exact 40-character Git commit SHA.')

const environment = required('WINKELNU_RELEASE_ENVIRONMENT')
expect(environment === 'production', 'WINKELNU_RELEASE_ENVIRONMENT must equal production for promotion.')

const releaseOrigin = normalizedOrigin(required('WINKELNU_RELEASE_ORIGIN'), 'WINKELNU_RELEASE_ORIGIN')
const siteOrigin = normalizedOrigin(required('NEXT_PUBLIC_SITE_URL'), 'NEXT_PUBLIC_SITE_URL')
expect(siteOrigin === releaseOrigin, 'NEXT_PUBLIC_SITE_URL must exactly match WINKELNU_RELEASE_ORIGIN.')

const releaseHost = new URL(releaseOrigin).hostname.toLowerCase()
expect(releaseHost === 'winkelnu.nl', 'Production promotion currently requires the canonical host winkelnu.nl.')

const persistence = required('CATALOG_PERSISTENCE')
expect(persistence === 'supabase', 'Production promotion requires CATALOG_PERSISTENCE=supabase.')

const supabaseUrl = normalizedOrigin(required('SUPABASE_URL'), 'SUPABASE_URL')
const publicSupabaseUrl = normalizedOrigin(required('NEXT_PUBLIC_SUPABASE_URL'), 'NEXT_PUBLIC_SUPABASE_URL')
expect(supabaseUrl === publicSupabaseUrl, 'SUPABASE_URL and NEXT_PUBLIC_SUPABASE_URL must target the same Supabase project origin.')

required('SUPABASE_SERVICE_ROLE_KEY')
required('SUPABASE_PROJECT_ID')
required('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
required('WINKELNU_OPERATOR_EMAILS')
required('WINKELNU_OPERATOR_ROLES')

const triggerSecret = process.env.CRON_SECRET?.trim() || process.env.WINKELNU_IMPORT_TRIGGER_SECRET?.trim()
expect(Boolean(triggerSecret), 'Production promotion requires CRON_SECRET or WINKELNU_IMPORT_TRIGGER_SECRET.')

for (const name of Object.keys(process.env)) {
  if (!name.startsWith('NEXT_PUBLIC_')) continue
  const upper = name.toUpperCase()
  expect(!upper.includes('SERVICE_ROLE'), `${name} must never expose a service-role credential.`)
  expect(!upper.includes('CLIENT_SECRET'), `${name} must never expose a client secret.`)
  expect(!upper.includes('CRON_SECRET'), `${name} must never expose a cron secret.`)
}

const providerSha = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || '').trim().toLowerCase()
if (providerSha) {
  expect(/^[0-9a-f]{40}$/.test(providerSha), 'Deployment-provider Git SHA must be a full 40-character SHA when present.')
  expect(providerSha === releaseSha, 'Deployment-provider Git SHA does not match WINKELNU_RELEASE_SHA.')
}

console.log(JSON.stringify({
  ok: true,
  releaseSha,
  environment,
  releaseOrigin,
  catalogPersistence: persistence,
  supabaseOrigin: supabaseUrl,
  supabaseProjectId: process.env.SUPABASE_PROJECT_ID,
  providerShaVerified: Boolean(providerSha),
  schedulerSecretConfigured: true,
  operatorPolicyConfigured: true,
}, null, 2))

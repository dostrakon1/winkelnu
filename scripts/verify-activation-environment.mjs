const required = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_PROJECT_ID',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'WINKELNU_OPERATOR_EMAILS',
  'WINKELNU_OPERATOR_ROLES',
]

const missing = required.filter((name) => !process.env[name]?.trim())
if (missing.length > 0) {
  throw new Error(`Missing activation environment variables: ${missing.join(', ')}`)
}

const serverUrl = process.env.SUPABASE_URL.trim().replace(/\/$/, '')
const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.trim().replace(/\/$/, '')
const projectId = process.env.SUPABASE_PROJECT_ID.trim()
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY.trim()
const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.trim()
const persistence = (process.env.CATALOG_PERSISTENCE ?? 'memory').trim()

if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(serverUrl)) {
  throw new Error('SUPABASE_URL must be an https://<project-ref>.supabase.co URL.')
}
if (serverUrl !== publicUrl) {
  throw new Error('SUPABASE_URL and NEXT_PUBLIC_SUPABASE_URL must target the same Supabase project.')
}
if (!serverUrl.includes(`https://${projectId}.supabase.co`)) {
  throw new Error('SUPABASE_PROJECT_ID does not match SUPABASE_URL.')
}
if (serviceRole === publishable) {
  throw new Error('Service-role and publishable Supabase keys must never be identical.')
}
if (persistence !== 'memory' && persistence !== 'supabase') {
  throw new Error('CATALOG_PERSISTENCE must be memory or supabase.')
}

const operatorEmails = process.env.WINKELNU_OPERATOR_EMAILS
  .split(',')
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean)

const rolePairs = process.env.WINKELNU_OPERATOR_ROLES
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

if (operatorEmails.length === 0) throw new Error('At least one operator email is required.')

const allowedRoles = new Set(['owner', 'operator', 'read_only'])
for (const pair of rolePairs) {
  const [email, role, extra] = pair.split(':').map((value) => value?.trim())
  if (!email || !role || extra) throw new Error(`Invalid WINKELNU_OPERATOR_ROLES entry: ${pair}`)
  if (!operatorEmails.includes(email.toLowerCase())) throw new Error(`Role configured for non-allowlisted operator: ${email}`)
  if (!allowedRoles.has(role)) throw new Error(`Unsupported operator role for ${email}: ${role}`)
}

if (!rolePairs.some((pair) => pair.toLowerCase().endsWith(':owner'))) {
  throw new Error('At least one allowlisted operator must have the owner role.')
}

console.log(JSON.stringify({
  ok: true,
  projectId,
  persistence,
  operatorCount: operatorEmails.length,
  roleCount: rolePairs.length,
  serverUrlMatchesPublicUrl: true,
  serviceRoleSeparatedFromPublishableKey: true,
}, null, 2))

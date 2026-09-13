const failures = []

if (process.env.WINKELNU_GIFTING_ENABLED !== 'true') {
  failures.push('WINKELNU_GIFTING_ENABLED must be exactly true.')
}

const giftSecret = process.env.WINKELNU_GIFT_SESSION_SECRET?.trim() ?? ''
if (Buffer.byteLength(giftSecret, 'utf8') < 32) {
  failures.push('WINKELNU_GIFT_SESSION_SECRET must contain at least 32 bytes of server-only entropy.')
}

if (!process.env.SUPABASE_URL?.trim()) failures.push('SUPABASE_URL is required.')
if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) failures.push('SUPABASE_SERVICE_ROLE_KEY is required.')

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
if (!siteUrl) {
  failures.push('NEXT_PUBLIC_SITE_URL is required.')
} else {
  try {
    const parsed = new URL(siteUrl)
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'winkelnu.nl') {
      failures.push('NEXT_PUBLIC_SITE_URL must resolve to https://winkelnu.nl for production release verification.')
    }
  } catch {
    failures.push('NEXT_PUBLIC_SITE_URL must be a valid URL.')
  }
}

if (failures.length > 0) {
  console.error('Lootje & Lijstje release environment is NOT ready:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Lootje & Lijstje release environment OK: feature flag, 32+ byte session secret, Supabase server boundary and production origin are configured.')

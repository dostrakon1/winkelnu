import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const migration = await readFile(resolve('supabase/migrations/0033_gifting_insights_product_commercial.sql'), 'utf8')
const dashboard = await readFile(resolve('src/app/intern/operations/gifting/products/page.tsx'), 'utf8')
const repository = await readFile(resolve('src/infrastructure/gifting/supabase-gifting-product-insights-repository.ts'), 'utf8')
const giftCatalog = await readFile(resolve('src/application/gifting/gift-catalog.ts'), 'utf8')
const giftCard = await readFile(resolve('src/components/gifting/gift-list-item-card.tsx'), 'utf8')

const failures = []

const requiredMigrationPatterns = [
  ['product overview RPC', /create\s+or\s+replace\s+function\s+gifting_insights_product_overview\(\s*p_from\s+date\s*,\s*p_to\s+date\s*\)/i],
  ['product ranking RPC', /create\s+or\s+replace\s+function\s+gifting_insights_product_rankings\(\s*p_from\s+date\s*,\s*p_to\s+date\s*\)/i],
  ['occasion RPC', /create\s+or\s+replace\s+function\s+gifting_insights_products_by_occasion\(\s*p_from\s+date\s*,\s*p_to\s+date\s*\)/i],
  ['overview untrusted revoke', /revoke\s+all\s+on\s+function\s+gifting_insights_product_overview\(date\s*,\s*date\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['overview service role grant', /grant\s+execute\s+on\s+function\s+gifting_insights_product_overview\(date\s*,\s*date\)\s+to\s+service_role/i],
  ['ranking untrusted revoke', /revoke\s+all\s+on\s+function\s+gifting_insights_product_rankings\(date\s*,\s*date\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['ranking service role grant', /grant\s+execute\s+on\s+function\s+gifting_insights_product_rankings\(date\s*,\s*date\)\s+to\s+service_role/i],
  ['occasion untrusted revoke', /revoke\s+all\s+on\s+function\s+gifting_insights_products_by_occasion\(date\s*,\s*date\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i],
  ['occasion service role grant', /grant\s+execute\s+on\s+function\s+gifting_insights_products_by_occasion\(date\s*,\s*date\)\s+to\s+service_role/i],
  ['canonical affiliate click source', /from\s+affiliate_click_events[\s\S]*?source_path\s*=\s*'\/lootje-lijstje'/i],
  ['product dimension rollup', /'product_external_key'/i],
  ['item type rollup', /'item_type'/i],
  ['occasion rollup', /'occasion'/i],
  ['known price snapshot', /new\.price_cents_snapshot/i],
]

for (const [label, pattern] of requiredMigrationPatterns) {
  if (!pattern.test(migration)) failures.push(`Missing GI4 migration contract: ${label}`)
}

if (/create\s+table[\s\S]*affiliate/i.test(migration)) {
  failures.push('GI4 must reuse the canonical affiliate_click_events table and must not create a second affiliate click table.')
}

for (const forbidden of ['share_code', 'token_hash', 'display_name', 'email', 'external_url', 'giver_participant_id', 'recipient_participant_id', 'ip_address', 'user_agent']) {
  if (new RegExp(`\\b${forbidden}\\b`, 'i').test(migration)) {
    failures.push(`GI4 migration must not introduce or aggregate private field: ${forbidden}`)
  }
}

if (!/requireOperatorPermission\(['"]read_gifting_insights['"]\)/.test(dashboard)) {
  failures.push('GI4 dashboard must require read_gifting_insights permission.')
}
if (!/robots:\s*\{\s*index:\s*false,\s*follow:\s*false,\s*nocache:\s*true\s*\}/.test(dashboard)) {
  failures.push('GI4 dashboard must remain noindex/nofollow/nocache.')
}
if (/shareCode|groupCode|displayName|participantId|tokenHash|externalUrl/i.test(repository)) {
  failures.push('GI4 repository must not map private gifting fields.')
}

if (!/bestOfferId\?:\s*string/.test(giftCatalog) || !/bestOfferId:\s*bestOffer\?\.offer\.id/.test(giftCatalog)) {
  failures.push('Gifting catalog must expose the current best offer id for the commerce CTA.')
}
if (!/`\/uit\/\$\{encodeURIComponent\(productView\.bestOfferId\)\}\?from=\$\{encodeURIComponent\('\/lootje-lijstje'\)\}`/.test(giftCard)) {
  failures.push('Gifting offer CTA must use the canonical /uit route with the static /lootje-lijstje source path.')
}
if (!/rel="nofollow sponsored"/.test(giftCard)) {
  failures.push('Gifting affiliate CTA must retain nofollow sponsored rel attributes.')
}
if (/shareCode[^\n]{0,120}giftingAffiliateHref|groupCode[^\n]{0,120}giftingAffiliateHref/i.test(giftCard)) {
  failures.push('Gifting affiliate attribution must not include private group/list capability codes.')
}

if (failures.length > 0) {
  console.error('GI4 gifting product/commercial contract verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('GI4 gifting product/commercial contract OK: anonymous product rollups, canonical affiliate attribution, protected dashboard and privacy boundaries verified.')

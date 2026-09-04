import { readFile } from 'node:fs/promises'

function expect(condition, message) {
  if (!condition) throw new Error(message)
}

const evidencePath = process.env.WINKELNU_RELEASE_EVIDENCE_FILE?.trim() || 'docs/launch/evidence/FIRST_PRODUCTION_RELEASE_EVIDENCE.json'
const raw = await readFile(evidencePath, 'utf8')
const evidence = JSON.parse(raw)

const sha = String(evidence.release?.sha ?? '').toLowerCase()
expect(/^[0-9a-f]{40}$/.test(sha), 'release.sha must be an exact 40-character Git SHA.')
expect(evidence.release?.environment === 'production', 'release.environment must equal production.')
expect(evidence.release?.origin === 'https://winkelnu.nl', 'release.origin must equal https://winkelnu.nl.')
expect(typeof evidence.release?.deploymentReference === 'string' && evidence.release.deploymentReference.trim().length > 0, 'release.deploymentReference is required.')
expect(typeof evidence.release?.acceptedAtUtc === 'string' && !Number.isNaN(Date.parse(evidence.release.acceptedAtUtc)), 'release.acceptedAtUtc must be a valid timestamp.')

const requiredGates = [
  'exactHeadCi',
  'releasePromotion',
  'supabaseConnection',
  'productionReadiness',
  'databaseContract',
  'domainCutover',
  'liveDeployment',
  'legalCompliance',
  'keyboardMobileAccessibility',
  'runtimePrivacy',
  'firstRealFeed',
  'affiliateRedirect',
  'singleClickAttribution',
]

for (const gate of requiredGates) {
  expect(evidence.gates?.[gate] === 'PASS', `gates.${gate} must equal PASS.`)
}

expect(typeof evidence.feed?.merchant === 'string' && evidence.feed.merchant.trim().length > 0, 'feed.merchant is required.')
expect(typeof evidence.feed?.productSlug === 'string' && evidence.feed.productSlug.trim().length > 0, 'feed.productSlug is required.')
expect(typeof evidence.feed?.offerId === 'string' && evidence.feed.offerId.trim().length > 0, 'feed.offerId is required.')
expect(typeof evidence.feed?.merchantHost === 'string' && evidence.feed.merchantHost.trim().length > 0, 'feed.merchantHost is required.')

expect(evidence.decision?.status === 'ACCEPT', 'decision.status must equal ACCEPT.')
expect(typeof evidence.decision?.approvedBy === 'string' && evidence.decision.approvedBy.trim().length > 0, 'decision.approvedBy is required.')
expect(typeof evidence.decision?.notes === 'string', 'decision.notes must be a string.')

console.log(JSON.stringify({
  ok: true,
  evidencePath,
  releaseSha: sha,
  origin: evidence.release.origin,
  deploymentReference: evidence.release.deploymentReference,
  merchant: evidence.feed.merchant,
  productSlug: evidence.feed.productSlug,
  offerId: evidence.feed.offerId,
  decision: evidence.decision.status,
  acceptedAtUtc: evidence.release.acceptedAtUtc,
}, null, 2))

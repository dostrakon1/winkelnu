function required(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function normalizedOrigin(value) {
  const url = new URL(value)
  if (url.protocol !== 'https:') {
    throw new Error(`WINKELNU_ACCEPTANCE_ORIGIN must use HTTPS, received ${url.protocol}`)
  }
  url.pathname = '/'
  url.search = ''
  url.hash = ''
  return url.toString().replace(/\/$/, '')
}

function pathValue(name) {
  const value = process.env[name]?.trim()
  if (!value) return null
  if (!value.startsWith('/')) throw new Error(`${name} must start with /`)
  return value
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function request(origin, path, options = {}) {
  const response = await fetch(new URL(path, `${origin}/`), {
    redirect: options.redirect ?? 'follow',
    headers: { 'user-agent': 'Winkelnu deployment acceptance verifier/1.0' },
  })
  const text = options.body === false ? '' : await response.text()
  return { response, text }
}

function canonicalFromHtml(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)
  return match?.[1] ?? null
}

function robotsMetaFromHtml(html) {
  const match = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']robots["']/i)
  return match?.[1]?.toLowerCase() ?? null
}

function hasPageHeading(html) {
  return /<h1\b/i.test(html)
}

async function verifyIndexedPage(origin, path) {
  const result = await request(origin, path)
  assert(result.response.ok, `${path} returned ${result.response.status}`)
  const canonical = canonicalFromHtml(result.text)
  assert(canonical === `${origin}${path}`, `${path} canonical mismatch: ${canonical ?? 'missing'}`)
  assert(hasPageHeading(result.text), `${path} is missing a page-level h1`)
  return { status: result.response.status, canonical }
}

async function verifyNoIndexPage(origin, path) {
  const result = await request(origin, path)
  assert(result.response.ok, `${path} returned ${result.response.status}`)
  const robots = robotsMetaFromHtml(result.text)
  assert(robots?.includes('noindex'), `${path} is missing noindex robots metadata: ${robots ?? 'missing'}`)
  return { status: result.response.status, robots }
}

async function verifyPermanentRedirect(origin, sourcePath, destinationPath) {
  const result = await request(origin, sourcePath, { redirect: 'manual', body: false })
  assert(result.response.status === 308, `${sourcePath} should return 308, received ${result.response.status}`)
  const location = result.response.headers.get('location')
  assert(location, `${sourcePath} returned no Location header`)
  const destination = new URL(location, `${origin}/`)
  assert(destination.origin === origin, `${sourcePath} redirects outside accepted origin: ${destination.toString()}`)
  assert(destination.pathname === destinationPath, `${sourcePath} redirect mismatch: expected ${destinationPath}, received ${destination.pathname}`)
  return { status: result.response.status, destination: destination.pathname }
}

const origin = normalizedOrigin(required('WINKELNU_ACCEPTANCE_ORIGIN'))
const expectedHost = new URL(origin).host
const productPath = pathValue('WINKELNU_ACCEPTANCE_PRODUCT_PATH')
const offerPath = pathValue('WINKELNU_ACCEPTANCE_OFFER_PATH')
const expectedMerchantHost = process.env.WINKELNU_ACCEPTANCE_MERCHANT_HOST?.trim() || null

const indexedPublicPaths = [
  '/over-winkelnu',
  '/bedrijfsgegevens',
  '/affiliate-en-vergelijking',
  '/privacy',
  '/cookies',
  '/disclaimer',
  '/koopgidsen',
  '/collecties/cadeaus-feest',
  '/collecties/halloween',
  '/collecties/sinterklaas',
  '/collecties/kerst',
  '/collecties/black-friday',
  '/collecties/cyber-monday',
]

const noIndexPublicPaths = [
  '/zoeken',
  '/vergelijken',
  '/aanbieding-niet-beschikbaar',
]

const permanentRedirects = [
  ['/black-friday', '/collecties/black-friday'],
  ['/cyber-monday', '/collecties/cyber-monday'],
  ['/koopgidsen/categorie/cadeaus-feest', '/collecties/cadeaus-feest'],
]

const evidence = {
  origin,
  checkedAt: new Date().toISOString(),
  checks: {},
}

const homepage = await request(origin, '/')
assert(homepage.response.ok, `Homepage returned ${homepage.response.status}`)
assert(homepage.response.url.startsWith(`${origin}/`) || homepage.response.url === origin, `Homepage resolved outside accepted origin: ${homepage.response.url}`)
const homepageCanonical = canonicalFromHtml(homepage.text)
assert(homepageCanonical === `${origin}/`, `Homepage canonical mismatch: ${homepageCanonical ?? 'missing'}`)
assert(hasPageHeading(homepage.text), 'Homepage is missing a page-level h1')
evidence.checks.homepage = {
  status: homepage.response.status,
  finalUrl: homepage.response.url,
  canonical: homepageCanonical,
  setCookie: homepage.response.headers.get('set-cookie') ?? null,
}

const robots = await request(origin, '/robots.txt')
assert(robots.response.ok, `robots.txt returned ${robots.response.status}`)
for (const blocked of ['/intern/', '/api/', '/uit/']) {
  assert(robots.text.includes(`Disallow: ${blocked}`), `robots.txt does not disallow ${blocked}`)
}
assert(robots.text.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt sitemap does not use accepted origin')
evidence.checks.robots = { status: robots.response.status }

const sitemap = await request(origin, '/sitemap.xml')
assert(sitemap.response.ok, `sitemap.xml returned ${sitemap.response.status}`)
assert(sitemap.text.includes(`<loc>${origin}/</loc>`), 'sitemap.xml does not include canonical homepage')
for (const path of indexedPublicPaths) {
  assert(sitemap.text.includes(`<loc>${origin}${path}</loc>`), `sitemap.xml is missing ${path}`)
}
for (const path of noIndexPublicPaths) {
  assert(!sitemap.text.includes(`<loc>${origin}${path}</loc>`), `sitemap.xml should not include noindex route ${path}`)
}
evidence.checks.sitemap = { status: sitemap.response.status }

for (const path of indexedPublicPaths) {
  evidence.checks[path] = await verifyIndexedPage(origin, path)
}

for (const path of noIndexPublicPaths) {
  evidence.checks[path] = await verifyNoIndexPage(origin, path)
}

for (const [sourcePath, destinationPath] of permanentRedirects) {
  evidence.checks[`redirect:${sourcePath}`] = await verifyPermanentRedirect(origin, sourcePath, destinationPath)
}

const notFound = await request(origin, '/__winkelnu_acceptance_missing_page__')
assert(notFound.response.status === 404, `Expected a 404 response, received ${notFound.response.status}`)
assert(hasPageHeading(notFound.text), '404 response is missing a page-level h1')
evidence.checks.notFound = { status: notFound.response.status }

if (productPath) {
  const product = await request(origin, productPath)
  assert(product.response.ok, `${productPath} returned ${product.response.status}`)
  const canonical = canonicalFromHtml(product.text)
  assert(canonical === `${origin}${productPath}`, `${productPath} canonical mismatch: ${canonical ?? 'missing'}`)
  assert(hasPageHeading(product.text), `${productPath} is missing a page-level h1`)
  evidence.checks.product = { path: productPath, status: product.response.status, canonical }
}

if (offerPath) {
  assert(offerPath.startsWith('/uit/'), 'WINKELNU_ACCEPTANCE_OFFER_PATH must target /uit/<offer-id>')
  const offer = await request(origin, offerPath, { redirect: 'manual', body: false })
  assert(offer.response.status === 302, `${offerPath} should return 302, received ${offer.response.status}`)
  const location = offer.response.headers.get('location')
  assert(location, `${offerPath} returned no Location header`)
  const destination = new URL(location, `${origin}/`)
  assert(destination.protocol === 'https:', `Affiliate destination must use HTTPS: ${destination.toString()}`)
  assert(destination.host !== expectedHost, `Affiliate redirect stayed on Winkelnu instead of leaving for a merchant: ${destination.toString()}`)
  if (expectedMerchantHost) {
    assert(destination.host === expectedMerchantHost, `Merchant host mismatch: expected ${expectedMerchantHost}, received ${destination.host}`)
  }
  evidence.checks.affiliateRedirect = {
    path: offerPath,
    status: offer.response.status,
    destinationHost: destination.host,
  }
}

console.log(JSON.stringify({ ok: true, ...evidence }, null, 2))

import dns from 'node:dns/promises'

function required(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function expect(condition, message) {
  if (!condition) throw new Error(message)
}

function originOf(value, name) {
  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${name} must be a valid absolute URL.`)
  }
  expect(url.pathname === '/' && !url.search && !url.hash, `${name} must be an origin without path, query or hash.`)
  return url.origin
}

async function request(url, options = {}) {
  return fetch(url, {
    redirect: 'manual',
    headers: { 'user-agent': 'WinkelnuLaunchAcceptance/1.0' },
    ...options,
  })
}

async function resolveHost(hostname) {
  const result = { hostname, a: [], aaaa: [], cname: [] }
  try { result.a = await dns.resolve4(hostname) } catch {}
  try { result.aaaa = await dns.resolve6(hostname) } catch {}
  try { result.cname = await dns.resolveCname(hostname) } catch {}
  expect(result.a.length + result.aaaa.length + result.cname.length > 0, `No DNS records resolved for ${hostname}.`)
  return result
}

const canonicalOrigin = originOf(required('WINKELNU_CUTOVER_ORIGIN'), 'WINKELNU_CUTOVER_ORIGIN')
const canonical = new URL(canonicalOrigin)
expect(canonical.protocol === 'https:', 'WINKELNU_CUTOVER_ORIGIN must use HTTPS.')
expect(canonical.hostname === 'winkelnu.nl', 'Canonical production host must be winkelnu.nl.')

const httpOrigin = `http://${canonical.hostname}`
const wwwOrigin = `https://www.${canonical.hostname}`
const expectedWwwMode = (process.env.WINKELNU_CUTOVER_WWW_MODE || 'redirect').trim()
expect(['redirect', 'unused'].includes(expectedWwwMode), 'WINKELNU_CUTOVER_WWW_MODE must be redirect or unused.')

const dnsEvidence = await resolveHost(canonical.hostname)

const httpsResponse = await fetch(`${canonicalOrigin}/`, {
  redirect: 'follow',
  headers: { 'user-agent': 'WinkelnuLaunchAcceptance/1.0' },
})
expect(httpsResponse.ok, `Canonical HTTPS homepage returned ${httpsResponse.status}.`)
expect(new URL(httpsResponse.url).origin === canonicalOrigin, 'Canonical HTTPS request escaped the accepted origin.')

const httpResponse = await request(`${httpOrigin}/`)
expect([301, 302, 307, 308].includes(httpResponse.status), `HTTP origin must redirect, received ${httpResponse.status}.`)
const httpLocation = httpResponse.headers.get('location')
expect(Boolean(httpLocation), 'HTTP redirect is missing a Location header.')
const httpDestination = new URL(httpLocation, httpOrigin)
expect(httpDestination.protocol === 'https:', 'HTTP redirect must upgrade to HTTPS.')
expect(httpDestination.hostname === canonical.hostname, 'HTTP redirect must target the canonical Winkelnu host.')

let wwwEvidence = { mode: expectedWwwMode, checked: false }
if (expectedWwwMode === 'redirect') {
  const wwwDns = await resolveHost(`www.${canonical.hostname}`)
  const wwwResponse = await request(`${wwwOrigin}/`)
  expect([301, 302, 307, 308].includes(wwwResponse.status), `www host must redirect, received ${wwwResponse.status}.`)
  const wwwLocation = wwwResponse.headers.get('location')
  expect(Boolean(wwwLocation), 'www redirect is missing a Location header.')
  const wwwDestination = new URL(wwwLocation, wwwOrigin)
  expect(wwwDestination.origin === canonicalOrigin, `www must redirect to ${canonicalOrigin}.`)
  wwwEvidence = {
    mode: expectedWwwMode,
    checked: true,
    status: wwwResponse.status,
    destination: wwwDestination.href,
    dns: wwwDns,
  }
}

const robotsResponse = await fetch(`${canonicalOrigin}/robots.txt`, { redirect: 'follow' })
expect(robotsResponse.ok, `robots.txt returned ${robotsResponse.status}.`)
const robots = await robotsResponse.text()
expect(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), 'robots.txt does not advertise the canonical production sitemap.')

const sitemapResponse = await fetch(`${canonicalOrigin}/sitemap.xml`, { redirect: 'follow' })
expect(sitemapResponse.ok, `sitemap.xml returned ${sitemapResponse.status}.`)
const sitemap = await sitemapResponse.text()
expect(sitemap.includes(`<loc>${canonicalOrigin}`), 'sitemap.xml does not contain canonical Winkelnu URLs.')

console.log(JSON.stringify({
  ok: true,
  checkedAt: new Date().toISOString(),
  canonicalOrigin,
  dns: dnsEvidence,
  https: {
    status: httpsResponse.status,
    finalUrl: httpsResponse.url,
  },
  httpRedirect: {
    status: httpResponse.status,
    location: httpDestination.href,
  },
  www: wwwEvidence,
  robots: { status: robotsResponse.status },
  sitemap: { status: sitemapResponse.status },
}, null, 2))

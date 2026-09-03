import { createProductionImportWorker } from '@/infrastructure/catalog/create-production-import-worker'
import { isAuthorizedImportTrigger } from '@/infrastructure/operations/import-trigger-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function requireSecret(): string {
  const value = process.env.CRON_SECRET ?? process.env.WINKELNU_IMPORT_TRIGGER_SECRET
  if (!value) throw new Error('Missing CRON_SECRET or WINKELNU_IMPORT_TRIGGER_SECRET.')
  return value
}

function parseLimit(request: Request): number | undefined {
  const raw = new URL(request.url).searchParams.get('limit')
  if (!raw) return undefined
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

async function handle(request: Request) {
  const secret = requireSecret()
  if (!isAuthorizedImportTrigger(request.headers.get('authorization'), secret)) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  }

  const correlationId = `catalog-import:${globalThis.crypto.randomUUID()}`
  const worker = createProductionImportWorker()
  const result = await worker.runBatch({
    owner: `ops:${correlationId}`,
    correlationId,
    limit: parseLimit(request),
  })

  return Response.json({ ok: true, correlationId, result }, { headers: { 'Cache-Control': 'no-store', 'X-Winkelnu-Correlation-Id': correlationId } })
}

export async function GET(request: Request) {
  return handle(request)
}

export async function POST(request: Request) {
  return handle(request)
}

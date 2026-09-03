import { createProductionImportWorker } from '@/infrastructure/catalog/create-production-import-worker'
import { isAuthorizedImportTrigger } from '@/infrastructure/operations/import-trigger-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function requireSecret(): string {
  const value = process.env.WINKELNU_IMPORT_TRIGGER_SECRET
  if (!value) throw new Error('Missing WINKELNU_IMPORT_TRIGGER_SECRET.')
  return value
}

function parseLimit(request: Request): number | undefined {
  const raw = new URL(request.url).searchParams.get('limit')
  if (!raw) return undefined
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

export async function POST(request: Request) {
  const secret = requireSecret()
  if (!isAuthorizedImportTrigger(request.headers.get('authorization'), secret)) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  }

  const worker = createProductionImportWorker()
  const result = await worker.runBatch({
    owner: `ops:${globalThis.crypto.randomUUID()}`,
    limit: parseLimit(request),
  })

  return Response.json({ ok: true, result }, { headers: { 'Cache-Control': 'no-store' } })
}

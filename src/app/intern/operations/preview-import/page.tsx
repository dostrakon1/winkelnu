import Link from 'next/link'

import { runBoundedPreviewFixtureImport } from './actions'
import { requireOperatorSession } from '@/infrastructure/operations/operator-session'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{
  ok?: string
  imported?: string
  rejected?: string
  reviews?: string
  status?: string
}>

export default async function PreviewImportPage({ searchParams }: { searchParams: SearchParams }) {
  const operator = await requireOperatorSession()
  const result = await searchParams

  if (process.env.NODE_ENV !== 'development') {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Preview fixture import niet beschikbaar</h1>
        <p className="mt-4 text-sm text-slate-400">Deze route is uitsluitend beschikbaar in lokale development mode.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Winkelnu Internal Operations</p>
          <h1 className="mt-3 text-3xl font-semibold">Bounded preview fixture import</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
            Voert één gecontroleerde preview-import uit met maximaal 2 pagina&apos;s en 4 records. De fixture bevat 3 geldige producten en 1 bewust ongeldig record.
          </p>
        </div>
        <Link href="/intern/operations" className="rounded-lg border border-slate-700 px-4 py-2 text-sm">Terug</Link>
      </div>

      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">Operator</dt><dd className="mt-1">{operator.email}</dd></div>
          <div><dt className="text-slate-500">Rol</dt><dd className="mt-1 capitalize">{operator.role}</dd></div>
          <div><dt className="text-slate-500">Merchant</dt><dd className="mt-1">Preview Fixture Shop</dd></div>
          <div><dt className="text-slate-500">Limiet</dt><dd className="mt-1">2 pagina&apos;s / 4 records</dd></div>
        </dl>

        <form action={runBoundedPreviewFixtureImport} className="mt-6">
          <button
            type="submit"
            disabled={operator.role !== 'owner'}
            className="rounded-lg border border-cyan-700 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start bounded preview import
          </button>
        </form>
      </section>

      {result.ok === '1' && (
        <section className="mt-6 rounded-2xl border border-emerald-900 bg-emerald-950/20 p-6">
          <h2 className="font-semibold">Import uitgevoerd</h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-4">
            <div><dt className="text-slate-500">Imported</dt><dd className="mt-1 text-xl font-semibold">{result.imported}</dd></div>
            <div><dt className="text-slate-500">Rejected</dt><dd className="mt-1 text-xl font-semibold">{result.rejected}</dd></div>
            <div><dt className="text-slate-500">Reviews</dt><dd className="mt-1 text-xl font-semibold">{result.reviews}</dd></div>
            <div><dt className="text-slate-500">Status</dt><dd className="mt-1 text-sm font-semibold">{result.status}</dd></div>
          </dl>
        </section>
      )}
    </main>
  )
}

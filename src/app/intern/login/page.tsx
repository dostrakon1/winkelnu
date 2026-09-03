import type { Metadata } from 'next'

import { signInOperator } from './actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Internal Login',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

type Props = {
  searchParams: Promise<{ error?: string }>
}

export default async function InternalLoginPage({ searchParams }: Props) {
  const { error } = await searchParams
  const message = error === 'missing-fields'
    ? 'Vul e-mailadres en wachtwoord in.'
    : error
      ? 'Inloggen is niet gelukt.'
      : undefined

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-16">
      <section className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Winkelnu Internal</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Operator login</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Alleen geautoriseerde Winkelnu-operators hebben toegang tot het operationele dashboard.
        </p>

        {message ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {message}
          </div>
        ) : null}

        <form action={signInOperator} className="mt-8 space-y-5">
          <label className="block text-sm font-medium">
            E-mailadres
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none focus:border-gray-500"
            />
          </label>
          <label className="block text-sm font-medium">
            Wachtwoord
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none focus:border-gray-500"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white"
          >
            Inloggen
          </button>
        </form>
      </section>
    </main>
  )
}

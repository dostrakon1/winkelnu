'use client'

import { useActionState } from 'react'

import type { RecoveryActionState } from '@/app/intern/operations/recovery-actions'

type RecoveryAction = (previous: RecoveryActionState, formData: FormData) => Promise<RecoveryActionState>

const initialState: RecoveryActionState = { status: 'idle' }

export function RecoveryActionForm({
  action,
  merchantId,
  sourceKey,
  requestKey,
  label,
  subtle = false,
  confirmMessage,
}: {
  action: RecoveryAction
  merchantId: string
  sourceKey: string
  requestKey: string
  label: string
  subtle?: boolean
  confirmMessage?: string
}) {
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <div className="min-w-0">
      <form
        action={formAction}
        onSubmit={(event) => {
          if (confirmMessage && !window.confirm(confirmMessage)) event.preventDefault()
        }}
      >
        <input type="hidden" name="merchantId" value={merchantId} />
        <input type="hidden" name="sourceKey" value={sourceKey} />
        <input type="hidden" name="requestKey" value={requestKey} />
        <button
          type="submit"
          disabled={pending}
          aria-disabled={pending}
          className={`rounded-lg border px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
            subtle
              ? 'border-slate-700 text-slate-300 hover:border-slate-500'
              : 'border-cyan-700 bg-cyan-950/50 text-cyan-200 hover:border-cyan-500'
          }`}
        >
          {pending ? 'Bezig…' : label}
        </button>
      </form>
      {state.status !== 'idle' && state.message ? (
        <p
          role="status"
          className={`mt-2 max-w-64 text-xs leading-5 ${state.status === 'error' ? 'text-red-300' : state.status === 'success' ? 'text-emerald-300' : 'text-amber-300'}`}
        >
          {state.message}
        </p>
      ) : null}
    </div>
  )
}

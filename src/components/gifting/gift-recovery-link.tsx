'use client'

import { useActionState, useState } from 'react'
import { createRecoveryLinkAction } from '@/app/lootje-lijstje/actions'

type GiftRecoveryLinkProps = {
  shareCode: string
}

export function GiftRecoveryLink({ shareCode }: GiftRecoveryLinkProps) {
  const [recoveryPath, formAction, pending] = useActionState(createRecoveryLinkAction, null)
  const [requested, setRequested] = useState(false)
  const [copied, setCopied] = useState(false)

  async function copyRecoveryLink() {
    if (!recoveryPath) return
    const url = new URL(recoveryPath, window.location.origin).toString()
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="rounded-[var(--wn-radius-lg)] border border-[var(--wn-border)] bg-[var(--wn-cream)] p-4 sm:p-5">
      <h3 className="wn-ui-heading text-base">Bewaar je beheer-toegang</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--wn-text-muted)]">
        Zonder account herkent Winkelnu deze browser met een beveiligde cookie. Maak daarnaast één herstel-link en bewaar die bijvoorbeeld in je eigen WhatsApp.
      </p>

      <form action={formAction} onSubmit={() => setRequested(true)} className="mt-4">
        <input type="hidden" name="shareCode" value={shareCode} />
        <button type="submit" disabled={pending} className="wn-button wn-button-secondary disabled:cursor-wait disabled:opacity-60">
          {pending ? 'Herstel-link maken…' : recoveryPath ? 'Maak een nieuwe herstel-link' : 'Maak mijn herstel-link'}
        </button>
      </form>

      {recoveryPath ? (
        <div className="mt-4 rounded-xl border border-[color:rgba(18,59,58,0.14)] bg-white p-4">
          <p className="text-sm font-semibold text-[var(--wn-petrol-deep)]">Herstel-link is klaar.</p>
          <p className="mt-1 text-xs leading-5 text-[var(--wn-text-muted)]">Een nieuwe herstel-link maakt de vorige ongeldig.</p>
          <button type="button" onClick={copyRecoveryLink} className="mt-3 text-sm font-bold text-[var(--wn-petrol)] hover:underline">
            {copied ? 'Herstel-link gekopieerd' : 'Kopieer herstel-link'}
          </button>
        </div>
      ) : requested && !pending ? (
        <p className="mt-3 text-sm font-semibold text-[#8b3025]">De herstel-link kon niet worden gemaakt. Vernieuw de pagina en probeer opnieuw.</p>
      ) : null}
    </div>
  )
}

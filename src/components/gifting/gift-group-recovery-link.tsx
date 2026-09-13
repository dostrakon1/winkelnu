'use client'

import { useActionState, useState } from 'react'
import {
  createGiftGroupOrganizerRecoveryLinkAction,
  createGiftGroupParticipantRecoveryLinkAction,
} from '@/app/lootje-lijstje/groep/actions'

type GiftGroupRecoveryLinkProps = {
  groupCode: string
  kind: 'organizer' | 'participant'
}

export function GiftGroupRecoveryLink({ groupCode, kind }: GiftGroupRecoveryLinkProps) {
  const action = kind === 'organizer'
    ? createGiftGroupOrganizerRecoveryLinkAction
    : createGiftGroupParticipantRecoveryLinkAction
  const [recoveryPath, formAction, pending] = useActionState(action, null)
  const [requested, setRequested] = useState(false)
  const [copied, setCopied] = useState(false)

  const organizer = kind === 'organizer'
  const title = organizer ? 'Bewaar je beheer-toegang' : 'Bewaar je deelnemers-toegang'
  const description = organizer
    ? 'Deze geheime link zet op een andere browser opnieuw alleen je organisatorrechten terug. Bewaar hem privé, bijvoorbeeld in je eigen WhatsApp.'
    : 'Deze geheime link zet op een andere browser opnieuw alleen jouw eigen deelnemerspagina en lijstje terug. Bewaar hem privé.'

  async function copyRecoveryLink() {
    if (!recoveryPath) return
    const url = new URL(recoveryPath, window.location.origin).toString()
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="rounded-[var(--wn-radius-lg)] border border-[var(--wn-border)] bg-[var(--wn-cream)] p-4 sm:p-5">
      <h3 className="wn-ui-heading text-base">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--wn-text-muted)]">{description}</p>

      <form action={formAction} onSubmit={() => setRequested(true)} className="mt-4">
        <input type="hidden" name="groupCode" value={groupCode} />
        <button type="submit" disabled={pending} className="wn-button wn-button-secondary disabled:cursor-wait disabled:opacity-60">
          {pending ? 'Herstel-link maken…' : recoveryPath ? 'Maak een nieuwe herstel-link' : 'Maak mijn herstel-link'}
        </button>
      </form>

      {recoveryPath ? (
        <div className="mt-4 rounded-xl border border-[color:rgba(18,59,58,0.14)] bg-white p-4">
          <p className="text-sm font-semibold text-[var(--wn-petrol-deep)]">Herstel-link is klaar.</p>
          <p className="mt-1 text-xs leading-5 text-[var(--wn-text-muted)]">
            Een nieuwe herstel-link voor dit recht maakt de vorige ongeldig. Deel deze link niet met anderen.
          </p>
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

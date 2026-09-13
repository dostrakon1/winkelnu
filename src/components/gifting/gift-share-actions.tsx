'use client'

import { useState } from 'react'

type GiftShareActionsProps = {
  sharePath: string
  title: string
}

function absoluteUrl(path: string): string {
  return new URL(path, window.location.origin).toString()
}

export function GiftShareActions({ sharePath, title }: GiftShareActionsProps) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    await navigator.clipboard.writeText(absoluteUrl(sharePath))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  function shareWhatsApp() {
    const text = `${title}\n${absoluteUrl(sharePath)}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button type="button" onClick={copyLink} className="wn-button wn-button-primary">
        {copied ? 'Link gekopieerd' : 'Kopieer lijstje-link'}
      </button>
      <button type="button" onClick={shareWhatsApp} className="wn-button wn-button-secondary">
        Deel via WhatsApp
      </button>
    </div>
  )
}

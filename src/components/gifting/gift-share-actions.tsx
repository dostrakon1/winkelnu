'use client'

import { useEffect, useState } from 'react'

type GiftShareActionsProps = {
  sharePath: string
  title: string
  copyLabel?: string
  whatsappLabel?: string
}

type ShareStatus = 'idle' | 'copied' | 'error'

function absoluteUrl(path: string): string {
  return new URL(path, window.location.origin).toString()
}

export function GiftShareActions({
  sharePath,
  title,
  copyLabel = 'Kopieer lijstje-link',
  whatsappLabel = 'Deel via WhatsApp',
}: GiftShareActionsProps) {
  const [status, setStatus] = useState<ShareStatus>('idle')
  const [nativeShareAvailable, setNativeShareAvailable] = useState(false)

  useEffect(() => {
    setNativeShareAvailable(typeof navigator.share === 'function')
  }, [])

  function resetStatusLater() {
    window.setTimeout(() => setStatus('idle'), 2200)
  }

  async function copyLink() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(absoluteUrl(sharePath))
      setStatus('copied')
      resetStatusLater()
    } catch {
      setStatus('error')
      resetStatusLater()
    }
  }

  async function shareNative() {
    if (!navigator.share) return

    try {
      await navigator.share({
        title: 'Lootje & Lijstje',
        text: title,
        url: absoluteUrl(sharePath),
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setStatus('error')
      resetStatusLater()
    }
  }

  function shareWhatsApp() {
    const text = `${title}\n\n${absoluteUrl(sharePath)}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={shareWhatsApp} className="wn-button wn-button-primary w-full justify-center sm:w-auto">
          {whatsappLabel}
        </button>
        {nativeShareAvailable ? (
          <button type="button" onClick={shareNative} className="wn-button wn-button-secondary w-full justify-center sm:w-auto">
            Delen…
          </button>
        ) : null}
        <button type="button" onClick={copyLink} className="wn-button wn-button-secondary w-full justify-center sm:w-auto">
          {status === 'copied' ? 'Link gekopieerd ✓' : copyLabel}
        </button>
      </div>
      <p className="mt-2 min-h-5 text-xs font-semibold text-[var(--gift-muted)]" aria-live="polite">
        {status === 'copied' ? 'De link staat op je klembord.' : status === 'error' ? 'Delen lukte niet. Probeer de link opnieuw te kopiëren.' : ''}
      </p>
    </div>
  )
}

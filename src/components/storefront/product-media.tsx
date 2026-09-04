'use client'

import { useEffect, useState } from 'react'

type ProductMediaProps = {
  src?: string | null
  alt: string
  variant?: 'card' | 'detail'
  className?: string
}

function safeImageUrl(value?: string | null): string | null {
  if (!value) return null

  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password) return null
    return url.toString()
  } catch {
    return null
  }
}

function ProductMediaFallback({ variant }: { variant: 'card' | 'detail' }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,#f4efe6_0%,#e7eee9_100%)] px-6 text-center text-[var(--wn-petrol)]">
      <svg viewBox="0 0 48 48" aria-hidden="true" className={variant === 'detail' ? 'h-16 w-16 opacity-70' : 'h-11 w-11 opacity-65'}>
        <path d="M12 16h24l-2 24H14L12 16Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M18 18v-4a6 6 0 0 1 12 0v4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className="max-w-44 text-xs font-semibold leading-5 text-[color:rgba(18,59,58,0.66)]">Productafbeelding niet beschikbaar</span>
    </div>
  )
}

export function ProductMedia({ src, alt, variant = 'card', className = '' }: ProductMediaProps) {
  const normalized = safeImageUrl(src)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [normalized])

  const sizeClass = variant === 'detail' ? 'min-h-80 sm:min-h-96' : 'aspect-[4/3] min-h-44'
  const classes = `relative overflow-hidden rounded-[var(--wn-radius-lg)] border border-[color:rgba(18,59,58,0.08)] bg-white ${sizeClass} ${className}`.trim()

  if (!normalized || failed) {
    return <div className={classes}><ProductMediaFallback variant={variant} /></div>
  }

  return (
    <div className={classes}>
      {/* Merchant feeds can use arbitrary HTTPS image hosts, so native img avoids a brittle host allowlist. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={normalized}
        alt={alt}
        loading={variant === 'card' ? 'lazy' : 'eager'}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-200 group-hover:scale-[1.025]"
      />
    </div>
  )
}

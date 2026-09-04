'use client'

import { useState } from 'react'

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
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[linear-gradient(145deg,#f8f3e9_0%,#e7eee9_100%)] px-6 text-center text-[var(--wn-petrol)]">
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[color:rgba(233,120,61,0.10)]" aria-hidden="true" />
      <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-[color:rgba(18,59,58,0.06)]" aria-hidden="true" />
      <div className={`relative inline-flex items-center justify-center rounded-[22px] bg-[var(--wn-petrol)] text-white shadow-[var(--wn-shadow-sm)] ${variant === 'detail' ? 'h-20 w-20' : 'h-14 w-14'}`}>
        <svg viewBox="0 0 40 40" aria-hidden="true" className={variant === 'detail' ? 'h-14 w-14' : 'h-10 w-10'} fill="none">
          <path d="M7 12.5 13.2 28 20 17.3 26.8 28 33 12.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[var(--wn-warm)] ring-2 ring-[var(--wn-petrol)]" />
      </div>
      <div className="relative">
        <span className="block text-sm font-extrabold tracking-[-0.02em] text-[var(--wn-petrol-deep)]">winkelnu</span>
        <span className="mt-1 block max-w-48 text-xs font-medium leading-5 text-[color:rgba(18,59,58,0.60)]">Productafbeelding niet beschikbaar</span>
      </div>
    </div>
  )
}

export function ProductMedia({ src, alt, variant = 'card', className = '' }: ProductMediaProps) {
  const normalized = safeImageUrl(src)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = Boolean(normalized && failedSrc === normalized)

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
        onError={() => setFailedSrc(normalized)}
        className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-200 group-hover:scale-[1.025]"
      />
    </div>
  )
}

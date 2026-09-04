import Link from 'next/link'

type WinkelnuBrandProps = {
  href?: string
  inverse?: boolean
  compact?: boolean
  className?: string
}

export function WinkelnuMark({ inverse = false, className = '' }: { inverse?: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border ${
        inverse
          ? 'border-white/18 bg-white/10 text-white'
          : 'border-[color:rgba(18,59,58,0.12)] bg-[var(--wn-petrol)] text-white shadow-[var(--wn-shadow-xs)]'
      } ${className}`.trim()}
    >
      <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none">
        <path
          d="M7 12.5 13.2 28 20 17.3 26.8 28 33 12.5"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="absolute right-[5px] top-[5px] h-2.5 w-2.5 rounded-full bg-[var(--wn-warm)] ring-2 ring-[var(--wn-petrol)]" />
    </span>
  )
}

export function WinkelnuBrand({ href = '/', inverse = false, compact = false, className = '' }: WinkelnuBrandProps) {
  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`.trim()}>
      <WinkelnuMark inverse={inverse} />
      {!compact ? (
        <span className="flex min-w-0 items-baseline gap-0.5 leading-none">
          <span className={`text-[1.05rem] font-extrabold tracking-[-0.035em] ${inverse ? 'text-white' : 'text-[var(--wn-petrol-deep)]'}`}>
            winkelnu
          </span>
          <span className={`text-[0.68rem] font-bold ${inverse ? 'text-white/56' : 'text-[var(--wn-warm)]'}`}>.nl</span>
        </span>
      ) : null}
    </span>
  )

  if (!href) return content

  return (
    <Link
      href={href}
      aria-label="Winkelnu.nl home"
      className="inline-flex rounded-[var(--wn-radius-md)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]"
    >
      {content}
    </Link>
  )
}

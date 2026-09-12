import Link from 'next/link'

type WinkelnuBrandProps = {
  href?: string
  inverse?: boolean
  compact?: boolean
  size?: 'default' | 'header'
  className?: string
}

export function WinkelnuMark({
  inverse = false,
  size = 'default',
  className = '',
}: {
  inverse?: boolean
  size?: 'default' | 'header'
  className?: string
}) {
  const markSize = size === 'header' ? 'h-11 w-11 rounded-[15px]' : 'h-10 w-10 rounded-[14px]'
  const iconSize = size === 'header' ? 'h-8 w-8' : 'h-7 w-7'

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden border ${markSize} ${
        inverse
          ? 'border-white/18 bg-white/10 text-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
          : 'border-[color:rgba(18,59,58,0.12)] bg-[var(--wn-petrol)] text-white shadow-[var(--wn-shadow-xs)]'
      } ${className}`.trim()}
    >
      <svg viewBox="0 0 40 40" className={iconSize} fill="none">
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

export function WinkelnuBrand({
  href = '/',
  inverse = false,
  compact = false,
  size = 'default',
  className = '',
}: WinkelnuBrandProps) {
  const content = (
    <span className={`inline-flex items-center ${size === 'header' ? 'gap-3.5' : 'gap-3'} ${className}`.trim()}>
      <WinkelnuMark inverse={inverse} size={size} />
      {!compact ? (
        <span className="flex min-w-0 items-baseline gap-0.5 leading-none">
          <span
            className={`${size === 'header' ? 'text-[1.2rem]' : 'text-[1.05rem]'} font-extrabold tracking-[-0.04em] ${
              inverse ? 'text-white' : 'text-[var(--wn-petrol-deep)]'
            }`}
          >
            winkelnu
          </span>
          <span
            className={`${size === 'header' ? 'text-[0.72rem]' : 'text-[0.68rem]'} font-bold ${
              inverse ? 'text-white/56' : 'text-[var(--wn-warm)]'
            }`}
          >
            .nl
          </span>
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

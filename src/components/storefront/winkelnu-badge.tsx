import type { ReactNode } from 'react'

type WinkelnuBadgeVariant = 'success' | 'warning' | 'danger' | 'neutral'

type WinkelnuBadgeProps = {
  children: ReactNode
  variant?: WinkelnuBadgeVariant
  className?: string
}

const variantClass: Record<WinkelnuBadgeVariant, string> = {
  success: 'wn-badge-success',
  warning: 'wn-badge-warning',
  danger: 'wn-badge-danger',
  neutral: 'bg-[var(--wn-petrol-soft)] text-[var(--wn-petrol)]',
}

export function WinkelnuBadge({
  children,
  variant = 'neutral',
  className = '',
}: WinkelnuBadgeProps) {
  return (
    <span className={`wn-badge ${variantClass[variant]} ${className}`.trim()}>
      {children}
    </span>
  )
}

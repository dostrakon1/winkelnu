import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type WinkelnuButtonVariant = 'primary' | 'secondary' | 'warm'

type WinkelnuButtonProps = {
  children: ReactNode
  variant?: WinkelnuButtonVariant
  href?: string
  className?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  rel?: string
}

const variantClass: Record<WinkelnuButtonVariant, string> = {
  primary: 'wn-button-primary',
  secondary: 'wn-button-secondary',
  warm: 'wn-button-warm',
}

export function WinkelnuButton({
  children,
  variant = 'primary',
  href,
  className = '',
  type = 'button',
  rel,
}: WinkelnuButtonProps) {
  const classes = `wn-button ${variantClass[variant]} ${className}`.trim()

  if (href) {
    return (
      <Link href={href} className={classes} rel={rel}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  )
}

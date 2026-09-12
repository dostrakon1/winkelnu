'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type WinkelnuNavSection = 'products' | 'compare' | 'guides' | 'categories'

type WinkelnuNavLinkProps = {
  href: string
  label: string
  section: WinkelnuNavSection
  mobile?: boolean
}

function isSectionActive(pathname: string, section: WinkelnuNavSection): boolean {
  switch (section) {
    case 'products':
      return pathname === '/zoeken' || pathname.startsWith('/product/') || pathname.startsWith('/categorie/')
    case 'compare':
      return pathname === '/vergelijken' || pathname.startsWith('/vergelijken/')
    case 'guides':
      return pathname === '/koopgidsen' || (pathname.startsWith('/koopgidsen/') && !pathname.startsWith('/koopgidsen/categorie/'))
    case 'categories':
      return pathname.startsWith('/koopgidsen/categorie/') || pathname.startsWith('/collecties/')
    default:
      return false
  }
}

export function WinkelnuNavLink({ href, label, section, mobile = false }: WinkelnuNavLinkProps) {
  const pathname = usePathname()
  const active = isSectionActive(pathname, section)

  if (mobile) {
    return (
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`flex min-h-12 items-center justify-between rounded-xl px-3 text-sm font-semibold transition ${
          active
            ? 'bg-white text-[var(--wn-petrol-deep)] shadow-[var(--wn-shadow-xs)]'
            : 'text-[var(--wn-ink)] hover:bg-white'
        }`}
      >
        <span>{label}</span>
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full bg-[var(--wn-warm)] transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}
        />
      </Link>
    )
  }

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`relative flex min-h-12 items-center px-0.5 text-sm font-semibold transition-colors ${
        active ? 'text-white' : 'text-white/72 hover:text-white'
      }`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 mx-auto h-0.5 w-6 rounded-full bg-[var(--wn-warm)] transition-opacity ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </Link>
  )
}

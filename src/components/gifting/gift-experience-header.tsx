'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function GiftMark() {
  return (
    <span className="gift-shell-mark" aria-hidden="true">
      <span>W</span>
      <span className="gift-shell-mark-dot" />
    </span>
  )
}

function routeState(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const groupIndex = segments.indexOf('groep')
  const groupCode = groupIndex >= 0 && segments[groupIndex + 1] && segments[groupIndex + 1] !== 'nieuw'
    ? segments[groupIndex + 1]
    : undefined

  return {
    groupCode,
    onLanding: pathname === '/lootje-lijstje',
    onList: pathname.startsWith('/lootje-lijstje/lijstje'),
    onGroup: pathname.startsWith('/lootje-lijstje/groep'),
  }
}

export function GiftExperienceHeader() {
  const pathname = usePathname()
  const state = routeState(pathname)
  const groupHref = state.groupCode
    ? `/lootje-lijstje/groep/${encodeURIComponent(state.groupCode)}/mijn`
    : '/lootje-lijstje/groep/nieuw'

  return (
    <header className="gift-shell-header">
      <a href="#inhoud" className="gift-shell-skip">Direct naar inhoud</a>
      <div className="gift-shell-container">
        <Link href="/lootje-lijstje" className="gift-shell-brand" aria-label="Lootje & Lijstje startpagina">
          <GiftMark />
          <span className="gift-shell-brand-copy">
            <strong>Lootje &amp; Lijstje</strong>
            <span>van Winkelnu</span>
          </span>
        </Link>

        <nav className="gift-shell-nav" aria-label="Lootje & Lijstje navigatie">
          <Link href="/lootje-lijstje" aria-current={state.onLanding ? 'page' : undefined}>Start</Link>
          <Link href="/lootje-lijstje/lijstje/nieuw" aria-current={state.onList ? 'page' : undefined}>Lijstje</Link>
          <Link href={groupHref} aria-current={state.onGroup ? 'page' : undefined}>
            {state.groupCode ? 'Mijn groep' : 'Groep'}
          </Link>
        </nav>

        <Link href="/" className="gift-shell-exit">
          <span className="gift-shell-exit-long">Naar Winkelnu</span>
          <span className="gift-shell-exit-short">Winkelnu</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  )
}

import Link from 'next/link'

export function WinkelnuHeader() {
  return (
    <header className="bg-[image:var(--wn-gradient-market)] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="text-sm font-bold uppercase tracking-[0.24em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]">
          Winkelnu.nl
        </Link>
        <p className="hidden text-sm text-white/72 sm:block">Ontdek. Vergelijk. Kies je winkel.</p>
      </div>
    </header>
  )
}

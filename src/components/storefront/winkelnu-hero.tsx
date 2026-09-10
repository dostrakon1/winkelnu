import Image from 'next/image'
import type { ReactNode } from 'react'

type WinkelnuHeroProps = {
  imageSrc: string
  children: ReactNode
  aside?: ReactNode
  priority?: boolean
}

export function WinkelnuHero({ imageSrc, children, aside, priority = false }: WinkelnuHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        aria-hidden="true"
        className="pointer-events-none object-cover object-[68%_center] opacity-[0.52] sm:opacity-[0.66] lg:opacity-[0.82]"
      />

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, rgba(250,247,240,0.99) 0%, rgba(247,242,232,0.95) 34%, rgba(231,240,235,0.74) 57%, rgba(18,59,58,0.08) 100%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[image:var(--wn-gradient-glow)]" aria-hidden="true" />

      <div className="wn-container relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_21rem] lg:py-24">
        <div className="max-w-3xl">{children}</div>
        {aside ? <div className="relative">{aside}</div> : null}
      </div>
    </section>
  )
}

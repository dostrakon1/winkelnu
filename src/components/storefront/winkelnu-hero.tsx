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
    <section className="wn-home-hero relative isolate overflow-hidden border-b border-[var(--wn-border)] bg-[var(--wn-cream)]">
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        aria-hidden="true"
        className="pointer-events-none object-cover object-[70%_center] opacity-[0.62] sm:opacity-[0.76] lg:opacity-[0.9]"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,242,0.995)_0%,rgba(247,242,232,0.97)_34%,rgba(247,242,232,0.8)_53%,rgba(247,242,232,0.28)_72%,rgba(13,46,45,0.12)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_22%,rgba(233,120,61,0.22)_0%,rgba(233,120,61,0.08)_22%,rgba(233,120,61,0)_48%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,rgba(247,242,232,0)_0%,rgba(247,242,232,0.72)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full border border-white/30 bg-white/10 backdrop-blur-[1px]"
        aria-hidden="true"
      />

      <div className="wn-container relative grid min-h-[620px] items-center gap-10 py-16 sm:min-h-[660px] sm:py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14 lg:py-24 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="max-w-[46rem]">{children}</div>
        {aside ? <div className="wn-hero-aside relative lg:translate-x-2 xl:translate-x-6">{aside}</div> : null}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-[linear-gradient(90deg,var(--wn-petrol-deep)_0%,var(--wn-petrol)_42%,var(--wn-warm)_72%,rgba(233,120,61,0)_100%)]"
        aria-hidden="true"
      />

      <style>{`
        .wn-home-hero h1.wn-heading {
          font-family: var(--wn-font-display);
          font-weight: 600;
          letter-spacing: -0.045em;
          line-height: 0.98;
          color: var(--wn-petrol-deep);
          text-wrap: balance;
        }

        .wn-home-hero > .wn-container > div:first-child > .wn-eyebrow {
          display: inline-flex;
          align-items: center;
          min-height: 2rem;
          padding: 0.35rem 0.75rem;
          border: 1px solid rgba(18, 59, 58, 0.13);
          border-radius: 9999px;
          background: rgba(255, 250, 242, 0.72);
          box-shadow: 0 8px 24px rgba(18, 59, 58, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .wn-home-hero .wn-button-primary {
          box-shadow: 0 12px 28px rgba(13, 46, 45, 0.17);
        }

        .wn-home-hero .wn-button-secondary {
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .wn-home-hero .wn-hero-aside .wn-surface {
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, rgba(8, 36, 35, 0.96), rgba(18, 59, 58, 0.92)) !important;
          border-color: rgba(255, 255, 255, 0.18) !important;
          color: #fffaf2 !important;
          box-shadow: 0 28px 65px rgba(8, 36, 35, 0.24) !important;
          backdrop-filter: blur(18px) saturate(1.08) !important;
          -webkit-backdrop-filter: blur(18px) saturate(1.08) !important;
        }

        .wn-home-hero .wn-hero-aside .wn-surface::before {
          content: '';
          position: absolute;
          width: 10rem;
          height: 10rem;
          right: -4rem;
          top: -4rem;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(233, 120, 61, 0.28), rgba(233, 120, 61, 0));
          pointer-events: none;
        }

        .wn-home-hero .wn-hero-aside .wn-eyebrow {
          color: #f4a06d !important;
        }

        .wn-home-hero .wn-hero-aside .wn-ui-heading {
          color: #fffaf2 !important;
        }

        .wn-home-hero .wn-hero-aside .wn-body-muted {
          color: rgba(255, 250, 242, 0.68) !important;
        }

        .wn-home-hero .wn-hero-aside span {
          border: 1px solid rgba(244, 160, 109, 0.34);
          background: rgba(233, 120, 61, 0.14) !important;
          color: #ffc39d !important;
        }

        @media (max-width: 1023px) {
          .wn-home-hero .wn-hero-aside {
            max-width: 36rem;
          }
        }
      `}</style>
    </section>
  )
}

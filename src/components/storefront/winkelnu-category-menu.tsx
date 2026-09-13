'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { getCategoryImage } from '@/content/category-images'
import { SeasonalCampaignMenuTile } from './seasonal-campaign-layer'

const menuCategories = [
  { slug: 'elektronica', title: 'Elektronica' },
  { slug: 'wonen-huishouden', title: 'Wonen & huishouden' },
  { slug: 'keuken-koffie', title: 'Keuken & koffie' },
  { slug: 'persoonlijke-verzorging', title: 'Persoonlijke verzorging' },
  { slug: 'huis-tuin-klussen', title: 'Huis, tuin & klussen' },
  { slug: 'sport-outdoor', title: 'Sport & outdoor' },
  { slug: 'speelgoed-hobby', title: 'Speelgoed & hobby' },
  { slug: 'baby-kind', title: 'Baby & kind' },
  { slug: 'dieren', title: 'Dieren' },
  { slug: 'auto-fiets', title: 'Auto & fiets' },
  { slug: 'mode-accessoires', title: 'Mode & accessoires' },
  { slug: 'kantoor-studie', title: 'Kantoor & studie' },
  { slug: 'reizen-bagage', title: 'Reizen & bagage' },
] as const

const featuredCategories = [
  {
    slug: 'elektronica',
    title: 'Elektronica',
    caption: 'Werk, audio & slimme apparaten',
  },
  {
    slug: 'wonen-huishouden',
    title: 'Wonen & huishouden',
    caption: 'Slimmer kiezen voor thuis',
  },
] as const

function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path d="M4.5 10h10M11 6.5 14.5 10 11 13.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FeaturedCategoryTile({
  slug,
  title,
  caption,
  onNavigate,
}: {
  slug: string
  title: string
  caption: string
  onNavigate: () => void
}) {
  const image = getCategoryImage(slug, title)

  return (
    <Link
      href={`/koopgidsen/categorie/${slug}`}
      onClick={onNavigate}
      className="group/tile relative min-h-32 overflow-hidden rounded-[1.15rem] border border-white/60 bg-[var(--wn-petrol-soft)] shadow-[var(--wn-shadow-xs)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]"
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 1279px) 20vw, 230px"
          className="object-cover transition-transform duration-300 group-hover/tile:scale-[1.035] motion-reduce:transform-none"
          style={{ objectPosition: image.position }}
        />
      ) : null}
      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,46,45,0.03)_15%,rgba(13,46,45,0.92)_100%)]" />
      <span className="absolute inset-x-0 bottom-0 p-4 text-white">
        <span className="block text-sm font-bold">{title}</span>
        <span className="mt-1 block text-[11px] leading-4 text-white/72">{caption}</span>
      </span>
    </Link>
  )
}

function GiftsTile({ onNavigate }: { onNavigate: () => void }) {
  const image = getCategoryImage('cadeaus-feest', 'Cadeaus & feest')

  return (
    <Link
      href="/collecties/cadeaus-feest"
      onClick={onNavigate}
      className="group/gifts relative col-span-2 min-h-36 overflow-hidden rounded-[1.25rem] border border-[rgba(233,120,61,0.32)] bg-[var(--wn-petrol-deep)] shadow-[var(--wn-shadow-sm)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]"
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 1279px) 40vw, 470px"
          className="object-cover transition-transform duration-300 group-hover/gifts:scale-[1.025] motion-reduce:transform-none"
          style={{ objectPosition: image.position }}
        />
      ) : null}
      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,46,45,0.96)_0%,rgba(13,46,45,0.77)_42%,rgba(13,46,45,0.16)_100%)]" />
      <span className="absolute inset-y-0 left-0 flex max-w-[65%] flex-col justify-center p-5 text-[var(--wn-cream)]">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffb889]">✦ Uitgelichte collectie</span>
        <span className="wn-display mt-2 text-2xl font-semibold leading-none">Cadeaus & feest</span>
        <span className="mt-2 text-xs leading-5 text-[#f4e7d8]/75">Feestelijke inspiratie voor ieder moment.</span>
      </span>
    </Link>
  )
}

export function WinkelnuCategoryMenu({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname()
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const active = pathname.startsWith('/koopgidsen/categorie/') || pathname.startsWith('/collecties/')

  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false
  }, [pathname])

  const closeMenu = () => {
    if (detailsRef.current) detailsRef.current.open = false
  }

  if (mobile) {
    return (
      <details ref={detailsRef} className="group rounded-xl">
        <summary
          className={`flex min-h-12 cursor-pointer list-none items-center justify-between rounded-xl px-3 text-sm font-semibold transition marker:content-none ${
            active
              ? 'bg-white text-[var(--wn-petrol-deep)] shadow-[var(--wn-shadow-xs)]'
              : 'text-[var(--wn-ink)] hover:bg-white'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <span>Categorieën</span>
            <span aria-hidden="true" className={`h-2 w-2 rounded-full bg-[var(--wn-warm)] ${active ? 'opacity-100' : 'opacity-0'}`} />
          </span>
          <ChevronIcon className="h-4 w-4 text-[var(--wn-text-muted)] transition-transform duration-200 group-open:rotate-180" />
        </summary>

        <div className="mx-1 mt-2 rounded-xl border border-[var(--wn-border)] bg-white/70 p-2">
          <div className="grid grid-cols-2 gap-1">
            {menuCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/koopgidsen/categorie/${category.slug}`}
                onClick={closeMenu}
                className="flex min-h-11 items-center rounded-lg px-2.5 text-[12px] font-semibold leading-4 text-[var(--wn-petrol-deep)] transition hover:bg-[var(--wn-petrol-soft)]"
              >
                {category.title}
              </Link>
            ))}
          </div>
          <SeasonalCampaignMenuTile mobile onNavigate={closeMenu} />
          <Link
            href="/collecties/cadeaus-feest"
            onClick={closeMenu}
            className="mt-2 flex min-h-12 items-center justify-between rounded-xl bg-[image:var(--wn-gradient-market)] px-3.5 text-sm font-bold text-white"
          >
            <span className="text-[#fffaf2]">✦ Cadeaus & feest</span>
            <ArrowIcon className="h-4 w-4 text-[#ffb889]" />
          </Link>
        </div>
      </details>
    )
  }

  return (
    <details ref={detailsRef} className="group static">
      <summary
        className={`relative flex min-h-12 cursor-pointer list-none items-center gap-1.5 px-0.5 text-sm font-semibold transition-colors marker:content-none ${
          active ? 'text-white' : 'text-white/72 hover:text-white'
        }`}
      >
        <span>Categorieën</span>
        <ChevronIcon className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 mx-auto h-0.5 w-6 rounded-full bg-[var(--wn-warm)] transition-opacity ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </summary>

      <div className="absolute inset-x-0 top-[calc(100%+0.875rem)] z-[70] overflow-hidden rounded-b-[1.75rem] rounded-t-[1.35rem] border border-[rgba(18,59,58,0.14)] bg-[rgba(255,250,242,0.99)] text-[var(--wn-ink)] shadow-[0_28px_70px_rgba(7,20,20,0.24)] backdrop-blur-xl">
        <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
          <div className="p-6 xl:p-7">
            <div className="flex items-end justify-between gap-4 border-b border-[var(--wn-border)] pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--wn-warm)]">Ontdek Winkelnu</p>
                <h2 className="wn-display mt-1.5 text-2xl font-semibold tracking-[-0.025em] text-[var(--wn-petrol-deep)]">
                  Kies een categorie
                </h2>
              </div>
              <Link
                href="/#categorieen"
                onClick={closeMenu}
                className="hidden min-h-10 items-center gap-1 text-xs font-bold text-[var(--wn-petrol)] hover:underline xl:inline-flex"
              >
                Alle categorieën
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-1">
              {menuCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/koopgidsen/categorie/${category.slug}`}
                  onClick={closeMenu}
                  className="group/link flex min-h-12 items-center justify-between gap-2 rounded-xl px-3 text-[13px] font-semibold leading-4 text-[var(--wn-petrol-deep)] transition hover:bg-white hover:shadow-[var(--wn-shadow-xs)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--wn-warm)]"
                >
                  <span>{category.title}</span>
                  <ArrowIcon className="h-4 w-4 shrink-0 text-[var(--wn-warm)] opacity-0 transition group-hover/link:translate-x-0.5 group-hover/link:opacity-100 group-focus-visible/link:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          <aside className="border-l border-[var(--wn-border)] bg-[image:var(--wn-gradient-brand-sage)] p-5 xl:p-6" aria-label="Uitgelichte categorieën">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--wn-petrol)]">Visueel ontdekken</p>
              <span className="text-[10px] font-medium text-[var(--wn-text-muted)]">Uitgelicht</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <SeasonalCampaignMenuTile onNavigate={closeMenu} />
              {featuredCategories.map((category) => (
                <FeaturedCategoryTile key={category.slug} {...category} onNavigate={closeMenu} />
              ))}
              <GiftsTile onNavigate={closeMenu} />
            </div>
          </aside>
        </div>
      </div>
    </details>
  )
}
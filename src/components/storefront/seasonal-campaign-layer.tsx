'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { getCategoryImage } from '@/content/category-images'
import { getActivePromotionalCampaign, getPromotionalCampaignBySlug, type PromotionalCampaign } from '@/content/promotional-campaigns'

function subscribeToCampaignClock(callback: () => void) {
  const interval = window.setInterval(callback, 60 * 60 * 1000)
  return () => window.clearInterval(interval)
}

function getCampaignSnapshot() {
  return getActivePromotionalCampaign()?.slug ?? ''
}

function getServerCampaignSnapshot() {
  return ''
}

function useActiveSeasonalCampaign(): PromotionalCampaign | undefined {
  const slug = useSyncExternalStore(subscribeToCampaignClock, getCampaignSnapshot, getServerCampaignSnapshot)
  return slug ? getPromotionalCampaignBySlug(slug) : undefined
}

function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path d="M4.5 10h10M11 6.5 14.5 10 11 13.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SeasonalCampaignBar() {
  const campaign = useActiveSeasonalCampaign()
  if (!campaign) return null

  return (
    <Link
      href={campaign.href}
      className="group block border-b border-white/10 text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
      style={{ background: campaign.heroGradient }}
    >
      <span className="wn-container flex min-h-9 items-center justify-center gap-2 py-1.5 text-center text-[11px] font-bold tracking-[0.02em] sm:text-xs">
        <span aria-hidden="true" style={{ color: campaign.accentSoft }}>✦</span>
        <span>{campaign.bannerLabel}</span>
        <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

export function SeasonalCampaignSpotlight() {
  const campaign = useActiveSeasonalCampaign()
  if (!campaign) return null

  const image = getCategoryImage(campaign.imageSlug, campaign.imageLabel)

  return (
    <section className="wn-container pt-8 sm:pt-10" aria-label={`${campaign.name} bij Winkelnu`}>
      <article
        className="relative overflow-hidden rounded-[2rem] border border-white/20 text-white shadow-[var(--wn-shadow-md)]"
        style={{ background: campaign.heroGradient }}
      >
        <span aria-hidden="true" className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10" />
        <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
          <div className="relative z-10 flex flex-col justify-center px-7 py-9 sm:px-10 sm:py-11 lg:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: campaign.accentSoft }}>{campaign.eyebrow}</p>
            <h2 className="wn-display mt-4 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#fffaf2] sm:text-5xl">
              {campaign.title}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">{campaign.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {campaign.chips.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="inline-flex min-h-10 items-center rounded-full border border-white/18 bg-white/10 px-3.5 text-xs font-semibold text-white transition hover:border-white/35 hover:bg-white/15"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
            <Link
              href={campaign.href}
              className="mt-7 inline-flex min-h-12 items-center self-start rounded-full px-5 font-bold text-[var(--wn-petrol-deep)] shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 motion-reduce:transform-none"
              style={{ backgroundColor: campaign.accentSoft }}
            >
              {campaign.ctaLabel}
            </Link>
          </div>

          <Link href={campaign.href} className="group relative min-h-64 overflow-hidden lg:min-h-[25rem]" aria-label={campaign.ctaLabel}>
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 42vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
                style={{ objectPosition: image.position }}
              />
            ) : null}
            <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,46,45,0.42)_0%,rgba(13,46,45,0.05)_70%)]" />
          </Link>
        </div>
      </article>
    </section>
  )
}

export function SeasonalCampaignMenuTile({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const campaign = useActiveSeasonalCampaign()
  if (!campaign) return null

  if (mobile) {
    return (
      <Link
        href={campaign.href}
        onClick={onNavigate}
        className="mt-2 flex min-h-12 items-center justify-between rounded-xl px-3.5 text-sm font-bold text-white"
        style={{ background: campaign.heroGradient }}
      >
        <span>{campaign.eyebrow.replace('✦ ', '')}: {campaign.name}</span>
        <ArrowIcon className="h-4 w-4 text-[#ffd7bd]" />
      </Link>
    )
  }

  const image = getCategoryImage(campaign.imageSlug, campaign.imageLabel)

  return (
    <Link
      href={campaign.href}
      onClick={onNavigate}
      className="group/season relative col-span-2 min-h-28 overflow-hidden rounded-[1.2rem] border border-white/60 shadow-[var(--wn-shadow-xs)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--wn-warm)]"
      style={{ background: campaign.heroGradient }}
    >
      {image ? (
        <Image
          src={image.src}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 1279px) 40vw, 470px"
          className="object-cover opacity-40 transition-transform duration-300 group-hover/season:scale-[1.025] motion-reduce:transform-none"
          style={{ objectPosition: image.position }}
        />
      ) : null}
      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,46,45,0.94)_0%,rgba(13,46,45,0.58)_58%,rgba(13,46,45,0.24)_100%)]" />
      <span className="absolute inset-0 flex items-center justify-between gap-4 p-4 text-white">
        <span>
          <span className="block text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: campaign.accentSoft }}>{campaign.eyebrow}</span>
          <span className="wn-display mt-1.5 block text-xl font-semibold leading-none">{campaign.name}</span>
          <span className="mt-1.5 block text-[11px] text-white/72">Tijdelijke Winkelnu-selectie</span>
        </span>
        <ArrowIcon className="h-5 w-5 shrink-0 transition-transform group-hover/season:translate-x-0.5" />
      </span>
    </Link>
  )
}
